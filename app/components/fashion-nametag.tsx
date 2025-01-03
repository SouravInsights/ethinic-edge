import React, { useState } from "react";
import Link from "next/link";
import { Scissors, Shirt, Palette } from "lucide-react";

const icons = [Scissors, Shirt, Palette];

export const FashionNametag: React.FC = () => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleInteraction = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
      setIsSpinning(false);
    }, 500);
  };

  const Icon = icons[currentIcon];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main container */}
      <div
        onClick={handleInteraction}
        onMouseEnter={handleInteraction}
        className={`
          relative bg-white p-1 rounded-lg shadow-lg border-2 border-rose-300
          transform transition-all duration-500 ease-in-out
          hover:shadow-xl hover:border-rose-400
          ${isSpinning ? "scale-105" : "hover:scale-102"}
        `}
      >
        <div className="flex items-center space-x-3">
          {/* Icon section */}
          <div
            className={`
              w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center
              transition-transform duration-500 ease-in-out
              ${isSpinning ? "rotate-180" : "group-hover:rotate-45"}
            `}
          >
            <Icon className="w-4 h-4 text-rose-500" />
          </div>
          {/* Text section */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-stone-500">
              Crafted by
            </span>
            {/* Clickable link */}
            <Link
              href="https://souravinsights.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-rose-500 group-hover:underline transition-all duration-300"
              onClick={(e) => e.stopPropagation()} // Prevent triggering animations
            >
              souravinsights
            </Link>
          </div>
        </div>
      </div>
      {/* Ping animation */}
      {isSpinning && (
        <div
          className={`
          absolute inset-0 bg-rose-200 rounded-lg opacity-0 transition-opacity duration-300
          ${isSpinning ? "animate-ping opacity-30" : ""}
        `}
        ></div>
      )}
    </div>
  );
};
