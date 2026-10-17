/**
 * RTO Survey & Monitoring Dashboard - Supabase Realtime Database Service
 * 
 * Primary Database Service connected to Supabase PostgreSQL database:
 * - Direct REST & Realtime synchronization via Supabase-JS SDK
 * - Live subscription to changes in `public.rto_offices`
 * - Bulk import and sync capabilities
 * - LocalStorage configuration persistence
 */

class SupabaseService {
  constructor() {
    this.STORAGE_KEY = 'rto_dashboard_supabase_config';
    this.LAST_SYNC_KEY = 'rto_dashboard_supabase_last_sync';

    // Default configuration for user's MVD DATA PORTAL Supabase Project
    this.DEFAULT_URL = 'https://mghdekancxfqtnfoyfkj.supabase.co';
    this.DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naGRla2FuY3hmcXRuZm95ZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY5MzksImV4cCI6MjEwMDQ0MjkzOX0.wb9ZdBEKQSgmbd-vUFsbnSh3iHFYmAPW4Ywgb8vf4V0';

    this.config = this.loadConfig();
    this.client = null;
    this.channel = null;
    this.listeners = [];
    this.status = 'idle'; // 'idle' | 'loading' | 'connected' | 'error'
    this.lastUpdated = localStorage.getItem(this.LAST_SYNC_KEY) || null;
    this.currentData = [];

    this.initClient();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return {
          url: this.DEFAULT_URL,
          anonKey: this.DEFAULT_ANON_KEY,
          tableName: 'rto_offices',
          enableRealtime: true,
          ...JSON.parse(stored)
        };
      }
    } catch (e) {
      console.warn('Could not read Supabase config from localStorage:', e);
    }

    return {
      url: this.DEFAULT_URL,
      anonKey: this.DEFAULT_ANON_KEY,
      tableName: 'rto_offices',
      enableRealtime: true
    };
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to save Supabase config:', e);
    }
    this.initClient();
  }

  initClient() {
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      console.warn('Supabase JS library not loaded yet.');
      return;
    }

    try {
      this.client = supabase.createClient(this.config.url, this.config.anonKey, {
        auth: { persistSession: false }
      });
      console.log('Supabase client initialized successfully.');
      this.setupRealtimeSubscription();
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      this.status = 'error';
    }
  }

  setupRealtimeSubscription() {
    if (!this.client || !this.config.enableRealtime) return;

    if (this.channel) {
      try {
        this.client.removeChannel(this.channel);
      } catch (e) {}
    }

    this.channel = this.client
      .channel('public:db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: this.config.tableName }, async (payload) => {
        console.log('⚡ Supabase Realtime Change on rto_offices:', payload.eventType);
        await this.loadData(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mvd_it_equipment' }, async (payload) => {
        console.log('⚡ Supabase Realtime Change on mvd_it_equipment:', payload.eventType);
        await this.loadData(true);
      })
      .subscribe((status) => {
        console.log('Supabase Realtime Channel Status:', status);
      });
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
        console.error('Error in listener callback:', err);
      }
    });
  }

  setLastUpdated() {
    this.lastUpdated = new Date().toLocaleString('en-IN', {
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
   * Primary method to load data from Supabase
   */
  async loadData(forceRefresh = false) {
    this.status = 'loading';

    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      this.status = 'error';
      return {
        success: false,
        error: 'Supabase client could not be initialized.',
        data: []
      };
    }

    try {
      // Fetch both rto_offices and mvd_it_equipment in parallel
      const [officesRes, itRes] = await Promise.all([
        this.client
          .from(this.config.tableName)
          .select('*')
          .order('district', { ascending: true })
          .order('office_name', { ascending: true }),
        this.client
          .from('mvd_it_equipment')
          .select('*')
      ]);

      if (officesRes.error) {
        throw new Error(officesRes.error.message);
      }

      const data = officesRes.data;
      if (!data || data.length === 0) {
        throw new Error('No records returned from Supabase rto_offices table.');
      }

      const itItems = itRes.data || [];
      this.itEquipmentData = itItems;

      // Convert Supabase rows to typed OfficeRecord
      const transformedRecords = data.map((row, idx) => {
        // Direct GPS extraction from Supabase table columns (Single Source of Truth)
        let officeGps;
        const oLat = parseFloat(row.office_latitude);
        const oLng = parseFloat(row.office_longitude);
        if (!isNaN(oLat) && !isNaN(oLng) && oLat >= -90 && oLat <= 90 && oLng >= -180 && oLng <= 180) {
          officeGps = {
            valid: true,
            lat: oLat,
            lng: oLng,
            raw: row.office_gps_raw || `${oLat}, ${oLng}`,
            mapsUrl: (row.office_gps_raw && row.office_gps_raw.startsWith('http')) 
              ? row.office_gps_raw 
              : `https://www.google.com/maps?q=${oLat},${oLng}`
          };
        } else {
          officeGps = DataAdapter.extractCoordinates(row.office_gps_raw);
        }

        // DL Ground 1 GPS
        let dlGps1;
        const dlLat = parseFloat(row.dl_gps_1_lat);
        const dlLng = parseFloat(row.dl_gps_1_lng);
        if (!isNaN(dlLat) && !isNaN(dlLng) && dlLat >= -90 && dlLat <= 90 && dlLng >= -180 && dlLng <= 180) {
          dlGps1 = {
            valid: true,
            lat: dlLat,
            lng: dlLng,
            raw: row.dl_gps_1_raw || `${dlLat}, ${dlLng}`,
            mapsUrl: (row.dl_gps_1_raw && row.dl_gps_1_raw.startsWith('http')) 
              ? row.dl_gps_1_raw 
              : `https://www.google.com/maps?q=${dlLat},${dlLng}`
          };
        } else {
          dlGps1 = DataAdapter.extractCoordinates(row.dl_gps_1_raw);
        }

        const dlGps2 = DataAdapter.extractCoordinates(row.dl_gps_2_raw);
        const dlGps3 = DataAdapter.extractCoordinates(row.dl_gps_3_raw);

        // CF Ground 1 GPS
        let cfGps1;
        const cfLat = parseFloat(row.cf_gps_1_lat);
        const cfLng = parseFloat(row.cf_gps_1_lng);
        if (!isNaN(cfLat) && !isNaN(cfLng) && cfLat >= -90 && cfLat <= 90 && cfLng >= -180 && cfLng <= 180) {
          cfGps1 = {
            valid: true,
            lat: cfLat,
            lng: cfLng,
            raw: row.cf_gps_1_raw || `${cfLat}, ${cfLng}`,
            mapsUrl: (row.cf_gps_1_raw && row.cf_gps_1_raw.startsWith('http')) 
              ? row.cf_gps_1_raw 
              : `https://www.google.com/maps?q=${cfLat},${cfLng}`
          };
        } else {
          cfGps1 = DataAdapter.extractCoordinates(row.cf_gps_1_raw);
        }

        const cfGps2 = DataAdapter.extractCoordinates(row.cf_gps_2_raw);
        const cfGps3 = DataAdapter.extractCoordinates(row.cf_gps_3_raw);

        const totalSanctioned = (row.mvi_sanctioned || 0) + (row.amvi_sanctioned || 0) + (row.ss_sanctioned || 0) + 
                                (row.js_sanctioned || 0) + (row.clerk_sanctioned || 0) + (row.ha_pro_sanctioned || 0) + 
                                (row.driver_sanctioned || 0) + (row.oa_sanctioned || 0);

        const totalAvailable = (row.mvi_available || 0) + (row.amvi_available || 0) + (row.ss_available || 0) + 
                               (row.js_available || 0) + (row.clerk_available || 0) + (row.ha_pro_available || 0) + 
                               (row.driver_available || 0) + (row.oa_available || 0);

        const totalVacancy = Math.max(0, totalSanctioned - totalAvailable);
        const staffAvailabilityPercent = totalSanctioned > 0 ? Math.round((totalAvailable / totalSanctioned) * 100) : 100;
        const staffVacancyPercent = totalSanctioned > 0 ? Math.round((totalVacancy / totalSanctioned) * 100) : 0;

        const dieselVehicles = row.vehicles_diesel || 0;
        const petrolVehicles = row.vehicles_petrol || 0;
        const electricVehicles = row.vehicles_electric || 0;
        const totalVehicles = dieselVehicles + petrolVehicles + electricVehicles;
        const vehiclesOver10Years = row.vehicles_over_10_years || 0;
        const vehiclesOver10YearsPercent = totalVehicles > 0 ? Math.round((vehiclesOver10Years / totalVehicles) * 100) : 0;
        const electricVehiclesPercent = totalVehicles > 0 ? Math.round((electricVehicles / totalVehicles) * 100) : 0;

        const rentDues = parseFloat(row.rent_dues_amount || 0);
        const repairDues = parseFloat(row.repair_dues_amount || 0);
        const fuelDues = parseFloat(row.fuel_dues_amount || 0);
        const otherExpensesAmount = parseFloat(row.other_expenses_amount || 0);
        const totalFinancialDues = rentDues + repairDues + fuelDues + otherExpensesAmount;

        // Match IT equipment record
        const itMatch = this.matchOfficeToIt(row, itItems);

        const record = {
          id: row.id || `office-${idx + 1}`,
          index: idx + 1,
          timestamp: row.timestamp || '',
          district: row.district || 'Unknown District',
          officeName: row.office_name || 'Unnamed Office',
          yearOfFunctioning: row.year_of_functioning || 'N/A',
          buildingType: row.building_type || 'Government',
          totalArea: parseFloat(row.total_office_area || 0),
          officeGps,
          hasOwnGround: Boolean(row.has_own_ground),
          dlDays: row.dl_days || 'Not specified',
          cfDays: row.cf_days || 'Not specified',
          dlGroundsCount: parseInt(row.dl_grounds_count || 0, 10),
          cfGroundsCount: parseInt(row.cf_grounds_count || 0, 10),
          dlGps1,
          dlGps2,
          dlGps3,
          cfGps1,
          cfGps2,
          cfGps3,
          cfOtherLocationDetails: row.cf_other_location_details || '',
          rtoName: row.rto_name || 'Not Available',
          rtoMobile: row.rto_mobile || '',
          jrtoName: row.jrto_name || 'Not Available',
          jrtoMobile: row.jrto_mobile || '',
          landlinePro: row.landline_pro || 'Not Available',
          rtoAvailable: Boolean(row.rto_available),
          jrtoAvailable: Boolean(row.jrto_available),
          dtcName: row.dtc_name || 'Not Available',
          dtcMobile: row.dtc_mobile || '',
          mviSanctioned: row.mvi_sanctioned || 0,
          mviAvailable: row.mvi_available || 0,
          mviVacancy: Math.max(0, (row.mvi_sanctioned || 0) - (row.mvi_available || 0)),
          amviSanctioned: row.amvi_sanctioned || 0,
          amviAvailable: row.amvi_available || 0,
          amviVacancy: Math.max(0, (row.amvi_sanctioned || 0) - (row.amvi_available || 0)),
          ssSanctioned: row.ss_sanctioned || 0,
          ssAvailable: row.ss_available || 0,
          ssVacancy: Math.max(0, (row.ss_sanctioned || 0) - (row.ss_available || 0)),
          jsSanctioned: row.js_sanctioned || 0,
          jsAvailable: row.js_available || 0,
          jsVacancy: Math.max(0, (row.js_sanctioned || 0) - (row.js_available || 0)),
          clerkSanctioned: row.clerk_sanctioned || 0,
          clerkAvailable: row.clerk_available || 0,
          clerkVacancy: Math.max(0, (row.clerk_sanctioned || 0) - (row.clerk_available || 0)),
          haProSanctioned: row.ha_pro_sanctioned || 0,
          haProAvailable: row.ha_pro_available || 0,
          haProVacancy: Math.max(0, (row.ha_pro_sanctioned || 0) - (row.ha_pro_available || 0)),
          driverSanctioned: row.driver_sanctioned || 0,
          driverAvailable: row.driver_available || 0,
          driverVacancy: Math.max(0, (row.driver_sanctioned || 0) - (row.driver_available || 0)),
          oaSanctioned: row.oa_sanctioned || 0,
          oaAvailable: row.oa_available || 0,
          oaVacancy: Math.max(0, (row.oa_sanctioned || 0) - (row.oa_available || 0)),
          ptsAvailable: row.pts_available || 0,
          otherStaffDetails: row.other_staff_details || '',
          totalSanctioned,
          totalAvailable,
          totalVacancy,
          staffAvailabilityPercent,
          staffVacancyPercent,
          dieselVehicles,
          petrolVehicles,
          electricVehicles,
          totalVehicles,
          vehiclesOver10Years,
          vehiclesOver10YearsPercent,
          electricVehiclesPercent,
          rentDues,
          rentDueFrom: row.rent_due_from || '',
          rentSubmittedOn: row.rent_submitted_on || '',
          rentRemarks: row.rent_remarks || '',
          repairDues,
          repairDueFrom: row.repair_due_from || '',
          repairSubmittedOn: row.repair_submitted_on || '',
          repairRemarks: row.repair_remarks || '',
          fuelDues,
          fuelDueFrom: row.fuel_due_from || '',
          fuelSubmittedOn: row.fuel_submitted_on || '',
          fuelRemarks: row.fuel_remarks || '',
          otherExpenses: row.other_expenses_details || '',
          otherExpensesAmount,
          totalFinancialDues,
          hasStaffShortage: staffAvailabilityPercent < 75 || ((row.mvi_sanctioned || 0) - (row.mvi_available || 0) > 1),
          hasFinancialDues: totalFinancialDues > 0,
          hasOldVehicles: vehiclesOver10Years > 0,
          isRented: (row.building_type || '').toLowerCase().includes('rent'),
          customFields: row.custom_fields || {},
          // IT Equipment Inventory Data
          itInventory: itMatch || null,
          itTotalComputers: itMatch ? ((itMatch.cpu_working || 0) + (itMatch.aio_working || 0)) : 0,
          itFaultyComputers: itMatch ? ((itMatch.cpu_not_working || 0) + (itMatch.aio_not_working || 0)) : 0,
          itMonitors: itMatch ? (itMatch.monitors_working || 0) : 0,
          itLaptops: itMatch ? (itMatch.laptops_working || 0) : 0,
          itUpsWorking: itMatch ? (itMatch.ups_working || 0) : 0,
          itUpsFaulty: itMatch ? (itMatch.ups_not_working || 0) : 0,
          itNetworkProvider: itMatch ? (itMatch.network_provider || 'Not Specified') : 'Pending Survey',
          itNetworkSpeed: itMatch ? (itMatch.network_speed || 'N/A') : 'N/A',
          itOldSystems: itMatch ? (itMatch.systems_above_8yrs || 0) : 0
        };

        record.healthScore = DataAdapter.calculateHealthScore(record);
        return record;
      });

      this.currentData = transformedRecords;
      this.status = 'connected';
      this.setLastUpdated();

      this.notifyListeners(transformedRecords, {
        source: 'supabase',
        table: this.config.tableName,
        count: transformedRecords.length,
        timestamp: this.lastUpdated
      });

      return {
        success: true,
        data: transformedRecords,
        count: transformedRecords.length,
        timestamp: this.lastUpdated
      };

    } catch (err) {
      console.error('Supabase loadData failure:', err);
      this.status = 'error';
      return {
        success: false,
        error: err.message,
        data: this.currentData || []
      };
    }
  }

  /**
   * Intelligently match an RTO office with its corresponding IT inventory record
   */
  matchOfficeToIt(office, itList = []) {
    if (!itList || itList.length === 0) return null;
    const oName = (office.office_name || '').toLowerCase();
    const oDist = (office.district || '').toLowerCase();
    const isEnforcement = oName.includes('enforcement');

    // 1. Enforcement Offices
    if (isEnforcement) {
      const match = itList.find(it => {
        const itId = (it.id || '').toLowerCase();
        const itName = (it.office_name || '').toLowerCase();
        return (itId.includes('enforcement') || itName.includes('enforcement')) && 
               (itName.includes(oDist) || itId.includes(oDist));
      });
      if (match) return match;
    }

    // 2. KL Code Matching (KL02, KL57, etc.)
    const klMatch = oName.match(/kl\s*(\d+)/i);
    if (klMatch) {
      const klNum = parseInt(klMatch[1], 10);
      const klPadded = 'kl' + (klNum < 10 ? '0' + klNum : klNum);
      const match = itList.find(it => {
        const itId = (it.id || '').toLowerCase();
        const itName = (it.office_name || '').toLowerCase();
        return (itId.startsWith(klPadded + '_') || itName.startsWith(klPadded.toUpperCase() + ' ') || itName.startsWith(klPadded + ' '));
      });
      if (match) return match;
    }

    // 3. DTC Offices (DTC Central Zone I, etc.)
    if (oName.includes('dtc')) {
      const match = itList.find(it => {
        const itId = (it.id || '').toLowerCase();
        const itName = (it.office_name || '').toLowerCase();
        if (oName.includes('central zone i') && (itId.includes('cz_i') || itName.includes('cz i'))) return true;
        if (oName.includes('central zone ii') && (itId.includes('cz_ii') || itName.includes('cz ii'))) return true;
        if (oName.includes('south zone') && (itId.includes('sz') || itName.includes('sz'))) return true;
        if (oName.includes('north zone') && (itId.includes('nz') || itName.includes('nz'))) return true;
        return itName.includes(oDist) || itId.includes(oDist);
      });
      if (match) return match;
    }

    // 4. Fuzzy fallback matching on location keyword
    const cleanTokens = oName.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 3 && !['sub', 'rto', 'office'].includes(t));
    for (const token of cleanTokens) {
      const match = itList.find(it => {
        const target = (it.id + ' ' + it.office_name).toLowerCase();
        return target.includes(token);
      });
      if (match) return match;
    }

    return null;
  }

  /**
   * Calculate Statewide IT Equipment Metrics
   */
  getItSummary() {
    const list = this.currentData || [];
    
    let totalWorkingCpus = 0;
    let totalFaultyCpus = 0;
    let totalMonitors = 0;
    let totalLaptops = 0;
    let totalWorkingUps = 0;
    let totalFaultyUps = 0;
    let totalBatteriesInUse = 0;
    let kswanCount = 0;
    let bsnlCount = 0;
    let otherNetCount = 0;
    let totalOldSystems = 0;
    let coveredOffices = 0;

    list.forEach(o => {
      if (o.itInventory) {
        coveredOffices++;
        const it = o.itInventory;
        totalWorkingCpus += (it.cpu_working || 0) + (it.aio_working || 0);
        totalFaultyCpus += (it.cpu_not_working || 0) + (it.aio_not_working || 0);
        totalMonitors += (it.monitors_working || 0);
        totalLaptops += (it.laptops_working || 0);
        totalWorkingUps += (it.ups_working || 0);
        totalFaultyUps += (it.ups_not_working || 0);
        totalBatteriesInUse += (it.batteries_in_use || 0);
        totalOldSystems += (it.systems_above_8yrs || 0);

        const provider = (it.network_provider || '').toUpperCase();
        if (provider.includes('KSWAN')) kswanCount++;
        else if (provider.includes('BSNL')) bsnlCount++;
        else if (provider) otherNetCount++;
      }
    });

    return {
      coveredOffices,
      totalOffices: list.length,
      totalWorkingCpus,
      totalFaultyCpus,
      totalMonitors,
      totalLaptops,
      totalWorkingUps,
      totalFaultyUps,
      totalBatteriesInUse,
      kswanCount,
      bsnlCount,
      otherNetCount,
      totalOldSystems
    };
  }

  /**
   * Bulk upsert records into Supabase from CSV text or array of objects
   */
  async upsertRecords(records) {
    if (!this.client) this.initClient();
    if (!this.client) throw new Error('Supabase client not ready.');

    const { data, error } = await this.client
      .from(this.config.tableName)
      .upsert(records, { onConflict: 'id' });

    if (error) throw error;
    await this.loadData(true);
    return data;
  }

  /**
   * Update an Office record directly in public.rto_offices
   */
  async updateOffice(officeId, updates) {
    if (!this.client) this.initClient();
    if (!this.client) throw new Error('Supabase client not initialized.');

    const payload = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from(this.config.tableName)
      .update(payload)
      .eq('id', officeId)
      .select();

    if (error) {
      console.error('Supabase updateOffice error:', error);
      throw error;
    }

    // Refresh local cache and trigger realtime state update
    await this.loadData(true);
    return data && data[0] ? data[0] : payload;
  }

  /* =========================================================================
     ADMIN & CMS SCHEMA MANAGEMENT (MODULES -> MENUS -> FIELDS)
     ========================================================================= */

  /**
   * Verify Admin Credentials against portal_users or master admin fallback
   */
  async verifyAdminLogin(email, password) {
    if (!this.client) this.initClient();
    
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    try {
      if (this.client) {
        const { data, error } = await this.client
          .from('portal_users')
          .select('id, email, full_name, role, designation, district, is_active, password')
          .eq('email', trimmedEmail)
          .maybeSingle();

        if (!error && data) {
          if (data.password === trimmedPass || (!data.password && trimmedPass === 'Admin@123')) {
            const user = { ...data };
            delete user.password;
            return { success: true, user };
          } else {
            return { success: false, error: 'Incorrect password for this user.' };
          }
        }
      }
    } catch (e) {
      console.warn('Database user check failed, using fallback check:', e);
    }

    // Master fallback credentials for testing / administrative emergency
    if (
      (trimmedEmail === 'admin' || trimmedEmail === 'admin@kerala.gov.in' || trimmedEmail === 'tc.mvd@kerala.gov.in') &&
      trimmedPass === 'Admin@123'
    ) {
      return {
        success: true,
        user: {
          id: 'usr_tc',
          email: 'tc.mvd@kerala.gov.in',
          full_name: 'Transport Commissioner',
          role: 'super_admin',
          designation: 'Transport Commissioner Kerala',
          district: 'Statewide'
        }
      };
    }

    return { success: false, error: 'Invalid email or password. Please use Admin@123.' };
  }

  // --- MODULES CRUD ---
  async getModules() {
    if (!this.client) this.initClient();
    const { data, error } = await this.client
      .from('app_modules')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async saveModule(moduleData) {
    if (!this.client) this.initClient();
    const id = moduleData.id || `mod_${Date.now()}`;
    const payload = {
      id,
      name: moduleData.name,
      code: (moduleData.code || moduleData.name.toUpperCase().replace(/\s+/g, '_')).trim(),
      icon: moduleData.icon || 'fa-folder',
      description: moduleData.description || '',
      display_order: parseInt(moduleData.display_order, 10) || 1,
      is_active: moduleData.is_active !== undefined ? moduleData.is_active : true,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from('app_modules')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : payload;
  }

  async deleteModule(moduleId) {
    if (!this.client) this.initClient();
    const { error } = await this.client
      .from('app_modules')
      .delete()
      .eq('id', moduleId);
    if (error) throw error;
    return true;
  }

  // --- MENUS CRUD ---
  async getMenus(moduleId = null) {
    if (!this.client) this.initClient();
    let query = this.client
      .from('app_menus')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async saveMenu(menuData) {
    if (!this.client) this.initClient();
    const id = menuData.id || `menu_${Date.now()}`;
    const payload = {
      id,
      module_id: menuData.module_id,
      name: menuData.name,
      code: (menuData.code || menuData.name.toUpperCase().replace(/\s+/g, '_')).trim(),
      icon: menuData.icon || 'fa-list-check',
      route: menuData.route || id,
      description: menuData.description || '',
      display_order: parseInt(menuData.display_order, 10) || 1,
      is_active: menuData.is_active !== undefined ? menuData.is_active : true,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from('app_menus')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : payload;
  }

  async deleteMenu(menuId) {
    if (!this.client) this.initClient();
    const { error } = await this.client
      .from('app_menus')
      .delete()
      .eq('id', menuId);
    if (error) throw error;
    return true;
  }

  // --- FIELDS CRUD ---
  async getFields(menuId = null) {
    if (!this.client) this.initClient();
    let query = this.client
      .from('app_fields')
      .select('*')
      .order('display_order', { ascending: true });

    if (menuId) {
      query = query.eq('menu_id', menuId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async saveField(fieldData) {
    if (!this.client) this.initClient();
    const id = fieldData.id || `fld_${Date.now()}`;
    const payload = {
      id,
      menu_id: fieldData.menu_id,
      label: fieldData.label,
      field_key: (fieldData.field_key || fieldData.label.toLowerCase().replace(/[^a-z0-9_]/g, '_')).trim(),
      data_type: fieldData.data_type || 'text',
      options: Array.isArray(fieldData.options) 
        ? fieldData.options 
        : (fieldData.options ? fieldData.options.split(',').map(s => s.trim()).filter(Boolean) : []),
      default_value: fieldData.default_value || '',
      placeholder: fieldData.placeholder || '',
      help_text: fieldData.help_text || '',
      is_required: Boolean(fieldData.is_required),
      display_order: parseInt(fieldData.display_order, 10) || 1,
      is_active: fieldData.is_active !== undefined ? fieldData.is_active : true,
      grid_width: fieldData.grid_width || 'col-6',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from('app_fields')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : payload;
  }

  async deleteField(fieldId) {
    if (!this.client) this.initClient();
    const { error } = await this.client
      .from('app_fields')
      .delete()
      .eq('id', fieldId);
    if (error) throw error;
    return true;
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.SupabaseService = SupabaseService;
}
