import { useState, useEffect } from 'react'

const App = () => {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      try {
        return JSON.parse(storedTodos)
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error)
        // Initialize default todos with UUIDs
        return [
          { id: crypto.randomUUID(), name: 'Buy groceries', date: '2024-09-03', checked: true },
          { id: crypto.randomUUID(), name: 'Complete project report', date: '2024-09-04', checked: false },
          { id: crypto.randomUUID(), name: 'Call the bank', date: '2024-09-05', checked: false },
          { id: crypto.randomUUID(), name: 'Schedule doctor appointment', date: '2024-09-06', checked: false },
          { id: crypto.randomUUID(), name: 'Read a book', date: '2024-09-07', checked: false },
          { id: crypto.randomUUID(), name: 'Cook dinner', date: '2024-09-08', checked: false }
        ]
      }
    } else {
      // Initialize default todos with UUIDs
      return [
        { id: crypto.randomUUID(), name: 'Buy groceries', date: '2024-09-03', checked: true },
        { id: crypto.randomUUID(), name: 'Complete project report', date: '2024-09-04', checked: false },
        { id: crypto.randomUUID(), name: 'Call the bank', date: '2024-09-05', checked: false },
        { id: crypto.randomUUID(), name: 'Schedule doctor appointment', date: '2024-09-06', checked: false },
        { id: crypto.randomUUID(), name: 'Read a book', date: '2024-09-07', checked: false },
        { id: crypto.randomUUID(), name: 'Cook dinner', date: '2024-09-08', checked: false }
      ]
    }
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function handleAddTodo (todo) {
    setTodos(todos => [...todos, todo])
  }

  function handleDeleteTodo (id, name) {
    // console.log(id, name)
    if (window.confirm(`No waaaaay?! Delete ${name}???`)) {
      setTodos(prevState => prevState.filter((item) => item.id !== id))
    }
  }

  function handleCheckboxChange (id, checked) {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, checked: checked } : todo
      )
    )
  }

  function handleEditTodo(id, name, date, checked) {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, name, date, checked } : todo
      )
    )
  }


  return (
    <div className="main-container">
      <TodoList todos={todos} onDelete={handleDeleteTodo} onCheckChange={handleCheckboxChange} onEdit={handleEditTodo}/>
      <AddTodo onAdd={handleAddTodo}/>
    </div>
  )
}

export default App

const TodoList = ({ todos, onDelete, onCheckChange, onEdit }) => {
  return (
    <div className={'todolist'}>
      <h2 className={'header'}>✏️ TODO LIST ✍🏼</h2>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onCheckChange={onCheckChange} onEdit={onEdit}/>
        ))}
      </ul>
    </div>
  )
}


const TodoItem = ({ todo, onDelete, onCheckChange, onEdit }) => {
  const [editing, setEditing] = useState(false)
  const [editedTodo, setEditedTodo] = useState(todo)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    onEdit(editedTodo.id, editedTodo.name, editedTodo.date, editedTodo.checked)
    setEditing(false)
  }

  return (
    <div className={'item'}>
      {!editing ? (
        <>
          <div className={'task'}>
            <input className={'check'} type="checkbox" onChange={(e) => onCheckChange(todo.id, e.target.checked)}
                   checked={todo.checked}/>
            <span className={todo.checked ? 'checked' : 'not-checked'}>{todo.name}</span>
          </div>
          <div className={'date'}>
            <span>{todo.date}</span>
            <Button onClick={() => setEditing(true)}>📝</Button>
            <Button onClick={() => onDelete(todo.id, todo.name)}>🗑️</Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleEditSubmit} className={'edit-form'}>
          <input
            value={editedTodo.name}
            onChange={(e) => setEditedTodo({...editedTodo, name: e.target.value})}
            placeholder="Name"
          />
          <input
            value={editedTodo.date}
            onChange={(e) => setEditedTodo({...editedTodo, date: e.target.value})}
            type="date"
            placeholder="Date"
          />
          <input
            type="checkbox"
            checked={editedTodo.checked}
            onChange={(e) => setEditedTodo({...editedTodo, checked: e.target.checked})}
          />
          <Button type="submit">Save Changes</Button>
          <Button onClick={() => setEditing(false)}>Cancel</Button>
        </form>
      )}
    </div>
  )
}


const AddTodo = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')

  function handleSubmit (e) {
    e.preventDefault()

    if (!name || !date) return

    const id = crypto.randomUUID()
    const newTask = {
      id,
      name,
      date,
      checked: false,
    }

    onAdd(newTask)

    setName('')
    setDate('')
  }

  return (
    <form onSubmit={handleSubmit} className={'add-todo'}>
      <div className={'add-name'}>
        <label htmlFor="name">Name: </label>
        <input onChange={(e) => setName(e.target.value)} value={name} id={'name'} type="text"/>
      </div>
      <div className={'add-date'}>
        <label htmlFor="date">Date: </label>
        <input onChange={(e) => setDate(e.target.value)} value={date} id={'date'} type="date"/>
      </div>
      <Button> ADD TODO </Button>
    </form>
  )
}

const Button = ({children, onClick}) => {
  return (
    <>
      <button className={'button'} onClick={onClick}>{children}</button>
    </>

  )
}
