const express = require('express');
const axios = require('axios');
const router = express.Router();
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const getDatabase = require('../database/config');


router.get('/', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`;
    res.redirect(githubAuthUrl);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: 'Github code is missing, try again' });
    }

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', null, {
            params: {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const accessToken = response.data.access_token;

        //add user to database if he doesn't exist or update his access token
        const { models } = await getDatabase();
        //get user from github
        const fetched_user = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const [db_user, created] = await models.users.findOrCreate({
            where: {
                githubid: fetched_user.data.id
            },
            defaults: {
                githubusername: fetched_user.data.login,
                githubtoken: accessToken,
                githubid: fetched_user.data.id
            }
        });

        if (!created) {
            //if user already exists, update his access token if it's different
            if (db_user.githubtoken !== accessToken) {
                await db_user.update({
                    githubtoken: accessToken
                });
            }   
        } 

        res.cookie('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'None' });
        res.json({ message: 'Access token stored in cookie' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
        console.log(error);
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.clearCookie('access_token', { path: '/', sameSite: 'None', secure: true });
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;