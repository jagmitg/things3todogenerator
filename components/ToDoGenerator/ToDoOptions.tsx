'use client';

import React from 'react';

const ToDoOptions = ({
  filteredOptions,
  includeAdditional,
  setIncludeAdditional,
}) => {
  const handleOptionChange = (index, checked) => {
    const updatedOptions = [...includeAdditional];
    updatedOptions[index] = { ...updatedOptions[index], checked };
    setIncludeAdditional(updatedOptions);
  };

  return (
    <div className="mb-4">
      {filteredOptions.map((option, index) => (
        <div key={index}>
          <label className="block text-gray-700 font-bold mb-2">
            <input
              type="checkbox"
              className="mr-2 leading-tight"
              onChange={(e) => handleOptionChange(index, e.target.checked)}
            />
            {option.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ToDoOptions;
