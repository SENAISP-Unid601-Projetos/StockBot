import React from "react"; 
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

function MainApp({ router }) {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </>
  );
}

export default MainApp;