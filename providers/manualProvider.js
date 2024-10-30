const getDatabase = require("../database/config");
const dotenv = require('dotenv');
const ProviderTypes = require("./Types");
const {sign} = require("jsonwebtoken");
const UserController = require("../database/controllers/userController");
dotenv.config();

class ManualProvider {

    constructor() {
        this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        this.providerType = ProviderTypes.SERLI;
    }

    async createAndLoginUser(username, password, email) {
        const db_user = UserController.createUser(username, password, email);
        const token = this.generateJwtToken(db_user);
        await this.createOrUpdateUserTokenInDB(db_user, token);
        return token;

    }

    generateJwtToken(user) {
        const expirationDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
        const payload = {
            id: user.id,
            username: user.username,
            exp: Math.floor(expirationDate.getTime() / 1000)
        };
        return sign(payload, this.JWT_SECRET_KEY);
    }

    async createOrUpdateUserTokenInDB(user, newJwtToken) {
        const { models } = await getDatabase();
        const providerMethod = await models.providermethods.findOne({
            where: { providername: this.providerType }
        });

        if (!providerMethod) {
            throw new Error('Provider method not found');
        }

        const [userToken, tokenCreated] = await models.usertokens.findOrCreate({
            where: { userid: user.id, authenticationmethod: providerMethod.id },
            defaults: { userid: user.id, authenticationmethod: providerMethod.id, jwttoken: newJwtToken }
        });

        if (!tokenCreated && userToken.jwttoken !== newJwtToken) {
            await userToken.update({ jwttoken: newJwtToken });
        }

        return userToken;
    }

    async handleAuth(username, password, email) {
        try {
            return await this.createAndLoginUser(username, password, email);
        } catch (err) {
            throw err;
        }
    }


}

module.exports = ManualProvider;