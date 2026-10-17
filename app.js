/**
 * RTO Survey & Monitoring Dashboard - Main Application Controller
 * 
 * Manages routing, global filtering, interactive drill-downs,
 * real-time chart synchronization, map rendering, office comparison,
 * advanced data table, remarks keyword search & highlighting, and modals.
 */

class RTOApp {
  constructor() {
    this.supabaseService = new SupabaseService();
    this.sheetService = new SheetService();
    this.activeEngine = 'supabase'; // 'supabase' (default) | 'google_sheet' | 'apps_script' | 'file_upload' | 'sample'

    this.charts = new DashboardCharts();
    this.map = new DashboardMap('interactive-map');

    this.allOffices = [];
    this.filteredOffices = [];
    this.currentView = 'dashboard';
    this.selectedOffice = null;
    this.selectedDistrict = null;
    this.comparisonOfficeIds = [];

    // Global Filter State
    this.filters = {
      district: 'all',
      office: 'all',
      buildingType: 'all',
      year: 'all',
      ownGround: 'all',
      rtoAvailable: 'all',
      jrtoAvailable: 'all',
      staffShortage: false,
      financialDues: false,
      oldVehicles: false,
      searchQuery: ''
    };

    // Table pagination state
    this.tableState = {
      currentPage: 1,
      pageSize: 10,
      activeGroup: 'office',
      sortField: 'officeName',
      sortAsc: true
    };

    // Manpower drilldown active role
    this.manpowerDrilldownRole = 'mvi';
    this.manpowerCriticalOnly = false;

    // Financial drilldown active category
    this.financialCategory = 'all'; // 'all' | 'rent' | 'repair' | 'fuel'

    // Pendency remarks search keyword
    this.remarksKeyword = '';

    // Admin & CMS Workbench State
    this.adminSession = null;
    this.modules = [];
    this.menus = [];
    this.fields = [];
    this.selectedModuleId = 'mod_infra';
    this.selectedMenuId = 'menu_premises';
  }

  async init() {
    this.bindDOMEvents();
    this.setupDataListeners();

    // Check for existing active Admin session
    try {
      const saved = localStorage.getItem('rto_admin_session');
      if (saved) {
        this.adminSession = JSON.parse(saved);
      }
    } catch (e) {}
    this.updateAdminUI();

    await this.refreshData();
  }

  setupDataListeners() {
    // Supabase listener
    this.supabaseService.onDataChange((data, meta) => {
      if (this.activeEngine === 'supabase') {
        this.allOffices = data;
        this.populateFilterDropdowns();
        this.applyFilters();
        this.updateConnectionBadge(meta);
      }
    });

    // Google Sheets & Local CSV fallback listener
    this.sheetService.onDataChange((data, meta) => {
      if (this.activeEngine !== 'supabase') {
        this.allOffices = data;
        this.populateFilterDropdowns();
        this.applyFilters();
        this.updateConnectionBadge(meta);
      }
    });
  }

  async refreshData() {
    const btn = document.getElementById('btn-refresh-data');
    if (btn) btn.classList.add('spinning');

    let result;
    if (this.activeEngine === 'supabase') {
      result = await this.supabaseService.loadData(true);
      if (!result.success) {
        console.warn('Supabase fetch failed, falling back to cached/sample:', result.error);
        // If Supabase fails, fallback gracefully
        result = await this.sheetService.loadData(true);
      }
    } else {
      result = await this.sheetService.loadData(true);
    }

    if (!result.success) {
      this.showErrorScreen(result.error);
    } else {
      this.hideErrorScreen();
    }

    if (btn) btn.classList.remove('spinning');
  }

  updateConnectionBadge(meta = {}) {
    const badge = document.getElementById('connection-status-badge');
    const timeEl = document.getElementById('last-updated-timestamp');

    const lastTime = this.activeEngine === 'supabase' 
      ? this.supabaseService.lastUpdated 
      : this.sheetService.lastUpdated;

    if (timeEl) {
      timeEl.textContent = lastTime || 'Realtime Active';
    }

    if (badge) {
      if (this.activeEngine === 'supabase') {
        badge.className = 'status-pill status-live';
        badge.innerHTML = '<i class="fa-solid fa-bolt text-emerald-400"></i> Supabase Live DB (MVD DATA PORTAL)';
      } else {
        const mode = this.sheetService.config.mode;
        if (mode === 'google_sheet') {
          badge.className = 'status-pill status-live';
          badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Live Google Sheet';
        } else if (mode === 'apps_script') {
          badge.className = 'status-pill status-live';
          badge.innerHTML = '<i class="fa-solid fa-cloud-bolt"></i> Google Apps Script API';
        } else if (mode === 'file_upload') {
          badge.className = 'status-pill status-custom';
          badge.innerHTML = `<i class="fa-solid fa-file-csv"></i> Local CSV (${meta.fileName || 'Uploaded'})`;
        } else {
          badge.className = 'status-pill status-demo';
          badge.innerHTML = '<i class="fa-solid fa-database"></i> Sample Dataset (Kerala MVD)';
        }
      }
    }
  }

  showErrorScreen(msg) {
    const errorView = document.getElementById('connection-error-overlay');
    const msgEl = document.getElementById('error-message-detail');
    if (errorView) {
      if (msgEl) msgEl.textContent = msg || 'Unable to connect to Google Sheet.';
      errorView.classList.remove('hidden');
    }
  }

  hideErrorScreen() {
    const errorView = document.getElementById('connection-error-overlay');
    if (errorView) errorView.classList.add('hidden');
  }

  /**
   * Populate District and Office Dropdowns dynamically
   */
  populateFilterDropdowns() {
    const districtSelect = document.getElementById('filter-district');
    const officeSelect = document.getElementById('filter-office');

    if (districtSelect) {
      const currentVal = districtSelect.value;
      const districts = Array.from(new Set(this.allOffices.map(o => o.district))).sort();
      districtSelect.innerHTML = '<option value="all">All Districts</option>';
      districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });
      if (districts.includes(currentVal)) districtSelect.value = currentVal;
    }

    if (officeSelect) {
      const currentVal = officeSelect.value;
      const offices = [...this.allOffices].sort((a, b) => a.officeName.localeCompare(b.officeName));
      officeSelect.innerHTML = '<option value="all">All Offices</option>';
      offices.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.id;
        opt.textContent = `${o.officeName} (${o.district})`;
        officeSelect.appendChild(opt);
      });
      if (currentVal && currentVal !== 'all') officeSelect.value = currentVal;
    }
  }

  /**
   * Apply all active filters to the dataset
   */
  applyFilters() {
    this.filteredOffices = this.allOffices.filter(office => {
      // District filter
      if (this.filters.district !== 'all' && office.district !== this.filters.district) {
        return false;
      }
      // Office filter
      if (this.filters.office !== 'all' && office.id !== this.filters.office) {
        return false;
      }
      // Building Type
      if (this.filters.buildingType !== 'all') {
        const isRented = office.buildingType.toLowerCase().includes('rent');
        if (this.filters.buildingType === 'rented' && !isRented) return false;
        if (this.filters.buildingType === 'government' && isRented) return false;
      }
      // Own Test Ground
      if (this.filters.ownGround !== 'all') {
        if (this.filters.ownGround === 'yes' && !office.hasOwnGround) return false;
        if (this.filters.ownGround === 'no' && office.hasOwnGround) return false;
      }
      // RTO Available
      if (this.filters.rtoAvailable !== 'all') {
        const isAvail = office.rtoAvailable;
        if (this.filters.rtoAvailable === 'yes' && !isAvail) return false;
        if (this.filters.rtoAvailable === 'no' && isAvail) return false;
      }
      // JRTO Available
      if (this.filters.jrtoAvailable !== 'all') {
        const isAvail = office.jrtoAvailable;
        if (this.filters.jrtoAvailable === 'yes' && !isAvail) return false;
        if (this.filters.jrtoAvailable === 'no' && isAvail) return false;
      }
      // Staff Shortage toggle
      if (this.filters.staffShortage && !office.hasStaffShortage) {
        return false;
      }
      // Financial Dues toggle
      if (this.filters.financialDues && !office.hasFinancialDues) {
        return false;
      }
      // Old Vehicles toggle
      if (this.filters.oldVehicles && !office.hasOldVehicles) {
        return false;
      }
      // Global search
      if (this.filters.searchQuery) {
        const q = this.filters.searchQuery.toLowerCase();
        const matches = 
          office.officeName.toLowerCase().includes(q) ||
          office.district.toLowerCase().includes(q) ||
          office.rtoName.toLowerCase().includes(q) ||
          office.jrtoName.toLowerCase().includes(q) ||
          office.dtcName.toLowerCase().includes(q) ||
          (office.rtoMobile && office.rtoMobile.includes(q)) ||
          (office.jrtoMobile && office.jrtoMobile.includes(q)) ||
          office.buildingType.toLowerCase().includes(q) ||
          office.rentRemarks.toLowerCase().includes(q) ||
          office.repairRemarks.toLowerCase().includes(q) ||
          office.fuelRemarks.toLowerCase().includes(q) ||
          office.cfOtherLocationDetails.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });

    this.tableState.currentPage = 1;
    this.renderCurrentView();
    this.updateFilterCountBadges();
  }

  resetFilters() {
    this.filters = {
      district: 'all',
      office: 'all',
      buildingType: 'all',
      year: 'all',
      ownGround: 'all',
      rtoAvailable: 'all',
      jrtoAvailable: 'all',
      staffShortage: false,
      financialDues: false,
      oldVehicles: false,
      searchQuery: ''
    };

    // Reset DOM controls
    const dist = document.getElementById('filter-district');
    const off = document.getElementById('filter-office');
    const bldg = document.getElementById('filter-building-type');
    const og = document.getElementById('filter-own-ground');
    const rto = document.getElementById('filter-rto-avail');
    const jrto = document.getElementById('filter-jrto-avail');
    const ss = document.getElementById('filter-staff-shortage');
    const fd = document.getElementById('filter-financial-dues');
    const ov = document.getElementById('filter-old-vehicles');
    const search = document.getElementById('global-search-input');

    if (dist) dist.value = 'all';
    if (off) off.value = 'all';
    if (bldg) bldg.value = 'all';
    if (og) og.value = 'all';
    if (rto) rto.value = 'all';
    if (jrto) jrto.value = 'all';
    if (ss) ss.checked = false;
    if (fd) fd.checked = false;
    if (ov) ov.checked = false;
    if (search) search.value = '';

    this.applyFilters();
  }

  updateFilterCountBadges() {
    const badge = document.getElementById('filtered-offices-count');
    if (badge) {
      badge.textContent = `${this.filteredOffices.length} of ${this.allOffices.length} Offices`;
    }
  }

  /**
   * Router / View Switcher
   */
  navigateTo(viewId, pushHistory = true) {
    this.currentView = viewId;

    // Update sidebar navigation active item
    document.querySelectorAll('.sidebar-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });

    // Show/hide view sections
    document.querySelectorAll('.app-view').forEach(viewEl => {
      viewEl.classList.add('hidden');
    });

    const activeViewEl = document.getElementById(`view-${viewId}`);
    if (activeViewEl) {
      activeViewEl.classList.remove('hidden');
    }

    this.updateBreadcrumbs();
    this.renderCurrentView();

    // Close mobile sidebar drawer if open
    document.body.classList.remove('sidebar-open');
    document.body.classList.remove('sidebar-collapsed');

    // Update mobile bottom nav active button
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateBreadcrumbs() {
    const bc = document.getElementById('app-breadcrumbs');
    if (!bc) return;

    let html = `<li class="breadcrumb-item"><a href="#" onclick="window.RTO_APP.navigateTo('dashboard'); return false;"><i class="fa-solid fa-gauge-high"></i> State Command</a></li>`;

    if (this.currentView === 'districts') {
      html += `<li class="breadcrumb-item active">District Analysis</li>`;
    } else if (this.currentView === 'directory') {
      html += `<li class="breadcrumb-item active">Office Directory</li>`;
    } else if (this.currentView === 'profile') {
      const dist = this.selectedOffice ? this.selectedOffice.district : 'District';
      const off = this.selectedOffice ? this.selectedOffice.officeName : 'Office Profile';
      html += `<li class="breadcrumb-item"><a href="#" onclick="window.RTO_APP.drilldownDistrict('${dist}'); return false;">${dist}</a></li>`;
      html += `<li class="breadcrumb-item active">${off}</li>`;
    } else if (this.currentView === 'manpower') {
      html += `<li class="breadcrumb-item active">Manpower Strength & Shortage</li>`;
    } else if (this.currentView === 'testgrounds') {
      html += `<li class="breadcrumb-item active">DL & CF Test Grounds</li>`;
    } else if (this.currentView === 'map') {
      html += `<li class="breadcrumb-item active">Interactive Test Ground Map</li>`;
    } else if (this.currentView === 'vehicles') {
      html += `<li class="breadcrumb-item active">Vehicle Fleet & Age Analysis</li>`;
    } else if (this.currentView === 'finances') {
      html += `<li class="breadcrumb-item active">Financial Dues & Pending Bills</li>`;
    } else if (this.currentView === 'itinventory') {
      html += `<li class="breadcrumb-item active">IT Inventory & Digital Assets</li>`;
    } else if (this.currentView === 'pendency') {
      html += `<li class="breadcrumb-item active">Critical Pendency & Remarks</li>`;
    } else if (this.currentView === 'comparison') {
      html += `<li class="breadcrumb-item active">Office Comparison</li>`;
    } else if (this.currentView === 'reports') {
      html += `<li class="breadcrumb-item active">Reports & Dossier Export</li>`;
    } else if (this.currentView === 'admin') {
      html += `<li class="breadcrumb-item active"><i class="fa-solid fa-sliders text-warning"></i> Admin Studio: Schema Builder</li>`;
    }

    bc.innerHTML = html;
  }

  /**
   * Master renderer for active view
   */
  renderCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboardView();
        break;
      case 'districts':
        this.renderDistrictsView();
        break;
      case 'directory':
        this.renderDirectoryView();
        break;
      case 'profile':
        this.renderProfileView();
        break;
      case 'manpower':
        this.renderManpowerView();
        break;
      case 'testgrounds':
        this.renderTestGroundsView();
        break;
      case 'map':
        this.renderMapView();
        break;
      case 'vehicles':
        this.renderVehiclesView();
        break;
      case 'finances':
        this.renderFinancesView();
        break;
      case 'itinventory':
        this.renderItInventoryView();
        break;
      case 'pendency':
        this.renderPendencyView();
        break;
      case 'comparison':
        this.renderComparisonView();
        break;
      case 'reports':
        this.renderReportsView();
        break;
      case 'admin':
        this.renderAdminView();
        break;
    }
  }

  // ==========================================
  // VIEW 1: EXECUTIVE DASHBOARD
  // ==========================================
  renderDashboardView() {
    const state = DataAdapter.aggregateState(this.filteredOffices);
    const districts = DataAdapter.aggregateDistricts(this.filteredOffices);

    // KPI Cards
    this.setElText('kpi-total-districts', state.totalDistricts);
    this.setElText('kpi-total-offices', state.totalOffices);
    this.setElText('kpi-total-area', `${state.totalArea.toLocaleString()} sq ft`);
    this.setElText('kpi-total-sanctioned', state.totalSanctioned);
    this.setElText('kpi-total-available', state.totalAvailable);
    this.setElText('kpi-total-vacancy', `${state.totalVacancy} (${state.staffVacancyPercent}%)`);
    this.setElText('kpi-dl-grounds', state.totalDLGrounds);
    this.setElText('kpi-cf-grounds', state.totalCFGrounds);
    this.setElText('kpi-total-vehicles', state.totalVehicles);
    this.setElText('kpi-old-vehicles', `${state.vehiclesOver10Years} (${state.vehiclesOver10YearsPercent}%)`);
    this.setElText('kpi-total-dues', DataAdapter.formatCurrency(state.totalFinancialDues));
    this.setElText('kpi-health-score', `${state.avgHealthScore}/100`);

    // IT Workstation Assets
    let itWorkingPcs = 0;
    let itTotalPcs = 0;
    let itFaultyPcs = 0;
    this.filteredOffices.forEach(o => {
      if (o.itInventory) {
        const it = o.itInventory;
        const w = (it.cpu_working || 0) + (it.aio_working || 0);
        const nw = (it.cpu_not_working || 0) + (it.aio_not_working || 0);
        itWorkingPcs += w;
        itFaultyPcs += nw;
        itTotalPcs += (w + nw);
      }
    });
    this.setElText('kpi-it-working-pcs', itWorkingPcs.toLocaleString());
    this.setElText('kpi-it-total-pcs', itTotalPcs.toLocaleString());
    this.setElText('kpi-it-faulty-pcs', `${itFaultyPcs} Faulty`);

    // Health Score visual status
    const healthBadge = document.getElementById('kpi-health-status-badge');
    if (healthBadge) {
      if (state.avgHealthScore >= 75) {
        healthBadge.className = 'status-pill status-healthy';
        healthBadge.textContent = 'Good Standing';
      } else if (state.avgHealthScore >= 55) {
        healthBadge.className = 'status-pill status-attention';
        healthBadge.textContent = 'Attention Required';
      } else {
        healthBadge.className = 'status-pill status-critical';
        healthBadge.textContent = 'Critical Situation';
      }
    }

    // Critical Alerts Banner
    const alertsContainer = document.getElementById('dashboard-critical-alerts');
    if (alertsContainer) {
      const alerts = [];
      if (state.officesWithStaffShortage > 0) {
        alerts.push({
          type: 'danger',
          icon: 'fa-user-slash',
          title: 'Staffing Shortages Alert',
          text: `${state.officesWithStaffShortage} offices have vacancy rate exceeding 25% or lack key inspectors.`,
          actionText: 'Inspect Shortages',
          action: "window.RTO_APP.navigateTo('manpower')"
        });
      }
      if (state.officesWithoutOwnGround > 0) {
        alerts.push({
          type: 'warning',
          icon: 'fa-road-circle-exclamation',
          title: 'Testing Infrastructure Deficit',
          text: `${state.officesWithoutOwnGround} offices lack own dedicated testing grounds (tests conducted roadside or leased).`,
          actionText: 'View Grounds',
          action: "window.RTO_APP.navigateTo('testgrounds')"
        });
      }
      if (state.vehiclesOver10Years > 0) {
        alerts.push({
          type: 'warning',
          icon: 'fa-triangle-exclamation',
          title: 'Aged Fleet Compliance',
          text: `${state.vehiclesOver10Years} vehicles in active duty are older than 10 years and require phased condemnation.`,
          actionText: 'Review Fleet',
          action: "window.RTO_APP.navigateTo('vehicles')"
        });
      }
      if (state.totalFinancialDues > 200000) {
        alerts.push({
          type: 'danger',
          icon: 'fa-file-invoice-dollar',
          title: 'Pending Bills & Rent Arrears',
          text: `Total pending financial dues stand at ${DataAdapter.formatCurrency(state.totalFinancialDues)}, with pending rent notices.`,
          actionText: 'Audit Dues',
          action: "window.RTO_APP.navigateTo('finances')"
        });
      }

      alertsContainer.innerHTML = alerts.map(a => `
        <div class="alert-card alert-${a.type}">
          <div class="alert-icon"><i class="fa-solid ${a.icon}"></i></div>
          <div class="alert-content">
            <h4>${a.title}</h4>
            <p>${a.text}</p>
          </div>
          <button class="alert-action-btn" onclick="${a.action}">${a.actionText} →</button>
        </div>
      `).join('');
    }

    // Charts
    this.charts.renderDistrictOverviewChart('chart-district-overview', districts);
    this.charts.renderFinancialDuesDonut('chart-financial-donut', state);

    // Quick District Summary Table
    this.renderDashboardDistrictTable(districts);
  }

  renderDashboardDistrictTable(districts) {
    const tbody = document.getElementById('dashboard-districts-tbody');
    if (!tbody) return;

    tbody.innerHTML = districts.map(d => `
      <tr class="clickable-row" onclick="window.RTO_APP.drilldownDistrict('${d.district}')">
        <td class="font-bold text-navy">
          <i class="fa-solid fa-map-pin text-primary"></i> ${d.district}
        </td>
        <td><span class="badge badge-subtle">${d.officeCount} Offices</span></td>
        <td>${d.totalSanctioned}</td>
        <td>${d.totalAvailable}</td>
        <td class="${d.totalVacancy > 10 ? 'text-danger font-semibold' : ''}">${d.totalVacancy} (${d.staffVacancyPercent}%)</td>
        <td>${d.totalDLGrounds} DL / ${d.totalCFGrounds} CF</td>
        <td>${d.totalVehicles} <span class="text-xs text-muted">(${d.vehiclesOver10Years} >10y)</span></td>
        <td class="font-semibold text-danger">${DataAdapter.formatCurrency(d.totalFinancialDues)}</td>
        <td>
          <span class="status-pill ${d.statusClass}">${d.status} (${d.avgHealthScore})</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.RTO_APP.drilldownDistrict('${d.district}')">
            Drill Down →
          </button>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // VIEW 2: DISTRICT ANALYSIS
  // ==========================================
  renderDistrictsView() {
    const districts = DataAdapter.aggregateDistricts(this.filteredOffices);
    const container = document.getElementById('districts-grid-container');
    if (!container) return;

    container.innerHTML = districts.map(d => `
      <div class="district-card ${d.statusClass}" onclick="window.RTO_APP.drilldownDistrict('${d.district}')">
        <div class="district-card-header">
          <div>
            <h3 class="district-name">${d.district}</h3>
            <span class="district-subtitle">${d.officeCount} RTO / Sub-RTO Offices</span>
          </div>
          <span class="status-pill ${d.statusClass}">${d.status}</span>
        </div>

        <div class="district-metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Staff Availability</span>
            <span class="metric-val ${d.staffAvailabilityPercent < 70 ? 'text-danger' : 'text-success'}">
              ${d.staffAvailabilityPercent}%
            </span>
            <span class="metric-sub">${d.totalAvailable} / ${d.totalSanctioned}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Vacancies</span>
            <span class="metric-val text-danger">${d.totalVacancy}</span>
            <span class="metric-sub">Posts unfilled</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Test Grounds</span>
            <span class="metric-val text-navy">${d.totalDLGrounds + d.totalCFGrounds}</span>
            <span class="metric-sub">${d.totalDLGrounds} DL | ${d.totalCFGrounds} CF</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Vehicles Fleet</span>
            <span class="metric-val">${d.totalVehicles}</span>
            <span class="metric-sub text-danger">${d.vehiclesOver10Years} > 10 yrs old</span>
          </div>
        </div>

        <div class="district-financial-footer">
          <div>
            <span class="text-xs text-muted block">Pending Financial Dues</span>
            <span class="font-bold text-danger">${DataAdapter.formatCurrency(d.totalFinancialDues)}</span>
          </div>
          <div class="text-right">
            <span class="text-xs text-muted block">Avg Health Score</span>
            <span class="font-bold text-primary">${d.avgHealthScore} / 100</span>
          </div>
        </div>

        <div class="district-card-action">
          <span>Inspect ${d.district} Offices (${d.officeCount})</span>
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    `).join('');
  }

  drilldownDistrict(districtName) {
    this.filters.district = districtName;
    const select = document.getElementById('filter-district');
    if (select) select.value = districtName;
    this.applyFilters();
    this.navigateTo('directory');
  }

  // ==========================================
  // VIEW 3: OFFICE DIRECTORY / DATA TABLE
  // ==========================================
  renderDirectoryView() {
    this.renderDirectoryCategoryTabs();
    this.renderDirectoryTable();
  }

  renderDirectoryCategoryTabs() {
    const tabsContainer = document.getElementById('table-column-group-tabs');
    if (!tabsContainer || !window.RTO_SCHEMA) return;

    tabsContainer.innerHTML = window.RTO_SCHEMA.TABLE_COLUMN_GROUPS.map(g => `
      <button class="table-group-tab ${this.tableState.activeGroup === g.id ? 'active' : ''}" 
              onclick="window.RTO_APP.setTableGroup('${g.id}')">
        <i class="fa-solid ${g.icon}"></i> ${g.label}
      </button>
    `).join('');
  }

  setTableGroup(groupId) {
    this.tableState.activeGroup = groupId;
    this.renderDirectoryCategoryTabs();
    this.renderDirectoryTable();
  }

  sortTable(field) {
    if (this.tableState.sortField === field) {
      this.tableState.sortAsc = !this.tableState.sortAsc;
    } else {
      this.tableState.sortField = field;
      this.tableState.sortAsc = true;
    }
    this.renderDirectoryTable();
  }

  renderDirectoryTable() {
    const thead = document.getElementById('directory-table-thead');
    const tbody = document.getElementById('directory-table-tbody');
    const paginationContainer = document.getElementById('directory-pagination');
    if (!thead || !tbody) return;

    const group = window.RTO_SCHEMA.TABLE_COLUMN_GROUPS.find(g => g.id === this.tableState.activeGroup) || window.RTO_SCHEMA.TABLE_COLUMN_GROUPS[0];

    // Build Table Header
    thead.innerHTML = `
      <tr>
        <th style="width: 40px;">#</th>
        <th>Office Name</th>
        <th>District</th>
        ${group.columns.map(col => `
          <th class="sortable-th" onclick="window.RTO_APP.sortTable('${col.key}')">
            ${col.label}
            ${this.tableState.sortField === col.key ? (this.tableState.sortAsc ? ' ▲' : ' ▼') : ''}
          </th>
        `).join('')}
        <th>Health Score</th>
        <th>Actions</th>
      </tr>
    `;

    // Sort offices
    const sorted = [...this.filteredOffices].sort((a, b) => {
      let valA = a[this.tableState.sortField];
      let valB = b[this.tableState.sortField];
      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';
      if (typeof valA === 'string') {
        return this.tableState.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.tableState.sortAsc ? (valA - valB) : (valB - valA);
    });

    // Pagination slice
    const totalRecords = sorted.length;
    const totalPages = Math.ceil(totalRecords / this.tableState.pageSize) || 1;
    if (this.tableState.currentPage > totalPages) this.tableState.currentPage = 1;

    const startIdx = (this.tableState.currentPage - 1) * this.tableState.pageSize;
    const pageRecords = sorted.slice(startIdx, startIdx + this.tableState.pageSize);

    // Build Table Body
    tbody.innerHTML = pageRecords.map((office, idx) => {
      const serial = startIdx + idx + 1;
      return `
        <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${office.id}')">
          <td class="text-muted text-xs">${serial}</td>
          <td class="font-bold text-navy">
            ${office.officeName}
            ${office.isRented ? '<span class="badge badge-amber text-xs">Rented</span>' : '<span class="badge badge-blue text-xs">Govt</span>'}
          </td>
          <td><span class="badge badge-subtle">${office.district}</span></td>
          ${group.columns.map(col => {
            let val = office[col.key];
            if (col.key.toLowerCase().includes('due') || col.key.toLowerCase().includes('expense')) {
              val = DataAdapter.formatCurrency(val);
            }
            if (val === true) val = '<span class="text-success"><i class="fa-solid fa-check"></i> Yes</span>';
            if (val === false) val = '<span class="text-danger"><i class="fa-solid fa-xmark"></i> No</span>';
            return `<td>${val !== null && val !== undefined && val !== '' ? val : '—'}</td>`;
          }).join('')}
          <td>
            <button class="status-pill ${office.healthScore.statusClass}" onclick="event.stopPropagation(); window.RTO_APP.showHealthScoreModal('${office.id}')">
              ${office.healthScore.score}/100 (${office.healthScore.rating})
            </button>
          </td>
          <td>
            <div class="table-actions-cell" onclick="event.stopPropagation()">
              <button class="btn btn-sm btn-primary" onclick="window.RTO_APP.openOfficeProfile('${office.id}')">
                Profile
              </button>
              <button class="btn btn-sm btn-outline" onclick="window.RTO_APP.openEditOfficeModal('${office.id}')" title="Edit & Update in Supabase">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>
              ${office.officeGps.valid || office.officeGps.mapsUrl ? `
                <a href="${office.officeGps.mapsUrl || `https://www.google.com/maps?q=${office.officeGps.lat},${office.officeGps.lng}`}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-icon" title="Open Google Maps">
                  <i class="fa-solid fa-map-location-dot"></i>
                </a>
              ` : ''}
              <button class="btn btn-sm btn-icon ${this.comparisonOfficeIds.includes(office.id) ? 'active' : ''}" 
                      onclick="window.RTO_APP.toggleCompareOffice('${office.id}')" 
                      title="Add to Comparison">
                <i class="fa-solid fa-code-compare"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Pagination footer
    if (paginationContainer) {
      paginationContainer.innerHTML = `
        <div class="pagination-info">
          Showing ${totalRecords === 0 ? 0 : startIdx + 1} to ${Math.min(startIdx + this.tableState.pageSize, totalRecords)} of ${totalRecords} offices
        </div>
        <div class="pagination-controls">
          <button class="btn btn-sm btn-outline" ${this.tableState.currentPage <= 1 ? 'disabled' : ''} onclick="window.RTO_APP.setPage(${this.tableState.currentPage - 1})">
            Previous
          </button>
          <span class="page-indicator">Page ${this.tableState.currentPage} of ${totalPages}</span>
          <button class="btn btn-sm btn-outline" ${this.tableState.currentPage >= totalPages ? 'disabled' : ''} onclick="window.RTO_APP.setPage(${this.tableState.currentPage + 1})">
            Next
          </button>
        </div>
      `;
    }
  }

  setPage(page) {
    this.tableState.currentPage = page;
    this.renderDirectoryTable();
  }

  // ==========================================
  // VIEW 4: DETAILED OFFICE PROFILE
  // ==========================================
  openOfficeProfile(officeId) {
    const off = this.allOffices.find(o => o.id === officeId);
    if (!off) return;
    this.selectedOffice = off;
    this.navigateTo('profile');
  }

  renderProfileView() {
    if (!this.selectedOffice) {
      if (this.filteredOffices.length > 0) {
        this.selectedOffice = this.filteredOffices[0];
      } else {
        return;
      }
    }

    const o = this.selectedOffice;

    // Header
    this.setElText('prof-office-name', o.officeName);
    this.setElText('prof-district', o.district);
    this.setElText('prof-building-type', o.buildingType);
    this.setElText('prof-functioning-year', `Est. ${o.yearOfFunctioning}`);
    this.setElText('prof-area', `${o.totalArea.toLocaleString()} Sq Ft`);

    // Health Score
    const hsBadge = document.getElementById('prof-health-score-badge');
    if (hsBadge) {
      hsBadge.className = `status-pill ${o.healthScore.statusClass}`;
      hsBadge.innerHTML = `<i class="fa-solid fa-heart-pulse"></i> Health Score: ${o.healthScore.score}/100 (${o.healthScore.rating})`;
      hsBadge.onclick = () => this.showHealthScoreModal(o.id);
    }

    // Google Maps Link
    const mapBtn = document.getElementById('prof-maps-btn');
    if (mapBtn) {
      const url = o.officeGps.mapsUrl || (o.officeGps.valid ? `https://www.google.com/maps?q=${o.officeGps.lat},${o.officeGps.lng}` : null);
      if (url) {
        mapBtn.href = url;
        mapBtn.style.display = 'inline-flex';
      } else {
        mapBtn.style.display = 'none';
      }
    }

    // Section A: Office Info
    this.setElText('prof-coords', o.officeGps.valid ? `${o.officeGps.lat}, ${o.officeGps.lng}` : (o.officeGps.raw || 'Location unavailable'));
    this.setElText('prof-landline', o.landlinePro || 'Not Available');

    // Section B: Key Officers
    this.setElText('prof-rto-name', o.rtoName);
    this.setElContact('prof-rto-mobile', o.rtoMobile);
    this.setElText('prof-jrto-name', o.jrtoName);
    this.setElContact('prof-jrto-mobile', o.jrtoMobile);
    this.setElText('prof-dtc-name', o.dtcName);
    this.setElContact('prof-dtc-mobile', o.dtcMobile);

    // Section C: Manpower Table
    const rolesBody = document.getElementById('prof-manpower-tbody');
    if (rolesBody && window.RTO_SCHEMA) {
      rolesBody.innerHTML = window.RTO_SCHEMA.MANPOWER_ROLES.map(role => {
        let s = role.sanctionedKey ? o[role.sanctionedKey] : (role.isOfficer ? 1 : '—');
        let a = role.availableKey ? (role.isOfficer ? (o[role.availableKey] ? 1 : 0) : o[role.availableKey]) : '—';
        let v = (typeof s === 'number' && typeof a === 'number') ? Math.max(0, s - a) : '—';
        let status = v > 0 ? `<span class="badge badge-danger">${v} Vacant</span>` : `<span class="badge badge-success">Fulfilled</span>`;
        return `
          <tr>
            <td class="font-semibold text-navy">${role.label}</td>
            <td>${s}</td>
            <td>${a}</td>
            <td class="${v > 0 ? 'text-danger font-semibold' : ''}">${v}</td>
            <td>${status}</td>
          </tr>
        `;
      }).join('');
    }

    // Section D: Test Grounds
    this.setElText('prof-has-ground', o.hasOwnGround ? 'Yes (Own Dedicated Ground)' : 'No (Shared / Leased / Roadside)');
    this.setElText('prof-dl-count', o.dlGroundsCount);
    this.setElText('prof-cf-count', o.cfGroundsCount);
    this.setElText('prof-dl-days', o.dlDays);
    this.setElText('prof-cf-days', o.cfDays);
    this.setElText('prof-cf-remarks', o.cfOtherLocationDetails || 'No additional remarks');

    // Section E: Vehicle Fleet
    this.setElText('prof-veh-total', o.totalVehicles);
    this.setElText('prof-veh-diesel', o.dieselVehicles);
    this.setElText('prof-veh-petrol', o.petrolVehicles);
    this.setElText('prof-veh-electric', o.electricVehicles);
    this.setElText('prof-veh-old', `${o.vehiclesOver10Years} (${o.vehiclesOver10YearsPercent}%)`);

    // Section F: Financial Dues & Pendency
    this.setElText('prof-rent-dues', DataAdapter.formatCurrency(o.rentDues));
    this.setElText('prof-rent-from', o.rentDueFrom || 'Nil');
    this.setElText('prof-rent-sub', o.rentSubmittedOn || 'Nil');
    this.setElText('prof-rent-remarks', o.rentRemarks || 'No pending rent remarks');

    this.setElText('prof-repair-dues', DataAdapter.formatCurrency(o.repairDues));
    this.setElText('prof-repair-from', o.repairDueFrom || 'Nil');
    this.setElText('prof-repair-sub', o.repairSubmittedOn || 'Nil');
    this.setElText('prof-repair-remarks', o.repairRemarks || 'No pending repair remarks');

    this.setElText('prof-fuel-dues', DataAdapter.formatCurrency(o.fuelDues));
    this.setElText('prof-fuel-from', o.fuelDueFrom || 'Nil');
    this.setElText('prof-fuel-sub', o.fuelSubmittedOn || 'Nil');
    this.setElText('prof-fuel-remarks', o.fuelRemarks || 'No pending fuel remarks');

    this.setElText('prof-other-expenses', o.otherExpenses || 'Nil');
    this.setElText('prof-total-dues', DataAdapter.formatCurrency(o.totalFinancialDues));

    // Section G: IT & Digital Infrastructure
    const it = o.itInventory;
    const itBadge = document.getElementById('prof-it-status-badge');
    if (it) {
      if (itBadge) {
        itBadge.className = 'badge badge-blue ml-auto';
        itBadge.textContent = 'IT Survey Active';
      }
      const cpuWork = (it.cpu_working || 0) + (it.aio_working || 0);
      const cpuFault = (it.cpu_not_working || 0) + (it.aio_not_working || 0);
      this.setElText('prof-it-cpu', `${cpuWork} Working${cpuFault > 0 ? ` (${cpuFault} Faulty)` : ''}`);
      
      const monWork = it.monitors_working || 0;
      const monFault = it.monitors_not_working || 0;
      this.setElText('prof-it-monitors', `${monWork} Working${monFault > 0 ? ` (${monFault} Faulty)` : ''}`);

      this.setElText('prof-it-laptops', `${it.laptops_working || 0} Units`);

      const upsWork = it.ups_working || 0;
      const upsFault = it.ups_not_working || 0;
      const batt = it.batteries_in_use || 0;
      this.setElText('prof-it-ups', `${upsWork} Working${upsFault > 0 ? ` (${upsFault} Faulty)` : ''} | ${batt} Batteries`);

      this.setElText('prof-it-network', `${it.network_provider || 'Not Specified'} (${it.network_speed || 'Speed N/A'})`);

      this.setElText('prof-it-age', `>8 Yrs: ${it.systems_above_8yrs || 0} | 5-8 Yrs: ${it.systems_5_to_8yrs || 0} | 3-5 Yrs: ${it.systems_3_to_5yrs || 0} | <3 Yrs: ${it.systems_below_3yrs || 0}`);

      this.setElText('prof-it-officer', it.officer_in_charge || 'Not Appointed');
      this.setElContact('prof-it-mobile', it.officer_mobile);
    } else {
      if (itBadge) {
        itBadge.className = 'badge badge-warning ml-auto';
        itBadge.textContent = 'Survey Pending';
      }
      this.setElText('prof-it-cpu', 'Survey Pending');
      this.setElText('prof-it-monitors', '—');
      this.setElText('prof-it-laptops', '—');
      this.setElText('prof-it-ups', '—');
      this.setElText('prof-it-network', 'Survey Pending');
      this.setElText('prof-it-age', 'No IT survey data submitted for this office yet.');
      this.setElText('prof-it-officer', '—');
      this.setElText('prof-it-mobile', '—');
    }
  }

  setElContact(id, phone) {
    const el = document.getElementById(id);
    if (!el) return;
    if (phone && phone.trim().length >= 5) {
      el.innerHTML = `<a href="tel:${phone.trim()}" class="tel-link"><i class="fa-solid fa-phone"></i> ${phone.trim()}</a>`;
    } else {
      el.textContent = 'Not Available';
    }
  }

  // ==========================================
  // VIEW 5: MANPOWER ANALYSIS
  // ==========================================
  renderManpowerView() {
    this.charts.renderManpowerRolesChart('chart-manpower-roles', this.filteredOffices);
    this.charts.renderManpowerVacancyChart('chart-manpower-vacancy', this.filteredOffices);
    this.renderManpowerDrilldownTable();
  }

  setManpowerDrilldownRole(roleKey) {
    this.manpowerDrilldownRole = roleKey;
    document.querySelectorAll('.role-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.role === roleKey);
    });
    this.renderManpowerDrilldownTable();
  }

  toggleManpowerCriticalOnly(checkbox) {
    this.manpowerCriticalOnly = checkbox.checked;
    this.renderManpowerDrilldownTable();
  }

  renderManpowerDrilldownTable() {
    const tbody = document.getElementById('manpower-drilldown-tbody');
    const headerTitle = document.getElementById('manpower-drilldown-role-title');
    if (!tbody) return;

    const roleObj = window.RTO_SCHEMA.MANPOWER_ROLES.find(r => r.key === this.manpowerDrilldownRole) || window.RTO_SCHEMA.MANPOWER_ROLES[2];
    if (headerTitle) headerTitle.textContent = roleObj.label;

    const sKey = roleObj.sanctionedKey;
    const aKey = roleObj.availableKey;

    let rows = this.filteredOffices.map(o => {
      const s = sKey ? o[sKey] : (roleObj.isOfficer ? 1 : 0);
      const a = aKey ? (roleObj.isOfficer ? (o[aKey] ? 1 : 0) : o[aKey]) : 0;
      const v = Math.max(0, s - a);
      const vPct = s > 0 ? Math.round((v / s) * 100) : 0;
      return { office: o, sanctioned: s, available: a, vacancy: v, vacancyPct: vPct };
    });

    // Sort highest vacancy to lowest
    rows.sort((a, b) => b.vacancy - a.vacancy || b.vacancyPct - a.vacancyPct);

    if (this.manpowerCriticalOnly) {
      rows = rows.filter(r => r.vacancy > 0);
    }

    tbody.innerHTML = rows.map(r => `
      <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${r.office.id}')">
        <td class="font-bold text-navy">${r.office.officeName}</td>
        <td><span class="badge badge-subtle">${r.office.district}</span></td>
        <td>${r.sanctioned}</td>
        <td>${r.available}</td>
        <td class="font-bold ${r.vacancy > 0 ? 'text-danger' : 'text-success'}">${r.vacancy}</td>
        <td>
          <div class="progress-bar-cell">
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${r.vacancyPct > 40 ? 'bg-danger' : 'bg-warning'}" style="width: ${r.vacancyPct}%"></div>
            </div>
            <span class="text-xs font-semibold">${r.vacancyPct}%</span>
          </div>
        </td>
        <td>
          ${r.vacancy >= 2 ? '<span class="status-pill status-critical">Critical Shortage</span>' : r.vacancy === 1 ? '<span class="status-pill status-attention">Moderate</span>' : '<span class="status-pill status-healthy">Adequate</span>'}
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // VIEW 6: TEST GROUNDS
  // ==========================================
  renderTestGroundsView() {
    const districts = DataAdapter.aggregateDistricts(this.filteredOffices);
    const state = DataAdapter.aggregateState(this.filteredOffices);

    this.setElText('tg-total-dl', state.totalDLGrounds);
    this.setElText('tg-total-cf', state.totalCFGrounds);
    this.setElText('tg-own-grounds', state.officesWithOwnGround);
    this.setElText('tg-no-own-grounds', state.officesWithoutOwnGround);

    this.charts.renderTestGroundsDistrictChart('chart-testgrounds-district', districts);

    // Testing Days and Roadside Table
    const tbody = document.getElementById('testgrounds-schedule-tbody');
    if (tbody) {
      tbody.innerHTML = this.filteredOffices.map(o => `
        <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${o.id}')">
          <td class="font-bold text-navy">${o.officeName}</td>
          <td><span class="badge badge-subtle">${o.district}</span></td>
          <td>${o.hasOwnGround ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Own Ground</span>' : '<span class="badge badge-amber"><i class="fa-solid fa-triangle-exclamation"></i> Shared/Roadside</span>'}</td>
          <td>${o.dlDays}</td>
          <td>${o.cfDays}</td>
          <td class="text-sm ${o.cfOtherLocationDetails && o.cfOtherLocationDetails.toLowerCase().includes('road') ? 'text-danger font-medium' : 'text-muted'}">
            ${o.cfOtherLocationDetails || 'Dedicated testing ground'}
          </td>
        </tr>
      `).join('');
    }
  }

  // ==========================================
  // VIEW 7: TEST GROUND & OFFICE MAP
  // ==========================================
  renderMapView() {
    setTimeout(() => {
      this.map.renderMarkers(this.filteredOffices);
    }, 150);
  }

  setMapFilter(filterType) {
    document.querySelectorAll('.map-filter-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.mapFilter === filterType);
    });
    this.map.setFilter(filterType);
  }

  // ==========================================
  // VIEW 8: VEHICLE ANALYSIS
  // ==========================================
  renderVehiclesView() {
    const state = DataAdapter.aggregateState(this.filteredOffices);
    const districts = DataAdapter.aggregateDistricts(this.filteredOffices);

    this.setElText('veh-total', state.totalVehicles);
    this.setElText('veh-diesel', state.dieselVehicles);
    this.setElText('veh-petrol', state.petrolVehicles);
    this.setElText('veh-electric', state.electricVehicles);
    this.setElText('veh-old-count', state.vehiclesOver10Years);

    this.charts.renderVehicleFuelChart('chart-vehicle-fuel-donut', state);
    this.charts.renderVehiclesOldAgeChart('chart-vehicles-old-age', districts);

    // Over 10 Years Old Warning List
    const warningList = document.getElementById('vehicles-warning-list');
    if (warningList) {
      const oldOffices = this.filteredOffices.filter(o => o.vehiclesOver10Years > 0).sort((a, b) => b.vehiclesOver10Years - a.vehiclesOver10Years);
      warningList.innerHTML = oldOffices.map(o => `
        <div class="warning-item" onclick="window.RTO_APP.openOfficeProfile('${o.id}')">
          <div class="warning-item-left">
            <i class="fa-solid fa-triangle-exclamation text-danger"></i>
            <div>
              <span class="font-bold text-navy">${o.officeName}</span>
              <span class="text-xs text-muted block">${o.district} District</span>
            </div>
          </div>
          <div class="text-right">
            <span class="badge badge-danger">${o.vehiclesOver10Years} of ${o.totalVehicles} Vehicles > 10 yrs</span>
            <span class="text-xs text-muted block">${o.vehiclesOver10YearsPercent}% of fleet</span>
          </div>
        </div>
      `).join('');
    }

    // Office-wise vehicles table
    const tbody = document.getElementById('vehicles-office-tbody');
    if (tbody) {
      tbody.innerHTML = this.filteredOffices.map(o => `
        <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${o.id}')">
          <td class="font-bold text-navy">${o.officeName}</td>
          <td><span class="badge badge-subtle">${o.district}</span></td>
          <td class="font-bold">${o.totalVehicles}</td>
          <td>${o.dieselVehicles}</td>
          <td>${o.petrolVehicles}</td>
          <td><span class="${o.electricVehicles > 0 ? 'text-success font-bold' : ''}">${o.electricVehicles}</span></td>
          <td class="${o.vehiclesOver10Years > 0 ? 'text-danger font-bold' : ''}">${o.vehiclesOver10Years}</td>
          <td>${o.vehiclesOver10YearsPercent}%</td>
        </tr>
      `).join('');
    }
  }

  // ==========================================
  // VIEW 9: FINANCIAL DUES
  // ==========================================
  renderFinancesView() {
    const state = DataAdapter.aggregateState(this.filteredOffices);
    const districts = DataAdapter.aggregateDistricts(this.filteredOffices);

    this.setElText('fin-total-dues', DataAdapter.formatCurrency(state.totalFinancialDues));
    this.setElText('fin-rent-dues', DataAdapter.formatCurrency(state.rentDues));
    this.setElText('fin-repair-dues', DataAdapter.formatCurrency(state.repairDues));
    this.setElText('fin-fuel-dues', DataAdapter.formatCurrency(state.fuelDues));

    this.charts.renderDistrictFinancialDuesChart('chart-finances-district-bar', districts);

    // Ranking Table - Sorted by highest pending dues
    const tbody = document.getElementById('finances-ranking-tbody');
    if (tbody) {
      const sorted = [...this.filteredOffices].sort((a, b) => b.totalFinancialDues - a.totalFinancialDues);
      tbody.innerHTML = sorted.map(o => `
        <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${o.id}')">
          <td class="font-bold text-navy">${o.officeName}</td>
          <td><span class="badge badge-subtle">${o.district}</span></td>
          <td class="${o.rentDues > 0 ? 'text-danger font-semibold' : ''}">${DataAdapter.formatCurrency(o.rentDues)}</td>
          <td class="${o.repairDues > 0 ? 'text-warning font-semibold' : ''}">${DataAdapter.formatCurrency(o.repairDues)}</td>
          <td class="${o.fuelDues > 0 ? 'text-primary font-semibold' : ''}">${DataAdapter.formatCurrency(o.fuelDues)}</td>
          <td>${DataAdapter.formatCurrency(o.otherExpensesAmount)}</td>
          <td class="font-bold text-danger text-base">${DataAdapter.formatCurrency(o.totalFinancialDues)}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.RTO_APP.showFinancialDrilldownModal('${o.id}')">
              Dues Breakdown
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // ==========================================
  // VIEW 9B: IT INVENTORY & ASSETS
  // ==========================================
  renderItInventoryView() {
    let workingCpu = 0;
    let faultyCpu = 0;
    let totalMonitors = 0;
    let totalLaptops = 0;
    let workingUps = 0;
    let faultyUps = 0;
    let totalBatteries = 0;
    let kswanCount = 0;
    let bsnlCount = 0;
    let otherNetCount = 0;

    // Filter values
    const searchVal = (document.getElementById('it-search-input')?.value || '').trim().toLowerCase();
    const netFilter = document.getElementById('it-filter-network')?.value || 'all';
    const healthFilter = document.getElementById('it-filter-health')?.value || 'all';

    // Summary across all filtered offices
    this.filteredOffices.forEach(o => {
      if (o.itInventory) {
        const it = o.itInventory;
        workingCpu += (it.cpu_working || 0) + (it.aio_working || 0);
        faultyCpu += (it.cpu_not_working || 0) + (it.aio_not_working || 0);
        totalMonitors += (it.monitors_working || 0);
        totalLaptops += (it.laptops_working || 0);
        workingUps += (it.ups_working || 0);
        faultyUps += (it.ups_not_working || 0);
        totalBatteries += (it.batteries_in_use || 0);

        const net = (it.network_provider || '').toUpperCase();
        if (net.includes('KSWAN')) kswanCount++;
        else if (net.includes('BSNL')) bsnlCount++;
        else if (net) otherNetCount++;
      }
    });

    this.setElText('it-kpi-working-cpu', workingCpu.toLocaleString());
    this.setElText('it-kpi-faulty-cpu', `${faultyCpu} Faulty`);
    this.setElText('it-kpi-monitors', totalMonitors.toLocaleString());
    this.setElText('it-kpi-laptops', totalLaptops.toLocaleString());
    this.setElText('it-kpi-working-ups', workingUps.toLocaleString());
    this.setElText('it-kpi-batteries', totalBatteries.toLocaleString());
    this.setElText('it-kpi-faulty-ups', `${faultyUps} Faulty`);
    this.setElText('it-kpi-kswan', kswanCount.toLocaleString());
    this.setElText('it-kpi-bsnl', bsnlCount.toLocaleString());
    this.setElText('it-kpi-other-net', otherNetCount.toLocaleString());

    // Filter table rows
    const tbody = document.getElementById('it-inventory-tbody');
    if (!tbody) return;

    const displayRows = this.filteredOffices.filter(o => {
      const it = o.itInventory;
      // Search filter
      if (searchVal) {
        const matches = o.officeName.toLowerCase().includes(searchVal) ||
          o.district.toLowerCase().includes(searchVal) ||
          (it && (
            (it.officer_in_charge || '').toLowerCase().includes(searchVal) ||
            (it.network_provider || '').toLowerCase().includes(searchVal)
          ));
        if (!matches) return false;
      }

      // Network filter
      if (netFilter !== 'all') {
        if (!it) return false;
        const net = (it.network_provider || '').toUpperCase();
        if (netFilter === 'kswan' && !net.includes('KSWAN')) return false;
        if (netFilter === 'bsnl' && !net.includes('BSNL')) return false;
        if (netFilter === 'other' && (net.includes('KSWAN') || net.includes('BSNL'))) return false;
      }

      // Hardware health filter
      if (healthFilter !== 'all') {
        if (!it) return false;
        const faulty = ((it.cpu_not_working || 0) + (it.aio_not_working || 0) + (it.ups_not_working || 0) + (it.monitors_not_working || 0));
        const aged = (it.systems_above_8yrs || 0);
        if (healthFilter === 'faulty' && faulty === 0) return false;
        if (healthFilter === 'aged' && aged === 0) return false;
        if (healthFilter === 'healthy' && (faulty > 0 || aged > 0)) return false;
      }

      return true;
    });

    if (displayRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center py-6 text-muted">No offices match the selected IT filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = displayRows.map(o => {
      const it = o.itInventory;
      if (!it) {
        return `
          <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${o.id}')">
            <td class="font-bold text-navy">${o.officeName}</td>
            <td><span class="badge badge-subtle">${o.district}</span></td>
            <td colspan="7" class="text-center text-muted text-xs">Survey record pending for this office</td>
            <td>
              <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.RTO_APP.openOfficeProfile('${o.id}')">
                View Office
              </button>
            </td>
          </tr>
        `;
      }

      const cpuWork = (it.cpu_working || 0) + (it.aio_working || 0);
      const cpuFault = (it.cpu_not_working || 0) + (it.aio_not_working || 0);
      const monWork = it.monitors_working || 0;
      const monFault = it.monitors_not_working || 0;
      const lapWork = it.laptops_working || 0;
      const upsWork = it.ups_working || 0;
      const upsFault = it.ups_not_working || 0;
      const batt = it.batteries_in_use || 0;
      const aged = it.systems_above_8yrs || 0;
      const officer = it.officer_in_charge || 'N/A';
      const phone = it.officer_mobile || '';

      const netBadge = (it.network_provider || '').toUpperCase().includes('KSWAN') 
        ? `<span class="badge badge-success">KSWAN</span> <span class="text-xs text-muted">${it.network_speed || ''}</span>`
        : (it.network_provider || '').toUpperCase().includes('BSNL')
          ? `<span class="badge badge-blue">BSNL</span> <span class="text-xs text-muted">${it.network_speed || ''}</span>`
          : `<span class="badge badge-warning">${it.network_provider || 'Leased'}</span>`;

      return `
        <tr class="clickable-row" onclick="window.RTO_APP.openOfficeProfile('${o.id}')">
          <td class="font-bold text-navy">${o.officeName}</td>
          <td><span class="badge badge-subtle">${o.district}</span></td>
          <td>
            <span class="font-bold text-navy">${cpuWork}</span>
            ${cpuFault > 0 ? `<span class="badge badge-danger text-xs ml-1">${cpuFault} Faulty</span>` : ''}
          </td>
          <td>
            <span>${monWork}</span>
            ${monFault > 0 ? `<span class="text-xs text-danger">(${monFault} F)</span>` : ''}
          </td>
          <td><span>${lapWork}</span></td>
          <td>
            <span class="font-semibold">${upsWork}</span>
            ${upsFault > 0 ? `<span class="text-danger text-xs">(${upsFault} F)</span>` : ''}
            <span class="text-xs text-muted block">${batt} Batt</span>
          </td>
          <td>${netBadge}</td>
          <td>
            ${aged > 0 ? `<span class="badge badge-danger font-bold">${aged} Units</span>` : `<span class="text-muted text-xs">0 (&lt;8 Yrs)</span>`}
          </td>
          <td class="text-xs">
            <span class="font-semibold block">${officer}</span>
            ${phone ? `<a href="tel:${phone}" class="tel-link" onclick="event.stopPropagation()">${phone}</a>` : ''}
          </td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.RTO_APP.openOfficeProfile('${o.id}')">
              View Office
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  exportItInventory() {
    const rows = [
      [
        'Office Name',
        'District',
        'Working CPUs',
        'Faulty CPUs',
        'Monitors Working',
        'Monitors Faulty',
        'Laptops',
        'UPS Working',
        'UPS Faulty',
        'Batteries in Use',
        'Network Provider',
        'Network Speed',
        'Aged Systems (>8 Yrs)',
        'Systems 5-8 Yrs',
        'Systems 3-5 Yrs',
        'Systems <3 Yrs',
        'IT Nodal Officer',
        'Nodal Officer Phone'
      ]
    ];

    this.filteredOffices.forEach(o => {
      const it = o.itInventory;
      if (it) {
        rows.push([
          `"${(o.officeName || '').replace(/"/g, '""')}"`,
          `"${(o.district || '').replace(/"/g, '""')}"`,
          (it.cpu_working || 0) + (it.aio_working || 0),
          (it.cpu_not_working || 0) + (it.aio_not_working || 0),
          it.monitors_working || 0,
          it.monitors_not_working || 0,
          it.laptops_working || 0,
          it.ups_working || 0,
          it.ups_not_working || 0,
          it.batteries_in_use || 0,
          `"${(it.network_provider || '').replace(/"/g, '""')}"`,
          `"${(it.network_speed || '').replace(/"/g, '""')}"`,
          it.systems_above_8yrs || 0,
          it.systems_5_to_8yrs || 0,
          it.systems_3_to_5yrs || 0,
          it.systems_below_3yrs || 0,
          `"${(it.officer_in_charge || '').replace(/"/g, '""')}"`,
          `"${(it.officer_mobile || '').replace(/"/g, '""')}"`
        ]);
      } else {
        rows.push([
          `"${(o.officeName || '').replace(/"/g, '""')}"`,
          `"${(o.district || '').replace(/"/g, '""')}"`,
          0, 0, 0, 0, 0, 0, 0, 0,
          '"Survey Pending"',
          '""', 0, 0, 0, 0, '""', '""'
        ]);
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kerala_MVD_IT_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================
  // VIEW 10: PENDENCY & REMARKS SEARCH
  // ==========================================
  renderPendencyView() {
    const container = document.getElementById('pendency-cards-container');
    if (!container) return;

    const kw = this.remarksKeyword.trim().toLowerCase();

    // Compile remarks items from all offices
    let remarksItems = [];
    this.filteredOffices.forEach(o => {
      if (o.rentRemarks && o.rentRemarks.trim() && o.rentRemarks !== 'Nil') {
        remarksItems.push({ office: o, category: 'Rent Pendency', text: o.rentRemarks, amount: o.rentDues, dueFrom: o.rentDueFrom, subOn: o.rentSubmittedOn });
      }
      if (o.repairRemarks && o.repairRemarks.trim() && o.repairRemarks !== 'Nil') {
        remarksItems.push({ office: o, category: 'Repair & Maintenance', text: o.repairRemarks, amount: o.repairDues, dueFrom: o.repairDueFrom, subOn: o.repairSubmittedOn });
      }
      if (o.fuelRemarks && o.fuelRemarks.trim() && o.fuelRemarks !== 'Nil') {
        remarksItems.push({ office: o, category: 'Fuel Bills', text: o.fuelRemarks, amount: o.fuelDues, dueFrom: o.fuelDueFrom, subOn: o.fuelSubmittedOn });
      }
      if (o.cfOtherLocationDetails && o.cfOtherLocationDetails.trim()) {
        remarksItems.push({ office: o, category: 'Test Ground Deficiencies', text: o.cfOtherLocationDetails, amount: 0, dueFrom: '', subOn: '' });
      }
    });

    if (kw) {
      remarksItems = remarksItems.filter(item => 
        item.text.toLowerCase().includes(kw) ||
        item.office.officeName.toLowerCase().includes(kw) ||
        item.office.district.toLowerCase().includes(kw) ||
        item.category.toLowerCase().includes(kw)
      );
    }

    const highlightText = (text, keyword) => {
      if (!keyword) return text;
      const regex = new RegExp(`(${keyword})`, 'gi');
      return text.replace(regex, '<mark class="highlight-kw">$1</mark>');
    };

    if (remarksItems.length === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><p>No remarks or pending issues found matching "${kw}".</p></div>`;
      return;
    }

    container.innerHTML = remarksItems.map(item => `
      <div class="pendency-card" onclick="window.RTO_APP.openOfficeProfile('${item.office.id}')">
        <div class="pendency-card-header">
          <div>
            <span class="badge badge-subtle">${item.office.district}</span>
            <span class="font-bold text-navy ml-2">${item.office.officeName}</span>
          </div>
          <span class="status-pill status-attention">${item.category}</span>
        </div>
        <p class="pendency-text">${highlightText(item.text, kw)}</p>
        <div class="pendency-card-meta">
          ${item.amount > 0 ? `<span class="text-danger font-bold">Amount: ${DataAdapter.formatCurrency(item.amount)}</span>` : ''}
          ${item.dueFrom ? `<span class="text-muted text-xs">Due From: ${item.dueFrom}</span>` : ''}
          ${item.subOn ? `<span class="text-muted text-xs">Submitted: ${item.subOn}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  setRemarksKeyword(keyword) {
    this.remarksKeyword = keyword;
    const input = document.getElementById('remarks-search-input');
    if (input) input.value = keyword;
    this.renderPendencyView();
  }

  // ==========================================
  // VIEW 11: OFFICE COMPARISON
  // ==========================================
  toggleCompareOffice(officeId) {
    const idx = this.comparisonOfficeIds.indexOf(officeId);
    if (idx >= 0) {
      this.comparisonOfficeIds.splice(idx, 1);
    } else {
      if (this.comparisonOfficeIds.length >= 4) {
        alert('You can compare a maximum of 4 offices simultaneously.');
        return;
      }
      this.comparisonOfficeIds.push(officeId);
    }
    this.renderDirectoryTable();
    this.updateCompareCounter();
  }

  updateCompareCounter() {
    const cnt = document.getElementById('compare-badge-count');
    if (cnt) cnt.textContent = this.comparisonOfficeIds.length;
  }

  renderComparisonView() {
    const container = document.getElementById('comparison-container');
    if (!container) return;

    if (this.comparisonOfficeIds.length === 0) {
      // Pick first 2 offices as default
      this.comparisonOfficeIds = this.filteredOffices.slice(0, 2).map(o => o.id);
    }

    const selected = this.allOffices.filter(o => this.comparisonOfficeIds.includes(o.id));
    if (selected.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Please select at least 2 offices to compare.</p></div>`;
      return;
    }

    this.charts.renderOfficeComparisonChart('chart-office-comparison', selected);

    // Build side-by-side comparison table
    const metrics = [
      { label: 'District', get: o => o.district },
      { label: 'Building Type', get: o => o.buildingType },
      { label: 'Office Area', get: o => `${o.totalArea.toLocaleString()} sq ft` },
      { label: 'Total Sanctioned Staff', get: o => o.totalSanctioned },
      { label: 'Total Available Staff', get: o => o.totalAvailable },
      { label: 'Staff Vacancy', get: o => `${o.totalVacancy} (${o.staffVacancyPercent}%)` },
      { label: 'RTO Available', get: o => o.rtoAvailable ? 'Yes' : 'No' },
      { label: 'JRTO Available', get: o => o.jrtoAvailable ? 'Yes' : 'No' },
      { label: 'Own Test Ground', get: o => o.hasOwnGround ? 'Yes' : 'No' },
      { label: 'DL Test Grounds', get: o => o.dlGroundsCount },
      { label: 'CF Test Grounds', get: o => o.cfGroundsCount },
      { label: 'Total Fleet', get: o => o.totalVehicles },
      { label: 'Vehicles > 10 Yrs', get: o => o.vehiclesOver10Years },
      { label: 'Total Financial Dues', get: o => DataAdapter.formatCurrency(o.totalFinancialDues) },
      { label: 'Office Health Score', get: o => `<span class="status-pill ${o.healthScore.statusClass}">${o.healthScore.score}/100</span>` }
    ];

    container.innerHTML = `
      <div class="comparison-offices-selector">
        <label>Selected Offices to Compare (Max 4):</label>
        <div class="comparison-chips">
          ${selected.map(o => `
            <span class="chip-item">
              ${o.officeName}
              <button onclick="window.RTO_APP.toggleCompareOffice('${o.id}'); window.RTO_APP.renderComparisonView();">×</button>
            </span>
          `).join('')}
        </div>
      </div>
      <div class="table-responsive mt-4">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 220px;">Parameter</th>
              ${selected.map(o => `<th>${o.officeName}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${metrics.map(m => `
              <tr>
                <td class="font-bold text-navy">${m.label}</td>
                ${selected.map(o => `<td>${m.get(o)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // VIEW 12: REPORTS & EXPORTS
  // ==========================================
  renderReportsView() {
    this.setElText('report-filtered-count', `${this.filteredOffices.length} Offices Selected`);
    this.setElText('report-timestamp', this.sheetService.lastUpdated || 'Current Session');
  }

  exportCurrentView(format) {
    if (format === 'excel') {
      ReportExporter.exportToExcel(this.filteredOffices, 'MVD_RTO_Inspection_Report');
    } else if (format === 'csv') {
      ReportExporter.exportToCsv(this.filteredOffices, 'MVD_RTO_Inspection_Report');
    } else if (format === 'pdf') {
      ReportExporter.exportToPdf('view-reports', 'MVD_RTO_Inspection_Report');
    }
  }

  // ==========================================
  // MODALS: HEALTH SCORE & FINANCIALS & CONFIG
  // ==========================================
  showHealthScoreModal(officeId) {
    const o = this.allOffices.find(off => off.id === officeId);
    if (!o) return;

    const modal = document.getElementById('modal-health-score');
    const title = document.getElementById('modal-hs-title');
    const scoreVal = document.getElementById('modal-hs-score');
    const ratingVal = document.getElementById('modal-hs-rating');
    const listContainer = document.getElementById('modal-hs-factors-list');

    if (title) title.textContent = `${o.officeName} - Health Score Calculation`;
    if (scoreVal) scoreVal.textContent = `${o.healthScore.score}/100`;
    if (ratingVal) {
      ratingVal.className = `status-pill ${o.healthScore.statusClass}`;
      ratingVal.textContent = o.healthScore.rating;
    }

    if (listContainer) {
      listContainer.innerHTML = o.healthScore.factors.map(f => `
        <div class="factor-row">
          <div class="factor-row-header">
            <span class="font-bold text-navy">${f.category}</span>
            <span class="font-bold ${f.earned === f.weight ? 'text-success' : f.earned > 0 ? 'text-primary' : 'text-danger'}">
              ${f.earned} / ${f.weight} pts
            </span>
          </div>
          <p class="factor-row-desc">${f.description}</p>
        </div>
      `).join('');
    }

    if (modal) modal.classList.remove('hidden');
  }

  showFinancialDrilldownModal(officeId) {
    const o = this.allOffices.find(off => off.id === officeId);
    if (!o) return;

    const modal = document.getElementById('modal-financial-drilldown');
    const title = document.getElementById('modal-fin-title');
    const body = document.getElementById('modal-fin-body');

    if (title) title.textContent = `${o.officeName} - Financial Dues Dossier`;
    if (body) {
      body.innerHTML = `
        <div class="fin-dossier-grid">
          <div class="fin-dossier-card">
            <h4>Rent Dues</h4>
            <div class="amount text-danger">${DataAdapter.formatCurrency(o.rentDues)}</div>
            <p><strong>Due From:</strong> ${o.rentDueFrom || 'N/A'}</p>
            <p><strong>Submitted To Head Office:</strong> ${o.rentSubmittedOn || 'N/A'}</p>
            <p><strong>Remarks:</strong> ${o.rentRemarks || 'Nil'}</p>
          </div>
          <div class="fin-dossier-card">
            <h4>Repair & Maintenance</h4>
            <div class="amount text-warning">${DataAdapter.formatCurrency(o.repairDues)}</div>
            <p><strong>Due From:</strong> ${o.repairDueFrom || 'N/A'}</p>
            <p><strong>Submitted To Head Office:</strong> ${o.repairSubmittedOn || 'N/A'}</p>
            <p><strong>Remarks:</strong> ${o.repairRemarks || 'Nil'}</p>
          </div>
          <div class="fin-dossier-card">
            <h4>Fuel Bills</h4>
            <div class="amount text-primary">${DataAdapter.formatCurrency(o.fuelDues)}</div>
            <p><strong>Due From:</strong> ${o.fuelDueFrom || 'N/A'}</p>
            <p><strong>Submitted To Head Office:</strong> ${o.fuelSubmittedOn || 'N/A'}</p>
            <p><strong>Remarks:</strong> ${o.fuelRemarks || 'Nil'}</p>
          </div>
          <div class="fin-dossier-card">
            <h4>Other Pending Office Expenses</h4>
            <div class="amount text-purple">${DataAdapter.formatCurrency(o.otherExpensesAmount)}</div>
            <p><strong>Details:</strong> ${o.otherExpenses || 'None'}</p>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.remove('hidden');
  }

  openConfigModal() {
    const modal = document.getElementById('modal-sheet-config');
    const modeSelect = document.getElementById('config-source-mode');
    const supabaseUrl = document.getElementById('config-supabase-url');
    const supabaseKey = document.getElementById('config-supabase-key');
    const supabaseTable = document.getElementById('config-supabase-table');
    const supabaseRealtime = document.getElementById('config-supabase-realtime');

    const sheetInput = document.getElementById('config-sheet-id');
    const scriptInput = document.getElementById('config-apps-script-url');

    if (modeSelect) modeSelect.value = this.activeEngine;
    if (supabaseUrl) supabaseUrl.value = this.supabaseService.config.url || '';
    if (supabaseKey) supabaseKey.value = this.supabaseService.config.anonKey || '';
    if (supabaseTable) supabaseTable.value = this.supabaseService.config.tableName || 'rto_offices';
    if (supabaseRealtime) supabaseRealtime.checked = this.supabaseService.config.enableRealtime !== false;

    if (sheetInput) sheetInput.value = this.sheetService.config.sheetIdOrUrl || '';
    if (scriptInput) scriptInput.value = this.sheetService.config.appsScriptUrl || '';

    this.onDatabaseModeChange(this.activeEngine);
    if (modal) modal.classList.remove('hidden');
  }

  onDatabaseModeChange(mode) {
    const secSupabase = document.getElementById('section-config-supabase');
    const secSheet = document.getElementById('section-config-google-sheet');
    const secFile = document.getElementById('section-config-file-upload');

    if (secSupabase) secSupabase.classList.toggle('hidden', mode !== 'supabase');
    if (secSheet) secSheet.classList.toggle('hidden', mode !== 'google_sheet' && mode !== 'apps_script');
    if (secFile) secFile.classList.toggle('hidden', mode !== 'file_upload');
  }

  async saveDatabaseConfig() {
    const modeSelect = document.getElementById('config-source-mode');
    const selectedMode = modeSelect ? modeSelect.value : 'supabase';
    this.activeEngine = selectedMode;

    if (selectedMode === 'supabase') {
      const url = document.getElementById('config-supabase-url')?.value.trim();
      const key = document.getElementById('config-supabase-key')?.value.trim();
      const table = document.getElementById('config-supabase-table')?.value.trim();
      const realtime = document.getElementById('config-supabase-realtime')?.checked;

      this.supabaseService.saveConfig({
        url: url || this.supabaseService.config.url,
        anonKey: key || this.supabaseService.config.anonKey,
        tableName: table || 'rto_offices',
        enableRealtime: realtime !== false
      });
    } else {
      const sheetInput = document.getElementById('config-sheet-id');
      const scriptInput = document.getElementById('config-apps-script-url');

      this.sheetService.saveConfig({
        mode: selectedMode,
        sheetIdOrUrl: sheetInput ? sheetInput.value.trim() : '',
        appsScriptUrl: scriptInput ? scriptInput.value.trim() : ''
      });
    }

    this.closeModal('modal-sheet-config');
    await this.refreshData();
  }

  async useBuiltinSample() {
    this.activeEngine = 'sample';
    this.sheetService.saveConfig({ mode: 'sample' });
    this.closeModal('connection-error-overlay');
    await this.refreshData();
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindDOMEvents() {
    // Navigation clicks
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    // Refresh Button
    const refreshBtn = document.getElementById('btn-refresh-data');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData());
    }

    // Config Button
    const configBtn = document.getElementById('btn-open-config');
    if (configBtn) {
      configBtn.addEventListener('click', () => this.openConfigModal());
    }

    // Global Search Input
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.searchQuery = e.target.value.trim();
        this.applyFilters();
      });
    }

    // Filter controls change
    const bindFilter = (id, prop, isCheckbox = false) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.filters[prop] = isCheckbox ? e.target.checked : e.target.value;
          this.applyFilters();
        });
      }
    };

    bindFilter('filter-district', 'district');
    bindFilter('filter-office', 'office');
    bindFilter('filter-building-type', 'buildingType');
    bindFilter('filter-own-ground', 'ownGround');
    bindFilter('filter-rto-avail', 'rtoAvailable');
    bindFilter('filter-jrto-avail', 'jrtoAvailable');
    bindFilter('filter-staff-shortage', 'staffShortage', true);
    bindFilter('filter-financial-dues', 'financialDues', true);
    bindFilter('filter-old-vehicles', 'oldVehicles', true);

    // Reset Filters button
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // IT Inventory View Filters
    const itSearch = document.getElementById('it-search-input');
    if (itSearch) {
      itSearch.addEventListener('input', () => this.renderItInventoryView());
    }
    const itNet = document.getElementById('it-filter-network');
    if (itNet) {
      itNet.addEventListener('change', () => this.renderItInventoryView());
    }
    const itHealth = document.getElementById('it-filter-health');
    if (itHealth) {
      itHealth.addEventListener('change', () => this.renderItInventoryView());
    }

    // Remarks Search input
    const remarksInput = document.getElementById('remarks-search-input');
    if (remarksInput) {
      remarksInput.addEventListener('input', (e) => {
        this.setRemarksKeyword(e.target.value);
      });
    }

    // File upload handler
    const fileInput = document.getElementById('config-file-upload');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          try {
            await this.sheetService.handleFileUpload(e.target.files[0]);
            this.closeModal('modal-sheet-config');
          } catch (err) {
            alert(`File parsing error: ${err.message}`);
          }
        }
      });
    }

    // Module icon live preview
    const iconInput = document.getElementById('module-edit-icon');
    if (iconInput) {
      iconInput.addEventListener('input', (e) => {
        const preview = document.getElementById('module-icon-preview');
        if (preview) preview.innerHTML = `<i class="fa-solid ${e.target.value.trim()}"></i>`;
      });
    }
  }

  // =========================================================================
  // ADMIN AUTHENTICATION & SESSION MANAGEMENT
  // =========================================================================
  openAdminLoginModal() {
    const alertBox = document.getElementById('admin-login-alert');
    if (alertBox) alertBox.classList.add('hidden');
    const modal = document.getElementById('modal-admin-login');
    if (modal) modal.classList.remove('hidden');
  }

  fillAdminCredentials(email, password) {
    const emailEl = document.getElementById('admin-login-email');
    const passEl = document.getElementById('admin-login-password');
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = password;
  }

  async handleAdminLogin(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('admin-login-email')?.value.trim();
    const password = document.getElementById('admin-login-password')?.value.trim();
    const submitBtn = document.getElementById('btn-submit-admin-login');
    const alertBox = document.getElementById('admin-login-alert');

    if (!email || !password) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
    }

    try {
      const res = await this.supabaseService.verifyAdminLogin(email, password);
      if (res.success) {
        this.adminSession = res.user;
        localStorage.setItem('rto_admin_session', JSON.stringify(res.user));
        this.closeModal('modal-admin-login');
        this.updateAdminUI();
        this.navigateTo('admin');
      } else {
        if (alertBox) {
          alertBox.textContent = res.error || 'Authentication failed. Please verify credentials.';
          alertBox.classList.remove('hidden');
        }
      }
    } catch (err) {
      if (alertBox) {
        alertBox.textContent = `Login error: ${err.message}`;
        alertBox.classList.remove('hidden');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Authenticate & Enter Admin Studio';
      }
    }
  }

  logoutAdmin() {
    this.adminSession = null;
    localStorage.removeItem('rto_admin_session');
    this.updateAdminUI();
    this.navigateTo('dashboard');
  }

  updateAdminUI() {
    const banner = document.getElementById('admin-active-bar');
    const loginBtn = document.getElementById('btn-admin-login');
    const userPill = document.getElementById('admin-user-pill');
    const userName = document.getElementById('admin-user-name');
    const userRole = document.getElementById('admin-user-role');
    const lockBadge = document.getElementById('admin-lock-badge');

    if (this.adminSession) {
      if (banner) banner.classList.remove('hidden');
      if (loginBtn) loginBtn.classList.add('hidden');
      if (userPill) userPill.classList.remove('hidden');
      if (userName) userName.textContent = this.adminSession.full_name || this.adminSession.email;
      if (userRole) userRole.textContent = (this.adminSession.role || 'ADMIN').toUpperCase();
      if (lockBadge) lockBadge.innerHTML = '<i class="fa-solid fa-unlock text-emerald-400"></i>';
    } else {
      if (banner) banner.classList.add('hidden');
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (userPill) userPill.classList.add('hidden');
      if (lockBadge) lockBadge.innerHTML = '<i class="fa-solid fa-lock"></i>';
    }
  }

  // =========================================================================
  // VIEW 12: ADMIN STUDIO (DYNAMIC CMS FOR MODULES, MENUS & FIELDS)
  // =========================================================================
  async renderAdminView() {
    try {
      this.modules = await this.supabaseService.getModules();
      this.menus = await this.supabaseService.getMenus();
      this.fields = await this.supabaseService.getFields();

      // Top Counters
      this.setElText('stat-total-modules', this.modules.length);
      this.setElText('stat-total-menus', this.menus.length);
      this.setElText('stat-total-fields', this.fields.length);

      // Verify active module
      if (!this.selectedModuleId || !this.modules.some(m => m.id === this.selectedModuleId)) {
        this.selectedModuleId = this.modules.length > 0 ? this.modules[0].id : null;
      }

      // Verify active menu
      const currentModuleMenus = this.menus.filter(m => m.module_id === this.selectedModuleId);
      if (!this.selectedMenuId || !currentModuleMenus.some(m => m.id === this.selectedMenuId)) {
        this.selectedMenuId = currentModuleMenus.length > 0 ? currentModuleMenus[0].id : null;
      }

      this.renderModulesCol();
      this.renderMenusCol();
      this.renderFieldsCol();
      this.updateAdminBreadcrumbs();

    } catch (err) {
      console.error('Failed to render Admin Studio:', err);
      const container = document.getElementById('modules-list-container');
      if (container) {
        container.innerHTML = `<div class="alert-box alert-danger">Failed to load CMS schema: ${err.message}</div>`;
      }
    }
  }

  updateAdminBreadcrumbs() {
    const crumbEl = document.getElementById('admin-crumb-trail');
    if (!crumbEl) return;

    const currentMod = this.modules.find(m => m.id === this.selectedModuleId);
    const currentMenu = this.menus.find(m => m.id === this.selectedMenuId);

    const modName = currentMod ? currentMod.name : 'Select Module';
    const menuName = currentMenu ? currentMenu.name : 'Select Menu';
    const fieldCount = currentMenu ? this.fields.filter(f => f.menu_id === currentMenu.id).length : 0;

    crumbEl.innerHTML = `<span>${modName}</span> &gt; <span class="text-primary">${menuName}</span> &gt; <span class="text-success">${fieldCount} Fields</span>`;
  }

  // --- COLUMN 1: MODULES ---
  renderModulesCol() {
    const container = document.getElementById('modules-list-container');
    if (!container) return;

    if (this.modules.length === 0) {
      container.innerHTML = `
        <div class="empty-workbench-notice">
          <i class="fa-solid fa-folder-open"></i>
          <p>No Modules configured yet.<br>Click "+ Add Module" to create the first module.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.modules.map(mod => {
      const isSelected = mod.id === this.selectedModuleId;
      const menuCount = this.menus.filter(m => m.module_id === mod.id).length;
      return `
        <div class="admin-card-item ${isSelected ? 'active' : ''}" onclick="window.RTO_APP.selectModule('${mod.id}')">
          <div class="admin-card-header">
            <div class="card-title-row">
              <i class="fa-solid ${mod.icon || 'fa-folder'} text-primary"></i>
              <span>${mod.name}</span>
            </div>
            <div class="card-actions-row" onclick="event.stopPropagation()">
              <button class="btn-card-action" onclick="window.RTO_APP.openModuleModal('${mod.id}')" title="Edit Module">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-card-action text-danger" onclick="window.RTO_APP.deleteModule('${mod.id}')" title="Delete Module">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="card-code-pill">${mod.code || mod.id}</div>
          <div class="admin-card-desc mt-1">${mod.description || 'No description provided.'}</div>
          <div class="admin-card-footer">
            <span>Order #${mod.display_order || 1}</span>
            <span class="card-counter-pill"><i class="fa-solid fa-list-check"></i> ${menuCount} Menus</span>
          </div>
        </div>
      `;
    }).join('');
  }

  selectModule(moduleId) {
    this.selectedModuleId = moduleId;
    const currentModuleMenus = this.menus.filter(m => m.module_id === moduleId);
    this.selectedMenuId = currentModuleMenus.length > 0 ? currentModuleMenus[0].id : null;
    this.renderModulesCol();
    this.renderMenusCol();
    this.renderFieldsCol();
    this.updateAdminBreadcrumbs();
  }

  openModuleModal(moduleId = null) {
    const titleEl = document.getElementById('modal-module-title');
    const idEl = document.getElementById('module-edit-id');
    const nameEl = document.getElementById('module-edit-name');
    const codeEl = document.getElementById('module-edit-code');
    const iconEl = document.getElementById('module-edit-icon');
    const descEl = document.getElementById('module-edit-desc');
    const orderEl = document.getElementById('module-edit-order');
    const activeEl = document.getElementById('module-edit-active');
    const iconPreview = document.getElementById('module-icon-preview');

    if (moduleId) {
      const mod = this.modules.find(m => m.id === moduleId);
      if (mod) {
        if (titleEl) titleEl.textContent = 'Edit Module';
        if (idEl) idEl.value = mod.id;
        if (nameEl) nameEl.value = mod.name || '';
        if (codeEl) codeEl.value = mod.code || '';
        if (iconEl) iconEl.value = mod.icon || 'fa-folder';
        if (descEl) descEl.value = mod.description || '';
        if (orderEl) orderEl.value = mod.display_order || 1;
        if (activeEl) activeEl.checked = mod.is_active !== false;
        if (iconPreview) iconPreview.innerHTML = `<i class="fa-solid ${mod.icon || 'fa-folder'}"></i>`;
      }
    } else {
      if (titleEl) titleEl.textContent = 'Add New Module';
      if (idEl) idEl.value = '';
      if (nameEl) nameEl.value = '';
      if (codeEl) codeEl.value = '';
      if (iconEl) iconEl.value = 'fa-folder';
      if (descEl) descEl.value = '';
      if (orderEl) orderEl.value = this.modules.length + 1;
      if (activeEl) activeEl.checked = true;
      if (iconPreview) iconPreview.innerHTML = `<i class="fa-solid fa-folder"></i>`;
    }

    const modal = document.getElementById('modal-module-editor');
    if (modal) modal.classList.remove('hidden');
  }

  setModuleIcon(iconClass) {
    const iconEl = document.getElementById('module-edit-icon');
    const preview = document.getElementById('module-icon-preview');
    if (iconEl) iconEl.value = iconClass;
    if (preview) preview.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
  }

  async handleSaveModule(event) {
    if (event) event.preventDefault();
    const id = document.getElementById('module-edit-id')?.value;
    const name = document.getElementById('module-edit-name')?.value.trim();
    const code = document.getElementById('module-edit-code')?.value.trim();
    const icon = document.getElementById('module-edit-icon')?.value.trim();
    const description = document.getElementById('module-edit-desc')?.value.trim();
    const display_order = parseInt(document.getElementById('module-edit-order')?.value, 10) || 1;
    const is_active = document.getElementById('module-edit-active')?.checked;

    if (!name) return;

    try {
      const saved = await this.supabaseService.saveModule({
        id: id || undefined,
        name,
        code,
        icon,
        description,
        display_order,
        is_active
      });

      this.closeModal('modal-module-editor');
      this.selectedModuleId = saved.id;
      await this.renderAdminView();
    } catch (err) {
      alert(`Failed to save module: ${err.message}`);
    }
  }

  async deleteModule(moduleId) {
    const mod = this.modules.find(m => m.id === moduleId);
    if (!confirm(`Are you sure you want to delete module "${mod ? mod.name : moduleId}"?\nThis may also remove its sub-menus and fields.`)) {
      return;
    }

    try {
      await this.supabaseService.deleteModule(moduleId);
      await this.renderAdminView();
    } catch (err) {
      alert(`Failed to delete module: ${err.message}`);
    }
  }

  // --- COLUMN 2: MENUS ---
  renderMenusCol() {
    const container = document.getElementById('menus-list-container');
    const heading = document.getElementById('menus-col-heading');
    const subheading = document.getElementById('menus-col-subheading');
    if (!container) return;

    const currentMod = this.modules.find(m => m.id === this.selectedModuleId);
    if (heading) heading.textContent = currentMod ? `2. ${currentMod.name} Menus` : '2. Menus';
    if (subheading) subheading.textContent = currentMod ? `${currentMod.code} Sub-sections` : 'Select a module';

    const currentMenus = this.menus.filter(m => m.module_id === this.selectedModuleId);

    if (!this.selectedModuleId) {
      container.innerHTML = `
        <div class="empty-workbench-notice">
          <i class="fa-solid fa-arrow-left"></i>
          <p>Select a Module to view & manage its Menus</p>
        </div>
      `;
      return;
    }

    if (currentMenus.length === 0) {
      container.innerHTML = `
        <div class="empty-workbench-notice">
          <i class="fa-solid fa-list-check"></i>
          <p>No sub-menus in this module.<br>Click "+ Add Menu" to create one.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = currentMenus.map(menu => {
      const isSelected = menu.id === this.selectedMenuId;
      const fieldCount = this.fields.filter(f => f.menu_id === menu.id).length;
      return `
        <div class="admin-card-item ${isSelected ? 'active' : ''}" onclick="window.RTO_APP.selectMenu('${menu.id}')">
          <div class="admin-card-header">
            <div class="card-title-row">
              <i class="fa-solid ${menu.icon || 'fa-list-check'} text-warning"></i>
              <span>${menu.name}</span>
            </div>
            <div class="card-actions-row" onclick="event.stopPropagation()">
              <button class="btn-card-action" onclick="window.RTO_APP.openMenuModal('${menu.id}')" title="Edit Menu">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-card-action text-danger" onclick="window.RTO_APP.deleteMenu('${menu.id}')" title="Delete Menu">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="card-code-pill">${menu.code || menu.id}</div>
          <div class="admin-card-desc mt-1">${menu.description || 'No description provided.'}</div>
          <div class="admin-card-footer">
            <span>Route: <code>/${menu.route || menu.id}</code></span>
            <span class="card-counter-pill"><i class="fa-solid fa-pen-ruler"></i> ${fieldCount} Fields</span>
          </div>
        </div>
      `;
    }).join('');
  }

  selectMenu(menuId) {
    this.selectedMenuId = menuId;
    this.renderMenusCol();
    this.renderFieldsCol();
    this.updateAdminBreadcrumbs();
  }

  openMenuModal(menuId = null) {
    const titleEl = document.getElementById('modal-menu-title');
    const idEl = document.getElementById('menu-edit-id');
    const modSelect = document.getElementById('menu-edit-module-id');
    const nameEl = document.getElementById('menu-edit-name');
    const codeEl = document.getElementById('menu-edit-code');
    const routeEl = document.getElementById('menu-edit-route');
    const iconEl = document.getElementById('menu-edit-icon');
    const descEl = document.getElementById('menu-edit-desc');
    const orderEl = document.getElementById('menu-edit-order');
    const activeEl = document.getElementById('menu-edit-active');

    // Populate module dropdown
    if (modSelect) {
      modSelect.innerHTML = this.modules.map(m => `
        <option value="${m.id}" ${m.id === this.selectedModuleId ? 'selected' : ''}>${m.name} (${m.code})</option>
      `).join('');
    }

    if (menuId) {
      const menu = this.menus.find(m => m.id === menuId);
      if (menu) {
        if (titleEl) titleEl.textContent = 'Edit Sub-Menu';
        if (idEl) idEl.value = menu.id;
        if (modSelect) modSelect.value = menu.module_id;
        if (nameEl) nameEl.value = menu.name || '';
        if (codeEl) codeEl.value = menu.code || '';
        if (routeEl) routeEl.value = menu.route || '';
        if (iconEl) iconEl.value = menu.icon || 'fa-list-check';
        if (descEl) descEl.value = menu.description || '';
        if (orderEl) orderEl.value = menu.display_order || 1;
        if (activeEl) activeEl.checked = menu.is_active !== false;
      }
    } else {
      if (titleEl) titleEl.textContent = 'Add New Sub-Menu';
      if (idEl) idEl.value = '';
      if (nameEl) nameEl.value = '';
      if (codeEl) codeEl.value = '';
      if (routeEl) routeEl.value = '';
      if (iconEl) iconEl.value = 'fa-list-check';
      if (descEl) descEl.value = '';
      const currentModuleMenus = this.menus.filter(m => m.module_id === this.selectedModuleId);
      if (orderEl) orderEl.value = currentModuleMenus.length + 1;
      if (activeEl) activeEl.checked = true;
    }

    const modal = document.getElementById('modal-menu-editor');
    if (modal) modal.classList.remove('hidden');
  }

  async handleSaveMenu(event) {
    if (event) event.preventDefault();
    const id = document.getElementById('menu-edit-id')?.value;
    const module_id = document.getElementById('menu-edit-module-id')?.value;
    const name = document.getElementById('menu-edit-name')?.value.trim();
    const code = document.getElementById('menu-edit-code')?.value.trim();
    const route = document.getElementById('menu-edit-route')?.value.trim();
    const icon = document.getElementById('menu-edit-icon')?.value.trim();
    const description = document.getElementById('menu-edit-desc')?.value.trim();
    const display_order = parseInt(document.getElementById('menu-edit-order')?.value, 10) || 1;
    const is_active = document.getElementById('menu-edit-active')?.checked;

    if (!name || !module_id) return;

    try {
      const saved = await this.supabaseService.saveMenu({
        id: id || undefined,
        module_id,
        name,
        code,
        route,
        icon,
        description,
        display_order,
        is_active
      });

      this.closeModal('modal-menu-editor');
      this.selectedModuleId = module_id;
      this.selectedMenuId = saved.id;
      await this.renderAdminView();
    } catch (err) {
      alert(`Failed to save menu: ${err.message}`);
    }
  }

  async deleteMenu(menuId) {
    const menu = this.menus.find(m => m.id === menuId);
    if (!confirm(`Are you sure you want to delete menu "${menu ? menu.name : menuId}"?\nThis may also delete all its associated fields.`)) {
      return;
    }

    try {
      await this.supabaseService.deleteMenu(menuId);
      await this.renderAdminView();
    } catch (err) {
      alert(`Failed to delete menu: ${err.message}`);
    }
  }

  // --- COLUMN 3: FIELDS ---
  renderFieldsCol() {
    const container = document.getElementById('fields-list-container');
    const heading = document.getElementById('fields-col-heading');
    const subheading = document.getElementById('fields-col-subheading');
    if (!container) return;

    const currentMenu = this.menus.find(m => m.id === this.selectedMenuId);
    if (heading) heading.textContent = currentMenu ? `3. ${currentMenu.name} Fields` : '3. Fields';
    if (subheading) subheading.textContent = currentMenu ? `Data keys in ${currentMenu.code}` : 'Select a menu';

    if (!this.selectedMenuId) {
      container.innerHTML = `
        <div class="empty-workbench-notice">
          <i class="fa-solid fa-arrow-left"></i>
          <p>Select a Menu to view, add, or customize its Fields</p>
        </div>
      `;
      return;
    }

    const currentFields = this.fields.filter(f => f.menu_id === this.selectedMenuId);

    if (currentFields.length === 0) {
      container.innerHTML = `
        <div class="empty-workbench-notice">
          <i class="fa-solid fa-pen-ruler"></i>
          <p>No fields configured for this menu yet.<br>Click "+ Add Field" to create your first input field.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = currentFields.map((fld, idx) => {
      const typeClass = `badge-datatype-${fld.data_type || 'text'}`;
      const typeLabel = (fld.data_type || 'text').toUpperCase().replace('_', ' ');
      const gridLabel = fld.grid_width ? fld.grid_width.replace('col-', '') + '/12' : '6/12';

      return `
        <div class="field-card-item">
          <div class="field-order-drag">#${fld.display_order || (idx + 1)}</div>
          <div class="field-main-info">
            <div class="field-label-line">
              <span class="field-label-name">${fld.label}</span>
              ${fld.is_required ? '<span class="field-required-star" title="Mandatory Field">*</span>' : ''}
            </div>
            <div class="field-meta-line">
              <span class="field-key-code"><i class="fa-solid fa-database"></i> ${fld.field_key}</span>
              <span class="badge-datatype ${typeClass}">${typeLabel}</span>
              <span class="badge-grid-width"><i class="fa-solid fa-table-columns"></i> ${gridLabel}</span>
              ${fld.options && fld.options.length > 0 ? `<span class="badge-grid-width">${fld.options.length} options</span>` : ''}
            </div>
          </div>
          <div class="card-actions-row">
            <button class="btn-card-action" onclick="window.RTO_APP.openFieldModal('${fld.id}')" title="Edit Field">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-card-action text-danger" onclick="window.RTO_APP.deleteField('${fld.id}')" title="Delete Field">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  openFieldModal(fieldId = null) {
    const titleEl = document.getElementById('modal-field-title');
    const idEl = document.getElementById('field-edit-id');
    const menuSelect = document.getElementById('field-edit-menu-id');
    const typeSelect = document.getElementById('field-edit-data-type');
    const labelEl = document.getElementById('field-edit-label');
    const keyEl = document.getElementById('field-edit-key');
    const optionsEl = document.getElementById('field-edit-options');
    const placeholderEl = document.getElementById('field-edit-placeholder');
    const defaultEl = document.getElementById('field-edit-default');
    const helpEl = document.getElementById('field-edit-help');
    const gridEl = document.getElementById('field-edit-grid');
    const orderEl = document.getElementById('field-edit-order');
    const requiredEl = document.getElementById('field-edit-required');
    const activeEl = document.getElementById('field-edit-active');

    // Populate menu dropdown with grouped modules
    if (menuSelect) {
      menuSelect.innerHTML = this.menus.map(m => {
        const parentMod = this.modules.find(mod => mod.id === m.module_id);
        const prefix = parentMod ? `[${parentMod.code}] ` : '';
        return `<option value="${m.id}" ${m.id === this.selectedMenuId ? 'selected' : ''}>${prefix}${m.name}</option>`;
      }).join('');
    }

    if (fieldId) {
      const fld = this.fields.find(f => f.id === fieldId);
      if (fld) {
        if (titleEl) titleEl.textContent = 'Edit Dynamic Field';
        if (idEl) idEl.value = fld.id;
        if (menuSelect) menuSelect.value = fld.menu_id;
        if (typeSelect) typeSelect.value = fld.data_type || 'text';
        if (labelEl) labelEl.value = fld.label || '';
        if (keyEl) keyEl.value = fld.field_key || '';
        if (optionsEl) optionsEl.value = Array.isArray(fld.options) ? fld.options.join(', ') : (fld.options || '');
        if (placeholderEl) placeholderEl.value = fld.placeholder || '';
        if (defaultEl) defaultEl.value = fld.default_value || '';
        if (helpEl) helpEl.value = fld.help_text || '';
        if (gridEl) gridEl.value = fld.grid_width || 'col-6';
        if (orderEl) orderEl.value = fld.display_order || 1;
        if (requiredEl) requiredEl.checked = Boolean(fld.is_required);
        if (activeEl) activeEl.checked = fld.is_active !== false;

        this.onDataTypeChange(fld.data_type || 'text');
      }
    } else {
      if (titleEl) titleEl.textContent = 'Add Dynamic Field';
      if (idEl) idEl.value = '';
      if (typeSelect) typeSelect.value = 'text';
      if (labelEl) labelEl.value = '';
      if (keyEl) keyEl.value = '';
      if (optionsEl) optionsEl.value = '';
      if (placeholderEl) placeholderEl.value = '';
      if (defaultEl) defaultEl.value = '';
      if (helpEl) helpEl.value = '';
      if (gridEl) gridEl.value = 'col-6';
      const currentFields = this.fields.filter(f => f.menu_id === this.selectedMenuId);
      if (orderEl) orderEl.value = currentFields.length + 1;
      if (requiredEl) requiredEl.checked = false;
      if (activeEl) activeEl.checked = true;

      this.onDataTypeChange('text');
    }

    const modal = document.getElementById('modal-field-editor');
    if (modal) modal.classList.remove('hidden');
  }

  onDataTypeChange(type) {
    const optionsGroup = document.getElementById('group-field-options');
    if (optionsGroup) {
      optionsGroup.classList.toggle('hidden', type !== 'select');
    }
  }

  autoSuggestFieldKey(label) {
    const keyEl = document.getElementById('field-edit-key');
    const idEl = document.getElementById('field-edit-id');
    // Only auto-suggest if creating new field
    if (keyEl && !idEl?.value) {
      keyEl.value = label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    }
  }

  async handleSaveField(event) {
    if (event) event.preventDefault();
    const id = document.getElementById('field-edit-id')?.value;
    const menu_id = document.getElementById('field-edit-menu-id')?.value;
    const label = document.getElementById('field-edit-label')?.value.trim();
    const field_key = document.getElementById('field-edit-key')?.value.trim();
    const data_type = document.getElementById('field-edit-data-type')?.value;
    const optionsRaw = document.getElementById('field-edit-options')?.value;
    const placeholder = document.getElementById('field-edit-placeholder')?.value.trim();
    const default_value = document.getElementById('field-edit-default')?.value.trim();
    const help_text = document.getElementById('field-edit-help')?.value.trim();
    const grid_width = document.getElementById('field-edit-grid')?.value || 'col-6';
    const display_order = parseInt(document.getElementById('field-edit-order')?.value, 10) || 1;
    const is_required = document.getElementById('field-edit-required')?.checked;
    const is_active = document.getElementById('field-edit-active')?.checked;

    if (!label || !menu_id || !field_key) return;

    try {
      await this.supabaseService.saveField({
        id: id || undefined,
        menu_id,
        label,
        field_key,
        data_type,
        options: optionsRaw,
        placeholder,
        default_value,
        help_text,
        grid_width,
        display_order,
        is_required,
        is_active
      });

      this.closeModal('modal-field-editor');
      this.selectedMenuId = menu_id;
      await this.renderAdminView();
    } catch (err) {
      alert(`Failed to save field: ${err.message}`);
    }
  }

  async deleteField(fieldId) {
    const fld = this.fields.find(f => f.id === fieldId);
    if (!confirm(`Are you sure you want to delete field "${fld ? fld.label : fieldId}"?`)) {
      return;
    }

    try {
      await this.supabaseService.deleteField(fieldId);
      await this.renderAdminView();
    } catch (err) {
      alert(`Failed to delete field: ${err.message}`);
    }
  }

  // --- LIVE DYNAMIC FORM PREVIEW ---
  previewCurrentMenuForm() {
    const currentMenu = this.menus.find(m => m.id === this.selectedMenuId);
    const parentMod = currentMenu ? this.modules.find(m => m.id === currentMenu.module_id) : null;
    const currentFields = this.fields.filter(f => f.menu_id === this.selectedMenuId);

    const titleEl = document.getElementById('modal-preview-title');
    const subtitleEl = document.getElementById('modal-preview-subtitle');
    const container = document.getElementById('preview-form-fields-container');

    if (titleEl) titleEl.textContent = `Form Preview: ${currentMenu ? currentMenu.name : 'Inspection Form'}`;
    if (subtitleEl) subtitleEl.textContent = `Parent Module: ${parentMod ? parentMod.name : 'General'} • Total Fields: ${currentFields.length}`;

    if (!container) return;

    if (currentFields.length === 0) {
      container.innerHTML = `<div class="empty-workbench-notice" style="width: 100%;"><p>No fields configured for this menu yet.</p></div>`;
    } else {
      container.innerHTML = currentFields.map(fld => {
        const gridCol = fld.grid_width || 'col-6';
        const reqStar = fld.is_required ? '<span class="field-required-star">*</span>' : '';
        const help = fld.help_text ? `<span class="text-xs text-muted mt-1 display-block"><i class="fa-solid fa-circle-question"></i> ${fld.help_text}</span>` : '';
        let inputHtml = '';

        switch (fld.data_type) {
          case 'number':
            inputHtml = `<input type="number" class="form-control" placeholder="${fld.placeholder || '0'}" value="${fld.default_value || ''}" ${fld.is_required ? 'required' : ''}>`;
            break;
          case 'currency':
            inputHtml = `
              <div class="input-with-icon-preview">
                <span class="icon-preview-box text-bold" style="left: 12px; right: auto;">₹</span>
                <input type="number" class="form-control" style="padding-left: 32px;" placeholder="${fld.placeholder || '0.00'}" value="${fld.default_value || ''}" ${fld.is_required ? 'required' : ''}>
              </div>
            `;
            break;
          case 'select':
            const opts = Array.isArray(fld.options) ? fld.options : [];
            inputHtml = `
              <select class="form-control" ${fld.is_required ? 'required' : ''}>
                <option value="">-- Choose Option --</option>
                ${opts.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            `;
            break;
          case 'boolean':
            inputHtml = `
              <div class="mt-2">
                <label class="checkbox-label">
                  <input type="checkbox" ${fld.default_value === 'true' ? 'checked' : ''}>
                  <span>Yes / Confirmed</span>
                </label>
              </div>
            `;
            break;
          case 'date':
            inputHtml = `<input type="date" class="form-control" ${fld.is_required ? 'required' : ''}>`;
            break;
          case 'phone':
            inputHtml = `
              <div class="input-with-icon-preview">
                <input type="tel" class="form-control" placeholder="${fld.placeholder || '94470XXXXX'}" value="${fld.default_value || ''}" ${fld.is_required ? 'required' : ''}>
                <span class="icon-preview-box"><i class="fa-solid fa-phone"></i></span>
              </div>
            `;
            break;
          case 'gps_coordinates':
            inputHtml = `
              <div class="input-with-icon-preview">
                <input type="text" class="form-control" placeholder="${fld.placeholder || '8.5241, 76.9366 or Google Maps link'}" value="${fld.default_value || ''}" ${fld.is_required ? 'required' : ''}>
                <span class="icon-preview-box text-danger"><i class="fa-solid fa-location-dot"></i></span>
              </div>
            `;
            break;
          case 'textarea':
            inputHtml = `<textarea class="form-control" rows="3" placeholder="${fld.placeholder || 'Enter remarks or detailed notes...'}" ${fld.is_required ? 'required' : ''}>${fld.default_value || ''}</textarea>`;
            break;
          case 'text':
          default:
            inputHtml = `<input type="text" class="form-control" placeholder="${fld.placeholder || ''}" value="${fld.default_value || ''}" ${fld.is_required ? 'required' : ''}>`;
            break;
        }

        return `
          <div class="form-group ${gridCol}">
            <label class="font-bold">${fld.label} ${reqStar}</label>
            ${inputHtml}
            ${help}
          </div>
        `;
      }).join('');
    }

    const modal = document.getElementById('modal-field-preview');
    if (modal) modal.classList.remove('hidden');
  }

  // =========================================================================
  // OFFICE SURVEY DATA EDITING & LIVE SUPABASE WRITE
  // =========================================================================
  async openEditOfficeModal(officeId = null) {
    this.editingOfficeId = officeId || (this.selectedOffice ? this.selectedOffice.id : null);
    if (!this.editingOfficeId && this.allOffices.length > 0) {
      this.editingOfficeId = this.allOffices[0].id;
    }

    const office = this.allOffices.find(o => o.id === this.editingOfficeId);
    if (!office) {
      alert('Office record not found.');
      return;
    }

    // Ensure modules, menus, fields are loaded
    if (this.modules.length === 0 || this.menus.length === 0 || this.fields.length === 0) {
      try {
        this.modules = await this.supabaseService.getModules();
        this.menus = await this.supabaseService.getMenus();
        this.fields = await this.supabaseService.getFields();
      } catch (e) {
        console.warn('Could not fetch latest CMS schema:', e);
      }
    }

    // Modal title & ID
    const titleEl = document.getElementById('modal-edit-office-title');
    const subtitleEl = document.getElementById('modal-edit-office-subtitle');
    const hiddenIdEl = document.getElementById('edit-office-id');

    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-warning"></i> Edit: ${office.officeName}`;
    if (subtitleEl) subtitleEl.textContent = `District: ${office.district} • Direct PostgreSQL write to Supabase table public.rto_offices`;
    if (hiddenIdEl) hiddenIdEl.value = office.id;

    // Render Module tabs
    this.renderEditOfficeTabs();

    // Render Form Body for active module tab
    this.renderEditOfficeFormBody();

    const modal = document.getElementById('modal-edit-office');
    if (modal) modal.classList.remove('hidden');
  }

  renderEditOfficeTabs() {
    const tabsBar = document.getElementById('edit-office-module-tabs');
    if (!tabsBar) return;

    if (!this.editOfficeActiveModuleId || !this.modules.some(m => m.id === this.editOfficeActiveModuleId)) {
      this.editOfficeActiveModuleId = this.modules.length > 0 ? this.modules[0].id : 'mod_infra';
    }

    tabsBar.innerHTML = this.modules.map(mod => `
      <button type="button" 
              class="modal-tab-btn ${mod.id === this.editOfficeActiveModuleId ? 'active' : ''}" 
              onclick="window.RTO_APP.switchEditOfficeModuleTab('${mod.id}')">
        <i class="fa-solid ${mod.icon || 'fa-folder'}"></i> ${mod.name}
      </button>
    `).join('');
  }

  switchEditOfficeModuleTab(moduleId) {
    this.editOfficeActiveModuleId = moduleId;
    this.renderEditOfficeTabs();
    this.renderEditOfficeFormBody();
  }

  renderEditOfficeFormBody() {
    const bodyEl = document.getElementById('edit-office-form-body');
    if (!bodyEl) return;

    const office = this.allOffices.find(o => o.id === this.editingOfficeId);
    if (!office) return;

    const activeMod = this.modules.find(m => m.id === this.editOfficeActiveModuleId);
    const modMenus = this.menus.filter(m => m.module_id === this.editOfficeActiveModuleId);

    if (modMenus.length === 0) {
      bodyEl.innerHTML = `
        <div class="empty-workbench-notice">
          <i class="fa-solid fa-list-check"></i>
          <p>No sub-sections configured under ${activeMod ? activeMod.name : 'this module'}.</p>
        </div>
      `;
      return;
    }

    bodyEl.innerHTML = modMenus.map(menu => {
      const menuFields = this.fields.filter(f => f.menu_id === menu.id);

      return `
        <div class="edit-menu-section">
          <div class="edit-menu-section-header">
            <i class="fa-solid ${menu.icon || 'fa-list-check'}"></i>
            <span>${menu.name}</span>
            <span class="badge badge-subtle ml-auto text-xs">${menuFields.length} fields</span>
          </div>

          <div class="form-dynamic-grid">
            ${menuFields.length === 0 ? '<p class="text-xs text-muted">No fields configured in this section.</p>' : ''}
            ${menuFields.map(fld => {
              const gridCol = fld.grid_width || 'col-6';
              const reqStar = fld.is_required ? '<span class="field-required-star">*</span>' : '';
              
              // Get current value from office object or rawPayload or customFields
              let currentVal = '';
              const key = fld.field_key;
              if (office[key] !== undefined && office[key] !== null) {
                currentVal = office[key];
              } else if (office.rawPayload && office.rawPayload[key] !== undefined) {
                currentVal = office.rawPayload[key];
              } else if (office.customFields && office.customFields[key] !== undefined) {
                currentVal = office.customFields[key];
              } else {
                currentVal = fld.default_value || '';
              }

              let inputHtml = '';
              switch (fld.data_type) {
                case 'number':
                  inputHtml = `<input type="number" class="form-control" data-key="${key}" data-type="number" value="${currentVal}" placeholder="${fld.placeholder || '0'}" ${fld.is_required ? 'required' : ''}>`;
                  break;
                case 'currency':
                  inputHtml = `
                    <div class="input-with-icon-preview">
                      <span class="icon-preview-box text-bold" style="left: 12px; right: auto;">₹</span>
                      <input type="number" class="form-control" style="padding-left: 32px;" data-key="${key}" data-type="currency" value="${currentVal}" placeholder="${fld.placeholder || '0.00'}" ${fld.is_required ? 'required' : ''}>
                    </div>
                  `;
                  break;
                case 'select':
                  const opts = Array.isArray(fld.options) ? fld.options : [];
                  inputHtml = `
                    <select class="form-control" data-key="${key}" data-type="select" ${fld.is_required ? 'required' : ''}>
                      <option value="">-- Choose Option --</option>
                      ${opts.map(o => `<option value="${o}" ${String(currentVal).toLowerCase() === String(o).toLowerCase() ? 'selected' : ''}>${o}</option>`).join('')}
                    </select>
                  `;
                  break;
                case 'boolean':
                  const isChecked = currentVal === true || currentVal === 'true' || currentVal === 1 || currentVal === 'yes';
                  inputHtml = `
                    <div class="mt-2">
                      <label class="checkbox-label">
                        <input type="checkbox" data-key="${key}" data-type="boolean" ${isChecked ? 'checked' : ''}>
                        <span>Yes / Confirmed</span>
                      </label>
                    </div>
                  `;
                  break;
                case 'date':
                  inputHtml = `<input type="date" class="form-control" data-key="${key}" data-type="date" value="${currentVal}" ${fld.is_required ? 'required' : ''}>`;
                  break;
                case 'phone':
                  inputHtml = `
                    <div class="input-with-icon-preview">
                      <input type="tel" class="form-control" data-key="${key}" data-type="phone" value="${currentVal}" placeholder="${fld.placeholder || '94470XXXXX'}" ${fld.is_required ? 'required' : ''}>
                      <span class="icon-preview-box"><i class="fa-solid fa-phone"></i></span>
                    </div>
                  `;
                  break;
                case 'gps_coordinates':
                  inputHtml = `
                    <div class="input-with-icon-preview">
                      <input type="text" class="form-control" data-key="${key}" data-type="gps_coordinates" value="${currentVal}" placeholder="${fld.placeholder || 'Latitude, Longitude'}" ${fld.is_required ? 'required' : ''}>
                      <span class="icon-preview-box text-danger"><i class="fa-solid fa-location-dot"></i></span>
                    </div>
                  `;
                  break;
                case 'textarea':
                  inputHtml = `<textarea class="form-control" rows="2" data-key="${key}" data-type="textarea" placeholder="${fld.placeholder || 'Remarks...'}" ${fld.is_required ? 'required' : ''}>${currentVal}</textarea>`;
                  break;
                case 'text':
                default:
                  inputHtml = `<input type="text" class="form-control" data-key="${key}" data-type="text" value="${currentVal}" placeholder="${fld.placeholder || ''}" ${fld.is_required ? 'required' : ''}>`;
                  break;
              }

              return `
                <div class="form-group ${gridCol}">
                  <label class="font-bold text-sm">${fld.label} ${reqStar}</label>
                  ${inputHtml}
                  ${fld.help_text ? `<span class="text-xs text-muted mt-1 display-block">${fld.help_text}</span>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  async handleSaveOffice(event) {
    if (event) event.preventDefault();

    const officeId = document.getElementById('edit-office-id')?.value || this.editingOfficeId;
    const submitBtn = document.getElementById('btn-submit-update-office');
    if (!officeId) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving to Supabase...';
    }

    try {
      const inputs = document.querySelectorAll('#edit-office-form [data-key]');
      const updates = {};
      const customUpdates = {};

      const knownCols = new Set([
        'district','office_name','year_of_functioning','building_type','total_office_area',
        'office_gps_raw','office_latitude','office_longitude','has_own_ground','dl_days',
        'cf_days','dl_grounds_count','cf_grounds_count','dl_gps_1_raw','dl_gps_1_lat','dl_gps_1_lng',
        'dl_gps_2_raw','dl_gps_3_raw','cf_gps_1_raw','cf_gps_1_lat','cf_gps_1_lng','cf_gps_2_raw','cf_gps_3_raw',
        'cf_other_location_details','rto_name','rto_mobile','jrto_name','jrto_mobile','landline_pro',
        'rto_available','jrto_available','dtc_name','dtc_mobile','mvi_sanctioned','mvi_available',
        'amvi_sanctioned','amvi_available','ss_sanctioned','ss_available','js_sanctioned','js_available',
        'clerk_sanctioned','clerk_available','ha_pro_sanctioned','ha_pro_available','driver_sanctioned',
        'driver_available','oa_sanctioned','oa_available','pts_available','other_staff_details',
        'vehicles_diesel','vehicles_petrol','vehicles_electric','vehicles_over_10_years','rent_dues_amount',
        'rent_due_from','rent_submitted_on','rent_remarks','repair_dues_amount','repair_due_from',
        'repair_submitted_on','repair_remarks','fuel_dues_amount','fuel_due_from','fuel_submitted_on',
        'fuel_remarks','other_expenses_details','other_expenses_amount'
      ]);

      inputs.forEach(input => {
        const key = input.dataset.key;
        const type = input.dataset.type;
        let val;

        if (type === 'boolean') {
          val = input.checked;
        } else if (type === 'number' || type === 'currency') {
          val = input.value === '' ? null : (parseFloat(input.value) || 0);
        } else {
          val = input.value.trim();
        }

        if (knownCols.has(key)) {
          updates[key] = val;
        } else {
          customUpdates[key] = val;
        }
      });

      if (Object.keys(customUpdates).length > 0) {
        updates.custom_fields = customUpdates;
      }

      await this.supabaseService.updateOffice(officeId, updates);

      this.closeModal('modal-edit-office');

      const updatedOffice = this.allOffices.find(o => o.id === officeId);
      if (updatedOffice) {
        this.selectedOffice = updatedOffice;
        if (this.currentView === 'profile') {
          this.renderProfileView();
        }
      }

      alert(`✓ Successfully updated "${updatedOffice ? updatedOffice.officeName : officeId}" in Supabase PostgreSQL!`);

    } catch (err) {
      console.error('Failed to update office:', err);
      alert(`Error updating office in Supabase: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save &amp; Update in Supabase';
      }
    }
  }

  setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text !== null && text !== undefined ? text : '—';
  }
}

// Instantiate and initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.RTO_APP = new RTOApp();
  window.RTO_APP.init();
});
