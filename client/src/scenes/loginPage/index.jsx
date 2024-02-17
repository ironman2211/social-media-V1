import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { LinkedIn } from "@mui/icons-material";
import FlexCenter from "components/FlexCenter";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor="#caf0f8"
        p="1rem 6%"
        textAlign="center"
      >
        <FlexCenter sx={
          {
            padding:".5rem"
          }
        }>

        <Typography fontWeight="bold"  sx={{ fontSize: "2.1rem",color: "#324ea8" }}>
          Connect .    
        </Typography>
               <LinkedIn sx={{ fontSize: "2.5rem", color: "#324ea8" }}  />
        </FlexCenter>

      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="4rem auto"
        borderRadius="1.5rem"
      >
       
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
