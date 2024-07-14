'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThingsGenerator from '../lib/ThingsGenerator';
import { mergeJsonData } from '../lib/jsonProcessor';
import 'tailwindcss/tailwind.css';

const ToDoGenerator = () => {
  const [title, setTitle] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [jsonLists, setJsonLists] = useState([]);
  const [localLists, setLocalLists] = useState([]);
  const [error, setError] = useState('');
  const [includeAdditional, setIncludeAdditional] = useState([]);
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const config = await response.json();
        setJsonLists(config.availableLists);
        setOptions(config.options);
        setIncludeAdditional(
          config.options.map((option) => ({ ...option, checked: false }))
        );
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    const loadLocalLists = () => {
      const lists = Object.keys(localStorage).map((key) => ({
        key,
        value: JSON.parse(localStorage.getItem(key)),
      }));
      setLocalLists(lists);
    };

    loadConfig();
    loadLocalLists();
  }, []);

  const fetchBaseData = async (list) => {
    if (jsonLists.some((item) => item.name === list)) {
      const response = await fetch(`/api/list?list=${list}`);
      const data = await response.json();
      return data.sections ? data.sections : data;
    } else {
      const data = JSON.parse(localStorage.getItem(list));
      return data.sections ? data.sections : data;
    }
  };

  const fetchAdditionalData = async (file) => {
    const response = await fetch(`/api/list?list=${file}`);
    const data = await response.json();
    return data.sections ? data.sections : data;
  };

  const handleGenerateLink = async () => {
    setError('');
    if (!title || !selectedList) {
      setError('Title and list are required.');
      return;
    }

    try {
      let baseSections = await fetchBaseData(selectedList);

      for (const option of includeAdditional) {
        if (option.checked) {
          const additionalSections = await fetchAdditionalData(option.file);
          baseSections = mergeJsonData(baseSections, additionalSections);
        }
      }

      const generator = new ThingsGenerator(title, baseSections);
      const url = generator.generate();

      setGeneratedLink(url);
    } catch (error) {
      console.error('Error fetching the JSON file:', error);
      setError('Failed to generate link. Please try again.');
    }
  };

  const handleClear = () => {
    setTitle('');
    setSelectedList('');
    setGeneratedLink('');
    setError('');
    setIncludeAdditional(
      includeAdditional.map((option) => ({ ...option, checked: false }))
    );
  };

  const handleEdit = () => {
    if (selectedList) {
      router.push(`/edit/${selectedList}`);
    }
  };

  const handleCreate = () => {
    router.push(`/create`);
  };

  const handleListChange = async (e) => {
    const listName = e.target.value;
    setSelectedList(listName);

    const baseData = await fetchBaseData(listName);
    const listCategory =
      jsonLists.find((item) => item.name === listName)?.category ||
      localLists.find((item) => item.key === listName)?.value.category;

    if (listCategory) {
      const filteredOpts = options.filter(
        (option) => option.category === listCategory
      );
      setFilteredOptions(filteredOpts);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">To-Do Generator</h1>
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

          {filteredOptions.length > 0 && (
            <div className="mb-4">
              {filteredOptions.map((option, index) => (
                <div key={index}>
                  <label className="block text-gray-700 font-bold mb-2">
                    <input
                      type="checkbox"
                      className="mr-2 leading-tight"
                      onChange={(e) => {
                        const updatedOptions = [...includeAdditional];
                        updatedOptions[index] = {
                          ...option,
                          checked: e.target.checked,
                        };
                        setIncludeAdditional(updatedOptions);
                      }}
                    />
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          )}

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

        {generatedLink && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">Generated Link</h2>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {title}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoGenerator;
