import { useEffect, useRef, useState } from 'react';
import './CSS/Todo.css';
import TodoItem from './TodoItem';

const Todo = () => {
    const [todos, setTodos] = useState(() => {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
    });

    const [count, setCount] = useState(() => {
        const storedCount = localStorage.getItem('todos_count');
        return storedCount ? parseInt(storedCount, 10) : 0;
    });

    const [error, setError] = useState(''); // State for managing error messages
    const [currentPage, setCurrentPage] = useState(1); // State for current page

    const inputRef = useRef(null);
    const itemsPerPage = 5; // Number of items to show per page

    const add = () => {
        const inputValue = inputRef.current.value.trim(); // Get and trim the input value

        if (inputValue === '') { // Validate if the input is blank
            setError('Please enter a task'); // Set error message
            return;
        }

        const newTodo = {
            no: count,
            text: inputValue,
            display: '',
        };

        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        setCount(prevCount => prevCount + 1);
        inputRef.current.value = '';
        setError(''); // Clear error message
        setCurrentPage(Math.ceil((todos.length + 1) / itemsPerPage)); // Move to last page if a new item is added
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            add(); // Trigger add function when Enter key is pressed
        }
    };

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('todos_count', count);
    }, [count]);

    // Calculate the items to be displayed on the current page
    const indexOfLastTodo = currentPage * itemsPerPage;
    const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

    // Calculate total pages
    const totalPages = Math.ceil(todos.length / itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className='todo'>
            <div className="todo-header">To-Do List</div>
            <div className="todo-add">
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder='Add Your Task' 
                    className='todo-input' 
                    onKeyPress={handleKeyPress} // Add onKeyPress event listener
                />
                <div onClick={add} className="todo-add-btn">ADD</div>
            </div>
            {error && <div className="error-message">{error}</div>} {/* Display error message */}
            <div className="todo-list">
                {currentTodos.map((item, index) => (
                    <TodoItem
                        key={index}
                        setTodos={setTodos}
                        no={item.no}
                        display={item.display}
                        text={item.text}
                    />
                ))}
            </div>
            {totalPages > 1 && ( // Conditionally render pagination controls only if there are multiple pages
                <div className="pagination">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Todo;
