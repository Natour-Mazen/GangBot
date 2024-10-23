const express = require('express');
const router = express.Router();
const GithubController = require('../../controllers/githubController');
const authJWTMiddleware = require("../../middlewares/authTokenJWT");


router.get('/get-repos', authJWTMiddleware() , async (req, res) => {
    const repos = await GithubController.getRepos(req.connectedUser.gitToken);
    res.json(repos);
})

router.get('/get-branches', authJWTMiddleware() , async (req, res) => {
    const repo = req.query.repo;
    const {branches, error_code, message} = await GithubController.getBranches(req.connectedUser, repo);
    if(error_code >= 400) {
        return res.status(error_code).json({message: message});
    }
    return res.json(branches);
})

module.exports = router;
