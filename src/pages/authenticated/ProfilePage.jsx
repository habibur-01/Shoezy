
import React from "react";
import Sidebar from "../../components/Profile/Sidebar";
import ProfileDetails from "../../components/Profile/ProfileDteails";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Container from "../../components/common/Container/Container";


const ProfilePage = () => {
  return (
    <Container >
      <Breadcrumb />
      <div className="flex mt-6 mb-12">
        <Sidebar />
        <ProfileDetails />
      </div>
    </Container>
  );
};

export default ProfilePage;
