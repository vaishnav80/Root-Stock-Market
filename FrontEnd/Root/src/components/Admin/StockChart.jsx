import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const StockChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Timestamps
    datasets: [
      {
        label: 'Stock Price',
        data: [], // Prices
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  });

  useEffect(() => {
    // Simulate real-time stock data
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      const randomPrice = Math.random() * 100 + 1000; // Simulated stock price

      setChartData((prevData) => {
        const updatedLabels = [...prevData.labels, currentTime].slice(-10); // Keep last 10 timestamps
        const updatedData = [
          ...prevData.datasets[0].data,
          randomPrice,
        ].slice(-10); // Keep last 10 prices

        return {
          labels: updatedLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: updatedData,
            },
          ],
        };
      });
    }, 10000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-black p-4 rounded-lg shadow-md">
      <h2 className="text-white text-center text-xl font-semibold mb-4">
        Real-Time Stock Price
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'white',
              },
            },
          },
          scales: {
            x: {
              ticks: { color: 'white' },
              grid: { display: false },
            },
            y: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
          },
        }}
      />
    </div>
  );
};

export default StockChart;
