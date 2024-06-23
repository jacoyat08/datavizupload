import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import csvToJson from "./util/csvToJson";
import * as echarts from "echarts";
import { IoMdSettings } from "react-icons/io";
import { CgDetailsMore } from "react-icons/cg";
import { FaChartBar } from "react-icons/fa";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState();
  const [jsonData, setJsonData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const chartRef = useRef(null);

  const allowedFileTypes = ["text/csv"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected!");
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      toast.error("Only CSV files are allowed!");
      e.target.value = "";
      return;
    }

    setCsvData(file);
  };

  const getJsonFromCsv = async () => {
    setIsLoading(true);

    try {
      const { json, dataTypes } = await csvToJson(csvData);
      setJsonData(json);
      setColumnHeaders(dataTypes);
    } catch (error) {
      console.error("Error parsing CSV:", error.message);
      toast.error("Failed to parse CSV file.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (csvData) {
      getJsonFromCsv();
    }
  }, [csvData]);

  useEffect(() => {
    if (xAxis && !yAxis) {
      setYAxis("count");
    }
  }, [xAxis, yAxis]);

  useEffect(() => {
    if (chartRef.current && jsonData.length && xAxis) {
      renderChart();
    }
  }, [jsonData, xAxis, yAxis, chartType, title, description]);

  const processBarLineScatterData = () => {
    const xValues = jsonData.map((row) => row[xAxis]);
    let yValues;

    if (yAxis === "count") {
      const counts = xValues.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
      yValues = xValues.map((value) => counts[value]);
    } else if (
      columnHeaders.find((col) => col.name === yAxis)?.type === "number"
    ) {
      const sums = xValues.reduce((acc, value, index) => {
        acc[value] = (acc[value] || 0) + parseFloat(jsonData[index][yAxis]);
        return acc;
      }, {});
      yValues = xValues.map((value) => sums[value]);
    } else {
      yValues = jsonData.map((row) => row[yAxis]);
    }

    return { x: xValues, y: yValues };
  };

  const processBoxPlotData = () => {
    const groupedData = jsonData.reduce((acc, row) => {
      const key = row[xAxis];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(parseFloat(row[yAxis]));
      return acc;
    }, {});

    const boxPlotData = Object.entries(groupedData).map(([key, values]) => {
      values.sort((a, b) => a - b);
      const min = values[0];
      const max = values[values.length - 1];
      const q1 = values[Math.floor(values.length / 4)];
      const median = values[Math.floor(values.length / 2)];
      const q3 = values[Math.floor((values.length * 3) / 4)];
      return [min, q1, median, q3, max];
    });

    return {
      categories: Object.keys(groupedData),
      values: boxPlotData,
    };
  };

  const calculateHistogramBins = (data) => {
    const bins = [];
    const binSize = 5; // Adjust based on your data distribution
    const min = Math.min(...data);
    const max = Math.max(...data);
    const numBins = Math.ceil((max - min) / binSize);

    for (let i = 0; i < numBins; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const count = data.filter(
        (value) => value >= binStart && value < binEnd
      ).length;
      bins.push(count);
    }

    return bins;
  };

  const renderChart = () => {
    const chart = echarts.init(chartRef.current);

    const data =
      chartType === "Box-plot"
        ? processBoxPlotData()
        : processBarLineScatterData();

    let xAxisType = "category";
    let rotateLabel = false;

    if (chartType === "Scatter plot") {
      xAxisType = "value";
    }

    if (data.x && data.x.length > 10) {
      rotateLabel = true;
    }

    const commonOptions = {
      title: {
        text: title,
        subtext: description,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: (params) => {
          if (Array.isArray(params)) {
            return params
              .map(
                (param) =>
                  `${param.seriesName}<br/>${xAxis}: ${param.name}<br/>${yAxis}: ${param.data}`
              )
              .join("<br/>");
          }
          return `${params.seriesName}<br/>${xAxis}: ${params.name}<br/>${yAxis}: ${params.data}`;
        },
      },
      xAxis: {
        type: xAxisType,
        name: xAxis,
        data: xAxisType === "category" ? data.x || data.categories : undefined,
        axisLabel: {
          rotate: rotateLabel ? 90 : 0,
        },
      },
      yAxis: {
        type: "value",
        name: yAxis === "count" ? "Count" : yAxis,
      },
      series: [],
    };

    const labelOption = {
      show: true,
      position: "top",
      formatter: "{c}",
    };

    switch (chartType) {
      case "Bar": {
        commonOptions.series.push({
          name: yAxis,
          type: "bar",
          data: data.y,
          itemStyle: { color: "#008b8b" },
          label: labelOption,
        });
        break;
      }
      case "Line": {
        commonOptions.series.push({
          name: yAxis,
          type: "line",
          data: data.y,
          itemStyle: { color: "#008b8b" },
          label: labelOption,
        });
        break;
      }
      case "Scatter plot": {
        commonOptions.series.push({
          name: yAxis,
          type: "scatter",
          data: data.y,
          itemStyle: { color: "#008b8b" },
          label: labelOption,
        });
        break;
      }
      case "Box-plot": {
        commonOptions.series.push({
          name: yAxis,
          type: "boxplot",
          data: data.values,
          itemStyle: { color: "#008b8b" },
        });
        break;
      }
      case "Histogram": {
        const bins = calculateHistogramBins(data.x);
        commonOptions.series.push({
          name: yAxis,
          type: "bar",
          data: bins,
          itemStyle: { color: "#008b8b" },
          label: labelOption,
        });
        break;
      }
      default:
        toast.error("Please select a chart type.");
        return;
    }

    chart.setOption(commonOptions);
  };

  return (
    <div className="main_container">
      <header>&copy; JaCoya Thompson</header>
      <div className="content">
        <aside>
          <h1>
            <IoMdSettings /> Control Panel
          </h1>
          <div className="section">
            <h3>
              <CgDetailsMore />
              Chart Details
            </h3>
            <div className="wrapper">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Enter a title for the chart"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="wrapper">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                placeholder="Enter a description for the chart"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="section">
            <h3>
              <FaChartBar />
              Chart Configuration
            </h3>
            <div className="wrapper">
              <label htmlFor="file">Select a CSV file</label>
              <input
                type="file"
                id="file"
                accept="text/csv"
                onChange={handleFileChange}
              />
            </div>
            <div className="wrapper">
              <label htmlFor="type">Chart type</label>
              <select
                id="type"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="">Select Chart Type</option>
                <option value="Bar">Bar</option>
                <option value="Box-plot">Box-plot</option>
                <option value="Scatter plot">Scatter plot</option>
                <option value="Line">Line</option>
                <option value="Histogram">Histogram</option>
              </select>
            </div>
            <div className="wrapper">
              <label htmlFor="xaxis">X axis</label>
              <select
                id="xaxis"
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
              >
                <option value="">Select X axis</option>
                {columnHeaders.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            {chartType !== "Histogram" && (
              <>
                <div className="wrapper">
                  <label htmlFor="yaxis">Y axis</label>
                  <select
                    id="yaxis"
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                  >
                    <option value="">Select Y axis</option>
                    {columnHeaders.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                    <option value="count">Count</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </aside>
        <main>
          {isLoading ? (
            <span className="loader"></span>
          ) : (
            <div
              className="chart_container"
              ref={chartRef}
              style={{ width: "100%", height: "100%" }}
            >
              {/* Chart will render here */}
            </div>
          )}
        </main>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
