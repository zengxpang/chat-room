/*
 Navicat Premium Dump SQL

 Source Server         : hello-mysql
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : localhost:3306
 Source Schema         : chat-room

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 05/08/2024 23:36:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
BEGIN;
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('5e78716c-9eae-4834-a8bc-4ec9d3ec5c8f', '76c413f80b69fb522a8eaaae7760dd2ccb3264db5c708a1f72a23b1c06ef93dc', '2024-08-04 13:52:32.565', '20240804135232_user', NULL, NULL, '2024-08-04 13:52:32.555', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('9d96a3ff-2a16-40fb-beec-db63f592c480', '35a8a67d614cf1f841ea9f6f0183c3b25e6f9bd3fb65eb792148097a5507a08a', '2024-08-05 14:48:47.666', '20240805144847_friend_request', NULL, NULL, '2024-08-05 14:48:47.657', 1);
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('df080a22-9817-4264-aeda-d5baaed227eb', '20810eb1094c310b6af90b9d9079b4e765d77ecf7f8fd0525326b90a426ae1da', '2024-08-05 14:23:20.164', '20240805142320_friendship', NULL, NULL, '2024-08-05 14:23:20.121', 1);
COMMIT;

-- ----------------------------
-- Table structure for FriendRequest
-- ----------------------------
DROP TABLE IF EXISTS `FriendRequest`;
CREATE TABLE `FriendRequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fromUserId` int NOT NULL,
  `toUserId` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` enum('Pending','Accepted','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of FriendRequest
-- ----------------------------
BEGIN;
INSERT INTO `FriendRequest` (`id`, `fromUserId`, `toUserId`, `reason`, `status`, `createdAt`, `updatedAt`) VALUES (13, 5, 2, '交个朋🈶️', 'Accepted', '2024-08-05 15:06:18.842', '2024-08-05 15:25:51.106');
COMMIT;

-- ----------------------------
-- Table structure for FriendShip
-- ----------------------------
DROP TABLE IF EXISTS `FriendShip`;
CREATE TABLE `FriendShip` (
  `userId` int NOT NULL,
  `friendId` int NOT NULL,
  PRIMARY KEY (`userId`,`friendId`),
  KEY `FriendShip_friendId_fkey` (`friendId`),
  CONSTRAINT `FriendShip_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FriendShip_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of FriendShip
-- ----------------------------
BEGIN;
INSERT INTO `FriendShip` (`userId`, `friendId`) VALUES (2, 3);
INSERT INTO `FriendShip` (`userId`, `friendId`) VALUES (2, 4);
INSERT INTO `FriendShip` (`userId`, `friendId`) VALUES (3, 4);
COMMIT;

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of User
-- ----------------------------
BEGIN;
INSERT INTO `User` (`id`, `username`, `password`, `nickname`, `email`, `avatar`, `createdAt`, `updatedAt`) VALUES (2, 'zxp', '999999', '死亡', 'xxxx@xx.com', '23434', '2024-08-04 14:45:13.100', '2024-08-05 14:08:31.447');
INSERT INTO `User` (`id`, `username`, `password`, `nickname`, `email`, `avatar`, `createdAt`, `updatedAt`) VALUES (3, 'lx', '123456', 'liaoxun', 'yyyy@yy.com', '11111', '2024-08-05 22:25:36.000', '2024-08-05 22:25:25.000');
INSERT INTO `User` (`id`, `username`, `password`, `nickname`, `email`, `avatar`, `createdAt`, `updatedAt`) VALUES (4, 'cp', '345678', 'chenpeng', 'zzzz@zz.com', '222', '2024-08-05 22:26:09.000', '2024-08-05 22:26:13.000');
INSERT INTO `User` (`id`, `username`, `password`, `nickname`, `email`, `avatar`, `createdAt`, `updatedAt`) VALUES (5, 'xiao', '123456', 'xiaoxiao', 'aaaa@aa.com', '333', '2024-08-05 22:59:45.000', '2024-08-05 22:59:48.000');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
