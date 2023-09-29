import React, { useState } from "react";
import { useSearch } from "../context/search";
import { Box } from "@mui/material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import SearchInput from "../components/Form/SearchInput";

const Search = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addedItem, setAddedItem] = useState(null);
  const [values, setValues] = useSearch();
  const handleAddToCart = (menu) => {
    setCartItems([...cartItems, menu]);
    setAddedItem(menu);
    setTimeout(() => {
      setAddedItem(null);
    }, 2000);
  };

  return (
    <div>
      <SearchInput
        sx={{
          display: "flex",
          m: 2,
        }}
      />
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Item Found "
              : `Found ${values?.results.length}`}
          </h6>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {values?.results.map((p) => (
              <Card
                key={p._id}
                sx={{ maxWidth: "390px", display: "flex", m: 2 }}
              >
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
                      {addedItem === p && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2">Added</Typography>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {cartItems.filter((item) => item === p).length}
                          </Typography>
                        </Box>
                      )}
                      {!addedItem && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToCart(p)}
                        >
                          ADD
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Search;
