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
        const { repo, branch } = reqInfo;

        if (!repo) {
            return {FlagFile: {}, response_code: 400, message: 'Missing repository name'};
        }

        const file_extension = ['json', 'yaml'];
        const file_name = 'flags';

        try {
            let response;
            for(const ext of file_extension){
                try{
                    const full_filename = file_name + '.' + ext;
                    response = await axios.get(`https://api.github.com/repos/${connectedUser.name}/${repo}/contents/${full_filename}`, {
                        headers: {
                            Authorization: `Bearer ${connectedUser.gitToken}`,
                            Accept: 'application/vnd.github+json'
                        },
                        params: {
                            ref: branch || 'main' // Utilise la branche spécifiée ou 'main' par défaut
                        }
                    });
                }catch(error){
                    if(error.response.status === 404) continue;
                    return {FlagFile: {}, response_code: error.response.status, message: error.response.data.message};
                }
                if(response && response.status === 200){
                    break;
                }
            }
            if(response && response.status <= 300) return {FlagFile: response.data, response_code: response.status, message: ""};
            return {FlagFile: {}, response_code: 404, message: "Flag file not found"};
        } catch (error) {
            console.log(error);
            return {FlagFile: {}, response_code: 500, message: "Internal Server Error"};
        }
    }
}

module.exports = GithubController;