/* ═══════════════════════════════════════════════════════
   NPPS WCR TOOL — app.js
   Phase 1: Auth, Base Data, Drafts, Project Lookup
═══════════════════════════════════════════════════════ */

// ── CONFIG ─────────────────────────────────────────────
// REPLACE these values before deploying
const CONFIG = {
  // Your Google Cloud OAuth Client ID
  // Get from: console.cloud.google.com → APIs → Credentials
  GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com",

  // Your Cloudflare Worker URL (where Gemini calls are proxied)
  WORKER_URL: "https://your-worker.your-account.workers.dev",

  // Google Drive folder ID where all data is stored
  // Create a folder in your Drive, right-click → Get link → extract the ID from the URL
  DRIVE_FOLDER_ID: "YOUR_DRIVE_FOLDER_ID_HERE",

  // Name of the Google Sheet that holds base project data
  BASE_DATA_SHEET_NAME: "NPPS_WCR_BaseData",

  // Draft auto-delete after this many days
  DRAFT_EXPIRY_DAYS: 15,

  // Max drafts per user
  MAX_DRAFTS: 10,
};

// ── STATE ──────────────────────────────────────────────
const State = {
  currentUser: null,      // { empNo, name }
  googleToken: null,      // OAuth access token
  pendingFlow: null,      // 'wcr' or 'basedata' — where to go after login
  baseSheetId: null,      // Google Sheet ID for base data
  drafts: [],             // Current user's drafts
};

// ── SCREEN MANAGER ─────────────────────────────────────
const Screen = {
  show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("screen-" + id).classList.add("active");
    window.scrollTo(0, 0);
  }
};

// ── APP ────────────────────────────────────────────────
const App = {

  // ── Navigation ──────────────────────────────────────

  goHome() {
    Screen.show("home");
  },

  goToLogin(flow) {
    State.pendingFlow = flow;
    const title = flow === "basedata" ? "Service Manager Login" : "Sign In";
    document.getElementById("login-title").textContent = title;
    document.getElementById("emp-input").value = "";
    document.getElementById("emp-error").textContent = "";
    Screen.show("login");
  },

  logout() {
    State.currentUser = null;
    State.googleToken = null;
    State.drafts = [];
    Screen.show("home");
    Toast.show("Signed out successfully.");
  },

  // ── Employee Verification ───────────────────────────

  verifyEmployee() {
    const val = document.getElementById("emp-input").value.trim().toUpperCase();
    const errorEl = document.getElementById("emp-error");

    if (!val) {
      errorEl.textContent = "Please enter your employee number.";
      return;
    }

    // Basic format check — adjust pattern to match your actual format
    if (!/^EMP\d{3,6}$/i.test(val) && !/^[A-Z]{2,4}\d{3,6}$/i.test(val)) {
      errorEl.textContent = "Enter a valid employee number (e.g. EMP001).";
      return;
    }

    errorEl.textContent = "";
    State.currentUser = { empNo: val };
    Toast.show("Employee verified. Connect Google Drive to continue.");
  },

  // ── Google OAuth ────────────────────────────────────

  connectGoogle() {
    if (!State.currentUser) {
      document.getElementById("emp-error").textContent = "Please enter your employee number first.";
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ].join(" "),
      callback: (response) => {
        if (response.error) {
          Toast.show("Google connection failed. Please try again.", "error");
          return;
        }
        State.googleToken = response.access_token;
        const btn = document.querySelector(".btn-google");
        btn.classList.add("connected");
        btn.innerHTML = `✓ Google Drive Connected`;
        Toast.show("Google Drive connected!", "success");

        // Proceed after short delay
        setTimeout(() => App.proceedAfterAuth(), 800);
      },
    });

    client.requestAccessToken();
  },

  async proceedAfterAuth() {
    // Ensure base sheet exists in Drive
    await App.ensureBaseSheet();

    // Load drafts for this user
    await App.loadDrafts();

    // Go to the right screen
    if (State.pendingFlow === "basedata") {
      document.getElementById("user-pill-bd").textContent = State.currentUser.empNo;
      await App.loadProjectsTable();
      Screen.show("basedata");
    } else {
      document.getElementById("user-pill").textContent = State.currentUser.empNo;
      App.renderDrafts();
      Screen.show("dashboard");
    }
  },

  // ── Base Data Sheet ─────────────────────────────────

  async ensureBaseSheet() {
    // Search for the sheet in the designated folder
    try {
      const resp = await gapi_fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${CONFIG.BASE_DATA_SHEET_NAME}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name)`
      );
      const data = await resp.json();

      if (data.files && data.files.length > 0) {
        State.baseSheetId = data.files[0].id;
        return;
      }

      // Create the sheet
      const createResp = await gapi_fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: CONFIG.BASE_DATA_SHEET_NAME,
            mimeType: "application/vnd.google-apps.spreadsheet",
            parents: [CONFIG.DRIVE_FOLDER_ID],
          }),
        }
      );
      const created = await createResp.json();
      State.baseSheetId = created.id;

      // Write header row
      const headers = [
        "ProjectCode","CustomerName","ContractNo","StartDate","EndDate",
        "OverhaulType","EngineModel","EngineSerial","EngineArrangement",
        "RPMCapacity","RunningHours","CustomerIncharge","TeamLeader",
        "Members","Vessel","Location","CreatedDate"
      ];
      await gapi_fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A1:Q1?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: [headers] }),
        }
      );

    } catch (err) {
      console.error("ensureBaseSheet:", err);
      Toast.show("Could not access Drive. Check folder ID in config.", "error");
    }
  },

  // ── Project Lookup ───────────────────────────────────

  async lookupProject() {
    const code = document.getElementById("project-code-input").value.trim().toUpperCase();
    if (!code) { Toast.show("Enter a project code.", "error"); return; }

    document.getElementById("project-details").classList.add("hidden");
    document.getElementById("project-not-found").classList.add("hidden");

    try {
      const resp = await gapi_fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1`
      );
      const data = await resp.json();
      const rows = data.values || [];
      if (rows.length < 2) {
        document.getElementById("project-not-found").classList.remove("hidden");
        return;
      }

      const headers = rows[0];
      const match = rows.slice(1).find(r => r[0] && r[0].toUpperCase() === code);

      if (!match) {
        document.getElementById("project-not-found").classList.remove("hidden");
        return;
      }

      // Build a key-value object
      const project = {};
      headers.forEach((h, i) => { project[h] = match[i] || "—"; });

      // Store for later
      State.currentProject = project;

      // Render
      const labels = {
        CustomerName: "Customer", ContractNo: "Contract No.",
        StartDate: "Start Date", EndDate: "Est. Completion",
        OverhaulType: "Type of Overhaul", EngineModel: "Engine Model",
        EngineSerial: "Serial No.", Vessel: "Vessel / Rig",
        Location: "Location", TeamLeader: "Team Leader",
      };

      const grid = document.getElementById("project-info-grid");
      grid.innerHTML = Object.entries(labels).map(([key, label]) => `
        <div class="project-info-item">
          <label>${label}</label>
          <span>${project[key] || "—"}</span>
        </div>
      `).join("");

      document.getElementById("project-details").classList.remove("hidden");

    } catch (err) {
      console.error("lookupProject:", err);
      Toast.show("Could not read project data.", "error");
    }
  },

  startWCR() {
    if (!State.currentProject) return;
    const code = State.currentProject.ProjectCode;

    // Check draft limit
    const myDrafts = State.drafts.filter(d => d.empNo === State.currentUser.empNo);
    if (myDrafts.length >= CONFIG.MAX_DRAFTS) {
      Toast.show(`You have ${CONFIG.MAX_DRAFTS} drafts. Delete one to continue.`, "error");
      return;
    }

    // Create new draft object
    const draft = {
      id: "draft_" + Date.now(),
      empNo: State.currentUser.empNo,
      projectCode: code,
      projectData: State.currentProject,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: {},
    };

    State.drafts.unshift(draft);
    App.saveDrafts();
    App.renderDrafts();

    Toast.show(`WCR started for project ${code}. Sections coming in Phase 2!`, "success");
    // Phase 2: App.openWCRBuilder(draft);
  },

  // ── Drafts ──────────────────────────────────────────

  async loadDrafts() {
    // Drafts are stored as a JSON file in Drive
    try {
      const fileName = `NPPS_WCR_Drafts_${State.currentUser.empNo}.json`;
      const resp = await gapi_fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${CONFIG.DRIVE_FOLDER_ID}' in parents and trashed=false&fields=files(id,name)`
      );
      const data = await resp.json();

      if (!data.files || data.files.length === 0) {
        State.drafts = [];
        State.draftsFileId = null;
        return;
      }

      State.draftsFileId = data.files[0].id;

      // Download content
      const fileResp = await gapi_fetch(
        `https://www.googleapis.com/drive/v3/files/${State.draftsFileId}?alt=media`
      );
      const text = await fileResp.text();
      const parsed = JSON.parse(text);

      // Filter out expired drafts
      const cutoff = Date.now() - CONFIG.DRAFT_EXPIRY_DAYS * 86400000;
      State.drafts = parsed.filter(d => new Date(d.createdAt).getTime() > cutoff);

    } catch (err) {
      console.error("loadDrafts:", err);
      State.drafts = [];
    }
  },

  async saveDrafts() {
    try {
      const fileName = `NPPS_WCR_Drafts_${State.currentUser.empNo}.json`;
      const content = JSON.stringify(State.drafts, null, 2);
      const blob = new Blob([content], { type: "application/json" });

      if (State.draftsFileId) {
        // Update existing
        await gapi_fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${State.draftsFileId}?uploadType=media`,
          { method: "PATCH", body: blob }
        );
      } else {
        // Create new
        const meta = {
          name: fileName,
          parents: [CONFIG.DRIVE_FOLDER_ID],
          mimeType: "application/json",
        };
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify(meta)], { type: "application/json" }));
        form.append("file", blob);

        const resp = await gapi_fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          { method: "POST", body: form }
        );
        const created = await resp.json();
        State.draftsFileId = created.id;
      }
    } catch (err) {
      console.error("saveDrafts:", err);
    }
  },

  renderDrafts() {
    const myDrafts = State.drafts.filter(d => d.empNo === State.currentUser.empNo);
    const countEl = document.getElementById("draft-count");
    countEl.textContent = `${myDrafts.length} / ${CONFIG.MAX_DRAFTS}`;

    const list = document.getElementById("drafts-list");
    if (myDrafts.length === 0) {
      list.innerHTML = `<div class="empty-state">No drafts yet. Start a new report above.</div>`;
      return;
    }

    list.innerHTML = myDrafts.map(d => `
      <div class="draft-card" onclick="App.openDraft('${d.id}')">
        <div class="draft-card-left">
          <div class="draft-card-code">${d.projectCode}</div>
          <div class="draft-card-name">${d.projectData.CustomerName || "—"} · ${d.projectData.Vessel || "—"}</div>
          <div class="draft-card-meta">
            Created ${formatDate(d.createdAt)} ·
            Expires ${expiryDate(d.createdAt, CONFIG.DRAFT_EXPIRY_DAYS)}
          </div>
        </div>
        <div class="draft-card-right">
          <span class="status-pill ${d.status}">${d.status === "complete" ? "Complete" : "Draft"}</span>
          <button class="delete-draft" onclick="event.stopPropagation(); App.deleteDraft('${d.id}')" title="Delete draft">✕</button>
        </div>
      </div>
    `).join("");
  },

  openDraft(id) {
    const draft = State.drafts.find(d => d.id === id);
    if (!draft) return;
    State.currentDraft = draft;
    Toast.show(`Opening ${draft.projectCode}… (WCR builder coming in Phase 2)`);
    // Phase 2: App.openWCRBuilder(draft);
  },

  deleteDraft(id) {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    State.drafts = State.drafts.filter(d => d.id !== id);
    App.saveDrafts();
    App.renderDrafts();
    Toast.show("Draft deleted.");
  },

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
      projectCode,
      getValue("bd-customer"),
      getValue("bd-contract-no"),
      getValue("bd-start-date"),
      getValue("bd-end-date"),
      getValue("bd-overhaul-type"),
      getValue("bd-engine-model"),
      getValue("bd-engine-serial"),
      getValue("bd-engine-arrangement"),
      getValue("bd-rpm"),
      getValue("bd-running-hours"),
      getValue("bd-customer-incharge"),
      getValue("bd-team-leader"),
      getValue("bd-members"),
      getValue("bd-vessel"),
      getValue("bd-location"),
      new Date().toISOString(),
    ];

    try {
      // Check if project code already exists — if so, find the row and update it
      const existing = await App.findProjectRow(projectCode);

      if (existing.rowIndex !== -1) {
        // Update existing row
        const rangeRow = existing.rowIndex + 2; // 1-indexed + header
        await gapi_fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rangeRow}:Q${rangeRow}?valueInputOption=RAW`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values: [row] }),
          }
        );
      } else {
        // Append new row
        await gapi_fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A:Q:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values: [row] }),
          }
        );
      }

      document.getElementById("bd-success").classList.remove("hidden");
      Toast.show("Project data saved.", "success");
      App.clearBaseDataForm();
      await App.loadProjectsTable();

    } catch (err) {
      console.error("saveBaseData:", err);
      const errEl = document.getElementById("bd-error");
      errEl.textContent = "Save failed. Check your Drive connection.";
      errEl.classList.remove("hidden");
    }
  },

  async findProjectRow(code) {
    try {
      const resp = await gapi_fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A:A`
      );
      const data = await resp.json();
      const codes = (data.values || []).flat();
      const rowIndex = codes.findIndex((c, i) => i > 0 && c.toUpperCase() === code.toUpperCase());
      return { rowIndex };
    } catch {
      return { rowIndex: -1 };
    }
  },

  clearBaseDataForm() {
    ["bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date",
     "bd-overhaul-type","bd-engine-model","bd-engine-serial","bd-engine-arrangement",
     "bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader",
     "bd-members","bd-vessel","bd-location"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  },

  async loadProjectsTable() {
    const wrap = document.getElementById("projects-table-wrap");
    try {
      const resp = await gapi_fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1`
      );
      const data = await resp.json();
      const rows = data.values || [];

      if (rows.length < 2) {
        wrap.innerHTML = `<div class="empty-state">No projects in database yet.</div>`;
        document.getElementById("project-count").textContent = "0";
        return;
      }

      const projectRows = rows.slice(1);
      document.getElementById("project-count").textContent = projectRows.length;

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${projectRows.map((r, i) => `
              <tr>
                <td><strong>${r[0] || "—"}</strong></td>
                <td>${r[1] || "—"}</td>
                <td>${r[6] || "—"}</td>
                <td>${r[5] || "—"}</td>
                <td>${r[12] || "—"}</td>
                <td>${r[15] || "—"}</td>
                <td>${r[3] || "—"}</td>
                <td><button class="edit-btn" onclick="App.editProject(${i+1})">Edit</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

    } catch (err) {
      wrap.innerHTML = `<div class="empty-state">Could not load projects. Check Drive connection.</div>`;
    }
  },

  async editProject(rowIndex) {
    try {
      const resp = await gapi_fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${State.baseSheetId}/values/Sheet1!A${rowIndex+1}:Q${rowIndex+1}`
      );
      const data = await resp.json();
      const row = (data.values || [[]])[0];

      const fields = [
        "bd-project-code","bd-customer","bd-contract-no","bd-start-date","bd-end-date",
        "bd-overhaul-type","bd-engine-model","bd-engine-serial","bd-engine-arrangement",
        "bd-rpm","bd-running-hours","bd-customer-incharge","bd-team-leader",
        "bd-members","bd-vessel","bd-location"
      ];

      fields.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && row[i] !== undefined) el.value = row[i];
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
      Toast.show("Project loaded for editing. Make changes and save.");
    } catch (err) {
      Toast.show("Could not load project for editing.", "error");
    }
  },
};

// ── GOOGLE API FETCH HELPER ─────────────────────────────
async function gapi_fetch(url, options = {}) {
  const headers = {
    "Authorization": `Bearer ${State.googleToken}`,
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

// ── DATE HELPERS ────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function expiryDate(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── TOAST ───────────────────────────────────────────────
const Toast = {
  timer: null,
  show(msg, type = "default") {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.className = `toast show ${type}`;
    clearTimeout(Toast.timer);
    Toast.timer = setTimeout(() => { el.classList.remove("show"); }, 3500);
  }
};
