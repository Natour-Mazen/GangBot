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
     repoName VARCHAR(200),
     branch VARCHAR(250),
     apiKey VARCHAR(250) UNIQUE NOT NULL,
     apiKeyExpirationDate TIMESTAMP,
     flags JSON,
     CONSTRAINT fk_projects
         FOREIGN KEY(userId)
             REFERENCES users(id)
);