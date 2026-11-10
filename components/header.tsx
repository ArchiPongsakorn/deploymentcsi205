"use client";
import { Badge } from "@/components/tailgrids/core/badge";

export default function Header() {
  return (
    //header content
    <div className="mt-4 text-center">
      {/*code*/}
      <div className="flex justify-center gap-4">
        <Badge className="text-3xl rounded-lg py-1 px-3 bg-red-400 text-white-100 rotate-10">
          C
        </Badge>
        <Badge className="text-3xl rounded-lg py-1 px-3 bg-green-500 text-white-100 -rotate-10">
          S
        </Badge>
        <Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-600 text-white-100 rotate-10">
          I
        </Badge>
        <Badge className="text-3xl rounded-lg py-1 px-3 bg-sky-400 text-white-1000 -rotate-10">
          2
        </Badge>
        <Badge
          className="text-3xl rounded-lg py-1 px-3 bg-yellow-400 text-white-100 rotate-10"
          size="lg"
        >
          0
        </Badge>
        <Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-400 text-white-100 rotate-10">
          5
        </Badge>
      </div>

      {/*name*/}
      <div className="mt-4">
        <Badge size="lg" className="bg-black text-white rounded-md">
          FRONT END SOFTWARE DEVELOPMENT
        </Badge>
      </div>
    </div>
  );
}
