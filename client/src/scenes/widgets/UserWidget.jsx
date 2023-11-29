import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import FlexCenter from "components/FlexCenter";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;
  console.log(user)
  return (
    <WidgetWrapper>
      <FlexCenter gap="2rem" padding="1rem" >
        <UserImage image={picturePath} size="100px" />
      </FlexCenter>
      <FlexCenter
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <Typography
          variant="h3"
          color={palette.primary.dark}
          fontWeight="500"
          sx={{
            "&:hover": {
              color:dark,
              cursor: "pointer",
            },
          }}
        >
          {firstName.charAt(0).toUpperCase() + firstName.slice(1)}{lastName}
        </Typography>

      </FlexCenter>
      <FlexBetween  padding="1rem" color={palette.secondary} >

        <Typography color={medium}> 
        {friends.length}{" "}
        Friend
        </Typography>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

  
      <Box p="1.5rem .5rem">
        <FlexBetween >

          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            {/* <Typography color={medium}>Address</Typography> */}
          </Box>

          <Typography color={medium}>{location}</Typography>
        </FlexBetween>
        <FlexBetween>

          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            {/* <Typography color={medium}>Occupation</Typography> */}

          </Box>
          <Typography color={medium}>{occupation}</Typography>
        </FlexBetween>
      </Box>

      <Divider />


      <Box p="1.5rem .5rem">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>





    </WidgetWrapper>
  );
};

export default UserWidget;
