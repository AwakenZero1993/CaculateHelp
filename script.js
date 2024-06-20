function formatNumber(num) {
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
}

document.getElementById('total').addEventListener('change', function() {
    const total = parseFloat(this.value);

    // Xóa giá trị của các trường nhập liệu
    document.getElementById('hp').value = '';
    document.getElementById('power').value = '';
    document.getElementById('speed').value = '';
    document.getElementById('shielding').value = '';
    document.getElementById('recovery').value = '';

    // Xóa các cảnh báo lỗi
    document.getElementById('hp').placeholder = '';
    document.getElementById('speed').placeholder = '';
    document.getElementById('total-error').innerText = '';
    document.getElementById('total-error').style.display = 'none';

    // Hiển thị các trường nhập chỉ số khác
    document.getElementById('stat-inputs').style.display = 'block';

    // Hiển thị cảnh báo về HP trong placeholder
    const requiredHp = formatNumber(total * 0.2);
    document.getElementById('hp').placeholder = `Giá trị HP thấp nhất yêu cầu = ${requiredHp}`;

    // Hiển thị cảnh báo về Speed trong placeholder
    const minSpeed = formatNumber(total * 0.05);
    const maxSpeed = formatNumber(total * 0.6);
    document.getElementById('speed').placeholder = `Speed phải nằm trong khoảng ${minSpeed} và ${maxSpeed}`;
});

document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Ẩn nút "Copy" trước khi kiểm tra tính hợp lệ của dữ liệu
    document.getElementById('copy-values').style.display = 'none';

    const total = parseFloat(document.getElementById('total').value);
    const hp = parseFloat(document.getElementById('hp').value);
    const power = parseFloat(document.getElementById('power').value) || 0;
    const speed = parseFloat(document.getElementById('speed').value) || 0;
    const shielding = parseFloat(document.getElementById('shielding').value) || 0;
    const recovery = parseFloat(document.getElementById('recovery').value) || 0;

    let isValid = true;

    // Reset placeholder
    document.getElementById('hp').placeholder = '';
    document.getElementById('speed').placeholder = '';

    // Reset error messages and styles
    document.getElementById('total-error').innerText = '';
    document.getElementById('total-error').style.display = 'none';

    // Validation logic
    if (hp < total * 0.2) {
        const requiredHp = formatNumber(total * 0.2);
        document.getElementById('hp').placeholder = `Giá trị HP thấp nhất yêu cầu = ${requiredHp}`;
        isValid = false;
    }

    const minSpeed = formatNumber(total * 0.05);
    const maxSpeed = formatNumber(total * 0.6);
    if (speed < minSpeed || speed > maxSpeed) {
        document.getElementById('speed').placeholder = `Speed phải nằm trong khoảng ${minSpeed} và ${maxSpeed}`;
        isValid = false;
    }

    const totalStats = hp + power + speed + shielding + recovery;
    if (totalStats > total) {
        document.getElementById('total-error').innerText = `Tổng HP/ STR/ SPD/ SHD/ REC đang cao hơn Base Stat bạn đăng ký (${totalStats}/${total})`;
        document.getElementById('total-error').style.display = 'block';
        isValid = false;
    } else if (totalStats < total) {
        document.getElementById('total-error').innerText = `Tổng chỉ số hiện tại là (${totalStats}/${total}), hãy tăng thêm chỉ số.`;
        document.getElementById('total-error').style.display = 'block';
        isValid = false;
    }

    // If everything is valid, display input values and copy button
    if (isValid) {
        document.getElementById('input-total').innerText = formatNumber(total);
        document.getElementById('input-hp').innerText = `${formatNumber(hp)}*10 = ${formatNumber(hp * 10)}`;
        document.getElementById('input-power').innerText = formatNumber(power);
        document.getElementById('input-speed').innerText = formatNumber(speed);
        document.getElementById('input-shielding').innerText = formatNumber(shielding);
        document.getElementById('input-recovery').innerText = formatNumber(recovery);

        document.getElementById('input-values').style.display = 'block';
        document.getElementById('copy-values').style.display = 'block'; // Hiển thị nút "Copy"
    }
});

// Event listener for copy button
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
