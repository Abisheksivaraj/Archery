import { useState } from "react";
import backgroundImage from "../assets/bgImage.jpg";
import logoImage from "../assets/companyLogo.jpg";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Admin Login Attempted", { email, password });
  };

  return (
    <div
      className="p-3 flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`, // use the imported image
      }}
    >
      <div className="bg-white shadow-lg rounded-2xl opacity-90 p-8 w-full sm:max-w-sm md:max-w-md lg:w-[30rem]">
        <div className="flex justify-center mb-6">
          <img
            src={logoImage}
            alt="Company Logo"
            className="w-full object-cover"
          />
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
