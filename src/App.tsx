import { useCallback, useState } from 'react';
import '@/App.css';

function App() {
  const [count, setCount] = useState(0);
  const increaseCount = useCallback(() => setCount((prev) => prev + 1), [setCount]);

  return (
    <div className="card">
      <button onClick={increaseCount}>count is {count}</button>
    </div>
  );
}

export default App;
