const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../database/controllers/usersController');
const UserGroupsController = require('../database/controllers/userGroupsController');
const ProviderType = require("../providers/providerTypes");
const UserTokensController = require("../database/controllers/userTokensController");

// Load environment variables from .env file
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

const getUserGroups = async (userId) => {
    const groups = await UserGroupsController.getGroupsNamesByUserId(userId);
    return groups.map(group => group.dataValues.groupname);
};


const validateJWT = () => async (req, res, next) => {
    const accessToken = req.cookies.ff_access_token;

    if (!accessToken) {
        return handleErrorResponse(res, 'No access token');
    }

    jwt.verify(accessToken, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return handleErrorResponse(res, 'Invalid or expired token');
        }

        const db_UserToken = await UserTokensController.getUserTokenByJwtToken(accessToken);

        if(!db_UserToken){
            return handleErrorResponse(res, 'User token not found');
        }

        const db_User = await UserController.getUserById(decoded.id);

        if (!db_User) {
            return handleErrorResponse(res, 'User not found');
        }

        const groups = await getUserGroups(db_User.dataValues.id);


        req.connectedUser = {
            id: db_User.dataValues.id,
            vcsID: decoded.vcsID,
            vcsName: decoded.vcsName,
            vcsToken: decoded.vcsToken,
            vcsProvider: decoded.vcsProvider,
            groups,
        };


        next();
    });
};

module.exports = validateJWT;