import { Button } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
const Loading = () => {
  return (
    <Stack
      direction="row"
      spacing={4}
      align="center"
      width="100%"
      justifyContent="center"
      py={4}
    >
      <Button
        bg="black"
        color="white"
        isLoading
        loadingText="Loading"
        borderColor="black"
        variant="outline"
        spinnerPlacement="start"
      >
        Submit
      </Button>
    </Stack>
  );
};

export default Loading;
