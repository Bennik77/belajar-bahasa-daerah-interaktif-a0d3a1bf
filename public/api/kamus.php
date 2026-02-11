<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        $bahasa_id = $_GET['bahasa_id'] ?? null;
        if ($bahasa_id) {
            $stmt = $pdo->prepare("SELECT k.*, b.nama_bahasa FROM kamus k JOIN bahasa_daerah b ON k.bahasa_id = b.id WHERE k.bahasa_id = ? ORDER BY k.kata_daerah");
            $stmt->execute([$bahasa_id]);
        } else {
            $stmt = $pdo->query("SELECT k.*, b.nama_bahasa FROM kamus k JOIN bahasa_daerah b ON k.bahasa_id = b.id ORDER BY k.kata_daerah");
        }
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'search':
        $q = $_GET['q'] ?? '';
        $bahasa_id = $_GET['bahasa_id'] ?? null;
        if ($bahasa_id) {
            $stmt = $pdo->prepare("SELECT k.*, b.nama_bahasa FROM kamus k JOIN bahasa_daerah b ON k.bahasa_id = b.id WHERE k.bahasa_id = ? AND (k.kata_daerah LIKE ? OR k.kata_indonesia LIKE ?) ORDER BY k.kata_daerah LIMIT 50");
            $stmt->execute([$bahasa_id, "%$q%", "%$q%"]);
        } else {
            $stmt = $pdo->prepare("SELECT k.*, b.nama_bahasa FROM kamus k JOIN bahasa_daerah b ON k.bahasa_id = b.id WHERE k.kata_daerah LIKE ? OR k.kata_indonesia LIKE ? ORDER BY k.kata_daerah LIMIT 50");
            $stmt->execute(["%$q%", "%$q%"]);
        }
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['bahasa_id'], $data['kata_daerah'], $data['kata_indonesia'], $data['contoh_kalimat'] ?? null, $data['kategori'] ?? 'Umum']);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE kamus SET bahasa_id=?, kata_daerah=?, kata_indonesia=?, contoh_kalimat=?, kategori=? WHERE id=?");
        $stmt->execute([$data['bahasa_id'], $data['kata_daerah'], $data['kata_indonesia'], $data['contoh_kalimat'] ?? null, $data['kategori'] ?? 'Umum', $data['id']]);
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM kamus WHERE id = ?");
            $stmt->execute([$id]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Action tidak valid']);
}
?>
