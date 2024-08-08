import Loading from "../Loading";

const AuthForm = ({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  loading,
  page,
  username,
  setUsername,
  about,
  setAbout,
  profileUpdate,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {profileUpdate && (
        <>
          {" "}
          <div className="form-group p-2">
            <small>
              <label htmlFor="" className="text-muted">
                Username
              </label>
            </small>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              className="form-control"
              placeholder="Enter name "
            />
          </div>
          <div className="form-group p-2">
            <small>
              <label htmlFor="" className="text-muted">
                About
              </label>
            </small>
            <input
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              type="text"
              className="form-control"
              placeholder="Write about yourself"
            />
          </div>
        </>
      )}

      {page !== "login" && (
        <div className="form-group p-2">
          <small>
            <label htmlFor="" className="text-muted">
              Your Name
            </label>
          </small>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="form-control"
            placeholder="Enter name "
          />
        </div>
      )}

      <div className="form-group p-2">
        <small>
          <label htmlFor="" className="text-muted">
            Email Address
          </label>
        </small>
        <input
          disabled={profileUpdate}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="form-control"
          placeholder="Enter email "
        />
      </div>

      <div className="form-group p-2">
        <small>
          <label htmlFor="" className="text-muted">
            Password
          </label>
        </small>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="form-control"
          placeholder="Enter password "
        />
      </div>
      {page !== "login" && (
        <>
          <div className="form-group p-2">
            <small>
              <label htmlFor="" className="text-muted">
                Pick a question
              </label>
            </small>
            <select className="form-control">
              <option>What is your favourite color?</option>
              <option>What is your best friend's name?</option>
              <option>What city were you born in?</option>
            </select>
            <small className="form-text text-muted">
              You can use this to reset your password if forgotten
            </small>
          </div>
          <div className="form-group p-2">
            <input
              onChange={(e) => setSecret(e.target.value)}
              value={secret}
              type="text"
              className="form-control"
              placeholder="Write your answer here"
            />
          </div>
        </>
      )}
      <div className="form-group p-2">
        {/*  if loading is true then show the spinner else show the button else show the button */}
        {loading ? (
          <Loading />
        ) : (
          <button
            disabled={
              profileUpdate
                ? loading
                : page === "login"
                ? !email || !password || loading
                : !name || !password || !secret || !email || loading
            }
            className="btn btn-primary col-12"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};
export default AuthForm;
