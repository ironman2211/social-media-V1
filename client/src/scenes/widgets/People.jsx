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

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));

  };

  const getUsers = async () => {
    const response = await fetch("http://localhost:3001/users", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data)
    setUsers(data);
  }
  // getUsers();

  useEffect(() => {
   
      getUsers();

  }
  , []); // eslint-disable-line react-hooks/exhaustive-deps

  

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
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
