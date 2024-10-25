const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require('../../middlewares/validateApiKeyMiddleware');

router.use(apiKeyMiddleware());

router.get('/flags/:flagName', async (req, res) => {
    const { flagName } = req.params;
    const { clientProject } = req;

    const projectFlags = clientProject.flags;
    if(!projectFlags){
        return res.status(404).json({
            error: "No flags found in the project"
        });
    }

    const flag = projectFlags.find(flag => flag.name === flagName);

    if (!flag) {
        return res.status(404).json({
            error: "Flag not found"
        });
    }

    res.json(flag);
});

router.get('/flags', async (req, res) => {
    const { clientProject } = req;

    res.json(clientProject.flags);
});


module.exports = router;
