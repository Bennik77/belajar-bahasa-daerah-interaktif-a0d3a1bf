<?php
/**
 * API Endpoint untuk Flashcard Kosakata
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'list':
            $bahasa_id = $_GET['bahasa_id'] ?? null;
            
            if ($bahasa_id) {
                $stmt = $conn->prepare("SELECT * FROM flashcard WHERE bahasa_id = ? ORDER BY id");
                $stmt->execute([$bahasa_id]);
            } else {
                $stmt = $conn->query("SELECT * FROM flashcard ORDER BY bahasa_id, id");
            }
            $data = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $data]);
            break;
            
        case 'create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO flashcard (bahasa_id, front, back) VALUES (?, ?, ?)");
            $stmt->execute([
                $input['bahasa_id'],
                $input['front'],
                $input['back']
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $stmt = $conn->prepare("DELETE FROM flashcard WHERE id = ?");
            $stmt->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
