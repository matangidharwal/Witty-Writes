import ParallaxBG from "../../../components/cards/ParallaxBG";
import axios from "axios";
import PostPublic from "../../../components/cards/PostPublic";
import Head from "next/head";

const home = ({ post }) => {
  const head = () => (
    <Head>
      <title>WittyWrites is my own website i am proud of</title>
      <meta name="description" content={post.content} />
      <meta
        property="og:description"
        content="WittyWrites is social media for everyone"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="WittyWrites" />
      <meta
        property="og:url"
        content={`https://wittywrites.com/post.view/${post._id}`}
      />
      <meta property="og:image:secure_url" content={img(post)} />
    </Head>
  );

  const img = (post) => {
    if (post.image) {
      return post.image.url;
    } else {
      return "http://wittywrites.com/images/default.jpg";
    }
  };
  return (
    <>
      {head()}
      <ParallaxBG url="/images/register.jpg" />
      <div className="container">
        <div className="row pt-5">
          <div key={post._id} className="col-md-8 offset-md-2">
            <PostPublic key={post._id} post={post} />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { data } = await axios.get(`/post/${ctx.params._id}`);

  return {
    props: { post: data },
  };
}

export default home;
