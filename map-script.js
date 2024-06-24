let points = [];
let scale = 10; // Tăng scale mặc định để các điểm không quá nhỏ
let offsetX = 0;
let offsetY = 0;

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

function worldToScreen(x, y) {
    return {
        x: (x * scale + offsetX + canvas.width / 2),
        y: (canvas.height / 2 - y * scale + offsetY)
    };
}

function screenToWorld(x, y) {
    return {
        x: (x - offsetX - canvas.width / 2) / scale,
        y: (canvas.height / 2 - y + offsetY) / scale
    };
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const origin = worldToScreen(0, 0);
    const gridSize = 50;

    // Vẽ lưới
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    for (let x = origin.x % gridSize; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = origin.y % gridSize; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    // Vẽ trục tọa độ
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(canvas.width, origin.y);
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, canvas.height);
    ctx.stroke();

    // Vẽ số trên trục tọa độ
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    const step = Math.ceil(gridSize / scale);
    for (let i = Math.floor(-origin.x / gridSize) * step; i <= Math.ceil((canvas.width - origin.x) / gridSize) * step; i += step) {
        const {x, y} = worldToScreen(i, 0);
        ctx.fillText(i.toString(), x, origin.y + 20);
    }
    for (let i = Math.floor((origin.y - canvas.height) / gridSize) * step; i <= Math.ceil(origin.y / gridSize) * step; i += step) {
        const {x, y} = worldToScreen(0, i);
        ctx.fillText(i.toString(), origin.x + 5, y);
    }

    // Vẽ các điểm
    points.forEach(point => {
        const {x, y} = worldToScreen(point.x, point.y);
        ctx.fillStyle = point.type === 'ally' ? 'blue' : 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(point.name, x + 10, y - 10);
    });
}

function zoom(delta, centerX, centerY) {
    const center = screenToWorld(centerX, centerY);
    const factor = delta > 0 ? 1.1 : 0.9;
    scale *= factor;
    
    const newCenter = worldToScreen(center.x, center.y);
    offsetX += centerX - newCenter.x;
    offsetY += centerY - newCenter.y;

    drawMap();
}

function pan(dx, dy) {
    offsetX += dx;
    offsetY += dy;
    drawMap();
}

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    zoom(e.deltaY, x, y);
});

canvas.addEventListener('mousedown', (e) => {
    let lastX = e.clientX;
    let lastY = e.clientY;
    
    function mousemove(e) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        pan(dx, dy);
        lastX = e.clientX;
        lastY = e.clientY;
    }
    
    function mouseup() {
        canvas.removeEventListener('mousemove', mousemove);
        canvas.removeEventListener('mouseup', mouseup);
    }
    
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseup', mouseup);
});

// ... (các hàm khác giữ nguyên)

document.getElementById('aoeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const x = parseFloat(document.getElementById('aoeX').value);
    const y = parseFloat(document.getElementById('aoeY').value);
    const radius = parseFloat(document.getElementById('aoeRadius').value);
    const type = document.getElementById('aoeType').value;

    const {x: screenX, y: screenY} = worldToScreen(x, y);
    const screenRadius = radius * scale;

    ctx.strokeStyle = type === 'damage' ? 'red' : 'green';
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // ... (phần còn lại của xử lý AoE giữ nguyên)
});

document.getElementById('distanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const point1Name = document.getElementById('point1').value;
    const point2Name = document.getElementById('point2').value;
    
    const point1 = points.find(p => p.name === point1Name);
    const point2 = points.find(p => p.name === point2Name);
    
    if (point1 && point2) {
        const distance = calculateDistance(point1, point2);
        document.getElementById('distanceResult').innerHTML = `
            <p>Khoảng cách giữa ${point1.name} và ${point2.name}: ${distance.toFixed(2)} đơn vị</p>
        `;
        
        const {x: x1, y: y1} = worldToScreen(point1.x, point1.y);
        const {x: x2, y: y2} = worldToScreen(point2.x, point2.y);
        
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    } else {
        document.getElementById('distanceResult').innerHTML = `
            <p>Vui lòng chọn hai điểm khác nhau.</p>
        `;
    }
});

function savePointsToCookie() {
    document.cookie = `points=${JSON.stringify(points)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadPointsFromCookie() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('points='));
    if (cookie) {
        points = JSON.parse(cookie.split('=')[1]);
        updatePointList();
        drawMap();
    }
}

function clearCookie() {
    document.cookie = 'points=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    points = [];
    updatePointList();
    drawMap();
}

// Thêm nút xóa cookie
const clearButton = document.createElement('button');
clearButton.textContent = 'Xóa dữ liệu';
clearButton.classList.add('btn-secondary');
clearButton.addEventListener('click', clearCookie);
document.querySelector('.control-section').appendChild(clearButton);

window.addEventListener('load', () => {
    loadPointsFromCookie();
    drawMap();
});

window.addEventListener('load', () => {
    loadPointsFromCookie();
    drawMap();
});