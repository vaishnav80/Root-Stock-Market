import React, { useState, useEffect } from "react";
import Header from "../../components/User/Header";

const lessons = [
  {
    id: 1,
    title: "Getting Started",
    contents: [
      {
        heading: "Introduction to Stock Market",
        content: "Learn the basics of what the stock market is and how it works.",
        video: "https://youtu.be/p7HKvqRl_Bo",
        image: "https://via.placeholder.com/150",
      },
      {
        heading: "Key Market Players",
        content: "Understand the roles of brokers, traders, and investors.",
        video: "https://youtu.be/anotherVideoLink",
        image: "https://via.placeholder.com/150",
      },
    ],
  },
  {
    id: 2,
    title: "Types of Investments",
    contents: [
      {
        heading: "Equity Investments",
        content: "Learn about investing in stocks.",
        video: "https://youtu.be/equityExample",
        image: "https://via.placeholder.com/150",
      },
      {
        heading: "Debt Investments",
        content: "Understand bonds and other fixed-income instruments.",
        video: "https://youtu.be/debtExample",
        image: "https://via.placeholder.com/150",
      },
      {
        heading: "Debt Investments",
        content: "Understand bonds and other fixed-income instruments.",
        video: "https://youtu.be/debtExample",
        image: "https://via.placeholder.com/150",
      },
    ],
  },
  {
    id: 3,
    title: "Fundamental Analysis",
    contents: [
      {
        heading: "Understanding Financial Statements",
        content: "Learn how to read balance sheets, income statements, and cash flow statements.",
        video: "https://youtu.be/fundamentalsExample",
        image: "https://via.placeholder.com/150",
      },
      {
        heading: "Evaluating Ratios",
        content: "Explore key financial ratios for company analysis.",
        video: "https://youtu.be/ratiosExample",
        image: "https://via.placeholder.com/150",
      },
    ],
  },
];

const LessonLayout = () => {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0] || null);
  
  
 

  

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-900 text-white ">
        <div
          className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto"
          style={{ height: "100vh" }}
        >
          <h2 className="text-lg font-bold p-4 border-b border-gray-700">Lesson Headings</h2>
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`p-4 cursor-pointer hover:bg-gray-700 ${
                  selectedLesson && selectedLesson.id === lesson.id ? "bg-gray-700" : ""
                }`}
              >
                {lesson.title}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="w-3/4 overflow-y-auto"
          style={{ height: "100vh" }}
        >
          <div className="p-6">
            {selectedLesson ? (
              <>
                <h1 className="text-2xl font-bold mb-4">{selectedLesson.title}</h1>
                {selectedLesson.contents && selectedLesson.contents.length > 0 ? (
                  selectedLesson.contents.map((content, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold mb-2">{content.heading}</h2>
                      <p className="text-gray-300 mb-4">{content.content}</p>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Video Link:</h3>
                        <a
                          href={content.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          Watch Video
                        </a>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Image Preview:</h3>
                        <img
                          src={content.image}
                          alt={content.heading}
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No content available for this lesson.</p>
                )}
              </>
            ) : (
              <p>Please select a lesson to view its contents.</p>
            )}
          </div>
          {/* Next Page Button */}
          
        </div>
      </div>
    </>
  );
};

export default LessonLayout;
