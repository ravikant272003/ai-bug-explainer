const form = document.getElementById("bugForm");
const input = document.getElementById("bugInput");
const resultBox = document.getElementById("result");

const API_URL = "https://ai-bug-explainer-2vo3.onrender.com";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const errorText = input.value.trim();

  if (!errorText) {
    resultBox.innerText = "Please enter an error!";
    return;
  }

  resultBox.innerText = "Analyzing...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: errorText })
    });

    const data = await res.json();

    if (data.response) {
      resultBox.innerText = data.response;
    } else {
      resultBox.innerText = "No response from AI";
    }

  } catch (err) {
    console.error(err);
    resultBox.innerText = "Something went wrong. Try again!";
  }
});