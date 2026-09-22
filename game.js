const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const objectivesText = document.getElementById("objectives");
const healthFill = document.getElementById("health-fill");


// =====================================================
// CANVAS
// =====================================================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// =====================================================
// INPUT
// =====================================================

const keys = {};

window.addEventListener("keydown", (event) => {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});


// =====================================================
// CAMERA
// =====================================================

const camera = {

    x: 0,
    y: 0

};


// =====================================================
// PLAYER
// =====================================================

const player = {

    x: 600,
    y: 500,

    width: 34,
    height: 44,

    speed: 3,

    sprintSpeed: 5,

    health: 100,

    color: "#4f8cff"

};


// =====================================================
// MAP
// =====================================================

const map = {

    width: 2400,
    height: 1600

};


// =====================================================
// WALLS
// =====================================================

const walls = [

    // Outer walls

    {
        x: 0,
        y: 0,
        width: 2400,
        height: 40
    },

    {
        x: 0,
        y: 1560,
        width: 2400,
        height: 40
    },

    {
        x: 0,
        y: 0,
        width: 40,
        height: 1600
    },

    {
        x: 2360,
        y: 0,
        width: 40,
        height: 1600
    },


    // Top-left room

    {
        x: 200,
        y: 180,
        width: 500,
        height: 35
    },

    {
        x: 200,
        y: 180,
        width: 35,
        height: 350
    },

    {
        x: 665,
        y: 180,
        width: 35,
        height: 350
    },

    {
        x: 200,
        y: 495,
        width: 220,
        height: 35
    },

    {
        x: 500,
        y: 495,
        width: 200,
        height: 35
    },


    // Middle room

    {
        x: 900,
        y: 200,
        width: 600,
        height: 35
    },

    {
        x: 900,
        y: 200,
        width: 35,
        height: 400
    },

    {
        x: 1465,
        y: 200,
        width: 35,
        height: 400
    },

    {
        x: 900,
        y: 565,
        width: 600,
        height: 35
    },


    // Bottom-left room

    {
        x: 180,
        y: 850,
        width: 500,
        height: 35
    },

    {
        x: 180,
        y: 850,
        width: 35,
        height: 450
    },

    {
        x: 645,
        y: 850,
        width: 35,
        height: 450
    },

    {
        x: 180,
        y: 1265,
        width: 500,
        height: 35
    },


    // Bottom-right room

    {
        x: 1700,
        y: 850,
        width: 500,
        height: 35
    },

    {
        x: 1700,
        y: 850,
        width: 35,
        height: 450
    },

    {
        x: 2165,
        y: 850,
        width: 35,
        height: 450
    },

    {
        x: 1700,
        y: 1265,
        width: 500,
        height: 35
    }

];


// =====================================================
// COMPUTERS / OBJECTIVES
// =====================================================

const computers = [

    {
        x: 430,
        y: 350,
        completed: false
    },

    {
        x: 1150,
        y: 380,
        completed: false
    },

    {
        x: 1880,
        y: 400,
        completed: false
    },

    {
        x: 400,
        y: 1080,
        completed: false
    },

    {
        x: 1900,
        y: 1080,
        completed: false
    }

];


// =====================================================
// ESCAPE DOOR
// =====================================================

const escapeDoor = {

    x: 1120,
    y: 1460,

    width: 160,
    height: 50,

    active: false

};


// =====================================================
// COLLISION
// =====================================================

function rectangleCollision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


function canMove(x, y) {

    const testPlayer = {

        x: x,
        y: y,

        width: player.width,
        height: player.height

    };

    for (const wall of walls) {

        if (rectangleCollision(testPlayer, wall)) {

            return false;

        }

    }

    return true;

}


// =====================================================
// PLAYER MOVEMENT
// =====================================================

function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (keys["w"]) {

        dy -= 1;

    }

    if (keys["s"]) {

        dy += 1;

    }

    if (keys["a"]) {

        dx -= 1;

    }

    if (keys["d"]) {

        dx += 1;

    }


    // Normalize diagonal movement

    if (dx !== 0 && dy !== 0) {

        dx *= 0.707;
        dy *= 0.707;

    }


    let speed = player.speed;

    if (keys["shift"]) {

        speed = player.sprintSpeed;

    }


    const newX = player.x + dx * speed;
    const newY = player.y + dy * speed;


    if (canMove(newX, player.y)) {

        player.x = newX;

    }


    if (canMove(player.x, newY)) {

        player.y = newY;

    }

}


// =====================================================
// CAMERA
// =====================================================

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        canvas.width / 2;

    camera.y =
        player.y +
        player.height / 2 -
        canvas.height / 2;


    camera.x = Math.max(
        0,
        Math.min(
            camera.x,
            map.width - canvas.width
        )
    );


    camera.y = Math.max(
        0,
        Math.min(
            camera.y,
            map.height - canvas.height
        )
    );

}


// =====================================================
// DRAW BACKGROUND
// =====================================================

function drawBackground() {

    ctx.fillStyle = "#171c25";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Floor grid

    const gridSize = 80;

    ctx.strokeStyle = "rgba(255,255,255,0.025)";

    ctx.lineWidth = 1;


    for (
        let x = -camera.x % gridSize;
        x < canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, canvas.height);

        ctx.stroke();

    }


    for (
        let y = -camera.y % gridSize;
        y < canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(canvas.width, y);

        ctx.stroke();

    }

}


// =====================================================
// DRAW MAP
// =====================================================

function drawMap() {

    // Floor

    ctx.fillStyle = "#202631";

    ctx.fillRect(
        -camera.x,
        -camera.y,
        map.width,
        map.height
    );


    // Rooms

    ctx.fillStyle = "#252c37";

    ctx.fillRect(
        200 - camera.x,
        180 - camera.y,
        500,
        350
    );

    ctx.fillRect(
        900 - camera.x,
        200 - camera.y,
        600,
        400
    );

    ctx.fillRect(
        180 - camera.x,
        850 - camera.y,
        500,
        450
    );

    ctx.fillRect(
        1700 - camera.x,
        850 - camera.y,
        500,
        450
    );


    // Walls

    for (const wall of walls) {

        ctx.fillStyle = "#394352";

        ctx.fillRect(
            wall.x - camera.x,
            wall.y - camera.y,
            wall.width,
            wall.height
        );


        ctx.fillStyle = "rgba(255,255,255,0.04)";

        ctx.fillRect(
            wall.x - camera.x,
            wall.y - camera.y,
            wall.width,
            3
        );

    }

}


// =====================================================
// DRAW COMPUTERS
// =====================================================

function drawComputers() {

    for (const computer of computers) {

        const x = computer.x - camera.x;
        const y = computer.y - camera.y;


        // glow

        ctx.fillStyle = computer.completed
            ? "rgba(74,222,128,0.08)"
            : "rgba(96,165,250,0.10)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            50,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // monitor

        ctx.fillStyle = computer.completed
            ? "#4ade80"
            : "#60a5fa";

        ctx.fillRect(
            x - 25,
            y - 20,
            50,
            35
        );


        // screen

        ctx.fillStyle = "#101827";

        ctx.fillRect(
            x - 20,
            y - 15,
            40,
            25
        );


        // stand

        ctx.fillStyle = "#8994a6";

        ctx.fillRect(
            x - 5,
            y + 15,
            10,
            15
        );


        ctx.fillRect(
            x - 18,
            y + 28,
            36,
            6
        );


        if (!computer.completed) {

            ctx.fillStyle = "#dbeafe";

            ctx.font = "12px Arial";

            ctx.textAlign = "center";

            ctx.fillText(
                "OBJECTIVE",
                x,
                y + 55
            );

        }

    }

}


// =====================================================
// DRAW ESCAPE DOOR
// =====================================================

function drawEscapeDoor() {

    const x = escapeDoor.x - camera.x;
    const y = escapeDoor.y - camera.y;


    ctx.fillStyle = escapeDoor.active
        ? "#22c55e"
        : "#7f1d1d";


    ctx.fillRect(
        x,
        y,
        escapeDoor.width,
        escapeDoor.height
    );


    ctx.fillStyle = "#111827";

    ctx.fillRect(
        x + 10,
        y + 10,
        escapeDoor.width - 20,
        escapeDoor.height - 20
    );


    ctx.fillStyle = "white";

    ctx.font = "bold 13px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        escapeDoor.active
            ? "ESCAPE"
            : "LOCKED",
        x + escapeDoor.width / 2,
        y + 31
    );

}


// =====================================================
// DRAW PLAYER
// =====================================================

function drawPlayer() {

    const x =
        player.x -
        camera.x;

    const y =
        player.y -
        camera.y;


    // shadow

    ctx.fillStyle = "rgba(0,0,0,0.35)";

    ctx.beginPath();

    ctx.ellipse(
        x + player.width / 2,
        y + player.height,
        20,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // body

    ctx.fillStyle = player.color;

    ctx.fillRect(
        x + 5,
        y + 15,
        player.width - 10,
        25
    );


    // head

    ctx.fillStyle = "#f1c7a5";

    ctx.beginPath();

    ctx.arc(
        x + player.width / 2,
        y + 10,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // hair

    ctx.fillStyle = "#171717";

    ctx.fillRect(
        x + 7,
        y - 2,
        player.width - 14,
        7
    );


    // legs

    ctx.fillStyle = "#18202c";

    ctx.fillRect(
        x + 7,
        y + 38,
        8,
        7
    );

    ctx.fillRect(
        x + player.width - 15,
        y + 38,
        8,
        7
    );


    // name

    ctx.fillStyle = "white";

    ctx.font = "12px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "YOU",
        x + player.width / 2,
        y - 12
    );

}


// =====================================================
// OBJECTIVE DETECTION
// =====================================================

function updateObjectives() {

    let completed = 0;


    for (const computer of computers) {

        if (computer.completed) {

            completed++;

            continue;

        }


        const distance = Math.hypot(

            player.x - computer.x,

            player.y - computer.y

        );


        // Press E near computer

        if (
            distance < 70 &&
            keys["e"]
        ) {

            computer.completed = true;

        }

    }


    objectivesText.textContent =
        completed + " / " + computers.length;


    if (completed === computers.length) {

        escapeDoor.active = true;

    }

}


// =====================================================
// GAME LOOP
// =====================================================

function update() {

    updatePlayer();

    updateCamera();

    updateObjectives();

}


function draw() {

    drawBackground();

    drawMap();

    drawComputers();

    drawEscapeDoor();

    drawPlayer();

}


function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();
