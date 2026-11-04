'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkLogin } from "@/utils/login"
import ProductCard from "@/components/ProductCard"
import { useCart } from "@/utils/cart-context"
 
export default function Page() {
  const router = useRouter()
  useEffect(() => { checkLogin(router, '/carts') }, [router])
  const { cart, removeFromCart } = useCart()
 
  // ราคารวมของสินค้าในตะกร้า
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)
 
  return (
    <div className="mx-auto mt-3 w-full max-w-5xl px-2">
      {/* cart container */}
      <div className="max-h-[65vh] overflow-y-auto rounded-md border border-cyan-200 bg-cyan-50 p-2">
        {cart.length === 0 ? (
          <p className="py-6 text-center text-gray-500">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {cart.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="remove"
                onClick={() => removeFromCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
 
      {/* summary */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-semibold text-black">
          Count: {cart.length} items
        </span>
        <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
          Price: ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  )
}