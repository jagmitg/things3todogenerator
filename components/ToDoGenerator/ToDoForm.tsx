'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ToDoForm = ({
  title,
  setTitle,
  selectedList,
  handleListChange,
  jsonLists,
  localLists,
  error,
  handleGenerateLink,
  handleClear,
}) => {
  const router = useRouter();

  const handleEdit = () => {
    if (selectedList) {
      router.push(`/edit/${selectedList}`);
    }
  };

  const handleCreate = () => {
    router.push(`/create`);
  };

  return (
    <form>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label
          htmlFor="formTitle"
          className="block text-gray-700 font-bold mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="formTitle"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="formList"
          className="block text-gray-700 font-bold mb-2"
        >
          Select List <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="formList"
            value={selectedList}
            onChange={handleListChange}
            required
          >
            <option value="">Select a list</option>
            <optgroup label="JSON Lists">
              {jsonLists.map((list, index) => (
                <option key={index} value={list.name}>
                  {list.name.replace('.json', '').replace('_', ' ')}
                </option>
              ))}
            </optgroup>
            <optgroup label="Local Storage Lists">
              {localLists.map((list, index) => (
                <option key={index} value={list.key}>
                  {list.key.replace('_', ' ')}
                </option>
              ))}
            </optgroup>
          </select>
          {localLists.some((list) => list.key === selectedList) && (
            <button
              type="button"
              className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
          <button
            type="button"
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleGenerateLink}
        >
          Generate Link
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default ToDoForm;
