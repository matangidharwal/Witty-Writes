import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";
import Post from "../../components/cards/Post";

const PostComments = ({ comments }) => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const removeComment = async (postId, comment) => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!answer) return;
      const { data } = await axios.put(`/remove-comment`, {
        postId,
        comment,
      });
      fetchPost();
    } catch (error) {
      toast("Comment delete failed. Please try again.");
    }
  };

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="row col-md-8 offset-md-2">
      {" "}
      <Post post={post} commentsCount={100} removeComment={removeComment} />
    </div>
  );
};
export default PostComments;
