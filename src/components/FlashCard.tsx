import { useState } from 'react';
import './FlashCard.css';
import questions from '../mocks/judo.json';
import { Link } from 'react-router-dom';

type FlashCardItem = {
  question: string;
  answer: string;
};

const mockCards: FlashCardItem[] = questions;

const FlashCard = () => {

  const [usedIndex, setUsedIndex] = useState<number[]>([]);

  const getRandomIndex = () => {
    if (usedIndex.length === mockCards.length) {
      setUsedIndex([]);
    }
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * mockCards.length);
    } while (usedIndex.includes(randomIndex));
    usedIndex.push(randomIndex);
    return randomIndex;
  };

  // Initialize the index with a random value
  const initialIndex = getRandomIndex();

  const [index, setIndex] = useState(initialIndex);
  const [flipped, setFlipped] = useState(false);

  const setNewIndex = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= mockCards.length) {
      return;
    }
    setIndex(newIndex);
    setFlipped(false);
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => {
      setNewIndex(getRandomIndex());
    }, 300);
  };

  const card = mockCards[index];

  return (
    <div className="flashcard-container">
      <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="front">
          {card.question}
        </div>
        <div className="back">
          {card.answer}
        </div>
      </div>
      <button className="next-btn" onClick={next}>Próximo</button>

      <Link to="/quiz" className="link">Ir para o teste</Link>
    </div>
  );
};

export default FlashCard;
