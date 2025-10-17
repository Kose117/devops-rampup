CREATE DATABASE IF NOT EXISTS movie_db;
USE movie_db;

CREATE TABLE IF NOT EXISTS publications (
  name   VARCHAR(250) PRIMARY KEY,
  avatar VARCHAR(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviewers (
  name        VARCHAR(255) PRIMARY KEY,
  publication VARCHAR(250) NOT NULL,
  avatar      VARCHAR(250) NOT NULL,
  CONSTRAINT fk_reviewers_publication
    FOREIGN KEY (publication)
    REFERENCES publications(name)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movies (
  title       VARCHAR(250) PRIMARY KEY,
  `release`   VARCHAR(250) NOT NULL,
  score       INT NOT NULL,
  reviewer    VARCHAR(255) NOT NULL,
  publication VARCHAR(250) NOT NULL,
  CONSTRAINT fk_movies_reviewer
    FOREIGN KEY (reviewer)
    REFERENCES reviewers(name)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_movies_publication
    FOREIGN KEY (publication)
    REFERENCES publications(name)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
