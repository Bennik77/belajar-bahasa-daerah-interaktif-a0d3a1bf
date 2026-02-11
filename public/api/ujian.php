<?php
/**
 * API Endpoint untuk Ujian dan Soal
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    $conn = getConnection();
    
    switch ($action) {
        // ============ UJIAN ============
        case 'list':
            $bahasa_id = $_GET['bahasa_id'] ?? null;
            
            if ($bahasa_id) {
                $stmt = $conn->prepare("SELECT * FROM ujian WHERE bahasa_id = ? ORDER BY id");
                $stmt->execute([$bahasa_id]);
            } else {
                $stmt = $conn->query("SELECT * FROM ujian ORDER BY id");
            }
            $ujian = $stmt->fetchAll();
            jsonResponse(['success' => true, 'data' => $ujian]);
            break;
            
        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $conn->prepare("SELECT * FROM ujian WHERE id = ?");
            $stmt->execute([$id]);
            $ujian = $stmt->fetch();
            
            if ($ujian) {
                // Ambil soal juga
                $stmtSoal = $conn->prepare("SELECT * FROM soal_ujian WHERE ujian_id = ? ORDER BY urutan");
                $stmtSoal->execute([$id]);
                $ujian['soal'] = $stmtSoal->fetchAll();
                jsonResponse(['success' => true, 'data' => $ujian]);
            } else {
                jsonResponse(['error' => 'Ujian tidak ditemukan'], 404);
            }
            break;
            
        case 'create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['bahasa_id'],
                $input['judul'],
                $input['deskripsi'] ?? '',
                $input['durasi_menit'] ?? 30,
                $input['passing_grade'] ?? 60,
                $input['status'] ?? 'aktif'
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE ujian SET bahasa_id = ?, judul = ?, deskripsi = ?, durasi_menit = ?, passing_grade = ?, status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $input['bahasa_id'],
                $input['judul'],
                $input['deskripsi'] ?? '',
                $input['durasi_menit'] ?? 30,
                $input['passing_grade'] ?? 60,
                $input['status'] ?? 'aktif',
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        case 'delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            // Hapus soal terkait dulu
            $conn->prepare("DELETE FROM soal_ujian WHERE ujian_id = ?")->execute([$id]);
            $conn->prepare("DELETE FROM ujian WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        // ============ SOAL ============
        case 'soal-list':
            $ujian_id = $_GET['ujian_id'] ?? 0;
            $stmt = $conn->prepare("SELECT * FROM soal_ujian WHERE ujian_id = ? ORDER BY urutan");
            $stmt->execute([$ujian_id]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'soal-create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['ujian_id'],
                $input['pertanyaan'],
                $input['pilihan_a'],
                $input['pilihan_b'],
                $input['pilihan_c'],
                $input['pilihan_d'],
                $input['jawaban_benar'],
                $input['urutan'] ?? 1
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'soal-update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE soal_ujian SET pertanyaan = ?, pilihan_a = ?, pilihan_b = ?, pilihan_c = ?, pilihan_d = ?, jawaban_benar = ?, urutan = ? WHERE id = ?");
            $stmt->execute([
                $input['pertanyaan'],
                $input['pilihan_a'],
                $input['pilihan_b'],
                $input['pilihan_c'],
                $input['pilihan_d'],
                $input['jawaban_benar'],
                $input['urutan'] ?? 1,
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        case 'soal-delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $conn->prepare("DELETE FROM soal_ujian WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        // ============ HASIL UJIAN ============
        case 'submit-hasil':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status, waktu_selesai) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['user_id'],
                $input['ujian_id'],
                $input['nilai'],
                $input['jumlah_benar'],
                $input['jumlah_soal'],
                $input['status'],
                $input['waktu_selesai']
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'hasil-user':
            $user_id = $_GET['user_id'] ?? 0;
            $stmt = $conn->prepare("SELECT hu.*, u.judul as ujian_judul FROM hasil_ujian hu JOIN ujian u ON hu.ujian_id = u.id WHERE hu.user_id = ? ORDER BY hu.created_at DESC");
            $stmt->execute([$user_id]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
