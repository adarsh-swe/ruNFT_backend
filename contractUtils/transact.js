require("dotenv").config();

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

console.log(API_URL);

const ABI = require("./abi.json");

function minter(to = "0xD7697F9EabfEECBe601B49aAbD9492b2650958E3", amount = 1) {
  return new Promise(async (resolve, reject) => {
    const web3 = createAlchemyWeb3(API_URL);

    const nftContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const totalSupply = await nftContract.methods.totalSupply().call();
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

    const transaction = {
      from: PUBLIC_KEY,
      to: CONTRACT_ADDRESS,
      nonce: nonce,
      gas: 500000,
      maxPriorityFeePerGas: 1999999987,
      data: nftContract.methods
        .mint("0xD7697F9EabfEECBe601B49aAbD9492b2650958E3", amount)
        .encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      PRIVATE_KEY
    );

    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        if (!error) {
          console.log(
            "🎉 The hash of your transaction is: ",
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
          resolve();
        } else {
          console.log(
            "❗Something went wrong while submitting your transaction:",
            error
          );
          reject();
        }
      }
    );
  });
}

function mintNFT(wallet, metadata) {
  minter()
    .then(() => {
      //push metadata to mongodb
    })
    .catch(() => {});
}

module.exports = { mintNFT };
