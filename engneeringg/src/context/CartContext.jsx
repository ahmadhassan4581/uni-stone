import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductsContext'

const CartContext = createContext(null)

function toMap(list) {
  const map = new Map()
  for (const p of list) map.set(p.id, p)
  return map
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const productMap = useMemo(() => toMap(products), [products])

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
    setItems((prev) => prev.filter((i) => productMap.has(i.productId)))
  }, [products, productMap])

  const addItem = (productId, qty = 1) => {
    const q = Math.max(1, Number(qty) || 1)
    setItems((prev) => {
      const next = [...prev]
      const idx = next.findIndex((i) => i.productId === productId)
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty: next[idx].qty + q }
        return next
      }
      return [...next, { productId, qty: q }]
    })
  }

  const setQty = (productId, qty) => {
    const q = Math.max(1, Number(qty) || 1)
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty: q } : i)))
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const clear = () => setItems([])

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
    }),
    [items, detailedItems, totalCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
