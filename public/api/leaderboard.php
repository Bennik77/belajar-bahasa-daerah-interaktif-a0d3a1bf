<?php
/**
 * API Endpoint untuk Leaderboard / Papan Peringkat
 */

require_once 'config.php';
setCorsHeaders();

try {
    $conn = getConnection();
    
    $stmt = $conn->query("
        SELECT 
            u.id, u.nama,
            COUNT(DISTINCT CASE WHEN pb.status = 'selesai' THEN pb.id END) as completed_materi,
            COUNT(DISTINCT CASE WHEN hu.status = 'lulus' THEN hu.id END) as passed_exams,
            COALESCE(AVG(hu.nilai), 0) as avg_score,
            (COUNT(DISTINCT CASE WHEN pb.status = 'selesai' THEN pb.id END) * 10 
             + COUNT(DISTINCT CASE WHEN hu.status = 'lulus' THEN hu.id END) * 25 
             + COALESCE(AVG(hu.nilai), 0)) as total_score
        FROM users u
        LEFT JOIN progress_belajar pb ON u.id = pb.user_id
        LEFT JOIN hasil_ujian hu ON u.id = hu.user_id
        WHERE u.role = 'pengguna' AND u.status = 'aktif'
        GROUP BY u.id, u.nama
        ORDER BY total_score DESC
        LIMIT 50
    ");
    
    $data = $stmt->fetchAll();
    jsonResponse(['success' => true, 'data' => $data]);
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
