const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const getDatabase = require('./database/config');
const port = 3328;
const authRouter = require('./auth');
const authJWTMiddleware = require("./middlewares/authTokenJWT");
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());



app.use('/auth', authRouter);


app.get('/', authJWTMiddleware() ,async (req, res) => {
    const name = req.connectedUser.name;
    res.send(`Hello ${name}`);
})

app.listen(port, async () => {
    await getDatabase();
    console.log(`Server listening on port ${port}`);
});

module.exports = app;