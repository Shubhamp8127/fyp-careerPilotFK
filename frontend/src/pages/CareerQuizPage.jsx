import { useEffect, useState } from "react";
import QuizLayout from "../components/quiz/QuizLayout";
import QuizLoader from "../components/quiz/QuizLoader";
import "../styles/quiz.css";
import { markFeatureUsed } from "../services/dashboardApi";

const CareerQuizPage = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    markFeatureUsed().catch((err) => {
      console.error("Feature usage tracking failed:", err);
    });
  }, []);

  // 🔥 helper function (minimum loader time)
  const showLoaderWithDelay = (delay = 2500) => {
    setShowLoader(true);

    return () => {
      setTimeout(() => {
        setShowLoader(false);
      }, delay);
    };
  };

  return (
    <>
      {showLoader && <QuizLoader />}
      <QuizLayout
        setShowLoader={setShowLoader}
        showLoaderWithDelay={showLoaderWithDelay}
      />
    </>
  );
};

export default CareerQuizPage;
