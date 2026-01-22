let skiData = [];

const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const results = document.getElementById("results");
console.log("brandSelect:", brandSelect);
console.log("modelSelect:", modelSelect);
console.log("results:", results);

// Load CSV
fetch("data/skis_v1.csv")
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);

    skiData = rows.map(row => {
      const [brand, model, slug, discipline, category, notes] =
        row.split(",").map(v => v.trim());

      return {
        brand: brand.toLowerCase(),
        model,
        slug,
        discipline,
        category,
        notes
      };
    });

    populateBrands();
  });

function populateBrands() {
  const brands = [...new Set(skiData.map(s => s.brand))];

  brands.forEach(brand => {
    const opt = document.createElement("option");
    opt.value = brand;
    opt.textContent = brand;
    brandSelect.appendChild(opt);
  });
}

brandSelect.addEventListener("change", () => {
  modelSelect.innerHTML = `<option value="">Select model</option>`;
  modelSelect.disabled = true;
  results.innerHTML = `<p class="placeholder">Select a brand and model to view details.</p>`;

  if (!brandSelect.value) return;

  const selectedBrand = brandSelect.value.toLowerCase();

  const models = skiData.filter(s => s.brand === selectedBrand);

  models.forEach(ski => {
    const opt = document.createElement("option");
    opt.value = ski.slug;
    opt.textContent = ski.model;
    modelSelect.appendChild(opt);
  });

  modelSelect.disabled = false;
});

modelSelect.addEventListener("change", () => {
  const ski = skiData.find(s => s.slug === modelSelect.value);
  if (!ski) return;

  results.innerHTML = `
    <div class="card">
      <h2>${ski.brand} ${ski.model}</h2>
      <p><strong>Discipline:</strong> ${ski.discipline}</p>
      <p><strong>Category:</strong> ${ski.category}</p>
      <p><strong>Notes:</strong> ${ski.notes}</p>
    </div>
  `;
});
