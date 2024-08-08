import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import AuthForm from "../components/forms/AuthForms";
import Link from "next/link";
import { UserContext } from "../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success("Login successful");
        setState({ user: data.user, token: data.token });
        //update context state

        //save in local storage
        window.localStorage.setItem("auth", JSON.stringify(data));

        router.push("/user/dashboard");
      }
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  if (state && state.token) router.push("/user/dashboard");

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-image text-light">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            loading={loading}
            page="login"
          />
        </div>
        <div className="row">
          <div className="col">
            <p className="text-center">
              Not yet registered?{" "}
              <Link href="/register" className="text-primary">
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-center">
              <Link href="/forgot-password" className="text-danger">
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
