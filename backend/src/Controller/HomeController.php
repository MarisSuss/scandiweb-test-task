<?php

namespace Src\Controller;

class HomeController
{
    public static function home()
    {
        return json_encode(['message' => 'You are at HomeController!']);
    }
}