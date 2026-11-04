'use client';
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";
 
import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption
} from "@/components/tailgrids/core/native-select";
import { Spinner } from "@/components/tailgrids/core/spinner";
 
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";
 
import {fetchTodos} from "@/data/todos";
import type { TodoType } from "@/data/todos";
 
export default function Page() {
  const router = useRouter()
  useEffect(() => { checkLogin(router, '/todos') }, [router])

  const [isloading, setisLoading] = useState<boolean>(true)
  const [todosRaw, setTodosRaw] = useState<TodoType[]>([])
  const [todos, setTodos] = useState<TodoType[]>([])
 
  // Show only waiting
  const [onlyWaiting, setOnlyWaiting] = useState<boolean>(false)
 
  // items per page + current page
  const [itemsPerPage, setItemsPerPage] = useState<number>(5)
  const [currentPage, setCurrentPage] = useState<number>(1)
 
  // New todo modal
  const [showModal, setShowModal] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>("")
 
  // ID อัตโนมัติ = เลขสูงสุดที่มี + 1 (เช่นมี 13 รายการ -> 14)
  const nextId = todosRaw.length > 0 ? Math.max(...todosRaw.map((t) => t.id)) + 1 : 1
 
  // จำนวนหน้าคำนวณจากข้อมูลจริง (อย่างน้อย 1 หน้า)
  const totalPages = Math.max(1, Math.ceil(todos.length / itemsPerPage))
 
  // กันกรณีข้อมูลลดลงจนหน้าปัจจุบันเกินจำนวนหน้า (เช่นเปิดตัวกรองหรือลบรายการ)
  const activePage = Math.min(currentPage, totalPages)
 
  // เฉพาะรายการของหน้าปัจจุบัน
  const pageTodos = todos.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  )
 
// onload
useEffect(() => {
  fetchTodos()
    .then((data) => 
      setTodosRaw(data as TodoType[])
    )
    .catch((error) => 
      setTodosRaw([])
    )
    .finally(() => 
      setisLoading(false)
    )
}, [])
 
// todosRaw, onlyWaiting => [] => todos
useEffect(() => {
  console.log(todosRaw)
 
  if (onlyWaiting) {
    // เฉพาะรายการที่ยังเป็น Waiting (completed === false)
    setTodos(todosRaw.filter((todo) => todo.completed === false))
  } else {
    setTodos(todosRaw)
  }
 
}, [todosRaw, onlyWaiting])
 
  // กด Waiting <-> Done สลับไปมาได้
  // แก้ที่ todosRaw แล้วให้ effect ด้านบนคำนวณ todos ใหม่ (ตัวกรองจะอัปเดตตามอัตโนมัติ)
  const handleToggleCompleted = (id: number) => {
    setTodosRaw((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }
 
  // ลบรายการ
  const handleDelete = (id: number) => {
    setTodosRaw((prev) => prev.filter((t) => t.id !== id))
  }
 
  // เปิด/ปิดหน้าต่าง New todo
  const openModal = () => {
    setNewTitle("")
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
  }
 
  // เพิ่มรายการใหม่
  const handleAddTodo = () => {
    const title = newTitle.trim()
    if (!title) return
 
    setTodosRaw((prev) => [
      ...prev,
      { userId: 1, id: nextId, title, completed: false },
    ])
    setShowModal(false)
  }
 
 
  const handlePageChange = (page: number) => {
    // กันไม่ให้เลขหน้าหลุดช่วง 1..totalPages
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };
 
  const isFirst = activePage <= 1;
  const isLast = activePage >= totalPages;
 
  // สไตล์ปุ่ม pagination (ขอบเทา พื้นขาว / หน้าปัจจุบันพื้นเทาอ่อน)
  const pageBtn =
    "min-w-9 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white";
  const pageBtnActive =
    "min-w-9 rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm";
 
  return (
    // todo content
    <div className='mt-4 w-600px mx-auto'>
     {/*controller*/}
     <div className="flex items-center justify-between gap-2">
      {/*toggle*/}
      <div className="flex items-center gap-2">
        <Toggle
          label="Show only"
          checked={onlyWaiting}
          onChange={(e) => {
            setOnlyWaiting(e.target.checked)
            setCurrentPage(1)
          }}
        />
        <span className="inline-flex items-center gap-1.5 rounded bg-[#ffc107] px-2.5 py-1.5 text-sm font-medium text-black">
          Waiting
          {/* clock */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
      </div>
      {/*dropdown*/}
      <div className="w-2/5">
        <NativeSelect
          value={String(itemsPerPage)}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
        >
          <NativeSelectOption value="5">5 items per page</NativeSelectOption>
          <NativeSelectOption value="10">10 items per page</NativeSelectOption>
          <NativeSelectOption value="50">50 items per page</NativeSelectOption>
        </NativeSelect>
      </div>
 
 
     </div>
     {/*table*/}
     <div className="mt-2">
      <TableRoot>
        <TableHeader>
          <TableRow className="bg-black [&>th]:text-white">
            <TableHead scope="col" className="text-center">ID</TableHead>
            <TableHead scope="col" className="text-center">Title</TableHead>
            <TableHead scope="col">
              <div className="flex items-center justify-end gap-2">
                Completed
                <button
                  type="button"
                  aria-label="Add todo"
                  onClick={openModal}
                  className="flex h-7 w-7 items-center justify-center rounded bg-[#3b5bfd] text-white hover:bg-[#2f49d1]"
                >
                  {/* plus */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
 
        <TableBody>
 
          {/* show spinner while loading */}
          {isloading && (
            <TableRow>
            <TableCell colSpan={3}>
              <Spinner className="mx-auto" />
            </TableCell>
          </TableRow>
        )}
 
          {/* show message when there is no data (e.g. fetch failed) */}
          {!isloading && todos.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-red-500">
                No data, may be connection refused (reload again)
              </TableCell>
            </TableRow>
          )}
 
          {/* render data (เฉพาะหน้าปัจจุบัน) */}
          {pageTodos.map((todo) => {
          return (
            <TableRow key={todo.id}>
              <TableCell className="text-center">
                <span className="inline-block rounded bg-slate-600 px-2.5 py-1 text-xs font-bold text-white">
                  {todo.id}
                </span>
              </TableCell>
              <TableCell>
                {todo.title}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {todo.completed ? (
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(todo.id)}
                      title="Click to mark as waiting"
                      className="inline-flex items-center gap-1.5 rounded bg-[#198754] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#157347]"
                    >
                      Done
                      {/* check */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(todo.id)}
                      title="Click to mark as done"
                      className="inline-flex items-center gap-1.5 rounded bg-[#ffc107] px-3 py-1.5 text-xs font-medium text-black hover:bg-[#e0a800]"
                    >
                      Waiting
                      {/* clock */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Delete todo"
                    onClick={() => handleDelete(todo.id)}
                    className="flex h-8 w-8 items-center justify-center rounded bg-[#dc3545] text-white hover:bg-[#bb2d3b]"
                  >
                    {/* trash */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </TableCell>
            </TableRow>
         )
        })}
 
        </TableBody>
      </TableRoot>
 
 
     </div>
     {/*pagination*/}
     {todos.length > 0 && (
     <nav aria-label="Pagination" className="mt-3 flex items-center justify-center gap-1.5">
      <button
        type="button"
        className={pageBtn}
        disabled={isFirst}
        onClick={() => handlePageChange(1)}
      >
        First
      </button>
 
      <button
        type="button"
        aria-label="Previous page"
        className={pageBtn}
        disabled={isFirst}
        onClick={() => handlePageChange(activePage - 1)}
      >
        &larr;
      </button>
 
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === activePage ? "page" : undefined}
          className={n === activePage ? pageBtnActive : pageBtn}
          onClick={() => handlePageChange(n)}
        >
          {n}
        </button>
      ))}
 
      <button
        type="button"
        aria-label="Next page"
        className={pageBtn}
        disabled={isLast}
        onClick={() => handlePageChange(activePage + 1)}
      >
        &rarr;
      </button>
 
      <button
        type="button"
        className={pageBtn}
        disabled={isLast}
        onClick={() => handlePageChange(totalPages)}
      >
        Last
      </button>
     </nav>
     )}
 
     {/* New todo modal */}
     {showModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        onClick={closeModal}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-todo-title"
          className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* close (X) */}
          <button
            type="button"
            aria-label="Close"
            onClick={closeModal}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
 
          {/* header */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8eefc] text-gray-800">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <h2 id="new-todo-title" className="text-lg font-bold text-gray-900">New todo</h2>
          </div>
 
          {/* ID (Auto) */}
          <label className="mt-5 block text-sm text-gray-800" htmlFor="new-todo-id">
            ID (Auto)
          </label>
          <input
            id="new-todo-id"
            value={nextId}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-gray-800 outline-none"
          />
 
          {/* Title */}
          <label className="mt-4 block text-sm text-gray-800" htmlFor="new-todo-title-input">
            Title
          </label>
          <input
            id="new-todo-title-input"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTodo()
              if (e.key === "Escape") closeModal()
            }}
            placeholder="Enter todo title"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#3b5bfd] focus:ring-2 focus:ring-[#3b5bfd]/30"
          />
 
          {/* actions */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddTodo}
              disabled={!newTitle.trim()}
              className="rounded-lg bg-[#3b5bfd] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f49d1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add todo
            </button>
          </div>
        </div>
      </div>
     )}
    </div>
  );
}
