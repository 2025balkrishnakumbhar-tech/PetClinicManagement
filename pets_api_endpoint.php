<?php
// api/pets.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM pets WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $pet = $stmt->fetch();

            if ($pet) {
                // Fetch visits
                $visitStmt = $conn->prepare("SELECT * FROM visits WHERE pet_id = :pet_id");
                $visitStmt->bindParam(':pet_id', $id);
                $visitStmt->execute();
                $pet['visits'] = $visitStmt->fetchAll();

                echo json_encode(["status" => "success", "data" => $pet]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Pet not found"]);
            }
        } else {
            $stmt = $conn->prepare("SELECT pets.*, owners.first_name as owner_first_name, owners.last_name as owner_last_name 
                                    FROM pets LEFT JOIN owners ON pets.owner_id = owners.id ORDER BY pets.id DESC");
            $stmt->execute();
            $pets = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $pets]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['name']) && !empty($data['owner_id'])) {
            $query = "INSERT INTO pets (name, birth_date, type, owner_id) 
                      VALUES (:name, :birth_date, :type, :owner_id)";
            $stmt = $conn->prepare($query);

            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':birth_date', $data['birth_date']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':owner_id', $data['owner_id']);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["status" => "success", "id" => $conn->lastInsertId(), "message" => "Pet added successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Unable to add pet"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data. Pet name and owner_id required."]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("DELETE FROM pets WHERE id = :id");
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Pet deleted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to delete pet"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID parameter is missing"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>