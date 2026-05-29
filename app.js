/* ═══════════════════════════════════════════════════════
   NPPS WCR TOOL — app.js  FINAL COMPLETE BUILD
═══════════════════════════════════════════════════════ */

const CONFIG = {
  GOOGLE_CLIENT_ID: "190605798710-5cashes032781tifqemjuvsm6rvon10c.apps.googleusercontent.com",
  WORKER_URL: "https://polished-lake-4911.radheya-supnekar.workers.dev",
  DRIVE_FOLDER_ID: "1fqfq-efMq5KsDpYHc-9TJ3-yc8l3GKc1",
  BASE_DATA_SHEET_NAME: "NPPS_WCR_BaseData",
  DRAFT_EXPIRY_DAYS: 12,
  MAX_DRAFTS: 10,
  MAX_DOWNLOADED_DRAFTS: 5,
  BASE_DATA_EXPIRY_DAYS: 1000,
  EMPLOYEES_URL: "https://raw.githubusercontent.com/Radheya55/Npps-Niigata-WCR-Tool/main/employees.json",
};

// ── MAINTENANCE SUMMARY TEMPLATE ─────────────────────────
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

// ── TABLE PALETTE TEMPLATES ──────────────────────────────
const TABLE_TEMPLATES = {
  crankshaft: {
    name: "Crankshaft Deflection Measurement",
    note: "Indication Reading: (+ve) / (-ve) | Permissible Limit: 0.07 mm",
    hasImage: true,
    imageLabel: "Crankshaft diagram",
    builtinImage: true,
    headers: ["Crankpin Position","1","2","3","4","5","6","7","8","Remarks"],
    rows: [["1","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],["2","","","","","","","","","OK"],["3","","","","","","","","","OK"],["4","","","","","","","","","OK"],["5","","","","","","","","","OK"]]
  },
  rockerArm: {
    name: "Rocker Arm Bushing / Rocker Arm Shaft Diameter",
    note: "1. Rocker Arm Bushing Inner Diameter = 55 +0.05/+0.12mm\n2. Rocker Arm Shaft Diameter = 55 -0.03/-0.05mm\n3. Clearance (Shaft – Bush) = 0.2mm",
    hasImage: true,
    imageLabel: "Rocker arm diagram",
    builtinImage: true,
    headers: ["Cylinder No.","Valve Type","Shaft D1 (mm)","Shaft D2 (mm)","Remarks"],
    rows: [["1","IV","54.99","54.99","Ok"],["","EV","54.99","54.98","Ok"],["2","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],["3","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],["4","IV","54.99","54.99","Ok"],["","EV","54.99","54.99","Ok"],["5","IV","54.98","54.99","Ok"],["","EV","54.99","54.99","Ok"],["6","IV","54.99","54.98","Ok"],["","EV","54.99","54.99","Ok"],["7","IV","54.99","54.99","Ok"],["","EV","54.98","54.99","Ok"],["8","IV","54.99","54.99","Ok"],["","EV","54.98","54.99","Ok"]]
  },
  ringGroove: {
    name: "Ring Groove Clearance",
    note: "Standard: 1st Compression 0.21~0.25mm | 2nd Compression 0.11~0.15mm | 3rd Compression 0.07~0.11mm | Oil Ring 0.04~0.09mm\nPermissible Limit: 1st 0.35mm | 2nd 0.30mm | 3rd 0.30mm | Oil Ring 0.30mm",
    hasImage: false,
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [["1","0.21","0.11","0.09","0.06","Ok"],["2","0.21","0.11","0.09","0.06","Ok"],["3","0.21","0.11","0.09","0.06","Ok"],["4","0.21","0.11","0.09","0.06","Ok"],["5","0.21","0.11","0.09","0.06","Ok"],["6","0.21","0.11","0.09","0.06","Ok"],["7","0.21","0.11","0.09","0.06","Ok"],["8","0.21","0.11","0.09","0.06","Ok"]]
  },
  pistonRingGap: {
    name: "Clearance between Liner & Piston Ring Gap",
    note: "Standard: 1st/2nd/3rd Compression 1.1~1.4mm | Oil Ring 0.65~0.95mm\nPermissible Limit: 2nd 3.5mm | 3rd 3.5mm",
    hasImage: false,
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [["1","1.25","1.25","1.25","0.90","Ok"],["2","1.25","1.25","1.25","0.90","Ok"],["3","1.25","1.25","1.25","0.90","Ok"],["4","1.25","1.25","1.25","0.90","Ok"],["5","1.25","1.25","1.25","0.90","Ok"],["6","1.25","1.25","1.25","0.90","Ok"],["7","1.25","1.25","1.25","0.90","Ok"],["8","1.25","1.25","1.25","0.90","Ok"]]
  },
  linerCalib: {
    name: "Cylinder Liner Calibration after Honing",
    note: "A=70mm | B=280mm | C=490mm | D=615mm\nNormal Size: 280 +0.040mm | Permissible Limit: 280.5mm\nC: Cam Side | E: Exhaust Side | F: Free End | A: Alternator End (Flywheel End)",
    hasImage: true,
    imageLabel: "Liner calibration diagram",
    builtinImage: true,
    headers: ["Unit No.","A C-E","A F-A","B C-E","B F-A","C C-E","C F-A","D C-E","D F-A","Remark"],
    rows: [["1","280.04","280.03","280.04","280.04","280.04","280.04","280.03","280.03","ok"],["2","280.04","280.05","280.04","280.04","280.04","280.04","280.02","280.03","ok"],["3","280.04","280.04","280.04","280.04","280.05","280.04","280.03","280.03","ok"],["4","280.05","280.04","280.04","280.04","280.04","280.04","280.03","280.02","ok"],["5","280.03","280.04","280.04","280.04","280.04","280.04","280.03","280.03","ok"],["6","280.05","280.04","280.04","280.03","280.05","280.04","280.02","280.02","ok"]]
  },
  valveStem: {
    name: "Valve Stem Diameter",
    note: "dX1: At Top Position | dX2: At Bottom Position\nInlet & Exhaust Valve Limit = 19.80mm | Valve Guide Limit = 20.40mm | Allowable Clearance = 0.06~0.10mm",
    hasImage: true,
    builtinImage: true,
    headers: ["Cylinder No.","Valve Type","Stem dX1 (mm)","Stem dX2 (mm)","Guide D1 (mm)","Guide D2 (mm)"],
    rows: [["1","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["2","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["3","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["4","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["5","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["6","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["7","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"],["8","IV","19.94","19.94","20.00","20.00"],["","EV","19.96","19.96","20.00","20.00"]]
  },
  loadTrial: {
    name: "Load Trial Sheet — PORT & STBD ENGINE",
    note: "Model: 8L28HX",
    hasImage: false,
    headers: ["Parameter","Unit","P-600rpm","P-750rpm","S-600rpm","S-750rpm"],
    rows: [["Engine Speed","Rpm","600","750","600","750"],["Lay Shaft Handle Pointer","Scale","3.5","5","3.5","5"],["Eng. Lube Oil Pressure","Mpa","","","",""],["FW Cooling Pressure","Mpa","","","",""],["SW Cooling Pressure","Mpa","","","",""],["Charge Air Pressure","Mpa","","","",""],["T/C Lube Oil Pressure","Mpa","","","",""],["Fuel Oil Pressure","Mpa","","","",""],["Lube Oil Temp (Cooler Inlet)","°C","","","",""],["Water Temp (Engine Inlet)","°C","","","",""],["Max Pressure — Cyl 1","Mpa","","","",""],["Max Pressure — Cyl 2","Mpa","","","",""],["Max Pressure — Cyl 3","Mpa","","","",""],["Max Pressure — Cyl 4","Mpa","","","",""],["Max Pressure — Cyl 5","Mpa","","","",""],["Max Pressure — Cyl 6","Mpa","","","",""],["Max Pressure — Cyl 7","Mpa","","","",""],["Max Pressure — Cyl 8","Mpa","","","",""],["Exh. Gas Temp — Cyl 1","°C","","","",""],["Exh. Gas Temp — Cyl 2","°C","","","",""],["Exh. Gas Temp — Cyl 3","°C","","","",""],["Exh. Gas Temp — Cyl 4","°C","","","",""],["Exh. Gas Temp — Cyl 5","°C","","","",""],["Exh. Gas Temp — Cyl 6","°C","","","",""],["Exh. Gas Temp — Cyl 7","°C","","","",""],["Exh. Gas Temp — Cyl 8","°C","","","",""],["F.I.P Rack Index — Cyl 1","mm","","","",""],["F.I.P Rack Index — Cyl 2","mm","","","",""],["F.I.P Rack Index — Cyl 3","mm","","","",""],["F.I.P Rack Index — Cyl 4","mm","","","",""],["F.I.P Rack Index — Cyl 5","mm","","","",""],["F.I.P Rack Index — Cyl 6","mm","","","",""],["F.I.P Rack Index — Cyl 7","mm","","","",""],["F.I.P Rack Index — Cyl 8","mm","","","",""]]
  },
  parts: {
    name: "Parts Consumed List",
    note: "",
    hasImage: false,
    headers: ["Sr No.","Item No.","Part No.","Description","Qty / Equipment"],
    rows: [["1","","","",""],["2","","","",""],["3","","",""]]
  },
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
  currentUser: null,
  googleToken: null,
  pendingFlow: null,
  baseSheetId: null,
  draftsFileId: null,
  drafts: [],
  downloadedDrafts: [],
  downloadedDraftsFileId: null,
  currentProject: null,
  currentDraft: null,
  employees: [],
  vesselImageBase64: null,
  memberCount: 3,
  dvrParsedData: null,
  grammarSuggestions: [],
  undoStack: [],
};

const Screen = { show(id) { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); document.getElementById("screen-" + id).classList.add("active"); window.scrollTo(0,0); } };

/* ════════════════════════════════════════════════════════
   UNDO SYSTEM
════════════════════════════════════════════════════════ */
const Undo = {
  push(action) { State.undoStack.push(action); if (State.undoStack.length > 50) State.undoStack.shift(); },
  pop() { return State.undoStack.pop(); },
  last() {
    const action = this.pop();
    if (!action) { Toast.show("Nothing to undo."); return; }
    action();
    Toast.show("Action undone.");
  }
};

/* ════════════════════════════════════════════════════════
   APP INIT
════════════════════════════════════════════════════════ */
const App = {
  async init() { await App.loadEmployees(); },

  async loadEmployees() {
    try {
      const resp = await fetch(CONFIG.EMPLOYEES_URL + "?t=" + Date.now());
      State.employees = await resp.json();
      App.populateNameDropdown();
    } catch (err) { Toast.show("Could not load employee list.", "error"); }
  },

  populateNameDropdown() {
    const select = document.getElementById("emp-name-select");
    select.innerHTML = '<option value="">— Select your name —</option>';
    [...State.employees].sort((a,b) => a.name.localeCompare(b.name)).forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.empNo; opt.textContent = emp.name;
      select.appendChild(opt);
    });
  },

  onNameSelect() { document.getElementById("emp-input").value = ""; document.getElementById("emp-error").textContent = ""; App.updateContinueBtn(); },
  onEmpInput() { document.getElementById("emp-error").textContent = ""; App.updateContinueBtn(); },

  updateContinueBtn() {
    const selEmp = document.getElementById("emp-name-select").value;
    const typedEmp = document.getElementById("emp-input").value.trim();
    const btn = document.getElementById("continue-btn");
    const match = selEmp && typedEmp && selEmp.toLowerCase() === typedEmp.toLowerCase();
    btn.disabled = !match; btn.style.opacity = match ? "1" : "0.5"; btn.style.cursor = match ? "pointer" : "not-allowed";
  },

  goHome() { Screen.show("home"); },

  goToLogin(flow) {
    State.pendingFlow = flow;
    document.getElementById("login-title").textContent = flow === "basedata" ? "Service Manager Login" : "Sign In";
    document.getElementById("emp-input").value = "";
    document.getElementById("emp-name-select").value = "";
    document.getElementById("emp-error").textContent = "";
    App.updateContinueBtn();
    Screen.show("login");
  },

  logout() { State.currentUser = null; State.googleToken = null; State.drafts = []; State.vesselImageBase64 = null; Screen.show("home"); Toast.show("Signed out."); },

  verifyEmployee() {
    const selEmp = document.getElementById("emp-name-select").value;
    const typedEmp = document.getElementById("emp-input").value.trim();
    const errorEl = document.getElementById("emp-error");
    if (!selEmp || !typedEmp) { errorEl.textContent = "Please select your name and enter your employee number."; return; }
    if (selEmp.toLowerCase() !== typedEmp.toLowerCase()) { errorEl.textContent = "Employee number does not match the selected name."; return; }
    const emp = State.employees.find(e => e.empNo.toLowerCase() === typedEmp.toLowerCase());
    if (!emp) { errorEl.textContent = "Employee not found."; return; }
    errorEl.textContent = "";
    State.currentUser = { empNo: emp.empNo, name: emp.name };
    Toast.show(`Welcome, ${emp.name}. Connect Google Drive to continue.`);
  },

  connectGoogle() {
    if (!State.currentUser) { document.getElementById("emp-error").textContent = "Please verify your employee number first."; return; }
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: ["https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/documents"].join(" "),
      callback: async (response) => {
        if (response.error) { Toast.show("Google connection failed.", "error"); return; }
        State.googleToken = response.access_token;
        const btn = document.querySelector(".btn-google");
        btn.classList.add("connected"); btn.innerHTML = "✓ Google Drive Connected";
        Toast.show("Google Drive connected!", "success");
        setTimeout(() => App.proceedAfterAuth(), 800);
      },
    });
    client.requestAccessToken();
  },

  async proceedAfterAuth() {
    await App.ensureBaseSheet();
    await App.loadDrafts();
    await App.loadDownloadedDrafts();
    if (State.pendingFlow === "basedata") {
      document.getElementById("user-pill-bd").textContent = State.currentUser.name;
      State._tempMembers = ["","",""];
      App.renderMemberFields();
      await App.loadProjectsTable();
      Screen.show("basedata");
    } else if (State.pendingFlow === "history") {
      App.showHistoricalDrafts();
    } else {
      document.getElementById("user-pill").textContent = State.currentUser.name;
      App.renderDrafts();
      Screen.show("dashboard");
    }
  },

  /* ══════════════════════════════════════════════════════
     BASE DATA SHEET
  ══════════════════════════════════════════════════════ */
  async ensureBaseSheet() {
    try {
      const resp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files?q=name='${CONFIG.BASE_DATA_SHEET_NAME}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name)`);
      const data = await resp.json();
      if (data.files && data.files.length > 0) { State.baseSheetId = data.files[0].id; return; }
      const cr = await gapi_fetch("https://www.googleapis.com/drive/v3/files", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name:CONFIG.BASE_DATA_SHEET_NAME, mimeType:"application/vnd.google-apps.spreadsheet", parents:[CONFIG.DRIVE_FOLDER_ID] }) });
      State.baseSheetId = (await cr.json()).id;
      const headers = ["ProjectCode","CustomerName","ContractNo","StartDate","EndDate","OverhaulType","EngineModel","EngineSerial","EngineArrangement","RPMCapacity","RunningHours","CustomerIncharge","TeamLeader","Members","Vessel","Location","VesselImageBase64","CreatedDate"];
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
    reader.onload = (e) => {
      State.vesselImageBase64 = e.target.result;
      document.getElementById("bd-image-preview").src = e.target.result;
      document.getElementById("bd-image-preview").classList.remove("hidden");
      document.getElementById("bd-image-placeholder").classList.add("hidden");
      document.getElementById("bd-image-clear").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  },

  clearVesselImage() {
    State.vesselImageBase64 = null;
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
    const optionalFields = { "bd-customer":"Customer Name","bd-contract-no":"Contract Number","bd-start-date":"Start Date","bd-end-date":"Completion Date","bd-overhaul-type":"Type of Overhaul","bd-engine-model":"Engine Model","bd-engine-serial":"Engine Serial Number","bd-engine-arrangement":"Engine Arrangement","bd-rpm":"RPM and Capacity","bd-running-hours":"Running Hours","bd-customer-incharge":"Customer In-Charge","bd-team-leader":"Team Leader","bd-vessel":"Vessel / Rig","bd-location":"Location" };
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

    const row = [
      projectCode, getValue("bd-customer"), getValue("bd-contract-no"), getValue("bd-start-date"),
      getValue("bd-end-date"), overhaulType, getValue("bd-engine-model"), getValue("bd-engine-serial"),
      getValue("bd-engine-arrangement"), getValue("bd-rpm"), getValue("bd-running-hours"),
      getValue("bd-customer-incharge"), getValue("bd-team-leader"), membersStr,
      getValue("bd-vessel"), getValue("bd-location"), State.vesselImageBase64 || "", new Date().toISOString(),
    ];

    try {
      await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A:R:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({values:[row]}) });
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

    const row = [projectCode, getValue("bd-customer"), getValue("bd-contract-no"), getValue("bd-start-date"), getValue("bd-end-date"), overhaulType, getValue("bd-engine-model"), getValue("bd-engine-serial"), getValue("bd-engine-arrangement"), getValue("bd-rpm"), getValue("bd-running-hours"), getValue("bd-customer-incharge"), getValue("bd-team-leader"), members, getValue("bd-vessel"), getValue("bd-location"), State.vesselImageBase64 || "", new Date().toISOString()];

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
    ["bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date","bd-overhaul-type","bd-overhaul-custom","bd-engine-model","bd-engine-serial","bd-engine-arrangement","bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader","bd-vessel","bd-location"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    document.getElementById("bd-overhaul-custom-row").classList.add("hidden");
    State._tempMembers = ["","",""];
    App.renderMemberFields();
    App.clearVesselImage();
    document.getElementById("bd-success").classList.add("hidden");
    document.getElementById("bd-error").classList.add("hidden");
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
        return `<tr><td><strong>${r[0]||"—"}</strong></td><td>${r[1]||"—"}</td><td>${r[6]||"—"}</td><td>${r[5]||"—"}</td><td>${r[12]||"—"}</td><td>${r[15]||"—"}</td><td>${r[3]||"—"}</td><td class="expiry-pill">${addedDate}</td><td><button class="edit-btn" onclick="App.editProject(${originalIndex})">Edit</button></td></tr>`;
      }).join("")}</tbody></table>`;
      setTimeout(() => wrap.scrollIntoView({ behavior:"smooth", block:"nearest" }), 200);
    } catch (err) { wrap.innerHTML = `<div class="empty-state">Could not load projects.</div>`; }
  },

  async editProject(rowIndex) {
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rowIndex+1}:R${rowIndex+1}`);
      const data = await resp.json();
      const row = (data.values || [[]])[0];
      const fields = ["bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date","bd-overhaul-type","bd-engine-model","bd-engine-serial","bd-engine-arrangement","bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader","bd-vessel","bd-location"];
      fields.forEach((id, i) => { const el = document.getElementById(id); if (el && row[i] !== undefined) el.value = row[i]; });
      // Handle members
      const membersStr = row[13] || "";
      State._tempMembers = membersStr ? membersStr.split(",").map(m => m.trim()) : ["","",""];
      App.renderMemberFields();
      // Handle overhaul type
      const ovType = row[5] || "";
      const knownTypes = ["TOH","MOH","Minor","HealthCheck"];
      if (knownTypes.includes(ovType)) { document.getElementById("bd-overhaul-type").value = ovType; }
      else { document.getElementById("bd-overhaul-type").value = "Other"; document.getElementById("bd-overhaul-custom").value = ovType; document.getElementById("bd-overhaul-custom-row").classList.remove("hidden"); }
      // Handle image
      if (row[16]) { State.vesselImageBase64 = row[16]; document.getElementById("bd-image-preview").src = row[16]; document.getElementById("bd-image-preview").classList.remove("hidden"); document.getElementById("bd-image-placeholder").classList.add("hidden"); document.getElementById("bd-image-clear").classList.remove("hidden"); }
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
      State.currentProject = project;
      State.dvrParsedData = null;
      const labels = { CustomerName:"Customer", ContractNo:"Contract No.", StartDate:"Start Date", EndDate:"Est. Completion", OverhaulType:"Type of Overhaul", EngineModel:"Engine Model", EngineSerial:"Serial No.", Vessel:"Vessel / Rig", Location:"Location", TeamLeader:"Team Leader" };
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
    if (State.dvrParsedData?.maintPoints?.length) {
      maintItems.push({ type:"heading", text:"Additional Activities from DWR", id:"mi_dwr_h" });
      State.dvrParsedData.maintPoints.forEach(pt => maintItems.push({ type:"bullet", text:pt, id:"mi_"+Math.random().toString(36).substr(2,8) }));
    }

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
        deviationsActive: false,
        deviations: { nextMaintType:"", nextMaintDate:"", partsRenewal:"" },
        maintItems,
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

  /* ══════════════════════════════════════════════════════
     DRAFTS
  ══════════════════════════════════════════════════════ */
  async loadDrafts() {
    try {
      const fileName = `NPPS_WCR_Drafts_${State.currentUser.empNo}.json`;
      const resp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and trashed=false&fields=files(id,name)`);
      const data = await resp.json();
      if (!data.files || data.files.length === 0) { State.drafts = []; State.draftsFileId = null; return; }
      State.draftsFileId = data.files[0].id;
      const fileResp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files/${State.draftsFileId}?alt=media`);
      const parsed = JSON.parse(await fileResp.text());
      const cutoff = Date.now() - CONFIG.DRAFT_EXPIRY_DAYS * 86400000;
      State.drafts = parsed.filter(d => new Date(d.createdAt).getTime() > cutoff);
    } catch (err) { State.drafts = []; }
  },

  async saveDrafts() {
    try {
      const fileName = `NPPS_WCR_Drafts_${State.currentUser.empNo}.json`;
      const blob = new Blob([JSON.stringify(State.drafts, null, 2)], { type:"application/json" });
      if (State.draftsFileId) {
        await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State.draftsFileId}?uploadType=media`, { method:"PATCH", body:blob });
      } else {
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify({ name:fileName, parents:[CONFIG.DRIVE_FOLDER_ID], mimeType:"application/json" })], { type:"application/json" }));
        form.append("file", blob);
        const resp = await gapi_fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method:"POST", body:form });
        State.draftsFileId = (await resp.json()).id;
      }
    } catch (err) { console.error("saveDrafts:", err); }
  },

  async loadDownloadedDrafts() {
    try {
      const fileName = `NPPS_WCR_Downloaded_${State.currentUser.empNo}.json`;
      const resp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and trashed=false&fields=files(id,name)`);
      const data = await resp.json();
      if (!data.files || data.files.length === 0) { State.downloadedDrafts = []; return; }
      State.downloadedDraftsFileId = data.files[0].id;
      const fileResp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files/${State.downloadedDraftsFileId}?alt=media`);
      const parsed = JSON.parse(await fileResp.text());
      const cutoff = Date.now() - CONFIG.DRAFT_EXPIRY_DAYS * 86400000;
      State.downloadedDrafts = parsed.filter(d => new Date(d.createdAt).getTime() > cutoff);
    } catch { State.downloadedDrafts = []; }
  },

  async saveDownloadedDrafts() {
    try {
      const fileName = `NPPS_WCR_Downloaded_${State.currentUser.empNo}.json`;
      const blob = new Blob([JSON.stringify(State.downloadedDrafts.slice(0, CONFIG.MAX_DOWNLOADED_DRAFTS), null, 2)], { type:"application/json" });
      if (State.downloadedDraftsFileId) {
        await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State.downloadedDraftsFileId}?uploadType=media`, { method:"PATCH", body:blob });
      } else {
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify({ name:fileName, parents:[CONFIG.DRIVE_FOLDER_ID], mimeType:"application/json" })], { type:"application/json" }));
        form.append("file", blob);
        const resp = await gapi_fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method:"POST", body:form });
        State.downloadedDraftsFileId = (await resp.json()).id;
      }
    } catch (err) { console.error("saveDownloadedDrafts:", err); }
  },

  renderDrafts() {
    const myDrafts = State.drafts.filter(d => d.empNo === State.currentUser.empNo);
    document.getElementById("draft-count").textContent = `${myDrafts.length} / ${CONFIG.MAX_DRAFTS}`;
    const list = document.getElementById("drafts-list");
    if (myDrafts.length === 0) { list.innerHTML = `<div class="empty-state">No drafts yet. Start a new report above.</div>`; return; }
    list.innerHTML = myDrafts.map(d => `
      <div class="draft-card" onclick="App.openDraft('${d.id}')">
        <div class="draft-card-left">
          <div class="draft-card-code">${d.projectCode}</div>
          <div class="draft-card-name">${d.projectData?.CustomerName || "—"} · ${d.projectData?.Vessel || "—"}</div>
          <div class="draft-card-meta">Created ${formatDate(d.createdAt)} · Expires ${expiryDate(d.createdAt, CONFIG.DRAFT_EXPIRY_DAYS)}</div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill ${d.status}">${d.status === "complete" ? "Complete" : "Draft"}</span>
          <button class="delete-draft" onclick="event.stopPropagation(); App.deleteDraft('${d.id}')" title="Delete">✕</button>
        </div>
      </div>`).join("");
  },

  openDraft(id) { const draft = State.drafts.find(d => d.id === id); if (!draft) return; State.currentDraft = draft; App.openWCRBuilder(draft); },
  deleteDraft(id) { if (!confirm("Delete this draft?")) return; State.drafts = State.drafts.filter(d => d.id !== id); App.saveDrafts(); App.renderDrafts(); Toast.show("Draft deleted."); },

  showHistoricalDrafts() {
    Screen.show("historical-drafts");
    App.renderHistoricalDrafts();
  },

  renderHistoricalDrafts() {
    const wip = State.drafts.filter(d => d.empNo === State.currentUser?.empNo) || [];
    const downloaded = State.downloadedDrafts || [];
    const wipEl = document.getElementById("hist-wip-list");
    const dlEl = document.getElementById("hist-downloaded-list");
    wipEl.innerHTML = wip.length === 0 ? `<div class="empty-state">No WIP drafts.</div>` : wip.map(d => `<div class="draft-card" onclick="App.openDraft('${d.id}')"><div class="draft-card-left"><div class="draft-card-code">${d.projectCode}</div><div class="draft-card-name">${d.projectData?.CustomerName||"—"}</div><div class="draft-card-meta">Updated ${formatDate(d.updatedAt)}</div></div><div class="draft-card-right"><span class="status-pill draft">WIP</span></div></div>`).join("");
    dlEl.innerHTML = downloaded.length === 0 ? `<div class="empty-state">No downloaded drafts.</div>` : downloaded.map(d => `<div class="draft-card" onclick="App.openDraft('${d.id}')"><div class="draft-card-left"><div class="draft-card-code">${d.projectCode}</div><div class="draft-card-name">${d.projectData?.CustomerName||"—"}</div><div class="draft-card-meta">Downloaded ${formatDate(d.updatedAt)}</div></div><div class="draft-card-right"><span class="status-pill complete">Downloaded</span></div></div>`).join("");
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

    // Cover
    const coverFields = { "wcr-cover-customer":"CustomerName","wcr-cover-contract":"ContractNo","wcr-cover-start":"StartDate","wcr-cover-end":"EndDate","wcr-cover-overhaul":"OverhaulType","wcr-cover-engine":"EngineModel","wcr-cover-serial":"EngineSerial","wcr-cover-arrangement":"EngineArrangement","wcr-cover-rpm":"RPMCapacity","wcr-cover-hours":"RunningHours","wcr-cover-custincharge":"CustomerIncharge","wcr-cover-leader":"TeamLeader","wcr-cover-members":"Members" };
    Object.entries(coverFields).forEach(([elId, key]) => { const el = document.getElementById(elId); if (el) el.textContent = p[key] || "Not Updated in Base Data Yet"; });
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

  backToDashboard() { App.saveWCRSection(); App.renderDrafts(); Screen.show("dashboard"); },

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
      // Migrate old format to new editable rows format
      const w = State.currentDraft.wcr;
      if (!w.historyRows) {
        const h = w.history || {};
        w.historyRows = [
          { label:"Last Overhauling Type and Carried By", value: h.lastOverhaulType || "" },
          { label:"Running Hours at Time of Last Maintenance", value: h.runningHoursAtMaint || "" },
          { label:"Observations Recorded (Prior Dismantling)", value: h.observations || "" },
          { label:"Log Leakages / Abnormalities (Prior Job Start)", value: h.logLeakages || "" },
          { label:"Bearing Size – Con Rod Journal (Part No.)", value: h.bearingConRod || "" },
          { label:"Bearing Size – Main Journal (Part No.)", value: h.bearingMainJournal || "" },
          { label:"Turbo Details", value: h.turboDetails || "" },
          { label:"Geislinger Coupling Details", value: h.geislingerDetails || "" },
          { label:"Governor Details", value: h.governorDetails || "" },
          { label:"Conditions of Gauges on Instrument Panel", value: h.gaugeConditions || "" },
        ];
      }
      App.renderHistoryRows();
    }
  },

  renderHistoryRows() {
    const rows = State.currentDraft.wcr.historyRows || [];
    document.getElementById("history-body").innerHTML = `
      <div class="editable-kv-list">
        ${rows.map((r, i) => `
          <div class="editable-kv-row">
            <input class="form-input editable-kv-label" value="${r.label}" placeholder="Field name..." oninput="App.updateHistoryRow(${i},'label',this.value)" />
            <textarea class="form-input editable-kv-value" placeholder="Value..." oninput="App.updateHistoryRow(${i},'value',this.value)">${r.value}</textarea>
            <button class="row-del-btn" onclick="App.deleteHistoryRow(${i})">✕</button>
          </div>`).join("")}
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="add-row-btn" onclick="App.addHistoryRow()">+ Add Row</button>
      </div>`;
  },

  updateHistoryRow(i, field, val) { State.currentDraft.wcr.historyRows[i][field] = val; },
  addHistoryRow() { if (!State.currentDraft.wcr.historyRows) State.currentDraft.wcr.historyRows = []; State.currentDraft.wcr.historyRows.push({label:"New Field",value:""}); App.renderHistoryRows(); },
  deleteHistoryRow(i) { State.currentDraft.wcr.historyRows.splice(i,1); App.renderHistoryRows(); },

  // ── Scope of Work ──
  toggleScope() { State.currentDraft.wcr.scopeActive = !State.currentDraft.wcr.scopeActive; App.renderScopeSection(); },

  renderScopeSection() {
    const active = State.currentDraft.wcr.scopeActive;
    document.getElementById("scope-toggle-btn").textContent = active ? "— Remove Scope of Work" : "+ Add Scope of Work";
    document.getElementById("scope-body").classList.toggle("hidden", !active);
    if (active) App.renderScopeOfWork();
  },

  renderScopeOfWork() {
    const rows = State.currentDraft.wcr.scopeOfWork;
    document.getElementById("scope-rows").innerHTML = rows.map((r, i) => `
      <div class="scope-row">
        <textarea class="form-input scope-cell" placeholder="Original scope..." oninput="App.updateScopeRow(${i},'original',this.value)">${r.original}</textarea>
        <textarea class="form-input scope-cell" placeholder="What was done..." oninput="App.updateScopeRow(${i},'done',this.value)">${r.done}</textarea>
        <button class="row-del-btn" onclick="App.deleteScopeRow(${i})">✕</button>
      </div>`).join("");
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
    const builtinImg = (typeof DIAGRAMS !== 'undefined') && DIAGRAMS[templateKey] ? DIAGRAMS[templateKey] : null;
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
        <div class="sf-row"><label>Customer Name</label><span>${p.CustomerName||"—"}</span><label>Contract No.</label><span>${p.ContractNo||"—"}</span></div>
        <div class="sf-row"><label>Start Date</label><span>${p.StartDate||"—"}</span><label>Completion Date</label><span>${p.EndDate||"—"}</span></div>
        <div class="sf-row"><label>Overhaul Type</label><span>${p.OverhaulType||"—"}</span><label>Engine Model</label><span>${p.EngineModel||"—"}</span></div>
        <div class="sf-row"><label>Engine Serial</label><span>${p.EngineSerial||"—"}</span><label>Arrangement</label><span>${p.EngineArrangement||"—"}</span></div>
        <div class="sf-row"><label>RPM / Capacity</label><span>${p.RPMCapacity||"—"}</span><label>Running Hours</label><span>${p.RunningHours||"—"}</span></div>
        <div class="sf-row"><label>Customer In-Charge</label><span>${p.CustomerIncharge||"—"}</span><label>Team Leader</label><span>${p.TeamLeader||"—"}</span></div>
        <div class="sf-row full"><label>Members</label><span>${p.Members||"—"}</span></div>
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
    if (w.scopeActive && w.scopeOfWork.length) {
      html += `<div class="sf-section"><h2 class="sf-heading">Scope of Work</h2>
        <table class="sf-table"><thead><tr><th>Original Scope</th><th>What Was Done</th></tr></thead><tbody>
          ${w.scopeOfWork.map(r => `<tr><td contenteditable="true">${r.original}</td><td contenteditable="true">${r.done}</td></tr>`).join("")}
        </tbody></table></div>`;
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

  /* ══════════════════════════════════════════════════════
     DOWNLOAD
  ══════════════════════════════════════════════════════ */
  async downloadWCR() {
    const d = State.currentDraft;
    const w = d.wcr;
    const p = d.projectData;

    const LOGO = (typeof LOGO_B64 !== 'undefined') ? LOGO_B64 : '';
    const DGRAMS = (typeof DIAGRAMS !== 'undefined') ? DIAGRAMS : {};

    Toast.show('Creating Google Doc…', 'default');

    // ── Step 1: Build the document body as a series of Google Docs API requests ──
    const requests = [];
    let cursor = 1; // insertion index (Google Docs inserts at this position, moving forward)

    // Helper: insert text at cursor, returns length inserted
    const ins = (text, style) => {
      requests.push({
        insertText: { location: { index: cursor }, text }
      });
      if (style) {
        requests.push({
          updateTextStyle: {
            range: { startIndex: cursor, endIndex: cursor + text.length },
            textStyle: style,
            fields: Object.keys(style).join(',')
          }
        });
      }
      cursor += text.length;
    };

    const insLine = (text, style) => ins(text + '\n', style);

    const heading = (text, level) => {
      const start = cursor;
      ins(text + '\n');
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: start, endIndex: cursor },
          paragraphStyle: { namedStyleType: level === 1 ? 'HEADING_1' : level === 2 ? 'HEADING_2' : 'HEADING_3' },
          fields: 'namedStyleType'
        }
      });
    };

    const normal = (text) => insLine(text, null);
    const bold = (text) => ins(text, { bold: true });

    // ── TITLE ──
    heading('Work Completion Report', 1);
    if (p.CustomerName) heading(p.CustomerName, 2);
    normal('');

    // ── COVER TABLE — we'll insert as plain text rows (Docs API table creation is complex) ──
    // Use a clean 2-column layout as text
    const coverFields = [
      ['Customer Name', p.CustomerName||'—', 'Project / Contract Number', p.ContractNo||'—'],
      ['Start Date of Job', p.StartDate||'—', 'Completion Date', p.EndDate||'—'],
      ['Type of Overhaul', p.OverhaulType||'—', 'Engine Make and Model', p.EngineModel||'—'],
      ['Engine Serial Number', p.EngineSerial||'—', 'Engine Arrangement No', p.EngineArrangement||'—'],
      ['RPM and Capacity', p.RPMCapacity||'—', 'Current Running Hours', p.RunningHours||'—'],
      ['Customer In-Charge', p.CustomerIncharge||'—', 'Neptunus Team Leader', p.TeamLeader||'—'],
    ];
    coverFields.forEach(([l1,v1,l2,v2]) => {
      ins(`${l1}: `); ins(`${v1}   `, {bold:false}); ins(`${l2}: `); insLine(v2||'—');
    });
    ins('Neptunus Members: '); insLine(p.Members||'—');
    normal('');

    // ── HISTORY ──
    if (w.historyActive && w.historyRows?.length) {
      heading('History', 2);
      w.historyRows.forEach(r => { ins(`${r.label||'—'}: `, {bold:true}); insLine(r.value||'—'); });
      normal('');
    }

    // ── SCOPE OF WORK ──
    if (w.scopeActive && w.scopeOfWork?.length) {
      heading('Scope of Work', 2);
      ins('Original Scope', {bold:true}); ins(' | '); insLine('What Was Done', {bold:true});
      w.scopeOfWork.forEach(r => { ins(r.original||'—'); ins(' | '); insLine(r.done||'—'); });
      normal('');
    }

    // ── DEVIATIONS ──
    if (w.deviationsActive) {
      heading('Deviations and Reference Notes for Next Overhaul', 2);
      if (w.deviationRows?.length) {
        w.deviationRows.forEach(r => { ins(`${r.label||'—'}: `, {bold:true}); insLine(r.value||'—'); });
      } else {
        ins('Next Maintenance Type and Due Date: ', {bold:true}); insLine(`${w.deviations?.nextMaintType||'—'} ${w.deviations?.nextMaintDate||''}`);
        ins('Notes on Required Parts Renewal: ', {bold:true}); insLine(w.deviations?.partsRenewal||'—');
      }
      normal('');
    }

    // ── MAINTENANCE SUMMARY ──
    heading('Maintenance Summary', 2);
    (w.maintItems||[]).forEach(item => {
      if (item.type === 'heading') {
        heading(item.text, 3);
      } else {
        const start = cursor;
        ins('• ' + item.text + '\n');
        requests.push({
          updateParagraphStyle: {
            range: { startIndex: start, endIndex: cursor },
            paragraphStyle: { indentFirstLine: { magnitude: 0, unit: 'PT' }, indentStart: { magnitude: 18, unit: 'PT' } },
            fields: 'indentFirstLine,indentStart'
          }
        });
      }
    });
    normal('');

    // ── SCOPE FOR IMPROVEMENT ──
    heading('Scope for Improvement', 2);
    ins('Sr. No. | Area of Improvement | Observations | Recommendations\n', {bold:true});
    (w.scopeForImprovement||[]).forEach((r, i) => {
      insLine(`${i+1} | ${r.area||'—'} | ${r.observations||'—'} | ${r.recommendations||'—'}`);
    });
    normal('');

    // ── RECOMMENDATIONS ──
    heading('Recommendations', 2);
    insLine('The engine post overhaul must be closely monitored for any abnormalities which could cause serious breakdowns. It is a known fact that most breakdowns on overhauled engines occur within the first 100 hours post overhaul. We therefore, recommend the following:');
    (w.recommendations||[]).forEach((r, i) => {
      const start = cursor;
      ins(`${i+1}. ${r}\n`);
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: start, endIndex: cursor },
          paragraphStyle: { indentStart: { magnitude: 18, unit: 'PT' } },
          fields: 'indentStart'
        }
      });
    });
    normal('');

    // ── CALIBRATION TABLES ──
    if (w.calibrationTables?.length) {
      heading('Annexure 1 — Calibration Sheet', 2);
      w.calibrationTables.forEach(t => {
        heading(t.name, 3);
        if (t.note) insLine(t.note.replace(/\n/g, ' | '));
        // Headers
        ins(t.headers.join(' | ') + '\n', {bold:true});
        // Rows
        (t.rows||[]).forEach(row => insLine(row.join(' | ')));
        normal('');
      });
    }

    // ── PARTS CONSUMED ──
    if (w.partsColumns?.rows?.length) {
      heading('Parts Consumed List', 2);
      ins(w.partsColumns.headers.join(' | ') + '\n', {bold:true});
      w.partsColumns.rows.forEach(row => insLine(row.join(' | ')));
      normal('');
    }

    // ── PHOTO GALLERY — insert images inline ──
    const realPhotos = (w.photos||[]).filter(ph => ph.src);
    if (realPhotos.length > 0) {
      heading('Photo Gallery', 2);
      // We'll insert image captions as text (actual images require upload to Drive first)
      // For each photo: caption in bold, then newline
      for (let i = 0; i < realPhotos.length; i += 2) {
        const ph1 = realPhotos[i];
        const ph2 = realPhotos[i+1] || null;
        ins((ph1.title||'Photo').toUpperCase(), {bold:true});
        if (ph2) { ins(' | '); ins((ph2.title||'Photo').toUpperCase(), {bold:true}); }
        normal('');
        if (ph1.description || ph2?.description) {
          ins(ph1.description||''); if (ph2?.description) { ins(' | '); ins(ph2.description||''); } normal('');
        }
      }
      normal('Note: Photos are attached separately. Please insert images next to captions in the final document.');
      normal('');
    }

    // ── SIGN-OFF ──
    heading('Sign-off', 2);
    ins('On behalf of Neptunus', {bold:true}); ins('  |  '); insLine('On behalf of Customer', {bold:true});
    ins('Maker Name: ', {bold:true}); ins((w.signoff?.makerName||'—') + '  |  '); ins('Name: ', {bold:true}); insLine(w.signoff?.customerName||'—');
    ins('Checker Name: ', {bold:true}); insLine(w.signoff?.checkerName||'—');
    ins('Approver Name: ', {bold:true}); insLine(w.signoff?.approverName||'—');
    ins('Date: ', {bold:true}); ins((w.signoff?.makerDate||'—') + '  |  '); ins('Date: ', {bold:true}); insLine(w.signoff?.customerDate||'—');

    // ── Step 2: Create the Google Doc via Drive API ──
    try {
      const createResp = await gapi_fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `WCR — ${d.projectCode} — ${p.CustomerName||''} — ${new Date().toLocaleDateString('en-IN')}`,
          mimeType: 'application/vnd.google-apps.document',
          parents: [CONFIG.DRIVE_FOLDER_ID],
        })
      });

      const created = await createResp.json();
      if (!created.id) throw new Error('Could not create document: ' + JSON.stringify(created));

      const docId = created.id;

      // ── Step 3: Apply all content via batchUpdate ──
      const batchResp = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${State.googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      });

      const batchResult = await batchResp.json();
      if (batchResult.error) throw new Error(batchResult.error.message);

      // ── Step 4: Add header with logo (if available) ──
      // Get the document to find header ID
      const docResp = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
        headers: { 'Authorization': `Bearer ${State.googleToken}` }
      });
      const docData = await docResp.json();

      // Add header section
      const headerReqs = [];
      const existingHeaderId = docData.documentStyle?.defaultHeaderId;

      if (!existingHeaderId) {
        // Create header
        const hdrCreate = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${State.googleToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              createHeader: { type: 'DEFAULT', sectionBreakLocation: { index: 1 } }
            }]
          })
        });
        const hdrData = await hdrCreate.json();
        const headerId = hdrData.replies?.[0]?.createHeader?.headerId;

        if (headerId) {
          // Insert header text (logo can't be inserted via API easily without uploading)
          await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${State.googleToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requests: [
                { insertText: { location: { segmentId: headerId, index: 0 }, text: 'Neptunus Power Plant Services Pvt. Ltd.\t\tWork Completion Report' } },
                { updateTextStyle: {
                  range: { segmentId: headerId, startIndex: 0, endIndex: 55 },
                  textStyle: { bold: true, fontSize: { magnitude: 9, unit: 'PT' }, foregroundColor: { color: { rgbColor: { red: 0, green: 0.2, blue: 0.4 } } } },
                  fields: 'bold,fontSize,foregroundColor'
                }}
              ]
            })
          });
        }
      }

      // ── Step 5: Add footer ──
      const ftrCreate = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${State.googleToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{ createFooter: { type: 'DEFAULT', sectionBreakLocation: { index: 1 } } }]
        })
      });
      const ftrData = await ftrCreate.json();
      const footerId = ftrData.replies?.[0]?.createFooter?.footerId;

      if (footerId) {
        const footerText = 'Neptunus Power Plant Services Pvt. Ltd.  |  A-554/555, TTC Industrial Area, MIDC, Mahape, Navi Mumbai – 400 710, India  |  Tel: +91 22 41410707  |  www.neptunus-power.com  |  info@neptunus-power.com';
        await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${State.googleToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [
              { insertText: { location: { segmentId: footerId, index: 0 }, text: footerText } },
              { updateTextStyle: {
                range: { segmentId: footerId, startIndex: 0, endIndex: footerText.length },
                textStyle: { fontSize: { magnitude: 7.5, unit: 'PT' }, foregroundColor: { color: { rgbColor: { red: 0.3, green: 0.3, blue: 0.3 } } } },
                fields: 'fontSize,foregroundColor'
              }},
              { updateParagraphStyle: {
                range: { segmentId: footerId, startIndex: 0, endIndex: footerText.length },
                paragraphStyle: { alignment: 'CENTER' },
                fields: 'alignment'
              }}
            ]
          })
        });
      }

      // ── Step 6: Open the document ──
      const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
      window.open(docUrl, '_blank');

      // Save to downloaded drafts
      const existing = State.downloadedDrafts.findIndex(dd => dd.id === d.id);
      const downloadedCopy = { ...d, status: 'complete', updatedAt: new Date().toISOString(), docUrl };
      if (existing >= 0) State.downloadedDrafts[existing] = downloadedCopy;
      else State.downloadedDrafts.unshift(downloadedCopy);
      App.saveDownloadedDrafts();

      Toast.show('Google Doc created! Opening now…', 'success');

    } catch (err) {
      console.error('createGoogleDoc error:', err);
      Toast.show('Failed to create Google Doc: ' + err.message, 'error');
    }
  },
};

// ── HELPERS ──────────────────────────────────────────────
async function gapi_fetch(url, options = {}) {
  return fetch(url, { ...options, headers: { "Authorization":`Bearer ${State.googleToken}`, ...(options.headers||{}) } });
}

function formatDate(iso) { return new Date(iso).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
function expiryDate(iso, days) { const d = new Date(iso); d.setDate(d.getDate()+days); return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }

const Toast = {
  timer: null,
  show(msg, type="default") {
    const el = document.getElementById("toast");
    el.textContent = msg; el.className = `toast show ${type}`;
    clearTimeout(Toast.timer);
    Toast.timer = setTimeout(() => el.classList.remove("show"), 3500);
  }
};

App.init();
