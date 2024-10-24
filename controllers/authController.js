const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const getDatabase = require("../database/config");

dotenv.config();

// Retrieve environment variables
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET_KEY } = process.env;

class AuthController {
    // Get GitHub authorization URL
    static getGithubAuthUrl() {
        const scope = 'repo';
        return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}`;
    }

    // Exchange authorization code for access token
    static async #exchangeCodeForAccessToken(code) {
        const response = await axios.post('https://github.com/login/oauth/access_token', null, {
            params: {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code
            },
            headers: {
                'Accept': 'application/json'
            }
        });
        return response.data.access_token;
    }

    static async #fetchUserInfo(accessToken) {
        const fetched_user = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return fetched_user.data;

    }

    // Create a new user object in the database
    static async #createOrUpdateUserInDB(newJwtToken, githubUser) {
        // Get the database models
        const { models } = await getDatabase();
        const [db_user, created] = await models.users.findOrCreate({
            where: {
                githubid: githubUser.id
            },
            defaults: {
                githubusername: githubUser.login,
                jwttoken: newJwtToken,
                githubid: githubUser.id
            }
        });

        if (!created) {
            //if user already exists, update his access token if it's different
            if (db_user.jwttoken !== newJwtToken) {
                await db_user.update({
                    jwttoken: newJwtToken
                });
            }
        }

    }


    // // Generate JWT for the user
    static #generateJwtToken(githubUser, access_token) {
        const expirationDate = new Date(Date.now() + (4 * 60 * 60 * 1000)); // 4 hours in milliseconds
        const tokenPayload = {
            githubID: githubUser.id,
            githubName: githubUser.login,
            githubToken: access_token,
            exp: expirationDate.getTime() / 1000
        };
        return jwt.sign(tokenPayload, JWT_SECRET_KEY);
    }

    // Handle OAuth2 callback from GitHub
    static async handleOAuthCallback(code) {
        try {

            // Exchange the authorization code for access token from GitHub
            const accessToken = await AuthController.#exchangeCodeForAccessToken(code);

            const githubUser = await AuthController.#fetchUserInfo(accessToken);

            const jwtToken = AuthController.#generateJwtToken(githubUser, accessToken);

            await AuthController.#createOrUpdateUserInDB(jwtToken, githubUser);

            // Return the jwt token
            return jwtToken;
        } catch (err) {
            throw err;
        }
    }

    static async getUserProfileInfos(connectedUser){
        try {
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${connectedUser.gitToken}`
                }
            });
            return {userData: userResponse.data, response_code: userResponse.status, message: ""};
        } catch (error) {
            return {userData: [], response_code: error.response.status, message: error.response.data.message};
        }
    }
}

module.exports = AuthController;