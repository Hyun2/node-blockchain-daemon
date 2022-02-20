const { sequelize } = require("./models");
const cron = require("node-cron");
const {
  getCurrentBlockNumber,
  getTxIDs,
  getTxs,
  storeTx,
  // getUsers,
} = require("./utils/main");
const fs = require("fs");
const path = require("path");
const basePath = __dirname;

const task = cron.schedule(
  "*/15 * * * * *", // 30초에 한번씩 실행
  async () => {
    try {
      // await getUsers();

      let startBlockNumber =
        Number(
          fs.readFileSync(path.join(basePath, "./utils/blockNumber"), {
            encoding: "utf-8",
          })
        ) + 1;

      let currentBlockNumber = await getCurrentBlockNumber();
      const txIDs = await getTxIDs(startBlockNumber, currentBlockNumber);
      // console.log(txIDs);
      const txs = await getTxs(txIDs);
      // console.log(txs);

      const works = [];

      for (let tx of txs) {
        works.push(storeTx(tx));
      }

      if (works.length > 0) {
        Promise.all(works).then(() => {
          if (currentBlockNumber >= startBlockNumber) {
            console.log(
              `==== 블록 모니터링 완료 : ${startBlockNumber} ~ ${currentBlockNumber} ====`
            );
            fs.writeFileSync(
              path.join(basePath, "./utils/blockNumber"),
              String(currentBlockNumber)
            );
            // sequelize.close();
          }
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  {
    scheduled: false,
  }
);

task.start();

// const main = async (START_BLOCK) => {
//   //   console.log(await web3.eth.getAccounts());
//   // console.log(await getCurrentBlockNumber());
//   let currentBlockNumber = await getCurrentBlockNumber();
//   const txIDs = await getTxIDs(START_BLOCK, currentBlockNumber);
//   console.log(txIDs);
//   const txs = await getTxs(txIDs);
//   console.log(txs);
// };

// main(startBlockNumber);
