DROP TABLE IF EXISTS organizationProjects;
DROP TABLE IF EXISTS organizationUsers;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS userGroups;
DROP TABLE IF EXISTS accessGroup;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS userTokens;
DROP TABLE IF EXISTS providerMethods;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE providerMethods(
    id UUID PRIMARY KEY,
    providerName VARCHAR(50) NOT NULL
);

CREATE TABLE userTokens(
    id UUID PRIMARY KEY,
    userId UUID NOT NULL,
    authenticationMethod UUID NOT NULL,
    jwToken VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user
       FOREIGN KEY(userId)
           REFERENCES users(id),
    CONSTRAINT fk_authenticationMethod
       FOREIGN KEY(authenticationMethod)
           REFERENCES providerMethods(id)
);

CREATE TABLE projects(
    id UUID PRIMARY KEY,
    userId UUID NOT NULL,
    importMethod UUID NOT NULL,
    projectName VARCHAR(200),
    name VARCHAR(200) NOT NULL,
    environment VARCHAR(250) NOT NULL,
    apiKey VARCHAR(250) UNIQUE NOT NULL,
    apiKeyExpirationDate TIMESTAMP,
    flags JSON,
    CONSTRAINT fk_projects
     FOREIGN KEY(userId)
         REFERENCES users(id),
    CONSTRAINT fk_importMethod
        FOREIGN KEY(importMethod)
            REFERENCES providerMethods(id),
    CONSTRAINT unique_repo_branch
     UNIQUE (name, environment)
);

CREATE TABLE accessGroup(
    id UUID PRIMARY KEY,
    groupName VARCHAR(100) NOT NULL
);

CREATE TABLE userGroups(
    userId UUID,
    groupId UUID,
    PRIMARY KEY (userId, groupId),
    CONSTRAINT fk_user
       FOREIGN KEY(userId)
           REFERENCES users(id),
    CONSTRAINT fk_group
       FOREIGN KEY(groupId)
           REFERENCES accessGroup(id)
);

CREATE TABLE organization(
    id UUID PRIMARY KEY,
    organizationName VARCHAR(100) NOT NULL
);

CREATE TABLE organizationUsers(
    organizationId UUID,
    userId UUID,
    PRIMARY KEY (organizationId, userId),
    CONSTRAINT fk_organization
        FOREIGN KEY(organizationId)
          REFERENCES organization(id),
    CONSTRAINT fk_group
        FOREIGN KEY(userId)
          REFERENCES users(id)
);

CREATE TABLE organizationProjects(
    organizationId UUID,
    projectId UUID,
    PRIMARY KEY (organizationId, projectId),
    CONSTRAINT fk_organization
     FOREIGN KEY(organizationId)
         REFERENCES organization(id),
    CONSTRAINT fk_project
     FOREIGN KEY(projectId)
         REFERENCES projects(id)
);