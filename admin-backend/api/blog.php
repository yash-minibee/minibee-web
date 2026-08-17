<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt_helper.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// ─── LIST ───────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
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
    
    $isAdmin = $token ? (verify_jwt($token) !== false) : false;
    
    if ($isAdmin) {
        $rows = $db->query("SELECT id, title, slug, excerpt, content, author, featured_image, tags, status, views, created_at, updated_at FROM blog_posts ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $rows = $db->query("SELECT id, title, slug, excerpt, content, author, featured_image, tags, status, views, created_at, updated_at FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    }
    echo json_encode(['success' => true, 'data' => $rows]);
    exit();
}

// ─── GET SINGLE POST ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get') {
    $id = $_GET['id'] ?? '';
    $slug = $_GET['slug'] ?? '';
    
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
    
    $isAdmin = $token ? (verify_jwt($token) !== false) : false;
    
    if (!empty($id) && $id !== 'null' && $id !== 'undefined') {
        if ($isAdmin) {
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE id = :id");
            $stmt->execute([':id' => $id]);
        } else {
            $db->prepare("UPDATE blog_posts SET views = COALESCE(views, 0) + 1 WHERE id = :id AND status = 'published'")->execute([':id' => $id]);
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE id = :id AND status = 'published'");
            $stmt->execute([':id' => $id]);
        }
    } else if (!empty($slug)) {
        if ($isAdmin) {
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE slug = :slug");
            $stmt->execute([':slug' => $slug]);
        } else {
            $db->prepare("UPDATE blog_posts SET views = COALESCE(views, 0) + 1 WHERE slug = :slug AND status = 'published'")->execute([':slug' => $slug]);
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE slug = :slug AND status = 'published'");
            $stmt->execute([':slug' => $slug]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID or Slug is required']);
        exit();
    }
    
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode(['success' => true, 'data' => $row]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Blog post not found']);
    }
    exit();
}

// Helper to handle cover image upload
function handle_cover_upload() {
    if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/../uploads/blog-covers/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_ext = pathinfo($_FILES['featured_image']['name'], PATHINFO_EXTENSION);
        $filename = time() . '_' . uniqid() . '.' . $file_ext;
        $target_file = $upload_dir . $filename;
        
        if (move_uploaded_file($_FILES['featured_image']['tmp_name'], $target_file)) {
            return 'uploads/blog-covers/' . $filename;
        }
    }
    return null;
}

// ─── INCREMENT VIEWS (public, no auth required) ────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'increment_views') {
    $id = $input['id'] ?? $_POST['id'] ?? 0;
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID is required']);
        exit();
    }
    
    $stmt = $db->prepare("UPDATE blog_posts SET views = COALESCE(views, 0) + 1 WHERE id = :id AND status = 'published'");
    $stmt->execute([':id' => $id]);
    
    // Return the updated view count
    $viewStmt = $db->prepare("SELECT views FROM blog_posts WHERE id = :id");
    $viewStmt->execute([':id' => $id]);
    $row = $viewStmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'views' => $row ? (int)$row['views'] : 0]);
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
    if (!$claims || ($role !== 'blog_admin' && $role !== 'system_admin')) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized access. Only blog and system administrators are allowed.']);
        exit();
    }
}

// ─── CREATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $title = $_POST['title'] ?? $input['title'] ?? '';
    $slug = $_POST['slug'] ?? $input['slug'] ?? '';
    $excerpt = $_POST['excerpt'] ?? $input['excerpt'] ?? '';
    $content = $_POST['content'] ?? $input['content'] ?? '';
    $author = $_POST['author'] ?? $input['author'] ?? 'Admin';
    $featured_image = $_POST['featured_image'] ?? $input['featured_image'] ?? '';
    $tags = $_POST['tags'] ?? $input['tags'] ?? '';
    $status = $_POST['status'] ?? $input['status'] ?? 'published';
    
    // Check uploaded file
    $uploaded_img = handle_cover_upload();
    if ($uploaded_img !== null) {
        $featured_image = $uploaded_img;
    }
    
    if (empty($title) || empty($slug)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Title and Slug are required']);
        exit();
    }
    
    try {
        $stmt = $db->prepare("
            INSERT INTO blog_posts 
                (title, slug, excerpt, content, author, featured_image, tags, status, created_at, updated_at)
            VALUES 
                (:title, :slug, :excerpt, :content, :author, :featured_image, :tags, :status, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ");
        $stmt->execute([
            ':title' => $title,
            ':slug' => $slug,
            ':excerpt' => $excerpt,
            ':content' => $content,
            ':author' => $author,
            ':featured_image' => $featured_image,
            ':tags' => $tags,
            ':status' => $status
        ]);
        echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Slug already exists or query failed']);
    }
    exit();
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $id = $_POST['id'] ?? $input['id'] ?? 0;
    $title = $_POST['title'] ?? $input['title'] ?? '';
    $slug = $_POST['slug'] ?? $input['slug'] ?? '';
    $excerpt = $_POST['excerpt'] ?? $input['excerpt'] ?? '';
    $content = $_POST['content'] ?? $input['content'] ?? '';
    $author = $_POST['author'] ?? $input['author'] ?? 'Admin';
    $featured_image = $_POST['featured_image'] ?? $input['featured_image'] ?? '';
    $tags = $_POST['tags'] ?? $input['tags'] ?? '';
    $status = $_POST['status'] ?? $input['status'] ?? 'published';
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Post ID is required']);
        exit();
    }
    
    // Check uploaded file
    $uploaded_img = handle_cover_upload();
    if ($uploaded_img !== null) {
        $featured_image = $uploaded_img;
    }
    
    try {
        $stmt = $db->prepare("
            UPDATE blog_posts 
            SET title = :title, slug = :slug, excerpt = :excerpt, content = :content, 
                author = :author, featured_image = :featured_image, tags = :tags, status = :status, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ");
        $stmt->execute([
            ':title' => $title,
            ':slug' => $slug,
            ':excerpt' => $excerpt,
            ':content' => $content,
            ':author' => $author,
            ':featured_image' => $featured_image,
            ':tags' => $tags,
            ':status' => $status,
            ':id' => $id
        ]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Slug already exists or query failed']);
    }
    exit();
}

// ─── TOGGLE STATUS ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'toggle_status') {
    $id = $input['id'] ?? $_POST['id'] ?? 0;
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID is required']);
        exit();
    }
    
    // Fetch current status
    $stmt = $db->prepare("SELECT status FROM blog_posts WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Post not found']);
        exit();
    }
    
    $currentStatus = $row['status'] ?? 'published';
    $newStatus = ($currentStatus === 'draft') ? 'published' : 'draft';
    
    $updateStmt = $db->prepare("UPDATE blog_posts SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
    $updateStmt->execute([':status' => $newStatus, ':id' => $id]);
    
    echo json_encode(['success' => true, 'new_status' => $newStatus]);
    exit();
}

// ─── DELETE ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
    $id = $input['id'] ?? 0;
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID is required']);
        exit();
    }
    
    $stmt = $db->prepare("DELETE FROM blog_posts WHERE id = :id");
    $stmt->execute([':id' => $id]);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid action']);
