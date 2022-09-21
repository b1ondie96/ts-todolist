import React, { FormEvent, useState } from "react";

import { Button, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from '@mui/material/Box';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {FcGoogle} from 'react-icons/fc';
import Alert from "@mui/material/Alert";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword,} from 'firebase/auth'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc
} from "firebase/firestore";
interface Props {
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const SignupForm:React.FC<Props> = ({setOpen}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw] = useState(false);
  const [showPwHelper, setShowPwHelper] = useState(false);
  const [showMailHelper, setShowMailHelper] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const isValidEmail = (email:string) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const registerWithEmailAndPassword = async (e:FormEvent<HTMLFormElement>, email:string, password:string) => {
    e.preventDefault();
    setShowAlert(false);
    setShowPwHelper(false);
    setShowMailHelper(false);
    if (!isValidEmail(email)) {
      return setShowMailHelper(true);
    } else if (password.length < 8) {
      setShowAlert(true);
      setAlertMsg("Password must be 8 or more characters long");
      setShowPwHelper(true);
      return;
    } else if(password!==passwordConfirm){
      setShowAlert(true)
      setAlertMsg('Passwords dont match')
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        
        authProvider: "local",
        email,
      }).then(()=>setOpen(false))
    } catch (err:any) {
      console.error(err);
      setShowAlert(true)
      setAlertMsg(err.message)
      
    }
  };
  return (
    <>
    <Box
         component="form"
         sx={{p:3,
           
           display:'flex',
           flexDirection:'column',
           alignItems:'center',
           '& > :not(style)': { m: 1,width: "clamp(60%,100%,350px)" },
         }}
         
         autoComplete="off"
         onSubmit={(e)=>registerWithEmailAndPassword(e,email,password)}
       >
      <Typography variant="h4" align="center">
        Register
      </Typography>
      {showAlert && (
          <Alert
            style={{ margin: "14px 8px", padding: "10px 16px" }}
            severity="error"
          >
            {alertMsg}
          </Alert>
        )}
      <TextField
        margin="normal"
        label="E-mail"
        variant="outlined"
        required
        autoFocus
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        helperText={showMailHelper ? "Please enter your email" : ""}
        FormHelperTextProps={{ error: true, sx: { fontSize: "1rem" } }}
      />
      <TextField
        margin="normal"
        label="Password"
        type={showPw ? "text" : "password"}
        variant="outlined"
        InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={() => setShowPw(!showPw)}
                aria-label="toggle password visibility"
                sx={{
                  ':hover':{cursor:'pointer'}
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
      <TextField
        margin="normal"
        label="Confirm password"
        type={showPw ? "text" : "password"}
        variant="outlined"
        InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={() => setShowPw(!showPw)}
                aria-label="toggle password visibility"
                sx={{
                  ':hover':{cursor:'pointer'}
                }}
              >
                {showPw ? <VisibilityOff /> : <Visibility />}
              </InputAdornment>
            ),
          }}
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
        required
        fullWidth
        
      />
      <Button
        variant="contained"
        fullWidth
        type='submit'
        size='large'
      >
        Register
      </Button>
     </Box>
    </>
  );
};

export default SignupForm;
