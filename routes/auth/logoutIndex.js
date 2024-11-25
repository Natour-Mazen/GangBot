const express = require('express');
const router = express.Router();
const ProviderMethodsController = require("../../database/controllers/providerMethodsController");
const UserTokensController = require("../../database/controllers/userTokensController");
const {unSetAuthCookieAndRedirectHandler} = require("../../handlers/authCookieAndRedirectHandler");

router.delete('/', async (req, res) => {
    const actualProvider = req.connectedUser.vcsProvider;
    const userID = req.connectedUser.id;
    const actualProviderDBObject = await ProviderMethodsController.getProviderMethodByName(actualProvider);
    await UserTokensController.deleteUserToken(userID, actualProviderDBObject.id);

    res.clearCookie('ff_access_token', {path: '/', sameSite: 'None', secure: true});
    res.json({message: 'Logged out successfully'});

    unSetAuthCookieAndRedirectHandler(res);
});

module.exports = router;