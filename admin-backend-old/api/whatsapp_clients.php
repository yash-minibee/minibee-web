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
    $rows = $db->query("SELECT * FROM whatsapp_clients ORDER BY sort_order ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $rows]);
    exit();
}

// Helper to handle file uploads
function handle_logo_upload() {
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/../uploads/wp-clients/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $filename = time() . '_' . uniqid() . '.' . $file_ext;
        $target_file = $upload_dir . $filename;
        
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $target_file)) {
            return '/uploads/wp-clients/' . $filename;
        }
    }
    return null;
}

// ─── CREATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    // If multipart/form-data, PHP populates $_POST and $_FILES
    $name = $_POST['name'] ?? $input['name'] ?? '';
    $sort_order = (int)($_POST['sort_order'] ?? $input['sort_order'] ?? 0);
    $logo_url = $_POST['logo_url'] ?? $input['logo_url'] ?? '';
    
    // Check if new file uploaded
    $uploaded_logo = handle_logo_upload();
    if ($uploaded_logo !== null) {
        $logo_url = $uploaded_logo;
    }

    $stmt = $db->prepare("
        INSERT INTO whatsapp_clients (name, logo_url, sort_order)
        VALUES (:name, :logo_url, :sort_order)
    ");
    $stmt->execute([
        ':name'       => $name,
        ':logo_url'   => $logo_url,
        ':sort_order' => $sort_order,
    ]);
    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    exit();
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $id = (int)($_POST['id'] ?? $input['id'] ?? 0);
    $name = $_POST['name'] ?? $input['name'] ?? '';
    $sort_order = (int)($_POST['sort_order'] ?? $input['sort_order'] ?? 0);
    $logo_url = $_POST['logo_url'] ?? $input['logo_url'] ?? '';

    // Check if new file uploaded
    $uploaded_logo = handle_logo_upload();
    if ($uploaded_logo !== null) {
        $logo_url = $uploaded_logo;
    }

    $stmt = $db->prepare("
        UPDATE whatsapp_clients SET
            name=:name, logo_url=:logo_url, sort_order=:sort_order
        WHERE id=:id
    ");
    $stmt->execute([
        ':id'         => $id,
        ':name'       => $name,
        ':logo_url'   => $logo_url,
        ':sort_order' => $sort_order,
    ]);
    echo json_encode(['success' => true]);
    exit();
}

// ─── DELETE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $stmt = $db->prepare("DELETE FROM whatsapp_clients WHERE id=:id");
    $stmt->execute([':id' => $input['id']]);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request']);
