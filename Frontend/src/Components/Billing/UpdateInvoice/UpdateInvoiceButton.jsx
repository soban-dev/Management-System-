import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import CreateInvoice from "./UpdateInvoice";

const CreateInvoiceButton = () => {
  const [open, setOpen] = useState(false); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false); 
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
      }}
    >
      {/* Centered Button and Description */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            background: "linear-gradient(90deg, #1E90FF, #007BFF)",
            color: "#FFF",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "10px",
            padding: "10px 20px",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #007BFF, #0056B3)",
            },
          }}
        >
          Update Invoice
        </Button>

        {/* Description Text */}
        <Typography
          variant="body2"
          sx={{
            color: "#AAA",
            marginTop: 2,
            fontSize: "14px",
          }}
        >
          Click above to update an old invoice.
        </Typography>
      </Box>

      {/* Modal containing the CreateInvoice component */}
      <Modal
         open={open}
         onClose={handleClose}
         disableAutoFocus
         disableEnforceFocus
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
 sx={{
  width: "100%",
  maxWidth: 1000,
  borderRadius: "10px", 
  padding: { xs: 0, md: 0 }, 
  height: { xs: "auto", sm: "90vh", md: "auto" }, 
}}
>
  <CreateInvoice onClose={handleClose} />
</Box>

      </Modal>
    </Box>
  );
};

export default CreateInvoiceButton;
