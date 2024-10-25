const express = require('express');
const router = express.Router();
const flagsValidatorController = require("../../controllers/flagsValidatorController");
const projectController = require("../../database/controllers/projectController");

router.post('/project',  async (req, res) => {
    const {flag_file, filetype, id} = req.body;
    const { isFlagFile, flags} = flagsValidatorController.isValidFlagFile(flag_file, filetype);

    if(!isFlagFile){
        return res.status(400).send("Not a valid flag file");
    }

    const project = await projectController.getProjectById(id);
    if(project === null) return res.json({saved: false, error: "Project not found"});
    const flag = await project.updateProject(project.id, project.projectname, flags);

    res.json({saved: flag, error: ""});
})

router.get('/project/:id', async (req, res) => {
    const id = req.params['id'];
    const project = await projectController.getProjectById(id);
    res.json(project.flags);
});

module.exports = router;
