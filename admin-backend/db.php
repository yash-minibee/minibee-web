<?php
// ─── CORS Headers (only when running via web server, not CLI) ─────────────────
if (PHP_SAPI !== 'cli') {
    $allowed_origins = [
        'https://minibee.tech',
        'https://www.minibee.tech',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    } else {
        header("Access-Control-Allow-Origin: https://minibee.tech");
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}


// ─── SQLite Connection ──────────────────────────────────────────────────────────
$db_path = __DIR__ . '/minibee_admin.db';
$db = new PDO('sqlite:' . $db_path);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ─── Schema Init (runs only if tables don't exist) ────────────────────────────
$db->exec("
  CREATE TABLE IF NOT EXISTS pricing_plans (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    tagline     TEXT,
    monthly_usd REAL,
    yearly_usd  REAL,
    monthly_inr REAL,
    yearly_inr  REAL,
    popular     INTEGER DEFAULT 0,
    cta         TEXT DEFAULT 'Get Started',
    href        TEXT DEFAULT '/contact',
    features    TEXT DEFAULT '[]',
    not_included TEXT DEFAULT '[]',
    sort_order  INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feature_comparison (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    feature    TEXT NOT NULL,
    starter    TEXT,
    growth     TEXT,
    premium    TEXT,
    enterprise TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS portfolio_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    category   TEXT NOT NULL,
    url        TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pricing_addons (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    icon_key    TEXT,
    name        TEXT NOT NULL,
    description TEXT,
    price_usd   REAL,
    price_inr   REAL,
    period      TEXT,
    sort_order  INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS whatsapp_clients (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    logo_url    TEXT,
    sort_order  INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT UNIQUE NOT NULL,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS portfolio_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    icon_key   TEXT DEFAULT 'Globe',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    title          TEXT NOT NULL,
    slug           TEXT UNIQUE NOT NULL,
    excerpt        TEXT,
    content        TEXT,
    author         TEXT DEFAULT 'Admin',
    featured_image TEXT,
    tags           TEXT DEFAULT '',
    status         TEXT DEFAULT 'published',
    views          INTEGER DEFAULT 0,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
  );
");

// Seed default settings if empty
$db->exec("INSERT OR IGNORE INTO settings (key, value) VALUES ('whatsapp_clients_speed', '120')");

// Migration: Add tags column to blog_posts if not exists
try {
    $db->query("SELECT tags FROM blog_posts LIMIT 1");
} catch (PDOException $e) {
    $db->exec("ALTER TABLE blog_posts ADD COLUMN tags TEXT DEFAULT ''");
}

// Migration: Add status column to blog_posts if not exists
try {
    $db->query("SELECT status FROM blog_posts LIMIT 1");
} catch (PDOException $e) {
    $db->exec("ALTER TABLE blog_posts ADD COLUMN status TEXT DEFAULT 'published'");
}

// Migration: Add views column to blog_posts if not exists
try {
    $db->query("SELECT views FROM blog_posts LIMIT 1");
} catch (PDOException $e) {
    $db->exec("ALTER TABLE blog_posts ADD COLUMN views INTEGER DEFAULT 0");
}

// Migration: Add icon_key column to portfolio_categories if not exists
try {
    $db->query("SELECT icon_key FROM portfolio_categories LIMIT 1");
} catch (PDOException $e) {
    $db->exec("ALTER TABLE portfolio_categories ADD COLUMN icon_key TEXT DEFAULT 'Globe'");
    // Set seed defaults for existing table rows
    $db->exec("UPDATE portfolio_categories SET icon_key = 'Globe' WHERE name = 'Corporate Website'");
    $db->exec("UPDATE portfolio_categories SET icon_key = 'ShoppingBag' WHERE name = 'E-Commerce Store'");
    $db->exec("UPDATE portfolio_categories SET icon_key = 'Code2' WHERE name = 'Web Application'");
    $db->exec("UPDATE portfolio_categories SET icon_key = 'Palette' WHERE name = 'UI/UX Design'");
}

// Seed default categories if empty
$db->exec("
  INSERT OR IGNORE INTO portfolio_categories (name, sort_order, icon_key) VALUES ('Corporate Website', 1, 'Globe');
  INSERT OR IGNORE INTO portfolio_categories (name, sort_order, icon_key) VALUES ('E-Commerce Store', 2, 'ShoppingBag');
  INSERT OR IGNORE INTO portfolio_categories (name, sort_order, icon_key) VALUES ('Web Application', 3, 'Code2');
  INSERT OR IGNORE INTO portfolio_categories (name, sort_order, icon_key) VALUES ('UI/UX Design', 4, 'Palette');
");


