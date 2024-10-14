document.querySelector("input").addEventListener("change", convertJsonAndWrite);

function convertJsonAndWrite() {
  // Convert excel to json
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
  // Save data into json
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
  const tbl = document.createElement("table");
  const thead = tbl.createTHead();
  const head1 = thead.insertRow();
  head1.insertCell().textContent = "TRN Date";
  const head2 = thead.insertRow();
  head2.insertCell().textContent = "FILE SEQ";
  const head3 = thead.insertRow();
  head3.insertCell().textContent = "Normal Count";
  for (let i in dataResult) {
    const row = tbl.insertRow();
    const cell1 = row.insertCell(0);
    cell1.textContent = dataResult[i].date;
    const cell2 = row.insertCell(1);
    cell2.textContent = dataResult[i].fileSeq;
    const cell3 = row.insertCell(2);
    cell3.textContent = dataResult[i].count;
  }
  document.body.appendChild(tbl);
}
