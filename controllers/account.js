const { User } = require("../models");

module.exports = {
    getUserInfo: async (req, res, next) => {
        console.log(req.query);
        let user = await User.findAll({
            attributes: ["address", "balance"],
            where: { address: req.body.address },
        });
        let { address, balance } = user[0].dataValues;

        if (user) {
            res.status(200).send({
                message: "user information",
                data: {
                    address,
                    balance,
                },
            });
        } else {
            res.status(404).send({
                message: "cannot find user",
            });
        }
    },
    newAccount: async (req, res, next) => {
        const password = req.body.password;
        const newAccAddr = await web3.eth.personal.newAccount(password);

        await User.create({
            address: newAccAddr,
            password,
            balance: "0",
        });

        res.status(201).send({
            message: "account created.",
            data: {
                address: newAccAddr,
            },
        });
    },
    faucet: async (req, res, next) => {
        const toAddress  = req.body.toAddress;
        const fromAddress = req.body.fromAddress;

        const tx = {
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei("5", "ether"),
        };

        web3.eth.sendTransaction(tx).on("receipt", (receipt) => {
            res.status(200).send({
                message: "faucet success.",
                data: {
                    receipt,
                },
            });
            return;
        });
    },
};
