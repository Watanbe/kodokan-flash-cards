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
    <div className="card-container">
      { answering ? (
        <>
          <div className="quiz-header">
            <h2>Quiz de Judo</h2>
            <p>Responda as perguntas abaixo:</p>
          </div>
          <div className="card">
            <div className="front">
              {card.question}
            </div>
          </div>

          <div className="answers">
            {currentCards.map((item, idx) => (
              <div
                key={idx}
                className='answer'
                onClick={handleAnswerClick(item.answer)}
              >
                {item.answer}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <a className='link' href="/">IR PARA OS CARDS</a>
          <div className="quiz-header">
            <h2>Quiz Finalizado</h2>
          </div>
          <div className="quiz-score">
            Você acertou {correctAnswers} de {mockCards.length} perguntas.
          </div>
          <div className="quiz-restart">
            <p>Para responder novamente, clique no botão abaixo.</p>
            <button onClick={() => {
              setCurrentIndex(0);
              setCorrectAnswers(0);
              setQuizAnswers([]);
              setAnswering(true);
            }}>Reiniciar Quiz</button>
          </div>
          <div className="quiz-results">
            {quizAnswers.map((item, idx) => (
              <div key={idx} className={`quiz-result ${item.wrong ? 'incorrect' : 'correct'}`}>
                <div className="quiz-result-question">
                  <strong>Questão:</strong> {item.correct.question}
                </div>
                {item.wrong ? (
                  <div>
                    <p><strong>Resposta Correta:</strong> {item.correct.answer}</p>
                    <p><strong>Resposta Errada:</strong> {item.wrong.answer}</p>
                  </div>
                ) : (
                  <div>
                    <p><strong>Resposta Correta!</strong></p>
                    <p>{item.correct.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
