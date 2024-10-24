const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/authController');


router.get('/', (req, res) => {
    const githubAuthUrl = AuthController.getGithubAuthUrl();
    res.redirect(githubAuthUrl);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: 'Github code is missing, try again' });
    }

    try {
        const accessToken = await AuthController.handleOAuthCallback(code);
        // console.log(accessToken);
        res.cookie('FF_access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'None' });
        //res.json({ message: 'Access token stored in cookie' });
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
        console.log(error);
    }
});

router.get('/logout',(req, res) => {
    res.clearCookie('access_token', { path: '/', sameSite: 'None', secure: true });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;