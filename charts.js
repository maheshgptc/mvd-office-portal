/**
 * RTO Survey & Monitoring Dashboard - Charting Engine
 * 
 * Powered by Chart.js 4.x
 * Provides responsive, interactive Government MIS visualizations with tooltips,
 * clean palette tokens, animations, and memory-safe recreation.
 */

class DashboardCharts {
  constructor() {
    this.instances = {};
    this.palette = {
      primary: '#1d4ed8',     // Deep Blue
      primaryLight: '#3b82f6',// Bright Blue
      primaryDark: '#0f172a', // Slate Navy
      success: '#10b981',     // Emerald
      successLight: '#34d399',
      warning: '#f59e0b',     // Amber
      warningLight: '#fbbf24',
      danger: '#ef4444',      // Crimson
      dangerLight: '#f87171',
      purple: '#8b5cf6',      // Purple
      cyan: '#06b6d4',        // Cyan
      slate: '#64748b',       // Slate
      grid: 'rgba(226, 232, 240, 0.7)',
      text: '#334155',
      textMuted: '#64748b'
    };
  }

  destroyChart(id) {
    if (this.instances[id]) {
      try {
        this.instances[id].destroy();
      } catch (e) {
        console.warn(`Could not destroy chart ${id}:`, e);
      }
      delete this.instances[id];
    }
  }

  destroyAll() {
    Object.keys(this.instances).forEach(id => this.destroyChart(id));
  }

  /**
   * Executive Dashboard: District Overview Bar Chart
   */
  renderDistrictOverviewChart(canvasId, districts) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = districts.map(d => d.district);
    const sanctioned = districts.map(d => d.totalSanctioned);
    const available = districts.map(d => d.totalAvailable);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sanctioned Staff',
            data: sanctioned,
            backgroundColor: 'rgba(59, 130, 246, 0.85)',
            borderColor: '#2563eb',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Available Staff',
            data: available,
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: '#059669',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } },
          tooltip: {
            callbacks: {
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const dist = districts[idx];
                return [
                  `Vacancy: ${dist.totalVacancy} (${dist.staffVacancyPercent}%)`,
                  `Offices: ${dist.officeCount}`,
                  `Health: ${dist.status}`
                ];
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: this.palette.grid }, beginAtZero: true, title: { display: true, text: 'Number of Personnel' } }
        }
      }
    });
  }

  /**
   * Executive Dashboard: Financial Dues Breakdown Doughnut
   */
  renderFinancialDuesDonut(canvasId, stateData) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Rent Dues', 'Repair & Maintenance', 'Fuel Bills', 'Other Expenses'],
        datasets: [{
          data: [stateData.rentDues, stateData.repairDues, stateData.fuelDues, stateData.otherExpenses],
          backgroundColor: [
            '#ef4444', // Red for rent
            '#f59e0b', // Amber for repair
            '#3b82f6', // Blue for fuel
            '#8b5cf6'  // Purple for other
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } },
          tooltip: {
            callbacks: {
              label: (item) => {
                const val = item.raw;
                const total = stateData.totalFinancialDues || 1;
                const pct = Math.round((val / total) * 100);
                return ` ${item.label}: ${DataAdapter.formatCurrency(val)} (${pct}%)`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  /**
   * Manpower Section: Horizontal Bar Chart - Sanctioned vs Available by Role
   */
  renderManpowerRolesChart(canvasId, offices) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const roles = [
      { key: 'mvi', label: 'Motor Vehicles Inspector (MVI)', s: 0, a: 0 },
      { key: 'amvi', label: 'Asst. MVI (AMVI)', s: 0, a: 0 },
      { key: 'ss', label: 'Senior Superintendent (SS)', s: 0, a: 0 },
      { key: 'js', label: 'Junior Superintendent (JS)', s: 0, a: 0 },
      { key: 'clerk', label: 'Senior Clerk / Clerk', s: 0, a: 0 },
      { key: 'haPro', label: 'Head Assistant / PRO', s: 0, a: 0 },
      { key: 'driver', label: 'Driver', s: 0, a: 0 },
      { key: 'oa', label: 'Office Attendant (OA)', s: 0, a: 0 }
    ];

    offices.forEach(o => {
      roles[0].s += o.mviSanctioned; roles[0].a += o.mviAvailable;
      roles[1].s += o.amviSanctioned; roles[1].a += o.amviAvailable;
      roles[2].s += o.ssSanctioned; roles[2].a += o.ssAvailable;
      roles[3].s += o.jsSanctioned; roles[3].a += o.jsAvailable;
      roles[4].s += o.clerkSanctioned; roles[4].a += o.clerkAvailable;
      roles[5].s += o.haProSanctioned; roles[5].a += o.haProAvailable;
      roles[6].s += o.driverSanctioned; roles[6].a += o.driverAvailable;
      roles[7].s += o.oaSanctioned; roles[7].a += o.oaAvailable;
    });

    const labels = roles.map(r => r.label);
    const sanctioned = roles.map(r => r.s);
    const available = roles.map(r => r.a);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sanctioned Strength',
            data: sanctioned,
            backgroundColor: 'rgba(37, 99, 235, 0.85)',
            borderColor: '#1d4ed8',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Available Strength',
            data: available,
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: '#059669',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } },
          tooltip: {
            callbacks: {
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const r = roles[idx];
                const vac = r.s - r.a;
                const pct = r.s > 0 ? Math.round((vac / r.s) * 100) : 0;
                return [
                  `Vacancy: ${vac} posts`,
                  `Vacancy Rate: ${pct}%`,
                  `Availability: ${100 - pct}%`
                ];
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true, grid: { color: this.palette.grid } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /**
   * Manpower Section: Role Vacancy Percentage Chart
   */
  renderManpowerVacancyChart(canvasId, offices) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const roles = [
      { key: 'mvi', label: 'MVI', s: 0, a: 0 },
      { key: 'amvi', label: 'AMVI', s: 0, a: 0 },
      { key: 'ss', label: 'SS', s: 0, a: 0 },
      { key: 'js', label: 'JS', s: 0, a: 0 },
      { key: 'clerk', label: 'Clerk', s: 0, a: 0 },
      { key: 'haPro', label: 'HA/PRO', s: 0, a: 0 },
      { key: 'driver', label: 'Driver', s: 0, a: 0 },
      { key: 'oa', label: 'OA', s: 0, a: 0 }
    ];

    offices.forEach(o => {
      roles[0].s += o.mviSanctioned; roles[0].a += o.mviAvailable;
      roles[1].s += o.amviSanctioned; roles[1].a += o.amviAvailable;
      roles[2].s += o.ssSanctioned; roles[2].a += o.ssAvailable;
      roles[3].s += o.jsSanctioned; roles[3].a += o.jsAvailable;
      roles[4].s += o.clerkSanctioned; roles[4].a += o.clerkAvailable;
      roles[5].s += o.haProSanctioned; roles[5].a += o.haProAvailable;
      roles[6].s += o.driverSanctioned; roles[6].a += o.driverAvailable;
      roles[7].s += o.oaSanctioned; roles[7].a += o.oaAvailable;
    });

    const labels = roles.map(r => r.label);
    const vacancyPcts = roles.map(r => r.s > 0 ? Math.round(((r.s - r.a) / r.s) * 100) : 0);
    const colors = vacancyPcts.map(p => p > 40 ? '#ef4444' : p > 25 ? '#f59e0b' : '#3b82f6');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Vacancy %',
          data: vacancyPcts,
          backgroundColor: colors,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` Vacancy: ${item.raw}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: this.palette.grid },
            ticks: { callback: v => `${v}%` }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /**
   * Vehicles Section: Fuel Type Donut Chart
   */
  renderVehicleFuelChart(canvasId, stateData) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Diesel Vehicles', 'Petrol Vehicles', 'Electric Vehicles (EV)'],
        datasets: [{
          data: [stateData.dieselVehicles, stateData.petrolVehicles, stateData.electricVehicles],
          backgroundColor: ['#475569', '#3b82f6', '#10b981'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
          tooltip: {
            callbacks: {
              label: (item) => {
                const total = stateData.totalVehicles || 1;
                const pct = Math.round((item.raw / total) * 100);
                return ` ${item.label}: ${item.raw} (${pct}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  /**
   * Vehicles Section: Over 10 Years Old by District Bar Chart
   */
  renderVehiclesOldAgeChart(canvasId, districts) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const filtered = districts.filter(d => d.totalVehicles > 0);
    const labels = filtered.map(d => d.district);
    const oldVehicles = filtered.map(d => d.vehiclesOver10Years);
    const totalVehicles = filtered.map(d => d.totalVehicles);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Vehicles > 10 Yrs Old',
            data: oldVehicles,
            backgroundColor: 'rgba(239, 68, 68, 0.85)',
            borderColor: '#dc2626',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Total Fleet',
            data: totalVehicles,
            backgroundColor: 'rgba(148, 163, 184, 0.45)',
            borderColor: '#94a3b8',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: this.palette.grid } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /**
   * Test Grounds Section: DL vs CF Grounds by District Bar Chart
   */
  renderTestGroundsDistrictChart(canvasId, districts) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = districts.map(d => d.district);
    const dl = districts.map(d => d.totalDLGrounds);
    const cf = districts.map(d => d.totalCFGrounds);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'DL Test Grounds',
            data: dl,
            backgroundColor: 'rgba(59, 130, 246, 0.85)',
            borderRadius: 4
          },
          {
            label: 'CF Test Grounds',
            data: cf,
            backgroundColor: 'rgba(139, 92, 246, 0.85)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: this.palette.grid } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /**
   * Financial Dues Section: District-wise Financial Dues Horizontal Bar
   */
  renderDistrictFinancialDuesChart(canvasId, districts) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Sort by highest dues
    const sorted = [...districts].sort((a, b) => b.totalFinancialDues - a.totalFinancialDues);
    const labels = sorted.map(d => d.district);
    const rent = sorted.map(d => d.rentDues);
    const repair = sorted.map(d => d.repairDues);
    const fuel = sorted.map(d => d.fuelDues);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Rent Dues',
            data: rent,
            backgroundColor: '#ef4444',
            borderRadius: 3
          },
          {
            label: 'Repair & Maintenance',
            data: repair,
            backgroundColor: '#f59e0b',
            borderRadius: 3
          },
          {
            label: 'Fuel Bills',
            data: fuel,
            backgroundColor: '#3b82f6',
            borderRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: { color: this.palette.grid },
            ticks: { callback: v => `₹${(v / 1000).toFixed(0)}k` }
          },
          y: { stacked: true, grid: { display: false } }
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${DataAdapter.formatCurrency(item.raw)}`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                return `Total Dues: ${DataAdapter.formatCurrency(sorted[idx].totalFinancialDues)}`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Office Comparison: Radar or Multi-Bar Chart
   */
  renderOfficeComparisonChart(canvasId, selectedOffices) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = [
      'Staff Availability %',
      'Health Score',
      'DL Grounds',
      'CF Grounds',
      'Total Vehicles',
      'Vehicles <10 Yrs'
    ];

    const colors = [
      { bg: 'rgba(59, 130, 246, 0.7)', border: '#2563eb' },
      { bg: 'rgba(16, 185, 129, 0.7)', border: '#059669' },
      { bg: 'rgba(245, 158, 11, 0.7)', border: '#d97706' },
      { bg: 'rgba(139, 92, 246, 0.7)', border: '#7c3aed' }
    ];

    const datasets = selectedOffices.slice(0, 4).map((off, idx) => {
      const color = colors[idx % colors.length];
      return {
        label: off.officeName,
        data: [
          off.staffAvailabilityPercent,
          off.healthScore.score,
          off.dlGroundsCount * 25, // normalized to 100 scale for comparison
          off.cfGroundsCount * 25,
          Math.min(100, off.totalVehicles * 20),
          Math.min(100, (off.totalVehicles - off.vehiclesOver10Years) * 20)
        ],
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1,
        borderRadius: 4
      };
    });

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: this.palette.grid } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.DashboardCharts = DashboardCharts;
}
