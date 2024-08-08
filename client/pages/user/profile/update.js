import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import AuthForm from "../../../components/forms/AuthForms";
import Link from "next/link";
import { UserContext } from "../../../context";
import { Avatar } from "@chakra-ui/react";
import Loading from "../../../components/Loading";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [secret, setSecret] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (state && state.user) {
      setName(state.user.name);
      setEmail(state.user.email);
      setUsername(state.user.username);
      setAbout(state.user.about);
      setImage(state.user.image);
    }
  }, [state && state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`/profile-update`, {
        // name: name,
        // or i can just pass by name as they are the same
        image,
        username,
        about,
        name,
        email: email,
        password: password,
        secret: secret,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        //update local storage, update user , update context
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        setState({ ...state, user: data });
        toast.success("Updated your profile.");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post(`/upload-image`, formData);
      setImage({ url: data.url, public_id: data.public_id });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-image text-light">
        <div className="col text-center">
          <h1>Profile</h1>
        </div>
      </div>

      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <label
            htmlFor="file"
            style={{ cursor: "pointer" }}
            className="d-flex justify-content-center h5"
          >
            {image && image.url ? (
              uploading ? (
                <Loading />
              ) : (
                <img
                  src={image.url}
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                  alt=""
                />
              )
            ) : (
              <img
                src="https://i.etsystatic.com/36262552/r/il/b32f2f/4239329917/il_794xN.4239329917_gcxb.jpg"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                alt=""
              />
            )}
            <input
              id="file"
              type="file"
              accept="images/*"
              className="form-control"
              hidden
              onChange={handleImage}
            />
          </label>
          <AuthForm
            profileUpdate={true}
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
            username={username}
            setUsername={setUsername}
            about={about}
            setAbout={setAbout}
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

export default ProfileUpdate;
