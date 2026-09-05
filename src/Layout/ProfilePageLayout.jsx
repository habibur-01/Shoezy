
import React from "react";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import Container from "../components/common/Container/Container";
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
