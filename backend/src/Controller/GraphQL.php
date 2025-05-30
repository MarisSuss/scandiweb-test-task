<?php

/**
 * declare(strict_types=1);
 * $output = $result->toArray(true); expects int, get's bool and throws type error
 */

namespace Src\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use Src\GraphQL\Queries\QueryType;
use Src\GraphQL\Mutations\MutationType;
use RuntimeException;
use Throwable;

class GraphQL {
    // Handles the GraphQL request and returns the response
    static public function handle() {
        try {
            $queryType = new QueryType();
            $mutationType = new MutationType();

            $schema = new Schema(
                (new SchemaConfig())
                ->setQuery($queryType)
                ->setMutation($mutationType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? null;
            $variableValues = $input['variables'] ?? null;

            $rootValue = [];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray(true);
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}