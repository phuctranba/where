import axios from "axios";
import { APP_URL } from "configs/index";

export const sendFeedback = async (title: string, content: string) => {
  try {
    console.log({
      contactform_title: title,
      contactform_content: content
    })
    let a =await axios.post(APP_URL.CONTACT_FORM, {
      contactform_title: title,
      contactform_content: content
    });
    console.log(a.data)
  } catch (error: any) {
    console.log(error, "alnfakwui");
  }

  return undefined;
};
