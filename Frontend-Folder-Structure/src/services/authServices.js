import { http } from "./http-common";

const signin = (data) => {
  return http.post("/auth/signin", data);
};

const signup = (data) => {
  return http.post("/auth/signup", data);
};

const checkIsAdmin = (access_token) => {
  return http.get("/auth/checkisadmin", {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};
  

const authServices = {
  signin,
  signup,
  checkIsAdmin,
};

export default authServices;
