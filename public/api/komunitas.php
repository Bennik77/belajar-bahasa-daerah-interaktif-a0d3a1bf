<?php
/**
 * API Endpoint untuk Komunitas, Diskusi, dan Laporan
 */

require_once 'config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    $conn = getConnection();
    
    switch ($action) {
        // ============ KOMUNITAS ============
        case 'list':
            $stmt = $conn->query("SELECT * FROM komunitas ORDER BY id");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['bahasa_id'],
                $input['nama'],
                $input['deskripsi'] ?? '',
                $input['aturan'] ?? '',
                $input['status'] ?? 'aktif'
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE komunitas SET bahasa_id = ?, nama = ?, deskripsi = ?, aturan = ?, status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $input['bahasa_id'],
                $input['nama'],
                $input['deskripsi'] ?? '',
                $input['aturan'] ?? '',
                $input['status'] ?? 'aktif',
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        case 'delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $conn->prepare("DELETE FROM komunitas WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        // ============ DISKUSI ============
        case 'diskusi-list':
            $komunitas_id = $_GET['komunitas_id'] ?? null;
            
            if ($komunitas_id) {
                $stmt = $conn->prepare("SELECT d.*, u.nama as user_nama FROM diskusi d JOIN users u ON d.user_id = u.id WHERE d.komunitas_id = ? AND d.status = 'aktif' ORDER BY d.created_at DESC");
                $stmt->execute([$komunitas_id]);
            } else {
                $stmt = $conn->query("SELECT d.*, u.nama as user_nama FROM diskusi d JOIN users u ON d.user_id = u.id WHERE d.status = 'aktif' ORDER BY d.created_at DESC");
            }
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'diskusi-create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO diskusi (komunitas_id, user_id, judul, konten, status) VALUES (?, ?, ?, ?, 'aktif')");
            $stmt->execute([
                $input['komunitas_id'],
                $input['user_id'],
                $input['judul'],
                $input['konten']
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'diskusi-delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $conn->prepare("UPDATE diskusi SET status = 'dihapus' WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        // ============ KOMENTAR ============
        case 'komentar-list':
            $diskusi_id = $_GET['diskusi_id'] ?? 0;
            $stmt = $conn->prepare("SELECT k.*, u.nama as user_nama FROM komentar_diskusi k JOIN users u ON k.user_id = u.id WHERE k.diskusi_id = ? AND k.status = 'aktif' ORDER BY k.created_at");
            $stmt->execute([$diskusi_id]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'komentar-create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO komentar_diskusi (diskusi_id, user_id, konten, status) VALUES (?, ?, ?, 'aktif')");
            $stmt->execute([
                $input['diskusi_id'],
                $input['user_id'],
                $input['konten']
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'komentar-delete':
            if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $id = $_GET['id'] ?? 0;
            $conn->prepare("UPDATE komentar_diskusi SET status = 'dihapus' WHERE id = ?")->execute([$id]);
            
            jsonResponse(['success' => true]);
            break;
            
        // ============ LAPORAN PELANGGARAN ============
        case 'laporan-list':
            $stmt = $conn->query("SELECT lp.*, u1.nama as pelapor_nama, u2.nama as terlapor_nama FROM laporan_pelanggaran lp JOIN users u1 ON lp.pelapor_id = u1.id JOIN users u2 ON lp.terlapor_id = u2.id ORDER BY lp.created_at DESC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'laporan-create':
            if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $stmt = $conn->prepare("INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, diskusi_id, komentar_id, alasan, status) VALUES (?, ?, ?, ?, ?, 'menunggu')");
            $stmt->execute([
                $input['pelapor_id'],
                $input['terlapor_id'],
                $input['diskusi_id'] ?? null,
                $input['komentar_id'] ?? null,
                $input['alasan']
            ]);
            
            jsonResponse(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'laporan-update':
            if ($method !== 'PUT') jsonResponse(['error' => 'Method not allowed'], 405);
            
            $input = getJsonInput();
            $id = $input['id'] ?? 0;
            
            $stmt = $conn->prepare("UPDATE laporan_pelanggaran SET status = ?, tindakan = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $input['status'],
                $input['tindakan'] ?? null,
                $id
            ]);
            
            jsonResponse(['success' => true]);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
