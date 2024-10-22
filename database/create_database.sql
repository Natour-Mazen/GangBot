DROP TABLE IF EXISTS flags;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	githubUsername VARCHAR(40), --maximum github username is 39 chars (see https://github.com/shinnn/github-username-regex)
	githubId BIGINT,
	jwtToken VARCHAR(1000) --maximum length is 255 (see https://github.blog/changelog/2021-03-04-authentication-token-format-updates/)
);

CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	userId SERIAL,
	CONSTRAINT fk_projects
   		FOREIGN KEY(userId) 
   		REFERENCES users(id)
);

CREATE TABLE flags(
	id SERIAL PRIMARY KEY,
	projectId SERIAL,
	content JSON,
	CONSTRAINT fk_flags
   		FOREIGN KEY(projectId) 
   		REFERENCES projects(id)
);