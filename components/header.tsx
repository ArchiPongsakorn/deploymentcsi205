"use client";
import { Badge } from "@/components/tailgrids/core/badge";


export default function Header() {
    return (
        //header content
        <div className='mt-4 text-center'>
            {/*code*/}
            <div className='flex justify-center gap-4'>
              <Badge className='text-3xl rounded-lg py-1 px-3 bg-red-300 text-gray-200 rotate-6'>C</Badge>
              <Badge className="text-3xl rounded-lg py-1 px-3 bg-green-300 text-gray-200 -rotate-5"  >S</Badge>
              <Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-300 text-gray-200 rotate-15" >I</Badge>
              <Badge className="text-3xl rounded-lg py-1 px-3 bg-cyan-300 text-gray-200 -rotate-7" >2</Badge>
              <Badge className="text-3xl rounded-lg py-1 px-3 bg-yellow-300 text-gray-200 rotate-10" >0</Badge>
              <Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-300 text-gray-200 -rotate-7" >5</Badge>
            </div>

            {/*name*/}
            <div className='mt-4'>
                <Badge size="lg" className="bg-black text-white rounded-md">FRONT END SOFTWARE DEVELOPMENT</Badge>
            </div>

        </div>
    )
}