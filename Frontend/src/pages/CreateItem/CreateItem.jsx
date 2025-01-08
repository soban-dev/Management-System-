import React, { useEffect, useState, useRef } from "react";
import CreateProduct from "../../Components/CreateItem/CreateProduct";
import HighStockProduct from "../../Components/CreateItem/HighStockTable";
import LowStockProduct from "../../Components/CreateItem/LowStockTable";
import axios from "axios";
import { BASE_URL } from "../../config";

export default function CreateItem() {
  const [data, setData] = useState({ available: [], low: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/inventory/read`, {
          withCredentials: true,
        });
        const availableGroup = response.data.result.find(
          (group) => group._id === "Available"
        );
        const notAvailableGroup = response.data.result.find(
          (group) => group._id === "Not Available"
        );
        setData({
          available: availableGroup ? availableGroup.items : [],
          low: notAvailableGroup ? notAvailableGroup.items : [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(data);
  return (
    <>
      <CreateProduct />
      <LowStockProduct data={data} />
      <HighStockProduct data={data} />
    </>
  );
}
