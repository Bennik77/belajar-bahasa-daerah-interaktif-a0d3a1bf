<?php
/**
 * API Endpoint untuk Users (Autentikasi & Manajemen Pengguna)
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'login':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
            $stmt->execute([$email, $password]);
            $user = $stmt->fetch();
            
            if ($user) {
                if ($user['status'] !== 'aktif') {
                    jsonResponse(['error' => 'Akun tidak aktif atau diblokir'], 401);
                }
                unset($user['password']); // Jangan kirim password
                jsonResponse(['success' => true, 'user' => $user]);
            } else {
                jsonResponse(['error' => 'Email atau password salah'], 401);
            }
            break;
            
        case 'register':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $nama = $input['nama'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            // Cek email sudah terdaftar
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                jsonResponse(['error' => 'Email sudah terdaftar'], 400);
            }
            
            // Insert user baru
            $stmt = $conn->prepare("INSERT INTO users (nama, email, password, role, status) VALUES (?, ?, ?, 'pengguna', 'aktif')");
            $stmt->execute([$nama, $email, $password]);
            
            jsonResponse(['success' => true, 'message' => 'Registrasi berhasil']);
            break;
            
        case 'list':
            if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $stmt = $conn->query("SELECT id, nama, email, role, status, created_at, updated_at FROM users ORDER BY id");
            $users = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $users]);
            break;
            
        case 'update-status':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            $status = $input['status'] ?? '';
            
            $stmt = $conn->prepare("UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$status, $id]);
            
            jsonResponse(['success' => true, 'message' => 'Status berhasil diperbarui']);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
