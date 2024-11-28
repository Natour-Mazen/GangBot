const express = require('express');
const router = express.Router();
const projectsRouter = require('./projects');
const providersRouter = require('./providers');
const organizationsRouter = require('./organizations');

router.use('/projects', projectsRouter);
router.use('/providers', providersRouter);
router.use('/organizations', organizationsRouter);

module.exports = router;
