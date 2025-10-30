import { Suspense } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/common/navbar/Navbar";
import Loader from "../components/common/loader/Loader";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

export default MainLayout;
