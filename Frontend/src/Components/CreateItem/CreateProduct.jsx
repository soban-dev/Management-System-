import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../config";

const CreateProduct = () => {
  const [clientName, setClientName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [productData, setProductData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const priceInput = useRef(null);
  const quantityInput = useRef(null);
  const buyingPriceInput = useRef(null);
  const requiredQuantityInput = useRef(null);

  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter" && nextField) {
      nextField.current.focus();
    }
  };

  const handleSubmit = async () => {
    const newProduct = {
      name: clientName,
      quantity: quantity,
      required_quantity: requiredQuantity,
      buying_price_per_unit: buyingPrice,
      selling_price_per_unit: price,
    };

    setProductData((prevData) => [...prevData, newProduct]);

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/createitem`,
        {
          name: newProduct.name,
          quantity: newProduct.quantity,
          required_quantity: newProduct.required_quantity,
          buying_price_per_unit: newProduct.buying_price_per_unit,
          selling_price_per_unit: newProduct.selling_price_per_unit,
        },
        {
          withCredentials: true,
        }
      );
      // console.log("Backend Response: ", response.data.message);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setClientName("");
      setPrice("");
      setQuantity("");
      setBuyingPrice("");
      setRequiredQuantity("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      console.error("Error sending data:", errorMessage);
      setErrorMessage(errorMessage);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "rgb(32 41 64)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "22px",
        padding: { xs: "15px 10px", sm: "25px 0px" },
        marginBottom: "20px",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          mb: 3,
          color: "white",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        Add a New Product
      </Typography>

      <Box
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: { xs: "100%", sm: "70%" },
          height: { xs: "auto", sm: "55vh" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gridTemplateRows: "auto auto auto",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          padding: 3,
          margin: "auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          backgroundColor: "rgb(29 35 52 / 90%)",
          border: "2px solid #444444",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Enter Name"
          fullWidth
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          InputProps={{
            style: {
              color: "white",
              background: "#424242",
            },
          }}
          onKeyDown={(e) => handleKeyPress(e, priceInput)}
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
        />

        <TextField
          variant="outlined"
          placeholder="Enter Selling Price"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          InputProps={{
            style: {
              color: "white",
              background: "#424242",
            },
          }}
          onKeyDown={(e) => handleKeyPress(e, buyingPriceInput)}
          inputRef={priceInput}
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
        />

        <TextField
          variant="outlined"
          placeholder="Enter Buying Price"
          fullWidth
          value={buyingPrice}
          onChange={(e) => setBuyingPrice(e.target.value)}
          InputProps={{
            style: {
              color: "white",
              background: "#424242",
            },
          }}
          onKeyDown={(e) => handleKeyPress(e, requiredQuantityInput)}
          inputRef={buyingPriceInput}
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
        />

        <TextField
          variant="outlined"
          placeholder="Enter Required Quantity"
          fullWidth
          value={requiredQuantity}
          onChange={(e) => setRequiredQuantity(e.target.value)}
          InputProps={{
            style: {
              color: "white",
              background: "#424242",
            },
          }}
          onKeyDown={(e) => handleKeyPress(e, quantityInput)}
          inputRef={requiredQuantityInput}
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
        />

        <TextField
          variant="outlined"
          placeholder="Enter Available Quantity"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          InputProps={{
            style: {
              color: "white",
              background: "#424242",
            },
          }}
          onKeyDown={(e) => handleKeyPress(e, null)}
          inputRef={quantityInput}
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            mb: 3,
            ":hover": {
              backgroundColor: "#1565c0",
            },
            fontSize: "16px",
            padding: { xs: "8px 16px", sm: "10px 20px" },
            width: "100%",
            maxWidth: "350px",
            textAlign: "center",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Product"
          )}
        </Button>

        {errorMessage && (
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: "red",
              marginBottom: 2,
              marginTop: "-20px",
              marginRight: { xs: "0", sm: "-90px" },
            }}
          >
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: "green",
              marginBottom: 2,
              marginTop: "-20px",
              marginRight: { xs: "0", sm: "-90px" },
            }}
          >
            {successMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CreateProduct;
