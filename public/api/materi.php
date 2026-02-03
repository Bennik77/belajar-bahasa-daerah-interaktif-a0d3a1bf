<?php
/**
 * API Endpoint untuk Materi Pembelajaran
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
                $stmt = $conn->prepare("SELECT * FROM materi WHERE bahasa_id = ? ORDER BY urutan");
                $stmt->execute([$bahasa_id]);
            } else {
                $stmt = $conn->query("SELECT * FROM materi ORDER BY bahasa_id, urutan");
            }
            $materi = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $materi]);
            break;
            
        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $conn->prepare("SELECT * FROM materi WHERE id = ?");
            $stmt->execute([$id]);
            $materi = $stmt->fetch();
            
            if ($materi) {
                jsonResponse(['success' => true, 'data' => $materi]);
            } else {
                jsonResponse(['error' => 'Materi tidak ditemukan'], 404);
            }
            break;
            
        case 'create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['bahasa_id'],
                $input['judul'],
                $input['deskripsi'] ?? '',
                $input['konten'] ?? '',
                $input['tipe'],
                $input['urutan'] ?? 0,
                $input['durasi_menit'] ?? 15,
                $input['status'] ?? 'aktif'
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE materi SET bahasa_id = ?, judul = ?, deskripsi = ?, konten = ?, tipe = ?, urutan = ?, durasi_menit = ?, status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $input['bahasa_id'],
                $input['judul'],
                $input['deskripsi'] ?? '',
                $input['konten'] ?? '',
                $input['tipe'],
                $input['urutan'] ?? 0,
                $input['durasi_menit'] ?? 15,
                $input['status'] ?? 'aktif',
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        case 'delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $stmt = $conn->prepare("DELETE FROM materi WHERE id = ?");
            $stmt->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
