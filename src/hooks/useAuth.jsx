import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  const Login = async (user) => {
    if (!user.email || !user.password) {
      alert("Please enter both email and password");
      return;
    }
    try {
      /*console.log("Login attempt with payload:", {
        email: user.email,
        password: user.password,
      });*/

      let response = await axios.post(
        "https://babyjoy456.pythonanywhere.com/api/user/login/",
        {
          email: user.email,
          password: user.password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        // alert("Login successfully!");
        navigate("/home", { replace: true });
      }
    } catch (err) {
      if (err.code === "ERR_BAD_REQUEST") {
        alert(err.response.data.error);
      } else {
        alert("Not connected with the back-end server");
      }
    }
  };

  const Logout = async () => {
    try {
      let token = localStorage.getItem("token");

      await axios.post(
        "https://babyjoy456.pythonanywhere.com/api/user/logout/",
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      localStorage.removeItem("token");
      sessionStorage.clear();

      navigate("/login", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return { Login, Logout };
};

export default useAuth;
