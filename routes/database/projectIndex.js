const express = require('express');
const router = express.Router();
const projectController = require("../../database/controllers/projectController");
const ProviderMethodsController = require("../../database/controllers/providerMethodsController");

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userID = req.connectedUser.id;

    const projects = await projectController.getProjectsByUserId(userID, limit, offset);
    const totalProjects = await projectController.countProjectsByUserId(userID);
    const totalPages = Math.ceil(totalProjects / limit);

    if (!projects) {
        return res.status(400).json({
            error: "An error occurred while getting the projects"
        });
    }

    // Filter the project object to remove some fields
    for (const project of projects) {
        delete project.dataValues.userid;
        delete project.dataValues.importmethodid;
    }

    res.json({
        projects,
        currentPage: page,
        totalPages
    });
});

router.post('/', async (req, res) => {
    const {name, environment} = req.body;
    const providerMethod = await ProviderMethodsController.getProviderMethodByName(req.connectedUser.vcsProvider);

    const [_, created, error_message] = await projectController.createProject(req.connectedUser.id, name, name, environment, providerMethod.id); // we use the repoName as default projectName

    if(!created){
        return res.status(400).json({
            error: error_message !== "" ? error_message : "An error occurred while creating the project"
        })
    }

    return res.json({
        message : "Project created successfully",
    });
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const project = await projectController.getProjectById(id)
    if(!project){
        return res.status(400).json({
            error: "An error occurred while getting the project"
        })
    }

    //filter the project object to remove some fields
    delete project.dataValues.userid;
    delete project.dataValues.importmethodid;

    return res.json({
        project : project
    })
});

router.put('/:id/projectName/:newName', async (req, res) => {
    const {id, newName} = req.params;
    const projectUpdated = await projectController.updateProjectName(id, newName)
    if(!projectUpdated){
        return res.status(400).json({
            error: "An error occurred while updating the project name"
        })
    }

    return res.json({
        message: "Project Name updated successfully"
    })
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { deleted, _ } = await projectController.deleteProject(id);

    if (!deleted) {
        return res.status(404).json({
            error: "Project not found or already deleted",
        });
    }

    return res.json({
        message: "Project deleted successfully"
    });
});

module.exports = router;
