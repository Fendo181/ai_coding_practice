import { useState, useEffect } from 'react'
import './App.css'

const FILTERS = ['すべて', '未完了', '完了']

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

function App() {
  const [todos, setTodos] = useLocalStorage('react-todos', [])
  const [inputText, setInputText] = useState('')
  const [filter, setFilter] = useState('すべて')

  const addTodo = () => {
    const text = inputText.trim()
    if (!text) return
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, done: false }
    ])
    setInputText('')
  }

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo)
    )
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.done))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === '未完了') return !todo.done
    if (filter === '完了') return todo.done
    return true
  })

  const activeCount = todos.filter(t => !t.done).length

  return (
    <div className="app">
      <h1>📝 Todo</h1>

      <div className="input-row">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力..."
          maxLength={100}
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredTodos.length === 0 ? (
        <p className="empty">タスクがありません</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label="削除"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="footer">
        <span>残り {activeCount} 件</span>
        {todos.some(t => t.done) && (
          <button className="clear-btn" onClick={clearCompleted}>
            完了済みを削除
          </button>
        )}
      </div>
    </div>
  )
}

export default App
