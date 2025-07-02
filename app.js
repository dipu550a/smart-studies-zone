  document.addEventListener('DOMContentLoaded', () => {
      // --- RENDER FUNCTIONS --- //

      const renderContent = (containerId, items, type) => {
          const container = document.getElementById(containerId);
          if (!container) return;

          container.innerHTML = ''; // Clear existing content

          if (!items || items.length === 0) {
              container.innerHTML = '<p class="text-muted">No content available yet.</p>';
              // Hide the parent section if there is no content
              const section = container.closest('section');
              if(section) section.style.display = 'none';
              return;
          }
          
          // Show the parent section
          const section = container.closest('section');
          if(section) section.style.display = 'block';

          items.forEach(item => {
              let cardHtml = '';
              if (type === 'video') {
                  const embedUrl = `https://www.youtube.com/embed/${item.videoId}`;
                  cardHtml = `
                      <div class="col-md-4 col-sm-6">
                          <div class="card h-100 text-center">
                              <div class="card-body">
                                  <i class="fas fa-play-circle card-icon mb-2"></i>
                                  <h5 class="card-title">${item.title}</h5>
                                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#videoPlayerModal" data-video-url="${embedUrl}" data-video-title="${item.title}">
                                      Watch Video
                                  </button>
                              </div>
                          </div>
                      </div>`;
              } else if (type === 'pdf') {
                  cardHtml = `
                      <div class="col-md-4 col-sm-6">
                          <div class="card h-100 text-center">
                              <div class="card-body">
                                  <i class="fas fa-file-pdf card-icon mb-2"></i>
                                  <h5 class="card-title">${item.title}</h5>
                                  <a href="${item.url}" target="_blank" class="btn btn-primary">View PDF</a>
                              </div>
                          </div>
                      </div>`;
              }
              container.innerHTML += cardHtml;
          });
      };

      const renderAds = () => {
          const settings = DataManager.load(DATA_KEYS.SETTINGS, { ads: 0 });
          const adContainer = document.getElementById('ad-container');
          if (!adContainer || !settings.ads || settings.ads <= 0) return;

          adContainer.innerHTML = ''; // Clear previous ads
          for (let i = 0; i < settings.ads; i++) {
              const adPlaceholder = document.createElement('div');
              adPlaceholder.className = 'ad-placeholder';
              adPlaceholder.innerHTML = `<i class="fas fa-ad me-2"></i> Advertisement Placeholder ${i + 1}`;
              adContainer.appendChild(adPlaceholder);
          }
      };
      
      // --- LOAD AND DISPLAY ALL CONTENT --- //
      const loadAllContent = () => {
          // Load data
          const demoClasses = DataManager.load(DATA_KEYS.DEMO_CLASSES);
          const videoCourses = DataManager.load(DATA_KEYS.VIDEO_COURSES);
          const pdfCourses = DataManager.load(DATA_KEYS.PDF_COURSES);
          const freeCourses = DataManager.load(DATA_KEYS.FREE_COURSES);
          const freeNotes = DataManager.load(DATA_KEYS.FREE_NOTES);
          const ebooks = DataManager.load(DATA_KEYS.EBOOKS);

          // Render content
          renderContent('demo-classes-list', demoClasses, 'video');
          renderContent('video-courses-list', videoCourses, 'video');
          renderContent('pdf-courses-list', pdfCourses, 'pdf');
          renderContent('free-courses-list', freeCourses, 'video');
          renderContent('free-notes-list', freeNotes, 'pdf');
          renderContent('ebooks-list', ebooks, 'pdf');

          // Render ads
          renderAds();
      };


      // --- EVENT LISTENERS --- //

      // Video Player Modal
      const videoPlayerModal = document.getElementById('videoPlayerModal');
      if (videoPlayerModal) {
          const videoIframe = document.getElementById('video-iframe');
          const modalTitle = document.getElementById('videoPlayerModalLabel');

          videoPlayerModal.addEventListener('show.bs.modal', event => {
              const button = event.relatedTarget;
              const videoUrl = button.getAttribute('data-video-url');
              const videoTitle = button.getAttribute('data-video-title');
              
              modalTitle.textContent = videoTitle;
              videoIframe.setAttribute('src', videoUrl + "?autoplay=1"); // Autoplay when modal opens
          });

          videoPlayerModal.addEventListener('hide.bs.modal', () => {
              // Stop video playback when modal is closed
              videoIframe.setAttribute('src', '');
          });
      }

      // Footer actions
      document.getElementById('share-app')?.addEventListener('click', (e) => {
          e.preventDefault();
          if(navigator.share) {
              navigator.share({
                  title: 'Smart Studies Zone',
                  text: 'Check out this amazing learning platform!',
                  url: window.location.href
              }).catch(console.error);
          } else {
              alert('Share feature is not supported on your browser. Please copy the URL manually.');
          }
      });

      document.getElementById('rate-us')?.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Thank you for using our app! Please rate us on the app store.');
      });

      document.getElementById('feedback')?.addEventListener('click', (e) => {
          e.preventDefault();
          const email = 'feedback@example.com';
          window.location.href = `mailto:${email}?subject=Feedback for Smart Studies Zone`;
      });

      document.getElementById('more-apps')?.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Coming soon: More apps from our development team!');
      });


      // --- INITIALIZATION --- //
      loadAllContent();
  });
  ```
