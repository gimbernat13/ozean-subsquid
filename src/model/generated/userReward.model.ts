import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class UserReward {
    constructor(props?: Partial<UserReward>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    user!: string

    @BigIntColumn_({nullable: false})
    totalReward!: bigint

    @IntColumn_({nullable: false})
    lastUpdateBlock!: number

    @BigIntColumn_({nullable: false})
    lastUpdateTimestamp!: bigint
}
