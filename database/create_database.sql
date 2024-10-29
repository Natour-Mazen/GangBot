DROP TABLE IF EXISTS userGroups;
DROP TABLE IF EXISTS accessGroup;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    githubUsername VARCHAR(40), --maximum github username is 39 chars (see https://github.com/shinnn/github-username-regex)
    githubId BIGINT,
    jwtToken VARCHAR(1000) --maximum length is 255 (see https://github.blog/changelog/2021-03-04-authentication-token-format-updates/)
);

CREATE TABLE projects(
     id uuid PRIMARY KEY,
     userId INT,
     projectName VARCHAR(200),
     repoName VARCHAR(200) NOT NULL,
     branch VARCHAR(250) NOT NULL,
     apiKey VARCHAR(250) UNIQUE NOT NULL,
     apiKeyExpirationDate TIMESTAMP,
     flags JSON,
     CONSTRAINT fk_projects
         FOREIGN KEY(userId)
             REFERENCES users(id),
     CONSTRAINT unique_repo_branch
         UNIQUE (repoName, branch)
);

CREATE TABLE accessGroup(
    id INT PRIMARY KEY,
    groupName VARCHAR(100) NOT NULL
);

CREATE TABLE userGroups(
    userId INT,
    groupId INT,
    PRIMARY KEY (userId, groupId),
    CONSTRAINT fk_user
       FOREIGN KEY(userId)
           REFERENCES users(id),
    CONSTRAINT fk_group
       FOREIGN KEY(groupId)
           REFERENCES accessGroup(id)
);