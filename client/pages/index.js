import ParallaxBG from "../components/cards/ParallaxBG";
import { UserContext } from "../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);
const home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);

  const [newsFeed, setNewsFeed] = useState([]);

  useEffect(() => {
    socket.on("new-post", (newPost) => {
      setNewsFeed([newPost, ...posts]);
    });
  }, []);

  const head = () => (
    <Head>
      <title>WittyWrites of mine</title>
      <meta
        name="description"
        content="A fully fledged social media network "
      />
      <meta
        property="og:description"
        content="WittyWrites is social media for everyone"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="WittyWrites" />
      <meta property="og:url" content="https://wittywrites.com" />
      <meta
        property="og:image:secure_url"
        content="http://wittywrites.com/images/default.jpg"
      />
    </Head>
  );

  const collection = newsFeed.length > 0 ? newsFeed : posts;
  return (
    <>
      {head()}
      <ParallaxBG url="/images/register.jpg" />
      <div className="container">
        <div className="row pt-5">
          {collection.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link legacyBehavior href={`post/view/${post._id}`}>
                <a>
                  <PostPublic key={post._id} post={post} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const { data } = await axios.get(`/posts`);

    return {
      props: { posts: data },
    };
  } catch (err) {
    console.error("Error fetching posts:", err);
    return {
      props: {
        posts: [],
      },
    };
  }
}

export default home;
