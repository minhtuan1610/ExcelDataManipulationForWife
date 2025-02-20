document.getElementById("convert").addEventListener("click", async function () {
  const fileInput = document.getElementById("upload");
  let abc = "g";
  console.log(abc);

  abc = await new Promise((resolve, reject) => {
    convertXlsx(fileInput, function (json) {
      resolve(json);
      reject("error");
      // console.log(json);
    });
  });

  console.log(abc);
});
