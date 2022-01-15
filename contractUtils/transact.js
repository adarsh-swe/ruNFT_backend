require("dotenv").config();

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { has } = require("config");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = require("./abi.json");

function minter(to = "0xD7697F9EabfEECBe601B49aAbD9492b2650958E3", amount = 1) {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = createAlchemyWeb3(API_URL);

      const nftContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
      const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

      const transaction = {
        from: PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce: nonce,
        gas: 500000,
        maxPriorityFeePerGas: 1999999987,
        data: nftContract.methods.mint(to, amount).encodeABI(),
      };

      const signedTx = await web3.eth.accounts.signTransaction(
        transaction,
        PRIVATE_KEY
      );

      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (error, hash) {
          if (!error) {
            const retry = () => {
              web3.eth.getTransactionReceipt(hash, async (err, txR) => {
                if (txR) {
                  const totalSupply = await nftContract.methods
                    .totalSupply()
                    .call();
                  resolve(totalSupply);
                } else {
                  setTimeout(retry, 4000);
                }
              });
            };

            retry();
          } else {
            reject();
          }
        }
      );
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

function mintNFT(wallet) {
  return minter(wallet, 1)
    .then((tokenNumber) => {
      console.log(tokenNumber);
      return tokenNumber;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

module.exports = { mintNFT };
