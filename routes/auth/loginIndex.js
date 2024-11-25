const express = require('express');
const router = express.Router();
const GithubRouter = require('./providers/githubIndex');
const ManualRouter = require('./providers/manualIndex');

router.use('/github', GithubRouter);
router.use('/manual', ManualRouter);


module.exports = router;
