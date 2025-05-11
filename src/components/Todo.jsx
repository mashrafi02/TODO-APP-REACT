import { ACTION } from "../pages/TodoFunc";

const Todo = ({todo, todoobj, dispatch, changeInput}) => {
    return (
        <li className="todo-item">
            <div className="todo-content"
            style={{ 
                color: todo.complete ? 'gray' : 'black',
                textDecoration: todo.complete? 'line-through' : 'none' 
                }}>
                <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => {
                    dispatch({ type: ACTION.TOGGLE, payload: { id: todo.id } });
                }}
                />
                {todo.task}
            </div>
            <div className="todo-actions">
                <button
                className="edit-btn"
                disabled={todoobj.editId}
                onClick={() => {
                    changeInput(todo.task);
                    dispatch({ type: ACTION.EDIT, payload: { id: todo.id } });
                }}
                >
                EDIT
                </button>
                <button
                className="del-btn"
                disabled={todoobj.editId}
                onClick={() => {
                    dispatch({ type: ACTION.REMOVE, payload: { id: todo.id } });
                }}
                >
                DELETE
                </button>
            </div>
        </li>

    );
};

export default Todo;