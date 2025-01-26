import React from "react";

interface ScrollButtonsProps {
  containerId: string; // ID контейнера, который нужно прокручивать
}

const ScrollButtons: React.FC<ScrollButtonsProps> = ({ containerId }) => {
  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300; // Прокрутка на 300px
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // Плавная прокрутка
      });
    }
  };

  return (
    <div className="absolute inset-y-0 flex justify-between items-center w-full pointer-events-none">
      {/* Кнопка влево */}
      <button
        onClick={() => scrollContainer("left")}
        className="bg-blue-500 bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-80 hover:shadow-lg transition-all duration-300 focus:outline-none pointer-events-auto"
        style={{ marginLeft: "10px" }}
       >
         {"<"}
       </button>

      {/* Кнопка вправо */}
      <button
        onClick={() => scrollContainer("right")}
        className="bg-blue-500 bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-80 hover:shadow-lg transition-all duration-300 focus:outline-none pointer-events-auto"
        style={{ marginRight: "10px" }}
       >
         {">"}
      </button>
    </div>
  );
};

export default ScrollButtons;