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

  const [oldtotal, setOldTotal] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

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

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    fetchSuggestions(event.target.value);
  };
  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.name);
    setSelectedItem(suggestion);
    setSuggestions([]);
    fetchItemDetails(suggestion.name);
  };

  const fetchItemDetails = async (itemName) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/fetchitem`,
        {
          name: itemName,
        },
        {
          withCredentials: true,
        }
      );
      setItemData(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };
  const [isInputVisible, setIsInputVisible] = useState(false);
  const handleButtonClick = () => {
    setIsInputVisible(true);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (quantity && selectedItem) {
        const existingItemIndex = invoiceItems.findIndex(
          (item) => item.name === selectedItem.name
        );

        if (existingItemIndex !== -1) {
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
    const discountValue = Math.max(0, Math.min(100, event.target.value));
    setDiscount(discountValue);
  };
  const calculateTotalWithDiscount = () => {
    const total = invoiceItems.reduce((acc, item) => acc + item.totalAmount, 0);
    return total - (total * discount) / 100;
  };

  useEffect(() => {
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Centered Heading */}
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            flex: 1,
            color: "white",
          }}
        >
          Create Invoice
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
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* First Button */}
        <Box
          sx={{
            textAlign: "center",
            width: { xs: "100%", sm: "150px" },
          }}
        >
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

        {/* Second Button */}
        <Box
          sx={{
            textAlign: "center",
            width: { xs: "100%", sm: "150px" },
          }}
        >
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

        {/* Text Field: Shown Below Buttons Only on Mobile */}
        <Box
          sx={{
            textAlign: "center",
            width: { xs: "100%", sm: "150px" },
            order: { xs: 3, sm: 0 },
          }}
        >
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
            minWidth: "600px",
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
                    {item.totalAmount}
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
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.target.blur();
            }
          }}
          sx={{
            backgroundColor: "#424242",
            borderRadius: "4px",
            input: {
              color: "white",
              padding: "13.5px 14px",
            },
            label: { color: "white" },
            width: 180,
            height: "50px",
          }}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            ":hover": { backgroundColor: "#115293" },
            height: "50px",
          }}
          onClick={() => setOpenReceiptModal(true)}
        >
          Generate Receipt
        </Button>
        {/* Receipt Modal */}
        <ReceiptModal
          open={openReceiptModal}
          setOpenReceiptModal={setOpenReceiptModal}
          onClose={() => setOpenReceiptModal(false)}
          discount={discount}
          inventory={invoiceItems}
          setInvoiceItems={setInvoiceItems}
          clientName={clientName}
          setClientName={setClientName}
        />
      </Box>
    </Box>
  );
};

export default CreateInvoice;
