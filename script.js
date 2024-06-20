document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const stat1 = parseFloat(document.getElementById('stat1').value);
    const stat2 = parseFloat(document.getElementById('stat2').value);
    const stat3 = parseFloat(document.getElementById('stat3').value);

    if (isNaN(stat1) || isNaN(stat2) || isNaN(stat3)) {
        alert("Vui lòng nhập tất cả các chỉ số!");
        return;
    }

    const result = (stat1 + stat2 + stat3) / 3;  // Ví dụ: tính trung bình ba chỉ số

    document.getElementById('result').innerText = "Kết quả: " + result.toFixed(2);
});
