const axios = require('axios');
const dotenv = require('dotenv');
const getDatabase = require("../database/config");

dotenv.config();

// Retrieve environment variables
const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = process.env;

class GithubController {

    static async getRepos(accessToken) {
        try {
            const response = await axios.get(`https://api.github.com/user/repos`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    visibility: 'all',
                }
            });
            return {repos: response.data, response_code: response.status, message: ""};
        } catch (error) {
            return {repos: [], response_code: error.response.status, message: error.response.data.message};
        }
    }

    static async getBranches(connectedUser, repo) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${connectedUser.name}/${repo}/branches`, {
                headers: {
                    'Authorization': `Bearer ${connectedUser.gitToken}`
                }
            });
            return {branches: response.data, response_code: response.status, message: ""};
        } catch (error) {
            return {branches: [], response_code: error.response.status, message: error.response.data.message};
        }
    }

    static async getFlagFile(connectedUser, reqInfo) {
        const { repoOwner, repoName, filePath, branch } = reqInfo;

        if (!repoOwner || !repoName || !filePath) {
            return {FlagFile: {}, response_code: 400, message: 'Missing repoOwner, repoName, or filePath query parameter'};
        }

        try {
            const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
                headers: {
                    Authorization: `Bearer ${connectedUser.gitToken}`,
                    Accept: 'application/vnd.github.v3.raw' // Ce header assure que le contenu du fichier est retourné en texte brut
                },
                params: {
                    ref: branch || 'main' // Utilise la branche spécifiée ou 'main' par défaut
                }
            });
            return {FlagFile: response.data, response_code: response.status, message: ""};
        } catch (error) {
            return {FlagFile: {}, response_code: error.response.status, message: error.response.data.message};
        }
    }
}

module.exports = GithubController;