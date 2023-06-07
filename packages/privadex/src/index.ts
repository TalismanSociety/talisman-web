// @ts-nocheck
import axios from 'axios'
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { typeDefinitions } from '@polkadot/types'
import { ContractPromise } from '@polkadot/api-contract'
import { create as phala_create, signCertificate as phala_signCertificate, types as phala_types } from '@phala/sdk'

import privadex_executor_contract from './privadex_executor_contract.json'

function loadPrivadexContractFile(address: string) {
  const {
    spec: { constructors },
    contract: { name },
  } = privadex_executor_contract
  // console.log('Metadata:', metadata);
  const constructor = constructors.find(c => c.label === 'new')?.selector
  // const wasm = source.wasm // doesn't exist in json
  return { metadata: privadex_executor_contract, constructor, name, address }
}

async function contractApi(api: ApiPromise, pruntimeUrl: string, contract) {
  const newApi = await api.clone().isReady
  const phala = await phala_create({
    api: newApi,
    baseURL: pruntimeUrl,
    contractId: contract.address,
    autoDeposit: true,
  })
  const contractApiPromise = new ContractPromise(phala.api, contract.metadata, contract.address)
  contractApiPromise.sidevmQuery = phala.sidevmQuery
  contractApiPromise.instantiate = phala.instantiate
  return contractApiPromise
}

export class SwapStatus {
  simpleStatus
  numConfirmedSteps
  totalSteps

  constructor(simpleStatus, numConfirmedSteps, totalSteps) {
    this.simpleStatus = simpleStatus
    this.numConfirmedSteps = numConfirmedSteps
    this.totalSteps = totalSteps
  }
}

export const SimpleSwapStatus = {
  Unknown: 0,
  Confirmed: 1,
  Failed: 2,
  InProgress: 3, // includes NotStarted and Submitted cases
}

export class PrivaDexAPI {
  #contractApi
  #certSudo

  constructor(contractApi, certSudo) {
    this.#contractApi = contractApi
    this.#certSudo = certSudo
  }

  static async initialize() {
    const nodeUrl = 'wss://poc5.phala.network/ws'
    const pruntimeUrl = 'https://poc5.phala.network/tee-api-1'
    const sudoAccount = '//Alice'

    const phatContractId = await axios
      .get('https://privadex-default-rtdb.firebaseio.com/phat-contract-id.json')
      .then(res => res.data)
    const contractPrivadex = loadPrivadexContractFile(phatContractId)

    // Connect to the chain
    const wsProvider = new WsProvider(nodeUrl)
    const api = await ApiPromise.create({
      provider: wsProvider,
      types: {
        ...phala_types,
        GistQuote: {
          username: 'String',
          accountId: 'AccountId',
        },
        ...typeDefinitions.contracts.types,
      },
    })
    console.log('Phat API:', api)

    // Prepare accounts
    const keyring = new Keyring({ type: 'sr25519' })
    const sudo = keyring.addFromUri(sudoAccount)
    // console.log(`Sudo has address ${sudo.address} with publicKey [${sudo.publicKey}]`);

    const certSudo = await phala_signCertificate({ api, pair: sudo })
    // console.log("certSudo (Alice):", certSudo)

    const privadexContractApi = await contractApi(api, pruntimeUrl, contractPrivadex)
    // console.log("PrivaDEX API:", privadexContractApi, privadexContractApi.query);

    // privadexApi.query functions:
    // computeExecutionPlan
    // executionPlanStepForward
    // getAdmin
    // getEscrowAccountAddress
    // getExecPlan
    // getExecplanIds
    // initSecretKeys
    // quote
    // startSwap
    return new PrivaDexAPI(privadexContractApi, certSudo)
  }

  async escrowAddress(chain) {
    const escrowAddress = await this.#contractApi.query.getEscrowAccountAddress(this.#certSudo, {}, chain)
    if (escrowAddress.output.isOk) {
      const tup = escrowAddress.output.asOk.asOk
      return tup[0].toString() // public key for Substrate, address for Ethereum
    }
    throw new Error('Unsupported chain for escrowAddress')
  }

  async quote(srcChain, destChain, srcTokenEncoded, destTokenEncoded, amountIn) {
    // Backend returns (quote in destToken, amountIn in $ x 1e6, quote in $ x 1e6)
    // This function returns (quote in destToken, amountIn in $, quote in $)
    const quoteInfo = await this.#contractApi.query.quote(
      this.#certSudo,
      {},
      srcChain,
      destChain,
      srcTokenEncoded,
      destTokenEncoded,
      amountIn.toString()
    )
    // console.log("PrivaDEX quote =", amountIn.toString(), quoteInfo);
    if (quoteInfo.output.isOk) {
      const tup = quoteInfo.output.asOk.asOk
      // console.log(tup[0].toBigInt(), tup[1] / 1e6, tup[2] / 1e6);
      return [tup[0].toBigInt(), tup[1] / 1e6, tup[2] / 1e6]
    }
    return [0n, 0, 0]
  }

  async startSwap(
    userToEscrowTransferTxnHash, // Ethereum txn hash or Substrate extrinsic hash
    srcChain,
    destChain,
    srcHexAddress,
    destHexAddress,
    srcTokenEncoded,
    destTokenEncoded,
    amountIn
  ) {
    const execPlanUuid = await this.#contractApi.query.startSwap(
      this.#certSudo,
      {},
      userToEscrowTransferTxnHash.replace('0x', ''),
      srcChain,
      destChain,
      srcHexAddress.replace('0x', ''),
      destHexAddress.replace('0x', ''),
      srcTokenEncoded,
      destTokenEncoded,
      amountIn.toString()
    )
    console.log(execPlanUuid, execPlanUuid.output.isOk ? execPlanUuid.output.isOk : execPlanUuid.output.asErr)
    const uuid = execPlanUuid.output.asOk.asOk.toString('hex')
    console.log('PrivaDEX UUID =', execPlanUuid.output.asOk.asOk, uuid)
    return uuid
  }

  async getStatus(execPlanUuid: string): Promise<SwapStatus> {
    const execPlan = await this.#contractApi.query.getExecPlan(this.#certSudo, {}, execPlanUuid.replace('0x', ''))
    if (!execPlan.output.isOk) {
      return new SwapStatus(SimpleSwapStatus.Unknown, 0, 0)
    }
    const unwrapped = execPlan.output.asOk.asOk
    const steps = [unwrapped.prestartUserToEscrowTransfer]
      .concat(unwrapped.paths[0].steps)
      .concat([unwrapped.postendEscrowToUserTransfer])
    const totalSteps = (unwrapped.paths[0].steps.length as number) + 2
    let numConfirmedSteps = 0
    for (const step of steps) {
      const stepStatus = this.getStepStatus(step)
      if (stepStatus === SimpleSwapStatus.Failed) {
        return new SwapStatus(SimpleSwapStatus.Failed, numConfirmedSteps, totalSteps)
      } else if (stepStatus === SimpleSwapStatus.Confirmed) {
        numConfirmedSteps++
      }
    }
    const overallStatus = numConfirmedSteps === totalSteps ? SimpleSwapStatus.Confirmed : SimpleSwapStatus.InProgress
    return new SwapStatus(overallStatus, numConfirmedSteps, totalSteps)
  }

  getStepStatus(executionStep) {
    const { status } = executionStep.inner.value
    if (status.isConfirmed) {
      return SimpleSwapStatus.Confirmed
    } else if (status.isDropped || status.isFailed) {
      return SimpleSwapStatus.Failed
    }
    // status.isNotStarted || status.isSubmitted
    return SimpleSwapStatus.InProgress
  }
}
