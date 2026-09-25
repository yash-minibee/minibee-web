<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt_helper.php';
header('Content-Type: application/json');

// JWT Auth Guard for modifying operations
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $authHeader = '';
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }
    
    $token = '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    $claims = $token ? verify_jwt($token) : false;
    $role = $claims ? ($claims['role'] ?? '') : '';
    if (!$claims || $role !== 'system_admin') {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized access. System administrator privileges required.']);
        exit();
    }
}

$action = $_GET['action'] ?? 'list';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// ─── LIST ───────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
    $rows = $db->query("SELECT * FROM pricing_addons ORDER BY sort_order ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $rows]);
    exit();
}

// ─── CREATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $stmt = $db->prepare("
        INSERT INTO pricing_addons (icon_key, name, description, price_usd, price_inr, period, sort_order)
        VALUES (:icon_key, :name, :description, :price_usd, :price_inr, :period, :sort_order)
    ");
    $stmt->execute([
        ':icon_key'    => $input['icon_key']    ?? '',
        ':name'        => $input['name']        ?? '',
        ':description' => $input['description'] ?? '',
        ':price_usd'   => isset($input['price_usd']) && $input['price_usd'] !== '' ? (float)$input['price_usd'] : null,
        ':price_inr'   => isset($input['price_inr']) && $input['price_inr'] !== '' ? (float)$input['price_inr'] : null,
        ':period'      => $input['period']      ?? '',
        ':sort_order'  => $input['sort_order']  ?? 0,
    ]);
    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    exit();
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $stmt = $db->prepare("
        UPDATE pricing_addons SET
            icon_key=:icon_key, name=:name, description=:description,
            price_usd=:price_usd, price_inr=:price_inr, period=:period, sort_order=:sort_order
        WHERE id=:id
    ");
    $stmt->execute([
        ':id'          => $input['id'],
        ':icon_key'    => $input['icon_key']    ?? '',
        ':name'        => $input['name']        ?? '',
        ':description' => $input['description'] ?? '',
        ':price_usd'   => isset($input['price_usd']) && $input['price_usd'] !== '' ? (float)$input['price_usd'] : null,
        ':price_inr'   => isset($input['price_inr']) && $input['price_inr'] !== '' ? (float)$input['price_inr'] : null,
        ':period'      => $input['period']      ?? '',
        ':sort_order'  => $input['sort_order']  ?? 0,
    ]);
    echo json_encode(['success' => true]);
    exit();
}

// ─── DELETE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $stmt = $db->prepare("DELETE FROM pricing_addons WHERE id=:id");
    $stmt->execute([':id' => $input['id']]);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request']);
