import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  List,
  IconButton,
  Paper,
} from "@mui/material";
import axios from "axios";
import ReceiptModal from "./ReciptModel";
import backgroundImage from "../../../assets/background.jpg";
import { BASE_URL } from "../../../config";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateInvoice = ({ onClose }) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [enteredQuantity, setEnteredQuantity] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const inputRef = useRef(null);
  const [clientName, setClientName] = useState("");
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [oldtotal, setOldTotal] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (event) => {
    if (suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        event.preventDefault();
        handleSuggestionClick(suggestions[focusedIndex]);
      }
    }
  };
  const handleKeyPress1 = async (event, invoiceItems) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();

      const items = Array.isArray(invoiceItems) ? invoiceItems : [];

      if (invoiceId && invoiceId.trim() !== "") {
        try {
          const response = await fetch(
            `${BASE_URL}/inventory/invoiceid/${invoiceId}`
          );
          const data = await response.json();

          const fetchedItems = data.invoice.items;
          setOldTotal(data.invoice.total);
          setDiscount(data.invoice.percentdiscount);
          const updatedInvoiceItems = [...items];

          fetchedItems.forEach((fetchedItem) => {
            const existingItemIndex = updatedInvoiceItems.findIndex(
              (item) => item.name === fetchedItem.name
            );

            if (existingItemIndex !== -1) {
              updatedInvoiceItems[existingItemIndex].quantity +=
                fetchedItem.quantity;
              updatedInvoiceItems[existingItemIndex].totalAmount =
                updatedInvoiceItems[existingItemIndex].quantity *
                updatedInvoiceItems[existingItemIndex].price;
            } else {
              const newItem = {
                name: fetchedItem.name,
                price: fetchedItem.price / fetchedItem.quantity,
                quantity: fetchedItem.quantity,
                totalAmount: fetchedItem.price,
              };
              updatedInvoiceItems.push(newItem);
            }
          });

          setInvoiceItems(updatedInvoiceItems);
        } catch (error) {
          console.error("Error fetching invoice data:", error);
        }
      } else {
        console.error("Invoice ID is undefined or empty.");
      }
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      if (query.length === 0) {
        setSuggestions([]);
      } else if (query.length > 1) {
        const response = await axios.post(
          `${BASE_URL}/inventory/searchitem`,
          {
            name: query,
          },
          {
            withCredentials: true,
          }
        );
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    fetchSuggestions(event.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.name);
    setSelectedItem(suggestion);
    setSuggestions([]);
    fetchItemDetails(suggestion.name);
  };

  // Fetch item details
  const fetchItemDetails = async (itemName) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/fetchitem`,
        {
          name: itemName,
          // Authorization:token
        },
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );
      setItemData(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  // Toggle visibility of input field to enter quantity
  const [isInputVisible, setIsInputVisible] = useState(false);

  // Handle button click to toggle input visibility
  const handleButtonClick = () => {
    setIsInputVisible(true);
  };

  // Handle quantity entry on "Enter" key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (quantity && selectedItem) {
        const existingItemIndex = invoiceItems.findIndex(
          (item) => item.name === selectedItem.name
        );

        if (existingItemIndex !== -1) {
          // If item exists, replace its quantity and totalAmount
          const updatedInvoiceItems = [...invoiceItems];
          updatedInvoiceItems[existingItemIndex].quantity = parseInt(quantity);
          updatedInvoiceItems[existingItemIndex].totalAmount =
            parseInt(quantity) * updatedInvoiceItems[existingItemIndex].price;

          setInvoiceItems(updatedInvoiceItems);
        } else {
          const newItem = {
            name: selectedItem.name,
            price: itemData.selling_price_per_unit,
            quantity: parseInt(quantity),
            totalAmount: quantity * itemData.selling_price_per_unit,
          };
          setInvoiceItems([...invoiceItems, newItem]);
        }

        setEnteredQuantity(quantity);
        setQuantity("");
        setIsInputVisible(false);
      }
    }
  };
  const handleDiscountChange = (event) => {
    const discountValue = Math.max(0, Math.min(100, event.target.value)); // Ensure between 0 and 100
    setDiscount(discountValue);
  };

  // Calculate total with discount
  const calculateTotalWithDiscount = () => {
    const total = invoiceItems.reduce((acc, item) => acc + item.totalAmount, 0);
    return total - (total * discount) / 100;
  };

  useEffect(() => {
    // Add event listener for outside click to hide input
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsInputVisible(false);
    }
  };
  const handleDelete = (index) => {
    const updatedItems = [...invoiceItems];
    updatedItems.splice(index, 1);
    setInvoiceItems(updatedItems);
  };
  const handleQuantityChange = (index, newValue) => {
    const updatedItems = [...invoiceItems];
    const newQuantity = parseInt(newValue, 10) || 0;
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].totalAmount = newQuantity * updatedItems[index].price;
    setInvoiceItems(updatedItems);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: { xs: "100%", sm: "80%" },
        margin: "auto",
        mt: { xs: "-1px", sm: "20px" },
        p: 3,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid #444",
        borderRadius: "10px",
        color: "white",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      {/* Close Button */}
      <Button
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "10px",
          right: { xs: "5px", sm: "10px" },
          backgroundColor: "red",
          color: "white",
          minWidth: { xs: "35px", sm: "40px" },
          minHeight: { xs: "20px", sm: "40px" },
          borderRadius: "50%",
          ":hover": {
            backgroundColor: "darkred",
          },
        }}
      >
        &times; {/* Cross icon */}
      </Button>

      {/* Heading Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Left side TextField */}
        <TextField
          variant="outlined"
          placeholder="Old Invoice#ID"
          size="small"
          value={invoiceId}
          autoFocus
          ref={inputRef}
          onChange={(e) => setInvoiceId(e.target.value)}
          onKeyPress={handleKeyPress1}
          sx={{
            backgroundColor: "#424242",
            input: { color: "white" },
            width: { xs: "50%", sm: "200px" },
          }}
        />

        {/* Centered Heading */}
        <Typography
          variant="h4"
          textAlign="left"
          sx={{
            flex: 1,
            color: "white",
            paddingLeft: { xs: "10px", sm: "55px" },
            display: { xs: "none", sm: "block" },
          }}
        >
          Update Invoice
        </Typography>
      </Box>

      {/* Search Field */}
      <Box
        sx={{ display: "flex", gap: 2, mb: 3, position: "relative" }}
        onKeyDown={handleKeyDown}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search for an item"
          InputProps={{ style: { color: "white", background: "#424242" } }}
        />
        {searchValue.trim().length > 0 && suggestions.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              color: "white",
              background: "#424242",
            }}
          >
            <List>
              {suggestions.map((suggestion, index) => (
                <MenuItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    backgroundColor:
                      focusedIndex === index ? "#303030" : "#616161",
                    ":hover": { backgroundColor: "#303030" },
                  }}
                >
                  {suggestion.name}
                </MenuItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Buttons Row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box sx={{ textAlign: "center", width: { xs: "100%", sm: "150px" } }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#115293" },
              height: "50px",
              width: "100%",
            }}
          >
            Price
          </Button>
          <Typography variant="body2" sx={{ color: "white", marginTop: 1 }}>
            {itemData ? itemData.selling_price_per_unit : "0"}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", width: { xs: "100%", sm: "150px" } }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#115293" },
              height: "50px",
              width: "100%",
            }}
          >
            Available Qty
          </Button>
          <Typography variant="body2" sx={{ color: "white", marginTop: 1 }}>
            {itemData ? itemData.quantity : "0"}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", width: { xs: "100%", sm: "150px" } }}>
          <TextField
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Quantity"
            sx={{
              width: "100%",
              backgroundColor: "#424242",
              input: { color: "white" },
            }}
          />
        </Box>
      </Box>

      {/* Invoice Table */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table
          sx={{
            backgroundColor: "#424242",
            borderRadius: 2,
            minWidth: "570px",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Item
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total Qty
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "white" }}>
                  No items available
                </TableCell>
              </TableRow>
            ) : (
              invoiceItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "white" }}>{item.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>{item.price}</TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={item.quantity}
                      placeholder="Total Qty"
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          event.target.blur();
                        }
                      }}
                      style={{
                        color: "white",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        width: "100px",
                        textAlign: "center",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {item.totalAmount}{" "}
                    <IconButton
                      onClick={() => handleDelete(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
      {/* Discount and Generate Receipt */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 3,
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          label="Discount:"
          placeholder="Enter Discount"
          value={discount}
          onChange={(e) => {
            const value = e.target.value;
            const validNumber = /^\d*\.?\d{0,2}$/;
            if (
              (validNumber.test(value) || value === "") &&
              (value === "" || parseFloat(value) <= 100)
            ) {
              setDiscount(value);
            }
          }}
          sx={{
            backgroundColor: "#424242",
            borderRadius: "4px",
            input: { color: "white", padding: "13.5px 14px" },
            label: { color: "white" },
            width: { xs: "100%", sm: "180px" },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            ":hover": { backgroundColor: "#115293" },
            height: "50px",
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setOpenReceiptModal(true)}
        >
          Generate Receipt
        </Button>
        {/* Receipt Modal */}
        <ReceiptModal
          open={openReceiptModal}
          onClose={() => setOpenReceiptModal(false)} // Close modal on close
          discount={discount}
          inventory={invoiceItems}
          clientName={clientName}
          invoiceId={invoiceId}
          oldtotal={oldtotal}
          setInvoiceItems={setInvoiceItems}
          setClientName={setClientName}
        />
      </Box>
    </Box>
  );
};

export default CreateInvoice;
