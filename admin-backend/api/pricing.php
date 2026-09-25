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
        $r['features']      = json_decode($r['features'],     true) ?? [];
        $r['not_included']  = json_decode($r['not_included'], true) ?? [];
        $r['popular']       = (bool)$r['popular'];
        // Ensure both quarterly and monthly aliases are available
        $r['quarterly_usd'] = $r['quarterly_usd'] ?? $r['monthly_usd'] ?? null;
        $r['quarterly_inr'] = $r['quarterly_inr'] ?? $r['monthly_inr'] ?? null;
        $r['monthly_usd']   = $r['monthly_usd']   ?? $r['quarterly_usd'] ?? null;
        $r['monthly_inr']   = $r['monthly_inr']   ?? $r['quarterly_inr'] ?? null;

        foreach (['quarterly_usd', 'yearly_usd', 'quarterly_inr', 'yearly_inr', 'monthly_usd', 'monthly_inr'] as $k) {
            if ($r[$k] !== null && is_numeric($r[$k])) {
                $r[$k] = ((float)$r[$k] == (int)$r[$k]) ? (int)$r[$k] : (float)$r[$k];
            }
        }
    }
    echo json_encode(['success' => true, 'data' => $rows]);
    exit();
}

// ─── CREATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $q_usd = $input['quarterly_usd'] ?? $input['monthly_usd'] ?? null;
    $q_inr = $input['quarterly_inr'] ?? $input['monthly_inr'] ?? null;

    $stmt = $db->prepare("
        INSERT INTO pricing_plans
            (name, tagline, quarterly_usd, yearly_usd, quarterly_inr, yearly_inr, monthly_usd, monthly_inr, popular, cta, href, features, not_included)
        VALUES
            (:name, :tagline, :quarterly_usd, :yearly_usd, :quarterly_inr, :yearly_inr, :monthly_usd, :monthly_inr, :popular, :cta, :href, :features, :not_included)
    ");
    $stmt->execute([
        ':name'          => $input['name']          ?? '',
        ':tagline'       => $input['tagline']       ?? '',
        ':quarterly_usd' => $q_usd,
        ':yearly_usd'    => $input['yearly_usd']    ?? null,
        ':quarterly_inr' => $q_inr,
        ':yearly_inr'    => $input['yearly_inr']    ?? null,
        ':monthly_usd'   => $q_usd,
        ':monthly_inr'   => $q_inr,
        ':popular'       => isset($input['popular']) && $input['popular'] ? 1 : 0,
        ':cta'           => $input['cta']           ?? 'Get Started',
        ':href'          => $input['href']          ?? '/contact',
        ':features'      => json_encode($input['features']     ?? []),
        ':not_included'  => json_encode($input['not_included'] ?? []),
    ]);
    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    exit();
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $q_usd = $input['quarterly_usd'] ?? $input['monthly_usd'] ?? null;
    $q_inr = $input['quarterly_inr'] ?? $input['monthly_inr'] ?? null;

    $stmt = $db->prepare("
        UPDATE pricing_plans SET
            name=:name, tagline=:tagline,
            quarterly_usd=:quarterly_usd, yearly_usd=:yearly_usd,
            quarterly_inr=:quarterly_inr, yearly_inr=:yearly_inr,
            monthly_usd=:monthly_usd, monthly_inr=:monthly_inr,
            popular=:popular, cta=:cta, href=:href,
            features=:features, not_included=:not_included
        WHERE id=:id
    ");
    $stmt->execute([
        ':id'            => $input['id'],
        ':name'          => $input['name']          ?? '',
        ':tagline'       => $input['tagline']       ?? '',
        ':quarterly_usd' => $q_usd,
        ':yearly_usd'    => $input['yearly_usd']    ?? null,
        ':quarterly_inr' => $q_inr,
        ':yearly_inr'    => $input['yearly_inr']    ?? null,
        ':monthly_usd'   => $q_usd,
        ':monthly_inr'   => $q_inr,
        ':popular'       => isset($input['popular']) && $input['popular'] ? 1 : 0,
        ':cta'           => $input['cta']           ?? 'Get Started',
        ':href'          => $input['href']          ?? '/contact',
        ':features'      => json_encode($input['features']     ?? []),
        ':not_included'  => json_encode($input['not_included'] ?? []),
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
