let array = [];
let originalArray = [];
let isSorting = false;
let stopRequested = false;

function getBarScale() {
    const container = document.getElementById("array-container");
    if (!container || array.length === 0) return 1;

    const maxVal = Math.max(...array);
    if (!maxVal) return 1;

    const availableHeight = container.clientHeight - 20; // 
    return availableHeight / maxVal;
}


function setCustomArray() {
    if (isSorting) {
        setStatus("Wait: sorting is running. Stop it first or let it finish.");
        return;
    }

    const inputEl = document.getElementById("array-input");
    if (!inputEl) return;

    const raw = inputEl.value.trim();
    if (!raw) {
        setStatus("Please enter some numbers.");
        return;
    }

    const parts = raw.split(/[,\s]+/);
    const nums = [];

    for (const p of parts) {
        if (!p) continue;
        const n = Number(p);
        if (Number.isNaN(n)) {
            setStatus(`Invalid value: "${p}" is not a number.`);
            return;
        }
        nums.push(n);
    }

    if (nums.length === 0) {
        setStatus("No valid numbers found.");
        return;
    }

    if (nums.length > 20) {
        setStatus("Maximum 20 elements allowed.");
        return;
    }

    array = nums;
    originalArray = [...array];

    updateDisplay();
    clearBarClasses();
    setStatus("Custom array set. Now choose a sorting algorithm.");
}


function stopSorting() {
    stopRequested = true;
    setStatus("Sorting stopped.");
}


function generateArray() {
    if (isSorting) return;

    array = [];
    const container = document.getElementById("array-container");
    container.innerHTML = "";

    for (let i = 0; i < 20; i++) {
        const value = Math.floor(Math.random() * 100) + 10;
        array.push(value);
    }

    originalArray = [...array];

    updateDisplay();       // ye khud scale ke saath bars banayega
    setStatus("New array generated.");
}




function delay(ms) {
    return new Promise(resolve => {
        const start = Date.now();

        function check() {
            if (stopRequested) {
                return resolve();
            }
            const elapsed = Date.now() - start;
            if (elapsed >= ms) {
                return resolve();
            }
            requestAnimationFrame(check);
        }

        check();
    });
}


function refreshBars() {
    return document.getElementsByClassName("bar");
}

function resetArray() {
    if (isSorting) return;

    array = [...originalArray];
    updateDisplay();
    clearBarClasses();
    setStatus("Array reset to original state.");
}


function getBarScale() {
    const container = document.getElementById("array-container");
    if (!container || array.length === 0) return 1;

    const maxVal = Math.max(...array);
    if (!maxVal) return 1;

    const availableHeight = container.clientHeight - 20; // thoda margin
    return availableHeight / maxVal;
}

function updateDisplay() {
    const container = document.getElementById("array-container");
    container.innerHTML = "";

    const scale = getBarScale();
    const minHeight = 20; // ✅ har bar ki minimum height

    array.forEach(value => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("bar-wrapper");

        const bar = document.createElement("div");
        bar.classList.add("bar");

        // normal scaled height
        let h = value * scale;
        // ✅ minimum height apply karo
        if (h < minHeight) h = minHeight;

        bar.style.height = `${h-10}px`;

        const valueLabel = document.createElement("span");
        valueLabel.classList.add("bar-value");
        valueLabel.innerText = value;

        bar.appendChild(valueLabel);
        wrapper.appendChild(bar);
        container.appendChild(wrapper);
    });
}



// Clear active/sorted classes
function clearBarClasses() {
    const bars = refreshBars();
    for (let bar of bars) {
        bar.classList.remove("active");
        bar.classList.remove("sorted");
    }
}

// Disable/enable all sort buttons EXCEPT stop
function setControlsDisabled(disabled) {
    const buttons = document.querySelectorAll(".button-row button");
    buttons.forEach(btn => {
        if (btn.id === "stop-button") return; // keep stop clickable
        btn.disabled = disabled;
    });
}

// Status text
function setStatus(message) {
    const displayArea = document.getElementById("display-area");
    if (displayArea) {
        const current = displayArea.innerText;
        if (!current || current.startsWith("Status:")) {
            displayArea.innerText = `Status: ${message}`;
        }
    }
}

// Helper: update single bar's height & text from array[index]
function updateBarVisual(index) {
    const bars = refreshBars();
    const bar = bars[index];
    if (!bar) return;

    const scale = getBarScale();
    bar.style.height = `${array[index] * scale}px`;

    const label = bar.querySelector(".bar-value");
    if (label) label.innerText = array[index];
}


/* ----------------- Sort Runner Wrapper ------------------- */

async function runSort(sortFunction, name) {
    if (isSorting) return;

    isSorting = true;
    stopRequested = false; // reset stop flag
    clearBarClasses();
    setControlsDisabled(true);
    setStatus(`${name} is running...`);

    await sortFunction();

    if (!stopRequested) {
        const bars = refreshBars();
        for (let bar of bars) bar.classList.add("sorted");
        setStatus(`${name} completed.`);
    }

    isSorting = false;
    setControlsDisabled(false);
}

/* ----------------- Sorting Algorithms ------------------- */

// Bubble Sort
async function bubbleSort() {
    const bars = refreshBars();
    for (let i = 0; i < array.length - 1; i++) {
        if (stopRequested) return;

        for (let j = 0; j < array.length - i - 1; j++) {
            if (stopRequested) return;

            bars[j].classList.add("active");
            bars[j + 1].classList.add("active");

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                updateBarVisual(j);
                updateBarVisual(j + 1);

                await delay(1000);
            }

            bars[j].classList.remove("active");
            bars[j + 1].classList.remove("active");
        }
        bars[array.length - 1 - i].classList.add("sorted");
    }
    bars[0].classList.add("sorted");
}

// Selection Sort
async function selectionSort() {
    const bars = refreshBars();

    for (let i = 0; i < array.length; i++) {
        if (stopRequested) return;

        let minIndex = i;
        bars[i].classList.add("active");

        for (let j = i + 1; j < array.length; j++) {
            if (stopRequested) return;

            bars[j].classList.add("active");
            await delay(580);

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            bars[j].classList.remove("active");
        }

        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            updateBarVisual(i);
            updateBarVisual(minIndex);
        }

        bars[i].classList.remove("active");
        bars[i].classList.add("sorted");
    }
}

// Insertion Sort
async function insertionSort() {
    const bars = refreshBars();

    for (let i = 1; i < array.length; i++) {
        if (stopRequested) return;

        let key = array[i];
        let j = i - 1;

        bars[i].classList.add("active");

        while (j >= 0 && array[j] > key) {
            if (stopRequested) return;

            array[j + 1] = array[j];
            updateBarVisual(j + 1);

            j--;
            await delay(520); 
        }

        array[j + 1] = key;
        updateBarVisual(j + 1);

        bars[i].classList.remove("active");

        // Mark prefix as sorted
        for (let k = 0; k <= i; k++) {
            bars[k].classList.add("sorted");
        }
    }
}

// Merge Sort Wrapper
async function mergeSortWrapper() {
    await mergeSort(array, 0, array.length - 1);
}

// Merge Sort
async function mergeSort(arr, left, right) {
    if (stopRequested) return;
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
}

// Merge function for Merge Sort
async function merge(arr, left, mid, right) {
    if (stopRequested) return;

    const bars = refreshBars();
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    let i = 0,
        j = 0,
        k = left;

    // Highlight current merge range
    for (let idx = left; idx <= right; idx++) {
        bars[idx].classList.add("active");
    }

    while (i < leftArray.length && j < rightArray.length) {
        if (stopRequested) break;

        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            i++;
        } else {
            arr[k] = rightArray[j];
            j++;
        }

        updateBarVisual(k);
        await delay(1050);
        k++;
    }

    while (i < leftArray.length && !stopRequested) {
        arr[k] = leftArray[i];
        updateBarVisual(k);
        i++;
        k++;
        await delay(1050);
    }

    while (j < rightArray.length && !stopRequested) {
        arr[k] = rightArray[j];
        updateBarVisual(k);
        j++;
        k++;
        await delay(50);
    }

    // Remove highlight
    for (let idx = left; idx <= right; idx++) {
        bars[idx].classList.remove("active");
    }
}

// Quick Sort Wrapper/* ----------------- Quick Sort Wrapper ------------------- */

async function quickSortWrapper() {
    await quickSort(array, 0, array.length - 1);
}

/* ----------------- Quick Sort ------------------- */

async function quickSort(arr, low, high) {
    if (stopRequested) return;   // stop immediately

    if (low < high) {
        const pi = await partition(arr, low, high);

        if (stopRequested) return;

        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

/* ----------------- Partition (Lomuto Scheme) ------------------- */

async function partition(arr, low, high) {
    const bars = refreshBars();
    const pivot = arr[high];
    let i = low - 1;

    // Highlight pivot bar
    bars[high].classList.add("active");

    for (let j = low; j < high; j++) {

        if (stopRequested) {
            bars[j].classList.remove("active");
            bars[high].classList.remove("active");
            return i;
        }

        bars[j].classList.add("active");
        await delay(500);

        if (stopRequested) {
            bars[j].classList.remove("active");
            bars[high].classList.remove("active");
            return i;
        }

        // Compare with pivot
        if (arr[j] < pivot) {
            i++;

            // swap arr[i] ←→ arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];

            // Update visuals
            updateBarVisual(i);
            updateBarVisual(j);

            await delay(500);
        }

        bars[j].classList.remove("active");
    }

    if (stopRequested) {
        bars[high].classList.remove("active");
        return i;
    }

    // Final pivot swap to correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    updateBarVisual(i + 1);
    updateBarVisual(high);
    await delay(500);

    // Remove active from pivot
    bars[high].classList.remove("active");

    // Mark pivot sorted
    bars[i + 1].classList.add("sorted");

    return i + 1;
}

/* ----------------- Theme Toggle ------------------- */

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    const themeIcon = document.getElementById("theme-icon");

    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        themeIcon.textContent = "🌙";
    } else {
        localStorage.setItem("theme", "light");
        themeIcon.textContent = "🌞";
    }
}

/* ----------------- Pseudocode & Algorithm Display ------------------- */

function showPseudocode(algorithm) {
    const displayArea = document.getElementById("display-area");
    let pseudocodeText = "";

    switch (algorithm) {
        case "bubble":
            pseudocodeText = `
Bubble Sort Pseudocode:
1. Repeat (n - 1) times:
2.   For each pair of adjacent elements:
3.       If left > right: swap them
4.   If no swaps in a pass: array is sorted
`;
            break;
        case "selection":
            pseudocodeText = `
Selection Sort Pseudocode:
1. For i from 0 to n - 2:
2.   Assume minIndex = i
3.   For j from i + 1 to n - 1:
4.       If arr[j] < arr[minIndex]:
5.           minIndex = j
6.   Swap arr[i] with arr[minIndex]
`;
            break;
        case "insertion":
            pseudocodeText = `
Insertion Sort Pseudocode:
1. For i from 1 to n - 1:
2.   key = arr[i]
3.   j = i - 1
4.   While j >= 0 and arr[j] > key:
5.       arr[j + 1] = arr[j]
6.       j--
7.   arr[j + 1] = key
`;
            break;
        case "merge":
            pseudocodeText = `
Merge Sort Pseudocode:
1. If array has 1 element: return
2. Split array into left and right halves
3. Recursively sort left half
4. Recursively sort right half
5. Merge the two sorted halves
`;
            break;
        case "quick":
            pseudocodeText = `
Quick Sort Pseudocode:
1. If array size <= 1: return
2. Choose a pivot
3. Partition array into:
     - elements < pivot
     - elements >= pivot
4. Recursively quick sort left part
5. Recursively quick sort right part
`;
            break;
    }

    displayArea.innerText = pseudocodeText;
}

function showAlgorithm(algorithm) {
    const displayArea = document.getElementById("display-area");
    let algorithmCode = "";

    switch (algorithm) {
        case "bubble":
            algorithmCode = `
Bubble Sort (Common Implementations)

C++:
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++){
    for (int j = 0; j < n - i - 1; j++){
      if (arr[j] > arr[j + 1]){
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}

Java:
void bubbleSort(int[] arr) {
  for (int i = 0; i < arr.length - 1; i++)
    for (int j = 0; j < arr.length - i - 1; j++)
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

Python:
def bubble_sort(arr):
  for i in range(len(arr) - 1):
    for j in range(len(arr) - i - 1):
      if arr[j] > arr[j + 1]:
        arr[j], arr[j + 1] = arr[j + 1], arr[j]

JavaScript:
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}
`;
            break;

        case "selection":
            algorithmCode = `
Selection Sort (Common Implementations)

C++:
void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int min_idx = i;
    for (int j = i + 1; j < n; j++){
    if (arr[j] < arr[min_idx]) {
      min_idx = j;
      swap(arr[min_idx], arr[i]);
    }
  }
}

Java:
void selectionSort(int[] arr) {
  for (int i = 0; i < arr.length - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    int temp = arr[minIdx];
    arr[minIdx] = arr[i];
    arr[i] = temp;
  }
}

Python:
def selection_sort(arr):
  for i in range(len(arr) - 1):
  min_idx = i
  for j in range(i + 1, len(arr)):
    if arr[j] < arr[min_idx]:
      min_idx = j
      arr[i], arr[min_idx] = arr[min_idx], arr[i]

JavaScript:
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}
`;
            break;

        case "insertion":
            algorithmCode = `
Insertion Sort (Common Implementations)

C++:
void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}

Java:
void insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}

Python:
def insertion_sort(arr):
  for i in range(1, len(arr)):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j -= 1
      arr[j + 1] = key

JavaScript:
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}
`;
            break;

        case "merge":
            algorithmCode = `
Merge Sort (Common Implementations)

C++:
void mergeSort(int arr[], int l, int r) {
  if (l >= r) return;
  int m = l + (r - l) / 2;
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}

Java:
void mergeSort(int[] arr, int l, int r) {
  if (l < r) {
    int m = (l + r) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

Python:
def merge_sort(arr):
  if len(arr) > 1:
    mid = len(arr) // 2
      L = arr[:mid]
    R = arr[mid:]
    merge_sort(L)
    merge_sort(R)
    merge(arr, L, R)

JavaScript:
function mergeSort(arr) {
    if (arr.length < 2) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}
`;
            break;

        case "quick":
            algorithmCode = `
Quick Sort (Common Implementations)

C++:
void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

Java:
void quickSort(int[] arr, int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

Python:
def quick_sort(arr):
  if len(arr) <= 1:
    return arr
  pivot = arr[len(arr) // 2]
  left = [x for x in arr if x < pivot]
  middle = [x for x in arr if x == pivot]
  right = [x for x in arr if x > pivot]
  return quick_sort(left) + middle + right

JavaScript:
function quickSort(arr) {
  if (arr.length < 2) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (const el of arr.slice(0, arr.length - 1)) {
    el < pivot ? left.push(el) : right.push(el);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

`;
            break;
    }

    displayArea.innerText = algorithmCode;
}

/* ----------------- On Page Load ------------------- */

window.onload = function () {
    // Restore theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        const themeIcon = document.getElementById("theme-icon");
        if (themeIcon) themeIcon.textContent = "🌙";
    }

    generateArray();
};
