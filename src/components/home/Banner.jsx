// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import './styles.css';

// import required modules
import { Navigation } from "swiper/modules";

const Banner = () => {
  return (
    <div>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        <SwiperSlide>
          <div
            className="h-[800px] w-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(../src/assets/images/banner/nike.png)`,
            }}
          >
            <div className="w-full h-full flex justify-center items-center">
              <div className="container space-y-8">
                <h3 className="text-xl text-[var(--color-white)] uppercase">
                  New Sports Collection
                </h3>
                <h1 className="text-6xl font-medium text-[var(--color-white)] capitalize">
                  Nike Free run Men's <br /> Running Shoes
                </h1>
                <p className="text-lg text-[var(--color-white)] font-light w-[600px]">
                  The shoe also features Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Sint, maiores!
                </p>
                <div>
                  <button className="bg-[var(--color-background)] uppercase text-base text-[var(--color-black)] px-5 py-2.5 font-medium">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-[800px] w-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(../src/assets/images/banner/nike.png)`,
            }}
          >
            <div className="w-full h-full flex justify-center items-center">
              <div className="container space-y-8">
                <h3 className="text-xl text-[var(--color-white)] uppercase">
                  New Sports Collection
                </h3>
                <h1 className="text-6xl font-medium text-[var(--color-white)] capitalize">
                  Nike Free run Men's <br /> Running Shoes
                </h1>
                <p className="text-lg text-[var(--color-white)] font-light w-[600px]">
                  The shoe also features Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Sint, maiores!
                </p>
                <div>
                  <button className="bg-[var(--color-background)] uppercase text-base text-[var(--color-black)] px-5 py-2.5 font-medium">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
