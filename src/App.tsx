import React, { useEffect, useState, createContext } from "react";
import Navbar from "./Navbar";
import ToDoList from "./ToDoList";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { User } from "firebase/auth";
import UserModal from "./UserModal";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
export const UserContext = createContext<User | null>(null);
function App() {
  document.title = "To do list";
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, []);
  return (
    <>
      <UserContext.Provider value={user}>
        <UserModal open={modalOpen} setOpen={setModalOpen} />
        <Navbar setOpen={setModalOpen} />
        {user ? (
          <ToDoList setOpen={setModalOpen} />
        ) : (
          <>
            <Typography variant="h4" align="center">
              Please{" "}
              <Button variant="contained" onClick={() => setModalOpen(true)}>
                Login
              </Button>{" "}
              to continue
            </Typography>
          </>
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
