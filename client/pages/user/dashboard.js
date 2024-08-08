import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import UserRoute from "../../components/routes/UserRoute";
import CreatePostForm from "../../components/forms/PostForm";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import { CommentForm } from "../../components/forms/CommentForm";
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@ajna/pagination";
import Search from "../../components/Search";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);
const Home = () => {
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const totalPages = totalPosts / 3 + 1;

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    try {
      const getPosts = async () => {
        const { data } = await axios.get(`/total-posts`);
        setTotalPosts(data);
      };
      getPosts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get(`/find-people`);

      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/create-post`, { content, image });
      if (data.error) {
        toast.error(data.error);
      } else {
        setContent("");
        newsFeed();
        toast.success("Post created");
        setPage(1);
        setImage({});
        //socket
        socket.emit("new-post", data);
      }
    } catch (err) {
      console.log(err);
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

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure you want to delete?");
      if (!answer) return;

      const { data } = await axios.delete(`/delete-post/${post._id}`);

      newsFeed();
      toast("Post deleted");
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
      newsFeed();
      findPeople();
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put(`/like-post`, { _id });

      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put(`/unlike-post`, { _id });

      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (e) => {
    setCurrentPost(e);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/add-comment`, {
        postId: currentPost._id,
        comment,
      });

      newsFeed();
      setVisible(false);
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };
  const removeComment = async (postId, c) => {
    try {
      const { data } = await axios.put(`/remove-comment`, {
        postId,
        comment: c,
      });

      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-image text-light">
          <div className="col text-center">
            <h1>NewsFeed</h1>
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            <PostList
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              posts={posts}
              handleDelete={handleDelete}
              handleComment={handleComment}
              removeComment={removeComment}
            />
            <Pagination
              pagesCount={totalPages}
              currentPage={page}
              onPageChange={(value) => setPage(value)}
            >
              <PaginationContainer
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <PaginationPrevious
                  style={{ margin: "0 5px", cursor: "pointer" }}
                  onClick={() => setPage(page > 1 ? page - 1 : page)}
                >
                  Previous
                </PaginationPrevious>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationPage
                    key={`pagination_page_${i + 1}`}
                    page={i + 1}
                    style={{
                      margin: "0 5px",
                      cursor: "pointer",
                      fontWeight: page === i + 1 ? "bold" : "normal",
                    }}
                    onClick={() => setPage(i + 1)}
                  />
                ))}
                <PaginationNext
                  style={{ margin: "0 5px", cursor: "pointer" }}
                  onClick={() => setPage(page < totalPages ? page + 1 : page)}
                >
                  Next
                </PaginationNext>
              </PaginationContainer>
            </Pagination>
            <br />
            <br />
          </div>
          <div className="col-md-4">
            <Search />
            <br />
            {state && state.user && state.user.following && (
              <Link className="h6 btn btn-secondary" href={`/user/following`}>
                {state.user.following.length} Following
              </Link>
            )}

            <People handleFollow={handleFollow} people={people} />
          </div>
        </div>
        <CommentForm
          setVisible={setVisible}
          visible={visible}
          comment={comment}
          setComment={setComment}
          addComment={addComment}
        />
      </div>
    </UserRoute>
  );
};

export default Home;
