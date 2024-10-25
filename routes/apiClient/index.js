const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require('../../middlewares/validateApiKeyMiddleware');

router.use(apiKeyMiddleware());

router.get('/flags/project/:flagName', async (req, res) => {
    const { flagName } = req.params;
    const { clientProject } = req;

    if (!flagName) {
        return res.status(400).send("Flag name is required");
    }

    const flag = clientProject.flags.find(flag => flag.name === flagName);

    if (!flag) {
        return res.status(404).send("Flag not found");
    }

    res.json(flag);
});

router.get('/flags/project', async (req, res) => {
    const { clientProject } = req;

    res.json(clientProject.flags);
});


module.exports = router;
