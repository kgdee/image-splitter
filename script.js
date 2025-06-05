const imageInput = document.querySelector(".image-input");
const rowInput = document.querySelector(".row-input");
const columnInput = document.querySelector(".column-input");
const preview = document.querySelector(".preview");
const loadingScreen = document.querySelector(".loading-screen")

let currentFile = null;

window.addEventListener("error", (event) => {
  const error = `${event.type}: ${event.message}`;
  console.error(error);
  alert(error);
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampInput(event) {
  if (!event.target.value) return
  const value = parseInt(event.target.value)
  event.target.value = clamp(value, 1, 5);
}

function select(element) {
  element.select()
}

async function splitImage() {
  const file = imageInput.files[0] || currentFile;
  if (!file || !rowInput.value || !columnInput.value) return;

  toggleLoading(true)
  const rows = rowInput.value
  const columns = columnInput.value

  currentFile = file;

  const nameParts = file.name.match(/(.*?)(\.[^.]+)$/);
  const imageFileName = nameParts ? nameParts[1] : "slice";
  const imageExtension = nameParts ? nameParts[2] : ".png";

  const imageEl = await createImageEl(file);

  const width = imageEl.width;
  const height = imageEl.height;
  const sliceWidth = width / columns;
  const sliceHeight = height / rows;

  let index = 2;

  preview.innerHTML = "";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = sliceWidth;
      canvas.height = sliceHeight;

      ctx.drawImage(imageEl, col * sliceWidth, row * sliceHeight, sliceWidth, sliceHeight, 0, 0, sliceWidth, sliceHeight);

      preview.innerHTML += `
        <a class="item" href="${canvas.toDataURL()}" download="${imageFileName} (${index++})${imageExtension}">
          <img src="${canvas.toDataURL()}" />
        </a>
      `
    }
  }

  toggleLoading(false)
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
    imageEl.src = file;
  }

  return imageEl;
}

function toggleLoading(force = false) {
  loadingScreen.classList.toggle("hidden", !force)
}