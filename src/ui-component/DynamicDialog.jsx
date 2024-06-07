import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";

const DynamicDialog = ({
  open,
  isShowCloseBtn,
  onClose,
  title,
  size,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={size}>
      <Box
        fullWidth
        display={{ xs: "column", md: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        mx={2}
      >
        {isShowCloseBtn && (
          <>
            <DialogTitle fontSize={20}>{title}</DialogTitle>
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </>
        )}
      </Box>
      <DialogContent dividers={isShowCloseBtn}>{children}</DialogContent>
    </Dialog>
  );
};

export default DynamicDialog;
