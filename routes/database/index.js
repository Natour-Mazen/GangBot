const express = require('express');
const router = express.Router();
const projectsRouter = require('./projects');
const flagsRouter = require('./flags');
const providersRouter = require('./providers');

router.use('/projects', projectsRouter);
router.use('/flags', flagsRouter);
router.use('/providers', providersRouter);

module.exports = router;
