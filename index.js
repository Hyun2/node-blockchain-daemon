const express = require("express");
const app = express();
const account = require("./routes/account");
const transaction = require("./routes/transaction");
const Web3 = require("web3");
const PORT = 3000;
const BLOCKCHAIN_NETWORK = "http://localhost:8545";

const web3 = new Web3(new Web3.providers.HttpProvider(BLOCKCHAIN_NETWORK));
global.web3 = web3;

app.use(express.json());

web3.eth.getAccounts().then((accounts) => {
  console.log(accounts);
  global.ganacheAccounts = accounts;
});

app.use("/account", account);
app.use("/transaction", transaction);

app.listen(PORT, () => {
  console.log(
    `당신의 서버 ${PORT}에서 도는중... 많은 응원과 격려 부탁드립니다`
  );
});
