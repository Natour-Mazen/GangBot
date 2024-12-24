const getDatabase = require("../../database/config");
const dotenv = require('dotenv');
const ProviderTypes = require("./providerTypes");
const {sign} = require("jsonwebtoken");
const UserController = require("../../database/controllers/usersController");
const ProviderMethodsController = require("../../database/controllers/providerMethodsController");
const UserTokensController = require("../../database/controllers/authUsersTokensController");
dotenv.config();

class ManualProvider {

    constructor() {
        this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        this.providerType = ProviderTypes.SERLI;
    }

    generateJwtToken(user) {
        const expirationDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
        const payload = {
            id: user.id,
            vcsID: -1,
            vcsName: user.username,
            vcsToken: '',
            vcsProvider: this.providerType,
            exp: Math.floor(expirationDate.getTime() / 1000)
        };
        return sign(payload, this.JWT_SECRET_KEY);
    }

    async createOrUpdateUserTokenInDB(user, newJwtToken) {

        const providerMethod = await ProviderMethodsController.getProviderMethodByName(this.providerType);

        if (!providerMethod) {
            throw new Error('Provider method not found');
        }

        const [userToken, tokenCreated]  = await UserTokensController.findOrCreateUserToken(user.id, providerMethod.id, newJwtToken);

        if (!tokenCreated && userToken.jwttoken !== newJwtToken) {
            await UserTokensController.updateUserToken(userToken, newJwtToken);
        }
    }

    async handleCreateAuth(email, password, username) {
        try {
            const providerMethod = await ProviderMethodsController.getProviderMethodByName(this.providerType);
            const db_user = await UserController.createManualUser(email, password, username, providerMethod.id);
            const token = this.generateJwtToken(db_user);
            await this.createOrUpdateUserTokenInDB(db_user, token);
            return token;
        } catch (err) {
            throw err;
        }
    }

    async handleLoginAuth(email, password) {
        try {
            const providerMethod = await ProviderMethodsController.getProviderMethodByName(this.providerType);
            const db_user = await UserController.findManualUser(email, password, providerMethod.id);
            const token = this.generateJwtToken(db_user);
            await this.createOrUpdateUserTokenInDB(db_user, token);
            return token;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = ManualProvider;