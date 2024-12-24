// Description: Handler for setting and unsetting provider cookie.
const COOKIE_NAME = 'ff_provider_token';


const getProviderCookieValue = (req) => {
    return req.cookies[COOKIE_NAME];
};

const setProviderCookie = async (res, token) => {
    res.cookie(COOKIE_NAME, token, {httpOnly: true, secure: true, sameSite: 'None'});
    res.redirect('/');
};

const unSetProviderCookie = (res) => {
    res.clearCookie(COOKIE_NAME, {path: '/', sameSite: 'None', secure: true});
}

module.exports = {
    getProviderCookieValue,
    setProviderCookie,
    unSetProviderCookie
};