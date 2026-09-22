/* =====================================================
   OVERSEER
   GAME FOUNDATION
===================================================== */


/* =====================================================
   DOM
===================================================== */

const hubScreen = document.getElementById("hubScreen");
const usernameScreen = document.getElementById("usernameScreen");
const gameScreen = document.getElementById("gameScreen");

const playButton = document.getElementById("playButton");
const usernameButton = document.getElementById("usernameButton");

const usernameInput = document.getElementById("usernameInput");
const usernameMessage = document.getElementById("usernameMessage");

const hubUsername = document.getElementById("hubUsername");
const hudUsername = document.getElementById("hudUsername");

const objectiveCount =
    document.getElementById("objectiveCount");

const healthBar =
    document.getElementById("healthBar");

const interactionPrompt =
    document.getElementById("interactionPrompt");

const roundMessage =
    document.getElementById("roundMessage");

const roundMessageTitle =
    document.getElementById("roundMessageTitle");

const roundMessageText =
    document.getElementById("roundMessageText");


/* =====================================================
   USERNAME
===================================================== */

let username =
    localStorage.getItem("overseer_username");


function updateUsernameUI() {

    const displayName =
        username || "Player";

    hubUsername.textContent =
        displayName;

    hudUsername.textContent =
        displayName;

}


function showUsernameScreen() {

    hubScreen.classList.add("hidden");

    usernameScreen.classList.remove("hidden");

    setTimeout(() => {

        usernameInput.focus();

    }, 100);

}


function validateUsername(name) {

    name = name.trim();


    if (name.length < 3) {

        return "Username must be at least 3 characters.";

    }


    if (name.length > 16) {

        return "Username must be 16 characters or less.";

    }


    if (!/^[a-zA-Z0-9_]+$/.test(name)) {

        return "Use only letters, numbers and underscores.";

    }


    return "";

}


usernameButton.addEventListener(
    "click",
    createUsername
);


usernameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            createUsername();

        }

    }
);


function createUsername() {

    const name =
        usernameInput.value.trim();


    const error =
        validateUsername(name);


    if (error) {

        usernameMessage.textContent =
            error;

        return;

    }


    username = name;

    localStorage.setItem(
        "overseer_username",
        username
    );


    usernameMessage.textContent =
        "";


    updateUsernameUI();


    usernameScreen.classList.add("hidden");

    hubScreen.classList.remove("hidden");

}


/* =====================================================
   HUB
===================================================== */

playButton.addEventListener(
    "click",
    () => {

        if (!username) {

            showUsernameScreen();

            return;

        }


        startGame();

    }
);


document
    .getElementById("profileButton")
    .addEventListener(
        "click",
        () => {

            if (!username) {

                showUsernameScreen();

                return;

            }

            alert(
                "Profile\n\n" +
                "Username: " +
                username +
                "\nLevel: 1\nRole: Survivor"
            );

        }
    );


document
    .getElementById("settingsButton")
    .addEventListener(
        "click",
        () => {

            alert(
                "Settings will be added here."
            );

        }
    );


updateUsernameUI();


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =====================================================
   INPUT
===================================================== */

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            ["w","a","s","d","e","shift"]
                .includes(event.key.toLowerCase())
        ) {

            event.preventDefault();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =====================================================
   GAME STATE
===================================================== */

let gameRunning = false;

let completedObjectives = 0;


/* =====================================================
   PLAYER
===================================================== */

const player = {

    x: 600,

    y: 700,

    width: 32,

    height: 48,

    speed: 2.8,

    sprintSpeed: 4.7,

    health: 100,

    role: "survivor",

    color: "#4f83ed"

};


/* =====================================================
   MAP
===================================================== */

const map = {

    width: 2600,

    height: 1800

};


const camera = {

    x: 0,

    y: 0

};


/* =====================================================
   WALLS
===================================================== */

const walls = [

    // OUTER

    {
        x: 0,
        y: 0,
        width: 2600,
        height: 45
    },

    {
        x: 0,
        y: 1755,
        width: 2600,
        height: 45
    },

    {
        x: 0,
        y: 0,
        width: 45,
        height: 1800
    },

    {
        x: 2555,
        y: 0,
        width: 45,
        height: 1800
    },


    // TOP LEFT ROOM

    {
        x: 180,
        y: 180,
        width: 550,
        height: 35
    },

    {
        x: 180,
        y: 180,
        width: 35,
        height: 430
    },

    {
        x: 695,
        y: 180,
        width: 35,
        height: 430
    },

    {
        x: 180,
        y: 575,
        width: 200,
        height: 35
    },

    {
        x: 500,
        y: 575,
        width: 230,
        height: 35
    },


    // TOP MIDDLE

    {
        x: 930,
        y: 180,
        width: 700,
        height: 35
    },

    {
        x: 930,
        y: 180,
        width: 35,
        height: 450
    },

    {
        x: 1595,
        y: 180,
        width: 35,
        height: 450
    },

    {
        x: 930,
        y: 595,
        width: 700,
        height: 35
    },


    // BOTTOM LEFT

    {
        x: 180,
        y: 950,
        width: 550,
        height: 35
    },

    {
        x: 180,
        y: 950,
        width: 35,
        height: 500
    },

    {
        x: 695,
        y: 950,
        width: 35,
        height: 500
    },

    {
        x: 180,
        y: 1415,
        width: 550,
        height: 35
    },


    // BOTTOM RIGHT

    {
        x: 1870,
        y: 950,
        width: 550,
        height: 35
    },

    {
        x: 1870,
        y: 950,
        width: 35,
        height: 500
    },

    {
        x: 2385,
        y: 950,
        width: 35,
        height: 500
    },

    {
        x: 1870,
        y: 1415,
        width: 550,
        height: 35
    },


    // CENTER OBSTACLES

    {
        x: 1050,
        y: 850,
        width: 300,
        height: 35
    },

    {
        x: 1050,
        y: 850,
        width: 35,
        height: 250
    },

    {
        x: 1315,
        y: 850,
        width: 35,
        height: 250
    }

];


/* =====================================================
   OBJECTIVES
===================================================== */

const computers = [

    {
        x: 400,
        y: 370,
        completed: false
    },

    {
        x: 1250,
        y: 370,
        completed: false
    },

    {
        x: 2050,
        y: 500,
        completed: false
    },

    {
        x: 430,
        y: 1160,
        completed: false
    },

    {
        x: 2150,
        y: 1160,
        completed: false
    }

];


/* =====================================================
   ESCAPE
===================================================== */

const escapeDoor = {

    x: 1170,

    y: 1650,

    width: 260,

    height: 55,

    active: false

};


/* =====================================================
   COLLISION
===================================================== */

function collides(a, b) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


function canMove(x, y) {

    const test = {

        x,

        y,

        width:
            player.width,

        height:
            player.height

    };


    for (const wall of walls) {

        if (
            collides(
                test,
                wall
            )
        ) {

            return false;

        }

    }


    return true;

}


/* =====================================================
   PLAYER
===================================================== */

function updatePlayer() {

    let dx = 0;

    let dy = 0;


    if (keys["w"])
        dy--;

    if (keys["s"])
        dy++;

    if (keys["a"])
        dx--;

    if (keys["d"])
        dx++;


    if (
        dx !== 0 &&
        dy !== 0
    ) {

        dx *= 0.707;

        dy *= 0.707;

    }


    let speed =
        keys["shift"]
            ? player.sprintSpeed
            : player.speed;


    const nextX =
        player.x +
        dx * speed;


    const nextY =
        player.y +
        dy * speed;


    if (
        canMove(
            nextX,
            player.y
        )
    ) {

        player.x =
            nextX;

    }


    if (
        canMove(
            player.x,
            nextY
        )
    ) {

        player.y =
            nextY;

    }

}


/* =====================================================
   OBJECTIVES
===================================================== */

function updateObjectives() {

    for (
        const computer
        of computers
    ) {

        if (
            computer.completed
        ) {

            continue;

        }


        const distance =
            Math.hypot(

                player.x -
                computer.x,

                player.y -
                computer.y

            );


        if (
            distance < 75
        ) {

            interactionPrompt.textContent =
                "PRESS E TO HACK COMPUTER";


            if (
                keys["e"]
            ) {

                computer.completed =
                    true;

                completedObjectives++;

                objectiveCount.textContent =
                    completedObjectives +
                    " / " +
                    computers.length;


                keys["e"] =
                    false;


                if (
                    completedObjectives ===
                    computers.length
                ) {

                    activateEscape();

                }

            }

        }

    }

}


/* =====================================================
   ESCAPE
===================================================== */

function activateEscape() {

    escapeDoor.active =
        true;


    roundMessageTitle.textContent =
        "OBJECTIVES COMPLETE";

    roundMessageText.textContent =
        "The escape door is now open.";

    roundMessage.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            roundMessage.classList.add(
                "hidden"
            );

        },
        3000
    );

}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        canvas.width / 2;


    camera.y =
        player.y +
        player.height / 2 -
        canvas.height / 2;


    camera.x =
        Math.max(
            0,
            Math.min(
                camera.x,
                map.width -
                canvas.width
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                camera.y,
                map.height -
                canvas.height
            )
        );

}


/* =====================================================
   DRAW FLOOR
===================================================== */

function drawFloor() {

    ctx.fillStyle =
        "#171e28";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const grid =
        70;


    ctx.strokeStyle =
        "rgba(255,255,255,0.025)";

    ctx.lineWidth = 1;


    for (
        let x =
            -camera.x % grid;

        x <
            canvas.width;

        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y =
            -camera.y % grid;

        y <
            canvas.height;

        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


/* =====================================================
   DRAW MAP
===================================================== */

function drawMap() {

    // Main floor

    ctx.fillStyle =
        "#222a35";

    ctx.fillRect(

        -camera.x,
        -camera.y,

        map.width,
        map.height

    );


    // Decorative floor panels

    ctx.fillStyle =
        "rgba(255,255,255,0.015)";


    for (
        let x = 80;
        x < map.width;
        x += 160
    ) {

        for (
            let y = 80;
            y < map.height;
            y += 160
        ) {

            ctx.fillRect(

                x - camera.x,
                y - camera.y,

                80,
                80

            );

        }

    }


    // Walls

    for (
        const wall
        of walls
    ) {

        ctx.fillStyle =
            "#3b4655";


        ctx.fillRect(

            wall.x -
                camera.x,

            wall.y -
                camera.y,

            wall.width,
            wall.height

        );


        ctx.fillStyle =
            "rgba(255,255,255,0.07)";


        ctx.fillRect(

            wall.x -
                camera.x,

            wall.y -
                camera.y,

            wall.width,

            3

        );

    }

}


/* =====================================================
   DRAW COMPUTERS
===================================================== */

function drawComputers() {

    for (
        const computer
        of computers
    ) {

        const x =
            computer.x -
            camera.x;

        const y =
            computer.y -
            camera.y;


        // Glow

        ctx.fillStyle =
            computer.completed

                ? "rgba(72,214,129,0.08)"

                : "rgba(79,131,237,0.12)";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            60,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Machine

        ctx.fillStyle =
            computer.completed
                ? "#48d681"
                : "#4f83ed";


        ctx.fillRect(
            x - 28,
            y - 23,
            56,
            40
        );


        // Screen

        ctx.fillStyle =
            "#0d1521";


        ctx.fillRect(
            x - 22,
            y - 17,
            44,
            27
        );


        // Stand

        ctx.fillStyle =
            "#9aa6b8";


        ctx.fillRect(
            x - 5,
            y + 17,
            10,
            14
        );


        ctx.fillRect(
            x - 18,
            y + 28,
            36,
            6
        );


        if (
            !computer.completed
        ) {

            ctx.fillStyle =
                "#b8c5d6";

            ctx.font =
                "10px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "COMPUTER",
                x,
                y + 52
            );

        }

    }

}


/* =====================================================
   DRAW ESCAPE
===================================================== */

function drawEscape() {

    const x =
        escapeDoor.x -
        camera.x;

    const y =
        escapeDoor.y -
        camera.y;


    ctx.fillStyle =
        escapeDoor.active
            ? "#38d982"
            : "#742f35";


    ctx.fillRect(

        x,
        y,

        escapeDoor.width,
        escapeDoor.height

    );


    ctx.fillStyle =
        "#0d121a";


    ctx.fillRect(

        x + 8,
        y + 8,

        escapeDoor.width - 16,
        escapeDoor.height - 16

    );


    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(

        escapeDoor.active
            ? "ESCAPE"
            : "LOCKED",

        x +
            escapeDoor.width / 2,

        y + 33

    );

}


/* =====================================================
   DRAW PLAYER
===================================================== */

function drawPlayer() {

    const x =
        player.x -
        camera.x;

    const y =
        player.y -
        camera.y;


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";


    ctx.beginPath();

    ctx.ellipse(

        x +
            player.width / 2,

        y +
            player.height,

        22,
        8,

        0,
        0,
        Math.PI * 2

    );

    ctx.fill();


    // Body

    ctx.fillStyle =
        player.color;


    ctx.fillRect(

        x + 4,
        y + 17,

        player.width - 8,
        27

    );


    // Head

    ctx.fillStyle =
        "#e5b894";


    ctx.beginPath();

    ctx.arc(

        x +
            player.width / 2,

        y + 11,

        12,

        0,
        Math.PI * 2

    );

    ctx.fill();


    // Hair

    ctx.fillStyle =
        "#151515";


    ctx.fillRect(

        x + 8,
        y - 1,

        player.width - 16,
        7

    );


    // Legs

    ctx.fillStyle =
        "#1d2736";


    ctx.fillRect(

        x + 6,
        y + 42,

        9,
        8

    );


    ctx.fillRect(

        x +
            player.width -
            15,

        y + 42,

        9,
        8

    );


    // Name

    ctx.fillStyle =
        "white";


    ctx.font =
        "11px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(

        username || "YOU",

        x +
            player.width / 2,

        y - 14

    );

}


/* =====================================================
   INTERACTION RESET
===================================================== */

function resetInteraction() {

    interactionPrompt.textContent =
        "WASD MOVE • SHIFT SPRINT";

}


/* =====================================================
   GAME UPDATE
===================================================== */

function update() {

    updatePlayer();

    updateObjectives();

    updateCamera();


    resetInteraction();

}


/* =====================================================
   DRAW
===================================================== */

function draw() {

    drawFloor();

    drawMap();

    drawComputers();

    drawEscape();

    drawPlayer();

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    if (
        !gameRunning
    ) {

        return;

    }


    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    hubScreen.classList.add(
        "hidden"
    );

    usernameScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    gameRunning =
        true;


    updateUsernameUI();


    objectiveCount.textContent =
        "0 / " +
        computers.length;


    requestAnimationFrame(
        gameLoop
    );

}
