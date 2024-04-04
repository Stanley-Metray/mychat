const Router = require('express').Router;
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const chatRouter = Router();

chatRouter.post('/send-message', authController.verifyToken, chatController.postSendMessage);

module.exports = chatRouter;