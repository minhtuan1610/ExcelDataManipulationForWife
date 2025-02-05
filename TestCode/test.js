import { convertXlsx } from "../src/scripts/json.conversion.js";

document.getElementById("convert").addEventListener("click", function () {
  const fileInput = document.getElementById("upload");
  convertXlsx(fileInput, function (json) {
    console.log(json);
  });
});
