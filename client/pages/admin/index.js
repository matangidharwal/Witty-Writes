import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import AdminRoute from "../../components/routes/AdminRoute";

import axios from "axios";
import { toast } from "react-toastify";
import parse from "html-react-parser";
const Admin = () => {
  const [state, setState] = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
    }
  }, [state && state.token]);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/posts`);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure you want to delete?");
      if (!answer) return;

      const { data } = await axios.delete(`/admin/delete-post/${post._id}`);

      newsFeed();
      toast("Post deleted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-image text-light">
          <div className="col text-center">
            <h1>Admin</h1>
          </div>
        </div>
        <div className="row py-4">
          <div className="col-md-8 offset-md-2">
            {posts.map((post) => (
              <div key={post._id} className="d-flex justify-content-between">
                <div> {parse(post.content)}</div>
                <div
                  className="text-danger"
                  onClick={() => handleDelete(post)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
