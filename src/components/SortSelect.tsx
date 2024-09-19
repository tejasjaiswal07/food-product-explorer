import React from 'react';

interface SortSelectProps {
  onSortChange: (sortBy: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ onSortChange }) => {
  return (
    <select
      onChange={(e) => onSortChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Sort by</option>
      <option value="name_asc">Name (A-Z)</option>
      <option value="name_desc">Name (Z-A)</option>
      <option value="grade_asc">Nutrition Grade (A-E)</option>
      <option value="grade_desc">Nutrition Grade (E-A)</option>
    </select>
  );
};

export default SortSelect;