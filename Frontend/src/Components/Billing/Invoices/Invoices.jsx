import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { BASE_URL } from "../../../config";

function Invoices() {
  const [invoiceData, setInvoiceData] = useState({});
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/inventory/fiveinvoice`, {
          withCredentials: true,
        });
        const data = response.data;
        setInvoiceData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const invoices =
    invoiceData?.receipts?.map((item) => ({
      date: item.createdAt,
      id: item._id,
      amount: item.total,
    })) || [];

  const viewAll = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/inventory/allinvoice`, {
        withCredentials: true,
      });
      setInvoiceData({
        receipts: response.data.formattedReceipts || [],
      });
      setShowAllInvoices(!showAllInvoices);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoicePDF = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/inventory/invoice/${id}`, {
        responseType: "blob",
        withCredentials: true,
      });
      // console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };
  const displayedInvoices = showAllInvoices ? invoices : invoices.slice(0, 5);

  return (
    <Box
      sx={{
        backgroundColor: "rgb(32 41 64)",
        borderRadius: "10px",
        padding: 3,
        color: "#FFF",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        width: "100%",
        margin: "auto",
        height: { xs: "auto", sm: "573px" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Section: Invoices Heading and Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          flexDirection: { xs: "column", sm: "row" },
          textAlign: "center",
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            marginBottom: { xs: 1, sm: 0 },
          }}
        >
          Invoices
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: "#1E90FF",
            borderColor: "#1E90FF",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(30, 144, 255, 0.1)",
              borderColor: "#1E90FF",
            },
          }}
          onClick={viewAll}
        >
          {showAllInvoices ? "Show Less" : "View All"}
        </Button>
      </Box>

      {/* Content Section */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress sx={{ color: "#1E90FF" }} />
        </Box>
      ) : invoices.length === 0 ? (
        <Typography
          sx={{
            color: "gray",
            textAlign: "center",
            marginTop: "20px",
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          No invoices available
        </Typography>
      ) : (
        <List
          sx={{
            maxHeight: "440px",
            overflowY: "auto",
            marginTop: { xs: 2, sm: 0 },
            gap: 1,
          }}
        >
          {displayedInvoices.map((invoice, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                padding: "12px 0",
                gap: { xs: 1, sm: 2 },
                borderBottom:
                  index !== displayedInvoices.length - 1
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
              }}
            >
              {/* Date and ID */}
              <Box
                sx={{
                  textAlign: { xs: "center", sm: "left" },
                  width: "100%",
                  marginBottom: { xs: 1, sm: 0 },
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                >
                  {invoice.date}
                </Typography>
                <Typography
                  variant="body2"
                  color="gray"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    marginTop: "4px",
                  }}
                >
                  {invoice.id}
                </Typography>
              </Box>

              {/* Amount and Button */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  gap: 1,
                  width: "100%",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    textAlign: "center",
                  }}
                >
                  Rs: {invoice.amount}
                </Typography>
                <Button
                  startIcon={<PictureAsPdfIcon />}
                  sx={{
                    color: "#1E90FF",
                    fontWeight: "bold",
                    fontSize: { xs: "12px", sm: "14px" },
                    textTransform: "none",
                    padding: "4px 8px",
                    minWidth: "auto",
                  }}
                  onClick={() => downloadInvoicePDF(invoice.id)}
                >
                  PDF
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default Invoices;
