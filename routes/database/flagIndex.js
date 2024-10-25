const express = require('express');
const router = express.Router();
const flagsValidatorController = require("../../controllers/flagsValidatorController");
const projectController = require("../../database/controllers/projectController");

router.put('/projects/:id',  async (req, res) => {
    const {id} = req.params;
    const {flag_file, filetype} = req.body;
    const { isFlagFile, flags} = flagsValidatorController.isValidFlagFile(flag_file, filetype);

    if(!isFlagFile){
        return res.status(400).json({
            error: "Not a valid flag file"
        });
    }

    const projectUpdated = await projectController.updateProjectFlags(id, flags)
    if(!projectUpdated){
        return res.status(400).json({
            error: "An error occurred while updating the project flags"
        })
    }

    return res.json({
        message: "Project flags updated successfully"
    })

})

router.get('/projects/:id', async (req, res) => {
    const {id} = req.params;
    const project = await projectController.getProjectById(id);
    if(!project){
        return res.status(400).json({
            error: "An error occurred while getting the project"
        })
    }

    res.json(project.flags);
});

module.exports = router;
