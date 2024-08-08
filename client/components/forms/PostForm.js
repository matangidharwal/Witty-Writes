import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import Loading from "../Loading";

const PostForm = ({
  content,
  setContent,
  postSubmit,
  handleImage,
  uploading,
  image,
}) => {
  return (
    //if we put onsubmit on form...pressing enter will submit the form and submitting button will also....but if on button then only button will submit

    <div className="card">
      <div className="card-body pb-3">
        <form className="form-group">
          <ReactQuill
            theme="snow"
            onChange={(e) => setContent(e)}
            value={content}
            placeholder="Write something... "
            className="form-control mb-1"
          />
        </form>
      </div>

      <div className="card-footer d-flex justify-content-between text-muted">
        <button
          disabled={!content}
          onClick={postSubmit}
          className="btn  btn-primary btn-sm mt-1"
        >
          Post
        </button>
        <label htmlFor="file" style={{ cursor: "pointer" }}>
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
      </div>
    </div>
  );
};

export default PostForm;
