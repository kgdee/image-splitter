const imageInput = document.querySelector(".image-input");
let currentFile = null

window.addEventListener("error", (event) => {
  const error = `${event.type}: ${event.message}`;
  console.error(error);
  alert(error);
});

async function splitImage() {
  const file = imageInput.files[0] || currentFile
  if (!file) return;

  currentFile = file
  
  const nameParts = file.name.match(/(.*?)(\.[^.]+)$/);
  const imageFileName = nameParts ? nameParts[1] : "slice";
  const imageExtension = nameParts ? nameParts[2] : ".png";

  const imageEl = await createImageEl(file);

  const rows = parseInt(document.getElementById("rows").value);
  const cols = parseInt(document.getElementById("cols").value);
  const preview = document.getElementById("preview");
  preview.innerHTML = "";

  const width = imageEl.width;
  const height = imageEl.height;
  const sliceWidth = width / cols;
  const sliceHeight = height / rows;

  let index = 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = sliceWidth;
      canvas.height = sliceHeight;

      ctx.drawImage(imageEl, col * sliceWidth, row * sliceHeight, sliceWidth, sliceHeight, 0, 0, sliceWidth, sliceHeight);

      const link = document.createElement("a");
      link.download = `${imageFileName} (${index++})${imageExtension}`;
      link.href = canvas.toDataURL();
      link.appendChild(canvas);
      preview.appendChild(link);
    }
  }
}

async function createImageEl(file) {
  const imageEl = new Image();

  if (file instanceof File) {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    imageEl.src = dataUrl;
  } else {
    imageEl.src = file
  }

  return imageEl;
}
