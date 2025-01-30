import React, { useEffect, useState } from "react";
import Header from "../../components/User/Header";
import { getNews } from "../../actions/Lesson";
import { useSelector } from "react-redux";

const StockMarketNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(12); 
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchData() {
      const response = await getNews(auth.token);
      setNewsData(response.data.data);
    }
    fetchData();
  }, [auth.token]);

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-black text-white">
  <Header />

  {currentNews && currentNews.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {currentNews.map((news, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
        >
          <img
            src={news.image_url}
            alt={news.headline}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <a href={news.link}>
              <h3 className="text-lg font-bold text-white">{news.headline}</h3>
            </a>
            <p>{news.uploaded_time}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="min-h-screen">
      <div className="flex items-center mt-28 justify-center">
        <img
          src="/assets/1.png"
          alt="Loading"
          className="w-20 h-20 animate-bounce"
        />
      </div>
    </div>
  )}

  {newsData.length > newsPerPage && (
    <div className="flex justify-center mt-6">
      <ul className="flex space-x-2">
        {Array.from(
          { length: Math.ceil(newsData.length / newsPerPage) },
          (_, i) => i + 1
        ).map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};

export default StockMarketNews;
