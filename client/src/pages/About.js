import { Box, Typography } from "@mui/material";
import React from "react";

const About = () => {
  return (
    <Box
      sx={{
        my: 15,
        textAlign: "center",
        p: 2,
        "& h4": {
          fontWeight: "bold",
          my: 2,
          fontSize: "2rem",
        },
        "& p": {
          textAlign: "justify",
        },
        " @media (max-width:600px)": {
          mt: 0,
          "& h4": {
            fontSize: "1.5rem",
          },
        },
      }}
    >
      <Typography variant="h4">Welcome to My Restaurant</Typography>
      <p>
        Lorem ipsum dolor sit amet. Et exercitationem odit id temporibus
        possimus ut porro fuga aut veritatis porro. Qui doloremque sint et
        officia voluptatem in delectus voluptas ad odit omnis ut animi numquam
        et voluptatibus omnis. Id consequuntur repellat sit enim consequatur sed
        magni dignissimos aut galisum dolores et beatae iste eos explicabo
        harum. Vel corrupti sunt eos deserunt reiciendis aut iure dolores 33
        culpa voluptas et deserunt magni qui Quis aperiam.Ut distinctio ullam
        qui eveniet dolores et temporibus eius sed voluptatem laborum vel
        dolorem odit rem nihil dolor vel atque corrupti! Et quam error ut culpa
        quos sit molestiae cupiditate est quisquam magnam et deserunt vitae.
      </p>
      <br />
      <p>
        Et dolor blanditiis et explicabo corrupti et deserunt dolorum est
        maiores cupiditate aut corrupti porro et galisum amet qui velit
        sapiente. Rem sint libero qui voluptatem architecto eos molestiae
        blanditiis quo molestias commodi vel expedita voluptatem.
      </p>
    </Box>
  );
};

export default About;
