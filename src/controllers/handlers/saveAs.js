export const saveAs = (dataURL, { name, ext }) => {
  fetch(dataURL, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
    responseType: "blob",
  }).then(response => {
    response.blob().then(blob => {
      const a = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `${name}.${ext}`;
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    });
  });
}
