const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authJWTMiddleware = () => (req, res, next) => {
    // Get the 'access Token' cookie from the request
    const accessToken = req.cookies.access_token;

    if (!accessToken && req.path !== '/auth' && req.path !== '/auth/callback') {
        return res.redirect('/auth');
    }

    // Verify the token
    jwt.verify(accessToken, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            //return res.status(401).json({message: 'Invalid or expired token'});
            return res.redirect('/auth');
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