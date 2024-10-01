document.querySelector("input").addEventListener("change", function () {
  var reader = new FileReader();
  var mai;
  reader.onload = function () {
    var arrayBuffer = this.result,
      array = new Uint8Array(arrayBuffer),
      binaryString = String.fromCharCode.apply(null, array);

    /* Call XLSX */
    var workbook = XLSX.read(binaryString, {
      type: "binary",
    });

    /* DO SOMETHING WITH workbook HERE */
    var first_sheet_name = workbook.SheetNames[0];
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    mai = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
    const result = Object.groupBy(mai, (res) => res["TRN Date"]);
    console.log("result: ", result);
    seq = Object.groupBy(result[20240807], (res) => res["FILE SEQ"]);
    console.log("seq: ", seq);

    for (let i in seq) {
      for (let j = 0; j < seq[i].length; j++) {
        console.log("loop: ", seq[i][j]);
        const p = document.createElement("p");
        p.textContent = `${
          seq[i][j]["TRN Date"] + " " + seq[i][j]["FILE SEQ"]
        }`;
        document.getElementById("maicua").appendChild(p);
      }
    }
  };
  reader.readAsArrayBuffer(this.files[0]);
});
