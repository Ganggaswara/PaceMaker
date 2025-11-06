import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About PaceMaker</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              PaceMaker was born from a passion for athletic excellence and a commitment to providing
              high-quality footwear for athletes of all levels. Founded in 2020, we've grown from a
              small startup to a trusted brand in the athletic footwear industry.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To empower every athlete with the perfect pair of shoes that combines cutting-edge
              technology, superior comfort, and stylish design. We believe that the right footwear
              can make a difference in performance and confidence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose PaceMaker?</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Premium quality materials and construction</li>
              <li>Innovative technologies for enhanced performance</li>
              <li>Wide range of styles for running, basketball, training, and hiking</li>
              <li>Comfortable fit for all-day wear</li>
              <li>Excellent customer service and satisfaction guarantee</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Innovation</h3>
                <p className="text-gray-300">
                  We continuously research and develop new technologies to improve athletic performance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Sustainability</h3>
                <p className="text-gray-300">
                  Committed to eco-friendly practices in manufacturing and packaging.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Inclusivity</h3>
                <p className="text-gray-300">
                  Shoes designed for athletes of all genders, ages, and skill levels.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Quality</h3>
                <p className="text-gray-300">
                  Every pair undergoes rigorous testing to ensure durability and comfort.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Join the PaceMaker Community</h2>
            <p className="text-gray-300 mb-6">
              Whether you're a professional athlete or just starting your fitness journey,
              PaceMaker is here to support you every step of the way.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              Shop Now
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;