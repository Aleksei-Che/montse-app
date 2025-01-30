import React, { useRef, useState, useEffect } from "react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: "reading" | "finished" | "later";
  totalReaders?: number;
  children?: React.ReactNode;
  onActionClick?: () => void;
  actionLabel?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  coverImage,
  status,
  totalReaders,
  children,
  onActionClick,
  actionLabel,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (titleRef.current) {
      setIsTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [title]);

  const handleMouseEnter = () => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 25, 
        left: rect.left,
      });
      setShowTooltip(true);
    }
  };

  return (
    <div className="relative shadow-lg rounded-lg overflow-hidden flex w-68 h-40 bg-cardLight dark:bg-cardDark">
      {/* Tooltip ВНЕ карточки */}
      {isTruncated && showTooltip && (
        <div
          className="fixed bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-50"
          style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
        >
          {title}
        </div>
      )}

      {/* Обложка */}
      <div className="w-1/3 p-2 flex items-center justify-center">
        <img
          src={coverImage || "/placeholder.jpg"}
          alt={title}
          className="w-20 h-28 object-cover rounded"
        />
      </div>

      {/* Информация */}
      <div className="w-2/3 p-4 flex flex-col min-h-0">
        <div className="flex-grow">
          <h3
            ref={titleRef}
            className="text-sm font-semibold truncate dark:text-gray-100 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {title}
          </h3>
          <p className="text-xs truncate dark:text-gray-300">by {author}</p>
          <p className="text-xs mt-1 capitalize dark:text-gray-400">
            Status: {status}
          </p>
          {totalReaders !== undefined && (
            <p className="text-xs mt-1 text-gray-500">
              👤: {totalReaders} reading now
            </p>
          )}
        </div>

        {/* Динамический контент */}
        {children}

        {/* Кнопка фиксирована внизу */}
        {onActionClick && actionLabel && (
          <button
            onClick={onActionClick}
            className="mt-auto w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition text-xs"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;