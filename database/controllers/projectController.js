const dotenv = require('dotenv');
const getDatabase = require("../config");
dotenv.config();

class ProjectController {

    static generateUUID() {
        const uuid1 = crypto.randomUUID().replace(/-/g, '');
        const uuid2 = crypto.randomUUID().replace(/-/g, '');
        return uuid1 + uuid2;
    }

    /**
     * Try to create a new project in the database.
     * Retry 3 times if the generated API key is not unique or if the user can't be created.
     * return the project and a boolean indicating if it was created
     * */
    static async createProject(userId, projectName, repoName, branch) {
        const { models } = await getDatabase();
        let apiKey = ProjectController.generateUUID();
        const expDate = new Date().setFullYear(new Date().getFullYear() + 1);
        let project;
        let created = false;
        let tries = 3;
        while(!created && tries > 0){
            try {
                project = await models.projects.create({
                    userid: userId,
                    projectname: projectName,
                    reponame: repoName,
                    branch: branch,
                    apikey: apiKey,
                    apikeyexpirationdate: expDate,
                });
                created = true;
            }catch(e){
                console.log("Error creating user: ,", e);
                console.log("Regenerating API Key");
                apiKey = ProjectController.generateUUID();
                tries--;
            }
        }

        return [project, created];
    }

    /**
     * Search for a single instance. Returns the first instance found, or null if none can be found.
     */
    static async getProjectById(id) {
        const { models } = await getDatabase();
        return await models.projects.findOne({
            where: {id},
        });
    }


    /**
    * Update a project Flags in the database.
     * Return true if the project was updated, false otherwise
    * */
    static async updateProjectFlags(id, flags) {
        const project = await ProjectController.getProjectById(id);
        if(project === null) return false;
        await project.update({ flags: flags});
        return true;
    }

    /**
     * Update a project Name in the database.
     * Return true if the project was updated, false otherwise
     * */
    static async updateProjectName(id, projectName) {
        const project = await ProjectController.getProjectById(id);
        if(project === null) return false;
        await project.update({projectname: projectName});
        return true;
    }


    /**
     * Search for a single instance. Returns the first instance found, or null if none can be found.
     */
    static async getProjectByAPIKey(apiKey) {
        const { models } = await getDatabase();
        return await models.projects.findOne({
            where: {
                apikey: apiKey,
            }
        });
    }


    /**
     * Delete a project in the database.
     * */
    static async deleteProject(id) {
        const { models } = await getDatabase();

        try {
            const deletedCount = await models.projects.destroy({
                where: { id },
            });

            return {
                deleted: deletedCount > 0,
                deletedCount
            };
        } catch (error) {
            console.error("Error deleting project:", error);
            return {
                deleted: false,
                deletedCount: 0
            };
        }
    }

    /**
        * Get all projects for a specific user id in the database. null if none found.
     **/
    static async getProjectsByUserId(userId) {
        const { models } = await getDatabase();
        return await models.projects.findAll({
            where: {
                userid: userId,
            }
        });
    }

    /**
     * Get a project by the repo name and the user id
     * */
    static async getProjectByRepoNameAndBranch(userId, repoName, branch) {
        const { models } = await getDatabase();
        return await models.projects.findOne({
            where: {
                userid: userId,
                reponame: repoName,
                branch: branch
            }
        });
    }


    /**
     * Get the json object of all flags for a specific project id
     * */
    static async getFlagsByProjectId(id){
        const project = await ProjectController.getProjectById(id)
        if(!project){
            return [null, false];
        }

        return [project.flags, true];
    }

}

module.exports = ProjectController;