const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class ProviderMethodsController {

    /**
     * Create a new provider method or find an existing one.
     * @param {string} name - The name of the provider method.
     * @returns {Promise<Object>} - A promise that resolves to the provider method object.
     * @throws {Error} - Throws an error if the provider method cannot be created.
     */
    static async createProviderMethod(name) {
        const { models } = await getDatabase();

        const [providerMethod, created] = await models.providermethods.findOrCreate({
            where: {
                providername : name
            },
            defaults: {
                providername : name
            }
        });

        if (!providerMethod){
            throw new Error('Cannot create provider method');
        }

        return providerMethod;
    }

    /**
     * Retrieve a provider method by its name.
     * @param {string} name - The name of the provider method.
     * @returns {Promise<Object|null>} - A promise that resolves to the provider method object or null if not found.
     */
    static async getProviderMethodByName(name){
        const { models } = await getDatabase();
        return await models.providermethods.findOne({
            where: {
                providername : name
            }
        })
    }

    /**
     * Update the name of an existing provider method.
     * @param {string} oldName - The current name of the provider method.
     * @param {string} newName - The new name of the provider method.
     * @returns {Promise<number>} - A promise that resolves to the number of rows updated.
     */
    static async updateProviderMethod(oldName, newName){
        const { models } = await getDatabase();
        return await models.providermethods.update({
            providername: newName
        }, {
            where: {
                providername : oldName
            }
        });
    }

    /**
     * Delete a provider method by its name.
     * @param {string} name - The name of the provider method.
     * @returns {Promise<number>} - A promise that resolves to the number of rows deleted.
     */
    static async deleteProviderMethodByName(name){
        const { models } = await getDatabase();
        return await models.providermethods.destroy({
            where: {
                providername: name
            }
        });
    }

    /**
     * Retrieve all provider methods.
     * @returns {Promise<Array>} - A promise that resolves to an array of provider method objects.
     */
    static async getAllProviderMethods(){
        const { models } = await getDatabase();
        return await models.providermethods.findAll();
    }
}

module.exports = ProviderMethodsController;