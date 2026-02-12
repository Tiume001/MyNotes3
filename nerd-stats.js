// Nerd Stats - Technical Statistics Dashboard
// Fetches and displays real-time system and network information

// Fetch IP Address from external API
async function fetchIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    document.getElementById('ipAddress').textContent = data.ip;
  } catch (error) {
    console.error('Failed to fetch IP:', error);
    document.getElementById('ipAddress').textContent = 'Unavailable';
  }
}

// Get Network Information using Navigator API
function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection) {
    // Get connection type (wifi, cellular, ethernet, etc.)
    let connectionType = 'Unknown';

    if (connection.type) {
      // Map connection types to readable names
      const typeMap = {
        'wifi': 'WiFi',
        'cellular': 'Mobile Data',
        'ethernet': 'Ethernet',
        'bluetooth': 'Bluetooth',
        'wimax': 'WiMAX',
        'none': 'Offline',
        'unknown': 'Unknown'
      };
      connectionType = typeMap[connection.type] || connection.type;
    } else if (connection.effectiveType) {
      // Fallback to effective type with better labels
      const effectiveType = connection.effectiveType;
      const typeMap = {
        'slow-2g': 'Mobile (2G Slow)',
        '2g': 'Mobile (2G)',
        '3g': 'Mobile (3G)',
        '4g': 'Mobile (4G/LTE)'
      };
      connectionType = typeMap[effectiveType] || effectiveType;
    }

    document.getElementById('connectionType').textContent = connectionType;

    // Update on connection change
    connection.addEventListener('change', () => {
      let newType = 'Unknown';

      if (connection.type) {
        const typeMap = {
          'wifi': 'WiFi',
          'cellular': 'Mobile Data',
          'ethernet': 'Ethernet',
          'bluetooth': 'Bluetooth',
          'wimax': 'WiMAX',
          'none': 'Offline',
          'unknown': 'Unknown'
        };
        newType = typeMap[connection.type] || connection.type;
      } else if (connection.effectiveType) {
        const effectiveType = connection.effectiveType;
        const typeMap = {
          'slow-2g': 'Mobile (2G Slow)',
          '2g': 'Mobile (2G)',
          '3g': 'Mobile (3G)',
          '4g': 'Mobile (4G/LTE)'
        };
        newType = typeMap[effectiveType] || effectiveType;
      }

      document.getElementById('connectionType').textContent = newType;
    });
  } else {
    // Fallback: detect connection type from user agent or online status
    if (navigator.onLine) {
      // Try to guess from user agent
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        document.getElementById('connectionType').textContent = 'Online (Mobile)';
      } else {
        document.getElementById('connectionType').textContent = 'Online';
      }
    } else {
      document.getElementById('connectionType').textContent = 'Offline';
    }
  }
}

// Get Browser Information from user agent
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';

  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
  } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
    browserName = 'Chrome';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browserName = 'Safari';
  } else if (ua.indexOf('Edg') > -1) {
    browserName = 'Edge';
  } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
    browserName = 'Opera';
  }

  document.getElementById('browserInfo').textContent = browserName;
}

// Get Screen Resolution from window.screen
function getScreenResolution() {
  const width = window.screen.width;
  const height = window.screen.height;
  document.getElementById('screenRes').textContent = `${width} x ${height}`;
}

// Get Device Memory from navigator.deviceMemory
function getDeviceMemory() {
  const memory = navigator.deviceMemory;
  document.getElementById('deviceMemory').textContent = memory ? `${memory} GB` : 'N/A';
}

// Get CPU Cores from navigator.hardwareConcurrency
function getCPUCores() {
  const cores = navigator.hardwareConcurrency;
  document.getElementById('cpuCores').textContent = cores || 'N/A';
}

// Get Battery Status using Battery API
async function getBatteryStatus() {
  const levelEl = document.getElementById('batteryLevel');
  const statusEl = document.getElementById('batteryStatus');
  const barEl = document.getElementById('batteryBar');

  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      updateBatteryUI(battery);

      // Add event listeners for battery changes
      battery.addEventListener('levelchange', () => updateBatteryUI(battery));
      battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
    } catch (error) {
      console.error('Battery API error:', error);
      setBatteryUnavailable(levelEl, statusEl, barEl, 'Errore API');
    }
  } else {
    // Battery API not supported (Safari, Firefox)
    // Try to detect if it's a laptop/mobile based on screen/touch
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hint = (isMobile || hasTouch) ? 'Dispositivo con batteria rilevato' : 'Dispositivo desktop';
    setBatteryUnavailable(levelEl, statusEl, barEl, `Non supportato (${hint})`);
  }
}

// Set battery UI to unavailable state
function setBatteryUnavailable(levelEl, statusEl, barEl, message) {
  if (levelEl) levelEl.textContent = 'N/A';
  if (statusEl) statusEl.textContent = message;
  if (barEl) {
    barEl.style.width = '100%';
    barEl.style.opacity = '0.15';
  }
}

// Update Battery UI with current battery information
function updateBatteryUI(battery) {
  const level = Math.round(battery.level * 100);
  const levelEl = document.getElementById('batteryLevel');
  const barEl = document.getElementById('batteryBar');
  const statusEl = document.getElementById('batteryStatus');

  if (levelEl) levelEl.textContent = `${level}%`;
  if (barEl) {
    barEl.style.width = `${level}%`;
    barEl.style.opacity = '1';
    // Color the bar based on level
    if (level <= 15) {
      barEl.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
    } else if (level <= 30) {
      barEl.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
    } else {
      barEl.style.background = '';
    }
  }
  if (statusEl) {
    const chargingIcon = battery.charging ? '⚡' : '🔋';
    statusEl.textContent = battery.charging ? `${chargingIcon} In carica` : `${chargingIcon} In uso`;
  }
}

// Get Location with user permission
document.getElementById('getLocationBtn')?.addEventListener('click', async () => {
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Fetch city name from coordinates using reverse geocoding API
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=it`);
      const data = await response.json();

      document.getElementById('location').textContent = `${data.city}, ${data.countryName}`;
    } catch (error) {
      console.error('Geolocation error:', error);
      document.getElementById('location').textContent = 'Permission Denied';
    }
  } else {
    document.getElementById('location').textContent = 'Not Supported';
  }
});

// Test Download Speed
document.getElementById('testSpeedBtn')?.addEventListener('click', async () => {
  const speedElement = document.getElementById('downlinkSpeed');
  const button = document.getElementById('testSpeedBtn');

  // Disable button and show testing state
  button.disabled = true;
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing...';
  speedElement.textContent = 'Testing...';

  try {
    // Use multiple small requests to test speed more accurately
    const testUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const iterations = 3;
    let totalBytes = 0;
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      const response = await fetch(testUrl + '?t=' + Date.now(), {
        cache: 'no-store',
        mode: 'no-cors'
      });

      // Estimate file size (Google logo is about 13KB)
      const estimatedSize = 13 * 1024; // 13KB in bytes
      const endTime = performance.now();

      totalBytes += estimatedSize;
      totalTime += (endTime - startTime);
    }

    // Calculate average speed
    const durationInSeconds = totalTime / 1000;
    const speedBps = totalBytes / durationInSeconds;
    const speedMbps = (speedBps * 8 / (1024 * 1024)).toFixed(2);

    speedElement.textContent = `${speedMbps}`;

  } catch (error) {
    console.error('Speed test error:', error);

    // Fallback: try alternative method
    try {
      const startTime = performance.now();
      await fetch('https://www.google.com/favicon.ico?t=' + Date.now(), {
        cache: 'no-store'
      });
      const endTime = performance.now();

      // Estimate based on small file (1KB)
      const estimatedSize = 1024;
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedBps = estimatedSize / durationInSeconds;
      const speedMbps = (speedBps * 8 / (1024 * 1024)).toFixed(2);

      speedElement.textContent = `~${speedMbps}`;
    } catch (fallbackError) {
      speedElement.textContent = 'Unable to test';
    }
  } finally {
    // Re-enable button
    button.disabled = false;
    button.innerHTML = '<i class="fa-solid fa-gauge-high"></i> Test Speed';
  }
});

// Initialize all stats when DOM is ready
function initializeStats() {
  // Real-time Metrics
  // Calculate page load time
  let loadTime = 0;
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      loadTime = Math.round(navEntries[0].loadEventEnd);
    } else if (performance.timing) {
      loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
  } catch (e) {
    loadTime = 0;
  }
  const loadTimeElement = document.getElementById('loadTime');
  if (loadTimeElement) {
    loadTimeElement.textContent = `${loadTime > 0 ? loadTime : '...'}ms`;
  }

  // Update time on page and last update timestamp
  let startTime = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timeOnPageElement = document.getElementById('timeOnPage');
    const lastUpdateElement = document.getElementById('lastUpdate');

    if (timeOnPageElement) {
      timeOnPageElement.textContent = `${elapsed}s`;
    }

    if (lastUpdateElement) {
      const now = new Date();
      lastUpdateElement.textContent = now.toLocaleTimeString('it-IT');
    }
  }, 1000);

  // Initialize all other stats
  fetchIPAddress();
  getNetworkInfo();
  getBrowserInfo();
  getScreenResolution();
  getDeviceMemory();
  getCPUCores();
  getBatteryStatus();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStats);
} else {
  // DOM is already loaded, run immediately
  initializeStats();
}
