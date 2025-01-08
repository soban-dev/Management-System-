import React, { useEffect, useState } from "react";
import { Box, Grid, Card, Typography } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../config";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import { TrendingDown } from "@mui/icons-material";

export default function Top2ndCards({ datevalue, datevalue2 }) {
  const [cardData, setCardData] = useState({
    Sales: null,
    Profit: null,
    Revenue: null,
    ItemSold: null,
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
          console.log("Fetching data...");  
          const response = await axios.get(
            `${BASE_URL}/admin/stockinfos`
          );
          setCardData({
            Sales: response.data.data?.totalstock || 0,
            Profit: response.data.data?.highstock || 0,
            Revenue: response.data.data?.lowstock || 0,
            ItemSold: response.data.data?.totalsoldstock || 0,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      
    };

    fetchData();
  }, [datevalue, datevalue2]);

  const defaultCards = [
    {
      title: "Total Stock",
      value: `+${cardData.Sales}` || "+11",
      description: `Total Stocks Available.`,
      color: "#1E90FF",
      icon: <InventoryIcon sx={{ color: "#FFF", fontSize: 30 }} />,
    },
    {
      title: "High Stock",
      value: `+${cardData.Profit}` || "+4",
      description: `Total Number of High Stocks.`,
      color: "#4CAF50",
      icon: <TrendingUpIcon sx={{ color: "#FFF", fontSize: 30 }} />,
    },
    {
      title: "Low Stock",
      value: `+${cardData.Revenue}` || "+0",
      description: `Total Number of Low Stocks.`,
      color: "#E91E63",
      icon: <TrendingDown sx={{ color: "#FFF", fontSize: 30 }} />,
    },
    {
      title: "Total Sold Stocks",
      value: `+${cardData.ItemSold}` || "+0",
      description: `Total Number of Sold Stocks`,
      color: "#E91E63",
      icon: <AttachMoneyIcon sx={{ color: "#FFF", fontSize: 30 }} />,
    },
  ];

  return (
    <Grid container spacing={3} mb={4}>
      {defaultCards.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              backgroundColor: "rgb(32 41 64)",
              color: "#FFF",
              padding: 2,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h6" sx={{ fontSize: "13px" }}>
                  {item.title}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "11px", color: "#4CAF50" }}>
                  {item.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: item.color,
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
