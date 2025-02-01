let array = [];
let originalArray = [];  // Store the original array

function generateArray() {
    array = [];
    const container = document.getElementById("array-container");
    container.innerHTML = ''; // Clear existing bars

    // Generate bars
    for (let i = 0; i < 30; i++) {
        const height = Math.floor(Math.random() * 100) + 10;
        array.push(height);
        const bar = document.createElement("div");
        bar.style.height = `${height * 3}px`;
        bar.classList.add("bar");
        container.appendChild(bar);
    }

    // Store the original array
    originalArray = [...array];  // Copy current array for resetting
}

// Delay function for visualization
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function refreshBars() {
    return document.getElementsByClassName("bar");
}

function resetArray() {
    array = [...originalArray];  // Reset the array to the original state
    updateDisplay();
}

function updateDisplay() {
    const container = document.getElementById("array-container");
    container.innerHTML = ''; // Clear existing bars

    // Display the array bars
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.style.height = `${value * 3}px`;
        bar.classList.add("bar");
        container.appendChild(bar);
    });
}
// Bubble Sort
async function bubbleSort() {
    const bars = refreshBars();
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add("active");
            bars[j + 1].classList.add("active");

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                await delay(100);
            }
            bars[j].classList.remove("active");
            bars[j + 1].classList.remove("active");
        }
        bars[array.length - 1 - i].classList.add("sorted"); // Mark as sorted
    }
    bars[0].classList.add("sorted"); // Mark the first element as sorted at the end
}

// Selection Sort
async function selectionSort() {
    const bars = refreshBars();
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[i].classList.add("active");

        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add("active");
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            await delay(100);
            bars[j].classList.remove("active");
        }

        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i] * 3}px`;
            bars[minIndex].style.height = `${array[minIndex] * 3}px`;
        }
        bars[i].classList.add("sorted"); // Mark as sorted
        bars[i].classList.remove("active");
    }
}

// Insertion Sort
async function insertionSort() {
    const bars = refreshBars();
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        bars[i].classList.add("active");
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1] * 3}px`;
            j--;
            await delay(100);
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key * 3}px`;
        bars[i].classList.remove("active");
        bars[i].classList.add("sorted"); // Mark as sorted
    }
    bars[0].classList.add("sorted"); // Mark the first element as sorted
}

// Merge Sort Wrapper
async function mergeSortWrapper() {
    await mergeSort(array, 0, array.length - 1);
    // Mark all bars as sorted after completion
    const bars = refreshBars();
    for (const bar of bars) {
        bar.classList.add("sorted");
    }
}

// Merge Sort
async function mergeSort(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
}

// Merge function for Merge Sort
async function merge(arr, left, mid, right) {
    const bars = refreshBars();
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;
    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            bars[k].style.height = `${arr[k] * 3}px`;
            i++;
        } else {
            arr[k] = rightArray[j];
            bars[k].style.height = `${arr[k] * 3}px`;
            j++;
        }
        k++;
        await delay(100);
    }

    while (i < leftArray.length) {
        arr[k] = leftArray[i];
        bars[k].style.height = `${arr[k] * 3}px`;
        i++;
        k++;
        await delay(100);
    }

    while (j < rightArray.length) {
        arr[k] = rightArray[j];
        bars[k].style.height = `${arr[k] * 3}px`;
        j++;
        k++;
        await delay(100);
    }
}

// Quick Sort Wrapper
async function quickSortWrapper() {
    await quickSort(array, 0, array.length - 1);
    // Mark all bars as sorted after completion
    const bars = refreshBars();
    for (const bar of bars) {
        bar.classList.add("sorted");
    }
}

// Quick Sort
async function quickSort(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

// Partition function for Quick Sort
async function partition(arr, low, high) {
    const pivot = arr[high];
    const bars = refreshBars();
    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].classList.add("active");
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            bars[i].style.height = `${arr[i] * 3}px`;
            bars[j].style.height = `${arr[j] * 3}px`;
            await delay(100);
        }
        bars[j].classList.remove("active");
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    bars[i + 1].style.height = `${arr[i + 1] * 3}px`;
    bars[high].style.height = `${arr[high] * 3}px`;
    return i + 1;
}

generateArray();
// Toggle dark theme
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    
    // Save the theme preference in localStorage
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Load theme preference on page load
window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
};

function showHome() {
    const displayArea = document.getElementById("display-area");
    displayArea.innerHTML = "";
}

function showPseudocode(algorithm) {
    const displayArea = document.getElementById("display-area");
    let pseudocodeText = "";

    switch (algorithm) {
        case "bubble":
            pseudocodeText = `
Bubble Sort Pseudocode:
1. Repeat (n-1) times:
2.  Compare adjacent elements
3.  Swap if they are in the wrong order
4. End if no swaps were made
            `;
            break;
        case "selection":
            pseudocodeText = `
Selection Sort Pseudocode:
1. Repeat (n-1) times:
2.  Find the minimum element
3.  Swap it with the first unsorted element
4. Move to the next element
            `;
            break;
        case "insertion":
            pseudocodeText = `
Insertion Sort Pseudocode:
1. Start from the second element
2. For each element:
3.  Shift sorted elements to the right
4. Insert the element in the correct position
            `;
            break;
        case "merge":
            pseudocodeText = `
Merge Sort Pseudocode:
1. Divide the array into halves
2. Recursively sort each half
3. Merge the sorted halves together
            `;
            break;
        case "quick":
            pseudocodeText = `
Quick Sort Pseudocode:
1. Pick a pivot element
2. Partition elements around the pivot
3. Recursively apply quick sort on partitions
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
Bubble Sort Algorithm:

C++:

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
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
Selection Sort Algorithm:

C++:

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
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
Insertion Sort Algorithm:

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
Merge Sort Algorithm:

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
Quick Sort Algorithm:

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
    return quick_sort(left) + middle + quick_sort(right)

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