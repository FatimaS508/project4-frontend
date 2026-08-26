import { useState } from "react";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import OneCategory from "./pages/oneCategory";
import RequestSupport from "./pages/RequestSupport";
import AllRequests from "./pages/AllRequests";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div>
      <Navbar/>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/category/:categoryId" element={<ProtectedRoute><OneCategory /></ProtectedRoute>}/>
        <Route path="/request/:subcategoryId" element={<ProtectedRoute><RequestSupport/></ProtectedRoute>}></Route>
        <Route path="/requests" element={<ProtectedRoute><AllRequests /></ProtectedRoute>}/>
      </Routes>
    </div>
  );
}

export default App;
