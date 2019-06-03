const express = require('express');

const server = express();
const db = require('./data/accounts-model');

server.use(express.json());

// your code here

//custom Middleware 
function ValidateId(req, res, next) {
    if (req.params.id) {
        db.findById(req.params.id)
            then(account => {
                if (account) {
                    req.account = account;
                    next();
                } else {
                    res.status(400).json({
                        message: 'No valid account with this id.'
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Error while verifying ID.'
                })
            })
    }
    else {
        res.status(400).json({
            message: 'You must provide an id.'
        })
    }
}

function ValidateAccount(req, res, next) {
    if (req.body) {
        if (req.body.name && req.body.budget) {
            next();
        }
        else {
            res.status(400).json({
                message: 'You must provide a name and budget for the account.'
            })
        }
    } else {
        res.status(400).json({
            message: 'You must provide account data.'
        })
    }
}

//CRUD

//get all accounts
server.get('/', (req, res) => {
    db.find()
        .then(accounts => {
            if (accounts.length > 0) {
                res.status(200).json(accounts);
            }
            else {
                res.status(404).json({
                    message: 'No accounts found.'
                });
            }
            
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving the accounts from the database.'
            });
        })
})

//get specific account
server.get('/:id', ValidateId, (req, res) => {
    res.status(200).json(req.account);
})

//add an account
server.post('/', ValidateAccount, (req, res) => {
    db.add(req.body)
        .then(account => {
            res.status(201).json(account);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error while trying to create account.'
            })
        })
})

server.delete('/:id', ValidateId, (req,res) => {
    db.remove(req.params.id)
        .then(removed => {
            res.status(200).json({
                message: 'Account removed successfully.'
            })
        })
})





module.exports = server;