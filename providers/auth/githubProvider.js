const axios = require('axios');
const ProviderType = require("../providerTypes");
const {sign} = require("jsonwebtoken");
const VCSProvider = require("../vcsProvider");
const ProviderMethodsController  = require("../../database/controllers/providerMethodsController");
const UserGroupsController = require("../../database/controllers/userGroupsController");
const UsersController = require("../../database/controllers/usersController");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

class GithubProvider extends VCSProvider {

    constructor() {
        super(ProviderType.GITHUB);
    }

    getAuthUrl() {
        const scope = 'repo user:email';
        return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}`;
    }

    async exchangeCodeForAccessToken(code) {
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

    async fetchUserInfo(accessToken) {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    }

    async fetchUserEmail(accessToken) {
        const response = await axios.get('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const primaryEmail = response.data.find(email => email.primary && email.verified);
        return primaryEmail ? primaryEmail.email : null;
    }

    async createOrUpdateUserInDB(providerUser, providerUserEmail) {
        const providerMethod = await ProviderMethodsController.getProviderMethodByName(this.providerType);

        let [db_user, created] = await UsersController.createVCSUser(providerUser.login, providerUserEmail, providerMethod.id);

        if (created) {
            await UserGroupsController.addUserToDefaultGroup(db_user.id);
        }

        return db_user;
    }

    generateJwtToken(providerUser, db_user, access_token) {
        const expirationDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours in milliseconds
        const jwtPayload = {
            id: db_user.id,
            vcsID: providerUser.id,
            vcsName: providerUser.login,
            vcsToken: access_token,
            vcsProvider: this.providerType,
            exp: expirationDate.getTime() / 1000
        };
        return sign(jwtPayload, this.JWT_SECRET_KEY);
    }
}

module.exports = GithubProvider;