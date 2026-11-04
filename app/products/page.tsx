'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkLogin } from "@/utils/login"
import ProductCard from "@/components/ProductCard"
import { useCart } from "@/utils/cart-context"
 
export default function Page() {
  const router = useRouter()
  useEffect(() => { checkLogin(router, '/products') }, [router])

  const { products, cart, addToCart } = useCart()
  // ... โค้ดเดิมต่อจากนี้
 
  // แสดงเฉพาะสินค้าที่ยังไม่อยู่ในตะกร้า
  // (กดลบในตะกร้า สินค้านั้นจะกลับมาอยู่ที่เดิมตามลำดับของ products)
  const availableProducts = products.filter(
    (product) => !cart.some((item) => item.id === product.id)
  )
 
  return (
    <div className="mx-auto mt-3 w-full max-w-5xl px-2">
      {/* products container */}
      <div className="max-h-[65vh] overflow-y-auto rounded-md border border-cyan-200 bg-cyan-50 p-2">
        {products.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No products</p>
        ) : availableProducts.length === 0 ? (
          <p className="py-6 text-center text-gray-500">All products are in your cart</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {availableProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="add"
                onClick={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}