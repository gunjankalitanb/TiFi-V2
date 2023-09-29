import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart";
import SearchInput from "../components/Form/SearchInput";

const Menu = () => {
  const [cart, setCart] = useCart();

  const [addedItem, setAddedItem] = useState(null);
  const [auth, setAuth] = useAuth();
  const [items, setItems] = useState([]);

  const getAllItems = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/items/get-items`
      );
      setItems(data.items);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllItems();
  }, []);
  return (
    <>
      <SearchInput
        sx={{
          display: "flex",
          m: 2,
        }}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {items?.map((p) => (
          <Card key={p._id} sx={{ maxWidth: "390px", display: "flex", m: 2 }}>
            <CardActionArea>
              <CardMedia
                sx={{ minHeight: "400px" }}
                component={"img"}
                src={`${process.env.REACT_APP_API}/api/v1/items/item-photo/${p._id}`}
                alt={p.name}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom component={"div"}>
                  {p.name}
                </Typography>
                <Typography variant="body2">{p.description}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  <Typography variant="h6">Price: ₹{p.price}</Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setCart([...cart, p]);
                      toast.success("Item added to cart");
                    }}
                  >
                    ADD
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default Menu;
