const express = require('express');
const router = express.Router();
const GithubRouter = require('./githubIndex');

router.use('/github', GithubRouter);


module.exports = router;
