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

app.use((req, res, next) => {
    if (!req.cookies.access_token && req.path !== '/auth' && req.path !== '/auth/callback') {
        return res.redirect('/auth');
    }
    next();
})

app.use('/auth', authRouter);


app.get('/', async (req, res) => {
    const { models } = await getDatabase();
    const user = await models.users.findOne({
        where: {
            githubtoken: req.cookies.access_token
        }
    });
    res.send(`Hello ${user.githubusername}`);
})

app.listen(port, async () => {
    const { sequelize, models } = await getDatabase();
    console.log(`Server listening on port ${port}`);
});

module.exports = app;