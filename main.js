let canvas;
let ctx;
let collisions_counter;

const BLOCK_RADIUS_METERS = 1;
const PIXELS_PER_METER = 20.0;

const WIDTH_PIXELS = 500;
const HEIGHT_PIXELS = 300;

let m = 1;
let M = 10;
let vm = 0;
let vM = -1;
let dm = 1;
let dM = 5;

let sim_fps = 120;
let sim_delta = 1.0 / sim_fps;

let collisions = 0;

function load() {
    canvas = document.querySelector("#main");
    ctx = canvas.getContext("2d");
    collisions_counter = document.querySelector("#counter");

    const M_input = document.getElementById("M").value;
    if (M_input) {
        M = M_input;
    }

    setInterval(update, sim_delta * 1000);
}

let previously_collided = false;
function update() {
    const alpha = M / m;

    dm += vm * sim_delta;
    dM += vM * sim_delta;

    const wall_collision = dm <= 0;
    if (wall_collision) { // If small mass hits wall, rebound (large mass won't ever hit it lol)
        vm = Math.abs(vm);
        collisions += 1;
    }
    const collision_between = Math.abs(dM - dm) <= 2 * BLOCK_RADIUS_METERS;
    if (collision_between) {
        const temp_vm = vm;
        const temp_vM = vM;

        vM = (temp_vM * (alpha + 1) + 2 * temp_vm) / (alpha + 1);
        vm = (2 * alpha * temp_vM + temp_vm * (1 - alpha)) / (alpha + 1);
        collisions += 1;
    }
    previously_collided = collision_between || wall_collision;

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisions_counter.innerHTML = collisions;

    // Block m
    ctx.fillStyle = "#777";
    ctx.fillRect(dm * PIXELS_PER_METER, HEIGHT_PIXELS - BLOCK_RADIUS_METERS * PIXELS_PER_METER * 2,
    BLOCK_RADIUS_METERS * PIXELS_PER_METER * 2, BLOCK_RADIUS_METERS * PIXELS_PER_METER * 2);
    
    ctx.fillStyle = "#eee";
    ctx.fillText(`v = ${Math.round(vm * 100) / 100} m/s`, dm * PIXELS_PER_METER, HEIGHT_PIXELS - BLOCK_RADIUS_METERS * PIXELS_PER_METER * 3);
    ctx.fillText(`m = ${m} kg`, dm * PIXELS_PER_METER, HEIGHT_PIXELS - BLOCK_RADIUS_METERS * PIXELS_PER_METER * 3 - 20);
    
    ctx.font = "12px mono";
    
    // Block M
    ctx.fillStyle = "#1864e7";
    ctx.fillRect(dM * PIXELS_PER_METER, HEIGHT_PIXELS - BLOCK_RADIUS_METERS * PIXELS_PER_METER * 2, 
    BLOCK_RADIUS_METERS * PIXELS_PER_METER * 2, BLOCK_RADIUS_METERS * PIXELS_PER_METER * 2);

    ctx.fillStyle = "#eee";
    ctx.fillText(`v = ${Math.round(vM * 100) / 100} m/s`, dM * PIXELS_PER_METER, HEIGHT_PIXELS - BLOCK_RADIUS_METERS * PIXELS_PER_METER * 3);
    ctx.fillText(`M = ${M} kg`, dM * PIXELS_PER_METER, HEIGHT_PIXELS - BLOCK_RADIUS_METERS * PIXELS_PER_METER * 3 - 20);
}
