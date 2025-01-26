import React from "react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: "reading" | "finished" | "later";
  children?: React.ReactNode;
  onActionClick?: () => void;
  actionLabel?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  coverImage,
  status,
  children,
  onActionClick,
  actionLabel,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-64 h-40">
      {/* Обложка книги */}
      <div className="w-1/3 p-2 flex items-center justify-center">
        <img
          src={coverImage || "/placeholder.jpg"}
          alt={title}
          className="w-20 h-28 object-cover rounded"
        />
      </div>
  
      {/* Информация о книге */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
          <p className="text-xs text-gray-600 truncate">by {author}</p>
          <p className="text-xs mt-1 text-gray-500 capitalize">Status: {status}</p>
        </div>
  
        {/* Дети (например, таймер чтения) */}
        {children}
  
        {/* Кнопка действия */}
        {onActionClick && actionLabel && (
          <button
            onClick={onActionClick}
            className="mt-2 w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition text-xs"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;