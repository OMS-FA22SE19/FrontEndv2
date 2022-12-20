import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
  let navigate = useNavigate();
  async function ClearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  async function routeChange() {
    await ClearToken();
    let path = `/`;
    navigate(path);
  }
  useEffect(() => {
    routeChange();
    window.location.href = "/";
  }, []);
};

export default Logout;
