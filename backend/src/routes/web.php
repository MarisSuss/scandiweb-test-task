<?php

use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;
use Src\Controller\GraphQL;

$dispatcher = simpleDispatcher(function(RouteCollector $r) {
    $r->post('/graphql', [GraphQL::class, 'handle']);
});

$routeInfo = $dispatcher->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);

// DEBUG: Log the incoming request method and URI
error_log("Routing request: {$_SERVER['REQUEST_METHOD']} {$_SERVER['REQUEST_URI']}");

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
        break;

    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed', 'allowed_methods' => $allowedMethods]);
        break;

    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        echo $handler($vars);
        break;
}