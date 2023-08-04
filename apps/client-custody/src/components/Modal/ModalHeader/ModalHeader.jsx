import CloseIcon from "@mui/icons-material/Close";

import * as Styles from "./ModalHeader.styles";

const ModalHeader = ({ children, onClose }) => {
  return (
    <Styles.ModalHeader>
      <Styles.Content>{children}</Styles.Content>

      {onClose && (
        <Styles.CloseButton onClick={onClose}>
          <CloseIcon />
        </Styles.CloseButton>
      )}
    </Styles.ModalHeader>
  );
};
export default ModalHeader;
