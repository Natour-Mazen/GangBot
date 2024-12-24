const dotenv = require('dotenv');
dotenv.config();

const { JWT_SECRET_KEY } = process.env;

const ProviderMethodsController = require("../database/controllers/providerMethodsController");
const UserTokensController = require("../database/controllers/authUsersTokensController");
const ProvidersUsersTokensController = require("../database/controllers/providersAuthUsersTokensController");

class VCSProvider {

    constructor(provType) {
        if (new.target === VCSProvider) {
            throw new TypeError("Cannot construct VCSProvider instances directly");
        }
        this.JWT_SECRET_KEY = JWT_SECRET_KEY;
        this.providerType = provType;
    }

    getAuthUrl(redirect_uri) {
        throw new Error("getAuthUrl Must override method");
    }

    async exchangeCodeForAccessToken(code) {
        throw new Error("exchangeCodeForAccessToken Must override method");
    }

    async fetchUserInfo(accessToken) {
        throw new Error("fetchUserInfo Must override method");
    }

    async fetchUserEmail(accessToken) {
        throw new Error("fetchUserEmail Must override method");
    }

    async createOrUpdateUserInDB(providerUser, providerUserEmail) {
        throw new Error("createOrUpdateUserInDB Must override method");
    }

    generateJwtAuthToken(providerUser, db_user, access_token) {
        throw new Error("generateJwtToken Must override method");
    }

    generateJwtProviderToken(providerUser, access_token) {
        throw new Error("generateJwtProviderToken Must override method");
    }

    async handleOAuthCallback(code) {
        try {
            const accessToken = await this.exchangeCodeForAccessToken(code);
            const providerUser = await this.fetchUserInfo(accessToken);
            const providerUserEmail = await this.fetchUserEmail(accessToken);
            const db_user = await this.createOrUpdateUserInDB(providerUser, providerUserEmail);
            const jwtToken = this.generateJwtAuthToken(providerUser, db_user, accessToken);
            const db_UserToken = await this.createOrUpdateUserTokenInDB(db_user, jwtToken);
            return db_UserToken.dataValues.id; // we return the userToken id
        } catch (err) {
            throw err;
        }
    }

    async handleOAuthProviderCallback(code) {
        try{
            const accessToken = await this.exchangeCodeForAccessToken(code);
            const providerUser = await this.fetchUserInfo(accessToken);
            const providerToken = this.generateJwtProviderToken(providerUser, accessToken);
            const db_providerUserToken = await this.createOrUpdateProviderUserTokenInDB(providerToken);
            return db_providerUserToken.dataValues.id; // we return the userToken id
        } catch (e) {
            throw e;
        }

    }

    async createOrUpdateUserTokenInDB(db_user, newJwtToken) {
        const providerMethod = await ProviderMethodsController.getProviderMethodByName(this.providerType);

        if (!providerMethod) {
            throw new Error('VCSProvider method not found');
        }

        const [userToken, tokenCreated]  = await UserTokensController.findOrCreateUserToken(db_user.id, providerMethod.id, newJwtToken);

        if (!tokenCreated && userToken.jwttoken !== newJwtToken) {
            await UserTokensController.updateUserToken(userToken, newJwtToken);
        }

        return userToken;
    }

    async createOrUpdateProviderUserTokenInDB(newJwtToken) {
        const providerMethod = await ProviderMethodsController.getProviderMethodByName(this.providerType);

        if (!providerMethod) {
            throw new Error('VCSProvider method not found');
        }

        const [providerUserToken, tokenCreated]  = await ProvidersUsersTokensController.findOrCreateProviderUserToken(providerMethod.id, newJwtToken);

        if (!tokenCreated && providerUserToken.jwttoken !== newJwtToken) {
            await ProvidersUsersTokensController.updateProviderUserToken(providerUserToken, newJwtToken);
        }

        return providerUserToken;
    }

}

module.exports = VCSProvider;