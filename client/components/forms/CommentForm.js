import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export const CommentForm = ({
  addComment,
  comment,
  setComment,
  visible,
  setVisible,
}) => {
  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comments</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={addComment}>
            <input
              type="text"
              className="form-control"
              placeholder="Write something..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-primary btn-sm btn-block mt-3">
              Submit
            </button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
