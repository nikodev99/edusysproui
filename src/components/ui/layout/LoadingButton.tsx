import { Button, Modal } from "antd";
import {FC, ReactNode, useState} from "react";

interface LoadingButtonProps {
  index?: number; // Index to track the button state
  isDisabled?: boolean; // To disable the button
  loadingDelay?: number; // Delay before showing the confirmation dialog
  buttonText: ReactNode; // The text to display on the button
  modalTitle?: ReactNode; // Title of the confirmation modal
  modalContent?: ReactNode; // Content of the confirmation modal
  okText?: ReactNode; // Confirm button text in modal
  cancelText?: ReactNode; // Cancel button text in modal
  onConfirm: () => Promise<void> | void; // Logic to handle when the confirmation button in the modal is clicked
}

export const LoadingButton: FC<LoadingButtonProps> = ({
  index = 0,
  isDisabled = false,
  loadingDelay = 2000,
  buttonText,
  modalTitle = "Poursuivre ?",
  modalContent = "Souhaitez vous vraiment poursuivre ?",
  okText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
}) => {
  const [loading, setLoading] = useState<boolean[]>([]);

  const handleClick = () => {
    setLoading((prevLoading) => {
      const newLoading = [...prevLoading]
      newLoading[index] = true
      return newLoading
    });

    setTimeout(() => {
      setLoading((prevLoading) => {
        const newLoading = [...prevLoading]
        newLoading[index] = false
        return newLoading
      });

      Modal.confirm({
        title: modalTitle,
        content: modalContent,
        okText: okText,
        cancelText: cancelText,
        onOk: async () => {
          if (onConfirm) {
            await onConfirm(); // Call the confirmation logic passed as a prop
          }
        },
      });
    }, loadingDelay);
  };

  return (
    <Button
      type="primary"
      disabled={isDisabled}
      loading={loading[0]}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  );
};