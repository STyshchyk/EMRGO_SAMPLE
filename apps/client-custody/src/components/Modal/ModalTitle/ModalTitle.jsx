import * as Styles from "./ModalTitle.styles";

const ModalTitle = ({ children, className }) => {
  return <Styles.ModalTitle className={className}>{children}</Styles.ModalTitle>;
};

export default ModalTitle;
