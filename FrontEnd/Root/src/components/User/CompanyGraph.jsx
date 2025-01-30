import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import axios from "axios";

ChartJS.register(...registerables);

const CompanyGraph = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState({
    name: "Loading...",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Reliance_Industries_Logo.svg/1200px-Reliance_Industries_Logo.svg.png",
  });

  const fetchStockData = async () => {
    try {
      const response = await axios.get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo"
      );
      console.log(response);
      
      const stockData = response.data["Time Series (Daily)"];
      const metaData = response.data["Meta Data"];

      setCompany({ name: metaData["2. Symbol"], logo: company.logo });

      // Parse stock data for the last 7 days
      const dates = Object.keys(stockData).slice(0, 7).reverse();
      const openPrices = dates.map((date) =>
        parseFloat(stockData[date]["1. open"])
      );
      const closePrices = dates.map((date) =>
        parseFloat(stockData[date]["4. close"])
      );
      const highPrices = dates.map((date) =>
        parseFloat(stockData[date]["2. high"])
      );
      const lowPrices = dates.map((date) =>
        parseFloat(stockData[date]["3. low"])
      );

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Open Price",
            data: openPrices,
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            pointBackgroundColor: "#3498db",
            tension: 0.4,
          },
          {
            label: "Close Price",
            data: closePrices,
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.2)",
            pointBackgroundColor: "#e74c3c",
            tension: 0.4,
          },
          {
            label: "High Price",
            data: highPrices,
            borderColor: "#2ecc71",
            backgroundColor: "rgba(46, 204, 113, 0.2)",
            pointBackgroundColor: "#2ecc71",
            tension: 0.4,
          },
          {
            label: "Low Price",
            data: lowPrices,
            borderColor: "#f1c40f",
            backgroundColor: "rgba(241, 196, 15, 0.2)",
            pointBackgroundColor: "#f1c40f",
            tension: 0.4,
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-900 rounded-lg shadow-lg">
    
    <div className="flex items-center space-x-4 text-gray-200 mb-6">
      <img
        src={company.logo}
        alt={`${company.name} Logo`}
        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
      />
      <h1 className="text-xl sm:text-2xl font-bold">{company.name}</h1>
    </div>
  
   
    <div className="w-full bg-gray-800 rounded-lg p-4 sm:p-6">
      {loading ? (
        <p className="text-gray-300 text-center">Loading data...</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: { color: "#fff" },
              },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              x: {
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: { color: "#fff" },
              },
              y: {
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: { color: "#fff" },
              },
            },
          }}
        />
      )}
    </div>
  </div>
  
  );
};

export default CompanyGraph;
