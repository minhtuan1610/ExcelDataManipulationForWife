let cfm = "MaiBeo";
let rfn = "MaiMap";
let sfn = "MaiCua";
document.querySelector("#cfm").addEventListener("change", (e) => {
  cfm = changeInputData(e, "MaiBeo");
});

document.querySelector("#rfn").addEventListener("change", (e) => {
  rfn = changeInputData(e, "MaiMap");
});

document.querySelector("#sfn").addEventListener("change", (e) => {
  sfn = changeInputData(e, "MaiCua");
});

document.querySelector("#data").addEventListener("change", convertJsonAndWrite);

function changeInputData(event, defaultData) {
  if (
    event.target.value === null ||
    event.target.value.match(/^ *$/) !== null
  ) {
    return defaultData;
  }
  return event.target.value;
}

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

  /* Create header table */
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

  /* Add data in each row table */
  for (let i in dataResult) {
    if (dataResult[i].fileSeq != "undefined") {
      const row = tbl.insertRow();
      const cellBatch = row.insertCell();
      const cellNo = row.insertCell();
      const cellDate = row.insertCell();
      const cellCfm = row.insertCell();
      const cellBusi = row.insertCell();
      const cellCount = row.insertCell();
      const cellRfn = row.insertCell();
      const cellSfn = row.insertCell();
      cellBatch.textContent = dataResult[i].fileSeq;
      cellNo.textContent = parseInt(i) + 1; // the row number //
      cellDate.textContent = dataResult[i].date;
      cellCfm.textContent =
        cfm + "_" + cellDate.textContent + "_" + cellBatch.textContent;
      cellBusi.textContent = "500-BULK COLLECTION";
      cellCount.textContent = dataResult[i].count;
      cellRfn.textContent =
        rfn + "_" + cellDate.textContent + "_" + cellBatch.textContent;
      cellSfn.textContent =
        sfn + "_" + cellDate.textContent + "_" + cellBatch.textContent;
    }
  }

  /* Print the data */
  document.getElementById("result").appendChild(tbl);
}
