import PeopleIcon from '@mui/icons-material/People';
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { apiService } from 'apiHandled/common-services';
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await apiService.getUserFriends(userId,token);
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <FlexBetween gap="2rem" padding="1rem">

        <Typography
          variant="h3"
          fontWeight="500"
          sx={{  cursor: "pointer", color: palette.neutral.dark, display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}
        >
          <PeopleIcon />
          My networks
        </Typography>
      </FlexBetween>
      <Divider  />
      <Box display="flex" flexDirection="column" gap="1.5rem" padding="1rem 0">
        {friends.map((friend,index) => (
          <Friend
            key={index}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
