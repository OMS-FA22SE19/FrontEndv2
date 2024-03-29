import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { host, version } from "../data/DataSource/dataSource";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const localSt = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    if (localSt === null) {
      setUser(null);
      return;
    }
    await axios
      .get(host + "/api/" + version +"/Authentication", {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then((response) => {
        const user = response["data"].data;
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
      });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
