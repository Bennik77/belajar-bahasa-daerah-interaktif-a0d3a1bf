<?php
/**
 * API Endpoint untuk Progress Belajar
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'list':
            $user_id = $_GET['user_id'] ?? 0;
            $stmt = $conn->prepare("SELECT pb.*, m.judul as materi_judul, bd.nama_bahasa FROM progress_belajar pb JOIN materi m ON pb.materi_id = m.id JOIN bahasa_daerah bd ON pb.bahasa_id = bd.id WHERE pb.user_id = ? ORDER BY pb.updated_at DESC");
            $stmt->execute([$user_id]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'update':
            if ($method !== 'POST' && $method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $user_id = $input['user_id'];
            $materi_id = $input['materi_id'];
            $bahasa_id = $input['bahasa_id'];
            
            // Cek apakah sudah ada
            $stmt = $conn->prepare("SELECT id, waktu_belajar FROM progress_belajar WHERE user_id = ? AND materi_id = ?");
            $stmt->execute([$user_id, $materi_id]);
            $existing = $stmt->fetch();
            
            if ($existing) {
                // Jika mengirim waktu_belajar (total), gunakan itu. Jika waktu_tambahan, tambahkan.
                if (isset($input['waktu_belajar'])) {
                    $new_waktu = $input['waktu_belajar'];
                } else {
                    $new_waktu = $existing['waktu_belajar'] + ($input['waktu_tambahan'] ?? 0);
                }

                $stmt = $conn->prepare("UPDATE progress_belajar SET status = ?, persentase = ?, waktu_belajar = ?, updated_at = NOW() WHERE id = ?");
                $stmt->execute([
                    $input['status'] ?? 'sedang_belajar',
                    $input['persentase'] ?? 0,
                    $new_waktu,
                    $existing['id']
                ]);
            } else {
                $stmt = $conn->prepare("INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $user_id,
                    $materi_id,
                    $bahasa_id,
                    $input['status'] ?? 'sedang_belajar',
                    $input['persentase'] ?? 0,
                    $input['waktu_belajar'] ?? ($input['waktu_tambahan'] ?? 0)
                ]);
            }
            
            jsonResponse(['success' => true]);
            break;
            
        case 'stats':
            $user_id = $_GET['user_id'] ?? 0;
            
            // Total materi selesai
            $stmt = $conn->prepare("SELECT COUNT(*) as total FROM progress_belajar WHERE user_id = ? AND status = 'selesai'");
            $stmt->execute([$user_id]);
            $materiSelesai = $stmt->fetch()['total'];
            
            // Total waktu belajar
            $stmt = $conn->prepare("SELECT SUM(waktu_belajar) as total FROM progress_belajar WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $waktuTotal = $stmt->fetch()['total'] ?? 0;
            
            // Total ujian
            $stmt = $conn->prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'lulus' THEN 1 ELSE 0 END) as lulus FROM hasil_ujian WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $ujian = $stmt->fetch();
            
            jsonResponse(['success' => true, 'data' => [
                'materi_selesai' => (int)$materiSelesai,
                'waktu_belajar' => (int)$waktuTotal,
                'ujian_total' => (int)$ujian['total'],
                'ujian_lulus' => (int)$ujian['lulus']
            ]]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
