"use client";

import { useEffect, useState } from "react";

const HistoryPage = () => {
    const [generatedLists, setGeneratedLists] = useState([]);

    useEffect(() => {
        const localGeneratedLists = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
        setGeneratedLists(localGeneratedLists);
    }, []);

    const handleDelete = (index) => {
        const updatedLists = generatedLists.filter((_, i) => i !== index);
        localStorage.setItem("generatedLinks", JSON.stringify(updatedLists));
        setGeneratedLists(updatedLists);
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Generated To-Do Lists History</h1>
                {generatedLists.length === 0 ? (
                    <p>No generated lists found.</p>
                ) : (
                    <ul>
                        {generatedLists.map((item, index) => (
                            <li key={index} className="mb-2 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold">{item.title}</h2>
                                    <p className="text-gray-600">{item.category}</p>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Open Link
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleDelete(index)}
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
