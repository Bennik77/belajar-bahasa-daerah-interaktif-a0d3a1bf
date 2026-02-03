<?php
/**
 * API Endpoint untuk Bahasa Daerah
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'list':
            $stmt = $conn->query("SELECT * FROM bahasa_daerah ORDER BY id");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $conn->prepare("SELECT * FROM bahasa_daerah WHERE id = ?");
            $stmt->execute([$id]);
            $bahasa = $stmt->fetch();
            
            if ($bahasa) {
                jsonResponse(['success' => true, 'data' => $bahasa]);
            } else {
                jsonResponse(['error' => 'Bahasa tidak ditemukan'], 404);
            }
            break;
            
        case 'create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO bahasa_daerah (nama_bahasa, deskripsi, icon, status) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $input['nama_bahasa'],
                $input['deskripsi'] ?? '',
                $input['icon'] ?? '🌐',
                $input['status'] ?? 'aktif'
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE bahasa_daerah SET nama_bahasa = ?, deskripsi = ?, icon = ?, status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $input['nama_bahasa'],
                $input['deskripsi'] ?? '',
                $input['icon'] ?? '🌐',
                $input['status'] ?? 'aktif',
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        case 'delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $conn->prepare("DELETE FROM bahasa_daerah WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
