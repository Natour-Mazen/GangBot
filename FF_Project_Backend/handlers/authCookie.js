const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
const { APP_MODE } = process.env;

const COOKIE_NAME = 'ff_access_token';

const getAuthCookieValue = (req) => {
    return req.cookies[COOKIE_NAME];
};

const setAuthCookie = (res, token, redirectUrl = '/') => {
    res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: true, sameSite: 'None' });
    res.redirect(redirectUrl);
};

const unSetAuthCookie = (res, redirectUrl = '/') => {
    res.clearCookie(COOKIE_NAME, {path: '/', sameSite: 'None', secure: true});
    if(APP_MODE === 'Dev') {
        console.log('Cookie deleted');
        res.json({message: 'Logged out successfully'});
    }else {
        res.redirect(redirectUrl);
    }

}

module.exports = {
    getAuthCookieValue,
    setAuthCookie,
    unSetAuthCookie
};