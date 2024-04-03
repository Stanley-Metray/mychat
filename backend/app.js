const express = require('express');
const path = require('path');
const appRouter = require('../backend/routes/appRoutes');

const app = express();

app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));
app.use('/css', express.static(path.join(__dirname, '../frontend/public/css')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use(appRouter);

app.listen(3500);