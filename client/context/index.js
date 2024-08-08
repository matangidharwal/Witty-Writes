import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const Router = useRouter();
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  const token = state && state.token ? state.token : "";
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common["token"] = `${token}`;

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        setState(null);
        window.localStorage.removeItem("auth");
        Router.push("/login");
      }
    }
  );
  //axios has interceptors which will run before request is send and if jwt is expired then it will remove the token from local storage and redirect to login page

  //JSON.stringify converts a JavaScript object or value to a JSON string->used to store the state in local storage

  //JSON.parse converts a JSON string to a JavaScript object->used to get the state from local storage
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);
  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
