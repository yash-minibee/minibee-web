// Central API config — calls individual PHP files directly
export const API_BASE = 'http://localhost:8080/api'

export const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  const serverBase = API_BASE.replace(/\/api$/, '')
  const cleanPath = path.startsWith('/') ? path : '/' + path
  return `${serverBase}${cleanPath}`
}

export const getRoleFromToken = (token) => {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.role
  } catch {
    return null
  }
}

// Helper to attach JWT Bearer token to requests
const getHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('minibee_admin_token')
  return {
    ...extraHeaders,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export const api = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return res.json()
  },

  // ─── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    list: () => fetch(`${API_BASE}/pricing.php?action=list`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/pricing.php?action=create`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    update: (data) => fetch(`${API_BASE}/pricing.php?action=update`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/pricing.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },

  // ─── Comparison ───────────────────────────────────────────────────────────
  comparison: {
    list: () => fetch(`${API_BASE}/comparison.php?action=list`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/comparison.php?action=create`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    update: (data) => fetch(`${API_BASE}/comparison.php?action=update`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/comparison.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },

  // ─── Portfolio ────────────────────────────────────────────────────────────
  portfolio: {
    list: () => fetch(`${API_BASE}/portfolio.php?action=list`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/portfolio.php?action=create`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    update: (data) => fetch(`${API_BASE}/portfolio.php?action=update`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/portfolio.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },

  // ─── Addons ───────────────────────────────────────────────────────────────
  addons: {
    list: () => fetch(`${API_BASE}/addons.php?action=list`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/addons.php?action=create`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    update: (data) => fetch(`${API_BASE}/addons.php?action=update`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/addons.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },

  // ─── WhatsApp Clients ──────────────────────────────────────────────────────
  whatsappClients: {
    list: () => fetch(`${API_BASE}/whatsapp_clients.php?action=list`).then(r => r.json()),
    create: (data) => {
      const isForm = data instanceof FormData
      return fetch(`${API_BASE}/whatsapp_clients.php?action=create`, {
        method: 'POST',
        headers: getHeaders(isForm ? {} : { 'Content-Type': 'application/json' }),
        body: isForm ? data : JSON.stringify(data),
      }).then(r => r.json())
    },
    update: (data) => {
      const isForm = data instanceof FormData
      return fetch(`${API_BASE}/whatsapp_clients.php?action=update`, {
        method: 'POST',
        headers: getHeaders(isForm ? {} : { 'Content-Type': 'application/json' }),
        body: isForm ? data : JSON.stringify(data),
      }).then(r => r.json())
    },
    delete: (id) => fetch(`${API_BASE}/whatsapp_clients.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },

  // ─── Settings ──────────────────────────────────────────────────────────────
  settings: {
    get: (key) => fetch(`${API_BASE}/settings.php?action=get&key=${key}`).then(r => r.json()),
    set: (key, value) => fetch(`${API_BASE}/settings.php?action=set`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ key, value }),
    }).then(r => r.json()),
  },

  // ─── Portfolio Categories ──────────────────────────────────────────────────
  portfolioCategories: {
    list: () => fetch(`${API_BASE}/portfolio_categories.php?action=list`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/portfolio_categories.php?action=create`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    update: (data) => fetch(`${API_BASE}/portfolio_categories.php?action=update`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/portfolio_categories.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },

  // ─── Blog Posts ────────────────────────────────────────────────────────────
  blog: {
    list: () => fetch(`${API_BASE}/blog.php?action=list`, { headers: getHeaders() }).then(r => r.json()),
    get: (id = '', slug = '') => {
      const cleanId = (id === null || id === undefined) ? '' : id
      const cleanSlug = (slug === null || slug === undefined) ? '' : slug
      return fetch(`${API_BASE}/blog.php?action=get&id=${cleanId}&slug=${cleanSlug}`, {
        headers: getHeaders()
      }).then(r => r.json())
    },
    create: (data) => {
      const isForm = data instanceof FormData
      return fetch(`${API_BASE}/blog.php?action=create`, {
        method: 'POST',
        headers: getHeaders(isForm ? {} : { 'Content-Type': 'application/json' }),
        body: isForm ? data : JSON.stringify(data),
      }).then(r => r.json())
    },
    update: (data) => {
      const isForm = data instanceof FormData
      return fetch(`${API_BASE}/blog.php?action=update`, {
        method: 'POST',
        headers: getHeaders(isForm ? {} : { 'Content-Type': 'application/json' }),
        body: isForm ? data : JSON.stringify(data),
      }).then(r => r.json())
    },
    delete: (id) => fetch(`${API_BASE}/blog.php?action=delete`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
    toggleStatus: (id) => fetch(`${API_BASE}/blog.php?action=toggle_status`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),
  },
}
