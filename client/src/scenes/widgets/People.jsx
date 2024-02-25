import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import FlexWrap from "components/FlexWrap";
import PeopleWidget from "./PeopleWidget";
import { Box, CircularProgress } from "@mui/material";
import { apiService } from "apiHandled/common-services";

const People = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const getPosts = async () => {
    const response = await apiService.getPosts(token);
    const data = await response.json();
    dispatch(setPosts({ posts: data }));

  };

  const getUsers = async () => {
    const response = await apiService.getAllUsers(token);
    const data = await response.json();
  const filteredUsers = data.filter((user) => user._id !== _id);
    setUsers(filteredUsers);
  }
  // getUsers();

  useEffect(() => {
   
      getUsers();
      getUserPosts();
      getPosts();
  }
  , []); // eslint-disable-line react-hooks/exhaustive-deps

  

  const getUserPosts = async () => {
    const response = await apiService.getUserPosts(userId, token);
    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };


if(!users) return (
  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  }}
  >
<CircularProgress color="secondary" />
  </Box>
);
  return (
    <FlexWrap>
      {users?.map(
        (user) => (
         <PeopleWidget key={user._id} user={user} />
        )
      )}
    </FlexWrap>
  );
};

export default People;
