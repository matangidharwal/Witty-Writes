import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { UserContext } from "../context";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const [state] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/forgot-password`, {
        email: email,
        newPassword: newPassword,
        secret: secret,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      }

      if (data.success) {
        setEmail("");
        setNewPassword("");
        setSecret("");
        alert(data.success);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response);
    }
  };

  if (state && state.token) router.push("/");

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-image text-light">
        <div className="col text-center">
          <h1>Forgot Password</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            handleSubmit={handleSubmit}
            email={email}
            newPassword={newPassword}
            secret={secret}
            setEmail={setEmail}
            setNewPassword={setNewPassword}
            setSecret={setSecret}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
