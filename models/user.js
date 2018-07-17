'use strict';

const Sequelize = require('sequelize');
const config = require('../config.js');

const sequelize = new Sequelize(config.get('dataBase.name'), config.get('dataBase.username'), config.get('dataBase.password'), {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
});

  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const userOptions = {
  username: {
    type:      Sequelize.STRING,
    unique:    true,
    allowNull: false,
    validate:  {
      len: {
        args: [6, 25],
        msg:  'Minimum 6, maximum 25 charachters'
      }
    }
  },
  password: {
    unique:    true,
    allowNull: false,
    type:      Sequelize.STRING,
    validate:  {
      len: {
        args: [6,1024],
      }
    }
  },
};

module.exports = {
  sequelize,
  userOptions,
}