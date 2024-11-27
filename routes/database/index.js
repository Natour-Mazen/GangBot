const express = require('express');
const router = express.Router();
const projectsRouter = require('./projectsIndex');
const flagsRouter = require('./flagsIndex');
const providersRouter = require('./providersIndex');

router.use('/projects', projectsRouter);
router.use('/flags', flagsRouter);
router.use('/providers', providersRouter);

module.exports = router;
