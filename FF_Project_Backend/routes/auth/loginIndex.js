const express = require('express');
const router = express.Router();
const GithubRouter = require('./providers/github');
const ManualRouter = require('./providers/manual');

router.use('/github', GithubRouter);
router.use('/manual', ManualRouter);


module.exports = router;
