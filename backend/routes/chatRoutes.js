const Router = require('express').Router;
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const chatRouter = Router();

chatRouter.post('/send-message', authController.verifyToken, chatController.postSendMessage);

chatRouter.get('/get-messages', authController.verifyToken, chatController.getMessages);

module.exports = chatRouter;