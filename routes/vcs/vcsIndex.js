const express = require('express');
const router = express.Router();
const GithubVCSRouter = require('./github/index');



router.use('/github', GithubVCSRouter);


module.exports = router;
