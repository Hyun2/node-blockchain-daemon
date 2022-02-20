const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const { Tx, User } = require("../models");

const getCurrentBlockNumber = async () => await web3.eth.getBlockNumber();

const getTxIDs = async (startBlkNum, currentBlockNumber) => {
  try {
    //조회하고자 하는 블록들 조회하여 모든 트랜잭션 ID 추출
    let txIDs = [];
    for (let j = startBlkNum; j < currentBlockNumber + 1; j++) {
      let block = await web3.eth.getBlock(j);
      txIDs = txIDs.concat(block.transactions);
    }

    return txIDs;
  } catch (e) {
    console.log(e.message);
  }
};

const getTx = async (tx) => await web3.eth.getTransaction(tx);

const getTxs = async (txIDs) => {
  const allTransactions = [];

  for (let tx of txIDs) {
    allTransactions.push(await getTx(tx));
  }

  return allTransactions;
};

const storeTx = async (tx) => {
  // console.log(tx.hash, tx.blockNumber);
  await Tx.findOrCreate({
    where: { tx_hash: tx.hash },
    defaults: {
      tx_hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: web3.utils.fromWei(tx.value, "ether"),
      block: tx.blockNumber,
    },
  });

  const balance = await web3.eth.getBalance(tx.to);
  // console.log(balance);
  await User.update(
    {
      balance: web3.utils.fromWei(balance, "ether"),
    },
    { where: { address: tx.to } }
  );
};

module.exports = {
  getCurrentBlockNumber,
  getTxIDs,
  getTxs,
  storeTx,
};
