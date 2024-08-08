import { Avatar } from "@chakra-ui/react";
import { UserContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import { Box, Text, Stack, Divider } from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";

const Following = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (state && state.token) {
      fetchFollowing();
    }
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get(`/user-following`);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put(`/user-unfollow`, { _id: user._id });

      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);

      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="row col-md-6 offset-md-3 p-4 ">
      <Stack spacing={3}>
        {people.map((person, index) => (
          <Box key={index}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" justifyContent="center">
                <Avatar
                  size="sm"
                  src={person.image && person.image.url}
                  cursor="pointer"
                  marginRight="1rem"
                />
                <Text>{person.name}</Text>
              </Box>
              <Text
                as="span"
                color="blue"
                cursor="pointer"
                onClick={() => handleUnfollow(person)}
              >
                Unfollow
              </Text>
            </Box>
            {index < people.length - 1 && <Divider mt={2} />}
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default Following;
