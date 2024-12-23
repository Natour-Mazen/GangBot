const express = require('express');
const router = express.Router();
const OrganizationsUsersRouter = require("./users");
const OrganizationsProjectsRouter = require("./projects");
const organizationController = require("../../../database/controllers/organizationController");

const handleError = (res, message, status = 400) => {
    return res.status(status).json({ error: message });
};

const checkOrganizationExists = async (req, res, next) => {
    const { id } = req.params;
    const organization = await organizationController.getOrganizationByID(id);
    if (!organization) {
        return handleError(res, "An error occurred while getting the organization");
    }
    req.organization = organization;
    next();
};

const checkUserPermission = (req, res, next) => {
    const userID = req.connectedUser.id;
    if (req.organization.creatorid !== userID) {
        return handleError(res, "You are not allowed to access this organization", 403);
    }
    next();
};


router.use('/users', OrganizationsUsersRouter);
router.use('/projects', OrganizationsProjectsRouter);

// Route to get all organizations created by the user
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userID = req.connectedUser.id;

    const organizations = await organizationController.getAllOrganizationByCreatorId(userID, limit, offset);
    const totalOrganizations = await organizationController.countOrganizationByCreatorId(userID);
    const totalPages = Math.ceil(totalOrganizations / limit);

    if (!organizations) {
        return handleError(res, "An error occurred while getting your created organizations");
    }

    organizations.forEach(org => delete org.dataValues.creatorid);

    res.json({
        organizations,
        currentPage: page,
        totalPages
    });
});

// Route to get an organization by its ID
router.get('/:id', checkOrganizationExists, checkUserPermission, (req, res) => {
    res.json({
        organization: req.organization
    });
});

// Route to create an organization
router.post('/', async (req, res) => {
    const { organizationName, organizationDescription } = req.body;
    const connectedUserID = req.connectedUser.id;

    if (!organizationName || !organizationDescription) {
        return handleError(res, "Organization name and description are required");
    }

    const createdOrganization = await organizationController.findOrCreateOrganization(organizationName, organizationDescription, connectedUserID);

    if (!createdOrganization) {
        return handleError(res, "An error occurred while creating the organization");
    }

    res.json({
        message: "Organization created successfully",
        organization: createdOrganization
    });
});

// Route to delete an organization
router.delete('/:id', checkOrganizationExists, checkUserPermission, async (req, res) => {
    const deletedOrganization = await organizationController.deleteOrganizationById(req.params.id);

    if (!deletedOrganization) {
        return handleError(res, "An error occurred while deleting the organization");
    }

    res.json({
        message: "Organization deleted successfully"
    });
});

// Route to update an organization by its ID
router.put('/:id', checkOrganizationExists, checkUserPermission, async (req, res) => {
    const { organizationName, organizationDescription } = req.body;

    const updatedOrganization = await organizationController.updateOrganizationById(req.params.id, organizationName, organizationDescription);

    if (!updatedOrganization) {
        return handleError(res, "An error occurred while updating the organization");
    }

    res.json({
        message: "Organization updated successfully"
    });
});

module.exports = router;