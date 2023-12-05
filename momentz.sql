-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2023 at 07:21 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `momentz`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id_chat` int(11) NOT NULL,
  `id_sender` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id_chat`, `id_sender`, `id_receiver`, `message`, `sent_at`, `is_read`) VALUES
(1, 1, 2, 'hai aku shandy kamu pasti kaisar', '2023-12-05 18-07-45', 0),
(2, 2, 1, 'halo shandy, benar aku kaisar', '2023-12-05 18-08-11', 0),
(3, 1, 3, 'halo Jefanya, aku shandy', '2023-12-05 18-10-17', 0),
(4, 3, 1, 'Halo Shandy, betul aku jefanya atau biasa dipanggil Uje', '2023-12-05 18-10-44', 0),
(5, 3, 4, 'Halo Axell, namaku Jefanya', '2023-12-05 18-17-50', 0),
(6, 4, 3, 'Halo Jefanya, aku Axell', '2023-12-05 18-18-15', 0),
(7, 4, 2, 'Hai Kaisar, aku aksel', '2023-12-05 18-19-18', 0),
(8, 2, 4, 'kalo aksel salam kenal, aku kaisar', '2023-12-05 18-19-47', 0);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id_post` int(10) NOT NULL,
  `id_user` int(10) DEFAULT NULL,
  `post_media` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `id_comment` int(10) NOT NULL,
  `id_post` int(10) DEFAULT NULL,
  `id_user` int(10) DEFAULT NULL,
  `comment` varchar(255) NOT NULL,
  `created_at` varchar(50) NOT NULL,
  `is_notified` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `id_like` int(10) NOT NULL,
  `id_post` int(10) DEFAULT NULL,
  `id_user` int(10) DEFAULT NULL,
  `created_at` varchar(50) NOT NULL,
  `is_notified` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(10) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`, `name`, `email`, `bio`, `profile_picture`, `created_at`) VALUES
(1, 'shandy', 'ff5f250941a123bf86add555fa029aa2e517579bbd8f3afa4fb2e7b8cb709a24', 'shandy christian', 'shandy@gmail.com', 'ini bio nya si shandy', 'default.png', '6/11/2023'),
(2, 'Kaisar', '8a376a977dbd661694345211fe8244445acc15677d9b46bc01897958432d3c43', 'Kaisar Fredi', 'kaisar@gmail.com', 'kalau ini bio nya si kaisar', 'default.png', '6/11/2023'),
(3, 'Jefanya', 'a7c5b4af201c3b7bd09005b28c560a30372aa6f78d79577cf2c67412cd937ad5', 'Jefanya Brian', 'jefanya@gmail.com', 'inimah bio nya si uje', 'default.png', '6/11/2023'),
(4, 'Axell', 'fafb13ba03109fbf507ce687cefbc48347a63d8265c8cafc01de686bb787ede3', 'Axell Silvano', 'axell@gmail.com', NULL, 'default.png', '6/11/2023');

-- --------------------------------------------------------

--
-- Table structure for table `user_follow`
--

CREATE TABLE `user_follow` (
  `id_user` int(10) NOT NULL,
  `id_following` int(10) NOT NULL,
  `followed_at` varchar(50) NOT NULL,
  `is_notified` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_follow`
--

INSERT INTO `user_follow` (`id_user`, `id_following`, `followed_at`, `is_notified`) VALUES
(1, 2, '2023-12-05 17-52-59', 1),
(1, 3, '2023-12-05 17-53-02', 1),
(2, 4, '2023-12-05 17-54-47', 1),
(3, 4, '2023-12-05 17-55-07', 1),
(4, 1, '2023-12-05 17-55-24', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `RECEIVER_ID` (`id_receiver`),
  ADD KEY `SENDER_ID` (`id_sender`) USING BTREE;

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`id_comment`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id_like`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `user_follow`
--
ALTER TABLE `user_follow`
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_following` (`id_following`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id_post` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `id_comment` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id_like` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`id_sender`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`id_receiver`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id_post`),
  ADD CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id_post`),
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `user_follow`
--
ALTER TABLE `user_follow`
  ADD CONSTRAINT `user_follow_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `user_follow_ibfk_2` FOREIGN KEY (`id_following`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
