import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductsContext'

const CartContext = createContext(null)

function toMap(list) {
  const map = new Map()
  for (const p of list) map.set(p.id, p)
  return map
}

function getProductStockLimit(product) {
  const MAX_PER_ITEM = 20
  const s = product?.stock
  const stock = Number(s)
  if (Number.isFinite(stock) && stock >= 0) return Math.min(MAX_PER_ITEM, stock)
  return MAX_PER_ITEM
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const productMap = useMemo(() => toMap(products), [products])

  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)

  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('aurum_cart_v1')
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('aurum_cart_v1', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!products.length) return
    setItems((prev) =>
      prev
        .filter((i) => productMap.has(i.productId))
        .map((i) => {
          const product = productMap.get(i.productId)
          const limit = getProductStockLimit(product)
          if (limit <= 0) return null
          return { ...i, qty: Math.min(Math.max(1, Number(i.qty) || 1), limit) }
        })
        .filter(Boolean),
    )
  }, [products, productMap])

  const addItem = (productId, qty = 1) => {
    const q = Math.max(1, Number(qty) || 1)
    setItems((prev) => {
      const product = productMap.get(productId)
      const limit = getProductStockLimit(product)
      if (limit <= 0) return prev

      const next = [...prev]
      const idx = next.findIndex((i) => i.productId === productId)
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + q, limit) }
        return next
      }
      return [...next, { productId, qty: Math.min(q, limit) }]
    })
  }

  const setQty = (productId, qty) => {
    const product = productMap.get(productId)
    const limit = getProductStockLimit(product)
    if (limit <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    const q = Math.min(Math.max(1, Number(qty) || 1), limit)
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty: q } : i)))
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const clear = () => setItems([])

  const openMiniCart = () => setIsMiniCartOpen(true)
  const closeMiniCart = () => setIsMiniCartOpen(false)

  const detailedItems = useMemo(() => {
    return items
      .map((i) => {
        const product = productMap.get(i.productId)
        if (!product) return null
        return {
          ...i,
          product,
          lineTotal: product.price * i.qty,
        }
      })
      .filter(Boolean)
  }, [items, productMap])

  const totalCount = useMemo(() => detailedItems.reduce((sum, i) => sum + i.qty, 0), [detailedItems])
  const subtotal = useMemo(() => detailedItems.reduce((sum, i) => sum + i.lineTotal, 0), [detailedItems])

  const value = useMemo(
    () => ({
      items,
      detailedItems,
      totalCount,
      subtotal,
      addItem,
      setQty,
      removeItem,
      clear,
      isMiniCartOpen,
      openMiniCart,
      closeMiniCart,
    }),
    [items, detailedItems, totalCount, subtotal, isMiniCartOpen],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
