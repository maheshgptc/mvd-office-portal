/**
 * RTO Survey & Monitoring Dashboard - Data Adapter & Analytics Engine
 * 
 * Handles schema translation, robust coordinate parsing, data cleaning,
 * calculated metrics, financial aggregation, and the transparent 0-100 Office Health Score algorithm.
 */

class DataAdapter {
  /**
   * Safely parse integer values with fallback
   */
  static parseIntSafe(val, fallback = 0) {
    if (val === null || val === undefined || val === '') return fallback;
    const cleaned = String(val).replace(/[^0-9-]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? fallback : num;
  }

  /**
   * Safely parse currency and decimal amounts
   */
  static parseCurrencySafe(val, fallback = 0) {
    if (val === null || val === undefined || val === '') return fallback;
    const str = String(val).trim();
    // Remove currency signs, commas, and spaces
    const cleaned = str.replace(/[₹$,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? fallback : num;
  }

  /**
   * Format currency in Indian Rupees format (e.g. ₹1,25,000)
   */
  static formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Parse boolean strings (Yes, No, Y, N, True, False)
   */
  static parseBoolSafe(val, defaultVal = false) {
    if (val === null || val === undefined) return defaultVal;
    const s = String(val).trim().toLowerCase();
    if (['yes', 'y', 'true', '1', 'available'].includes(s)) return true;
    if (['no', 'n', 'false', '0', 'not available'].includes(s)) return false;
    return defaultVal;
  }

  /**
   * Intelligently extract latitude and longitude from text, Google Maps links, or coordinates
   */
  static extractCoordinates(raw) {
    const fallback = {
      valid: false,
      lat: null,
      lng: null,
      raw: raw ? String(raw).trim() : 'Location unavailable',
      mapsUrl: null
    };

    if (!raw) return fallback;
    const text = String(raw).trim();
    if (!text || text.toLowerCase() === 'nil' || text.toLowerCase() === 'na' || text.toLowerCase() === 'n/a') {
      return fallback;
    }

    // Direct Google Maps URL creation
    let mapsUrl = null;
    if (text.startsWith('http://') || text.startsWith('https://')) {
      mapsUrl = text;
    }

    // Pattern 1: Raw Lat, Lng e.g. "8.4912, 76.9538" or "8.4912,76.9538" or "8.4912 76.9538"
    const coordRegex = /([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?))[\s,]+([-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))/;
    
    // Check in URL query params (e.g., ?q=8.4912,76.9538 or &ll=8.4912,76.9538)
    const qMatch = text.match(/[?&](?:q|ll|loc|query)=([-+]?\d+\.\d+),([-+]?\d+\.\d+)/i);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return {
          valid: true,
          lat,
          lng,
          raw: text,
          mapsUrl: mapsUrl || `https://www.google.com/maps?q=${lat},${lng}`
        };
      }
    }

    // Check in URL path (e.g., /@8.4912,76.9538,15z)
    const atMatch = text.match(/@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return {
          valid: true,
          lat,
          lng,
          raw: text,
          mapsUrl: mapsUrl || `https://www.google.com/maps?q=${lat},${lng}`
        };
      }
    }

    // Plain text matching
    const plainMatch = text.match(coordRegex);
    if (plainMatch) {
      const lat = parseFloat(plainMatch[1]);
      const lng = parseFloat(plainMatch[5]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return {
          valid: true,
          lat,
          lng,
          raw: text,
          mapsUrl: mapsUrl || `https://www.google.com/maps?q=${lat},${lng}`
        };
      }
    }

    // If it's a URL like maps.app.goo.gl without visible coords in the string:
    if (mapsUrl) {
      return {
        valid: false, // coordinates cannot be mapped on leaflet without redirect resolution, but link is valid!
        lat: null,
        lng: null,
        raw: text,
        mapsUrl: mapsUrl
      };
    }

    return fallback;
  }

  /**
   * Normalize an array or object row into our strongly-typed OfficeRecord
   */
  static transformRow(row, index = 0) {
    const isArray = Array.isArray(row);
    const getVal = (colIndex, colName) => {
      if (isArray) {
        return row[colIndex] !== undefined ? row[colIndex] : '';
      }
      if (row[colName] !== undefined) {
        return row[colName];
      }
      // Fallback matching
      const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === colName.trim().toLowerCase());
      return foundKey ? row[foundKey] : '';
    };

    const schemaObj = (typeof window !== 'undefined' && window.RTO_SCHEMA) ? window.RTO_SCHEMA : ((typeof global !== 'undefined' && global.RTO_SCHEMA) ? global.RTO_SCHEMA : {});
    const H = schemaObj.HEADERS || [];
    const I = schemaObj.INDICES || {};

    const district = String(getVal(I.DISTRICT, H[I.DISTRICT] || "Select District")).trim() || 'Unknown District';
    const officeName = String(getVal(I.OFFICE_NAME, H[I.OFFICE_NAME] || "Office Name")).trim() || `Office ${index + 1}`;
    const timestamp = String(getVal(I.TIMESTAMP, H[I.TIMESTAMP] || "Timestamp")).trim();
    const yearOfFunctioning = String(getVal(I.YEAR_OF_FUNCTIONING, H[I.YEAR_OF_FUNCTIONING] || "Year of Functioning at Current Office")).trim() || 'Not Available';
    const buildingType = String(getVal(I.BUILDING_TYPE, H[I.BUILDING_TYPE] || "Building Type")).trim() || 'Government';
    const totalArea = this.parseIntSafe(getVal(I.TOTAL_AREA, H[I.TOTAL_AREA] || "Total Office Area (in Square Feet)"), 0);

    // Office GPS
    const officeGps = this.extractCoordinates(getVal(I.OFFICE_GPS, H[I.OFFICE_GPS] || "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office"));

    // Test grounds
    const hasOwnGround = this.parseBoolSafe(getVal(I.OWN_TEST_GROUND, H[I.OWN_TEST_GROUND] || "Do office have own DL,CF test ground?"), false);
    const dlDays = String(getVal(I.DL_DAYS, H[I.DL_DAYS] || "Which all days DL test conducted?")).trim() || 'Not specified';
    const cfDays = String(getVal(I.CF_DAYS, H[I.CF_DAYS] || "Which all days CF test conducted?")).trim() || 'Not specified';
    const dlGroundsCount = this.parseIntSafe(getVal(I.DL_GROUNDS_COUNT, H[I.DL_GROUNDS_COUNT] || "How many DL test grounds/loactions are available?"), hasOwnGround ? 1 : 0);
    const cfGroundsCount = this.parseIntSafe(getVal(I.CF_GROUNDS_COUNT, H[I.CF_GROUNDS_COUNT] || "How many CF test grounds/locations are available?"), hasOwnGround ? 1 : 0);

    const dlGps1 = this.extractCoordinates(getVal(I.DL_GPS_1, H[I.DL_GPS_1]));
    const dlGps2 = this.extractCoordinates(getVal(I.DL_GPS_2, H[I.DL_GPS_2]));
    const dlGps3 = this.extractCoordinates(getVal(I.DL_GPS_3, H[I.DL_GPS_3]));
    const cfGps1 = this.extractCoordinates(getVal(I.CF_GPS_1, H[I.CF_GPS_1]));
    const cfGps2 = this.extractCoordinates(getVal(I.CF_GPS_2, H[I.CF_GPS_2]));
    const cfGps3 = this.extractCoordinates(getVal(I.CF_GPS_3, H[I.CF_GPS_3]));

    const cfOtherLocationDetails = String(getVal(I.CF_OTHER_LOCATION_DETAILS, H[I.CF_OTHER_LOCATION_DETAILS] || "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)")).trim();

    // Officers
    const rtoName = String(getVal(I.RTO_NAME, H[I.RTO_NAME] || "Name of RTO /Name of incharge")).trim() || 'Not Available';
    const rtoMobile = String(getVal(I.RTO_MOBILE, H[I.RTO_MOBILE] || "Official Mobile Number - RTO")).trim();
    const jrtoName = String(getVal(I.JRTO_NAME, H[I.JRTO_NAME] || "Name of JRTO / Name of Incharge")).trim() || 'Not Available';
    const jrtoMobile = String(getVal(I.JRTO_MOBILE, H[I.JRTO_MOBILE] || "Official Mobile Number - JRTO")).trim();
    const landlinePro = String(getVal(I.LANDLINE_PRO, H[I.LANDLINE_PRO] || "Landline Number/Office Mobile No/ PRO Contact")).trim() || 'Not Available';
    const rtoAvailable = this.parseBoolSafe(getVal(I.RTO_AVAILABLE, H[I.RTO_AVAILABLE]), true);
    const jrtoAvailable = this.parseBoolSafe(getVal(I.JRTO_AVAILABLE, H[I.JRTO_AVAILABLE]), true);

    const dtcName = String(getVal(I.DTC_NAME, H[I.DTC_NAME] || "Name Of DTC/In Charge")).trim() || 'Not Available';
    const dtcMobile = String(getVal(I.DTC_MOBILE, H[I.DTC_MOBILE] || "Official Mobile Number - DTC/In charge")).trim();

    // Staff strengths
    const mviSanctioned = this.parseIntSafe(getVal(I.MVI_SANCTIONED, H[I.MVI_SANCTIONED]));
    const mviAvailable = this.parseIntSafe(getVal(I.MVI_AVAILABLE, H[I.MVI_AVAILABLE]));
    const mviVacancy = Math.max(0, mviSanctioned - mviAvailable);

    const amviSanctioned = this.parseIntSafe(getVal(I.AMVI_SANCTIONED, H[I.AMVI_SANCTIONED]));
    const amviAvailable = this.parseIntSafe(getVal(I.AMVI_AVAILABLE, H[I.AMVI_AVAILABLE]));
    const amviVacancy = Math.max(0, amviSanctioned - amviAvailable);

    const ssSanctioned = this.parseIntSafe(getVal(I.SS_SANCTIONED, H[I.SS_SANCTIONED]));
    const ssAvailable = this.parseIntSafe(getVal(I.SS_AVAILABLE, H[I.SS_AVAILABLE]));
    const ssVacancy = Math.max(0, ssSanctioned - ssAvailable);

    const jsSanctioned = this.parseIntSafe(getVal(I.JS_SANCTIONED, H[I.JS_SANCTIONED]));
    const jsAvailable = this.parseIntSafe(getVal(I.JS_AVAILABLE, H[I.JS_AVAILABLE]));
    const jsVacancy = Math.max(0, jsSanctioned - jsAvailable);

    const clerkSanctioned = this.parseIntSafe(getVal(I.CLERK_SANCTIONED, H[I.CLERK_SANCTIONED]));
    const clerkAvailable = this.parseIntSafe(getVal(I.CLERK_AVAILABLE, H[I.CLERK_AVAILABLE]));
    const clerkVacancy = Math.max(0, clerkSanctioned - clerkAvailable);

    const haProSanctioned = this.parseIntSafe(getVal(I.HA_PRO_SANCTIONED, H[I.HA_PRO_SANCTIONED]));
    const haProAvailable = this.parseIntSafe(getVal(I.HA_PRO_AVAILABLE, H[I.HA_PRO_AVAILABLE]));
    const haProVacancy = Math.max(0, haProSanctioned - haProAvailable);

    const driverSanctioned = this.parseIntSafe(getVal(I.DRIVER_SANCTIONED, H[I.DRIVER_SANCTIONED]));
    const driverAvailable = this.parseIntSafe(getVal(I.DRIVER_AVAILABLE, H[I.DRIVER_AVAILABLE]));
    const driverVacancy = Math.max(0, driverSanctioned - driverAvailable);

    const oaSanctioned = this.parseIntSafe(getVal(I.OA_SANCTIONED, H[I.OA_SANCTIONED]));
    const oaAvailable = this.parseIntSafe(getVal(I.OA_AVAILABLE, H[I.OA_AVAILABLE]));
    const oaVacancy = Math.max(0, oaSanctioned - oaAvailable);

    const ptsAvailable = this.parseIntSafe(getVal(I.PTS_AVAILABLE, H[I.PTS_AVAILABLE]), 0);
    const otherStaffDetails = String(getVal(I.OTHER_STAFF_DETAILS, H[I.OTHER_STAFF_DETAILS])).trim();

    // Total manpower calculations
    const totalSanctioned = mviSanctioned + amviSanctioned + ssSanctioned + jsSanctioned + clerkSanctioned + haProSanctioned + driverSanctioned + oaSanctioned;
    const totalAvailable = mviAvailable + amviAvailable + ssAvailable + jsAvailable + clerkAvailable + haProAvailable + driverAvailable + oaAvailable;
    const totalVacancy = Math.max(0, totalSanctioned - totalAvailable);
    const staffAvailabilityPercent = totalSanctioned > 0 ? Math.round((totalAvailable / totalSanctioned) * 100) : 100;
    const staffVacancyPercent = totalSanctioned > 0 ? Math.round((totalVacancy / totalSanctioned) * 100) : 0;

    // Vehicles
    const dieselVehicles = this.parseIntSafe(getVal(I.VEHICLES_DIESEL, H[I.VEHICLES_DIESEL]));
    const petrolVehicles = this.parseIntSafe(getVal(I.VEHICLES_PETROL, H[I.VEHICLES_PETROL]));
    const electricVehicles = this.parseIntSafe(getVal(I.VEHICLES_ELECTRIC, H[I.VEHICLES_ELECTRIC]));
    const vehiclesOver10Years = this.parseIntSafe(getVal(I.VEHICLES_OVER_10_YEARS, H[I.VEHICLES_OVER_10_YEARS]));
    const totalVehicles = dieselVehicles + petrolVehicles + electricVehicles;
    const vehiclesOver10YearsPercent = totalVehicles > 0 ? Math.round((vehiclesOver10Years / totalVehicles) * 100) : 0;
    const electricVehiclesPercent = totalVehicles > 0 ? Math.round((electricVehicles / totalVehicles) * 100) : 0;

    // Financial Dues
    const rentDues = this.parseCurrencySafe(getVal(I.RENT_DUES_AMOUNT, H[I.RENT_DUES_AMOUNT]));
    const rentDueFrom = String(getVal(I.RENT_DUE_FROM, H[I.RENT_DUE_FROM])).trim();
    const rentSubmittedOn = String(getVal(I.RENT_BILLS_SUBMITTED_ON, H[I.RENT_BILLS_SUBMITTED_ON])).trim();
    const rentRemarks = String(getVal(I.RENT_REMARKS, H[I.RENT_REMARKS])).trim();

    const repairDues = this.parseCurrencySafe(getVal(I.REPAIR_DUES_AMOUNT, H[I.REPAIR_DUES_AMOUNT]));
    const repairDueFrom = String(getVal(I.REPAIR_DUE_FROM, H[I.REPAIR_DUE_FROM])).trim();
    const repairSubmittedOn = String(getVal(I.REPAIR_BILLS_SUBMITTED_ON, H[I.REPAIR_BILLS_SUBMITTED_ON])).trim();
    const repairRemarks = String(getVal(I.REPAIR_REMARKS, H[I.REPAIR_REMARKS])).trim();

    const fuelDues = this.parseCurrencySafe(getVal(I.FUEL_DUES_AMOUNT, H[I.FUEL_DUES_AMOUNT]));
    const fuelDueFrom = String(getVal(I.FUEL_DUE_FROM, H[I.FUEL_DUE_FROM])).trim();
    const fuelSubmittedOn = String(getVal(I.FUEL_BILLS_SUBMITTED_ON, H[I.FUEL_BILLS_SUBMITTED_ON])).trim();
    const fuelRemarks = String(getVal(I.FUEL_REMARKS, H[I.FUEL_REMARKS])).trim();

    const otherExpenses = String(getVal(I.OTHER_EXPENSES_PENDING, H[I.OTHER_EXPENSES_PENDING])).trim();
    const otherExpensesAmount = this.parseCurrencySafe(otherExpenses);

    const totalFinancialDues = rentDues + repairDues + fuelDues + (otherExpensesAmount > 0 ? otherExpensesAmount : 0);

    const record = {
      id: `office-${index + 1}-${district.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${officeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      index: index + 1,
      timestamp,
      district,
      officeName,
      yearOfFunctioning,
      buildingType,
      totalArea,
      officeGps,
      hasOwnGround,
      dlDays,
      cfDays,
      dlGroundsCount,
      cfGroundsCount,
      dlGps1,
      dlGps2,
      dlGps3,
      cfGps1,
      cfGps2,
      cfGps3,
      cfOtherLocationDetails,
      rtoName,
      rtoMobile,
      jrtoName,
      jrtoMobile,
      landlinePro,
      rtoAvailable,
      jrtoAvailable,
      dtcName,
      dtcMobile,
      // Staff strengths
      mviSanctioned,
      mviAvailable,
      mviVacancy,
      amviSanctioned,
      amviAvailable,
      amviVacancy,
      ssSanctioned,
      ssAvailable,
      ssVacancy,
      jsSanctioned,
      jsAvailable,
      jsVacancy,
      clerkSanctioned,
      clerkAvailable,
      clerkVacancy,
      haProSanctioned,
      haProAvailable,
      haProVacancy,
      driverSanctioned,
      driverAvailable,
      driverVacancy,
      oaSanctioned,
      oaAvailable,
      oaVacancy,
      ptsAvailable,
      otherStaffDetails,
      totalSanctioned,
      totalAvailable,
      totalVacancy,
      staffAvailabilityPercent,
      staffVacancyPercent,
      // Vehicles
      dieselVehicles,
      petrolVehicles,
      electricVehicles,
      totalVehicles,
      vehiclesOver10Years,
      vehiclesOver10YearsPercent,
      electricVehiclesPercent,
      // Financials
      rentDues,
      rentDueFrom,
      rentSubmittedOn,
      rentRemarks,
      repairDues,
      repairDueFrom,
      repairSubmittedOn,
      repairRemarks,
      fuelDues,
      fuelDueFrom,
      fuelSubmittedOn,
      fuelRemarks,
      otherExpenses,
      otherExpensesAmount,
      totalFinancialDues,
      // Flags for fast filtering
      hasStaffShortage: staffAvailabilityPercent < 75 || mviVacancy > 1 || amviVacancy > 1,
      hasFinancialDues: totalFinancialDues > 0,
      hasOldVehicles: vehiclesOver10Years > 0,
      isRented: buildingType.toLowerCase().includes('rent')
    };

    // Calculate transparent Office Health Score
    record.healthScore = this.calculateHealthScore(record);

    return record;
  }

  /**
   * Transparent 0-100 Office Health Score Algorithm
   */
  static calculateHealthScore(office) {
    const factors = [];

    // 1. Staff Availability (Weight: 30 pts)
    // 100% staff -> 30 pts; 50% staff -> 15 pts
    const staffRatio = office.totalSanctioned > 0 ? (office.totalAvailable / office.totalSanctioned) : 1.0;
    const staffScore = Math.round(Math.min(30, Math.max(0, staffRatio * 30)));
    factors.push({
      category: 'Staff Availability',
      weight: 30,
      earned: staffScore,
      description: `${office.totalAvailable} of ${office.totalSanctioned} sanctioned staff available (${office.staffAvailabilityPercent}%)`
    });

    // 2. Leadership Presence (Weight: 20 pts)
    // RTO available: 10 pts, JRTO available: 10 pts
    let leadershipScore = 0;
    if (office.rtoAvailable) leadershipScore += 10;
    if (office.jrtoAvailable) leadershipScore += 10;
    factors.push({
      category: 'Key Leadership Availability',
      weight: 20,
      earned: leadershipScore,
      description: `RTO ${office.rtoAvailable ? 'Available (+10)' : 'Vacant (0)'}, JRTO ${office.jrtoAvailable ? 'Available (+10)' : 'Vacant (0)'}`
    });

    // 3. Test Ground Availability (Weight: 15 pts)
    // Has own ground: 15 pts; Rented/shared: 10 pts; Roadside/None: 4 pts
    let groundScore = 0;
    let groundDesc = '';
    if (office.hasOwnGround) {
      groundScore = 15;
      groundDesc = 'Office possesses own dedicated DL & CF test grounds (+15)';
    } else if (office.cfOtherLocationDetails && office.cfOtherLocationDetails.toLowerCase().includes('road')) {
      groundScore = 4;
      groundDesc = 'Conducting tests on roadside/bypass shoulder due to lack of ground (+4)';
    } else {
      groundScore = 10;
      groundDesc = 'Testing conducted on temporary / leased / trust grounds (+10)';
    }
    factors.push({
      category: 'Testing Infrastructure',
      weight: 15,
      earned: groundScore,
      description: groundDesc
    });

    // 4. Vehicle Fleet Condition (Weight: 15 pts)
    // 0 old vehicles -> 15 pts; Penalize based on percentage of old vehicles
    let vehicleScore = 15;
    if (office.totalVehicles > 0) {
      const oldRatio = office.vehiclesOver10Years / office.totalVehicles;
      vehicleScore = Math.max(0, Math.round(15 * (1 - oldRatio)));
    }
    factors.push({
      category: 'Vehicle Fleet Age',
      weight: 15,
      earned: vehicleScore,
      description: `${office.vehiclesOver10Years} of ${office.totalVehicles} vehicles are over 10 years old (${office.vehiclesOver10YearsPercent}%)`
    });

    // 5. Financial Pendency (Weight: 10 pts)
    // 0 dues -> 10 pts; dues > ₹3L -> 0 pts
    let financialScore = 10;
    if (office.totalFinancialDues > 300000) {
      financialScore = 0;
    } else if (office.totalFinancialDues > 150000) {
      financialScore = 3;
    } else if (office.totalFinancialDues > 50000) {
      financialScore = 6;
    } else if (office.totalFinancialDues > 0) {
      financialScore = 8;
    }
    factors.push({
      category: 'Financial Dues & Bills',
      weight: 10,
      earned: financialScore,
      description: `Total pending dues: ${this.formatCurrency(office.totalFinancialDues)}`
    });

    // 6. Building & Facility Status (Weight: 10 pts)
    // Government owned: 10 pts; Rented with no dues: 8 pts; Rented with pending rent > 1L: 3 pts
    let buildingScore = 10;
    let bldgDesc = 'Government owned permanent office premises (+10)';
    if (office.buildingType.toLowerCase().includes('rent')) {
      if (office.rentDues > 100000) {
        buildingScore = 3;
        bldgDesc = `Rented building with serious rent arrears (${this.formatCurrency(office.rentDues)}) (+3)`;
      } else {
        buildingScore = 7;
        bldgDesc = 'Rented building with manageable rent status (+7)';
      }
    }
    factors.push({
      category: 'Building & Premises',
      weight: 10,
      earned: buildingScore,
      description: bldgDesc
    });

    const totalScore = staffScore + leadershipScore + groundScore + vehicleScore + financialScore + buildingScore;

    let rating = 'Critical';
    let statusClass = 'status-critical';
    let badgeColor = '#ef4444';

    if (totalScore >= 80) {
      rating = 'Excellent';
      statusClass = 'status-healthy';
      badgeColor = '#10b981';
    } else if (totalScore >= 65) {
      rating = 'Good';
      statusClass = 'status-good';
      badgeColor = '#3b82f6';
    } else if (totalScore >= 45) {
      rating = 'Needs Attention';
      statusClass = 'status-attention';
      badgeColor = '#f59e0b';
    }

    return {
      score: totalScore,
      rating,
      statusClass,
      badgeColor,
      factors
    };
  }

  /**
   * Aggregate district-level statistics
   */
  static aggregateDistricts(offices) {
    const map = new Map();

    offices.forEach(office => {
      const d = office.district;
      if (!map.has(d)) {
        map.set(d, {
          district: d,
          officeCount: 0,
          totalArea: 0,
          totalSanctioned: 0,
          totalAvailable: 0,
          totalVacancy: 0,
          totalDLGrounds: 0,
          totalCFGrounds: 0,
          totalVehicles: 0,
          vehiclesOver10Years: 0,
          totalFinancialDues: 0,
          rentDues: 0,
          repairDues: 0,
          fuelDues: 0,
          officesWithOwnGround: 0,
          officesWithoutOwnGround: 0,
          officesWithShortage: 0,
          officesWithOldVehicles: 0,
          healthScores: [],
          offices: []
        });
      }

      const agg = map.get(d);
      agg.officeCount++;
      agg.totalArea += office.totalArea;
      agg.totalSanctioned += office.totalSanctioned;
      agg.totalAvailable += office.totalAvailable;
      agg.totalVacancy += office.totalVacancy;
      agg.totalDLGrounds += office.dlGroundsCount;
      agg.totalCFGrounds += office.cfGroundsCount;
      agg.totalVehicles += office.totalVehicles;
      agg.vehiclesOver10Years += office.vehiclesOver10Years;
      agg.totalFinancialDues += office.totalFinancialDues;
      agg.rentDues += office.rentDues;
      agg.repairDues += office.repairDues;
      agg.fuelDues += office.fuelDues;

      if (office.hasOwnGround) agg.officesWithOwnGround++;
      else agg.officesWithoutOwnGround++;

      if (office.hasStaffShortage) agg.officesWithShortage++;
      if (office.vehiclesOver10Years > 0) agg.officesWithOldVehicles++;

      agg.healthScores.push(office.healthScore.score);
      agg.offices.push(office);
    });

    const districts = Array.from(map.values()).map(d => {
      const avgScore = d.healthScores.length ? Math.round(d.healthScores.reduce((a, b) => a + b, 0) / d.healthScores.length) : 0;
      const staffAvailabilityPercent = d.totalSanctioned > 0 ? Math.round((d.totalAvailable / d.totalSanctioned) * 100) : 100;
      const staffVacancyPercent = d.totalSanctioned > 0 ? Math.round((d.totalVacancy / d.totalSanctioned) * 100) : 0;

      let status = 'Critical';
      let statusClass = 'status-critical';
      if (avgScore >= 75 && staffAvailabilityPercent >= 75) {
        status = 'Healthy';
        statusClass = 'status-healthy';
      } else if (avgScore >= 55) {
        status = 'Attention Required';
        statusClass = 'status-attention';
      }

      return {
        ...d,
        avgHealthScore: avgScore,
        staffAvailabilityPercent,
        staffVacancyPercent,
        status,
        statusClass
      };
    });

    // Sort alphabetically by district name
    return districts.sort((a, b) => a.district.localeCompare(b.district));
  }

  /**
   * Aggregate state-level executive summary KPIs
   */
  static aggregateState(offices) {
    const totalOffices = offices.length;
    const districtsSet = new Set(offices.map(o => o.district));
    const totalDistricts = districtsSet.size;

    let totalArea = 0;
    let totalSanctioned = 0;
    let totalAvailable = 0;
    let totalDLGrounds = 0;
    let totalCFGrounds = 0;
    let totalVehicles = 0;
    let dieselVehicles = 0;
    let petrolVehicles = 0;
    let electricVehicles = 0;
    let vehiclesOver10Years = 0;
    let totalFinancialDues = 0;
    let rentDues = 0;
    let repairDues = 0;
    let fuelDues = 0;
    let otherExpenses = 0;
    let officesWithOwnGround = 0;
    let officesWithoutOwnGround = 0;
    let rtoAvailableCount = 0;
    let jrtoAvailableCount = 0;
    let officesWithStaffShortage = 0;
    let officesWithFinancialDues = 0;
    let officesWithOldVehicles = 0;
    let sumHealthScore = 0;

    offices.forEach(o => {
      totalArea += o.totalArea;
      totalSanctioned += o.totalSanctioned;
      totalAvailable += o.totalAvailable;
      totalDLGrounds += o.dlGroundsCount;
      totalCFGrounds += o.cfGroundsCount;
      totalVehicles += o.totalVehicles;
      dieselVehicles += o.dieselVehicles;
      petrolVehicles += o.petrolVehicles;
      electricVehicles += o.electricVehicles;
      vehiclesOver10Years += o.vehiclesOver10Years;
      totalFinancialDues += o.totalFinancialDues;
      rentDues += o.rentDues;
      repairDues += o.repairDues;
      fuelDues += o.fuelDues;
      otherExpenses += o.otherExpensesAmount;

      if (o.hasOwnGround) officesWithOwnGround++;
      else officesWithoutOwnGround++;

      if (o.rtoAvailable) rtoAvailableCount++;
      if (o.jrtoAvailable) jrtoAvailableCount++;

      if (o.hasStaffShortage) officesWithStaffShortage++;
      if (o.hasFinancialDues) officesWithFinancialDues++;
      if (o.hasOldVehicles) officesWithOldVehicles++;

      sumHealthScore += o.healthScore.score;
    });

    const totalVacancy = Math.max(0, totalSanctioned - totalAvailable);
    const staffAvailabilityPercent = totalSanctioned > 0 ? Math.round((totalAvailable / totalSanctioned) * 100) : 100;
    const staffVacancyPercent = totalSanctioned > 0 ? Math.round((totalVacancy / totalSanctioned) * 100) : 0;
    const electricVehiclesPercent = totalVehicles > 0 ? Math.round((electricVehicles / totalVehicles) * 100) : 0;
    const vehiclesOver10YearsPercent = totalVehicles > 0 ? Math.round((vehiclesOver10Years / totalVehicles) * 100) : 0;
    const avgOfficeArea = totalOffices > 0 ? Math.round(totalArea / totalOffices) : 0;
    const avgHealthScore = totalOffices > 0 ? Math.round(sumHealthScore / totalOffices) : 0;

    return {
      totalOffices,
      totalDistricts,
      totalArea,
      avgOfficeArea,
      totalSanctioned,
      totalAvailable,
      totalVacancy,
      staffAvailabilityPercent,
      staffVacancyPercent,
      totalDLGrounds,
      totalCFGrounds,
      totalVehicles,
      dieselVehicles,
      petrolVehicles,
      electricVehicles,
      electricVehiclesPercent,
      vehiclesOver10Years,
      vehiclesOver10YearsPercent,
      totalFinancialDues,
      rentDues,
      repairDues,
      fuelDues,
      otherExpenses,
      officesWithOwnGround,
      officesWithoutOwnGround,
      rtoAvailableCount,
      jrtoAvailableCount,
      officesWithStaffShortage,
      officesWithFinancialDues,
      officesWithOldVehicles,
      avgHealthScore
    };
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.DataAdapter = DataAdapter;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataAdapter;
}
