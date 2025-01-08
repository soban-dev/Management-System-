import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Card, Typography, LinearProgress } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BASE_URL } from "../../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const token = localStorage.getItem("token");
export default function ItemMatrics() {
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
        // console.log("Backend Response:", response.data);
        setCardData({
          ItemsQuantity: response.data.ItemsQuantity,
          ItemsinStock: response.data.ItemsinStock,
          inHighStock: response.data.inHighStock,
          inLowStock: response.data.inLowStock,
          TotalPurchaseonItems: response.data.TotalPurchaseonItems,
          totalRevenuePotential: response.data.totalRevenuePotential,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid item xs={12} md={8}>
      <Card
        sx={{
          backgroundColor: "rgb(30, 39, 60)",
          color: "#FFF",
          padding: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h5"
          mb={3}
          sx={{
            fontWeight: "bold",
            color: "#90CAF9",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Item Metrics
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#4CAF50",
            fontSize: "1rem",
            fontWeight: 500,
            marginBottom: 3,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <span style={{ fontWeight: "bold" }}>Total Item details</span> of this
          Month.
        </Typography>
        <Box>
          {[
            {
              name: "Total Quantity",
              budget: `${cardData.ItemsQuantity}` || "0",
              completion: 100,
            },
            {
              name: "Items In Stock",
              budget: cardData.ItemsinStock || "0",
              completion: 100,
            },
            {
              name: "Total High Quantity",
              budget: cardData.inHighStock || "0",
              completion: (cardData.inHighStock / cardData.ItemsinStock) * 100,
            },
            {
              name: "Total Low Quantity",
              budget: cardData.inLowStock || "0",
              completion:
                (cardData.inLowStock / cardData.ItemsQuantity) * 100 || 0,
            },
            {
              name: "Total Purchase of Items",
              budget: cardData.TotalPurchaseonItems || "0",
              completion: 40,
            },
            {
              name: "Total Revenue Potential",
              budget: cardData.totalRevenuePotential || "0",
              completion: 40,
            },
          ].map((project, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: "#E3F2FD",
                  marginBottom: { xs: 1, sm: 0 },
                }}
              >
                {project.name}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "right",
                  paddingRight: { xs: 0, sm: "80px" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 400,
                    fontSize: "0.9rem",
                    color: "#B3E5FC",
                  }}
                >
                  {project.budget}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", sm: "35%" },
                  ml: { xs: 0, sm: 2 },
                  marginTop: { xs: 1, sm: 0 },
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={project.completion}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        project.completion === 100 ? "#66BB6A" : "#42A5F5",
                    },
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Grid>
  );
}
