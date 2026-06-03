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
    note: "The deflection measurements should be made when the engine is cold (Refer to Section 4.7)\nIndication Reading: (+ve) / (-ve)\nPermissible Limit: 0.07 mm",
    hasImage: true, builtinImage: true, imageKey: "crankshaft",
    headers: ["Crankpin Position","1","2","3","4","5","6","7","8","Remarks"],
    rows: [
      ["1","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["2","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["3","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["4","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["5","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
    ]
  },

  // ── STBD Crankshaft Deflection ──────────────────────────
  stbdCrankshaft: {
    name: "STBD M/E — Crankshaft Deflection Measurement",
    note: "The deflection measurements should be made when the engine is cold (Refer to Section 4.7)\nIndication Reading: (+ve) / (-ve)\nPermissible Limit: 0.07 mm",
    hasImage: true, builtinImage: true, imageKey: "crankshaft",
    headers: ["Crankpin Position","1","2","3","4","5","6","7","8","Remarks"],
    rows: [
      ["1","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["2","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["3","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["4","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["5","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
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
    hasImage: false,
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
    hasImage: false,
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

  // ── Custom Table ────────────────────────────────────────
  custom: {
    name: "Custom Table",
    note: "",
    hasImage: false,
    headers: ["Column 1","Column 2","Column 3"],
    rows: [["","",""],["","",""],["","",""]]
  },

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
  push(action) { State.undoStack.push(action); if (State.undoStack.length > 50) State.undoStack.shift(); },
  pop() { return State.undoStack.pop(); },
  last() { const a = this.pop(); if (!a) { Toast.show("Nothing to undo."); return; } a(); Toast.show("Action undone."); }
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
    const myDrafts = State.drafts.filter(d => d.empNo === State.currentUser.empNo);
    document.getElementById("draft-count").textContent = `${myDrafts.length} / ${CONFIG.MAX_DRAFTS}`;
    if (myDrafts.length === 0) { list.innerHTML = `<div class="empty-state">No drafts yet. Start a new report above.</div>`; return; }
    list.innerHTML = myDrafts.map(d => `
      <div class="draft-card" onclick="App.openDraft('${d.id}')">
        <div class="draft-card-left">
          <div class="draft-card-code">${d.projectCode}</div>
          <div class="draft-card-name">${d.projectData?.CustomerName||"—"} · ${d.projectData?.Vessel||"—"}</div>
          <div class="draft-card-meta">Updated ${formatDate(d.updatedAt)} · Expires ${expiryDate(d.createdAt, CONFIG.DRAFT_EXPIRY_DAYS)}</div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill draft">Draft</span>
          <button class="delete-draft" onclick="event.stopPropagation(); App.deleteDraft('${d.id}')" title="Delete">✕</button>
        </div>
      </div>`).join("");
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
    document.getElementById("rp-mode-label").textContent = mode === "hod" ? "HOD Review Mode — click any section to comment" : "Your submitted draft";

    // Show/hide controls
    document.getElementById("hod-controls").classList.toggle("hidden", mode !== "hod");
    document.getElementById("engineer-controls").classList.toggle("hidden", mode !== "engineer");

    App.renderReviewContent(draft, mode);
    App.renderCommentsSidebar(draft, mode);
  },

  renderReviewContent(draft, mode) {
    const w = draft.wcr;
    const p = draft.projectData;
    const DGRAMS = (typeof DIAGRAMS !== "undefined") ? DIAGRAMS : {};
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

    // Scope of Work
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

    // Maintenance Summary
    let mHtml = (w.maintItems||[]).map(item =>
      item.type === "heading" ? `<h3 class="rp-maint-h">${item.text}</h3>` : `<div class="rp-bullet"><span>•</span><span>${item.text}</span></div>`
    ).join("");
    // Add DWR points to maintenance preview
    const keptDWRPts = (w.dwrPoints || []).filter(p => p.keep);
    if (keptDWRPts.length) {
      mHtml += `<div style="margin-top:10px;padding:8px;border-left:3px solid var(--amber);background:rgba(232,160,32,0.07)"><div style="font-size:9px;color:var(--amber);font-weight:700;margin-bottom:6px;text-transform:uppercase">Points from DWR</div>${keptDWRPts.map(p=>`<div class="rp-bullet"><span style="color:var(--amber)">▸</span><span>${p.text}</span></div>`).join("")}</div>`;
    }
    html += section("maint", "Maintenance Summary", mHtml);

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
    const hasImage = !!State.vesselImageBase64;
    if (!hasImage) emptyFields.push("Vessel / Customer Image");
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
    document.getElementById("dwr-upload-section").classList.add("hidden");
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
      document.getElementById("dwr-upload-section").classList.remove("hidden");
    } catch (err) { Toast.show("Could not read project data.", "error"); }
  },

  /* ══════════════════════════════════════════════════════
     DWR UPLOAD + PARSING
  ══════════════════════════════════════════════════════ */
  async loadDWRData() {
    const input = document.getElementById("dwr-file-input");
    const files = Array.from(input.files);
    if (files.length === 0) { Toast.show("Please select at least one DWR PDF.", "error"); return; }

    const btn = document.getElementById("load-dwr-btn");
    btn.textContent = "⏳ Parsing DWRs...";
    btn.disabled = true;

    try {
      const pdfBase64Array = await Promise.all(files.map(f => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      })));

      const resp = await fetch(`${CONFIG.WORKER_URL}/parse-dwr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64Array })
      });

      const parsed = await resp.json();
      State.dvrParsedData = parsed;
      document.getElementById("dwr-status").textContent = `✓ Added all necessary inputs from ${files.length} DWR(s) — ${parsed.maintPoints?.length || 0} maintenance points, ${parsed.recommendations?.length || 0} recommendations, ${parsed.photoDescriptions?.length || 0} photo references extracted.`;
      document.getElementById("dwr-status").className = "dwr-status success";
      Toast.show("DWR data loaded successfully.", "success");
    } catch (err) {
      document.getElementById("dwr-status").textContent = "Failed to parse DWRs. Check your connection.";
      document.getElementById("dwr-status").className = "dwr-status error";
    } finally {
      btn.textContent = "Load Data from DWRs";
      btn.disabled = false;
    }
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
    };
    reader.readAsDataURL(file);
    event.target.value = "";
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
    // Signoff
    const so = w.signoff;
    ["maker","checker","approver","makerdate","custname","custdate"].forEach(k => { const el = document.getElementById(`so-${k}`); if (el) el.value = so[k === "maker" ? "makerName" : k === "checker" ? "checkerName" : k === "approver" ? "approverName" : k === "makerdate" ? "makerDate" : k === "custname" ? "customerName" : "customerDate"] || ""; });
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

  updateHistoryRowValue(i, val) { State.currentDraft.wcr.historyRows[i].value = val; },
  updateHistoryRowLabel(i, val) { State.currentDraft.wcr.historyRows[i].label = val; },
  updateHistorySubCell(i, ri, ci, val) { State.currentDraft.wcr.historyRows[i].rows[ri][ci] = val; },
  addHistorySubRow(i) {
    const r = State.currentDraft.wcr.historyRows[i];
    const cols = (r.headers || r.subheaders || []).length;
    r.rows.push(new Array(cols).fill(''));
    r.rows[r.rows.length-1][0] = 'Reading';
    App.renderHistoryRows();
  },
  addHistoryRow() {
    if (!State.currentDraft.wcr.historyRows) State.currentDraft.wcr.historyRows = [];
    State.currentDraft.wcr.historyRows.push({type:'custom', label:'New Field', value:''});
    App.renderHistoryRows();
  },
  deleteHistoryRow(i) { State.currentDraft.wcr.historyRows.splice(i,1); App.renderHistoryRows(); },
  saveHistorySection() {
    State.currentDraft.updatedAt = new Date().toISOString();
    Toast.show("History section saved.", "success");
  },

  // Legacy compat
  updateHistoryRow(i, field, val) {
    if (field === 'label') App.updateHistoryRowLabel(i, val);
    else App.updateHistoryRowValue(i, val);
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
    let html = `<div class="cat-scope-wrap">
      <table class="cat-scope-table">
        <thead><tr><th style="width:6%">Sr. No.</th><th>Contents</th><th style="width:15%">Included (Yes/No)</th><th style="width:36px"></th></tr></thead>
        <tbody>`;
    rows.forEach((r, i) => {
      if (r.type === 'heading') {
        html += `<tr class="cat-scope-heading-row">
          <td colspan="3"><input class="cat-scope-heading-input" value="${r.text}" oninput="App.updateCatScopeHeading(${i},this.value)" /></td>
          <td><button class="row-del-btn" onclick="App.deleteCatScopeRow(${i})">✕</button></td>
        </tr>`;
      } else {
        html += `<tr class="cat-scope-item-row">
          <td class="cat-scope-sr">${r.sr}</td>
          <td><textarea class="cat-scope-contents" oninput="App.updateCatScopeField(${i},'contents',this.value)">${r.contents}</textarea></td>
          <td><input class="cat-scope-included form-input" value="${r.included}" placeholder="Yes / No / NA" oninput="App.updateCatScopeField(${i},'included',this.value)" /></td>
          <td><button class="row-del-btn" onclick="App.deleteCatScopeRow(${i})">✕</button></td>
        </tr>`;
      }
    });
    html += `</tbody></table></div>
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
      <button class="add-row-btn" onclick="App.addCatScopeHeading()">+ Add Section</button>
      <button class="add-row-btn" onclick="App.addCatScopeItem()">+ Add Item</button>
      <button class="btn-save-history" onclick="App.saveScopeSection()">💾 Save Scope</button>
    </div>`;
    document.getElementById("scope-rows").innerHTML = html;
  },

  updateCatScopeHeading(i, v) { State.currentDraft.wcr.catEmdScope[i].text = v; },
  updateCatScopeField(i, f, v) { State.currentDraft.wcr.catEmdScope[i][f] = v; },
  addCatScopeHeading() {
    State.currentDraft.wcr.catEmdScope.push({ type:'heading', text:'New Section' });
    App.renderCatEmdScope();
  },
  addCatScopeItem() {
    const items = State.currentDraft.wcr.catEmdScope.filter(r => r.type === 'item');
    State.currentDraft.wcr.catEmdScope.push({ type:'item', sr: String(items.length + 1), contents:'', included:'' });
    App.renderCatEmdScope();
  },
  deleteCatScopeRow(i) {
    State.currentDraft.wcr.catEmdScope.splice(i, 1);
    App.renderCatEmdScope();
  },
  saveScopeSection() {
    State.currentDraft.updatedAt = new Date().toISOString();
    Toast.show("Scope of Work saved.", "success");
  },

  updateScopeRow(i, f, v) { State.currentDraft.wcr.scopeOfWork[i][f] = v; },
  addScopeRow() { const prev = [...State.currentDraft.wcr.scopeOfWork]; Undo.push(() => { State.currentDraft.wcr.scopeOfWork = prev; App.renderScopeOfWork(); }); State.currentDraft.wcr.scopeOfWork.push({original:"",done:""}); App.renderScopeOfWork(); },
  deleteScopeRow(i) { const prev = [...State.currentDraft.wcr.scopeOfWork]; Undo.push(() => { State.currentDraft.wcr.scopeOfWork = prev; App.renderScopeOfWork(); }); State.currentDraft.wcr.scopeOfWork.splice(i,1); App.renderScopeOfWork(); },

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
    }
  },

  // ── Maintenance Summary ──
  renderMaintSummary() {
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
    }).join("");
  },

  updateMaintItem(id, field, val) { const item = State.currentDraft.wcr.maintItems.find(m => m.id === id); if (item) item[field] = val; },

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
    Undo.push(() => { State.currentDraft.wcr.maintItems = prev; App.renderMaintSummary(); });
    const newItem = { type, text: type === "heading" ? "New Section" : "", id: "mi_" + Math.random().toString(36).substr(2,8) };
    State.currentDraft.wcr.maintItems.splice(afterIndex + 1, 0, newItem);
    App.renderMaintSummary();
  },

  deleteMaintItem(id) {
    const prev = State.currentDraft.wcr.maintItems.map(m => ({...m}));
    Undo.push(() => { State.currentDraft.wcr.maintItems = prev; App.renderMaintSummary(); });
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
      </div>`).join("");
  },

  updateSFI(i, f, v) { State.currentDraft.wcr.scopeForImprovement[i][f] = v; },
  addSFI() { const prev = State.currentDraft.wcr.scopeForImprovement.map(r => ({...r})); Undo.push(() => { State.currentDraft.wcr.scopeForImprovement = prev; App.renderScopeForImprovement(); }); State.currentDraft.wcr.scopeForImprovement.push({area:"",observations:"",recommendations:""}); App.renderScopeForImprovement(); },
  deleteSFI(i) { const prev = State.currentDraft.wcr.scopeForImprovement.map(r => ({...r})); Undo.push(() => { State.currentDraft.wcr.scopeForImprovement = prev; App.renderScopeForImprovement(); }); State.currentDraft.wcr.scopeForImprovement.splice(i,1); App.renderScopeForImprovement(); },

  // ── Recommendations ──
  renderRecommendations() {
    const items = State.currentDraft.wcr.recommendations;
    document.getElementById("rec-rows").innerHTML = items.map((r, i) => `
      <div class="rec-row">
        <span class="rec-num">${i+1}.</span>
        <textarea class="form-input rec-cell" oninput="App.updateRec(${i},this.value)">${r}</textarea>
        <button class="row-del-btn" onclick="App.deleteRec(${i})">✕</button>
      </div>`).join("");
  },

  updateRec(i, v) { State.currentDraft.wcr.recommendations[i] = v; },
  addRec() { const prev = [...State.currentDraft.wcr.recommendations]; Undo.push(() => { State.currentDraft.wcr.recommendations = prev; App.renderRecommendations(); }); State.currentDraft.wcr.recommendations.push(""); App.renderRecommendations(); },
  deleteRec(i) { const prev = [...State.currentDraft.wcr.recommendations]; Undo.push(() => { State.currentDraft.wcr.recommendations = prev; App.renderRecommendations(); }); State.currentDraft.wcr.recommendations.splice(i,1); App.renderRecommendations(); },

  // ── Calibration Tables ──
  showTablePalette() { document.getElementById("table-palette").classList.toggle("hidden"); },

  insertTable(templateKey) {
    const tmpl = TABLE_TEMPLATES[templateKey];
    const imgKey = tmpl.imageKey || templateKey;
    const builtinImg = (typeof DIAGRAMS !== 'undefined') && DIAGRAMS[imgKey] ? DIAGRAMS[imgKey] : null;
    const table = { id:"tbl_"+Date.now(), templateKey, name:tmpl.name, note:tmpl.note, hasImage:tmpl.hasImage||false, imageBase64:builtinImg, imageSrc:null, headers:[...tmpl.headers], rows:tmpl.rows.map(r=>[...r]) };
    const prev = State.currentDraft.wcr.calibrationTables.map(t => ({...t, rows:t.rows.map(r=>[...r]), headers:[...t.headers]}));
    Undo.push(() => { State.currentDraft.wcr.calibrationTables = prev; App.renderCalibrationTables(); });
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
            <div class="cal-image-box" onclick="document.getElementById('cal-img-${ti}').click()">
              ${t.imageBase64 ? `<img src="${t.imageBase64}" class="cal-img-preview" />` : `<span class="cal-img-placeholder">📷 Click to add diagram image</span>`}
            </div>
            <input type="file" id="cal-img-${ti}" accept="image/*" style="display:none" onchange="App.onCalImageSelect(${ti},event)" />
            <textarea class="form-input cal-note-edit" rows="4" oninput="App.updateTableNote(${ti},this.value)">${t.note||""}</textarea>
          </div>` : t.note ? `<div class="cal-table-note"><textarea class="form-input cal-note-edit" rows="2" oninput="App.updateTableNote(${ti},this.value)">${t.note}</textarea></div>` : ""}
        <div class="cal-table-scroll">
          <table class="cal-editable-table">
            <thead><tr>${t.headers.map((h,hi) => `<th><input class="th-input" value="${h}" oninput="App.updateHeader(${ti},${hi},this.value)" /><button class="col-del" onclick="App.deleteCol(${ti},${hi})">✕</button></th>`).join("")}<th><button class="add-col-btn" onclick="App.addCol(${ti})">+ Col</button></th></tr></thead>
            <tbody>${t.rows.map((row,ri) => `<tr>${row.map((cell,ci) => `<td><input class="td-input" value="${cell}" oninput="App.updateCell(${ti},${ri},${ci},this.value)" /></td>`).join("")}<td><button class="row-del-btn" onclick="App.deleteTableRow(${ti},${ri})">✕</button></td></tr>`).join("")}</tbody>
          </table>
        </div>
        <button class="add-row-btn" onclick="App.addTableRow(${ti})">+ Add Row</button>
      </div>`).join("");
  },

  onCalImageSelect(ti, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { State.currentDraft.wcr.calibrationTables[ti].imageBase64 = e.target.result; App.renderCalibrationTables(); };
    reader.readAsDataURL(file);
  },

  updateTableName(ti, v) { State.currentDraft.wcr.calibrationTables[ti].name = v; },
  updateTableNote(ti, v) { State.currentDraft.wcr.calibrationTables[ti].note = v; },
  updateHeader(ti, hi, v) { State.currentDraft.wcr.calibrationTables[ti].headers[hi] = v; },
  updateCell(ti, ri, ci, v) { State.currentDraft.wcr.calibrationTables[ti].rows[ri][ci] = v; },

  deleteTable(ti) {
    if (!confirm("Delete this table?")) return;
    const prev = State.currentDraft.wcr.calibrationTables.map(t => ({...t}));
    Undo.push(() => { State.currentDraft.wcr.calibrationTables = prev; App.renderCalibrationTables(); });
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
    const container = document.getElementById("parts-container");
    container.innerHTML = `
      <p class="wcr-section-hint">Paste each column from your spreadsheet into the boxes below, then click "Finalise Column". Once all columns are done, click "Preview Parts Table".</p>
      <div class="parts-paste-grid">
        ${p.headers.map((h, i) => `
          <div class="parts-paste-col">
            <div class="parts-paste-header">${h}</div>
            <textarea class="form-input parts-paste-area" placeholder="Paste ${h} data here..." oninput="App.updatePartsPaste(${i},this.value)">${p.rawPaste[i]||""}</textarea>
            <button class="finalise-col-btn ${p.rawPaste[i]?.trim() ? 'done' : ''}" onclick="App.finalisePartsCol(${i})">Finalise Column ✓</button>
          </div>`).join("")}
      </div>
      <button class="btn-full mt" onclick="App.previewPartsTable()">Preview Parts Table →</button>
    `;
  },

  updatePartsPaste(i, val) { State.currentDraft.wcr.partsColumns.rawPaste[i] = val; },

  finalisePartsCol(i) {
    const p = State.currentDraft.wcr.partsColumns;
    const raw = p.rawPaste[i] || "";
    // Split by newlines, preserve gaps
    const lines = raw.split("\n").map(l => l.trim());
    p._finalisedCols = p._finalisedCols || {};
    p._finalisedCols[i] = lines;
    Toast.show(`Column "${p.headers[i]}" finalised.`, "success");
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
    `;
  },

  resetPartsPaste() { State.currentDraft.wcr.partsColumns.rows = null; App.renderPartsPaste(); },
  updatePartsHeader(hi, v) { State.currentDraft.wcr.partsColumns.headers[hi] = v; App.renderPartsTable(); },
  updatePartsCell(ri, ci, v) { State.currentDraft.wcr.partsColumns.rows[ri][ci] = v; },
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
        App.renderPhotos();
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
      </div>`).join("");
  },

  replacePhoto(i, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { State.currentDraft.wcr.photos[i].src = e.target.result; App.renderPhotos(); };
    reader.readAsDataURL(file);
  },

  updatePhoto(i, f, v) { State.currentDraft.wcr.photos[i][f] = v; },
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

  _generateAndPrintPDF(draft) {
    const w = draft.wcr;
    const p = draft.projectData;
    const LOGO  = (typeof LOGO_B64  !== "undefined") ? LOGO_B64  : "";
    const DGRAMS = (typeof DIAGRAMS !== "undefined") ? DIAGRAMS  : {};

    const FOOTER_TEXT = "Neptunus Power Plant Services Pvt. Ltd. &nbsp;|&nbsp; A-554/555, TTC Industrial Area, MIDC, Mahape, Navi Mumbai – 400 710, India &nbsp;|&nbsp; Tel: +91 22 41410707 &nbsp;|&nbsp; www.neptunus-power.com &nbsp;|&nbsp; info@neptunus-power.com";

    const CSS = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; }
      @page { size: A4; margin: 0; }
      .page { width: 210mm; min-height: 297mm; padding: 18mm 14mm 24mm 14mm; position: relative; page-break-after: always; }
      .page-header { display: flex; align-items: center; justify-content: space-between;
        border-bottom: 2px solid #003366; padding-bottom: 5px; margin-bottom: 14px; }
      .page-header-title { font-size: 11pt; font-weight: bold; color: #003366; }
      .page-header img { height: 36px; width: auto; }
      .page-footer { position: absolute; bottom: 8mm; left: 14mm; right: 14mm;
        border-top: 1px solid #003366; padding-top: 4px; font-size: 7pt;
        color: #555; text-align: center; }
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
      .cal-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
      .cal-row img { width: 120px; flex-shrink: 0; }
      .cal-note { font-size: 8pt; line-height: 1.6; flex: 1; }
      .photo-grid { width: 100%; border-collapse: collapse; }
      .photo-grid td { border: 1px solid #aaa; padding: 6px; text-align: center; width: 50%; vertical-align: top; }
      .photo-grid img { width: 100%; max-height: 190px; object-fit: cover; display: block; }
      .pcap { font-size: 8.5pt; font-weight: bold; text-transform: uppercase; margin-top: 4px; }
      .pdesc { font-size: 7.5pt; color: #444; margin-top: 2px; }
    `;

    const hdr = () => `
      <div class="page-header">
        <span class="page-header-title">Work Completion Report &mdash; ${p.CustomerName||draft.projectCode}</span>
        ${LOGO ? `<img src="${LOGO}" alt="NPPS" />` : `<span style="font-weight:bold;color:#003366">NEPTUNUS</span>`}
      </div>`;
    const ftr = () => `<div class="page-footer">${FOOTER_TEXT}</div>`;

    // ── Page 1: Cover ──
    let pages = `<div class="page">${hdr()}`;
    pages += `<h1>Work Completion Report</h1>`;
    if (p.CustomerName) pages += `<p style="text-align:center;font-size:12pt;font-weight:bold;color:#003366;margin:4px 0 10px">${p.CustomerName}</p>`;
    if (p.VesselImageBase64) pages += `<div style="text-align:center;margin:10px 0"><img src="${p.VesselImageBase64}" style="max-width:90%;max-height:200px;object-fit:contain"/></div>`;
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

    // Scope of Work
    if (w.scopeActive) {
      const et = p.EngineType || 'niigata';
      const isCE = (et === 'cat' || et === 'emd');
      if (isCE && w.catEmdScope?.length) {
        body += `<h2>Scope of Work</h2><table><thead><tr><th style="width:6%">Sr.</th><th>Contents</th><th style="width:15%">Included (Yes/No)</th></tr></thead><tbody>`;
        w.catEmdScope.forEach(r => {
          if (r.type === 'heading') {
            body += `<tr><td colspan="3" style="background:#dde4ef;font-weight:bold;text-align:center">${r.text}</td></tr>`;
          } else {
            const inc = r.included && r.included.trim() ? r.included : 'NA';
            body += `<tr><td style="text-align:center">${r.sr}</td><td>${r.contents||'—'}</td><td style="text-align:center">${inc}</td></tr>`;
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

    // Maintenance Summary
    body += `<h2>Maintenance Summary</h2>`;
    let inUL = false;
    (w.maintItems||[]).forEach(item => {
      if (item.type === "heading") { if (inUL) { body += `</ul>`; inUL = false; } body += `<h3>${item.text}</h3>`; }
      else { if (!inUL) { body += `<ul>`; inUL = true; } body += `<li>${item.text}</li>`; }
    });
    if (inUL) body += `</ul>`;

    // Scope for Improvement
    body += `<h2>Scope for Improvement</h2><table><tr><th>No.</th><th>Area</th><th>Observations</th><th>Recommendations</th></tr>`;
    (w.scopeForImprovement||[]).forEach((r,i) => { body += `<tr><td style="text-align:center">${i+1}</td><td>${r.area||"—"}</td><td>${r.observations||"—"}</td><td>${r.recommendations||"—"}</td></tr>`; });
    body += `</table>`;

    // Recommendations
    body += `<h2>Recommendations</h2><p style="font-size:8.5pt;margin-bottom:6px">The engine post overhaul must be closely monitored for any abnormalities which could cause serious breakdowns. It is a known fact that most breakdowns on overhauled engines occur within the first 100 hours post overhaul. We therefore, recommend the following:</p><ol>`;
    (w.recommendations||[]).forEach(r => { body += `<li>${r}</li>`; });
    body += `</ol>`;

    body += ftr() + `</div>`;

    // ── Calibration Tables page ──
    if (w.calibrationTables?.length) {
      body += `<div class="page">${hdr()}<h2>Annexure 1 &mdash; Calibration Sheet</h2>`;
      w.calibrationTables.forEach(t => {
        const imgSrc = t.imageBase64 || DGRAMS[t.templateKey] || null;
        body += `<h3>${t.name}</h3>`;
        if (t.hasImage && imgSrc) {
          body += `<div class="cal-row"><img src="${imgSrc}" /><div class="cal-note">${(t.note||"").replace(/\n/g,"<br/>")}</div></div>`;
        } else if (t.note) {
          body += `<p style="font-size:8pt;margin-bottom:6px">${(t.note||"").replace(/\n/g,"<br/>")}</p>`;
        }
        body += `<table><thead><tr>${t.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;
        (t.rows||[]).forEach(row => { body += `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`; });
        body += `</tbody></table>`;
      });
      body += ftr() + `</div>`;
    }

    // ── Parts Consumed page ──
    if (w.partsColumns?.rows?.length) {
      body += `<div class="page">${hdr()}<h2>Parts Consumed List</h2>`;
      body += `<table><thead><tr>${w.partsColumns.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;
      w.partsColumns.rows.forEach(row => { body += `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`; });
      body += `</tbody></table>`;
      body += ftr() + `</div>`;
    }

    // ── Photo Gallery page ──
    const realPhotos = (w.photos||[]).filter(ph => ph.src);
    if (realPhotos.length) {
      body += `<div class="page">${hdr()}<h2>Photo Gallery</h2><table class="photo-grid"><tbody>`;
      for (let i = 0; i < realPhotos.length; i += 2) {
        const ph1 = realPhotos[i], ph2 = realPhotos[i+1]||null;
        body += `<tr>
          <td><img src="${ph1.src}"/><div class="pcap">${(ph1.title||"").toUpperCase()}</div>${ph1.description?`<div class="pdesc">${ph1.description}</div>`:""}</td>
          <td>${ph2?`<img src="${ph2.src}"/><div class="pcap">${(ph2.title||"").toUpperCase()}</div>${ph2.description?`<div class="pdesc">${ph2.description}</div>`:""}`:""}</td>
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
    ${ftr()}</div>`;

    // ── Open print window ──
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>WCR — ${draft.projectCode}</title><style>${CSS}</style></head><body>${pages}${body}</body></html>`);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
    Toast.show("PDF opened — use Print → Save as PDF.", "success");
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

    // Scope of Work
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


};  // end App

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

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
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
