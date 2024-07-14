'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CustomPage = () => {
  const [customLists, setCustomLists] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Logging the local storage content for debugging
    const allKeys = Object.keys(localStorage);
    console.log('All local storage keys:', allKeys);

    const localCustomLists = allKeys
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

    console.log('Filtered custom lists:', localCustomLists);
    setCustomLists(localCustomLists);
  }, []);

  const handleEdit = (key) => {
    router.push(`/edit/${key}`);
  };

  const handleCreate = () => {
    router.push(`/create`);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Custom To-Do Lists</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create New List
          </button>
        </div>
        {customLists.length === 0 ? (
          <p>No custom lists found.</p>
        ) : (
          <ul>
            {customLists.map((item) => (
              <li
                key={item.key}
                className="mb-2 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold">{item.value.title}</h2>
                  <p className="text-gray-600">{item.value.category}</p>
                </div>
                <button
                  onClick={() => handleEdit(item.key)}
                  className="ml-4 bg-green-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomPage;
