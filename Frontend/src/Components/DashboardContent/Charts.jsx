import React, { useEffect, useState } from "react";
import { Grid, Card, Typography } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
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
import axios from "axios";
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

export default function Charts() {
  const [cardData, setCardData] = useState({
    sales: [],
    revenue: [],
    itemsSold: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log("Backend Response:", response.data);
        if (response.data?.sevendaysStats?.length > 0) {
          const array = response.data.sevendaysStats;
            // console.log(array);
          const salesData = array.map(item => item.perdaySales || 0);
          const revenueData = array.map(item => item.perdayRevenue || 0);
          const itemsSoldData = array.map(item => item.perdaySaleAmount || 0);
        //  console.log(salesData);
        console.log(salesData);

          setCardData({
            sales: salesData,
            revenue: revenueData,
            itemsSold: itemsSoldData,
          });}
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); 
  }, []);
  const barChartData = {
    labels: ["6 Days Ago", "5", "4", "3", "2", "1", "Today"],
    datasets: [
      {
        label: "Sales",
        data: cardData.sales.length > 0 ? cardData.sales : 0,
        backgroundColor: "#36A2EB",
        borderRadius: 4,
      },
    ],
  };

  const lineChartData1 = {
    labels: ["6 Days Ago", "5", "4", "3", "2", "1", "Today"],
    datasets: [
      {
        label: "Items Sold",
        data: cardData.itemsSold.length > 0 ? cardData.itemsSold : [100, 200, 150, 300, 250, 400, 450],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const lineChartData2 = {
    labels: ["6 Days Ago", "5", "4", "3", "2", "1", "Today"],
    datasets: [
      {
        label: "Revenue",
        data: cardData.revenue.length > 0 ? cardData.revenue : [150, 300, 200, 350, 450, 400, 550],
        borderColor: "#9C27B0",
        backgroundColor: "rgba(156, 39, 176, 0.2)",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      {/* Bar Chart */}
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
          <Typography variant="h6" mb={2}>
            Daily Sales
          </Typography>
          <Typography variant="body2" sx={{ color: "#AAA" }} mb={2}>
            Last day Performance
          </Typography>
          <Bar data={barChartData} />
          <Typography variant="body2" mt={2} sx={{ color: "#AAA" }}>
          Just updated
          </Typography>
        </Card>
      </Grid>

      {/* Line Chart 1 */}
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
          <Typography variant="h6" mb={2}>
            Daily Item Sold
          </Typography>
          <Typography variant="body2" sx={{ color: "#AAA" }} mb={2}>
            (+15%) increase in today sales.
          </Typography>
          <Line data={lineChartData1} />
          <Typography variant="body2" mt={2} sx={{ color: "#AAA" }}>
            Updated a min ago
          </Typography>
        </Card>
      </Grid>

      {/* Line Chart 2 */}
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
          <Typography variant="h6" mb={2}>
            Revenue By Day
          </Typography>
          <Typography variant="body2" sx={{ color: "#AAA" }} mb={2}>
            Last Day Performance
          </Typography>
          <Line data={lineChartData2} />
          <Typography variant="body2" mt={2} sx={{ color: "#AAA" }}>
            Just updated
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
