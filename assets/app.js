
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const cfg = window.PAGE || {};

const msg = (s, bad = false) => {
  const e = $('#result');
  if (e) {
    e.textContent = s;
    e.classList.toggle('error', bad);
  }
};

const valid = n => Number.isFinite(n);

const number = id => {
  const e = $(id);
  return e && e.value.trim() !== ''
    ? Number(e.value)
    : NaN;
};

function calculate() {
  const k = cfg.tool;

  if (k === 'percentage') {
    const a = number('#part');
    const b = number('#whole');

    return valid(a) && valid(b) && b !== 0
      ? msg(
          (a / b * 100).toLocaleString(undefined, {
            maximumFractionDigits: 4
          }) + '%'
        )
      : msg(cfg.invalid, true);
  }

  if (k === 'bmi') {
    const w = number('#weight');
    const h = number('#height');

    return w > 0 && w <= 1000 && h > 0 && h <= 300
      ? msg('BMI: ' + (w / (h / 100) ** 2).toFixed(1))
      : msg(cfg.invalid, true);
  }

  if (k === 'age') {
    const s = $('#birth').value;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return msg(cfg.invalid, true);
    }

    const [y, m, d] = s.split('-').map(Number);
    const today = new Date();
    const born = new Date(y, m - 1, d);

    if (
      born.getFullYear() !== y ||
      born.getMonth() !== m - 1 ||
      born.getDate() !== d ||
      born > today
    ) {
      return msg(cfg.invalid, true);
    }

    let yy = today.getFullYear() - y;
    let mm = today.getMonth() + 1 - m;
    let dd = today.getDate() - d;

    if (dd < 0) {
      mm--;
      dd += new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
    }

    if (mm < 0) {
      yy--;
      mm += 12;
    }

    return msg(
      yy + ' ' + cfg.years +
      ' · ' + mm + ' ' + cfg.months +
      ' · ' + dd + ' ' + cfg.days
    );
  }

  if (k === 'gpa') {
    const rows = $$('.rowgrade');
    let sum = 0;
    let total = 0;

    for (const row of rows) {
      const gradeInput = row.querySelector('.grade');
      const creditInput = row.querySelector('.credit');

      const g = Number(gradeInput.value);
      const c = Number(creditInput.value);

      if (
        gradeInput.value === '' ||
        creditInput.value === '' ||
        !valid(g) ||
        !valid(c) ||
        g < 0 ||
        g > 4 ||
        c <= 0 ||
        c > 100
      ) {
        return msg(cfg.invalid, true);
      }

      sum += g * c;
      total += c;
    }

    return total
      ? msg('GPA: ' + (sum / total).toFixed(2))
      : msg(cfg.invalid, true);
  }
}

function countWords() {
  const e = $('#writing');
  if (!e) return;

  const s = e.value;
  const trimmed = s.trim();

  // Bo'sh joylar alohida so'z sifatida sanalmaydi.
  const words = trimmed
    ? trimmed.split(/\s+/u).length
    : 0;

  // Probel, Tab va Enter belgilarini hisoblamaydi.
  const chars = Array.from(s.replace(/\s/gu, '')).length;

  // Taxminiy o'qish vaqti: 200 so'z / daqiqa.
  const minutes = Math.ceil(words / 200);

  msg(
    words + ' ' + cfg.words +
    ' · ' + chars + ' ' + cfg.characters +
    ' · ' + minutes + ' ' + cfg.minutes
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const l = $('#language');

  if (l) {
    l.addEventListener('change', () => {
      const target = location.pathname
        .split('/')
        .filter(Boolean);

      target[0] = l.value;
      location.href = '/' + target.join('/') + '/';
    });
  }

  const c = $('#calc');

  if (c) {
    c.addEventListener('submit', e => {
      e.preventDefault();
      calculate();
    });
  }

  const reset = $('#reset');

  if (reset) {
    reset.addEventListener('click', () => {
      if (c) c.reset();

      if (cfg.tool === 'words' && $('#writing')) {
        $('#writing').value = '';
      }

      if (cfg.tool === 'gpa') {
        $$('#gradeRows .rowgrade')
          .slice(1)
          .forEach(x => x.remove());
      }

      if (cfg.tool === 'words') {
        countWords();
      } else {
        msg(cfg.placeholder);
      }
    });
  }

  const add = $('#addRow');

  if (add) {
    add.addEventListener('click', () => {
      const base = $('#gradeRows .rowgrade');
      const clone = base.cloneNode(true);

      clone.querySelectorAll('input')
        .forEach(x => x.value = '');

      $('#gradeRows').append(clone);
    });
  }

  document.addEventListener('click', e => {
    if (e.target.matches('.remove-row')) {
      const rows = $$('#gradeRows .rowgrade');

      if (rows.length > 1) {
        e.target.closest('.rowgrade').remove();
      }
    }
  });

  const w = $('#writing');

  if (w) {
    w.addEventListener('input', countWords);
    countWords();
  }

  const search = $('#search');

  if (search) {
    search.addEventListener('input', () => {
      $$('[data-search]').forEach(c => {
        c.classList.toggle(
          'hidden',
          !c.dataset.search
            .toLowerCase()
            .includes(search.value.toLowerCase().trim())
        );
      });
    });
  }
});
