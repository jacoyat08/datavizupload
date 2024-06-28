import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import csvToJson from "./util/csvToJson";
import Plot from "react-plotly.js";
import { FaTools } from "react-icons/fa";
import { GrDocumentImage } from "react-icons/gr";
import html2canvas from "html2canvas";

function App() {
  const [csvData, setCsvData] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chartType, setChartType] = useState("");
  const [xAxisOptions, setXAxisOptions] = useState([]);
  const [yAxisOptions, setYAxisOptions] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartData, setChartData] = useState({});
  const [binSize, setBinSize] = useState(5);
  const [binSizeRange, setBinSizeRange] = useState({ min: 1, max: 20 });

  const allowedFileTypes = ["text/csv"];
  const chartRef = useRef(null);

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
    try {
      const { json, dataTypes } = await csvToJson(csvData);
      setJsonData(json);
      setColumnHeaders(dataTypes);
    } catch (error) {
      toast.error(
        "Failed to read selected file. Please ensure a valid CSV file is selected."
      );
    }
  };

  const populateAxesAndSetData = () => {
    let filteredXAxisOptions;
    let filteredYAxisOptions;

    let x;
    let y;

    if (chartType === "bar" || chartType === "line" || chartType === "box") {
      filteredXAxisOptions = columnHeaders.filter(
        (column) => column.type === "String" || column.type === "Date"
      );

      filteredYAxisOptions = columnHeaders.filter(
        (column) => column.type === "Number"
      );

      x = jsonData.map((item) => item[xAxis]);
      y = jsonData.map((item) => Number(item[yAxis]));
    } else if (chartType === "scatter") {
      filteredXAxisOptions = columnHeaders.filter(
        (column) => column.type === "Number" && column.name !== yAxis
      );

      filteredYAxisOptions = columnHeaders.filter(
        (column) => column.type === "Number" && column.name !== xAxis
      );

      x = jsonData.map((item) => Number(item[xAxis]));
      y = jsonData.map((item) => Number(item[yAxis]));
    } else if (chartType === "histogram") {
      filteredXAxisOptions = columnHeaders.filter(
        (column) => column.type === "Number"
      );

      filteredYAxisOptions = null;

      x = jsonData.map((item) => Number(item[xAxis]));
      y = null;

      // Calculate min and max values for selected x-axis field
      const xValues = x.map((item) => Number(item));
      const minValue = Math.min(...xValues);
      const maxValue = Math.max(...xValues);

      // Update bin size range based on data
      setBinSizeRange({ min: minValue, max: maxValue });
    } else {
      return;
    }

    setXAxisOptions(filteredXAxisOptions);
    setYAxisOptions(filteredYAxisOptions);

    const dataConfig = {
      x,
      y,
      type: chartType,
      marker: { color: "red" }, // example of additional data formatting
    };

    if (chartType === "histogram") {
      dataConfig.xbins = { size: binSize };
    }

    setChartData(dataConfig);
  };

  useEffect(() => {
    if (csvData) {
      getJsonFromCsv();
    }
  }, [csvData]);

  useEffect(() => {
    populateAxesAndSetData();
  }, [chartType, columnHeaders, xAxis, yAxis, binSize]);

  useEffect(() => {
    if (xAxis && !yAxis) {
      setYAxis("count");
    }
  }, [xAxis, yAxis]);

  const handleDownloadAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current)
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "chart.png";
          link.click();
        })
        .catch((error) => {
          toast.error("Error capturing the chart:", error);
        });
    }
  };

  return (
    <div className="main_container">
      {/* <header>&copy; JaCoya Thompson</header> */}
      <div className="content">
        <aside>
          <h1>
            <FaTools /> Chart Setup
          </h1>

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

          <div className="wrapper">
            <label htmlFor="file">Select a CSV file</label>
            <input
              type="file"
              id="file"
              accept="text/csv"
              onChange={handleFileChange}
            />
          </div>
          {!csvData ? null : (
            <>
              <div className="wrapper">
                <label htmlFor="type">Chart type</label>
                <select
                  id="type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="">Select Chart Type</option>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="scatter">Scatter plot</option>
                  <option value="histogram">Histogram</option>
                  <option value="box">Box-plot</option>
                </select>
              </div>
            </>
          )}

          {!chartType || chartType === "" ? null : (
            <>
              <div className="wrapper">
                <label htmlFor="xaxis">X axis</label>
                <select
                  id="xaxis"
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  <option value="">Select X axis</option>
                  {xAxisOptions &&
                    xAxisOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {chartType === "histogram" ? (
            <>
              <div className="wrapper">
                <label htmlFor="binSize">
                  Bin size: {binSize} (Range: {binSizeRange.min} -{" "}
                  {binSizeRange.max})
                </label>
                <input
                  type="range"
                  className="slider"
                  id="binSize"
                  min={binSizeRange.min}
                  max={binSizeRange.max}
                  step={1}
                  value={binSize}
                  onChange={(e) => setBinSize(e.target.value)}
                />
              </div>
            </>
          ) : null}

          {!xAxis || xAxis === "" || chartType === "histogram" ? null : (
            <>
              <div className="wrapper">
                <label htmlFor="yaxis">Y axis</label>
                <select
                  id="yaxis"
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                >
                  <option value="">Select Y axis</option>
                  {yAxisOptions &&
                    yAxisOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
        </aside>
        <main>
          <div
            className="chart_container"
            style={{ width: "100%", height: "100%" }}
            ref={chartRef}
          >
            <div className="chart_header">
              <h2 className="title">{title}</h2>
              <h4 className="description">{description}</h4>
            </div>
            <div className="chart_main">
              {!csvData ? (
                "Upload CSV dataset to see configuration options"
              ) : (
                <Plot
                  data={[
                    {
                      x: chartData.x,
                      y: chartData.y,
                      type: chartData.type,

                      mode:
                        chartType === "scatter" ? "markers" : "lines+markers",
                      marker: { color: "#ff4500" },
                      ...(chartType === "histogram" && {
                        xbins: { size: binSize },
                      }),
                    },
                  ]}
                  layout={{
                    font: { family: "'Nunito', sans-serif" },
                    margin: { l: 50, r: 0, b: 100, t: 0, pad: 0 },
                    autosize: true,
                    // title: title,
                    xaxis: { title: xAxis },
                    yaxis: {
                      title: chartType === "histogram" ? "Frequency" : yAxis,
                    },
                  }}
                  config={{
                    displayModeBar: false,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  useResizeHandler={true}
                />
              )}
            </div>
          </div>
          {xAxis && (
            <>
              <div className="downloadControls">
                <button
                  className="downloadBtn"
                  title="Download as PNG"
                  onClick={handleDownloadAsPNG}
                >
                  <GrDocumentImage />
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <footer>
        <span>&copy; 2024 JaCoya Thompson</span>
        <span>
          Built by{" "}
          <a href="https://www.upwork.com/freelancers/~01502fac21fd11e46a?s=1110580755107926016">
            Ibanga Ibanga
          </a>
        </span>
      </footer>
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
        theme="light"
      />
    </div>
  );
}

export default App;
