import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useTheme } from "@mui/material/styles";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxWidth: "100%",
  overflowX: "auto",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  borderRadius: "16px",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.07)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
}));

const StyledTableHead = styled(TableRow)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.15)",
}));

const HighStockProduct = (data) => {
  const theme = useTheme();
  const [cardData, setCardData] = useState({ result: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch and validation
    setLoading(true); // Show loader while processing
    if (data?.data?.available && Array.isArray(data.data.available)) {
      setTimeout(() => {
        setCardData({
          result: data.data.available, // Use available products
        });
        setLoading(false); // Data successfully processed
      }, 1000); // Simulated delay for loading
    } else {
      console.error("Invalid data format or missing:", data);
      setCardData({ result: [] }); // Set empty result on error
      setLoading(false); // Stop loader even if data is invalid
    }
  }, [data]);


  const rows = [];
  if (cardData.result.length > 0) {
    for (const item of cardData.result) {
      rows.push({
        product: item.name || "N/A",
        available_quantity: item.quantity || 0,
        required_quantity: item.required_quantity || 0,
      });
    }
  }

  const icons = {
    0: <ShoppingCartIcon sx={{ color: "#00bcd4" }} />,
    1: <MonetizationOnIcon sx={{ color: "#ffc107" }} />,
    2: <StorefrontIcon sx={{ color: "#9c27b0" }} />,
    3: <ShoppingCartIcon sx={{ color: "#3f51b5" }} />,
    4: <StorefrontIcon sx={{ color: "#f44336" }} />,
  };

  return (
    <Box
      sx={{
        padding: "40px",
        background: "rgb(32 41 64)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: "40px",
        borderRadius: "22px",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h4"
          align="center"
          color="#ffffff"
          gutterBottom
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          High Stock Products
        </Typography>

        {/* Show loader while data is being fetched */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : (
          <StyledTableContainer>
            <Table>
              <TableHead>
                <StyledTableHead>
                  <TableCell
                    sx={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                  >
                    Available Quantity
                  </TableCell>
                  <TableCell
                    sx={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                  >
                    Required Quantity
                  </TableCell>
                </StyledTableHead>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {icons[index % 5] || null}
                        <Typography
                          variant="body1"
                          sx={{
                            marginLeft: 2,
                            color: "#ffffff",
                            fontWeight: 500,
                          }}
                        >
                          {row.product}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>
                      {row.available_quantity}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>
                      {row.required_quantity}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </Box>
    </Box>
  );
};

export default HighStockProduct;
