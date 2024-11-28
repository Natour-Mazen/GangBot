const express = require('express');
const router = express.Router();
const ProviderMethodsController = require("../../database/controllers/providerMethodsController");
const UserTokensController = require("../../database/controllers/userTokensController");
const {unSetAuthCookieAndRedirectHandler} = require("../../handlers/authCookieAndRedirect");
const {unSetProviderCookieHandler} = require("../../handlers/providerCookie");

router.delete('/', async (req, res) => {
    const actualProvider = req.connectedUser.vcsProvider;
    const userID = req.connectedUser.id;
    const actualProviderDBObject = await ProviderMethodsController.getProviderMethodByName(actualProvider);
    await UserTokensController.deleteUserToken(userID, actualProviderDBObject.id);

    unSetProviderCookieHandler(res);
    unSetAuthCookieAndRedirectHandler(res);
});

module.exports = router;