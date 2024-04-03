const Router = require('express').Router;
const userController = require('../controllers/userController');

const userRouter = Router();

userRouter.post('/register', userController.postRegister);

module.exports = userRouter;