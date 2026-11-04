'use client';
 
import "./globals.css";
 
import Link from "next/link";
 
import { usePathname } from "next/navigation";
 
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import { fetchProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { Badge } from "@/components/tailgrids/core/badge";
import { CartContext } from "@/utils/cart-context";
import { doLogout } from "@/utils/login";
import { useRouter } from "next/navigation";

type StoredCredential = {
  token: string
  email: string
  name: string
  role: string
}
 
export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  
  const router = useRouter()
 
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])

  const [credential, setCredential] = useState<StoredCredential | null>(null)

// อ่านข้อมูลผู้ใช้ทุกครั้งที่เปลี่ยนหน้า (layout ไม่รีโหลดเองหลังล็อกอิน/ล็อกเอาต์)
useEffect(() => {
  try {
    const raw = localStorage.getItem("credential")
    setCredential(raw ? JSON.parse(raw) : null)
  } catch {
    setCredential(null)
  }
}, [pathname])
 
  useEffect(() => {
    fetchProducts()
    .then((data) => setProducts(data as Product[]))
    .catch(error => setProducts([] as Product[]))
  }, [])
 
  useEffect(() => {
    console.log(products)
  }, [products])
 
  // เพิ่มสินค้าลงตะกร้า (ถ้ามีอยู่แล้วไม่เพิ่มซ้ำ)
  const addToCart = (product: Product) =>
    setCart((prev) =>
      prev.some((p) => p.id === product.id) ? prev : [...prev, product]
    )
 
  // เอาสินค้าออกจากตะกร้า
  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id))

    const handleLogout = () => {
     doLogout(router, '/login')
  }

 
  console.log( pathname);
  return (

    <html>
      <body>
        <CartContext.Provider
          value={{ products, cart, addToCart, removeFromCart }}
        >
        <Header />

        {credential && (
  <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
    <span>
      <b className="text-gray-700">ROLE:</b>{" "}
      <b className="uppercase text-red-600">{credential.role}</b>
    </span>
    <span>
      <b className="text-gray-700">NAME:</b>{" "}
      <span className="text-blue-700">{credential.name}</span>
    </span>
    <span>
      <b className="text-gray-700">EMAIL:</b>{" "}
      <span className="text-blue-700">{credential.email}</span>
    </span>
  </div>
)}
        <nav className="flex justify-center gap-4 mt-4">
 
          <Link href={"/"}
          className={buttonStyles({
            appearance: pathname === "/" ? "fill" : "outline",
            variant: "primary" ,
          })}
          >
              Home
          </Link>
 
          <Link 
          href={"/animation"}
          className={buttonStyles({
            appearance: pathname === "/animation" ? "fill" : "outline",
            variant: "primary" ,
          })}          
          >
              Animation
          </Link>
 
          <Link href={"/calculator"}
          className={buttonStyles({
            appearance: pathname === "/calculator" ? "fill" : "outline",
            variant: "primary" ,
          })}          
          >
              Calculator
          </Link>
 
          <Link href={"/todos"}
          className={buttonStyles({
            appearance: pathname === "/todos" ? "fill" : "outline",
            variant: "primary" ,
          })}          
          >
              Todos
          </Link>
 
          <Link href={"/products"}
          className={buttonStyles({
            appearance: pathname === "/products" ? "fill" : "outline",
            variant: "primary" ,
          })}          
          >
              Products ({products.length - cart.length})
          </Link>
 
 
          <div className="relative">
 
          <Link href={"/carts"}
          className={buttonStyles({
            appearance: pathname === "/carts" ? "fill" : "outline",
            variant: "primary" ,
          })}          
          >
              Carts
          </Link>  
          <Badge 
          className='absolute -top-2 -right-2 bg-red-500 text-white'
          >
            {cart.length}
            </Badge>
 
          </div>

          <Button
           appearance='outline'
           variant='danger'
           size='sm'
           className='ml-1'
           onClick={() => handleLogout()}
          >Logout</Button>




        </nav>
        <main>{children}</main>
        <Footer />
        </CartContext.Provider>
      </body>
    </html>
  );
}
