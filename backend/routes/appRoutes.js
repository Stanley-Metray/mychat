const Router = require('express').Router;
const appController = require('../controllers/appController');

const appRouter = Router();

appRouter.get('/', appController.getHomePage);

module.exports = appRouter;