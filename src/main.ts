import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transfer, UserReward, RewardHistory} from './model'
import {processor} from './processor'
import {events} from './abi/cpool'
import {In} from 'typeorm'

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
            const reward = calculateReward(amount)
            
            // Create transfer entity
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
            const userReward = updateUserReward(
                userRewardsMap, 
                to, 
                reward, 
                block.header
            )
            
            // Create reward history entry
            const rewardHistory = new RewardHistory({
                id: `${log.id}-reward`,
                userReward,
                amount: reward,
                block: block.header.height,
                timestamp: BigInt(block.header.timestamp),
                transfer
            })
            rewardHistories.push(rewardHistory)
        }
    }

    // Save everything
    await ctx.store.save([...userRewardsMap.values()])
    await ctx.store.insert(transfers)
    await ctx.store.insert(rewardHistories)
})

function calculateReward(amount: bigint): bigint {
    return amount * 5n / 100n // 5% reward
}

function updateUserReward(
    rewardsMap: Map<string, UserReward>, 
    user: string, 
    newReward: bigint,
    block: {height: number, timestamp: number}
): UserReward {
    let userReward = rewardsMap.get(user)
    
    if (!userReward) {
        userReward = new UserReward({
            id: user,
            user: user,
            totalReward: 0n,
            lastUpdateBlock: block.height,
            lastUpdateTimestamp: BigInt(block.timestamp)
        })
    }
    
    userReward.totalReward += newReward
    userReward.lastUpdateBlock = block.height
    userReward.lastUpdateTimestamp = BigInt(block.timestamp)
    
    rewardsMap.set(user, userReward)
    return userReward
}
