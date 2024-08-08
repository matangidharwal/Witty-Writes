const ParallaxBG = ({ url, children = "Witty Writes" }) => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: "url( " + url + " )",
        backgroundAttachment: "fixed",
        padding: "100px 0px 75px 0px",
        backgorudnrepeat: "no-repeat",
        backgroundSize: "cover",
        backgroungrdPosition: "center center",
        display: "block",
      }}
    >
      <h1
        className="display-1 text-center font-weight-bold "
        style={{ fontSize: "100px" }}
      >
        {children}
      </h1>
    </div>
  );
};

export default ParallaxBG;
