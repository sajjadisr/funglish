// story-loader.js

document.addEventListener('DOMContentLoaded', function() {
  // Helper: get query param by name
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  // Fetch the story ID from the URL
  const storyId = getQueryParam('id');
  const container = document.getElementById('story-container') || document.body;

  // Utility: show error message
  function showError(msg) {
    container.innerHTML = `<div class="content-item"><strong style="color:red;">${msg}</strong></div>`;
  }

  // Loader
  fetch('stories.json')
    .then(res => res.json())
    .then(stories => {
      if (!storyId) {
        showError('آیدی داستان مشخص نشده است.');
        return;
      }

      const story = stories.find(s => s.id === storyId);

      if (!story) {
        showError('داستان پیدا نشد.');
        return;
      }

      // Render story
      let html = `<div class="content-item">
        <h1 class="story-title">${story.title}</h1>
        <div class="story-paragraph english-text">`;

      story.sentences.forEach(sentence => {
        html += `
          <span class="sentence-container" tabindex="0">
            <span class="english-sentence">${sentence.en}</span>
            <span class="farsi-translation">${sentence.fa}</span>
          </span>
        `;
      });

      html += `</div></div>`;

      container.innerHTML = html;
    })
    .catch(() => {
      showError('خطا در بارگذاری داستان.');
    });
});