-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2021 at 09:03 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dungeon`
--

-- --------------------------------------------------------

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
CREATE TABLE `characters` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `girlName` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `proffession` varchar(255) DEFAULT NULL,
  `life` varchar(255) DEFAULT NULL,
  `magic` varchar(255) DEFAULT NULL,
  `strength` varchar(255) DEFAULT NULL,
  `rank` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `equipment` varchar(255) DEFAULT NULL,
  `limitations` varchar(255) DEFAULT NULL,
  `weakness` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `history` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `character_names`
--

DROP TABLE IF EXISTS `character_names`;
CREATE TABLE `character_names` (
  `id` int(10) UNSIGNED NOT NULL,
  `boyFirstName` varchar(255) DEFAULT NULL,
  `girlFirstName` varchar(255) DEFAULT NULL,
  `familyName` varchar(255) DEFAULT NULL,
  `types` varchar(255) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `limitations` varchar(255) DEFAULT NULL,
  `weakness` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `core_store`
--

DROP TABLE IF EXISTS `core_store`;
CREATE TABLE `core_store` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(255) DEFAULT NULL,
  `value` longtext DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `environment` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `core_store`
--

INSERT INTO `core_store` (`id`, `key`, `value`, `type`, `environment`, `tag`) VALUES
(1, 'model_def_strapi::core-store', '{\"uid\":\"strapi::core-store\",\"collectionName\":\"core_store\",\"info\":{\"name\":\"core_store\",\"description\":\"\"},\"options\":{\"timestamps\":false},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"key\":{\"type\":\"string\"},\"value\":{\"type\":\"text\"},\"type\":{\"type\":\"string\"},\"environment\":{\"type\":\"string\"},\"tag\":{\"type\":\"string\"}}}', 'object', NULL, NULL),
(2, 'model_def_application::character-names.character-names', '{\"uid\":\"application::character-names.character-names\",\"collectionName\":\"character_names\",\"kind\":\"singleType\",\"info\":{\"name\":\"characterGenerator\",\"description\":\"\"},\"options\":{\"increments\":true,\"timestamps\":[\"created_at\",\"updated_at\"],\"draftAndPublish\":true},\"pluginOptions\":{},\"attributes\":{\"boyFirstName\":{\"type\":\"string\"},\"girlFirstName\":{\"type\":\"string\"},\"familyName\":{\"type\":\"string\"},\"types\":{\"type\":\"string\"},\"profession\":{\"type\":\"string\"},\"limitations\":{\"type\":\"string\"},\"weakness\":{\"type\":\"string\"},\"published_at\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(3, 'model_def_application::character.character', '{\"uid\":\"application::character.character\",\"collectionName\":\"characters\",\"kind\":\"collectionType\",\"info\":{\"name\":\"character\",\"description\":\"\"},\"options\":{\"increments\":true,\"timestamps\":[\"created_at\",\"updated_at\"],\"draftAndPublish\":true},\"pluginOptions\":{},\"attributes\":{\"name\":{\"type\":\"string\"},\"girlName\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"age\":{\"type\":\"integer\"},\"proffession\":{\"type\":\"string\"},\"life\":{\"type\":\"string\"},\"magic\":{\"type\":\"string\"},\"strength\":{\"type\":\"string\"},\"rank\":{\"type\":\"string\"},\"experience\":{\"type\":\"string\"},\"equipment\":{\"type\":\"string\"},\"limitations\":{\"type\":\"string\"},\"weakness\":{\"type\":\"string\"},\"history\":{\"type\":\"richtext\"},\"heroImage\":{\"model\":\"file\",\"via\":\"related\",\"allowedTypes\":[\"images\",\"files\",\"videos\"],\"plugin\":\"upload\",\"required\":false,\"pluginOptions\":{}},\"published_at\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(4, 'model_def_application::monster-generator.monster-generator', '{\"uid\":\"application::monster-generator.monster-generator\",\"collectionName\":\"monster_generators\",\"kind\":\"singleType\",\"info\":{\"name\":\"monsterGenerator\"},\"options\":{\"increments\":true,\"timestamps\":[\"created_at\",\"updated_at\"],\"draftAndPublish\":true},\"pluginOptions\":{},\"attributes\":{\"monsterName\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"abilities\":{\"type\":\"string\"},\"life\":{\"type\":\"string\"},\"weakness\":{\"type\":\"string\"},\"published_at\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(5, 'model_def_strapi::webhooks', '{\"uid\":\"strapi::webhooks\",\"collectionName\":\"strapi_webhooks\",\"info\":{\"name\":\"Strapi webhooks\",\"description\":\"\"},\"options\":{\"timestamps\":false},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"name\":{\"type\":\"string\"},\"url\":{\"type\":\"text\"},\"headers\":{\"type\":\"json\"},\"events\":{\"type\":\"json\"},\"enabled\":{\"type\":\"boolean\"}}}', 'object', NULL, NULL),
(6, 'model_def_strapi::permission', '{\"uid\":\"strapi::permission\",\"collectionName\":\"strapi_permission\",\"kind\":\"collectionType\",\"info\":{\"name\":\"Permission\",\"description\":\"\"},\"options\":{\"timestamps\":[\"created_at\",\"updated_at\"]},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"action\":{\"type\":\"string\",\"minLength\":1,\"configurable\":false,\"required\":true},\"subject\":{\"type\":\"string\",\"minLength\":1,\"configurable\":false,\"required\":false},\"properties\":{\"type\":\"json\",\"configurable\":false,\"required\":false,\"default\":{}},\"conditions\":{\"type\":\"json\",\"configurable\":false,\"required\":false,\"default\":[]},\"role\":{\"configurable\":false,\"model\":\"role\",\"plugin\":\"admin\"}}}', 'object', NULL, NULL),
(7, 'model_def_strapi::role', '{\"uid\":\"strapi::role\",\"collectionName\":\"strapi_role\",\"kind\":\"collectionType\",\"info\":{\"name\":\"Role\",\"description\":\"\"},\"options\":{\"timestamps\":[\"created_at\",\"updated_at\"]},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"name\":{\"type\":\"string\",\"minLength\":1,\"unique\":true,\"configurable\":false,\"required\":true},\"code\":{\"type\":\"string\",\"minLength\":1,\"unique\":true,\"configurable\":false,\"required\":true},\"description\":{\"type\":\"string\",\"configurable\":false},\"users\":{\"configurable\":false,\"collection\":\"user\",\"via\":\"roles\",\"plugin\":\"admin\",\"attribute\":\"user\",\"column\":\"id\",\"isVirtual\":true},\"permissions\":{\"configurable\":false,\"plugin\":\"admin\",\"collection\":\"permission\",\"via\":\"role\",\"isVirtual\":true}}}', 'object', NULL, NULL),
(8, 'model_def_strapi::user', '{\"uid\":\"strapi::user\",\"collectionName\":\"strapi_administrator\",\"kind\":\"collectionType\",\"info\":{\"name\":\"User\",\"description\":\"\"},\"options\":{\"timestamps\":false},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"firstname\":{\"type\":\"string\",\"unique\":false,\"minLength\":1,\"configurable\":false,\"required\":false},\"lastname\":{\"type\":\"string\",\"unique\":false,\"minLength\":1,\"configurable\":false,\"required\":false},\"username\":{\"type\":\"string\",\"unique\":false,\"configurable\":false,\"required\":false},\"email\":{\"type\":\"email\",\"minLength\":6,\"configurable\":false,\"required\":true,\"unique\":true,\"private\":true},\"password\":{\"type\":\"password\",\"minLength\":6,\"configurable\":false,\"required\":false,\"private\":true},\"resetPasswordToken\":{\"type\":\"string\",\"configurable\":false,\"private\":true},\"registrationToken\":{\"type\":\"string\",\"configurable\":false,\"private\":true},\"isActive\":{\"type\":\"boolean\",\"default\":false,\"configurable\":false,\"private\":true},\"roles\":{\"collection\":\"role\",\"collectionName\":\"strapi_users_roles\",\"via\":\"users\",\"dominant\":true,\"plugin\":\"admin\",\"configurable\":false,\"private\":true,\"attribute\":\"role\",\"column\":\"id\",\"isVirtual\":true},\"blocked\":{\"type\":\"boolean\",\"default\":false,\"configurable\":false,\"private\":true},\"preferedLanguage\":{\"type\":\"string\",\"configurable\":false,\"required\":false}}}', 'object', NULL, NULL),
(9, 'model_def_plugins::users-permissions.permission', '{\"uid\":\"plugins::users-permissions.permission\",\"collectionName\":\"users-permissions_permission\",\"kind\":\"collectionType\",\"info\":{\"name\":\"permission\",\"description\":\"\"},\"options\":{\"timestamps\":false},\"pluginOptions\":{\"content-manager\":{\"visible\":false}},\"attributes\":{\"type\":{\"type\":\"string\",\"required\":true,\"configurable\":false},\"controller\":{\"type\":\"string\",\"required\":true,\"configurable\":false},\"action\":{\"type\":\"string\",\"required\":true,\"configurable\":false},\"enabled\":{\"type\":\"boolean\",\"required\":true,\"configurable\":false},\"policy\":{\"type\":\"string\",\"configurable\":false},\"role\":{\"model\":\"role\",\"via\":\"permissions\",\"plugin\":\"users-permissions\",\"configurable\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(10, 'model_def_plugins::users-permissions.role', '{\"uid\":\"plugins::users-permissions.role\",\"collectionName\":\"users-permissions_role\",\"kind\":\"collectionType\",\"info\":{\"name\":\"role\",\"description\":\"\"},\"options\":{\"timestamps\":false},\"pluginOptions\":{\"content-manager\":{\"visible\":false}},\"attributes\":{\"name\":{\"type\":\"string\",\"minLength\":3,\"required\":true,\"configurable\":false},\"description\":{\"type\":\"string\",\"configurable\":false},\"type\":{\"type\":\"string\",\"unique\":true,\"configurable\":false},\"permissions\":{\"collection\":\"permission\",\"via\":\"role\",\"plugin\":\"users-permissions\",\"configurable\":false,\"isVirtual\":true},\"users\":{\"collection\":\"user\",\"via\":\"role\",\"configurable\":false,\"plugin\":\"users-permissions\",\"isVirtual\":true},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(11, 'model_def_plugins::users-permissions.user', '{\"uid\":\"plugins::users-permissions.user\",\"collectionName\":\"users-permissions_user\",\"kind\":\"collectionType\",\"info\":{\"name\":\"user\",\"description\":\"\"},\"options\":{\"draftAndPublish\":false,\"timestamps\":[\"created_at\",\"updated_at\"]},\"attributes\":{\"username\":{\"type\":\"string\",\"minLength\":3,\"unique\":true,\"configurable\":false,\"required\":true},\"email\":{\"type\":\"email\",\"minLength\":6,\"configurable\":false,\"required\":true},\"provider\":{\"type\":\"string\",\"configurable\":false},\"password\":{\"type\":\"password\",\"minLength\":6,\"configurable\":false,\"private\":true},\"resetPasswordToken\":{\"type\":\"string\",\"configurable\":false,\"private\":true},\"confirmationToken\":{\"type\":\"string\",\"configurable\":false,\"private\":true},\"confirmed\":{\"type\":\"boolean\",\"default\":false,\"configurable\":false},\"blocked\":{\"type\":\"boolean\",\"default\":false,\"configurable\":false},\"role\":{\"model\":\"role\",\"via\":\"users\",\"plugin\":\"users-permissions\",\"configurable\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(12, 'model_def_plugins::upload.file', '{\"uid\":\"plugins::upload.file\",\"collectionName\":\"upload_file\",\"kind\":\"collectionType\",\"info\":{\"name\":\"file\",\"description\":\"\"},\"options\":{\"timestamps\":[\"created_at\",\"updated_at\"]},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"name\":{\"type\":\"string\",\"configurable\":false,\"required\":true},\"alternativeText\":{\"type\":\"string\",\"configurable\":false},\"caption\":{\"type\":\"string\",\"configurable\":false},\"width\":{\"type\":\"integer\",\"configurable\":false},\"height\":{\"type\":\"integer\",\"configurable\":false},\"formats\":{\"type\":\"json\",\"configurable\":false},\"hash\":{\"type\":\"string\",\"configurable\":false,\"required\":true},\"ext\":{\"type\":\"string\",\"configurable\":false},\"mime\":{\"type\":\"string\",\"configurable\":false,\"required\":true},\"size\":{\"type\":\"decimal\",\"configurable\":false,\"required\":true},\"url\":{\"type\":\"string\",\"configurable\":false,\"required\":true},\"previewUrl\":{\"type\":\"string\",\"configurable\":false},\"provider\":{\"type\":\"string\",\"configurable\":false,\"required\":true},\"provider_metadata\":{\"type\":\"json\",\"configurable\":false},\"related\":{\"collection\":\"*\",\"filter\":\"field\",\"configurable\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(13, 'model_def_plugins::i18n.locale', '{\"uid\":\"plugins::i18n.locale\",\"collectionName\":\"i18n_locales\",\"kind\":\"collectionType\",\"info\":{\"name\":\"locale\",\"description\":\"\"},\"options\":{\"timestamps\":[\"created_at\",\"updated_at\"]},\"pluginOptions\":{\"content-manager\":{\"visible\":false},\"content-type-builder\":{\"visible\":false}},\"attributes\":{\"name\":{\"type\":\"string\",\"min\":1,\"max\":50,\"configurable\":false},\"code\":{\"type\":\"string\",\"unique\":true,\"configurable\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(14, 'plugin_upload_settings', '{\"sizeOptimization\":true,\"responsiveDimensions\":true}', 'object', 'development', ''),
(15, 'plugin_users-permissions_grant', '{\"email\":{\"enabled\":true,\"icon\":\"envelope\"},\"discord\":{\"enabled\":false,\"icon\":\"discord\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/discord/callback\",\"scope\":[\"identify\",\"email\"]},\"facebook\":{\"enabled\":false,\"icon\":\"facebook-square\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/facebook/callback\",\"scope\":[\"email\"]},\"google\":{\"enabled\":false,\"icon\":\"google\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/google/callback\",\"scope\":[\"email\"]},\"github\":{\"enabled\":false,\"icon\":\"github\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/github/callback\",\"scope\":[\"user\",\"user:email\"]},\"microsoft\":{\"enabled\":false,\"icon\":\"windows\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/microsoft/callback\",\"scope\":[\"user.read\"]},\"twitter\":{\"enabled\":false,\"icon\":\"twitter\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/twitter/callback\"},\"instagram\":{\"enabled\":false,\"icon\":\"instagram\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/instagram/callback\",\"scope\":[\"user_profile\"]},\"vk\":{\"enabled\":false,\"icon\":\"vk\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/vk/callback\",\"scope\":[\"email\"]},\"twitch\":{\"enabled\":false,\"icon\":\"twitch\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/twitch/callback\",\"scope\":[\"user:read:email\"]},\"linkedin\":{\"enabled\":false,\"icon\":\"linkedin\",\"key\":\"\",\"secret\":\"\",\"callback\":\"/auth/linkedin/callback\",\"scope\":[\"r_liteprofile\",\"r_emailaddress\"]},\"cognito\":{\"enabled\":false,\"icon\":\"aws\",\"key\":\"\",\"secret\":\"\",\"subdomain\":\"my.subdomain.com\",\"callback\":\"/auth/cognito/callback\",\"scope\":[\"email\",\"openid\",\"profile\"]},\"reddit\":{\"enabled\":false,\"icon\":\"reddit\",\"key\":\"\",\"secret\":\"\",\"state\":true,\"callback\":\"/auth/reddit/callback\",\"scope\":[\"identity\"]},\"auth0\":{\"enabled\":false,\"icon\":\"\",\"key\":\"\",\"secret\":\"\",\"subdomain\":\"my-tenant.eu\",\"callback\":\"/auth/auth0/callback\",\"scope\":[\"openid\",\"email\",\"profile\"]}}', 'object', '', ''),
(16, 'plugin_content_manager_configuration_content_types::application::character.character', '{\"uid\":\"application::character.character\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"name\",\"defaultSortBy\":\"name\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"name\":{\"edit\":{\"label\":\"Name\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Name\",\"searchable\":true,\"sortable\":true}},\"girlName\":{\"edit\":{\"label\":\"GirlName\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"GirlName\",\"searchable\":true,\"sortable\":true}},\"type\":{\"edit\":{\"label\":\"Type\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Type\",\"searchable\":true,\"sortable\":true}},\"age\":{\"edit\":{\"label\":\"Age\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Age\",\"searchable\":true,\"sortable\":true}},\"proffession\":{\"edit\":{\"label\":\"Proffession\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Proffession\",\"searchable\":true,\"sortable\":true}},\"life\":{\"edit\":{\"label\":\"Life\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Life\",\"searchable\":true,\"sortable\":true}},\"magic\":{\"edit\":{\"label\":\"Magic\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Magic\",\"searchable\":true,\"sortable\":true}},\"strength\":{\"edit\":{\"label\":\"Strength\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Strength\",\"searchable\":true,\"sortable\":true}},\"rank\":{\"edit\":{\"label\":\"Rank\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Rank\",\"searchable\":true,\"sortable\":true}},\"experience\":{\"edit\":{\"label\":\"Experience\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Experience\",\"searchable\":true,\"sortable\":true}},\"equipment\":{\"edit\":{\"label\":\"Equipment\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Equipment\",\"searchable\":true,\"sortable\":true}},\"limitations\":{\"edit\":{\"label\":\"Limitations\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Limitations\",\"searchable\":true,\"sortable\":true}},\"weakness\":{\"edit\":{\"label\":\"Weakness\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Weakness\",\"searchable\":true,\"sortable\":true}},\"history\":{\"edit\":{\"label\":\"History\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"History\",\"searchable\":false,\"sortable\":false}},\"heroImage\":{\"edit\":{\"label\":\"HeroImage\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"HeroImage\",\"searchable\":false,\"sortable\":false}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"name\",\"girlName\",\"type\"],\"edit\":[[{\"name\":\"name\",\"size\":6},{\"name\":\"girlName\",\"size\":6}],[{\"name\":\"type\",\"size\":6},{\"name\":\"age\",\"size\":4}],[{\"name\":\"proffession\",\"size\":6},{\"name\":\"life\",\"size\":6}],[{\"name\":\"magic\",\"size\":6},{\"name\":\"strength\",\"size\":6}],[{\"name\":\"rank\",\"size\":6},{\"name\":\"experience\",\"size\":6}],[{\"name\":\"equipment\",\"size\":6},{\"name\":\"limitations\",\"size\":6}],[{\"name\":\"weakness\",\"size\":6}],[{\"name\":\"history\",\"size\":12}],[{\"name\":\"heroImage\",\"size\":6}]],\"editRelations\":[]}}', 'object', '', ''),
(17, 'plugin_content_manager_configuration_content_types::application::character-names.character-names', '{\"uid\":\"application::character-names.character-names\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"boyFirstName\",\"defaultSortBy\":\"boyFirstName\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"boyFirstName\":{\"edit\":{\"label\":\"BoyFirstName\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"BoyFirstName\",\"searchable\":true,\"sortable\":true}},\"girlFirstName\":{\"edit\":{\"label\":\"GirlFirstName\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"GirlFirstName\",\"searchable\":true,\"sortable\":true}},\"familyName\":{\"edit\":{\"label\":\"FamilyName\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"FamilyName\",\"searchable\":true,\"sortable\":true}},\"types\":{\"edit\":{\"label\":\"Types\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Types\",\"searchable\":true,\"sortable\":true}},\"profession\":{\"edit\":{\"label\":\"Profession\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Profession\",\"searchable\":true,\"sortable\":true}},\"limitations\":{\"edit\":{\"label\":\"Limitations\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Limitations\",\"searchable\":true,\"sortable\":true}},\"weakness\":{\"edit\":{\"label\":\"Weakness\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Weakness\",\"searchable\":true,\"sortable\":true}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"boyFirstName\",\"girlFirstName\",\"familyName\"],\"editRelations\":[],\"edit\":[[{\"name\":\"boyFirstName\",\"size\":6},{\"name\":\"girlFirstName\",\"size\":6}],[{\"name\":\"familyName\",\"size\":6},{\"name\":\"types\",\"size\":6}],[{\"name\":\"profession\",\"size\":6},{\"name\":\"limitations\",\"size\":6}],[{\"name\":\"weakness\",\"size\":6}]]}}', 'object', '', ''),
(18, 'plugin_content_manager_configuration_content_types::application::monster-generator.monster-generator', '{\"uid\":\"application::monster-generator.monster-generator\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"monsterName\",\"defaultSortBy\":\"monsterName\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"monsterName\":{\"edit\":{\"label\":\"MonsterName\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"MonsterName\",\"searchable\":true,\"sortable\":true}},\"type\":{\"edit\":{\"label\":\"Type\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Type\",\"searchable\":true,\"sortable\":true}},\"abilities\":{\"edit\":{\"label\":\"Abilities\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Abilities\",\"searchable\":true,\"sortable\":true}},\"life\":{\"edit\":{\"label\":\"Life\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Life\",\"searchable\":true,\"sortable\":true}},\"weakness\":{\"edit\":{\"label\":\"Weakness\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Weakness\",\"searchable\":true,\"sortable\":true}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"monsterName\",\"type\",\"abilities\"],\"editRelations\":[],\"edit\":[[{\"name\":\"monsterName\",\"size\":6},{\"name\":\"type\",\"size\":6}],[{\"name\":\"abilities\",\"size\":6},{\"name\":\"life\",\"size\":6}],[{\"name\":\"weakness\",\"size\":6}]]}}', 'object', '', ''),
(19, 'plugin_content_manager_configuration_content_types::strapi::permission', '{\"uid\":\"strapi::permission\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"action\",\"defaultSortBy\":\"action\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"action\":{\"edit\":{\"label\":\"Action\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Action\",\"searchable\":true,\"sortable\":true}},\"subject\":{\"edit\":{\"label\":\"Subject\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Subject\",\"searchable\":true,\"sortable\":true}},\"properties\":{\"edit\":{\"label\":\"Properties\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Properties\",\"searchable\":false,\"sortable\":false}},\"conditions\":{\"edit\":{\"label\":\"Conditions\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Conditions\",\"searchable\":false,\"sortable\":false}},\"role\":{\"edit\":{\"label\":\"Role\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"name\"},\"list\":{\"label\":\"Role\",\"searchable\":true,\"sortable\":true}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"action\",\"subject\",\"role\"],\"editRelations\":[\"role\"],\"edit\":[[{\"name\":\"action\",\"size\":6},{\"name\":\"subject\",\"size\":6}],[{\"name\":\"properties\",\"size\":12}],[{\"name\":\"conditions\",\"size\":12}]]}}', 'object', '', ''),
(20, 'plugin_content_manager_configuration_content_types::strapi::role', '{\"uid\":\"strapi::role\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"name\",\"defaultSortBy\":\"name\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"name\":{\"edit\":{\"label\":\"Name\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Name\",\"searchable\":true,\"sortable\":true}},\"code\":{\"edit\":{\"label\":\"Code\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Code\",\"searchable\":true,\"sortable\":true}},\"description\":{\"edit\":{\"label\":\"Description\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Description\",\"searchable\":true,\"sortable\":true}},\"users\":{\"edit\":{\"label\":\"Users\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"firstname\"},\"list\":{\"label\":\"Users\",\"searchable\":false,\"sortable\":false}},\"permissions\":{\"edit\":{\"label\":\"Permissions\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"action\"},\"list\":{\"label\":\"Permissions\",\"searchable\":false,\"sortable\":false}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"name\",\"code\",\"description\"],\"editRelations\":[\"users\",\"permissions\"],\"edit\":[[{\"name\":\"name\",\"size\":6},{\"name\":\"code\",\"size\":6}],[{\"name\":\"description\",\"size\":6}]]}}', 'object', '', ''),
(21, 'plugin_content_manager_configuration_content_types::strapi::user', '{\"uid\":\"strapi::user\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"firstname\",\"defaultSortBy\":\"firstname\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"firstname\":{\"edit\":{\"label\":\"Firstname\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Firstname\",\"searchable\":true,\"sortable\":true}},\"lastname\":{\"edit\":{\"label\":\"Lastname\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Lastname\",\"searchable\":true,\"sortable\":true}},\"username\":{\"edit\":{\"label\":\"Username\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Username\",\"searchable\":true,\"sortable\":true}},\"email\":{\"edit\":{\"label\":\"Email\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Email\",\"searchable\":true,\"sortable\":true}},\"password\":{\"edit\":{\"label\":\"Password\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Password\",\"searchable\":true,\"sortable\":true}},\"resetPasswordToken\":{\"edit\":{\"label\":\"ResetPasswordToken\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"ResetPasswordToken\",\"searchable\":true,\"sortable\":true}},\"registrationToken\":{\"edit\":{\"label\":\"RegistrationToken\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"RegistrationToken\",\"searchable\":true,\"sortable\":true}},\"isActive\":{\"edit\":{\"label\":\"IsActive\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"IsActive\",\"searchable\":true,\"sortable\":true}},\"roles\":{\"edit\":{\"label\":\"Roles\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"name\"},\"list\":{\"label\":\"Roles\",\"searchable\":false,\"sortable\":false}},\"blocked\":{\"edit\":{\"label\":\"Blocked\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Blocked\",\"searchable\":true,\"sortable\":true}},\"preferedLanguage\":{\"edit\":{\"label\":\"PreferedLanguage\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"PreferedLanguage\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"firstname\",\"lastname\",\"username\"],\"editRelations\":[\"roles\"],\"edit\":[[{\"name\":\"firstname\",\"size\":6},{\"name\":\"lastname\",\"size\":6}],[{\"name\":\"username\",\"size\":6},{\"name\":\"email\",\"size\":6}],[{\"name\":\"password\",\"size\":6},{\"name\":\"resetPasswordToken\",\"size\":6}],[{\"name\":\"registrationToken\",\"size\":6},{\"name\":\"isActive\",\"size\":4}],[{\"name\":\"blocked\",\"size\":4},{\"name\":\"preferedLanguage\",\"size\":6}]]}}', 'object', '', ''),
(22, 'plugin_content_manager_configuration_content_types::plugins::users-permissions.permission', '{\"uid\":\"plugins::users-permissions.permission\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"type\",\"defaultSortBy\":\"type\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"type\":{\"edit\":{\"label\":\"Type\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Type\",\"searchable\":true,\"sortable\":true}},\"controller\":{\"edit\":{\"label\":\"Controller\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Controller\",\"searchable\":true,\"sortable\":true}},\"action\":{\"edit\":{\"label\":\"Action\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Action\",\"searchable\":true,\"sortable\":true}},\"enabled\":{\"edit\":{\"label\":\"Enabled\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Enabled\",\"searchable\":true,\"sortable\":true}},\"policy\":{\"edit\":{\"label\":\"Policy\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Policy\",\"searchable\":true,\"sortable\":true}},\"role\":{\"edit\":{\"label\":\"Role\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"name\"},\"list\":{\"label\":\"Role\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"type\",\"controller\",\"action\"],\"editRelations\":[\"role\"],\"edit\":[[{\"name\":\"type\",\"size\":6},{\"name\":\"controller\",\"size\":6}],[{\"name\":\"action\",\"size\":6},{\"name\":\"enabled\",\"size\":4}],[{\"name\":\"policy\",\"size\":6}]]}}', 'object', '', ''),
(23, 'plugin_content_manager_configuration_content_types::plugins::users-permissions.role', '{\"uid\":\"plugins::users-permissions.role\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"name\",\"defaultSortBy\":\"name\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"name\":{\"edit\":{\"label\":\"Name\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Name\",\"searchable\":true,\"sortable\":true}},\"description\":{\"edit\":{\"label\":\"Description\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Description\",\"searchable\":true,\"sortable\":true}},\"type\":{\"edit\":{\"label\":\"Type\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Type\",\"searchable\":true,\"sortable\":true}},\"permissions\":{\"edit\":{\"label\":\"Permissions\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"type\"},\"list\":{\"label\":\"Permissions\",\"searchable\":false,\"sortable\":false}},\"users\":{\"edit\":{\"label\":\"Users\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"username\"},\"list\":{\"label\":\"Users\",\"searchable\":false,\"sortable\":false}}},\"layouts\":{\"list\":[\"id\",\"name\",\"description\",\"type\"],\"editRelations\":[\"permissions\",\"users\"],\"edit\":[[{\"name\":\"name\",\"size\":6},{\"name\":\"description\",\"size\":6}],[{\"name\":\"type\",\"size\":6}]]}}', 'object', '', ''),
(24, 'plugin_content_manager_configuration_content_types::plugins::users-permissions.user', '{\"uid\":\"plugins::users-permissions.user\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"username\",\"defaultSortBy\":\"username\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"username\":{\"edit\":{\"label\":\"Username\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Username\",\"searchable\":true,\"sortable\":true}},\"email\":{\"edit\":{\"label\":\"Email\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Email\",\"searchable\":true,\"sortable\":true}},\"provider\":{\"edit\":{\"label\":\"Provider\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Provider\",\"searchable\":true,\"sortable\":true}},\"password\":{\"edit\":{\"label\":\"Password\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Password\",\"searchable\":true,\"sortable\":true}},\"resetPasswordToken\":{\"edit\":{\"label\":\"ResetPasswordToken\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"ResetPasswordToken\",\"searchable\":true,\"sortable\":true}},\"confirmationToken\":{\"edit\":{\"label\":\"ConfirmationToken\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"ConfirmationToken\",\"searchable\":true,\"sortable\":true}},\"confirmed\":{\"edit\":{\"label\":\"Confirmed\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Confirmed\",\"searchable\":true,\"sortable\":true}},\"blocked\":{\"edit\":{\"label\":\"Blocked\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Blocked\",\"searchable\":true,\"sortable\":true}},\"role\":{\"edit\":{\"label\":\"Role\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true,\"mainField\":\"name\"},\"list\":{\"label\":\"Role\",\"searchable\":true,\"sortable\":true}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"username\",\"email\",\"confirmed\"],\"editRelations\":[\"role\"],\"edit\":[[{\"name\":\"username\",\"size\":6},{\"name\":\"email\",\"size\":6}],[{\"name\":\"password\",\"size\":6},{\"name\":\"confirmed\",\"size\":4}],[{\"name\":\"blocked\",\"size\":4}]]}}', 'object', '', ''),
(25, 'plugin_content_manager_configuration_content_types::plugins::upload.file', '{\"uid\":\"plugins::upload.file\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"name\",\"defaultSortBy\":\"name\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"name\":{\"edit\":{\"label\":\"Name\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Name\",\"searchable\":true,\"sortable\":true}},\"alternativeText\":{\"edit\":{\"label\":\"AlternativeText\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"AlternativeText\",\"searchable\":true,\"sortable\":true}},\"caption\":{\"edit\":{\"label\":\"Caption\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Caption\",\"searchable\":true,\"sortable\":true}},\"width\":{\"edit\":{\"label\":\"Width\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Width\",\"searchable\":true,\"sortable\":true}},\"height\":{\"edit\":{\"label\":\"Height\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Height\",\"searchable\":true,\"sortable\":true}},\"formats\":{\"edit\":{\"label\":\"Formats\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Formats\",\"searchable\":false,\"sortable\":false}},\"hash\":{\"edit\":{\"label\":\"Hash\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Hash\",\"searchable\":true,\"sortable\":true}},\"ext\":{\"edit\":{\"label\":\"Ext\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Ext\",\"searchable\":true,\"sortable\":true}},\"mime\":{\"edit\":{\"label\":\"Mime\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Mime\",\"searchable\":true,\"sortable\":true}},\"size\":{\"edit\":{\"label\":\"Size\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Size\",\"searchable\":true,\"sortable\":true}},\"url\":{\"edit\":{\"label\":\"Url\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Url\",\"searchable\":true,\"sortable\":true}},\"previewUrl\":{\"edit\":{\"label\":\"PreviewUrl\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"PreviewUrl\",\"searchable\":true,\"sortable\":true}},\"provider\":{\"edit\":{\"label\":\"Provider\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Provider\",\"searchable\":true,\"sortable\":true}},\"provider_metadata\":{\"edit\":{\"label\":\"Provider_metadata\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Provider_metadata\",\"searchable\":false,\"sortable\":false}},\"related\":{\"edit\":{\"label\":\"Related\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Related\",\"searchable\":false,\"sortable\":false}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"name\",\"alternativeText\",\"caption\"],\"editRelations\":[\"related\"],\"edit\":[[{\"name\":\"name\",\"size\":6},{\"name\":\"alternativeText\",\"size\":6}],[{\"name\":\"caption\",\"size\":6},{\"name\":\"width\",\"size\":4}],[{\"name\":\"height\",\"size\":4}],[{\"name\":\"formats\",\"size\":12}],[{\"name\":\"hash\",\"size\":6},{\"name\":\"ext\",\"size\":6}],[{\"name\":\"mime\",\"size\":6},{\"name\":\"size\",\"size\":4}],[{\"name\":\"url\",\"size\":6},{\"name\":\"previewUrl\",\"size\":6}],[{\"name\":\"provider\",\"size\":6}],[{\"name\":\"provider_metadata\",\"size\":12}]]}}', 'object', '', ''),
(26, 'plugin_content_manager_configuration_content_types::plugins::i18n.locale', '{\"uid\":\"plugins::i18n.locale\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"name\",\"defaultSortBy\":\"name\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"name\":{\"edit\":{\"label\":\"Name\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Name\",\"searchable\":true,\"sortable\":true}},\"code\":{\"edit\":{\"label\":\"Code\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Code\",\"searchable\":true,\"sortable\":true}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"name\",\"code\",\"created_at\"],\"editRelations\":[],\"edit\":[[{\"name\":\"name\",\"size\":6},{\"name\":\"code\",\"size\":6}]]}}', 'object', '', ''),
(27, 'plugin_i18n_default_locale', '\"en\"', 'string', '', ''),
(28, 'plugin_users-permissions_email', '{\"reset_password\":{\"display\":\"Email.template.reset_password\",\"icon\":\"sync\",\"options\":{\"from\":{\"name\":\"Administration Panel\",\"email\":\"no-reply@strapi.io\"},\"response_email\":\"\",\"object\":\"Reset password\",\"message\":\"<p>We heard that you lost your password. Sorry about that!</p>\\n\\n<p>But don’t worry! You can use the following link to reset your password:</p>\\n<p><%= URL %>?code=<%= TOKEN %></p>\\n\\n<p>Thanks.</p>\"}},\"email_confirmation\":{\"display\":\"Email.template.email_confirmation\",\"icon\":\"check-square\",\"options\":{\"from\":{\"name\":\"Administration Panel\",\"email\":\"no-reply@strapi.io\"},\"response_email\":\"\",\"object\":\"Account confirmation\",\"message\":\"<p>Thank you for registering!</p>\\n\\n<p>You have to confirm your email address. Please click on the link below.</p>\\n\\n<p><%= URL %>?confirmation=<%= CODE %></p>\\n\\n<p>Thanks.</p>\"}}}', 'object', '', ''),
(29, 'plugin_users-permissions_advanced', '{\"unique_email\":true,\"allow_register\":true,\"email_confirmation\":false,\"email_reset_password\":null,\"email_confirmation_redirection\":null,\"default_role\":\"authenticated\"}', 'object', '', ''),
(30, 'core_admin_auth', '{\"providers\":{\"autoRegister\":false,\"defaultRole\":null}}', 'object', '', ''),
(31, 'model_def_application::location-generator.location-generator', '{\"uid\":\"application::location-generator.location-generator\",\"collectionName\":\"location_generators\",\"kind\":\"singleType\",\"info\":{\"name\":\"locationGenerator\"},\"options\":{\"increments\":true,\"timestamps\":[\"created_at\",\"updated_at\"],\"draftAndPublish\":true},\"pluginOptions\":{},\"attributes\":{\"location\":{\"type\":\"string\"},\"published_at\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"created_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true},\"updated_by\":{\"model\":\"user\",\"plugin\":\"admin\",\"configurable\":false,\"writable\":false,\"visible\":false,\"private\":true}}}', 'object', NULL, NULL),
(32, 'plugin_content_manager_configuration_content_types::application::location-generator.location-generator', '{\"uid\":\"application::location-generator.location-generator\",\"settings\":{\"bulkable\":true,\"filterable\":true,\"searchable\":true,\"pageSize\":10,\"mainField\":\"location\",\"defaultSortBy\":\"location\",\"defaultSortOrder\":\"ASC\"},\"metadatas\":{\"id\":{\"edit\":{},\"list\":{\"label\":\"Id\",\"searchable\":true,\"sortable\":true}},\"location\":{\"edit\":{\"label\":\"Location\",\"description\":\"\",\"placeholder\":\"\",\"visible\":true,\"editable\":true},\"list\":{\"label\":\"Location\",\"searchable\":true,\"sortable\":true}},\"created_at\":{\"edit\":{\"label\":\"Created_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Created_at\",\"searchable\":true,\"sortable\":true}},\"updated_at\":{\"edit\":{\"label\":\"Updated_at\",\"description\":\"\",\"placeholder\":\"\",\"visible\":false,\"editable\":true},\"list\":{\"label\":\"Updated_at\",\"searchable\":true,\"sortable\":true}}},\"layouts\":{\"list\":[\"id\",\"location\",\"created_at\",\"updated_at\"],\"editRelations\":[],\"edit\":[[{\"name\":\"location\",\"size\":6}]]}}', 'object', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `i18n_locales`
--

DROP TABLE IF EXISTS `i18n_locales`;
CREATE TABLE `i18n_locales` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `i18n_locales`
--

INSERT INTO `i18n_locales` (`id`, `name`, `code`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'English (en)', 'en', NULL, NULL, '2021-05-16 15:00:12', '2021-05-16 15:00:12');

-- --------------------------------------------------------

--
-- Table structure for table `location_generators`
--

DROP TABLE IF EXISTS `location_generators`;
CREATE TABLE `location_generators` (
  `id` int(10) UNSIGNED NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `location_generators`
--

INSERT INTO `location_generators` (`id`, `location`, `published_at`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '\'forest\', \'swamp\', \'mountains\', \'hills\', \'volcano\', \'islands\', \'clouds\', \'castle\', \'cliffs\', \'jungle\', \'old market\', \'desert\', \'tunnels\', \'village\', \'festival\', \'carnival\', \'circus\', \'arena\', \'wagon caravan\', \'military base\', \'monastery\', \'lake\', \'beach\'', '2021-05-16 18:29:24', 1, 1, '2021-05-16 15:14:26', '2021-05-16 15:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `monster_generators`
--

DROP TABLE IF EXISTS `monster_generators`;
CREATE TABLE `monster_generators` (
  `id` int(10) UNSIGNED NOT NULL,
  `monsterName` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `abilities` varchar(255) DEFAULT NULL,
  `life` varchar(255) DEFAULT NULL,
  `weakness` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `strapi_administrator`
--

DROP TABLE IF EXISTS `strapi_administrator`;
CREATE TABLE `strapi_administrator` (
  `id` int(10) UNSIGNED NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `registrationToken` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `blocked` tinyint(1) DEFAULT NULL,
  `preferedLanguage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `strapi_administrator`
--

INSERT INTO `strapi_administrator` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `resetPasswordToken`, `registrationToken`, `isActive`, `blocked`, `preferedLanguage`) VALUES
(1, 'john', 'mogi', NULL, 'anguru@gmail.com', '$2a$10$OAUm6.dp.5bTIHWft1h7COUkuEYAjyaRZ65GsPU5EP/i3RSwx4T82', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `strapi_permission`
--

DROP TABLE IF EXISTS `strapi_permission`;
CREATE TABLE `strapi_permission` (
  `id` int(10) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `properties` longtext DEFAULT NULL,
  `conditions` longtext DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `strapi_permission`
--

INSERT INTO `strapi_permission` (`id`, `action`, `subject`, `properties`, `conditions`, `role`, `created_at`, `updated_at`) VALUES
(1, 'plugins::content-manager.explorer.create', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(2, 'plugins::content-manager.explorer.create', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(3, 'plugins::content-manager.explorer.create', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(4, 'plugins::content-manager.explorer.read', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(5, 'plugins::content-manager.explorer.read', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(6, 'plugins::content-manager.explorer.read', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(7, 'plugins::content-manager.explorer.update', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(8, 'plugins::content-manager.explorer.update', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(9, 'plugins::content-manager.explorer.update', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(10, 'plugins::content-manager.explorer.delete', 'application::character-names.character-names', '{}', '[]', 2, '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(11, 'plugins::content-manager.explorer.delete', 'application::character.character', '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(12, 'plugins::content-manager.explorer.delete', 'application::monster-generator.monster-generator', '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(13, 'plugins::content-manager.explorer.publish', 'application::character-names.character-names', '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(14, 'plugins::content-manager.explorer.publish', 'application::character.character', '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(15, 'plugins::content-manager.explorer.publish', 'application::monster-generator.monster-generator', '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(16, 'plugins::upload.read', NULL, '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(17, 'plugins::upload.assets.create', NULL, '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(18, 'plugins::upload.assets.update', NULL, '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(19, 'plugins::upload.assets.download', NULL, '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(20, 'plugins::upload.assets.copy-link', NULL, '{}', '[]', 2, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(21, 'plugins::content-manager.explorer.create', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(22, 'plugins::content-manager.explorer.create', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(23, 'plugins::content-manager.explorer.create', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(24, 'plugins::content-manager.explorer.read', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(25, 'plugins::content-manager.explorer.read', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(26, 'plugins::content-manager.explorer.read', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(27, 'plugins::content-manager.explorer.update', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(28, 'plugins::content-manager.explorer.update', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(29, 'plugins::content-manager.explorer.update', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(30, 'plugins::content-manager.explorer.delete', 'application::character-names.character-names', '{}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(31, 'plugins::content-manager.explorer.delete', 'application::character.character', '{}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(32, 'plugins::content-manager.explorer.delete', 'application::monster-generator.monster-generator', '{}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(33, 'plugins::upload.read', NULL, '{}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(34, 'plugins::upload.assets.create', NULL, '{}', '[]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(35, 'plugins::upload.assets.update', NULL, '{}', '[\"admin::is-creator\"]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(36, 'plugins::upload.assets.download', NULL, '{}', '[]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(37, 'plugins::upload.assets.copy-link', NULL, '{}', '[]', 3, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(38, 'plugins::content-manager.explorer.create', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(40, 'plugins::content-manager.explorer.create', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(41, 'plugins::content-manager.explorer.create', 'plugins::users-permissions.user', '{\"fields\":[\"username\",\"email\",\"provider\",\"password\",\"resetPasswordToken\",\"confirmationToken\",\"confirmed\",\"blocked\",\"role\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(42, 'plugins::content-manager.explorer.read', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(44, 'plugins::content-manager.explorer.read', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(45, 'plugins::content-manager.explorer.read', 'plugins::users-permissions.user', '{\"fields\":[\"username\",\"email\",\"provider\",\"password\",\"resetPasswordToken\",\"confirmationToken\",\"confirmed\",\"blocked\",\"role\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(46, 'plugins::content-manager.explorer.update', 'application::character-names.character-names', '{\"fields\":[\"boyFirstName\",\"girlFirstName\",\"familyName\",\"types\",\"profession\",\"limitations\",\"weakness\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(48, 'plugins::content-manager.explorer.update', 'application::monster-generator.monster-generator', '{\"fields\":[\"monsterName\",\"type\",\"abilities\",\"life\",\"weakness\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(49, 'plugins::content-manager.explorer.update', 'plugins::users-permissions.user', '{\"fields\":[\"username\",\"email\",\"provider\",\"password\",\"resetPasswordToken\",\"confirmationToken\",\"confirmed\",\"blocked\",\"role\"]}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(57, 'plugins::content-type-builder.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(58, 'plugins::email.settings.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(59, 'plugins::upload.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(60, 'plugins::upload.assets.create', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(61, 'plugins::upload.assets.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(62, 'plugins::content-manager.collection-types.configure-view', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(63, 'plugins::content-manager.components.configure-layout', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(64, 'plugins::upload.assets.download', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(65, 'plugins::upload.assets.copy-link', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(66, 'plugins::upload.settings.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(67, 'plugins::content-manager.single-types.configure-view', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:16'),
(68, 'plugins::i18n.locale.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(69, 'plugins::i18n.locale.create', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(70, 'plugins::i18n.locale.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(71, 'plugins::i18n.locale.delete', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(72, 'plugins::users-permissions.roles.create', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(73, 'plugins::users-permissions.roles.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(74, 'plugins::users-permissions.roles.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(75, 'plugins::users-permissions.roles.delete', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(76, 'plugins::users-permissions.providers.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(77, 'plugins::users-permissions.providers.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:16', '2021-05-16 15:00:17'),
(78, 'plugins::users-permissions.email-templates.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(79, 'plugins::users-permissions.email-templates.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(80, 'plugins::users-permissions.advanced-settings.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(81, 'plugins::users-permissions.advanced-settings.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(82, 'admin::marketplace.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(83, 'admin::marketplace.plugins.install', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(84, 'admin::marketplace.plugins.uninstall', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(85, 'admin::webhooks.create', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(86, 'admin::webhooks.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(87, 'admin::webhooks.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(88, 'admin::webhooks.delete', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(89, 'admin::users.create', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(90, 'admin::users.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(91, 'admin::users.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(92, 'admin::users.delete', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(93, 'admin::roles.create', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(94, 'admin::roles.read', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(95, 'admin::roles.update', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(96, 'admin::roles.delete', NULL, '{}', '[]', 1, '2021-05-16 15:00:17', '2021-05-16 15:00:17'),
(98, 'plugins::content-manager.explorer.create', 'application::location-generator.location-generator', '{\"fields\":[\"location\"]}', '[]', 1, '2021-05-16 15:04:19', '2021-05-16 15:04:19'),
(103, 'plugins::content-manager.explorer.read', 'application::location-generator.location-generator', '{\"fields\":[\"location\"]}', '[]', 1, '2021-05-16 15:04:19', '2021-05-16 15:04:19'),
(104, 'plugins::content-manager.explorer.update', 'application::location-generator.location-generator', '{\"fields\":[\"location\"]}', '[]', 1, '2021-05-16 15:04:19', '2021-05-16 15:04:19'),
(109, 'plugins::content-manager.explorer.publish', 'application::character.character', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:41'),
(110, 'plugins::content-manager.explorer.delete', 'application::location-generator.location-generator', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:41'),
(111, 'plugins::content-manager.explorer.publish', 'application::character-names.character-names', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:42'),
(112, 'plugins::content-manager.explorer.update', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\",\"history\",\"heroImage\"]}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:41'),
(113, 'plugins::content-manager.explorer.read', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\",\"history\",\"heroImage\"]}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:42'),
(114, 'plugins::content-manager.explorer.delete', 'application::monster-generator.monster-generator', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:41'),
(115, 'plugins::content-manager.explorer.create', 'application::character.character', '{\"fields\":[\"name\",\"girlName\",\"type\",\"age\",\"proffession\",\"life\",\"magic\",\"strength\",\"rank\",\"experience\",\"equipment\",\"limitations\",\"weakness\",\"history\",\"heroImage\"]}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:42'),
(116, 'plugins::content-manager.explorer.delete', 'application::character-names.character-names', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:42'),
(117, 'plugins::content-manager.explorer.delete', 'application::character.character', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:42'),
(118, 'plugins::content-manager.explorer.delete', 'plugins::users-permissions.user', '{}', '[]', 1, '2021-05-16 15:28:41', '2021-05-16 15:28:42'),
(119, 'plugins::content-manager.explorer.publish', 'application::location-generator.location-generator', '{}', '[]', 1, '2021-05-16 15:28:42', '2021-05-16 15:28:42'),
(120, 'plugins::content-manager.explorer.publish', 'application::monster-generator.monster-generator', '{}', '[]', 1, '2021-05-16 15:28:42', '2021-05-16 15:28:42');

-- --------------------------------------------------------

--
-- Table structure for table `strapi_role`
--

DROP TABLE IF EXISTS `strapi_role`;
CREATE TABLE `strapi_role` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `strapi_role`
--

INSERT INTO `strapi_role` (`id`, `name`, `code`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'strapi-super-admin', 'Super Admins can access and manage all features and settings.', '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(2, 'Editor', 'strapi-editor', 'Editors can manage and publish contents including those of other users.', '2021-05-16 15:00:15', '2021-05-16 15:00:15'),
(3, 'Author', 'strapi-author', 'Authors can manage the content they have created.', '2021-05-16 15:00:15', '2021-05-16 15:00:15');

-- --------------------------------------------------------

--
-- Table structure for table `strapi_users_roles`
--

DROP TABLE IF EXISTS `strapi_users_roles`;
CREATE TABLE `strapi_users_roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `strapi_users_roles`
--

INSERT INTO `strapi_users_roles` (`id`, `user_id`, `role_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `strapi_webhooks`
--

DROP TABLE IF EXISTS `strapi_webhooks`;
CREATE TABLE `strapi_webhooks` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `url` longtext DEFAULT NULL,
  `headers` longtext DEFAULT NULL,
  `events` longtext DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `upload_file`
--

DROP TABLE IF EXISTS `upload_file`;
CREATE TABLE `upload_file` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `alternativeText` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `formats` longtext DEFAULT NULL,
  `hash` varchar(255) NOT NULL,
  `ext` varchar(255) DEFAULT NULL,
  `mime` varchar(255) NOT NULL,
  `size` decimal(10,2) NOT NULL,
  `url` varchar(255) NOT NULL,
  `previewUrl` varchar(255) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_metadata` longtext DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `upload_file_morph`
--

DROP TABLE IF EXISTS `upload_file_morph`;
CREATE TABLE `upload_file_morph` (
  `id` int(10) UNSIGNED NOT NULL,
  `upload_file_id` int(11) DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `related_type` longtext DEFAULT NULL,
  `field` longtext DEFAULT NULL,
  `order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users-permissions_permission`
--

DROP TABLE IF EXISTS `users-permissions_permission`;
CREATE TABLE `users-permissions_permission` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `controller` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `policy` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users-permissions_permission`
--

INSERT INTO `users-permissions_permission` (`id`, `type`, `controller`, `action`, `enabled`, `policy`, `role`, `created_by`, `updated_by`) VALUES
(1, 'application', 'character-names', 'delete', 0, '', 1, NULL, NULL),
(2, 'application', 'character-names', 'find', 0, '', 1, NULL, NULL),
(3, 'application', 'character-names', 'find', 1, '', 2, NULL, NULL),
(4, 'application', 'character-names', 'update', 0, '', 1, NULL, NULL),
(5, 'application', 'character-names', 'update', 0, '', 2, NULL, NULL),
(6, 'application', 'character', 'count', 0, '', 2, NULL, NULL),
(7, 'application', 'character', 'create', 0, '', 1, NULL, NULL),
(8, 'application', 'character', 'create', 1, '', 2, NULL, NULL),
(9, 'application', 'character-names', 'delete', 0, '', 2, NULL, NULL),
(10, 'application', 'character', 'count', 0, '', 1, NULL, NULL),
(11, 'application', 'character', 'delete', 0, '', 1, NULL, NULL),
(12, 'application', 'character', 'delete', 0, '', 2, NULL, NULL),
(13, 'application', 'character', 'find', 0, '', 1, NULL, NULL),
(14, 'application', 'character', 'find', 1, '', 2, NULL, NULL),
(15, 'application', 'character', 'findone', 0, '', 1, NULL, NULL),
(16, 'application', 'character', 'findone', 1, '', 2, NULL, NULL),
(17, 'application', 'character', 'update', 0, '', 1, NULL, NULL),
(18, 'application', 'monster-generator', 'delete', 0, '', 1, NULL, NULL),
(19, 'application', 'monster-generator', 'delete', 0, '', 2, NULL, NULL),
(20, 'application', 'character', 'update', 0, '', 2, NULL, NULL),
(21, 'application', 'monster-generator', 'find', 0, '', 1, NULL, NULL),
(22, 'application', 'monster-generator', 'find', 0, '', 2, NULL, NULL),
(23, 'application', 'monster-generator', 'update', 0, '', 1, NULL, NULL),
(24, 'application', 'monster-generator', 'update', 0, '', 2, NULL, NULL),
(25, 'content-manager', 'collection-types', 'bulkdelete', 0, '', 1, NULL, NULL),
(26, 'content-manager', 'collection-types', 'bulkdelete', 0, '', 2, NULL, NULL),
(27, 'content-manager', 'collection-types', 'create', 0, '', 1, NULL, NULL),
(28, 'content-manager', 'collection-types', 'create', 0, '', 2, NULL, NULL),
(29, 'content-manager', 'collection-types', 'delete', 0, '', 1, NULL, NULL),
(30, 'content-manager', 'collection-types', 'delete', 0, '', 2, NULL, NULL),
(31, 'content-manager', 'collection-types', 'previewmanyrelations', 0, '', 1, NULL, NULL),
(32, 'content-manager', 'collection-types', 'previewmanyrelations', 0, '', 2, NULL, NULL),
(33, 'content-manager', 'collection-types', 'find', 0, '', 1, NULL, NULL),
(34, 'content-manager', 'collection-types', 'find', 0, '', 2, NULL, NULL),
(35, 'content-manager', 'collection-types', 'findone', 0, '', 1, NULL, NULL),
(36, 'content-manager', 'collection-types', 'findone', 0, '', 2, NULL, NULL),
(37, 'content-manager', 'collection-types', 'publish', 0, '', 1, NULL, NULL),
(38, 'content-manager', 'collection-types', 'publish', 0, '', 2, NULL, NULL),
(39, 'content-manager', 'collection-types', 'unpublish', 0, '', 1, NULL, NULL),
(40, 'content-manager', 'collection-types', 'unpublish', 0, '', 2, NULL, NULL),
(41, 'content-manager', 'collection-types', 'update', 0, '', 1, NULL, NULL),
(42, 'content-manager', 'collection-types', 'update', 0, '', 2, NULL, NULL),
(43, 'content-manager', 'components', 'findcomponentconfiguration', 0, '', 1, NULL, NULL),
(44, 'content-manager', 'components', 'findcomponentconfiguration', 0, '', 2, NULL, NULL),
(45, 'content-manager', 'components', 'findcomponents', 0, '', 1, NULL, NULL),
(46, 'content-manager', 'components', 'findcomponents', 0, '', 2, NULL, NULL),
(47, 'content-manager', 'components', 'updatecomponentconfiguration', 0, '', 1, NULL, NULL),
(48, 'content-manager', 'content-types', 'findcontenttypeconfiguration', 0, '', 2, NULL, NULL),
(49, 'content-manager', 'components', 'updatecomponentconfiguration', 0, '', 2, NULL, NULL),
(50, 'content-manager', 'content-types', 'findcontenttypeconfiguration', 0, '', 1, NULL, NULL),
(51, 'content-manager', 'content-types', 'findcontenttypes', 0, '', 1, NULL, NULL),
(52, 'content-manager', 'content-types', 'findcontenttypes', 0, '', 2, NULL, NULL),
(53, 'content-manager', 'content-types', 'findcontenttypessettings', 0, '', 1, NULL, NULL),
(54, 'content-manager', 'content-types', 'findcontenttypessettings', 0, '', 2, NULL, NULL),
(55, 'content-manager', 'content-types', 'updatecontenttypeconfiguration', 0, '', 1, NULL, NULL),
(56, 'content-manager', 'content-types', 'updatecontenttypeconfiguration', 0, '', 2, NULL, NULL),
(57, 'content-manager', 'relations', 'find', 0, '', 1, NULL, NULL),
(58, 'content-manager', 'relations', 'find', 0, '', 2, NULL, NULL),
(59, 'content-manager', 'single-types', 'createorupdate', 0, '', 1, NULL, NULL),
(60, 'content-manager', 'single-types', 'createorupdate', 0, '', 2, NULL, NULL),
(61, 'content-manager', 'single-types', 'delete', 0, '', 1, NULL, NULL),
(62, 'content-manager', 'single-types', 'delete', 0, '', 2, NULL, NULL),
(63, 'content-manager', 'single-types', 'find', 0, '', 1, NULL, NULL),
(64, 'content-manager', 'single-types', 'find', 0, '', 2, NULL, NULL),
(65, 'content-manager', 'single-types', 'publish', 0, '', 1, NULL, NULL),
(66, 'content-manager', 'single-types', 'publish', 0, '', 2, NULL, NULL),
(67, 'content-manager', 'single-types', 'unpublish', 0, '', 1, NULL, NULL),
(68, 'content-manager', 'single-types', 'unpublish', 0, '', 2, NULL, NULL),
(69, 'content-manager', 'uid', 'checkuidavailability', 0, '', 1, NULL, NULL),
(70, 'content-manager', 'uid', 'checkuidavailability', 0, '', 2, NULL, NULL),
(71, 'content-manager', 'uid', 'generateuid', 0, '', 1, NULL, NULL),
(72, 'content-manager', 'uid', 'generateuid', 0, '', 2, NULL, NULL),
(73, 'content-type-builder', 'builder', 'getreservednames', 0, '', 1, NULL, NULL),
(74, 'content-type-builder', 'builder', 'getreservednames', 0, '', 2, NULL, NULL),
(75, 'content-type-builder', 'componentcategories', 'deletecategory', 0, '', 1, NULL, NULL),
(76, 'content-type-builder', 'componentcategories', 'deletecategory', 0, '', 2, NULL, NULL),
(77, 'content-type-builder', 'componentcategories', 'editcategory', 0, '', 1, NULL, NULL),
(78, 'content-type-builder', 'componentcategories', 'editcategory', 0, '', 2, NULL, NULL),
(79, 'content-type-builder', 'components', 'createcomponent', 0, '', 1, NULL, NULL),
(80, 'content-type-builder', 'components', 'createcomponent', 0, '', 2, NULL, NULL),
(81, 'content-type-builder', 'components', 'deletecomponent', 0, '', 1, NULL, NULL),
(82, 'content-type-builder', 'components', 'deletecomponent', 0, '', 2, NULL, NULL),
(83, 'content-type-builder', 'components', 'getcomponent', 0, '', 1, NULL, NULL),
(84, 'content-type-builder', 'components', 'getcomponent', 0, '', 2, NULL, NULL),
(85, 'content-type-builder', 'components', 'getcomponents', 0, '', 1, NULL, NULL),
(86, 'content-type-builder', 'components', 'getcomponents', 0, '', 2, NULL, NULL),
(87, 'content-type-builder', 'components', 'updatecomponent', 0, '', 1, NULL, NULL),
(88, 'content-type-builder', 'components', 'updatecomponent', 0, '', 2, NULL, NULL),
(89, 'content-type-builder', 'connections', 'getconnections', 0, '', 1, NULL, NULL),
(90, 'content-type-builder', 'connections', 'getconnections', 0, '', 2, NULL, NULL),
(91, 'content-type-builder', 'contenttypes', 'createcontenttype', 0, '', 1, NULL, NULL),
(92, 'content-type-builder', 'contenttypes', 'createcontenttype', 0, '', 2, NULL, NULL),
(93, 'content-type-builder', 'contenttypes', 'deletecontenttype', 0, '', 1, NULL, NULL),
(94, 'content-type-builder', 'contenttypes', 'deletecontenttype', 0, '', 2, NULL, NULL),
(95, 'content-type-builder', 'contenttypes', 'getcontenttype', 0, '', 1, NULL, NULL),
(96, 'content-type-builder', 'contenttypes', 'getcontenttype', 0, '', 2, NULL, NULL),
(97, 'content-type-builder', 'contenttypes', 'getcontenttypes', 0, '', 1, NULL, NULL),
(98, 'content-type-builder', 'contenttypes', 'getcontenttypes', 0, '', 2, NULL, NULL),
(99, 'content-type-builder', 'contenttypes', 'updatecontenttype', 0, '', 1, NULL, NULL),
(100, 'content-type-builder', 'contenttypes', 'updatecontenttype', 0, '', 2, NULL, NULL),
(101, 'email', 'email', 'getsettings', 0, '', 1, NULL, NULL),
(102, 'email', 'email', 'getsettings', 0, '', 2, NULL, NULL),
(103, 'email', 'email', 'send', 0, '', 1, NULL, NULL),
(104, 'email', 'email', 'send', 0, '', 2, NULL, NULL),
(105, 'email', 'email', 'test', 0, '', 1, NULL, NULL),
(106, 'email', 'email', 'test', 0, '', 2, NULL, NULL),
(107, 'i18n', 'content-types', 'getnonlocalizedattributes', 0, '', 1, NULL, NULL),
(108, 'i18n', 'content-types', 'getnonlocalizedattributes', 0, '', 2, NULL, NULL),
(109, 'i18n', 'iso-locales', 'listisolocales', 0, '', 1, NULL, NULL),
(110, 'i18n', 'iso-locales', 'listisolocales', 0, '', 2, NULL, NULL),
(111, 'i18n', 'locales', 'createlocale', 0, '', 1, NULL, NULL),
(112, 'i18n', 'locales', 'createlocale', 0, '', 2, NULL, NULL),
(113, 'i18n', 'locales', 'deletelocale', 0, '', 1, NULL, NULL),
(114, 'i18n', 'locales', 'deletelocale', 0, '', 2, NULL, NULL),
(115, 'i18n', 'locales', 'listlocales', 0, '', 1, NULL, NULL),
(116, 'i18n', 'locales', 'listlocales', 0, '', 2, NULL, NULL),
(117, 'i18n', 'locales', 'updatelocale', 0, '', 1, NULL, NULL),
(118, 'i18n', 'locales', 'updatelocale', 0, '', 2, NULL, NULL),
(119, 'upload', 'upload', 'count', 0, '', 1, NULL, NULL),
(120, 'upload', 'upload', 'count', 0, '', 2, NULL, NULL),
(121, 'upload', 'upload', 'destroy', 0, '', 1, NULL, NULL),
(122, 'upload', 'upload', 'destroy', 0, '', 2, NULL, NULL),
(123, 'upload', 'upload', 'find', 0, '', 1, NULL, NULL),
(124, 'upload', 'upload', 'find', 0, '', 2, NULL, NULL),
(125, 'upload', 'upload', 'findone', 0, '', 1, NULL, NULL),
(126, 'upload', 'upload', 'findone', 0, '', 2, NULL, NULL),
(127, 'upload', 'upload', 'getsettings', 0, '', 1, NULL, NULL),
(128, 'upload', 'upload', 'getsettings', 0, '', 2, NULL, NULL),
(129, 'upload', 'upload', 'search', 0, '', 1, NULL, NULL),
(130, 'upload', 'upload', 'search', 0, '', 2, NULL, NULL),
(131, 'upload', 'upload', 'updatesettings', 0, '', 1, NULL, NULL),
(132, 'upload', 'upload', 'updatesettings', 0, '', 2, NULL, NULL),
(133, 'upload', 'upload', 'upload', 0, '', 1, NULL, NULL),
(134, 'upload', 'upload', 'upload', 0, '', 2, NULL, NULL),
(135, 'users-permissions', 'auth', 'callback', 0, '', 1, NULL, NULL),
(136, 'users-permissions', 'auth', 'callback', 1, '', 2, NULL, NULL),
(137, 'users-permissions', 'auth', 'connect', 1, '', 1, NULL, NULL),
(138, 'users-permissions', 'auth', 'connect', 1, '', 2, NULL, NULL),
(139, 'users-permissions', 'auth', 'emailconfirmation', 0, '', 1, NULL, NULL),
(140, 'users-permissions', 'auth', 'emailconfirmation', 1, '', 2, NULL, NULL),
(141, 'users-permissions', 'auth', 'forgotpassword', 0, '', 1, NULL, NULL),
(142, 'users-permissions', 'auth', 'forgotpassword', 1, '', 2, NULL, NULL),
(143, 'users-permissions', 'auth', 'register', 0, '', 1, NULL, NULL),
(144, 'users-permissions', 'auth', 'register', 1, '', 2, NULL, NULL),
(145, 'users-permissions', 'auth', 'resetpassword', 0, '', 1, NULL, NULL),
(146, 'users-permissions', 'auth', 'resetpassword', 1, '', 2, NULL, NULL),
(147, 'users-permissions', 'auth', 'sendemailconfirmation', 0, '', 1, NULL, NULL),
(148, 'users-permissions', 'auth', 'sendemailconfirmation', 0, '', 2, NULL, NULL),
(149, 'users-permissions', 'user', 'count', 0, '', 1, NULL, NULL),
(150, 'users-permissions', 'user', 'count', 0, '', 2, NULL, NULL),
(151, 'users-permissions', 'user', 'create', 0, '', 1, NULL, NULL),
(152, 'users-permissions', 'user', 'create', 0, '', 2, NULL, NULL),
(153, 'users-permissions', 'user', 'destroy', 0, '', 1, NULL, NULL),
(154, 'users-permissions', 'user', 'destroy', 0, '', 2, NULL, NULL),
(155, 'users-permissions', 'user', 'destroyall', 0, '', 1, NULL, NULL),
(156, 'users-permissions', 'user', 'destroyall', 0, '', 2, NULL, NULL),
(157, 'users-permissions', 'user', 'find', 0, '', 1, NULL, NULL),
(158, 'users-permissions', 'user', 'find', 0, '', 2, NULL, NULL),
(159, 'users-permissions', 'user', 'findone', 0, '', 1, NULL, NULL),
(160, 'users-permissions', 'user', 'findone', 0, '', 2, NULL, NULL),
(161, 'users-permissions', 'user', 'me', 1, '', 1, NULL, NULL),
(162, 'users-permissions', 'user', 'me', 1, '', 2, NULL, NULL),
(163, 'users-permissions', 'user', 'update', 0, '', 1, NULL, NULL),
(164, 'users-permissions', 'user', 'update', 0, '', 2, NULL, NULL),
(165, 'users-permissions', 'userspermissions', 'createrole', 0, '', 1, NULL, NULL),
(166, 'users-permissions', 'userspermissions', 'createrole', 0, '', 2, NULL, NULL),
(167, 'users-permissions', 'userspermissions', 'deleterole', 0, '', 1, NULL, NULL),
(168, 'users-permissions', 'userspermissions', 'deleterole', 0, '', 2, NULL, NULL),
(169, 'users-permissions', 'userspermissions', 'getadvancedsettings', 0, '', 1, NULL, NULL),
(170, 'users-permissions', 'userspermissions', 'getadvancedsettings', 0, '', 2, NULL, NULL),
(171, 'users-permissions', 'userspermissions', 'getemailtemplate', 0, '', 1, NULL, NULL),
(172, 'users-permissions', 'userspermissions', 'getemailtemplate', 0, '', 2, NULL, NULL),
(173, 'users-permissions', 'userspermissions', 'getpermissions', 0, '', 1, NULL, NULL),
(174, 'users-permissions', 'userspermissions', 'getpermissions', 0, '', 2, NULL, NULL),
(175, 'users-permissions', 'userspermissions', 'getpolicies', 0, '', 1, NULL, NULL),
(176, 'users-permissions', 'userspermissions', 'getpolicies', 0, '', 2, NULL, NULL),
(177, 'users-permissions', 'userspermissions', 'getproviders', 0, '', 1, NULL, NULL),
(178, 'users-permissions', 'userspermissions', 'getproviders', 0, '', 2, NULL, NULL),
(179, 'users-permissions', 'userspermissions', 'getrole', 0, '', 1, NULL, NULL),
(180, 'users-permissions', 'userspermissions', 'getrole', 0, '', 2, NULL, NULL),
(181, 'users-permissions', 'userspermissions', 'getroles', 0, '', 2, NULL, NULL),
(182, 'users-permissions', 'userspermissions', 'getroles', 0, '', 1, NULL, NULL),
(183, 'users-permissions', 'userspermissions', 'getroutes', 0, '', 1, NULL, NULL),
(184, 'users-permissions', 'userspermissions', 'getroutes', 0, '', 2, NULL, NULL),
(185, 'users-permissions', 'userspermissions', 'index', 0, '', 1, NULL, NULL),
(186, 'users-permissions', 'userspermissions', 'index', 0, '', 2, NULL, NULL),
(187, 'users-permissions', 'userspermissions', 'searchusers', 0, '', 1, NULL, NULL),
(188, 'users-permissions', 'userspermissions', 'updateadvancedsettings', 0, '', 1, NULL, NULL),
(189, 'users-permissions', 'userspermissions', 'searchusers', 0, '', 2, NULL, NULL),
(190, 'users-permissions', 'userspermissions', 'updateadvancedsettings', 0, '', 2, NULL, NULL),
(191, 'users-permissions', 'userspermissions', 'updateemailtemplate', 0, '', 1, NULL, NULL),
(192, 'users-permissions', 'userspermissions', 'updateemailtemplate', 0, '', 2, NULL, NULL),
(193, 'users-permissions', 'userspermissions', 'updateproviders', 0, '', 1, NULL, NULL),
(194, 'users-permissions', 'userspermissions', 'updateproviders', 0, '', 2, NULL, NULL),
(195, 'users-permissions', 'userspermissions', 'updaterole', 0, '', 1, NULL, NULL),
(196, 'users-permissions', 'userspermissions', 'updaterole', 0, '', 2, NULL, NULL),
(197, 'application', 'location-generator', 'delete', 0, '', 1, NULL, NULL),
(198, 'application', 'location-generator', 'delete', 0, '', 2, NULL, NULL),
(199, 'application', 'location-generator', 'find', 0, '', 1, NULL, NULL),
(200, 'application', 'location-generator', 'find', 1, '', 2, NULL, NULL),
(201, 'application', 'location-generator', 'update', 0, '', 1, NULL, NULL),
(202, 'application', 'location-generator', 'update', 0, '', 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users-permissions_role`
--

DROP TABLE IF EXISTS `users-permissions_role`;
CREATE TABLE `users-permissions_role` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users-permissions_role`
--

INSERT INTO `users-permissions_role` (`id`, `name`, `description`, `type`, `created_by`, `updated_by`) VALUES
(1, 'Authenticated', 'Default role given to authenticated user.', 'authenticated', NULL, NULL),
(2, 'Public', 'Default role given to unauthenticated user.', 'public', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users-permissions_user`
--

DROP TABLE IF EXISTS `users-permissions_user`;
CREATE TABLE `users-permissions_user` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `confirmationToken` varchar(255) DEFAULT NULL,
  `confirmed` tinyint(1) DEFAULT NULL,
  `blocked` tinyint(1) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `character_names`
--
ALTER TABLE `character_names`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `core_store`
--
ALTER TABLE `core_store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `i18n_locales`
--
ALTER TABLE `i18n_locales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `i18n_locales_code_unique` (`code`);

--
-- Indexes for table `location_generators`
--
ALTER TABLE `location_generators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monster_generators`
--
ALTER TABLE `monster_generators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `strapi_administrator`
--
ALTER TABLE `strapi_administrator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `strapi_administrator_email_unique` (`email`);

--
-- Indexes for table `strapi_permission`
--
ALTER TABLE `strapi_permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `strapi_role`
--
ALTER TABLE `strapi_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `strapi_role_name_unique` (`name`),
  ADD UNIQUE KEY `strapi_role_code_unique` (`code`);

--
-- Indexes for table `strapi_users_roles`
--
ALTER TABLE `strapi_users_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `strapi_webhooks`
--
ALTER TABLE `strapi_webhooks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `upload_file`
--
ALTER TABLE `upload_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `upload_file_morph`
--
ALTER TABLE `upload_file_morph`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users-permissions_permission`
--
ALTER TABLE `users-permissions_permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users-permissions_role`
--
ALTER TABLE `users-permissions_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users-permissions_role_type_unique` (`type`);

--
-- Indexes for table `users-permissions_user`
--
ALTER TABLE `users-permissions_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users-permissions_user_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `character_names`
--
ALTER TABLE `character_names`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_store`
--
ALTER TABLE `core_store`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `i18n_locales`
--
ALTER TABLE `i18n_locales`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `location_generators`
--
ALTER TABLE `location_generators`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `monster_generators`
--
ALTER TABLE `monster_generators`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `strapi_administrator`
--
ALTER TABLE `strapi_administrator`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `strapi_permission`
--
ALTER TABLE `strapi_permission`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `strapi_role`
--
ALTER TABLE `strapi_role`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `strapi_users_roles`
--
ALTER TABLE `strapi_users_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `strapi_webhooks`
--
ALTER TABLE `strapi_webhooks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `upload_file`
--
ALTER TABLE `upload_file`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `upload_file_morph`
--
ALTER TABLE `upload_file_morph`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users-permissions_permission`
--
ALTER TABLE `users-permissions_permission`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `users-permissions_role`
--
ALTER TABLE `users-permissions_role`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users-permissions_user`
--
ALTER TABLE `users-permissions_user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
