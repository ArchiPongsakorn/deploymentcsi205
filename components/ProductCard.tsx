'use client'
 
import type { Product } from "@/data/products"
 
type ProductCardProps = {
  product: Product
  variant: 'add' | 'remove'   // add = ปุ่มเขียว "Add to Carts", remove = ปุ่มแดง "Remove"
  label?: string              // ข้อความบนปุ่ม (ไม่ใส่ก็ใช้ค่าตาม variant)
  disabled?: boolean
  onClick: () => void
}
 
const styles = {
  add: {
    card: "border-green-300",
    button: "border-green-300 text-green-600 hover:bg-green-50",
    label: "Add to Carts",
  },
  remove: {
    card: "border-red-300",
    button: "border-red-300 text-red-600 hover:bg-red-50",
    label: "Remove",
  },
}
 
export default function ProductCard({ product, variant, label, disabled, onClick }: ProductCardProps) {
  const s = styles[variant]
 
  return (
    <div className={`overflow-hidden rounded-lg border bg-white ${s.card}`}>
      {/* รูป + ราคา + ชื่อสินค้า */}
      <div className="relative aspect-square bg-gray-200">
        <img
          src={product.thumbnailUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
 
        {/* ราคา (มุมขวาบน) */}
        <span className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          ${product.price.toFixed(2)}
        </span>
 
        {/* ชื่อสินค้า (ซ้อนด้านล่างของรูป) */}
        <div className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-1">
          <p className="line-clamp-2 text-[10px] leading-tight text-white">
            {product.title}
          </p>
        </div>
      </div>
 
      {/* ปุ่ม */}
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`w-full border-t bg-white py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white ${s.button}`}
      >
        {label ?? s.label}
      </button>
    </div>
  )
}