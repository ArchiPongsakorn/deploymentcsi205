"use client";

import Link from "next/link";

import { Badge } from "@/components/tailgrids/core/badge";
import { Facebook, Discord, Instagram  } from "@tailgrids/icons";

export default function Footer() {
    return (
        <div className='mt-4 pb-4 text-center'>
        {/*student*/}
        <div>
          <Badge className='text-xl text-black rounded-lg'>68060537 ปัญญวัฒน์ ศิริรัชทรัพย์</Badge>
        </div>
        {/*contact*/}
        <div>
            <div className='mt-4 flex justify-center gap-6'>
                <Link href="https://www.facebook.com/SLCDGT5?locale=th_TH" target="_blank">
                <Facebook className="text-blue-700" />
                </Link>
                <div className="border-l-1"></div>

                <Link href="https://discordapp.com/users/1438815643351777342" target="_blank">
                    <Discord className="text-blue-900" />
                </Link>
                <div className="border-l-1"></div>

                <Link href="https://www.instagram.com/pnyw.to?igsh=cXdkazI3dms4dnli" target="_blank">
                    <Instagram className="text-pink-500" />
                </Link>

            </div>
        </div>
        </div>
    )
}