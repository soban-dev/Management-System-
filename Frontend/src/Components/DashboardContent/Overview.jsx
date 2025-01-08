import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
} from "@mui/material";
import { BASE_URL } from "../../config";
import axios from "axios";

const token = localStorage.getItem("token");
export default function Overview() {
  const [cardData, setCardData] = useState({
    totalProfit: null,
    itemSold: null,
    numberOfProducts: null,
    totalStock: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCardData({
          totalProfit: response.data.totalProfit,
          totalsale: response.data.totalSales,
          lowstock: response.data.inLowStock,
          totalitem: response.data.ItemsinStock,
          totalRevenuePotential: response.data.totalRevenuePotential,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // console.log(cardData);

  return (
    <Grid item xs={12} md={4}>
      <Card
        sx={{
          backgroundColor: "rgb(32 41 64)",
          color: "#FFF",
          padding: 2,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" mb={2} sx={{ color: "#90CAF9" }}>
          Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "#4CAF50" }} mb={2}>
          100% of this month
        </Typography>
        <List>
          {[
            {
              title: `Rs: ${cardData.totalProfit ?? 0}, Total Profit`,
              color: "#4CAF50",
            },
            {
              title: `Rs: ${cardData.totalsale ?? 0}, Total Sales`,
              color: "#E91E63",
            },
            {
              title: `+${cardData.lowstock ?? 0}, Low Stock`,
              color: "#36A2EB",
            },
            {
              title: `Rs: ${cardData.totalitem ?? 0}, Total Investment`,
              color: "#FF9800",
            },
            {
              title: `+${cardData.totalitem ?? 0}, Total Items`,
              color: "#9C27B0",
            },
          ].map((order, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Box
                  sx={{
                    backgroundColor: order.color,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  }}
                />
              </ListItemAvatar>
              <ListItemText primary={order.title} />
            </ListItem>
          ))}
        </List>
      </Card>
    </Grid>
  );
}
