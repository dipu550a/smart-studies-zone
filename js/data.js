  const DB_PREFIX = 'ssz_';

  // Define keys for different data types
  const DATA_KEYS = {
      VIDEO_COURSES: `${DB_PREFIX}video_courses`,
      PDF_COURSES: `${DB_PREFIX}pdf_courses`,
      DEMO_CLASSES: `${DB_PREFIX}demo_classes`,
      FREE_NOTES: `${DB_PREFIX}free_notes`,
      FREE_COURSES: `${DB_PREFIX}free_courses`,
      EBOOKS: `${DB_PREFIX}ebooks`,
      SETTINGS: `${DB_PREFIX}settings`
  };

  const DataManager = {
      /**
       * Loads data from localStorage.
       * @param {string} key - The key to retrieve data from (use keys from DATA_KEYS).
       * @param {any} defaultValue - The default value to return if no data is found.
       * @returns {any} The parsed data or the default value.
       */
      load: (key, defaultValue = []) => {
          const data = localStorage.getItem(key);
          if (data) {
              try {
                  return JSON.parse(data);
              } catch (e) {
                  console.error(`Error parsing JSON for key "${key}":`, e);
                  return defaultValue;
              }
          }
          return defaultValue;
      },

      /**
       * Saves data to localStorage.
       * @param {string} key - The key to save data under (use keys from DATA_KEYS).
       * @param {any} value - The data to save. It will be JSON.stringify-ed.
       */
      save: (key, value) => {
          try {
              localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
              console.error(`Error saving data for key "${key}":`, e);
              // This can happen if localStorage is full.
              if (e.name === 'QuotaExceededError') {
                  alert('Error: Could not save data. The browser storage is full. Please remove some large files (like PDFs) and try again.');
              }
          }
      },

      /**
       * Generates a unique ID.
       * @returns {number} A timestamp-based unique ID.
       */
      generateId: () => {
          return Date.now();
      },

      /**
       * Extracts a YouTube video ID from various URL formats.
       * @param {string} url - The YouTube URL.
       * @returns {string|null} The video ID or null if not found.
       */
      extractYouTubeId: (url) => {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : null;
      }
  };
  ```
