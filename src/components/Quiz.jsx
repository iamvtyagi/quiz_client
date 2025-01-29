import React, { useState, useEffect } from 'react';
import Quiz from 'react-quiz-component';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const QuizComponent = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoId) {
      generateQuiz();
    }
  }, [videoId]);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating quiz for video:', videoId);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quiz/generate`,
        { videoId },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Quiz response:', response.data);
      const quizData = response.data;
      
      // Transform the quiz data to match react-quiz-component format
      const formattedQuiz = {
        quizTitle: "Video Quiz",
        quizSynopsis: "Test your knowledge from the video",
        nrOfQuestions: quizData.questions.length,
        questions: quizData.questions.map((q, index) => ({
          question: q.question,
          questionType: "text",
          answerSelectionType: "single",
          answers: q.options,
          correctAnswer: q.correctAnswer + 1, // Convert 0-based to 1-based index
          messageForCorrectAnswer: "Correct!",
          messageForIncorrectAnswer: "Incorrect. Try again!",
          point: 1
        }))
      };
      
      console.log('Formatted quiz:', formattedQuiz);
      setQuiz(formattedQuiz);
      
    } catch (error) {
      console.error('Error generating quiz:', error.response || error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Failed to generate quiz'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCustomResults = (obj) => {
    const { numberOfCorrectAnswers, numberOfQuestions } = obj;
    const score = (numberOfCorrectAnswers / numberOfQuestions) * 100;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <div className="mb-6">
          <p className="text-4xl font-bold text-blue-600">
            {numberOfCorrectAnswers} / {numberOfQuestions}
          </p>
          <p className="text-xl text-gray-600 mt-2">
            {score}% Correct
          </p>
        </div>
        {score >= 80 ? (
          <p className="text-green-600 font-semibold">Great job! You've mastered this content!</p>
        ) : score >= 60 ? (
          <p className="text-yellow-600 font-semibold">Good effort! Review the video to improve your score.</p>
        ) : (
          <p className="text-red-600 font-semibold">Keep learning! Watch the video again to better understand the content!</p>
        )}
        <div className="mt-6 space-x-4">
          <button
            onClick={generateQuiz}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Video
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Generating quiz questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={generateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
        <button
          onClick={generateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Quiz
        quiz={quiz}
        shuffle={true}
        showDefaultResult={false}
        customResultPage={renderCustomResults}
        onComplete={(obj) => console.log('Quiz completed:', obj)}
      />
    </div>
  );
};

export default QuizComponent;
