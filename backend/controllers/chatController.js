const Chat = require('../models/chat');

module.exports.postSendMessage = async (req, res) => {
    try {
        const createdMsg = await Chat.create(req.body);
        res.status(201).json({ success: true, message: createdMsg.message, createdAt: createdMsg.createdAt });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const messages = await Chat.findAll({where : {userId : req.body.userId}});
        res.status(201).json({ success: true, messages: messages });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}