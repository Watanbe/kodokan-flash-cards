import { useState, useEffect } from 'react';
import './Quiz.css';
import questions from '../mocks/judo.json';

type FlashCardItem = {
  question: string;
  answer: string;
};

type QuizAnswer = {
  correct: FlashCardItem;
  wrong: FlashCardItem | null;
};

const mockCards: FlashCardItem[] = questions;

const Quiz = () => {
  const [usedIndex, setUsedIndex] = useState<number[]>([]);
  const [currentCards, setCurrentCards] = useState<FlashCardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [answering, setAnswering] = useState<boolean>(true);

  const card = mockCards[currentIndex];

  const getRandomIndex = (exclude: number, count: number) => {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      const randomIndex = Math.floor(Math.random() * mockCards.length);
      if (randomIndex !== exclude && !indexes.has(randomIndex)) {
        indexes.add(randomIndex);
      }
    }
    return Array.from(indexes);
  };

  const getCards = () => {
    const otherIndexes = getRandomIndex(currentIndex, 2);
    const newIndexes = [...otherIndexes, currentIndex];
    const shuffledIndexes = [...newIndexes].sort(() => Math.random() - 0.5);

    setUsedIndex(newIndexes);
    const newCards = shuffledIndexes.map(index => mockCards[index]);
    setCurrentCards(newCards);
  };

  useEffect(() => {
    getCards();
  }, [currentIndex]);

  const handleAnswerClick = (answer: string) => () => {
    let newQuizAnswer: QuizAnswer = {
      correct: card,
      wrong: null
    };

    if (answer === card.answer) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      newQuizAnswer.wrong = { question: card.question, answer };
    }

    setQuizAnswers(prev => [...prev, newQuizAnswer]);

    if (currentIndex < mockCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAnswering(false);
    }
  };

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <a className='link' href="/">Ir para os cards</a>
        {answering ? (
          <>
            <header className="quiz-header">
              <h1>Quiz de Judô</h1>
              <p>Selecione a resposta correta:</p>
            </header>

            <div className="quiz-card">
              <p className="quiz-question">{card.question}</p>
            </div>

            <div className="quiz-options">
              {currentCards.map((item, idx) => (
                <button
                  key={idx}
                  className="quiz-option"
                  onClick={handleAnswerClick(item.answer)}
                >
                  {item.answer}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <header className="quiz-header">
              <h1>Resultado</h1>
              <p>Você acertou {correctAnswers} de {mockCards.length} perguntas.</p>
            </header>

            <button className="quiz-restart-btn" onClick={() => {
              setCurrentIndex(0);
              setCorrectAnswers(0);
              setQuizAnswers([]);
              setAnswering(true);
            }}>
              Tentar novamente
            </button>

            <div className="quiz-results">
              {quizAnswers.map((item, idx) => (
                <div key={idx} className={`quiz-result ${item.wrong ? 'wrong' : 'correct'}`}>
                  <strong>Q{idx + 1}: {item.correct.question}</strong>
                  {item.wrong ? (
                    <>
                      <span>❌ Resposta Errada: <em>{item.wrong.answer}</em></span>
                      <span>✅ Correta: <strong>{item.correct.answer}</strong></span>
                    </>
                  ) : (
                    <span>✅ Resposta correta: <strong>{item.correct.answer}</strong></span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
