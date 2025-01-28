import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebaseConfig";

const Goals: React.FC = () => {
  const { user } = useAuth(); // Получаем пользователя
  const books = useSelector((state: RootState) => state.books.books);
  const finishedBooks = books.filter((book) => book.status === "finished");

  const [goal, setGoal] = useState<number>(0);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загружаем `goal` из Firestore при загрузке компонента
  useEffect(() => {
    if (!user) return;
    
    const fetchGoal = async () => {
      const goalRef = doc(db, "users", user.uid);
      const goalSnap = await getDoc(goalRef);
      if (goalSnap.exists()) {
        setGoal(goalSnap.data().goal || 0);
      }
      setLoading(false);
    };

    fetchGoal();
  }, [user]);

  const progress = goal > 0 ? Math.min((finishedBooks.length / goal) * 100, 100) : 0;

  // Сохраняем `goal` в Firestore
  const handleSetGoal = async (newGoal: number) => {
    if (!user) return;
    const goalRef = doc(db, "users", user.uid);
    await setDoc(goalRef, { goal: newGoal }, { merge: true }); // Обновляем `goal`
    setGoal(newGoal);
    setIsEditingGoal(false);
  };

  if (loading) return <p>Loading...</p>; // Показываем загрузку

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Reading Goals</h2>

      {!isEditingGoal ? (
        <>
          <p className="text-lg mb-4">
            Goal: {goal > 0 ? `${goal} books` : "No goal set"} | Progress: {progress.toFixed(1)}%
          </p>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 dark:hover:bg-blue-500"
            onClick={() => setIsEditingGoal(true)}
          >
            {goal > 0 ? "Change Goal" : "Set a Goal"}
          </button>
        </>
      ) : (
        <div className="flex flex-col">
          <label htmlFor="goal" className="text-lg mb-2 dark:text-gray-200">
            Set your goal:
          </label>
          <input
            id="goal"
            type="number"
            min="1"
            value={goal || ""}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 rounded p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <button
            className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-500"
            onClick={() => handleSetGoal(goal)}
          >
            Save Goal
          </button>
          <button
            className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 mt-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500"
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