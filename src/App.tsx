import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import QuizPage from './pages/QuizPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
};

export default App;
