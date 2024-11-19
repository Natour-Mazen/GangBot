const getDatabase = require("../database/config");
const dotenv = require('dotenv');
dotenv.config();
const { JWT_SECRET_KEY } = process.env;


class VCSProvider {

    constructor(provType) {
        if (new.target === VCSProvider) {
            throw new TypeError("Cannot construct VCSProvider instances directly");
        }
        this.JWT_SECRET_KEY = JWT_SECRET_KEY;
        this.providerType = provType;
    }

    getAuthUrl() {
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

    generateJwtToken(providerUser, db_user, access_token) {
        throw new Error("generateJwtToken Must override method");
    }

    async handleOAuthCallback(code) {
        try {
            const accessToken = await this.exchangeCodeForAccessToken(code);
            const providerUser = await this.fetchUserInfo(accessToken);
            const providerUserEmail = await this.fetchUserEmail(accessToken);
            const db_user = await this.createOrUpdateUserInDB(providerUser, providerUserEmail);
            const jwtToken = this.generateJwtToken(providerUser, db_user, accessToken);
            await this.createOrUpdateUserTokenInDB(db_user, jwtToken);
            return jwtToken;
        } catch (err) {
            throw err;
        }
    }

    async createOrUpdateUserTokenInDB(db_user, newJwtToken) {
        const { models } = await getDatabase();
        const providerMethod = await models.providermethods.findOne({
            where: {
                providername: this.providerType
            }
        });

        if (!providerMethod) {
            throw new Error('VCSProvider method not found');
        }

        const [userToken, tokenCreated] = await models.usertokens.findOrCreate({
            where: {
                userid: db_user.id,
                authenticationmethod: providerMethod.id
            },
            defaults: {
                userid: db_user.id,
                authenticationmethod: providerMethod.id,
                jwttoken: newJwtToken
            }
        });

        if (!tokenCreated && userToken.jwttoken !== newJwtToken) {
            await userToken.update({
                jwttoken: newJwtToken
            });
        }

        return userToken;
    }

}

module.exports = VCSProvider;