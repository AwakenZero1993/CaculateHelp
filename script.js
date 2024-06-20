document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const total = parseFloat(document.getElementById('total').value);
    const hp = parseFloat(document.getElementById('hp').value);
    const power = parseFloat(document.getElementById('power').value) || 0; // Default to 0 if empty
    const speed = parseFloat(document.getElementById('speed').value) || 0; // Default to 0 if empty
    const shielding = parseFloat(document.getElementById('shielding').value) || 0; // Default to 0 if empty
    const recovery = parseFloat(document.getElementById('recovery').value) || 0; // Default to 0 if empty

    let isValid = true;

    // Reset error messages
    document.getElementById('hp-error').style.display = 'none';
    document.getElementById('speed-error').style.display = 'none';
    document.getElementById('total-error').style.display = 'none';
    document.getElementById('result').innerText = '';

    // HP condition: at least 20% of total
    if (hp < total * 0.2) {
        const requiredHp = total * 0.2;
        document.getElementById('hp-error').innerText = `HP phải ít nhất ${requiredHp}/${total}`;
        document.getElementById('hp-error').style.display = 'block';
        isValid = false;
    }

    // Speed condition: at least 5% of total
    if (speed < total * 0.05) {
        const requiredSpeed = total * 0.05;
        document.getElementById('speed-error').innerText = `Speed ít nhất ${requiredSpeed}/${total}`;
        document.getElementById('speed-error').style.display = 'block';
        isValid = false;
    } else if (speed > total * 0.6) {
        const maxSpeed = total * 0.6;
        document.getElementById('speed-error').innerText = `Speed cao hơn mức tối đa (${speed}/${maxSpeed})`;
        document.getElementById('speed-error').style.display = 'block';
        isValid = false;
    }

    // Total stats condition
    const totalStats = hp + power + speed + shielding + recovery;
    if (totalStats > total) {
        document.getElementById('total-error').innerText = `Tổng của HP, Power, Speed, Shielding và Recovery không được lớn hơn tổng chỉ số (${totalStats}/${total})`;
        document.getElementById('total-error').style.display = 'block';
        isValid = false;
    } else if (totalStats < total) {
        document.getElementById('total-error').innerText = `Tổng chỉ số của bạn đang thấp hơn tổng chỉ số, hãy lưu ý (${totalStats}/${total})`;
        document.getElementById('total-error').style.display = 'block';
    }

    if (isValid) {
        document.getElementById('result').innerText = "Dữ liệu hợp lệ. Tiếp tục xử lý...";
    }
});
