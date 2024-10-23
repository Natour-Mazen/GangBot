const axios = require('axios');
const dotenv = require('dotenv');
const getDatabase = require("../database/config");

dotenv.config();

// Retrieve environment variables
const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = process.env;

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

    static async getBranches(connectedUser, repo) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${connectedUser.name}/${repo}/branches`, {
                headers: {
                    'Authorization': `Bearer ${connectedUser.gitToken}`
                }
            });
            return {branches: response.data, error_code: response.status, message: ""};
        } catch (error) {
            return {branches: [], error_code: error.response.status, message: error.response.data.message};
        }
    }
}

module.exports = GithubController;