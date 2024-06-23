document.addEventListener('DOMContentLoaded', function() {
    setupDamageReceivedForm();
});

function setupDamageReceivedForm() {
    const form = document.getElementById('damage-received-form');
    if (!form) return;

    form.innerHTML = `
        <h3>Thông tin người tấn công</h3>
        <label for="attacker-damage">Sát thương người tấn công:</label>
        <input type="number" id="attacker-damage" required min="0" placeholder="Nhập sát thương của người tấn công">
        
        <div>
            <label><input type="checkbox" id="effect-cdd"> CDD</label>
            <label><input type="checkbox" id="effect-true-damage"> True Damage</label>
            <label><input type="checkbox" id="effect-piercing"> Piercing Damage</label>
        </div>
        
        <label for="attack-element">Hệ của đòn tấn công:</label>
        <select id="attack-element" required>
            <option value="">Chọn hệ</option>
            <option value="Force">Force</option>
            <option value="Flame">Flame</option>
            <option value="Aqua">Aqua</option>
            <option value="Gale">Gale</option>
            <option value="Terra">Terra</option>
            <option value="Holy">Holy</option>
            <option value="Shadow">Shadow</option>
        </select>

        <h3>Thông tin người nhận sát thương</h3>
        <h4>1. Giảm sát thương nhận vào cố định</h4>
        
        <label for="own-attack-count">Số lượng đòn tấn công của bản thân:</label>
        <input type="number" id="own-attack-count" min="0" value="0" placeholder="Nhập số lượng đòn tấn công">
        <div id="own-attack-inputs"></div>
        
        <label for="shield-terrain-count">Số lượng vật cản (khiên, fake HP, địa hình):</label>
        <input type="number" id="shield-terrain-count" min="0" value="0" placeholder="Nhập số lượng vật cản">
        <div id="shield-terrain-inputs"></div>
        
        <label for="reduce-def">Def của bản thân:</label>
        <input type="number" id="reduce-def" min="0" value="0" placeholder="Nhập chỉ số def của bản thân">

        <h4>2. Giảm sát thương nhận vào theo tỉ lệ</h4>
        <label for="damage-reduction-count">Số lượng giảm sát thương theo tỉ lệ:</label>
        <input type="number" id="damage-reduction-count" min="0" value="1" placeholder="Nhập số lượng giảm sát thương">
        <div id="damage-reduction-inputs"></div>

        <label for="elemental-affinity">Elemental Affinity:</label>
        <input type="number" id="elemental-affinity" min="1" step="0.01" value="1" placeholder="Nhập hệ số Elemental Affinity (mặc định: 1)">

        <button type="button" onclick="calculateDamageReceived()">Tính toán</button>
    `;

    form.addEventListener('input', calculateDamageReceived);

    document.getElementById('effect-true-damage').addEventListener('change', updateInputStates);
    document.getElementById('effect-piercing').addEventListener('change', updateInputStates);
    document.getElementById('own-attack-count').addEventListener('input', updateOwnAttackInputs);
    document.getElementById('shield-terrain-count').addEventListener('input', updateShieldTerrainInputs);
    document.getElementById('damage-reduction-count').addEventListener('input', updateDamageReductionInputs);

    updateInputStates();
    updateOwnAttackInputs();
    updateShieldTerrainInputs();
    updateDamageReductionInputs();
}

function updateOwnAttackInputs() {
    const count = parseInt(document.getElementById('own-attack-count').value) || 0;
    const container = document.getElementById('own-attack-inputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const label = i === 0 ? 'Sát thương của đòn tấn công:' : `Giảm sát thương bằng đòn tấn công ${i + 1}:`;
        const placeholder = i === 0 ? 'Nhập sát thương của đòn tấn công' : `Nhập giảm sát thương của đòn ${i + 1}`;
        container.innerHTML += `
            <label for="own-attack-${i}">${label}</label>
            <input type="number" id="own-attack-${i}" min="0" class="own-attack-input" placeholder="${placeholder}">
        `;
    }
}

function updateShieldTerrainInputs() {
    const count = parseInt(document.getElementById('shield-terrain-count').value) || 0;
    const container = document.getElementById('shield-terrain-inputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const label = i === 0 ? 'Độ bền vật cản 1:' : `Giảm sát thương bằng vật cản ${i + 1}:`;
        const placeholder = i === 0 ? 'Nhập độ bền của vật cản 1' : `Nhập giảm sát thương của vật cản ${i + 1}`;
        container.innerHTML += `
            <label for="shield-terrain-${i}">${label}</label>
            <input type="number" id="shield-terrain-${i}" min="0" class="shield-terrain-input" placeholder="${placeholder}">
        `;
    }
}

function updateDamageReductionInputs() {
    const count = parseInt(document.getElementById('damage-reduction-count').value) || 0;
    const container = document.getElementById('damage-reduction-inputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <label for="damage-reduction-${i}">Giảm sát thương ${i + 1} (%):</label>
            <input type="number" id="damage-reduction-${i}" min="0" max="100" class="damage-reduction-input" placeholder="Nhập % giảm sát thương (0-100)">
        `;
    }
}

function updateInputStates() {
    const isTrueDamage = document.getElementById('effect-true-damage').checked;
    const isPiercing = document.getElementById('effect-piercing').checked;

    const ownAttackInputs = document.querySelectorAll('.own-attack-input');
    const shieldTerrainInputs = document.querySelectorAll('.shield-terrain-input');
    const reduceDef = document.getElementById('reduce-def');

    ownAttackInputs.forEach(input => {
        input.disabled = isPiercing;
        input.style.backgroundColor = isPiercing ? '#f0f0f0' : '';
    });

    shieldTerrainInputs.forEach(input => {
        input.disabled = isPiercing;
        input.style.backgroundColor = isPiercing ? '#f0f0f0' : '';
    });

    reduceDef.disabled = isPiercing;
    reduceDef.style.backgroundColor = isPiercing ? '#f0f0f0' : '';

    const damageReductionInputs = document.querySelectorAll('.damage-reduction-input');
    damageReductionInputs.forEach(input => {
        input.disabled = isTrueDamage;
        input.style.backgroundColor = isTrueDamage ? '#f0f0f0' : '';
    });

    const elementalAffinityInput = document.getElementById('elemental-affinity');
    elementalAffinityInput.disabled = false;
    elementalAffinityInput.style.backgroundColor = '';
    elementalAffinityInput.min = isTrueDamage ? "1" : "0";
    if (isTrueDamage && parseFloat(elementalAffinityInput.value) < 1) {
        elementalAffinityInput.value = "1";
    }
}

function calculateDamageReceived() {
    const attackerDamage = parseFloat(document.getElementById('attacker-damage').value) || 0;
    const isCDD = document.getElementById('effect-cdd').checked;
    const isTrueDamage = document.getElementById('effect-true-damage').checked;
    const isPiercing = document.getElementById('effect-piercing').checked;
    const attackElement = document.getElementById('attack-element').value;

    const ownAttackInputs = document.querySelectorAll('.own-attack-input');
    const shieldTerrainInputs = document.querySelectorAll('.shield-terrain-input');
    const reduceDef = parseFloat(document.getElementById('reduce-def').value) || 0;

    let totalOwnAttackReduction = 0;
    ownAttackInputs.forEach(input => {
        totalOwnAttackReduction += parseFloat(input.value) || 0;
    });

    let totalShieldTerrainReduction = 0;
    shieldTerrainInputs.forEach(input => {
        totalShieldTerrainReduction += parseFloat(input.value) || 0;
    });

    // A: Giảm sát thương nhận vào theo tỉ lệ (%)
    const damageReductionInputs = document.querySelectorAll('.damage-reduction-input');
    let A = 1;
    damageReductionInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        A *= (1 - value / 100);
    });
    A = 1 - A;  // A = 1 - (1 - value1%)*(1-value2%)*...*(1-valueN%)
    
    // B: Giảm sát thương nhận vào cố định
    let B = totalOwnAttackReduction + totalShieldTerrainReduction + reduceDef;
    
    // C: Elemental Affinity
    let C = parseFloat(document.getElementById('elemental-affinity').value) || 1;

    // Tính toán sát thương cuối cùng
    let finalDamage = attackerDamage;

    if (!isTrueDamage) {
        finalDamage *= (1 - A);
    }

    if (!isPiercing) {
        finalDamage -= B;
    }

    finalDamage = Math.max(0, finalDamage);  // Đảm bảo sát thương không âm
    finalDamage *= C;

    updateInputStates();

    const resultElement = document.getElementById('damage-received-result');
    resultElement.innerHTML = `
        <h3>Kết quả tính sát thương nhận vào:</h3>
        <p>Sát thương ban đầu (Dmg): ${attackerDamage}</p>
        <p>Hệ của đòn tấn công: ${attackElement}</p>
        <p>Hiệu ứng: ${isCDD ? 'CDD, ' : ''}${isTrueDamage ? 'True Damage, ' : ''}${isPiercing ? 'Piercing, ' : ''}</p>
        <h4>Các thông số:</h4>
        <p>A: Giảm sát thương nhận vào theo tỉ lệ = ${(A * 100).toFixed(2)}%</p>
        <p>B: Giảm sát thương nhận vào cố định = ${B} ${isPiercing ? '(Không áp dụng do Piercing)' : ''}</p>
        <p>C: Elemental Affinity = ${C.toFixed(2)}</p>
        <h4>Công thức tính:</h4>
        <p>Final Dmg = (Dmg x (1-A) - B) x C</p>
        <p><strong>Sát thương cuối cùng nhận vào: ${finalDamage.toFixed(2)}</strong></p>
    `;
}