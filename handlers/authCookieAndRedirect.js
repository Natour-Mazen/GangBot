const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
const { APP_MODE } = process.env;

const setAuthCookieAndRedirectHandler = (res, token, redirectUrl = '/') => {
    res.cookie('ff_access_token', token, { httpOnly: true, secure: true, sameSite: 'None' });
    res.redirect(redirectUrl);
};

const unSetAuthCookieAndRedirectHandler = (res, redirectUrl = '/') => {
    res.clearCookie('ff_access_token', {path: '/', sameSite: 'None', secure: true});
    if(APP_MODE === 'Dev') {
        console.log('Cookie deleted');
        res.json({message: 'Logged out successfully'});
    }else {
        res.redirect(redirectUrl);
    }

}

module.exports = {
    setAuthCookieAndRedirectHandler,
    unSetAuthCookieAndRedirectHandler
};