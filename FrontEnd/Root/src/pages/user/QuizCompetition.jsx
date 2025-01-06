import React, { useState } from "react";
import Header from "../../components/User/Header";

const QuizCompetition = () => {
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      correctAnswer: "Paris",
    },
    {
      question: "Who developed the theory of relativity?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Marie Curie"],
      correctAnswer: "Albert Einstein",
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Jupiter",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const addMoneyToWallet = () => {
    alert(`₹${score * 1000} added to your wallet!`);
  };

  return (
    <div className="quiz-container p-4 bg-black min-h-screen flex flex-col items-center text-gray-300">
        <Header/>
      <h1 className="text-2xl font-bold mb-6 text-gray-100 mt-6">Quiz Competition</h1>

      {!showResult ? (
        <div className="question-card bg-gray-800 p-6 shadow-lg rounded-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p className="mb-4">{questions[currentQuestionIndex].question}</p>
          <div className="options flex flex-col space-y-2">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`p-2 rounded-md border ${
                  selectedOption === option
                    ? "bg-gray-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
            disabled={!selectedOption}
          >
            {currentQuestionIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Note: Every correct answer awards ₹1000.
          </p>
        </div>
      ) : (
        <div className="result-card bg-gray-800 p-6 shadow-lg rounded-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-100">Quiz Completed!</h2>
          <p className="mt-4 text-lg text-gray-300">
            Your Score: {score}/{questions.length}
          </p>
          <p className="mt-2 text-gray-400">
            Total Reward: ₹{score * 1000}
          </p>
          <button
            onClick={addMoneyToWallet}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add ₹{score * 1000} to Wallet
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 ml-2 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCompetition;
