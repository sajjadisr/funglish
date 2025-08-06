document.addEventListener('DOMContentLoaded', function() {
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  const storyId = getQueryParam('id');
  const container = document.getElementById('story-container');

  function showError(msg) {
    container.innerHTML = `<div class="content-item"><strong style="color:red;">${msg}</strong></div>`;
  }

  fetch('../stories.json')
    .then(res => {
      if (!res.ok) throw new Error('فایل داستان‌ها یافت نشد.');
      return res.json();
    })
    .then(stories => {
      if (!storyId) {
        // Show list of stories as links
        let html = '';
        stories.forEach(story => {
          html += `
            <div class="content-item">
              <h2>
                <a href="stories.html?id=${encodeURIComponent(story.id)}">${story.title}</a>
                <span class="level">${story.level || ''}</span>
              </h2>
            </div>
          `;
        });
        container.innerHTML = html;
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

      html += `</div></div>
      <div style="margin-top:2rem;">
        <a href="stories.html" style="color:#1e3c72;text-decoration:underline;">&larr; بازگشت به فهرست داستان‌ها</a>
      </div>`;
      container.innerHTML = html;
    })
    .catch(() => {
      showError('خطا در بارگذاری داستان‌ها.');
    });
});