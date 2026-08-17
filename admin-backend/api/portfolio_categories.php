<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt_helper.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// ─── LIST ───────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
    $rows = $db->query("SELECT * FROM portfolio_categories ORDER BY sort_order ASC, name ASC")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $rows]);
    exit();
}

// ─── JWT Auth Guard for modifying operations (POST requests) ─────────────────
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

// ─── CREATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $name = trim($input['name'] ?? '');
    $sort_order = (int)($input['sort_order'] ?? 0);
    $icon_key = trim($input['icon_key'] ?? 'Globe');
    
    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category name is required']);
        exit();
    }
    
    try {
        $stmt = $db->prepare("INSERT INTO portfolio_categories (name, sort_order, icon_key) VALUES (:name, :sort_order, :icon_key)");
        $stmt->execute([':name' => $name, ':sort_order' => $sort_order, ':icon_key' => $icon_key]);
        echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category name already exists or query failed']);
    }
    exit();
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $id = (int)($input['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $sort_order = (int)($input['sort_order'] ?? 0);
    $icon_key = trim($input['icon_key'] ?? 'Globe');
    
    if (empty($id) || empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category ID and Name are required']);
        exit();
    }
    
    try {
        $stmt = $db->prepare("UPDATE portfolio_categories SET name = :name, sort_order = :sort_order, icon_key = :icon_key WHERE id = :id");
        $stmt->execute([':name' => $name, ':sort_order' => $sort_order, ':icon_key' => $icon_key, ':id' => $id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category update failed']);
    }
    exit();
}

// ─── DELETE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $id = (int)($input['id'] ?? 0);
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category ID is required']);
        exit();
    }
    
    $stmt = $db->prepare("DELETE FROM portfolio_categories WHERE id = :id");
    $stmt->execute([':id' => $id]);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid action']);
