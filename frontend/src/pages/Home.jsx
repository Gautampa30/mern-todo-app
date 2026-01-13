import React from "react";
import Navbar from "../Components/Navbar.jsx";
import TodoContainer from "../Components/TodoContainer.jsx";

const Home = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <TodoContainer />
    </div>
  );
};

export default Home;
