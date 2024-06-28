// import { parse, isValid, format } from "date-fns";

// const csvToJson = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!(file instanceof Blob)) {
//       return reject(new TypeError("Parameter is not of type Blob."));
//     }

//     const reader = new FileReader();

//     reader.onload = function (event) {
//       const text = event.target.result;
//       const lines = text
//         .split("\n")
//         .map((line) => line.trim())
//         .filter((line) => line);

//       if (lines.length < 2) {
//         return reject(
//           new Error("CSV file should have at least one row of data")
//         );
//       }

//       const headers = lines[0].split(",").map((header) => header.trim());
//       const json = lines.slice(1).map((line) => {
//         const values = line.split(",").map((value) => value.trim());
//         const obj = {};
//         headers.forEach((header, index) => {
//           obj[header] = values[index];
//         });
//         return obj;
//       });

//       const dataTypes = detectDataTypesAndConvertDates(json, headers);

//       resolve({ json, dataTypes });
//     };

//     reader.onerror = function () {
//       reject(new Error("Failed to read file"));
//     };

//     reader.readAsText(file);
//   });
// };

// function detectDataTypesAndConvertDates(json, headers) {
//   const dateFormats = ["MM/dd/yyyy", "M/d/yy"];

//   const dataTypes = headers.map((header) => {
//     let type = "String"; // Default type

//     for (let row of json) {
//       const value = row[header];

//       // Check if the value is empty or undefined
//       if (value === undefined || value.trim() === "") {
//         continue; // Skip empty values
//       }

//       // Check if the value is a number
//       if (!isNaN(value)) {
//         type = "Number";
//         continue;
//       }

//       // Check if the value is a valid date
//       let parsedDate;
//       for (let formatStr of dateFormats) {
//         parsedDate = parse(value, formatStr, new Date());
//         if (isValid(parsedDate)) {
//           type = "Date";
//           row[header] = format(parsedDate, "yyyy-MM-dd"); // Correct usage of `format`
//           break;
//         }
//       }

//       // If not a number or a date, default to string
//       if (type !== "Date" && type !== "Number") {
//         type = "String";
//       }
//     }

//     return { name: header, type };
//   });

//   return dataTypes;
// }

// export default csvToJson;

import { parse, isValid, format } from "date-fns";

const csvToJson = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      return reject(new TypeError("Parameter is not of type Blob."));
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const text = event.target.result;
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      if (lines.length < 2) {
        return reject(
          new Error("CSV file should have at least one row of data")
        );
      }

      const headers = lines[0].split(",").map((header) => header.trim());
      const json = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim());
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        return obj;
      });

      const dataTypes = detectDataTypesAndConvertDates(json, headers);

      resolve({ json, dataTypes });
    };

    reader.onerror = function () {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

function detectDataTypesAndConvertDates(json, headers) {
  // const dateFormats = ["MM/dd/yyyy", "M/d/yy"];
  const dateFormats = [
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "yyyy/MM/dd",
    "yyyy/dd/MM",
    "MM-dd-yyyy",
    "dd-MM-yyyy",
    "yyyy-MM-dd",
    "yyyy-dd-MM",
    "MM.dd.yyyy",
    "dd.MM.yyyy",
    "yyyy.MM.dd",
    "yyyy.dd.MM",
    "M/d/yyyy",
    "d/M/yyyy",
    "yyyy/M/d",
    "yyyy/d/M",
    "M-d-yyyy",
    "d-M-yyyy",
    "yyyy-M-d",
    "yyyy-d-M",
    "M.d.yyyy",
    "d.M.yyyy",
    "yyyy.M.d",
    "yyyy.d.M",
    "MM/dd/yy",
    "dd/MM/yy",
    "yy/MM/dd",
    "yy/dd/MM",
    "MM-dd-yy",
    "dd-MM-yy",
    "yy-MM-dd",
    "yy-dd-MM",
    "MM.dd.yy",
    "dd.MM.yy",
    "yy.MM.dd",
    "yy.dd.MM",
    "M/d/yy",
    "d/M/yy",
    "yy/M/d",
    "yy/d/M",
    "M-d-yy",
    "d-M-yy",
    "yy-M-d",
    "yy-d-M",
    "M.d.yy",
    "d.M.yy",
    "yy.M.d",
    "yy.d.M",
  ]; // updated dateFormats to capture all possible date formats used in the upload

  const dataTypes = headers.map((header) => {
    let type = "String"; // Default type

    for (let row of json) {
      const value = row[header];

      // Check if the value is empty or undefined
      if (value === undefined || value.trim() === "") {
        continue; // Skip empty values
      }

      // Check if the value is a number
      if (!isNaN(value)) {
        type = "Number";
        continue;
      }

      // Check if the value is a valid date
      let parsedDate;
      for (let formatStr of dateFormats) {
        parsedDate = parse(value, formatStr, new Date());
        if (isValid(parsedDate)) {
          type = "Date";
          row[header] = format(parsedDate, "yyyy-MM-dd"); // Correct usage of `format`
          break;
        }
      }

      // If not a number or a date, default to string
      if (type !== "Date" && type !== "Number") {
        type = "String";
      }
    }

    return { name: header, type };
  });

  return dataTypes;
}

export default csvToJson;
