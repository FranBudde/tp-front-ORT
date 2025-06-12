import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateRangeNavigator({ dateRange, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center mb-8">
      <ChevronLeft
        size={20}
        className="text-gray-400 cursor-pointer"
        onClick={onPrev}
      />
      <span className="mx-4 text-lg font-medium underline">
        {dateRange}
      </span>
      <ChevronRight
        size={20}
        className="text-gray-400 cursor-pointer"
        onClick={onNext}
      />
    </div>
  );
}