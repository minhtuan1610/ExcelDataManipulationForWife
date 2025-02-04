import * as XLSX from "../lib/xlsx.full.min.js";

export function convertXlsx(file, callbackFunc) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const json = XLSX.utils.sheet_to_json(worksheet);
    callbackFunc(json);
  };

  reader.readAsArrayBuffer(file);
}

convertXlsx();
