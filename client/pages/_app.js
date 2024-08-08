import { UserProvider } from "../context/index.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav.js";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link rel="stylesheet" href="/css/styles.css"></link>
      </Head>
      <Nav />
      <ToastContainer position="top-center" />
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </UserProvider>
  );
}
