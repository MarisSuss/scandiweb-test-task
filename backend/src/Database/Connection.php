<?php

declare(strict_types=1);

namespace Src\Database;

use PDO;
use PDOException;

class Connection
{
    private PDO $pdo;

    // Establishes a new PDO connection using environment variables
    public function __construct()
    {
        $host = $_ENV['DB_HOST'];
        $db   = $_ENV['DB_NAME'];
        $user = $_ENV['DB_USER'];
        $pass = $_ENV['DB_PASS'];

        try {
            $this->pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    }

    // Returns the active PDO instance
    public function connect(): PDO
    {
        return $this->pdo;
    }
}