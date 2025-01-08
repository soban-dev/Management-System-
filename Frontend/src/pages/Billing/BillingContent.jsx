import React from "react";
import { Box } from "@mui/material";
import CreateInvoiceButton from "../../Components/Billing/CreatInvoice/CreateInvoiceButton"; 
import UpdateInvoiceButton from "../../Components/Billing/UpdateInvoice/UpdateInvoiceButton"; 
import Invoices from "../../Components/Billing/Invoices/Invoices"; 
import UpdateItemButton from "../../Components/Billing/UpdateItem/UpdateItemButton";

export default function BillingContent() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap", 
        justifyContent: { xs: "center", md: "space-between" }, 
        alignItems: "flex-start",
        gap: 3,
        padding: 2,
      }}
    >
      {/* Left Column: Buttons */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { xs: "100%", sm: "540px" }, 
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            padding: 1.5,
            backgroundColor: "rgb(32 41 64)",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "180px",
            width: "100%", 
          }}
        >
          <CreateInvoiceButton />
        </Box>
        <Box
          sx={{
            padding: 1.5,
            backgroundColor: "rgb(32 41 64)",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "180px",
            width: "100%", 
          }}
        >
          <UpdateInvoiceButton />
        </Box>
        <Box
          sx={{
            padding: 1.5,
            backgroundColor: "rgb(32 41 64)",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "180px",
            width: "100%", 
          }}
        >
          <UpdateItemButton />
        </Box>
      </Box>

      {/* Right Column: Invoices */}
      <Box
        sx={{
          flex: 2,
          width: { xs: "100%", sm: "calc(100% - 560px)" }, 
          maxWidth: "100%",
          marginTop: { xs: 0, md: 0 }, 
        }}
      >
        <Invoices />
      </Box>
    </Box>
  );
}
