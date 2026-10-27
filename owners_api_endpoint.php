<?php
// api/owners.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get single owner with pets
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM owners WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $owner = $stmt->fetch();

            if ($owner) {
                // Fetch associated pets
                $petStmt = $conn->prepare("SELECT * FROM pets WHERE owner_id = :owner_id");
                $petStmt->bindParam(':owner_id', $id);
                $petStmt->execute();
                $owner['pets'] = $petStmt->fetchAll();

                echo json_encode(["status" => "success", "data" => $owner]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Owner not found"]);
            }
        } else {
            // Get all owners
            $stmt = $conn->prepare("SELECT * FROM owners ORDER BY id DESC");
            $stmt->execute();
            $owners = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $owners]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['first_name']) && !empty($data['last_name'])) {
            $query = "INSERT INTO owners (first_name, last_name, address, city, telephone) 
                      VALUES (:first_name, :last_name, :address, :city, :telephone)";
            $stmt = $conn->prepare($query);

            $stmt->bindParam(':first_name', $data['first_name']);
            $stmt->bindParam(':last_name', $data['last_name']);
            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':telephone', $data['telephone']);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["status" => "success", "id" => $conn->lastInsertId(), "message" => "Owner created successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Unable to create owner"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data. First name and last name required."]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("DELETE FROM owners WHERE id = :id");
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Owner deleted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to delete owner"]);
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