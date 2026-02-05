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
      <main className="pb-14">
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#ffffff] text-white">
        <div className="w-full  py-2 ">
          <div className="overflow-hidden whitespace-nowrap">
            <div className="marquee-rtl motion-reduce:animate-none">
              <span className="pr-10 text-xs font-semibold tracking-[0.12em] uppercase text-red-500">
                * For quantities exceeding 160 units, please contact us for special pricing and additional discounts. .
              </span>
              <span className="pr-10 text-xs font-semibold tracking-[0.12em] uppercase text-red-500" aria-hidden="true">
                * For quantities exceeding 160 units, please contact us for special pricing and additional discounts. .
              </span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/447564892282"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden="true">
          <path d="M16.003 2.667C8.646 2.667 2.667 8.646 2.667 16.003c0 2.337.612 4.62 1.774 6.639L3 29.333l6.863-1.41a13.29 13.29 0 0 0 6.14 1.504h.002c7.357 0 13.335-5.978 13.335-13.335 0-3.565-1.388-6.916-3.908-9.437-2.52-2.52-5.872-3.988-9.429-3.988zm0 24.426h-.002a11.09 11.09 0 0 1-5.65-1.55l-.405-.24-4.074.838.866-3.969-.264-.41a11.08 11.08 0 0 1-1.705-5.757c0-6.118 4.98-11.098 11.134-11.098 2.97 0 5.765 1.156 7.867 3.258 2.102 2.102 3.258 4.897 3.258 7.867 0 6.118-4.98 11.061-11.025 11.061zm6.316-8.635c-.345-.173-2.043-1.008-2.36-1.122-.318-.115-.55-.173-.78.173-.23.345-.895 1.122-1.096 1.352-.202.23-.403.259-.748.086-.345-.173-1.457-.537-2.775-1.712-1.026-.914-1.718-2.043-1.92-2.388-.201-.345-.021-.532.151-.704.155-.155.345-.403.518-.605.173-.201.23-.345.345-.575.115-.23.058-.432-.029-.605-.087-.173-.78-1.88-1.068-2.575-.28-.673-.563-.582-.78-.593l-.663-.012c-.23 0-.605.086-.92.432-.316.345-1.206 1.18-1.206 2.877 0 1.697 1.235 3.336 1.407 3.566.173.23 2.432 3.716 5.893 5.213.823.355 1.465.567 1.965.726.825.262 1.576.225 2.17.137.662-.099 2.043-.835 2.331-1.64.288-.806.288-1.496.202-1.64-.087-.144-.316-.23-.662-.403z" />
        </svg>
      </a>
      <Footer />
    </div>
  )
}
