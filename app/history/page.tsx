'use client';

import { useEffect, useState } from 'react';

const HistoryPage = () => {
  const [generatedLists, setGeneratedLists] = useState([]);

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    console.log('All local storage keys:', allKeys);

    const localGeneratedLists = allKeys
      .filter((key) => {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          console.log(`Key: ${key}, Item:`, item);
          return item && item.sections;
        } catch (error) {
          console.error(
            `Error parsing local storage item with key ${key}:`,
            error
          );
          return false;
        }
      })
      .map((key) => ({
        key,
        value: JSON.parse(localStorage.getItem(key)),
      }));

    console.log('Filtered generated lists:', localGeneratedLists);
    setGeneratedLists(localGeneratedLists);
  }, []);

  const handleDelete = (key) => {
    localStorage.removeItem(key);
    setGeneratedLists(generatedLists.filter((list) => list.key !== key));
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          Generated To-Do Lists History
        </h1>
        {generatedLists.length === 0 ? (
          <p>No generated lists found.</p>
        ) : (
          <ul>
            {generatedLists.map((item) => (
              <li
                key={item.key}
                className="mb-2 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold">{item.value.title}</h2>
                  <p className="text-gray-600">{item.value.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.key)}
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
