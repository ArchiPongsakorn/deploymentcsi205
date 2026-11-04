'use client'

import { useEffect, useReducer } from 'react'
import { useRouter } from 'next/navigation'
import { checkLogin } from '@/utils/login'
import './calculator.css'

type Operator = '+' | '-' | '*' | '/'
type Phase = 'first' | 'operator' | 'second'

interface State {
  phase: Phase
  display: string
  first: number
  operator: Operator | null
}

type Action =
  | { type: 'number'; num: number }
  | { type: 'operator'; op: Operator }
  | { type: 'equal' }
  | { type: 'clear' }

const MAX_DIGITS = 9
const ERROR = 'Error'

const initialState: State = {
  phase: 'first',
  display: '0',
  first: 0,
  operator: null,
}

const calculate = (a: number, b: number, op: Operator): number | typeof ERROR => {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b === 0 ? ERROR : a / b
  }
}

const appendDigit = (display: string, num: number): string => {
  if (display === ERROR) return String(num)
  if (display.length >= MAX_DIGITS) return display
  return display === '0' ? String(num) : display + String(num)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'number': {
      switch (state.phase) {
        case 'first':
          return { ...state, display: appendDigit(state.display, action.num) }
        case 'operator':
          return { ...state, display: String(action.num), phase: 'second' }
        case 'second':
          return { ...state, display: appendDigit(state.display, action.num) }
      }
      return state
    }

    case 'operator': {
      switch (state.phase) {
        case 'first': {
          const first = Number(state.display)
          if (Number.isNaN(first)) return state // display is 'Error'
          return { ...state, first, operator: action.op, phase: 'operator' }
        }
        case 'operator':
          return { ...state, operator: action.op }
        case 'second': {
          const result = calculate(state.first, Number(state.display), state.operator!)
          if (result === ERROR) return { ...initialState, display: ERROR }
          return {
            phase: 'operator',
            display: String(result),
            first: result,
            operator: action.op,
          }
        }
      }
      return state
    }

    case 'equal': {
      if (state.phase === 'first' || state.operator === null) return state

      // phase 'operator' -> use first as second (e.g. 5 + = 10)
      const second = state.phase === 'operator' ? state.first : Number(state.display)
      const result = calculate(state.first, second, state.operator)

      if (result === ERROR) return { ...initialState, display: ERROR }
      return {
        phase: 'first',
        display: String(result),
        first: result,
        operator: null,
      }
    }

    case 'clear':
      return initialState
  }
}

// "1234567" -> "1 234 567"
const insertSeparator = (str: string, separator = ' ', groupSize = 3): string => {
  let result = ''
  let counter = 0
  for (let i = str.length - 1; i >= 0; i--) {
    result = str[i] + result
    if (i !== 0 && counter % groupSize === groupSize - 1) result = separator + result
    counter++
  }
  return result
}

interface CalculatorProps {
  studentId?: string
}

export default function Calculator({ studentId = '68060537' }: CalculatorProps) {
  const router = useRouter()
  useEffect(() => { checkLogin(router, '/calculator') }, [router])

  const [state, dispatch] = useReducer(reducer, initialState)

  const numberClick = (num: number) => dispatch({ type: 'number', num })
  const operatorClick = (op: Operator) => dispatch({ type: 'operator', op })
  const equalClick = () => dispatch({ type: 'equal' })
  const ceClick = () => dispatch({ type: 'clear' })

  // keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'clear' })
      else if (e.key === 'Enter') dispatch({ type: 'equal' })
      else if (e.key >= '0' && e.key <= '9' && e.key.length === 1)
        dispatch({ type: 'number', num: Number(e.key) })
      else if (e.key === '-') dispatch({ type: 'operator', op: '-' })
      else if (e.key === '=' || e.key === '+') dispatch({ type: 'operator', op: '+' })
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="calculator">
      <div className="outer">
        <div className="inner">
          {/* Screen */}
          <div id="screen" className="screen">
            {insertSeparator(state.display)}
          </div>

          {/* Memory buttons */}
          <div className="mt-5 btn-row">
            <button className="green" disabled>MC</button>
            <button className="green" disabled>MR</button>
            <button className="green" disabled>M+</button>
            <button className="green" disabled>M-</button>
            <button className="red" onClick={ceClick}>CE</button>
          </div>

          {/* 7 8 9 */}
          <div className="btn-row">
            <button className="purple" onClick={() => numberClick(7)}>7</button>
            <button className="purple" onClick={() => numberClick(8)}>8</button>
            <button className="purple" onClick={() => numberClick(9)}>9</button>
            <button className="green" disabled onClick={() => operatorClick('/')}>&divide;</button>
            <button className="green" disabled>&radic;</button>
          </div>

          {/* 4 5 6 */}
          <div className="btn-row">
            <button className="purple" onClick={() => numberClick(4)}>4</button>
            <button className="purple" onClick={() => numberClick(5)}>5</button>
            <button className="purple" onClick={() => numberClick(6)}>6</button>
            <button className="green" disabled>&times;</button>
            <button className="green" disabled>%</button>
          </div>

          {/* 1 2 3 */}
          <div className="btn-row">
            <button className="purple" onClick={() => numberClick(1)}>1</button>
            <button className="purple" onClick={() => numberClick(2)}>2</button>
            <button className="purple" onClick={() => numberClick(3)}>3</button>
            <button className="green" onClick={() => operatorClick('-')}>&ndash;</button>
            <button className="green" disabled>1/x</button>
          </div>

          {/* 0 */}
          <div className="btn-row">
            <button className="purple" onClick={() => numberClick(0)}>0</button>
            <button className="purple" disabled>.</button>
            <button className="purple" disabled>+/&ndash;</button>
            <button className="green" onClick={() => operatorClick('+')}>+</button>
            <button className="green" onClick={equalClick}>=</button>
          </div>
        </div>

        {/* Student ID */}
        <div className="student">{studentId}</div>
      </div>
    </div>
  )
}