function formatNumber(num) {
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
}

function updateStatInputs() {
    const total = parseFloat(this.value) || 0;
    
    // Reset các trường nhập liệu và hiển thị
    ['hp', 'power', 'speed', 'shielding', 'recovery'].forEach(id => {
        document.getElementById(id).value = '';
        document.getElementById(id).placeholder = '';
    });
    
    document.getElementById('total-error').innerText = '';
    document.getElementById('total-error').style.display = 'none';
    
    if (total > 0) {
        document.getElementById('stat-inputs').style.display = 'block';
        document.getElementById('stat-summary').style.display = 'flex';
        document.getElementById('base-total').innerText = formatNumber(total);
        document.getElementById('remaining-total').innerText = formatNumber(total);
        
        const requiredHp = formatNumber(total * 0.2);
        document.getElementById('hp').placeholder = `Min HP = ${requiredHp}`;
        
        const minSpeed = formatNumber(total * 0.05);
        const maxSpeed = formatNumber(total * 0.6);
        document.getElementById('speed').placeholder = `Speed range: ${minSpeed} - ${maxSpeed}`;
    } else {
        document.getElementById('stat-inputs').style.display = 'none';
        document.getElementById('stat-summary').style.display = 'none';
    }

    // Reset các thông báo lỗi
    document.querySelectorAll('.error-message').forEach(el => {
        el.innerText = '';
        el.style.display = 'none';
    });

    // Ẩn nút Copy và reset các giá trị hiển thị
    document.getElementById('copy-values').style.display = 'none';
    document.getElementById('input-values').style.display = 'none';
}

function validateStats(event) {
    const total = parseFloat(document.getElementById('total').value) || 0;
    const hp = parseFloat(document.getElementById('hp').value) || 0;
    const power = parseFloat(document.getElementById('power').value) || 0;
    const speed = parseFloat(document.getElementById('speed').value) || 0;
    const shielding = parseFloat(document.getElementById('shielding').value) || 0;
    const recovery = parseFloat(document.getElementById('recovery').value) || 0;
    
    let isValid = true;
    let errorMessage = '';
    
    // Xác định trường đang được nhập
    const currentField = event.target.id;
    
    // Xác thực HP
    if (currentField === 'hp' && hp > 0) {
        if (hp < total * 0.2) {
            const requiredHp = formatNumber(total * 0.2);
            errorMessage += `HP must be at least ${requiredHp}. `;
            isValid = false;
        }
    }
    
    // Xác thực Speed
    if (currentField === 'speed' && speed > 0) {
        const minSpeed = total * 0.05;
        const maxSpeed = total * 0.6;
        if (speed < minSpeed || speed > maxSpeed) {
            errorMessage += `Speed must be between ${formatNumber(minSpeed)} and ${formatNumber(maxSpeed)}. `;
            isValid = false;
        }
    }
    
    const totalStats = hp + power + speed + shielding + recovery;
    const remainingStat = total - totalStats;
    
    document.getElementById('remaining-total').innerText = formatNumber(remainingStat);
    
    if (totalStats > total) {
        errorMessage += `Total stats exceed Base Stat (${formatNumber(totalStats)}/${formatNumber(total)})`;
        isValid = false;
    }
    
    // Hiển thị thông báo lỗi cho trường hiện tại
    const errorElement = document.getElementById(`${currentField}-error`);
    if (errorElement) {
        errorElement.innerText = errorMessage;
        errorElement.style.display = errorMessage ? 'block' : 'none';
    }
    
    // Cập nhật hiển thị giá trị đầu vào
    updateInputValues(total, hp, power, speed, shielding, recovery);
    
    // Hiển thị/ẩn nút Copy dựa trên tính hợp lệ của tất cả các trường
    document.getElementById('copy-values').style.display = 
        (isValid && totalStats === total) ? 'block' : 'none';
}

function updateInputValues(total, hp, power, speed, shielding, recovery) {
    document.getElementById('input-total').innerText = formatNumber(total);
    document.getElementById('input-hp').innerText = `${formatNumber(hp)}*10 = ${formatNumber(hp * 10)}`;
    document.getElementById('input-power').innerText = formatNumber(power);
    document.getElementById('input-speed').innerText = formatNumber(speed);
    document.getElementById('input-shielding').innerText = formatNumber(shielding);
    document.getElementById('input-recovery').innerText = formatNumber(recovery);
    
    document.getElementById('input-values').style.display = 'block';
}

// Event listeners
document.getElementById('total').addEventListener('input', updateStatInputs);
document.getElementById('hp').addEventListener('input', validateStats);
document.getElementById('power').addEventListener('input', validateStats);
document.getElementById('speed').addEventListener('input', validateStats);
document.getElementById('shielding').addEventListener('input', validateStats);
document.getElementById('recovery').addEventListener('input', validateStats);

// Copy button functionality
document.getElementById('copy-values').addEventListener('click', function() {
    const inputValues = Array.from(document.querySelectorAll('#input-values p'))
                             .map(p => p.innerText)
                             .join('\n');

    navigator.clipboard.writeText(inputValues)
        .then(() => {
            const successMessage = document.createElement('p');
            successMessage.classList.add('success-message');
            successMessage.textContent = 'Đã sao chép thông tin thành công! Bạn có thể dán vào profile.';
            document.getElementById('success-message').appendChild(successMessage);

            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        })
        .catch((err) => {
            console.error('Failed to copy text: ', err);
        });
});

// Khởi tạo ban đầu
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('stat-inputs').style.display = 'none';
    document.getElementById('stat-summary').style.display = 'none';
    document.getElementById('input-values').style.display = 'none';
    document.getElementById('copy-values').style.display = 'none';
});

