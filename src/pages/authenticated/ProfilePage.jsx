import React from 'react';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { Outlet } from 'react-router-dom';

const ProfilePage = () => {
    return (
        <div className="flex mt-6 mb-12">
            <ProfileSidebar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default ProfilePage;