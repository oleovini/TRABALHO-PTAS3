const { Sequelize } = require('sequelize');
const config = require('../config/config')
require('dotenv').config();

const sequelize = new Sequelize(config.development);//<---- Puxando a variavel config que guarda o arquivo config.js que guarda as informações do banco de dados

try {
  sequelize.authenticate();
  console.log('Sucesso ao criar Banco de Dados');
} catch (error) {
  console.error('Erro ao criar Banco de Dados', error);
}

module.exports = { Sequelize, sequelize };