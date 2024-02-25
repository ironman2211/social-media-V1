import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import { PrettyChatWindow } from 'react-chat-engine-pretty';

const MessagesPage = () => {

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
