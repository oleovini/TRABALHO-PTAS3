const User = require('../models/User');
const secret = require('../config/auth.json');
const bcript = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config


const createUser = async (req, res) => {
    const {name, email, password} = req.body;
    const newPassword = await bcript.hash(password, 11)
    await User.create({
       name:name,
       email:email,
       password: newPassword

    }).then(() => {
        res.json('Sucesso ao criar usuário');
        console.log('Sucesso ao criar usuário');
    }).catch((erro) => {
        res.json('Erro ao criar usuário');
        console.log(`Erro ao criar usuário: ${erro}`);
    })
}
const findUsers = async (req, res) => {
    const users= await User.findAll();
    try {
        res.json(users);
    } catch (error) {
        res.status(404).json("Ocorreu um erro na busca!");
    };
}

const deleteUser = async (req, res) => {
    const {id} = req.body;
    try {
        await User.destroy({
            where: {
                id:id
            }
        }).then(() => {
            res.json("Sucesso ao excluir usuário");
        })
    } catch (error) {
        res.status(404).json("Erro ao excluir usuário");
    }
}
const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const {name, email, password} = req.body;
    try {
        await User.update(
            {
               name:name,
               email:email,
               password:password
            },
            {
                where: {
                    id: id
                }
            }
        ).then(() => {
            res.json("Sucesso ao atualizar usuário");
        })
    } catch (error) {
        res.status(404).json("Erro ao atualizar usuário!");
    }
}
const authenticatedUser = async (req, res) => {
    const { email, password} = req.body;
    try {
        const isUserAuthenticated = await User.findOne({
            where: { email, password}
        })

        if(isUserAuthenticated) {
            const token = jwt.sign({ id: email }, process.env.SECRET, {
                expiresIn: 86400
            });
            res.cookie('token', token, { httpOnly: true }).json({
                name: isUserAuthenticated.name,
                email: isUserAuthenticated.email,
                token: token
            });
        }
        const response = await bcript.compare(password, isUserAuthenticated.password)

        
        const token = jwt.sign({
            name: isUserAuthenticated.name,
            email: isUserAuthenticated.email
        },
            secret.secret, {
            expiresIn: 86400,
        })
        return res.json({
            name:  isUserAuthenticated.name,
            email: isUserAuthenticated.email,
            token: token
        });
    } catch (error) {
        return res.json("Erro ao autenticar usuário");
    }
}


module.exports = { createUser, findUsers, deleteUser, updateUser, authenticatedUser };
