import React from "react";
import Header from "../../components/User/Header";
import Sidebar from "../../components/User/Sidebar";
import Navbar from "../../components/User/Navbar";
import StockChart from "../../components/Admin/StockChart";
import Watchlist from "../../components/User/Watchlist";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CompanyGraph from "../../components/User/CompanyGraph";
import Footer from "../../components/User/Footer";
import { useSelector } from "react-redux";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const  auth  = useSelector((state) => state.auth);  
  return (
    <div className="bg-black">
      <Header className="mt-96" />
      <div className="flex">
        <div className="w-96 mt-2">
          <Sidebar />
        </div>
        <div className="mx-12 mt-4 flex-grow">
          <Navbar />
          <StockChart />
          <div className="flex space-x-4">
            <div className="w-1/2 mt-14">
              <Watchlist />
            </div>
            <div className="w-1/2">
              <div className=" p-4  rounded-lg shadow-lg h-[400px]">
                <CompanyGraph />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[200px] w-full bg-black">
          <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
