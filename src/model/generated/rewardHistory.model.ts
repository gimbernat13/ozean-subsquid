import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {UserReward} from "./userReward.model"
import {Transfer} from "./transfer.model"

@Entity_()
export class RewardHistory {
    constructor(props?: Partial<RewardHistory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => UserReward, {nullable: true})
    userReward!: UserReward

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @IntColumn_({nullable: false})
    block!: number

    @BigIntColumn_({nullable: false})
    timestamp!: bigint

    @Index_()
    @ManyToOne_(() => Transfer, {nullable: true})
    transfer!: Transfer

    @StringColumn_({nullable: false})
    tierAtTime!: string

    @FloatColumn_({nullable: false})
    multiplier!: number
}
