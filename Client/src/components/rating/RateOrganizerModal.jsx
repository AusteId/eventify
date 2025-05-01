'use client';

import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const RateOrganizerModal = ({ isOpen, onClose, organizerName, eventName }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Rate Organizer
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          How would you rate {organizerName} as the organizer of "{eventName}"?
        </p>

        <div className="flex justify-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none cursor-pointer pr-2"
            >
              {star <= (hoverRating || rating) ? (
                <FaStar className="text-intermediate text-4xl" />
              ) : (
                <FaRegStar className="text-gray-300 text-4xl" />
              )}
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-gray-600 mb-10 text-sm">
            You selected {rating} {rating === 1 ? 'star' : 'stars'}
          </p>
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-btn text-white rounded-lg hover:bg-btn-hover transition-colors duration-200 cursor-pointer"
            disabled={rating === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateOrganizerModal;