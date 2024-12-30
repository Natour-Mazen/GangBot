const express = require('express');
const router = express.Router();
const projectController = require("../../../database/controllers/projectController");
const providerMethodsController = require("../../../database/controllers/providerMethodsController");
const flagsRouter = require('./flags');

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

    for(let project of projects){
        const importID = project.dataValues.importmethodid;
        const importMethod = await providerMethodsController.getProviderMethodById(importID);
        project.dataValues.importmethod = importMethod.dataValues.providername;
        delete project.dataValues.importmethodid;
    }

    res.json({
        projects,
        currentPage: page,
        totalPages
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

router.post('/', async (req, res) => {
    const {name, environment, importMethodeID} = req.body;

    const [_, created, error_message] = await projectController.createProject(req.connectedUser.id, name, name, environment, importMethodeID); // we use the repoName as default projectName

    if(!created){
        return res.status(400).json({
            error: error_message !== "" ? error_message : "An error occurred while creating the project"
        })
    }

    return res.json({
        message : "Project created successfully",
    });
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

router.use('/flags', flagsRouter);

module.exports = router;