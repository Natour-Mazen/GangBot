const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const ProviderMethodsController = require("../database/controllers/providerMethodsController");
const ProvidersUsersTokensController = require("../database/controllers/providersAuthUsersTokensController");
const {getProviderCookieValue} = require("../handlers/providerCookie");
dotenv.config();

const { JWT_SECRET_KEY, APP_MODE } = process.env;

const handleErrorResponse = (res, message, status = 401) => {
    if (APP_MODE === 'Dev') {
        return res.status(status).json({ message });
    } else if (APP_MODE === 'Prod') {
        return res.redirect('/auth');
    } else {
        throw new Error('APP_MODE not set');
    }
};

const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const getProviderMethod = async (providerName) => {
    const db_ProviderMethod = await ProviderMethodsController.getProviderMethodByName(providerName);
    return {
        id: db_ProviderMethod.dataValues.id,
        type: db_ProviderMethod.dataValues.providername
    };
};

const validateProviderToken = (verifiedType) => async (req, res, next) => {
    const vcsProviderConnectedUser = req.connectedUser.vcsProvider;

    if (!vcsProviderConnectedUser) {
        return handleErrorResponse(res, 'No provider connected');
    }

    if (vcsProviderConnectedUser === verifiedType) {
        req.connectedProvider = {
            ...await getProviderMethod(vcsProviderConnectedUser),
            token: req.connectedUser.vcsToken,
            username: req.connectedUser.vcsName,
            userid: req.connectedUser.vcsID
        };
        return next();
    }

    const providerTokenID = getProviderCookieValue(req);
    if (!providerTokenID) {
        return res.status(401).json({ message: 'Provider Token is missing' });
    }

    const db_ProviderUserToken = await ProvidersUsersTokensController.getProviderUserTokenByID(providerTokenID);

    if(!db_ProviderUserToken){
        return handleErrorResponse(res, 'No access token is accessible');
    }

    const providerToken = db_ProviderUserToken.dataValues.jwttoken;

    try {
        const decoded = await verifyToken(providerToken, JWT_SECRET_KEY);
        req.connectedProvider = {
            ...await getProviderMethod(decoded.type),
            token: decoded.token,
            username: decoded.username,
            userid: decoded.userid
        };
        next();
    } catch (err) {
        handleErrorResponse(res, 'Invalid or expired token');
    }
};

module.exports = validateProviderToken;