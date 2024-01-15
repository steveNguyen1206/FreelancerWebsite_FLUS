import { http } from "./http-common";

const sendCode = (data) => {
  console.log(data);
  return http.post("/sms/send-code", data);
};

const verifyCode = (data) => {
    return http.post("/sms/verify-code", data);
};


const smsAuthenService = {
    sendCode,
    verifyCode,
};

export default smsAuthenService;
