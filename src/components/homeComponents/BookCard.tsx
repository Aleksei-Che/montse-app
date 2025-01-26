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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img src={coverImage || "/placeholder.jpg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">by {author}</p>
        <p className="text-xs mt-2 text-gray-500 capitalize">Status: {status}</p>
        {children}
        {onActionClick && actionLabel && (
          <button
            onClick={onActionClick}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;