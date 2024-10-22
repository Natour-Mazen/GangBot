const axios = require('axios');
const dotenv = require('dotenv');
const getDatabase = require("../database/config");

dotenv.config();

// Retrieve environment variables
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

class GithubController {

    static async getRepos(accessToken) {
        const response = await axios.get(`https://api.github.com/user/repos`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                visibility: 'all',
            }
        });
        return response.data;
    }
}

module.exports = GithubController;