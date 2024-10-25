const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require('../../middlewares/validateApiKeyMiddleware');

router.use(apiKeyMiddleware());

router.get('/flags/:flagName', async (req, res) => {
    const { flagName } = req.params;
    const { clientProject } = req;

    const flag = clientProject.flags.find(flag => flag.name === flagName);

    res.json(flag);
});

router.get('/flags', async (req, res) => {
    const { clientProject } = req;

    res.json(clientProject.flags);
});


module.exports = router;
