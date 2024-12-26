const express = require('express');
const router = express.Router();
const GithubRouter = require('./vcs/github');
const ManualRouter = require('./vcs/manual');

router.use('/github', GithubRouter);
router.use('/manual', ManualRouter);


module.exports = router;
