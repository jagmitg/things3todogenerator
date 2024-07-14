'use client';

import React, { useState, useEffect } from 'react';
import ToDoForm from './ToDoForm';
import ToDoOptions from './ToDoOptions';
import { fetchConfig } from '../../lib/fetchConfig';
import { fetchBaseData } from '../../lib/fetchBaseData';
import { mergeJsonData } from '../../lib/jsonProcessor';
import ThingsGenerator from '../../lib/ThingsGenerator';

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

  useEffect(() => {
    const initialize = async () => {
      const config = await fetchConfig();
      setJsonLists(config.availableLists);
      setOptions(config.options);
      setIncludeAdditional(
        config.options.map((option) => ({ ...option, checked: false }))
      );

      const localToDoLists = Object.keys(localStorage)
        .filter((key) => {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            return item && item.sections;
          } catch {
            return false;
          }
        })
        .map((key) => ({
          key,
          value: JSON.parse(localStorage.getItem(key)),
        }));
      setLocalLists(localToDoLists);
    };

    initialize();
  }, []);

  const handleGenerateLink = async () => {
    setError('');
    if (!title || !selectedList) {
      setError('Title and list are required.');
      return;
    }

    try {
      let baseSections = await fetchBaseData(
        selectedList,
        jsonLists,
        localLists
      );

      for (const option of includeAdditional) {
        if (option.checked) {
          const additionalSections = await fetchBaseData(
            option.file,
            jsonLists,
            localLists
          );
          baseSections = mergeJsonData(baseSections, additionalSections);
        }
      }

      const generator = new ThingsGenerator(title, baseSections);
      const url = generator.generate();
      setGeneratedLink(url);
    } catch (error) {
      console.error('Error generating link:', error);
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

  const handleListChange = async (e) => {
    const listName = e.target.value;
    setSelectedList(listName);

    const baseData = await fetchBaseData(listName, jsonLists, localLists);
    const listCategory =
      jsonLists.find((item) => item.name === listName)?.category ||
      localLists.find((item) => item.key === listName)?.value?.category;

    if (listCategory) {
      const filteredOpts = options.filter(
        (option) => option.category === listCategory
      );
      setFilteredOptions(filteredOpts);
    } else {
      setError('Failed to fetch base data. Please check the list name.');
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">To-Do Generator</h1>
        <ToDoForm
          title={title}
          setTitle={setTitle}
          selectedList={selectedList}
          handleListChange={handleListChange}
          jsonLists={jsonLists}
          localLists={localLists}
          error={error}
          handleGenerateLink={handleGenerateLink}
          handleClear={handleClear}
        />
        <ToDoOptions
          filteredOptions={filteredOptions}
          includeAdditional={includeAdditional}
          setIncludeAdditional={setIncludeAdditional}
        />
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
