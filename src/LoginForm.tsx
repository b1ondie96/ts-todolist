import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// @ts-ignore
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { auth,db } from "./firebase";

import { query, getDocs, collection, where, addDoc } from "firebase/firestore";


interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setForgotPw:React.Dispatch<React.SetStateAction<boolean>>;
  alertScs:boolean
}
const LoginForm: React.FC<Props> = ({ setOpen,setForgotPw,alertScs }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPwHelper, setShowPwHelper] = useState(false);
  const [showMailHelper, setShowMailHelper] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  
  

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async (email: string, password: string) => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        }).then(() => setOpen(false));
      }
    } catch (err: any) {
      switch (err.code) {
        case "auth/popup-closed-by-user":
          alert("Login with google cancelled");
      }
      console.error(err);
    }
  };

  const logInWithEmailAndPassword = async (
    e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
    email: string,
    password: string
  ) => {
    e.preventDefault();
    setShowAlert(false);
    setShowPwHelper(false);
    setShowMailHelper(false);
    if (!isValidEmail(email)) {
      return setShowMailHelper(true);
    } else if (password.length < 6) {
      setShowAlert(true);
      setAlertMsg("Wrong password");
      setShowPwHelper(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password).then(() =>
        setOpen(false)
      );
    } catch (err: any) {
      switch (err.code) {
        case "auth/wrong-password":
          setAlertMsg("Wrong password");
          setShowPwHelper(true);
          break;
        case "auth/too-many-requests":
          setAlertMsg("Too many login attempts, please try again later");
          break;
        case "auth/internal-error":
          setAlertMsg("Internal error");
          break;
        case "auth/user-not-found":
          setAlertMsg("Email doesn't exist");
      }

      console.error(err);
      setShowAlert(true);
    }
  };
  return (
    <>
      <Box
        component="form"
        sx={{
          p: 3,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > :not(style)": { m: 1, width: "clamp(60%,100%,350px)" },
        }}
        autoComplete="off"
      ><Typography variant="h4" align="center">
          Login
        </Typography>
      {showAlert && 
          <Alert
            style={{ margin: "14px 8px", padding: "10px 16px" }}
            severity="error"
          >
            {alertMsg}
          </Alert>}
          {alertScs&&<Alert
            style={{ margin: "14px 8px", padding: "10px 16px" }}
            severity="success"
          >
            Email with reset link sent!
          </Alert>}
        

        <TextField
          margin="normal"
          label="E-mail"
          variant="outlined"
          required
          autoFocus
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          helperText={showMailHelper ? "Please enter your email" : " "}
          FormHelperTextProps={{ error: true, sx: { fontSize: "1rem" } }}
        />
        <TextField
          margin="normal"
          label="Password"
          type={showPw ? "text" : "password"}
          variant="outlined"
          helperText={
            showPwHelper ? <Button variant='text' onClick={()=>setForgotPw(true)}>Forgot password?</Button> : " "
          }
          FormHelperTextProps={{
            sx: { fontSize: "0.9rem", fontWeight: "500" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={() => setShowPw(!showPw)}
                aria-label="toggle password visibility"
                sx={{
                  ":hover": { cursor: "pointer" },
                }}
              >
                {showPw ? <VisibilityOff /> : <Visibility />}
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          fullWidth
        />

        <Button
          variant="contained"
          fullWidth
          onClick={(e) => logInWithEmailAndPassword(e, email, password)}
          size="large"
          type="submit"
        >
          Login
        </Button>
        <Divider>
          <Typography variant="subtitle1" style={{ userSelect: "none" }}>
            OR
          </Typography>
        </Divider>
        <Button
          variant="contained"
          fullWidth
          onClick={() => signInWithGoogle(email, password)}
          startIcon={<FcGoogle />}
          color="secondary"
          size="large"
        >
          Login with Google
        </Button>
       
       
      </Box>
    </>
  );
};

export default LoginForm;
