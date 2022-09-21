import React, {useState} from 'react'
import {
   
    sendPasswordResetEmail,
    
  } from "firebase/auth";
  import { auth } from './firebase';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Typography,Box } from '@mui/material'
interface Props {
    setForgotPw:React.Dispatch<React.SetStateAction<boolean>>;
    setalertScs:React.Dispatch<React.SetStateAction<boolean>>;
}
const ForgotPw:React.FC<Props> = ({setForgotPw,setalertScs}) => {
    const [email, setEmail] = useState('');
    const [showMailHelper, setShowMailHelper] = useState(false);
    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
      };
      const sendPasswordReset = async (email:string, e:React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
        e.preventDefault()
        setShowMailHelper(false)
        if(!isValidEmail(email)){
            setShowMailHelper(true)
        } else {
        try {
          await sendPasswordResetEmail(auth, email)
          .then(()=>setForgotPw(false)).then(()=>setalertScs(true))
        } catch (err:any) {
          console.error(err);
          alert(err.message);
        }}
      };
  return (
    <>
    <Typography variant='h4' align='center'>Forgot password</Typography>
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
      >
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
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => sendPasswordReset(email, e)}
          size="large"
          type="submit"
        >
          Reset password
        </Button></Box>
        </>)
}

export default ForgotPw