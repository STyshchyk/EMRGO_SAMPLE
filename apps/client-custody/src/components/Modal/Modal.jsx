import ModalDialog from "./ModalDialog/ModalDialog";
import ModalShade from "./ModalShade/ModalShade";

const Modal = ({
  children,
  isOpen = false,
  onClose,
  width,
  title,
  shaded,
  showCloseButton,
  variant,
}) => {
  return (
    isOpen && (
      <ModalShade onClick={onClose} shaded={shaded}>
        <ModalDialog
          width={width}
          title={title}
          onClose={onClose}
          showCloseButton={showCloseButton}
          variant={variant}
        >
          {children}
        </ModalDialog>
      </ModalShade>
    )
  );
};

export default Modal;
