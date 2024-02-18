import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import FlexWrap from "components/FlexWrap";
import PeopleWidget from "./PeopleWidget";
import { Box, CircularProgress } from "@mui/material";

const People = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const getPosts = async () => {
    const response = await fetch("http://ec2-35-78-168-82.ap-northeast-1.compute.amazonaws.com:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));

  };

  const getUsers = async () => {
    const response = await fetch("http://ec2-35-78-168-82.ap-northeast-1.compute.amazonaws.com:3001/users", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
  const filteredUsers = data.filter((user) => user._id !== _id);
    setUsers(filteredUsers);
  }
  // getUsers();

  useEffect(() => {
   
      getUsers();

  }
  , []); // eslint-disable-line react-hooks/exhaustive-deps

  

  const getUserPosts = async () => {
    const response = await fetch(
      `http://ec2-35-78-168-82.ap-northeast-1.compute.amazonaws.com:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
         <PeopleWidget user={user} />
        )
      )}
    </FlexWrap>
  );
};

export default People;
