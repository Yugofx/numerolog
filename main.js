const matrixLabels = {
  temperament: 'Темперамент',
  character: 'Характер',
  health: 'Здоровье',
  luck: 'Удача',
  goal: 'Цель',
  energy: 'Энергия',
  logic: 'Логика',
  duty: 'Долг',
  family: 'Семья',
  interest: 'Интерес',
  work: 'Труд',
  memory: 'Память',
  habits: 'Привычки',
  life: 'Быт',
};

let currentMatrix = null;

function sumDigits(num) {
  return String(num)
    .split('')
    .reduce((sum, d) => sum + parseInt(d), 0);
}

function reduceToSingleDigit(num, keepMaster = false) {
  while (num > 9) {
    if (keepMaster && (num === 11 || num === 22 || num === 33)) return num;
    num = sumDigits(num);
  }
  return num;
}

function countDigit(str, digit) {
  return (str.match(new RegExp(digit, 'g')) || []).length;
}

function repeatDigit(digit, count) {
  return count > 0 ? digit.toString().repeat(count) : '—';
}

function calculateMatrix(day, month, year) {
  const dateStr = String(day) + String(month) + String(year);

  // First additional number - sum of all digits
  const first = sumDigits(dateStr);

  // Second additional number - reduce first to single digit
  const second = reduceToSingleDigit(first);

  // Third additional number - first minus (2 * first digit of date)
  const firstDigit = parseInt(String(day)[0]);
  const third = Math.abs(first - 2 * firstDigit);

  // Fourth additional number - reduce third
  const fourth = reduceToSingleDigit(third);

  // All digits for counting
  const allDigits =
    dateStr + String(first) + String(second) + String(third) + String(fourth);

  // Count occurrences of each digit (1-9)
  const counts = {};
  for (let i = 1; i <= 9; i++) {
    counts[i] = countDigit(allDigits, String(i));
  }

  // Calculate destiny number
  const destiny = reduceToSingleDigit(first, true);

  // Character (1s)
  const character = repeatDigit(1, counts[1]);

  // Energy (2s)
  const energy = repeatDigit(2, counts[2]);

  // Interest (3s)
  const interest = repeatDigit(3, counts[3]);

  // Health (4s)
  const health = repeatDigit(4, counts[4]);

  // Logic (5s)
  const logic = repeatDigit(5, counts[5]);

  // Work (6s)
  const work = repeatDigit(6, counts[6]);

  // Luck (7s)
  const luck = repeatDigit(7, counts[7]);

  // Duty (8s)
  const duty = repeatDigit(8, counts[8]);

  // Memory (9s)
  const memory = repeatDigit(9, counts[9]);

  // Goal - based on calculation
  const goal = counts[1] + counts[4] + counts[7] || '—';

  // Temperament - sum of diagonal numbers (3, 5, 7)
  const temperament = counts[3] + counts[5] + counts[7] || '—';

  // Habits - sum of 3rd row (3, 6, 9)
  const habits = counts[3] + counts[6] + counts[9] || '—';

  // Life/Everyday
  const life = counts[4] + counts[5] + counts[6] || '—';

  // Family - sum of 2nd column (2, 5, 8)
  const family = counts[2] + counts[5] + counts[8] || '—';

  return {
    additional: [first, second, third, fourth],
    destiny: destiny,
    temperament: temperament,
    character: character,
    health: health,
    luck: luck,
    goal: goal,
    energy: energy,
    logic: logic,
    duty: duty,
    family: family,
    interest: interest,
    work: work,
    memory: memory,
    habits: habits,
    life: life,
  };
}

function generateMatrixGrid(matrix) {
  const grid = document.getElementById('matrixGrid');

  // Grid layout 5x4 as specified
  const layout = [
    [null, null, null, { key: 'temperament', value: matrix.temperament }],
    [
      { key: 'character', value: matrix.character },
      { key: 'health', value: matrix.health },
      { key: 'luck', value: matrix.luck },
      { key: 'goal', value: matrix.goal },
    ],
    [
      { key: 'energy', value: matrix.energy },
      { key: 'logic', value: matrix.logic },
      { key: 'duty', value: matrix.duty },
      { key: 'family', value: matrix.family },
    ],
    [
      { key: 'interest', value: matrix.interest },
      { key: 'work', value: matrix.work },
      { key: 'memory', value: matrix.memory },
      { key: 'habits', value: matrix.habits },
    ],
    [null, { key: 'life', value: matrix.life }, null, null],
  ];

  let html = '';
  layout.forEach(row => {
    row.forEach(cell => {
      if (cell === null) {
        html += '<div class="matrix-cell empty"></div>';
      } else {
        const isEmpty = cell.value === '—';
        html += `
            <div class="matrix-cell">
                <span class="matrix-label">${matrixLabels[cell.key]}</span>
                <span class="matrix-value ${isEmpty ? 'no-value' : ''}">${cell.value}</span>
            </div>
        `;
      }
    });
  });

  grid.innerHTML = html;
}

function generateCopyText(matrix) {
  // Collect numbers top-to-bottom, rows 1-3, columns 0-2
  // Row 1: character, health, luck
  // Row 2: energy, logic, duty
  // Row 3: interest, work, memory
  const values = [
    matrix.character,
    matrix.energy,
    matrix.interest,
    matrix.health,
    matrix.logic,
    matrix.work,
    matrix.luck,
    matrix.duty,
    matrix.memory,
    matrix.destiny,
  ];

  return values.join('/');
}

// Input handling
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const inputs = [dayInput, monthInput, yearInput];
const errorMessage = document.getElementById('errorMessage');

inputs.forEach((input, index) => {
  input.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    e.target.classList.remove('error');
    errorMessage.classList.remove('show');

    if (index < 2 && e.target.value.length === 2) {
      inputs[index + 1].focus();
    }
    if (index === 2 && e.target.value.length === 4) {
      e.target.blur();
    }
  });
});

// Form submission
document.getElementById('numerologyForm').addEventListener('submit', e => {
  e.preventDefault();

  const day = dayInput.value.trim();
  const month = monthInput.value.trim();
  const year = yearInput.value.trim();

  let hasError = false;
  let errorText = '';

  // Validation
  if (!day) {
    dayInput.classList.add('error');
    hasError = true;
  }
  if (!month) {
    monthInput.classList.add('error');
    hasError = true;
  }
  if (!year) {
    yearInput.classList.add('error');
    hasError = true;
  }

  if (hasError) {
    errorText = 'Пожалуйста, заполните все поля';
    errorMessage.textContent = errorText;
    errorMessage.classList.add('show');
    return;
  }

  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  if (dayNum < 1 || dayNum > 31) {
    dayInput.classList.add('error');
    errorText = 'Укажите корректный день (1-31)';
    hasError = true;
  } else if (monthNum < 1 || monthNum > 12) {
    monthInput.classList.add('error');
    errorText = 'Укажите корректный месяц (1-12)';
    hasError = true;
  } else if (yearNum < 1900 || yearNum > 2100) {
    yearInput.classList.add('error');
    errorText = 'Укажите корректный год (1900-2100)';
    hasError = true;
  }

  if (hasError) {
    errorMessage.textContent = errorText;
    errorMessage.classList.add('show');
    return;
  }

  // Calculate matrix
  currentMatrix = calculateMatrix(dayNum, monthNum, yearNum);

  document.getElementById('destinyNumber').textContent = currentMatrix.destiny;
  document.getElementById('additionalNumbers').textContent =
    currentMatrix.additional.join(', ');

  generateMatrixGrid(currentMatrix);

  const resultDiv = document.getElementById('result');
  resultDiv.classList.remove('show');
  void resultDiv.offsetWidth;
  resultDiv.classList.add('show');

  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Copy button
document.getElementById('copyBtn').addEventListener('click', async () => {
  if (!currentMatrix) return;

  const copyText = generateCopyText(currentMatrix);
  const btn = document.getElementById('copyBtn');
  const btnText = document.getElementById('copyText');

  try {
    await navigator.clipboard.writeText(copyText);
    btn.classList.add('copied');
    btnText.textContent = 'Скопировано!';

    setTimeout(() => {
      btn.classList.remove('copied');
      btnText.textContent = 'Скопировать матрицу';
    }, 2000);
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    btn.classList.add('copied');
    btnText.textContent = 'Скопировано!';

    setTimeout(() => {
      btn.classList.remove('copied');
      btnText.textContent = 'Скопировать матрицу';
    }, 2000);
  }
});
