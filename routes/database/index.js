const express = require('express');
const router = express.Router();
const projectsRouter = require('./projectIndex');
const flagRouter = require('./flagIndex');
const providersRouter = require('./providersIndex');

router.use('/projects', projectsRouter);
router.use('/flags', flagRouter);
router.use('/providers', providersRouter);

module.exports = router;
