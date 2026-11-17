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


// ============================================================================
// FULL SCHEMA FOR ADMIN EDIT MODAL (All 69 Non-Excluded Supabase Columns)
// ============================================================================
const RTO_OFFICE_EDIT_SCHEMA = [
  {
    id: 'mod_basic',
    name: 'Basic Office Details & Officers',
    icon: 'fa-building',
    sections: [
      {
        id: 'sec_basic_info',
        name: 'Primary Office Information',
        icon: 'fa-id-card',
        fields: [
          {
            key: 'office_name',
            label: 'Office Name',
            type: 'office_select',
            grid: 'col-6',
            required: true,
            help: 'Switch office to edit, or select office name'
          },
          {
            key: 'district',
            label: 'District',
            type: 'district_select',
            grid: 'col-6',
            required: true,
            help: 'Administrative District in Kerala'
          },
          {
            key: 'year_of_functioning',
            label: 'Year of Functioning (Est.)',
            type: 'text',
            grid: 'col-4',
            placeholder: 'e.g. 1985'
          },
          {
            key: 'building_type',
            label: 'Building Type',
            type: 'select',
            grid: 'col-4',
            options: ['Government Building', 'Rented Building', 'Other']
          },
          {
            key: 'total_office_area',
            label: 'Total Office Area (Sq Ft)',
            type: 'number',
            grid: 'col-4',
            placeholder: 'e.g. 4500'
          }
        ]
      },
      {
        id: 'sec_office_geo',
        name: 'Office Geo-Location & GPS Coordinates',
        icon: 'fa-map-location-dot',
        fields: [
          {
            key: 'office_gps_raw',
            label: 'Office GPS Coordinates (Raw / Maps Link)',
            type: 'text',
            grid: 'col-6',
            placeholder: 'e.g. 8.5061, 76.9558 or Google Maps URL'
          },
          {
            key: 'office_latitude',
            label: 'Office Latitude',
            type: 'number',
            grid: 'col-3',
            placeholder: 'e.g. 8.5061'
          },
          {
            key: 'office_longitude',
            label: 'Office Longitude',
            type: 'number',
            grid: 'col-3',
            placeholder: 'e.g. 76.9558'
          }
        ]
      },
      {
        id: 'sec_officers',
        name: 'Key Officers & Contact Information',
        icon: 'fa-user-tie',
        fields: [
          {
            key: 'dtc_name',
            label: 'Deputy Transport Commissioner (DTC)',
            type: 'text',
            grid: 'col-6',
            placeholder: 'Officer Name'
          },
          {
            key: 'dtc_mobile',
            label: 'DTC Mobile Number',
            type: 'text',
            grid: 'col-6',
            placeholder: 'Mobile / WhatsApp'
          },
          {
            key: 'rto_name',
            label: 'RTO / Office In-Charge Name',
            type: 'text',
            grid: 'col-5',
            placeholder: 'Officer Name'
          },
          {
            key: 'rto_mobile',
            label: 'RTO Mobile Number',
            type: 'text',
            grid: 'col-4',
            placeholder: 'Mobile Number'
          },
          {
            key: 'rto_available',
            label: 'RTO In-Position / Present',
            type: 'boolean',
            grid: 'col-3',
            help: 'Currently deployed & present'
          },
          {
            key: 'jrto_name',
            label: 'Joint RTO Name',
            type: 'text',
            grid: 'col-5',
            placeholder: 'Officer Name'
          },
          {
            key: 'jrto_mobile',
            label: 'Joint RTO Mobile Number',
            type: 'text',
            grid: 'col-4',
            placeholder: 'Mobile Number'
          },
          {
            key: 'jrto_available',
            label: 'Joint RTO In-Position / Present',
            type: 'boolean',
            grid: 'col-3',
            help: 'Currently deployed & present'
          },
          {
            key: 'landline_pro',
            label: 'Office Landline / Public Relations (PRO)',
            type: 'text',
            grid: 'col-12',
            placeholder: 'e.g. 0471-2333333'
          }
        ]
      }
    ]
  },
  {
    id: 'mod_manpower',
    name: 'Manpower & Staff Cadres',
    icon: 'fa-users-gear',
    sections: [
      {
        id: 'sec_executive_cadre',
        name: 'Executive Cadre (MVI & AMVI)',
        icon: 'fa-shield-halved',
        fields: [
          {
            key: 'mvi_sanctioned',
            label: 'Motor Vehicle Inspector (MVI) Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'mvi_available',
            label: 'MVI Available (In Position)',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'amvi_sanctioned',
            label: 'Assistant MVI (AMVI) Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'amvi_available',
            label: 'AMVI Available (In Position)',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          }
        ]
      },
      {
        id: 'sec_supervisory_cadre',
        name: 'Supervisory & Ministerial Staff',
        icon: 'fa-user-group',
        fields: [
          {
            key: 'ss_sanctioned',
            label: 'Senior Superintendent Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'ss_available',
            label: 'Senior Superintendent Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'js_sanctioned',
            label: 'Junior Superintendent Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'js_available',
            label: 'Junior Superintendent Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'ha_pro_sanctioned',
            label: 'Head Clerk / HA / PRO Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'ha_pro_available',
            label: 'Head Clerk / HA / PRO Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'clerk_sanctioned',
            label: 'Senior / Junior Clerks Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'clerk_available',
            label: 'Senior / Junior Clerks Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          }
        ]
      },
      {
        id: 'sec_support_cadre',
        name: 'Support & Ancillary Staff',
        icon: 'fa-handshake-angle',
        fields: [
          {
            key: 'driver_sanctioned',
            label: 'Driver Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'driver_available',
            label: 'Driver Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'oa_sanctioned',
            label: 'Office Attendants (OA) Sanctioned',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'oa_available',
            label: 'Office Attendants (OA) Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'pts_available',
            label: 'Part-Time Sweepers (PTS) Available',
            type: 'number',
            grid: 'col-3',
            placeholder: '0'
          },
          {
            key: 'other_staff_details',
            label: 'Other Staff / Deputation / Contract Details',
            type: 'textarea',
            grid: 'col-9',
            placeholder: 'Any additional staff, casual workers, or special arrangements...'
          }
        ]
      }
    ]
  },
  {
    id: 'mod_grounds',
    name: 'Infrastructure & Test Grounds',
    icon: 'fa-road',
    sections: [
      {
        id: 'sec_grounds_overview',
        name: 'Ground Ownership & Testing Schedule',
        icon: 'fa-calendar-days',
        fields: [
          {
            key: 'has_own_ground',
            label: 'Has Own Dedicated Testing Ground',
            type: 'boolean',
            grid: 'col-4',
            help: 'Check if office owns dedicated ground facility'
          },
          {
            key: 'dl_days',
            label: 'Driving License (DL) Test Days',
            type: 'text',
            grid: 'col-4',
            placeholder: 'e.g. Mon, Wed, Fri'
          },
          {
            key: 'cf_days',
            label: 'Certificate of Fitness (CF) Test Days',
            type: 'text',
            grid: 'col-4',
            placeholder: 'e.g. Tue, Thu, Sat'
          },
          {
            key: 'dl_grounds_count',
            label: 'DL Grounds Count',
            type: 'number',
            grid: 'col-6',
            placeholder: '1'
          },
          {
            key: 'cf_grounds_count',
            label: 'CF Grounds Count',
            type: 'number',
            grid: 'col-6',
            placeholder: '1'
          }
        ]
      },
      {
        id: 'sec_dl_grounds',
        name: 'Driving License (DL) Ground Coordinates',
        icon: 'fa-location-dot',
        fields: [
          {
            key: 'dl_gps_1_raw',
            label: 'DL Ground 1 GPS Coordinates (Raw / URL)',
            type: 'text',
            grid: 'col-6',
            placeholder: 'e.g. 8.5201, 76.9402'
          },
          {
            key: 'dl_gps_1_lat',
            label: 'DL Ground 1 Latitude',
            type: 'number',
            grid: 'col-3',
            placeholder: '8.5201'
          },
          {
            key: 'dl_gps_1_lng',
            label: 'DL Ground 1 Longitude',
            type: 'number',
            grid: 'col-3',
            placeholder: '76.9402'
          },
          {
            key: 'dl_gps_2_raw',
            label: 'DL Ground 2 GPS Coordinates',
            type: 'text',
            grid: 'col-6',
            placeholder: 'Alternate DL test location...'
          },
          {
            key: 'dl_gps_3_raw',
            label: 'DL Ground 3 GPS Coordinates',
            type: 'text',
            grid: 'col-6',
            placeholder: 'Tertiary DL test location...'
          }
        ]
      },
      {
        id: 'sec_cf_grounds',
        name: 'Certificate of Fitness (CF) Ground Coordinates',
        icon: 'fa-truck-ramp-box',
        fields: [
          {
            key: 'cf_gps_1_raw',
            label: 'CF Ground 1 GPS Coordinates (Raw / URL)',
            type: 'text',
            grid: 'col-6',
            placeholder: 'e.g. 8.5301, 76.9350'
          },
          {
            key: 'cf_gps_1_lat',
            label: 'CF Ground 1 Latitude',
            type: 'number',
            grid: 'col-3',
            placeholder: '8.5301'
          },
          {
            key: 'cf_gps_1_lng',
            label: 'CF Ground 1 Longitude',
            type: 'number',
            grid: 'col-3',
            placeholder: '76.9350'
          },
          {
            key: 'cf_gps_2_raw',
            label: 'CF Ground 2 GPS Coordinates',
            type: 'text',
            grid: 'col-6',
            placeholder: 'Alternate CF ground...'
          },
          {
            key: 'cf_gps_3_raw',
            label: 'CF Ground 3 GPS Coordinates',
            type: 'text',
            grid: 'col-6',
            placeholder: 'Tertiary CF ground...'
          },
          {
            key: 'cf_other_location_details',
            label: 'Other Testing Location / Ground Lease Details',
            type: 'textarea',
            grid: 'col-12',
            placeholder: 'Notes on leased grounds, local body permissions, or facilities...'
          }
        ]
      }
    ]
  },
  {
    id: 'mod_fleet',
    name: 'Vehicle Fleet & Mobility',
    icon: 'fa-car-side',
    sections: [
      {
        id: 'sec_fleet_types',
        name: 'Fleet Composition by Fuel Type',
        icon: 'fa-gas-pump',
        fields: [
          {
            key: 'vehicles_diesel',
            label: 'Diesel Department Vehicles',
            type: 'number',
            grid: 'col-4',
            placeholder: '0'
          },
          {
            key: 'vehicles_petrol',
            label: 'Petrol Department Vehicles',
            type: 'number',
            grid: 'col-4',
            placeholder: '0'
          },
          {
            key: 'vehicles_electric',
            label: 'Electric Vehicles (EV)',
            type: 'number',
            grid: 'col-4',
            placeholder: '0'
          }
        ]
      },
      {
        id: 'sec_aged_fleet',
        name: 'Aged Fleet Compliance & Condemnation',
        icon: 'fa-triangle-exclamation',
        fields: [
          {
            key: 'vehicles_over_10_years',
            label: 'Vehicles Over 10 Years in Active Duty',
            type: 'number',
            grid: 'col-6',
            placeholder: '0',
            help: 'Subject to scrapping/condemnation audit under green protocol'
          }
        ]
      }
    ]
  },
  {
    id: 'mod_finance',
    name: 'Financial Liabilities & Dues',
    icon: 'fa-receipt',
    sections: [
      {
        id: 'sec_rent_dues',
        name: 'Office Rent Liabilities',
        icon: 'fa-house-lock',
        fields: [
          {
            key: 'rent_dues_amount',
            label: 'Pending Rent Amount (₹)',
            type: 'currency',
            grid: 'col-3',
            placeholder: '0.00'
          },
          {
            key: 'rent_due_from',
            label: 'Rent Due From Period',
            type: 'text',
            grid: 'col-3',
            placeholder: 'e.g. April 2023'
          },
          {
            key: 'rent_submitted_on',
            label: 'Rent Bill Submitted On',
            type: 'text',
            grid: 'col-3',
            placeholder: 'e.g. 15/01/2024'
          },
          {
            key: 'rent_remarks',
            label: 'Rent Remarks / Notes',
            type: 'text',
            grid: 'col-3',
            placeholder: 'Landlord / building remarks'
          }
        ]
      },
      {
        id: 'sec_repair_dues',
        name: 'Vehicle Maintenance & Repair Dues',
        icon: 'fa-wrench',
        fields: [
          {
            key: 'repair_dues_amount',
            label: 'Pending Repair Dues (₹)',
            type: 'currency',
            grid: 'col-3',
            placeholder: '0.00'
          },
          {
            key: 'repair_due_from',
            label: 'Repair Due From Period',
            type: 'text',
            grid: 'col-3',
            placeholder: 'e.g. Oct 2023'
          },
          {
            key: 'repair_submitted_on',
            label: 'Repair Bill Submitted On',
            type: 'text',
            grid: 'col-3',
            placeholder: 'e.g. 20/02/2024'
          },
          {
            key: 'repair_remarks',
            label: 'Repair Remarks / Workshop Details',
            type: 'text',
            grid: 'col-3',
            placeholder: 'Authorised workshop / invoice notes'
          }
        ]
      },
      {
        id: 'sec_fuel_dues',
        name: 'Fuel Liabilities & Arrears',
        icon: 'fa-oil-well',
        fields: [
          {
            key: 'fuel_dues_amount',
            label: 'Pending Fuel Dues (₹)',
            type: 'currency',
            grid: 'col-3',
            placeholder: '0.00'
          },
          {
            key: 'fuel_due_from',
            label: 'Fuel Due From Period',
            type: 'text',
            grid: 'col-3',
            placeholder: 'e.g. Nov 2023'
          },
          {
            key: 'fuel_submitted_on',
            label: 'Fuel Bill Submitted On',
            type: 'text',
            grid: 'col-3',
            placeholder: 'e.g. 10/03/2024'
          },
          {
            key: 'fuel_remarks',
            label: 'Fuel Station / Oil PSU Remarks',
            type: 'text',
            grid: 'col-3',
            placeholder: 'Indian Oil / BPCL pump remarks'
          }
        ]
      },
      {
        id: 'sec_other_dues',
        name: 'Other Operational Expenses & Contingencies',
        icon: 'fa-file-invoice',
        fields: [
          {
            key: 'other_expenses_amount',
            label: 'Other Contingency Expenses (₹)',
            type: 'currency',
            grid: 'col-4',
            placeholder: '0.00'
          },
          {
            key: 'other_expenses_details',
            label: 'Details of Other Expenses & Liabilities',
            type: 'textarea',
            grid: 'col-8',
            placeholder: 'Details regarding water, electricity, stationeries, security or pending claims...'
          }
        ]
      }
    ]
  }
];


// Export to window
if (typeof window !== 'undefined') {
  window.RTO_SCHEMA = {
    HEADERS: SHEET_HEADERS,
    INDICES: COLUMN_INDICES,
    MANPOWER_ROLES,
    TABLE_COLUMN_GROUPS,
    EDIT_MODULES: RTO_OFFICE_EDIT_SCHEMA
  };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HEADERS: SHEET_HEADERS,
    INDICES: COLUMN_INDICES,
    MANPOWER_ROLES,
    TABLE_COLUMN_GROUPS,
    EDIT_MODULES: RTO_OFFICE_EDIT_SCHEMA
  };
}
