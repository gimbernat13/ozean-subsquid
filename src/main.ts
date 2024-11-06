import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transfer, UserReward, RewardHistory} from './model'
import {processor} from './processor'
import {events} from './abi/cpool'
import {In} from 'typeorm'

// Define tier thresholds and multipliers
const TIERS = {
    BRONZE: {
        threshold: 0,
        multiplier: 1.0,
        name: 'BRONZE'
    },
    SILVER: {
        threshold: 50,
        multiplier: 1.5,
        name: 'SILVER'
    },
    GOLD: {
        threshold: 100,
        multiplier: 2.0,
        name: 'GOLD'
    },
    PLATINUM: {
        threshold: 200,
        multiplier: 3.0,
        name: 'PLATINUM'
    }
} as const

function calculateTier(transactionCount: number) {
    if (transactionCount >= TIERS.PLATINUM.threshold) return TIERS.PLATINUM
    if (transactionCount >= TIERS.GOLD.threshold) return TIERS.GOLD
    if (transactionCount >= TIERS.SILVER.threshold) return TIERS.SILVER
    return TIERS.BRONZE
}

function calculateReward(amount: bigint, tier: typeof TIERS[keyof typeof TIERS]): bigint {
    return amount * BigInt(Math.floor(tier.multiplier * 5)) / 100n // Base 5% reward * tier multiplier
}

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const transfers: Transfer[] = []
    const userRewardsMap = new Map<string, UserReward>()
    const rewardHistories: RewardHistory[] = []
    
    // Load existing user rewards
    const users = new Set<string>()
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            const { from, to } = events.Transfer.decode(log)
            users.add(to)
        }
    }
    
    const existingRewards = await ctx.store.findBy(UserReward, {
        user: In([...users])
    })
    
    for (const reward of existingRewards) {
        userRewardsMap.set(reward.user, reward)
    }
    
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            const { from, to, amount } = events.Transfer.decode(log)
            
            // Get or create user reward
            let userReward = userRewardsMap.get(to)
            if (!userReward) {
                userReward = new UserReward({
                    id: to,
                    user: to,
                    totalReward: 0n,
                    lastUpdateBlock: block.header.height,
                    lastUpdateTimestamp: BigInt(block.header.timestamp),
                    transactionCount: 0,
                    currentTier: TIERS.BRONZE.name
                })
            }
            
            // Update transaction count and tier
            userReward.transactionCount += 1
            const tier = calculateTier(userReward.transactionCount)
            userReward.currentTier = tier.name
            
            // Calculate reward with tier multiplier
            const reward = calculateReward(amount, tier)
            
            const transfer = new Transfer({
                id: log.id,
                block: block.header.height,
                from,
                to,
                value: amount,
                txHash: log.transactionHash,
                reward
            })
            transfers.push(transfer)
            
            // Update user rewards
            userReward.totalReward += reward
            userReward.lastUpdateBlock = block.header.height
            userReward.lastUpdateTimestamp = BigInt(block.header.timestamp)
            
            userRewardsMap.set(to, userReward)
            
            // Create reward history entry
            const rewardHistory = new RewardHistory({
                id: `${log.id}-reward`,
                userReward,
                amount: reward,
                block: block.header.height,
                timestamp: BigInt(block.header.timestamp),
                transfer,
                tierAtTime: tier.name,
                multiplier: tier.multiplier
            })
            rewardHistories.push(rewardHistory)
        }
    }

    await ctx.store.save([...userRewardsMap.values()])
    await ctx.store.insert(transfers)
    await ctx.store.insert(rewardHistories)
})
