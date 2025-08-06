import { useContext, createContext, useEffect, useState } from "react";
const ModalContext = createContext();
export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const showModal = (content) => {
    setIsOpen(true);
    setModalContent(content);
  };
  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };
  return (
    <ModalContext.Provider value={{ closeModal, showModal, isOpen, setIsOpen }}>
      {children}
      {isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded shadow-md w-96"
          >
            {modalContent}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
// export const useModal = useContext(ModalContext);
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
