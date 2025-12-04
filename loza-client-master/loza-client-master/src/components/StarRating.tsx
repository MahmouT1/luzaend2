"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  totalRatings = 0,
  size = "md",
  showRating = true,
  interactive = false,
  onRatingChange,
  className = "",
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      setSelectedRating(value);
      onRatingChange(value);
    }
  };

  const displayRating = interactive ? selectedRating : rating;
  const hoverRating = interactive ? hoveredRating : 0;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverRating || displayRating);
          return (
            <Star
              key={star}
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-amber-200 text-amber-200"
              } ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => interactive && setHoveredRating(star)}
              onMouseLeave={() => interactive && setHoveredRating(0)}
            />
          );
        })}
      </div>
      {showRating && (
        <span className="ml-1 text-xs sm:text-sm text-gray-600">
          {displayRating.toFixed(1)}
          {totalRatings > 0 && (
            <span className="text-gray-400"> ({totalRatings})</span>
          )}
        </span>
      )}
    </div>
  );
}

