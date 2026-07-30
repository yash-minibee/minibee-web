import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import Features from '../pages/Features'
import UseCases from '../pages/UseCases'
import Pricing from '../pages/Pricing'
import Portfolio from '../pages/Portfolio'
import Blog from '../pages/Blog'
import Contact from '../pages/Contact'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="use-cases" element={<UseCases />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
