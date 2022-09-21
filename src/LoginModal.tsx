import React, { useState } from "react";
import LoginForm from "./LoginForm";
import ForgotPw from "./ForgotPw";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchLogin: (b:boolean)=>void
}
const LoginModal: React.FC<Props> = ({ setOpen, switchLogin }) => {
  const [forgotPw, setForgotPw] = useState(false);
  const [alertScs, setalertScs] = useState(false);
  return (
    <>
      {forgotPw ? (
        <ForgotPw setForgotPw={setForgotPw} setalertScs={setalertScs} />
      ) : (
        <>
          <LoginForm setOpen={setOpen} setForgotPw={setForgotPw} alertScs={alertScs}/>
          <Typography align="center">
            <Button variant="text" onClick={() => switchLogin(false)}>
              Dont have an account?
            </Button>
          </Typography>
        </>
      )}
    </>
  );
};

export default LoginModal;
