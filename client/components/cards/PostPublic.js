import parse from "html-react-parser";
import { useContext } from "react";
import moment from "moment";
import { Avatar } from "@chakra-ui/react";
import PostImage from "../images/PostImage";
import { UserContext } from "../../context";

const PostPublic = ({ post, commentsCount = 2 }) => {
  const [state] = useContext(UserContext);

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
                {post.comments.length} comments
              </div>
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

export default PostPublic;
