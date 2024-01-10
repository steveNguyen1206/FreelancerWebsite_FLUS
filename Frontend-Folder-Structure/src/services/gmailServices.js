import { http } from "./http-common";

const sendEmail = (email) => {
  return http.post("/gmail/send-email", email);
};

const gmailService = {
    sendEmail
};

export default gmailService;
