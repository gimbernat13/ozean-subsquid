import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transfer} from './model'
import {processor} from './processor'
import {events} from './abi/cpool'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const transfers: Transfer[] = []
    
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            // Decode the event data
            const { from, to, amount } = events.Transfer.decode(log)
            const reward = calculateReward(amount)  
            transfers.push(
                new Transfer({
                    id: log.id,
                    block: block.header.height,
                    from,
                    to,
                    value: amount,
                    txHash: log.transactionHash,
                    reward: reward 
                })
            )
        }
    }

    const totalRewards = transfers.reduce((acc, t) => acc + t.reward, 0n)
    ctx.log.info(`Total rewards in this batch: ${totalRewards}`)

    await ctx.store.insert(transfers)
})

// Custom reward calculation function
function calculateReward(amount: bigint): bigint {
    return amount * 5n / 100n // Example: 5% reward
}
