async function loadSkis() {
  const response = await fetch('/data/skis_v1.csv');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim();
    });
    return obj;
  });

  return rows;
}

function populateFilters(data) {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');

  const brands = [...new Set(data.map(s => s.brand))];

  brands.forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    brandSelect.appendChild(opt);
  });

  brandSelect.addEventListener('change', () => {
    modelSelect.innerHTML = '<option value="">Select model</option>';

    const models = data
      .filter(s => s.brand === brandSelect.value)
      .map(s => s.model);

    [...new Set(models)].forEach(model => {
      const opt = document.createElement('option');
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const skis = await loadSkis();
  populateFilters(skis);
});
