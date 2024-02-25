
import CheckIcon from '@mui/icons-material/Check';
import { PersonAddOutlined } from "@mui/icons-material";
import { Typography, Button, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexCenter from "components/FlexCenter";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import { apiService } from "apiHandled/common-services";

const PeopleWidget = ({user}) => {
  const {  firstName, lastName, picturePath  }=user;
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const { _id } = useSelector((state) => state.user);
  const patchFriend = async () => {
    const response = await apiService.updateFriend(_id,user.id,token);
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

const friends = useSelector((state) => state.user.friends);
  const isFriend = friends.find((friend) => friend._id === user._id);
  return (
    <WidgetWrapper
    sx={{ width: "23%", height: "100%", display: "flex", flexDirection: "column" }}
    md={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
    >
      <FlexCenter gap="2rem" padding="1rem" >
        <UserImage image={picturePath} size="100px" />
      </FlexCenter>
      <FlexCenter
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        <Typography
          variant="h4"
          color={palette.primary.dark}
          fontWeight="500"
          sx={{
            "&:hover": {
              color:dark,
              cursor: "pointer",
            },
          }}
        >
          {firstName.charAt(0).toUpperCase() +firstName.slice(1)}{"  "}{lastName}
        </Typography>

      </FlexCenter>
      {/* <FlexCenter  color={palette.secondary} >
        <Typography color={medium}> {occupation}</Typography>
     
      </FlexCenter> */}
      <FlexCenter  padding="1rem" color={palette.secondary} >

    
        {_id !== user._id && (<Button
        sx={{
          fontSize: ".8rem",
          textTransform: "capitalize",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          justifyContent: "center",
          
        }}
        onClick={() => patchFriend()}
      >
        {isFriend ? <CheckIcon sx={{color:"red"}}/> : <PersonAddOutlined color="red" />}
        {
          isFriend ? (<Typography color="red">Following</Typography>) : (<Typography> Follow</Typography>)
        }


      </Button>)}
        {/* <ManageAccountsOutlined /> */}
      </FlexCenter>

    </WidgetWrapper>
  );
};

export default PeopleWidget;
