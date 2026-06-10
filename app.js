/* ═══════════════════════════════════════════════════════
   NPPS WCR TOOL — app.js  COMPLETE BUILD v5
   Changes: HOD Review workflow, PDF output, per-user privacy,
   one-time Google auth per session, comments sidebar
═══════════════════════════════════════════════════════ */

const CONFIG = {
  GOOGLE_CLIENT_ID: "190605798710-5cashes032781tifqemjuvsm6rvon10c.apps.googleusercontent.com",
  WORKER_URL: "https://polished-lake-4911.radheya-supnekar.workers.dev",
  DRIVE_FOLDER_ID: "1fqfq-efMq5KsDpYHc-9TJ3-yc8l3GKc1",
  BASE_DATA_SHEET_NAME: "NPPS_WCR_BaseData",
  DRAFT_EXPIRY_DAYS: 365,
  BASE_DATA_EXPIRY_DAYS: 1000,
  MAX_DRAFTS: 50,
  HOD_EMP_NO: "666",
  EMPLOYEES_URL: "https://raw.githubusercontent.com/Radheya55/Npps-Niigata-WCR-Tool/main/employees.json",
};


const MAINT_TEMPLATE = [
  { type:"heading", text:"Cylinder Heads: Dismounting, Dismantling, Inspection and Cleaning" },
  { type:"bullet", text:"All cylinder heads were removed from the engine block." },
  { type:"bullet", text:"Normal carbon residue was observed on the combustion surface. All cylinder heads cleaning was carried out." },
  { type:"heading", text:"Dye Penetrant Test" },
  { type:"bullet", text:"All cylinder heads' combustion surface area was dye penetrant tested. Found ok." },
  { type:"bullet", text:"All inlet and exhaust valves were dye penetrant tested." },
  { type:"heading", text:"Hydro Pressure Test" },
  { type:"bullet", text:"All cylinder heads were hydro pressure tested. Found normal." },
  { type:"heading", text:"Valve Seats, Inlet and Exhaust Valves, Valve Guides, Valve Rotators" },
  { type:"bullet", text:"All components were reused." },
  { type:"heading", text:"Rocker Arm" },
  { type:"bullet", text:"All rocker arm bushings were reused." },
  { type:"heading", text:"Fuel Injection Valves" },
  { type:"bullet", text:"All fuel injectors were cleaned and inspected and found normal." },
  { type:"bullet", text:"All injector body to new nozzle lapping done. Nozzle and O-ring renewed." },
  { type:"bullet", text:"All fuel injectors leak tested and calibrated at 33 MPa. Spray pattern and pressure hold tested." },
  { type:"bullet", text:"All fuel injectors were mounted back into cylinder heads with new washers and O-rings and tightened as per OEM recommendations." },
  { type:"heading", text:"Final Cleaning, Assembling and Mounting" },
  { type:"bullet", text:"All cylinder heads assembled with new parts (valve springs, valve rotators, collets, valve guides, inlet and exhaust valve seats, O-rings)." },
  { type:"bullet", text:"All cylinder heads were finally cleaned, assembled and mounted back on the engine block and tightened as per OEM recommendations." },
  { type:"bullet", text:"All auxiliary pipe lines were assembled and tightened with torque wherever necessary." },
  { type:"bullet", text:"Tappet setting was done with 0.50mm clearances for both inlet and exhaust valves." },
  { type:"heading", text:"Fuel Injection Pumps" },
  { type:"bullet", text:"Fuel injection pumps were cleaned and timing checks found within limits." },
  { type:"bullet", text:"STBD — All fuel injection pumps overhauled. New O-ring, Teflon ring, gasket, delivery valves and distributors renewed. All unit barrel plunger and deflector renewed." },
  { type:"bullet", text:"PORT — All fuel injection pumps overhauled. New O-ring, Teflon ring, gasket, delivery valves and distributors renewed. All unit barrel plunger and deflector renewed." },
  { type:"bullet", text:"Mounted back and tightened as per OEM recommendations." },
  { type:"heading", text:"Air Starting Valves" },
  { type:"bullet", text:"All air starting valves were dismounted, dismantled and cleaned. Lapping done. Valve-seat contact checked, assembled and functionality checked." },
  { type:"bullet", text:"All air starting valves were mounted back with new O-rings and gaskets renewed." },
  { type:"heading", text:"Piston and Connecting Rod Assembly" },
  { type:"bullet", text:"Pistons were removed from selected units. Piston and connecting rods were dismounted from the engine." },
  { type:"bullet", text:"Top surface of all pistons were cleaned. Piston pin diameter was measured and found within limits." },
  { type:"bullet", text:"Both connecting rod small end bushes were measured. All connecting rod big end bolts were reused." },
  { type:"bullet", text:"Connecting rod big end bore was calibrated. All readings were within limits." },
  { type:"bullet", text:"DP test performed on the piston crown of both engines — found ok. DP test performed on connecting rods — found ok." },
  { type:"bullet", text:"Piston rings were replaced by new on all unit pistons. Clearance between piston ring, liner and groove clearances were checked and found within limits." },
  { type:"bullet", text:"Connecting rod bolts renewed and tightened as per OEM recommendation and mounted back." },
  { type:"heading", text:"Cylinder Liner" },
  { type:"bullet", text:"All unit liners were cleaned and calibrated." },
  { type:"heading", text:"Cylinder Block" },
  { type:"bullet", text:"Cleaned the head mounting area. Cleaned cooling water port." },
  { type:"bullet", text:"Cooling water joint pipe and bush rod cover of seating area cleaned. O-ring and rubber seal renewed." },
  { type:"heading", text:"Main Bearings and Thrust Bearings" },
  { type:"bullet", text:"One main bearing from each engine was removed and visually inspected." },
  { type:"heading", text:"Camshaft" },
  { type:"bullet", text:"Camshaft cleaned and visually inspected — found ok. Camcase cover cleaned and new gaskets renewed. Bearing clearance checked — found ok." },
  { type:"heading", text:"Tappet Roller" },
  { type:"bullet", text:"Both engine tappet rollers were dismantled and cleaned. All tappet roller bushes were replaced by new. Mounted back on the engine." },
  { type:"heading", text:"Starting Air Distributor" },
  { type:"bullet", text:"Starting air distributor dismantled, cleaned and visually inspected — found ok." },
  { type:"heading", text:"Crank Web Deflection" },
  { type:"bullet", text:"Crank web deflection measured and readings recorded. All readings were found within limits." },
  { type:"heading", text:"Cooling Fresh Water Pump" },
  { type:"bullet", text:"Dismantled fresh water pump on both sides. Replaced mechanical seal, bearing, oil seal, O-ring and gasket. Mounted back on the engine." },
  { type:"heading", text:"Cooling Sea Water Pump" },
  { type:"bullet", text:"Both engine sea water pumps were replaced by new." },
  { type:"heading", text:"Engine Fixing Bolts" },
  { type:"bullet", text:"Engine fixing bolts cleaned and visually inspected — found ok." },
  { type:"heading", text:"Geislinger Coupling" },
  { type:"bullet", text:"Geislinger coupling is cleaned and all bolts are visually inspected — found ok." },
  { type:"heading", text:"Exhaust Manifold" },
  { type:"bullet", text:"Exhaust manifold expansion joints visually inspected — found normal. Exhaust manifold gasket area cleaned and gaskets renewed." },
  { type:"heading", text:"Inlet Manifold" },
  { type:"bullet", text:"Inlet manifold cleaned and gaskets renewed and inspected." },
  { type:"heading", text:"Fuel Injection Union" },
  { type:"bullet", text:"Fuel injection union and pipe cleaned and inspected. Inner surface found ok. O-ring replaced." },
  { type:"heading", text:"Crankcase and Sump" },
  { type:"bullet", text:"Crankcase cleaned and inspected — found ok. Oil sump cleaned and inspected — found ok." },
  { type:"heading", text:"Overspeed Trip" },
  { type:"bullet", text:"Checked function of overspeed cylinder — found ok." },
];


const DEFAULT_RECOMMENDATIONS = [
  "Keep a close watch on the engine and act immediately in case of any abnormal sounds, vibrations and parameters.",
  "Please understand that Neptunus could have worked on some part of the engine but malfunctioning in any other part of the engine could also be the cause of the breakdown.",
  "Post overhaul, it is good practice to change lube oil filters after 100 hours. Kindly inspect the filters for any abnormal particles and report the same to us.",
  "After the first 100 hours remove a sample for lube oil analysis. If the analysis report confirms any abnormalities, please change the lube oil immediately. Make sure the maker's specifications in starting and stopping the engines are adhered to.",
  "Watch parameters closely; especially lube oil pressure and jacket cooling water temperature.",
  "Watch out for fuel dilution. Check for fuel condition. In case of doubt, please call us for assistance.",
];


const TABLE_TEMPLATES = {

  // ── PORT Crankshaft Deflection ──────────────────────────
  portCrankshaft: {
    name: "PORT M/E — Crankshaft Deflection Measurement",
    note: "The deflection measurements should be made when the engine is cold.\nIndicate whether positive (+ve) or negative (-ve). All readings in 1/100 mm. Webs opening gives a +ve reading.\nMaximum permissible deflection readings as per engine manufacturer's instruction.\nDial Gauge Orientation: See diagram. Last check of holding down bolt tension.\nNote: Main bearing assembly, hot/cold condition, shaft line/gear case alignment may influence readings.",
    hasImage: true, builtinImage: true, imageKey: "crankshaft", hasImage2: true, image2Base64: null, image2Key: "crankshaftDial",
    headers: ["Crankpin Position","1","2","3","4","5","6","7","8","9","Remarks"],
    rows: [
      ["B1","","","","","","","","","",""],
      ["P","","","","","","","","","",""],
      ["T","","","","","","","","","",""],
      ["S","","","","","","","","","",""],
      ["B2","","","","","","","","","",""],
    ]
  },

  // ── STBD Crankshaft Deflection ──────────────────────────
  stbdCrankshaft: {
    name: "STBD M/E — Crankshaft Deflection Measurement",
    note: "The deflection measurements should be made when the engine is cold.\nIndicate whether positive (+ve) or negative (-ve). All readings in 1/100 mm. Webs opening gives a +ve reading.\nMaximum permissible deflection readings as per engine manufacturer's instruction.\nDial Gauge Orientation: See diagram. Last check of holding down bolt tension.\nNote: Main bearing assembly, hot/cold condition, shaft line/gear case alignment may influence readings.",
    hasImage: true, builtinImage: true, imageKey: "crankshaft", hasImage2: true, image2Base64: null, image2Key: "crankshaftDial",
    headers: ["Crankpin Position","1","2","3","4","5","6","7","8","9","Remarks"],
    rows: [
      ["B1","","","","","","","","","",""],
      ["P","","","","","","","","","",""],
      ["T","","","","","","","","","",""],
      ["S","","","","","","","","","",""],
      ["B2","","","","","","","","","",""],
    ]
  },

  // ── PORT Rocker Arm Bushing ─────────────────────────────
  portRockerArm: {
    name: "PORT — Rocker Arm Bushing / Rocker Arm Shaft Diameter",
    note: "1. Rocker Arm Bushing Inner Diameter = 55 +0.05/+0.12mm\n2. Rocker Arm Shaft Diameter = 55 -0.03/-0.05mm\n3. Clearance (Shaft – Bush) = 0.2mm",
    hasImage: true, builtinImage: true, imageKey: "rockerArm",
    headers: ["Cylinder No.","Valve Type","SHAFT - D1mm","SHAFT - D2mm","Remarks"],
    rows: [
      ["1","IV","54.99","54.99","Ok"],["","EV","54.99","54.98","Ok"],
      ["2","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["3","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["4","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["5","IV","54.98","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["6","IV","54.99","54.98","Ok"],["","EV","54.99","54.99","Ok"],
      ["7","IV","54.99","54.99","Ok"],["","EV","54.98","54.99","Ok"],
      ["8","IV","54.99","54.99","Ok"],["","EV","54.98","54.99","Ok"],
    ]
  },

  // ── STBD Rocker Arm Bushing ─────────────────────────────
  stbdRockerArm: {
    name: "STBD — Rocker Arm Bushing / Rocker Arm Shaft Diameter",
    note: "1. Rocker Arm Bushing Inner Diameter = 55 +0.05/+0.12mm\n2. Rocker Arm Shaft Diameter = 55 -0.03/-0.05mm\n3. Clearance (Shaft – Bush) = 0.2mm",
    hasImage: true, builtinImage: true, imageKey: "rockerArm",
    headers: ["Cylinder No.","Valve Type","SHAFT - D1mm","SHAFT - D2mm","Remarks"],
    rows: [
      ["1","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["2","IV","54.98","54.98","Ok"],["","EV","54.99","54.99","Ok"],
      ["3","IV","54.99","54.99","Ok"],["","EV","54.99","54.98","Ok"],
      ["4","IV","54.99","54.99","Ok"],["","EV","54.98","54.99","Ok"],
      ["5","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["6","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
      ["7","IV","54.99","54.99","Ok"],["","EV","54.98","54.99","Ok"],
      ["8","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],
    ]
  },

  // ── PORT Ring Groove Clearance ──────────────────────────
  portRingGroove: {
    name: "PORT — Ring Groove Clearance",
    note: "Standard: 1st Compression 0.21~0.25mm | 2nd Compression 0.11~0.15mm | 3rd Compression 0.07~0.11mm | Oil Ring 0.04~0.09mm\nPermissible Limit: 1st 0.35mm | 2nd 0.30mm | 3rd 0.30mm | Oil Ring 0.30mm",
    hasImage: false,
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [
      ["1","0.21","0.11","0.09","0.06","Ok"],["2","0.21","0.11","0.09","0.06","Ok"],
      ["3","0.21","0.11","0.09","0.06","Ok"],["4","0.21","0.11","0.09","0.06","Ok"],
      ["5","0.21","0.11","0.09","0.06","Ok"],["6","0.21","0.11","0.09","0.06","Ok"],
      ["7","0.21","0.11","0.09","0.06","Ok"],["8","0.21","0.11","0.09","0.06","Ok"],
    ]
  },

  // ── STBD Ring Groove Clearance ──────────────────────────
  stbdRingGroove: {
    name: "STBD — Ring Groove Clearance",
    note: "Standard: 1st Compression 0.21~0.25mm | 2nd Compression 0.11~0.15mm | 3rd Compression 0.07~0.11mm | Oil Ring 0.04~0.09mm\nPermissible Limit: 1st 0.35mm | 2nd 0.30mm | 3rd 0.30mm | Oil Ring 0.30mm",
    hasImage: false,
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [
      ["1","0.21","0.11","0.09","0.06","Ok"],["2","0.21","0.11","0.09","0.06","Ok"],
      ["3","0.21","0.11","0.09","0.06","Ok"],["4","0.21","0.11","0.09","0.06","Ok"],
      ["5","0.21","0.11","0.09","0.06","Ok"],["6","0.21","0.11","0.09","0.06","Ok"],
      ["7","0.21","0.11","0.09","0.06","Ok"],["8","0.21","0.11","0.09","0.06","Ok"],
    ]
  },

  // ── PORT Liner & Piston Ring Gap ────────────────────────
  portPistonRingGap: {
    name: "PORT — Clearance between Liner & Piston Ring Gap",
    note: "Standard: 1st Compression 1.1~1.4mm | 2nd Compression 1.1~1.4mm | 3rd Compression 1.1~1.4mm | Oil Ring 0.65~0.95mm\nPermissible Limit: 2nd 3.5mm | 3rd 3.5mm",
    hasImage: true, imageKey: "buttClearance",,
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [
      ["1","1.25","1.25","1.25","0.90","Ok"],["2","1.25","1.25","1.25","0.90","Ok"],
      ["3","1.25","1.25","1.25","0.90","Ok"],["4","1.25","1.25","1.25","0.90","Ok"],
      ["5","1.25","1.25","1.25","0.90","Ok"],["6","1.25","1.25","1.25","0.90","Ok"],
      ["7","1.25","1.25","1.25","0.90","Ok"],["8","1.25","1.25","1.25","0.90","Ok"],
    ]
  },

  // ── STBD Liner & Piston Ring Gap ────────────────────────
  stbdPistonRingGap: {
    name: "STBD — Clearance between Liner & Piston Ring Gap",
    note: "Standard: 1st Compression 1.1~1.4mm | 2nd Compression 1.1~1.4mm | 3rd Compression 1.1~1.4mm | Oil Ring 0.65~0.95mm\nPermissible Limit: 2nd 3.5mm | 3rd 3.5mm",
    hasImage: true, imageKey: "buttClearance",,
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [
      ["1","1.25","1.25","1.25","0.90","Ok"],["2","1.25","1.25","1.25","0.90","Ok"],
      ["3","1.25","1.25","1.25","0.90","Ok"],["4","1.25","1.25","1.25","0.90","Ok"],
      ["5","1.25","1.25","1.25","0.90","Ok"],["6","1.25","1.25","1.25","0.90","Ok"],
      ["7","1.25","1.25","1.25","0.90","Ok"],["8","1.25","1.25","1.25","0.90","Ok"],
    ]
  },

  // ── PORT Cylinder Liner Calibration ────────────────────
  portLinerCalib: {
    name: "PORT — Cylinder Liner Calibration after Honing",
    note: "A=70mm | B=280mm | C=490mm | D=615mm\nNormal Size: 280 +0.040mm | Permissible Limit: 280.5mm\nC: Cam Side | E: Exhaust Side | F: Free End | A: Alternator End (Flywheel End)",
    hasImage: true, builtinImage: true, imageKey: "linerCalib",
    headers: ["Unit No.","A C-E","A F-A","B C-E","B F-A","C C-E","C F-A","D C-E","D F-A","Remark"],
    rows: [
      ["1","280.04","280.02","280.04","280.04","280.04","280.04","280.04","280.04","ok"],
      ["2","280.03","280.04","280.04","280.04","280.03","280.03","280.02","280.02","ok"],
      ["3","280.03","280.03","280.04","280.04","280.03","280.04","280.03","280.04","ok"],
      ["4","280.04","280.04","280.3","280.03","280.03","280.03","280.03","280.03","ok"],
      ["5","280.04","280.04","280.04","280.03","280.4","280.04","280.03","280.03","ok"],
      ["6","280.04","280.04","280.04","280.04","280.04","280.04","280.03","280.02","ok"],
    ]
  },

  // ── STBD Cylinder Liner Calibration ────────────────────
  stbdLinerCalib: {
    name: "STBD — Cylinder Liner Calibration after Honing",
    note: "A=70mm | B=280mm | C=490mm | D=615mm\nNormal Size: 280 +0.040mm | Permissible Limit: 280.5mm\nC: Cam Side | E: Exhaust Side | F: Free End | A: Alternator End (Flywheel End)",
    hasImage: true, builtinImage: true, imageKey: "linerCalib",
    headers: ["Unit No.","A C-E","A F-A","B C-E","B F-A","C C-E","C F-A","D C-E","D F-A","Remark"],
    rows: [
      ["1","280.04","280.03","280.04","280.04","280.04","280.04","280.03","280.03","ok"],
      ["2","280.04","280.05","280.04","280.04","280.04","280.04","280.02","280.03","ok"],
      ["3","280.04","280.04","280.04","280.04","280.05","280.04","280.03","280.03","ok"],
      ["4","280.05","280.04","280.04","280.04","280.04","280.04","280.03","280.02","ok"],
      ["5","280.03","280.04","280.04","280.04","280.04","280.04","280.03","280.03","ok"],
      ["6","280.05","280.04","280.04","280.03","280.05","280.04","280.02","280.02","ok"],
    ]
  },

  // ── PORT Valve Stem Diameter ────────────────────────────
  portValveStem: {
    name: "PORT — Valve Stem Diameter",
    note: "dX1: At Top Position | dX2: At Bottom Position\nAvg. Intake Valve Stem Dia. d1 = (dX1 + dX2) / 2\nAvg. Exhaust Valve Stem Dia. d2 = (dX1 + dX2) / 2\nStandard: Inlet & Exhaust Valve Limit = 19.80mm | Valve Guide Limit = 20.40mm | Allowable Clearance = 0.06~0.10mm",
    hasImage: true, builtinImage: true, imageKey: "valveStem",
    headers: ["Cylinder No.","Valve Type","Stem Dia. dX1mm","Stem Dia. dX2mm","Guide-Dia D1mm","Guide-Dia D2mm"],
    rows: [
      ["1","IV","19.94","19.94","20.05","20.04"],["","IV","19.94","19.94","20.04","20.04"],
      ["","EV","19.96","19.96","20.06","20.03"],["","EV","19.96","19.96","20.02","20.01"],
      ["2","IV","19.94","19.94","20.00","20.00"],["","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],
      ["3","IV","19.94","19.94","20.00","20.00"],["","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],
      ["4","IV","19.94","19.94","20.00","20.00"],["","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],
      ["5","IV","19.94","19.94","20.00","20.00"],["","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],
      ["6","IV","19.94","19.94","20.00","20.00"],["","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],
    ]
  },

  // ── STBD Valve Stem Diameter (with Valve Number) ────────
  stbdValveStem: {
    name: "STBD — Valve Stem Diameter",
    note: "dX1: At Top Position | dX2: At Bottom Position\nAvg. Intake Valve Stem Dia. d1 = (dX1 + dX2) / 2\nAvg. Exhaust Valve Stem Dia. d2 = (dX1 + dX2) / 2\nStandard: Inlet & Exhaust Valve Limit = 19.80mm | Valve Guide Limit = 20.40mm | Allowable Clearance = 0.06~0.10mm",
    hasImage: true, builtinImage: true, imageKey: "valveStem",
    headers: ["Cylinder No.","Valve Type","Valve Number","Stem Dia. dX1mm","Stem Dia. dX2mm","Guide-Dia D1mm","Guide-Dia D2mm"],
    rows: [
      ["1","IV","1","19.94","19.94","20.00","20.00"],["","IV","","19.94","19.94","20.00","20.00"],
      ["","EV","","19.96","19.96","20.00","20.00"],["","EV","","19.96","19.96","20.00","20.00"],
      ["2","IV","2","19.9","19.94","20.00","20.00"], ["","IV","","19.94","19.94","20.00","20.00"],
      ["","EV","","19.96","19.96","20.00","20.00"],["","EV","","19.96","19.96","20.00","20.00"],
      ["3","IV","3","19.94","19.94","20.00","20.00"],["","IV","","19.90","19.94","20.00","20.00"],
      ["","EV","","19.96","19.96","20.00","20.00"],["","EV","","19.96","19.96","20.00","20.00"],
      ["4","IV","4","19.94","19.94","20.00","20.00"],["","IV","","19.94","19.94","20.00","20.00"],
      ["","EV","","19.96","19.96","20.00","20.00"],["","EV","","19.96","19.96","20.00","20.00"],
      ["5","IV","5","19.94","19.94","20.00","20.00"],["","IV","","19.94","19.94","20.00","20.00"],
      ["","EV","","19.96","19.96","20.00","20.00"],["","EV","","19.96","19.96","20.00","20.00"],
      ["6","IV","6","19.94","19.94","20.00","20.00"],["","IV","","19.94","19.94","20.00","20.00"],
      ["","EV","","19.96","19.96","20.00","20.00"],["","EV","","19.96","19.96","20.00","20.00"],
    ]
  },

  // ── Load Trial Sheet ────────────────────────────────────
  loadTrial: {
    name: "Load Trial Sheet — PORT & STBD ENGINE",
    note: "Model: 8L28HX",
    hasImage: false,
    headers: ["Parameter","Sub-Parameter","Unit","P(P) 600rpm 15min","P(P) 750rpm 15min","S(S) 600rpm 15min","S(S) 750rpm 15min"],
    rows: [
      ["Load","%","","","","",""],
      ["","Duration","HH:MM","15 min","15 min","15 min","15 min"],
      ["","Engine Speed","Rpm","600","750","600","750"],
      ["","Lay shaft Handle pointer","Scale","3.5","5","3.5","5"],
      ["Pressure","Eng. Lube oil","Mpa","","","",""],
      ["","FW cooling","Mpa","","","",""],
      ["","SW cooling","Mpa","","","",""],
      ["","Charge air","Mpa","","","",""],
      ["","T/C Lube oil","Mpa","","","",""],
      ["","Fuel oil","Mpa","","","",""],
      ["Lube oil Temp","Cooler inlet","°C","","","",""],
      ["Water Temp","Engine Inlet","°C","","","",""],
      ["Max Pressure","No. 1 Cylinder","Mpa","","","",""],
      ["","No. 2 Cylinder","Mpa","","","",""],
      ["","No. 3 Cylinder","Mpa","","","",""],
      ["","No. 4 Cylinder","Mpa","","","",""],
      ["","No. 5 Cylinder","Mpa","","","",""],
      ["","No. 6 Cylinder","Mpa","","","",""],
      ["","No. 7 Cylinder","Mpa","","","",""],
      ["","No. 8 Cylinder","Mpa","","","",""],
      ["Exh. Gas Temp","No. 1 Cylinder","°C","","","",""],
      ["","No. 2 Cylinder","°C","","","",""],
      ["","No. 3 Cylinder","°C","","","",""],
      ["","No. 4 Cylinder","°C","","","",""],
      ["","No. 5 Cylinder","°C","","","",""],
      ["","No. 6 Cylinder","°C","","","",""],
      ["","No. 7 Cylinder","°C","","","",""],
      ["","No. 8 Cylinder","°C","","","",""],
      ["F.I.P Rack Index","No. 1 Cylinder","Mm","","","",""],
      ["","No. 2 Cylinder","Mm","","","",""],
      ["","No. 3 Cylinder","Mm","","","",""],
      ["","No. 4 Cylinder","Mm","","","",""],
      ["","No. 5 Cylinder","Mm","","","",""],
      ["","No. 6 Cylinder","Mm","","","",""],
      ["","No. 7 Cylinder","Mm","","","",""],
      ["","No. 8 Cylinder","Mm","","","",""],
    ]
  },


  // ── Main Journal Pin Diameter ───────────────────────────
  mainJournalDia: {
    name: "Main Journal Pin Diameter",
    note: "Makers nominal dia: ___  |  Max dia allowed: ___  |  Max ovality allowed: ___\nPS: Port Side to Starboard  |  TB: Top to Bottom\nNote pitting, scoring or other abnormalities. Record results of Crack test (MPI/DP).",
    hasImage: true, imageKey: "journalMeasure",
    headers: ["","MJ 1","","MJ 2","","MJ 3","","MJ 4","","MJ 5","","MJ 6","","MJ 7","","MJ 8","","MJ 9","","MJ 10","","MJ 11",""],
    rows: [
      ["Bmax","","","","","","","","","","","","","","","","","","","","","",""],
      ["Bmin","","","","","","","","","","","","","","","","","","","","","",""],
    ]
  },

  // ── Crankpin Diameter ───────────────────────────────────
  crankpinDia: {
    name: "Crankpin Diameter",
    note: "Makers nominal dia: ___  |  Max dia allowed: ___  |  Max ovality allowed: ___\nF: Flywheel  |  A: Alternator  |  PS: Port Side to Starboard  |  TB: Top to Bottom\nOvality Permissible Limit: 0.1mm",
    hasImage: true, imageKey: "crankpinDiag",
    headers: ["","CR 1","","CR 2","","CR 3","","CR 4","","CR 5","","CR 6","","CR 7","","CR 8","","CR 9",""],
    rows: [
      ["","F","A","F","A","F","A","F","A","F","A","F","A","F","A","F","A","F","A"],
      ["Amax","","","","","","","","","","","","","","","","","",""],
      ["Amin","","","","","","","","","","","","","","","","","",""],
    ]
  },

  // ── PORT Connecting Rod Small End Bore ──────────────────
  portConRodSmallEnd: {
    name: "PORT — Connecting Rod Small End Bore Calibration",
    note: "Piston pin bushing inner dia: 110.0 +0.13/+0.17mm  |  Piston pin to bushing clearance: 0.3mm\nPS: Port Side to Starboard  |  TB: Top to Bottom",
    hasImage: false,
    headers: ["Cylinder No","T-B","P-S","","T-B","P-S","Remarks"],
    rows: [
      ["1","","","","","",""],["2","","","","","",""],["3","","","","","",""],
      ["4","","","","","",""],["5","","","","","",""],["6","","","","","",""],
      ["7","","","","","",""],["8","","","","","",""],["9","","","","","",""],
    ]
  },

  // ── STBD Connecting Rod Small End Bore ──────────────────
  stbdConRodSmallEnd: {
    name: "STBD — Connecting Rod Small End Bore Calibration",
    note: "Piston pin bushing inner dia: 110.0 +0.13/+0.17mm  |  Piston pin to bushing clearance: 0.3mm\nPS: Port Side to Starboard  |  TB: Top to Bottom",
    hasImage: false,
    headers: ["Cylinder No","T-B","P-S","","T-B","P-S","Remarks"],
    rows: [
      ["1","","","","","",""],["2","","","","","",""],["3","","","","","",""],
      ["4","","","","","",""],["5","","","","","",""],["6","","","","","",""],
      ["7","","","","","",""],["8","","","","","",""],["9","","","","","",""],
    ]
  },

  // ── Gudgeon Pin Diameter ────────────────────────────────
  gudgeonPin: {
    name: "Gudgeon Pin Diameter",
    note: "Nominal diameter of the Piston Pin: ___  |  All dimensions in mm",
    hasImage: true, imageKey: "gudgeonPin",
    headers: ["Cylinder No","D1x","D1y","D2x","D2y","Remarks"],
    rows: [
      ["1","","","","",""],["2","","","","",""],["3","","","","",""],
      ["4","","","","",""],["5","","","","",""],["6","","","","",""],
      ["7","","","","",""],["8","","","","",""],["9","","","","",""],
    ]
  },

  // ── Connecting Rod Big End Bore ─────────────────────────
  conRodBigEnd: {
    name: "Connecting Rod Big End Bore (With/Without Bearing Shells)",
    note: "No shrinkage allowed!  |  Ovality Permissible Limit: 0.1mm\nF: Flywheel  |  A: Alternator",
    hasImage: true, imageKey: "conRodBigEnd",
    headers: ["","Unit 1","","Unit 2","","Unit 3","","Unit 4","","Unit 5","","Unit 6","","Unit 7","","Unit 8","","Unit 9",""],
    rows: [
      ["","F","A","F","A","F","A","F","A","F","A","F","A","F","A","F","A","F","A"],
      ["A","","","","","","","","","","","","","","","","","",""],
      ["B","","","","","","","","","","","","","","","","","",""],
      ["(B+C)/2","","","","","","","","","","","","","","","","","",""],
      ["C","","","","","","","","","","","","","","","","","",""],
      ["Ovality","","","","","","","","","","","","","","","","","",""],
    ]
  },

  // ── Valve Stem & Valve Guide Diameter ───────────────────
  valveStemGuide: {
    name: "Valve Stem & Valve Guide Diameter",
    note: "All dimensions in mm. Refer manual for tightening torques and all wear limit values.",
    hasImage: true, imageKey: "valveStemGuide",,
    headers: ["Cyl No","Guide Bore D1mm","Guide Bore D2mm","Stem Dia d1mm","Stem Dia d2mm","Seat-In mm","Seat-Ex mm","Guide-In mm","Guide-Ex mm","Lip T1mm","Lip T2mm"],
    rows: [
      ["1","","","","","","","","","",""],["2","","","","","","","","","",""],
      ["3","","","","","","","","","",""],["4","","","","","","","","","",""],
      ["5","","","","","","","","","",""],["6","","","","","","","","","",""],
      ["7","","","","","","","","","",""],["8","","","","","","","","","",""],
      ["9","","","","","","","","","",""],
    ]
  },

  // ── Piston Groove Clearances ────────────────────────────
  pistonGroove: {
    name: "Piston Groove Clearances",
    note: "Standard: 1st Compression 6mm +0.22/+0.20mm | 2nd Compression 6mm +0.12/+0.10mm | 3rd Compression 6mm +0.05/+0.03mm | Oil ring 8mm +0.05/+0.03mm\nMakers nominal height: ___  |  Max height allowed: ___",
    hasImage: true, imageKey: "pistonGroove",,
    headers: ["Piston No","Ring","Position 1","Position 2","Position 3","Position 4","Position 5"],
    rows: [
      ["1","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["2","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["3","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["4","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["5","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["6","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["7","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["8","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
      ["9","1st Comp","","","","",""],["","2nd Comp","","","","",""],["","3rd Comp","","","","",""],["","Oil Ring","","","","",""],
    ]
  },

  // ── Camshaft Bush Clearance ─────────────────────────────
  camshaftBush: {
    name: "Camshaft Bush Clearance — PORT",
    note: "Standard: Bearing clearance: ___",
    hasImage: true, imageKey: "camshaftBush",
    headers: ["Bushing No","Position","Remarks"],
    rows: [
      ["1","",""],["2","",""],["3","",""],["4","",""],
      ["5","",""],["6","",""],["7","",""],
    ]
  },

  // ── Custom Table ────────────────────────────────────────
  custom: {
    name: "Custom Table",
    note: "",
    hasImage: false,
    headers: ["Column 1","Column 2","Column 3"],
    rows: [["","",""],["","",""],["","",""]]
  },

};


// ── Built-in calibration diagrams ──
const EXTRA_DIAGRAMS = {
  crankshaft: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCACJAeADASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAQFAQMGAgf/xABHEAABAwIDAggLBgQGAQUAAAABAAIDBBEFEiEGMRMVNUFRUpLRFCJTYXOBkZWys9IHIzJxdLEkNkKhMzRDYnLBgpPC4vDx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuKIiAiKrg2gwucSPbVBsUbiwzyNLInEHKQ17gGusRbQlBaIobsWw1rZHOxCkDYnZZCZ22YddDrodD7FHix/DZKuqpvCo2Op8uZ0jg1rg5me7TfUZdT0ILRFV0mP4ZV4jPQw1UZniax1i8Wka5uYFmvjC28hRcU2vwPDBTuqK+F0c/CFr4ntc0NYLvJIPN0C5JNgCgvkVVie0OGYZg5xWoqozS8EZGFjgTKLX8QX8Y25gsYptHheGU0s09VG50To2OhY9pkDnkBoIvpcnnt0oLZFV4Tj+H4pTwSwzCN85eI4ZnBshLHFrrNvrYtO66j1u1uB0jzEcQhln4F0rYoXtcXtDg0gG9ibnde6C8RRHYnQNfKx9bTNfDbhWumaDHfdmF9PWsHFcODQ419KGmIyg8M2xYN7t/4fPuQTEWAQ4AtIIOoIWUBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFy0GyBhoaPDjX56GirWVVPG6AZgGvL8jnX132BsPWupRBxtPsKWYoyuqsVkqXMmikDXwjUMdI4A6kD/FtoANBpvUWl+zaCnfn8P4bNRto5GTU4cx8YY1u4OBBu0G4IPN0Ed4iDjGbCEDO/GJ31PCRyGodC0vuyGSPnvf/Evrfdre5K8x7At4GZlRickj5vCc7+C1++hbEfxOJ0yX1J3rtUQcrjuyDsYoqeCSvEcjKGSikeKcOa5j8l3NaT4rrsGtzzrQ3YOnbPLJ4WXZqkTxucxzns++ZM5mr8tiWW/CDu1NtexRBxMH2d0sU73yVj5WSXL2ua5pac8jg5mV4AI4UjUO3X0uV7qNhTUUscL8QYC3D3UDi2kABjuwtNs34hkF94N9wXZog46XYOKadrpK4mOKpfPC3gBcZ52TPD3X8fVgA3WB516h2J8Gl4WmxARvLJ2uvTBwkEjpHNa9pdlc1pkJAtfTeAbLr0QeY2lrGtJBIAFwLf2XpEQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBQw0jMQxjFPCZqu0UkbY2x1csbWgxtJ0a4DeSoNJV7PVTQ6OtxBrc8zHGSuqWhhj/ABZrv0FiCDzgq2wrljGfTRfKaq2TYqjc6J7aqpa6OF8ZIy2cXPztcRbe03A6RoUBs2zjp2QtxSpJfC+YOGJz5crTZxvntoebzFKqXZ+mjp3Gvq5DUvayJkeJzlz8zwy4HCcxOv5FbKjZOOpheyaunc6YScO4NaM7nua4EAbrFjd2/nWY9lI4wwMq3xtLo3ztjjaBK5kpkadbkG5N9dUG2amwWCd8E2IVMcscZkex2KTgtaN5PjrzUQ4FTU0VTUYlURQy6xvfik7Q78rvTEdmGV2KvrpauR12Oa2GRgexuZmU6HeNL26SdV4rdnqmaDDaaGvlDaZkrJaiSz5HB7cv9QPT6tN6D1LFgMLpmy4nOwwtDpA7FZxkBta/j+ce0dK9T0+CU5iE+I1MZmYXx58UnGZoFyfx7rLTBsdR09Q98Ur+DL2vYHNzOYQ5jiA48xyC+isMRwYVtU+bwmWJk9Oaeoja1p4RnjWsSLtIzHUIIksOBQm0mI1AN7W40nvfKHbs/QQfWFpo37O1kdK+HE6k+FMzwtdic7XOGvMX35j7CvcGyxjkjlfiMz5hM2V0ojax/isYwNaW2sCGC41vc+ayLZVrOCY6vmfE0RB7Cxoz8ETwettLXF7b7c2qDEDtnKiURQYxJI83s1uLzEmwuf8AU6NfyXmR2ANphPHiFVNma8xxxYpOXylouQ0cJqd3tC9z7IUU9O2nlnmMYZEw2ygkMidGNbdDyfzUrB8AiwyZk4lL5Wse1zgzLnzZNTqST4gG9B5paDCqt8jIKqte+IgSNGJTksJ5j4+9SOIqPytf7xqPrXvD8MFFW1lSJnEVLs3BNGVjTc626xvqeewVggrOIqPytf7xqPrTiKj8rX+8aj61ZogrOIqPytf7xqPrTiKj8rX+8aj61Zog56HCYHY5V05nxAxMpYHtbxhPo5zpQT+PnDW+xTuIqPytf7xqPrWYP5krv0VN8c6skFZxFR+Vr/eNR9acRUfla/3jUfWrNEFZxFR+Vr/eNR9acRUfla/3jUfWrNEFZxFR+Vr/AHjUfWnEVH5Wv941H1rdiNZLScFwNOJi8kFvCBpHt3+foW+jnFVSQ1AaWiWNrw128XF0ELiKj8rX+8aj61qqsMw2jppJ6qqrIoYxmfI/EpwGjpJz6K4VTtTX4bh2A1k+M1TKajMZY97iRe4tYW1J8w1Qem4JROAIlryDqDxjUfWs8RUfla/3jUfWvWAY1h+P4ZFiGF1UdTA/QvjuLO5wQdQfMdVYoKziKj8rX+8aj604io/K1/vGo+tWaIKziKj8rX+8aj604io/K1/vGo+tWaIKziKj8rX+8aj604io/K1/vGo+tWaIKTEcGpoaCpkjmxBr2RPc08Y1GhAJH9axhmD002G0sss2IOe+FjnHjGo1JaCf61Y4tyXV+gf8JWMG5Iov08fwhBo4io/K1/vGo+tOIqPytf7xqPrVmiCs4io/K1/vGo+tOIqPytf7xqPrVmiCs4io/K1/vGo+tOIqPytf7xqPrVk4hrS46AC5UVla6cNdS08kjHDMJHWY0jzX1/sgj8RUfla/3jUfWnEVH5Wv941H1qTlrnt8Z8ERPVaX29Zt+yz4PMQM1ZLfnytaP+igi8R0fla/3jUfWnEVH5Wv941H1qQaK48apqT5+Ft+1lnwMi2SqqW/+YP7goI3EVH5Wv8AeNR9acRUfla/3jUfWpLqeoAHB1jt/wDWxrr+yyE1rHDxYJW89iWH2a/ugjcRUfla/wB41H1pxFR+Vr/eNR9aksrRwjIp4pIXvdlaHC4cbX0IuNwKlIKziKj8rX+8aj604io/K1/vGo+tWaIOdxvDoqGg8JpZ65krJorE18zhrI0G4LyCLE710SqdqOR3+lh+axWyAiIgIiIKnCuWMZ9NF8pqpHVe0zJaEHNllc50jn05s08IAGENY4gZNbkjU3vpZXeFcsYz6aL5TVbIOJo8bxpmItjqW1L2MEUlTD4F40Yc6VrgwAXc0FrPGF+m51tto6naWVkcjopWSmDhXsdCAHyCFhDDfRoLyQbdHrXX8GzhDJkbwhAaXW1IHNf1lekHFQ1e1E2Hl4fIyVsU0jf4Qlxc1sZaxwcxm9xf+EajS9xdbHVm0sWJQ0tnOp2VDm+EPpz963O38QYx1hlJsfFHSdCuxRBxrX7QPkoH1VRWNjMkEs3A0zQW5uEa5hABu0WYTzi979HZIiAiIgIiICIiAiIgIiIK2D+ZK79FTfHOrJVsH8yV36Km+OdWSAiIgLBIAudyyvEzS+J7QLktIQRMPAqWurZAHcNcRg80fMNenefz8wU1xDWlziA0C5J3Ba6VhjpomOFi1jQR+QWhxFXVOi3wwEZxvDn2vY/lofWOhBjhKmrP3F4IfKPZdzh/tB3ev2Lm/tB2Kh2o2akoX108MsUnhDJnkyDMA7Qt6LOI0tzLsVor/wDJVHonfsUHI/ZzsNT7K4Aabw2aomqH8M+VjnRgEtAADQeYdK6jLV0xBa/wmIDVr7CQbtx3H1+1bqD/ACVP6Jv7Bb0GuGaOdgfE4Obu/I9BHMfMtihVI8EqBVM0jeQ2dvNbcH/mNAfN+SmoCIiAiIgiYtyXV+gf8JWMG5Iov08fwhZxbkur9A/4SsYNyRRfp4/hCCYiIgIiICg4d9y+ekP+k7Mz/g7Uew3HqU5QK/7ipp6waNB4KX/i46H1Ot7SgnrXUzspoJJ5SQyNpc4gX0C2IRcWKCsbjtB4wll4F7TZzHjUH1XC9Q45hs0kUTapollNmRkEElT8jOo32Ly6nhe9j3RMc9hu1xaLt/JBsRFqqp201PJM/wDCxpcfOgjM/iMTe/8Aopm5G/8AN2p9gsPWVOUbDoXQUrBJ/iuu+T/kdT3epSUBERBU7Ucjv9LD81itlU7Ucjv9LD81itkBERAREQVOFcsYz6aL5TVbKpwrljGfTRfKarZAREQEREBERAREQEREBERAREQEREFbB/Mld+ipvjnVkq2D+ZK79FTfHOrJAREQFojrKeSrlpWTMM8QBfGDq0Hd/wDfOt60xU0UUssrW+PK7M5x37gP/aEGnGMUosGw2fEMSnbBSwNzSSO5hu3c5JsLKk2G2qwbaWimdhNY6eSGQmdskfBvaXEkHL0Hmt0Kw2p2fo9psEqsKr8zYp2gcJHo5hBBBHrAXOfZr9n+FbK0k89PUOr56uwdNLGGgNaT4obrbXfrrZB3Nx0rRXkeBVGv+k79is+CU3kIuyFAxqGFtFJDDExsszHtDmtF2DKbu9Q/uQgnUBHgVPr/AKTf2C33HSqnB4IG08dLLC1zo4mFjntuXstoSecjcfUedWHglN5CLshBGx7EKDDMHq6zFZmRUUcZ4VzxcWOlrc972tz3VZsVtdhO1VA5+F1hmkpsrJ2vj4N4NtDlPMbFSdp9m8Px/AazC6tvBQ1DAHSRABzCCHAj8iAVz/2abA4bsph0s0U0lZNXBrnSSsDQGDVoDQTbfe90HasqYX1D6dkjXSxgF7AdWg7rratEdJBHPw0cYbJkyXG6177vzW9AREQRMW5Lq/QP+ErGDckUX6eP4Qs4tyXV+gf8JWMG5Iov08fwhBMREQEREBRKmajngkhkqIsr2lp8cKWsZR0BBGwyc1FGxz3Bz23Y8jcSDYn+ylIiAiIgKuxKRjqqmppHtZHm4Z5cbAhu4dqx9SsVggHeEGuOpgkcGxzRud0NcCVtWLAbgFlAREQVO1HI7/Sw/NYrZVO1HI7/AEsPzWK2QEREBERBU4VyxjPpovlNVsqnCuWMZ9NF8pqtkBERAREQEREBERAREQEREBERAREQVsH8yV36Km+OdWSrYP5krv0VN8c6skBERARYc4NF3EAXA186ygKHTfw9VLTu0ZITLF6/xD1HX1+ZTFrnhbMyziQQbtcN7T0hBsVW7+IgrKw6tMT44f8AiAbn1n+wC+V4j9quOU32lHA2UERoI6wUjoXMPCyDNlzg+e+YC1re1fXqoMGHTCMNDBC7KG7rZdLINAY/wClngbmmhjaQ29s4sLt9f7gKbBNHUQslicHMeLtPSFrof8jT+ib+wXyLF/tZxDCvtAfgNPhUJw+KsFO9pDuGkLnauab21JuBbUfnoH1nEXl7G0kTiJai7btNi1v9TvNYf3IUtrQ1oa0WAFgAtMEAY980hzzP0LrWsATYDzC63oCIiAiIgiYtyXV+gf8ACVjBuSKL9PH8IWcW5Lq/QP8AhKxg3JFF+nj+EIJiIiAiIgLDnBrS5xsALknmWVBxRxkZHSNPjVLsp8zBq4+zT1hB5pXVs8XhAmjDZfGZG+P8IvpqD0WW8SVbWnPTxuP+yXf7QFIAAAAFgOYKPXVYpGNcY3yZnZQG82hOvRut+ZAQYbUVGW76KQeYPaf+0NRU5gG0brHeTI0WUVmO0sn4Y6knnAgcbHoWuo2joKaIy1AqI484ZmdA4C5NhzedBPc6tcRkjgY3nLnlx9gA/daeEqaesibUStkimu0WZlyO3gb9bgH2BTgbgEc6j4hA6opXsjNpBZ0Z6HDUf3CCSi00k4qaaOZotnbe3QecLcgIiIKnajkd/pYfmsVsqnajkd/pYfmsVsgIiICIiCpwrljGfTRfKarZVOFcsYz6aL5TVbICIiAiIgIiICIiAiIgIiICIiAiIgrYP5krv0VN8c6slWwfzJXfoqb451ZICIiAiIgKDi+IswulbUSRue0ysjs3mzOAv/dTkQV9NRUVTUNxKbDqZlc0uYJjG10jQCW6Ptfd+6VGEUsgc6GPgZODc1pje5jRe+9oNjv6FYIggw4ZCBTOmzySQMs0ukcW7rHS9j6wtc2A4TNi0eLS4dSvxCMWZUuiBePX/wBqyRBVYRis2INhMlKIeEjL3NMl3M105hf/AKVqiICIiAiIgiYtyXV+gf8ACVjBuSKL9PH8IWcW5Lq/QP8AhKxg3JFF+nj+EIJiIiAiIgKDS/f189QdWx/cx/u4+2w/8VuMdUQf4iMefgv/AJL3SwNpqdkTSSGjUneTzlBtREQYAA3LDmNeLPaHDoIuvSICIiCFSfcVlRTH8Lvvo/yP4h7f3U1R6mmMssMscnByRE2NrggjUEez2JkqvLx/+kfqQSEWBewublZQVO1HI7/Sw/NYrZVO1HI7/Sw/NYrZAREQEREFThXLGM+mi+U1Wy5yAYkcbxfi91GGcLFm4cPJvwTeg2spTHY7I0OjlwpzTuLRIR+6C5RU98ezZeEwvNa+XLJe3tWbbQdfDOzJ3oLdFTF+ONNnTYUDpoRJzmw5+derY/18M7Enegt0VRbaDr4Z2ZO9LbQdfDOzJ3oLdFUW2g6+GdmTvS20HXwzsyd6C3RVFtoOvhnZk70ttB18M7Mnegt0VRbaDr4Z2ZO9LbQdfDOzJ3oLdFUW2g6+GdmTvS20HXwzsyd6C3RVFtoOvhnZk70ttB18M7Mneg2wfzJXfoqb451ZKgZR48yvmrBLhpdLFHEW5JNAwvN9/wDvPsUi20HXwzsyd6C3XMVlRiUFXi8dPFW3fNC+KRkWcNiysEhZe7cw8ezenmKsLbQdfDOzJ3plx/rYZ2ZO9BTQ1O0Tp4WvFZlMjeBzQMAlj4R2YzG3iOEeUgDLrzE3Ai4ezaSHDaaJ0M0dTDCWNysa5rG2jDbX3m2a+b+oHmsujy4/1sM7MnemXH+thnZk70HP8aYtDj9Nh9VWzMiZOA6QsZ94x0jwwPAYdXANAIy85UySgxWHGq6ponzg1FTcuc2Mgxtgu1ty24bwmnt3XJVg+mxl8zJnswh0sd8khieXNvvsb3C2Zcf6+GdmTvQUcUu0s8OVktbGCLmSSnibIHiJxLQLWyZ8oBtrci5GqmCXH48HxGNzJqmrcY2UznNaw3exuY3GgDXF3nFudWGXH+thnZk71nLj9j42GX/4yd6Dk6rCcampow8YjFNh9PPHCWSMkc4Z4ywh5BJeWEgnQnKRzm91jIxaKuiqcOkrng0DmtbkaW58zTdzSNH5bkbgSLeZWOXH+vhnZk70y4/1sM7MnegqauDF8RwEQk1Be7EGCN8zMjzAHi5kawt8+gtcWutc79oqeSogoxPeJj2xtbC0whgjGRzS65L8/MSdL3G4q6y4/wBfDOzJ3plx/rYZ2ZO9BW10m0dPWSU1IZp4Q5rWTvjZqJAGhxsB/huDnHTc4b1ooqjaOqxGSGQVdPS+EMHCOjYXNb95mAOW1tI9Rm36E81zlx/r4Z2ZO9MuP9bDOzJ3oK7ZhmJSYtU1WJtqszqSJjjPG1rWyB8hc1lt7RcWJvcHeV1CqMuP9bDOzJ3pbaDr4Z2ZO9BMxbkur9A/4SsYNyRRfp4/hCgVMGP1FPLC6TDAJGFhOSTS4t0rFJT4/TUsMDZMMcImNYDkk1sLdKC8RVFtoOvhnZk70ttB18M7Mnegt1ym02KVNJij4YcSdSltCZqeERsd4RNnIDLEFzr6CzSDqrS20HXwzsyd6W2g6+GdmTvQUk21FXBU0tM+McJPUPjewjxmjhHMBabjdbmDvPbQn1XYtWU+GYS6WsfTRy0HCyVBLGmWUNZZhe9pa0kFx1GtrBXOXaDr4Z2ZO9Mu0HXwzsyd6Cgl2yqIqp0LIGvYymbK8ysyuj/wi4usd2V5N8oHi6E62ydsaqWvZDSxU7mGSTL4riZo2vkHiG4F7MFtDcuFlfZdoOvhnZk71CnwjEqitZWSx4Y6duXX74A5SS27Q6xsSSLg25kEak2hxGt2ZrK8RwxzRlgY+K0mVpy5iWNc7VoLjYnW24bkp8XrvDTS0VZHX0rpbMrJWg6CNz3tBYA1xBA15s1tbWVtl2g6+GdmTvS20HXwzsyd6Dn2bW4kM7W0kJMdIyS0rw173GNrs9s2Ytu4t0ZzXvzLZNtFiVLWzeGTUjIoYp25Gwu+9ex7QHC7uh4JF7CxJIGovLbQdfDOzJ3pl2g6+GdmTvQc5SbT4rVSRzZ6ZsTzABTtiOd4M7o3uY7MRbRp5wLjXnMml2lxOsMcVMyhdJLlOcNeWwEskcYni+rxkF9R+LcNL3WXaDr4Z2ZO9Mu0HXwzsyd6CdhtS6sw6lqns4N08LJCy98pIBt/dSVUW2g6+GdmTvXmR2PRgFz8N1NhZkp/7Qe9qOR3+lh+axWy5THZMWdQWqXUXBcNDmyRyB1uFZuubXXVoCIiAiIgqcK5Yxn00XymrmfAKvD3xRuir3S05jyOpWyFg+9kdJa2hJY8DUbx5l02FcsYz6aL5TVZu3oPm0VDWBuY4fiDZzTSU4mEcokYC8EEuH4iRmuRZSaoYqZ54qOnxKOlzSvicY5QbOY1oZa2gBa7W+l7jVd8iD5+6kkOINq4MIr6V/8ADkODZnmPg3uLhr+K7XDzaW86xT01a9jY6qlxVkVhw0beHdwrxG8GW+hF3OYcv+26+gog5rZIVzcQqjVxVYEkMZMlUx13PAAdYmwDegWvvXVLwzevaAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLRWRukiAa3N4wuL2uFvRByNbhLcLwidsfhLhJURPLqicyEfess0XJsB/+rrlU7Ucjv9LD81itkBERB//Z",
  crankshaftDial: "data:image/jpeg;base64,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",
  crankpinDiag: "data:image/jpeg;base64,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",
  gudgeonPin: "data:image/jpeg;base64,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",
  journalMeasure: "data:image/jpeg;base64,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",
  conRodBigEnd: "data:image/jpeg;base64,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",
  linerCalib: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCADCAeADASIAAhEBAxEB/8QAGwABAQADAQEBAAAAAAAAAAAAAAUCAwQGAQf/xABXEAABAwMCAgUGCAkIBwUJAAABAAIDBAUREiEGMRMVQVHSFCJVYXGTFiMyNXSUstEzNlNUc4GRsbMkNEJScqHB0wcXJWKCg+JDVpWi4URFZHWFkqPD8P/EABcBAQEBAQAAAAAAAAAAAAAAAAACAQP/xAAgEQEAAgEEAgMAAAAAAAAAAAAAARICAxETUSFSIjEy/9oADAMBAAIRAxEAPwD9xREQEREBFqqaiCkgdPVTRwws+VJI8Na3s3JWt9fSMr4qB9RGKuWN0rISfOc0EAkDu3CDpREQEXPXV1Jb6c1FfVQU0AODJPIGNB9pOFsgmiqIWTQSMlieA5j2ODmuHeCOaDYil/CG0dOIOsKfpTLLDo176426pG+1o3K7qOqgrqSGqpJWywTMD45GHIc0jIIQbkRctZcaOhYx9XUxRNfK2Fpc7m9xw1vtKDqREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQeW/wBJ1NPWcC3WCkglqJnsZpiiYXudiRp2A3OwULiWtudzqJ6yyQXaOMWGtZHmllhcJwY9GGkA6ueO/fC/RkQflNfT8VUNFeae2zXicOp6CUPmfJI/LifKOjPMHAGWs3HYAcLbaaK/1r7HS1tbePIpK6qMr4jUQObCIwWMe5/xmNYIBdgnkv1FEHiuM6eSPiiw3Srt9RcLVTRzsljggM5hlcG6ZDGASdgRkA4yvOcW1V7NwpHcOWu70UEbIJIGxsnYwgyeeOiYOjbt8oSb4OwC/WEQflcNDd47zKG0la2nlu92fJiJ2lzHQYjJ25E8j2nkpNrg4jpOHamG2RcRRGHh4NmjqGyDTVhzdAgB7m6vkbYxndftSIPybitnENuuNJTWaO+SeTtp5G1Lp6iYSkyZkBDRo2GciTsI0gYWsWKto7zc308N7bUfCSCdumScwy0z3M1OO+h2MOydyAByAX66iD8rtnwjdc4XP69FeHVnWgm6QUvR6X9D0WfNznRjRvzytlhprzSQN6yn4jlgquGhNV4fI+ZlTkAiLPyJNJOGjfbJ33X6giDTSY8khx0uOjb+G+Xy/pevvW5EQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARFGqIZ62+VEArqqCKGmhc1kDmtBLnSZJy0/wBUILKKV1PJ6XuXvWeFOp5PS9y96zwoKqKLDbm1GvoL5XydG8sfonYdLhzB83YjuW3qeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71vhTqeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71nhTqeT0vcves8KCqildTyel7l71nhWrq4eUeT9eV/T6NfR9OzVpzjONPLPagtIpXU8npe5e9Z4U6nk9L3L3rPCgqovOUNDUT1twhfd7jpglY1nxjORja7+p3kru6nkxjra5e9b4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCnU8npe5e9Z4UFVFK6nk9L3L3rPCsLP08VxuFJLVT1EcXRFhmIJGppzuAO5BYREQEREBERAU2n/GKu+iU/wBqZUlNp/xirvolP9qZBSREQeY4DL3QXoyN0u64qs5/tBenXmeBZemgvMmMZvFUMexwC9MgIiICIiAiIgIiICIi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",
  buttClearance: "data:image/jpeg;base64,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",
  pistonGroove: "data:image/jpeg;base64,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",
  camshaftBush: "data:image/jpeg;base64,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",
  valveStemGuide: "data:image/jpeg;base64,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",
  rockerArm: "data:image/jpeg;base64,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",
};

// ── STATE ────────────────────────────────────────────────
const State = {
  currentUser: null,       // { empNo, name, isHOD }
  googleToken: null,
  tokenExpiry: null,
  pendingFlow: null,
  baseSheetId: null,
  draftsFileId: null,
  drafts: [],              // engineer's own WIP drafts
  submittedFileId: null,
  submitted: [],           // drafts submitted to HOD (engineer's own)
  approvedFileId: null,
  approved: [],            // HOD-approved drafts (engineer's own)
  hodQueueFileId: null,
  hodQueue: [],            // ALL submitted drafts (HOD sees all)
  currentProject: null,
  currentDraft: null,
  employees: [],
  vesselImageBase64: null,
  memberCount: 3,
  dvrParsedData: null,
  grammarSuggestions: [],
  undoStack: [],
  // HOD Review state
  hodCurrentDraft: null,
  hodCommentTarget: null,
  _engineType: "niigata",
};

const Screen = {
  show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById("screen-" + id);
    if (el) { el.classList.add("active"); window.scrollTo(0,0); }
    else console.error("Screen not found:", id);
  }
};

const Undo = {
  push(action, label) {
    State.undoStack.push({ fn: action, label: label || "Last action" });
    if (State.undoStack.length > 50) State.undoStack.shift();
  },
  pop() { return State.undoStack.pop(); },
  last() {
    const entry = this.pop();
    if (!entry) { Toast.show("Nothing to undo.", "error"); return; }
    entry.fn();
    Toast.show(`↩ Undid: ${entry.label}`, "success");
  }
};

/* ════════════════════════════════════════════════════════
   AUTH — one-time per browser session
════════════════════════════════════════════════════════ */
const Auth = {
  SESSION_KEY: "npps_google_token",
  EXPIRY_KEY:  "npps_token_expiry",

  // Try to restore token from sessionStorage (lasts until tab closes)
  restore() {
    const token  = sessionStorage.getItem(Auth.SESSION_KEY);
    const expiry = sessionStorage.getItem(Auth.EXPIRY_KEY);
    if (token && expiry && Date.now() < parseInt(expiry)) {
      State.googleToken = token;
      State.tokenExpiry = parseInt(expiry);
      return true;
    }
    return false;
  },

  save(token, expiresInSeconds) {
    const expiry = Date.now() + (expiresInSeconds - 60) * 1000; // 60s buffer
    State.googleToken = token;
    State.tokenExpiry = expiry;
    sessionStorage.setItem(Auth.SESSION_KEY, token);
    sessionStorage.setItem(Auth.EXPIRY_KEY, String(expiry));
  },

  clear() {
    State.googleToken = null;
    State.tokenExpiry = null;
    sessionStorage.removeItem(Auth.SESSION_KEY);
    sessionStorage.removeItem(Auth.EXPIRY_KEY);
  },

  isValid() {
    return State.googleToken && State.tokenExpiry && Date.now() < State.tokenExpiry;
  },

  // Silently refresh token without showing popup if token still valid
  // If expired, show the Google popup once
  async ensureValid() {
    if (Auth.isValid()) return true;
    return new Promise((resolve) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        scope: [
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/spreadsheets",
        ].join(" "),
        prompt: "",  // empty = no popup if session still has grant
        callback: (resp) => {
          if (resp.error) { resolve(false); return; }
          Auth.save(resp.access_token, resp.expires_in || 3600);
          resolve(true);
        },
      });
      client.requestAccessToken({ prompt: "" });
    });
  },

  // Force new token (only called from Connect button)
  requestNew(callback) {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ].join(" "),
      callback: (resp) => {
        if (resp.error) { Toast.show("Google connection failed.", "error"); return; }
        Auth.save(resp.access_token, resp.expires_in || 3600);
        callback();
      },
    });
    client.requestAccessToken();
  },
};


/* ════════════════════════════════════════════════════════
   APP INIT + LOGIN
════════════════════════════════════════════════════════ */
const App = {


  // ── History row templates per engine type ────────────────
  HISTORY_TEMPLATES: {

    niigata: [
      {type:'simple', label:'Last overhauling type and carried by', value:''},
      {type:'simple', label:'Running hours at the time of above maintenance', value:''},
      {type:'simple', label:'Observations recorded (prior dismantling)', value:''},
      {type:'simple', label:'Log leakages noted; any abnormalities recorded (prior job start)', value:''},
      {type:'simple', label:'Bearing size — Con Rod Journal (mention part no.)', value:''},
      {type:'simple', label:'Bearing size — Main Journal (mention part no.)', value:''},
      {type:'simple', label:'Turbo details to record here', value:''},
      {type:'simple', label:'Flexible coupling details to record here', value:''},
      {type:'simple', label:'Governor details to record here', value:''},
      {type:'simple', label:'Conditions of the Gauges on the Instrument Panel', value:''},
    ],

    cat: [
      {type:'simple', label:'Last overhauling type and carried out by', value:''},
      {type:'simple', label:'Running hours at the time of above maintenance', value:''},
      {type:'simple', label:'Any discrepancies noted by customer during engine run after last overhaul', value:''},
      {type:'simple', label:'Observations recorded prior dismantling', value:''},
      {type:'simple', label:'Log leakages noted, any abnormalities recorded prior job start', value:''},
      {type:'subtable', label:'Log all gauge readings and load prior dismantling',
        headers:['','Temperature (UOM)','','','','Pressure','','Load (KW)'],
        subheaders:['','WATER IN','WATER OUT','LO IN','LO OUT','FO (UOM)','LO (UOM)',''],
        rows:[['Reading','','','','','','','']]
      },
      {type:'subtable', label:'Alignment readings prior dismantling (as per clock dial position)',
        headers:['','Axial (UOM)','','','','Radial (UOM)','','',''],
        subheaders:['','0','3','6','9','0','3','6','9'],
        rows:[['Reading','','','','','','','','']]
      },
      {type:'simple', label:'Bearing size: Connecting rod journal — Size', value:''},
      {type:'simple', label:'Bearing size: Connecting rod journal — Part No.', value:''},
      {type:'simple', label:'Bearing size: Main journal — Size', value:''},
      {type:'simple', label:'Bearing size: Main journal — Part No.', value:''},
      {type:'simple', label:'Record the coupling type (take photo). Confirm alignment limits at site.', value:''},
      {type:'simple', label:'Air Starter: Make & model', value:''},
      {type:'simple', label:'Air Starter: Sr. no.', value:''},
      {type:'simple', label:'Air Starter: Last maintenance details', value:''},
      {type:'simple', label:'Turbocharger: Make & model', value:''},
      {type:'simple', label:'Turbocharger: Sr. no.', value:''},
      {type:'simple', label:'Turbocharger: Last maintenance details', value:''},
      {type:'simple', label:'Record compression pressure of all the power packs prior dismantling', value:''},
      {type:'simple', label:'Record thermostat element part no. and valve opening temp', value:''},
      {type:'simple', label:'Safety checks and conditions of the gauges on the instrument panel', value:''},
      {type:'simple', label:'Confirm photo evidences for the above have been captured', value:''},
    ],

    emd: [
      {type:'simple', label:'Last overhauling type and carried out by', value:''},
      {type:'simple', label:'Running hours at the time of above maintenance', value:''},
      {type:'simple', label:'Any discrepancies noted by customer during engine run after last overhaul', value:''},
      {type:'simple', label:'Observations recorded prior dismantling', value:''},
      {type:'simple', label:'Log leakages noted, any abnormalities recorded prior job start', value:''},
      {type:'subtable', label:'Log all gauge readings and load prior dismantling',
        headers:['','Temperature (UOM)','','','','Pressure','','Load (KW)'],
        subheaders:['','WATER IN','WATER OUT','LO IN','LO OUT','FO (UOM)','LO (UOM)',''],
        rows:[['Reading','','','','','','','']]
      },
      {type:'subtable', label:'Alignment readings prior dismantling (as per clock dial position)',
        headers:['','Axial (UOM)','','','','Radial (UOM)','','',''],
        subheaders:['','0','3','6','9','0','3','6','9'],
        rows:[['Reading','','','','','','','','']]
      },
      {type:'simple', label:'Bearing size: Connecting rod journal — Size', value:''},
      {type:'simple', label:'Bearing size: Connecting rod journal — Part No.', value:''},
      {type:'simple', label:'Bearing size: Main journal — Size', value:''},
      {type:'simple', label:'Bearing size: Main journal — Part No.', value:''},
      {type:'simple', label:'Record the coupling type (take photo). Confirm alignment limits at site.', value:''},
      {type:'simple', label:'Air Starter: Make & model', value:''},
      {type:'simple', label:'Air Starter: Sr. no.', value:''},
      {type:'simple', label:'Air Starter: Last maintenance details', value:''},
      {type:'simple', label:'Turbocharger: Make & model', value:''},
      {type:'simple', label:'Turbocharger: Sr. no.', value:''},
      {type:'simple', label:'Turbocharger: Last maintenance details', value:''},
      {type:'simple', label:'Record compression pressure of all the power packs prior dismantling', value:''},
      {type:'simple', label:'Record thermostat element part no. and valve opening temp', value:''},
      {type:'simple', label:'Safety checks and conditions of the gauges on the instrument panel', value:''},
      {type:'simple', label:'Confirm photo evidences for the above have been captured', value:''},
    ],

    other: null, // falls back to niigata
  },



  MANDAYS_TEMPLATE: [
    { label:'Onshore standby man days', value:'' },
    { label:'Travel man days', value:'' },
    { label:'Total working man days on board', value:'' },
    { label:'List reasons for Idle days (include rigging and shifting)', value:'' },
    { label:'Total idle man days on board', value:'' },
    { label:'List additional chargeable scope', value:'' },
    { label:'Additional man days for the extra scope', value:'' },
    { label:'Total mandays for this job', value:'' },
  ],

  VERB_CHIPS: ['Renewed','Inspected','Calibrated','Found within limits','Not found within limits','Overhauled','Cleaned','Pressure tested','DP Tested','Adjusted'],

  CAT_EMD_MAINT_PARTS: [
    'Cylinder head assembly',
    'Valve mechanism and rocker arm and shaft',
    'Cam follower and push rod',
    'Liner, piston & connecting rod and bearings',
    'Crankshaft assembly; crank seal and bearings',
    'Engine block',
    'Piston cooling nozzles',
    'Camshaft and bearings',
    'FO injection pump assembly and nozzles',
    'Fuel pump elements',
    'Fuel pump rack',
    'Fuel Pump camshaft and bushes',
    'Governor drive and coupling',
    'Actuator and its linkages',
    'Fuel oil transfer pump',
    'Water pump',
    'LO pump and pre lube oil pump',
    'LO pump strainer',
    'HMSO assembly',
    'LO cooler assembly',
    'Aftercooler assembly',
    'Turbo cartridge',
    'Thermostat elements and gaskets',
    'Front end gear train: gears and bushes',
    'Rear end gear train: gears and bushes',
    'Vibration damper',
    'Flywheel ring gear teeth and starter',
    'Breather assembly',
    'All seals and gaskets',
    'All LO and FO lines',
    'All filters',
    'Instrumentation and safety cut outs',
    'Gauge panel',
  ],

  CAT_EMD_SCOPE_TEMPLATE: [
    { type:'heading', text:'Cylinder Head' },
    { type:'item', sr:'1', contents:'Inspect / renew cylinder heads', included:'' },
    { type:'item', sr:'2', contents:'Seals, gaskets and O ring replacement', included:'' },
    { type:'item', sr:'3', contents:'Rocker arm Asly, shaft: inspect bush and tappet screws for wear and tear; renew as necessary', included:'' },
    { type:'item', sr:'4', contents:'Inspect valve lifter mechanism', included:'' },
    { type:'item', sr:'5', contents:'Inspect the head mounting studs and nuts; replace as necessary', included:'' },
    { type:'heading', text:'Liner, Piston and Connecting Rod (Power Pack)' },
    { type:'item', sr:'1', contents:'Inspect / renew power pack assembly with new seals', included:'' },
    { type:'item', sr:'2', contents:'Record liner projection', included:'' },
    { type:'item', sr:'3', contents:'Inspect piston cooling nozzles for any blockages prior installation', included:'' },
    { type:'item', sr:'4', contents:'Renew the bottom end bearings', included:'' },
    { type:'item', sr:'5', contents:'Record connecting rod bearing clearances', included:'' },
    { type:'heading', text:'Water / Lube Oil Pump' },
    { type:'item', sr:'1', contents:'Inspect / renew water pump', included:'' },
    { type:'item', sr:'2', contents:'Inspect / renew lube oil pump', included:'' },
    { type:'item', sr:'3', contents:'Inspect and if required renew the main oil strainer installed in the oil sump', included:'' },
    { type:'heading', text:'Fuel System' },
    { type:'item', sr:'1', contents:'Renew the fuel injectors', included:'' },
    { type:'item', sr:'2', contents:'Inspect / replace / recondition the fuel pump and governor drive', included:'' },
    { type:'item', sr:'3', contents:'Record the lifter heights and confirm fuel timing', included:'' },
    { type:'item', sr:'4', contents:'Renew the fuel transfer pump', included:'' },
    { type:'item', sr:'5', contents:'Inspect / renew the high pressure fuel supply lines and related seals and gaskets', included:'' },
    { type:'heading', text:'Pre Lube Pump & Air Starting Motor' },
    { type:'item', sr:'1', contents:'Renew / repair the pre lube pump', included:'' },
    { type:'item', sr:'2', contents:'Renew / repair the air starting motor', included:'' },
    { type:'heading', text:'Governor and Governor Drive' },
    { type:'item', sr:'1', contents:'Governor drive serviced and installed', included:'' },
    { type:'item', sr:'2', contents:'Inspect the governor linkages', included:'' },
    { type:'item', sr:'3', contents:'Renew the actuator', included:'' },
    { type:'heading', text:'HMSO' },
    { type:'item', sr:'1', contents:'Inspect and renewal of HMSO complete assembly', included:'' },
    { type:'item', sr:'2', contents:'Inspect and renew attached hoses', included:'' },
    { type:'heading', text:'Camshaft & Lifter Group' },
    { type:'item', sr:'1', contents:'Inspect and renew camshaft bearings', included:'' },
    { type:'item', sr:'2', contents:'Inspect or renew camshaft', included:'' },
    { type:'item', sr:'3', contents:'Renew the cam lifters', included:'' },
    { type:'item', sr:'4', contents:'Record camshaft bearing clearances and end play', included:'' },
    { type:'heading', text:'Crankshaft' },
    { type:'item', sr:'1', contents:'Visual inspection and calibration of crank pin and main journals or renew', included:'' },
    { type:'item', sr:'2', contents:'Record the clearances: Thrust bearing and main bearing', included:'' },
    { type:'item', sr:'3', contents:'Inspect and renew the Thrust and main bearings as necessary', included:'' },
    { type:'item', sr:'4', contents:'Main bearing tightening force check', included:'' },
    { type:'heading', text:'Front End' },
    { type:'item', sr:'1', contents:'Inspect and renew the crank seal', included:'' },
    { type:'item', sr:'2', contents:'Inspect the gears; bushes and record clearances', included:'' },
    { type:'item', sr:'3', contents:'Renew the vibration damper', included:'' },
    { type:'heading', text:'Rear End' },
    { type:'item', sr:'1', contents:'Inspect and renew the crank seal', included:'' },
    { type:'item', sr:'2', contents:'Inspect the flywheel teeth', included:'' },
    { type:'item', sr:'3', contents:'Inspect or renew the cam gear', included:'' },
    { type:'item', sr:'4', contents:'Record the alternator alignment; renew the coupling bolts as necessary', included:'' },
    { type:'heading', text:'Engine Block' },
    { type:'item', sr:'1', contents:'Engine block visual inspection, calibration; requalify', included:'' },
    { type:'item', sr:'2', contents:'If Necessary: 3rd party NDT inspection', included:'' },
    { type:'heading', text:'Turbocharger' },
    { type:'item', sr:'1', contents:'Renew the turbo cartridge (only new Cartridge — do not use REMAN CAT)', included:'' },
    { type:'item', sr:'2', contents:'Inspect the outlet housing; bellow for any visual damages for any possible leaks', included:'' },
    { type:'heading', text:'Aftercooler & Lube Oil Cooler' },
    { type:'item', sr:'1', contents:'Renew the aftercooler core', included:'' },
    { type:'item', sr:'2', contents:'Renew the lube oil cooler core', included:'' },
    { type:'item', sr:'3', contents:'Inspect and renew the corroded sleeves', included:'' },
    { type:'heading', text:'Thermostat Housing and Expansion Tank' },
    { type:'item', sr:'1', contents:'Renew the thermostat elements, seal and gaskets', included:'' },
    { type:'item', sr:'2', contents:'Inspect and renew the pressure cap/vent line', included:'' },
    { type:'item', sr:'3', contents:'Renew all the associated gaskets and seals', included:'' },
    { type:'heading', text:'Air Inlet and Exhaust Manifold' },
    { type:'item', sr:'1', contents:'Inspect and clean the air intake manifold', included:'' },
    { type:'item', sr:'2', contents:'Inspect the exhaust manifold; renew the bellows; seals and mounting bolts', included:'' },
    { type:'item', sr:'3', contents:'Inspect and pressure test the heat shield', included:'' },
    { type:'item', sr:'4', contents:'Mounted new exhaust bellow (after turbo) with new gaskets', included:'' },
    { type:'heading', text:'Pre Commissioning Checks and Safety Cut Outs' },
    { type:'item', sr:'1', contents:'Inspect and confirm the healthiness of all the safety cut outs Installed (Mechanical); electrical with rig staff assistance', included:'' },
    { type:'item', sr:'2', contents:'No load and load trials followed by joint inspections of the tappet cover and crankcase', included:'' },
    { type:'item', sr:'3', contents:'Re confirm tightness of all critical bolts prior handing over', included:'' },
  ],

  ENGINE_TYPE_LABELS: {
    niigata: { contractNo:"Project/Contract Number", endDate:"Handing over date", overhaulType:"Type of Overhaul", arrangement:"Engine Arrangement" },
    cat:     { contractNo:"Project Code",              endDate:"Handover Date",       overhaulType:"Type of Job",      arrangement:"Engine Arrangement No." },
    emd:     { contractNo:"Project Code",              endDate:"Handover Date",       overhaulType:"Type of Job",      arrangement:"Engine Arrangement No." },
    other:   { contractNo:"Project / Contract Number", endDate:"Handover Date",       overhaulType:"Type of Job / Overhaul", arrangement:"Engine Arrangement" },
  },

  async init() { Auth.restore(); await App.loadEmployees(); },

  async loadEmployees() {
    try {
      const resp = await fetch(CONFIG.EMPLOYEES_URL + "?t=" + Date.now());
      State.employees = await resp.json();
      App.populateNameDropdown();
    } catch { Toast.show("Could not load employee list.", "error"); }
  },

  populateNameDropdown() {
    const select = document.getElementById("emp-name-select");
    if (!select) return;
    select.innerHTML = '<option value="">— Select your name —</option>';
    [...State.employees].sort((a,b) => a.name.localeCompare(b.name)).forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.empNo; opt.textContent = emp.name;
      select.appendChild(opt);
    });
  },

  onNameSelect() { document.getElementById("emp-input").value = ""; document.getElementById("emp-error").textContent = ""; App.updateContinueBtn(); },
  onEmpInput()   { document.getElementById("emp-error").textContent = ""; App.updateContinueBtn(); },

  updateContinueBtn() {
    const selEmp   = document.getElementById("emp-name-select").value;
    const typedEmp = document.getElementById("emp-input").value.trim();
    const btn      = document.getElementById("continue-btn");
    const match    = selEmp && typedEmp && selEmp.toLowerCase() === typedEmp.toLowerCase();
    btn.disabled = !match; btn.style.opacity = match ? "1" : "0.5"; btn.style.cursor = match ? "pointer" : "not-allowed";
  },

  goHome() { Screen.show("home"); },

  goToLogin(flow) {
    State.pendingFlow = flow;
    document.getElementById("login-title").textContent = flow === "basedata" ? "Service Manager Login" : flow === "hod" ? "HOD Review Login" : "Sign In";
    document.getElementById("emp-input").value = "";
    document.getElementById("emp-name-select").value = "";
    document.getElementById("emp-error").textContent = "";
    App.updateContinueBtn();

    // For HOD login — only show Ashish in the dropdown
    const select = document.getElementById("emp-name-select");
    if (flow === "hod") {
      select.innerHTML = '<option value="">— Select your name —</option>';
      const ashish = State.employees.find(e => e.empNo === CONFIG.HOD_EMP_NO);
      if (ashish) {
        const opt = document.createElement("option");
        opt.value = ashish.empNo;
        opt.textContent = ashish.name;
        select.appendChild(opt);
      }
      document.getElementById("emp-input").placeholder = "Enter your employee number";
    } else {
      App.populateNameDropdown(); // restore full list for non-HOD flows
    }

    // If we already have a valid Google token, skip the connect button
    const connectBtn = document.getElementById("connect-google-btn");
    if (Auth.isValid()) {
      connectBtn.innerHTML = "✓ Google Drive Connected";
      connectBtn.classList.add("connected");
    } else {
      connectBtn.innerHTML = "Connect Google Drive";
      connectBtn.classList.remove("connected");
    }
    Screen.show("login");
  },

  logout() {
    State.currentUser = null;
    State.drafts = []; State.submitted = []; State.approved = [];
    State.hodQueue = []; State.currentDraft = null;
    // We do NOT clear the Google token — it stays for the session
    Screen.show("home");
    Toast.show("Signed out.");
  },

  verifyEmployee() {
    const selEmp   = document.getElementById("emp-name-select").value;
    const typedEmp = document.getElementById("emp-input").value.trim();
    const errorEl  = document.getElementById("emp-error");
    if (!selEmp || !typedEmp) { errorEl.textContent = "Please select your name and enter your employee number."; return; }
    if (selEmp.toLowerCase() !== typedEmp.toLowerCase()) { errorEl.textContent = "Employee number does not match the selected name."; return; }
    const emp = State.employees.find(e => e.empNo.toLowerCase() === typedEmp.toLowerCase());
    if (!emp) { errorEl.textContent = "Employee not found."; return; }

    // HOD flow — restrict to empNo 666
    if (State.pendingFlow === "hod" && emp.empNo !== CONFIG.HOD_EMP_NO) {
      errorEl.textContent = "HOD Review access is restricted to the Head of Department."; return;
    }

    errorEl.textContent = "";
    State.currentUser = { empNo: emp.empNo, name: emp.name, isHOD: emp.empNo === CONFIG.HOD_EMP_NO };
    Toast.show(`Welcome, ${emp.name}.`);

    // If token already valid, proceed immediately — no connect needed
    if (Auth.isValid()) {
      State.googleToken = sessionStorage.getItem(Auth.SESSION_KEY);
      document.getElementById("connect-google-btn").innerHTML = "✓ Google Drive Connected";
      document.getElementById("connect-google-btn").classList.add("connected");
      setTimeout(() => App.proceedAfterAuth(), 400);
    } else {
      Toast.show(`Welcome, ${emp.name}. Connect Google Drive to continue.`);
    }
  },

  connectGoogle() {
    if (!State.currentUser) { document.getElementById("emp-error").textContent = "Please verify your employee number first."; return; }
    Auth.requestNew(() => {
      const btn = document.getElementById("connect-google-btn");
      btn.classList.add("connected"); btn.innerHTML = "✓ Google Drive Connected";
      Toast.show("Google Drive connected!", "success");
      setTimeout(() => App.proceedAfterAuth(), 600);
    });
  },

  async proceedAfterAuth() {
    // All flows need the base sheet for project lookup — load it for everyone
    await App.ensureBaseSheet();
    if (State.pendingFlow === "hod") {
      await App.loadHODQueue();
      App.renderHODDashboard();
      document.getElementById("hod-user-pill").textContent = State.currentUser.name;
      Screen.show("hod-dashboard");
    } else if (State.pendingFlow === "basedata") {
      await App.loadProjectsTable();
      document.getElementById("user-pill-bd").textContent = State.currentUser.name;
      State._tempMembers = ["","",""];
      App.renderMemberFields();
      Screen.show("basedata");
    } else {
      await App.loadAllDrafts();
      document.getElementById("user-pill").textContent = State.currentUser.name;
      App.renderDashboard();
      Screen.show("dashboard");
    }
  },

  /* ══════════════════════════════════════════════════════
     DRIVE FILE HELPERS — per-user JSON files
  ══════════════════════════════════════════════════════ */

  async ensureSheetHeaders() {
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A1:T1`);
      const data = await resp.json();
      const existing = (data.values||[[]])[0];
      const required = ["ProjectCode","CustomerName","ContractNo","StartDate","EndDate","OverhaulType",
        "EngineModel","EngineSerial","EngineArrangement","RPMCapacity","RunningHours",
        "CustomerIncharge","TeamLeader","Members","Vessel","Location","CreatedDate","VesselImageBase64","EngineType"];
      // Find missing headers and append them
      const missing = required.filter(h => !existing.includes(h));
      if (missing.length > 0) {
        const nextCol = existing.length;
        const colLetter = (n) => { let s=''; while(n>=0){s=String.fromCharCode(65+(n%26))+s;n=Math.floor(n/26)-1;} return s; };
        const range = `Sheet1!${colLetter(nextCol)}1:${colLetter(nextCol+missing.length-1)}1`;
        await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/${range}?valueInputOption=RAW`,
          {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({values:[missing]})});
        console.log("Added missing sheet headers:", missing);
      }
    } catch(e) { console.error("ensureSheetHeaders:", e); }
  },

  async _loadJsonFile(fileName, stateKey, fileIdKey) {
    try {
      const resp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and trashed=false&fields=files(id,name)`);
      const data = await resp.json();
      if (!data.files || data.files.length === 0) { State[stateKey] = []; return; }
      State[fileIdKey] = data.files[0].id;
      const fileResp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files/${State[fileIdKey]}?alt=media`);
      const parsed = JSON.parse(await fileResp.text());
      const cutoff = Date.now() - CONFIG.DRAFT_EXPIRY_DAYS * 86400000;
      State[stateKey] = (Array.isArray(parsed) ? parsed : []).filter(d => new Date(d.createdAt || d.updatedAt || Date.now()).getTime() > cutoff);
    } catch { State[stateKey] = []; }
  },

  async _saveJsonFile(fileName, fileIdKey, dataKey) {
    try {
      const blob = new Blob([JSON.stringify(State[dataKey], null, 2)], { type: "application/json" });
      if (State[fileIdKey]) {
        await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State[fileIdKey]}?uploadType=media`, { method: "PATCH", body: blob });
      } else {
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify({ name: fileName, parents: [CONFIG.DRIVE_FOLDER_ID], mimeType: "application/json" })], { type: "application/json" }));
        form.append("file", blob);
        const resp = await gapi_fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method: "POST", body: form });
        State[fileIdKey] = (await resp.json()).id;
      }
    } catch (err) { console.error("_saveJsonFile:", fileName, err); }
  },

  async loadAllDrafts() {
    const u = State.currentUser.empNo;
    await Promise.all([
      App._loadJsonFile(`NPPS_Drafts_${u}.json`,    "drafts",    "draftsFileId"),
      App._loadJsonFile(`NPPS_Submitted_${u}.json`,  "submitted", "submittedFileId"),
      App._loadJsonFile(`NPPS_Approved_${u}.json`,   "approved",  "approvedFileId"),
    ]);
  },

  saveDrafts()    { return App._saveJsonFile(`NPPS_Drafts_${State.currentUser.empNo}.json`,    "draftsFileId",    "drafts"); },
  saveSubmitted() { return App._saveJsonFile(`NPPS_Submitted_${State.currentUser.empNo}.json`, "submittedFileId", "submitted"); },
  saveApproved()  { return App._saveJsonFile(`NPPS_Approved_${State.currentUser.empNo}.json`,  "approvedFileId",  "approved"); },

  // HOD queue is shared — one file for all submissions
  async loadHODQueue() {
    await App._loadJsonFile("NPPS_HOD_Queue.json", "hodQueue", "hodQueueFileId");
  },
  saveHODQueue() { return App._saveJsonFile("NPPS_HOD_Queue.json", "hodQueueFileId", "hodQueue"); },

  /* ══════════════════════════════════════════════════════
     DASHBOARD — engineer view, per-user only
  ══════════════════════════════════════════════════════ */
  renderDashboard() {
    App.renderDrafts();
    App.renderSubmitted();
    App.renderApproved();
  },

  renderDrafts() {
    const list = document.getElementById("drafts-list");
    const dlList = document.getElementById("downloaded-list");
    const myDrafts = State.drafts
      .filter(d => d.empNo === State.currentUser.empNo)
      .sort((a,b) => new Date(b.updatedAt||b.createdAt) - new Date(a.updatedAt||a.createdAt));
    const wip = myDrafts.filter(d => !d.downloadedAt);
    const downloaded = myDrafts.filter(d => d.downloadedAt)
      .sort((a,b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));

    document.getElementById("draft-count").textContent = `${wip.length} / ${CONFIG.MAX_DRAFTS}`;

    // Helper: group cards by date
    const groupByDate = (items, dateFn) => {
      const groups = {};
      items.forEach(d => {
        const dt = dateFn(d);
        const key = formatDate(dt); // date only as group key
        if (!groups[key]) groups[key] = [];
        groups[key].push(d);
      });
      // Sort each group newest-first
      Object.values(groups).forEach(arr => arr.sort((a, b) => new Date(dateFn(b)) - new Date(dateFn(a))));
      return groups;
    };

    // WIP Drafts — grouped by last saved date, shown in red tint
    if (wip.length === 0) {
      list.innerHTML = `<div class="empty-state">No WIP drafts. Start a new report above.</div>`;
    } else {
      const groups = groupByDate(wip, d => d.updatedAt || d.createdAt);
      list.innerHTML = Object.entries(groups).map(([dateLabel, drafts]) => `
        <div class="draft-date-group">
          <div class="draft-date-label">Last saved: ${dateLabel}</div>
          ${drafts.map(d => `
          <div class="draft-card draft-card-wip" onclick="App.openDraft('${d.id}')">
            <div class="draft-card-left">
              <div class="draft-card-code">${d.projectCode}</div>
              <div class="draft-card-name">${d.projectData?.CustomerName||"—"} · ${d.projectData?.Vessel||"—"}</div>
              <div class="draft-card-meta">Started ${formatDate(d.createdAt)} &nbsp;·&nbsp; Last saved ${formatDate(d.updatedAt||d.createdAt, true)}</div>
            </div>
            <div class="draft-card-right">
              <span class="status-pill status-wip">WIP Draft</span>
              <button class="delete-draft" onclick="event.stopPropagation(); App.deleteDraft('${d.id}')" title="Delete">✕</button>
            </div>
          </div>`).join("")}
        </div>`).join("");
    }

    // PDF Downloads — grouped by download date, clean look
    if (dlList) {
      if (downloaded.length === 0) {
        dlList.innerHTML = `<div class="empty-state">No PDF downloads yet. Open any draft and click ⬇ Download PDF.</div>`;
      } else {
        const dlGroups = groupByDate(downloaded, d => d.downloadedAt);
        dlList.innerHTML = Object.entries(dlGroups).map(([dateLabel, drafts]) => `
          <div class="draft-date-group">
            <div class="draft-date-label">Downloaded: ${dateLabel}</div>
            ${drafts.map(d => `
            <div class="draft-card draft-card-dl" onclick="App.openDraft('${d.id}')">
              <div class="draft-card-left">
                <div class="draft-card-code">${d.projectCode}</div>
                <div class="draft-card-name">${d.projectData?.CustomerName||"—"} · ${d.projectData?.Vessel||"—"}</div>
                <div class="draft-card-meta">Downloaded ${formatDate(d.downloadedAt, true)}</div>
              </div>
              <div class="draft-card-right">
                <span class="status-pill status-dl">PDF Downloaded</span>
                <button class="delete-draft" onclick="event.stopPropagation(); App.deleteDraft('${d.id}')" title="Delete">✕</button>
              </div>
            </div>`).join("")}
          </div>`).join("");
      }
    }
  },

  renderSubmitted() {
    const list = document.getElementById("submitted-list");
    if (!list) return;
    const mine = State.submitted.filter(d => d.empNo === State.currentUser.empNo);
    if (mine.length === 0) { list.innerHTML = `<div class="empty-state">No drafts currently with HOD.</div>`; return; }
    list.innerHTML = mine.map(d => `
      <div class="draft-card ${d.hodComments?.length ? 'has-comments' : ''}" onclick="App.openSubmittedPreview('${d.id}')">
        <div class="draft-card-left">
          <div class="draft-card-code">${d.projectCode}</div>
          <div class="draft-card-name">${d.projectData?.CustomerName||"—"}</div>
          <div class="draft-card-meta">Submitted ${formatDate(d.submittedAt)}</div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill under-review">${d.hodComments?.length ? `💬 ${d.hodComments.length} Comments` : "Under Review"}</span>
        </div>
      </div>`).join("");
  },

  renderApproved() {
    const list = document.getElementById("approved-list");
    if (!list) return;
    const mine = State.approved.filter(d => d.empNo === State.currentUser.empNo);
    if (mine.length === 0) { list.innerHTML = `<div class="empty-state">No approved WCRs yet.</div>`; return; }
    list.innerHTML = mine.map(d => `
      <div class="draft-card approved-card">
        <div class="draft-card-left">
          <div class="draft-card-code">${d.projectCode}</div>
          <div class="draft-card-name">${d.projectData?.CustomerName||"—"} · ${d.projectData?.Vessel||"—"}</div>
          <div class="draft-card-meta">Approved ${formatDate(d.approvedAt)}</div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill approved">✓ HOD Approved</span>
          <button class="btn-download-pdf" onclick="event.stopPropagation(); App.downloadPDF('${d.id}')">⬇ PDF</button>
        </div>
      </div>`).join("");
  },

  openDraft(id) {
    const draft = State.drafts.find(d => d.id === id);
    if (!draft) return;
    State.currentDraft = draft;
    App.openWCRBuilder(draft);
  },

  deleteDraft(id) {
    if (!confirm("Delete this draft?")) return;
    State.drafts = State.drafts.filter(d => d.id !== id);
    App.saveDrafts();
    App.renderDrafts();
    Toast.show("Draft deleted.");
  },

  /* ══════════════════════════════════════════════════════
     SUBMIT TO HOD
  ══════════════════════════════════════════════════════ */
  async submitToHOD() {
    App.saveWCRSection();
    const draft = State.currentDraft;
    const submission = {
      ...draft,
      status: "under_review",
      submittedAt: new Date().toISOString(),
      hodComments: [],
    };

    // Add to engineer's submitted list
    const existingIdx = State.submitted.findIndex(d => d.id === draft.id);
    if (existingIdx >= 0) State.submitted[existingIdx] = submission;
    else State.submitted.unshift(submission);
    await App.saveSubmitted();

    // Add to shared HOD queue
    await App.loadHODQueue();
    const queueIdx = State.hodQueue.findIndex(d => d.id === draft.id);
    if (queueIdx >= 0) State.hodQueue[queueIdx] = submission;
    else State.hodQueue.unshift(submission);
    await App.saveHODQueue();

    // Remove from engineer's WIP drafts
    State.drafts = State.drafts.filter(d => d.id !== draft.id);
    await App.saveDrafts();

    Toast.show("Submitted to HOD for review!", "success");
    App.renderDashboard();
    Screen.show("dashboard");
  },

  /* ══════════════════════════════════════════════════════
     ENGINEER: VIEW SUBMITTED DRAFT WITH HOD COMMENTS
  ══════════════════════════════════════════════════════ */
  openSubmittedPreview(id) {
    const draft = State.submitted.find(d => d.id === id);
    if (!draft) return;
    State.currentDraft = draft;
    App.renderReviewPreview(draft, "engineer");
    Screen.show("review-preview");
  },

  /* ══════════════════════════════════════════════════════
     HOD DASHBOARD
  ══════════════════════════════════════════════════════ */
  renderHODDashboard() {
    const list = document.getElementById("hod-queue-list");
    if (!list) return;
    const queue = State.hodQueue.filter(d => d.status === "under_review");
    if (queue.length === 0) { list.innerHTML = `<div class="empty-state">No WCRs pending review.</div>`; return; }
    list.innerHTML = queue.map(d => `
      <div class="draft-card" onclick="App.openHODReview('${d.id}')">
        <div class="draft-card-left">
          <div class="draft-card-code">${d.projectCode}</div>
          <div class="draft-card-name">${d.projectData?.CustomerName||"—"} · ${d.authorName||"—"}</div>
          <div class="draft-card-meta">Submitted ${formatDate(d.submittedAt)}</div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill under-review">Review</span>
          ${d.hodComments?.length ? `<span class="comment-badge">${d.hodComments.length} comments</span>` : ""}
        </div>
      </div>`).join("");
  },

  openHODReview(id) {
    const draft = State.hodQueue.find(d => d.id === id);
    if (!draft) return;
    State.hodCurrentDraft = draft;
    State.currentDraft = draft;
    App.renderReviewPreview(draft, "hod");
    Screen.show("review-preview");
  },

  /* ══════════════════════════════════════════════════════
     REVIEW PREVIEW — shared view for engineer + HOD
     mode: "engineer" | "hod"
  ══════════════════════════════════════════════════════ */
  renderReviewPreview(draft, mode) {
    document.getElementById("rp-project-title").textContent = `${draft.projectCode} — ${draft.projectData?.CustomerName||""}`;

    const modeLabel = document.getElementById("rp-mode-label");
    if (mode === "hod") {
      modeLabel.textContent = "HOD Review Mode";
      modeLabel.style.color = "var(--amber)";
      modeLabel.style.borderColor = "var(--amber)";
    } else {
      modeLabel.textContent = draft.hodComments?.length ? `${draft.hodComments.length} Comment(s) from HOD` : "Submitted — Awaiting Review";
      modeLabel.style.color = "#6fcf6f";
      modeLabel.style.borderColor = "#6fcf6f";
    }

    // Show/hide HOD controls
    const hodControls = document.getElementById("hod-controls");
    const engControls = document.getElementById("engineer-controls");
    const engHintBox = document.getElementById("engineer-hint-box");

    if (mode === "hod") {
      hodControls.classList.remove("hidden");
      hodControls.style.display = "flex";
      engControls.classList.add("hidden");
      if (engHintBox) engHintBox.classList.add("hidden");
    } else {
      hodControls.classList.add("hidden");
      hodControls.style.display = "none";
      engControls.classList.remove("hidden");
      if (engHintBox && draft.hodComments?.length) engHintBox.classList.remove("hidden");
    }

    // Update comment hint text
    const hint = document.getElementById("rp-comment-hint");
    if (hint) hint.textContent = mode === "hod" ? "Click any section to add a comment" : "HOD feedback appears here";

    App.renderReviewContent(draft, mode);
    App.renderCommentsSidebar(draft, mode);
  },

  renderReviewContent(draft, mode) {
    const w = draft.wcr;
    const p = draft.projectData;
    const DGRAMS = Object.assign({}, (typeof DIAGRAMS !== "undefined") ? DIAGRAMS : {}, (typeof EXTRA_DIAGRAMS !== "undefined") ? EXTRA_DIAGRAMS : {});
    let html = "";

    const section = (id, label, content) => {
      const hasComment = (draft.hodComments||[]).some(c => c.sectionId === id);
      return `<div class="rp-section ${hasComment ? "has-comment" : ""}" data-section="${id}" data-label="${label}"
        ${mode === "hod" ? `onclick="App.openCommentBox('${id}','${label}')"` : ""}>
        <div class="rp-section-header">
          <h2 class="rp-section-title">${label}</h2>
          ${hasComment ? `<span class="rp-comment-dot" title="HOD commented">💬</span>` : ""}
          ${mode === "hod" ? `<span class="rp-add-comment-hint">+ Comment</span>` : ""}
        </div>
        ${content}
      </div>`;
    };

    // Cover
    let coverHtml = "";
    if (p.VesselImageBase64) coverHtml += `<img src="${p.VesselImageBase64}" class="rp-cover-img" />`;
    coverHtml += `<table class="rp-table">
      ${(()=>{ const L=App.ENGINE_TYPE_LABELS[p.EngineType||'niigata']||App.ENGINE_TYPE_LABELS.niigata; return `
      <tr><td class="rp-lc">Customer Name</td><td><strong>${p.CustomerName||"—"}</strong></td><td class="rp-lc">${L.contractNo}</td><td>${p.ContractNo||"—"}</td></tr>
      <tr><td class="rp-lc">Start Date of Job</td><td>${p.StartDate||"—"}</td><td class="rp-lc">${L.endDate}</td><td>${p.EndDate||"—"}</td></tr>
      <tr><td class="rp-lc">${L.overhaulType}</td><td>${p.OverhaulType||"—"}</td><td class="rp-lc">Engine Make and Model</td><td>${p.EngineModel||"—"}</td></tr>
      <tr><td class="rp-lc">Engine Serial Number</td><td>${p.EngineSerial||"—"}</td><td class="rp-lc">${L.arrangement}</td><td>${p.EngineArrangement||"—"}</td></tr>
      <tr><td class="rp-lc">RPM and Capacity</td><td>${p.RPMCapacity||"—"}</td><td class="rp-lc">Current Running Hours</td><td>${p.RunningHours||"—"}</td></tr>
      <tr><td class="rp-lc">Customer In-Charge</td><td>${p.CustomerIncharge||"—"}</td><td class="rp-lc">Neptunus Team Leader</td><td>${p.TeamLeader||"—"}</td></tr>
      <tr><td class="rp-lc" colspan="1">Neptunus Members</td><td colspan="3">${p.Members||"—"}</td></tr>
      `; })()}
    </table>`;
    html += section("cover", "Cover Details", coverHtml);

    // History
    if (w.historyActive && w.historyRows?.length) {
      let hHtml = '<table class="rp-table">';
      w.historyRows.forEach(r => {
        if (r.type === 'subtable') {
          hHtml += `<tr><td class="rp-lc" style="vertical-align:top">${r.label}</td><td>
            <table style="width:100%;border-collapse:collapse;font-size:8.5pt">
              <tr>${(r.headers||[]).map(h=>`<th style="border:1px solid var(--border);padding:3px 5px;background:var(--navy-light);font-size:8pt">${h}</th>`).join('')}</tr>
              <tr>${(r.subheaders||[]).map(h=>`<th style="border:1px solid var(--border);padding:3px 5px;background:rgba(255,255,255,0.03);font-size:7.5pt">${h}</th>`).join('')}</tr>
              ${(r.rows||[]).map(row=>`<tr>${row.map((c,ci)=>`<td style="border:1px solid var(--border);padding:3px 5px">${c||'—'}</td>`).join('')}</tr>`).join('')}
            </table>
          </td></tr>`;
        } else {
          const val = r.value && r.value.trim() ? r.value : 'NA';
          hHtml += `<tr><td class="rp-lc">${r.label||"—"}</td><td>${val}</td></tr>`;
        }
      });
      hHtml += '</table>';
      html += section("history", "History", hHtml);
    }

    // Scope of Work — mandays will come after
    const isCatEmdRp = (p.EngineType === 'cat' || p.EngineType === 'emd');
    if (w.scopeActive) {
      const engineType = p.EngineType || 'niigata';
      const isCatEmd = (engineType === 'cat' || engineType === 'emd');
      let sHtml = '';
      if (isCatEmd && w.catEmdScope?.length) {
        sHtml = `<table class="rp-table">
          <thead><tr><th style="width:6%">Sr.</th><th>Contents</th><th style="width:15%">Included</th></tr></thead><tbody>`;
        w.catEmdScope.forEach(r => {
          if (r.type === 'heading') {
            sHtml += `<tr><td colspan="3" style="background:var(--navy-light);font-weight:700;font-size:9pt">${r.text}</td></tr>`;
          } else {
            const inc = r.included && r.included.trim() ? r.included : 'NA';
            sHtml += `<tr><td>${r.sr}</td><td>${r.contents||'—'}</td><td style="text-align:center">${inc}</td></tr>`;
          }
        });
        sHtml += `</tbody></table>`;
      } else if (!isCatEmd && w.scopeOfWork?.length) {
        sHtml = `<table class="rp-table"><tr><th>Original Scope</th><th>What Was Done</th></tr>${w.scopeOfWork.map(r => `<tr><td>${r.original||'—'}</td><td>${r.done||'—'}</td></tr>`).join("")}</table>`;
      }
      if (sHtml) html += section("scope", "Scope of Work", sHtml);
    }

    // Deviations
    if (w.deviationsActive) {
      const dv = w.deviations || {};
      const rows = w.deviationRows || [{label:"Next Maintenance Type & Date", value:`${dv.nextMaintType||"—"} ${dv.nextMaintDate||""}`},{label:"Parts Renewal Required", value:dv.partsRenewal||"—"}];
      let dvHtml = `<table class="rp-table">${rows.map(r => `<tr><td class="rp-lc">${r.label||"—"}</td><td>${r.value||"—"}</td></tr>`).join("")}</table>`;
      html += section("deviations", "Deviations & Reference Notes", dvHtml);
    }

    // Mandays (CAT/EMD — after scope, before maint)
    if (isCatEmdRp && w.mandaysActive && w.mandaysRows?.length) {
      let mdHtml = '<table class="rp-table"><tr><th colspan="2" style="text-align:center;font-weight:700">Mandays</th></tr>';
      w.mandaysRows.forEach(r => {
        mdHtml += `<tr><td class="rp-lc">${r.label}</td><td>${r.value && r.value.trim() ? r.value : 'NA'}</td></tr>`;
      });
      mdHtml += '<tr><td colspan="2" style="font-size:8pt;font-style:italic;color:var(--white-dim)">Note: All days to be on calendar day basis</td></tr></table>';
      html += section("mandays", "Mandays", mdHtml);
    }
    // Maintenance Summary
    if (isCatEmdRp) {
      let cmHtml = '';
      if (w.catEmdMaintSummary?.length) {
        cmHtml = `<table class="rp-table"><thead><tr><th style="width:22%">Parts Description</th><th>Brief Description</th><th style="width:8%;text-align:center">Replaced</th><th style="width:8%;text-align:center">Reused</th></tr></thead><tbody>`;
        w.catEmdMaintSummary.forEach(row => {
          const sentence = row.verbs?.length > 0
            ? `${row.part} was ${row.verbs.slice(0,-1).join(', ')}${row.verbs.length > 1 ? ' and ' : ''}${row.verbs[row.verbs.length-1]}.`
            : 'NA';
          cmHtml += `<tr><td>${row.part}</td><td>${sentence}</td><td style="text-align:center">${row.replaced ? '✓' : ''}</td><td style="text-align:center">${row.reused ? '✓' : ''}</td></tr>`;
        });
        cmHtml += `</tbody></table>`;
        const bullets = w.catEmdRemarksBullets?.filter(b=>b.trim()) || [];
        const legacyRemarks = w.catEmdRemarks ? w.catEmdRemarks.trim() : '';
        if (bullets.length || legacyRemarks) {
          const remarkContent = bullets.length
            ? bullets.map(b=>`<div>• ${b}</div>`).join('')
            : `<div style="white-space:pre-line">${legacyRemarks}</div>`;
          cmHtml += `<div style="margin-top:10px;padding:8px;border:1px solid var(--border);border-radius:6px"><div style="font-weight:600;margin-bottom:4px;font-size:9pt">Additional Remarks / Non-Conformities:</div>${remarkContent}</div>`;
        }
      }
      html += section("maint", "Maintenance Summary", cmHtml);
    } else {
    let mHtml = (w.maintItems||[]).map(item =>
      item.type === "heading" ? `<h3 class="rp-maint-h">${item.text}</h3>` : `<div class="rp-bullet"><span>•</span><span>${item.text}</span></div>`
    ).join("");
    // DWR points removed from final WCR preview — insights only in builder
    html += section("maint", "Maintenance Summary", mHtml);
    } // end else (Niigata maint)

    // Deviations (after maint summary)
    if (w.deviationsActive) {
      const dv = w.deviations || {};
      const rows = w.deviationRows || [{label:"Next Maintenance Type & Date", value:`${dv.nextMaintType||"—"} ${dv.nextMaintDate||""}`},{label:"Parts Renewal Required", value:dv.partsRenewal||"—"}];
      let dvHtml = `<table class="rp-table">${rows.map(r => `<tr><td class="rp-lc">${r.label||"—"}</td><td>${r.value||"—"}</td></tr>`).join("")}</table>`;
      html += section("deviations", "Deviations & Reference Notes", dvHtml);
    }
    // Scope for Improvement
    let sfiHtml = `<table class="rp-table"><tr><th style="width:4%">No.</th><th>Area</th><th>Observations</th><th>Recommendations</th></tr>
      ${(w.scopeForImprovement||[]).map((r,i) => `<tr><td>${i+1}</td><td>${r.area||"—"}</td><td>${r.observations||"—"}</td><td>${r.recommendations||"—"}</td></tr>`).join("")}</table>`;
    html += section("sfi", "Scope for Improvement", sfiHtml);

    // Recommendations
    let recHtml = `<p style="margin-bottom:8px;font-size:9.5pt">The engine post overhaul must be closely monitored for any abnormalities which could cause serious breakdowns. It is a known fact that most breakdowns on overhauled engines occur within the first 100 hours post overhaul. We therefore, recommend the following:</p>
      <ol class="rp-ol">${(w.recommendations||[]).map(r => `<li>${r}</li>`).join("")}</ol>`;
    html += section("recs", "Recommendations", recHtml);

    // Calibration Tables
    if (w.calibrationTables?.length) {
      let calHtml = w.calibrationTables.map(t => {
        const imgSrc = t.imageBase64 || DGRAMS[t.templateKey] || null;
        return `<div style="margin-bottom:16px">
          <h3 style="font-size:10pt;font-weight:bold;margin-bottom:6px">${t.name}</h3>
          ${imgSrc && t.hasImage ? `<div style="display:flex;gap:12px;margin-bottom:8px;align-items:flex-start"><img src="${imgSrc}" style="width:130px;flex-shrink:0" /><p style="font-size:8pt;line-height:1.6">${(t.note||"").replace(/\n/g,"<br/>")}</p></div>` : t.note ? `<p style="font-size:8.5pt;margin-bottom:6px">${(t.note||"").replace(/\n/g,"<br/>")}</p>` : ""}
          <table class="rp-table"><thead><tr>${t.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${(t.rows||[]).map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
        </div>`;
      }).join("");
      html += section("cal", "Calibration Tables", calHtml);
    }

    // Parts
    if (w.partsColumns?.rows?.length) {
      let partsHtml = `<table class="rp-table"><thead><tr>${w.partsColumns.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${w.partsColumns.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      html += section("parts", "Parts Consumed List", partsHtml);
    }

    // Photo Gallery
    const realPhotos = (w.photos||[]).filter(ph => ph.src);
    if (realPhotos.length) {
      let photoHtml = `<div class="rp-photo-grid">`;
      for (let i = 0; i < realPhotos.length; i += 2) {
        const ph1 = realPhotos[i], ph2 = realPhotos[i+1]||null;
        photoHtml += `<div class="rp-photo-pair">
          <div class="rp-photo-item"><img src="${ph1.src}" class="rp-photo-img"/><div class="rp-photo-cap">${(ph1.title||"").toUpperCase()}</div>${ph1.description?`<div class="rp-photo-desc">${ph1.description}</div>`:""}</div>
          ${ph2 ? `<div class="rp-photo-item"><img src="${ph2.src}" class="rp-photo-img"/><div class="rp-photo-cap">${(ph2.title||"").toUpperCase()}</div>${ph2.description?`<div class="rp-photo-desc">${ph2.description}</div>`:""}</div>` : `<div class="rp-photo-item"></div>`}
        </div>`;
      }
      photoHtml += `</div>`;
      html += section("photos", "Photo Gallery", photoHtml);
    }

    // Sign-off
    const so = w.signoff||{};
    let signHtml = `<table class="rp-table">
      <tr><th colspan="2" style="text-align:center">On behalf of Neptunus</th><th colspan="2" style="text-align:center">On behalf of Customer</th></tr>
      <tr><td class="rp-lc">Maker</td><td>${so.makerName||"—"}</td><td class="rp-lc">Name</td><td>${so.customerName||"—"}</td></tr>
      <tr><td class="rp-lc">Checker</td><td>${so.checkerName||"—"}</td><td class="rp-lc">Date</td><td>${so.customerDate||"—"}</td></tr>
      <tr><td class="rp-lc">Approver</td><td>${so.approverName||"—"}</td><td></td><td></td></tr>
      <tr><td class="rp-lc">Date</td><td>${so.makerDate||"—"}</td><td></td><td></td></tr>
    </table>`;
    html += section("signoff", "Sign-off", signHtml);

    document.getElementById("rp-content").innerHTML = html;
  },

  /* ══════════════════════════════════════════════════════
     COMMENTS SIDEBAR
  ══════════════════════════════════════════════════════ */
  renderCommentsSidebar(draft, mode) {
    const sidebar = document.getElementById("rp-comments-sidebar");
    const comments = draft.hodComments || [];
    if (comments.length === 0 && mode === "engineer") {
      sidebar.innerHTML = `<div class="comment-empty">No comments from HOD yet.</div>`;
      return;
    }
    let html = comments.length === 0 ? `<div class="comment-empty">No comments yet. Click a section to add a comment.</div>` : "";
    html += comments.map((c, i) => `
      <div class="comment-card" id="cc-${i}" onclick="App.highlightSection('${c.sectionId}')">
        <div class="comment-section-label">${c.sectionLabel}</div>
        <div class="comment-text">${c.text}</div>
        <div class="comment-meta">${formatDate(c.createdAt)}</div>
        ${mode === "hod" ? `<button class="comment-delete" onclick="event.stopPropagation();App.deleteComment(${i})">✕</button>` : ""}
      </div>`).join("");
    sidebar.innerHTML = html;
  },

  highlightSection(sectionId) {
    document.querySelectorAll(".rp-section").forEach(s => s.classList.remove("highlight"));
    const el = document.querySelector(`.rp-section[data-section="${sectionId}"]`);
    if (el) { el.classList.add("highlight"); el.scrollIntoView({ behavior:"smooth", block:"center" }); }
  },

  openCommentBox(sectionId, sectionLabel) {
    if (!State.currentUser?.isHOD) return;
    State.hodCommentTarget = { sectionId, sectionLabel };
    document.getElementById("comment-input-header").textContent = `Comment on: ${sectionLabel}`;
    document.getElementById("comment-textarea").value = "";
    document.getElementById("comment-input-box").classList.remove("hidden");
    document.getElementById("comment-textarea").focus();
  },

  closeCommentBox() {
    document.getElementById("comment-input-box").classList.add("hidden");
    State.hodCommentTarget = null;
  },

  saveComment() {
    const text = document.getElementById("comment-textarea").value.trim();
    if (!text) { Toast.show("Please enter a comment.", "error"); return; }
    const { sectionId, sectionLabel } = State.hodCommentTarget;
    const comment = { sectionId, sectionLabel, text, createdAt: new Date().toISOString() };
    if (!State.currentDraft.hodComments) State.currentDraft.hodComments = [];
    State.currentDraft.hodComments.push(comment);
    App.closeCommentBox();
    App.renderCommentsSidebar(State.currentDraft, "hod");
    App.renderReviewContent(State.currentDraft, "hod");
    Toast.show("Comment added.", "success");
  },

  deleteComment(i) {
    State.currentDraft.hodComments.splice(i, 1);
    App.renderCommentsSidebar(State.currentDraft, "hod");
    App.renderReviewContent(State.currentDraft, "hod");
  },

  /* ══════════════════════════════════════════════════════
     HOD ACTIONS: SEND BACK / APPROVE
  ══════════════════════════════════════════════════════ */
  async hodSendBack() {
    if (!State.currentDraft.hodComments?.length) {
      Toast.show("Please add at least one comment before sending back.", "error"); return;
    }
    const draft = { ...State.currentDraft, status: "needs_revision", sentBackAt: new Date().toISOString() };

    // Update HOD queue
    const qi = State.hodQueue.findIndex(d => d.id === draft.id);
    if (qi >= 0) State.hodQueue[qi] = draft;
    await App.saveHODQueue();

    // Update engineer's submitted file
    await App._loadJsonFile(`NPPS_Submitted_${draft.empNo}.json`, "_tempSubmitted", "_tempSubmittedFileId");
    const si = (State._tempSubmitted||[]).findIndex(d => d.id === draft.id);
    if (si >= 0) State._tempSubmitted[si] = draft;
    await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State._tempSubmittedFileId}?uploadType=media`, {
      method: "PATCH", body: new Blob([JSON.stringify(State._tempSubmitted, null, 2)], { type: "application/json" })
    });

    Toast.show("Sent back to engineer with comments.", "success");
    State.hodQueue = State.hodQueue.filter(d => !(d.id === draft.id));
    State.hodQueue.unshift(draft);
    App.renderHODDashboard();
    Screen.show("hod-dashboard");
  },

  async hodApprove() {
    const draft = { ...State.currentDraft, status: "approved", approvedAt: new Date().toISOString() };

    // Remove from HOD queue
    State.hodQueue = State.hodQueue.filter(d => d.id !== draft.id);
    await App.saveHODQueue();

    // Add to engineer's approved file
    await App._loadJsonFile(`NPPS_Approved_${draft.empNo}.json`, "_tempApproved", "_tempApprovedFileId");
    if (!State._tempApproved) State._tempApproved = [];
    State._tempApproved.unshift(draft);
    if (State._tempApprovedFileId) {
      await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State._tempApprovedFileId}?uploadType=media`, {
        method: "PATCH", body: new Blob([JSON.stringify(State._tempApproved, null, 2)], { type: "application/json" })
      });
    } else {
      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify({ name:`NPPS_Approved_${draft.empNo}.json`, parents:[CONFIG.DRIVE_FOLDER_ID], mimeType:"application/json" })], { type:"application/json" }));
      form.append("file", new Blob([JSON.stringify(State._tempApproved, null, 2)], { type:"application/json" }));
      await gapi_fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method:"POST", body:form });
    }

    // Remove from engineer's submitted
    await App._loadJsonFile(`NPPS_Submitted_${draft.empNo}.json`, "_tempSubmitted2", "_tempSubmitted2FileId");
    State._tempSubmitted2 = (State._tempSubmitted2||[]).filter(d => d.id !== draft.id);
    if (State._tempSubmitted2FileId) {
      await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State._tempSubmitted2FileId}?uploadType=media`, {
        method:"PATCH", body: new Blob([JSON.stringify(State._tempSubmitted2, null, 2)], { type:"application/json" })
      });
    }

    Toast.show(`WCR Approved! It will appear in ${draft.authorName}'s HOD Approved folder.`, "success");
    App.renderHODDashboard();
    Screen.show("hod-dashboard");
  },

  backFromReview() {
    if (State.currentUser?.isHOD) { App.renderHODDashboard(); Screen.show("hod-dashboard"); }
    else { App.renderDashboard(); Screen.show("dashboard"); }
  },

  /* ══════════════════════════════════════════════════════
     BASE DATA SHEET
  ══════════════════════════════════════════════════════ */
  async ensureBaseSheet() {
    try {
      const resp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files?q=name='${CONFIG.BASE_DATA_SHEET_NAME}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name)`);
      const data = await resp.json();
      if (data.files && data.files.length > 0) {
        State.baseSheetId = data.files[0].id;
        // Check if headers are complete — add missing columns if old sheet format
        await App.ensureSheetHeaders();
        return;
      }
      const cr = await gapi_fetch("https://www.googleapis.com/drive/v3/files", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name:CONFIG.BASE_DATA_SHEET_NAME, mimeType:"application/vnd.google-apps.spreadsheet", parents:[CONFIG.DRIVE_FOLDER_ID] }) });
      State.baseSheetId = (await cr.json()).id;
      const headers = ["ProjectCode","CustomerName","ContractNo","StartDate","EndDate","OverhaulType","EngineModel","EngineSerial","EngineArrangement","RPMCapacity","RunningHours","CustomerIncharge","TeamLeader","Members","Vessel","Location","CreatedDate","VesselImageBase64","EngineType"];
      await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A1:R1?valueInputOption=RAW`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({values:[headers]}) });
    } catch (err) { console.error("ensureBaseSheet:", err); Toast.show("Could not access Drive.", "error"); }
  },

  /* ══════════════════════════════════════════════════════
     TEAM MEMBERS UI
  ══════════════════════════════════════════════════════ */
  renderMemberFields() {
    const container = document.getElementById("members-container");
    container.innerHTML = "";
    const members = State._tempMembers || ["","",""];
    members.forEach((m, i) => {
      const row = document.createElement("div");
      row.className = "member-row";
      row.innerHTML = `
        <input class="form-input member-input" value="${m}" placeholder="Member name ${i+1}" oninput="App.updateMember(${i}, this.value)" />
        ${members.length > 1 ? `<button class="member-del" onclick="App.removeMember(${i})">✕</button>` : ""}
      `;
      container.appendChild(row);
    });
  },

  updateMember(i, val) { if (!State._tempMembers) State._tempMembers = ["","",""]; State._tempMembers[i] = val; },
  addMember() { if (!State._tempMembers) State._tempMembers = ["",""]; State._tempMembers.push(""); App.renderMemberFields(); },
  removeMember(i) { State._tempMembers.splice(i,1); App.renderMemberFields(); },

  /* ══════════════════════════════════════════════════════
     VESSEL IMAGE
  ══════════════════════════════════════════════════════ */
  onVesselImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      // Show preview immediately
      document.getElementById("bd-image-preview").src = base64;
      document.getElementById("bd-image-preview").classList.remove("hidden");
      document.getElementById("bd-image-placeholder").classList.add("hidden");
      document.getElementById("bd-image-clear").classList.remove("hidden");
      // Upload to Drive and store file ID (avoids 50k char sheet limit)
      try {
        const blob = await fetch(base64).then(r => r.blob());
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify({
          name: "vessel_" + Date.now() + "." + file.name.split('.').pop(),
          parents: [CONFIG.DRIVE_FOLDER_ID],
          mimeType: file.type,
        })], { type: "application/json" }));
        form.append("file", blob);
        const resp = await gapi_fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          { method: "POST", body: form }
        );
        const data = await resp.json();
        if (data.id) {
          State.vesselImageBase64 = data.id; // store Drive file ID
          State._vesselImagePreview = base64;  // keep base64 for local preview only
          Toast.show("Vessel image uploaded.", "success");
        } else {
          throw new Error("No file ID returned");
        }
      } catch(e) {
        // Fallback: store base64 directly (will fail for large images but better than nothing)
        State.vesselImageBase64 = base64;
        State._vesselImagePreview = base64;
        console.warn("Drive upload failed, using base64 fallback:", e);
      }
    };
    reader.readAsDataURL(file);
  },

  clearVesselImage() {
    State.vesselImageBase64 = null;
    State._vesselImagePreview = null;
    document.getElementById("bd-image-input").value = "";
    document.getElementById("bd-image-preview").src = "";
    document.getElementById("bd-image-preview").classList.add("hidden");
    document.getElementById("bd-image-placeholder").classList.remove("hidden");
    document.getElementById("bd-image-clear").classList.add("hidden");
  },

  /* ══════════════════════════════════════════════════════
     SAVE BASE DATA
  ══════════════════════════════════════════════════════ */
  async saveBaseData() {
    const getValue = id => document.getElementById(id)?.value?.trim() || "";
    const projectCode = getValue("bd-project-code").toUpperCase();

    if (!projectCode) {
      document.getElementById("bd-error").textContent = "Project Code is required.";
      document.getElementById("bd-error").classList.remove("hidden");
      return;
    }

    // Check for duplicate
    const existing = await App.findProjectRow(projectCode);
    if (existing.rowIndex !== -1) {
      document.getElementById("bd-error").textContent = `Project code "${projectCode}" already exists. Please edit that record instead using the Edit button below.`;
      document.getElementById("bd-error").classList.remove("hidden");
      document.getElementById("bd-success").classList.add("hidden");
      // Scroll to table
      setTimeout(() => document.getElementById("projects-table-wrap").scrollIntoView({ behavior:"smooth" }), 300);
      return;
    }

    document.getElementById("bd-success").classList.add("hidden");
    document.getElementById("bd-error").classList.add("hidden");

    // Check for empty fields and warn
    const optionalFields = { "bd-customer":"Customer Name","bd-contract-no":"Contract / Project Number","bd-start-date":"Start Date of Job","bd-end-date":"Handover Date","bd-overhaul-type":"Type of Overhaul / Job","bd-engine-model":"Engine Make and Model","bd-engine-serial":"Engine Serial Number","bd-engine-arrangement":"Engine Arrangement","bd-rpm":"RPM and Capacity","bd-running-hours":"Current Running Hours","bd-customer-incharge":"Customer In-Charge","bd-team-leader":"Neptunus Team Leader","bd-vessel":"Vessel / Rig","bd-location":"Location" };
    const emptyFields = Object.entries(optionalFields).filter(([id]) => !getValue(id)).map(([,label]) => label);
    const members = (State._tempMembers || []).filter(m => m.trim());

    if (emptyFields.length > 0) {
      const ok = confirm(`The following fields are empty:\n\n• ${emptyFields.join("\n• ")}\n\nPlease make sure you update them later. Save anyway?`);
      if (!ok) return;
    }

    const membersStr = members.join(", ");
    const overhaulType = getValue("bd-overhaul-type") || getValue("bd-overhaul-custom");

    const engineType = State._engineType || 'niigata';
    const otherEngineName = getValue("bd-other-engine-name");
    const engineModel = engineType === 'other' && otherEngineName
      ? otherEngineName
      : getValue("bd-engine-model");
    const row = [
      projectCode, getValue("bd-customer"), getValue("bd-contract-no"), getValue("bd-start-date"),
      getValue("bd-end-date"), overhaulType, engineModel, getValue("bd-engine-serial"),
      getValue("bd-engine-arrangement"), getValue("bd-rpm"), getValue("bd-running-hours"),
      getValue("bd-customer-incharge"), getValue("bd-team-leader"), membersStr,
      getValue("bd-vessel"), getValue("bd-location"), new Date().toISOString(),
      "", engineType,
    ];

    try {
      const appendResp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({values:[row]}) });
      if (!appendResp.ok) {
        const errText = await appendResp.text();
        console.error("Sheets append error:", appendResp.status, errText);
        throw new Error("Sheets " + appendResp.status + ": " + errText.substring(0,200));
      }
      document.getElementById("bd-success").classList.remove("hidden");
      Toast.show("Project data saved.", "success");
      App.clearBaseDataForm();
      await App.loadProjectsTable();
    } catch (err) {
      document.getElementById("bd-error").textContent = "Save failed. Check your Drive connection.";
      document.getElementById("bd-error").classList.remove("hidden");
    }
  },

  async updateBaseData(rowIndex) {
    const getValue = id => document.getElementById(id)?.value?.trim() || "";
    const projectCode = getValue("bd-project-code").toUpperCase();
    if (!projectCode) { Toast.show("Project Code is required.", "error"); return; }

    const members = (State._tempMembers || []).filter(m => m.trim()).join(", ");
    const overhaulType = getValue("bd-overhaul-type") === "Other" ? getValue("bd-overhaul-custom") : getValue("bd-overhaul-type");

    const engineType = State._engineType || 'niigata';
    const otherEngineName = getValue("bd-other-engine-name");
    const engineModel = engineType === 'other' && otherEngineName
      ? otherEngineName
      : getValue("bd-engine-model");
    const row = [projectCode, getValue("bd-customer"), getValue("bd-contract-no"), getValue("bd-start-date"), getValue("bd-end-date"), overhaulType, engineModel, getValue("bd-engine-serial"), getValue("bd-engine-arrangement"), getValue("bd-rpm"), getValue("bd-running-hours"), getValue("bd-customer-incharge"), getValue("bd-team-leader"), members, getValue("bd-vessel"), getValue("bd-location"), new Date().toISOString(), "", engineType];

    const rangeRow = rowIndex + 2;
    try {
      await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rangeRow}:R${rangeRow}?valueInputOption=RAW`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({values:[row]}) });
      Toast.show("Project updated.", "success");
      App.clearBaseDataForm();
      App.cancelEdit();
      await App.loadProjectsTable();
    } catch (err) { Toast.show("Update failed.", "error"); }
  },

  cancelEdit() {
    document.getElementById("save-base-btn").onclick = () => App.saveBaseData();
    document.getElementById("save-base-btn").textContent = "Save to Database →";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
    App.clearBaseDataForm();
  },

  async findProjectRow(code) {
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A:A`);
      const data = await resp.json();
      const codes = (data.values || []).flat();
      const rowIndex = codes.findIndex((c, i) => i > 0 && c.toUpperCase() === code.toUpperCase());
      return { rowIndex };
    } catch { return { rowIndex: -1 }; }
  },

  clearBaseDataForm() {
    ["bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date","bd-overhaul-type","bd-overhaul-custom","bd-engine-model","bd-other-engine-name","bd-engine-serial","bd-engine-arrangement","bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader","bd-vessel","bd-location"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    // Reset engine type to Niigata
    State._engineType = 'niigata';
    App.onEngineTypeChange();
    document.getElementById('bd-other-engine-row')?.classList.add('hidden');
    document.getElementById("bd-overhaul-custom-row").classList.add("hidden");
    State._tempMembers = ["","",""];
    App.renderMemberFields();
    App.clearVesselImage();
    document.getElementById("bd-success").classList.add("hidden");
    document.getElementById("bd-error").classList.add("hidden");
  },

  onEngineTypeChange() {
    const type = document.getElementById('bd-engine-type')?.value || 'niigata';
    State._engineType = type;
    document.getElementById('bd-other-engine-row')?.classList.toggle('hidden', type !== 'other');

    // For CAT/EMD: "Project Code" field duplicates the first Project Code field
    // So hide it and auto-populate from the main project code
    const isCatEmd = (type === 'cat' || type === 'emd');
    const contractRow = document.getElementById('bd-contract-no-row');
    if (contractRow) contractRow.classList.toggle('hidden', isCatEmd);
    if (isCatEmd) {
      // Auto-copy project code into contract-no so it saves correctly
      const projCode = document.getElementById('bd-project-code')?.value || '';
      const contractNo = document.getElementById('bd-contract-no');
      if (contractNo) contractNo.value = projCode;
    }

    const labels = App.ENGINE_TYPE_LABELS[type] || App.ENGINE_TYPE_LABELS.niigata;
    const setLbl = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    setLbl('lbl-contract-no',   labels.contractNo);
    setLbl('lbl-end-date',      labels.endDate);
    setLbl('lbl-overhaul-type', labels.overhaulType);
    setLbl('lbl-arrangement',   labels.arrangement);
  },

  onOverhaulTypeChange() {
    const val = document.getElementById("bd-overhaul-type").value;
    document.getElementById("bd-overhaul-custom-row").classList.toggle("hidden", val !== "Other");
  },

  async loadProjectsTable() {
    const wrap = document.getElementById("projects-table-wrap");
    wrap.innerHTML = `<div class="empty-state">Loading projects...</div>`;
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1`);
      const data = await resp.json();
      const rows = data.values || [];
      if (rows.length < 2) { wrap.innerHTML = `<div class="empty-state">No projects in database yet.</div>`; document.getElementById("project-count").textContent = "0"; return; }
      const headers = rows[0];
      const createdIdx = headers.indexOf("CreatedDate");
      const cutoff = Date.now() - CONFIG.BASE_DATA_EXPIRY_DAYS * 86400000;
      const allDataRows = rows.slice(1);
      const expiredRows = [];
      const validRows = [];
      allDataRows.forEach((r, i) => {
        const createdAt = createdIdx >= 0 ? r[createdIdx] : null;
        if (createdAt && new Date(createdAt).getTime() < cutoff) { expiredRows.push(i + 2); }
        else validRows.push({ r, originalIndex: i + 1 });
      });
      if (expiredRows.length > 0) {
        const reqs = expiredRows.reverse().map(ri => ({ deleteDimension: { range: { sheetId:0, dimension:"ROWS", startIndex:ri-1, endIndex:ri } } }));
        await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}:batchUpdate`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({requests:reqs}) });
        Toast.show(`${expiredRows.length} expired project(s) removed.`);
      }
      if (validRows.length === 0) { wrap.innerHTML = `<div class="empty-state">No projects in database yet.</div>`; document.getElementById("project-count").textContent = "0"; return; }
      document.getElementById("project-count").textContent = validRows.length;
      // Sort newest first by CreatedDate
      validRows.sort((a, b) => {
        const da = createdIdx >= 0 ? new Date(a.r[createdIdx]||0) : 0;
        const db = createdIdx >= 0 ? new Date(b.r[createdIdx]||0) : 0;
        return db - da;
      });
      wrap.innerHTML = `<table class="data-table"><thead><tr><th>Code</th><th>Customer</th><th>Engine</th><th>Type</th><th>Leader</th><th>Location</th><th>Start</th><th>Added</th><th></th></tr></thead><tbody>${validRows.map(({r, originalIndex}) => {
        const createdAt = createdIdx >= 0 ? r[createdIdx] : "";
        const addedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
        // Use header-based lookup so old and new sheet formats both work
        const hi = (name) => { const idx = headers.indexOf(name); return idx >= 0 ? r[idx] || "—" : "—"; };
        return `<tr><td><strong>${hi("ProjectCode")}</strong></td><td>${hi("CustomerName")}</td><td>${hi("EngineModel")}</td><td>${hi("OverhaulType")}</td><td>${hi("TeamLeader")}</td><td>${hi("Location")}</td><td>${hi("StartDate")}</td><td class="expiry-pill">${addedDate}</td><td><button class="edit-btn" onclick="App.editProject(${originalIndex})">Edit</button></td></tr>`;
      }).join("")}</tbody></table>`;
      setTimeout(() => wrap.scrollIntoView({ behavior:"smooth", block:"nearest" }), 200);
    } catch (err) { wrap.innerHTML = `<div class="empty-state">Could not load projects.</div>`; }
  },

  async editProject(rowIndex) {
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rowIndex+1}:T${rowIndex+1}`);
      const data = await resp.json();
      const row = (data.values || [[]])[0];
      // Fetch headers to do name-based mapping (handles old and new sheet formats)
      const hResp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A1:T1`);
      const hData = await hResp.json();
      const hdrs = (hData.values||[[]])[0];
      const getCol = (name) => { const i = hdrs.indexOf(name); return i >= 0 ? row[i] || "" : ""; };
      const fieldMap = {
        "bd-project-code": "ProjectCode", "bd-customer": "CustomerName",
        "bd-contract-no": "ContractNo", "bd-start-date": "StartDate",
        "bd-end-date": "EndDate", "bd-overhaul-type": "OverhaulType",
        "bd-engine-model": "EngineModel", "bd-engine-serial": "EngineSerial",
        "bd-engine-arrangement": "EngineArrangement", "bd-rpm": "RPMCapacity",
        "bd-running-hours": "RunningHours", "bd-customer-incharge": "CustomerIncharge",
        "bd-team-leader": "TeamLeader", "bd-vessel": "Vessel", "bd-location": "Location"
      };
      Object.entries(fieldMap).forEach(([id, col]) => { const el = document.getElementById(id); if (el) el.value = getCol(col); });
      // Restore engine type using header lookup
      const savedEngineType = getCol("EngineType") || 'niigata';
      State._engineType = savedEngineType;

      App.onEngineTypeChange();
      if (savedEngineType === 'other') {
        document.getElementById('bd-other-engine-name').value = row[6] || '';
        document.getElementById('bd-engine-model').value = '';
      }
      // Handle members
      const membersStr = getCol("Members") || "";
      State._tempMembers = membersStr ? membersStr.split(",").map(m => m.trim()) : ["","",""];
      App.renderMemberFields();
      // Handle overhaul type
      const ovType = row[5] || "";
      const knownTypes = ["TOH","MOH","Minor","HealthCheck"];
      if (knownTypes.includes(ovType)) { document.getElementById("bd-overhaul-type").value = ovType; }
      else { document.getElementById("bd-overhaul-type").value = "Other"; document.getElementById("bd-overhaul-custom").value = ovType; document.getElementById("bd-overhaul-custom-row").classList.remove("hidden"); }
      // Handle image
      const vesselImg = getCol("VesselImageBase64");
      if (vesselImg) {
        State.vesselImageBase64 = vesselImg;
        // If it's a Drive file ID (not base64), fetch the image for preview
        const previewSrc = vesselImg.startsWith("data:") ? vesselImg
          : `https://www.googleapis.com/drive/v3/files/${vesselImg}?alt=media`;
        State._vesselImagePreview = previewSrc;
        document.getElementById("bd-image-preview").src = previewSrc; document.getElementById("bd-image-preview").classList.remove("hidden"); document.getElementById("bd-image-placeholder").classList.add("hidden"); document.getElementById("bd-image-clear").classList.remove("hidden"); }
      // Switch button to Update
      document.getElementById("save-base-btn").textContent = "Update Project →";
      document.getElementById("save-base-btn").onclick = () => App.updateBaseData(rowIndex);
      document.getElementById("cancel-edit-btn").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
      Toast.show("Project loaded for editing.");
    } catch (err) { Toast.show("Could not load project.", "error"); }
  },

  /* ══════════════════════════════════════════════════════
     DASHBOARD + PROJECT LOOKUP
  ══════════════════════════════════════════════════════ */
  async lookupProject() {
    const code = document.getElementById("project-code-input").value.trim().toUpperCase();
    if (!code) { Toast.show("Enter a project code.", "error"); return; }
    document.getElementById("project-details").classList.add("hidden");
    document.getElementById("project-not-found").classList.add("hidden");
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1`);
      const data = await resp.json();
      const rows = data.values || [];
      if (rows.length < 2) { document.getElementById("project-not-found").classList.remove("hidden"); return; }
      const headers = rows[0];
      const match = rows.slice(1).find(r => r[0] && r[0].toUpperCase() === code);
      if (!match) { document.getElementById("project-not-found").classList.remove("hidden"); return; }
      const project = {};
      headers.forEach((h, i) => { project[h] = match[i] || ""; });
      // Ensure EngineType has a default for old rows
      if (!project.EngineType) project.EngineType = 'niigata';
      // Resolve vessel image: if it's a Drive file ID, fetch as base64 for embedding in WCR/PDF
      if (project.VesselImageBase64 && !project.VesselImageBase64.startsWith("data:")) {
        try {
          const fileId = project.VesselImageBase64;
          const imgResp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
          const blob = await imgResp.blob();
          const base64 = await new Promise((res) => {
            const r = new FileReader();
            r.onload = e => res(e.target.result);
            r.readAsDataURL(blob);
          });
          project.VesselImageBase64 = base64;
        } catch(e) {
          console.warn("Could not load vessel image from Drive:", e);
          project.VesselImageBase64 = "";
        }
      }
      State.currentProject = project;
      State.dvrParsedData = null;
      const et = project.EngineType || 'niigata';
      const L = App.ENGINE_TYPE_LABELS[et] || App.ENGINE_TYPE_LABELS.niigata;
      const labels = { CustomerName:"Customer Name", ContractNo:L.contractNo, StartDate:"Start Date of Job", EndDate:L.endDate, OverhaulType:L.overhaulType, EngineModel:"Engine Make and Model", EngineSerial:"Engine Serial Number", Vessel:"Vessel / Rig", Location:"Location", TeamLeader:"Neptunus Team Leader" };
      document.getElementById("project-info-grid").innerHTML = Object.entries(labels).map(([key,label]) => `<div class="project-info-item"><label>${label}</label><span>${project[key] || '<em class="not-updated">Not Updated in Base Data Yet</em>'}</span></div>`).join("");
      document.getElementById("project-details").classList.remove("hidden");
    } catch (err) { Toast.show("Could not read project data.", "error"); }
  },

  /* ══════════════════════════════════════════════════════
     DWR UPLOAD + PARSING
  ══════════════════════════════════════════════════════ */
  onDWRFilesSelected(input) {
    const files = Array.from(input.files);
    const btn = document.getElementById("load-dwr-btn");
    const namesEl = document.getElementById("dwr-file-names");
    if (files.length === 0) {
      btn.disabled = true; btn.style.opacity = "0.4"; btn.style.cursor = "not-allowed";
      if (namesEl) namesEl.textContent = "";
      return;
    }
    btn.disabled = false; btn.style.opacity = "1"; btn.style.cursor = "pointer";
    btn.title = "";
    if (namesEl) namesEl.textContent = `${files.length} file(s) selected: ${files.map(f=>f.name).join(', ')}`;
  },

  async loadDWRData() {
    const input = document.getElementById("dwr-file-input");
    const files = Array.from(input.files);
    if (files.length === 0) { Toast.show("Please select PDF files first.", "error"); return; }

    const btn = document.getElementById("load-dwr-btn");
    const statusEl = document.getElementById("dwr-status");
    btn.disabled = true; btn.style.opacity = "0.6";

    try {
      // Step 1: Read files with progress
      const pdfBase64Array = [];
      for (let i = 0; i < files.length; i++) {
        const pct = Math.round(((i) / files.length) * 50);
        btn.textContent = `⏳ Reading files… ${pct}%`;
        statusEl.textContent = `Reading file ${i+1} of ${files.length}: ${files[i].name}`;
        statusEl.className = "dwr-status";
        const b64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(files[i]);
        });
        pdfBase64Array.push(b64);
      }
      // Step 2: Parse with AI
      btn.textContent = "⏳ Parsing with AI… 60%";
      statusEl.textContent = `Sending ${files.length} file(s) to AI for analysis…`;
      const resp = await fetch(`${CONFIG.WORKER_URL}/parse-dwr`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64Array })
      });
      btn.textContent = "⏳ Processing… 90%";
      const parsed = await resp.json();
      State.dvrParsedData = parsed;
      State.dvrInsights = parsed.maintPoints || [];
      const mPts = parsed.maintPoints?.length || 0;
      const recs = parsed.recommendations?.length || 0;
      const photos = parsed.photoDescriptions?.length || 0;
      statusEl.innerHTML = `<strong>✓ Necessary insights from ${files.length} DWR file(s) have been captured.</strong><br/>
        <span style="font-size:10px;color:var(--amber-dim)">Click 💡 DWR Insights in the Maintenance Summary section to view while filling in the WCR.</span>`;
      statusEl.className = "dwr-status success";
      Toast.show(`✓ DWR data loaded. Click 💡 DWR Insights in Maintenance Summary.`, "success");
    } catch (err) {
      statusEl.textContent = "Failed to parse DWRs. Check your connection and try again.";
      statusEl.className = "dwr-status error";
    } finally {
      btn.textContent = "✓ DWRs Parsed";
      btn.disabled = true;
      btn.style.opacity = "1";
      btn.style.background = "var(--green)";
    }
  },

  showDWRInsights() {
    const insights = State.dvrInsights
      || (State.currentDraft?.wcr?.dwrPoints||[]).map(p=>p.text)
      || [];
    const modal = document.getElementById("dwr-insights-modal");
    const body = document.getElementById("dwr-insights-body");
    if (!modal || !body) return;
    if (!insights.length) {
      body.innerHTML = `<div class="empty-state" style="color:var(--white-dim);padding:20px 0">No DWR insights available. Upload and parse DWR PDFs before starting the WCR to see insights here.</div>`;
    } else {
      body.innerHTML = insights.map(pt => `<div class="dwr-insight-item"><span class="dwr-insight-dot">▸</span><span>${pt}</span></div>`).join('');
    }
    modal.classList.remove("hidden");
  },

  closeDWRInsights() {
    const modal = document.getElementById("dwr-insights-modal");
    if (modal) modal.classList.add("hidden");
  },

    /* ══════════════════════════════════════════════════════
     START WCR
  ══════════════════════════════════════════════════════ */
  startWCR() {
    if (!State.currentProject) return;
    const myDrafts = State.drafts.filter(d => d.empNo === State.currentUser.empNo);
    if (myDrafts.length >= CONFIG.MAX_DRAFTS) { Toast.show(`You have ${CONFIG.MAX_DRAFTS} drafts. Delete one to continue.`, "error"); return; }

    // Build maintenance summary from template + DWR extras
    const maintItems = MAINT_TEMPLATE.map(item => ({ ...item, id: "mi_" + Math.random().toString(36).substr(2,8) }));
    // DWR points stored separately — shown below template as "Points from DWR"
    const dwrPoints = (State.dvrParsedData?.maintPoints || []).map(pt => ({
      id: "dwr_" + Math.random().toString(36).substr(2,8),
      text: pt,
      keep: true
    }));

    const recs = [...DEFAULT_RECOMMENDATIONS];
    if (State.dvrParsedData?.recommendations?.length) {
      State.dvrParsedData.recommendations.forEach(r => { if (!recs.some(existing => existing.toLowerCase().includes(r.toLowerCase().substring(0,30)))) recs.push(r); });
    }

    const photos = [];
    if (State.dvrParsedData?.photoDescriptions?.length) {
      State.dvrParsedData.photoDescriptions.forEach(desc => photos.push({ src:"", caption:"", title: desc, description:"", fromDWR: true }));
    }

    const draft = {
      id: "draft_" + Date.now(),
      empNo: State.currentUser.empNo,
      authorName: State.currentUser.name,
      projectCode: State.currentProject.ProjectCode,
      projectData: { ...State.currentProject },
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wcr: {
        historyActive: false,
        history: { lastOverhaulType:"", lastOverhaulBy:"", runningHoursAtMaint:"", observations:"", logLeakages:"", bearingConRod:"", bearingMainJournal:"", turboDetails:"", geislingerDetails:"", governorDetails:"", gaugeConditions:"" },
        scopeActive: false,
        scopeOfWork: [{ original:"", done:"" }],
        catEmdScope: [],
        mandaysActive: false,
        mandaysRows: [],
        catEmdMaintSummary: [],
        catEmdRemarks: "",
        deviationsActive: false,
        deviations: { nextMaintType:"", nextMaintDate:"", partsRenewal:"" },
        maintItems,
        dwrPoints,
        scopeForImprovement: [{ area:"Engine Operation and Maintenance", observations:"", recommendations:"" },{ area:"Maintenance Tools (lifting arrangements, jacking tools, special tools)", observations:"", recommendations:"" },{ area:"Emergency Spare Parts Stock on Board", observations:"", recommendations:"" }],
        recommendations: recs,
        calibrationTables: [],
        partsColumns: { headers:["Sr No.","Item No.","Part No.","Description","Qty / Equipment"], rawPaste:["","","","",""], rows:null },
        photos,
        signoff: { makerName:"", checkerName:"", approverName:"", makerDate:"", customerName:"", customerDate:"" },
      }
    };

    State.drafts.unshift(draft);
    App.saveDrafts();
    App.renderDrafts();
    State.currentDraft = draft;
    App.openWCRBuilder(draft);
  },


  onCoverImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      State.currentDraft.projectData.VesselImageBase64 = e.target.result;
      const img = document.getElementById("wcr-cover-image");
      img.src = e.target.result;
      img.classList.remove("hidden");
      document.getElementById("cover-image-clear").classList.remove("hidden");
      State.currentDraft.updatedAt = new Date().toISOString();
      AutoSave.trigger(); // auto-save when photo uploaded
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  },

  saveCoverSection() {
    if (State.currentDraft.projectData.VesselImageBase64) {
      State.currentDraft.updatedAt = new Date().toISOString();
      App.saveDrafts();
      Toast.show("Cover photo saved.", "success");
    } else {
      Toast.show("No cover photo to save yet.", "error");
    }
  },

  clearCoverImage() {
    State.currentDraft.projectData.VesselImageBase64 = "";
    const img = document.getElementById("wcr-cover-image");
    img.src = ""; img.classList.add("hidden");
    document.getElementById("cover-image-clear").classList.add("hidden");
    document.getElementById("cover-image-input").value = "";
  },

  /* ══════════════════════════════════════════════════════
     WCR BUILDER
  ══════════════════════════════════════════════════════ */
  openWCRBuilder(draft) {
    Screen.show("wcr-builder");
    document.getElementById("wcr-project-code").textContent = draft.projectCode;
    document.getElementById("wcr-customer").textContent = draft.projectData?.CustomerName || "—";
    App.renderWCRBuilder();
  },

  renderWCRBuilder() {
    const d = State.currentDraft;
    const w = d.wcr;
    const p = d.projectData;

    // Cover — update values
    const coverFields = { "wcr-cover-customer":"CustomerName","wcr-cover-contract":"ContractNo","wcr-cover-start":"StartDate","wcr-cover-end":"EndDate","wcr-cover-overhaul":"OverhaulType","wcr-cover-engine":"EngineModel","wcr-cover-serial":"EngineSerial","wcr-cover-arrangement":"EngineArrangement","wcr-cover-rpm":"RPMCapacity","wcr-cover-hours":"RunningHours","wcr-cover-custincharge":"CustomerIncharge","wcr-cover-leader":"TeamLeader","wcr-cover-members":"Members" };
    Object.entries(coverFields).forEach(([elId, key]) => { const el = document.getElementById(elId); if (el) el.textContent = p[key] || "Not Updated in Base Data Yet"; });
    // Update cover labels based on engine type
    const engineType = p.EngineType || 'niigata';
    const lbls = App.ENGINE_TYPE_LABELS[engineType] || App.ENGINE_TYPE_LABELS.niigata;
    const setLbl = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    setLbl('wcr-lbl-contract',    lbls.contractNo);
    setLbl('wcr-lbl-enddate',     lbls.endDate);
    setLbl('wcr-lbl-overhaul',    lbls.overhaulType);
    setLbl('wcr-lbl-arrangement', lbls.arrangement);
    const img = document.getElementById("wcr-cover-image");
    if (p.VesselImageBase64) { img.src = p.VesselImageBase64; img.classList.remove("hidden"); } else { img.classList.add("hidden"); }

    // History toggle
    App.renderHistorySection();
    // Scope of Work toggle
    App.renderScopeSection();
    // Mandays toggle (CAT/EMD only — appears after scope)
    App.renderMandaysSection();
    // Deviations toggle
    App.renderDeviationsSection();
    // Maintenance Summary
    App.renderMaintSummary();
    // Scope for Improvement
    App.renderScopeForImprovement();
    // Recommendations
    App.renderRecommendations();
    // Calibration Tables
    App.renderCalibrationTables();
    // Parts
    App.renderPartsSection();
    // Photos
    App.renderPhotos();
    // DWR Upload + Points (shown inside WCR builder)
    App.renderDWRUploadSection();
    App.renderDWRPoints();
    // Signoff
    const so = w.signoff;
    ["maker","checker","approver","makerdate","custname","custdate"].forEach(k => { const el = document.getElementById(`so-${k}`); if (el) el.value = so[k === "maker" ? "makerName" : k === "checker" ? "checkerName" : k === "approver" ? "approverName" : k === "makerdate" ? "makerDate" : k === "custname" ? "customerName" : "customerDate"] || ""; });
    const soFooter = document.getElementById("signoff-save-footer");
    if (soFooter) soFooter.innerHTML = `<button class="btn-save-history" onclick="App.saveSignoffSection()" style="margin-top:10px">💾 Save Sign-off</button>`;
  },

  saveWCRSection() {
    const d = State.currentDraft;
    const w = d.wcr;
    // historyRows are saved live via oninput, no extra save needed here
    if (w.deviationsActive) {
      w.deviations = { nextMaintType: document.getElementById("dev-nextType")?.value||"", nextMaintDate: document.getElementById("dev-nextDate")?.value||"", partsRenewal: document.getElementById("dev-parts")?.value||"" };
    }
    w.signoff = { makerName: document.getElementById("so-maker")?.value||"", checkerName: document.getElementById("so-checker")?.value||"", approverName: document.getElementById("so-approver")?.value||"", makerDate: document.getElementById("so-makerdate")?.value||"", customerName: document.getElementById("so-custname")?.value||"", customerDate: document.getElementById("so-custdate")?.value||"" };
    d.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Draft saved.", "success");
  },

  backToDashboard() { App.saveWCRSection(); App.renderDashboard(); Screen.show("dashboard"); },

  // ── History ──
  toggleHistory() {
    State.currentDraft.wcr.historyActive = !State.currentDraft.wcr.historyActive;
    App.renderHistorySection();
  },

  renderHistorySection() {
    const active = State.currentDraft.wcr.historyActive;
    document.getElementById("history-toggle-btn").textContent = active ? "— Remove History Section" : "+ Add History Section";
    const body = document.getElementById("history-body");
    body.classList.toggle("hidden", !active);
    if (active) {
      const w = State.currentDraft.wcr;
      const engineType = State.currentDraft.projectData?.EngineType || State._engineType || 'niigata';
      // Initialise historyRows from template if not already set or if engine type changed
      if (!w.historyRows || w.historyRows.length === 0 || w._historyEngineType !== engineType) {
        const tmpl = App.HISTORY_TEMPLATES[engineType] || App.HISTORY_TEMPLATES.niigata;
        w.historyRows = tmpl.map(r => ({...r,
          rows: r.rows ? r.rows.map(row => [...row]) : undefined,
          headers: r.headers ? [...r.headers] : undefined,
          subheaders: r.subheaders ? [...r.subheaders] : undefined,
        }));
        w._historyEngineType = engineType;
      }
      App.renderHistoryRows();
    }
  },

  renderHistoryRows() {
    const rows = State.currentDraft.wcr.historyRows || [];
    const body = document.getElementById("history-body");

    let html = '<div class="history-table">';
    rows.forEach((r, i) => {
      if (r.type === 'subtable') {
        html += `<div class="history-row history-row-subtable">
          <div class="history-label">${r.label}</div>
          <div class="history-value-cell">
            <table class="history-subtable">
              <thead>
                <tr>${(r.headers||[]).map(h => `<th>${h}</th>`).join('')}</tr>
                <tr>${(r.subheaders||[]).map(h => `<th class="history-subheader">${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${(r.rows||[]).map((row, ri) => `<tr>${row.map((cell, ci) =>
                  ci === 0
                    ? `<td class="history-subtable-rowlabel">${cell}</td>`
                    : `<td><input class="history-subtable-input" value="${cell}" oninput="App.updateHistorySubCell(${i},${ri},${ci},this.value)"/></td>`
                ).join('')}</tr>`).join('')}
              </tbody>
            </table>
            <button class="add-row-btn" style="margin-top:4px;font-size:10px" onclick="App.addHistorySubRow(${i})">+ Add Row</button>
          </div>
          <button class="row-del-btn history-del" onclick="App.deleteHistoryRow(${i})">✕</button>
        </div>`;
      } else {
        // simple or custom row
        const isCustom = r.type === 'custom';
        html += `<div class="history-row">
          ${isCustom
            ? `<input class="history-label history-label-editable form-input" value="${r.label}" placeholder="Field name..." oninput="App.updateHistoryRowLabel(${i},this.value)"/>`
            : `<div class="history-label">${r.label}</div>`
          }
          <textarea class="history-value form-input" placeholder="Enter value (leave blank for NA)" oninput="App.updateHistoryRowValue(${i},this.value)">${r.value||''}</textarea>
          <button class="row-del-btn history-del" onclick="App.deleteHistoryRow(${i})">✕</button>
        </div>`;
      }
    });
    html += '</div>';
    html += `<div class="history-footer">
      <button class="add-row-btn" onclick="App.addHistoryRow()">+ Add Custom Row</button>
      <button class="btn-save-history" onclick="App.saveHistorySection()">💾 Save History</button>
    </div>`;

    body.innerHTML = html;
  },

  updateHistoryRowValue(i, val) { State.currentDraft.wcr.historyRows[i].value = val; AutoSave.trigger(); },
  updateHistoryRowLabel(i, val) { State.currentDraft.wcr.historyRows[i].label = val; AutoSave.trigger(); },
  updateHistorySubCell(i, ri, ci, val) { State.currentDraft.wcr.historyRows[i].rows[ri][ci] = val; AutoSave.trigger(); },
  addHistorySubRow(i) {
    const r = State.currentDraft.wcr.historyRows[i];
    const cols = (r.headers || r.subheaders || []).length;
    r.rows.push(new Array(cols).fill(''));
    r.rows[r.rows.length-1][0] = 'Reading';
    App.renderHistoryRows();
  },
  addHistoryRow() {
    if (!State.currentDraft.wcr.historyRows) State.currentDraft.wcr.historyRows = [];
    const prev = State.currentDraft.wcr.historyRows.map(r=>({...r}));
    Undo.push(() => { State.currentDraft.wcr.historyRows = prev; App.renderHistoryRows(); }, "Add history row");
    State.currentDraft.wcr.historyRows.push({type:'custom', label:'New Field', value:''});
    App.renderHistoryRows();
  },
  deleteHistoryRow(i) {
    const prev = State.currentDraft.wcr.historyRows.map(r=>({...r}));
    const label = State.currentDraft.wcr.historyRows[i]?.label || 'history row';
    Undo.push(() => { State.currentDraft.wcr.historyRows = prev; App.renderHistoryRows(); }, `Delete "${label.substring(0,30)}"`);
    State.currentDraft.wcr.historyRows.splice(i,1);
    App.renderHistoryRows();
  },
  saveHistorySection() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("History section saved.", "success");
  },

  // Legacy compat
  updateHistoryRow(i, field, val) {
    if (field === 'label') App.updateHistoryRowLabel(i, val);
    else App.updateHistoryRowValue(i, val);
  },


  // ── Mandays (CAT/EMD only, optional) ─────────────────
  toggleMandays() {
    State.currentDraft.wcr.mandaysActive = !State.currentDraft.wcr.mandaysActive;
    App.renderMandaysSection();
  },

  renderMandaysSection() {
    const w = State.currentDraft.wcr;
    const engineType = State.currentDraft.projectData?.EngineType || 'niigata';
    const isCatEmd = (engineType === 'cat' || engineType === 'emd');
    const toggleBtn = document.getElementById("mandays-toggle-btn");
    const body = document.getElementById("mandays-body");
    if (!toggleBtn || !body) return;
    if (!isCatEmd) { toggleBtn.closest('.wcr-section').classList.add('hidden'); return; }
    toggleBtn.closest('.wcr-section').classList.remove('hidden');
    toggleBtn.textContent = w.mandaysActive ? "— Remove Mandays Section" : "+ Add Mandays Section";
    body.classList.toggle("hidden", !w.mandaysActive);
    if (!w.mandaysActive) return;
    if (!w.mandaysRows || w.mandaysRows.length === 0) {
      w.mandaysRows = App.MANDAYS_TEMPLATE.map(r => ({...r}));
    }
    App.renderMandaysRows();
  },

  renderMandaysRows() {
    const rows = State.currentDraft.wcr.mandaysRows;
    const body = document.getElementById("mandays-body");
    body.innerHTML = `
      <div class="history-table">
        <div class="history-row" style="background:var(--navy-light)">
          <div class="history-label" style="font-weight:700;color:var(--amber);text-align:center;justify-content:center">Mandays</div>
          <div style="padding:8px;font-size:10px;color:var(--amber-dim);font-style:italic;display:flex;align-items:center">Note: All days to be on calendar day basis</div>
          <div style="width:36px"></div>
        </div>
        ${rows.map((r, i) => `
        <div class="history-row">
          <div class="history-label">${r.label}</div>
          <textarea class="history-value form-input" placeholder="Enter value (leave blank for NA)" oninput="App.updateMandaysRow(${i},this.value)">${r.value||''}</textarea>
          <button class="row-del-btn history-del" onclick="App.deleteMandaysRow(${i})">✕</button>
        </div>`).join('')}
      </div>
      <div class="history-footer">
        <button class="add-row-btn" onclick="App.addMandaysRow()">+ Add Row</button>
        <button class="btn-save-history" onclick="App.saveMandaysSection()">💾 Save Mandays</button>
      </div>`;
  },

  updateMandaysRow(i, val) { State.currentDraft.wcr.mandaysRows[i].value = val; AutoSave.trigger(); },
  deleteMandaysRow(i) {
    const prev = State.currentDraft.wcr.mandaysRows.map(r=>({...r}));
    const label = State.currentDraft.wcr.mandaysRows[i]?.label || 'mandays row';
    Undo.push(() => { State.currentDraft.wcr.mandaysRows = prev; App.renderMandaysRows(); }, `Delete "${label.substring(0,30)}"`);
    State.currentDraft.wcr.mandaysRows.splice(i,1);
    App.renderMandaysRows();
  },
  addMandaysRow() {
    const prev = State.currentDraft.wcr.mandaysRows.map(r=>({...r}));
    Undo.push(() => { State.currentDraft.wcr.mandaysRows = prev; App.renderMandaysRows(); }, "Add mandays row");
    State.currentDraft.wcr.mandaysRows.push({ label:'New Field', value:'' });
    App.renderMandaysRows();
  },
  saveMandaysSection() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Mandays saved.", "success");
  },

  // ── CAT/EMD Maintenance Summary ───────────────────────
  initCatEmdMaint() {
    const w = State.currentDraft.wcr;
    if (!w.catEmdMaintSummary || w.catEmdMaintSummary.length === 0) {
      w.catEmdMaintSummary = App.CAT_EMD_MAINT_PARTS.map(part => ({
        part, verbs: [], customVerb: '', replaced: false, reused: false, isCustom: false
      }));
    }
    // Ensure existing rows have new fields
    w.catEmdMaintSummary.forEach(row => {
      if (row.customVerb === undefined) row.customVerb = '';
      if (row.isCustom === undefined) row.isCustom = false;
    });
    if (!w.catEmdRemarksBullets) w.catEmdRemarksBullets = [];
  },

  renderCatEmdMaintSummary() {
    App.initCatEmdMaint();
    const w = State.currentDraft.wcr;
    const container = document.getElementById("maint-items");
    const VERBS = App.VERB_CHIPS;

    const renderRow = (row, i) => {
      const allVerbs = row.verbs || [];
      const sentence = allVerbs.length > 0
        ? `${row.part} was ${allVerbs.slice(0,-1).join(', ')}${allVerbs.length > 1 ? ' and ' : ''}${allVerbs[allVerbs.length-1]}.`
        : '';
      const partCell = row.isCustom
        ? `<input class="form-input" style="font-size:11px;padding:4px 6px" value="${row.part}" oninput="App.updateCatMaintPart(${i},this.value)" placeholder="Part description..." />`
        : `<span class="maint-part-label">${row.part}</span>`;
      return `<tr class="cat-maint-row">
        <td class="cat-maint-part">${partCell}</td>
        <td class="cat-maint-brief">
          <div class="verb-chips">
            ${VERBS.map(v => `<button class="verb-chip ${allVerbs.includes(v) ? 'active' : ''}" onclick="App.toggleVerb(${i},'${v}')">${v}</button>`).join('')}
          </div>
          <div class="custom-verb-row">
            <input class="maint-custom-verb-input" placeholder="Add your own verb and press Enter..." value="${row.customVerb||''}"
              oninput="App.updateCustomVerb(${i},this.value)"
              onkeydown="if(event.key==='Enter'){App.addCustomVerb(${i});event.preventDefault();}" />
            <button class="maint-add-verb-btn" onclick="App.addCustomVerb(${i})">+ Add</button>
          </div>
          <div class="verb-sentence-bright">${sentence || '<span class="verb-placeholder">Select verbs above — sentence will appear here</span>'}</div>
        </td>
        <td class="maint-check-cell">
          <label class="maint-radio-label ${row.replaced ? 'checked-replaced' : ''}" onclick="App.setMaintStatus(${i},'replaced',${!row.replaced})">Replaced</label>
        </td>
        <td class="maint-check-cell">
          <label class="maint-radio-label ${row.reused ? 'checked-reused' : ''}" onclick="App.setMaintStatus(${i},'reused',${!row.reused})">Reused</label>
        </td>
        <td class="maint-del-cell">
          <button class="maint-del-btn" onclick="App.deleteCatMaintRow(${i})">✕</button>
        </td>
      </tr>`;
    };

    let html = `<div class="cat-maint-wrap maint-bright">
      <div class="maint-bright-header">
        <span class="maint-bright-title">MAINTENANCE SUMMARY</span>
        <span class="maint-bright-sub">Select verbs to auto-build descriptions · Tick Replaced or Reused for each part</span>
      </div>
      <table class="cat-maint-table maint-bright-table">
        <thead>
          <tr>
            <th style="width:20%">Parts Description</th>
            <th>Brief Description <span style="font-weight:400;font-size:9px;color:#5580cc">(Choose all that you did)</span></th>
            <th style="width:8%;text-align:center">Replaced</th>
            <th style="width:8%;text-align:center">Reused</th>
            <th style="width:36px"></th>
          </tr>
        </thead>
        <tbody>
          ${w.catEmdMaintSummary.map((row, i) => renderRow(row, i)).join('')}
        </tbody>
      </table>
      <div style="margin-top:10px">
        <button class="maint-add-row-btn" onclick="App.addCatMaintRow()">+ Add Row</button>
      </div>
      <div class="cat-maint-remarks maint-bright-remarks">
        <div class="maint-remarks-title-bar">
          <span class="maint-remarks-icon">📝</span>
          <span>Additional Remarks on any other Non-Conformities / observations</span>
        </div>
        <div id="cat-remarks-list"></div>
        <button class="maint-add-row-btn" style="margin:8px 0 0 0" onclick="App.addRemarkBullet()">+ Add Bullet Point</button>
        <div style="margin-top:12px">
          <button class="maint-save-btn" onclick="App.saveCatMaint()">💾 Save Summary</button>
        </div>
      </div>
    </div>`;

    container.innerHTML = html;
    App.renderRemarkBullets();

    const addBar = document.querySelector('.maint-add-bar');
    if (addBar) addBar.style.display = 'none';
  },

  updateCatMaintPart(i, val) {
    State.currentDraft.wcr.catEmdMaintSummary[i].part = val; AutoSave.trigger();
  },

  toggleVerb(i, verb) {
    const row = State.currentDraft.wcr.catEmdMaintSummary[i];
    const idx = row.verbs.indexOf(verb);
    if (idx >= 0) row.verbs.splice(idx, 1);
    else row.verbs.push(verb);
    App.renderCatEmdMaintSummary();
  },

  updateCustomVerb(i, val) {
    State.currentDraft.wcr.catEmdMaintSummary[i].customVerb = val; AutoSave.trigger();
  },

  addCustomVerb(i) {
    const row = State.currentDraft.wcr.catEmdMaintSummary[i];
    const verb = (row.customVerb || '').trim();
    if (!verb) return;
    if (!row.verbs.includes(verb)) row.verbs.push(verb);
    row.customVerb = '';
    App.renderCatEmdMaintSummary();
  },

  addCatMaintRow() {
    const prev = State.currentDraft.wcr.catEmdMaintSummary.map(r=>({...r, verbs:[...r.verbs]}));
    Undo.push(() => { State.currentDraft.wcr.catEmdMaintSummary = prev; App.renderCatEmdMaintSummary(); }, "Add maintenance row");
    State.currentDraft.wcr.catEmdMaintSummary.push({
      part: 'New Part', verbs: [], customVerb: '', replaced: false, reused: false, isCustom: true
    });
    App.renderCatEmdMaintSummary();
  },

  deleteCatMaintRow(i) {
    const row = State.currentDraft.wcr.catEmdMaintSummary[i];
    const prev = State.currentDraft.wcr.catEmdMaintSummary.map(r=>({...r, verbs:[...r.verbs]}));
    Undo.push(() => { State.currentDraft.wcr.catEmdMaintSummary = prev; App.renderCatEmdMaintSummary(); }, `Delete "${row.part.substring(0,30)}"`);
    State.currentDraft.wcr.catEmdMaintSummary.splice(i, 1);
    App.renderCatEmdMaintSummary();
  },

  setMaintStatus(i, field, val) {
    const row = State.currentDraft.wcr.catEmdMaintSummary[i];
    if (field === 'replaced' && val) row.reused = false;
    if (field === 'reused' && val) row.replaced = false;
    row[field] = val;
    App.renderCatEmdMaintSummary();
  },

  // Remarks as individual bullet inputs
  addRemarkBullet() {
    if (!State.currentDraft.wcr.catEmdRemarksBullets) State.currentDraft.wcr.catEmdRemarksBullets = [];
    const prev = [...State.currentDraft.wcr.catEmdRemarksBullets];
    Undo.push(() => { State.currentDraft.wcr.catEmdRemarksBullets = prev; App.renderRemarkBullets(); }, "Add remark bullet");
    State.currentDraft.wcr.catEmdRemarksBullets.push('');
    App.renderRemarkBullets();
    setTimeout(() => {
      const inputs = document.querySelectorAll('.remark-bullet-input');
      if (inputs.length) inputs[inputs.length-1].focus();
    }, 50);
  },

  renderRemarkBullets() {
    const list = document.getElementById('cat-remarks-list');
    if (!list) return;
    const bullets = State.currentDraft.wcr.catEmdRemarksBullets || [];
    if (bullets.length === 0) {
      list.innerHTML = `<div style="font-size:10px;color:#9ab0d8;font-style:italic;padding:4px 0">No remarks yet — click "+ Add Bullet Point" to add one.</div>`;
      return;
    }
    list.innerHTML = bullets.map((b, i) => `
      <div class="remark-bullet-row">
        <span class="remark-bullet-dot">•</span>
        <input class="form-input remark-bullet-input" value="${b}" placeholder="Enter remark..."
          oninput="App.updateRemarkBullet(${i},this.value)"
          onkeydown="if(event.key==='Enter'){App.addRemarkBullet();event.preventDefault();}" />
        <button class="row-del-btn" onclick="App.deleteRemarkBullet(${i})">✕</button>
      </div>`).join('');
  },

  updateRemarkBullet(i, val) {
    if (!State.currentDraft.wcr.catEmdRemarksBullets) State.currentDraft.wcr.catEmdRemarksBullets = [];
    State.currentDraft.wcr.catEmdRemarksBullets[i] = val; AutoSave.trigger();
  },

  deleteRemarkBullet(i) {
    const prev = [...State.currentDraft.wcr.catEmdRemarksBullets];
    Undo.push(() => { State.currentDraft.wcr.catEmdRemarksBullets = prev; App.renderRemarkBullets(); }, "Delete remark bullet");
    State.currentDraft.wcr.catEmdRemarksBullets.splice(i, 1);
    App.renderRemarkBullets();
  },

  // Legacy compat
  addRemark() { App.addRemarkBullet(); },
  renderRemarks() { App.renderRemarkBullets(); },
  updateRemarks(val) { State.currentDraft.wcr.catEmdRemarks = val; },

  saveCatMaint() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Maintenance Summary saved.", "success");
  },

  // ── Scope of Work ──
  toggleScope() { State.currentDraft.wcr.scopeActive = !State.currentDraft.wcr.scopeActive; App.renderScopeSection(); },

  renderScopeSection() {
    const active = State.currentDraft.wcr.scopeActive;
    document.getElementById("scope-toggle-btn").textContent = active ? "— Remove Scope of Work" : "+ Add Scope of Work";
    document.getElementById("scope-body").classList.toggle("hidden", !active);
    if (!active) return;
    const engineType = State.currentDraft.projectData?.EngineType || 'niigata';
    const isCatEmd = (engineType === 'cat' || engineType === 'emd');
    if (isCatEmd) {
      // Init CAT/EMD scope from template if not yet done
      if (!State.currentDraft.wcr.catEmdScope || State.currentDraft.wcr.catEmdScope.length === 0) {
        State.currentDraft.wcr.catEmdScope = App.CAT_EMD_SCOPE_TEMPLATE.map(r => ({...r}));
      }
      App.renderCatEmdScope();
    } else {
      App.renderScopeOfWork();
    }
  },

  // ── Niigata/Other scope ──────────────────────────────
  renderScopeOfWork() {
    const rows = State.currentDraft.wcr.scopeOfWork;
    document.getElementById("scope-rows").innerHTML = `
      <div class="scope-niigata-wrap">
        <div class="scope-header-row">
          <span class="scope-col-label">Describe what the original scope of work was</span>
          <span class="scope-col-label">Describe what was done (include additions and omissions, with reasons)</span>
          <span></span>
        </div>
        ${rows.map((r, i) => `
        <div class="scope-row">
          <textarea class="form-input scope-cell" placeholder="Add original scope point..." oninput="App.updateScopeRow(${i},'original',this.value)">${r.original}</textarea>
          <textarea class="form-input scope-cell" placeholder="Describe what was done..." oninput="App.updateScopeRow(${i},'done',this.value)">${r.done}</textarea>
          <button class="row-del-btn" onclick="App.deleteScopeRow(${i})">✕</button>
        </div>`).join("")}
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
        <button class="btn-save-history" onclick="App.saveScopeSection()">💾 Save Scope</button>
      </div>`;
  },

  // ── CAT/EMD scope ────────────────────────────────────
  renderCatEmdScope() {
    const rows = State.currentDraft.wcr.catEmdScope || [];

    // Recalculate sr numbers per section
    let sectionItemCount = 0;
    rows.forEach((r, i) => {
      if (r.type === 'heading') { sectionItemCount = 0; }
      else { sectionItemCount++; r.sr = String(sectionItemCount); }
    });

    let html = `<div class="cat-scope-wrap">
      <table class="cat-scope-table">
        <thead><tr>
          <th style="width:6%">Sr. No.</th>
          <th>Contents</th>
          <th style="width:18%">Included</th>
          <th style="width:80px"></th>
        </tr></thead>
        <tbody>`;

    rows.forEach((r, i) => {
      if (r.type === 'heading') {
        html += `<tr class="cat-scope-heading-row">
          <td colspan="2"><input class="cat-scope-heading-input" value="${r.text}" oninput="App.updateCatScopeHeading(${i},this.value)" /></td>
          <td></td>
          <td style="white-space:nowrap;text-align:right;padding:2px 4px">
            <button class="scope-action-btn" onclick="App.addCatScopeItem(${i})" title="Add item under this section">+ Item</button>
            <button class="row-del-btn" onclick="App.deleteCatScopeRow(${i})">✕</button>
          </td>
        </tr>`;
      } else {
        const inc = r.included || '';
        html += `<tr class="cat-scope-item-row">
          <td class="cat-scope-sr">${r.sr}</td>
          <td><textarea class="cat-scope-contents" oninput="App.updateCatScopeField(${i},'contents',this.value)">${r.contents}</textarea></td>
          <td>
            <div class="scope-yesno-btns">
              <button class="scope-yn-btn ${inc==='Yes'?'yn-yes':''}" onclick="App.setCatScopeIncluded(${i},'Yes')">Yes</button>
              <button class="scope-yn-btn ${inc==='No'?'yn-no':''}" onclick="App.setCatScopeIncluded(${i},'No')">No</button>
              <button class="scope-yn-btn ${inc==='NA'||inc===''?'yn-na':''}" onclick="App.setCatScopeIncluded(${i},'NA')">NA</button>
            </div>
          </td>
          <td style="text-align:right;padding:2px 4px;white-space:nowrap">
            <button class="scope-action-btn" onclick="App.addCatScopeItem(${i})" title="Add item below">+ Item</button>
            <button class="row-del-btn" onclick="App.deleteCatScopeRow(${i})">✕</button>
          </td>
        </tr>`;
      }
    });

    html += `</tbody></table></div>
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center">
      <button class="add-row-btn" onclick="App.addCatScopeHeading()">+ Add Section</button>
      <button class="btn-save-history" onclick="App.saveScopeSection()">💾 Save Scope</button>
    </div>`;
    document.getElementById("scope-rows").innerHTML = html;
  },

  setCatScopeIncluded(i, val) {
    State.currentDraft.wcr.catEmdScope[i].included = val;
    App.renderCatEmdScope();
  },

  updateCatScopeHeading(i, v) { State.currentDraft.wcr.catEmdScope[i].text = v; AutoSave.trigger(); },
  updateCatScopeField(i, f, v) { State.currentDraft.wcr.catEmdScope[i][f] = v; AutoSave.trigger(); },
  addCatScopeHeading() {
    const prev = State.currentDraft.wcr.catEmdScope.map(r=>({...r}));
    Undo.push(() => { State.currentDraft.wcr.catEmdScope = prev; App.renderCatEmdScope(); }, "Add scope section");
    State.currentDraft.wcr.catEmdScope.push({ type:'heading', text:'New Section' });
    App.renderCatEmdScope();
  },
  addCatScopeItem(afterIndex) {
    const scope = State.currentDraft.wcr.catEmdScope;
    const prev = scope.map(r=>({...r}));
    Undo.push(() => { State.currentDraft.wcr.catEmdScope = prev; App.renderCatEmdScope(); }, "Add scope item");
    const items = scope.filter(r => r.type === 'item');
    const newItem = { type:'item', sr: String(items.length + 1), contents:'', included:'' };
    if (afterIndex !== undefined) {
      scope.splice(afterIndex + 1, 0, newItem);
    } else {
      scope.push(newItem);
    }
    App.renderCatEmdScope();
  },
  deleteCatScopeRow(i) {
    const scope = State.currentDraft.wcr.catEmdScope;
    const row = scope[i];
    const prev = scope.map(r=>({...r}));
    const label = row.type === 'heading' ? `Delete scope section "${row.text}"` : `Delete scope item "${row.contents?.substring(0,30)||'item'}"`;
    Undo.push(() => { State.currentDraft.wcr.catEmdScope = prev; App.renderCatEmdScope(); }, label);
    if (row.type === 'heading') {
      let j = i + 1;
      while (j < scope.length && scope[j].type !== 'heading') j++;
      scope.splice(i, j - i);
    } else {
      scope.splice(i, 1);
    }
    App.renderCatEmdScope();
  },
  saveScopeSection() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Scope of Work saved.", "success");
  },

  updateScopeRow(i, f, v) { State.currentDraft.wcr.scopeOfWork[i][f] = v; AutoSave.trigger(); },
  addScopeRow() { const prev = [...State.currentDraft.wcr.scopeOfWork]; Undo.push(() => { State.currentDraft.wcr.scopeOfWork = prev; App.renderScopeOfWork(); }, "Add scope row"); State.currentDraft.wcr.scopeOfWork.push({original:"",done:""}); App.renderScopeOfWork(); },
  deleteScopeRow(i) { const prev = [...State.currentDraft.wcr.scopeOfWork]; Undo.push(() => { State.currentDraft.wcr.scopeOfWork = prev; App.renderScopeOfWork(); }, "Delete scope row"); State.currentDraft.wcr.scopeOfWork.splice(i,1); App.renderScopeOfWork(); },

  // ── Deviations ──
  toggleDeviations() { State.currentDraft.wcr.deviationsActive = !State.currentDraft.wcr.deviationsActive; App.renderDeviationsSection(); },

  renderDeviationsSection() {
    const active = State.currentDraft.wcr.deviationsActive;
    document.getElementById("dev-toggle-btn").textContent = active ? "— Remove Deviations Section" : "+ Add Deviations & Reference Notes";
    document.getElementById("dev-body").classList.toggle("hidden", !active);
    if (active) {
      const dv = State.currentDraft.wcr.deviations;
      document.getElementById("dev-nextType").value = dv.nextMaintType || "";
      document.getElementById("dev-nextDate").value = dv.nextMaintDate || "";
      document.getElementById("dev-parts").value = dv.partsRenewal || "";
      // Ensure save button exists
      const devFooter = document.getElementById("dev-save-footer");
      if (devFooter) devFooter.innerHTML = `<button class="btn-save-history" onclick="App.saveDeviationsSection()">💾 Save Deviations</button>`;
    }
  },

  // ── Maintenance Summary ──
  renderMaintSummary() {
    const engineType = State.currentDraft.projectData?.EngineType || 'niigata';
    const isCatEmd = (engineType === 'cat' || engineType === 'emd');
    if (isCatEmd) { App.renderCatEmdMaintSummary(); return; }
    const items = State.currentDraft.wcr.maintItems;
    const container = document.getElementById("maint-items");
    container.innerHTML = items.map((item, i) => {
      if (item.type === "heading") {
        return `<div class="maint-item maint-heading" data-id="${item.id}">
          <input class="maint-heading-input" value="${item.text}" oninput="App.updateMaintItem('${item.id}','text',this.value)" />
          <div class="maint-item-actions">
            <button class="maint-action-btn" onclick="App.addMaintItem(${i},'bullet')" title="Add bullet below">+ Bullet</button>
            <button class="maint-action-btn" onclick="App.addMaintItem(${i},'heading')" title="Add heading below">+ Heading</button>
            <button class="maint-action-btn danger" onclick="App.deleteMaintItem('${item.id}')">✕</button>
          </div>
        </div>`;
      } else {
        return `<div class="maint-item maint-bullet" data-id="${item.id}">
          <span class="bullet-dot">•</span>
          <textarea class="maint-bullet-input" oninput="App.updateMaintItem('${item.id}','text',this.value)">${item.text}</textarea>
          <div class="maint-item-actions">
            <button class="maint-action-btn" onclick="App.addMaintItem(${i},'bullet')" title="Add bullet below">+ Bullet</button>
            <button class="maint-action-btn danger" onclick="App.deleteMaintItem('${item.id}')">✕</button>
          </div>
        </div>`;
      }
    }).join("") + `<div style="margin-top:12px;text-align:right"><button class="btn-save-history" onclick="App.saveNiigataMaint()">💾 Save Maintenance Summary</button></div>`;
  },

  saveNiigataMaint() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Maintenance Summary saved.", "success");
  },

  _restoreMaintAddBar() {
    const addBar = document.querySelector('.maint-add-bar');
    if (addBar) addBar.style.display = '';
  },
  updateMaintItem(id, field, val) { const item = State.currentDraft.wcr.maintItems.find(m => m.id === id); if (item) { item[field] = val; AutoSave.trigger(); } },

  renderDWRUploadSection() {
    // Show DWR upload controls inside builder only if not yet parsed
    const container = document.getElementById("dwr-upload-section");
    if (!container) return;
    container.classList.remove("hidden");
  },

  renderDWRPoints() {
    const container = document.getElementById("dwr-points-container");
    if (!container) return;
    const points = State.currentDraft.wcr.dwrPoints || [];
    if (!points.length) { container.innerHTML = `<div class="empty-state" style="font-size:11px">No DWR points loaded. Upload DWRs before creating the WCR to populate this section.</div>`; return; }
    container.innerHTML = points.map((p, i) => `
      <div class="dwr-point-row ${p.keep ? '' : 'dwr-point-removed'}">
        <span class="dwr-point-bullet">▸</span>
        <span class="dwr-point-text">${p.text}</span>
        <button class="dwr-point-toggle" onclick="App.toggleDWRPoint(${i})" title="${p.keep ? 'Remove' : 'Restore'}">${p.keep ? '✕' : '↩'}</button>
      </div>`).join("");
  },

  toggleDWRPoint(i) {
    State.currentDraft.wcr.dwrPoints[i].keep = !State.currentDraft.wcr.dwrPoints[i].keep;
    App.renderDWRPoints();
  },

  addMaintItem(afterIndex, type) {
    const prev = State.currentDraft.wcr.maintItems.map(m => ({...m}));
    Undo.push(() => { State.currentDraft.wcr.maintItems = prev; App.renderMaintSummary(); }, `Add ${type} to Maintenance Summary`);
    const newItem = { type, text: type === "heading" ? "New Section" : "", id: "mi_" + Math.random().toString(36).substr(2,8) };
    State.currentDraft.wcr.maintItems.splice(afterIndex + 1, 0, newItem);
    App.renderMaintSummary();
  },

  deleteMaintItem(id) {
    const prev = State.currentDraft.wcr.maintItems.map(m => ({...m}));
    Undo.push(() => { State.currentDraft.wcr.maintItems = prev; App.renderMaintSummary(); }, "Delete from Maintenance Summary");
    State.currentDraft.wcr.maintItems = State.currentDraft.wcr.maintItems.filter(m => m.id !== id);
    App.renderMaintSummary();
  },

  // ── Scope for Improvement ──
  renderScopeForImprovement() {
    const rows = State.currentDraft.wcr.scopeForImprovement;
    document.getElementById("sfi-rows").innerHTML = rows.map((r, i) => `
      <div class="sfi-row">
        <span class="sfi-num">${i+1}</span>
        <input class="form-input" value="${r.area}" placeholder="Area of improvement" oninput="App.updateSFI(${i},'area',this.value)" />
        <input class="form-input" value="${r.observations}" placeholder="Observations" oninput="App.updateSFI(${i},'observations',this.value)" />
        <input class="form-input" value="${r.recommendations}" placeholder="Recommendations" oninput="App.updateSFI(${i},'recommendations',this.value)" />
        <button class="row-del-btn" onclick="App.deleteSFI(${i})">✕</button>
      </div>`).join("") + `<div style="margin-top:10px;text-align:right"><button class="btn-save-history" onclick="App.saveScopeForImprovement()">💾 Save Scope for Improvement</button></div>`;
  },

  updateSFI(i, f, v) { State.currentDraft.wcr.scopeForImprovement[i][f] = v; AutoSave.trigger(); },
  addSFI() { const prev = State.currentDraft.wcr.scopeForImprovement.map(r => ({...r})); Undo.push(() => { State.currentDraft.wcr.scopeForImprovement = prev; App.renderScopeForImprovement(); }, "Add Scope for Improvement row"); State.currentDraft.wcr.scopeForImprovement.push({area:"",observations:"",recommendations:""}); App.renderScopeForImprovement(); },
  deleteSFI(i) { const prev = State.currentDraft.wcr.scopeForImprovement.map(r => ({...r})); Undo.push(() => { State.currentDraft.wcr.scopeForImprovement = prev; App.renderScopeForImprovement(); }, "Delete Scope for Improvement row"); State.currentDraft.wcr.scopeForImprovement.splice(i,1); App.renderScopeForImprovement(); },

  // ── Recommendations ──
  renderRecommendations() {
    const items = State.currentDraft.wcr.recommendations;
    document.getElementById("rec-rows").innerHTML = items.map((r, i) => `
      <div class="rec-row">
        <span class="rec-num">${i+1}.</span>
        <textarea class="form-input rec-cell" oninput="App.updateRec(${i},this.value)">${r}</textarea>
        <button class="row-del-btn" onclick="App.deleteRec(${i})">✕</button>
      </div>`).join("") + `<div style="margin-top:10px;text-align:right"><button class="btn-save-history" onclick="App.saveRecommendations()">💾 Save Recommendations</button></div>`;
  },

  updateRec(i, v) { State.currentDraft.wcr.recommendations[i] = v; AutoSave.trigger(); },
  addRec() { const prev = [...State.currentDraft.wcr.recommendations]; Undo.push(() => { State.currentDraft.wcr.recommendations = prev; App.renderRecommendations(); }, "Add Recommendation"); State.currentDraft.wcr.recommendations.push(""); App.renderRecommendations(); },
  deleteRec(i) { const prev = [...State.currentDraft.wcr.recommendations]; Undo.push(() => { State.currentDraft.wcr.recommendations = prev; App.renderRecommendations(); }, "Delete Recommendation"); State.currentDraft.wcr.recommendations.splice(i,1); App.renderRecommendations(); },

  // ── Calibration Tables ──
  showTablePalette() { document.getElementById("table-palette").classList.toggle("hidden"); },

  insertTable(templateKey) {
    const tmpl = TABLE_TEMPLATES[templateKey];
    const imgKey = tmpl.imageKey || templateKey;
    const allDiagrams = Object.assign({}, (typeof DIAGRAMS !== 'undefined') ? DIAGRAMS : {}, (typeof EXTRA_DIAGRAMS !== 'undefined') ? EXTRA_DIAGRAMS : {});
    const builtinImg = allDiagrams[imgKey] || null;
    const img2Key = tmpl.image2Key || null;
    const builtinImg2 = img2Key ? (allDiagrams[img2Key] || null) : null;
    const table = { id:"tbl_"+Date.now(), templateKey, name:tmpl.name, note:tmpl.note, hasImage:tmpl.hasImage||false, imageBase64:builtinImg, hasImage2:tmpl.hasImage2||false, image2Base64:builtinImg2, imageSrc:null, headers:[...tmpl.headers], rows:tmpl.rows.map(r=>[...r]) };
    const prev = State.currentDraft.wcr.calibrationTables.map(t => ({...t, rows:t.rows.map(r=>[...r]), headers:[...t.headers]}));
    Undo.push(() => { State.currentDraft.wcr.calibrationTables = prev; App.renderCalibrationTables(); }, `Add ${tmpl.name}`);
    State.currentDraft.wcr.calibrationTables.push(table);
    document.getElementById("table-palette").classList.add("hidden");
    App.renderCalibrationTables();
    Toast.show(`"${tmpl.name}" table added.`, "success");
  },

  renderCalibrationTables() {
    const tables = State.currentDraft.wcr.calibrationTables;
    const container = document.getElementById("cal-tables");
    if (tables.length === 0) { container.innerHTML = `<div class="empty-state">No calibration tables yet. Use the palette above to add tables.</div>`; return; }
    container.innerHTML = tables.map((t, ti) => `
      <div class="cal-table-block">
        <div class="cal-table-header">
          <input class="cal-table-title" value="${t.name}" oninput="App.updateTableName(${ti},this.value)" />
          <div class="cal-table-actions">
            <button class="tbl-action-btn" onclick="Undo.last()" title="Undo last action">↩ Undo</button>
            ${ti > 0 ? `<button class="tbl-action-btn" onclick="App.moveTable(${ti},-1)">↑</button>` : ""}
            ${ti < tables.length-1 ? `<button class="tbl-action-btn" onclick="App.moveTable(${ti},1)">↓</button>` : ""}
            <button class="tbl-action-btn danger" onclick="App.deleteTable(${ti})">🗑</button>
          </div>
        </div>
        ${t.hasImage ? `
          <div class="cal-image-row">
            <div style="display:flex;gap:8px;flex-direction:column">
              <div class="cal-image-box" onclick="document.getElementById('cal-img-${ti}').click()">
                ${t.imageBase64 ? `<img src="${t.imageBase64}" class="cal-img-preview" />` : `<span class="cal-img-placeholder">📷 Diagram Image 1</span>`}
              </div>
              <input type="file" id="cal-img-${ti}" accept="image/*" style="display:none" onchange="App.onCalImageSelect(${ti},event)" />
              ${t.hasImage2 ? `
              <div class="cal-image-box" onclick="document.getElementById('cal-img2-${ti}').click()">
                ${t.image2Base64 ? `<img src="${t.image2Base64}" class="cal-img-preview" />` : `<span class="cal-img-placeholder">📷 Diagram Image 2</span>`}
              </div>
              <input type="file" id="cal-img2-${ti}" accept="image/*" style="display:none" onchange="App.onCalImage2Select(${ti},event)" />
              ` : ''}
            </div>
            <textarea class="form-input cal-note-edit" rows="4" oninput="App.updateTableNote(${ti},this.value)">${t.note||""}</textarea>
          </div>` : t.note ? `<div class="cal-table-note"><textarea class="form-input cal-note-edit" rows="2" oninput="App.updateTableNote(${ti},this.value)">${t.note}</textarea></div>` : ""}
        <div class="cal-table-scroll">
          <table class="cal-editable-table">
            <thead><tr>${t.headers.map((h,hi) => `<th><input class="th-input" value="${h}" oninput="App.updateHeader(${ti},${hi},this.value)" /><button class="col-del" onclick="App.deleteCol(${ti},${hi})">✕</button></th>`).join("")}<th><button class="add-col-btn" onclick="App.addCol(${ti})">+ Col</button></th></tr></thead>
            <tbody>${t.rows.map((row,ri) => `<tr>${row.map((cell,ci) => `<td><input class="td-input" value="${cell}" oninput="App.updateCell(${ti},${ri},${ci},this.value)" /></td>`).join("")}<td><button class="row-del-btn" onclick="App.deleteTableRow(${ti},${ri})">✕</button></td></tr>`).join("")}</tbody>
          </table>
        </div>
        <button class="add-row-btn" onclick="App.addTableRow(${ti})">+ Add Row</button>
      </div>`).join("") + `<div style="margin-top:14px;text-align:right"><button class="btn-save-history" onclick="App.saveCalibrationTables()">💾 Save Calibration Tables</button></div>`;
  },

  onCalImageSelect(ti, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { State.currentDraft.wcr.calibrationTables[ti].imageBase64 = e.target.result; App.renderCalibrationTables(); AutoSave.trigger(); };
    reader.readAsDataURL(file);
  },

  onCalImage2Select(ti, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { State.currentDraft.wcr.calibrationTables[ti].image2Base64 = e.target.result; App.renderCalibrationTables(); AutoSave.trigger(); };
    reader.readAsDataURL(file);
  },

  updateTableName(ti, v) { State.currentDraft.wcr.calibrationTables[ti].name = v; AutoSave.trigger(); },
  updateTableNote(ti, v) { State.currentDraft.wcr.calibrationTables[ti].note = v; AutoSave.trigger(); },
  updateHeader(ti, hi, v) { State.currentDraft.wcr.calibrationTables[ti].headers[hi] = v; AutoSave.trigger(); },
  updateCell(ti, ri, ci, v) { State.currentDraft.wcr.calibrationTables[ti].rows[ri][ci] = v; AutoSave.trigger(); },

  deleteTable(ti) {
    if (!confirm("Delete this table?")) return;
    const prev = State.currentDraft.wcr.calibrationTables.map(t => ({...t}));
    Undo.push(() => { State.currentDraft.wcr.calibrationTables = prev; App.renderCalibrationTables(); }, `Delete calibration table`);
    State.currentDraft.wcr.calibrationTables.splice(ti,1); App.renderCalibrationTables();
  },

  moveTable(ti, dir) {
    const tables = State.currentDraft.wcr.calibrationTables;
    const ni = ti + dir;
    if (ni < 0 || ni >= tables.length) return;
    const prev = [...tables];
    Undo.push(() => { State.currentDraft.wcr.calibrationTables = prev; App.renderCalibrationTables(); });
    [tables[ti], tables[ni]] = [tables[ni], tables[ti]];
    App.renderCalibrationTables();
  },

  addTableRow(ti) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    const prev = t.rows.map(r=>[...r]);
    Undo.push(() => { t.rows = prev; App.renderCalibrationTables(); });
    t.rows.push(new Array(t.headers.length).fill(""));
    App.renderCalibrationTables();
  },

  deleteTableRow(ti, ri) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    const prev = t.rows.map(r=>[...r]);
    Undo.push(() => { t.rows = prev; App.renderCalibrationTables(); });
    t.rows.splice(ri,1); App.renderCalibrationTables();
  },

  addCol(ti) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    const prevH = [...t.headers]; const prevR = t.rows.map(r=>[...r]);
    Undo.push(() => { t.headers = prevH; t.rows = prevR; App.renderCalibrationTables(); });
    t.headers.push("New Column"); t.rows.forEach(r => r.push(""));
    App.renderCalibrationTables();
  },

  deleteCol(ti, hi) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    if (t.headers.length <= 1) return;
    const prevH = [...t.headers]; const prevR = t.rows.map(r=>[...r]);
    Undo.push(() => { t.headers = prevH; t.rows = prevR; App.renderCalibrationTables(); });
    t.headers.splice(hi,1); t.rows.forEach(r => r.splice(hi,1));
    App.renderCalibrationTables();
  },

  // ── Parts Consumed ──
  renderPartsSection() {
    const p = State.currentDraft.wcr.partsColumns;
    if (p.rows) {
      App.renderPartsTable();
    } else {
      App.renderPartsPaste();
    }
  },

  renderPartsPaste() {
    const p = State.currentDraft.wcr.partsColumns;
    const fc = p._finalisedCols || {};
    const container = document.getElementById("parts-container");

    // Build partial preview if any columns are finalised
    const finalisedCount = Object.keys(fc).length;
    let partialPreview = '';
    if (finalisedCount > 0) {
      const maxRows = Math.max(0, ...Object.values(fc).map(c => c.length));
      partialPreview = `<div class="parts-partial-preview">
        <div style="font-size:10px;color:var(--amber-dim);margin-bottom:6px">📋 Preview (${finalisedCount} of ${p.headers.length} columns finalised)</div>
        <div style="overflow-x:auto">
          <table class="parts-table" style="min-width:auto">
            <thead><tr>${p.headers.map((h,hi) => fc[hi]
              ? `<th style="color:#7ef59a">✓ ${h}</th>`
              : `<th style="opacity:0.4">${h}</th>`
            ).join('')}</tr></thead>
            <tbody>${Array.from({length:Math.min(maxRows,5)},(_,r)=>`<tr>${p.headers.map((_,ci)=>`<td>${(fc[ci]||[])[r]||''}</td>`).join('')}</tr>`).join('')}
            ${maxRows > 5 ? `<tr><td colspan="${p.headers.length}" style="text-align:center;font-size:10px;color:var(--white-dim)">… ${maxRows-5} more rows</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>`;
    }

    container.innerHTML = `
      <p class="wcr-section-hint">Paste data for each column separately, then click "Finalise" for that column. Finalised columns show a ✓ and appear in the preview below.</p>
      <div class="parts-paste-grid">
        ${p.headers.map((h, i) => {
          const isFinalised = !!fc[i];
          const rowCount = fc[i]?.length || 0;
          return `<div class="parts-paste-col ${isFinalised ? 'col-finalised' : ''}">
            <div class="parts-paste-header">${isFinalised ? `✓ ${h} <span style="font-size:9px;color:#7ef59a">(${rowCount} rows)</span>` : h}</div>
            <textarea class="form-input parts-paste-area" placeholder="Paste ${h} data here (one item per line)..." oninput="App.updatePartsPaste(${i},this.value)">${p.rawPaste[i]||""}</textarea>
            <button class="finalise-col-btn ${isFinalised ? 'done' : ''}" onclick="App.finalisePartsCol(${i})">
              ${isFinalised ? '✓ Re-finalise' : 'Finalise this column →'}
            </button>
          </div>`;
        }).join("")}
      </div>
      ${partialPreview}
      ${finalisedCount === p.headers.length
        ? `<button class="btn-full mt" onclick="App.previewPartsTable()">✓ All Columns Done — Build Full Table →</button>`
        : `<button class="btn-full mt" style="opacity:0.6" onclick="App.previewPartsTable()">Build Table with ${finalisedCount} Column(s) →</button>`
      }
    `;
  },

  updatePartsPaste(i, val) { State.currentDraft.wcr.partsColumns.rawPaste[i] = val; AutoSave.trigger(); },

  finalisePartsCol(i) {
    const p = State.currentDraft.wcr.partsColumns;
    const raw = p.rawPaste[i] || "";
    if (!raw.trim()) { Toast.show(`Paste data into the "${p.headers[i]}" column first.`, "error"); return; }
    // Preserve blank lines as empty cells — do NOT filter them out
    const lines = raw.split("\n").map(l => l.trim());
    p._finalisedCols = p._finalisedCols || {};
    p._finalisedCols[i] = lines;
    const nonEmpty = lines.filter(l => l).length;
    Toast.show(`✓ "${p.headers[i]}" finalised — ${nonEmpty} rows.`, "success");
    App.renderPartsPaste();
  },

  previewPartsTable() {
    const p = State.currentDraft.wcr.partsColumns;
    const cols = p._finalisedCols || {};
    const maxRows = Math.max(0, ...Object.values(cols).map(c => c.length));
    const rows = [];
    for (let r = 0; r < maxRows; r++) {
      rows.push(p.headers.map((_, ci) => (cols[ci] || [])[r] || ""));
    }
    p.rows = rows;
    App.renderPartsTable();
    App.saveDrafts(); // auto-save when parts table is built
  },

  renderPartsTable() {
    const p = State.currentDraft.wcr.partsColumns;
    const container = document.getElementById("parts-container");
    container.innerHTML = `
      <button class="btn-palette" onclick="App.resetPartsPaste()">← Back to Paste View</button>
      <div class="parts-table-wrap">
        <table class="parts-table">
          <thead><tr>${p.headers.map((h,hi) => `<th><input class="th-input" value="${h}" oninput="App.updatePartsHeader(${hi},this.value)" /><button class="col-del" onclick="App.deletePartsCol(${hi})">✕</button></th>`).join("")}<th><button class="add-col-btn" onclick="App.addPartsCol()">+ Col</button></th></tr></thead>
          <tbody>${(p.rows||[]).map((row,ri) => `<tr>${row.map((cell,ci) => `<td><input class="td-input" value="${cell}" oninput="App.updatePartsCell(${ri},${ci},this.value)" /></td>`).join("")}<td><button class="row-del-btn" onclick="App.deletePartsRow(${ri})">✕</button></td></tr>`).join("")}</tbody>
        </table>
      </div>
      <button class="add-row-btn" onclick="App.addPartsRow()">+ Add Row</button>
      <div style="margin-top:10px;text-align:right"><button class="btn-save-history" onclick="App.savePartsSection()">💾 Save Parts List</button></div>
    `;
  },

  resetPartsPaste() { State.currentDraft.wcr.partsColumns.rows = null; App.renderPartsPaste(); },
  updatePartsHeader(hi, v) { State.currentDraft.wcr.partsColumns.headers[hi] = v; App.renderPartsTable(); },
  updatePartsCell(ri, ci, v) { State.currentDraft.wcr.partsColumns.rows[ri][ci] = v; AutoSave.trigger(); },
  addPartsRow() { State.currentDraft.wcr.partsColumns.rows.push(new Array(State.currentDraft.wcr.partsColumns.headers.length).fill("")); App.renderPartsTable(); },
  deletePartsRow(ri) { State.currentDraft.wcr.partsColumns.rows.splice(ri,1); App.renderPartsTable(); },
  addPartsCol() { const p = State.currentDraft.wcr.partsColumns; p.headers.push("New Column"); p.rows.forEach(r => r.push("")); App.renderPartsTable(); },
  deletePartsCol(hi) { const p = State.currentDraft.wcr.partsColumns; if (p.headers.length <= 1) return; p.headers.splice(hi,1); p.rows.forEach(r => r.splice(hi,1)); App.renderPartsTable(); },

  // ── Photos ──
  onPhotoSelect(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        State.currentDraft.wcr.photos.push({ src:e.target.result, title:"", description:"", fromDWR:false });
        State.currentDraft.updatedAt = new Date().toISOString();
        App.renderPhotos();
        App.saveDrafts(); // immediate Drive save for photos (large base64)
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  },

  renderPhotos() {
    const photos = State.currentDraft.wcr.photos;
    const container = document.getElementById("photos-grid");
    if (photos.length === 0) { container.innerHTML = `<div class="empty-state">No photos yet. Click "Add Photos" above.</div>`; return; }
    container.innerHTML = photos.map((p, i) => `
      <div class="photo-card ${p.fromDWR ? 'from-dwr' : ''}">
        ${p.fromDWR && !p.src ? `<div class="dwr-photo-placeholder">📄 DWR Reference Photo<br/><small>${p.title}</small><br/><button class="add-row-btn" onclick="document.getElementById('photo-replace-${i}').click()">Upload actual photo</button><input type="file" id="photo-replace-${i}" accept="image/*" style="display:none" onchange="App.replacePhoto(${i},event)" /></div>` : `<img src="${p.src}" class="photo-img" alt="Photo ${i+1}" />`}
        <div class="photo-fields">
          <input class="form-input photo-title" value="${p.title}" placeholder="Title (required) *" oninput="App.updatePhoto(${i},'title',this.value)" style="${!p.title ? 'border-color:var(--amber)' : ''}" />
          <input class="form-input photo-desc" value="${p.description||''}" placeholder="Description (optional)" oninput="App.updatePhoto(${i},'description',this.value)" />
        </div>
        <button class="photo-del" onclick="App.deletePhoto(${i})">✕ Remove</button>
      </div>`).join("") + `<div style="margin-top:10px;text-align:right"><button class="btn-save-history" onclick="App.savePhotosSection()">💾 Save Photos</button></div>`;
  },

  replacePhoto(i, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { State.currentDraft.wcr.photos[i].src = e.target.result; App.renderPhotos(); };
    reader.readAsDataURL(file);
  },

  updatePhoto(i, f, v) { State.currentDraft.wcr.photos[i][f] = v; AutoSave.trigger(); },
  deletePhoto(i) { State.currentDraft.wcr.photos.splice(i,1); App.renderPhotos(); },

  /* ══════════════════════════════════════════════════════
     SEMI-FINALISE + GRAMMAR CHECK
  ══════════════════════════════════════════════════════ */


  /* ══════════════════════════════════════════════════════
     PDF DOWNLOAD — from HOD Approved section
  ══════════════════════════════════════════════════════ */
  downloadPDF(draftId) {
    const draft = State.approved.find(d => d.id === draftId);
    if (!draft) { Toast.show("Draft not found.", "error"); return; }
    App._generateAndPrintPDF(draft);
  },

  // Download PDF from inside the WCR builder (current open draft)
  downloadCurrentDraftPDF() {
    const draft = State.currentDraft;
    if (!draft) { Toast.show("No draft open.", "error"); return; }
    // Save silently (no toast) so "Draft saved" doesn't confuse user
    const d = draft;
    const w = d.wcr;
    if (w.deviationsActive) {
      w.deviations = {
        nextMaintType: document.getElementById("dev-nextType")?.value||"",
        nextMaintDate: document.getElementById("dev-nextDate")?.value||"",
        partsRenewal:  document.getElementById("dev-parts")?.value||""
      };
    }
    w.signoff = {
      makerName:    document.getElementById("so-maker")?.value||"",
      checkerName:  document.getElementById("so-checker")?.value||"",
      approverName: document.getElementById("so-approver")?.value||"",
      makerDate:    document.getElementById("so-makerdate")?.value||"",
      customerName: document.getElementById("so-custname")?.value||"",
      customerDate: document.getElementById("so-custdate")?.value||""
    };
    draft.downloadedAt = new Date().toISOString();
    draft.updatedAt = new Date().toISOString();
    // Ensure the draft is in State.drafts array (in case reference drifted)
    const existingIdx = State.drafts.findIndex(d => d.id === draft.id);
    if (existingIdx >= 0) State.drafts[existingIdx] = draft;
    else State.drafts.unshift(draft);
    App.saveDrafts().then(() => App.renderDrafts());
    try {
      App._generateAndPrintPDF(draft);
    } catch(err) {
      console.error("PDF generation error:", err);
      Toast.show("PDF error: " + (err.message||"unknown error") + " — check console.", "error");
    }
  },

  // Download PDF directly from any draft (from dashboard)
  downloadDraftPDF(draftId) {
    const draft = State.drafts.find(d => d.id === draftId);
    if (!draft) { Toast.show("Draft not found.", "error"); return; }
    draft.downloadedAt = new Date().toISOString();
    draft.updatedAt = new Date().toISOString();
    App.saveDrafts().then(() => App.renderDrafts());
    try {
      App._generateAndPrintPDF(draft);
    } catch(err) {
      console.error("PDF generation error:", err);
      Toast.show("PDF error: " + (err.message||"unknown error") + " — check console.", "error");
    }
  },

  _generateAndPrintPDF(draft) {
    const w = draft.wcr;
    const p = draft.projectData;
    const LOGO  = (typeof LOGO_B64  !== "undefined") ? LOGO_B64  : "";
    const DGRAMS = Object.assign({}, (typeof DIAGRAMS !== "undefined") ? DIAGRAMS : {}, (typeof EXTRA_DIAGRAMS !== "undefined") ? EXTRA_DIAGRAMS : {});

    const FOOTER_TEXT = "Neptunus Power Plant Services Pvt. Ltd. &nbsp;|&nbsp; A-554/555, TTC Industrial Area, MIDC, Mahape, Navi Mumbai – 400 710, India &nbsp;|&nbsp; Tel: +91 22 41410707 &nbsp;|&nbsp; www.neptunus-power.com &nbsp;|&nbsp; info@neptunus-power.com";

    const CSS = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; }
      @page { size: A4; margin: 0; }
      .page { width: 210mm; height: 297mm; padding: 14mm 14mm 0 14mm; page-break-after: always; box-sizing: border-box; display: flex; flex-direction: column; }
      .page-header { display: flex; align-items: center; justify-content: space-between;
        border-bottom: 2px solid #003366; padding-bottom: 5px; margin-bottom: 14px; flex-shrink: 0; }
      .page-header-title { font-size: 11pt; font-weight: bold; color: #003366; }
      .page-header img { height: 36px; width: auto; }
      .page-body { flex: 1; overflow: hidden; }
      .page-footer { flex-shrink: 0; border-top: 1px solid #003366; padding: 4px 0 6mm 0;
        font-size: 7pt; color: #555; text-align: center; margin-top: auto; }
      h1 { text-align: center; font-size: 16pt; color: #003366; margin: 10px 0 6px; }
      h2 { font-size: 11pt; color: #003366; border-bottom: 2px solid #003366;
           padding-bottom: 3px; margin: 16px 0 6px; }
      h3 { font-size: 10pt; font-weight: bold; margin: 10px 0 3px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; }
      td, th { border: 1px solid #aaa; padding: 4px 7px; vertical-align: top; }
      th { background: #dde4ef; font-weight: bold; color: #003366; text-align: left; }
      .lc { background: #f5f5f5; font-weight: bold; width: 35%; }
      ul { margin: 3px 0 8px 16px; }
      li { margin-bottom: 2px; line-height: 1.5; }
      ol { margin: 4px 0 10px 18px; }
      ol li { margin-bottom: 4px; line-height: 1.5; }
      .maint-group { margin-bottom: 4px; }
      tr { page-break-inside: avoid; }
      .cal-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
      .cal-row img { width: 120px; flex-shrink: 0; }
      .cal-note { font-size: 8pt; line-height: 1.6; flex: 1; }
      .cal-img-auto { max-width: 180px; height: auto; object-fit: contain; }
      .photo-grid { width: 100%; border-collapse: collapse; }
      .photo-grid td { border: 1px solid #aaa; padding: 8px; text-align: center; width: 50%; vertical-align: top; }
      .photo-grid img { width: 100%; height: auto; max-width: 100%; object-fit: contain; display: block; }
      .pcap { font-size: 8.5pt; font-weight: bold; text-transform: uppercase; margin-top: 4px; }
      .pdesc { font-size: 7.5pt; color: #444; margin-top: 2px; }
      .cover-img { max-width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; margin: 0 auto 10px; }
    `;

    const hdr = () => `
      <div class="page-header">
        <span class="page-header-title">Work Completion Report &mdash; ${p.CustomerName||draft.projectCode}</span>
        ${LOGO ? `<img src="${LOGO}" alt="NPPS" />` : `<span style="font-weight:bold;color:#003366">NEPTUNUS</span>`}
      </div><div class="page-body">`;
    const ftr = () => `</div><div class="page-footer">${FOOTER_TEXT}</div>`;

    // ── Page 1: Cover ──
    let pages = `<div class="page">${hdr()}`;
    pages += `<h1>Work Completion Report</h1>`;
    if (p.CustomerName) pages += `<p style="text-align:center;font-size:12pt;font-weight:bold;color:#003366;margin:4px 0 10px">${p.CustomerName}</p>`;
    if (p.VesselImageBase64) pages += `<div style="text-align:center;margin:10px 0"><img src="${p.VesselImageBase64}" class="cover-img"/></div>`;
    pages += `<table>
      ${(()=>{ const L=App.ENGINE_TYPE_LABELS[p.EngineType||'niigata']||App.ENGINE_TYPE_LABELS.niigata; return `
      <tr><td class="lc">Customer Name</td><td><strong>${p.CustomerName||"—"}</strong></td><td class="lc">${L.contractNo}</td><td>${p.ContractNo||"—"}</td></tr>
      <tr><td class="lc">Start Date of Job</td><td>${p.StartDate||"—"}</td><td class="lc">${L.endDate}</td><td>${p.EndDate||"—"}</td></tr>
      <tr><td class="lc">${L.overhaulType}</td><td>${p.OverhaulType||"—"}</td><td class="lc">Engine Make and Model</td><td>${p.EngineModel||"—"}</td></tr>
      <tr><td class="lc">Engine Serial Number</td><td>${p.EngineSerial||"—"}</td><td class="lc">${L.arrangement}</td><td>${p.EngineArrangement||"—"}</td></tr>
      <tr><td class="lc">RPM and Capacity</td><td>${p.RPMCapacity||"—"}</td><td class="lc">Current Running Hours</td><td>${p.RunningHours||"—"}</td></tr>
      <tr><td class="lc">Customer In-Charge</td><td>${p.CustomerIncharge||"—"}</td><td class="lc">Neptunus Team Leader</td><td>${p.TeamLeader||"—"}</td></tr>
      <tr><td class="lc">Neptunus Members</td><td colspan="3">${p.Members||"—"}</td></tr>
      `; })()}
    </table>`;
    pages += ftr() + `</div>`;

    // ── Page 2+: Content sections ──
    let body = `<div class="page">${hdr()}`;

    // History
    if (w.historyActive && w.historyRows?.length) {
      body += `<h2>History</h2><table>`;
      w.historyRows.forEach(r => {
        if (r.type === 'subtable') {
          body += `<tr><td class="lc" style="vertical-align:top">${r.label}</td><td>
            <table style="width:100%;border-collapse:collapse;font-size:8pt;margin:0">
              <tr>${(r.headers||[]).map(h=>`<th style="border:1px solid #aaa;padding:3px 5px;background:#dde4ef;font-size:7.5pt">${h}</th>`).join('')}</tr>
              <tr>${(r.subheaders||[]).map(h=>`<th style="border:1px solid #aaa;padding:3px 5px;background:#f0f0f0;font-size:7pt">${h}</th>`).join('')}</tr>
              ${(r.rows||[]).map(row=>`<tr>${row.map(c=>`<td style="border:1px solid #aaa;padding:3px 5px">${c||'—'}</td>`).join('')}</tr>`).join('')}
            </table>
          </td></tr>`;
        } else {
          const val = r.value && r.value.trim() ? r.value : 'NA';
          body += `<tr><td class="lc">${r.label||"—"}</td><td>${val}</td></tr>`;
        }
      });
      body += `</table>`;
    }

    // Mandays (CAT/EMD)
    const isCatEmdPdf = (p.EngineType === 'cat' || p.EngineType === 'emd');
    if (isCatEmdPdf && w.mandaysActive && w.mandaysRows?.length) {
      body += `<h2>Mandays</h2><table><tr><th colspan="2" style="text-align:center">Mandays</th></tr>`;
      (w.mandaysRows||[]).forEach(r => {
        if (!r) return;
        body += `<tr><td class="lc">${r.label||''}</td><td>${r.value && r.value.trim() ? r.value : 'NA'}</td></tr>`;
      });
      body += `<tr><td colspan="2" style="font-size:7.5pt;font-style:italic">Note: All days to be on calendar day basis</td></tr></table>`;
    }
    // Scope of Work
    if (w.scopeActive) {
      const et = p.EngineType || 'niigata';
      const isCE = (et === 'cat' || et === 'emd');
      if (isCE && w.catEmdScope?.length) {
        body += `<h2>Scope of Work</h2><table><thead><tr><th style="width:6%">Sr.</th><th>Contents</th><th style="width:15%">Included (Yes/No)</th></tr></thead><tbody>`;
        (w.catEmdScope||[]).forEach(r => {
          if (r.type === 'heading') {
            body += `<tr><td colspan="3" style="background:#dde4ef;font-weight:bold;text-align:center">${r.text||''}</td></tr>`;
          } else {
            const inc = r.included && r.included.trim() ? r.included : 'NA';
            body += `<tr><td style="text-align:center">${r.sr||''}</td><td>${r.contents||'—'}</td><td style="text-align:center">${inc}</td></tr>`;
          }
        });
        body += `</tbody></table>`;
      } else if (!isCE && w.scopeOfWork?.length) {
        body += `<h2>Scope of Work</h2><table><tr><th>Describe what the original scope of work was</th><th>Describe what was done (include additions and omissions, with reasons)</th></tr>`;
        w.scopeOfWork.forEach(r => { body += `<tr><td>${r.original||"—"}</td><td>${r.done||"—"}</td></tr>`; });
        body += `</table>`;
      }
    }

    // Deviations
    if (w.deviationsActive) {
      body += `<h2>Deviations and Reference Notes for Next Overhaul</h2><table>`;
      const rows = w.deviationRows || [{label:"Next Maintenance Type & Date", value:`${w.deviations?.nextMaintType||"—"} ${w.deviations?.nextMaintDate||""}`},{label:"Parts Renewal Required", value:w.deviations?.partsRenewal||"—"}];
      rows.forEach(r => { body += `<tr><td class="lc">${r.label||"—"}</td><td>${r.value||"—"}</td></tr>`; });
      body += `</table>`;
    }

    // Maintenance Summary — paginated with header/footer on each page
    body += ftr() + `</div>`;
    // Build maint groups first, then paginate (~18 groups per page)
    const MAINT_PER_PAGE = 18;
    if (isCatEmdPdf && w.catEmdMaintSummary && w.catEmdMaintSummary.length > 0) {
      body += `<div class="page">${hdr()}<h2>Maintenance Summary</h2>`;
      body += `<table><thead><tr><th style="width:22%">Parts Description</th><th>Brief Description</th><th style="width:8%;text-align:center">Replaced</th><th style="width:8%;text-align:center">Reused</th></tr></thead><tbody>`;
      (w.catEmdMaintSummary||[]).forEach(row => {
        if (!row) return;
        const verbs = Array.isArray(row.verbs) ? row.verbs : [];
        const part = row.part || '—';
        const sentence = verbs.length > 0
          ? `${part} was ${verbs.slice(0,-1).join(', ')}${verbs.length > 1 ? ' and ' : ''}${verbs[verbs.length-1]}.`
          : 'NA';
        body += `<tr><td>${part}</td><td>${sentence}</td><td style="text-align:center">${row.replaced ? '✓' : ''}</td><td style="text-align:center">${row.reused ? '✓' : ''}</td></tr>`;
      });
      body += `</tbody></table>`;
      const pdfBullets = Array.isArray(w.catEmdRemarksBullets) ? w.catEmdRemarksBullets.filter(b=>b&&b.trim()) : [];
      const pdfLegacy = (w.catEmdRemarks||'').trim();
      if (pdfBullets.length || pdfLegacy) {
        body += `<h3 style="margin-top:10px">Additional Remarks / Non-Conformities</h3>`;
        if (pdfBullets.length) {
          body += `<ul>${pdfBullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
        } else {
          body += `<p style="white-space:pre-line;font-size:9pt">${pdfLegacy}</p>`;
        }
      }
      body += ftr() + `</div>`;
    } else {
      // Group each heading with its bullets, paginate every 18 groups
      let currentGroup = null;
      let maintGroups = [];
      (w.maintItems||[]).forEach(item => {
        if (item.type === "heading") {
          if (currentGroup) maintGroups.push(currentGroup);
          currentGroup = { heading: item.text, bullets: [] };
        } else if (currentGroup) {
          currentGroup.bullets.push(item.text);
        } else {
          maintGroups.push({ heading: null, bullets: [item.text] });
        }
      });
      if (currentGroup) maintGroups.push(currentGroup);
      // Each group on proper page with header/footer
      body += `<div class="page">${hdr()}<h2>Maintenance Summary</h2>`;
      let pgCount = 0;
      maintGroups.forEach(g => {
        if (pgCount > 0 && pgCount % 6 === 0) {
          body += ftr() + `</div><div class="page">${hdr()}<h2>Maintenance Summary <span style="font-size:9pt;font-weight:normal;color:#555">(continued)</span></h2>`;
        }
        body += `<div class="maint-group">`;
        if (g.heading) body += `<h3>${g.heading}</h3>`;
        if (g.bullets.length) {
          body += `<ul>`;
          g.bullets.forEach(b => { body += `<li>${b}</li>`; });
          body += `</ul>`;
        }
        body += `</div>`;
        pgCount++;
      });
      body += ftr() + `</div>`;
    }

    // Scope for Improvement — new page
    body += `<div class="page">${hdr()}<h2>Scope for Improvement</h2><table><tr><th>No.</th><th>Area</th><th>Observations</th><th>Recommendations</th></tr>`;
    (w.scopeForImprovement||[]).forEach((r,i) => { body += `<tr><td style="text-align:center">${i+1}</td><td>${r.area||"—"}</td><td>${r.observations||"—"}</td><td>${r.recommendations||"—"}</td></tr>`; });
    body += `</table>`;

    // Recommendations
    body += `<h2>Recommendations</h2><p style="font-size:8.5pt;margin-bottom:6px">The engine post overhaul must be closely monitored for any abnormalities which could cause serious breakdowns. It is a known fact that most breakdowns on overhauled engines occur within the first 100 hours post overhaul. We therefore, recommend the following:</p><ol>`;
    (w.recommendations||[]).forEach(r => { body += `<li>${r}</li>`; });
    body += `</ol>`;

    body += ftr() + `</div>`;

    // ── Calibration Tables — one per page ──────────────────
    if (w.calibrationTables?.length) {
      w.calibrationTables.forEach((t, ti) => {
        const imgSrc = t.imageBase64 || DGRAMS[t.templateKey] || null;
        body += ``;
        body += `<h2>Annexure ${ti+1} &mdash; ${t.name}</h2>`;
        if (t.hasImage && imgSrc) {
          const img2Src = t.image2Base64 || null;
          body += `<div class="cal-row">`;
          body += `<img src="${imgSrc}" class="cal-img-auto" />`;
          if (img2Src) body += `<img src="${img2Src}" class="cal-img-auto" style="margin-left:8px" />`;
          body += `<div class="cal-note">${(t.note||"").replace(/\n/g,"<br/>")}</div></div>`;
        } else if (t.note) {
          body += `<p style="font-size:8pt;margin-bottom:8px">${(t.note||"").replace(/\n/g,"<br/>")}</p>`;
        }
        body += `<table><thead><tr>${t.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;
        (t.rows||[]).forEach(row => { body += `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`; });
        body += `</tbody></table>`;
        body += ftr() + `</div>`;
      });
    }

    // ── Parts Consumed page ──
    if (w.partsColumns?.rows?.length) {
      body += `<h2>Parts Consumed List</h2>`;
      body += `<table><thead><tr>${w.partsColumns.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;
      w.partsColumns.rows.forEach(row => { body += `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`; });
      body += `</tbody></table>`;
      body += ftr() + `</div>`;
    }

    // ── Photo Gallery page ──
    const realPhotos = (w.photos||[]).filter(ph => ph.src);
    if (realPhotos.length) {
      body += `<h2>Photo Gallery</h2><table class="photo-grid"><tbody>`;
      for (let i = 0; i < realPhotos.length; i += 2) {
        const ph1 = realPhotos[i], ph2 = realPhotos[i+1]||null;
        body += `<tr>
          <td><img src="${ph1.src}" style="width:100%;height:auto;object-fit:contain;max-height:260px;display:block"/><div class="pcap">${(ph1.title||"").toUpperCase()}</div>${ph1.description?`<div class="pdesc">${ph1.description}</div>`:""}</td>
          <td>${ph2?`<img src="${ph2.src}" style="width:100%;height:auto;object-fit:contain;max-height:260px;display:block"/><div class="pcap">${(ph2.title||"").toUpperCase()}</div>${ph2.description?`<div class="pdesc">${ph2.description}</div>`:""}`:""}</td>
        </tr>`;
      }
      body += `</tbody></table>`;
      body += ftr() + `</div>`;
    }

    // ── Sign-off page ──
    const so = w.signoff||{};
    body += `<div class="page">${hdr()}<h2>Sign-off</h2>
      <table>
        <tr><th colspan="2" style="text-align:center">On behalf of Neptunus</th><th colspan="2" style="text-align:center">On behalf of Customer</th></tr>
        <tr><td class="lc">Maker Name</td><td>${so.makerName||"—"}</td><td class="lc">Name</td><td>${so.customerName||"—"}</td></tr>
        <tr><td class="lc">Checker Name</td><td>${so.checkerName||"—"}</td><td class="lc">Date</td><td>${so.customerDate||"—"}</td></tr>
        <tr><td class="lc">Approver Name</td><td>${so.approverName||"—"}</td><td></td><td></td></tr>
        <tr><td class="lc">Date</td><td>${so.makerDate||"—"}</td><td></td><td></td></tr>
      </table>
    `;

    // ── Generate filename ──
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const yy = String(today.getFullYear()).slice(-2);
    const authorName = (draft.authorName || State.currentUser?.name || 'User').replace(/\s+/g,'_');
    const pdfFileName = `${draft.projectCode}_${authorName}_${dd}-${mm}-${yy}`;

    // ── Build full HTML with auto-print script ──
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <title>${pdfFileName}</title>
      <style>${CSS}
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style></head><body>${pages}${body}
      <script>
        // Auto-trigger print dialog as soon as page loads
        window.addEventListener('load', function() {
          document.title = '${pdfFileName}';
          setTimeout(function() { window.print(); }, 500);
        });
      <\/script>
      </body></html>`;

    // ── Open in new tab — auto-prints on load ──
    // User sees print dialog immediately, selects "Save as PDF", done.
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      // Popup blocked — download the HTML as fallback
      const a = document.createElement('a');
      a.href = url; a.download = pdfFileName + '.html';
      a.style.display = 'none'; document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 3000);
      Toast.show("Allow popups for this site for best experience. File downloaded instead.", "error");
      return;
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    Toast.show(`Print dialog will open — select "Save as PDF" to download as "${pdfFileName}.pdf"`, "success");
  },

  /* ══════════════════════════════════════════════════════
     SEMI-FINALISE + GRAMMAR CHECK
  ══════════════════════════════════════════════════════ */
  openSemiFinalise() {
    App.saveWCRSection();
    Screen.show("semi-final");
    App.renderSemiFinalPreview();
  },

  renderSemiFinalPreview() {
    const d = State.currentDraft;
    const w = d.wcr;
    const p = d.projectData;
    let html = `<div class="sf-preview">`;

    // Cover
    html += `<div class="sf-section sf-cover">
      ${p.VesselImageBase64 ? `<img src="${p.VesselImageBase64}" class="sf-cover-img" />` : ""}
      <h1 class="sf-title">Work Completion Report</h1>
      <div class="sf-cover-table">
        ${(()=>{ const L=App.ENGINE_TYPE_LABELS[p.EngineType||'niigata']||App.ENGINE_TYPE_LABELS.niigata; return `
        <div class="sf-row"><label>Customer Name</label><span>${p.CustomerName||"—"}</span><label>${L.contractNo}</label><span>${p.ContractNo||"—"}</span></div>
        <div class="sf-row"><label>Start Date of Job</label><span>${p.StartDate||"—"}</span><label>${L.endDate}</label><span>${p.EndDate||"—"}</span></div>
        <div class="sf-row"><label>${L.overhaulType}</label><span>${p.OverhaulType||"—"}</span><label>Engine Make and Model</label><span>${p.EngineModel||"—"}</span></div>
        <div class="sf-row"><label>Engine Serial Number</label><span>${p.EngineSerial||"—"}</span><label>${L.arrangement}</label><span>${p.EngineArrangement||"—"}</span></div>
        <div class="sf-row"><label>RPM and Capacity</label><span>${p.RPMCapacity||"—"}</span><label>Current Running Hours</label><span>${p.RunningHours||"—"}</span></div>
        <div class="sf-row"><label>Customer In-Charge</label><span>${p.CustomerIncharge||"—"}</span><label>Neptunus Team Leader</label><span>${p.TeamLeader||"—"}</span></div>
        <div class="sf-row full"><label>Neptunus Members</label><span>${p.Members||"—"}</span></div>
        `; })()}
      </div>
    </div>`;

    // History
    if (w.historyActive) {
      const h = w.history;
      html += `<div class="sf-section"><h2 class="sf-heading">History</h2>
        ${Object.entries({
          "Last Overhauling Type and Carried By": h.lastOverhaulType + (h.lastOverhaulBy ? " / " + h.lastOverhaulBy : ""),
          "Running Hours at Last Maintenance": h.runningHoursAtMaint,
          "Observations (Prior Dismantling)": h.observations,
          "Log Leakages / Abnormalities": h.logLeakages,
          "Bearing Size – Con Rod Journal": h.bearingConRod,
          "Bearing Size – Main Journal": h.bearingMainJournal,
          "Turbo Details": h.turboDetails,
          "Geislinger Coupling Details": h.geislingerDetails,
          "Governor Details": h.governorDetails,
          "Gauge Conditions": h.gaugeConditions,
        }).map(([k,v]) => v ? `<div class="sf-kv"><label>${k}</label><span contenteditable="true">${v}</span></div>` : "").join("")}
      </div>`;
    }

    // Scope of Work — mandays will come after
    const isCatEmdRp = (p.EngineType === 'cat' || p.EngineType === 'emd');
    if (w.scopeActive) {
      const etSf = p.EngineType || 'niigata';
      const isCESf = (etSf === 'cat' || etSf === 'emd');
      if (isCESf && w.catEmdScope?.length) {
        html += `<div class="sf-section"><h2 class="sf-heading">Scope of Work</h2>
          <table class="sf-table"><thead><tr><th style="width:6%">Sr.</th><th>Contents</th><th style="width:15%">Included (Yes/No)</th></tr></thead><tbody>
            ${w.catEmdScope.map(r => r.type === 'heading'
              ? `<tr><td colspan="3" style="background:rgba(255,255,255,0.06);font-weight:700;text-align:center" contenteditable="true">${r.text}</td></tr>`
              : `<tr><td>${r.sr}</td><td contenteditable="true">${r.contents}</td><td contenteditable="true">${r.included||'NA'}</td></tr>`
            ).join("")}
          </tbody></table></div>`;
      } else if (!isCESf && w.scopeOfWork?.length) {
        html += `<div class="sf-section"><h2 class="sf-heading">Scope of Work</h2>
          <table class="sf-table"><thead><tr><th>Original Scope</th><th>What Was Done</th></tr></thead><tbody>
            ${w.scopeOfWork.map(r => `<tr><td contenteditable="true">${r.original}</td><td contenteditable="true">${r.done}</td></tr>`).join("")}
          </tbody></table></div>`;
      }
    }

    // Deviations
    if (w.deviationsActive) {
      html += `<div class="sf-section"><h2 class="sf-heading">Deviations & Reference Notes</h2>
        <div class="sf-kv"><label>Next Maintenance Type & Date</label><span contenteditable="true">${w.deviations.nextMaintType} ${w.deviations.nextMaintDate}</span></div>
        <div class="sf-kv"><label>Parts Renewal Required</label><span contenteditable="true">${w.deviations.partsRenewal}</span></div>
      </div>`;
    }

    // Maintenance Summary
    html += `<div class="sf-section"><h2 class="sf-heading">Maintenance Summary</h2>
      ${w.maintItems.map(item => item.type === "heading" ? `<h3 class="sf-maint-heading" contenteditable="true">${item.text}</h3>` : `<div class="sf-bullet"><span>•</span><span contenteditable="true">${item.text}</span></div>`).join("")}
    </div>`;

    // DWR points removed from final preview — use 💡 DWR Insights button in builder instead
    // Scope for Improvement
    html += `<div class="sf-section"><h2 class="sf-heading">Scope for Improvement</h2>
      <table class="sf-table"><thead><tr><th>Sr. No.</th><th>Area</th><th>Observations</th><th>Recommendations</th></tr></thead><tbody>
        ${w.scopeForImprovement.map((r,i) => `<tr><td>${i+1}</td><td contenteditable="true">${r.area}</td><td contenteditable="true">${r.observations}</td><td contenteditable="true">${r.recommendations}</td></tr>`).join("")}
      </tbody></table></div>`;

    // Recommendations
    html += `<div class="sf-section"><h2 class="sf-heading">Recommendations</h2>
      <p class="sf-rec-intro">The engine post overhaul must be closely monitored for any abnormalities which could cause serious breakdowns. It is a known fact that most breakdowns on overhauled engines occur within the first 100 hours post overhaul. We therefore, recommend the following:</p>
      <ol class="sf-rec-list">${w.recommendations.map(r => `<li contenteditable="true">${r}</li>`).join("")}</ol>
    </div>`;

    // Calibration Tables
    if (w.calibrationTables.length > 0) {
      html += `<div class="sf-section"><h2 class="sf-heading">Annexure — Calibration Reports</h2>
        ${w.calibrationTables.map(t => `
          <div class="sf-cal-block">
            <h3 class="sf-cal-title" contenteditable="true">${t.name}</h3>
            ${t.hasImage && t.imageBase64 ? `<div class="sf-cal-image-row"><img src="${t.imageBase64}" class="sf-cal-img" /><p class="sf-cal-note" contenteditable="true">${t.note||""}</p></div>` : t.note ? `<p class="sf-cal-note" contenteditable="true">${t.note}</p>` : ""}
            <table class="sf-table">
              <thead><tr>${t.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
              <tbody>${t.rows.map(row => `<tr>${row.map(cell => `<td contenteditable="true">${cell}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>
          </div>`).join("")}
      </div>`;
    }

    // Parts
    if (w.partsColumns.rows?.length) {
      html += `<div class="sf-section"><h2 class="sf-heading">Parts Consumed List</h2>
        <table class="sf-table"><thead><tr>${w.partsColumns.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${w.partsColumns.rows.map(row => `<tr>${row.map(cell => `<td contenteditable="true">${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>
      </div>`;
    }

    // Photos
    const realPhotos = w.photos.filter(ph => ph.src);
    if (realPhotos.length > 0) {
      html += `<div class="sf-section"><h2 class="sf-heading">Photo Gallery</h2>
        <div class="sf-photo-grid">
          ${realPhotos.map(ph => `<div class="sf-photo-item"><img src="${ph.src}" /><div class="sf-photo-caption"><strong contenteditable="true">${ph.title||"(no title)"}</strong>${ph.description ? `<br/><span contenteditable="true">${ph.description}</span>` : ""}</div></div>`).join("")}
        </div>
      </div>`;
    }

    // Sign-off
    html += `<div class="sf-section sf-signoff"><h2 class="sf-heading">Sign-off</h2>
      <div class="sf-signoff-grid">
        <div><h4>On behalf of Neptunus</h4><div class="sf-kv"><label>Maker</label><span contenteditable="true">${w.signoff.makerName}</span></div><div class="sf-kv"><label>Checker</label><span contenteditable="true">${w.signoff.checkerName}</span></div><div class="sf-kv"><label>Approver</label><span contenteditable="true">${w.signoff.approverName}</span></div><div class="sf-kv"><label>Date</label><span contenteditable="true">${w.signoff.makerDate}</span></div></div>
        <div><h4>On behalf of Customer</h4><div class="sf-kv"><label>Name</label><span contenteditable="true">${w.signoff.customerName}</span></div><div class="sf-kv"><label>Date</label><span contenteditable="true">${w.signoff.customerDate}</span></div></div>
      </div>
    </div>`;

    html += `</div>`;
    document.getElementById("sf-preview-content").innerHTML = html;
  },

  async runGrammarCheck() {
    const previewEl = document.getElementById("sf-preview-content");
    const text = previewEl.innerText.substring(0, 8000);
    document.getElementById("grammar-sidebar").classList.remove("hidden");
    document.getElementById("grammar-results").innerHTML = `<div class="grammar-loading">⏳ Analysing text...</div>`;

    try {
      const resp = await fetch(`${CONFIG.WORKER_URL}/grammar-check`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({text})
      });
      const data = await resp.json();
      State.grammarSuggestions = data.suggestions || [];
      App.renderGrammarSuggestions();
    } catch (err) {
      document.getElementById("grammar-results").innerHTML = `<div class="grammar-error">Failed to run check. Try again.</div>`;
    }
  },

  renderGrammarSuggestions() {
    const suggestions = State.grammarSuggestions;
    if (!suggestions.length) { document.getElementById("grammar-results").innerHTML = `<div class="grammar-ok">✓ No suggestions found. Looks great!</div>`; return; }
    document.getElementById("grammar-results").innerHTML = suggestions.map((s, i) => `
      <div class="grammar-item grammar-${s.type}" id="gs-${i}">
        <div class="grammar-type-badge">${s.type}</div>
        <div class="grammar-original">"${s.original}"</div>
        <div class="grammar-arrow">→</div>
        <div class="grammar-suggestion">"${s.suggestion}"</div>
        <div class="grammar-explanation">${s.explanation}</div>
        <div class="grammar-actions">
          <button class="grammar-accept" onclick="App.acceptSuggestion(${i})">✓ Accept</button>
          <button class="grammar-ignore" onclick="App.ignoreSuggestion(${i})">Ignore</button>
        </div>
      </div>`).join("");
  },

  acceptSuggestion(i) {
    const s = State.grammarSuggestions[i];
    const content = document.getElementById("sf-preview-content");
    content.innerHTML = content.innerHTML.replace(new RegExp(s.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), s.suggestion);
    document.getElementById(`gs-${i}`).classList.add("accepted");
    document.getElementById(`gs-${i}`).style.opacity = "0.4";
  },

  ignoreSuggestion(i) { document.getElementById(`gs-${i}`).style.opacity = "0.4"; },

  closeGrammarSidebar() { document.getElementById("grammar-sidebar").classList.add("hidden"); },

  // ── Section save functions (Drive-persisted) ─────────────
  saveDeviationsSection() {
    const w = State.currentDraft.wcr;
    if (w.deviationsActive) {
      w.deviations = {
        nextMaintType: document.getElementById("dev-nextType")?.value||"",
        nextMaintDate: document.getElementById("dev-nextDate")?.value||"",
        partsRenewal:  document.getElementById("dev-parts")?.value||""
      };
    }
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Deviations saved.", "success");
  },

  saveScopeForImprovement() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Scope for Improvement saved.", "success");
  },

  saveRecommendations() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Recommendations saved.", "success");
  },

  saveCalibrationTables() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Calibration Tables saved.", "success");
  },

  savePartsSection() {
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Parts list saved.", "success");
  },

  savePhotosSection() {
    // Collect any pending photo title/desc updates
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Photos saved.", "success");
  },

  saveSignoffSection() {
    const w = State.currentDraft.wcr;
    w.signoff = {
      makerName:    document.getElementById("so-maker")?.value||"",
      checkerName:  document.getElementById("so-checker")?.value||"",
      approverName: document.getElementById("so-approver")?.value||"",
      makerDate:    document.getElementById("so-makerdate")?.value||"",
      customerName: document.getElementById("so-custname")?.value||"",
      customerDate: document.getElementById("so-custdate")?.value||""
    };
    State.currentDraft.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Sign-off saved.", "success");
  },

};  // end App

// ── AUTO-SAVE: debounced Drive write after any field change ──
const AutoSave = {
  _timer: null,
  _saveIndicator: null,

  // Call this whenever any WCR field changes
  trigger() {
    if (!State.currentDraft) return;
    // Show "Saving..." indicator
    AutoSave._showStatus("saving");
    // Debounce — wait 2s after last change before writing to Drive
    clearTimeout(AutoSave._timer);
    AutoSave._timer = setTimeout(() => {
      AutoSave._flush();
    }, 2000);
  },

  async _flush() {
    if (!State.currentDraft) return;
    // Capture any open form fields before saving
    const w = State.currentDraft.wcr;
    if (w.deviationsActive) {
      const nt = document.getElementById("dev-nextType");
      const nd = document.getElementById("dev-nextDate");
      const dp = document.getElementById("dev-parts");
      if (nt) w.deviations.nextMaintType = nt.value;
      if (nd) w.deviations.nextMaintDate = nd.value;
      if (dp) w.deviations.partsRenewal = dp.value;
    }
    const soFields = {makerName:"so-maker",checkerName:"so-checker",approverName:"so-approver",makerDate:"so-makerdate",customerName:"so-custname",customerDate:"so-custdate"};
    Object.entries(soFields).forEach(([k,id]) => { const el = document.getElementById(id); if (el) w.signoff[k] = el.value; });
    State.currentDraft.updatedAt = new Date().toISOString();
    await App.saveDrafts();
    AutoSave._showStatus("saved");
  },

  _showStatus(state) {
    const el = document.getElementById("autosave-indicator");
    if (!el) return;
    if (state === "saving") {
      el.textContent = "⏳ Saving...";
      el.style.color = "var(--amber-dim)";
    } else {
      el.textContent = "✓ Saved";
      el.style.color = "#7ef59a";
      setTimeout(() => { if (el.textContent === "✓ Saved") el.textContent = ""; }, 3000);
    }
  }
};

// ── HELPERS ──────────────────────────────────────────────
async function gapi_fetch(url, options = {}) {
  // Auto-refresh token if close to expiry
  if (!Auth.isValid()) {
    const ok = await Auth.ensureValid();
    if (!ok) { Toast.show("Google session expired. Please log in again.", "error"); throw new Error("Token expired"); }
  }
  return fetch(url, {
    ...options,
    headers: { "Authorization": `Bearer ${State.googleToken}`, ...(options.headers||{}) }
  });
}

function formatDate(iso, withTime) {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  if (!withTime) return date;
  const time = d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
  return `${date} at ${time}`;
}
function expiryDate(iso, days) {
  if (!iso) return "—";
  const d = new Date(iso); d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

const Toast = {
  timer: null,
  show(msg, type = "default") {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg; el.className = `toast show ${type}`;
    clearTimeout(Toast.timer);
    Toast.timer = setTimeout(() => el.classList.remove("show"), 3500);
  }
};

App.init();
