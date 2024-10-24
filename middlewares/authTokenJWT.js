const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
const { JWT_SECRET_KEY, APP_MODE } = process.env;

const authJWTMiddleware = () => (req, res, next) => {
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

        //Add the user to the request to use it more easily
        req.connectedUser = {
            id: decoded.githubID,
            name: decoded.githubName,
            gitToken: decoded.githubToken,
        };

        // Move to the next function (middleware or route manager)
        next();
    });
};

module.exports = authJWTMiddleware;