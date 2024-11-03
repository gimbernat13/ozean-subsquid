import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "amount": p.uint256}),
    DelegateChanged: event("0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f", "DelegateChanged(address,address,address)", {"delegator": indexed(p.address), "fromDelegate": indexed(p.address), "toDelegate": indexed(p.address)}),
    DelegateVotesChanged: event("0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724", "DelegateVotesChanged(address,uint256,uint256)", {"delegate": indexed(p.address), "previousBalance": p.uint256, "newBalance": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    DELEGATION_TYPEHASH: viewFun("0xe7a324dc", "DELEGATION_TYPEHASH()", {}, p.bytes32),
    DOMAIN_TYPEHASH: viewFun("0x20606b70", "DOMAIN_TYPEHASH()", {}, p.bytes32),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"account": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "rawAmount": p.uint256}, p.bool),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    checkpoints: viewFun("0xf1127ed8", "checkpoints(address,uint32)", {"_0": p.address, "_1": p.uint32}, {"fromBlock": p.uint32, "votes": p.uint96}),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    delegate: fun("0x5c19a95c", "delegate(address)", {"delegatee": p.address}, ),
    delegateBySig: fun("0xc3cda520", "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)", {"delegatee": p.address, "nonce": p.uint256, "expiry": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    delegates: viewFun("0x587cde1e", "delegates(address)", {"_0": p.address}, p.address),
    getCurrentVotes: viewFun("0xb4b5ea57", "getCurrentVotes(address)", {"account": p.address}, p.uint96),
    getPriorVotes: viewFun("0x782d6fe1", "getPriorVotes(address,uint256)", {"account": p.address, "blockNumber": p.uint256}, p.uint96),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"_0": p.address}, p.uint256),
    numCheckpoints: viewFun("0x6fcfff45", "numCheckpoints(address)", {"_0": p.address}, p.uint32),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"dst": p.address, "rawAmount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"src": p.address, "dst": p.address, "rawAmount": p.uint256}, p.bool),
}

export class Contract extends ContractBase {

    DELEGATION_TYPEHASH() {
        return this.eth_call(functions.DELEGATION_TYPEHASH, {})
    }

    DOMAIN_TYPEHASH() {
        return this.eth_call(functions.DOMAIN_TYPEHASH, {})
    }

    allowance(account: AllowanceParams["account"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {account, spender})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    checkpoints(_0: CheckpointsParams["_0"], _1: CheckpointsParams["_1"]) {
        return this.eth_call(functions.checkpoints, {_0, _1})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    delegates(_0: DelegatesParams["_0"]) {
        return this.eth_call(functions.delegates, {_0})
    }

    getCurrentVotes(account: GetCurrentVotesParams["account"]) {
        return this.eth_call(functions.getCurrentVotes, {account})
    }

    getPriorVotes(account: GetPriorVotesParams["account"], blockNumber: GetPriorVotesParams["blockNumber"]) {
        return this.eth_call(functions.getPriorVotes, {account, blockNumber})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonces(_0: NoncesParams["_0"]) {
        return this.eth_call(functions.nonces, {_0})
    }

    numCheckpoints(_0: NumCheckpointsParams["_0"]) {
        return this.eth_call(functions.numCheckpoints, {_0})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DelegateChangedEventArgs = EParams<typeof events.DelegateChanged>
export type DelegateVotesChangedEventArgs = EParams<typeof events.DelegateVotesChanged>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type DELEGATION_TYPEHASHParams = FunctionArguments<typeof functions.DELEGATION_TYPEHASH>
export type DELEGATION_TYPEHASHReturn = FunctionReturn<typeof functions.DELEGATION_TYPEHASH>

export type DOMAIN_TYPEHASHParams = FunctionArguments<typeof functions.DOMAIN_TYPEHASH>
export type DOMAIN_TYPEHASHReturn = FunctionReturn<typeof functions.DOMAIN_TYPEHASH>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type CheckpointsParams = FunctionArguments<typeof functions.checkpoints>
export type CheckpointsReturn = FunctionReturn<typeof functions.checkpoints>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DelegateParams = FunctionArguments<typeof functions.delegate>
export type DelegateReturn = FunctionReturn<typeof functions.delegate>

export type DelegateBySigParams = FunctionArguments<typeof functions.delegateBySig>
export type DelegateBySigReturn = FunctionReturn<typeof functions.delegateBySig>

export type DelegatesParams = FunctionArguments<typeof functions.delegates>
export type DelegatesReturn = FunctionReturn<typeof functions.delegates>

export type GetCurrentVotesParams = FunctionArguments<typeof functions.getCurrentVotes>
export type GetCurrentVotesReturn = FunctionReturn<typeof functions.getCurrentVotes>

export type GetPriorVotesParams = FunctionArguments<typeof functions.getPriorVotes>
export type GetPriorVotesReturn = FunctionReturn<typeof functions.getPriorVotes>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type NumCheckpointsParams = FunctionArguments<typeof functions.numCheckpoints>
export type NumCheckpointsReturn = FunctionReturn<typeof functions.numCheckpoints>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

