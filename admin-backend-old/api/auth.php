<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt_helper.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true) ?? [];

define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'minibee2025');

define('BLOG_USER', 'blogadmin');
define('BLOG_PASS', 'minibeeblog2025');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if ($username === ADMIN_USER && $password === ADMIN_PASS) {
        $payload = [
            'sub'  => ADMIN_USER,
            'role' => 'system_admin',
            'iat'  => time(),
            'exp'  => time() + (24 * 60 * 60) // 1 day validity
        ];
        $token = generate_jwt($payload);
        echo json_encode(['success' => true, 'token' => $token]);
    } else if ($username === BLOG_USER && $password === BLOG_PASS) {
        $payload = [
            'sub'  => BLOG_USER,
            'role' => 'blog_admin',
            'iat'  => time(),
            'exp'  => time() + (24 * 60 * 60) // 1 day validity
        ];
        $token = generate_jwt($payload);
        echo json_encode(['success' => true, 'token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
