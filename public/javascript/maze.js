const RECURSIVE_BACKTRACKING = "Recursive Backtracking";
const KRUSKAL = "Kruskal's Algorithm";
const ELLER = "Eller's Algorithm";
const MAX_DELAY = 500;

$(document).ready(() => {
    var algorithmSelect = document.getElementById("algorithm-select");
    var speedRange = document.getElementById("speed-range");
    var sizeRange = document.getElementById("size-range");
    var runButton = document.getElementById("run-button");
    var pauseButton = document.getElementById("pause-button");
    var table = document.getElementById("maze-grid");

    var size = 12;
    var speed = 200;
    var isRunning = false;
    var isPaused = false;

    drawGrid();

    sizeRange.oninput = function() {
        size = sizeRange.value;
        drawGrid();
    }

    speedRange.oninput = function() {
        speed = MAX_DELAY - speedRange.value;
    };

    runButton.onclick = function() {
        runButton.style.display = "none";
        pauseButton.style.display = "inline";
        sizeRange.disabled = true;
        isPaused = false;

        if (!isRunning) {
            isRunning = true;

            drawGrid();
            let algorithm = algorithmSelect.value;
            size = sizeRange.value;
            speed = MAX_DELAY - speedRange.value;
            generateMaze(algorithm);
        }
    };

    pauseButton.onclick = function() {
        runButton.style.display = "inline";
        pauseButton.style.display = "none";
        isPaused = true;
    }

    function drawGrid() {
        table.innerHTML = "";
        size = sizeRange.value;
        for (let y = 0; y < size; y++) {
            let row = table.insertRow(0);
            for (let x = 0; x < size; x++) {
                let cell = row.insertCell(0);
            }
        }
    }

    function generateMaze(algorithm) {
        switch(algorithm) {
            case RECURSIVE_BACKTRACKING:
                RecusiveBacktracking();
                break;

            case KRUSKAL:
                Kruskal();
                break;

            case ELLER:
                Eller();
                break; 
        }
    }
    
    function RecusiveBacktracking() {
        let cells = [];    
        let stack = [];
        let unvisitedCount = size * size;
        let currentCell = {x:0, y:0};
        
        // Initialize map
        for (let y = 0; y < size; y++) {
            let row = [];
            for (let x = 0; x < size; x++) {
                row.push({visited:false, top:true, right:true, bottom:true, left:true});
            }
            cells.push(row);
        }

        // Execute main loop
        paintCell(currentCell.x, currentCell.y, "#00c483", cells[currentCell.x][currentCell.y]);
        cells[currentCell.x][currentCell.y].visited = true;
        unvisitedCount--;
        loop();    
        return;
    
        function loop() {
            if (unvisitedCount > 0) {
                if (!isPaused) {
                    let unvisitedNeighbors = getUnivistedNeighbors(currentCell.x, currentCell.y);
            
                    // Exploring new cells
                    if (unvisitedNeighbors.length > 0) {
                        let nextCell = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
                        stack.push(currentCell);
                        removeWallsBetween(currentCell, nextCell);
                        paintCell(currentCell.x, currentCell.y, "#00c48356", cells[currentCell.x][currentCell.y]);
                        paintCell(nextCell.x, nextCell.y, "#00c483", cells[currentCell.x][currentCell.y]);
                        currentCell = nextCell;
                        cells[currentCell.x][currentCell.y].visited = true;
                        unvisitedCount--;
                    }
                    // Backtracking
                    else {
                        paintCell(currentCell.x, currentCell.y, "#00c48356", cells[currentCell.x][currentCell.y]);
                        currentCell = stack.pop();
                        paintCell(currentCell.x, currentCell.y, "#00c483", cells[currentCell.x][currentCell.y]);
                    }
                }
                setTimeout(loop, speed);
            }
            // Maze is completed
            else {
                paintCell(currentCell.x, currentCell.y, "#00c48356", cells[currentCell.x][currentCell.y]);
                runButton.style.display = "inline";
                pauseButton.style.display = "none";
                sizeRange.disabled = false;
                isRunning = false;
                return;
            }
        }

        function getUnivistedNeighbors(x, y) {
            unvisited = [];
            // Left neighbor
            if (x > 0 && !cells[x-1][y].visited) {
                unvisited.push({x:x-1, y:y});
            }
            // Top neighbor
            if (y > 0 && !cells[x][y-1].visited) {
                unvisited.push({x:x, y:y-1});
            }
            // Right neighbor
            if (x < size - 1 && !cells[x+1][y].visited) {
                unvisited.push({x:x+1, y:y});
            }
            // Bottom neighbor
            if (y < size - 1 && !cells[x][y+1].visited) {
                unvisited.push({x:x, y:y+1});
            }
            return unvisited;
        }
    
        function removeWallsBetween(from, to) {
            if (to.x == from.x) {
                // Moving up
                if (to.y < from.y) {
                    cells[from.x][from.y].top = false;
                    cells[to.x][to.y].bottom = false;
                }
                // Moving down
                else {
                    cells[from.x][from.y].bottom = false;
                    cells[to.x][to.y].top = false;
                }
            }
            else {
                // Moving left
                if (to.x < from.x) {
                    cells[from.x][from.y].left = false;
                    cells[to.x][to.y].right = false;
                }
                // Moving right
                else {
                    cells[from.x][from.y].right = false;
                    cells[to.x][to.y].left = false;
                }
            }
        }
    }

    function Kruskal() {
        class Tree {
            constructor(parent) {
                this.parent = parent;
            }
            root() {
                if (this.parent != null) {
                    return this.parent.root();
                }
                else {
                    return this;
                }
            }
            connectTo(newParent) {
                this.parent = newParent;
            }
        }

        const TOP = 1;
        const LEFT = 2;

        // Initialize map
        let cells = [];
        for (let x = 0; x < size; x++) {
            let col = [];
            for (let y = 0; y < size; y++) {
                col.push({tree: new Tree(null), top:true, right:true, bottom:true, left:true});
            }
            cells.push(col);
        }

        // Creates a list of every edge
        let edges = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (y > 0) {
                    edges.push({x:x, y:y, direction:TOP});
                }
                if (x > 0) {
                    edges.push({x:x, y:y, direction:LEFT});
                }
            }
        }

        // Execute main loop
        let lastCell1 = null;
        let lastCell2 = null;
        loop();

        function loop() {
            if (edges.length > 0) {
                if (!isPaused) {
                    // Selects a random edge
                    let index = Math.floor(Math.random() * edges.length);
                    let edge = edges[index];
                    let deltaX = 0;
                    let deltaY = 0;

                    // Calculates the position of the cells on either side of the edge.
                    if (edge.direction == TOP) {
                        deltaY = -1;
                    }
                    else if (edge.direction == LEFT) {
                        deltaX = -1;
                    }
                    let cell1 = cells[edge.x][edge.y];
                    let cell2 = cells[edge.x + deltaX][edge.y + deltaY];

                    // If the cells on either side of the edge are not already in the same tree, connect them.
                    if (cell1.tree.root() !== cell2.tree.root()) {
                        if (edge.direction == TOP) {
                            cell1.top = false;
                            cell2.bottom = false;
                        }
                        else if (edge.direction == LEFT) {
                            cell1.left = false;
                            cell2.right = false;
                        }
                        cell1.tree.root().connectTo(cell2.tree);

                        // Painting the cells
                        paintCell(edge.x, edge.y, "#00c483", cell1);
                        paintCell(edge.x + deltaX, edge.y + deltaY, "#00c483", cell2);
                        if (lastCell1 != null && lastCell2 != null) {
                            paintCell(lastCell1.x, lastCell1.y, "#00c48356", cells[lastCell1.x][lastCell1.y]);
                            paintCell(lastCell2.x, lastCell2.y, "#00c48356", cells[lastCell2.x][lastCell2.y]);
                        }
                        lastCell1 = {x:edge.x, y:edge.y};
                        lastCell2 = {x:edge.x + deltaX, y:edge.y + deltaY};
                    }

                    // Remove the chosen edge from the list of edges.
                    edges.splice(index, 1);
                }
                // Repeats the loop after the specified delay.
                setTimeout(loop, speed);
            }
            // Maze is complete
            else {
                paintCell(lastCell1.x, lastCell1.y, "#00c48356", cells[lastCell1.x][lastCell1.y]);
                paintCell(lastCell2.x, lastCell2.y, "#00c48356", cells[lastCell2.x][lastCell2.y]);
                runButton.style.display = "inline";
                pauseButton.style.display = "none";
                sizeRange.disabled = false;
                isRunning = false;
                return;
            }
        }
    }
    
    function Eller() {
        const HORIZONTAL_MERGE_CHANCE = 0.5;
        const VERTICAL_MERGE_CHANCE = 0.5;

        let cells = [];
        let sets = {};
        for (let x = 0; x < size; x++) {
            let col = [];
            for (let y = 0; y < size; y++) {
                let cell = {set:0, x:x, y:y, top:true, right:true, bottom:true, left:true};
                col.push(cell);
            }
            cells.push(col);
        }
        
        loop(0, 0);

        function loop(x, y) {
            let currentCell = cells[x][y];
            let setsInRow = [];

            // If the cell is not a part of any set yet, create a new set for it with the smallest available index.
            if (currentCell.set == 0) {
                console.log("currentCell.set == 0");
                for (let i = 0; currentCell.set == 0; i++) {
                    console.log(`i: ${i}`);
                    if (sets[i] == null) {
                        console.log("sets[i] == null");
                        currentCell.set = i;
                        setsInRow.push(i);
                    }
                }
            }
            // Merging currentCell with its neighbor to the left.
            if (x > 0) {
                let neighbor = cells[x-1][y];
                if (Math.random() <= HORIZONTAL_MERGE_CHANCE) {
                    if (currentCell.set != neighbor.set) {
                        currentCell.left = false;
                        neighbor.right = false;
                        for (let i in sets[currentCell.set]) {
                            let cell = sets[currentCell.set][i];
                            cells[cell.x][cell.y].set = neighbor.set;
                            sets[neighbor.set].push(cell);
                        }
                        delete sets[currentCell.set];
                        setsInRow.slice(setsInRow.indexOf(currentCell.set), 1);
                        paintCell(currentCell.x, currentCell.y, "#00c483", currentCell);
                        paintCell(neighbor.x, neighbor.y, "#00c483", neighbor);
                    }
                }
            }
            // Once the entire row has been iterated, make vertical connections such that every set in the row has at least one vertical connection.
            if (x == size - 1) {
                if (y < size - 1) {
                    let currentRow = cells[x];
                    let rowSets = {}
                    for (let i in currentRow) {
                        let cell = currentRow[i];
                        if (rowSets[cell.set] == null) {
                            rowSets[cell.set] = [];
                        }
                        rowSets[cell.set].push(cell);
                    }
                    for (let i in rowSets) {
                        let set = rowSets[i];
                        let verticalConnections = 0;
                        while (verticalConnections < 1) {
                            for (let j in set) {
                                let cell = set[j];
                                let neighbor = cells[cell.x][cell.y+1];
                                if (Math.random() < VERTICAL_MERGE_CHANCE) {
                                    cells[cell.x][cell.y].bottom = false;
                                    cells[neighbor.x][neighbor.y].top = false;
                                    neighbor.set = cell.set;
                                    verticalConnections++;
                                    paintCell(cell.x, cell.y, "#00c483", cells[cell.x][cell.y]);
                                    paintCell(neighbor.x, neighbor.y, "#00c483", cells[neighbor.x][neighbor.y]);
                                }
                            }
                        }
                    }
                    setTimeout(()=>{loop(0, ++y);}, speed);
                }
            }
            setTimeout(()=>{loop(++x, y);}, speed);
        }
    }

    function paintCell(x, y, color, borders) {
        let cellStyle = table.rows[y].cells[x].style;

        cellStyle.backgroundColor = color;

        if (borders.top) {
            cellStyle.borderTop = "1px solid #000000";
        }
        else {
            cellStyle.borderTop = "1px solid #00000000";
        }
        if (borders.right) {
            cellStyle.borderRight = "1px solid #000000";
        }
        else {
            cellStyle.borderRight = "1px solid #00000000";
        }
        if (borders.bottom) {
            cellStyle.borderBottom = "1px solid #000000";
        }
        else {
            cellStyle.borderBottom = "1px solid #00000000";
        }
        if (borders.left) {
            cellStyle.borderLeft = "1px solid #000000";
        }
        else {
            cellStyle.borderLeft = "1px solid #00000000";
        }
    }
});