import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Goals: React.FC = () => {
  const books = useSelector((state: RootState) => state.books.books);
  const finishedBooks = books.filter((book) => book.status === "finished");

  const [goal, setGoal] = useState<number>(0);
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const progress = goal > 0 ? Math.min((finishedBooks.length / goal) * 100, 100) : 0;

  const handleSetGoal = (newGoal: number) => {
    setGoal(newGoal);
    setIsEditingGoal(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">🎯 Reading Goals</h2>

      {!isEditingGoal ? (
        <>
          <p className="text-lg text-center mb-4">
            Goal: {goal > 0 ? `${goal} books` : "No goal set"} | Progress: {progress.toFixed(1)}%
          </p>
    
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            className="mt-4 w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition"
            onClick={() => setIsEditingGoal(true)}
          >
            {goal > 0 ? "Change Goal" : "Set a Goal"}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <label htmlFor="goal" className="text-lg mb-2">
            Set your goal:
          </label>
          <input
            id="goal"
            type="number"
            min="1"
            placeholder="How many books this time?"
            value={goal || ""}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 rounded p-2 mb-4 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <button
            className="w-full bg-green-500 dark:bg-green-600 text-white py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-500 transition"
            onClick={() => handleSetGoal(goal)}
          >
            Save Goal
          </button>
          <button
            className="w-full mt-2 bg-gray-500 dark:bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition"
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