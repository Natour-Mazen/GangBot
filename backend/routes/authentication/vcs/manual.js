const express = require('express');
const ManualProvider = require("../../../controllers/authentication/manual");
const {setAuthCookie} = require("../../../handlers/authCookie");
const router = express.Router();


router.post('/create', async (req, res) => {
    const {email, password, username} = req.body;
    if(!email || !password || !username){
        return res.status(400).json({
            error: "Missing email, password or username"
        });
    }
    const provider = new ManualProvider();
    try {
        const accessToken = await provider.handleCreateAuth(email, password, username);
        setAuthCookie(res, accessToken);
    } catch (error) {
       res.status(400).json({
           error: "An error occurred while creating the user"
       });
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password ){
        return res.status(400).json({
            error: "Missing email or password"
        });
    }
    const provider = new ManualProvider();
    try {
        const accessToken = await provider.handleLoginAuth(email, password);
        setAuthCookie(res, accessToken);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});




module.exports = router;