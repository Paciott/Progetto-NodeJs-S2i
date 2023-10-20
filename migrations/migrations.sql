CREATE DATABASE  IF NOT EXISTS `s2i_information_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `s2i_information_db`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: s2i_information_db
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `interactions`
--

DROP TABLE IF EXISTS `interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `author_id` int NOT NULL,
  `post_id` int NOT NULL,
  `content` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interactions`
--

LOCK TABLES `interactions` WRITE;
/*!40000 ALTER TABLE `interactions` DISABLE KEYS */;
INSERT INTO `interactions` VALUES (4,'like','2023-10-08 20:01:41.787','2023-10-08 20:01:41.787',10,2,NULL),(5,'like','2023-10-08 20:01:52.034','2023-10-08 20:01:52.034',5,2,NULL),(8,'comment','2023-10-13 20:20:27.500','2023-10-16 18:45:41.000',44,4,'Didn\'t get it, thumb down.'),(11,'comment','2023-10-13 20:23:37.201','2023-10-16 18:45:41.000',7,4,'Very useful! Love from NY!'),(13,'comment','2023-10-16 18:22:34.523','2023-10-16 18:35:21.000',9,1,'Cats are so funny!'),(14,'like','2023-10-16 18:24:19.650','2023-10-16 18:24:19.650',9,1,NULL),(15,'comment','2023-10-16 19:45:23.224','2023-10-16 19:45:23.224',1,23,'It is great! I love skating too!!'),(16,'like','2023-10-17 19:45:52.409','2023-10-17 19:45:52.409',1,23,NULL),(17,'like','2023-10-16 21:46:20.197','2023-10-16 21:46:20.197',46,23,NULL),(18,'like','2023-10-16 20:46:24.031','2023-10-16 20:46:24.031',48,23,NULL),(19,'like','2023-10-18 19:47:06.907','2023-10-18 19:47:06.907',5,23,NULL),(20,'like','2023-10-18 19:47:10.377','2023-10-18 19:47:10.377',6,23,NULL),(21,'like','2023-10-17 19:47:13.443','2023-10-17 19:47:13.443',7,23,NULL),(22,'like','2023-10-17 21:47:33.897','2023-10-17 21:47:33.897',7,25,NULL),(23,'comment','2023-10-18 12:47:55.272','2023-10-18 19:47:55.272',7,25,'My Tesla rocks!'),(24,'comment','2023-10-18 19:48:33.022','2023-10-18 20:48:33.022',46,25,'My MG sucks, so bad!'),(25,'comment','2023-10-18 19:51:13.788','2023-10-18 19:51:13.788',1,24,'Here in NY the weather is great!'),(26,'comment','2023-10-16 19:52:23.557','2023-10-16 19:52:23.557',20,19,'Cola is so filled with sugar! It is unhealty'),(27,'like','2023-10-16 19:52:49.262','2023-10-16 19:52:49.262',20,19,NULL),(28,'comment','2023-10-19 15:49:08.605','2023-10-19 15:49:08.605',1,25,'I love Teslas, I think Elon Musk is a genius!'),(29,'comment','2023-10-20 16:45:25.891','2023-10-20 16:45:25.891',4,25,'I hate electric cars!!!'),(30,'like','2023-10-18 16:46:33.547','2023-10-18 16:46:33.547',20,25,NULL),(31,'like','2023-10-18 18:21:40.411','2023-10-18 18:21:40.411',5,5,NULL);
/*!40000 ALTER TABLE `interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `author_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Kittens on the couch','2023-10-08 19:01:59.809','2023-10-08 14:30:45.123',1),(2,'War analisys','2023-10-08 19:03:02.405','2023-10-08 19:03:02.405',1),(3,'Dumplings recipe','2023-10-10 19:03:49.412','2023-10-10 19:03:49.412',20),(4,'How to change a tire','2023-10-12 19:04:20.647','2023-10-13 19:50:20.633',8),(5,'Mushroom cooking','2023-10-14 19:04:41.181','2023-10-14 20:04:41.181',8),(19,'Cola review','2023-10-16 16:49:34.083','2023-10-16 17:12:51.000',4),(22,'Flowers of my garden','2023-10-16 19:39:56.699','2023-10-16 19:39:56.699',45),(23,'My son skates a lot','2023-10-16 19:40:58.954','2023-10-16 19:40:58.954',30),(24,'Dallas weather','2023-10-17 19:42:37.336','2023-10-17 19:42:37.336',3),(25,'Electric cars, thoughts?','2023-10-17 19:43:15.217','2023-10-17 19:43:15.217',6),(26,'Best RV vehicles','2023-10-18 12:14:47.254','2023-10-18 12:14:47.254',20);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL,
  `age` int NOT NULL,
  `city` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'AliceInWonderland',28,'new york'),(2,'The Destroyer',35,'springfield'),(3,'DallasSalmon_2001',22,'dallas'),(4,'Nishikiyama_myLove',21,'tokyo'),(5,'Evelyne',31,'rome'),(6,'Anthony',25,'milan'),(7,'Taurus1825',30,'new york'),(8,'RobertLinnigan',22,'los angeles'),(9,'The_Swordman',44,'tokyo'),(10,'Gricia_Girl',35,'rome'),(20,'TheJackal',26,'naples'),(30,'Sergio_1980',55,'rome'),(43,'The_Boy_From_England',20,'london'),(44,'Jake_LabradorLover',19,'turin'),(45,'TonyMozzarella',55,'berlin'),(46,'SebastinaTheFoolish',47,'new york'),(48,'HorseInTennessee1997',44,' nashville'),(53,'ciao',2,'test');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 's2i_information_db'
--

--
-- Dumping routines for database 's2i_information_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-18 19:57:47
