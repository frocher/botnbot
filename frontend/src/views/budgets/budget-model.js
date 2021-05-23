const categoryKeys = {
  lightouse: 0,
  performance: 1,
  requests: 2,
  bytes: 3,
  carbon: 4,
};

const lighthouseKeys = {
  pwa: 0,
  performance: 1,
  accessibility: 2,
  bestPractices: 3,
  seo: 4,
  mean: 5,
};

const performanceKeys = {
  firstByte: 0,
  firstPaint: 1,
  speedIndex: 2,
  interactive: 3,
};

const requestsKeys = {
  html: 0,
  css: 1,
  js: 2,
  image: 3,
  font: 4,
  other: 5,
  total: 6,
};

const bytesKeys = {
  html: 0,
  css: 1,
  js: 2,
  image: 3,
  font: 4,
  other: 5,
  total: 6,
};

const carbonKeys = {
  ecoIndex: 0,
};

const categories = [
  {
    key: categoryKeys.lightouse,
    label: 'Lighthouse',
    entries: [
      {
        key: lighthouseKeys.pwa, name: 'pwa', color: '#4A148C', label: 'PWA', index: 0,
      },
      {
        key: lighthouseKeys.performance, name: 'performance', color: '#7B1FA2', label: 'Performance', index: 1,
      },
      {
        key: lighthouseKeys.accessibility, name: 'accessibility', color: '#9C27B0', label: 'Accessibility', index: 2,
      },
      {
        key: lighthouseKeys.bestPractices, name: 'best_practices', color: '#BA68C8', label: 'Best practices', index: 3,
      },
      {
        key: lighthouseKeys.seo, name: 'seo', color: '#E1BEE7', label: 'SEO', index: 4,
      },
      {
        key: lighthouseKeys.mean, name: 'mean', color: '#D500F9', label: 'Mean', index: -1,
      },
    ],
  },
  {
    key: categoryKeys.performance,
    label: 'Performance',
    entries: [
      {
        key: performanceKeys.firstByte, name: 'first_byte', color: '#E65100', label: 'first byte', suffix: 'ms', index: 0,
      },
      {
        key: performanceKeys.firstPaint, name: 'first_paint', color: '#F57C00', label: 'first paint', suffix: 'ms', index: 1,
      },
      {
        key: performanceKeys.speedIndex, name: 'speed_index', color: '#FF9800', label: 'speed index', index: 2,
      },
      {
        key: performanceKeys.interactive, name: 'interactive', color: '#FFB74D', label: 'interactive', suffix: 'ms', index: 3,
      },
    ],
  },
  {
    key: categoryKeys.requests,
    label: 'Requests',
    entries: [
      {
        key: requestsKeys.html, name: 'html', color: '#01579B', label: 'html', index: 0,
      },
      {
        key: requestsKeys.css, name: 'css', color: '#0288D1', label: 'css', index: 1,
      },
      {
        key: requestsKeys.js, name: 'js', color: '#03A9F4', label: 'javascript', index: 2,
      },
      {
        key: requestsKeys.image, name: 'image', color: '#4FC3F7', label: 'image', index: 3,
      },
      {
        key: requestsKeys.font, name: 'font', color: '#81D4FA', label: 'font', index: 4,
      },
      {
        key: requestsKeys.other, name: 'other', color: '#B3E5FC', label: 'other', index: 5,
      },
      {
        key: requestsKeys.total, name: 'total', color: '#00B0FF', label: 'Total', index: -1,
      },
    ],
  },
  {
    key: categoryKeys.bytes,
    label: 'Bytes',
    entries: [
      {
        key: bytesKeys.html, name: 'html', color: '#880E4F', label: 'html', suffix: 'KiB', index: 0,
      },
      {
        key: bytesKeys.css, name: 'css', color: '#C2185B', label: 'css', suffix: 'KiB', index: 1,
      },
      {
        key: bytesKeys.js, name: 'js', color: '#D81B60', label: 'javascript', suffix: 'KiB', index: 2,
      },
      {
        key: bytesKeys.image, name: 'image', color: '#EC407A', label: 'image', suffix: 'KiB', index: 3,
      },
      {
        key: bytesKeys.font, name: 'font', color: '#F48FB1', label: 'font', suffix: 'KiB', index: 4,
      },
      {
        key: bytesKeys.other, name: 'other', color: '#F8BBD0', label: 'other', suffix: 'KiB', index: 5,
      },
      {
        key: bytesKeys.total, name: 'total', color: '#FF80AB', label: 'total', index: -1,
      },
    ],
  },
  {
    key: categoryKeys.carbon,
    label: 'Carbon',
    entries: [
      {
        key: carbonKeys.ecoIndex, name: 'ecoindex_adjusted', color: '#00C853', label: 'ecoIndex', index: 5,
      },
    ],
  },
];

function getCategory(categoryKey) {
  return categories.find((item) => item.key === categoryKey);
}

function getEntry(category, entryKey) {
  return category.entries.find((item) => item.key === entryKey);
}

function getBudgetName(categoryKey, entryKey) {
  const category = getCategory(categoryKey);
  if (category) {
    const entry = category.entries.find((item) => item.key === entryKey);
    if (entry) {
      return `${category.label}/${entry.label}`;
    }
  }
  return null;
}

export {
  categoryKeys,
  lighthouseKeys,
  performanceKeys,
  requestsKeys,
  bytesKeys,
  carbonKeys,
  categories,
  getBudgetName,
  getCategory,
  getEntry,
};
