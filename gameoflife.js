window.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById("gameOfLife");
    const ctx = c.getContext("2d");

    // Her defineres forskellige variabler, som benyttes senere. Disse kunne også være defineret af brugerens input.
    const tileSize = 10;
    const maxTime = 100000;
    const definedWidth = 50;
    const definedHeight = 50;
    const refreshInterval = 50;

    let start, previousTimeStamp;
    let done = false;

    function initializeBoard(width, height) {
        // Her initiater jeg et array og fylder det med rækker af random tal (dermed bliver det to-dimensionelt).
        let boardArray = [];
        for (let i = 0; i < height; i++) {
            let currentRow = [];
            for (let i = 0; i < width; i++) {
                currentRow.push(Math.round(Math.random()));
            }
            boardArray.push(currentRow);
        }
        return boardArray;
    }

    function drawBoard(boardArray, tile) {
        // Her går jeg hver række igennem og benytter derefter kolonnen.
        const boardWidth = boardArray[0].length;
        const boardHeight = boardArray.length;
        for (let row = 0; row < boardHeight; row++) {
            for (let column = 0; column < boardArray[row].length; column++) {
                let currentRow = row + 1;
                let currentColumn = column + 1;

                ctx.beginPath();
                // Her laver jeg et rektangel med den rigtige placering og størrelse: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API.
                ctx.rect(currentColumn * tile, currentRow * tile, tile, tile);
                if (boardArray[row][column] === 0) {
                    ctx.fillStyle = "#fff";
                } else {
                    ctx.fillStyle = "#000";
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    function updateBoard(boardArray) {
        let neighbourGrid = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]; // Her laver jeg en liste med alle naboernes index forskelle.
        let newBoard = boardArray.map((row) => {return row.slice()}); // Her duplikerer jeg det nuværende array for boardet for ikke at lave ændringer på ændringerne.

        for (let row = 0; row < boardArray.length; row++) {
            for (let column = 0; column < boardArray[row].length; column++) {
                let neighbours = [];
                // For hver celle går jeg nu alle naboerne igennem og hvis naboen eksisterer og er i live, tilføjer jeg den til array'et 'neighbours'.
                for (let neighbourCell = 0; neighbourCell < neighbourGrid.length; neighbourCell++) {

                    let neighbourRow = neighbourGrid[neighbourCell][0];
                    let neighbourColumn = neighbourGrid[neighbourCell][1];
                    let newRow = row + neighbourRow;
                    let newColumn = column + neighbourColumn;

                    if (!(newRow < 0 || newColumn < 0 || newRow >= boardArray.length || newColumn >= boardArray[0].length)) {
                        if (boardArray[newRow][newColumn] === 1) {
                            neighbours.push([row + neighbourRow, column + neighbourColumn]);
                        }
                    }
                }

                // Herunder er reglerne for Conway's Game of Life opsummeret i to 'if statements': https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
                if ((neighbours.length > 3 || neighbours.length < 2) && (boardArray[row][column] === 1)) {
                    newBoard[row][column] = 0;
                }

                if (neighbours.length === 3 && boardArray[row][column] === 0) {
                    newBoard[row][column] = 1;
                }
            }
        }
        // Det nye board bliver nu tegnet på canvas'et og returneres til gameLoop funktionen, hvor det bliver gemt som det nye board array.
        drawBoard(newBoard, tileSize);
        return newBoard;
    }

    function gameLoop(timestamp) {
        // Hjælp fra MDN til opsætningen af requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame.
        if (start === undefined) {
            // Her initieres nogle variable, og boardet bliver tegnet.
            start = timestamp;
            previousTimeStamp = timestamp;

            drawBoard(board, tileSize);
        }

        const elapsed = timestamp - start;

        // Her tjekkes om der er gået lang tid nok før boardet skal opdateres baseret på variablen 'refreshInterval'.
        if (timestamp - previousTimeStamp >= refreshInterval) {
            previousTimeStamp = timestamp;
            board = updateBoard(board);
        }

        if (elapsed < maxTime) {
            window.requestAnimationFrame(gameLoop);
        }
    }

    let board = initializeBoard(definedWidth, definedHeight);
    window.requestAnimationFrame(gameLoop);
});