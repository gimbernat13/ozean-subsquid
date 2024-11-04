import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transfer, UserReward} from './model'
import {processor} from './processor'
import {events} from './abi/cpool'
import { In } from 'typeorm'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const transfers: Transfer[] = []
    const userRewardsMap = new Map<string, UserReward>()
    
    // Load existing user rewards
    const users = new Set<string>()
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            const { from, to, amount } = events.Transfer.decode(log)
            users.add(from)
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
            
            // Update user rewards
            updateUserReward(userRewardsMap, to, reward, {
                height: block.header.height,
                timestamp: BigInt(block.header.timestamp)
            })
            
            transfers.push(
                new Transfer({
                    id: log.id,
                    block: block.header.height,
                    from,
                    to,
                    value: amount,
                    txHash: log.transactionHash,
                    reward
                })
            )
        }
    }

    // Save  updated user rewards
    const updatedRewards = [...userRewardsMap.values()]
    await ctx.store.save(updatedRewards)
    await ctx.store.insert(transfers)
})

function calculateReward(amount: bigint): bigint {
    return amount * 5n / 100n // 5% reward
}

function updateUserReward(
    rewardsMap: Map<string, UserReward>, 
    user: string, 
    newReward: bigint,
    block: {height: number, timestamp: bigint}
): void {
    let userReward = rewardsMap.get(user)

    if (!userReward) {
        userReward = new UserReward({
            id: user,
            user: user,
            totalReward: 0n,
            lastUpdateBlock: block.height,
            lastUpdateTimestamp: block.timestamp
        })
    }
    userReward.totalReward += newReward
    userReward.lastUpdateBlock = block.height
    userReward.lastUpdateTimestamp = block.timestamp
    rewardsMap.set(user, userReward)
}
