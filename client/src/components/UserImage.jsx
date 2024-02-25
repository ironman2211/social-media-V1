import { Box } from "@mui/material";
import { apiService } from "apiHandled/common-services";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="image_unavailable"
        src={apiService.getImages(image)}
      />
    </Box>
  );
};

export default UserImage;
