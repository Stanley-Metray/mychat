const Router = require('express').Router;
const appController = require('../controllers/appController');

const appRouter = Router();

appRouter.get('/', appController.getHomePage);

appRouter.get('/error', appController.getErrorPage);

module.exports = appRouter;