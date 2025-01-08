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

const ProgressBar = styled(Box)(({ progress }) => ({
  position: "relative",
  width: "100%",
  height: "8px",
  backgroundColor: "#444",
  borderRadius: "4px",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: `${progress}%`,
    height: "100%",
    backgroundColor:
      progress > 99 ? "#4caf50" : progress > 50 ? "#2196f3" : "#f44336",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  },
}));

const LowStockProduct = (data) => {
  const theme = useTheme();
  const [cardData, setCardData] = useState({ result: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (data?.data?.low && Array.isArray(data.data.low)) {
      setTimeout(() => {
        setCardData({
          result: data.data.low,
        });
        setLoading(false);
      }, 1000);
    } else {
      setCardData({ result: [] });
      setLoading(false);
    }
  }, [data]);

  const rows = [];
  if (cardData.result.length > 0) {
    for (const item of cardData.result) {
      rows.push({
        product: item.name || "N/A",
        available_quantity: item.quantity || "0",
        require_quantity: item.required_quantity,
      });
    }
  }

  const icons = {
    0: <ShoppingCartIcon sx={{ color: "#00bcd4" }} />,
    1: <MonetizationOnIcon sx={{ color: "#ffc107" }} />,
    2: <StorefrontIcon sx={{ color: "#9c27b0" }} />,
    3: <ShoppingCartIcon sx={{ color: "#3f51b5" }} />,
    4: <StorefrontIcon sx={{ color: "#f44336" }} />,
    "Gaming Console": <MonetizationOnIcon sx={{ color: "#4caf50" }} />,
  };

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "40px" },
        background: "rgb(32 41 64)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40px",
        borderRadius: "22px",
        flexDirection: "column",
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
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Low Stock Products
        </Typography>

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
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: { xs: "14px", sm: "16px" },
                    }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: { xs: "14px", sm: "16px" },
                    }}
                  >
                    Available Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: { xs: "14px", sm: "16px" },
                    }}
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
                            fontSize: { xs: "14px", sm: "16px" },
                          }}
                        >
                          {row.product}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#ffffff",
                        fontSize: { xs: "14px", sm: "16px" },
                      }}
                    >
                      {row.available_quantity}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#ffffff",
                        fontSize: { xs: "14px", sm: "16px" },
                      }}
                    >
                      {row.require_quantity}
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

export default LowStockProduct;
