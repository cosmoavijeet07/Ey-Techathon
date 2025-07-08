// import React, { useState } from "react";
// import "./DataValidation.css"; // Import external CSS

// function DataValidation() {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [valid, setValid] = useState(true);

//   const validateData = () => {
//     const { name, email, phone } = data;
//     // Example validation logic (you can expand this)
//     if (name && email && phone) {
//       setValid(true);
//       alert("Data is valid!");
//     } else {
//       setValid(false);
//       alert("Please fill all the fields.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="dashboard-wrapper">
//       <header className="dashboard-header">
//         <h1 className="dashboard-title">Data Validation</h1>
//       </header>

//       <main className="dashboard-main">
//         <div className="glass-card validation-container">
//           <div className="input-group">
//             <label className="input-label">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={data.name}
//               onChange={handleChange}
//               className="input-field"
//             />
//           </div>
//           <div className="input-group">
//             <label className="input-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={data.email}
//               onChange={handleChange}
//               className="input-field"
//             />
//           </div>
//           <div className="input-group">
//             <label className="input-label">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={data.phone}
//               onChange={handleChange}
//               className="input-field"
//             />
//           </div>
//           <button
//             onClick={validateData}
//             className={`validation-button ${
//               valid ? "valid" : "invalid"
//             }`}
//           >
//             Validate Data
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default DataValidation;
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

function Button({ children, className, ...props }) {
  return (
    <button className={`px-8 py-3 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-lg ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function PremiumLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 backdrop-blur-lg bg-white/90 shadow-lg border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">EY Brand</h1>
        <div className="hidden md:flex gap-10 items-center text-gray-800 text-lg">
          <a href="#" className="hover:text-yellow-500 transition-colors">Home</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Solutions</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Insights</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Contact</a>
          <Button>Get Started</Button>
        </div>
        <button className="md:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div className="md:hidden flex flex-col items-center gap-6 py-8 bg-white text-black fixed w-full top-16 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <a href="#" className="hover:text-yellow-500 transition-colors">Home</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Solutions</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Insights</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Contact</a>
          <Button className="mt-4">Get Started</Button>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="text-center py-48 px-6 md:px-12 bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Building a Better Working World.
        </motion.h1>
        <p className="text-gray-800 text-lg max-w-3xl mx-auto mb-8">
          Empowering businesses with cutting-edge solutions and strategic insights.
        </p>
        <div className="flex justify-center gap-6">
          <Button>Get Started</Button>
          <button className="px-8 py-3 rounded-full text-black border border-gray-800 bg-gray-100 hover:bg-gray-300 transition-all font-semibold shadow-md">
            Learn More
          </button>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 px-6 md:px-20 bg-white text-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-16 tracking-tight text-gray-900">Innovative Solutions</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {["Business Transformation", "AI & Digital Strategy", "Sustainable Growth"].map((title, index) => (
              <motion.div key={index} className="p-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-300 hover:from-gray-200 hover:to-gray-400 transition-all text-center shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{title}</h3>
                <p className="text-gray-800">Driving excellence and innovation for organizations worldwide.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-24 bg-gray-900 text-white">
        <h2 className="text-5xl font-bold mb-6">Partner with Us</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-300">
          Transform your business with expert-driven strategies and innovative solutions.
        </p>
        <Button className="bg-yellow-500 text-black text-lg font-bold hover:bg-yellow-400 shadow-xl">Get Started</Button>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 EY Brand. All rights reserved.</p>
      </footer>
    </div>
  );
}
