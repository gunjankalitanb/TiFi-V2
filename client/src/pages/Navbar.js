import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import React, { useState } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useCategory from "../hooks/useCategory";
import { useCart } from "../context/cart";
import "./styles/navbar.css";
import { Badge } from "antd";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const location = useLocation();
  const isMenuPage = location.pathname === "/menu";
  const categories = useCategory();
  // Add a media query hook to check screen width
  const isSmallScreen = useMediaQuery("(max-width: 345px)");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const handleDropdownToggle = (e) => {
    // Prevent event propagation to avoid closing the drawer
    e.stopPropagation();
    e.currentTarget.parentElement.classList.toggle("open");
  };
  const isHomepage = location.pathname === "/";
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        color={"Highlight"}
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, my: 2 }}
      >
        <RamenDiningIcon></RamenDiningIcon>
        Ti :ফাই
      </Typography>
      {/* Divider betwen rest. name and home */}
      <Divider />
      <ul className="mobile-navigation">
        <li>
          <Link to={"/"}>
            {" "}
            <HomeIcon /> Home
          </Link>
        </li>
        <li>
          <Link to={"/menu"}>
            <MenuBookIcon />
            Menu
          </Link>
        </li>

        {!auth.user ? (
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        ) : (
          <>
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleDropdownToggle}
              >
                {auth?.user?.name}
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="dropdown-item"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={handleLogout}
                    to={"/login"}
                    className="dropdown-item"
                  >
                    Logout
                  </NavLink>
                </li>
              </ul>
            </li>
          </>
        )}
      </ul>
    </Box>
  );
  return (
    <>
      <Box>
        <AppBar component={"nav"} sx={{ bgcolor: "#333" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: "none" } }}
              onClick={handleDrawerToggle}
            >
              <DragHandleIcon />
            </IconButton>
            <Typography
              color={"Highlight"}
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: "1rem", // Adjust font size as needed
              }}
            >
              Ti :ফাই
            </Typography>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ul className="navigation-menu">
                <li>
                  <Link to={"/"}>Home</Link>
                </li>

                {!auth.user ? (
                  <li>
                    <Link to={"/login"}>Login</Link>
                  </li>
                ) : (
                  <>
                    <li className="nav-item dropdown">
                      <NavLink
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {auth?.user?.name}
                      </NavLink>
                      <ul className="dropdown-menu">
                        <li>
                          <NavLink
                            to={`/dashboard/${
                              auth?.user?.role === 1 ? "admin" : "user"
                            }`}
                            className="dropdown-item"
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            onClick={handleLogout}
                            to={"/login"}
                            className="dropdown-item"
                          >
                            Logout
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
              </ul>
            </Box>
            <Box sx={{ display: { xs: "block", sm: "block" } }}>
              <ul className="navigation-menu">
                {!isHomepage && !isSmallScreen && (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to={"/categories"}
                        data-bs-toggle="dropdown"
                        sx={{ fontSize: "1rem" }}
                      >
                        Category
                      </Link>

                      <ul className="dropdown-menu">
                        <li>
                          <Link cllinkssName="dropdown-item" to={"/categories"}>
                            All Categories
                          </Link>
                        </li>
                        {categories?.map((c) => (
                          <li>
                            <Link
                              cllinkssName="dropdown-item"
                              to={`/category/${c.slug}`}
                            >
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>

                    <li>
                      <Link to="/dashboard/user/cartpage">
                        <ShoppingCartIcon sx={{ fontSize: "0.9rem" }} />
                        {cart?.length}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "240px",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box>
          <Toolbar />
        </Box>
      </Box>
    </>
  );
};

export default Navbar;

// <div className="navbar">
//       <div className="navbar-left">RESTAURANT_NAME</div>
//       <div className="navbar-right">
//         <a href="/about" className="nav-link">About</a>
//         <a href="/contact" className="nav-link">Contact</a>
//       </div>
//     </div>
