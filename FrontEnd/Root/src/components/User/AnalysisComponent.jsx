import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { postAnalayis } from "../../actions/Community";
import { useSelector } from "react-redux";

const StockAnalysis = () => {
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState(null);
  const auth = useSelector((select)=>select.auth)
  const [loading,setLoading] = useState(false)
  console.log(auth.token);
  
  const analyzeCompany = async () => {
    
    const response = await postAnalayis(auth.token,companyName)
    console.log(response);
    if (response.status == 200){
      const mockResponse = response.data.data[0];
      setResult(mockResponse);
    }
    else{
      setResult(" ");
    }
  };

  const getSentimentColor = (label) => {
    switch (label) {
      case "positive":
        return "#4caf50";
      case "negative":
        return "#f44336";
      case "neutral":
        return "#ff9800"; 
      default:
        return "#9e9e9e";
    }
  };
  const getSentimentWords = (label) => {
    switch (label) {
      case "positive":
        return "Result : Positive ,It is better to purchase now...";
      case "negative":
        return "Result : Negative ,We are not recommending to purchase.. ";
      case "neutral":
        return " Result :Neutral , It's you choice.. "; 
      default:
        return "Result :Analysis is not available right now";
    }
  };

  return (
    
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Stock Sentiment Analysis</h1>
      <p className="text-gray-400 text-sm text-center mt-2">
        Analyze recent news about a company. This analysis is for demonstration purposes only and may not be accurate.
      </p>

      <div className="mt-4">
        <input
          type="text"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Enter company name (e.g., Reliance)"
          value={companyName}  
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <button
          onClick={analyzeCompany}
          className="w-full mt-3 bg-gray-700 text-gray-100 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Analyze
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-300">
            Sentiment for: <span className="text-gray-100">{companyName || "N/A"}</span>
          </h2>

          <div className="flex justify-center items-center mt-4">
            <div style={{ width: 150, height: 150 }}>
              <CircularProgressbar
                value={result.score * 100}
                text={`${(result.score * 100).toFixed(1)}%`}
                styles={buildStyles({
                  textColor: "#e0e0e0",
                  pathColor: getSentimentColor(result.label),
                  trailColor: "#424242",
                })}
              />
            </div>
          </div>

          <p className={`mt-4 text-xl font-semibold text-center`} style={{ color: getSentimentColor(result.label) }}>
            {getSentimentWords(result.label)}
          </p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        <p>
          <strong>Note:</strong> The result is based on simplified analysis and
          should not be considered as financial advice. Always perform in-depth research
          before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default StockAnalysis;
