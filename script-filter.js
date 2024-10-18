document.querySelector("input").addEventListener("change", convertJsonAndWrite);

function convertJsonAndWrite() {
  /* Convert excel to json */
  let reader = new FileReader();
  reader.onload = convertJson;
  reader.readAsArrayBuffer(this.files[0]);
}

function convertJson() {
  let jsonExcel;
  let arrayBuffer = this.result;
  let array = new Uint8Array(arrayBuffer);
  let binaryString = String.fromCharCode.apply(null, array);
  /* Call XLSX */
  let workbook = XLSX.read(binaryString, { type: "binary" });
  /* DO SOMETHING WITH workbook HERE */
  let first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  let worksheet = workbook.Sheets[first_sheet_name];
  /* Save data into json */
  jsonExcel = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  console.log("jsonExcel: ", jsonExcel);
  const result = Object.groupBy(jsonExcel, (res) => res["TRN Date"]);
  console.log("result: ", result);
  let dataResult = [];
  for (let date in result) {
    console.log(`TRN Date: ${date}:`);
    const seq = Object.groupBy(result[date], (res) => res["FILE SEQ"]);
    for (const fileSeq in seq) {
      console.log(`File SEQ ${fileSeq} - ${seq[fileSeq].length} records`);
      const objData = { date: date, fileSeq, count: seq[fileSeq].length };
      dataResult.push(objData);
    }
  }
  console.log("data result", dataResult);

  /* Draw table */
  const tbl = document.createElement("table");
  const thead = tbl.createTHead();
  const headRow = thead.insertRow();
  const headerTbl = [
    "Batch",
    "NO",
    "TRX Date",
    "CFM TRX NO",
    "Business Type",
    "Normal Count",
    "Receive File Name",
    "Send File Name",
  ];

  headerTbl.forEach((element) => {
    const th = document.createElement("th");
    th.textContent = element;
    headRow.appendChild(th);
  });

  for (let i in dataResult) {
    if (dataResult[i].fileSeq != "undefined") {
      const row = tbl.insertRow();
      const cellBatch = row.insertCell();
      cellBatch.textContent = dataResult[i].fileSeq;
      const cellNo = row.insertCell();
      cellNo.textContent = parseInt(i) + 1; // the row number //
      const cellDate = row.insertCell();
      cellDate.textContent = dataResult[i].date;
      const cellCfm = row.insertCell();
      cellCfm.textContent =
        "Vobeo_" + cellDate.textContent + "_" + cellBatch.textContent;
      const cellBusi = row.insertCell();
      cellBusi.textContent = "500-BULK COLLECTION";
      const cellCount = row.insertCell();
      cellCount.textContent = dataResult[i].count;
      const cellRfn = row.insertCell();
      cellRfn.textContent =
        "S_RFN_" + cellDate.textContent + "_" + cellBatch.textContent;
      const cellSfn = row.insertCell();
      cellSfn.textContent =
        "R_SFN_" + cellDate.textContent + "_" + cellBatch.textContent;
    }
  }

  /* Print the data */
  document.getElementById("result").appendChild(tbl);
}
