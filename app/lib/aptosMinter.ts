import { AptosClient, AptosAccount, FaucetClient, type Types, HexString } from "aptos"

const NODE_URL = process.env.NEXT_PUBLIC_APTOS_NODE_URL || "https://fullnode.testnet.aptoslabs.com"
const FAUCET_URL = process.env.NEXT_PUBLIC_APTOS_FAUCET_URL || "https://faucet.testnet.aptoslabs.com"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""
const MODULE_NAME = "soulbound_certificate"
const COLLECTION_NAME = "EduMint Certificates"

class AptosMinter {
  private client: AptosClient
  private faucetClient: FaucetClient

  constructor() {
    this.client = new AptosClient(NODE_URL)
    this.faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)
  }

  async mintCertificate(
    recipientAddress: string,
    course: string,
    score: number,
    videoProgress: number,
  ): Promise<string> {
    try {
      const minterPrivateKey = process.env.MINTER_PRIVATE_KEY
      if (!minterPrivateKey) {
        throw new Error("Minter private key not found in environment variables")
      }
      const minterAccount = new AptosAccount(HexString.ensure(minterPrivateKey).toUint8Array())

      console.log(`Minting certificate for ${recipientAddress}:`)
      console.log(`Course: ${course}`)
      console.log(`Score: ${score}`)
      console.log(`Video Progress: ${videoProgress}`)

      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::mint_certificate`,
        type_arguments: [],
        arguments: [recipientAddress, course, score, videoProgress],
      }

      const txnRequest = await this.client.generateTransaction(minterAccount.address(), payload)
      const signedTxn = await this.client.signTransaction(minterAccount, txnRequest)
      const transactionRes = await this.client.submitTransaction(signedTxn)
      const txResult = await this.client.waitForTransactionWithResult(transactionRes.hash)

      if (txResult.success === false) {
        throw new Error(`Transaction failed: ${JSON.stringify(txResult.vm_status)}`)
      }

      return transactionRes.hash
    } catch (error) {
      console.error("Error minting certificate:", error)
      throw new Error(`Failed to mint certificate: ${error.message}`)
    }
  }

  async getUserCertificates(userAddress: string): Promise<any[]> {
    try {
      const resources = await this.client.getAccountResources(userAddress)
      const tokenStore = resources.find((r) => r.type === "0x3::token::TokenStore")

      if (!tokenStore) {
        return []
      }

      const tokens = tokenStore.data.tokens
      const certificates = Object.entries(tokens).filter(([_, token]: [string, any]) => {
        return token.collection === COLLECTION_NAME
      })

      return certificates.map(([tokenId, token]: [string, any]) => ({
        tokenId,
        course: token.name,
        image_url: "https://m.media-amazon.com/images/I/71hI16-vr6L.jpg",
      }))
    } catch (error) {
      console.error("Error fetching user certificates:", error)
      throw new Error("Failed to fetch user certificates")
    }
  }
}

export const aptosMinter = new AptosMinter()

