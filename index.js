const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const getDatabase = require('./database/config');
const loadTestData = require('./config/loadTestData');
const port = 3328;
const app = express();


const authRouter = require('./routes/auth/index');
const githubRouter = require('./routes/github');
const databaseRouter = require('./routes/database');
const apiClientRouter = require('./routes/api/index');


const jwtMiddleware = require("./middlewares/validateJWTMiddleware");
const validateGroupMiddleware = require("./middlewares/validateGroupMiddleware");


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use('/auth', authRouter);

app.use('/api/v1', apiClientRouter);

app.use(jwtMiddleware());

app.use('/github', githubRouter);

// app.use("/database", databaseRouter);
app.use("/database", validateGroupMiddleware(['USER']), databaseRouter);

app.get('/', validateGroupMiddleware(['USER']), async (req, res) => {
    const name = req.connectedUser.vcsName;
    res.send(`Hello ${name}`);
})

app.listen(port, async () => {
    await getDatabase();
    await loadTestData();
    console.log(`Server listening on port ${port}`);
});




module.exports = app;