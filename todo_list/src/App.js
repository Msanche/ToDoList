import React, { useState, useEffect } from "react"; // Importa React y los hooks useState y useEffect desde la biblioteca "react".

import "./App.css"; // Importa un archivo CSS para estilos adicionales.

const App = () => { // Define un componente funcional llamado App.
  // Estado para mantener la lista de tareas (todos) y la tarea actualmente en edición (todoEditing).
  const [todos, setTodos] = useState([]); // useState inicializa el estado de "todos" como un array vacío.
  const [todoEditing, setTodoEditing] = useState(null); // Inicializa el estado de "todoEditing" como nulo.

  // useEffect para cargar las tareas almacenadas en el localStorage al cargar la aplicación.
  useEffect(() => {
    const json = localStorage.getItem("todos"); // Obtiene los datos de "todos" almacenados en el localStorage.
    const loadedTodos = JSON.parse(json); // Parsea los datos almacenados en formato JSON.
    if (loadedTodos) { // Si hay datos almacenados, los establece como el nuevo estado de "todos".
      setTodos(loadedTodos);
    }
  }, []);

  // useEffect para guardar las tareas en el localStorage cada vez que se modifiquen.
  useEffect(() => {
    if (todos.length > 0) { // Si hay tareas en la lista...
      const json = JSON.stringify(todos); // Convierte la lista de tareas a formato JSON.
      localStorage.setItem("todos", json); // Almacena la lista de tareas en el localStorage con la clave "todos".
    }
  }, [todos]); // Este useEffect se ejecutará cada vez que el estado de "todos" cambie.

  // Función para manejar la acción de agregar una nueva tarea.
  function handleSubmit(e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    let todo = document.getElementById('todoAdd').value; // Obtiene el valor del campo de entrada de texto.
    const newTodo = { // Crea un nuevo objeto tarea con un ID único, el texto ingresado y el estado "completado" inicializado como falso.
      id: new Date().getTime(), // Genera un ID único basado en la marca de tiempo actual.
      text: todo.trim(), // Elimina los espacios en blanco al principio y al final del texto ingresado.
      completed: false,
    };
    if (newTodo.text.length > 0) { // Verifica si el texto de la tarea no está vacío.
      setTodos([...todos].concat(newTodo)); // Agrega la nueva tarea al estado de "todos".
    } else { // Si el texto de la tarea está vacío, muestra una alerta.
      alert("Ingrese una tarea válida");
    }
    document.getElementById('todoAdd').value = ""; // Limpia el campo de entrada de texto después de agregar la tarea.
  }
  
  // Función para eliminar una tarea de la lista.
  function deleteTodo(id) {
    let updatedTodos = [...todos].filter((todo) => todo.id !== id); // Filtra las tareas para excluir la tarea con el ID proporcionado.
    setTodos(updatedTodos); // Establece la lista de tareas actualizada sin la tarea eliminada.
  }
  
  // Función para alternar el estado completado/no completado de una tarea.
  function toggleComplete(id) {
    let updatedTodos = [...todos].map((todo) => { // Crea una nueva lista de tareas con el estado de completado alternado para la tarea con el ID proporcionado.
      if (todo.id === id) { // Si el ID de la tarea coincide con el ID proporcionado...
        todo.completed = !todo.completed; // Invierte el estado de completado de la tarea.
      }
      return todo; // Devuelve la tarea actualizada.
    });
    setTodos(updatedTodos); // Establece la lista de tareas actualizada con el estado de completado cambiado.
  }
  
  // Función para enviar las ediciones realizadas en una tarea.
  function submitEdits(newtodo) {
    const updatedTodos = [...todos].map((todo) => { // Crea una nueva lista de tareas con el texto actualizado para la tarea proporcionada.
      if (todo.id === newtodo.id) { // Si el ID de la tarea coincide con el ID de la tarea proporcionada...
        todo.text = document.getElementById(newtodo.id).value; // Actualiza el texto de la tarea con el valor del campo de entrada de texto.
      }
      return todo; // Devuelve la tarea actualizada.
    });
    setTodos(updatedTodos); // Establece la lista de tareas actualizada con el texto de la tarea cambiado.
    setTodoEditing(null); // Sale del modo de edición estableciendo "todoEditing" como nulo.
  }
  
  // Renderiza la interfaz de usuario con el formulario de agregar tareas y la lista de tareas existentes.
  return (
    <div id="todo-list">
      <h1>Lista de Tareas</h1>
      <form onSubmit={handleSubmit}> {/* Formulario para agregar nuevas tareas */}
        <input
          type="text"
          id="todoAdd"
        />
        <button type="submit">Agregar Tarea</button>
      </form>
      {todos.map((todo) => ( // Itera sobre la lista de tareas y renderiza cada tarea junto con sus acciones (editar, eliminar).
        <div key={todo.id} className="todo">
          <div className="todo-text">
            {/* Checkbox para marcar la tarea como completada */}
            <input
              type="checkbox"
              id="completed"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            {/* Si la tarea está en modo de edición, muestra un campo de entrada de texto, de lo contrario, muestra el texto de la tarea */}
            {todo.id === todoEditing ?
              (<input
                type="text"
                id={todo.id}
                defaultValue={todo.text}
              />) :
              (<div>{todo.text}</div>)
            }
          </div>
          <div className="todo-actions">
            {/* Si la tarea está en modo de edición, permite enviar las ediciones, de lo contrario, permite editar la tarea */}
            {todo.id === todoEditing ?
              (
                <button onClick={() => submitEdits(todo)}>Enviar Ediciones</button>
              ) :
              (
                <button onClick={() => setTodoEditing(todo.id)}>Editar</button>
              )}

            <button onClick={() => deleteTodo(todo.id)}>Eliminar</button> {/* Botón para eliminar la tarea */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App; // Exporta el componente App como el componente predeterminado de este archivo.
