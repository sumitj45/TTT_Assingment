import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function App() {
  const [data, setData] = useState([]);

  function handleClick() {
    fetch("https://www.terriblytinytales.com/test.txt")
      .then((response) => response.text())
      .then((data) => {
        const wordCount = {};
        const words = data.split(/\W+/);
        words.forEach((word) => {
          const normalizedWord = word
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, "");
          if (normalizedWord.length > 0) {
            if (!wordCount[normalizedWord]) {
              wordCount[normalizedWord] = 1;
            } else {
              wordCount[normalizedWord]++;
            }
          }
        });
        const sortedWordCount = Object.entries(wordCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);
        const chartData = sortedWordCount.map(([word, count]) => ({
          word,
          count,
        }));
        setData(chartData);
      });
  }

  function handleExport() {
    const csvData = data
      .map(({ word, count }) => `${word},${count}`)
      .join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "histogram.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      {data.length > 0 ? (
        <>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis dataKey="count" />

            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
          <button onClick={handleExport}>Export</button>
        </>
      ) : (
        <button onClick={handleClick}>Submit</button>
      )}
    </div>
  );
}

export default App;
