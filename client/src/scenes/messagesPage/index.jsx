import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { PrettyChatWindow } from 'react-chat-engine-pretty';

const MessagesPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { firstName, secrete } = useSelector((state) => state.user);
  return (
    <Box>
      <Navbar />

      <div style={{
        height: "80vh",
        backgroundColor: "red",
      }}>
        <PrettyChatWindow
          projectId="30ba704b-106e-411d-85e3-afb700f349ed"
          username={firstName}
          secret={secrete}
        />

      </div>
    </Box>
  );
};

export default MessagesPage;
