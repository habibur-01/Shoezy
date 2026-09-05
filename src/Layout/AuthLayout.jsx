import React from 'react';
import { Outlet } from 'react-router-dom';
// import AuthNavbar from '../components/common/navbar/AuthNavbar';

const AuthLayout = () => {
    return (
        <div>
            {/* <AuthNavbar /> */}
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;