import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from "../Loading";
import { UserContext } from "../../context";

const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const [state] = useContext(UserContext);

  useEffect(() => {
    if (state && state.token) fetchUser();
  }, [state && state.token]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/current-user`);
      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/login");
    }
  };

  process.browser &&
    state === null &&
    setTimeout(() => {
      fetchUser();
    }, 1000);
  //fetchuser function khudse bularhe h after 1 sec agar state null h toh ... fir usme catch me jaakr login page aajaega
  return !ok ? <Loading /> : <>{children}</>;
};

export default UserRoute;
