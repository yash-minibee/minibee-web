import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import Features from '../pages/Features'
import UseCases from '../pages/UseCases'
import Pricing from '../pages/Pricing'
import Portfolio from '../pages/Portfolio'
import Blog from '../pages/Blog'
import Contact from '../pages/Contact'
import BlogPostDetail from '../pages/BlogPostDetail'

// Admin
import AdminLogin from '../pages/admin/AdminLogin'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminPricing from '../pages/admin/AdminPricing'
import AdminComparison from '../pages/admin/AdminComparison'
import AdminPortfolio from '../pages/admin/AdminPortfolio'
import AdminAddons from '../pages/admin/AdminAddons'
import AdminWhatsAppClients from '../pages/admin/AdminWhatsAppClients'

// Blog Admin
import BlogAdminLogin from '../pages/admin/BlogAdminLogin'
import BlogAdminLayout from '../pages/admin/BlogAdminLayout'
import BlogAdminDashboard from '../pages/admin/BlogAdminDashboard'
import BlogAdminForm from '../pages/admin/BlogAdminForm'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="use-cases" element={<UseCases />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPostDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin panel — outside main Layout (no Navbar/Footer) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/pricing" replace />} />
        <Route path="pricing"          element={<AdminPricing />} />
        <Route path="comparison"       element={<AdminComparison />} />
        <Route path="portfolio"        element={<AdminPortfolio />} />
        <Route path="addons"           element={<AdminAddons />} />
        <Route path="whatsapp-clients" element={<AdminWhatsAppClients />} />
      </Route>

      {/* Blog Admin panel */}
      <Route path="/blog/admin/login" element={<BlogAdminLogin />} />
      <Route path="/blog/admin" element={<BlogAdminLayout />}>
        <Route index element={<BlogAdminDashboard />} />
        <Route path="add" element={<BlogAdminForm />} />
        <Route path="edit/:id" element={<BlogAdminForm />} />
      </Route>
    </Routes>
  )
}
