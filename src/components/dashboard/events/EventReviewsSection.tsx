import React from 'react';
import { Star } from 'lucide-react';
import { EventReview } from '@/data/event-details';

interface EventReviewsSectionProps {
  reviews: EventReview[];
  averageRating: number;
}

export const EventReviewsSection: React.FC<EventReviewsSectionProps> = ({ reviews, averageRating }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6 max-w-[1100px] mt-8 select-none">
      
      {/* Section Title & Average Badge */}
      <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
        <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
          Reviews & Ratings
        </h3>
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-xl font-extrabold text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span>{averageRating.toFixed(1)} / 5.0</span>
        </div>
      </div>

      {/* Reviews List Grid */}
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4 items-start pb-6 border-b border-neutral-100/60 last:border-none last:pb-0">
            {/* Reviewer Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-100">
              <img
                src={review.avatarUrl}
                alt={review.reviewerName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Review Details */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm font-bold text-neutral-900 leading-none">{review.reviewerName}</h4>
                <span className="text-xs text-neutral-400 font-semibold">{review.date}</span>
              </div>

              {/* Star Rating Icons */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? 'text-amber-500 fill-current' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>

              {/* Comment Content */}
              <p className="text-sm font-medium text-neutral-600 leading-relaxed mt-1">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};