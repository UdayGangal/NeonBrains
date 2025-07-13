import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const noNavFoot = location.pathname === "/login";
  return (
    <>
      {noNavFoot ? null : <Navbar />}
      <Outlet />
      {noNavFoot ? null : <Footer />}
    </>
  );
}

export default Layout;
