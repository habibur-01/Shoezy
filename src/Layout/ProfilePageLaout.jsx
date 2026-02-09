
import React from "react";
import ProfileDetails from "../components/Profile/ProfileDteails";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import Container from "../components/common/Container/Container";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/navbar/Navbar";
import ProfilePage from "../pages/authenticated/ProfilePage";
import Footer from "../components/common/Footer/Footer";


const ProfilePageLayout = () => {
  return (
    <div>

      <Navbar />
      <Container >
        <Breadcrumb />
        <ProfilePage />
      </Container>
      <Footer/>
    </div>
  );
};

export default ProfilePageLayout;
