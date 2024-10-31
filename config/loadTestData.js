const fs = require('fs');
const path = require('path');
// Adjust the path as necessary
const getDatabase = require("../database/config");

async function loadTestData() {

    const { models } = await getDatabase();

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data_test.json'), 'utf8'));


    for (const userData of data.users) {
    await models.users.findOrCreate({
      where: { email: userData.email },
      defaults: userData
    });
    }

    for (const projectData of data.projects) {
    await models.projects.findOrCreate({
      where: { apikey: projectData.apikey },
      defaults: projectData
    });
    }


    console.log('Test data loaded successfully');
}

module.exports = loadTestData;