const express = require('express');
const router = express.Router();
const UserTokensController = require("../../database/controllers/authUsersTokensController");
const {unSetAuthCookie, getAuthCookieValue} = require("../../handlers/authCookie");
const {unSetProviderCookie, getProviderCookieValue} = require("../../handlers/providerCookie");
const ProvidersUsersTokensController = require("../../database/controllers/providersAuthUsersTokensController");

router.get('/', async (req, res) => {
    const authUserTokenID = getAuthCookieValue(req);
    await UserTokensController.deleteUserToken(authUserTokenID);

    const providerTokenID = getProviderCookieValue(req);
    if (providerTokenID) {
        await ProvidersUsersTokensController.deleteProviderUserToken(providerTokenID);
        unSetProviderCookie(res);
    }
    unSetAuthCookie(res);
});

module.exports = router;