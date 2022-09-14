import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import Todo from "./Todo";
import Typography from "@mui/material/Typography";
import { nanoid } from "nanoid";
import { Button } from "@mui/material";
interface Todos {
id:string,
task:string,
done:boolean
}

function ToDoList() {
  const [textErr, setTextErr] = useState(false);
  const [todos, setTodos] = useState<Todos[]>(JSON.parse(window.localStorage.getItem("todos")!)||[]);
  const [todo, setTodo] = useState({ task: "" });
  const [snack, setSnack] = useState({ show: false, msg: "" });

 useEffect(() => {
  window.localStorage.setItem("todos", JSON.stringify(todos));
 }, [todos]);
 
  const addTodo = (e:React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (todo.task.length >= 4) {
      setTextErr(false);
      setTodos([{ ...todo, id: nanoid(), done:false }, ...todos]);
      setTodo({ task: "" });
      setSnack({ ...snack, show: true, msg: "Task added" });
      
    } else {
      setTextErr(true);
    }
  };
  const removeTodo = (id:string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setSnack({ ...snack, show: true, msg: "Task deleted" });
  };
  const handleChange = (e:React.BaseSyntheticEvent) => {
    setTodo({ ...todo, task: e.target.value, });
  };
  const editTask = (id:string, editTask:string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          return { ...t, task: editTask };
        }
        setSnack({ ...snack, show: true, msg: "Task updated" });
        return t;
      })
    );
  };
  const handleCheck = (id:string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          return { ...t, done: !t.done };
        }
        return t;
      })
    );
  };
  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop: "1rem",
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={addTodo}
      >
        <Typography variant="h5">What do you want to do?</Typography>
        <Button onClick={()=>window.localStorage.clear()}>Delete all</Button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            error={textErr}
            id="outlined-error-helper-text"
            label="New task"
            placeholder="New task"
            value={todo.task}
            onChange={handleChange}
            helperText={textErr && "4 characters minimum"}
            sx={{ backgroundColor: "white" }}
          />
          {todo.task.length >= 4 && (
            <IconButton
              aria-label="add task"
              size="large"
              sx={{ "&:hover": { color: "success.main" } }}
              onClick={addTodo}
            >
              <CheckIcon fontSize="inherit" />
            </IconButton>
          )}
        </div>
      </Box>

      <div className="todolist">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            id={todo.id}
            done={todo.done}
            task={todo.task}
            toggleDone={handleCheck}
            remove={removeTodo}
            edit={editTask}
          />
        ))}
      </div>

      <Snackbar
        open={snack.show}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, show: false })}
        message={snack.msg}
      />
    </>
  );
}

export default ToDoList;
