<?php
/**
 * API Endpoint untuk Umpan Balik
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'list':
            $status = $_GET['status'] ?? null;
            
            if ($status) {
                $stmt = $conn->prepare("SELECT ub.*, u.nama as user_nama, m.judul as materi_judul FROM umpan_balik ub JOIN users u ON ub.user_id = u.id LEFT JOIN materi m ON ub.materi_id = m.id WHERE ub.status = ? ORDER BY ub.created_at DESC");
                $stmt->execute([$status]);
            } else {
                $stmt = $conn->query("SELECT ub.*, u.nama as user_nama, m.judul as materi_judul FROM umpan_balik ub JOIN users u ON ub.user_id = u.id LEFT JOIN materi m ON ub.materi_id = m.id ORDER BY ub.created_at DESC");
            }
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (?, ?, ?, ?, ?, 'menunggu')");
            $stmt->execute([
                $input['user_id'],
                $input['materi_id'] ?? null,
                $input['kategori'],
                $input['rating'],
                $input['komentar']
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE umpan_balik SET status = ?, balasan = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $input['status'],
                $input['balasan'] ?? null,
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        case 'delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $conn->prepare("DELETE FROM umpan_balik WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
