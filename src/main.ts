import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transfer} from './model'
import {processor} from './processor'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const transfers: Transfer[] = []
    for (let c of ctx.blocks) {
        for (let tx of c.transactions) {
            // decode and normalize the tx data
            transfers.push(
                new Transfer({
                    id: tx.id,
                    block: c.header.height,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value,
                    txHash: tx.hash,
                })
            )
        }
    }

    // upsert batches of entities with batch-optimized ctx.store.insert()/upsert()
    await ctx.store.insert(transfers)
})
