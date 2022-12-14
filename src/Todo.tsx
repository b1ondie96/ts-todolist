import React, { useState, useRef, useContext } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import Badge from "@mui/material/Badge";
import { motion } from "framer-motion";
import { UserContext } from "./App";
import Moment from "moment";
interface Props {
  id: string;
  done: boolean | undefined;
  task: string | undefined;
  toggleDone: (id: string) => void;
  remove: (id: string) => void;
  edit: (id?: string, editTask?: string) => void;
  index: number;
  timestamp: number;
  completed: number;
}

const Todo: React.FC<Props> = ({
  id,
  done,
  task,
  toggleDone,
  remove,
  edit,
  timestamp,
  completed,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editTask, setEditTask] = useState(task);
  const [textErr, setTextErr] = useState(false);
  const changeRef = useRef(null);
  const user = useContext(UserContext);
  const formatedTime = Moment(timestamp).format("DD-MM-YYYY, HH:mm");
  const formatedComplete = Moment(completed).format("DD-MM-YYYY, HH:mm");

  const handleEdit = () => {
    if (editTask!.length >= 4) {
      setIsEdit(!isEdit);
      edit(id, editTask);
      setTextErr(false);
    } else {
      setTextErr(true);
    }
  };
  const handleChange = (e: React.BaseSyntheticEvent) => {
    setEditTask(e.target.value);
  };
  const markDone = () => {
    toggleDone(id);
  };
  const itemAnimation = {
    hidden: { x: -2000, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6,
        type: "easeOut",
      },
    },
  };

  return (
    <>
      <motion.div
        variants={itemAnimation}
        initial="hidden"
        animate="animate"
        exit="exit"
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            alignItems: "center",
            "& > :not(style)": {
              m: 1,
              minWidth: 300,
              height: 80,
            },
          }}
        >
          <Badge
            color="primary"
            badgeContent={done ? "Done!" : 0}
            sx={{ flexDirection: "column" }}
          >
            <Paper
              elevation={4}
              style={{
                display: "flex",
                
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem",
              }}
            >
              {!done && !isEdit && (
                <Checkbox
                  checked={done}
                  onChange={() => markDone()}
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                />
              )}
              {isEdit ? (
                <>
                  <Box
                    component="form"
                    sx={{ display: "flex", alignItems: "center" }}
                    onSubmit={() => handleEdit()}
                  >
                    <TextField
                      label="Edit task"
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      value={editTask}
                      error={textErr}
                      id="outlined-error-helper-text"
                      autoFocus
                      onFocus={(e) => e.currentTarget.select()}
                      helperText={textErr && "4 characters minimum"}
                      ref={changeRef}
                    />
                    <IconButton
                      aria-label="done"
                      onClick={() => handleEdit()}
                      type="submit"
                      sx={{ "&:hover": { color: "success.main" } }}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Typography
                  sx={{ fontWeight: done ? "300" : "550" }}
                  variant="subtitle1"
                >
                  {task}
                </Typography>
              )}
              <div>
                {!isEdit && !done && (
                  <IconButton
                    aria-label="edit"
                    onClick={() => setIsEdit(true)}
                    sx={{ "&:hover": { color: "primary.main" } }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
                  aria-label="delete"
                  sx={{ "&:hover": { color: "error.main" } }}
                  onClick={() => remove(id!)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <Typography variant="subtitle2" fontSize={10} style={{position:'absolute',bottom:0,right:0, margin:'2px'}}>
                Added at {formatedTime}
              </Typography>
              <Typography variant="subtitle2" fontSize={10} style={{position:'absolute',bottom:0,left:0, margin:'2px'}}>
               {completed&& `Completed at ${formatedComplete}`}
              </Typography>
            </Paper>
          </Badge>
        </Box>
      </motion.div>
    </>
  );
};

export default Todo;
