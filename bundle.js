/**
 * Kerala MVD RTO Survey & Monitoring Dashboard - Production Bundle
 * Includes all schemas, data adapters, Supabase live sync & Admin Studio
 */


/* ==================== schema.js ==================== */
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


/* ==================== mock-data.js ==================== */
/**
 * RTO Survey & Monitoring Dashboard - Real Survey Dataset (97 Offices)
 * Auto-synced from Kerala MVD Survey
 */
const SAMPLE_SHEET_DATA = [
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thrissur",
    "Office Name": "DTC Central Zone I",
    "Year of Functioning at Current Office": "2016",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2023",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/qdXfJvV6edi2hdh88",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "Nil",
    "Official Mobile Number - RTO": "NA",
    "Name of JRTO / Name of Incharge": "Rajesh K",
    "Official Mobile Number - JRTO": "9188961972",
    "Landline Number/Office Mobile No/ PRO Contact": "0487 2360450",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "2",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "2",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "1",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Allotment needed.request not forwarded.",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/05/2026",
    "Fuel bills dues - Amount pending for payment": "73273",
    "Details of Office expenses/Other expenses pending": "Insurance amount Rs 26940 pending.request sent on 11.08.26",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "DTC Central Zone II",
    "Year of Functioning at Current Office": "2026",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1915",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/kNqjGNjA87B8oEo7A",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NOT APPLICABLE",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NOT APPLICABLE",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NOT APPLICABLE",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NOT APPLICABLE",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NO APPLICABLE",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NOT APPLICABLE",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NOT APPLICABLE ",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "NIL",
    "Name of JRTO / Name of Incharge": "",
    "Official Mobile Number - JRTO": "NIL",
    "Landline Number/Office Mobile No/ PRO Contact": "04842423030",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "2",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "2",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "CONFIDENTIAL ASSISTANT  1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "1",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "1011758",
    "Rent due from": "03/01/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "34740",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "DTC South Zone",
    "Year of Functioning at Current Office": "2017",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1100",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/5T6YJbGu8YTJ4tjU8",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "Priya Prasannan G",
    "Official Mobile Number - JRTO": "9188961962",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917387",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "1",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "2",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "2",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "typist 1 , CA 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "1",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "00",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "50000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL02, RTO Kollam",
    "Year of Functioning at Current Office": "1968",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "4088",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/v63pNnSccV5gx8DLA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Asramam Ground, Kollam",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "Panchayath Private Bus Stand Ground, Chathannoor",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Ajithkumar K",
    "Official Mobile Number - RTO": "8547639002",
    "Name of JRTO / Name of Incharge": "Sarath Chandran R",
    "Official Mobile Number - JRTO": "9188961902",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917302",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "6",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "6",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "2",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "2",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "22",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "22",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "7",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "7",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Typist (Sanctioned - 2, Available -1)\nAttender (Sanctioned - 2, Available -2)",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "14800",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "20100",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "KL03, RTO Pathanamthitta",
    "Year of Functioning at Current Office": "1995",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3938",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/XdpvrPZznvqGxGGk6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/n2J63WzfRiu2s5rQA?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/mPsuMJnQLxTA5kU6A?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "ROAD SIDE PLACE NEAR ENVIRO GREEN BOTANICAL GARDEN-NURSERY",
    "Name of RTO /Name of incharge": "SYAM.C",
    "Official Mobile Number - RTO": "8547635003",
    "Name of JRTO / Name of Incharge": "SAJI B",
    "Official Mobile Number - JRTO": "9188961903",
    "Landline Number/Office Mobile No/ PRO Contact": "04682222426",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "15",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "14",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "4",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "4",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "ATTENDER - 1, TYPIST - 1",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "575960",
    "Rent due from": "01/01/2026",
    "Bills submitted to head office on": "30/06/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "50000",
    "Bills due from": "01/02/2026",
    "Fuel bills dues - Amount pending for payment": "125052",
    "Details of Office expenses/Other expenses pending": "1 LAKH REQUIRED FOR STAMP AND OTHER EXPENSES REQUEST SUBMITTED ON  26.09.2026",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Alappuzha",
    "Office Name": "KL04, RTO Alappuzha",
    "Year of Functioning at Current Office": "1970",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "3066",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/6eJtMoF2L4Vbw2xC9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.494344,76.319432",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.494344,76.319432",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Nil",
    "Name of RTO /Name of incharge": "JERSON TM",
    "Official Mobile Number - RTO": "8547639004",
    "Name of JRTO / Name of Incharge": "VINOD KUMAR R",
    "Official Mobile Number - JRTO": "9188961904",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917304",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "18",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "17",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "3",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "3",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "27/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "No",
    "Repair & Maintenance dues - Amount pending for payment": "26199",
    "Bills due from": "31/08/2026",
    "Fuel bills dues - Amount pending for payment": "9240",
    "Details of Office expenses/Other expenses pending": "Other items",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kottayam",
    "Office Name": "KL05, RTO Kottayam",
    "Year of Functioning at Current Office": "1965",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2700",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/GiHCAh8higPTU3FU9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/KF5Za7LsMH1VZVMd6?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://share.google/WnNROuHSSb7hEPFEv",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Babu Chazhikadan road Near Medical College Hospital Kottayam",
    "Name of RTO /Name of incharge": "D.JAYARAJ ",
    "Official Mobile Number - RTO": "8547639005",
    "Name of JRTO / Name of Incharge": "JOSE A",
    "Official Mobile Number - JRTO": "9188961905",
    "Landline Number/Office Mobile No/ PRO Contact": "0481-2560429",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "2",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "2",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "25",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "24",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "4",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "2 ATTENDERS",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "alloted amount insfficient",
    "Repair & Maintenance dues - Amount pending for payment": "11500",
    "Bills due from": "04/08/2026",
    "Fuel bills dues - Amount pending for payment": "59111",
    "Details of Office expenses/Other expenses pending": "nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Idukki",
    "Office Name": "KL06, RTO Idukki",
    "Year of Functioning at Current Office": "1985",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1405",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/LuwfJfA2R4zQpGCm6",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "VW5W+55J PWD Quarters, Idukki Twp, Keralam 685603",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "Q4JC+W8R, Erattayar, Keralam 685514",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "VW8V+Q3G Idukki Twp, Keralam",
    "Name of RTO /Name of incharge": "SAMEER P A",
    "Official Mobile Number - RTO": "+919188961906",
    "Name of JRTO / Name of Incharge": "SAMEER P A",
    "Official Mobile Number - JRTO": "9188961906",
    "Landline Number/Office Mobile No/ PRO Contact": "04862232244",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "12",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "10",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "6",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "5",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "74393",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL07, RTO Ernakulam",
    "Year of Functioning at Current Office": "1982",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "4305",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/dVbzkpazYhzRw59G9",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "7J2R28CW+QX",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "7J2R385R+GG",
    "Name of RTO /Name of incharge": "SURESH K R",
    "Official Mobile Number - RTO": "8547639007( under the custody of Vigilance court)",
    "Name of JRTO / Name of Incharge": "ARUN C D",
    "Official Mobile Number - JRTO": "9188961907",
    "Landline Number/Office Mobile No/ PRO Contact": "04842422246; 9188961787",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "13",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "9",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "4",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "4",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "35",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "35",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "4",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Typist 1",
    "No Of Diesel Vehicles Available": "5",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "07/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "Fuel bill pending for the month of July and August",
    "Repair & Maintenance dues - Amount pending for payment": "12000",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "29485",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Thrissur",
    "Office Name": "KL08, RTO Thrissur",
    "Year of Functioning at Current Office": "1989",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "4800",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/VtgVjZtKDwJAQxTU9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/y1uhE5dRgiUeUQbB6",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/y1uhE5dRgiUeUQbB6",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NIL",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NIL",
    "Name of RTO /Name of incharge": "SRI ANANDHAKRISHNAN G",
    "Official Mobile Number - RTO": "9447125320",
    "Name of JRTO / Name of Incharge": "SRI JUSTIN MALIAKKAL",
    "Official Mobile Number - JRTO": "7034417077",
    "Landline Number/Office Mobile No/ PRO Contact": "04872360262",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "5",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "11",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "8",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "3",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "3",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "28",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "26",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "4",
    "Driver - Available Strength (Nos) as on date": "3",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "3",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "3",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "TYPIST 1",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "4",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "07/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "20000",
    "Bills due from": "01/09/2026",
    "Fuel bills dues - Amount pending for payment": "15000",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Palakkad",
    "Office Name": "KL09, RTO Palakkad",
    "Year of Functioning at Current Office": "1985",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "4500",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/YH3PuDEZdTVkDYaT6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "DL test ground,  10.758860863673224, 76.67782684954139",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "CF test Gound- 10.798399827439475, 76.66429543725243",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Mujeeb c u",
    "Official Mobile Number - RTO": "8547639009",
    "Name of JRTO / Name of Incharge": "Vinodkumar k",
    "Official Mobile Number - JRTO": "9188961909",
    "Landline Number/Office Mobile No/ PRO Contact": "04912505741",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "5",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "9",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "9",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "2",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "2",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "21",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "21",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "27",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "22",
    "No of PTS available as on date": "2",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "",
    "Rent due from": "",
    "Bills submitted to head office on": "08/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "21000",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "44403",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Malappuram",
    "Office Name": "KL10, RTO Malappuram",
    "Year of Functioning at Current Office": "1969",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/q4XiFxVUQMZXmi4p9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11.051208,76.076204",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "11.051050,76.064756",
    "Name of RTO /Name of incharge": "Joyi V",
    "Official Mobile Number - RTO": "8547639010",
    "Name of JRTO / Name of Incharge": "Sajeev A",
    "Official Mobile Number - JRTO": "9188961910",
    "Landline Number/Office Mobile No/ PRO Contact": "04832734924",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "5",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "8",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "8",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "2",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "2",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "21",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "20",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "6",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "6",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "42321",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "16982",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL11, RTO Kozhikode",
    "Year of Functioning at Current Office": "1972",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "4000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/mW11P2Bo4uC4KGRq5",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11.274864545785379, 75.82378673032322",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "11.274864545785379, 75.82378673032322",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NIL",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NIL",
    "Name of RTO /Name of incharge": "Jebi Cheriyan",
    "Official Mobile Number - RTO": "8547639011",
    "Name of JRTO / Name of Incharge": "Faisal T",
    "Official Mobile Number - JRTO": "9188961411",
    "Landline Number/Office Mobile No/ PRO Contact": "",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "12",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "9",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "4",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "4",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "33",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "33",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "3",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "3",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Attender - 2 Typist - 2",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "1",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/04/2026",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Wayanad",
    "Office Name": "KL12, RTO Wayanad",
    "Year of Functioning at Current Office": "1989",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2250",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/zUoUKfJRHV7A4BVKA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://www.google.com/maps/place/RTO+Driving+Test+Ground/@11.6395987,76.083681,19.75z/data=!4m6!3m5!1s0x3ba674aaecc82611:0xa9e98743bd83e49f!8m2!3d11.6399669!4d76.0836849!16s%2Fg%2F124ykdw6p?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://www.google.com/maps/@11.6368988,76.0775552,17.58z?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "Nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "Nil",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "ROAD SIDE NEAR GOVT ITI KALPETTA",
    "Name of RTO /Name of incharge": "SUMESH P R",
    "Official Mobile Number - RTO": "8547639012",
    "Name of JRTO / Name of Incharge": "MERCY KUTTY  SAMUEL",
    "Official Mobile Number - JRTO": "9188961912",
    "Landline Number/Office Mobile No/ PRO Contact": "04936202607",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "11",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "11",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "9",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "9",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "WORKING ARRANGEMENT OA -1, SNR CLERK -1",
    "No Of Diesel Vehicles Available": "5",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "30/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "23416",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "36437",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kannur",
    "Office Name": "KL13, RTO Kannur",
    "Year of Functioning at Current Office": "1957",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "3433",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/KfDfL6rJxauiitJd9",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "E S UNNIKRISHNAN",
    "Official Mobile Number - RTO": "8547639013",
    "Name of JRTO / Name of Incharge": "VINOD KUMAR K",
    "Official Mobile Number - JRTO": "9188961913",
    "Landline Number/Office Mobile No/ PRO Contact": "04972700566",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "7",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "2",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "2",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "21",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "19",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "8",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "8",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Typist",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "145641",
    "Rent due from": "01/10/2024",
    "Bills submitted to head office on": "17/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "8240",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Kasaragod",
    "Office Name": "KL14, RTO Kasaragod",
    "Year of Functioning at Current Office": "1991",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "5400",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Gs1FqHD4bmPTNhj96",
    "Do office have own DL,CF test ground?": "ATS",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "12.582904125414462, 75.02290789314462",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "12.582904125414462, 75.02290789314462",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Jarad J",
    "Official Mobile Number - RTO": "8547639014",
    "Name of JRTO / Name of Incharge": "Ajith Andrews",
    "Official Mobile Number - JRTO": "9188961914",
    "Landline Number/Office Mobile No/ PRO Contact": "04994255290",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "6",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "15",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "11",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "12",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "12",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1-Attendar (strength-2)",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "01",
    "Rent due from": "",
    "Bills submitted to head office on": "12/08/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "55294",
    "Bills due from": "01/04/2026",
    "Fuel bills dues - Amount pending for payment": "118067",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL15, RTO Thiruvananthapuram (KSRTC / Nationalised Sector)",
    "Year of Functioning at Current Office": "2010",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "3000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/rzfHzCkTTNfme9RZ8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "8.555770, 76.963079",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "8.555770, 76.963079",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Civil Station TVPM Premises",
    "Name of RTO /Name of incharge": "PRIYA PRASANNAN G (I/C)",
    "Official Mobile Number - RTO": "8547639015",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "0",
    "Landline Number/Office Mobile No/ PRO Contact": "0471 2731339",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "9",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "9",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NIL",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Fuel bills will be submitted to head office after getting quarterly consolidated bill from IOC Dealer",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "16014",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL16, RTO Attingal",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "4000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/VVDBBvbwb6cWPbK77",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Wednesday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://goo.gl/maps/JTSCubddYhUeG8Vt6",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/i7zS9Y4qbd8SiTTs6?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Biju.S",
    "Official Mobile Number - RTO": "8547639016",
    "Name of JRTO / Name of Incharge": "Sooraj S",
    "Official Mobile Number - JRTO": "9188961916",
    "Landline Number/Office Mobile No/ PRO Contact": "04702626400",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "8",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "3",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Typist-2 Attender-2",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "378000",
    "Rent due from": "01/04/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "15000",
    "Bills due from": "01/06/2026",
    "Fuel bills dues - Amount pending for payment": "42000",
    "Details of Office expenses/Other expenses pending": "15000",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL17, RTO Muvattupuzha",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "3164",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Zr8gw9jF1yUis8ok8",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://www.google.com/search?q=gps+location+of+perumballoor+automated+testing+station&sca_esv=080dae4805299e94&sxsrf=APpeQnudJvKXVTBdLp_v58j7qJUsZEwA9A%3A1790585173550&ei=VSm6asSBIamNnesPzcCVoAw&biw=1366&bih=641&oq=gps+location+of+perumballoor+au&gs_lp=Egxnd3Mtd2l6LXNlcnAiH2dwcyBsb2NhdGlvbiBvZiBwZXJ1bWJhbGxvb3IgYXUqBQgAGKABMgUQIRigATIFECEYoAFI944BUABYjnxwBHgAkAEAmAGsAaAB9SKqAQQwLjM0uAEByAEA-AEBmAImoAK0JKgCCsICBxAjGOoCGCfCAgQQIxgnwgIKEAAYgAQYigUYQ8ICCxAAGIAEGLEDGIMBwgIEEAAYA8ICCBAAGIAEGLEDwgIHEAAYgAQYE8ICChAAGIAEGBMYtAfCAgkQABiABBgNGBPCAgwQABiABBgNGBMYtAfCAggQABgWGB4YE8ICCBAAGB4YDRgTwgIGEAAYFhgewgIHECEYChigAZgDBOIDBRIBMSBA8QUSE78wQgZPgZIHBDQuMzSgB99wsgcEMC4zNLgHqCTCBwkyLjIyLjEyLjLIB26ACAE&sclient=gws-wiz-serp",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NIL",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "https://www.google.com/search?q=google+map+for+pandappilly+&sca_esv=080dae4805299e94&sxsrf=APpeQnv6JdAX3vIArmDkop8UsizwID9qHg%3A1790585509637&ei=pSq6aum7JpGPseMPmM6v-AM&biw=1366&bih=641&ved=2ahUKEwipovfp8pCXAxWRR2wGHRjnCz8Q4dUDegQIBhAM&uact=5&oq=google+map+for+pandappilly+&gs_lp=Egxnd3Mtd2l6LXNlcnAiG2dvb2dsZSBtYXAgZm9yIHBhbmRhcHBpbGx5IDIEECMYJ0jUC1AAWABwAHgAkAEAmAF9oAF9qgEDMC4xuAEDyAEA-AEBmAIBoAKEAZgDAJIHAzAuMaAH-gGyBwMwLjG4B4QBwgcDMC4xyAcCgAgB&sclient=gws-wiz-serp",
    "Name of RTO /Name of incharge": "SHEFIQ.B",
    "Official Mobile Number - RTO": "8547639017",
    "Name of JRTO / Name of Incharge": "ELDHO.T.H",
    "Official Mobile Number - JRTO": "9188961917",
    "Landline Number/Office Mobile No/ PRO Contact": "04852814959",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "9",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "8",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "3",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NIL",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Fund may be allotted",
    "Repair & Maintenance dues - Amount pending for payment": "42614",
    "Bills due from": "01/05/2026",
    "Fuel bills dues - Amount pending for payment": "81327",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL18, RTO Vadakara",
    "Year of Functioning at Current Office": "1977",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "11.599447324202952, 75.58691046226592",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11.606808, 75.641765",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "11.595460, 75.614011",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NIL",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "VILLIAPPALLY -LOKANARKAVU ROAD- 11.595460, 75.614011",
    "Name of RTO /Name of incharge": "SAJEESH P K (JRTO) INCHARGE",
    "Official Mobile Number - RTO": "8547639018",
    "Name of JRTO / Name of Incharge": "SAJEESH P K",
    "Official Mobile Number - JRTO": "9188961918",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917318",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "6",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "1",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "1",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "10",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "10",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "3",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "3",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "3",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "3",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "ATTENDER - 2- 1 VACANT",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "61729",
    "Rent due from": "31/03/2025",
    "Bills submitted to head office on": "31/08/2026",
    "Any specific remarks (Please mention the pendency in details)": "NA",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "7575",
    "Details of Office expenses/Other expenses pending": "NA",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "05-10-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL19, Sub RTO Parassala",
    "Year of Functioning at Current Office": "2007",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1600",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/eTGyGjhjQXSRZXWv9",
    "Do office have own DL,CF test ground?": "Yes, No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Saturday",
    "Which all days CF test conducted?": "Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "943R+HX Parassala, Keralam",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "8.32939129015484, 77.14371281793598",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side. At Kerala sid end of NH66",
    "Name of RTO /Name of incharge": "Jayeshkumar M K",
    "Official Mobile Number - RTO": "8547639001",
    "Name of JRTO / Name of Incharge": "Arun Kumar S M",
    "Official Mobile Number - JRTO": "8547639019",
    "Landline Number/Office Mobile No/ PRO Contact": "04712200026",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Driver 1 nos from employment",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "1",
    "Bills due from": "01/02/2026",
    "Fuel bills dues - Amount pending for payment": "63366",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL20, Sub RTO Neyyattinkara",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/TdVUPSsTCFSQfSUt8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "OORUTTUKALA  8.4019° N, 77.0768° E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "THADATTIKULAM  8.3623° N, 77.0515° E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639001",
    "Name of JRTO / Name of Incharge": "SUNILKUMAR C",
    "Official Mobile Number - JRTO": "8547639020",
    "Landline Number/Office Mobile No/ PRO Contact": "",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "",
    "Driver - Sanctioned Strength (Nos)": "",
    "Driver - Available Strength (Nos) as on date": "",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "",
    "No of PTS available as on date": "",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "8166",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "30-09-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL21, Sub RTO Nedumangad",
    "Year of Functioning at Current Office": "2002",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3666",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Vnz61ntyCNFrpxNk9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "J2M6+W2C MOTTAKAVU RD ANAD",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "M3GW+977 VITHURA KSRTC RD VITHURA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "JXJX+FXR PANAVOOR NEDUMANGAD RD PUTHENPALAM ",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "JX8Q+PMG NEDUMANGAD",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NO",
    "Name of RTO /Name of incharge": "BIJU S, RTO ATTINGAL",
    "Official Mobile Number - RTO": "9188961916",
    "Name of JRTO / Name of Incharge": "REEJA Z",
    "Official Mobile Number - JRTO": "8547639021",
    "Landline Number/Office Mobile No/ PRO Contact": "04722813177",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "7",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "3",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "YES",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "1916678.74",
    "Rent due from": "01/01/2024",
    "Bills submitted to head office on": "22/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "8251",
    "Bills due from": "18/09/2026",
    "Fuel bills dues - Amount pending for payment": "44318",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "30-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL23, Sub RTO Karunagappally",
    "Year of Functioning at Current Office": "1996",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1200",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/DFj8hCnuF5QesySW6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.080171,76.537957",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "AJITHKUMAR K",
    "Official Mobile Number - RTO": "8547639002",
    "Name of JRTO / Name of Incharge": "SREEKUMAR D",
    "Official Mobile Number - JRTO": "8547639023",
    "Landline Number/Office Mobile No/ PRO Contact": "4762625041",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "7",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "7",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Driver.temp.1",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "07/08/2026",
    "Any specific remarks (Please mention the pendency in details)": "Long pendency in releasing the fuel bills, extending up to April 2026",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/04/2026",
    "Fuel bills dues - Amount pending for payment": "57154",
    "Details of Office expenses/Other expenses pending": "Computer system and network requires revamping.",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL24, Sub RTO Kottarakkara",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Others",
    "Total Office Area (in Square Feet)": "5849",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/ttv6YcjdjckkxhJy5",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "2Q2C+3R7 Kottarakkara, Keralam",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "M V D DRIVING TESTING GROUND.NURMALA JUNCTION",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "M V D DRIVING TESTING GROUND.NURMALA JUNCTION",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "M V D DRIVING TESTING GROUND.NURMALA JUNCTION",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "M V D DRIVING TESTING GROUND.NURMALA JUNCTION",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "M V D DRIVING TESTING GROUND.NURMALA JUNCTION",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "No",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "Santhosh kumar SS",
    "Official Mobile Number - JRTO": "8547639024",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917324",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "4",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Daily wages driver",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/01/2026",
    "Fuel bills dues - Amount pending for payment": "61046",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "30-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL25, Sub RTO Punalur",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2500",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/rWMsYpNYexZxniJG8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.027529, 76.822573",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "8.947301,76.916458",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "AJITHKUMAR",
    "Official Mobile Number - RTO": "8547639002",
    "Name of JRTO / Name of Incharge": "Shibu. K. J",
    "Official Mobile Number - JRTO": "8547639025",
    "Landline Number/Office Mobile No/ PRO Contact": "4752228420",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 Typist",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "88655",
    "Rent due from": "01/05/2026",
    "Bills submitted to head office on": "30/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "16000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "KL26, Sub RTO Adoor",
    "Year of Functioning at Current Office": "1986",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1901",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/2fvnS2UzWkmapqe87",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/UcgEx4dtWahzJyjK7",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "https://maps.app.goo.gl/UcgEx4dtWahzJyjK7",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "https://maps.app.goo.gl/UcgEx4dtWahzJyjK7",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/M39qQpJZhrBnKXF68",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "https://maps.app.goo.gl/M39qQpJZhrBnKXF68",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "https://maps.app.goo.gl/M39qQpJZhrBnKXF68",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "C SYAM",
    "Official Mobile Number - RTO": "8547639003",
    "Name of JRTO / Name of Incharge": "Ronni Varghese ",
    "Official Mobile Number - JRTO": "8547639026",
    "Landline Number/Office Mobile No/ PRO Contact": "04734 227475/9188917326",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "346000",
    "Rent due from": "01/04/2026",
    "Bills submitted to head office on": "28/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "Nil",
    "Repair & Maintenance dues - Amount pending for payment": "13832",
    "Bills due from": "04/03/2026",
    "Fuel bills dues - Amount pending for payment": "65200",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "8547639087"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "KL27, Sub RTO Thiruvalla",
    "Year of Functioning at Current Office": "1985",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3550",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/bw2RpiFYwMjJ77P88",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.352993,76.543404",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "9.352993,76.543404",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "9.352993,76.543404",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.375978,76.582054",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "9.375978,76.582054",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "9.375978,76.582054",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "9.375978,76.582054",
    "Name of RTO /Name of incharge": "C SYAM",
    "Official Mobile Number - RTO": "8547639003",
    "Name of JRTO / Name of Incharge": "ISAAC THOMAS",
    "Official Mobile Number - JRTO": "8547639027",
    "Landline Number/Office Mobile No/ PRO Contact": "04692635577",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "4",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "2",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Typist 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "3126697",
    "Rent due from": "30/06/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "KL28, Sub RTO Mallappally",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1076",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/DeuYWF6xr62tiqsd7",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Tuesday, Wednesday, Friday",
    "Which all days CF test conducted?": "Monday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/s9ZrJa9RnBqB8p6fA?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/WWAi86wrRAM4W1Do9?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Any available space of Road side",
    "Name of RTO /Name of incharge": "Syam C",
    "Official Mobile Number - RTO": "8547639003",
    "Name of JRTO / Name of Incharge": "Pramod.K.S",
    "Official Mobile Number - JRTO": "8547639028",
    "Landline Number/Office Mobile No/ PRO Contact": "04692681900",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NA",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "04/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "07/08/2026",
    "Fuel bills dues - Amount pending for payment": "8840",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "30-09-2026",
    "Select District": "Alappuzha",
    "Office Name": "KL29, Sub RTO Kayamkulam",
    "Year of Functioning at Current Office": "2007",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/GNmD1wzcermiPEHN9",
    "Do office have own DL,CF test ground?": "No, ATS",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.242208, 76.488281",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NO",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NO",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "N/A",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "N/A",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "N/A",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "WAS CONDUCTING AT ROAD SIDE BUT NOW AT ATS",
    "Name of RTO /Name of incharge": "Mr Jerson",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "Sankara Pillai",
    "Official Mobile Number - JRTO": "",
    "Landline Number/Office Mobile No/ PRO Contact": "914792447760",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "temp driver 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "25000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Alappuzha",
    "Office Name": "KL30, Sub RTO Chengannur",
    "Year of Functioning at Current Office": "1975",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "4040",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Q1aUXE2m21eiV7w6A",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Thursday, Saturday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.332788837244836, 76.62638963973114",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9 19' 46\" N, 76 37' 0\" E - 73m",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Mangalam chengannur road side",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "6238692632",
    "Name of JRTO / Name of Incharge": "PRASAD ",
    "Official Mobile Number - JRTO": "8547639030",
    "Landline Number/Office Mobile No/ PRO Contact": "04792450800",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "7",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "7",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "15/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "16700",
    "Bills due from": "08/01/2026",
    "Fuel bills dues - Amount pending for payment": "10968",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Alappuzha",
    "Office Name": "KL32, Sub RTO Cherthala",
    "Year of Functioning at Current Office": "2004",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1594",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/d3YoatGKRuQeqrVC7",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "How many DL test grounds/loactions are available?": "3",
    "How many CF test grounds/locations are available?": "3",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.693834745117618, 76.343928471321",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": " 9.69383° N, 76.34393° E J935+262 Muhamma",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "9.69383° N, 76.34393° E (or 9°41'38\" N, 76°20' 6\"  JXRM8VV+GH8 E).",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.6010° N (approximate) 76.3637° E (approximate)",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "9.6965° N,76.3612° E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "9°40′45″ N, 76°20′26″ E (9.6792° N, 76.3406° E)",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Fitness test of NTV Vehicles is conducted at Cherthala govt. Hospital- Cherthala byepass Road side",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639004",
    "Name of JRTO / Name of Incharge": "Girish S.",
    "Official Mobile Number - JRTO": "8547639032",
    "Landline Number/Office Mobile No/ PRO Contact": "04782816248",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "3",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1- Typist(Senior Grade)",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "33439",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kottayam",
    "Office Name": "KL33, Sub RTO Changanassery",
    "Year of Functioning at Current Office": "2002",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2257",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/ohMaEBq4WJH1kGew6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "2",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.437671,76.538302",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "9.506972,76.727232",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.462077,76.534715",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "9.506972,76.727232",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "D Jayaraj",
    "Official Mobile Number - RTO": "9188961905",
    "Name of JRTO / Name of Incharge": "Sivakumar S N",
    "Official Mobile Number - JRTO": "8547639033",
    "Landline Number/Office Mobile No/ PRO Contact": "0481-2411930",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Sr. Gr. Typist - 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "356525.76",
    "Rent due from": "01/04/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kottayam",
    "Office Name": "KL34, Sub RTO Kanjirappally",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "6342",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/9WA4WFcWRUf7R8Ht8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.570008257494077, 76.74999810170962",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.38'48.3N,76.45'48.8E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Punalur-Muvatupuzha road side near Chirakkadavu Mahadeva Temple",
    "Name of RTO /Name of incharge": "D.Jayaraj",
    "Official Mobile Number - RTO": "8547639005",
    "Name of JRTO / Name of Incharge": "Sreejith.K",
    "Official Mobile Number - JRTO": "8547639034",
    "Landline Number/Office Mobile No/ PRO Contact": "04828223090/9188917334",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "LD Typist 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "03/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "Bill due from 18-07-26 to 17-08-26",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "16/07/2026",
    "Fuel bills dues - Amount pending for payment": "10631",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kottayam",
    "Office Name": "KL35, Sub RTO Pala",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1886",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/zQWYs7c5vsbq6wfA6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.710904,76.701597",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.712114,76.708086",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "At the old road at Edappady near Etumanoor Poonjar State Highway ",
    "Name of RTO /Name of incharge": "Sri.JAYARAJ D",
    "Official Mobile Number - RTO": "8547639005",
    "Name of JRTO / Name of Incharge": "Sri.SANTHOSHKUMAR K G",
    "Official Mobile Number - JRTO": "8547639035",
    "Landline Number/Office Mobile No/ PRO Contact": "04822 216455",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 temporary driver",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "193727",
    "Rent due from": "01/03/2026",
    "Bills submitted to head office on": "27/11/2025",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "10/03/2026",
    "Fuel bills dues - Amount pending for payment": "45000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kottayam",
    "Office Name": "KL36, Sub RTO Vaikom",
    "Year of Functioning at Current Office": "1994",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2213",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/j9qTZpCoKFoue63J6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/RNmzHXeNuHnrP882A?g_st=iw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/buQxmUFFXP3AxgY19?g_st=iw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "JAYARAJ D",
    "Official Mobile Number - RTO": "8547639005",
    "Name of JRTO / Name of Incharge": "BIJU K G",
    "Official Mobile Number - JRTO": "8547639036",
    "Landline Number/Office Mobile No/ PRO Contact": "04829-224141",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "ONE TEMPORARY DRIVER ON DAILY WAGES",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "777536",
    "Rent due from": "01/04/2023",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "SAJI PRASAD G S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Idukki",
    "Office Name": "KL37, Sub RTO Vandiperiyar",
    "Year of Functioning at Current Office": "1984",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1610",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/QPwwwkTs4Mvb8sRP6",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.57864266203728, 76.98673692588174",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.57864266203728, 76.98673692588174",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "nil",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "nil",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639006",
    "Name of JRTO / Name of Incharge": "Nikhil Scaria",
    "Official Mobile Number - JRTO": "8547639037",
    "Landline Number/Office Mobile No/ PRO Contact": "04869233600",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "38869",
    "Bills due from": "14/09/2026",
    "Fuel bills dues - Amount pending for payment": "4990.56",
    "Details of Office expenses/Other expenses pending": "nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Idukki",
    "Office Name": "KL38, Sub RTO Thodupuzha",
    "Year of Functioning at Current Office": "2015",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/mP3JaNfeZ4qoZKXN7",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.888875,76.688158",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.895556,76.695849 Roadside",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639006",
    "Name of JRTO / Name of Incharge": "Asharaf PM",
    "Official Mobile Number - JRTO": "8549639038",
    "Landline Number/Office Mobile No/ PRO Contact": "04862225564",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "7",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "L D typist 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Request sent for allotment",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "35427",
    "Details of Office expenses/Other expenses pending": "Request sent for allotment",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL39, Sub RTO Thripunithura",
    "Year of Functioning at Current Office": "2001",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2370",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/mmPEJYsx9sJcuXcc9",
    "Do office have own DL,CF test ground?": "ATS",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.846346826830802, 76.38422288708654",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.973200852987055, 76.4072963103611",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639007",
    "Name of JRTO / Name of Incharge": "JAIRAJ P S",
    "Official Mobile Number - JRTO": "8547639039",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917339",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 TYPIST",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "31/07/2026",
    "Fuel bills dues - Amount pending for payment": "36251",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL40, Sub RTO Perumbavoor",
    "Year of Functioning at Current Office": "2000",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1720",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/5u26gHpysSeKVUfQA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/ryTEgopR6wrHiaqc8?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/YqAJm8WbuzN6fTTi8?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639040",
    "Name of JRTO / Name of Incharge": "PRADEEP S S",
    "Official Mobile Number - JRTO": "8547639040",
    "Landline Number/Office Mobile No/ PRO Contact": "2525573",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Driver on temporary basis daily wages",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "65501",
    "Rent due from": "01/12/2025",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/03/2026",
    "Fuel bills dues - Amount pending for payment": "23000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL41, Sub RTO Aluva",
    "Year of Functioning at Current Office": "1986",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2475",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/m3i3jXMkYVndwEo97",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Not Applicable",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": " 10.1224546, 76.3401539",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": " 10.1084958, 76.3560218  ",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Suresh K R",
    "Official Mobile Number - RTO": "9447331712",
    "Name of JRTO / Name of Incharge": "Afsal Ali K",
    "Official Mobile Number - JRTO": "8547639041",
    "Landline Number/Office Mobile No/ PRO Contact": "0484 2622006",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Typist",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "29/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "03/06/2026",
    "Fuel bills dues - Amount pending for payment": "3500",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9447502866"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL42, Sub RTO North Paravur",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1915",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/7FsEfip94qGFF37T8",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://www.google.com/maps/place/10%C2%B008'15.4%22N+76%C2%B013'59.6%22E/@10.137618,76.233222,17z/data=!3m1!4b1!4m4!3m3!8m2!3d10.137618!4d76.233222!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://www.google.com/maps/place/46XC%2B58H+Driving+Test+Ground+Sub+RTO+North+Paravur,+Ernakulam,+North+Paravur,+Kerala+683513/data=!4m6!3m5!1s0x3b081b001b757687:0x5b04a1b6499ee84d!7e2!8m2!3d10.147466999999999!4d76.2214065!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjM4LjEYACCenQoqxwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTY1MzUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODM1NzEwLDEwMDgyNTAyNSwxMDA4MjAyMzcsMTAwODIyNDk0LDEwMDgyNzk3NSwxMDA4MzgzNTksMTIxODE2NDYxQgJJTg%3D%3D&skid=49422419-e789-43b9-b80d-2e7baf6db4dd&g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "SURESH K R",
    "Official Mobile Number - RTO": "8547639007",
    "Name of JRTO / Name of Incharge": "KISHOR KUMAR N T",
    "Official Mobile Number - JRTO": "8547639042",
    "Landline Number/Office Mobile No/ PRO Contact": "0484-2442522",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "NO",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0I",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "26952",
    "Rent due from": "01/04/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "30/06/2026",
    "Fuel bills dues - Amount pending for payment": "12240",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL43, Sub RTO Mattancherry",
    "Year of Functioning at Current Office": "2014",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://goo.gl/maps/pTsXDRwW5ngTLzHa7?g_st=aw",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://goo.gl/maps/pTsXDRwW5ngTLzHa7?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "https://goo.gl/maps/pTsXDRwW5ngTLzHa7?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "Same as above",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://goo.gl/maps/pTsXDRwW5ngTLzHa7?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "No",
    "Name of RTO /Name of incharge": "Chandrabhanu C",
    "Official Mobile Number - RTO": "8547639043",
    "Name of JRTO / Name of Incharge": "",
    "Official Mobile Number - JRTO": "8547639043",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917343",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "69867",
    "Rent due from": "01/07/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "26/09/2026",
    "Fuel bills dues - Amount pending for payment": "5563",
    "Details of Office expenses/Other expenses pending": "Water bill ",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL44, Sub RTO Kothamangalam",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "309.47",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/8bbX5AoUXCL1zz916",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "2",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://www.google.com/maps/place/10%C2%B003'37.5%22N+76%C2%B038'10.2%22E/@10.0604133,76.6335784,17z/data=!3m1!4b1!4m4!3m3!8m2!3d10.0604133!4d76.6361533?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "https://www.google.com/maps/place/10%C2%B003'50.2%22N+76%C2%B037'28.7%22E/@10.0639376,76.6220544,17z/data=!3m1!4b1!4m4!3m3!8m2!3d10.0639376!4d76.6246293?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "no",
    "Name of RTO /Name of incharge": "SHEFEEQ B",
    "Official Mobile Number - RTO": "8547639017",
    "Name of JRTO / Name of Incharge": "SALIM VIJAYAKUMAR",
    "Official Mobile Number - JRTO": "8547639044",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917344",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "TYPIST -1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "8481",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Thrissur",
    "Office Name": "KL45, Sub RTO Irinjalakuda",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2200",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/y81gGKteaPu1CHTs9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Municipal Ground (Driving ground ), Irinjalakuda, Keralam 680121",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "Fr Dismas Rd, Irinjalakuda, Keralam 680125",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side christ college nearby road",
    "Name of RTO /Name of incharge": "Justin maliakkal",
    "Official Mobile Number - RTO": "8547639008",
    "Name of JRTO / Name of Incharge": "Sanjo Varghese ",
    "Official Mobile Number - JRTO": "8547639045",
    "Landline Number/Office Mobile No/ PRO Contact": "04802825666",
    "Regional Transport Officer (RTO) available as on date": "On leave",
    "Joint Regional Transport Officer (JRTO) available as on date": "On leave",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "9",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "9",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NA",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thrissur",
    "Office Name": "KL46, Sub RTO Guruvayur",
    "Year of Functioning at Current Office": "2007",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/sc9Vfw3uFcxa7Ujw5",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Koonammoochi",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Near Anakkotta Punnathoor road",
    "Name of RTO /Name of incharge": "Sri. Ananthakrishnan  G",
    "Official Mobile Number - RTO": "8547639008",
    "Name of JRTO / Name of Incharge": "Ramesh M",
    "Official Mobile Number - JRTO": "8547639046",
    "Landline Number/Office Mobile No/ PRO Contact": "04872551666",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "34",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "7",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "",
    "Rent due from": "01/10/2025",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "18/03/2026",
    "Fuel bills dues - Amount pending for payment": "18577",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thrissur",
    "Office Name": "KL47, Sub RTO Kodungallur",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1225",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/kArEB1U8PJ9T4pzBA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Wednesday, Thursday, Saturday",
    "Which all days CF test conducted?": "Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "10.2224/76.1639",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "10.2224/76.1639",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "10.202804/76.206907",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side ",
    "Name of RTO /Name of incharge": "Justin Maliekkal ",
    "Official Mobile Number - RTO": "8547639008",
    "Name of JRTO / Name of Incharge": "Kishore Kumar N S ",
    "Official Mobile Number - JRTO": "8547639047",
    "Landline Number/Office Mobile No/ PRO Contact": "04802807666",
    "Regional Transport Officer (RTO) available as on date": "On leave",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NA",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Nil",
    "Repair & Maintenance dues - Amount pending for payment": "13000",
    "Bills due from": "13/07/2026",
    "Fuel bills dues - Amount pending for payment": "15701",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Thrissur",
    "Office Name": "KL48, Sub RTO Wadakkanchery",
    "Year of Functioning at Current Office": "2016",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2810",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/RvzjJLTm1i9MKJjRA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "10.643358,76.203064",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "10.643357,76.203064",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "nil",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side(Kuranchery-Parlikkad)",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547639008",
    "Name of JRTO / Name of Incharge": "Sreejith S",
    "Official Mobile Number - JRTO": "8547639048",
    "Landline Number/Office Mobile No/ PRO Contact": "04884233666/9188917348",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "no",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "8050",
    "Details of Office expenses/Other expenses pending": "25830",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Palakkad",
    "Office Name": "KL49, Sub RTO Alathur",
    "Year of Functioning at Current Office": "2015",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2168",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/FgBrBpohRz3TLxXt7",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "10.647557, 76.547368",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "10.646427, 76.546545",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Sri Mujib C U",
    "Official Mobile Number - RTO": "8547639009",
    "Name of JRTO / Name of Incharge": "SRI K R RAJU ",
    "Official Mobile Number - JRTO": "8547639049",
    "Landline Number/Office Mobile No/ PRO Contact": "04922224909",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "On leave",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "03/10/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "8570",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Palakkad",
    "Office Name": "KL50, Sub RTO Mannarkkad",
    "Year of Functioning at Current Office": "2006",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1320",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/7YU43Aewo8v7uzX27",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "2F9W+VF5 Mannarkad-II, Keralam",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "2FR2+GRG Mannarkad-I, Keralam",
    "Name of RTO /Name of incharge": "C U MUJIB",
    "Official Mobile Number - RTO": "9447107111",
    "Name of JRTO / Name of Incharge": "N A MORRIS",
    "Official Mobile Number - JRTO": "9446180884",
    "Landline Number/Office Mobile No/ PRO Contact": "04924223090",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Driver - daily wage staff ",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Bills not available from Petrol pump",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9447185100"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Palakkad",
    "Office Name": "KL51, Sub RTO Ottappalam",
    "Year of Functioning at Current Office": "2017",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2200",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Leoo8z6oLwxESe7k9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "no",
    "Name of RTO /Name of incharge": "MUJEEB C U ",
    "Official Mobile Number - RTO": "8547639009",
    "Name of JRTO / Name of Incharge": "THARA G C",
    "Official Mobile Number - JRTO": "8547639051",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917351",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "7",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "7",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "30/06/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "10201",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "30510",
    "Details of Office expenses/Other expenses pending": "305",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Palakkad",
    "Office Name": "KL52, Sub RTO Pattambi",
    "Year of Functioning at Current Office": "2007",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2850",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/qs7EV8XCXegPqHGo8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "10.820834 , 76.184784",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "10.811609 , 76.803837",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "Sri Mujeeb C U",
    "Official Mobile Number - RTO": "8547639009",
    "Name of JRTO / Name of Incharge": "Sri Raju   K A",
    "Official Mobile Number - JRTO": "8547639052",
    "Landline Number/Office Mobile No/ PRO Contact": "04662214182",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "4",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Sr Gr Typist -1 (on Medical Leave",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "NA",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/06/2026",
    "Fuel bills dues - Amount pending for payment": "37661",
    "Details of Office expenses/Other expenses pending": "NA",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Malappuram",
    "Office Name": "KL53, Sub RTO Perinthalmanna",
    "Year of Functioning at Current Office": "2016",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2174",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/UxPtHyWp7JTPXMN17",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "JOYI V",
    "Official Mobile Number - RTO": "8547639010",
    "Name of JRTO / Name of Incharge": "PADMAKUMAR PK",
    "Official Mobile Number - JRTO": "8547639053",
    "Landline Number/Office Mobile No/ PRO Contact": "04933 220856",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "",
    "Rent due from": "01/04/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/04/2026",
    "Fuel bills dues - Amount pending for payment": "48000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Malappuram",
    "Office Name": "KL54, Sub RTO Ponnani",
    "Year of Functioning at Current Office": "2002",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1700",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/3jpwyb5UyNJnToXm7",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "CF test is conducting at Ponnani harbor road and DL test is conducting at Ponnani harbor  ground",
    "Name of RTO /Name of incharge": "Joyi V",
    "Official Mobile Number - RTO": "8547639010",
    "Name of JRTO / Name of Incharge": "George Thomas",
    "Official Mobile Number - JRTO": "8547639054",
    "Landline Number/Office Mobile No/ PRO Contact": "0494-2667511",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "4",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "20/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "PENDING BILLS FOR AUGUST 2026",
    "Repair & Maintenance dues - Amount pending for payment": "9863",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "11000",
    "Details of Office expenses/Other expenses pending": "NO",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "05-10-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL56, Sub RTO Koyilandy",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3415",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/n9m2RCg1nnkBxN9CA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "PULIYANCHERI-11.47278 NORTH/75.68254 EAST",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "CHENGOTTUKAVU-11.428 NORTH/75.702 EAST",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NO",
    "Name of RTO /Name of incharge": "SAJEESH P K",
    "Official Mobile Number - RTO": "8547639018",
    "Name of JRTO / Name of Incharge": "PRAJEESH M K",
    "Official Mobile Number - JRTO": "8547639056",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917356",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NIL",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "322080",
    "Rent due from": "01/07/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "30-09-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL57, Sub RTO Koduvally",
    "Year of Functioning at Current Office": "2014",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/ycY4rMRJasr9Sq776?g_st=ac",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Saturday",
    "How many DL test grounds/loactions are available?": "3",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/KFPnK85LxRhxXHNM6?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "https://maps.app.goo.gl/khDx3n7m8LCMH55J7?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "https://maps.app.goo.gl/kiVA2Vrw27VEr3on8?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/Bp8uSVAtx2PMeisN9?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "Nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "Nil",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Nil",
    "Name of RTO /Name of incharge": "Jebi I Cherian",
    "Official Mobile Number - RTO": "8547639011",
    "Name of JRTO / Name of Incharge": "BIJOY E S",
    "Official Mobile Number - JRTO": "8547639057",
    "Landline Number/Office Mobile No/ PRO Contact": "04952210280",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Super numerory Clerk ",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "August fuel bill amount not received ",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kannur",
    "Office Name": "KL58, Sub RTO Thalassery",
    "Year of Functioning at Current Office": "2019",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "4230",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.google.com/maps?q=11.7670654%2C75.517681&z=17&hl=en",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/6KadrGN6YZ9Ha7v68?g_st=awb",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "KINFRA ROAD 3RD MILE ERANHOLI (ROAD SIDE)",
    "Name of RTO /Name of incharge": "E S UNNIKRISHNAN ",
    "Official Mobile Number - RTO": "8547639013",
    "Name of JRTO / Name of Incharge": "VENUGOPALAN T V",
    "Official Mobile Number - JRTO": "8547639058",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917358",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "7",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "7",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 DRIVER  ON DAILY WAGES APPOINTMENT BY EMPLOYMENT EXCHANGE ",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "347313",
    "Rent due from": "01/07/2026",
    "Bills submitted to head office on": "19/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "6612",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "13219",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kannur",
    "Office Name": "KL59, Sub RTO Taliparamba",
    "Year of Functioning at Current Office": "2013",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "408.87",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/5TudDt9SVmd1EXE37  ",
    "Do office have own DL,CF test ground?": "ATS",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/4YE7E5y5drEoF9U86",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/4YE7E5y5drEoF9U86",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NO",
    "Name of RTO /Name of incharge": "E S UNNIKRISHNAN",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "SHANAVAS KAREEM",
    "Official Mobile Number - JRTO": "9447200255",
    "Landline Number/Office Mobile No/ PRO Contact": "04602206580",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "UD TYPIST, DRIVER ( TEMPORARY)",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "36000",
    "Details of Office expenses/Other expenses pending": "REPAIR AND MAINTENANCE OF DEPT VEHICLE",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL61, Sub RTO Kunnathur",
    "Year of Functioning at Current Office": "2012",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3236",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Ey8q7d4qZbvajyFDA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "ROAD SIDE",
    "Name of RTO /Name of incharge": "1",
    "Official Mobile Number - RTO": "8547639002",
    "Name of JRTO / Name of Incharge": "BINUKUTTAN PILLAI B",
    "Official Mobile Number - JRTO": "8547639061",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917361",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "4",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 DRIVER DAILY WAGES AVAILABLE",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "122210",
    "Rent due from": "01/12/2025",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/06/2026",
    "Fuel bills dues - Amount pending for payment": "30324",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "KL62, Sub RTO Ranni",
    "Year of Functioning at Current Office": "2011",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2523",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Ts4oXdBS3Kpp6Ek38",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/MFLo2NEyYa6gUfat8",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/HyfjqxLTv5E83WNH8",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "C SHYAM",
    "Official Mobile Number - RTO": "8547639003",
    "Name of JRTO / Name of Incharge": "PRADEEP KUMAR T P",
    "Official Mobile Number - JRTO": "8547639062",
    "Landline Number/Office Mobile No/ PRO Contact": "04735228866",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "4",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NA",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "280000",
    "Rent due from": "01/06/2024",
    "Bills submitted to head office on": "15/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "AMOUNT ALLOTTMENT PENDING",
    "Repair & Maintenance dues - Amount pending for payment": "11341",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "26,433",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "8547639087"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "KL63, Sub RTO Angamaly",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2131",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/z6kdZrJwzQXZoazs8?g_st=aw",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "3",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/Eptf8URZpYvmXPuM9?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "https://maps.app.goo.gl/oBgDfUSDqP4NeSXg7?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "https://maps.app.goo.gl/Mjv2BdeRUxtS9TTh8?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/hVgLtHYYiiAFerZQ6?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8547539007",
    "Name of JRTO / Name of Incharge": "ABILASH K B",
    "Official Mobile Number - JRTO": "8547639063",
    "Landline Number/Office Mobile No/ PRO Contact": "04842456333",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "28/09/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Allotment   not received ",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "18/08/2025",
    "Fuel bills dues - Amount pending for payment": "204000",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thrissur",
    "Office Name": "KL64, Sub RTO Chalakudy",
    "Year of Functioning at Current Office": "2011",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2200",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/j513LQyiaMVwWf1h9?g_st=ac",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/QErsvwBGzHJBxThs8?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "+919447125320",
    "Name of JRTO / Name of Incharge": "RAJESH A R",
    "Official Mobile Number - JRTO": "9895398627",
    "Landline Number/Office Mobile No/ PRO Contact": "O4802700064",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "1",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "1",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "17/06/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "04/04/2026",
    "Fuel bills dues - Amount pending for payment": "85000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Malappuram",
    "Office Name": "KL65, Sub RTO Tirurangadi",
    "Year of Functioning at Current Office": "2011",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2956",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/BtN9cyh7XiPXnahi6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/riCjBTdgX4xYCjG87",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/riCjBTdgX4xYCjG87",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "G SUGATHAN",
    "Official Mobile Number - JRTO": "8547639065",
    "Landline Number/Office Mobile No/ PRO Contact": "04942463000",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "5",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "5",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "4",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "fuel pending since january-2026.",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "29/01/2026",
    "Fuel bills dues - Amount pending for payment": "80286",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Alappuzha",
    "Office Name": "KL66, Sub RTO Kuttanad",
    "Year of Functioning at Current Office": "2013",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2900",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/k9ocaMnkYc2kqfSV8?g_st=aw",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/WCLrJAKWygpKpFV19",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/BJqp5pohu9iJvmGu5?g_st=ac",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side at Pallikkutumma",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "8567639004",
    "Name of JRTO / Name of Incharge": "Subi S",
    "Official Mobile Number - JRTO": "8547639066",
    "Landline Number/Office Mobile No/ PRO Contact": "04772706060",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 JRTO & 1 Attander",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "808960",
    "Rent due from": "01/06/2023",
    "Bills submitted to head office on": "09/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0 (But pending for apprroval Rs 15988)",
    "Bills due from": "01/06/2026",
    "Fuel bills dues - Amount pending for payment": "18503",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kottayam",
    "Office Name": "KL67, Sub RTO Uzhavoor",
    "Year of Functioning at Current Office": "2013",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3600",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/4dibGpJA3bTkq7eF6",
    "Do office have own DL,CF test ground?": "Yes, ATS",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/4XFFS3qWNHSHtRC8A",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/4XFFS3qWNHSHtRC8A",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "D JAYARAJ",
    "Official Mobile Number - RTO": "04812560429",
    "Name of JRTO / Name of Incharge": "B SHERLY",
    "Official Mobile Number - JRTO": "04822249967",
    "Landline Number/Office Mobile No/ PRO Contact": "9188961767",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "1",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "ATTENDER,TYPIST,",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "266890",
    "Rent due from": "01/09/2025",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "18/08/2026",
    "Fuel bills dues - Amount pending for payment": "8272",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "04842423030"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Idukki",
    "Office Name": "KL68, Sub RTO Devikulam",
    "Year of Functioning at Current Office": "13",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3706",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/xNVdV3X9YPbnv3rQA",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday",
    "Which all days CF test conducted?": "Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "2",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "10. 033605, 76.858436",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "10.074116,77.060756",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "10.009765, 76.958411",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "10.074116,77.060756",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "Sameer P A",
    "Official Mobile Number - RTO": "9188961906",
    "Name of JRTO / Name of Incharge": "James P J",
    "Official Mobile Number - JRTO": "8547639068",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917368",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Attender 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "680000",
    "Rent due from": "01/05/2025",
    "Bills submitted to head office on": "08/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "04/06/2026",
    "Fuel bills dues - Amount pending for payment": "18493",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Idukki",
    "Office Name": "KL69, Sub RTO Udumbanchola",
    "Year of Functioning at Current Office": "2013",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2215",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/Xen1cysnW2rcLq2L7",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.818320N,77.182320E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.832431N,77.159275E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Cf is conducting at roadside...no other dedicated  place available",
    "Name of RTO /Name of incharge": "SRI SAMEER P A  ( IC)",
    "Official Mobile Number - RTO": "8547639006",
    "Name of JRTO / Name of Incharge": "HAFEES YOOSEF",
    "Official Mobile Number - JRTO": "8547639069",
    "Landline Number/Office Mobile No/ PRO Contact": "04868233646",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "5",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Attender--01,    UDT--01",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "14/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "Yes",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Palakkad",
    "Office Name": "KL70, Sub RTO Chittur",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2468",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/k6kcC2RHrEnW2kav8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "2",
    "How many CF test grounds/locations are available?": "2",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Pencos Ground, Cherumkode Rd, Chittur-Thathamangalam, Keralam 678102",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "Nelliyampathy Rd, Pothundy, Kombankallu, Keralam 678508",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "Mooppankulam, Vandithavalam, Keralam",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "Nelliyampathy Rd, Pothundy, Kombankallu, Keralam 678508",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "Mujeeb C U",
    "Official Mobile Number - RTO": "8547639009",
    "Name of JRTO / Name of Incharge": "Brinda Sanil",
    "Official Mobile Number - JRTO": "8547639070",
    "Landline Number/Office Mobile No/ PRO Contact": "04923 222677/9188917370",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "2",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "2",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "1",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Attender 1",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "16/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "6798",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "20326",
    "Details of Office expenses/Other expenses pending": "150000 (stamp and other items)",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Malappuram",
    "Office Name": "KL71, Sub RTO Nilambur",
    "Year of Functioning at Current Office": "2013",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "225.5",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/9SnNuzPwms4j6fUn8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11.285035, 76.240613",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NIL",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "11.306121, 76,250240",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "11.298422, 76.236966",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NIL",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NIL",
    "Name of RTO /Name of incharge": "JOYI V",
    "Official Mobile Number - RTO": "8547639010",
    "Name of JRTO / Name of Incharge": "PRASANTH V, JRTO INCHARGE",
    "Official Mobile Number - JRTO": "8547639071",
    "Landline Number/Office Mobile No/ PRO Contact": "04931-226008",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "5",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "4",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "typist selection grade - 1 nos",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Wayanad",
    "Office Name": "KL72, Sub RTO Mananthavady",
    "Year of Functioning at Current Office": "2012",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3385",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/o9uPbYdiQ2WsbMu28",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11.7665417, 76.0023706",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "11.7385479, 76.023421",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "not applicable",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "5th mile to Karakkamala road side ",
    "Name of RTO /Name of incharge": "SUMESH P R",
    "Official Mobile Number - RTO": "8547639012",
    "Name of JRTO / Name of Incharge": "NAJEEB A K",
    "Official Mobile Number - JRTO": "8547639072",
    "Landline Number/Office Mobile No/ PRO Contact": "04935227972",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "NO",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "44619",
    "Rent due from": "01/06/2026",
    "Bills submitted to head office on": "29/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "PROCESSING",
    "Repair & Maintenance dues - Amount pending for payment": "5000",
    "Bills due from": "01/06/2026",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "05-10-2026",
    "Select District": "Wayanad",
    "Office Name": "KL73, Sub RTO Sulthan Bathery",
    "Year of Functioning at Current Office": "2013",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2796.52",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/jjSYu5bDPdCLhNJk9",
    "Do office have own DL,CF test ground?": "Yes, No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "M7G7+PX3 Kuppady,  Sulthanbathery",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "M7G7+PX3 Kuppady,  Sulthanbathery",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "M77C+672 Sulthanbathery",
    "Name of RTO /Name of incharge": "Sumesh P R ",
    "Official Mobile Number - RTO": "8547639012",
    "Name of JRTO / Name of Incharge": "Jai devan K R ",
    "Official Mobile Number - JRTO": "8547639073",
    "Landline Number/Office Mobile No/ PRO Contact": "04936227273",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "2",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Attender -I",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "65592",
    "Rent due from": "01/07/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "August and September bill pending Rs 8096/- available balance in allotment rs 1117",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/08/2026",
    "Fuel bills dues - Amount pending for payment": "6979",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "8547639084"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL74, Sub RTO Kattakkada",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2600",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/YWBjPy5AGMoFoNuL8",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Tuesday, Friday",
    "How many DL test grounds/loactions are available?": "3",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/6edSXbbNdWpqm7RU7",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "https://maps.app.goo.gl/dHKe2RYz2UaQxXLy9",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "https://maps.app.goo.gl/k2urm9zBVD6oTX1W9",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/xyRMxkQbsXhbNrgM9",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "RTO Trivandrum",
    "Official Mobile Number - RTO": "8547639001",
    "Name of JRTO / Name of Incharge": "Archana Sadasivan",
    "Official Mobile Number - JRTO": "8547639074",
    "Landline Number/Office Mobile No/ PRO Contact": "4712293553",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "1 Attender 1 Typist 1 Temporary driver 1 casual sweeper\n",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "659568",
    "Rent due from": "01/06/2025",
    "Bills submitted to head office on": "05/08/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "22/04/2026",
    "Fuel bills dues - Amount pending for payment": "45000",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thrissur",
    "Office Name": "KL75, Sub RTO Thriprayar",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "3900",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/zDmnHQNzoKb3pCmQ6?g_st=aw",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/KuAwWKcyFTsgtbeN7?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://maps.app.goo.gl/ioqXxBTXbfyDoT2y6?g_st=aw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "ANANTHAKRISHNAN G",
    "Official Mobile Number - RTO": "8547639008",
    "Name of JRTO / Name of Incharge": "MANJULA C V",
    "Official Mobile Number - JRTO": "8547639075",
    "Landline Number/Office Mobile No/ PRO Contact": "04872396575",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "1",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "1",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "1 Casual Sweeper",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "30000",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL76, Sub RTO Nanmanda",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2233",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/GpZ1B7fQ3FLuyjQe9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/5b2PaT3pLcDEvLma8",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "11.411763425731838, 75.83137028492077",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "CF tests are being conducted in front of the Central Juma Salafi Masjid at Nanmanda on the Kozhikode–Balussery Road. Since this is a comparatively busy route, it is also a location where there is a possibility of accidents occurring.",
    "Name of RTO /Name of incharge": "JEBI I CHERIAN",
    "Official Mobile Number - RTO": "8547639011",
    "Name of JRTO / Name of Incharge": "PP RAJAN",
    "Official Mobile Number - JRTO": "8547639076",
    "Landline Number/Office Mobile No/ PRO Contact": "0495 2857700",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "3",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "4",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "4",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "DRIVER GRADE II- EMPLOYMENT EXCHANGE RECRUITMENT",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "456131",
    "Rent due from": "01/07/2025",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "0",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL77, Sub RTO Perambra",
    "Year of Functioning at Current Office": "2018",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2809.38",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/JDUh1CdTX924G86s9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11.5875°N,  75.7516°",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "1156799°N,  75.75290°",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "nil",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "nil",
    "Name of RTO /Name of incharge": "SAJEESH P K ",
    "Official Mobile Number - RTO": "8547639018",
    "Name of JRTO / Name of Incharge": "PRAGEESH TM",
    "Official Mobile Number - JRTO": "8547639077",
    "Landline Number/Office Mobile No/ PRO Contact": "04962615077",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "1",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "NIL",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "01/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "FUND NOT ALLOTED",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/07/2026",
    "Fuel bills dues - Amount pending for payment": "10",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kannur",
    "Office Name": "KL78, Sub RTO Iritty",
    "Year of Functioning at Current Office": "8",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2800",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/ZLUzHHriwSMFPJJU9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Wednesday, Thursday, Friday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "11°58'54''N 75°41'6''E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "11°58'0''N 75°39'27''E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Thalassery Valavupara Road side near MG College",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "0",
    "Name of JRTO / Name of Incharge": "Antony Michael",
    "Official Mobile Number - JRTO": "8547639078",
    "Landline Number/Office Mobile No/ PRO Contact": "04902490001",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "1 Driver (Daily wages) , 1 PTS (Daily wages)",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "450281",
    "Rent due from": "01/08/2025",
    "Bills submitted to head office on": "29/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "Original computer generated bill not submitted",
    "Repair & Maintenance dues - Amount pending for payment": "13355",
    "Bills due from": "24/03/2026",
    "Fuel bills dues - Amount pending for payment": "52616",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kasaragod",
    "Office Name": "KL79, Sub RTO Vellarikkundu",
    "Year of Functioning at Current Office": "2026",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2950",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/jZFtamdBiEeh3G7UA",
    "Do office have own DL,CF test ground?": "Yes",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "PULIYAMKULAM TEST GROUND 12.343230,75.255618",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NO",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NO",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "PULIYAMKULAM TEST GROUND 12.343230,75.255618",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NO",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NO",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NO",
    "Name of RTO /Name of incharge": "JERAD J",
    "Official Mobile Number - RTO": "8547639014",
    "Name of JRTO / Name of Incharge": "SALIM C A ",
    "Official Mobile Number - JRTO": "8547639079",
    "Landline Number/Office Mobile No/ PRO Contact": "0467 2986042/9188917379",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "1",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "1",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "6",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "6",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "1",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "19/06/2026",
    "Any specific remarks (Please mention the pendency in details)": "NIL",
    "Repair & Maintenance dues - Amount pending for payment": "11700",
    "Bills due from": "01/02/2026",
    "Fuel bills dues - Amount pending for payment": "60521",
    "Details of Office expenses/Other expenses pending": "NIL",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "30-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL80, Sub RTO Pathanapuram",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2763",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://www.google.com/maps/place/Rto+Office+Pathanapuram/data=!4m2!3m1!1s0x0:0x60e4d7a2e00be13f?sa=X&ved=1t:2428&ictx=111",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Tuesday, Thursday, Saturday",
    "Which all days CF test conducted?": "Monday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://share.google/rG8QLzSrtNlzw34vC",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "https://share.google/rG8QLzSrtNlzw34vC",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA ",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA ",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "No",
    "Name of RTO /Name of incharge": "Ajithkumar K",
    "Official Mobile Number - RTO": "8547639002",
    "Name of JRTO / Name of Incharge": "SUJITH G S",
    "Official Mobile Number - JRTO": "8547639080",
    "Landline Number/Office Mobile No/ PRO Contact": "04752352595",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "3",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "1 temporary Driver, 1 temporary OA 1 PTS appointed through Employment Exchange",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "745512",
    "Rent due from": "01/09/2025",
    "Bills submitted to head office on": "30/06/2026",
    "Any specific remarks (Please mention the pendency in details)": "No",
    "Repair & Maintenance dues - Amount pending for payment": "7254",
    "Bills due from": "17/02/2026",
    "Fuel bills dues - Amount pending for payment": "96441.83",
    "Details of Office expenses/Other expenses pending": "Other expenses -Water charges Rs.3410 is due",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "KL81, Sub RTO Varkala",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3239",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/h2acRGveuw87jzKY9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Thursday, Saturday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "8.7488⁰N,  76.7285⁰ERoad",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "8.7368⁰ N ,  76.7163⁰E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Road side",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "Sheeba Rajan V",
    "Official Mobile Number - JRTO": "8547639081",
    "Landline Number/Office Mobile No/ PRO Contact": "04702613344",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "3",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "3",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "",
    "Driver - Available Strength (Nos) as on date": "",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "",
    "No of PTS available as on date": "",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "322600",
    "Rent due from": "01/11/2025",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "Allotment not received",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "02/02/2026",
    "Fuel bills dues - Amount pending for payment": "101047",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kollam",
    "Office Name": "KL82, Sub RTO Chadayamangalam",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Others",
    "Total Office Area (in Square Feet)": "2098",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/QHP66WCfFWHF9DVg6",
    "Do office have own DL,CF test ground?": "No, ATS",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Ajith kumar",
    "Official Mobile Number - RTO": "8547639002",
    "Name of JRTO / Name of Incharge": "Praveen cv",
    "Official Mobile Number - JRTO": "8547639082",
    "Landline Number/Office Mobile No/ PRO Contact": "04742475200",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "2",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "2",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "1",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "19/08/2026",
    "Any specific remarks (Please mention the pendency in details)": "Non availability of fund",
    "Repair & Maintenance dues - Amount pending for payment": "0",
    "Bills due from": "01/11/2025",
    "Fuel bills dues - Amount pending for payment": "42000",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "KL83, Sub RTO Konni",
    "Year of Functioning at Current Office": "2019",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1787",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/7sgoTzzmUvFVQFNP9",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Thursday, Friday",
    "Which all days CF test conducted?": "Tuesday, Thursday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "9.14'11.1\"N76.49'52.3\"E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "9.14'00.6\"N76.50'29.8\"E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "9.14'00.6\"N76.50'29.8\"E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "9.14'53.7\"N 76.49'08.7\"E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "9.14'00.6\"N76.50'29.8\"E",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "9.14'00.6\"N76.50'29.8\"E",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "C SYAM",
    "Official Mobile Number - RTO": "8547639003",
    "Name of JRTO / Name of Incharge": "ARUN KUMAR K",
    "Official Mobile Number - JRTO": "8567439083",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917383",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "On leave",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "1",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "1",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "3",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "262482",
    "Rent due from": "01/04/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "262482",
    "Bills due from": "01/06/2026",
    "Fuel bills dues - Amount pending for payment": "30547",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Malappuram",
    "Office Name": "KL84, Sub RTO Kondotty",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "4000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/X24h7SHR77XFsiDv5",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Wednesday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "https://maps.app.goo.gl/dbn8Ufj2cXSPjfWMA?g_st=iw",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "N A",
    "Name of JRTO / Name of Incharge": "Mini AP",
    "Official Mobile Number - JRTO": "8547639084",
    "Landline Number/Office Mobile No/ PRO Contact": "",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "1",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "2",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "2",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Temporary post",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "O",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "623640",
    "Rent due from": "01/10/2025",
    "Bills submitted to head office on": "16/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "18000",
    "Bills due from": "17/09/2026",
    "Fuel bills dues - Amount pending for payment": "4500",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kozhikode",
    "Office Name": "KL85, Sub RTO Feroke / Ramanattukara",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "462",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/ojfYHezwFoS6X4TP7",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Jebi Cherian",
    "Official Mobile Number - RTO": "8547639011",
    "Name of JRTO / Name of Incharge": "Sakariya  C P",
    "Official Mobile Number - JRTO": "8547639085",
    "Landline Number/Office Mobile No/ PRO Contact": "0495 2486002",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "3",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "2",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "2",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "1",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "1",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "1",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "4802667",
    "Rent due from": "29/09/2020",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "22691",
    "Bills due from": "24/07/2026",
    "Fuel bills dues - Amount pending for payment": "1500",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kannur",
    "Office Name": "KL86, Sub RTO Payyannur",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "4000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/hEdWhuAhC2WGXrxe6",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Monday, Tuesday, Thursday, Friday, Saturday",
    "Which all days CF test conducted?": "Monday, Tuesday, Thursday, Friday",
    "How many DL test grounds/loactions are available?": "1",
    "How many CF test grounds/locations are available?": "1",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Lattitude 12.1311 degree north 75.2215 east ",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "Nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "Nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "12.1158 north, 75.1973 east",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "Nil",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "Nil",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Na",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "",
    "Name of JRTO / Name of Incharge": "SHANAVAS KAREEM ",
    "Official Mobile Number - JRTO": "8547639086",
    "Landline Number/Office Mobile No/ PRO Contact": "9188917386",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Yes",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "2",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "2",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "2",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "3",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "3",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "2",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "2",
    "Driver - Sanctioned Strength (Nos)": "0",
    "Driver - Available Strength (Nos) as on date": "0",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "0",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "141873",
    "Rent due from": "01/07/2026",
    "Bills submitted to head office on": "07/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "6674",
    "Bills due from": "06/08/2026",
    "Fuel bills dues - Amount pending for payment": "20000",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Alappuzha",
    "Office Name": "RTO Enforcement Alappuzha",
    "Year of Functioning at Current Office": "2021",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1500",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/yyHRnBGVNz3Gi8Xe9",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "",
    "Official Mobile Number - RTO": "9188961004",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "NA",
    "Landline Number/Office Mobile No/ PRO Contact": "9188963104",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "7",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "18",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "14",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "1",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "NO",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "5",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "503418",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "29/09/2026",
    "Any specific remarks (Please mention the pendency in details)": "All diesel vehicles are not in operation due to un availability of fuel",
    "Repair & Maintenance dues - Amount pending for payment": "125637",
    "Bills due from": "26/12/2025",
    "Fuel bills dues - Amount pending for payment": "96395.98",
    "Details of Office expenses/Other expenses pending": "Upcoming Comprehensive insurance payment of the new Bolero  KL01DG4280",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Ernakulam",
    "Office Name": "RTO Enforcement Ernakulam",
    "Year of Functioning at Current Office": "2014",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1850",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/9wtic1Qr25AjwXEg8",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Biju Isac ",
    "Official Mobile Number - RTO": "9188961007",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "0",
    "Landline Number/Office Mobile No/ PRO Contact": "9188961207",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "9",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "9",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "24",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "16",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Attachent\nClerk 1\nOffice attendant 2",
    "No Of Diesel Vehicles Available": "4",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "4",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "01/02/2025",
    "Any specific remarks (Please mention the pendency in details)": "The data submitted till 31/08/2026, The current month billnot submitted.",
    "Repair & Maintenance dues - Amount pending for payment": "187,192",
    "Bills due from": "12/01/2025",
    "Fuel bills dues - Amount pending for payment": "241,508",
    "Details of Office expenses/Other expenses pending": " drining water + cleaning material 15400",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "9188961965"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Idukki",
    "Office Name": "RTO Enforcement Idukki",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1443",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/wMnohzZLjhxUakY59",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "SHEFIQ B ",
    "Official Mobile Number - RTO": "9188961006",
    "Name of JRTO / Name of Incharge": "",
    "Official Mobile Number - JRTO": ".",
    "Landline Number/Office Mobile No/ PRO Contact": "04862299266",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "No",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "7",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "18",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "17",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "2",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "6",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "3",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "500600",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "52322",
    "Bills due from": "31/01/2026",
    "Fuel bills dues - Amount pending for payment": "242053",
    "Details of Office expenses/Other expenses pending": "0",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "03-10-2026",
    "Select District": "Kasaragod",
    "Office Name": "RTO Enforcement Kasaragod",
    "Year of Functioning at Current Office": "2021",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2100",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "Jarad J",
    "Official Mobile Number - RTO": "9188961014",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "NA",
    "Landline Number/Office Mobile No/ PRO Contact": "9188963114",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "9",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "7",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Clerk from RTO kasaragod on temporary arrangement",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "2",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "689967.28",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "15/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "Fuel bills upto August 2026 received",
    "Repair & Maintenance dues - Amount pending for payment": "30822",
    "Bills due from": "01/11/2025",
    "Fuel bills dues - Amount pending for payment": "172987.36",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Kollam",
    "Office Name": "RTO Enforcement Kollam",
    "Year of Functioning at Current Office": "2021",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "2090",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://maps.app.goo.gl/HeZW4e8f3kRkLGye9",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "DILU A K",
    "Official Mobile Number - RTO": "9188961002",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "0",
    "Landline Number/Office Mobile No/ PRO Contact": "04742993335",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "8",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "8",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "21",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "18",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "1",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "1",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "5",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "31/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "Fuel Dues: Approximately ₹2.1 Lakhs is pending payment to the fuel station .Fuel dispensing may be stopped from next month onwards.\nvehicle Service Dues: Approximately ₹1.53 Lakh is pending payment to service dealers.",
    "Repair & Maintenance dues - Amount pending for payment": "153489.6",
    "Bills due from": "01/01/2026",
    "Fuel bills dues - Amount pending for payment": "212064",
    "Details of Office expenses/Other expenses pending": "The RCCB (Residual Current Circuit Breaker) in the main electrical power distribution board failed, causing a complete power blackout in the control room. To immediately restore operations, a new RCCB was purchased and installed out-of-pocket; reimbursement of this expense is requested (Rs:4500).",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "9188961961"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Kottayam",
    "Office Name": "RTO Enforcement Kottayam",
    "Year of Functioning at Current Office": "2019",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1733",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "Latitude -53.273400 Longitude - -7.778320",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "Shri. Jayaraj D",
    "Official Mobile Number - RTO": "9188961005",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "0",
    "Landline Number/Office Mobile No/ PRO Contact": "0481 2935151",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "7",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "18",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "16",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "1",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "NIL",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "6",
    "No of Vehicles Over 10 Years Old": "2",
    "Office building rent dues - Amount pending for payment": "324944",
    "Rent due from": "02/01/2026",
    "Bills submitted to head office on": "04/02/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "200000",
    "Bills due from": "27/02/2026",
    "Fuel bills dues - Amount pending for payment": "160000",
    "Details of Office expenses/Other expenses pending": "OFFICE AC AND PRINTER NEED TO REPAIR",
    "Name Of DTC/In Charge": "SAJI PRASAD G.S",
    "Official Mobile Number - DTC/In charge": "94475 02866"
  },
  {
    "Timestamp": "05-10-2026",
    "Select District": "Kozhikode",
    "Office Name": "RTO Enforcement Kozhikode",
    "Year of Functioning at Current Office": "2019",
    "Building Type": "Government Building",
    "Total Office Area (in Square Feet)": "1800",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "11°16'29.7\"N 75°49'26.4\"E",
    "Do office have own DL,CF test ground?": "No",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "JEBI I CHERIAN",
    "Official Mobile Number - RTO": "9188961011",
    "Name of JRTO / Name of Incharge": "",
    "Official Mobile Number - JRTO": "NA",
    "Landline Number/Office Mobile No/ PRO Contact": "04952355588",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "9",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "9",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "25",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "25",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "5",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "4",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "06/10/2026",
    "Any specific remarks (Please mention the pendency in details)": "insufficient fund ",
    "Repair & Maintenance dues - Amount pending for payment": "106500",
    "Bills due from": "05/10/2026",
    "Fuel bills dues - Amount pending for payment": "112000",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9020806050"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Malappuram",
    "Office Name": "RTO Enforcement Malappuram",
    "Year of Functioning at Current Office": "2019",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1821",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "https://goo.gl/maps/XFT99RNzd44MriWF6?g_st=aw",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "",
    "Which all days CF test conducted?": "",
    "How many DL test grounds/loactions are available?": "",
    "How many CF test grounds/locations are available?": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "",
    "Name of RTO /Name of incharge": "YOUSAF T P",
    "Official Mobile Number - RTO": "9188961010",
    "Name of JRTO / Name of Incharge": "",
    "Official Mobile Number - JRTO": "9188963110",
    "Landline Number/Office Mobile No/ PRO Contact": "9188963110",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "7",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "6",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "18",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "14",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "6",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "176840",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "01/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "698208",
    "Bills due from": "05/06/2024",
    "Fuel bills dues - Amount pending for payment": "168362",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "ANOOP VARKEY ",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "29-09-2026",
    "Select District": "Palakkad",
    "Office Name": "RTO Enforcement Palakkad",
    "Year of Functioning at Current Office": "2020",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1816",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "QMFR+3QH, Chandranagar Colony Extension, Kootupatha, Palakkad, Keralam 678007",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "Not applicable ",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "Not applucable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "Not applicable ",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Not applicable ",
    "Name of RTO /Name of incharge": "Reghu K. B",
    "Official Mobile Number - RTO": "9188961009",
    "Name of JRTO / Name of Incharge": "Not applicable ",
    "Official Mobile Number - JRTO": "Na",
    "Landline Number/Office Mobile No/ PRO Contact": "0491- 2950040",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "7",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "7",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "18",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "17",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "Nil",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "5",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "584937",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "08/08/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "212134",
    "Bills due from": "01/11/2025",
    "Fuel bills dues - Amount pending for payment": "141720",
    "Details of Office expenses/Other expenses pending": "Nil",
    "Name Of DTC/In Charge": "ANOOP VARKEY ",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Pathanamthitta",
    "Office Name": "RTO Enforcement Pathanamthitta",
    "Year of Functioning at Current Office": "2021",
    "Building Type": "Others",
    "Total Office Area (in Square Feet)": "1495",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "Latitude 9.3809° N Longitude 76.56932° E",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "Nisha K Moni",
    "Official Mobile Number - RTO": "9188961003",
    "Name of JRTO / Name of Incharge": "",
    "Official Mobile Number - JRTO": "na",
    "Landline Number/Office Mobile No/ PRO Contact": "0469290093",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "6",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "6",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "15",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "12",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "1",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "",
    "No of PTS available as on date": "",
    "Any other staffs available other than above said. Mention below the details": "NA",
    "No Of Diesel Vehicles Available": "3",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "4",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "308252.29",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "104910",
    "Bills due from": "16/08/2025",
    "Fuel bills dues - Amount pending for payment": "138907.61",
    "Details of Office expenses/Other expenses pending": "NA",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": ""
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thiruvananthapuram",
    "Office Name": "RTO Enforcement Thiruvananthapuram",
    "Year of Functioning at Current Office": "2021",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "3000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "8.480324547280363, 76.94655302312292",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "AJITHKUMAR V S",
    "Official Mobile Number - RTO": "9188961001",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "0",
    "Landline Number/Office Mobile No/ PRO Contact": "9188961001",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "9",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "9",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "24",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "23",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "1",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "2",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "NA",
    "No Of Diesel Vehicles Available": "5",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "6",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "0",
    "Rent due from": "",
    "Bills submitted to head office on": "",
    "Any specific remarks (Please mention the pendency in details)": "nil",
    "Repair & Maintenance dues - Amount pending for payment": "25000",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "41139",
    "Details of Office expenses/Other expenses pending": "Insurance - 30,000",
    "Name Of DTC/In Charge": "JOSHY K",
    "Official Mobile Number - DTC/In charge": "NA"
  },
  {
    "Timestamp": "28-09-2026",
    "Select District": "Thrissur",
    "Office Name": "RTO Enforcement Thrissur",
    "Year of Functioning at Current Office": "2022",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "2000",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "10.476068983824565, 76.24853774320594",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "NA",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "NA",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "NA",
    "Name of RTO /Name of incharge": "Sindhu K B",
    "Official Mobile Number - RTO": "9188961008",
    "Name of JRTO / Name of Incharge": "NA",
    "Official Mobile Number - JRTO": "0",
    "Landline Number/Office Mobile No/ PRO Contact": "04872357008",
    "Regional Transport Officer (RTO) available as on date": "Yes",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "8",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "6",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "21",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "12",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "1",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "4",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "6",
    "No of Vehicles Over 10 Years Old": "1",
    "Office building rent dues - Amount pending for payment": "677544",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "09/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "No fund allotted to RTO E Thrissur after 17.11.2025",
    "Repair & Maintenance dues - Amount pending for payment": "139867",
    "Bills due from": "26/02/2026",
    "Fuel bills dues - Amount pending for payment": "68016",
    "Details of Office expenses/Other expenses pending": "No fund allotment to this office.",
    "Name Of DTC/In Charge": "ANOOP VARKEY",
    "Official Mobile Number - DTC/In charge": "9188961971"
  },
  {
    "Timestamp": "05-10-2026",
    "Select District": "Wayanad",
    "Office Name": "RTO Enforcement Wayanad",
    "Year of Functioning at Current Office": "2019",
    "Building Type": "Rented",
    "Total Office Area (in Square Feet)": "1500",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of Office": "11.634856,76.088541",
    "Do office have own DL,CF test ground?": "Not Applicable",
    "Which all days DL test conducted?": "Not Applicable",
    "Which all days CF test conducted?": "Not Applicable",
    "How many DL test grounds/loactions are available?": "Not Applicable",
    "How many CF test grounds/locations are available?": "Not Applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 1": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 2": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of DL test ground 3": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 1": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 2": "Not applicable",
    "GPS Location / Coordinates(Paste Google Maps pin link or latitude/longitude) of CF test ground 3": "Not applicable",
    "Mention the details of location if CF test is conducting at any other place other than a dedicated space (E.g.. Road side)": "Not applicable",
    "Name of RTO /Name of incharge": "SUMESH P R (IN CHARGE)",
    "Official Mobile Number - RTO": "9188961012",
    "Name of JRTO / Name of Incharge": "NOT APPLICABLE",
    "Official Mobile Number - JRTO": "NOT APPLICABLE",
    "Landline Number/Office Mobile No/ PRO Contact": "9188963112",
    "Regional Transport Officer (RTO) available as on date": "No",
    "Joint Regional Transport Officer (JRTO) available as on date": "Not Applicable",
    "Motor Vehicles Inspector (MVI) - Sanctioned Strength (Nos)": "4",
    "Motor Vehicles Inspector (MVI) - Available Strength (Nos) as on date": "4",
    "Assistant Motor Vehicles Inspector (AMVI) - Sanctioned Strength (Nos)": "9",
    "Assistant Motor Vehicles Inspector (AMVI) - Available Strength (Nos) as on date": "8",
    "Senior Superintendent (SS) - Sanctioned Strength (Nos)": "0",
    "Senior Superintendent (SS) - Available Strength (Nos) as on date": "0",
    "Junior Superintendent (JS) - Sanctioned Strength (Nos)": "0",
    "Junior Superintendent (JS) - Available Strength (Nos) as on date": "0",
    "Senior Clerk / Clerk - Sanctioned Strength (Nos)": "0",
    "Senior Clerk / Clerk - Available Strength (Nos) as on date": "0",
    "Head Assistant (HA) / PRO - Sanctioned Strength (Nos)": "0",
    "Head Assistant (HA) / PRO - Available Strength (Nos) as on date": "0",
    "Driver - Sanctioned Strength (Nos)": "2",
    "Driver - Available Strength (Nos) as on date": "2",
    "Office Attendant (OA) - Sanctioned Strength (Nos)": "0",
    "Office Attendant (OA) - Available Strength (Nos) as on date": "0",
    "No of PTS available as on date": "0",
    "Any other staffs available other than above said. Mention below the details": "0",
    "No Of Diesel Vehicles Available": "2",
    "No Of Petrol Vehicles Available": "0",
    "No Of Electric Vehicles Available": "3",
    "No of Vehicles Over 10 Years Old": "0",
    "Office building rent dues - Amount pending for payment": "283200",
    "Rent due from": "01/02/2026",
    "Bills submitted to head office on": "17/07/2026",
    "Any specific remarks (Please mention the pendency in details)": "",
    "Repair & Maintenance dues - Amount pending for payment": "38114",
    "Bills due from": "",
    "Fuel bills dues - Amount pending for payment": "50190",
    "Details of Office expenses/Other expenses pending": "",
    "Name Of DTC/In Charge": "C.V.M SHARIEF",
    "Official Mobile Number - DTC/In charge": "9188961978"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SAMPLE_SHEET_DATA;
}
if (typeof window !== 'undefined') {
  window.SAMPLE_SURVEY_DATA = SAMPLE_SHEET_DATA;
}


/* ==================== data-adapter.js ==================== */
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


/* ==================== supabase-service.js ==================== */
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
      .channel('public:rto_offices')
      .on('postgres_changes', { event: '*', schema: 'public', table: this.config.tableName }, async (payload) => {
        console.log('⚡ Supabase Realtime Change Detected:', payload.eventType);
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
      const { data, error } = await this.client
        .from(this.config.tableName)
        .select('*')
        .order('district', { ascending: true })
        .order('office_name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No records returned from Supabase rto_offices table.');
      }

      // Convert Supabase rows to typed OfficeRecord
      const transformedRecords = data.map((row, idx) => {
        // If raw_payload is stored, we can feed it into DataAdapter
        if (row.raw_payload && Object.keys(row.raw_payload).length > 0) {
          const rec = DataAdapter.transformRow(row.raw_payload, idx);
          rec.id = row.id;
          rec.customFields = row.custom_fields || {};
          if (row.office_name) rec.officeName = row.office_name;
          if (row.district) rec.district = row.district;
          if (row.building_type) rec.buildingType = row.building_type;
          if (row.year_of_functioning) rec.yearOfFunctioning = row.year_of_functioning;
          if (row.total_office_area !== undefined && row.total_office_area !== null) rec.totalArea = parseFloat(row.total_office_area);
          if (row.rto_name) rec.rtoName = row.rto_name;
          if (row.rto_mobile) rec.rtoMobile = row.rto_mobile;
          if (row.jrto_name) rec.jrtoName = row.jrto_name;
          if (row.jrto_mobile) rec.jrtoMobile = row.jrto_mobile;
          if (row.rent_dues_amount !== undefined && row.rent_dues_amount !== null) rec.rentDues = parseFloat(row.rent_dues_amount);
          if (row.repair_dues_amount !== undefined && row.repair_dues_amount !== null) rec.repairDues = parseFloat(row.repair_dues_amount);
          if (row.fuel_dues_amount !== undefined && row.fuel_dues_amount !== null) rec.fuelDues = parseFloat(row.fuel_dues_amount);
          rec.totalFinancialDues = (rec.rentDues || 0) + (rec.repairDues || 0) + (rec.fuelDues || 0) + (rec.otherExpensesAmount || 0);
          return rec;
        }

        // Direct mapping from Supabase Postgres schema
        const officeGps = DataAdapter.extractCoordinates(
          (row.office_latitude && row.office_longitude) 
            ? `${row.office_latitude}, ${row.office_longitude}` 
            : row.office_gps_raw
        );

        const dlGps1 = DataAdapter.extractCoordinates(
          (row.dl_gps_1_lat && row.dl_gps_1_lng) 
            ? `${row.dl_gps_1_lat}, ${row.dl_gps_1_lng}` 
            : row.dl_gps_1_raw
        );
        const dlGps2 = DataAdapter.extractCoordinates(row.dl_gps_2_raw);
        const dlGps3 = DataAdapter.extractCoordinates(row.dl_gps_3_raw);

        const cfGps1 = DataAdapter.extractCoordinates(
          (row.cf_gps_1_lat && row.cf_gps_1_lng) 
            ? `${row.cf_gps_1_lat}, ${row.cf_gps_1_lng}` 
            : row.cf_gps_1_raw
        );
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
          isRented: (row.building_type || '').toLowerCase().includes('rent')
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


/* ==================== sheet-service.js ==================== */
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


/* ==================== charts.js ==================== */
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


/* ==================== map.js ==================== */
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


/* ==================== export.js ==================== */
/**
 * RTO Survey & Monitoring Dashboard - Reporting & Export Engine
 * 
 * Generates formatted executive reports respecting current active filters:
 * 1. Microsoft Excel (.xlsx) via SheetJS
 * 2. Comma-Separated Values (.csv)
 * 3. PDF executive dossier via jsPDF / html2pdf
 * 4. High-fidelity print stylesheet for office profiles
 */

class ReportExporter {
  /**
   * Prepares flat, human-readable tabular data for Excel & CSV export
   */
  static prepareExportRows(offices) {
    return offices.map(o => ({
      'District': o.district,
      'Office Name': o.officeName,
      'Building Type': o.buildingType,
      'Year of Functioning': o.yearOfFunctioning,
      'Area (Sq Ft)': o.totalArea,
      'Office Coordinates': o.officeGps.valid ? `${o.officeGps.lat}, ${o.officeGps.lng}` : (o.officeGps.raw || 'N/A'),
      'RTO Name': o.rtoName,
      'RTO Mobile': o.rtoMobile || 'N/A',
      'JRTO Name': o.jrtoName,
      'JRTO Mobile': o.jrtoMobile || 'N/A',
      'DTC Incharge': o.dtcName,
      'Own DL/CF Ground': o.hasOwnGround ? 'Yes' : 'No',
      'DL Test Grounds': o.dlGroundsCount,
      'CF Test Grounds': o.cfGroundsCount,
      'DL Test Days': o.dlDays,
      'CF Test Days': o.cfDays,
      'CF Alternate Location': o.cfOtherLocationDetails || 'Dedicated Space',
      'Total Staff Sanctioned': o.totalSanctioned,
      'Total Staff Available': o.totalAvailable,
      'Total Vacancy': o.totalVacancy,
      'Staff Availability %': `${o.staffAvailabilityPercent}%`,
      'MVI (Sanctioned / Available / Vacancy)': `${o.mviSanctioned} / ${o.mviAvailable} / ${o.mviVacancy}`,
      'AMVI (Sanctioned / Available / Vacancy)': `${o.amviSanctioned} / ${o.amviAvailable} / ${o.amviVacancy}`,
      'Clerk (Sanctioned / Available / Vacancy)': `${o.clerkSanctioned} / ${o.clerkAvailable} / ${o.clerkVacancy}`,
      'Total Vehicles': o.totalVehicles,
      'Diesel Vehicles': o.dieselVehicles,
      'Petrol Vehicles': o.petrolVehicles,
      'Electric Vehicles': o.electricVehicles,
      'Vehicles > 10 Yrs': o.vehiclesOver10Years,
      'Rent Dues (₹)': o.rentDues,
      'Rent Due From': o.rentDueFrom || 'Nil',
      'Rent Remarks': o.rentRemarks || 'Nil',
      'Repair Dues (₹)': o.repairDues,
      'Repair Due From': o.repairDueFrom || 'Nil',
      'Repair Remarks': o.repairRemarks || 'Nil',
      'Fuel Dues (₹)': o.fuelDues,
      'Fuel Due From': o.fuelDueFrom || 'Nil',
      'Fuel Remarks': o.fuelRemarks || 'Nil',
      'Other Expenses (₹)': o.otherExpensesAmount,
      'Total Financial Dues (₹)': o.totalFinancialDues,
      'Office Health Score': o.healthScore.score,
      'Health Rating': o.healthScore.rating
    }));
  }

  /**
   * Export to Microsoft Excel (.xlsx)
   */
  static exportToExcel(offices, filename = 'RTO_Monitoring_Report') {
    if (typeof XLSX === 'undefined') {
      alert('Excel export library (SheetJS) is not loaded.');
      return;
    }

    const rows = this.prepareExportRows(offices);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    // Auto-fit column widths
    const max_width = rows.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet['!cols'] = Array(max_width).fill({ wch: 20 });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'RTO Offices');
    const timestamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
  }

  /**
   * Export to CSV
   */
  static exportToCsv(offices, filename = 'RTO_Monitoring_Report') {
    const rows = this.prepareExportRows(offices);
    if (!rows || rows.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 10);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export to PDF using html2pdf or window.print fallback
   */
  static exportToPdf(targetElementId = 'report-print-container', filename = 'RTO_Monitoring_Report') {
    const element = document.getElementById(targetElementId);
    if (!element) {
      window.print();
      return;
    }

    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  }

  /**
   * Print an individual office profile
   */
  static printOfficeProfile() {
    window.print();
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.ReportExporter = ReportExporter;
}


/* ==================== app.js ==================== */
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

