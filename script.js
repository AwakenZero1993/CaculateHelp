document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const total = parseFloat(document.getElementById('total').value);
    const hp = parseFloat(document.getElementById('hp').value);
    const power = parseFloat(document.getElementById('power').value);
    const speed = parseFloat(document.getElementById('speed').value);

    let isValid = true;

    // Reset error messages
    document.getElementById('hp-error').style.display = 'none';
    document.getElementById('speed-error').style.display = 'none';

    // HP condition: at least 20% of total
    if (hp < total * 0.2) {
        document.getElementById('hp-error').innerText = "HP phải ít nhất 20% tổng chỉ số.";
        document.getElementById('hp-error').style.display = 'block';
        isValid = false;
    }

    // Speed condition: no more than 60% of total
    if (speed > total * 0.6) {
        document.getElementById('speed-error').innerText = "Speed không được cao hơn 60% tổng chỉ số.";
        document.getElementById('speed-error').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        const result = (hp + power + speed) / 3;  // Example calculation: average of three stats
        document.getElementById('result').innerText = "Kết quả: " + result.toFixed(2);
    }
});
