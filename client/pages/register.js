import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import AuthForm from "../components/forms/AuthForms";
import Link from "next/link";
import { UserContext } from "../context";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const [state] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/register`, {
        // name: name,
        // or i can just pass by name as they are the same
        name,
        email: email,
        password: password,
        secret: secret,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success("Registration successful. Please login.");
        setName("");
        setEmail("");
        setPassword("");
        setSecret("");
        setLoading(false);
        router.push("/login");
      }
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  if (state && state.token) router.push("/");

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-image text-light">
        <div className="col text-center">
          <h1>Register</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            name={name}
            email={email}
            password={password}
            secret={secret}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            setSecret={setSecret}
            loading={loading}
          />
        </div>
        <div className="row">
          <div className="col">
            <p className="text-center">
              Already registered?{" "}
              <Link href="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
