import Modal from "react-bootstrap/esm/Modal";

export const WModal = (props) => {
  return (
    <Modal
      show={props.visible}
      onHide={() => props.close()}
      centered={props.centered ?? true}
      size={props.size || "xl"}
      contentClassName={props.className || ""}
      keyboard={props.keyboard ?? true}

      // this is required in order to be able to focus the Intellisense
      enforceFocus={false}
    >
      {props.children}
    </Modal>
  );
}
