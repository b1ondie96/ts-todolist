import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog  from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import LoginForm from "./LoginForm";
import {Typography } from "@mui/material";
import SignupForm from "./SignupForm";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserModal: React.FC<Props> = ({ open, setOpen }) => {
  const [login, setLogin] = useState(true);
  const switchLogin = (b: boolean) => {
    setLogin(b);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={handleClose}>
        <DialogContent>
          {login ? (
            <>
              <LoginForm setOpen={setOpen}/>
              <Typography align="center">
                <Button variant="text" onClick={() => switchLogin(false)}>
                  Dont have an account?
                </Button>
              </Typography>
            </>
          ) : (<>
          <SignupForm setOpen={setOpen} />
          <Typography align="center">
          <Button variant="text" onClick={() => switchLogin(true)}>
                  Already have account?
                </Button></Typography>
          </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserModal;
