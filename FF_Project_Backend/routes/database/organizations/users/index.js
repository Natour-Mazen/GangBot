const express = require('express');
const router = express.Router();
const organizationUsersController = require("../../../../database/controllers/organizationUsersController");

// Route to get organizations the user belongs to
router.get('/belongs', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userID = req.connectedUser.id;

    const organizations = await organizationUsersController.getOrganizationsByUserId(userID, limit, offset);
    const totalOrganizations = await organizationUsersController.countOrganizationsByUserId(userID);
    const totalPages = Math.ceil(totalOrganizations / limit);

    if (!organizations) {
        return res.status(400).json({
            error: "An error occurred while getting the organizations you belong to"
        });
    }

    res.json({
        organizations,
        currentPage: page,
        totalPages
    });
});


module.exports = router;
