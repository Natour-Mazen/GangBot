const express = require('express');
const router = express.Router();
const ProviderMethodsController = require("../../database/controllers/providerMethodsController");


router.get('/', async (req, res) => {
    const providers = await ProviderMethodsController.getAllProviderMethods();
    if(!providers){
        return res.status(400).json({
            error: "An error occurred while getting the providers"
        });
    }

    res.json(providers);
});

module.exports = router;