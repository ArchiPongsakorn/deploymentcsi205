'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

export default function Home() {
  const router = useRouter()
  useEffect(() => checkLogin(router, '/'), [router])
  return (
    <>

      <div className="flex gap-2 border-2 border-gray-200 rounded-lg p-2 mt-4">

        {/* รูป */}
        <div className="w-2/5 border border-gray-300 rounded overflow-hidden">
          <img
  src="/animation/face.png"
  alt="Instructor"
  className="w-full h-[300px] object-cover object-[center_35%]"
/>

          <div className="p-2 text-sm">
            <b>ชื่อ พงศกร คายะโส</b>
            <p>Computer Science and Software Development</p>
            <p>Sripatum University (SPU)</p>
          </div>
        </div>  

        {/* ข้อความ */}
        <div className="flex-1 text-sm p-1">
          <b>CSI205 Front-End Software Development</b>

          <p>This course covers the following topics:</p>

          <ul className="list-disc pl-5">
            <li>
              <b>UX/UI Fundamentals:</b> Review the fundamentals
              of user-friendly web interface design.
            </li>

            <li>
              <b>Traditional HTML/CSS/JS:</b> Learn HTML,
              CSS and JavaScript for web development.
            </li>

            <li>
              <b>React Web Application:</b> Learn React concepts
              such as components, props and state.
            </li>

            <li>
              <b>Back-End Interface Preparation:</b> Prepare
              examples for future back-end services via APIs.
            </li>

            <li>
              <b>DevOps Fundamentals:</b> Learn about virtual
              machines, containers and deployment tools.
            </li>
          </ul>

        </div>

      </div>

    </>
  );
}