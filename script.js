let arr = [];
let barElements = [];

// Function to visualize sorting
function visualize() {
    const arrayInput = document.getElementById('arrayInput').value;
    const algorithmSelect = document.getElementById('algorithmSelect').value;
    const sortOrderSelect = document.getElementById('sortOrderSelect').value;
    const speedRange = document.getElementById('speedRange').value;
    
    if (arrayInput.trim() === "") {
        alert("Please enter an array.");
        return;
    }

    arr = arrayInput.split(',').map(Number);
    document.getElementById('arrayContainer').innerHTML = '';  // Clear previous bars
    createBars(arr);  // Create the bars for the array

    switch (algorithmSelect) {
        case 'bubbleSort':
            bubbleSort(arr, sortOrderSelect, speedRange);
            break;
        case 'insertionSort':
            insertionSort(arr, sortOrderSelect, speedRange);
            break;
        case 'selectionSort':
            selectionSort(arr, sortOrderSelect, speedRange);
            break;
        case 'mergeSort':
            mergeSort(arr, sortOrderSelect, speedRange);
            break;
        case 'quickSort':
            quickSort(arr, sortOrderSelect, speedRange);
            break;
        default:
            alert('Invalid algorithm!');
    }
}

// Create bars based on the array
function createBars(arr) {
    const container = document.getElementById('arrayContainer');
    barElements = [];  // Reset bar elements array
    arr.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 20}px`;  // Adjust height for visibility

        const valueText = document.createElement('span');
        valueText.classList.add('bar-value');
        valueText.innerText = value;

        bar.appendChild(valueText);
        container.appendChild(bar);
        barElements.push(bar);
    });
}

// Update the bars based on the current array state
function updateBars(arr, activeIndices = [], doneIndices = [], delay) {
    for (let i = 0; i < arr.length; i++) {
        if (activeIndices.includes(i)) {
            barElements[i].classList.add('active');
        } else {
            barElements[i].classList.remove('active');
        }

        if (doneIndices.includes(i)) {
            barElements[i].classList.add('done');
        } else {
            barElements[i].classList.remove('done');
        }

        // Update the bar heights as the array changes
        barElements[i].style.height = `${arr[i] * 20}px`;
        barElements[i].querySelector('.bar-value').innerText = arr[i]; // Update the value text
    }
    return new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
}

// Bubble Sort Algorithm
async function bubbleSort(arr, sortOrder, speed) {
    const n = arr.length;
    let activeIndices = [];
    let doneIndices = [];

    const compare = sortOrder === 'ascending' ? (a, b) => a > b : (a, b) => a < b;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            activeIndices = [j, j + 1];
            await updateBars(arr, activeIndices, doneIndices, speed);

            if (compare(arr[j], arr[j + 1])) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                await updateBars(arr, activeIndices, doneIndices, speed);
            }
        }
        doneIndices.push(n - i - 1);
        await updateBars(arr, activeIndices, doneIndices, speed);
    }
}

// Insertion Sort Algorithm
async function insertionSort(arr, sortOrder, speed) {
    const n = arr.length;
    let activeIndices = [];
    let doneIndices = [];

    const compare = sortOrder === 'ascending' ? (a, b) => a > b : (a, b) => a < b;

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        activeIndices = [i];
        while (j >= 0 && compare(arr[j], key)) {
            arr[j + 1] = arr[j];
            j = j - 1;

            activeIndices.push(j);
            await updateBars(arr, activeIndices, doneIndices, speed);
        }
        arr[j + 1] = key;
        doneIndices.push(i);
        await updateBars(arr, activeIndices, doneIndices, speed);
    }
}

// Selection Sort Algorithm
async function selectionSort(arr, sortOrder, speed) {
    const n = arr.length;
    let activeIndices = [];
    let doneIndices = [];

    const compare = sortOrder === 'ascending' ? (a, b) => a < b : (a, b) => a > b;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        activeIndices = [i];
        for (let j = i + 1; j < n; j++) {
            if (compare(arr[j], arr[minIndex])) {
                minIndex = j;
            }
            activeIndices.push(j);
            await updateBars(arr, activeIndices, doneIndices, speed);
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            await updateBars(arr, activeIndices, doneIndices, speed);
        }

        doneIndices.push(i);
        await updateBars(arr, activeIndices, doneIndices, speed);
    }
}

// Merge Sort Algorithm
async function mergeSort(arr, sortOrder, speed) {
    const n = arr.length;

    if (n <= 1) return arr;

    const mid = Math.floor(n / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    await mergeSort(left, sortOrder, speed);
    await mergeSort(right, sortOrder, speed);

    let i = 0, j = 0, k = 0;

    while (i < left.length && j < right.length) {
        if ((sortOrder === 'ascending' && left[i] <= right[j]) || (sortOrder === 'descending' && left[i] >= right[j])) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
        await updateBars(arr, [i, j], [], speed);
    }

    while (i < left.length) {
        arr[k++] = left[i++];
        await updateBars(arr, [i], [], speed);
    }

    while (j < right.length) {
        arr[k++] = right[j++];
        await updateBars(arr, [j], [], speed);
    }
}

// Quick Sort Algorithm
async function quickSort(arr, sortOrder, speed) {
    const partition = async (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if ((sortOrder === 'ascending' && arr[j] < pivot) || (sortOrder === 'descending' && arr[j] > pivot)) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                await updateBars(arr, [i, j], [], speed);
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        await updateBars(arr, [i + 1, high], [], speed);
        return i + 1;
    };

    const quickSortRecursive = async (arr, low, high) => {
        if (low < high) {
            const pi = await partition(arr, low, high);
            await quickSortRecursive(arr, low, pi - 1);
            await quickSortRecursive(arr, pi + 1, high);
        }
    };

    await quickSortRecursive(arr, 0, arr.length - 1);
}
