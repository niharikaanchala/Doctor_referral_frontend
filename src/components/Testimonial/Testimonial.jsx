import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import patientAvatar from "../../assets/images/patient-avatar.png";
import { HiStar } from "react-icons/hi";

const testimonials = [
  {
    id: 1,
    name: "Muhibur Rahman",
    avatar: patientAvatar,
    review:
      "I have taken medical services from them. They treat so well and provide the best medical care.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophia Patel",
    avatar: patientAvatar,
    review:
      "Booking appointments was so easy. The doctors are very professional and caring.",
    rating: 5,
  },
  {
    id: 3,
    name: "John Smith",
    avatar: patientAvatar,
    review:
      "Excellent platform! I could quickly find a specialist and get treated without delays.",
    rating: 4,
  },
  {
    id: 4,
    name: "Aarav Mehta",
    avatar: patientAvatar,
    review:
      "Very convenient and reliable service. I received timely reminders and support throughout.",
    rating: 5,
  },
];

const Testimonial = () => {
  return (
    <div className="mt-[30px] lg:mt-[55px]">
      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 0 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="py-[30px] px-5 rounded-[13px] shadow-md">
              <div className="flex items-center gap-[13px]">
                <img
                  src={t.avatar}
                  alt={`${t.name} Avatar`}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div>
                  <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                    {t.name}
                  </h4>
                  <div className="flex items-center gap-[2px]">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <HiStar
                        key={i}
                        className="text-yellowColor w-[18px] h-5"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[16px] leading-7 mt-4 text-textColor font-[400]">
                "{t.review}"
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
