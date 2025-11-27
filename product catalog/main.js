const btn = document.querySelector(".search button");
const search = document.querySelector(".search input");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

let products = [];

fetch("./data.json")
  .then(res => res.json())
  .then(data => {
    products = data.products;
    show(products);
  });

function show(list) {
  const container = document.querySelector(".catalog");
  container.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} <i class='bx bx-bitcoin'></i></p>`;
    container.appendChild(div);
  });
}
btn.addEventListener("click", filterProducts);
search.addEventListener("keypress", e => {
  if(e.key==="Enter") btn.click(); });
  
checkboxes.forEach(cb => 
  cb.addEventListener("change", filterProducts));

function filterProducts() {
  let filtered = [];

  const check = Array.from(checkboxes).some(cb => cb.checked);

  if (!check) {
    filtered = [...products];
  } else {
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const selected = cb.value.toLowerCase();
        if (selected === "best seller") filtered = filtered.concat(products.filter(p => p.bestSeller));
        else if (selected === "fashion") filtered = filtered.concat(products.filter(p => p.category === "fashion"));
        else if (selected === "jewelery") filtered = filtered.concat(products.filter(p => p.category === "jewelery"));
        else if (selected === "electronics") filtered = filtered.concat(products.filter(p => p.category === "electronics"));
      }});

    filtered = Array.from(new Map(filtered.map(p => [p.id, p])).values());
  }
  const text = search.value.toLowerCase();
  if (text) filtered = filtered.filter(p => p.name.toLowerCase().includes(text));

  show(filtered);
}
const dark = document.getElementById('dark');
dark.onclick = () => {
  document.body.classList.toggle('dark');
  dark.classList.toggle('bx-sun');
};