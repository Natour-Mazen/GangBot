const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Retrieve environment variables
const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = process.env;

class GithubController {

    static async getRepos(connectedUser) {
        try {
            const response = await axios.get(`https://api.github.com/user/repos`, {
                headers: {
                    'Authorization': `Bearer ${connectedUser.vcsToken}`
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

    static async getRepoContent(connectedUser, repoName, branch) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${connectedUser.vcsName}/${repoName}/contents`, {
                headers: {
                    Authorization: `Bearer ${connectedUser.vcsToken}`,
                },
                params: {
                    ref: branch || 'main' // Utilise la branche spécifiée ou 'main' par défaut
                }
            });
            return {repoContent: response.data, response_code: response.status, message: ""};
        } catch (error) {
            return {repoContent: [], response_code: error.response.status, message: error.response.data.message};
        }
    }

    static async getBranches(connectedUser, repoName) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${connectedUser.vcsName}/${repoName}/branches`, {
                headers: {
                    'Authorization': `Bearer ${connectedUser.vcsToken}`
                }
            });
            return {branches: response.data, response_code: response.status, message: ""};
        } catch (error) {
            return {branches: [], response_code: error.response.status, message: error.response.data.message};
        }
    }

    static async getFlagFile(connectedUser, repoName, branch) {

        if (!repoName) {
            return {FlagFile: {}, response_code: 400, message: 'Missing repository name'};
        }

        const file_extension = ['json', 'yaml'];
        const file_name = 'flags';

        try {
            let response;
            for(const ext of file_extension){
                try{
                    const full_filename = file_name + '.' + ext;
                    response = await axios.get(`https://api.github.com/repos/${connectedUser.vcsName}/${repoName}/contents/${full_filename}`, {
                        headers: {
                            Authorization: `Bearer ${connectedUser.vcsToken}`,
                            Accept: 'application/vnd.github+json'
                        },
                        params: {
                            ref: branch || 'main' // Utilise la branche spécifiée ou 'main' par défaut
                        }
                    });
                }catch(error){
                    if(error.response.status === 404) continue;
                    return {flagFile: {}, response_code: error.response.status, message: error.response.data.message};
                }
                if(response && response.status === 200){
                    break;
                }
            }
            if(response && response.status <= 300) return {flagFile: response.data, response_code: response.status, message: ""};
            return {flagFile: {}, response_code: 404, message: "Flag file not found"};
        } catch (error) {
            console.log(error);
            return {flagFile: {}, response_code: 500, message: "Internal Server Error"};
        }
    }

    static async getUserProfileInfos(connectedUser){
        try {
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${connectedUser.vcsToken}`
                }
            });
            return {userData: userResponse.data, response_code: userResponse.status, message: ""};
        } catch (error) {
            return {userData: [], response_code: error.response.status, message: error.response.data.message};
        }
    }

}

module.exports = GithubController;