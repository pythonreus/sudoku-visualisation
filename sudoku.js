function solveSudoku(grid) {
    const rowConstraints = Array.from({ length: 9 }, () => new Set());
    const colConstraints = Array.from({ length: 9 }, () => new Set());
    const subgridConstraints = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => new Set()));
    const cellPossibilities = {};

    function initializeConstraints() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] !== 0) {
                    const num = grid[i][j];
                    rowConstraints[i].add(num);
                    colConstraints[j].add(num);
                    subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].add(num);
                    delete cellPossibilities[`${i},${j}`];
                } else {
                    cellPossibilities[`${i},${j}`] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                }
            }
        }
    }

    function updatePossibilities() {
        for (const [key, possibilities] of Object.entries(cellPossibilities)) {
            const [i, j] = key.split(',').map(Number);
            const subgrid = subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)];
            cellPossibilities[key] = [...possibilities].filter(num => !rowConstraints[i].has(num) && !colConstraints[j].has(num) && !subgrid.has(num));
        }
    }

    function solve() {
        if (Object.keys(cellPossibilities).length === 0) return true;

        const cell = Object.entries(cellPossibilities).reduce((minCell, curr) => curr[1].length < minCell[1].length ? curr : minCell);
        const [i, j] = cell[0].split(',').map(Number);
        const possibilities = cell[1];

        for (const num of possibilities) {
            if (isValid(num, i, j)) {
                placeNumber(num, i, j);
                if (solve()) return true;
                removeNumber(num, i, j);
            }
        }

        return false;
    }

    function isValid(num, i, j) {
        return !rowConstraints[i].has(num) && !colConstraints[j].has(num) && !subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].has(num);
    }

    function placeNumber(num, i, j) {
        grid[i][j] = num;
        rowConstraints[i].add(num);
        colConstraints[j].add(num);
        subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].add(num);
        delete cellPossibilities[`${i},${j}`];
        updatePossibilities();
    }

    function removeNumber(num, i, j) {
        grid[i][j] = 0;
        rowConstraints[i].delete(num);
        colConstraints[j].delete(num);
        subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].delete(num);
        cellPossibilities[`${i},${j}`] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }

    initializeConstraints();
    updatePossibilities();
    return solve() ? grid : null;
}

function displaySudoku(grid, highlightCells = []) {
    const table = document.getElementById('sudoku-board');
    table.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.textContent = grid[i][j] !== 0 ? grid[i][j] : '';
            if (grid[i][j] !== 0) {
                cell.classList.add('filled');
            }

            // Add green background for cells that are part of the current step in visualization
            if (highlightCells.some(([x, y]) => x === i && y === j)) {
                cell.classList.add('cell-green');
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}


function visualizeSolving(grid) {
    const steps = [];
    const rowConstraints = Array.from({ length: 9 }, () => new Set());
    const colConstraints = Array.from({ length: 9 }, () => new Set());
    const subgridConstraints = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => new Set()));
    const cellPossibilities = {};

    function initializeConstraints() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] !== 0) {
                    const num = grid[i][j];
                    rowConstraints[i].add(num);
                    colConstraints[j].add(num);
                    subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].add(num);
                } else {
                    cellPossibilities[`${i},${j}`] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                }
            }
        }
    }

    function updatePossibilities() {
        for (const [key, possibilities] of Object.entries(cellPossibilities)) {
            const [i, j] = key.split(',').map(Number);
            const subgrid = subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)];
            cellPossibilities[key] = [...possibilities].filter(num => !rowConstraints[i].has(num) && !colConstraints[j].has(num) && !subgrid.has(num));
        }
    }

    function solve() {
        if (Object.keys(cellPossibilities).length === 0) return true;

        const cell = Object.entries(cellPossibilities).reduce((minCell, curr) => curr[1].length < minCell[1].length ? curr : minCell);
        const [i, j] = cell[0].split(',').map(Number);
        const possibilities = cell[1];

        for (const num of possibilities) {
            if (isValid(num, i, j)) {
                placeNumber(num, i, j);
                steps.push(JSON.parse(JSON.stringify(grid))); // Deep copy of the grid
                if (solve()) return true;
                removeNumber(num, i, j);
            }
        }

        return false;
    }

    function isValid(num, i, j) {
        return !rowConstraints[i].has(num) && !colConstraints[j].has(num) && !subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].has(num);
    }

    function placeNumber(num, i, j) {
        grid[i][j] = num;
        rowConstraints[i].add(num);
        colConstraints[j].add(num);
        subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].add(num);
        delete cellPossibilities[`${i},${j}`];
        updatePossibilities();
    }

    function removeNumber(num, i, j) {
        grid[i][j] = 0;
        rowConstraints[i].delete(num);
        colConstraints[j].delete(num);
        subgridConstraints[Math.floor(i / 3)][Math.floor(j / 3)].delete(num);
        cellPossibilities[`${i},${j}`] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }

    initializeConstraints();
    updatePossibilities();
    solve();

    return steps;
}



function visualizeSudokuSolving() {
    const steps = visualizeSolving(JSON.parse(JSON.stringify(sudokuBoard)));
    let stepIndex = 0;
    
    function showStep() {
        if (stepIndex < steps.length) {
            const currentStep = steps[stepIndex];
            // Highlight cells where changes happened in the current step
            const changedCells = getChangedCells(currentStep, steps[stepIndex - 1] || sudokuBoard);
            displaySudoku(currentStep, changedCells);
            stepIndex++;
        } else {
            clearInterval(visualizationInterval);
        }
    }

    showStep(); // Show the first step immediately
    visualizationInterval = setInterval(showStep, 500); // Update every 500 ms
}

function getChangedCells(newGrid, oldGrid) {
    const changes = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (newGrid[i][j] !== oldGrid[i][j]) {
                changes.push([i, j]);
            }
        }
    }
    return changes;
}


const sudokuBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];


document.querySelector(".btnSolve").addEventListener("click", () => {
    const solution = solveSudoku(sudokuBoard);
    displaySudoku(solution || Array.from({ length: 9 }, () => Array(9).fill(0)));
});

document.querySelector(".btnVisualize").addEventListener("click",() =>{
    visualizeSudokuSolving();
});

displaySudoku(sudokuBoard);