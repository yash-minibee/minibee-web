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
    $rows = $db->query("SELECT * FROM pricing_plans ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$r) {
        $r['features']     = json_decode($r['features'],     true) ?? [];
        $r['not_included'] = json_decode($r['not_included'], true) ?? [];
        $r['popular']      = (bool)$r['popular'];
    }
    echo json_encode(['success' => true, 'data' => $rows]);
    exit();
}

// ─── CREATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $stmt = $db->prepare("
        INSERT INTO pricing_plans
            (name, tagline, monthly_usd, yearly_usd, monthly_inr, yearly_inr, popular, cta, href, features, not_included)
        VALUES
            (:name, :tagline, :monthly_usd, :yearly_usd, :monthly_inr, :yearly_inr, :popular, :cta, :href, :features, :not_included)
    ");
    $stmt->execute([
        ':name'        => $input['name']        ?? '',
        ':tagline'     => $input['tagline']     ?? '',
        ':monthly_usd' => $input['monthly_usd'] ?? null,
        ':yearly_usd'  => $input['yearly_usd']  ?? null,
        ':monthly_inr' => $input['monthly_inr'] ?? null,
        ':yearly_inr'  => $input['yearly_inr']  ?? null,
        ':popular'     => isset($input['popular']) && $input['popular'] ? 1 : 0,
        ':cta'         => $input['cta']         ?? 'Get Started',
        ':href'        => $input['href']        ?? '/contact',
        ':features'    => json_encode($input['features']     ?? []),
        ':not_included'=> json_encode($input['not_included'] ?? []),
    ]);
    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    exit();
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $stmt = $db->prepare("
        UPDATE pricing_plans SET
            name=:name, tagline=:tagline, monthly_usd=:monthly_usd, yearly_usd=:yearly_usd,
            monthly_inr=:monthly_inr, yearly_inr=:yearly_inr, popular=:popular,
            cta=:cta, href=:href, features=:features, not_included=:not_included
        WHERE id=:id
    ");
    $stmt->execute([
        ':id'          => $input['id'],
        ':name'        => $input['name']        ?? '',
        ':tagline'     => $input['tagline']     ?? '',
        ':monthly_usd' => $input['monthly_usd'] ?? null,
        ':yearly_usd'  => $input['yearly_usd']  ?? null,
        ':monthly_inr' => $input['monthly_inr'] ?? null,
        ':yearly_inr'  => $input['yearly_inr']  ?? null,
        ':popular'     => isset($input['popular']) && $input['popular'] ? 1 : 0,
        ':cta'         => $input['cta']         ?? 'Get Started',
        ':href'        => $input['href']        ?? '/contact',
        ':features'    => json_encode($input['features']     ?? []),
        ':not_included'=> json_encode($input['not_included'] ?? []),
    ]);
    echo json_encode(['success' => true]);
    exit();
}

// ─── DELETE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $stmt = $db->prepare("DELETE FROM pricing_plans WHERE id=:id");
    $stmt->execute([':id' => $input['id']]);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request']);
