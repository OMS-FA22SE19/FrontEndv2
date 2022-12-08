import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const localSt = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    if(localSt === null){
      setUser(null);
      return;
    }
    await axios
      .get("https://localhost:7246/api/v1/Authentication", {
        headers: { Authorization: `Bearer ${localSt}` },
      })
      .then((response) => {
        const user = response["data"].data;
        setUser(user);
      })
      .catch(() => setUser(null));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
