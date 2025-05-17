import React from 'react';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const BoardCustom = ({ selectedBoard, setSelectedBoard }) => {
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="w-full h-12">
      <label htmlFor="board_id" className="block text-sm font-medium text-gray-700 mb-1">
        Board
      </label>
      <select
        id="board_id"
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select a board</option>
        {categories?.categories?.map((board) => (
          <option key={board._id} value={board._id}> 
            {board.board_prog_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BoardCustom;