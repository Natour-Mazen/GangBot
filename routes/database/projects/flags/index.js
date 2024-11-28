const express = require('express');
const router = express.Router();
const flagsValidator = require("../../../../utils/flagsValidator");
const projectController = require("../../../../database/controllers/projectController");

router.put('/:projectID',  async (req, res) => {
    const {projectID} = req.params;
    const {flagFile, fileType} = req.body;
    const { isFlagFile, flags} = flagsValidator.isValidFlagFile(flagFile, fileType);

    if(!isFlagFile){
        return res.status(400).json({
            error: "Not a valid flag file"
        });
    }

    const projectUpdated = await projectController.updateProjectFlags(projectID, flags)
    if(!projectUpdated){
        return res.status(400).json({
            error: "An error occurred while updating the project flags"
        })
    }

    return res.json({
        message: "Project flags updated successfully"
    })

})

router.get('/:projectID', async (req, res) => {
    const {projectID} = req.params;
    const project = await projectController.getProjectById(projectID);
    if(!project){
        return res.status(400).json({
            error: "An error occurred while getting the project"
        })
    }

    res.json(project.flags);
});

module.exports = router;
