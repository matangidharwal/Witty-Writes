import { Avatar, Card, CardBody, Text, Image } from "@chakra-ui/react";
import { UserContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";

const Username = () => {
  const [state, setState] = useContext(UserContext);
  const [user, setUser] = useState({});
  const route = useRouter();

  useEffect(() => {
    if (route.query.username) {
      fetchUser();
    }
  }, [route.query.username]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${route.query.username}`);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(user);
  return (
    <div className="row col-md-6 offset-md-3 p-4 pt-5 pb-5">
      <Card>
        <CardBody>
          <Image
            src={user && user.image && user.image.url}
            alt={user && user.name}
            borderRadius="lg"
          />
          <Text>View a summary of all your customers over the last month.</Text>
          <p className="pt-2 text-muted">
            Joined {moment(user.createdAt).fromNow()}
          </p>
          <div className="d-flex justify-content-between">
            <span className="btn btn-sm">
              {user.followers && user.followers.length} Followers
            </span>
            <span className="btn btn-sm">
              {user.following && user.following.length} Following
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Username;
