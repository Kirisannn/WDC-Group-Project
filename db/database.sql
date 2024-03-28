CREATE DATABASE `our_database`;
USE `our_database`;

-- Table structure for table `Users`
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `User_Id` varchar(50) NOT NULL,
  `User_FirstName` varchar(50) NOT NULL,
  `User_LastName` varchar(50) NOT NULL,
  `User_Password` varchar(100) NOT NULL,
  `User_Privileges` varchar(50) DEFAULT NULL,
  `User_PhoneNumber` varchar(20) DEFAULT NULL,
  `User_Email` varchar(100) DEFAULT NULL,
  `Email_Notification` tinyint(1) DEFAULT NULL,
  `Logged_in` tinyint(1) DEFAULT NULL,
  `User_PFP` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`User_Id`)
);
SHOW WARNINGS;

-- Table structure for table `Clubs`
DROP TABLE IF EXISTS `Clubs`;
CREATE TABLE `Clubs` (
  `Club_ID` int NOT NULL,
  `Club_Name` varchar(100) NOT NULL,
  `Club_Registration` varchar(50) DEFAULT NULL,
  `Club_Category` varchar(50) DEFAULT NULL,
  `Club_Manager` varchar(50) DEFAULT NULL,
  `Club_Posts` int DEFAULT NULL,
  `Club_Events` int DEFAULT NULL,
  `Club_Link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Club_ID`),
  FOREIGN KEY (`Club_Manager`) REFERENCES `Users` (`User_Id`)
);
SHOW WARNINGS;

-- Table structure for table `Club_Events`
DROP TABLE IF EXISTS `Club_Events`;
CREATE TABLE `Club_Events` (
  `Event_ID` int NOT NULL,
  `Club_ID` int NOT NULL,
  `Event_Name` varchar(100) NOT NULL,
  `Event_Date` date NOT NULL,
  `Event_Time` time NOT NULL,
  `Event_Venue` varchar(100) NOT NULL,
  `Event_Capacity` int NOT NULL,
  `RSVP_Count` int NOT NULL DEFAULT '0',
  `Event_Description` varchar(1500) DEFAULT NULL,
  PRIMARY KEY (`Event_ID`),
  FOREIGN KEY (`Club_ID`) REFERENCES `Clubs` (`Club_ID`)
);
SHOW WARNINGS;

-- Table structure for table `Event_Participants`
DROP TABLE IF EXISTS `Event_Participants`;
CREATE TABLE `Event_Participants` (
  `Event_ID` int NOT NULL,
  `User_Id` varchar(50) NOT NULL,
  PRIMARY KEY (`Event_ID`,`User_Id`),
  FOREIGN KEY (`User_Id`) REFERENCES `Users` (`User_Id`)
);
SHOW WARNINGS;

-- Table structure for table `Club_Posts`
DROP TABLE IF EXISTS `Club_Posts`;
CREATE TABLE `Club_Posts` (
  `Post_ID` int NOT NULL,
  `Club_ID` int NOT NULL,
  `Poster_ID` varchar(50) DEFAULT NULL,
  `Post_Title` varchar(100) NOT NULL,
  `Post_Date` date NOT NULL,
  `Post_Time` time NOT NULL,
  `Post_Content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Post_ID`),
  FOREIGN KEY (`Club_ID`) REFERENCES `Clubs` (`Club_ID`),
  FOREIGN KEY (`Poster_ID`) REFERENCES `Users` (`User_Id`)
);
SHOW WARNINGS;

DROP TABLE IF EXISTS `User_Clubs`;
CREATE TABLE `User_Clubs` (
  `User_Id` varchar(50) NOT NULL,
  `Club_ID` int NOT NULL,
  PRIMARY KEY (`User_Id`,`Club_ID`),
  FOREIGN KEY (`User_Id`) REFERENCES `Users` (`User_Id`),
  FOREIGN KEY (`Club_ID`) REFERENCES `Clubs` (`Club_ID`)
);
SHOW WARNINGS;

DROP TABLE IF EXISTS `Club_Managers`;
CREATE TABLE `Club_Managers` (
  `User_Id` varchar(50) NOT NULL,
  `Club_ID` int NOT NULL,
  PRIMARY KEY (`User_Id`,`Club_ID`),
  FOREIGN KEY (`User_Id`) REFERENCES `Users` (`User_Id`),
  FOREIGN KEY (`Club_ID`) REFERENCES `Clubs` (`Club_ID`)
);
SHOW WARNINGS;
