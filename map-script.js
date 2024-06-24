// Biến toàn cục để lưu trữ đối tượng Geogebra applet
let ggbApp;

// Mảng lưu trữ các điểm
let points = [];

function resizeGeogebraApplet() {
    if (ggbApp) {
        const container = document.getElementById('ggb-element');
        const width = container.offsetWidth;
        const height = width * 0.75; // Tỷ lệ khung hình 4:3
        ggbApp.setSize(width, height);
        ggbApp.setCoordSystem(-10, 10, -10, 10); // Reset hệ tọa độ
    }
}

// Cấu hình cho Geogebra applet
const params = {
    "appName": "classic",
    "width": "100%",
    "height": "100%",
    "showToolBar": true,
    "showAlgebraInput": true,
    "showMenuBar": true,
    "showResetIcon": true,
    "enableLabelDrags": true,
    "enableShiftDragZoom": true,
    "enableRightClick": true,
    "capturingThreshold": null,
    "showToolBarHelp": true,
    "errorDialogsActive": true,
    "useBrowserForJS": true,
    "scaleContainerClass": "ggb-element",
    "allowStyleBar": true,
    "preventFocus": true,
    "showZoomButtons": true,
    "scale": 1,
    "disableAutoScale": true,
    "allowUpscale": true,
    "clickToLoad": true,
    "appletOnLoad": function(api) {
        ggbApp = api;
        ggbApp.setAxisLabels(1, "x", "y");
        ggbApp.setAxisUnits(1, "cm", "cm");
        ggbApp.setGridVisible(true);
        resizeGeogebraApplet(); // Gọi hàm resize ngay khi applet được tải
        updatePointList();
    },
};

// Khởi tạo Geogebra applet
const applet = new GGBApplet(params, true);
window.addEventListener("load", function() {
    applet.inject('ggb-element');
});

// Xử lý sự kiện submit form thêm/sửa điểm
document.getElementById('pointForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('pointName').value;
    const x = parseFloat(document.getElementById('xCoord').value);
    const y = parseFloat(document.getElementById('yCoord').value);
    const type = document.getElementById('pointType').value;

    const existingPointIndex = points.findIndex(p => p.name === name);
    if (existingPointIndex !== -1) {
        // Cập nhật điểm hiện có
        points[existingPointIndex] = { name, x, y, type };
    } else {
        // Thêm điểm mới
        points.push({ name, x, y, type });
    }

    updateGeogebraPoints();
    updatePointList();
    this.reset();
});

// Xử lý sự kiện click nút xóa điểm
document.getElementById('deletePoint').addEventListener('click', function() {
    const name = document.getElementById('pointName').value;
    const index = points.findIndex(p => p.name === name);
    if (index !== -1) {
        points.splice(index, 1);
        updateGeogebraPoints();
        updatePointList();
        document.getElementById('pointForm').reset();
    }
	updatePointList();
});

// Cập nhật điểm trên Geogebra applet
function updateGeogebraPoints() {
    if (!ggbApp) return;

    // Xóa tất cả các điểm hiện có
    points.forEach(point => {
        if (ggbApp.exists(point.name)) {
            ggbApp.deleteObject(point.name);
        }
    });

    // Vẽ lại lưới và trục tọa độ
    ggbApp.setGridVisible(true);
    ggbApp.setAxesVisible(true, true);

    // Vẽ lại các điểm
    points.forEach(point => {
        ggbApp.evalCommand(`${point.name} = (${point.x}, ${point.y})`);
        ggbApp.setColor(point.name, point.type === 'ally' ? 0 : 255, point.type === 'ally' ? 255 : 0, 0);
        ggbApp.setLabelVisible(point.name, true);
    });
}

// Cập nhật danh sách điểm trên HTML
function updatePointList() {
    const list = document.getElementById('pointList');
    list.innerHTML = '';
    points.forEach(point => {
        const li = document.createElement('li');
        li.textContent = `${point.name}: (${point.x}, ${point.y}) - ${point.type === 'ally' ? 'Đồng minh' : 'Kẻ địch'}`;
        li.addEventListener('click', () => fillPointForm(point));
        list.appendChild(li);
    });
    updatePointDropdowns(); 
}

// Điền thông tin điểm vào form khi click vào điểm trong danh sách
function fillPointForm(point) {
    document.getElementById('pointName').value = point.name;
    document.getElementById('xCoord').value = point.x;
    document.getElementById('yCoord').value = point.y;
    document.getElementById('pointType').value = point.type;
}

// Xử lý sự kiện submit form AoE
document.getElementById('aoeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const x = parseFloat(document.getElementById('aoeX').value);
    const y = parseFloat(document.getElementById('aoeY').value);
    const radius = parseFloat(document.getElementById('aoeRadius').value);

    if (!ggbApp) return;

    // Vẽ AoE trên Geogebra
    ggbApp.evalCommand(`AoECenter = (${x}, ${y})`);
    ggbApp.evalCommand(`AoE = Circle(AoECenter, ${radius})`);
    ggbApp.setColor('AoE', 0, 0, 255);
    ggbApp.setFilling('AoE', 0.2);

    // Tính toán friendly fire và enemy hit
    let friendlyFireCount = 0;
    let enemyHitCount = 0;
    points.forEach(point => {
        const distance = Math.sqrt((point.x - x)**2 + (point.y - y)**2);
        if (distance <= radius) {
            if (point.type === 'ally') {
                friendlyFireCount++;
            } else {
                enemyHitCount++;
            }
        }
    });

    // Hiển thị kết quả
    document.getElementById('aoeResult').innerHTML = `
        <p>Tọa độ tâm AoE: (${x}, ${y})</p>
        <p>Bán kính AoE: ${radius}</p>
        <p>Số đồng minh bị ảnh hưởng: ${friendlyFireCount}</p>
        <p>Số kẻ địch bị ảnh hưởng: ${enemyHitCount}</p>
        <p>${friendlyFireCount > 0 ? 'Cảnh báo: Có friendly fire!' : 'Không có friendly fire.'}</p>
    `;
});

// Thêm event listener để resize Geogebra applet khi cửa sổ thay đổi kích thước
window.addEventListener('resize', function() {
    if (ggbApp) {
        ggbApp.setSize(document.getElementById('ggb-element').offsetWidth, document.getElementById('ggb-element').offsetHeight);
    }
});

window.addEventListener('load', resizeGeogebraApplet);

function updatePointDropdowns() {
    const point1Select = document.getElementById('point1');
    const point2Select = document.getElementById('point2');
    
    // Xóa các option cũ
    point1Select.innerHTML = '<option value="">Chọn điểm</option>';
    point2Select.innerHTML = '<option value="">Chọn điểm</option>';
    
    // Thêm các điểm hiện có vào dropdown
    points.forEach(point => {
        const option = document.createElement('option');
        option.value = point.name;
        option.textContent = `${point.name} (${point.x}, ${point.y})`;
        point1Select.appendChild(option.cloneNode(true));
        point2Select.appendChild(option);
    });
}

function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx*dx + dy*dy);
}

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
        
        // Vẽ đường nối hai điểm trên Geogebra
        if (ggbApp) {
            const lineName = `line_${point1.name}_${point2.name}`;
            ggbApp.evalCommand(`${lineName} = Segment(${point1.name}, ${point2.name})`);
            ggbApp.setColor(lineName, 0, 0, 255); // Màu xanh dương
        }
    } else {
        document.getElementById('distanceResult').innerHTML = `
            <p>Vui lòng chọn hai điểm khác nhau.</p>
        `;
    }
});

