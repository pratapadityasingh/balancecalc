"use client"
import React, { useState, useEffect } from 'react';


const Home = () => {
    const [morningReading, setMorningReading] = useState<number | string>('');
    const [eveningReading, setEveningReading] = useState<number | string>('');
    const [price, setPrice] = useState<number | string>('');
    const [result, setResult] = useState<number | null>(null);
    const [calculations, setCalculations] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTable, setShowTable] = useState(false);
    const recordsPerPage = 10;

    const handleCalculate = async () => {
        const morning = parseFloat(morningReading as string);
        const evening = parseFloat(eveningReading as string);
        const cost = parseFloat(price as string);

        if (isNaN(morning) || isNaN(evening) || isNaN(cost)) {
            alert("Please enter valid numbers for all fields.");
            return;
        }

        const difference = evening - morning;
        const calculatedResult = difference * cost;

        setResult(calculatedResult);

        const newCalculation = { morningReading: morning, eveningReading: evening, price: cost, result: calculatedResult };

        try {
            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
            const response = await fetch(`${BASE_URL}/api/calculations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCalculation),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setCalculations([...calculations, data]); 
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleClear = () => {
        setMorningReading('');
        setEveningReading('');
        setPrice('');
    };

    const handleLoadData = async () => {
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
            const response = await fetch(`${BASE_URL}/api/calculations`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setCalculations(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleDeleteCalculation = async (id: string) => {
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
            const response = await fetch(`${BASE_URL}/api/calculations/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Network response was not ok');

            setCalculations(calculations.filter(calc => calc._id !== id));
        } catch (error) {
            console.error('There was a problem with the delete operation:', error);
        }
    };

    useEffect(() => {
        handleLoadData();
    }, []);

    const formatDate = (createdAt: any) => {
        const date = new Date(createdAt);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-IN', options);
    };

    const currentData = calculations.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  
    return (
        <div className="flex items-center justify-center min-h-screen p-4 text-black bdcolor">
            {!showTable && (
                <div id="calculator" className={`bdcolor p-8 rounded shadow-md w-96 ${result !== null ? 'hidden' : ''}`}>
                    <h1 className="text-2xl font-bold mb-4 text-black">Balance Calculator</h1>
                    <div className="mb-4">
                        <label htmlFor="morningReading" className="block text-[#f6f614] font-bold text-lg">Morning Reading:</label>
                        <input
                            type="number"
                            id="morningReading"
                            value={morningReading}
                            onChange={(e) => setMorningReading(e.target.value)}
                            className="mt-1 p-2 border border-white rounded w-full"
                            placeholder="Enter morning reading"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="eveningReading" className="block text-[#f6f614] font-bold text-lg">Evening Reading:</label>
                        <input
                            type="number"
                            id="eveningReading"
                            value={eveningReading}
                            onChange={(e) => setEveningReading(e.target.value)}
                            className="mt-1 p-2 border border-white rounded w-full"
                            placeholder="Enter evening reading"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-[#f6f614] font-bold text-lg">Price:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 p-2 border border-white rounded w-full"
                            placeholder="Enter price"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handleCalculate} className="bg-green-400 text-black font-bold p-2 rounded w-full">Calculate</button>
                        <button onClick={handleClear} className="bg-orange-600 text-black font-bold p-2 rounded w-full">Clear</button>
                    </div>
                    {!showTable && result === null && (
                        <button onClick={() => setShowTable(true)} className="bg-blue-500 text-black font-bold  text-bold p-2 w-full rounded mt-4">Show Data</button>
                    )}
                </div>
            )}

            {result !== null && !showTable && (
                <div id="resultPage" className=" bdcolor p-8 rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4">Calculation Result</h1>
                    <p className="text-xl">Morning Reading: <span className="font-semibold">{morningReading}</span></p>
                    <p className="text-xl">Evening Reading: <span className="font-semibold">{eveningReading}</span></p>
                    <p className="text-xl">Price: <span className="font-semibold">{price}</span></p>
                    <p className="text-xl mt-4">Total Cost: <span className="text-green-500 font-bold">{result.toFixed(2)}</span></p>
                    <button onClick={() => setResult(null)} className="bg-blue-500 text-white p-2 rounded w-full mt-4">Go Back</button>
                </div>
            )}

            {showTable && (
                <div id="allDataPage" className="bdcolor p-8 rounded shadow-md w-full max-w-4xl">
                    <h1 className="text-2xl font-bold mb-4">All Calculations</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bdcolor">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614] tracking-wider">
                                        Serial Number
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614] tracking-wider">
                                        Morning Reading
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614] tracking-wider">
                                        Evening Reading
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614] tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614] tracking-wider">
                                        Result
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614] tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-white text-left leading-4 text-[#f6f614]  tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="allData" className="bdcolor text-white text-center font-bold">
                                {currentData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 whitespace-no-wrap">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                                        <td className="border px-4 py-2 whitespace-no-wrap">{item.morningReading}</td>
                                        <td className="border px-4 py-2 whitespace-no-wrap">{item.eveningReading}</td>
                                        <td className="border px-4 py-2 whitespace-no-wrap">{item.price}</td>
                                        <td className="border px-4 py-2 whitespace-no-wrap">{item.result}</td>
                                        <td className="border px-4 py-2 whitespace-no-wrap">{formatDate(item.timestamp)}</td>
                                        <td className="border px-4 py-2 whitespace-no-wrap">
                                            <button onClick={() => handleDeleteCalculation(item._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button onClick={() => setShowTable(false)} className=" bg-green-400 text-black font-bold p-2 rounded">Go Back</button>
                        <div >
                            <button onClick={() => setCurrentPage(currentPage - 1)} className="bg-red-400 text-black font-bold p-2 rounded mr-2" disabled={currentPage === 1}>Previous</button>
                            <button onClick={() => setCurrentPage(currentPage + 1)} className="bg-blue-400 text-black  font-bold p-2 rounded" disabled={currentData.length < recordsPerPage}>Next</button>
                        </div>
                    </div>
                </div>
            )}
 
        </div>
    );
};

export default Home;
