import { Avatar } from "@chakra-ui/react";
import { useContext } from "react";
import { UserContext } from "../../context";
import { Box, Text, Stack, Divider } from "@chakra-ui/react";
import Link from "next/link";
const People = ({ people, handleFollow, handleUnfollow }) => {
  const [state] = useContext(UserContext);
  return (
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
              <Link href={`/user/${person.username}`}>
                {" "}
                <Text>{person.name}</Text>
              </Link>
            </Box>
            {state &&
            state.user &&
            person.followers &&
            person.followers.includes(state.user._id) ? (
              <Text
                as="span"
                color="blue"
                cursor="pointer"
                onClick={() => handleUnfollow(person)}
              >
                UnFollow
              </Text>
            ) : (
              <Text
                as="span"
                color="blue"
                cursor="pointer"
                onClick={() => handleFollow(person)}
              >
                follow
              </Text>
            )}
          </Box>
          {index < people.length - 1 && <Divider mt={2} />}
        </Box>
      ))}
    </Stack>
  );
};

export default People;
