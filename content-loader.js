// content-loader.js
// This script loads content.json, loops through each content item, and injects HTML dynamically into the page.

document.addEventListener("DOMContentLoaded", function () {
  // Path to the content JSON file
  const contentJsonPath = "content.json";

  // Where to inject the content (create a container if it doesn't exist)
  let container = document.getElementById("content-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "content-container";
    document.body.prepend(container);
  }

  // Helper to create vocabulary HTML list
  function createVocabList(vocabArray) {
    if (!Array.isArray(vocabArray) || vocabArray.length === 0) return "";
    let html = '<ul class="vocab-list">';
    vocabArray.forEach(item => {
      html += `<li><strong>${item.word}</strong>: ${item.meaning}</li>`;
    });
    html += "</ul>";
    return html;
  }

  // Fetch and process the content
  fetch(contentJsonPath)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load content.json");
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Invalid content.json format");
      container.innerHTML = ""; // Clear previous content (if any)
      data.forEach(item => {
        const contentDiv = document.createElement("div");
        contentDiv.className = "content-item";
        contentDiv.innerHTML = `
          <h2>${item.title || ""} <span class="level">${item.level || ""}</span></h2>
          <div class="english-text"><strong>English:</strong> ${item.english_text || ""}</div>
          <div class="farsi-translation"><strong>فارسی:</strong> ${item.farsi_translation || ""}</div>
          ${createVocabList(item.vocabulary_list)}
        `;
        container.appendChild(contentDiv);
      });
    })
    .catch(error => {
      container.innerHTML = `<div class="error">Error loading content: ${error.message}</div>`;
    });
});