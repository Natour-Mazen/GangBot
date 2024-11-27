// Description: Handler for setting and unsetting provider cookie.
const {sign} = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const { JWT_SECRET_KEY } = process.env;

const generateJWTProviderToken = (token, userid, username, type) => {
    return sign({ userid, username, token, type }, JWT_SECRET_KEY, {
        expiresIn: '1d'
    });
}

const setProviderCookieHandler = (res, token, userid, username, type) => {
    console.log('Setting provider cookie');
    console.log('Token:', token);
    console.log('Type:', type);
    console.log('Userid:', userid);
    console.log('Username:', username);
    const providerToken = generateJWTProviderToken(token, userid, username, type);

    res.cookie('ff_provider_token', providerToken, { httpOnly: true, secure: true, sameSite: 'None' });
    res.redirect('/');
};

const unSetProviderCookieHandler = (res) => {
    res.clearCookie('ff_provider_token', {path: '/', sameSite: 'None', secure: true});
}

module.exports = {
    setProviderCookieHandler,
    unSetProviderCookieHandler
};