document.getElementById("btn").addEventListener("click", async () => {
  const r = await fetch("/api/hello");
  const data = await r.json();
  document.getElementById("out").textContent = JSON.stringify(data, null, 2);
});
