DROP DATABASE IF EXISTS spielkatalog_db;
CREATE DATABASE spielkatalog_db;

USE spielkatalog_db;

CREATE TABLE users (
id int not null auto_increment,
username varchar(30) not null,
primary key (id)
);

CREATE TABLE catalog (
id int not null auto_increment,
username varchar(30) not null,
ownership varchar(8),
game_name varchar(255) not null,
image varchar(255),
platform varchar(20),
GBID varchar(12) not null,
GB_url varchar(255) not null,
summary varchar(500),
primary key (id)
);