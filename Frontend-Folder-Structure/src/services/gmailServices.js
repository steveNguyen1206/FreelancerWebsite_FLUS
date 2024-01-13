import { http } from "./http-common";

const sendEmail = (data) => {
  return http.post("/gmail/send-email", data);
};

const gmailService = {
    sendEmail
};

export default gmailService;
