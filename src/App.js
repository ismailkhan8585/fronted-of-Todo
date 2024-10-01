import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './redux/todoSlice';
import Todo from './components/Todo';

const App = () => {
  const [text, setText] = useState('');          
  const [isUpdating, setUpdating] = useState(false); 
  const [todoId, setTodoID] = useState('');         

  const { todos, loading, error } = useSelector((state) => state.todos); 
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  
  const updatedMode = (_id, text) => {
    setUpdating(true);
    setText(text);   
    setTodoID(_id);
  };

  
  const handleAddOrUpdate = () => {
    if (isUpdating) {
      dispatch(updateTodo({ id: todoId, text })).then(() => {
        setUpdating(false);  
        dispatch(fetchTodos()); 
      });
    } else {
      dispatch(addTodo(text)).then(() => {
        dispatch(fetchTodos()); 
      });
    }
    setText(''); 
  };

  
  const handleDelete = (id) => {
    dispatch(deleteTodo(id)).then(() => {
      dispatch(fetchTodos()); 
    });
  };

 
  if (loading) return <div><h1>loading.........</h1></div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <div className="container">
        <h1>Todo App</h1>
        <div className="top">
          <input
            type="text"
            placeholder="Add Todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="Add" onClick={handleAddOrUpdate}>
            {isUpdating ? 'Update' : 'Add'}
          </div>
        </div>

       
        <div className="list">
          {todos.map((item) => (
            <Todo
              key={item._id}
              text={item.text}
              updatedMode={() => updatedMode(item._id, item.text)}
              deleteMode={() => handleDelete(item._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
