import parse from "html-react-parser";
import { useContext } from "react";
import moment from "moment";
import { Avatar } from "@chakra-ui/react";
import PostImage from "../images/PostImage";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import Link from "next/link";

const Post = ({
  post,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  commentsCount = 2,
  removeComment,
}) => {
  const [state] = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      {post && post.postedBy && (
        <div key={post._id} className="card mb-5">
          <div className="card-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Avatar
                className="mb-2"
                style={{ background: "black", color: "white" }}
                name={post.postedBy.name}
                src={post.postedBy.image && post.postedBy.image.url}
              />
              <div className="ml-3">
                <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
                  {post.postedBy.name}
                </span>
              </div>
            </div>
            <div className="text-muted">{moment(post.createdAt).fromNow()}</div>
          </div>
          <div className="card-body">{parse(post.content)}</div>
          <div className="card-footer">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex align-items-center">
              {state &&
              state.user &&
              post.likes &&
              post.likes.includes(state.user._id) ? (
                <img
                  onClick={() => handleUnlike(post._id)}
                  src="https://static.vecteezy.com/system/resources/thumbnails/000/422/468/small/Multimedia__28107_29.jpg"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                  alt="Like"
                />
              ) : (
                <img
                  onClick={() => handleLike(post._id)}
                  src="https://cdn-icons-png.flaticon.com/512/126/126473.png"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                  alt="Like"
                />
              )}
              <div style={{ marginRight: "30px" }}>
                {post.likes.length} likes
              </div>

              <img
                onClick={() => handleComment(post)}
                src="https://cdn-icons-png.freepik.com/256/134/134718.png?semt=ais_hybrid"
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  cursor: "pointer",
                }}
                alt="Comment"
              />

              <div style={{ marginRight: "20px" }}>
                <Link href={`/post/${post._id}`}>
                  {post.comments.length} comments
                </Link>
              </div>
              {state && state.user && state.user._id === post.postedBy._id && (
                <>
                  <img
                    onClick={() => router.push(`/user/post/${post._id}`)}
                    src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                    alt="Edit"
                    style={{
                      width: 20,
                      height: 20,
                      marginLeft: "auto",
                      marginRight: "30px",
                      cursor: "pointer",
                    }}
                  />
                  <img
                    onClick={() => handleDelete(post)}
                    src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
                    alt="Delete"
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: "30px",
                      cursor: "pointer",
                    }}
                  />
                </>
              )}
            </div>
          </div>
          {/* {2 comment mapping} */}
          {post.comments && post.comments.length > 0 && (
            <ol className="list-group">
              {post.comments.slice(0, commentsCount).map((c) => (
                <li
                  key={c._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar
                        className="mb-1 mr-3"
                        src={c.postedBy.image && c.postedBy.image.url}
                      />
                      <span
                        className=" px-3"
                        style={{ fontWeight: "bold", fontSize: "15px" }}
                      >
                        {c.postedBy.name}
                      </span>
                    </div>
                    <div
                      className="text-muted"
                      style={{ fontFamily: "italic" }}
                    >
                      {c.text}
                    </div>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.created).fromNow()}
                    {state &&
                      state.user &&
                      state.user._id === c.postedBy._id && (
                        <div className="ml-auto mt-3 ">
                          {" "}
                          <img
                            onClick={() => removeComment(post._id, c)}
                            src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
                            alt="Delete"
                            style={{
                              width: 15,
                              height: 15,
                              marginRight: "30px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};

export default Post;
