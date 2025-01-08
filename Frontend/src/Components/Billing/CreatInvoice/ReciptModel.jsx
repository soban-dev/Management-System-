import React, { useState } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Modal,
  TextField,
  Button,
  Stack,
  CircularProgress, // Imported CircularProgress for the loader
} from "@mui/material";
import axios from "axios";
import backgroundImage from "../../../assets/background.jpg";
import { BASE_URL } from "../../../config";

const ReceiptModal = ({
  open,
  onClose,
  discount,
  inventory = [],
  setInvoiceItems, 
  clientName,
  setClientName,
  setOpenReceiptModal,
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const token = localStorage.getItem("token");
  console.log(token);
  const calculateTotalAmount = () => {
    return inventory.reduce((total, row) => total + row.totalAmount, 0);
  };
  const calculateTotalAmountWithDiscount = () => {
    const total = inventory.reduce((total, row) => total + row.totalAmount, 0);
    const discountedTotal = total - (total * discount) / 100;
    return discountedTotal.toFixed(2);
  };

  //   if (!clientName) {
  //     setMessage("Please fill in the 'Client Name' field.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/inventory/invoice`,
  //       {
  //         percentdiscount: discount,
  //         customername: clientName,
  //         items: inventory,
  //         total: calculateTotalAmount(),
  //         // Removed Authorization from the body
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Added Authorization to headers
  //           'Content-Type': 'application/json', // Ensure the content type is set
  //         },
  //         // Optionally, include withCredentials if your backend expects cookies
  //         withCredentials: true,
  //       }
  //     );
  //     // console.log("Backend Response:", response.data);
  //     setMessage("Receipt generated successfully!");
  //   } catch (error) {
  //     console.error("Error generating receipt:", error);
  //     if (error.response && error.response.data && error.response.data.message) {
  //       setMessage(error.response.data.message);
  //     } else {
  //       setMessage("Failed to generate receipt. Please try again.");
  //     }
  //   }
  // };

  // for download Pdf
  const handleGenerateReceipt = async () => {
    if (!clientName) {
     clientName= "without name";
    }
    setIsLoading(true); 
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/invoice`,
        {
          percentdiscount: discount,
          customername: clientName,
          items: inventory,
          total: calculateTotalAmount(),
        },
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const pdfWindow = window.open(pdfUrl, "_blank");
        if (pdfWindow) {
          pdfWindow.addEventListener("load", () => {
            pdfWindow.print();
          });
        } else {
          console.error("Failed to open PDF in a new tab.");
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = `invoice_${Date.now()}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
        setMessage("Receipt generated successfully!");
        onClose();
        setInvoiceItems([]);
        setTimeout(() => {
          onClose();
          setInvoiceItems([]);
          setClientName("");
          setMessage("");
          setIsLoading(false); // Stop loading after reset
        }, 2000);
      } else {
        setMessage("Failed to generate receipt. Please try again.");
        setIsLoading(false); // Stop loading on failure
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      setMessage("Failed to generate receipt. Please try again.");
      setIsLoading(false); // Stop loading on error
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="receipt-modal-title"
      aria-describedby="receipt-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "90%", md: "500px" },
          marginTop: { md: "40px" },
          maxHeight: "90vh",
          bgcolor: "#424242",
          boxShadow: 24,
          p: { xs: 2, md: 4 },
          overflowY: "auto",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "2px solid #ffffff44",
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h6"
          id="receipt-modal-title"
          mb={2}
          sx={{ color: "white" }}
        >
          Generate Receipt
        </Typography>

        {/* Customer Name Field */}
        <TextField
          fullWidth
          label="Customer Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
        />

        {/* Receipt Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            mb: 2,
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Item</TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "white" }}>{row.name}</TableCell>
                    <TableCell align="right" sx={{ color: "white" }}>
                      ${row.price}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white" }}>
                      {row.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white" }}>
                      ${row.totalAmount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "white" }}>
                    No items available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total Amount */}
        <Typography variant="h6" align="right" sx={{ mb: 2, color: "white" }}>
          Total: Rs {calculateTotalAmount()}
        </Typography>
        <Typography variant="h6" align="right" sx={{ mb: 2, color: "white" }}>
          Total After Discount: Rs {calculateTotalAmountWithDiscount()}
        </Typography>

        {/* Error/Success Message */}
        {message && (
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              textAlign: "left",
              color: message.includes("successfully") ? "green" : "red",
            }}
          >
            {message}
          </Typography>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="contained" color="error" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReceipt}
            disabled={isLoading} // Disable button when loading
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />} // Show loader
          >
            {isLoading ? "Generating..." : "Confirm"} {/* Change text when loading */}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReceiptModal;
