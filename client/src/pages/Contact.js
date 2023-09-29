import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Navbar from "./Navbar";

const Contact = () => {
  return (
    <div>
      <Box sx={{ my: 5, ml: 10, "& h4": { fontWeight: "bold", mb: 2 } }}>
        <Typography variant="h4">Contact</Typography>
        <p>
          Lorem ipsum dolor sit amet. Et exercitationem odit id temporibus
          possimus ut porro fuga aut veritatis porro. Qui doloremque sint et
          officia voluptatem in delectus voluptas ad odit omnis ut animi numquam
          et voluptatibus omnis. Id consequuntur repellat sit enim consequatur
          sed magni dignissimos aut galisum dolores et beatae iste eos explicabo
          harum. Vel corrupti sunt eos deserunt reiciendis aut iure dolores 33
          culpa voluptas et deserunt magni qui Quis aperiam.Ut distinctio ullam
          qui eveniet dolores et temporibus eius sed voluptatem laborum vel
          dolorem odit rem nihil dolor vel atque corrupti! Et quam error ut
          culpa quos sit molestiae cupiditate est quisquam magnam et deserunt
          vitae.
        </p>
      </Box>
      <Box
        sx={{
          m: 3,
          width: "600px",
          ml: 10,
          "@media (max-width:600px)": {
            width: "300px",
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="contact-table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ bgcolor: "black", color: "white" }}
                  align="center"
                >
                  Contact Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <SupportAgentIcon sx={{ color: "red", pt: 1 }} /> 1800-00-0000
                  (tollfree)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <EmailIcon sx={{ color: "skyblue", pt: 1 }} />{" "}
                  Support@gmail.com
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <PhoneIcon sx={{ color: "green", pt: 1 }} /> +91 9876543210
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Contact;
