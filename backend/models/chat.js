const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = Chat = sequelize.define('chat', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    message : {
        type : DataTypes.TEXT,
        allowNull : false
    }
})