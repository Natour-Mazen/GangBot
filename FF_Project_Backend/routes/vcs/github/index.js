const express = require('express');
const router = express.Router();
const Github = require('../../../controllers/VCS-APIs/github');
const handleResponse = require("../../../handlers/response");
const validateProviderTokenMiddleware = require("../../../middlewares/validateProviderToken")
const ProviderTypes = require("../../../controllers/authentication/providerTypes");

router.use(validateProviderTokenMiddleware(ProviderTypes.GITHUB))

router.get('/user', async (req, res) => {
    const {userData, response_code, message} = await Github.getUserProfileInfos(req.connectedProvider);
    handleResponse(res, userData, response_code, message);
})


router.get('/repos',  async (req, res) => {
    const {repos, response_code, message} = await Github.getRepos(req.connectedProvider);
    handleResponse(res, repos, response_code, message);
})

router.get('/branches',async (req, res) => {
    const repoName = req.query.repoName;
    const {branches, response_code, message} = await Github.getBranches(req.connectedProvider, repoName);
    handleResponse(res, branches, response_code, message);
})

router.get("/flag-file", async (req, res) => {
    const {repoName, branch, all_branch} = req.query;
    const connectedProvider = req.connectedProvider;
    let flagFiles = [];
    if(all_branch === "true"){
        const {branches, response_code, message} = await Github.getBranches(connectedProvider, repoName);
        if(response_code >= 400){
            return handleResponse(res, [], response_code, message);
        }
        for(const branch of branches) {
            const {
                flagFile,
                response_code,
                message
            } = await Github.getFlagFile(connectedProvider, repoName, branch.name);
            if(response_code >= 400){
                flagFiles.push({error: "could not get flag file for branch " + branch.name});
                continue;
            }
            flagFile.branch = branch.name;
            flagFiles.push(flagFile);
        }
    }else {
        const {flagFile, response_code, message} = await Github.getFlagFile(connectedProvider, repoName, branch);
        if(response_code >= 400){
            return handleResponse(res, [], response_code, message);
        }
        flagFiles.push(flagFile);
    }
    handleResponse(res, flagFiles, 200, "");
});


module.exports = router;