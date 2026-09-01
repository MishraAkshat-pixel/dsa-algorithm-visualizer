const barsContainer = document.getElementById("bars");
const sizeInput = document.getElementById("size");
const sizeValue = document.getElementById("sizeValue");
const algorithmSelect = document.getElementById("algorithm");
const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");
const statusEl = document.getElementById("status");

let array = [];
let comparisons = 0;
let swaps = 0;
let sorting = false;

const details = {
  bubble: {
    title: "Bubble Sort",
    description: "Repeatedly compares adjacent elements and swaps them when they are in the wrong order.",
    complexity: "O(n²)"
  },
  selection: {
    title: "Selection Sort",
    description: "Finds the smallest remaining element and places it at the beginning of the unsorted section.",
    complexity: "O(n²)"
  },
  insertion: {
    title: "Insertion Sort",
    description: "Builds the sorted array one element at a time by inserting each value into its correct position.",
    complexity: "O(n²)"
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

function render(active = []) {
  barsContainer.innerHTML = "";

  const max = Math.max(...array, 1);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    if (active.includes(index)) bar.classList.add("active");
    bar.style.height = `${(value / max) * 100}%`;
    bar.title = value;
    barsContainer.appendChild(bar);
  });
}

function updateStats() {
  comparisonsEl.textContent = comparisons;
  swapsEl.textContent = swaps;
}

function generate() {
  if (sorting) return;
  array = randomArray(Number(sizeInput.value));
  comparisons = 0;
  swaps = 0;
  statusEl.textContent = "Ready";
  updateStats();
  render();
}

async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      render([j, j + 1]);
      updateStats();
      await sleep(55);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        render([j, j + 1]);
        updateStats();
        await sleep(55);
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      render([minIndex, j]);
      updateStats();
      await sleep(55);

      if (array[j] < array[minIndex]) minIndex = j;
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;
      render([i, minIndex]);
      updateStats();
      await sleep(75);
    }
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let j = i;

    while (j > 0) {
      comparisons++;
      render([j - 1, j]);
      updateStats();
      await sleep(55);

      if (array[j - 1] <= array[j]) break;

      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      swaps++;
      j--;
      render([j, j + 1]);
      updateStats();
      await sleep(55);
    }
  }
}

async function visualize() {
  if (sorting) return;

  sorting = true;
  statusEl.textContent = "Sorting...";

  if (algorithmSelect.value === "bubble") await bubbleSort();
  if (algorithmSelect.value === "selection") await selectionSort();
  if (algorithmSelect.value === "insertion") await insertionSort();

  render();
  statusEl.textContent = "Sorted";
  sorting = false;
}

function updateAlgorithmInfo() {
  const data = details[algorithmSelect.value];
  document.getElementById("algorithmTitle").textContent = data.title;
  document.getElementById("description").textContent = data.description;
  document.getElementById("complexity").textContent = data.complexity;
}

sizeInput.addEventListener("input", () => {
  sizeValue.textContent = sizeInput.value;
});

document.getElementById("generate").addEventListener("click", generate);
document.getElementById("sort").addEventListener("click", visualize);
document.getElementById("reset").addEventListener("click", generate);
algorithmSelect.addEventListener("change", updateAlgorithmInfo);

updateAlgorithmInfo();
generate();
