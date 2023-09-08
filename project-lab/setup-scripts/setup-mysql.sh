#!/bin/bash
############################ FIRST TIME CONFIGURATION ###################################
# IF YOU DON'T HAVE MYSQL/NPM/GIT INSTALLED RUN THE FOLLOWING COMMANDS:
sudo apt-get update -y && sudo apt-get install mysql-server git npm -y
# CLONE THE REPO AND CHECKOUT THE RIGHT BRANCH
git clone https://github.com/pmfs1/crazy-teacher.git
git checkout project-lab
# AND START THE MYSQL SERVICE:
# FOR GITHUB DEVCONTAINER:
sudo service mysql start
# OTHERWISE:
sudo systemctl start mysql.service
# THEN ACCESS THE MYSQL SHELL, USING 'password' AS THE PASSWORD:
sudo mysql -u root -p
# THEN RUN THE FOLLOWING COMMAND TO ALTER THE ROOT USER'S PROPERTIES:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# WHILE YOU ARE AT IT, GO TO THE SETUP-DATABASE.SQL FILE AND RUN ALL THE COMMANDS IN THERE TO CREATE THE DATABASES AND TABLES YOU NEED.
# (THOSE COMMANDS ARE ALSO BELOW:)

# CREATE DATABASE IF NOT EXISTS `DATABASE`;
# USE `DATABASE`;
# CREATE TABLE IF NOT EXISTS `USERS` (
#  `NAME` varchar(255) NOT NULL,
#  `TOKEN` varchar(255) NOT NULL,
#  PRIMARY KEY (`NAME`)
#) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
#INSERT INTO `USERS` VALUES ('admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOQU1FIjoiYWRtaW4iLCJQSU4iOiIxMjM0IiwiaWF0IjoxNjg3NDMzNDE2fQ.m9fF4KxmhMg3jsRHthxAimCowU_A_2uzeuP6--CZRDg');

# THEN EXIT THE MYSQL SHELL:
exit
# CHECK THE STATUS OF THE MYSQL SERVICE:
sudo service mysql status
# GO TO crazy-teacher FOLDER
cd crazy-teacher
# AFTER THAT ALL YOU NEED TO DO IS INSTALL THE DEPENDENCIES AND RUN THE CODE:
npm i
npm run build
# GO TO https://127.0.0.1:3002 TO ACCESS THE SITE

############################ IF YOU HAVE ALREADY SETUP THE DATABASE ONCE #######################
# ...ALL YOU NEED TO DO EVERYTIME BEFORE YOU RUN THE CODE (IN THE DIFERENT DEPLOYMENTS) IS, RUN:
# 1. START THE DATABASE SERVICE
sudo service mysql start
# 2. CHECK THE STATUS OF THE MYSQL SERVICE:
sudo service mysql status
# 3. GO TO crazy-teacher FOLDER
cd crazy-teacher
# 4. AFTER THAT ALL YOU NEED TO DO IS RUN:
npm run build
# AND GO TO https://127.0.0.1:3002 TO ACCESS THE SITE