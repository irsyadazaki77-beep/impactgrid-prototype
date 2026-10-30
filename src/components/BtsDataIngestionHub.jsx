import React, { useState, useMemo, useRef } from 'react';
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Database, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

// Preloaded Realistic Telkomsel Telemetry Datasets
export const PRELOADED_DATASETS = {
  jamali50: {
    name: '50 Pilot Sites Makro Jamali (Log 24 Jam)',
    description: '40 site intervensi + 10 site kontrol di Jawa-Bali dengan telemetri PLN AC, DC Rectifier, dan Radio OSS.',
    siteCount: 50,
    rowCount: 50,
    clusters: ['Jabodetabek (15)', 'Bandung (10)', 'Semarang (8)', 'Surabaya (12)', 'Malang (5)']
  },
  jabodetabek15: {
    name: '15 Site Urban Macro Jabodetabek (High Density)',
    description: 'Menara makro padat trafik di Jakarta Selatan, Pusat, dan Barat dengan pemanfaatan Carrier Sleep adaptif.',
    siteCount: 15,
    rowCount: 15,
    clusters: ['Jabodetabek (15)']
  },
  jabarRural10: {
    name: '10 Site Rural Jawa Barat (Hybrid Grid & Solar)',
    description: 'Site sub-urban dan rural dengan sistem baterai LiFePO4 dan integrasi genset diesel otomatis.',
    siteCount: 10,
    rowCount: 10,
    clusters: ['Jawa Barat (10)']
  }
};

// Generates synthetic yet deterministic realistic Telkomsel BTS rows
function generateSampleData(presetKey = 'jamali50') {
  const sites = [];
  const vendors = ['Ericsson', 'Huawei'];
  const baseSites = [
    { id: 'JKT-SEL-P01', name: 'Senopati Macro', cluster: 'Jabodetabek', pln: 4.82, dc: 4.35, rf: 3.42, prb: 38.5, temp: 27.4, cdr: 0.06, carriers: 4 },
    { id: 'JKT-PST-P02', name: 'Thamrin Commercial Hub', cluster: 'Jabodetabek', pln: 5.90, dc: 5.32, rf: 4.18, prb: 52.1, temp: 28.2, cdr: 0.08, carriers: 4 },
    { id: 'JKT-BRT-P03', name: 'Tomang Interchange Macro', cluster: 'Jabodetabek', pln: 4.65, dc: 4.20, rf: 3.30, prb: 34.0, temp: 27.1, cdr: 0.05, carriers: 4 },
    { id: 'JKT-UTR-P04', name: 'Kelapa Gading Boulevard', cluster: 'Jabodetabek', pln: 5.15, dc: 4.62, rf: 3.65, prb: 42.5, temp: 28.8, cdr: 0.07, carriers: 4 },
    { id: 'JKT-TMR-P05', name: 'Cawang Transit Macro', cluster: 'Jabodetabek', pln: 5.40, dc: 4.85, rf: 3.82, prb: 48.0, temp: 29.0, cdr: 0.06, carriers: 4 },
    { id: 'BDG-DGO-P04', name: 'Dago Atas Macro Hub', cluster: 'Bandung', pln: 4.12, dc: 3.71, rf: 2.88, prb: 24.3, temp: 26.8, cdr: 0.05, carriers: 3 },
    { id: 'BDG-RNG-P06', name: 'Riau Business District', cluster: 'Bandung', pln: 4.70, dc: 4.22, rf: 3.32, prb: 36.8, temp: 27.5, cdr: 0.06, carriers: 4 },
    { id: 'BDG-BBR-P07', name: 'Buah Batu Macro', cluster: 'Bandung', pln: 4.35, dc: 3.90, rf: 3.05, prb: 29.5, temp: 27.0, cdr: 0.05, carriers: 3 },
    { id: 'SMG-SIM-P03', name: 'Simpang Lima Macro', cluster: 'Semarang', pln: 4.45, dc: 4.01, rf: 3.15, prb: 33.2, temp: 27.9, cdr: 0.06, carriers: 3 },
    { id: 'SMG-PMH-P08', name: 'Pemuda Financial District', cluster: 'Semarang', pln: 4.80, dc: 4.31, rf: 3.40, prb: 39.0, temp: 28.4, cdr: 0.07, carriers: 4 },
    { id: 'SBY-GUB-P02', name: 'Gubeng Transit Station', cluster: 'Surabaya', pln: 5.10, dc: 4.60, rf: 3.65, prb: 41.0, temp: 29.1, cdr: 0.07, carriers: 4 },
    { id: 'SBY-BJM-P09', name: 'Basuki Rahmat Hub', cluster: 'Surabaya', pln: 5.60, dc: 5.02, rf: 3.98, prb: 49.2, temp: 29.8, cdr: 0.08, carriers: 4 },
    { id: 'SBY-DAR-P10', name: 'Darmo Macro Residence', cluster: 'Surabaya', pln: 4.55, dc: 4.08, rf: 3.20, prb: 31.4, temp: 28.0, cdr: 0.05, carriers: 3 },
    { id: 'MLG-IJN-P05', name: 'Ijen Boulevard Heritage', cluster: 'Malang', pln: 3.88, dc: 3.49, rf: 2.72, prb: 19.4, temp: 25.5, cdr: 0.04, carriers: 3 },
    { id: 'MLG-SBT-P11', name: 'Soekarno Hatta Campus', cluster: 'Malang', pln: 4.25, dc: 3.82, rf: 3.00, prb: 28.0, temp: 26.2, cdr: 0.05, carriers: 3 },
  ];

  const targetCount = presetKey === 'jabodetabek15' ? 15 : presetKey === 'jabarRural10' ? 10 : 50;

  for (let i = 0; i < targetCount; i++) {
    const template = baseSites[i % baseSites.length];
    const indexStr = String(i + 1).padStart(2, '0');
    const cluster = presetKey === 'jabodetabek15' ? 'Jabodetabek' : presetKey === 'jabarRural10' ? 'Jawa Barat' : template.cluster;
    const vendor = vendors[i % vendors.length];
    
    // Add small realistic variations
    const factor = 1 + ((i % 5) - 2) * 0.04;
    const plnAc = +(template.pln * factor).toFixed(2);
    // Discrepancy intentional for a couple sites to test anomaly detection
    const isPhantomAnomaly = (i === 4 || i === 18);
    const dcRect = isPhantomAnomaly ? +(plnAc * 0.76).toFixed(2) : +(plnAc * 0.90).toFixed(2);
    const rfPower = +(dcRect * 0.78).toFixed(2);
    const prb = Math.min(95, Math.max(10, +(template.prb * factor).toFixed(1)));
    const temp = (i === 7) ? 34.2 : +(template.temp + ((i % 3) - 1) * 0.8).toFixed(1);
    const cdr = +(template.cdr + (i === 12 ? 0.05 : 0)).toFixed(2);

    sites.push({
      site_id: `${cluster.slice(0, 3).toUpperCase()}-SITE-${indexStr}`,
      site_name: `${template.name} #${indexStr}`,
      cluster,
      vendor,
      timestamp: '2026-10-29 14:00:00',
      pln_ac_kwh: plnAc,
      dc_rectifier_kwh: dcRect,
      radio_rf_kwh: rfPower,
      prb_utilization_pct: prb,
      shelter_temp_c: temp,
      call_drop_rate_pct: cdr,
      carrier_count: template.carriers
    });
  }

  return sites;
}

export default function BtsDataIngestionHub() {
  const [datasetKey, setDatasetKey] = useState('jamali50');
  const [dataRows, setDataRows] = useState(() => generateSampleData('jamali50'));
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all'); // 'all', 'Ericsson', 'Huawei'
  const [anomalyFilter, setAnomalyFilter] = useState('all'); // 'all', 'anomalies_only', 'normal_only'
  const [uploadStatus, setUploadStatus] = useState({ state: 'idle', message: '' });
  const fileInputRef = useRef(null);

  // Switch preloaded dataset
  const handleSelectPreset = (key) => {
    setDatasetKey(key);
    setDataRows(generateSampleData(key));
    setUploadStatus({ state: 'success', message: `Dataset "${PRELOADED_DATASETS[key].name}" berhasil dimuat.` });
  };

  // CSV Template Downloader
  const handleDownloadTemplate = () => {
    const headers = 'site_id,site_name,cluster,vendor,timestamp,pln_ac_kwh,dc_rectifier_kwh,radio_rf_kwh,prb_utilization_pct,shelter_temp_c,call_drop_rate_pct,carrier_count\n';
    const sampleRows = [
      'JKT-SEL-P01,Senopati Macro,Jabodetabek,Ericsson,2026-10-29 14:00:00,4.82,4.35,3.42,38.5,27.4,0.06,4',
      'JKT-PST-P02,Thamrin Hub,Jabodetabek,Huawei,2026-10-29 14:00:00,5.90,5.32,4.18,52.1,28.2,0.08,4',
      'BDG-DGO-P04,Dago Macro,Bandung,Ericsson,2026-10-29 14:00:00,4.12,3.71,2.88,24.3,26.8,0.05,3',
      'SBY-GUB-P02,Gubeng Transit,Surabaya,Huawei,2026-10-29 14:00:00,5.10,4.60,3.65,41.0,29.1,0.07,4',
      'SMG-SIM-P03,Simpang Lima,Semarang,Ericsson,2026-10-29 14:00:00,4.45,4.01,3.15,33.2,27.9,0.06,3'
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_telemetri_bts_telkomsel.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSV File Uploader & Parser
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus({ state: 'loading', message: `Menganalisis file "${file.name}"...` });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('File tidak dapat dibaca.');

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) throw new Error('File CSV kosong atau tidak memiliki baris data.');

        const parsedRows = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (cols.length < 6) continue;

          // Map column by header or fallback to indices
          const rowObj = {
            site_id: cols[0] || `SITE-${i}`,
            site_name: cols[1] || `Menara ${i}`,
            cluster: cols[2] || 'Regional',
            vendor: cols[3] || 'Ericsson',
            timestamp: cols[4] || '2026-10-29 14:00:00',
            pln_ac_kwh: parseFloat(cols[5]) || 4.5,
            dc_rectifier_kwh: parseFloat(cols[6]) || (parseFloat(cols[5]) * 0.9) || 4.0,
            radio_rf_kwh: parseFloat(cols[7]) || (parseFloat(cols[6]) * 0.8) || 3.2,
            prb_utilization_pct: parseFloat(cols[8]) || 35.0,
            shelter_temp_c: parseFloat(cols[9]) || 27.5,
            call_drop_rate_pct: parseFloat(cols[10]) || 0.06,
            carrier_count: parseInt(cols[11], 10) || 4
          };
          parsedRows.push(rowObj);
        }

        if (parsedRows.length === 0) throw new Error('Format kolom CSV tidak cocok dengan skema telemetri.');

        setDataRows(parsedRows);
        setDatasetKey('custom_uploaded');
        setUploadStatus({ 
          state: 'success', 
          message: `Berhasil mengimpor ${parsedRows.length} baris telemetri dari "${file.name}".` 
        });
      } catch (err) {
        setUploadStatus({ state: 'error', message: err.message || 'Gagal memproses file CSV.' });
      }
    };
    reader.onerror = () => {
      setUploadStatus({ state: 'error', message: 'Terjadi kesalahan saat membaca file.' });
    };
    reader.readAsText(file);
  };

  // Comprehensive Analytics Calculations
  const analytics = useMemo(() => {
    let totalPlnKwh = 0;
    let totalDcKwh = 0;
    let totalRfKwh = 0;
    let phantomAnomaliesCount = 0;
    let thermalAnomaliesCount = 0;
    let slaAlertCount = 0;

    for (const row of dataRows) {
      totalPlnKwh += row.pln_ac_kwh;
      totalDcKwh += row.dc_rectifier_kwh;
      totalRfKwh += row.radio_rf_kwh;

      const expectedDcWithAux = row.dc_rectifier_kwh * 1.10;
      const discrepancyPct = Math.abs(row.pln_ac_kwh - expectedDcWithAux) / (row.pln_ac_kwh || 1) * 100;
      if (discrepancyPct > 12.0) phantomAnomaliesCount++;
      if (row.shelter_temp_c > 32.0) thermalAnomaliesCount++;
      if (row.call_drop_rate_pct > 0.80) slaAlertCount++;
    }

    const rowDetails = dataRows.map((row) => {
      // 3-Way Reconciliation Discrepancy
      // Discrepancy = |PLN - (DC / 0.90)| / PLN * 100
      const expectedDcWithAux = row.dc_rectifier_kwh * 1.10; // 10% expected auxiliary HVAC/lighting
      const discrepancyPct = Math.abs(row.pln_ac_kwh - expectedDcWithAux) / (row.pln_ac_kwh || 1) * 100;

      const isPhantom = discrepancyPct > 12.0;
      const isThermal = row.shelter_temp_c > 32.0;
      const isSlaRisk = row.call_drop_rate_pct > 0.80;

      // Estimated savings with ImpactGrid (Carrier sleep ~16% on RF, HVAC setpoint ~12% on delta)
      const rfSavingKwh = row.radio_rf_kwh * 0.165;
      const hvacSavingKwh = (row.pln_ac_kwh - row.dc_rectifier_kwh) * 0.14;
      const totalSavingKwh = +(rfSavingKwh + hvacSavingKwh).toFixed(2);
      const savingPct = +(totalSavingKwh / (row.pln_ac_kwh || 1) * 100).toFixed(1);

      return {
        ...row,
        discrepancyPct: +discrepancyPct.toFixed(1),
        isPhantom,
        isThermal,
        isSlaRisk,
        hasAnomaly: isPhantom || isThermal || isSlaRisk,
        totalSavingKwh,
        savingPct
      };
    });

    const siteCount = dataRows.length;
    const avgDiscrepancy = rowDetails.reduce((sum, r) => sum + r.discrepancyPct, 0) / (siteCount || 1);
    const totalPotentialSavingsKwh = rowDetails.reduce((sum, r) => sum + r.totalSavingKwh, 0);
    const overallSavingsPct = totalPlnKwh > 0 ? (totalPotentialSavingsKwh / totalPlnKwh * 100) : 0;
    
    // Hourly avoided cost (assuming PLN blended tariff Rp 1.500/kWh LWBP, Rp 2.250 WBP)
    const avoidedCostIDR = totalPotentialSavingsKwh * 1750;
    // Scope 2 avoided emissions: 0.78 kg CO2e / kWh
    const avoidedEmissionsKg = totalPotentialSavingsKwh * 0.78;
    const dataQualityScore = Math.max(80, Math.min(100, +(100 - avgDiscrepancy * 0.5 - (phantomAnomaliesCount / siteCount * 20)).toFixed(1)));

    return {
      siteCount,
      totalPlnKwh: +totalPlnKwh.toFixed(2),
      totalDcKwh: +totalDcKwh.toFixed(2),
      totalRfKwh: +totalRfKwh.toFixed(2),
      totalPotentialSavingsKwh: +totalPotentialSavingsKwh.toFixed(2),
      overallSavingsPct: +overallSavingsPct.toFixed(1),
      avoidedCostIDR: Math.round(avoidedCostIDR),
      avoidedEmissionsKg: +avoidedEmissionsKg.toFixed(1),
      avgDiscrepancy: +avgDiscrepancy.toFixed(1),
      phantomAnomaliesCount,
      thermalAnomaliesCount,
      slaAlertCount,
      totalAnomalies: phantomAnomaliesCount + thermalAnomaliesCount + slaAlertCount,
      dataQualityScore,
      rowDetails
    };
  }, [dataRows]);

  // Filtered rows for the data table
  const filteredRows = useMemo(() => {
    return analytics.rowDetails.filter((row) => {
      const matchesSearch = 
        row.site_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.cluster.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVendor = vendorFilter === 'all' || row.vendor === vendorFilter;
      const matchesAnomaly = 
        anomalyFilter === 'all' || 
        (anomalyFilter === 'anomalies_only' && row.hasAnomaly) ||
        (anomalyFilter === 'normal_only' && !row.hasAnomaly);

      return matchesSearch && matchesVendor && matchesAnomaly;
    });
  }, [analytics.rowDetails, searchQuery, vendorFilter, anomalyFilter]);

  // Export processed analysis
  const handleExportAnalysis = () => {
    const headers = 'site_id,site_name,cluster,vendor,pln_ac_kwh,dc_rectifier_kwh,radio_rf_kwh,discrepancy_pct,saving_kwh,saving_pct,shelter_temp_c,call_drop_rate_pct,status\n';
    const rows = analytics.rowDetails.map(r => 
      `${r.site_id},"${r.site_name}",${r.cluster},${r.vendor},${r.pln_ac_kwh},${r.dc_rectifier_kwh},${r.radio_rf_kwh},${r.discrepancyPct}%,${r.totalSavingKwh},${r.savingPct}%,${r.shelter_temp_c},${r.call_drop_rate_pct}%,${r.hasAnomaly ? 'PERINGATAN ANOMALI' : 'NORMAL'}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan_analisis_telemetri_impactgrid_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Processed Telemetry Data CSV Exporter
  const handleExportProcessedData = () => {
    const headers = 'site_id,site_name,cluster,vendor,timestamp,pln_ac_kwh,dc_rectifier_kwh,radio_rf_kwh,saving_kwh,saving_pct,pue,status\n';
    const rows = filteredRows.map(r => 
      `${r.site_id},"${r.site_name}",${r.cluster},${r.vendor},${r.timestamp},${r.pln_ac_kwh},${r.dc_rectifier_kwh},${r.radio_rf_kwh},${r.totalSavingKwh},${r.savingPct}%,${(r.pln_ac_kwh / (r.dc_rectifier_kwh || 1)).toFixed(2)},${r.isPhantom ? 'Phantom Leak' : r.isThermal ? 'Thermal Risk' : 'Normal'}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hasil_audit_telemetri_${datasetKey}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#ED0226] border border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50 text-xs font-bold flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              <span>DATA HUB OPERASIONAL TELKOMSEL</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              • Parser Client-Side Aman (100% Data Tetap di Browser)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Ingestion & Analisis Telemetri CSV BTS Mandiri
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            Unggah file log telemetri menara BTS atau pilih dataset kluster operasional Telkomsel untuk memvalidasi rekonsiliasi meter 3-arah, menghitung potensi penghematan daya, dan mendeteksi anomali energi laten (*phantom load*).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Upload Button */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv,text/csv" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah File CSV</span>
          </button>

          {/* Download Template */}
          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Unduh format template CSV standar telemetri BTS Telkomsel"
          >
            <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Unduh Template CSV</span>
          </button>

          {/* Export Processed Audit CSV */}
          <button
            onClick={handleExportProcessedData}
            className="px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Ekspor seluruh baris telemetri yang telah diaudit & dihitung penghematannya"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Ekspor Hasil Audit (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Upload status message */}
      {uploadStatus.state !== 'idle' && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
          uploadStatus.state === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
            : uploadStatus.state === 'error'
              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200'
              : 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadStatus.state === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
             uploadStatus.state === 'error' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
             <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin" />}
            <span className="font-semibold">{uploadStatus.message}</span>
          </div>
          <button 
            onClick={() => setUploadStatus({ state: 'idle', message: '' })}
            className="text-[10px] font-bold underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 2. Preset Datasets Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(PRELOADED_DATASETS).map(([key, preset]) => {
          const isSelected = datasetKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-[#ED0226] ring-1 ring-red-500/30 shadow-xs'
                  : 'bg-white dark:bg-[#0B1324] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {preset.siteCount} Sites
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{preset.name}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                {preset.clusters.map(c => (
                  <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/60 font-mono">
                    {c}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Real-Time Telemetry Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Site</span>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{analytics.siteCount} Sites</div>
          <span className="text-[10px] text-emerald-600 font-medium">100% Teranalisis</span>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Beban Daya Total</span>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{analytics.totalPlnKwh} kW</div>
          <span className="text-[10px] text-slate-500">PLN Input AC</span>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Potensi Hemat</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            −{analytics.overallSavingsPct}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">−{analytics.totalPotentialSavingsKwh} kW terhindar</span>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Kas Terhindar</span>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
            Rp {(analytics.avoidedCostIDR).toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">per jam operasional</span>
        </div>

        {/* Metric 5 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Reduksi Emisi</span>
          <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono">{analytics.avoidedEmissionsKg} kg</div>
          <span className="text-[10px] text-cyan-600 font-medium">CO₂e Scope 2</span>
        </div>

        {/* Metric 6 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Kualitas Data</span>
          <div className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">{analytics.dataQualityScore}%</div>
          <span className={`text-[10px] font-bold ${analytics.totalAnomalies > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {analytics.totalAnomalies} Anomali
          </span>
        </div>
      </div>

      {/* 4. Filterable Telemetry Table */}
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Site ID, Nama Menara, atau Kluster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Vendor Filter */}
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="all">Semua Vendor</option>
              <option value="Ericsson">Ericsson (OSS)</option>
              <option value="Huawei">Huawei (MAE)</option>
            </select>

            {/* Anomaly Filter */}
            <select
              value={anomalyFilter}
              onChange={(e) => setAnomalyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="all">Semua Kondisi</option>
              <option value="anomalies_only">⚠️ Anomali Saja ({analytics.totalAnomalies})</option>
              <option value="normal_only">✓ Normal Saja</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={handleExportAnalysis}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor Hasil</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700 z-10">
              <tr>
                <th className="py-2.5 px-3">Site ID & Nama</th>
                <th className="py-2.5 px-3">Kluster & Vendor</th>
                <th className="py-2.5 px-3 text-right">PLN AC (kW)</th>
                <th className="py-2.5 px-3 text-right">DC Rect (kW)</th>
                <th className="py-2.5 px-3 text-right">Radio RF (kW)</th>
                <th className="py-2.5 px-3 text-right">Diskrepansi</th>
                <th className="py-2.5 px-3 text-right">Hemat ImpactGrid</th>
                <th className="py-2.5 px-3 text-center">Suhu Shelter</th>
                <th className="py-2.5 px-3 text-center">SLA CDR</th>
                <th className="py-2.5 px-3 text-center">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-sans text-xs">
                    Tidak ada site yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr 
                    key={row.site_id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                      row.isPhantom ? 'bg-amber-50/30 dark:bg-amber-950/10' :
                      row.isThermal ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">{row.site_id}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{row.site_name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block">{row.cluster}</span>
                      <span className="text-[10px] text-slate-400 block">{row.vendor}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">{row.pln_ac_kwh}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{row.dc_rectifier_kwh}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{row.radio_rf_kwh}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        row.isPhantom 
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {row.discrepancyPct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                        −{row.savingPct}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">−{row.totalSavingKwh} kW</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        row.isThermal
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {row.shelter_temp_c}°C
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-slate-700 dark:text-slate-300 font-bold">
                        {row.call_drop_rate_pct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {row.isPhantom ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Phantom Load
                        </span>
                      ) : row.isThermal ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                          Suhu Tinggi
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Sinkron Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footnote */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2 font-medium">
          <span>Menampilkan {filteredRows.length} dari {analytics.siteCount} menara BTS.</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Sinkron Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Phantom Load (&gt;12% Discrepancy)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Suhu Termal Shelter (&gt;32°C)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
