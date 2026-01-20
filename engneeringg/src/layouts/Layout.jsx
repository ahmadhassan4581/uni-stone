import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import MiniCartModal from '../components/MiniCartModal'
import ScrollToTop from '../components/ScrollToTop'

export default function Layout() {
  return (
    <div className="min-h-dvh bg-white text-obsidian">
      <ScrollToTop />
      <Header />
      <MiniCartModal />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
