import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showAlert = () => setIsAlertVisible(true);
  const hideAlert = () => setIsAlertVisible(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, isAlertVisible, showAlert, hideAlert }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);