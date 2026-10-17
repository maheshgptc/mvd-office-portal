/**
 * RTO Survey & Monitoring Dashboard - Google Sheet Integration Service
 * 
 * Provides seamless, secure connectivity to Google Sheets via:
 * 1. Google Sheets CSV/GViz endpoint (Direct or via local proxy)
 * 2. Google Apps Script Web App JSON endpoint
 * 3. Direct CSV file upload
 * 4. Sample dataset fallback
 * 
 * Includes persistent configuration, last updated timestamps, manual refresh,
 * connection status monitoring, and error handling without exposing credentials.
 */

class SheetService {
  constructor() {
    this.STORAGE_KEY = 'rto_dashboard_sheet_config';
    this.LAST_SYNC_KEY = 'rto_dashboard_last_sync';
    this.DATA_SOURCE_MODES = {
      SAMPLE: 'sample',
      GOOGLE_SHEET: 'google_sheet',
      APPS_SCRIPT: 'apps_script',
      FILE_UPLOAD: 'file_upload'
    };

    this.config = this.loadConfig();
    this.lastUpdated = localStorage.getItem(this.LAST_SYNC_KEY) || null;
    this.currentData = [];
    this.rawHeaders = [];
    this.listeners = [];
    this.status = 'idle'; // 'idle' | 'loading' | 'success' | 'error'
    this.errorMessage = null;
  }

  loadConfig() {
    const defaultCfg = {
      mode: this.DATA_SOURCE_MODES.SAMPLE,
      sheetIdOrUrl: '',
      sheetTabName: 'Form Responses 1',
      appsScriptUrl: '',
      autoRefreshMinutes: 0 // 0 = disabled
    };

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...defaultCfg, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read sheet config from localStorage:', e);
    }
    return defaultCfg;
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to save config to localStorage:', e);
    }
  }

  onDataChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notifyListeners(data, meta = {}) {
    this.listeners.forEach(cb => {
      try {
        cb(data, meta);
      } catch (err) {
        console.error('Error in data change listener:', err);
      }
    });
  }

  setLastUpdated(timestampStr) {
    this.lastUpdated = timestampStr || new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    localStorage.setItem(this.LAST_SYNC_KEY, this.lastUpdated);
  }

  /**
   * Primary method to load data according to current active configuration
   */
  async loadData(forceRefresh = false) {
    this.status = 'loading';
    this.errorMessage = null;

    try {
      let rawRows = [];

      switch (this.config.mode) {
        case this.DATA_SOURCE_MODES.GOOGLE_SHEET:
          rawRows = await this.fetchFromGoogleSheet(this.config.sheetIdOrUrl, this.config.sheetTabName);
          break;

        case this.DATA_SOURCE_MODES.APPS_SCRIPT:
          rawRows = await this.fetchFromAppsScript(this.config.appsScriptUrl);
          break;

        case this.DATA_SOURCE_MODES.FILE_UPLOAD:
          if (this.currentData && this.currentData.length > 0 && !forceRefresh) {
            rawRows = this.currentData;
          } else {
            // Revert to sample if file was cleared
            rawRows = window.SAMPLE_SHEET_DATA || [];
          }
          break;

        case this.DATA_SOURCE_MODES.SAMPLE:
        default:
          rawRows = window.SAMPLE_SHEET_DATA || [];
          break;
      }

      if (!rawRows || rawRows.length === 0) {
        throw new Error('No records returned from data source.');
      }

      // Transform raw rows using the internal mapping layer
      const parsedRecords = rawRows.map((row, idx) => DataAdapter.transformRow(row, idx));

      this.currentData = parsedRecords;
      this.status = 'success';
      this.setLastUpdated();

      this.notifyListeners(parsedRecords, {
        mode: this.config.mode,
        count: parsedRecords.length,
        timestamp: this.lastUpdated
      });

      return {
        success: true,
        data: parsedRecords,
        count: parsedRecords.length,
        timestamp: this.lastUpdated
      };

    } catch (err) {
      console.error('SheetService loadData failure:', err);
      this.status = 'error';
      this.errorMessage = err.message || 'Unable to load dashboard data.';

      // Fallback: If configured sheet failed, we notify with error status
      return {
        success: false,
        error: this.errorMessage,
        data: this.currentData || []
      };
    }
  }

  /**
   * Extract Google Spreadsheet ID from string or URL
   */
  extractSheetId(input) {
    if (!input) return null;
    const str = input.trim();
    // Matches /spreadsheets/d/([a-zA-Z0-9-_]+)
    const match = str.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) return match[1];
    // If user provided raw ID without URL
    if (/^[a-zA-Z0-9-_]{20,}$/.test(str)) {
      return str;
    }
    return str;
  }

  /**
   * Fetch from Google Sheets using public CSV / GViz endpoint
   */
  async fetchFromGoogleSheet(idOrUrl, tabName = '') {
    const sheetId = this.extractSheetId(idOrUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheet ID or URL provided.');
    }

    // Google Sheets public CSV export URL
    let csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    if (tabName) {
      csvUrl += `&sheet=${encodeURIComponent(tabName)}`;
    }

    // Try direct fetch first, with fallback to local proxy if CORS restricts
    let csvText = null;
    try {
      const resp = await fetch(csvUrl, { cache: 'no-store' });
      if (!resp.ok) {
        throw new Error(`Google Sheets responded with HTTP ${resp.status}`);
      }
      csvText = await resp.text();
    } catch (directErr) {
      console.warn('Direct fetch failed, attempting via local server proxy...', directErr);
      // Attempt proxy endpoint
      try {
        const proxyUrl = `/api/proxy-sheet?id=${encodeURIComponent(sheetId)}&sheet=${encodeURIComponent(tabName || '')}`;
        const proxyResp = await fetch(proxyUrl, { cache: 'no-store' });
        if (!proxyResp.ok) {
          throw new Error(`Proxy fetch failed: ${proxyResp.statusText}`);
        }
        csvText = await proxyResp.text();
      } catch (proxyErr) {
        throw new Error(`Cannot reach Google Sheet. Please ensure the Google Sheet is shared as 'Anyone with the link can view' or publish to web. (${directErr.message})`);
      }
    }

    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Google Sheet returned empty content.');
    }

    return this.parseCsvString(csvText);
  }

  /**
   * Fetch from Google Apps Script Web App JSON API
   */
  async fetchFromAppsScript(webAppUrl) {
    if (!webAppUrl || !webAppUrl.startsWith('http')) {
      throw new Error('Invalid Google Apps Script Web App URL.');
    }

    const resp = await fetch(webAppUrl, { cache: 'no-store' });
    if (!resp.ok) {
      throw new Error(`Apps Script endpoint responded with HTTP ${resp.status}`);
    }

    const json = await resp.json();
    if (json && json.status === 'success' && Array.isArray(json.data)) {
      return json.data;
    }
    if (Array.isArray(json)) {
      return json;
    }

    throw new Error('Invalid response structure from Google Apps Script Web App.');
  }

  /**
   * Parse CSV String using PapaParse
   */
  parseCsvString(csvContent) {
    return new Promise((resolve, reject) => {
      if (typeof Papa === 'undefined') {
        reject(new Error('CSV parser library (PapaParse) is not loaded.'));
        return;
      }

      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            console.warn('PapaParse encountered warnings:', results.errors);
          }
          if (results.data && results.data.length > 0) {
            resolve(results.data);
          } else {
            reject(new Error('Parsed CSV contained 0 valid data rows.'));
          }
        },
        error: (err) => {
          reject(new Error(`CSV parsing error: ${err.message}`));
        }
      });
    });
  }

  /**
   * Handle user local CSV file upload
   */
  handleFileUpload(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target.result;
          const rows = await this.parseCsvString(content);
          const parsedRecords = rows.map((row, idx) => DataAdapter.transformRow(row, idx));

          this.config.mode = this.DATA_SOURCE_MODES.FILE_UPLOAD;
          this.saveConfig(this.config);

          this.currentData = parsedRecords;
          this.status = 'success';
          this.setLastUpdated();

          this.notifyListeners(parsedRecords, {
            mode: this.config.mode,
            count: parsedRecords.length,
            fileName: file.name,
            timestamp: this.lastUpdated
          });

          resolve(parsedRecords);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read local file.'));
      reader.readAsText(file);
    });
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.SheetService = SheetService;
}
