import axios from "axios";
import { APP_URL } from "configs/index";

export const uploadSingleMedia = async (file: any) => {
  try {
    const newForm = new FormData();
    newForm.append("files", file);
    const responseData = await axios.post(APP_URL.MEDIA_UPLOAD, newForm, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (responseData?.data?.media_filename) {
      return responseData?.data?.media_filename;
    }
  } catch (error: any) {
    console.log(error, "alsdgaenfakwui");
  }

  return undefined;
};
