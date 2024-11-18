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

    const flag = projectFlags[flagName];

    if (!flag) {
        return res.status(404).json({
            error: "Flag not found with this name"
        });
    }

    const defaultVariation = flag.defaultRule.variation;
    const flagValue = flag.variations[defaultVariation];


    res.json({
        name: flagName,
        value: flagValue
    });
});

router.get('/flags', async (req, res) => {
    const { clientProject } = req;

    const projectFlags = clientProject.flags;
    if(!projectFlags){
        return res.status(404).json({
            error: "No flags found in the project"
        });
    }

    res.json(projectFlags);
});


module.exports = router;
