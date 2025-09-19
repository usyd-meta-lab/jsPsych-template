(function () {
  const DEFAULT_FOLDER = 'src/trials';

  function loadTrialScript(path) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load trial script: ${path}`));
      document.head.appendChild(script);
    });
  }

  function discoverTrialScripts(folderPath) {
    const normalized = folderPath.replace(/\/$/, '');
    const directoryUrl = `${normalized}/`;

    return fetch(directoryUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to fetch directory listing at ${directoryUrl}`);
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const files = links
          .map((link) => link.getAttribute('href'))
          .filter(Boolean)
          .filter((href) => href.toLowerCase().endsWith('.js'))
          .map((href) => {
            if (/^(?:https?:)?\/?\//.test(href)) {
              return href;
            }
            return `${normalized}/${href.replace(/^\//, '')}`;
          });

        if (!files.length) {
          throw new Error(`No *.js files discovered in ${normalized}`);
        }

        return Array.from(new Set(files));
      });
  }

  function resolveTrialFiles(folderPath) {
    return discoverTrialScripts(folderPath).catch((error) => {
      console.warn('[loadTrials] Automatic discovery failed:', error.message);
      const fallback = typeof window !== 'undefined' && Array.isArray(window.JSPsychTrialFiles)
        ? window.JSPsychTrialFiles
        : [];

      if (!fallback.length) {
        throw new Error('No trial scripts available to load. Provide window.JSPsychTrialFiles as a fallback.');
      }

      return fallback;
    });
  }

  function extractTrialName(filePath) {
    const fileName = filePath.split('/').pop() || '';
    const withoutQuery = fileName.split('?')[0];
    return withoutQuery.replace(/\.js$/i, '');
  }

  function loadTrials(folderPath = DEFAULT_FOLDER) {
    return resolveTrialFiles(folderPath)
      .then((files) => {
        const loaded = {};

        return files.reduce((chain, file) => {
          return chain.then(() => loadTrialScript(file).then(() => {
            const trialName = extractTrialName(file);
            const trialObject = window[trialName];

            if (typeof trialObject === 'undefined') {
              console.warn(`[loadTrials] No global trial object found for "${trialName}" after loading ${file}`);
              return;
            }

            if (loaded[trialName]) {
              console.warn(`[loadTrials] Duplicate trial name "${trialName}". The latest definition overwrites the previous one.`);
            }

            loaded[trialName] = trialObject;
          }));
        }, Promise.resolve()).then(() => loaded);
      });
  }

  window.loadTrials = loadTrials;
})();

