const fs = require('fs');
const path = require('path');
const getDatabase = require("../database/config");
const ProviderType = require("../providers/providerTypes");
const ProviderMethodsController = require("../database/controllers/providerMethodsController");
const AccessGroupController = require("../database/controllers/accessGroupController");

async function loadTestData() {

    const { models } = await getDatabase();

    for (const type of Object.values(ProviderType)) {
        try {
            await ProviderMethodsController.createProviderMethod(type);
        } catch (e) {
            await ProviderMethodsController.updateProviderMethod(type, type);
        }
    }

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data_test.json'), 'utf8'));


    for (const groupData of data.accessGroups) {

            await AccessGroupController.createGroup(groupData.groupname);

    }

    for (const providerData of data.providermethods) {
        await models.providermethods.upsert(providerData);
    }

    for (const userData of data.users) {
        await models.users.upsert(userData);
    }

    for (const projectData of data.projects) {
        await models.projects.upsert(projectData);

    }


    console.log('Test data loaded successfully');
}

module.exports = loadTestData;