const express = require('express');
const router = express.Router();
const GithubController = require('../../controllers/githubController');
const authJWTMiddleware = require("../../middlewares/authTokenJWT");
router.get('/get-repos', authJWTMiddleware() , async (req, res) => {
    const repos = await GithubController.getRepos(req.connectedUser.gitToken);
    res.json(repos);
})

module.exports = router;