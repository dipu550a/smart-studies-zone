  document.addEventListener('DOMContentLoaded', () => {

      const contentTypes = [
          { id: 'demo-classes', title: 'Demo Classes', key: DATA_KEYS.DEMO_CLASSES, type: 'video' },
          { id: 'video-courses', title: 'Video Courses', key: DATA_KEYS.VIDEO_COURSES, type: 'video' },
          { id: 'pdf-courses', title: 'PDF Courses', key: DATA_KEYS.PDF_COURSES, type: 'pdf' },
          { id: 'free-courses', title: 'Free Courses', key: DATA_KEYS.FREE_COURSES, type: 'video' },
          { id: 'free-notes', title: 'Free Notes', key: DATA_KEYS.FREE_NOTES, type: 'pdf' },
          { id: 'ebooks', title: 'eBook Download', key: DATA_KEYS.EBOOKS, type: 'pdf' }
      ];
      
      // --- RENDER FUNCTIONS --- //

      /**
       * Renders the list of existing items for a content type.
       */
      const renderList = (key, containerId, type) => {
          const container = document.getElementById(containerId);
          const items = DataManager.load(key);
          container.innerHTML = '';
          if (items.length === 0) {
              container.innerHTML = '<p class="text-muted">No items yet.</p>';
              return;
          }
          items.forEach(item => {
              const itemEl = document.createElement('div');
              itemEl.className = 'list-group-item';
              itemEl.innerHTML = `
                  <span>${item.title}</span>
                  <button class="btn btn-sm btn-danger" data-id="${item.id}" data-key="${key}">×</button>
              `;
              container.appendChild(itemEl);
          });
      };

      /**
       * Generates the HTML for admin forms and lists and injects it into the page.
       */
      const buildAdminUI = () => {
          const container = document.getElementById('content-management-sections');
          contentTypes.forEach(ct => {
              let formContent = `
                  <div class="mb-3">
                      <label for="title-${ct.id}" class="form-label">Title</label>
                      <input type="text" class="form-control" id="title-${ct.id}" required>
                  </div>
              `;
              if (ct.type === 'video') {
                  formContent += `
                  <div class="mb-3">
                      <label for="url-${ct.id}" class="form-label">YouTube Video URL</label>
                      <input type="url" class="form-control" id="url-${ct.id}" placeholder="e.g., https://www.youtube.com/watch?v=..." required>
                  </div>
                  `;
              } else { // pdf
                  formContent += `
                  <div class="mb-3">
                      <label for="file-${ct.id}" class="form-label">Upload PDF File</label>
                      <input type="file" class="form-control" id="file-${ct.id}" accept=".pdf" required>
                      <div class="form-text">Note: Large files may fail due to browser storage limits (5-10MB).</div>
                  </div>
                  `;
              }
              formContent += `<button type="submit" class="btn btn-primary">Add ${ct.title}</button>`;

              container.innerHTML += createAccordionItem(ct.id, ct.title, formContent, `list-${ct.id}`);
          });
      };

      // --- EVENT HANDLERS --- //
      
      /**
       * Handles form submissions for adding new content.
       */
      const handleAdd = (event, key, type) => {
          event.preventDefault();
          const form = event.target;
          const title = form.querySelector('input[type="text"]').value;
          
          if (!title) {
              alert('Title is required.');
              return;
          }

          const newItem = { id: DataManager.generateId(), title };
          const items = DataManager.load(key);
          
          if (type === 'video') {
              const url = form.querySelector('input[type="url"]').value;
              const videoId = DataManager.extractYouTubeId(url);
              if (!videoId) {
                  alert('Invalid YouTube URL. Please use a valid video URL.');
                  return;
              }
              newItem.videoId = videoId;
              items.push(newItem);
              DataManager.save(key, items);
              renderList(key, form.parentElement.nextElementSibling.id, type);
              form.reset();
          } else { // pdf
              const fileInput = form.querySelector('input[type="file"]');
              const file = fileInput.files[0];
              if (!file) {
                  alert('Please select a PDF file.');
                  return;
              }

              const reader = new FileReader();
              reader.onload = (e) => {
                  newItem.url = e.target.result; // Base64 Data URL
                  items.push(newItem);
                  DataManager.save(key, items);
                  renderList(key, form.parentElement.nextElementSibling.id, type);
                  form.reset();
              };
              reader.onerror = () => {
                  alert('Error reading file.');
              };
              reader.readAsDataURL(file);
          }
      };

      /**
       * Handles the deletion of an item. Uses event delegation.
       */
      const handleDelete = (event) => {
          if (!event.target.matches('.btn-danger')) return;

          if (!confirm('Are you sure you want to delete this item?')) return;

          const button = event.target;
          const id = Number(button.dataset.id);
          const key = button.dataset.key;

          let items = DataManager.load(key);
          items = items.filter(item => item.id !== id);
          DataManager.save(key, items);
          
          // Re-render the list for the specific content type
          const listContainer = button.closest('.list-group');
          const contentType = contentTypes.find(ct => ct.key === key);
          if(listContainer && contentType) {
              renderList(key, listContainer.id, contentType.type);
          }
      };

      /**
       * Handles saving the app settings.
       */
      const handleSaveSettings = (event) => {
          event.preventDefault();
          const adsCount = document.getElementById('ads-count').value;
          const settings = {
              ads: parseInt(adsCount, 10) || 0
          };
          DataManager.save(DATA_KEYS.SETTINGS, settings);
          alert('Settings saved successfully!');
      };
      

      // --- INITIALIZATION --- //

      // Build the dynamic part of the admin UI
      buildAdminUI();

      // Load initial settings
      const settings = DataManager.load(DATA_KEYS.SETTINGS, { ads: 0 });
      document.getElementById('ads-count').value = settings.ads;
      
      // Attach event listeners and render initial lists
      contentTypes.forEach(ct => {
          const form = document.getElementById(`form-${ct.id}`);
          form.addEventListener('submit', (e) => handleAdd(e, ct.key, ct.type));
          renderList(ct.key, `list-${ct.id}`, ct.type);
      });

      // Add single listener for all delete buttons (event delegation)
      document.querySelector('#adminAccordion').addEventListener('click', handleDelete);
      
      // Settings form listener
      document.getElementById('settings-form').addEventListener('submit', handleSaveSettings);
  });

  // This is a helper function declared in admin.html's <script> tag to be globally available
  // before the admin.js script runs. It's used by buildAdminUI.
  /*
  function createAccordionItem(id, title, formContent, listContainerId) {
      return `...html content...`;
  }
  */
  ```
