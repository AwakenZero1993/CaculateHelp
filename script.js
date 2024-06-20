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

    // Reset error messages and styles
    document.getElementById('hp-error').innerText = '';
    document.getElementById('hp-error').style.display = 'none';

    document.getElementById('speed-error').innerText = '';
    document.getElementById('speed-error').style.display = 'none';

    document.getElementById('total-error').innerText = '';
    document.getElementById('total-error').style.display = 'none';

    // Validation logic
    if (hp < total * 0.2) {
        const requiredHp = total * 0.2;
        document.getElementById('hp-error').innerText = `Giá trị HP thấp nhất yêu cầu = ${requiredHp}`;
        document.getElementById('hp-error').style.display = 'block';
        isValid = false;
    }

    const minSpeed = total * 0.05;
    const maxSpeed = total * 0.6;
    if (speed < minSpeed || speed > maxSpeed) {
        document.getElementById('speed-error').innerText = `Speed phải nằm trong khoảng ${minSpeed} and ${maxSpeed}`;
        document.getElementById('speed-error').style.display = 'block';
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
        const inputValuesText = `Tổng chỉ số: ${total}\nHP: ${hp}*10 = ${hp * 10}\nPow: ${power}\nSpd: ${speed}\nShd: ${shielding}\nRec: ${recovery}`;
        document.getElementById('input-values').innerText = inputValuesText;

        document.getElementById('input-values').style.display = 'block';
        document.getElementById('copy-values').style.display = 'block'; // Hiển thị nút "Copy"
    }
});

// Event listener for copy button
document.getElementById('copy-values').addEventListener('click', function() {
    const inputValues = document.getElementById('input-values');
    const range = document.createRange();
    range.selectNode(inputValues);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
});
