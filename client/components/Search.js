import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "./cards/People";
import { toast } from "react-toastify";

const Search = () => {
  const [state, setState] = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      setResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put(`/user-follow`, { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = results.filter((p) => p._id !== user._id);
      setResults(filtered);
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put(`/user-unfollow`, { _id: user._id });

      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = results.filter((p) => p._id !== user._id);
      setResults(filtered);

      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className="form-inline row" onSubmit={searchUser}>
        <div className="col-8">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              setResults([]);
            }}
            value={query}
            className="form-control"
            type="search"
            placeholder="Search"
          />
        </div>
        <div className="col-4">
          <button className="btn btn-outline-primary col-12" type="submit">
            Search
          </button>
        </div>
      </form>
      <div style={{ marginTop: "10px" }}>
        {results && (
          <People
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            people={results}
          />
        )}
      </div>
    </>
  );
};

export default Search;
