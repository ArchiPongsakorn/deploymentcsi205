'use client'
 
import { createContext, useContext } from "react"
import type { Product } from "@/data/products"
 
export type CartContextType = {
  products: Product[]                 // สินค้าทั้งหมด (ตัวเลขใน Products (123))
  cart: Product[]                     // สินค้าในตะกร้า (ตัวเลขบน badge ของ Carts)
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
}
 
export const CartContext = createContext<CartContextType | null>(null)
 
// เรียกใช้ใน page ต่าง ๆ: const { products, cart, addToCart } = useCart()
export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used inside <CartContext.Provider> (ใน layout.tsx)")
  }
  return ctx
}