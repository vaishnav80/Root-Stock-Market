import React, { useState } from "react";
import Header from "../../components/User/Header";
import Navbar from "../../components/User/Navbar";

const newsData = [
  {
    id: 1,
    title: "Closing Bell: Sensex up 843 points, Nifty above 24,750 as market makes a sharp recovery",
    image: "https://via.placeholder.com/300x200", // Replace with actual image URL
    category: "news",
  },
  {
    id: 2,
    title: "Sensex touches a record high of 63,000 points as markets rally",
    image: "https://via.placeholder.com/300x200", // Replace with actual image URL
    category: "latest",
  },
  {
    id: 4,
    title: "Sensex touches a record high of 63,000 points as markets rally",
    image: "https://via.placeholder.com/300x200", // Replace with actual image URL
    category: "latest",
  },
  {
    id: 3,
    title: "Nifty hits an all-time high; financials lead the surge",
    image: "https://via.placeholder.com/300x200", // Replace with actual image URL
    category: "popular",
  },
  // Add more news items here
];

const StockMarketNews = () => {
  const [activeTab, setActiveTab] = useState("news");

  const filteredNews = newsData.filter((news) => news.category === activeTab);

  return (
    <div className="min-h-screen bg-black text-white">
        <Header/>
      {/* Tabs */}
      <div className="flex justify-center space-x-4 py-4">
        {["news", "latest", "popular"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 border rounded-full ${
              activeTab === tab
                ? "bg-white text-black"
                : "border-white text-white hover:bg-gray-800"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition transform duration-300"
          >
            <img src={news.image} alt={news.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">{news.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockMarketNews;
