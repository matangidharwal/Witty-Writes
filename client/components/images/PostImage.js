const PostImage = ({ url }) => {
  return (
    <div
      style={{
        backgroundImage: "url(" + url + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
      }}
    ></div>
  );
};
export default PostImage;
