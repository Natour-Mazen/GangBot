const express = require('express');
const router = express.Router();
const projectsRouter = require('./projectIndex');
const flagRouter = require('./flagIndex');

router.use('/projects', projectsRouter);
router.use('/flags', flagRouter);

module.exports = router;
