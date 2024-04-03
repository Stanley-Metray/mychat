require('dotenv').config({path:'../.env'});
const express = require('express');
const path = require('path');
const appRouter = require('../backend/routes/appRoutes');
const userRouter = require('../backend/routes/userRoutes');
const sequelize = require('../backend/connection/connect');


const app = express();

app.use(express.json());
app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));
app.use('/css', express.static(path.join(__dirname, '../frontend/public/css')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use(appRouter);
app.use(userRouter);

(async () => {
    try {
        await sequelize.sync();
        app.listen(3500);
    } catch (error) {
        console.log(error);
    }
})();