import React from "react";
import { heroSlides } from "../utils/data";

const HeroSection = ({ currentSlide, setCurrentSlide }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Activate animations immediately when component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // Increased delay to 300ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10 z-10"></div>

      {/* Hero Slides */}
      <div className="absolute inset-0 w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            <img
              src={slide.image}
              alt={`Hero Background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-2000 ease-out transform ${
                index === currentSlide && isLoaded ? "scale-104" : "scale-100"
              }`}
              style={{
                transform: index === currentSlide && isLoaded
                  ? "scale(1.02)"
                  : "scale(1)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30">
              <h2
                className={`text-[100px] md:text-[100px] font-serif opacity-70 -mt-16 transition-all duration-600 delay-300 ml-[20px] ease-in-out transform ${
                  index === currentSlide && isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{
                  fontFamily: "'Times New Roman', serif",
                  letterSpacing: "0.05em",
                  background:
                    "linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 25%, #E5E7EB 50%, #F3F4F6 75%, #FFFFFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow:
                    "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
                  fontWeight: "400",
                  position: "relative",
                }}
              >
                {slide.title}

                {/* Sparkle effect on text */}
                {index === currentSlide && isLoaded && (
                  <>
                    <div
                      className="absolute -top-2 -left-2 w-1 h-1 bg-white rounded-full opacity-80 animate-ping"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="absolute -top-1 -right-4 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute -bottom-3 left-2 w-1 h-1 bg-white rounded-full opacity-70 animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="absolute top-1 -left-6 w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-ping"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </>
                )}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide(
            (current) => (current - 1 + heroSlides.length) % heroSlides.length
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() =>
          setCurrentSlide((current) => (current + 1) % heroSlides.length)
        }
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
