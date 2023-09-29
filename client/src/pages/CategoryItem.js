import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { Card } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cart";

const CategoryItem = () => {
  const [cart, setCart] = useCart();
  const [addedItem, setAddedItem] = useState(null);
  const params = useParams();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    if (params?.slug) getItemByCat();
  }, [params?.slug]);
  const getItemByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/items/item-category/${params.slug}`
      );
      setItems(data?.items);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-3">
      <h4 className="text-center">Category - {category?.name}</h4>
      <h6 className="text-center">{items?.length} result found</h6>
      <div className="row">
        <Box
          sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        >
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
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
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
      </div>
    </div>
  );
};

export default CategoryItem;
