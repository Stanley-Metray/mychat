const sequelize = require('../connection/connect');
const User = require('../models/user');
const Chat = require('../models/chat');

module.exports.config = ()=> {
    User.hasMany(Chat, { onDelete: 'CASCADE' });
    Chat.belongsTo(User);
}

