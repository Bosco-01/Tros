'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventBannerProps {
  urls: string[]; // Accepts a list of image URLs
}

export const EventBanner: React.FC<EventBannerProps> = ({ urls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="w-full h-[280px] md:h-[340px] rounded-[2rem] bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-500 font-medium select-none">
        No Event Media Uploaded.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[280px] md:h-[340px] rounded-[2rem] overflow-hidden mb-8 shadow-sm select-none bg-neutral-900 group">
      
      {/* Active Carousel Image */}
      <img
        src={urls[currentIndex]}
        alt={`Event Gallery Media ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500 scale-100"
      />
      
      {/* Soft overlay filter to replicate mockup lighting */}
      <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />

      {/* Navigation Handles (Only active if there is more than 1 image) */}
      {urls.length > 1 && (
        <>
          {/* Left Arrow Controls */}
          <button
            onClick={handlePrev}
            type="button"
            className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none opacity-0 group-hover:opacity-100 select-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Controls */}
          <button
            onClick={handleNext}
            type="button"
            className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none opacity-0 group-hover:opacity-100 select-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Slide Indicator Fraction */}
          <div className="absolute bottom-5 right-6 px-4 py-1.5 bg-black/60 text-white text-xs font-bold rounded-full select-none tracking-tight">
            {currentIndex + 1} / {urls.length}
          </div>
        </>
      )}

    </div>
  );
};