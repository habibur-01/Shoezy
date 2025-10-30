import React from "react";
import Container from "../common/Container/Container";
import TitleSection from "../common/header/TitleSection";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import user from "../../assets/images/icon/user.svg";

const Testimonials = () => {
  return (
    <Container>
      <TitleSection title={"What Our Client Say"} />
      <div>
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          modules={[FreeMode, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="flex flex-col justify-center items-center text-center py-6">
              <h3 className="text-xl font-semibold mb-4">
                “Reliable Product, Consistently.”
              </h3>
              <p className="text-gray-500 mb-8 max-w-lg text-sm">
                There are many variations of passages of lorem toavailable but
                majority have suffered alteration some form by to injected
                humour or words the 1500s is reproduced below for those
                interested.
              </p>

              <div className="flex flex-col items-center">
                <img
                  src={user}
                  alt="Stephnie K. Mack"
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h4 className="font-semibold text-lg">Stephnie K. Mack</h4>
                <p className="text-gray-500">Web Designer</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <div className="flex flex-col justify-center items-center text-center py-6">
              <h3 className="text-xl font-semibold mb-4">
                “Reliable Product, Consistently-2.”
              </h3>
              <p className="text-gray-500 mb-8 max-w-lg text-sm">
                There are many variations of passages of lorem toavailable but
                majority have suffered alteration some form by to injected
                humour or words the 1500s is reproduced below for those
                interested.
              </p>

              <div className="flex flex-col items-center">
                <img
                  src={user}
                  alt="Stephnie K. Mack"
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h4 className="font-semibold text-lg">Stephnie K. Mack</h4>
                <p className="text-gray-500">Web Designer</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <div className="flex flex-col justify-center items-center text-center py-6">
              <h3 className="text-xl font-semibold mb-4">
                “Reliable Product, Consistently-3.”
              </h3>
              <p className="text-gray-500 mb-8 max-w-lg text-sm">
                There are many variations of passages of lorem toavailable but
                majority have suffered alteration some form by to injected
                humour or words the 1500s is reproduced below for those
                interested.
              </p>

              <div className="flex flex-col items-center">
                <img
                  src={user}
                  alt="Stephnie K. Mack"
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h4 className="font-semibold text-lg">Stephnie K. Mack</h4>
                <p className="text-gray-500">Web Designer</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </Container>
  );
};

export default Testimonials;
