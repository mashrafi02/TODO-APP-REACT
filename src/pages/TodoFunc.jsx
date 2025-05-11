import { useReducer,useState,useEffect,useRef } from "react";
import {v4 as uuidv4} from 'uuid'
import Todo from "../components/Todo";
import '../css/todo.css'

export const ACTION = {
    ADD : "add-task",
    TOGGLE: "toggle",
    UPDATE: "update",
    EDIT: "edit",
    REMOVE: "remove"
};

function reducer(todoobj, action){

    switch (action.type){
        case ACTION.ADD:
            return {
                ...todoobj,
                todos:[...todoobj.todos, newTaskObject(action.payload.task)]
            }

        case ACTION.TOGGLE:
            return {
                ...todoobj,
                todos: todoobj.todos.map(todo => {
                    if(todo.id === action.payload.id){
                        return {...todo, complete: !todo.complete}
                    }
                    return todo
                })
            }

        case ACTION.EDIT:
            return {...todoobj, editId: action.payload.id};

        case ACTION.UPDATE:
            return {
                ...todoobj,
                todos: todoobj.todos.map(todo => 
                    todo.id === todoobj.editId 
                        ? {...todo, task: action.payload.task}
                        : todo
                ),
                editId: null
            }

        case ACTION.REMOVE:
            return {
                ...todoobj,
                todos: todoobj.todos.filter(todo => {
                    return todo.id !== action.payload.id
                })
            }

        default:
            return todoobj
    }    
};

function newTaskObject(newTask){
    return {id: uuidv4(), task:newTask, complete:false}
}

const TodoFunc = () => {

    function getTodos(){
        // this function checks if any todos are stored in local storage

        const ITEM = localStorage.getItem('ITEM');
        if(ITEM === null) return [];
        try{
            return JSON.parse(ITEM)
        }catch(e){
            console.error('cannot parse json', e);
            return []
        }
    }

    const inputField = useRef();
    const [newtask, setNewTask] = useState("");
    const [todoobj, dispatch] = useReducer(reducer,{
        todos:getTodos(), 
        editId:null
    });

    // storing current todos in local storage
    useEffect(() => {
        localStorage.setItem('ITEM', JSON.stringify(todoobj.todos))
    },[todoobj.todos])

    // this useEffect makes sure to make the inut field focused after pressing the edit button
    useEffect(() => {
        if (todoobj.editId !== null) {
          inputField.current.focus();
        }
      }, [todoobj.editId]);

    function handleSubmit(){
        if(newtask.trim() == ""){
            alert('Please enter a task first!')
            return
        }
        dispatch({type:ACTION.ADD, payload:{task:newtask}});
        setNewTask("")
    }

    function handleUpdate(){
        if(newtask.trim() == ""){
            alert('task cannot be edited as empty value!!!')
            return
        }
        dispatch({type: ACTION.UPDATE, payload: {task: newtask}});
        setNewTask("");
    }

    return (
        <div className="container">
            <h3>My TODOS</h3>
            <input type="text" 
            placeholder="Enter a task"
            ref={inputField}
            value={newtask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter'){
                    if(todoobj.editId !== null){
                        handleUpdate()
                    }
                    else{
                        handleSubmit()
                    }
                }
                }} />

            {
                todoobj.editId === null?<button className="add-btn" type="submit" onClick={handleSubmit}>ADD TASK</button>:
                <button className="update-btn" type="submit" onClick={handleUpdate}>Update</button>
            }

            {
                todoobj.todos? todoobj.todos.map(todo => {
                    return <Todo changeInput={setNewTask} key={todo.id} todoobj={todoobj} todo={todo} dispatch={dispatch}/>
                }): ""
            }
        </div>
    );
};

export default TodoFunc;