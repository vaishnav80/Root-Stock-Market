import React, { useEffect, useState } from "react";
import Header from "../../components/User/Header";
import { getQuiz, getQuizAttend, postQuizAttend } from "../../actions/Lesson";
import { useSelector } from "react-redux";
import { postWallet } from "../../actions/wallet";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
const QuizCompetition = () => {
  

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const auth  = useSelector((select)=>select.auth)
  const [question,setQuestion] =useState([])
  const [ans,setAns] = useState(false)
  const navigate = useNavigate()
  console.log('fgdf');
  
  useEffect(() => {
    console.log('its');
    
    async function fetchData() {

      try {
        console.log('try');
        
        const response = await getQuizAttend(auth.token);
        console.log(response);
        
        if (response.status == 200) {
          console.log(response.data.content,'dfgdf');
          setQuestion(response.data.content);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    }
    console.log('fdgdfdfgdfgdfgd');
    
    fetchData();  
  },[]);
  const handleOptionClick = (option,ans) => {
    setSelectedOption(option);
    setAns(ans)

    
  };

  const handleNext =async (id) => {
     console.log(ans,id);
    if (ans) {
      const response = await postQuizAttend(auth.token,id)
      setScore(score + 1);
    }
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < question.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const addMoneyToWallet = async () => {
    
    const amount= score * 1000
    const response = await postWallet(auth.token,amount)
    toast.success(`₹${score * 1000} added to your wallet!`)
    setTimeout(() => {
      navigate('/wallet');
    }, 4000);
  };
 
  
  return (
    <div className="quiz-container p-4 bg-black min-h-screen flex flex-col items-center text-gray-300">
    <Header />
    <h1 className="text-2xl font-bold mb-6 text-gray-100 mt-6">Quiz Competition</h1>
  
    {!showResult ? (
      <div className="question-card bg-gray-800 p-6 shadow-lg rounded-md w-full max-w-md sm:max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Question {currentQuestionIndex + 1}/{question.length}
        </h2>
  
        <p className="mb-4">
          {question && question[currentQuestionIndex]
            ? question[currentQuestionIndex].question
            : "No question available"}
        </p>
  
        <div className="options flex flex-col space-y-2">
          {question && question[currentQuestionIndex] && question[currentQuestionIndex].answers
            ? question[currentQuestionIndex].answers.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.answer_text, option.is_correct)}
                  className={`p-2 rounded-md border ${
                    selectedOption === option.answer_text
                      ? "bg-gray-800 text-white"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {option.answer_text}
                </button>
              ))
            : "No options available"}
        </div>
  
        <button
          onClick={() => { handleNext(question[currentQuestionIndex].id) }}
          className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          disabled={!selectedOption}
        >
          {currentQuestionIndex + 1 === question.length ? "Finish Quiz" : "Next Question"}
        </button>
  
        <p className="mt-4 text-sm text-gray-400">
          Note: Every correct answer awards ₹1000.
        </p>
      </div>
    ) : (
      <div className="result-card bg-gray-800 p-6 shadow-lg rounded-md w-full max-w-md sm:max-w-lg text-center">
        <h2 className="text-2xl font-bold text-gray-100">Quiz Completed!</h2>
        <p className="mt-4 text-lg text-gray-300">
          Your Score: {score}/{question.length}
        </p>
        <p className="mt-2 text-gray-400">
          Total Reward: ₹{score * 1000}
        </p>
        {score > 0 ? (
          <button
            onClick={addMoneyToWallet}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add ₹{score * 1000} to Wallet
          </button>
        ) : (
          <p className="text-red-600">Oops..!!</p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 ml-2 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Restart Quiz
        </button>
      </div>
    )}
  
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
  </div>
  

  );
};

export default QuizCompetition;
