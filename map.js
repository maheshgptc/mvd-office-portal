/**
 * RTO Survey & Monitoring Dashboard - Interactive GIS & Test Ground Map Engine
 * 
 * Powered by Leaflet.js
 * Plots RTO Offices, DL Test Grounds (1, 2, 3), and CF Test Grounds (1, 2, 3)
 * Supports marker categorization, custom government badge icons, dynamic coordinate extraction,
 * auto-fit bounds, and interactive popups with Google Maps direct navigation.
 */

class DashboardMap {
  constructor(mapContainerId = 'interactive-map') {
    this.containerId = mapContainerId;
    this.map = null;
    this.markerLayer = null;
    this.currentOffices = [];
    this.activeFilter = 'all'; // 'all' | 'office' | 'dl' | 'cf'
    this.defaultCenter = [10.5, 76.5]; // Central Kerala
    this.defaultZoom = 8;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container || typeof L === 'undefined') {
      console.warn('Map container or Leaflet not ready.');
      return;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    // Initialize Leaflet map
    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: true
    }).setView(this.defaultCenter, this.defaultZoom);

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | MVD Command & Control'
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
  }

  setFilter(filterType) {
    this.activeFilter = filterType;
    this.renderMarkers(this.currentOffices);
  }

  /**
   * Render markers for all offices and test grounds
   */
  renderMarkers(offices) {
    this.currentOffices = offices || [];
    if (!this.map) {
      this.init();
    }
    if (!this.map || !this.markerLayer) return;

    this.markerLayer.clearLayers();
    const bounds = [];

    // Helper to create custom HTML pin markers
    const createMarkerIcon = (type, label) => {
      let bg = '#1d4ed8'; // Navy
      let icon = 'fa-building-shield';

      if (type === 'dl') {
        bg = '#10b981'; // Green
        icon = 'fa-id-card';
      } else if (type === 'cf') {
        bg = '#8b5cf6'; // Purple
        icon = 'fa-certificate';
      }

      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: ${bg}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #ffffff; cursor: pointer;">
            <i class="fa-solid ${icon}" style="font-size: 14px;"></i>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });
    };

    const addMarkerIfValid = (gpsObj, office, locationType, labelText) => {
      if (!gpsObj) return;

      // Filter check
      if (this.activeFilter === 'office' && locationType !== 'office') return;
      if (this.activeFilter === 'dl' && locationType !== 'dl') return;
      if (this.activeFilter === 'cf' && locationType !== 'cf') return;

      if (!gpsObj.valid || gpsObj.lat === null || gpsObj.lng === null) {
        return; // Don't crash, skip unplottable coordinates on map layer
      }

      const lat = gpsObj.lat;
      const lng = gpsObj.lng;
      bounds.push([lat, lng]);

      const navUrl = gpsObj.mapsUrl || `https://www.google.com/maps?q=${lat},${lng}`;
      const marker = L.marker([lat, lng], {
        icon: createMarkerIcon(locationType, labelText)
      });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 230px; padding: 4px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px; margin-bottom: 2px;">
            ${office.district} DISTRICT
          </div>
          <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
            ${office.officeName}
          </h4>
          <div style="display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-bottom: 8px;
            background-color: ${locationType === 'office' ? '#dbeafe' : locationType === 'dl' ? '#d1fae5' : '#ede9fe'};
            color: ${locationType === 'office' ? '#1e40af' : locationType === 'dl' ? '#065f46' : '#5b21b6'};">
            ${labelText}
          </div>
          <div style="font-size: 12px; color: #334155; margin-bottom: 4px;">
            <strong>Coordinates:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </div>
          <div style="font-size: 12px; color: #334155; margin-bottom: 6px;">
            <strong>Test Grounds:</strong> DL (${office.dlGroundsCount}), CF (${office.cfGroundsCount})
          </div>
          ${office.rtoMobile ? `
            <div style="font-size: 12px; color: #334155; margin-bottom: 10px;">
              <strong>Contact:</strong> <a href="tel:${office.rtoMobile}" style="color: #2563eb; text-decoration: none;">${office.rtoMobile}</a>
            </div>
          ` : ''}
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a href="${navUrl}" target="_blank" rel="noopener noreferrer" 
               style="flex: 1; text-align: center; background: #2563eb; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 5px;">
              <i class="fa-solid fa-diamond-turn-right"></i> Navigate (Maps)
            </a>
            <button onclick="window.RTO_APP && window.RTO_APP.openOfficeProfile('${office.id}')"
                    style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
              Profile
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markerLayer.addLayer(marker);
    };

    // Plot all office points
    this.currentOffices.forEach(office => {
      // 1. Office location
      addMarkerIfValid(office.officeGps, office, 'office', 'RTO Office Headquarters');

      // 2. DL Test Grounds 1, 2, 3
      addMarkerIfValid(office.dlGps1, office, 'dl', 'DL Test Ground 1');
      addMarkerIfValid(office.dlGps2, office, 'dl', 'DL Test Ground 2');
      addMarkerIfValid(office.dlGps3, office, 'dl', 'DL Test Ground 3');

      // 3. CF Test Grounds 1, 2, 3
      addMarkerIfValid(office.cfGps1, office, 'cf', 'CF Test Ground 1');
      addMarkerIfValid(office.cfGps2, office, 'cf', 'CF Test Ground 2');
      addMarkerIfValid(office.cfGps3, office, 'cf', 'CF Test Ground 3');
    });

    // Auto-fit bounds if markers exist
    if (bounds.length > 0) {
      try {
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {
        console.warn('Could not fit bounds on map:', e);
      }
    } else {
      this.map.setView(this.defaultCenter, this.defaultZoom);
    }

    // Trigger leaflet resize recalculation in case container transitioned
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);
  }

  resize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.DashboardMap = DashboardMap;
}
