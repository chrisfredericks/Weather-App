-- MySQL dump 10.13  Distrib 5.5.9, for Win32 (x86)
--
-- Host: ftp.nscctruro.ca    Database: classsamples
-- ------------------------------------------------------
-- Server version	5.5.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblPortfolio`
--

DROP TABLE IF EXISTS `tblPortfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblPortfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sampleName` varchar(50) DEFAULT NULL,
  `sampleDescription` text,
  `sampleURL` varchar(50) DEFAULT NULL,
  `sampleImage` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblPortfolio`
--

LOCK TABLES `tblPortfolio` WRITE;
/*!40000 ALTER TABLE `tblPortfolio` DISABLE KEYS */;
INSERT INTO `tblPortfolio` VALUES (2,'ASP.NET Core Web App','An example of my first web app developed using ASP.NET Core. ASP.NET Core is a cross-platform, high-performance, open-source framework for building modern, cloud-based, Internet-connected applications.','https://docs.microsoft.com/en-us/aspnet/core/','image1.jpg'),(4,'Flexbox Page Layout Examples','The Flexbox Layout (Flexible Box) module (currently a W3C Last Call Working Draft) aims at providing a more efficient way to lay out, align and distribute space among items in a container, even when their size is unknown and/or dynamic (thus the word "flex").','https://css-tricks.com/snippets/css/a-guide-to-flexbox/','image2.jpg'),(5,'CSS Styling with Sass Examples','Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.','http://sass-lang.com/','image3.jpg'),(7,'Web Apps that implement Lodash','A modern JavaScript utility library delivering modularity, performance and extras.','https://lodash.com/','image5.jpg');
/*!40000 ALTER TABLE `tblPortfolio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-02-14 15:17:47
