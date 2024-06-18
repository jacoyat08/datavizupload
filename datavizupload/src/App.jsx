// import { useEffect, useState } from "react";
// import "./App.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import csvToJson from "./util/csvToJson";

// function App() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [csvData, setCsvData] = useState();
//   const [jsonData, setJsonData] = useState([]);
//   const [columnHeaders, setColumnHeaders] = useState();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [chartType, setChartType] = useState("");
//   const [xAxis, setXAxis] = useState("");
//   const [yAxis, setYAxis] = useState("");

//   // Allowed file types
//   const allowedFileTypes = ["text/csv"];

//   const handleSubmit = (e) => {
//     // e.preventDefault();
//     // getJsonFromCsv();
//     // console.log(jsonData);
//     // console.log(columnHeaders);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) {
//       toast.error("No file selected!");
//       return;
//     }

//     if (!allowedFileTypes.includes(file.type)) {
//       toast.error("Only CSV files are allowed!");
//       e.target.value = "";
//       return;
//     }

//     setCsvData(file);
//   };

//   const getJsonFromCsv = async () => {
//     if (csvData) {
//       setIsLoading(true);
//       const { json, dataTypes } = await csvToJson(csvData);

//       setJsonData(json);
//       setColumnHeaders(dataTypes);
//       setIsLoading(true);
//     }
//   };

//   useEffect(() => {
//     if (csvData) {
//       getJsonFromCsv();
//       console.log(jsonData);
//       console.log(columnHeaders);
//     }
//   }, [csvData, chartType, xAxis, yAxis]);

//   return (
//     <div className="main_container">
//       <header>&copy; JaCoya Thompson</header>
//       <div className="content">
//         <aside>
//           <h1>Control Panel</h1>
//           <div className="section">
//             <h3>Chart Details</h3>
//             <label htmlFor="title">Title</label>
//             <input
//               type="text"
//               id="title"
//               placeholder="Enter a title for the chart"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <label htmlFor="desc">Description</label>
//             <textarea
//               id="desc"
//               placeholder="Enter a description for the chart"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
//           <div className="section">
//             <h3>Chart Configuration</h3>
//             <form>
//               <label htmlFor="file">Select a CSV file</label>
//               <input
//                 type="file"
//                 id="file"
//                 accept="text/csv"
//                 onChange={(e) => {
//                   handleFileChange(e);
//                 }}
//               />
//               <label htmlFor="type">Chart type</label>
//               <select
//                 id="type"
//                 value={chartType}
//                 onChange={(e) => setChartType(e.target.value)}
//               >
//                 <option>Bar</option>
//                 <option>Box-plot</option>
//                 <option>Scatter plot</option>
//                 <option>Line</option>
//                 <option>Histogram</option>
//               </select>

//               <label htmlFor="xaxis">X axis</label>
//               <select
//                 id="xaxis"
//                 className="axis_select"
//                 value={xAxis}
//                 onChange={(e) => setXAxis(e.target.value)}
//               >
//                 <option>This</option>
//                 <option>Will</option>
//                 <option>Automatically</option>
//                 <option>Filled</option>
//               </select>
//               <p className="axis_desc">
//                 Detected type: <strong>Number</strong>
//               </p>
//               <label htmlFor="yaxis">Y axis</label>
//               <select
//                 id="yaxis"
//                 className="axis_select"
//                 value={yAxis}
//                 onChange={(e) => setYAxis(e.target.value)}
//               >
//                 <option>This</option>
//                 <option>Will</option>
//                 <option>Automatically</option>
//                 <option>Filled</option>
//               </select>
//               <p className="axis_desc">
//                 Detected type: <strong>String</strong>
//               </p>
//               <button
//                 onClick={(e) => {
//                   handleSubmit(e);
//                 }}
//               >
//                 Update
//               </button>
//             </form>
//           </div>
//         </aside>
//         <main>
//           {isLoading ? (
//             <span className="loader"></span>
//           ) : (
//             <div className="chart_container">The chart goes here...</div>
//           )}
//         </main>
//       </div>

//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//         transition:Slide
//       />
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import csvToJson from "./util/csvToJson";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState(null); // Initialize csvData as null
  const [jsonData, setJsonData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  // Allowed file types
  const allowedFileTypes = ["text/csv"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission if needed
    // console.log(jsonData);
    // console.log(columnHeaders);
  };

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

    setCsvData(file); // Set csvData when a file is selected
  };

  const getJsonFromCsv = async (file) => {
    try {
      setIsLoading(true);
      const { json, dataTypes } = await csvToJson(file);
      // console.log("Parsed JSON:", json); // Debugging log
      // console.log("Detected Data Types:", dataTypes); // Debugging log
      setJsonData(json);
      setColumnHeaders(dataTypes);
    } catch (error) {
      // console.error("Error parsing CSV:", error);
      toast.error("Error parsing CSV file.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (csvData) {
      getJsonFromCsv(csvData); // Call getJsonFromCsv when csvData changes
    }
  }, [csvData]); // Only run this effect when csvData changes

  useEffect(() => {
    // Only when jsonData and columnHeaders have data
    if (jsonData.length > 0 && columnHeaders.length > 0) {
      console.log("jsonData updated:", jsonData); // Debugging log
      console.log("columnHeaders updated:", columnHeaders); // Debugging log
    }
  }, [jsonData, columnHeaders]); // Log jsonData and columnHeaders updates

  return (
    <div className="main_container">
      <header>&copy; JaCoya Thompson</header>
      <div className="content">
        <aside>
          <h1>Control Panel</h1>
          <div className="section">
            <h3>Chart Details</h3>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter a title for the chart"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              placeholder="Enter a description for the chart"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="section">
            <h3>Chart Configuration</h3>
            <form>
              <label htmlFor="file">Select a CSV file</label>
              <input
                type="file"
                id="file"
                accept="text/csv"
                onChange={(e) => {
                  handleFileChange(e);
                }}
              />
              <label htmlFor="type">Chart type</label>
              <select
                id="type"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option>Bar</option>
                <option>Box-plot</option>
                <option>Scatter plot</option>
                <option>Line</option>
                <option>Histogram</option>
              </select>

              <label htmlFor="xaxis">X axis</label>
              <select
                id="xaxis"
                className="axis_select"
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
              >
                <option>This</option>
                <option>Will</option>
                <option>Automatically</option>
                <option>Filled</option>
              </select>
              <p className="axis_desc">
                Detected type: <strong>Number</strong>
              </p>
              <label htmlFor="yaxis">Y axis</label>
              <select
                id="yaxis"
                className="axis_select"
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
              >
                <option>This</option>
                <option>Will</option>
                <option>Automatically</option>
                <option>Filled</option>
              </select>
              <p className="axis_desc">
                Detected type: <strong>String</strong>
              </p>
              <button
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                Update
              </button>
            </form>
          </div>
        </aside>
        <main>
          {isLoading ? (
            <span className="loader"></span>
          ) : (
            <div className="chart_container">The chart goes here...</div>
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
        transition:Slide
      />
    </div>
  );
}

export default App;
