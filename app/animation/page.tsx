'use client'
 
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { checkLogin } from "@/utils/login"
 
// รูปอยู่ที่ public/animation/ (เรียกใช้ด้วย path ที่ขึ้นต้นด้วย /)
const fieldImage = '/animation/field.jpg'
const basketballImage = '/animation/basketball.png'
const footballImage = '/animation/football.png'
const valleyballImage = '/animation/valleyball.png'
const faceImage = '/animation/face.png'
 
type BallType = 'none' | 'basketball' | 'football' | 'valleyball' | 'human'
 
type AnimationProps = {
    ballradius?: number
    fieldwidth?: number
    fieldheight?: number
    ballVelocity?: number
}
 
// ---------- สไตล์ปุ่ม (Tailwind) หน้าตาเหมือนปุ่ม Bootstrap ----------
const btnBase =
    "rounded-md border px-3 py-1.5 text-base leading-6 transition-colors cursor-pointer"
 
const btnSuccess = "border-[#198754] bg-[#198754] text-white hover:bg-[#157347]"
const btnWarning = "border-[#ffc107] bg-[#ffc107] text-black hover:bg-[#e0a800]"
 
const btnSecondary = "border-[#6c757d] bg-[#6c757d] text-white"
const btnOutlineSecondary =
    "border-[#6c757d] bg-transparent text-[#6c757d] hover:bg-[#6c757d] hover:text-white"
 
const btnPrimary = "border-[#0d6efd] bg-[#0d6efd] text-white"
const btnOutlinePrimary =
    "border-[#0d6efd] bg-transparent text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white"
 
// รายการปุ่มเลือกชนิดวัตถุ
const ballButtons: { type: BallType; label: string }[] = [
    { type: 'none', label: 'None' },
    { type: 'basketball', label: 'Basketball' },
    { type: 'football', label: 'Football' },
    { type: 'valleyball', label: 'Volleyball' },
    { type: 'human', label: 'Human' },
]
 
const Animation = ({ ballradius, fieldwidth, fieldheight, ballVelocity }: AnimationProps) => {

    const router = useRouter()
    useEffect(() => { checkLogin(router, '/animation') }, [router])

    // ---------- ค่า default ----------
    
    const _fieldwidth = fieldwidth || 640
    const _fieldheight = fieldheight || 480
    const _ballradius = ballradius || 50
    const _ballVelocity = ballVelocity || 200 // px/s (ความเร็วรวม ไม่ใช่ต่อแกน)
 
    // ---------- ค่าคงที่ภายใน ----------
    const _balldiameter = 2 * _ballradius
    const maxX = _fieldwidth - _balldiameter - 2 // ขอบขวาสุดที่ลูกบอลอยู่ได้ (หัก border)
    const maxY = _fieldheight - _balldiameter - 2 // ขอบล่างสุดที่ลูกบอลอยู่ได้
 
    // เคลื่อนที่ทำมุม 45 องศา => ความเร็วแกน x และ y เท่ากัน (cos45 = sin45)
    // แตกความเร็วรวมออกเป็นแกน x, y ด้วย sqrt(2)/2 ~ 0.7071
    const axisVelocity = _ballVelocity / Math.sqrt(2) // px/s ต่อแกน
 
    const frameRate = 40 // fps
    const frameTime = 1000 / frameRate // ms ต่อ 1 เฟรม
    const rotationPerFrame = 6 // องศาที่หมุนต่อเฟรม (ปรับได้ตามความเร็ว)
 
    // ---------- refs ----------
    const ballRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
 
    // ใช้ ref เก็บตำแหน่ง/ทิศทาง/มุมหมุนปัจจุบัน เพื่อไม่ให้ closure ใน setTimeout ใช้ค่าเก่า (stale state)
    const posRef = useRef({ x: 0, y: 0 })
    const dirRef = useRef({ dx: 1, dy: 1 }) // 1 = ไปทางขวา/ลง, -1 = ไปทางซ้าย/ขึ้น
    const rotationRef = useRef(0)
 
    // ---------- state (ใช้ควบคุม UI / re-render) ----------
    const [running, setRunning] = useState<boolean>(false)
    const [ballType, setBallType] = useState<BallType>('none')
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)
    const [rotation, setRotation] = useState<number>(0)
 
    // ---------- เปลี่ยนรูปภาพตามชนิดวัตถุที่เลือก ----------
    useEffect(() => {
        if (!ballRef.current) return
 
        if (ballType === 'none') {
            ballRef.current.style.backgroundImage = 'none'
        } else if (ballType === 'basketball') {
            ballRef.current.style.backgroundImage = `url(${basketballImage})`
        } else if (ballType === 'football') {
            ballRef.current.style.backgroundImage = `url(${footballImage})`
        } else if (ballType === 'valleyball') {
            ballRef.current.style.backgroundImage = `url(${valleyballImage})`
        } else if (ballType === 'human') {
            ballRef.current.style.backgroundImage = `url(${faceImage})`
        }
    }, [ballType])
 
    // ---------- คำนวณเฟรมถัดไป (เคลื่อนที่ + ชนขอบ + หมุน) ----------
    const calculateNextFrame = () => {
        let { x: curX, y: curY } = posRef.current
        let { dx, dy } = dirRef.current
 
        // ระยะที่เคลื่อนในเฟรมนี้ (px) เท่ากันทั้งสองแกน => มุม 45 องศา
        const step = axisVelocity / frameRate
 
        curX += dx * step
        curY += dy * step
 
        // ชนขอบขวา หรือ ขอบซ้าย -> กลับทิศแกน x (เท่ากับกระเด้งมุม 90 องศา)
        if (curX >= maxX) {
            curX = maxX - (curX - maxX)
            dx = -1
        } else if (curX <= 0) {
            curX = -curX
            dx = 1
        }
 
        // ชนขอบบน หรือ ขอบล่าง -> กลับทิศแกน y
        if (curY >= maxY) {
            curY = maxY - (curY - maxY)
            dy = -1
        } else if (curY <= 0) {
            curY = -curY
            dy = 1
        }
 
        // อัปเดต ref (ค่าจริงที่ใช้คำนวณต่อเฟรมถัดไป)
        posRef.current = { x: curX, y: curY }
        dirRef.current = { dx, dy }
        rotationRef.current = (rotationRef.current + rotationPerFrame) % 360
 
        // อัปเดต state เพื่อ re-render ตำแหน่ง/มุมหมุนบนหน้าจอ
        setX(curX)
        setY(curY)
        setRotation(rotationRef.current)
    }
 
    // ---------- ลูปแอนิเมชันด้วย setTimeout แบบวนซ้ำ ----------
    useEffect(() => {
        if (running) {
            timerRef.current = setTimeout(function tick() {
                calculateNextFrame()
                timerRef.current = setTimeout(tick, frameTime)
            }, frameTime)
        }
 
        // cleanup: หยุด timer เมื่อ running เปลี่ยนเป็น false หรือ component unmount
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running])
 
    // ---------- Keyboard control ----------
    // เลข 0-4 เลือกชนิดวัตถุ (0:None, 1:Basketball, 2:Football, 3:Volleyball, 4:Human), Space bar สลับ RUN/PAUSE
    // ลูกศรซ้าย/ขวา เลื่อนปุ่มที่เลือกอยู่ (None <-> Basketball <-> Football <-> Volleyball <-> Human)
    useEffect(() => {
        // เลื่อนการเลือกปุ่ม dir = -1 (ซ้าย) หรือ 1 (ขวา) และวนกลับมาเมื่อสุดทาง
        const moveSelection = (dir: number) => {
            setBallType((prev) => {
                const i = ballButtons.findIndex((b) => b.type === prev)
                const next = (i + dir + ballButtons.length) % ballButtons.length
                return ballButtons[next].type
            })
        }
 
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault() // กันหน้าเลื่อนซ้าย/ขวา
                    moveSelection(-1)
                    break
                case 'ArrowRight':
                    e.preventDefault()
                    moveSelection(1)
                    break
                case '0': setBallType('none'); break
                case '1': setBallType('basketball'); break
                case '2': setBallType('football'); break
                case '3': setBallType('valleyball'); break
                case '4': setBallType('human'); break
                case ' ':
                    e.preventDefault() // กัน spacebar เลื่อนหน้าจอ
                    setRunning((prev) => !prev)
                    break
                default: break
            }
        }
 
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])
 
    return (
        <>
            {/* animation container */}
            <div className="mx-auto mt-3" style={{ width: 'fit-content' }}>
 
                {/* field */}
                <div
                    className="relative mx-auto rounded-lg border-2 border-black"
                    style={{
                        width: `${_fieldwidth}px`,
                        height: `${_fieldheight}px`,
                        backgroundImage: `url(${fieldImage})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        overflow: 'hidden',
                    }}
                >
                    {/* ball */}
                    <div
                        ref={ballRef}
                        className="absolute rounded-full border border-black"
                        style={{
                            width: `${_balldiameter}px`,
                            height: `${_balldiameter}px`,
                            backgroundColor: ballType === 'none' ? 'transparent' : 'white',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            top: `${y}px`,
                            left: `${x}px`,
                            transform: `rotate(${rotation}deg)`,
                        }}
                    />
                </div>
 
                {/* button row — อยู่นอกสนาม */}
                <div className="mt-2 flex items-center justify-between gap-4">
 
                    <button
                        className={`${btnBase} ${running ? btnWarning : btnSuccess}`}
                        onClick={() => setRunning((prev) => !prev)}
                    >
                        {running ? (
                            <span className="inline-flex items-center gap-1.5">
                                {/* pause */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="5" width="4" height="14" rx="1" />
                                    <rect x="14" y="5" width="4" height="14" rx="1" />
                                </svg>
                                Stop
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5">
                                {/* play */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />
                                </svg>
                                Run
                            </span>
                        )}
                    </button>
 
                    {/* ball type */}
                    <div className="flex justify-end gap-2">
                        {ballButtons.map(({ type, label }) => {
                            const active = ballType === type
                            const style =
                                type === 'none'
                                    ? active ? btnSecondary : btnOutlineSecondary
                                    : active ? btnPrimary : btnOutlinePrimary
 
                            return (
                                <button
                                    key={type}
                                    className={`${btnBase} ${style}`}
                                    onClick={() => setBallType(type)}
                                >
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
 
export default Animation