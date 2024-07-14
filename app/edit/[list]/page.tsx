"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { parseTextToSections, formatSectionsToText, handleKeyDown, cleanText } from "../../../lib/textParser";

const EditList = () => {
    const router = useRouter();
    const { list: listParam } = useParams();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const list = Array.isArray(listParam) ? listParam[0] : listParam;

    useEffect(() => {
        const fetchListData = async () => {
            try {
                let data;
                if (typeof localStorage !== "undefined" && list && localStorage.getItem(list)) {
                    data = JSON.parse(localStorage.getItem(list));
                } else if (list) {
                    const response = await fetch(`/api/list?list=${list}`);
                    data = await response.json();
                }

                if (data) {
                    setTitle(data.title || "");
                    setCategory(data.category || "");
                    setContent(formatSectionsToText(data.sections || []));
                }
            } catch (error) {
                console.error("Error fetching list data:", error);
                setError("Failed to fetch list data");
            }
        };

        if (list) {
            fetchListData();
        }
    }, [list]);

    const handleSave = () => {
        const cleanedContent = cleanText(content);
        const sections = parseTextToSections(cleanedContent);
        const updatedData = { title, category, sections };

        if (typeof localStorage !== "undefined" && list) {
            localStorage.setItem(list, JSON.stringify(updatedData));
        }

        router.push("/");
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Edit List</h1>
                {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
                <div className="mb-4">
                    <label htmlFor="formTitle" className="block text-gray-700 font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="formTitle"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="formCategory" className="block text-gray-700 font-bold mb-2">
                        Category
                    </label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="formCategory"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="formContent" className="block text-gray-700 font-bold mb-2">
                        Content
                    </label>
                    <textarea
                        id="formContent"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => router.push("/")}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditList;
