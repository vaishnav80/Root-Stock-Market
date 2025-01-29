import React, { useState, useEffect } from "react";
import Header from "../../components/User/Header";
import { getContent, getlesson } from "../../actions/Lesson";
import { useSelector } from "react-redux";
import LoadingPage from "../../components/User/LoadingPage";

const LessonLayout = () => {
  const [selectedLesson, setSelectedLesson] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [lessons, setLesson] = useState([]);
  const auth = useSelector((select) => select.auth);
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    async function fetchdata() {
      console.log(auth.token);

      const response = await getlesson(auth.token);
      if (response.status == 200) {
        console.log(response)
        setLesson(response.data.lesson);
        setLoading(true)
      }
    }
    fetchdata();
  }, []);

  const selectContent = async (e) => {
    
    setSelectedId(e);
    const response = await getContent(auth.token, e);
    if (response.status == 200) {
      console.log(response);

      setSelectedLesson(response.data);
    }
  };
  console.log(selectedLesson,'sdfsdfsdfsdfsdf');
  
  return (
    <>
      <Header />
      {loading ? (
      <div className="flex min-h-screen bg-gray-900 text-white ">
        <div
          className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto"
          style={{ height: "100vh" }}
        >
          <h2 className="text-lg font-bold p-4 border-b border-gray-700">
            Lesson Headings
          </h2>
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                onClick={() => {
                  
                  selectContent(lesson.id);
                }}
                className={`p-4 cursor-pointer hover:bg-gray-700 ${
                  selectedId === lesson.id ? "bg-gray-700" : ""
                }`}
              >
                {lesson.heading}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4 overflow-y-auto" style={{ height: "100vh" }}>
          <div className="p-6">
            {!Array.isArray(selectedLesson) ? (
              <>
                <h1 className="text-2xl font-bold mb-4">
                  {selectedLesson.heading}
                </h1>
                {selectedLesson.content &&
                selectedLesson.content.length > 0 ? (
                  selectedLesson.content.map((content, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold mb-2">
                        {content.sub_heading}
                      </h2>
                      <p className="text-gray-300 mt-4 mb-4">{content.content}</p>
                        {content.video_url &&(
                      <div className="mb-4 flex">
                        <h3 className="text-lg font-semibold mb-2">
                          Video Link: 
                        </h3>
                        <a
                          href={content.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline ml-3"
                        >
                          Watch Video
                        </a>
                      </div>
                        )}
                        {content.image && (

                          <div className="w-2/4">
                
                        <img
                          src={`https://rootstocks.site${content.image}`}
                          alt={content.image}
                          className="rounded-lg shadow-lg"
                          />
                      </div>
                        )}
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
          
        </div>
      </div>
      ): (<div className="bg-black h-screen">
      <LoadingPage />
    </div>)}
    </>
  );
};

export default LessonLayout;
