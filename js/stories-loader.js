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

  function isRead(id) {
    try { return window.Auth && typeof Auth.isStoryRead === 'function' ? Auth.isStoryRead(id) : false; } catch (_) { return false; }
  }

  function renderList(stories) {
    let html = '<div class="story-list">';
    stories.forEach(story => {
      const read = isRead(story.id);
      html += `
        <div class="story-card${read ? ' read' : ''}">
          <h2>
            <a href="stories.html?id=${encodeURIComponent(story.id)}">${story.title}</a>
            <span class="level">${story.level || ''}</span>
            ${read ? '<span class="badge-read" aria-label="خوانده شده">خوانده شده</span>' : ''}
          </h2>
          <p class="story-preview">${story.sentences[0].en}...</p>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  fetch('../stories.json')
    .then(res => {
      if (!res.ok) throw new Error('فایل داستان‌ها یافت نشد.');
      return res.json();
    })
    .then(stories => {
      if (!storyId) {
        renderList(stories);
        if (window.Auth && typeof Auth.onChange === 'function') {
          Auth.onChange(() => renderList(stories));
        }
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
          <h1 class="story-title">${story.title} <span class="level">${story.level}</span></h1>
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

      // Mark as read in account/guest
      if (window.Auth && typeof Auth.markStoryRead === 'function') {
        Auth.markStoryRead(storyId);
      }
      // Show read badge near title
      const titleEl = document.querySelector('.story-title');
      if (titleEl) {
        const badge = document.createElement('span');
        badge.className = 'badge-read';
        badge.textContent = 'خوانده شده';
        titleEl.appendChild(document.createTextNode(' '));
        titleEl.appendChild(badge);
      }

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