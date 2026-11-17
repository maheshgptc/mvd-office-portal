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
