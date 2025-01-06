DROP TABLE IF EXISTS organizationProjects;
DROP TABLE IF EXISTS organizationUsers;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS userGroups;
DROP TABLE IF EXISTS accessGroup;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS authUsersTokens;
DROP TABLE IF EXISTS providersAuthUsersTokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS providerMethods;

CREATE TABLE providerMethods(
    id UUID PRIMARY KEY,
    providerName VARCHAR(50) NOT NULL,
    CONSTRAINT unique_providerName
        UNIQUE (providerName)
);

CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    creationUserMethod UUID NOT NULL,
    CONSTRAINT fk_creationUserMethod
        FOREIGN KEY(creationUserMethod)
            REFERENCES providerMethods(id),
    CONSTRAINT unique_emailCreationUserMethod
        UNIQUE (email, creationUserMethod)
);

CREATE TABLE authUsersTokens(
    id UUID PRIMARY KEY,
    userId UUID NOT NULL,
    authenticationMethod UUID NOT NULL,
    jwtToken VARCHAR(1000) NOT NULL,
    CONSTRAINT fk_user
       FOREIGN KEY(userId)
           REFERENCES users(id),
    CONSTRAINT fk_authenticationMethod
       FOREIGN KEY(authenticationMethod)
           REFERENCES providerMethods(id)
);

CREATE TABLE providersAuthUsersTokens(
   id UUID PRIMARY KEY,
   providerMethod UUID NOT NULL,
   jwtToken VARCHAR(1000) NOT NULL,
   CONSTRAINT fk_providerAuthenticationMethod
       FOREIGN KEY(providerMethod)
           REFERENCES providerMethods(id),
   CONSTRAINT unique_providerMethod_jwtToken
           UNIQUE (providerMethod, jwtToken)
);

CREATE TABLE projects(
    id UUID PRIMARY KEY,
    userId UUID NOT NULL,
    importMethodID UUID NOT NULL,
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
        FOREIGN KEY(importMethodID)
            REFERENCES providerMethods(id),
    CONSTRAINT unique_repo_branch
     UNIQUE (name, environment)
);

CREATE TABLE accessGroup(
    id SERIAL PRIMARY KEY,
    groupName VARCHAR(100) NOT NULL,
    CONSTRAINT unique_groupName
        UNIQUE (groupName)
);

CREATE TABLE userGroups(
    userId UUID,
    groupId SERIAL,
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
    organizationName VARCHAR(100) NOT NULL,
    organizationDescription VARCHAR(500),
    creationDate TIMESTAMP NOT NULL,
    creatorId UUID NOT NULL,
    CONSTRAINT fk_creator
        FOREIGN KEY(creatorId)
            REFERENCES users(id),
    CONSTRAINT unique_organizationNameCreator
        UNIQUE (organizationName, creatorId)

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