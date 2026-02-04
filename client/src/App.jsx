import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Login,
  SignUp,
  HostHome,
  Header,
  Footer,
  Listing,
  HomePage,
  HostCreateListing,
  HostViewListing,
  HostEditListing,
  PaymentTest,
  VerifyOTP,
  BookingSuccess

} from "./Components/Index/index";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host-home" element={<HostHome />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/listing/:id/pay" element={<PaymentTest />} />

          <Route path="/create-listing" element={<HostCreateListing />} />
          <Route path="/-listing/:id" element={<HostViewListing />} />
          <Route path="/edit-listing/:id" element={<HostEditListing />} />


        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
