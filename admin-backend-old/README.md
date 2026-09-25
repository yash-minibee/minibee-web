# Minibee Admin Panel — Setup & Usage

## 🚀 Start the Backend

Open a new terminal and run:

```bash
php -S localhost:8080 -t admin-backend
```

> The SQLite database (`minibee_admin.db`) is created automatically on first request.

## 🔐 Admin Login

Visit: **http://localhost:3000/admin**

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `minibee2025` |

## 📁 File Structure

```
admin-backend/
├── db.php                  ← SQLite connection + auto schema init
├── api/
│   ├── auth.php            ← POST login
│   ├── pricing.php         ← Pricing plans CRUD
│   ├── comparison.php      ← Comparison rows CRUD
│   └── portfolio.php       ← Portfolio items CRUD
└── minibee_admin.db        ← Created automatically
```

## 🔗 API Endpoints (called directly by filename)

### Pricing
- `GET  /api/pricing.php?action=list`
- `POST /api/pricing.php?action=create`
- `POST /api/pricing.php?action=update`
- `POST /api/pricing.php?action=delete`

### Comparison
- `GET  /api/comparison.php?action=list`
- `POST /api/comparison.php?action=create/update/delete`

### Portfolio
- `GET  /api/portfolio.php?action=list`
- `POST /api/portfolio.php?action=create/update/delete`

## ✅ How Data Merges

| Page | Behavior |
|------|----------|
| `/pricing` | Static plans (Starter/Growth/Premium/Enterprise) shown first, DB plans appended after |
| `/pricing` comparison table | Static 12 rows first, DB rows appended after |
| `/portfolio` | Static 10 projects first, DB projects appended after |

> Static data in `src/data/pricing.js` and `Portfolio.jsx` is **never modified**.
