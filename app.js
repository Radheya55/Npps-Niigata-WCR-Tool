/* ═══════════════════════════════════════════════════════
   NPPS WCR TOOL — app.js  (Phase 1 + Phase 2 Complete)
═══════════════════════════════════════════════════════ */

const CONFIG = {
  GOOGLE_CLIENT_ID: "190605798710-5cashes032781tifqemjuvsm6rvon10c.apps.googleusercontent.com",
  WORKER_URL: "https://polished-lake-4911.radheya-supnekar.workers.dev",
  DRIVE_FOLDER_ID: "1fqfq-efMq5KsDpYHc-9TJ3-yc8l3GKc1",
  BASE_DATA_SHEET_NAME: "NPPS_WCR_BaseData",
  DRAFT_EXPIRY_DAYS: 15,
  MAX_DRAFTS: 10,
  EMPLOYEES_URL: "https://raw.githubusercontent.com/Radheya55/Npps-Niigata-WCR-Tool/main/employees.json",
};

const State = {
  currentUser: null,
  googleToken: null,
  pendingFlow: null,
  baseSheetId: null,
  draftsFileId: null,
  drafts: [],
  currentProject: null,
  currentDraft: null,
  employees: [],
  vesselImageBase64: null,
};

const Screen = {
  show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("screen-" + id).classList.add("active");
    window.scrollTo(0, 0);
  }
};

/* ════════════════════════════════════════════════════════
   TABLE PALETTE TEMPLATES
════════════════════════════════════════════════════════ */
const TABLE_TEMPLATES = {
  crankshaft: {
    name: "Crankshaft Deflection Measurement",
    note: "Indication Reading (+ve) / (-ve) | Permissible Limit: 0.07 mm",
    headers: ["Crankpin Position","1","2","3","4","5","6","7","8","Remarks"],
    rows: [
      ["1","0.00","0.00","0.00","0.00","0.00","0.00","0.00","0.00","OK"],
      ["2","","","","","","","","","OK"],
      ["3","","","","","","","","","OK"],
      ["4","","","","","","","","","OK"],
      ["5","","","","","","","","","OK"],
    ]
  },
  rockerArm: {
    name: "Rocker Arm Bushing / Shaft Diameter",
    note: "Bushing ID = 55 +0.05/+0.12mm | Shaft Dia = 55 -0.03/-0.05mm | Clearance = 0.2mm",
    headers: ["Cylinder No.","Valve Type","Shaft D1 (mm)","Shaft D2 (mm)","Remarks"],
    rows: [
      ["1","IV","54.99","54.99","Ok"],
      ["","EV","54.99","54.99","Ok"],
      ["2","IV","54.99","54.99","Ok"],
      ["","EV","54.99","54.99","Ok"],
      ["3","IV","54.99","54.99","Ok"],
      ["","EV","54.99","54.99","Ok"],
      ["4","IV","54.99","54.99","Ok"],
      ["","EV","54.99","54.99","Ok"],
    ]
  },
  ringGroove: {
    name: "Ring Groove Clearance",
    note: "Standard: 1st 0.21~0.25 | 2nd 0.11~0.15 | 3rd 0.07~0.11 | Oil 0.04~0.09 mm | Permissible: 0.35/0.30/0.30/0.30 mm",
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [
      ["1","0.21","0.11","0.09","0.06","Ok"],
      ["2","0.21","0.11","0.09","0.06","Ok"],
      ["3","0.21","0.11","0.09","0.06","Ok"],
      ["4","0.21","0.11","0.09","0.06","Ok"],
      ["5","0.21","0.11","0.09","0.06","Ok"],
      ["6","0.21","0.11","0.09","0.06","Ok"],
      ["7","0.21","0.11","0.09","0.06","Ok"],
      ["8","0.21","0.11","0.09","0.06","Ok"],
    ]
  },
  piston_ring_gap: {
    name: "Clearance between Liner & Piston Ring Gap",
    note: "Standard: 1st/2nd/3rd 1.1~1.4mm | Oil 0.65~0.95mm | Permissible: 2nd/3rd 3.5mm",
    headers: ["Cylinder No","1st Ring","2nd Ring","3rd Ring","Oil Ring","Remarks"],
    rows: [
      ["1","1.25","1.25","1.25","0.90","Ok"],
      ["2","1.25","1.25","1.25","0.90","Ok"],
      ["3","1.25","1.25","1.25","0.90","Ok"],
      ["4","1.25","1.25","1.25","0.90","Ok"],
      ["5","1.25","1.25","1.25","0.90","Ok"],
      ["6","1.25","1.25","1.25","0.90","Ok"],
      ["7","1.25","1.25","1.25","0.90","Ok"],
      ["8","1.25","1.25","1.25","0.90","Ok"],
    ]
  },
  liner: {
    name: "Cylinder Liner Calibration after Honing",
    note: "Normal Size: 280 +0.040mm | Permissible Limit: 280.5mm | A=70mm B=280mm C=490mm D=615mm",
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
  valveStem: {
    name: "Valve Stem Diameter",
    note: "Inlet & Exhaust Valve Limit = 19.80mm | Valve Guide Limit = 20.40mm | Clearance = 0.06~0.10mm",
    headers: ["Cylinder No.","Valve Type","Stem dX1 (mm)","Stem dX2 (mm)","Guide D1 (mm)","Guide D2 (mm)"],
    rows: [
      ["1","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],
      ["2","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],
      ["3","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],
      ["4","IV","19.94","19.94","20.00","20.00"],
      ["","EV","19.96","19.96","20.00","20.00"],
    ]
  },
  loadTrial: {
    name: "Load Trial Sheet",
    note: "PORT & STBD ENGINE",
    headers: ["Parameter","Unit","P-600rpm","P-750rpm","S-600rpm","S-750rpm"],
    rows: [
      ["Engine Speed","Rpm","600","750","600","750"],
      ["Lay shaft Handle","Scale","3.5","5","3.5","5"],
      ["Eng. Lube oil","Mpa","","","",""],
      ["FW cooling","Mpa","","","",""],
      ["SW cooling","Mpa","","","",""],
      ["Charge air","Mpa","","","",""],
      ["T/C Lube oil","Mpa","","","",""],
      ["Fuel oil","Mpa","","","",""],
      ["Lube oil Temp","°C","","","",""],
      ["Water Temp Engine Inlet","°C","","","",""],
      ["Max Pressure Cyl 1","Mpa","","","",""],
      ["Max Pressure Cyl 2","Mpa","","","",""],
      ["Max Pressure Cyl 3","Mpa","","","",""],
      ["Max Pressure Cyl 4","Mpa","","","",""],
      ["Max Pressure Cyl 5","Mpa","","","",""],
      ["Max Pressure Cyl 6","Mpa","","","",""],
      ["Max Pressure Cyl 7","Mpa","","","",""],
      ["Max Pressure Cyl 8","Mpa","","","",""],
      ["Exh Gas Temp Cyl 1","°C","","","",""],
      ["Exh Gas Temp Cyl 2","°C","","","",""],
      ["Exh Gas Temp Cyl 3","°C","","","",""],
      ["Exh Gas Temp Cyl 4","°C","","","",""],
      ["Exh Gas Temp Cyl 5","°C","","","",""],
      ["Exh Gas Temp Cyl 6","°C","","","",""],
      ["Exh Gas Temp Cyl 7","°C","","","",""],
      ["Exh Gas Temp Cyl 8","°C","","","",""],
      ["FIP Rack Index Cyl 1","mm","","","",""],
      ["FIP Rack Index Cyl 2","mm","","","",""],
      ["FIP Rack Index Cyl 3","mm","","","",""],
      ["FIP Rack Index Cyl 4","mm","","","",""],
      ["FIP Rack Index Cyl 5","mm","","","",""],
      ["FIP Rack Index Cyl 6","mm","","","",""],
      ["FIP Rack Index Cyl 7","mm","","","",""],
      ["FIP Rack Index Cyl 8","mm","","","",""],
    ]
  },
  parts: {
    name: "Parts Consumed List",
    note: "",
    headers: ["Sr No.","Item No.","Part No.","Description","Qty / Equipment"],
    rows: [
      ["1","","","",""],
      ["2","","","",""],
      ["3","","","",""],
    ]
  },
  custom: {
    name: "Custom Table",
    note: "",
    headers: ["Column 1","Column 2","Column 3","Column 4"],
    rows: [
      ["","","",""],
      ["","","",""],
      ["","","",""],
    ]
  },
};

/* ════════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════════ */
const App = {

  async init() {
    await App.loadEmployees();
  },

  async loadEmployees() {
    try {
      const resp = await fetch(CONFIG.EMPLOYEES_URL + "?t=" + Date.now());
      State.employees = await resp.json();
      App.populateNameDropdown();
    } catch (err) {
      console.error("loadEmployees:", err);
      Toast.show("Could not load employee list.", "error");
    }
  },

  populateNameDropdown() {
    const select = document.getElementById("emp-name-select");
    select.innerHTML = '<option value="">— Select your name —</option>';
    const sorted = [...State.employees].sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.empNo;
      opt.textContent = emp.name;
      select.appendChild(opt);
    });
  },

  onNameSelect() {
    document.getElementById("emp-input").value = "";
    document.getElementById("emp-error").textContent = "";
    App.updateContinueBtn();
  },

  onEmpInput() {
    document.getElementById("emp-error").textContent = "";
    App.updateContinueBtn();
  },

  updateContinueBtn() {
    const selectedEmpNo = document.getElementById("emp-name-select").value;
    const typedEmpNo = document.getElementById("emp-input").value.trim();
    const btn = document.getElementById("continue-btn");
    const match = selectedEmpNo && typedEmpNo &&
      selectedEmpNo.toLowerCase() === typedEmpNo.toLowerCase();
    btn.disabled = !match;
    btn.style.opacity = match ? "1" : "0.5";
    btn.style.cursor = match ? "pointer" : "not-allowed";
  },

  goHome() { Screen.show("home"); },

  goToLogin(flow) {
    State.pendingFlow = flow;
    document.getElementById("login-title").textContent =
      flow === "basedata" ? "Service Manager Login" : "Sign In";
    document.getElementById("emp-input").value = "";
    document.getElementById("emp-name-select").value = "";
    document.getElementById("emp-error").textContent = "";
    App.updateContinueBtn();
    Screen.show("login");
  },

  logout() {
    State.currentUser = null;
    State.googleToken = null;
    State.drafts = [];
    State.vesselImageBase64 = null;
    Screen.show("home");
    Toast.show("Signed out successfully.");
  },

  verifyEmployee() {
    const selectedEmpNo = document.getElementById("emp-name-select").value;
    const typedEmpNo = document.getElementById("emp-input").value.trim();
    const errorEl = document.getElementById("emp-error");
    if (!selectedEmpNo || !typedEmpNo) {
      errorEl.textContent = "Please select your name and enter your employee number.";
      return;
    }
    if (selectedEmpNo.toLowerCase() !== typedEmpNo.toLowerCase()) {
      errorEl.textContent = "Employee number does not match the selected name.";
      return;
    }
    const emp = State.employees.find(e => e.empNo.toLowerCase() === typedEmpNo.toLowerCase());
    if (!emp) { errorEl.textContent = "Employee not found."; return; }
    errorEl.textContent = "";
    State.currentUser = { empNo: emp.empNo, name: emp.name };
    Toast.show(`Welcome, ${emp.name}. Connect Google Drive to continue.`);
  },

  connectGoogle() {
    if (!State.currentUser) {
      document.getElementById("emp-error").textContent = "Please verify your employee number first.";
      return;
    }
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: ["https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/spreadsheets"].join(" "),
      callback: async (response) => {
        if (response.error) { Toast.show("Google connection failed.", "error"); return; }
        State.googleToken = response.access_token;
        const btn = document.querySelector(".btn-google");
        btn.classList.add("connected");
        btn.innerHTML = "✓ Google Drive Connected";
        Toast.show("Google Drive connected!", "success");
        setTimeout(() => App.proceedAfterAuth(), 800);
      },
    });
    client.requestAccessToken();
  },

  async proceedAfterAuth() {
    await App.ensureBaseSheet();
    await App.loadDrafts();
    if (State.pendingFlow === "basedata") {
      document.getElementById("user-pill-bd").textContent = State.currentUser.name;
      await App.loadProjectsTable();
      Screen.show("basedata");
    } else {
      document.getElementById("user-pill").textContent = State.currentUser.name;
      App.renderDrafts();
      Screen.show("dashboard");
    }
  },

  async ensureBaseSheet() {
    try {
      const resp = await gapi_fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${CONFIG.BASE_DATA_SHEET_NAME}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name)`
      );
      const data = await resp.json();
      if (data.files && data.files.length > 0) { State.baseSheetId = data.files[0].id; return; }
      const createResp = await gapi_fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: CONFIG.BASE_DATA_SHEET_NAME, mimeType: "application/vnd.google-apps.spreadsheet", parents: [CONFIG.DRIVE_FOLDER_ID] }),
      });
      const created = await createResp.json();
      State.baseSheetId = created.id;
      const headers = ["ProjectCode","CustomerName","ContractNo","StartDate","EndDate","OverhaulType","EngineModel","EngineSerial","EngineArrangement","RPMCapacity","RunningHours","CustomerIncharge","TeamLeader","Members","Vessel","Location","VesselImageBase64","CreatedDate"];
      await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A1:R1?valueInputOption=RAW`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: [headers] }),
      });
    } catch (err) { console.error("ensureBaseSheet:", err); Toast.show("Could not access Drive.", "error"); }
  },

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
      State.currentProject = project;
      const labels = {
        CustomerName:"Customer", ContractNo:"Contract No.", StartDate:"Start Date",
        EndDate:"Est. Completion", OverhaulType:"Type of Overhaul", EngineModel:"Engine Model",
        EngineSerial:"Serial No.", Vessel:"Vessel / Rig", Location:"Location", TeamLeader:"Team Leader",
      };
      document.getElementById("project-info-grid").innerHTML = Object.entries(labels).map(([key, label]) =>
        `<div class="project-info-item"><label>${label}</label><span>${project[key] || "—"}</span></div>`
      ).join("");
      document.getElementById("project-details").classList.remove("hidden");
    } catch (err) { Toast.show("Could not read project data.", "error"); }
  },

  startWCR() {
    if (!State.currentProject) return;
    const myDrafts = State.drafts.filter(d => d.empNo === State.currentUser.empNo);
    if (myDrafts.length >= CONFIG.MAX_DRAFTS) {
      Toast.show(`You have ${CONFIG.MAX_DRAFTS} drafts. Delete one to continue.`, "error"); return;
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
        history: { lastOverhaulType:"", lastOverhaulBy:"", runningHoursAtMaint:"", observations:"", logLeakages:"", bearingConRod:"", bearingMainJournal:"", turboDetails:"", geislingerDetails:"", governorDetails:"", gaugeConditions:"" },
        scopeOfWork: [{ original:"", done:"" }],
        deviations: { nextMaintType:"", nextMaintDate:"", partsRenewal:"" },
        maintSummary: "",
        scopeForImprovement: [{ area:"", observations:"", recommendations:"" }],
        recommendations: ["Keep a close watch on the engine and act immediately in case of any abnormal sounds, vibrations and parameters.","Please understand that Neptunus could have worked on some part of the engine but malfunctioning in any other part of the engine could also be the cause of the breakdown.","Post overhaul, it is good practice to change lube oil filters after 100 hours. Kindly inspect the filters for any abnormal particles and report the same to us.","After the first 100 hours remove a sample for lube oil analysis.","Watch parameters closely; especially lube oil pressure and jacket cooling water temperature.","Watch out for fuel dilution. Check for fuel condition. In case of doubt, please call us for assistance."],
        calibrationTables: [],
        partsList: [{ srNo:"1", itemNo:"", partNo:"", description:"", qty:"" }],
        loadTrial: null,
        photos: [],
        signoff: { makerName:"", checkerName:"", approverName:"", makerDate:"", customerName:"", customerDate:"" },
      }
    };
    State.drafts.unshift(draft);
    App.saveDrafts();
    App.renderDrafts();
    State.currentDraft = draft;
    App.openWCRBuilder(draft);
  },

  async loadDrafts() {
    try {
      const fileName = `NPPS_WCR_Drafts_${State.currentUser.empNo}.json`;
      const resp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and trashed=false&fields=files(id,name)`);
      const data = await resp.json();
      if (!data.files || data.files.length === 0) { State.drafts = []; State.draftsFileId = null; return; }
      State.draftsFileId = data.files[0].id;
      const fileResp = await gapi_fetch(`https://www.googleapis.com/drive/v3/files/${State.draftsFileId}?alt=media`);
      const text = await fileResp.text();
      const parsed = JSON.parse(text);
      const cutoff = Date.now() - CONFIG.DRAFT_EXPIRY_DAYS * 86400000;
      State.drafts = parsed.filter(d => new Date(d.createdAt).getTime() > cutoff);
    } catch (err) { console.error("loadDrafts:", err); State.drafts = []; }
  },

  async saveDrafts() {
    try {
      const fileName = `NPPS_WCR_Drafts_${State.currentUser.empNo}.json`;
      const blob = new Blob([JSON.stringify(State.drafts, null, 2)], { type: "application/json" });
      if (State.draftsFileId) {
        await gapi_fetch(`https://www.googleapis.com/upload/drive/v3/files/${State.draftsFileId}?uploadType=media`, { method: "PATCH", body: blob });
      } else {
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify({ name: fileName, parents: [CONFIG.DRIVE_FOLDER_ID], mimeType: "application/json" })], { type: "application/json" }));
        form.append("file", blob);
        const resp = await gapi_fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", { method: "POST", body: form });
        State.draftsFileId = (await resp.json()).id;
      }
    } catch (err) { console.error("saveDrafts:", err); }
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
          <div class="draft-card-name">${d.projectData.CustomerName || "—"} · ${d.projectData.Vessel || "—"}</div>
          <div class="draft-card-meta">Created ${formatDate(d.createdAt)} · Expires ${expiryDate(d.createdAt, CONFIG.DRAFT_EXPIRY_DAYS)}</div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill ${d.status}">${d.status === "complete" ? "Complete" : "Draft"}</span>
          <button class="delete-draft" onclick="event.stopPropagation(); App.deleteDraft('${d.id}')" title="Delete">✕</button>
        </div>
      </div>`).join("");
  },

  openDraft(id) {
    const draft = State.drafts.find(d => d.id === id);
    if (!draft) return;
    State.currentDraft = draft;
    if (!draft.wcr) {
      draft.wcr = {
        history:{ lastOverhaulType:"",lastOverhaulBy:"",runningHoursAtMaint:"",observations:"",logLeakages:"",bearingConRod:"",bearingMainJournal:"",turboDetails:"",geislingerDetails:"",governorDetails:"",gaugeConditions:"" },
        scopeOfWork:[{original:"",done:""}],
        deviations:{nextMaintType:"",nextMaintDate:"",partsRenewal:""},
        maintSummary:"",
        scopeForImprovement:[{area:"",observations:"",recommendations:""}],
        recommendations:["Keep a close watch on the engine and act immediately in case of any abnormal sounds, vibrations and parameters."],
        calibrationTables:[],
        partsList:[{srNo:"1",itemNo:"",partNo:"",description:"",qty:""}],
        loadTrial:null,
        photos:[],
        signoff:{makerName:"",checkerName:"",approverName:"",makerDate:"",customerName:"",customerDate:""}
      };
    }
    App.openWCRBuilder(draft);
  },

  deleteDraft(id) {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    State.drafts = State.drafts.filter(d => d.id !== id);
    App.saveDrafts();
    App.renderDrafts();
    Toast.show("Draft deleted.");
  },

  /* ══════════════════════════════════════════════════════
     WCR BUILDER
  ══════════════════════════════════════════════════════ */

  openWCRBuilder(draft) {
    Screen.show("wcr-builder");
    document.getElementById("wcr-project-code").textContent = draft.projectCode;
    document.getElementById("wcr-customer").textContent = draft.projectData.CustomerName || "—";
    App.renderWCRBuilder();
  },

  renderWCRBuilder() {
    const d = State.currentDraft;
    const w = d.wcr;
    const p = d.projectData;

    // ── Cover (pre-filled, read-only display)
    document.getElementById("wcr-cover-customer").textContent = p.CustomerName || "—";
    document.getElementById("wcr-cover-contract").textContent = p.ContractNo || "—";
    document.getElementById("wcr-cover-start").textContent = p.StartDate || "—";
    document.getElementById("wcr-cover-end").textContent = p.EndDate || "—";
    document.getElementById("wcr-cover-overhaul").textContent = p.OverhaulType || "—";
    document.getElementById("wcr-cover-engine").textContent = p.EngineModel || "—";
    document.getElementById("wcr-cover-serial").textContent = p.EngineSerial || "—";
    document.getElementById("wcr-cover-arrangement").textContent = p.EngineArrangement || "—";
    document.getElementById("wcr-cover-rpm").textContent = p.RPMCapacity || "—";
    document.getElementById("wcr-cover-hours").textContent = p.RunningHours || "—";
    document.getElementById("wcr-cover-custincharge").textContent = p.CustomerIncharge || "—";
    document.getElementById("wcr-cover-leader").textContent = p.TeamLeader || "—";
    document.getElementById("wcr-cover-members").textContent = p.Members || "—";
    if (p.VesselImageBase64) {
      const img = document.getElementById("wcr-cover-image");
      img.src = p.VesselImageBase64;
      img.classList.remove("hidden");
    }

    // ── History
    const h = w.history;
    document.getElementById("h-lastType").value = h.lastOverhaulType || "";
    document.getElementById("h-lastBy").value = h.lastOverhaulBy || "";
    document.getElementById("h-runHours").value = h.runningHoursAtMaint || "";
    document.getElementById("h-obs").value = h.observations || "";
    document.getElementById("h-leaks").value = h.logLeakages || "";
    document.getElementById("h-bearingCon").value = h.bearingConRod || "";
    document.getElementById("h-bearingMain").value = h.bearingMainJournal || "";
    document.getElementById("h-turbo").value = h.turboDetails || "";
    document.getElementById("h-geislinger").value = h.geislingerDetails || "";
    document.getElementById("h-governor").value = h.governorDetails || "";
    document.getElementById("h-gauges").value = h.gaugeConditions || "";

    // ── Scope of Work
    App.renderScopeOfWork();

    // ── Deviations
    document.getElementById("dev-nextType").value = w.deviations.nextMaintType || "";
    document.getElementById("dev-nextDate").value = w.deviations.nextMaintDate || "";
    document.getElementById("dev-parts").value = w.deviations.partsRenewal || "";

    // ── Maintenance Summary
    document.getElementById("maint-summary").value = w.maintSummary || "";

    // ── Scope for Improvement
    App.renderScopeForImprovement();

    // ── Recommendations
    App.renderRecommendations();

    // ── Calibration Tables
    App.renderCalibrationTables();

    // ── Parts List
    App.renderPartsList();

    // ── Photos
    App.renderPhotos();

    // ── Sign-off
    document.getElementById("so-maker").value = w.signoff.makerName || "";
    document.getElementById("so-checker").value = w.signoff.checkerName || "";
    document.getElementById("so-approver").value = w.signoff.approverName || "";
    document.getElementById("so-makerdate").value = w.signoff.makerDate || "";
    document.getElementById("so-custname").value = w.signoff.customerName || "";
    document.getElementById("so-custdate").value = w.signoff.customerDate || "";
  },

  saveWCRSection() {
    const d = State.currentDraft;
    const w = d.wcr;

    w.history = {
      lastOverhaulType: document.getElementById("h-lastType").value,
      lastOverhaulBy: document.getElementById("h-lastBy").value,
      runningHoursAtMaint: document.getElementById("h-runHours").value,
      observations: document.getElementById("h-obs").value,
      logLeakages: document.getElementById("h-leaks").value,
      bearingConRod: document.getElementById("h-bearingCon").value,
      bearingMainJournal: document.getElementById("h-bearingMain").value,
      turboDetails: document.getElementById("h-turbo").value,
      geislingerDetails: document.getElementById("h-geislinger").value,
      governorDetails: document.getElementById("h-governor").value,
      gaugeConditions: document.getElementById("h-gauges").value,
    };

    w.deviations = {
      nextMaintType: document.getElementById("dev-nextType").value,
      nextMaintDate: document.getElementById("dev-nextDate").value,
      partsRenewal: document.getElementById("dev-parts").value,
    };

    w.maintSummary = document.getElementById("maint-summary").value;

    w.signoff = {
      makerName: document.getElementById("so-maker").value,
      checkerName: document.getElementById("so-checker").value,
      approverName: document.getElementById("so-approver").value,
      makerDate: document.getElementById("so-makerdate").value,
      customerName: document.getElementById("so-custname").value,
      customerDate: document.getElementById("so-custdate").value,
    };

    d.updatedAt = new Date().toISOString();
    App.saveDrafts();
    Toast.show("Draft saved.", "success");
  },

  backToDashboard() {
    App.saveWCRSection();
    App.renderDrafts();
    Screen.show("dashboard");
  },

  // ── Scope of Work
  renderScopeOfWork() {
    const rows = State.currentDraft.wcr.scopeOfWork;
    const container = document.getElementById("scope-rows");
    container.innerHTML = rows.map((r, i) => `
      <div class="scope-row">
        <textarea class="form-input scope-cell" placeholder="Original scope..." oninput="App.updateScopeRow(${i},'original',this.value)">${r.original}</textarea>
        <textarea class="form-input scope-cell" placeholder="What was done..." oninput="App.updateScopeRow(${i},'done',this.value)">${r.done}</textarea>
        <button class="row-del-btn" onclick="App.deleteScopeRow(${i})" title="Remove row">✕</button>
      </div>`).join("");
  },

  updateScopeRow(i, field, val) { State.currentDraft.wcr.scopeOfWork[i][field] = val; },
  deleteScopeRow(i) { State.currentDraft.wcr.scopeOfWork.splice(i,1); App.renderScopeOfWork(); },
  addScopeRow() { State.currentDraft.wcr.scopeOfWork.push({original:"",done:""}); App.renderScopeOfWork(); },

  // ── Scope for Improvement
  renderScopeForImprovement() {
    const rows = State.currentDraft.wcr.scopeForImprovement;
    const container = document.getElementById("sfi-rows");
    container.innerHTML = rows.map((r, i) => `
      <div class="sfi-row">
        <span class="sfi-num">${i+1}</span>
        <input class="form-input" value="${r.area}" placeholder="Area of improvement" oninput="App.updateSFI(${i},'area',this.value)" />
        <input class="form-input" value="${r.observations}" placeholder="Observations" oninput="App.updateSFI(${i},'observations',this.value)" />
        <input class="form-input" value="${r.recommendations}" placeholder="Recommendations" oninput="App.updateSFI(${i},'recommendations',this.value)" />
        <button class="row-del-btn" onclick="App.deleteSFI(${i})">✕</button>
      </div>`).join("");
  },

  updateSFI(i, field, val) { State.currentDraft.wcr.scopeForImprovement[i][field] = val; },
  deleteSFI(i) { State.currentDraft.wcr.scopeForImprovement.splice(i,1); App.renderScopeForImprovement(); },
  addSFI() { State.currentDraft.wcr.scopeForImprovement.push({area:"",observations:"",recommendations:""}); App.renderScopeForImprovement(); },

  // ── Recommendations
  renderRecommendations() {
    const items = State.currentDraft.wcr.recommendations;
    const container = document.getElementById("rec-rows");
    container.innerHTML = items.map((r, i) => `
      <div class="rec-row">
        <span class="rec-num">${i+1}.</span>
        <textarea class="form-input rec-cell" oninput="App.updateRec(${i},this.value)">${r}</textarea>
        <button class="row-del-btn" onclick="App.deleteRec(${i})">✕</button>
      </div>`).join("");
  },

  updateRec(i, val) { State.currentDraft.wcr.recommendations[i] = val; },
  deleteRec(i) { State.currentDraft.wcr.recommendations.splice(i,1); App.renderRecommendations(); },
  addRec() { State.currentDraft.wcr.recommendations.push(""); App.renderRecommendations(); },

  // ── Calibration Tables
  showTablePalette() {
    document.getElementById("table-palette").classList.toggle("hidden");
  },

  insertTable(templateKey) {
    const tmpl = TABLE_TEMPLATES[templateKey];
    const table = {
      id: "tbl_" + Date.now(),
      name: tmpl.name,
      note: tmpl.note,
      headers: [...tmpl.headers],
      rows: tmpl.rows.map(r => [...r]),
    };
    State.currentDraft.wcr.calibrationTables.push(table);
    document.getElementById("table-palette").classList.add("hidden");
    App.renderCalibrationTables();
    Toast.show(`"${tmpl.name}" table added.`, "success");
  },

  renderCalibrationTables() {
    const tables = State.currentDraft.wcr.calibrationTables;
    const container = document.getElementById("cal-tables");
    if (tables.length === 0) {
      container.innerHTML = `<div class="empty-state">No calibration tables yet. Use the palette above to add tables.</div>`;
      return;
    }
    container.innerHTML = tables.map((t, ti) => `
      <div class="cal-table-block">
        <div class="cal-table-header">
          <input class="cal-table-title" value="${t.name}" oninput="App.updateTableName(${ti},this.value)" />
          <div class="cal-table-actions">
            ${ti > 0 ? `<button class="tbl-action-btn" onclick="App.moveTable(${ti},-1)" title="Move up">↑</button>` : ""}
            ${ti < tables.length-1 ? `<button class="tbl-action-btn" onclick="App.moveTable(${ti},1)" title="Move down">↓</button>` : ""}
            <button class="tbl-action-btn danger" onclick="App.deleteTable(${ti})" title="Delete table">🗑</button>
          </div>
        </div>
        ${t.note ? `<div class="cal-table-note">${t.note}</div>` : ""}
        <div class="cal-table-scroll">
          <table class="cal-editable-table">
            <thead>
              <tr>
                ${t.headers.map((h, hi) => `<th><input class="th-input" value="${h}" oninput="App.updateHeader(${ti},${hi},this.value)" /><button class="col-del" onclick="App.deleteCol(${ti},${hi})" title="Delete col">✕</button></th>`).join("")}
                <th><button class="add-col-btn" onclick="App.addCol(${ti})">+ Col</button></th>
              </tr>
            </thead>
            <tbody>
              ${t.rows.map((row, ri) => `
                <tr>
                  ${row.map((cell, ci) => `<td><input class="td-input" value="${cell}" oninput="App.updateCell(${ti},${ri},${ci},this.value)" /></td>`).join("")}
                  <td><button class="row-del-btn" onclick="App.deleteTableRow(${ti},${ri})">✕</button></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
        <button class="add-row-btn" onclick="App.addTableRow(${ti})">+ Add Row</button>
      </div>`).join("");
  },

  updateTableName(ti, val) { State.currentDraft.wcr.calibrationTables[ti].name = val; },
  updateHeader(ti, hi, val) { State.currentDraft.wcr.calibrationTables[ti].headers[hi] = val; },
  updateCell(ti, ri, ci, val) { State.currentDraft.wcr.calibrationTables[ti].rows[ri][ci] = val; },
  deleteTable(ti) { if (!confirm("Delete this table?")) return; State.currentDraft.wcr.calibrationTables.splice(ti,1); App.renderCalibrationTables(); },
  moveTable(ti, dir) {
    const tables = State.currentDraft.wcr.calibrationTables;
    const ni = ti + dir;
    if (ni < 0 || ni >= tables.length) return;
    [tables[ti], tables[ni]] = [tables[ni], tables[ti]];
    App.renderCalibrationTables();
  },
  addTableRow(ti) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    t.rows.push(new Array(t.headers.length).fill(""));
    App.renderCalibrationTables();
  },
  deleteTableRow(ti, ri) { State.currentDraft.wcr.calibrationTables[ti].rows.splice(ri,1); App.renderCalibrationTables(); },
  addCol(ti) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    t.headers.push("New Column");
    t.rows.forEach(r => r.push(""));
    App.renderCalibrationTables();
  },
  deleteCol(ti, hi) {
    const t = State.currentDraft.wcr.calibrationTables[ti];
    if (t.headers.length <= 1) return;
    t.headers.splice(hi, 1);
    t.rows.forEach(r => r.splice(hi, 1));
    App.renderCalibrationTables();
  },

  // ── Parts List
  renderPartsList() {
    const items = State.currentDraft.wcr.partsList;
    const container = document.getElementById("parts-rows");
    container.innerHTML = items.map((p, i) => `
      <tr>
        <td><input class="td-input" value="${p.srNo}" oninput="App.updatePart(${i},'srNo',this.value)" /></td>
        <td><input class="td-input" value="${p.itemNo||''}" oninput="App.updatePart(${i},'itemNo',this.value)" /></td>
        <td><input class="td-input" value="${p.partNo||''}" oninput="App.updatePart(${i},'partNo',this.value)" /></td>
        <td><input class="td-input" value="${p.description||''}" oninput="App.updatePart(${i},'description',this.value)" /></td>
        <td><input class="td-input" value="${p.qty||''}" oninput="App.updatePart(${i},'qty',this.value)" /></td>
        <td><button class="row-del-btn" onclick="App.deletePart(${i})">✕</button></td>
      </tr>`).join("");
  },

  updatePart(i, field, val) { State.currentDraft.wcr.partsList[i][field] = val; },
  deletePart(i) { State.currentDraft.wcr.partsList.splice(i,1); App.renderPartsList(); },
  addPart() {
    const items = State.currentDraft.wcr.partsList;
    items.push({ srNo: String(items.length+1), itemNo:"", partNo:"", description:"", qty:"" });
    App.renderPartsList();
  },

  // ── Photos
  onPhotoSelect(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        State.currentDraft.wcr.photos.push({ src: e.target.result, caption: "" });
        App.renderPhotos();
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  },

  renderPhotos() {
    const photos = State.currentDraft.wcr.photos;
    const container = document.getElementById("photos-grid");
    if (photos.length === 0) {
      container.innerHTML = `<div class="empty-state">No photos yet. Click "Add Photos" above.</div>`;
      return;
    }
    container.innerHTML = photos.map((p, i) => `
      <div class="photo-card">
        <img src="${p.src}" class="photo-img" alt="Photo ${i+1}" />
        <input class="form-input photo-caption" value="${p.caption}" placeholder="Caption..." oninput="App.updatePhotoCaption(${i},this.value)" />
        <button class="photo-del" onclick="App.deletePhoto(${i})">✕ Remove</button>
      </div>`).join("");
  },

  updatePhotoCaption(i, val) { State.currentDraft.wcr.photos[i].caption = val; },
  deletePhoto(i) { State.currentDraft.wcr.photos.splice(i,1); App.renderPhotos(); },

  // ── Base Data ────────────────────────────────────────

  async saveBaseData() {
    const getValue = id => document.getElementById(id).value.trim();
    const projectCode = getValue("bd-project-code").toUpperCase();
    if (!projectCode) {
      document.getElementById("bd-error").textContent = "Project Code is required.";
      document.getElementById("bd-error").classList.remove("hidden");
      return;
    }
    document.getElementById("bd-success").classList.add("hidden");
    document.getElementById("bd-error").classList.add("hidden");
    const row = [
      projectCode, getValue("bd-customer"), getValue("bd-contract-no"),
      getValue("bd-start-date"), getValue("bd-end-date"), getValue("bd-overhaul-type"),
      getValue("bd-engine-model"), getValue("bd-engine-serial"), getValue("bd-engine-arrangement"),
      getValue("bd-rpm"), getValue("bd-running-hours"), getValue("bd-customer-incharge"),
      getValue("bd-team-leader"), getValue("bd-members"), getValue("bd-vessel"),
      getValue("bd-location"), State.vesselImageBase64 || "", new Date().toISOString(),
    ];
    try {
      const existing = await App.findProjectRow(projectCode);
      if (existing.rowIndex !== -1) {
        const rangeRow = existing.rowIndex + 2;
        await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rangeRow}:R${rangeRow}?valueInputOption=RAW`,
          { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({values:[row]}) });
      } else {
        await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A:R:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
          { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({values:[row]}) });
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
    ["bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date",
     "bd-overhaul-type","bd-engine-model","bd-engine-serial","bd-engine-arrangement",
     "bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader","bd-members","bd-vessel","bd-location"]
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    App.clearVesselImage();
  },

  async loadProjectsTable() {
    const wrap = document.getElementById("projects-table-wrap");
    wrap.innerHTML = `<div class="empty-state">Loading projects...</div>`;
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1`);
      const data = await resp.json();
      const rows = data.values || [];

      if (rows.length < 2) {
        wrap.innerHTML = `<div class="empty-state">No projects in database yet.</div>`;
        document.getElementById("project-count").textContent = "0";
        return;
      }

      const headers = rows[0];
      const createdDateIndex = headers.indexOf("CreatedDate");
      const cutoff = Date.now() - 1000 * 86400000; // 1000 days

      // Separate expired and valid rows (row indices are 1-based in sheet, 0-based in array slice)
      const allDataRows = rows.slice(1);
      const expiredSheetRows = []; // 1-based sheet row numbers to delete
      const validRows = [];

      allDataRows.forEach((r, i) => {
        const createdAt = createdDateIndex >= 0 ? r[createdDateIndex] : null;
        const isExpired = createdAt && new Date(createdAt).getTime() < cutoff;
        if (isExpired) {
          expiredSheetRows.push(i + 2); // +1 for header, +1 for 1-based
        } else {
          validRows.push(r);
        }
      });

      // Purge expired rows from sheet (delete in reverse order to preserve indices)
      if (expiredSheetRows.length > 0) {
        const deleteRequests = expiredSheetRows.reverse().map(rowIndex => ({
          deleteDimension: {
            range: { sheetId: 0, dimension: "ROWS", startIndex: rowIndex - 1, endIndex: rowIndex }
          }
        }));
        await gapi_fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}:batchUpdate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requests: deleteRequests }),
          }
        );
        Toast.show(`${expiredSheetRows.length} expired project(s) removed from database.`);
      }

      if (validRows.length === 0) {
        wrap.innerHTML = `<div class="empty-state">No projects in database yet.</div>`;
        document.getElementById("project-count").textContent = "0";
        return;
      }

      document.getElementById("project-count").textContent = validRows.length;

      wrap.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Project Code</th>
              <th>Customer</th>
              <th>Engine Model</th>
              <th>Overhaul Type</th>
              <th>Team Leader</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${validRows.map((r, i) => {
              const createdAt = createdDateIndex >= 0 ? r[createdDateIndex] : "";
              const addedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
              const expiresDate = createdAt ? (() => { const d = new Date(createdAt); d.setDate(d.getDate()+1000); return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); })() : "—";
              return `
              <tr>
                <td><strong>${r[0]||"—"}</strong></td>
                <td>${r[1]||"—"}</td>
                <td>${r[6]||"—"}</td>
                <td>${r[5]||"—"}</td>
                <td>${r[12]||"—"}</td>
                <td>${r[15]||"—"}</td>
                <td>${r[3]||"—"}</td>
                <td><span class="expiry-pill" title="Expires ${expiresDate}">${addedDate}</span></td>
                <td><button class="edit-btn" onclick="App.editProject(${i+1})">Edit</button></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>`;

      // Scroll table into view after save
      setTimeout(() => wrap.scrollIntoView({ behavior: "smooth", block: "start" }), 200);

    } catch (err) {
      console.error("loadProjectsTable:", err);
      wrap.innerHTML = `<div class="empty-state">Could not load projects. Check Drive connection.</div>`;
    }
  },

  async editProject(rowIndex) {
    try {
      const resp = await gapi_fetch(`https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rowIndex+1}:R${rowIndex+1}`);
      const data = await resp.json();
      const row = (data.values || [[]])[0];
      const fields = ["bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date","bd-overhaul-type","bd-engine-model","bd-engine-serial","bd-engine-arrangement","bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader","bd-members","bd-vessel","bd-location"];
      fields.forEach((id, i) => { const el = document.getElementById(id); if (el && row[i] !== undefined) el.value = row[i]; });
      if (row[16]) {
        State.vesselImageBase64 = row[16];
        document.getElementById("bd-image-preview").src = row[16];
        document.getElementById("bd-image-preview").classList.remove("hidden");
        document.getElementById("bd-image-placeholder").classList.add("hidden");
        document.getElementById("bd-image-clear").classList.remove("hidden");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      Toast.show("Project loaded for editing.");
    } catch (err) { Toast.show("Could not load project for editing.", "error"); }
  },
};

// ── GOOGLE API FETCH ─────────────────────────────────────
async function gapi_fetch(url, options = {}) {
  return fetch(url, { ...options, headers: { "Authorization": `Bearer ${State.googleToken}`, ...(options.headers||{}) } });
}

// ── DATE HELPERS ─────────────────────────────────────────
function formatDate(iso) { return new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }
function expiryDate(iso, days) { const d = new Date(iso); d.setDate(d.getDate()+days); return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }

// ── TOAST ────────────────────────────────────────────────
const Toast = {
  timer: null,
  show(msg, type = "default") {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.className = `toast show ${type}`;
    clearTimeout(Toast.timer);
    Toast.timer = setTimeout(() => el.classList.remove("show"), 3500);
  }
};

App.init();
