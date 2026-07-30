import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/index.jsx'
import { useEffect } from 'react'
import Lenis from 'lenis'
import FloatingIconsBg from './components/home/FloatingIconsBg'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <BrowserRouter>
      {/* Global Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <FloatingIconsBg />
      </div>
      <div className="relative z-0">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
