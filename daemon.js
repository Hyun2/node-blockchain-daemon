const cron = require("node-cron");
const Web3 = require("web3");
const GANACHE_SERVER = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_SERVER));

  
const getBlocks = async () => {
    //여러분들이 채워야 할 내용
};

const task = cron.schedule(
    "*/30 * * * * *", // 30초에 한번씩 실행
    async () => {
        getBlocks();
    },
    {
        scheduled: false,
    }
);

task.start();
