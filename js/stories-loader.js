document.addEventListener('DOMContentLoaded', function() {
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  const storyId = getQueryParam('id');
  const container = document.getElementById('story-container');

  function showError(msg) {
    container.innerHTML = `<div class="content-item error"><strong>${msg}</strong></div>`;
  }

  fetch('../stories.json')
    .then(res => {
      if (!res.ok) throw new Error('فایل داستان‌ها یافت نشد.');
      return res.json();
    })
    .then(stories => {
      if (!storyId) {
        // Show list of stories as cards
        let html = '<div class="story-list">';
        stories.forEach(story => {
          html += `
            <div class="story-card">
              <h2>
                <a href="stories.html?id=${encodeURIComponent(story.id)}">${story.title}</a>
                <span class="level">${story.level || ''}</span>
              </h2>
              <p class="story-preview">${story.sentences[0].en}...</p>
            </div>
          `;
        });
        html += '</div>';
        container.innerHTML = html;
        return;
      }

      const story = stories.find(s => s.id === storyId);
      if (!story) {
        showError('داستان پیدا نشد.');
        return;
      }

      // Render story with enhanced layout
      let html = `
        <div class="story-content">
          <h1 class="story-title">${story.title}</h1>
          <div class="story-meta">سطح: <span class="level">${story.level}</span></div>
          <div class="story-paragraph">
      `;

      story.sentences.forEach((sentence, index) => {
        html += `
          <div class="sentence-container" tabindex="0" data-index="${index}">
            <p class="english-sentence">${sentence.en}</p>
            <p class="farsi-translation">${sentence.fa}</p>
          </div>
        `;
      });

      html += `
          </div>
        </div>
        <div class="back-link">
          <a href="stories.html">&larr; بازگشت به فهرست داستان‌ها</a>
        </div>
      `;
      container.innerHTML = html;

      // Add interactivity for sentence containers
      document.querySelectorAll('.sentence-container').forEach(container => {
        const translation = container.querySelector('.farsi-translation');
        translation.style.display = 'none'; // Hide translations by default
        container.addEventListener('click', function() {
          translation.style.display = translation.style.display === 'none' ? 'block' : 'none';
        });
        container.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            translation.style.display = translation.style.display === 'none' ? 'block' : 'none';
          }
        });
      });
    })
    .catch(() => {
      showError('خطا در بارگذاری داستان‌ها.');
    });
});