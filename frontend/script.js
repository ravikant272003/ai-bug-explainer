async function explainBug() {
  const error = document.getElementById("error").value;
  const resultDiv = document.getElementById("result");
  const loader = document.getElementById("loader");

  resultDiv.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error })
    });

    const data = await res.json();

    loader.classList.add("hidden");

    // Better formatting
    resultDiv.innerHTML = `
      <h3>Explanation:</h3>
      <p>${data.response}</p>
    `;

  } catch (err) {
    loader.classList.add("hidden");
    resultDiv.innerHTML = "❌ Error occurred";
  }
}