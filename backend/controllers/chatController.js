const sequelize = require('../connection/connect');
const Chat = require('../models/chat');
const GroupMembers = require('../models/group-members');
const Message = require('../models/message');
const JoinLink = require('../models/group-join-links');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


let filePath = path.join(__dirname, '../../frontend/views/');

module.exports.postSendMessage = async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json({ success: true, message: message });
    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const chatId = req.params.id;
        const messages = await Message.findAll({ where: { chatId: chatId } });
        res.status(200).json({ success: true, message: messages });
    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.postCreateChat = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const chatId = uuidv4();
        const createdChat = await Chat.create({ id: chatId, ...req.body }, { transaction: t });
        const linkId = uuidv4();
        const link = `http://localhost:3500/group/${linkId}`;
        const createdLink = await JoinLink.create({ id: linkId, link: link, chatId: chatId }, { transaction: t });
        await GroupMembers.create({userId : req.body.userId, chatId : chatId, user_name : req.cookies.user}, {transaction : t});
        await t.commit();
        res.status(201).json({ success: true, chat: createdChat, joinLink: createdLink.link });
    } catch (error) {
        await t.rollback();
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.getCreateGroup = (req, res) => {
    res.status(200).sendFile(filePath + '/create-group.html');
}

module.exports.joinGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const linkId = req.params.linkId;
        const joinLink = await JoinLink.findOne({ where: { id: linkId } }, { transaction: t });
        if (joinLink) {
            const userId = req.body.userId;
            const chatId = joinLink.chatId;
            const isGroupMember = await GroupMembers.findOne({ where: { chatId: chatId, userId: userId } }, { transaction: t });
            if (isGroupMember) {
                return res.status(200).json({ success: false, message: "Already a member" });
            }
            await GroupMembers.create({ userId: userId, chatId: chatId }, { transaction: t });
            await Chat.increment('total_members', { by: 1, where: { id: chatId }, transaction: t });
            await t.commit();
            res.status(200).json({ success: true, message: "Please wait...", joinLink: joinLink });
        }
        else
            res.status(404).json({ success: false, message: "Invalid link", joinLink: req.url });

    } catch (error) {
        await t.rollback();
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}


module.exports.getAllChats = async (req, res) => {
    try {
        const data = await Chat.findAll({ where: { userId: req.body.userId } });
        const chats = JSON.parse(JSON.stringify(data));

        await Promise.all(chats.map(async (chat) => {
            const chatMessages = await Message.findAll({ where: { chatId: chat.id } });
            const chatJoinLink = await JoinLink.findOne({ where: { chatId: chat.id } });
            Object.assign(chat, { messages: chatMessages, joinLink: chatJoinLink.link });
        }));

        res.status(200).json({ success: true, chats: chats });

    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}


module.exports.getChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findOne({ where: { id: chatId } });
        // const messages = await Message.findAll({ where: { chatId: chatId } });
        const joinLink = await JoinLink.findOne({ where: { chatId: chatId } });
        const members = await GroupMembers.findAll({where : {userId : req.body.userId, chatId : chatId}});
        res.status(200).json({ success: true, chat: chat, joinLink: joinLink.link, members : members });
    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}