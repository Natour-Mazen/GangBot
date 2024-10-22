const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const getDatabase = require('./database/config');
const port = 3328;
const authRouter = require('./auth');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use('/auth', authRouter);
app.listen(port, async () => {
    const { sequelize, models } = await getDatabase();
    console.log(await models.users.findAll());
    console.log(`Server listening on port ${port}`);
});

module.exports = app;