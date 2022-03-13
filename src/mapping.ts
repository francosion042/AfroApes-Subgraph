// import { BigInt } from "@graphprotocol/graph-ts"
import {
  AfroApes as AfroApesContract,
  Transfer as TransferEvent
} from "../generated/AfroApes/AfroApes"

import { Transfer, Account, AfroApeToken } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  /**
   * @dev load the account that is being transfered From, create a new record if it doesn't exist
   * @param  ID a string value for the entity Id
   */ 
  let transferFrom  = Account.load(event.params.from.toHexString())
  if (!transferFrom) {
    transferFrom = new Account(event.params.to.toHexString())
    transferFrom.save()
  }

  /**
   * @dev load the account that is being transfered To, create a new record if it doesn't exist
   * @param  ID a string value for the entity Id
   */
  let transferTo  = Account.load(event.params.to.toHexString())
  if (!transferTo) {
    transferTo = new Account(event.params.to.toHexString())
    transferTo.save()
  }
  /**
   * @dev look for the token, if it doesn't exist, create a new record
   * @param  ID a string value for the entity Id
   */
  let afroApeToken = AfroApeToken.load(event.params.tokenId.toHexString())

  if (!afroApeToken) {
    /**
     * @dev call the AfroApes Contract Class
     * @param address the contract address taken from the event
     */
    let afroApesContract = AfroApesContract.bind(event.address)

    afroApeToken = new AfroApeToken(event.params.tokenId.toHexString())
    afroApeToken.tokenId = event.params.tokenId
    afroApeToken.tokenURI = afroApesContract.tokenURI(event.params.tokenId)
    afroApeToken.owner = event.params.to.toHexString()

    afroApeToken.save()
  }

  /**
   * @dev Create a new Transfer Record
   * @param  ID a string value for the entity Id, derived from the transaction hash
   */
  let transfer = new Transfer(event.transaction.hash.toHexString())
  transfer.from = event.params.from.toHexString()
  transfer.to = event.params.to.toHexString()
  transfer.transactionHash = event.transaction.hash
  transfer.transactionTime = event.block.timestamp

  transfer.save()
}



// export function handleOGMinted(event: OGMinted): void {}

