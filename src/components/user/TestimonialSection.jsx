import React, { useState } from "react";
import { testimonials as testimonialsData } from "../../utils/data";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState(testimonialsData);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  // Handler for new testimonial submission
  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    if (newTestimonial.name && newTestimonial.comment) {
      const testimonial = {
        id: testimonials.length + 1,
        name: newTestimonial.name,
        avatar: newTestimonial.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        rating: newTestimonial.rating,
        comment: newTestimonial.comment,
        date: "Just now",
      };
      setTestimonials([testimonial, ...testimonials]);
      setNewTestimonial({ name: "", rating: 5, comment: "" });
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-400"
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-gray-900/50 to-gray-900/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-linear-to-br from-[#FF8A65]/20 to-[#4FC3F7]/20 rounded-full blur-3xl bg-orb-1 glow-effect"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-linear-to-br from-[#81C784]/20 to-[#FF8A65]/20 rounded-full blur-3xl bg-orb-2 glow-effect"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-br from-[#4FC3F7]/20 to-[#81C784]/20 rounded-full blur-3xl bg-orb-3 glow-effect"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            WHAT OUR{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-[#FF8A65] via-[#81C784] to-[#4FC3F7]">
              CUSTOMERS
            </span>{" "}
            SAY
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to
            say about our premium PaceMaker footwear collection.
          </p>
        </div>

        {/* Testimonials Marquee */}
        <div className="relative overflow-hidden mb-16">
          <div className="testimonials-container flex animate-marquee hover:pause-marquee">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-gray-700/50 transition-all duration-300 mx-3 w-80 flex-none shadow-2xl hover:shadow-3xl relative overflow-hidden group"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#FF8A65]/10 via-[#81C784]/10 to-[#4FC3F7]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-linear-to-br from-[#FF8A65]/5 via-[#81C784]/5 to-[#4FC3F7]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Subtle glow effect */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-[#FF8A65]/20 via-[#81C784]/20 to-[#4FC3F7]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="w-10 h-10 bg-linear-to-b from-[#FF8A65] via-[#81C784] to-[#4FC3F7] rounded-full flex items-center justify-center text-white font-black text-base mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {renderStars(testimonial.rating)}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm relative z-10">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
            {/* Duplicate testimonials for seamless loop */}
            {testimonials.map((testimonial) => (
              <div
                key={`duplicate-${testimonial.id}`}
                className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-gray-700/50 transition-all duration-300 mx-3 w-80 flex-none shadow-2xl hover:shadow-3xl relative overflow-hidden group"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#FF8A65]/10 via-[#81C784]/10 to-[#4FC3F7]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-linear-to-br from-[#FF8A65]/5 via-[#81C784]/5 to-[#4FC3F7]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Subtle glow effect */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-[#FF8A65]/20 via-[#81C784]/20 to-[#4FC3F7]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="w-10 h-10 bg-linear-to-b from-[#FF8A65] via-[#81C784] to-[#4FC3F7] rounded-full flex items-center justify-center text-white font-black text-base mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {renderStars(testimonial.rating)}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm relative z-10">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* Custom CSS for marquee animation */}
          <style>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee {
              animation: marquee 45s linear infinite;
            }

            /* Mobile specific speed */
            @media (max-width: 768px) {
              .animate-marquee {
                animation-duration: 10s;
              }
            }

            .pause-marquee:hover {
              animation-play-state: paused;
            }

            .testimonials-container {
              width: 200%;
            }
          `}</style>
        </div>

        {/* Add Testimonial Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-black mb-4 text-center">
              Share Your Experience
            </h3>
            <form onSubmit={handleTestimonialSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4FC3F7] transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Rating
                </label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4FC3F7] transition-colors"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newTestimonial.comment}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      comment: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4FC3F7] transition-colors resize-none"
                  placeholder="Tell us about your experience with PaceMaker shoes..."
                  required
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-linear-to-b from-white via-gray-100 to-gray-300 text-black py-3 rounded-lg font-black text-base hover:shadow-lg transition-all transform  hover:from-gray-100 hover:via-gray-200 hover:to-gray-400"
                >
                  SUBMIT REVIEW
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
