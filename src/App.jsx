import React, { useState, useEffect } from 'react';
import { fetchQuestions, submitResults } from './api/gas';
import './index.css';

const PASS_THRESHOLD = import.meta.env.VITE_PASS_THRESHOLD || 8;

export default function App() {
  const [step, setStep] = useState('HOME'); // HOME, LOADING, GAME, RESULT
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const startGame = async () => {
    if (!userId.trim()) return alert('請輸入 ID');
    setStep('LOADING');
    const data = await fetchQuestions();
    setQuestions(data);
    setCurrentIndex(0);
    setAnswers([]);
    setStep('GAME');
  };

  const handleAnswer = (choice) => {
    const newAnswers = [...answers, { id: questions[currentIndex].id, choice }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishGame(newAnswers);
    }
  };

  const finishGame = async (finalAnswers) => {
    setStep('LOADING');
    const res = await submitResults(userId, finalAnswers);
    setResult(res);
    setStep('RESULT');
  };

  return (
    <div className="container">

      {step === 'HOME' && (
        <div className="cyber-card">
          <h1 className="glitch" data-text="CYBER QUIZ">CYBER QUIZ</h1>
          <p>進入系統前，請驗證身份。</p>
          <div className="input-group">
            <label>AGENT ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ENTER SYSTEM ID..."
            />
          </div>
          <button onClick={startGame}>[ START_SESSION ]</button>
        </div>
      )}

      {step === 'LOADING' && (
        <div className="cyber-card">
          <h2 className="glitch" data-text="LOADING...">LOADING...</h2>
          <p>正在同步神經網路數據...</p>
        </div>
      )}

      {step === 'GAME' && questions[currentIndex] && (
        <div className="cyber-card">
          <div className="level-info">
            <h3>LEVEL {currentIndex + 1} / {questions.length}</h3>
          </div>
          <div className="boss-container" data-id={questions[currentIndex].id}>
            <img
              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${questions[currentIndex].id}&backgroundColor=000c24`}
              alt="Boss"
            />
          </div>
          <div className="question-box">
            <p className="question-text">{questions[currentIndex].question}</p>
            <div className="options-grid">
              {Object.entries(questions[currentIndex].options).map(([key, value]) => (
                <button key={key} onClick={() => handleAnswer(key)}>
                  {key}: {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'RESULT' && result && (
        <div className="cyber-card">
          <h1 className="glitch" data-text={result.isPassed ? "ACCESS GRANTED" : "ACCESS DENIED"}>
            {result.isPassed ? "ACCESS GRANTED" : "ACCESS DENIED"}
          </h1>
          <div className="result-info">
            <p>AGENT ID: {userId}</p>
            <p>SCORE: {result.score} / {questions.length}</p>
            <p>STATUS: {result.isPassed ? "PASS" : "FAIL"}</p>
          </div>
          <button onClick={() => setStep('HOME')}>[ REBOOT_SYSTEM ]</button>
        </div>
      )}
      <div className="preloader">
        {Array.from({ length: 100 }).map((_, i) => (
          <img key={i} src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${i + 1}&backgroundColor=000c24`} alt="preload" />
        ))}
      </div>
    </div>
  );
}
