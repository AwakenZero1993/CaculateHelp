document.addEventListener('DOMContentLoaded', function() {
    const statCalcForm = document.getElementById('stat-calc-form');
    const damageDealtForm = document.getElementById('damage-dealt-form');
    const damageReceivedForm = document.getElementById('damage-received-form');

    statCalcForm.addEventListener('input', calculateStats);
    damageDealtForm.addEventListener('input', calculateDamageDealt);
    damageReceivedForm.addEventListener('input', calculateDamageReceived);

    document.getElementById('buff-count').addEventListener('input', function() {
        updateBuffDebuffInputs(this, 'buff', 'stat-calc');
    });
    document.getElementById('debuff-count').addEventListener('input', function() {
        updateBuffDebuffInputs(this, 'debuff', 'stat-calc');
    });

    document.getElementById('attack-count').addEventListener('input', updateAttackInputs);

    // Mặc định hiển thị thông tin cho 1 đòn tấn công
    updateAttackInputs();
});

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const allSections = document.querySelectorAll('.section-content');
    
    allSections.forEach(s => {
        if (s.id === sectionId) {
            s.style.display = s.style.display === 'none' ? 'block' : 'none';
        } else {
            s.style.display = 'none';
        }
    });
}

function updateAttackInputs() {
    const attackCount = parseInt(document.getElementById('attack-count').value) || 1;
    const attacksContainer = document.getElementById('attacks-container');
    attacksContainer.innerHTML = '';

    for (let i = 0; i < attackCount; i++) {
        let copyButton = '';
        if (i > 0) {
            copyButton = `<button type="button" class="copy-previous-button" data-attack-index="${i}">Sao chép từ đòn trước</button>`;
        }

        attacksContainer.innerHTML += `
            <div class="attack-input" id="attack-${i}">
                <h3>Đòn tấn công ${i + 1}</h3>
                ${copyButton}
                <label for="power-${i}">Sát thương (Pow):</label>
                <input type="number" id="power-${i}" class="power-input" min="0" required placeholder="Nhập chỉ số Pow sau khi tính qua buff và debuff.">
                
                <label for="buff-count-${i}">Số lượng buff sát thương:</label>
                <input type="number" id="buff-count-${i}" class="buff-count-input" value="0" min="0">
                <div id="buff-inputs-${i}" class="buff-inputs"></div>
                
                <label for="debuff-count-${i}">Số lượng debuff giảm sát thương:</label>
                <input type="number" id="debuff-count-${i}" class="debuff-count-input" value="0" min="0">
                <div id="debuff-inputs-${i}" class="debuff-inputs"></div>
                
                <label>
                    <input type="checkbox" id="true-damage-${i}" class="effect-checkbox"> True Damage
                </label>
                <label>
                    <input type="checkbox" id="piercing-${i}" class="effect-checkbox"> Piercing
                </label>
            </div>
        `;
    }

    // Add event listeners for buff and debuff count inputs
    document.querySelectorAll('.buff-count-input').forEach(input => {
        input.addEventListener('input', function() {
            updateBuffDebuffInputs(this, 'buff', 'attack');
        });
    });

    document.querySelectorAll('.debuff-count-input').forEach(input => {
        input.addEventListener('input', function() {
            updateBuffDebuffInputs(this, 'debuff', 'attack');
        });
    });

    // Add event listeners for copy buttons
    document.querySelectorAll('.copy-previous-button').forEach(button => {
        button.addEventListener('click', copyPreviousAttack);
    });

    calculateDamageDealt();
}

function updateBuffDebuffInputs(countInput, type, context) {
    const count = parseInt(countInput.value) || 0;
    const container = countInput.nextElementSibling;
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const label = type === 'buff' ? `Buff chỉ số ${i + 1}` : `Debuff chỉ số ${i + 1}`;
        container.innerHTML += `
            <label for="${type}-${countInput.id}-${i}">${label} (%):</label>
            <input type="number" id="${type}-${countInput.id}-${i}" class="${type}-input" min="0" max="100" required placeholder="Nhập giá trị của ${type === 'buff' ? 'buff' : 'debuff'}">
        `;
    }

    if (context === 'stat-calc') {
        calculateStats();
    } else if (context === 'attack') {
        calculateDamageDealt();
    }
}

function copyPreviousAttack(event) {
    const currentIndex = parseInt(event.target.getAttribute('data-attack-index'));
    const previousIndex = currentIndex - 1;

    // Copy power
    document.getElementById(`power-${currentIndex}`).value = document.getElementById(`power-${previousIndex}`).value;

    // Copy buff count and values
    const buffCount = document.getElementById(`buff-count-${previousIndex}`).value;
    document.getElementById(`buff-count-${currentIndex}`).value = buffCount;
    updateBuffDebuffInputs(document.getElementById(`buff-count-${currentIndex}`), 'buff', 'attack');
    for (let i = 0; i < buffCount; i++) {
        document.getElementById(`buff-buff-count-${currentIndex}-${i}`).value = document.getElementById(`buff-buff-count-${previousIndex}-${i}`).value;
    }

    // Copy debuff count and values
    const debuffCount = document.getElementById(`debuff-count-${previousIndex}`).value;
    document.getElementById(`debuff-count-${currentIndex}`).value = debuffCount;
    updateBuffDebuffInputs(document.getElementById(`debuff-count-${currentIndex}`), 'debuff', 'attack');
    for (let i = 0; i < debuffCount; i++) {
        document.getElementById(`debuff-debuff-count-${currentIndex}-${i}`).value = document.getElementById(`debuff-debuff-count-${previousIndex}-${i}`).value;
    }

    // Copy checkboxes
    document.getElementById(`true-damage-${currentIndex}`).checked = document.getElementById(`true-damage-${previousIndex}`).checked;
    document.getElementById(`piercing-${currentIndex}`).checked = document.getElementById(`piercing-${previousIndex}`).checked;

    // Recalculate damage
    calculateDamageDealt();
}

function calculateStats() {
    const baseStat = parseFloat(document.getElementById('base-stat').value) || 0;
    
    const buffInputs = document.querySelectorAll('#buff-inputs .buff-input');
    let totalBuff = 0;
    let buffDetails = [];
    buffInputs.forEach((input, index) => {
        const buffValue = parseFloat(input.value) || 0;
        if (buffValue !== 0) {
            totalBuff += buffValue;
            buffDetails.push(`Buff sát thương ${index + 1}: ${buffValue}%`);
        }
    });

    const debuffInputs = document.querySelectorAll('#debuff-inputs .debuff-input');
    let totalDebuff = 1;
    let debuffDetails = [];
    debuffInputs.forEach((input, index) => {
        const debuffValue = parseFloat(input.value) || 0;
        if (debuffValue !== 0) {
            totalDebuff *= (100 - debuffValue) / 100;
            debuffDetails.push(`Debuff giảm sát thương ${index + 1}: ${debuffValue}%`);
        }
    });

    const finalStat = baseStat * (1 + totalBuff / 100) * totalDebuff;

    const resultElement = document.getElementById('stat-calc-result');
    resultElement.innerHTML = `
        <p>Base Stat: ${baseStat}</p>
        <p>Tổng buff: ${buffDetails.length > 0 ? buffDetails.join(' + ') : '0%'} = <span style="color: red;">${totalBuff}%</span></p>
        <p>Tổng debuff: 1 - ${debuffDetails.length > 0 ? debuffDetails.join(' * ') : '100'}% / 100 = <span style="color: red;">${((1 - totalDebuff) * 100).toFixed(2)}%</span></p>
        <p><strong>Stat cuối cùng: ${finalStat.toFixed(2)}</strong></p>
    `;
}

function calculateDamageDealt() {
    const attackCount = parseInt(document.getElementById('attack-count').value) || 1;
    let damageDetails = [];

    for (let i = 0; i < attackCount; i++) {
        const power = parseFloat(document.getElementById(`power-${i}`).value) || 0;
        
        // Calculate buff
        const buffInputs = document.querySelectorAll(`#buff-inputs-${i} .buff-input`);
        let totalBuff = 0;
        let buffDetails = [];
        buffInputs.forEach((input, index) => {
            const buffValue = parseFloat(input.value) || 0;
            if (buffValue !== 0) {
                totalBuff += buffValue;
                buffDetails.push(`${buffValue}%`);
            }
        });

        // Calculate debuff
        const debuffInputs = document.querySelectorAll(`#debuff-inputs-${i} .debuff-input`);
        let totalDebuff = 1;
        let debuffDetails = [];
        debuffInputs.forEach((input, index) => {
            const debuffValue = parseFloat(input.value) || 0;
            if (debuffValue !== 0) {
                totalDebuff *= (100 - debuffValue) / 100;
                debuffDetails.push(`${debuffValue}%`);
            }
        });

        const damage = power * (1 + totalBuff / 100) * totalDebuff;

        const trueDamage = document.getElementById(`true-damage-${i}`).checked;
        const piercing = document.getElementById(`piercing-${i}`).checked;

        damageDetails.push(`
            <p><strong>Đòn tấn công ${i + 1}:</strong></p>
            <p>Sát thương cơ bản: ${power}</p>
            <p>Tổng buff sát thương: ${buffDetails.length > 0 ? buffDetails.join(' + ') : '0%'} = <span style="color: red;">${totalBuff}%</span></p>
            <p>Tổng debuff giảm sát thương: 1 - ${debuffDetails.length > 0 ? debuffDetails.join(' * ') : '100'}% / 100 = <span style="color: red;">${((1 - totalDebuff) * 100).toFixed(2)}%</span></p>
            <p>Sát thương cuối cùng: <strong>${damage.toFixed(2)}</strong></p>
            <p>Hiệu ứng: ${trueDamage ? 'True Damage, ' : ''}${piercing ? 'Piercing' : ''}</p>
        `);
    }

    const resultElement = document.getElementById('damage-dealt-result');
    resultElement.innerHTML = `
        <h3>Kết quả tính sát thương:</h3>
        ${damageDetails.join('<hr>')}
    `;
}

function calculateDamageReceived() {
    const defenderHp = parseFloat(document.getElementById('defender-hp-received').value) || 0;
    const defenderShielding = parseFloat(document.getElementById('defender-shielding-received').value) || 0;
    const incomingDamage = parseFloat(document.getElementById('incoming-damage').value) || 0;

    const actualDamage = Math.max(0, incomingDamage - defenderShielding);
    const remainingHp = Math.max(0, defenderHp - actualDamage);

    const resultElement = document.getElementById('damage-received-result');
    resultElement.innerHTML = `
        <p>Sát thương thực tế nhận vào: ${actualDamage}</p>
        <p>HP còn lại: ${remainingHp}</p>
    `;
}