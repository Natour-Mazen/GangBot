const express = require('express');
const ManualProvider = require("../../../providers/manual");
const {setAuthCookieAndRedirectHandler} = require("../../../handlers/authCookieAndRedirect");
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
        setAuthCookieAndRedirectHandler(res, accessToken);
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
        setAuthCookieAndRedirectHandler(res, accessToken);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});




module.exports = router;