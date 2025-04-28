<?php

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../src');
$dotenv->load();

require_once __DIR__ . '/../src/routes/web.php';