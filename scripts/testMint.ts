import { AptosClient, AptosAccount, FaucetClient, HexString, type Types } from "aptos"
import dotenv from "dotenv"

dotenv.config()

const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.testnet.aptoslabs.com"
const FAUCET_URL = "https://faucet.testnet.aptoslabs.com"

const client = new AptosClient(NODE_URL)
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)

const CONTRACT_ADDRESS = process.env.APTOS_CONTRACT_ADDRESS
const MODULE_NAME = "soulbound_certificate"

async function main() {
  if (!process.env.MINTER_PRIVATE_KEY) {
    throw new Error("MINTER_PRIVATE_KEY not found in environment variables")
  }

  const minterAccount = new AptosAccount(HexString.ensure(process.env.MINTER_PRIVATE_KEY).toUint8Array())

  // Create a test recipient account
  const recipientAccount = new AptosAccount()

  // Fund the test account
  await faucetClient.fundAccount(recipientAccount.address(), 100_000_000)

  console.log("Minter address:", minterAccount.address().hex())
  console.log("Recipient address:", recipientAccount.address().hex())

  // Initialize the collection (if not already initialized)
  const initPayload: Types.TransactionPayload = {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::init_collection`,
    type_arguments: [],
    arguments: [],
  }

  try {
    const initTxnRequest = await client.generateTransaction(minterAccount.address(), initPayload)
    const initSignedTxn = await client.signTransaction(minterAccount, initTxnRequest)
    const initTransactionRes = await client.submitTransaction(initSignedTxn)
    await client.waitForTransaction(initTransactionRes.hash)
    console.log("Collection initialized successfully!")
  } catch (error) {
    console.log("Collection already initialized or error occurred:", error)
  }

  // Mint a certificate
  const mintPayload: Types.TransactionPayload = {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::mint_certificate`,
    type_arguments: [],
    arguments: [recipientAccount.address().hex(), "Test Course", 85, 90],
  }

  try {
    const mintTxnRequest = await client.generateTransaction(minterAccount.address(), mintPayload)
    const mintSignedTxn = await client.signTransaction(minterAccount, mintTxnRequest)
    const mintTransactionRes = await client.submitTransaction(mintSignedTxn)
    await client.waitForTransaction(mintTransactionRes.hash)

    console.log("Certificate minted successfully!")
    console.log("Transaction hash:", mintTransactionRes.hash)

    // Fetch and display the minted certificate
    const resources = await client.getAccountResources(recipientAccount.address())
    const tokenStore = resources.find((r) => r.type === "0x3::token::TokenStore")

    if (tokenStore) {
      console.log("Minted Certificate:", tokenStore.data)
    } else {
      console.log("Certificate not found in recipient's account")
    }
  } catch (error) {
    console.error("Error minting certificate:", error)
  }
}

main().catch(console.error)

