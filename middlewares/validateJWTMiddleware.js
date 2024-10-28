const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../database/controllers/userController');
const GroupController = require('../database/controllers/groupController');

// Load environment variables from .env file
dotenv.config();
const { JWT_SECRET_KEY, APP_MODE } = process.env;

const validateJWTMiddleware = () => (req, res, next) => {
    // Get the 'access Token' cookie from the request
    const accessToken = req.cookies.ff_access_token;

    if (!accessToken) {
       // console.log('No access token');
        if(APP_MODE === 'Dev') {
            return res.status(401).json({ message: 'No access token' });
        }else if(APP_MODE === 'Prod'){
            return res.redirect('/auth');
        }else {
            throw new Error('APP_MODE not set');
        }

    }

    // Verify the token
    jwt.verify(accessToken, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            if(APP_MODE === 'Dev') {
                return res.status(401).json({message: 'Invalid or expired token'});
            }else if(APP_MODE === 'Prod'){
                return res.redirect('/auth');
            }else {
                throw new Error('APP_MODE not set');
            }
        }

        const db_User = await UserController.getUserByGitHubId(decoded.githubID);

        if(!db_User){
            if(APP_MODE === 'Dev') {
                return res.status(401).json({message: 'User not found'});
            }else if(APP_MODE === 'Prod'){
                return res.redirect('/auth');
            }else {
                throw new Error('APP_MODE not set');
            }
        }

        //get user's groups
        const groups = await GroupController.getGroupsNamesByUserId(db_User.dataValues.id);

        //Add the user to the request to use it more easily
        req.connectedUser = {
            id : db_User.dataValues.id,
            gitID: decoded.githubID,
            gitName: decoded.githubName,
            gitToken: decoded.githubToken,
            groups: groups.map(group => group.dataValues.groupname),
        };

        // Move to the next function (middleware or route manager)
        next();
    });
};

module.exports = validateJWTMiddleware;