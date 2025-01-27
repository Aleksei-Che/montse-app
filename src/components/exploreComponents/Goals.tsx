import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Goals: React.FC = () => {
  const books = useSelector((state: RootState) => state.books.books); // Получаем книги из Redux
  const finishedBooks = books.filter((book) => book.status === "finished"); // Фильтруем завершённые книги

  const [goal, setGoal] = useState<number>(0); // Цель чтения
  const [isEditingGoal, setIsEditingGoal] = useState(false); // Режим редактирования цели

  const progress = goal > 0 ? Math.min((finishedBooks.length / goal) * 100, 100) : 0; // Прогресс в %

  const handleSetGoal = (newGoal: number) => {
    setGoal(newGoal);
    setIsEditingGoal(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Reading Goals</h2>

      {!isEditingGoal ? (
        <>
          <p className="text-lg mb-4">
            Goal: {goal > 0 ? `${goal} books` : "No goal set"} | Progress: {progress.toFixed(1)}%
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            onClick={() => setIsEditingGoal(true)}
          >
            {goal > 0 ? "Change Goal" : "Set a Goal"}
          </button>
        </>
      ) : (
        <div className="flex flex-col">
          <label htmlFor="goal" className="text-lg mb-2">
            Set your goal:
          </label>
          <input
            id="goal"
            type="number"
            min="1"
            value={goal || ""}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="border border-gray-300 rounded p-2 mb-4"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => handleSetGoal(goal)}
          >
            Save Goal
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 mt-2 rounded hover:bg-gray-600"
            onClick={() => setIsEditingGoal(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;