import { Suspense } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/common/navbar/Navbar";
import Loader from "../components/common/loader/Loader";
import Footer from "../components/common/Footer/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </Suspense>
      <Footer/>
    </div>
  );
};

export default MainLayout;
