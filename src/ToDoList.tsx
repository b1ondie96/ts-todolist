import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import Todo from "./Todo";
import Typography from "@mui/material/Typography";
import { nanoid } from "nanoid";
import { Button } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { db } from "./firebase";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  query,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { UserContext } from "./App";

interface Todos {
  id: string;
  todo: string;
  done: boolean;
  timestamp:number
  completed:number
}
interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToDoList: React.FC<Props> = ({ setOpen }) => {
  const [textErr, setTextErr] = useState(false);
  const [todos, setTodos] = useState<Todos[]>([]);
  const [todo, setTodo] = useState({ task: "" });
  const [snack, setSnack] = useState({ show: false, msg: "" });
  const user = useContext(UserContext);
  
  
  const getTodos = () => { 
    const q = query(collection(db, "users", user!.uid, "tasks"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray: any[] = [];
      querySnapshot.forEach((doc) => {
        todosArray.unshift({ ...doc.data(), id: doc.id });
        setTodos(todosArray);
      });
    });
   }
  /* const getTodos = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", user!.uid, "tasks")
    );
    let todosArray: { id: string; done: boolean; todo: string }[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      todosArray.push({ ...doc.data(), id: doc.id });
      setTodos(todosArray);
    });
  }; */
  /* useEffect(() => {
    getTodos()
  },[user]); */
  const timestamp = Date.now()
  const addTodo = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (todo.task.length >= 4) {
      const docRef = await setDoc(doc(db, "users", user!.uid, 'tasks',timestamp.toString()), {
        todo: todo.task,
        done: false,
        timestamp:timestamp
      }).then(setTodo({ task: "" })!)
     
      setTextErr(false);

      setTodo({ task: "" });
      setSnack({ ...snack, show: true, msg: "Task added" });
    } else {
      setTextErr(true);
    }
  };
  const removeTodo = async (id: string) => {
    await deleteDoc(doc(db, "users", user!.uid, "tasks", id!));
    setSnack({ ...snack, show: true, msg: "Task deleted" });
  };
  const handleChange = (e: React.BaseSyntheticEvent) => {
    setTodo({ ...todo, task: e.target.value });
  };
  const editTask = async (
    id: string | undefined,
    editTask: string | undefined
  ) => {
    await setDoc(
      doc(db, "users", user!.uid, "tasks", id!),
      { todo: editTask },
      { merge: true }
    ).then(setSnack({show: true, msg: "Task updated" })!);
  };
  const handleCheck = async (id: string) => {
    await setDoc(
      doc(db, "users", user!.uid, "tasks", id),
      { done: true,completed:timestamp },
      { merge: true }
    ).then(setSnack({show: true, msg: "Task done!" })!);
  };

  return (
    <>
      <Button onClick={getTodos}>get it</Button>
      
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

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "25px" }}
          >
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
        <AnimatePresence initial={false}>
          {todos.map((todo, index) => (
            <Todo
              index={index}
              key={todo.id}
              id={todo.id}
              done={todo.done}
              task={todo.todo}
              timestamp={todo.timestamp}
              completed={todo.completed}
              toggleDone={handleCheck}
              remove={removeTodo}
              edit={editTask}
            />
          ))}
        </AnimatePresence>
      </div>

      <Snackbar
        open={snack.show}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, show: false })}
        message={snack.msg}
      />
    </>
  );
};

export default ToDoList;
