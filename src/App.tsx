// import React from 'react'
import Home from "./pages/Home";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        expand
        richColors
        theme="dark"
        toastOptions={{
          style: {
            border: "1px solid #333",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        <Route path="/*" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
