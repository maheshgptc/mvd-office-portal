/**
 * RTO Monitoring Dashboard - Google Sheet Header Schema and Internal Mapping Layer
 * 
 * CRITICAL RULE: The original Google Sheet headers must NOT be altered or renamed in the sheet.
 * This file defines the exact 63 Google Sheet columns and provides a clean typed mapping layer.
 */

const SHEET_HEADERS = [
  "Timestamp",
  "Select District",
  "Office Name",
  "Year of Functioning at Current Office",
  "Building Type",
  "Total Office Area (in Square Feet)",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office",
  "Do office have own DL,CF test ground?",
  "Which all days DL test conducted?",
  "Which all days CF test conducted?",
  "How many DL test grounds/loactions are available?",
  "How many CF test grounds/locations are available?",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2",
  "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3",
  "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)",
  "Name of RTO /Name of incharge",
  "Official Mobile Number - RTO",
  "Name of JRTO / Name of Incharge",
  "Official Mobile Number - JRTO",
  "Landline Number/Office Mobile No/ PRO Contact",
  "Regional Transport Officer (RTO) available as on date",
  "Joint Regional Transport Officer (JRTO) available as on date",
  "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)",
  "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date",
  "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)",
  "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date",
  "Senior Superintendent (SS) - Sanctioned Strength (Nos)",
  "Senior Superintendent (SS) - Available Strength (Nos) as on date",
  "Junior Superintendent (JS) - Sanctioned Strength (Nos)",
  "Junior Superintendent (JS) - Available Strength (Nos) as on date",
  "Senior Clerk / Clerk - Sanctioned Strength (Nos)",
  "Senior Clerk / Clerk - Available Strength (Nos) as on date",
  "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)",
  "Head Assistant (HA) / PRO - Available Strength (Nos) as on date",
  "Driver - Sanctioned Strength (Nos)",
  "Driver - Available Strength (Nos) as on date",
  "Office Attendant (OA) - Sanctioned Strength (Nos)",
  "Office Attendant (OA) - Available Strength (Nos) as on date",
  "No of PTS available as on date",
  "Any other staffs available other than above said. Mention below the details",
  "No Of Diesel Vehicles Available",
  "No Of Petrol Vehicles Available",
  "No Of Electric Vehicles Available",
  "No of Vehicles Over 10 Years Old",
  "Office building rent dues - Amount pending for payment",
  "Rent due from",
  "Bills submitted to head office on",
  "Any specific remarks (Please mention the pendency in details)", // Rent remarks
  "Repair & Maintenance dues - Amount pending for payment",
  "Bills due from", // Repair due from
  "Bills submitted to head office on", // Repair submitted on
  "Any specific remarks (Please mention the pendency in details)", // Repair remarks
  "Fuel bills dues - Amount pending for payment",
  "Bills due from", // Fuel due from
  "Bills submitted to head office on", // Fuel submitted on
  "Any specific remarks (Please mention the pendency in details)", // Fuel remarks
  "Details of Office expenses/Other expenses pending",
  "Name Of DTC/In Charge",
  "Official Mobile Number - DTC/In charge"
];

// Structural column index mapping to accurately parse duplicate headers (Rent, Repair, Fuel)
const COLUMN_INDICES = {
  TIMESTAMP: 0,
  DISTRICT: 1,
  OFFICE_NAME: 2,
  YEAR_OF_FUNCTIONING: 3,
  BUILDING_TYPE: 4,
  TOTAL_AREA: 5,
  OFFICE_GPS: 6,
  OWN_TEST_GROUND: 7,
  DL_DAYS: 8,
  CF_DAYS: 9,
  DL_GROUNDS_COUNT: 10,
  CF_GROUNDS_COUNT: 11,
  DL_GPS_1: 12,
  DL_GPS_2: 13,
  DL_GPS_3: 14,
  CF_GPS_1: 15,
  CF_GPS_2: 16,
  CF_GPS_3: 17,
  CF_OTHER_LOCATION_DETAILS: 18,
  RTO_NAME: 19,
  RTO_MOBILE: 20,
  JRTO_NAME: 21,
  JRTO_MOBILE: 22,
  LANDLINE_PRO: 23,
  RTO_AVAILABLE: 24,
  JRTO_AVAILABLE: 25,
  MVI_SANCTIONED: 26,
  MVI_AVAILABLE: 27,
  AMVI_SANCTIONED: 28,
  AMVI_AVAILABLE: 29,
  SS_SANCTIONED: 30,
  SS_AVAILABLE: 31,
  JS_SANCTIONED: 32,
  JS_AVAILABLE: 33,
  CLERK_SANCTIONED: 34,
  CLERK_AVAILABLE: 35,
  HA_PRO_SANCTIONED: 36,
  HA_PRO_AVAILABLE: 37,
  DRIVER_SANCTIONED: 38,
  DRIVER_AVAILABLE: 39,
  OA_SANCTIONED: 40,
  OA_AVAILABLE: 41,
  PTS_AVAILABLE: 42,
  OTHER_STAFF_DETAILS: 43,
  VEHICLES_DIESEL: 44,
  VEHICLES_PETROL: 45,
  VEHICLES_ELECTRIC: 46,
  VEHICLES_OVER_10_YEARS: 47,
  RENT_DUES_AMOUNT: 48,
  RENT_DUE_FROM: 49,
  RENT_BILLS_SUBMITTED_ON: 50,
  RENT_REMARKS: 51,
  REPAIR_DUES_AMOUNT: 52,
  REPAIR_DUE_FROM: 53,
  REPAIR_BILLS_SUBMITTED_ON: 54,
  REPAIR_REMARKS: 55,
  FUEL_DUES_AMOUNT: 56,
  FUEL_DUE_FROM: 57,
  FUEL_BILLS_SUBMITTED_ON: 58,
  FUEL_REMARKS: 59,
  OTHER_EXPENSES_PENDING: 60,
  DTC_NAME: 61,
  DTC_MOBILE: 62
};

// Manpower Roles Definition
const MANPOWER_ROLES = [
  { key: 'rto', label: 'RTO (Incharge)', sanctionedKey: null, availableKey: 'rtoAvailable', isOfficer: true },
  { key: 'jrto', label: 'JRTO (Incharge)', sanctionedKey: null, availableKey: 'jrtoAvailable', isOfficer: true },
  { key: 'mvi', label: 'Motor Vehicles Inspector (MVI)', sanctionedKey: 'mviSanctioned', availableKey: 'mviAvailable' },
  { key: 'amvi', label: 'Asst. Motor Vehicles Inspector (AMVI)', sanctionedKey: 'amviSanctioned', availableKey: 'amviAvailable' },
  { key: 'ss', label: 'Senior Superintendent (SS)', sanctionedKey: 'ssSanctioned', availableKey: 'ssAvailable' },
  { key: 'js', label: 'Junior Superintendent (JS)', sanctionedKey: 'jsSanctioned', availableKey: 'jsAvailable' },
  { key: 'clerk', label: 'Senior Clerk / Clerk', sanctionedKey: 'clerkSanctioned', availableKey: 'clerkAvailable' },
  { key: 'haPro', label: 'Head Assistant / PRO', sanctionedKey: 'haProSanctioned', availableKey: 'haProAvailable' },
  { key: 'driver', label: 'Driver', sanctionedKey: 'driverSanctioned', availableKey: 'driverAvailable' },
  { key: 'oa', label: 'Office Attendant (OA)', sanctionedKey: 'oaSanctioned', availableKey: 'oaAvailable' },
  { key: 'pts', label: 'Part-Time Sweeper (PTS)', sanctionedKey: null, availableKey: 'ptsAvailable', isAvailableOnly: true }
];

// Column groups for the advanced data table
const TABLE_COLUMN_GROUPS = [
  {
    id: 'office',
    label: 'Office & Infrastructure',
    icon: 'fa-building',
    columns: [
      { key: 'district', label: 'District' },
      { key: 'officeName', label: 'Office Name' },
      { key: 'buildingType', label: 'Building Type' },
      { key: 'yearOfFunctioning', label: 'Year' },
      { key: 'totalArea', label: 'Area (Sq Ft)' }
    ]
  },
  {
    id: 'officers',
    label: 'Key Officers',
    icon: 'fa-user-tie',
    columns: [
      { key: 'rtoName', label: 'RTO Name' },
      { key: 'rtoMobile', label: 'RTO Mobile' },
      { key: 'jrtoName', label: 'JRTO Name' },
      { key: 'jrtoMobile', label: 'JRTO Mobile' },
      { key: 'dtcName', label: 'DTC Incharge' }
    ]
  },
  {
    id: 'testGrounds',
    label: 'Test Grounds',
    icon: 'fa-road',
    columns: [
      { key: 'hasOwnGround', label: 'Own Ground' },
      { key: 'dlGroundsCount', label: 'DL Grounds' },
      { key: 'cfGroundsCount', label: 'CF Grounds' },
      { key: 'dlDays', label: 'DL Days' },
      { key: 'cfDays', label: 'CF Days' }
    ]
  },
  {
    id: 'manpower',
    label: 'Manpower Strength',
    icon: 'fa-users',
    columns: [
      { key: 'totalSanctioned', label: 'Total Sanctioned' },
      { key: 'totalAvailable', label: 'Total Available' },
      { key: 'totalVacancy', label: 'Vacancy' },
      { key: 'staffAvailabilityPercent', label: 'Availability %' }
    ]
  },
  {
    id: 'vehicles',
    label: 'Vehicle Fleet',
    icon: 'fa-car',
    columns: [
      { key: 'totalVehicles', label: 'Total Vehicles' },
      { key: 'dieselVehicles', label: 'Diesel' },
      { key: 'petrolVehicles', label: 'Petrol' },
      { key: 'electricVehicles', label: 'Electric' },
      { key: 'vehiclesOver10Years', label: 'Over 10 Yrs' }
    ]
  },
  {
    id: 'financial',
    label: 'Financial Dues (₹)',
    icon: 'fa-indian-rupee-sign',
    columns: [
      { key: 'totalFinancialDues', label: 'Total Dues' },
      { key: 'rentDues', label: 'Rent Dues' },
      { key: 'repairDues', label: 'Repair Dues' },
      { key: 'fuelDues', label: 'Fuel Dues' },
      { key: 'otherExpenses', label: 'Other Expenses' }
    ]
  },
  {
    id: 'remarks',
    label: 'Remarks & Issues',
    icon: 'fa-triangle-exclamation',
    columns: [
      { key: 'rentRemarks', label: 'Rent Remarks' },
      { key: 'repairRemarks', label: 'Repair Remarks' },
      { key: 'fuelRemarks', label: 'Fuel Remarks' },
      { key: 'cfOtherLocationDetails', label: 'CF Location Remarks' }
    ]
  }
];

// Export to window
if (typeof window !== 'undefined') {
  window.RTO_SCHEMA = {
    HEADERS: SHEET_HEADERS,
    INDICES: COLUMN_INDICES,
    MANPOWER_ROLES,
    TABLE_COLUMN_GROUPS
  };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HEADERS: SHEET_HEADERS,
    INDICES: COLUMN_INDICES,
    MANPOWER_ROLES,
    TABLE_COLUMN_GROUPS
  };
}
