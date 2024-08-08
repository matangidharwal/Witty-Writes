import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import { Avatar } from "@chakra-ui/react";
//we dont use "to" in nextjs, we use "href" instead
const Nav = () => {
  const [current, setCurrent] = useState("");

  //process.browser is used to check if the code is running on the client side and not server side
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const router = useRouter();
  const [state, setState] = useContext(UserContext);

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
    <>
      <ul
        className="nav bg-dark d-flex  justify-content-end py-2 "
        style={{ gap: "80px" }}
      >
        <li
          href="/"
          className={`nav-item `}
          style={{ marginRight: "auto", marginLeft: "2rem" }}
        >
          <Link href="/">
            <Avatar size="sm" width="50px" src="/images/logo.png" />
          </Link>
        </li>

        <li className={`nav-item ${current === "/" && "active"}`}>
          <Link href="/" className="nav-link text-light logo">
            WittyWrites
          </Link>
        </li>

        {state !== null ? (
          <>
            <div className="dropdown mx-4">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {state && state.user && state.user.name}
              </button>
              <ul className="dropdown-menu">
                <li className={`dropdown-item `}>
                  <Link href="/user/dashboard" className={` dropdown-item  `}>
                    Dashboard
                  </Link>
                </li>
                <li className={`dropdown-item `}>
                  <Link
                    href="/user/profile/update"
                    className={` dropdown-item  `}
                  >
                    Profile
                  </Link>
                </li>
                {state.user.role === "Admin" && (
                  <li className={`dropdown-item `}>
                    <Link href="/admin" className={` dropdown-item  `}>
                      Admin
                    </Link>
                  </li>
                )}
                <li className="dropdown-item">
                  <a
                    onClick={logout}
                    className="nav-link dropdown-item"
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <li className={`nav-item ${current === "/login" && "active"}`}>
              <Link href="/login" className="nav-link text-light">
                Login
              </Link>
            </li>
            <li className={`nav-item ${current === "/register" && "active"}`}>
              <Link href="/register" className="nav-link text-light">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default Nav;
