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


/* ══════════════════════════════════════════════════════════════
   NPPS WCR — Calibration Engine (Niigata)
   Schema-driven. One engine renders the builder, read-only review,
   semi-final preview, and PDF. All 14 tables are DATA, not code.

   Instance shape (stored in wcr.calibrationTables):
     { id, key, title, blocks:[ block ] }
   Block kinds:
     band   { k:'band', cells:[ { parts:[ {p:'img',src,cap} | {p:'txt',v} ] } ] }
     text   { k:'text', v }
     limits { k:'limits', per, canAdd, rows:[ [ {l,v} x per ] ] }
     grid   { k:'grid', levels, left:[{label,kind}], cap, leaf, leafLabel,
              groups:[ {label,fixed,sub:[{label}]} ], rowMode, rows,
              addCol, tail, subTpl, rowSub, rowSubLabels, linkLetters }
     letters{ k:'letters', items:[{letter,value}] }   // drives the linked grid
   Grid cells are nested per row: c[groupIndex][subIndex][leafIndex] = "value"
   ══════════════════════════════════════════════════════════════ */
const CAL = {

  // ── helpers ────────────────────────────────────────────────
  _uid() { return 'tbl_' + Date.now() + '_' + Math.floor(Math.random()*1e4); },
  _clone(o) { return JSON.parse(JSON.stringify(o)); },
  _esc(s) { return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); },

  // blank nested cell block for a single group (sub × leaf)
  _blankGroup(group, leaf) {
    return group.sub.map(() => Array.from({length: leaf}, () => ''));
  },
  // blank nested cells for all groups, one row
  _blankRowCells(grid) {
    return grid.groups.map(g => CAL._blankGroup(g, grid.leaf || 1));
  },
  _leafCount(grid) {
    const leaf = grid.leaf || 1;
    return grid.groups.reduce((n,g) => n + g.sub.length * leaf, 0);
  },

  // ── create an instance from a template key ─────────────────
  create(key) {
    const t = CAL.TEMPLATES[key];
    if (!t) return null;
    const inst = CAL._clone(t.build());
    inst.id = CAL._uid();
    inst.key = key;
    return inst;
  },

  // ════════════════════════════════════════════════════════════
  //  MUTATIONS  (ti = index in wcr.calibrationTables, bi = block index)
  // ════════════════════════════════════════════════════════════
  _tables() { return State.currentDraft.wcr.calibrationTables; },
  _snap(label) {
    const prev = CAL._clone(CAL._tables());
    Undo.push(() => { State.currentDraft.wcr.calibrationTables = prev; CAL.refresh(); }, label || 'Calibration edit');
  },
  refresh() { App.renderCalibrationTables(); },
  _save() { AutoSave.trigger(); },

  // -- text / value setters --
  setTitle(ti, v){ CAL._tables()[ti].title = v; CAL._save(); },
  setText(ti, bi, v){ CAL._tables()[ti].blocks[bi].v = v; CAL._save(); },
  setBandText(ti, bi, ci, pi, v){ CAL._tables()[ti].blocks[bi].cells[ci].parts[pi].v = v; CAL._save(); },
  setBandCap(ti, bi, ci, pi, v){ CAL._tables()[ti].blocks[bi].cells[ci].parts[pi].cap = v; CAL._save(); },
  setLimit(ti, bi, ri, ci, field, v){ CAL._tables()[ti].blocks[bi].rows[ri][ci][field] = v; CAL._save(); },
  setCaption(ti, bi, v){ CAL._tables()[ti].blocks[bi].cap.v = v; CAL._save(); },

  // -- grid header label setters --
  setLeft(ti, bi, li, v){ CAL._tables()[ti].blocks[bi].left[li].label = v; CAL._save(); },
  setGroupLabel(ti, bi, gi, v){ CAL._tables()[ti].blocks[bi].groups[gi].label = v; CAL._save(); },
  setSubLabel(ti, bi, gi, si, v){ CAL._tables()[ti].blocks[bi].groups[gi].sub[si].label = v; CAL._save(); },

  // -- grid cell setters --
  setCell(ti, bi, ri, gi, si, li, v){ CAL._tables()[ti].blocks[bi].rows[ri].c[gi][si][li] = v; CAL._save(); },
  setGCell(ti, bi, ri, si2, gi, si, li, v){ CAL._tables()[ti].blocks[bi].rows[ri].sub[si2].c[gi][si][li] = v; CAL._save(); },
  setRowLabel(ti, bi, ri, li, v){ CAL._tables()[ti].blocks[bi].rows[ri].L[li] = v; CAL._save(); },
  setGroupRowLabel(ti, bi, ri, v){ CAL._tables()[ti].blocks[bi].rows[ri].g = v; CAL._save(); },
  setSubRowLabel(ti, bi, ri, si2, v){ CAL._tables()[ti].blocks[bi].rows[ri].sub[si2].s = v; CAL._save(); },

  // -- image replace --
  pickImage(ti, bi, ci, pi){
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => {
      const f = e.target.files[0]; if(!f) return;
      const r = new FileReader();
      r.onload = ev => { CAL._tables()[ti].blocks[bi].cells[ci].parts[pi].src = ev.target.result; CAL.refresh(); CAL._save(); };
      r.readAsDataURL(f);
    };
    inp.click();
  },
  clearImage(ti, bi, ci, pi){ CAL._snap('Clear image'); CAL._tables()[ti].blocks[bi].cells[ci].parts[pi].src = null; CAL.refresh(); CAL._save(); },

  // -- limits rows --
  addLimitRow(ti, bi){
    CAL._snap('Add row');
    const b = CAL._tables()[ti].blocks[bi];
    b.rows.push(Array.from({length:b.per}, () => ({l:'', v:''})));
    CAL.refresh(); CAL._save();
  },
  delLimitRow(ti, bi, ri){
    const b = CAL._tables()[ti].blocks[bi];
    if (b.rows.length <= 1) return;
    CAL._snap('Delete row'); b.rows.splice(ri,1); CAL.refresh(); CAL._save();
  },

  // -- grid: add/remove data row --
  addGridRow(ti, bi){
    CAL._snap('Add row');
    const g = CAL._tables()[ti].blocks[bi];
    if (g.rowMode === 'group') {
      const sub = [];
      const n = g.rowSub || 1;
      for (let i=0;i<n;i++) sub.push({ s: (g.rowSubLabels && g.rowSubLabels[i]) || '', c: CAL._blankRowCells(g) });
      const nextNum = g.rows.length + 1;
      g.rows.push({ g: g.autoNum ? String(nextNum) : '', sub });
    } else {
      const nextNum = g.rows.length + 1;
      const L = g.left.map(col => col.kind === 'auto' ? String(nextNum) : '');
      g.rows.push({ L, c: CAL._blankRowCells(g) });
    }
    CAL._renumber(g);
    CAL.refresh(); CAL._save();
  },
  delGridRow(ti, bi, ri){
    const g = CAL._tables()[ti].blocks[bi];
    if (g.rows.length <= 1) return;
    CAL._snap('Delete row'); g.rows.splice(ri,1); CAL._renumber(g); CAL.refresh(); CAL._save();
  },
  _renumber(g){
    if (g.rowMode === 'group') {
      if (g.autoNum) g.rows.forEach((r,i)=> r.g = String(i+1));
    } else {
      g.left.forEach((col,li)=>{ if(col.kind==='auto') g.rows.forEach((r,i)=> r.L[li] = String(i+1)); });
    }
  },

  // -- grid: add/remove column --
  addGridCol(ti, bi){
    const g = CAL._tables()[ti].blocks[bi];
    if (g.addCol === 'none') return;
    CAL._snap('Add column');
    if (g.addCol === 'group') {
      const idx = g.groups.length - (g.tail || 0);   // before trailing fixed groups
      const tpl = g.subTpl;
      const count = g.groups.filter(x=>!x.fixed).length + 1;
      const newGroup = { label: (tpl.labelPrefix||'') + count, fixed:false, sub: tpl.sub.map(s=>({label:s.label})) };
      g.groups.splice(idx, 0, newGroup);
      CAL._eachGridRowCells(g, cellsArr => cellsArr.splice(idx, 0, CAL._blankGroup(newGroup, g.leaf||1)));
    } else { // single
      const idx = g.groups.length - (g.tail || 0);
      const newGroup = { label:'New', fixed:false, sub:[{label:''}] };
      g.groups.splice(idx, 0, newGroup);
      CAL._eachGridRowCells(g, cellsArr => cellsArr.splice(idx, 0, CAL._blankGroup(newGroup, g.leaf||1)));
    }
    CAL.refresh(); CAL._save();
  },
  delGridCol(ti, bi, gi){
    const g = CAL._tables()[ti].blocks[bi];
    if (g.groups[gi].fixed) return;
    if (g.groups.filter(x=>!x.fixed).length <= 1) return;
    CAL._snap('Delete column');
    g.groups.splice(gi,1);
    CAL._eachGridRowCells(g, cellsArr => cellsArr.splice(gi,1));
    CAL.refresh(); CAL._save();
  },
  // apply fn to each row's cells array (handles flat + grouped rows)
  _eachGridRowCells(g, fn){
    if (g.rowMode === 'group') g.rows.forEach(r => r.sub.forEach(s => fn(s.c)));
    else g.rows.forEach(r => fn(r.c));
  },

  // -- letters (Liner) : letters drive the linked grid groups --
  _linkedGrid(tbl){ return tbl.blocks.find(b => b.k === 'grid' && b.linkLetters); },
  addLetter(ti, bi){
    CAL._snap('Add letter');
    const tbl = CAL._tables()[ti];
    const lb = tbl.blocks[bi];
    const next = String.fromCharCode(65 + lb.items.length); // A,B,C...
    lb.items.push({ letter: next, value:'' });
    const g = CAL._linkedGrid(tbl);
    if (g) {
      const idx = g.groups.length - (g.tail || 0);
      const newGroup = { label: next, fixed:false, sub: g.subTpl.sub.map(s=>({label:s.label})) };
      g.groups.splice(idx, 0, newGroup);
      CAL._eachGridRowCells(g, cellsArr => cellsArr.splice(idx, 0, CAL._blankGroup(newGroup, g.leaf||1)));
    }
    CAL.refresh(); CAL._save();
  },
  setLetter(ti, bi, i, field, v){
    const tbl = CAL._tables()[ti];
    const lb = tbl.blocks[bi];
    lb.items[i][field] = v;
    if (field === 'letter') { const g = CAL._linkedGrid(tbl); if (g && g.groups[i]) g.groups[i].label = v; }
    CAL._save();
  },
  delLetter(ti, bi, i){
    const tbl = CAL._tables()[ti];
    const lb = tbl.blocks[bi];
    if (lb.items.length <= 1) return;
    CAL._snap('Delete letter');
    lb.items.splice(i,1);
    const g = CAL._linkedGrid(tbl);
    if (g) { g.groups.splice(i,1); CAL._eachGridRowCells(g, cellsArr => cellsArr.splice(i,1)); }
    CAL.refresh(); CAL._save();
  },

  // -- table-level --
  add(key){
    const inst = CAL.create(key); if(!inst) return;
    CAL._snap('Add ' + (inst.title||'table'));
    CAL._tables().push(inst);
    const pal = document.getElementById('table-palette'); if (pal) pal.classList.add('hidden');
    CAL.refresh(); CAL._save();
    Toast.show(`"${inst.title}" added.`, 'success');
  },
  remove(ti){
    if (!confirm('Delete this calibration table?')) return;
    CAL._snap('Delete table'); CAL._tables().splice(ti,1); CAL.refresh(); CAL._save();
  },
  move(ti, dir){
    const a = CAL._tables(); const ni = ti+dir;
    if (ni<0 || ni>=a.length) return;
    CAL._snap('Reorder'); [a[ti],a[ni]] = [a[ni],a[ti]]; CAL.refresh(); CAL._save();
  },

  // ════════════════════════════════════════════════════════════
  //  RENDER — grid header (shared by all modes)
  //  mode: 'edit' | 'ro' | 'ce' | 'pdf'
  // ════════════════════════════════════════════════════════════
  _gridHeaderRows(g, ti, bi, mode) {
    const leaf = g.leaf || 1;
    const lvl = g.levels || 1;
    const E = CAL._esc;
    const editLbl = (val, handler) => mode==='edit'
      ? `<input class="th-input" value="${E(val)}" oninput="${handler}"/>`
      : E(val);
    const colBtn = (gi, fixed) => (mode==='edit' && !fixed) ? `<button class="col-del" title="Delete column" onclick="CAL.delGridCol(${ti},${bi},${gi})">✕</button>` : '';

    let rows = [];
    // Row 1: left headers (rowspan lvl) + group labels (colspan sub*leaf)
    let r1 = g.left.map((col,li) => `<th rowspan="${lvl}">${ mode==='edit' ? `<input class="th-input" value="${E(col.label)}" oninput="CAL.setLeft(${ti},${bi},${li},this.value)"/>` : E(col.label)}</th>`).join('');
    g.groups.forEach((grp,gi) => {
      const span = grp.sub.length * leaf;
      // a fixed single-sub group with empty sub-label spans all levels
      const solo = grp.fixed && grp.sub.length===1 && !grp.sub[0].label;
      if (solo) {
        r1 += `<th rowspan="${lvl}">${E(grp.label)}</th>`;
      } else if (lvl === 1) {
        r1 += `<th>${editLbl(grp.label, `CAL.setGroupLabel(${ti},${bi},${gi},this.value)`)}${colBtn(gi,grp.fixed)}</th>`;
      } else {
        r1 += `<th colspan="${span}">${editLbl(grp.label, `CAL.setGroupLabel(${ti},${bi},${gi},this.value)`)}${colBtn(gi,grp.fixed)}</th>`;
      }
    });
    if (mode==='edit' && g.addCol && g.addCol!=='none')
      r1 += `<th rowspan="${lvl}"><button class="add-col-btn" onclick="CAL.addGridCol(${ti},${bi})">+ Col</button></th>`;
    rows.push('<tr>'+r1+'</tr>');

    // Row 2: sub labels (colspan leaf)
    if (lvl >= 2) {
      let r2 = '';
      g.groups.forEach((grp,gi) => {
        const solo = grp.fixed && grp.sub.length===1 && !grp.sub[0].label;
        if (solo) return; // already spanned
        grp.sub.forEach((s,si) => {
          r2 += `<th colspan="${leaf}">${ mode==='edit' && !grp.fixed ? `<input class="th-input" value="${E(s.label)}" oninput="CAL.setSubLabel(${ti},${bi},${gi},${si},this.value)"/>` : E(s.label)}</th>`;
        });
      });
      rows.push('<tr>'+r2+'</tr>');
    }
    // Row 3: leaf labels
    if (lvl >= 3) {
      let r3 = '';
      g.groups.forEach(grp => {
        const solo = grp.fixed && grp.sub.length===1 && !grp.sub[0].label;
        if (solo) return;
        grp.sub.forEach(() => { for (let l=0;l<leaf;l++) r3 += `<th>${E(g.leafLabel||'')}</th>`; });
      });
      rows.push('<tr>'+r3+'</tr>');
    }
    return rows.join('');
  },

  _totalCols(g) {
    return g.left.length + CAL._leafCount(g) ;
  },

  // grid data cell wrapper per mode
  _cell(val, mode, handler) {
    const E = CAL._esc;
    if (mode==='edit') return `<td><input class="td-input" value="${E(val)}" oninput="${handler}"/></td>`;
    if (mode==='ce')   return `<td contenteditable="true">${E(val)}</td>`;
    return `<td>${E(val)||(mode==='pdf'?'':'')}</td>`;
  },

  // ════════════════════════════════════════════════════════════
  //  RENDER — full table for screen modes (edit / ro / ce)
  // ════════════════════════════════════════════════════════════
  _renderScreen(tbl, ti, mode) {
    const E = CAL._esc;
    let h = '';
    tbl.blocks.forEach((b, bi) => {
      if (b.k === 'band') {
        h += `<div class="cal-band">`;
        b.cells.forEach((cell,ci) => {
          h += `<div class="cal-band-cell">`;
          cell.parts.forEach((part,pi) => {
            if (part.p === 'img') {
              if (mode==='edit') {
                h += `<div class="cal-img-slot" onclick="CAL.pickImage(${ti},${bi},${ci},${pi})">${ part.src ? `<img src="${part.src}"/>` : `<span class="cal-img-ph">📷 Click to add diagram</span>` }</div>`;
                if (part.src) h += `<button class="cal-img-clear" onclick="CAL.clearImage(${ti},${bi},${ci},${pi})">remove image</button>`;
                if (part.cap!==undefined) h += `<input class="cal-cap" value="${E(part.cap)}" oninput="CAL.setBandCap(${ti},${bi},${ci},${pi},this.value)" placeholder="caption"/>`;
              } else {
                if (part.src) h += `<img class="cal-img-ro" src="${part.src}"/>`;
                if (part.cap) h += `<div class="cal-cap-ro"${mode==='ce'?' contenteditable="true"':''}>${E(part.cap)}</div>`;
              }
            } else { // txt
              if (mode==='edit') h += `<textarea class="cal-zone" rows="3" oninput="CAL.setBandText(${ti},${bi},${ci},${pi},this.value)">${E(part.v)}</textarea>`;
              else h += `<div class="cal-zone-ro"${mode==='ce'?' contenteditable="true"':''}>${E(part.v).replace(/\n/g,'<br/>')}</div>`;
            }
          });
          h += `</div>`;
        });
        h += `</div>`;
      }
      else if (b.k === 'text') {
        if (mode==='edit') h += `<textarea class="cal-zone" rows="6" oninput="CAL.setText(${ti},${bi},this.value)">${E(b.v)}</textarea>`;
        else h += `<div class="cal-zone-ro"${mode==='ce'?' contenteditable="true"':''}>${E(b.v).replace(/\n/g,'<br/>')}</div>`;
      }
      else if (b.k === 'limits') {
        h += `<table class="cal-grid"><tbody>`;
        b.rows.forEach((row,ri) => {
          h += `<tr>`;
          row.forEach((pair,ci) => {
            if (mode==='edit') {
              h += `<td class="lc"><input class="td-input" value="${E(pair.l)}" oninput="CAL.setLimit(${ti},${bi},${ri},${ci},'l',this.value)"/></td><td><input class="td-input" value="${E(pair.v)}" oninput="CAL.setLimit(${ti},${bi},${ri},${ci},'v',this.value)"/></td>`;
            } else {
              h += `<td class="lc">${E(pair.l)}</td><td${mode==='ce'?' contenteditable="true"':''}>${E(pair.v)}</td>`;
            }
          });
          if (mode==='edit' && b.canAdd) h += `<td><button class="row-del-btn" onclick="CAL.delLimitRow(${ti},${bi},${ri})">✕</button></td>`;
          h += `</tr>`;
        });
        h += `</tbody></table>`;
        if (mode==='edit' && b.canAdd) h += `<button class="add-row-btn" onclick="CAL.addLimitRow(${ti},${bi})">+ Add Row</button>`;
      }
      else if (b.k === 'letters') {
        h += `<table class="cal-grid"><tbody><tr>`;
        b.items.forEach((it,i) => {
          if (mode==='edit') h += `<td class="lc" style="text-align:center"><input class="td-input" style="text-align:center" value="${E(it.letter)}" oninput="CAL.setLetter(${ti},${bi},${i},'letter',this.value)"/>${b.items.length>1?`<button class="col-del" onclick="CAL.delLetter(${ti},${bi},${i})">✕</button>`:''}</td>`;
          else h += `<th style="text-align:center">${E(it.letter)}</th>`;
        });
        if (mode==='edit') h += `<td><button class="add-col-btn" onclick="CAL.addLetter(${ti},${bi})">+ Letter</button></td>`;
        h += `</tr><tr>`;
        b.items.forEach((it,i) => {
          if (mode==='edit') h += `<td><input class="td-input" style="text-align:center" value="${E(it.value)}" oninput="CAL.setLetter(${ti},${bi},${i},'value',this.value)"/></td>`;
          else h += `<td style="text-align:center"${mode==='ce'?' contenteditable="true"':''}>${E(it.value)}</td>`;
        });
        if (mode==='edit') h += `<td></td>`;
        h += `</tr></tbody></table>`;
      }
      else if (b.k === 'grid') {
        h += `<div class="cal-grid-scroll"><table class="cal-grid">`;
        h += `<thead>${CAL._gridHeaderRows(b, ti, bi, mode)}</thead><tbody>`;
        if (b.cap) {
          const span = CAL._totalCols(b) + (mode==='edit' ? 1 : 0);
          h += `<tr><td colspan="${span}" class="cal-cap-row">${ mode==='edit' ? `<input class="td-input" value="${E(b.cap.v)}" oninput="CAL.setCaption(${ti},${bi},this.value)"/>` : E(b.cap.v) }</td></tr>`;
        }
        if (b.rowMode === 'group') {
          b.rows.forEach((r,ri) => {
            r.sub.forEach((s,si2) => {
              h += `<tr>`;
              if (si2 === 0) {
                h += `<td rowspan="${r.sub.length}" class="lc">${ mode==='edit' && !b.autoNum ? `<input class="td-input" value="${E(r.g)}" oninput="CAL.setGroupRowLabel(${ti},${bi},${ri},this.value)"/>` : E(r.g) }</td>`;
              }
              // sub-row label (e.g. IV/EV) if left has 2 cols (label + valveType)
              if (b.left.length >= 2) {
                h += `<td class="lc">${ mode==='edit' ? `<input class="td-input" value="${E(s.s)}" oninput="CAL.setSubRowLabel(${ti},${bi},${ri},${si2},this.value)"/>` : E(s.s) }</td>`;
              }
              b.groups.forEach((grp,gi) => grp.sub.forEach((sub,si) => { for (let l=0;l<(b.leaf||1);l++) {
                h += CAL._cell(s.c[gi][si][l], mode, `CAL.setGCell(${ti},${bi},${ri},${si2},${gi},${si},${l},this.value)`);
              }}));
              if (si2 === 0 && mode==='edit') h += `<td rowspan="${r.sub.length}"><button class="row-del-btn" onclick="CAL.delGridRow(${ti},${bi},${ri})">✕</button></td>`;
              h += `</tr>`;
            });
          });
        } else {
          b.rows.forEach((r,ri) => {
            h += `<tr>`;
            b.left.forEach((col,li) => {
              h += `<td class="lc">${ mode==='edit' && col.kind!=='auto' ? `<input class="td-input" value="${E(r.L[li])}" oninput="CAL.setRowLabel(${ti},${bi},${ri},${li},this.value)"/>` : E(r.L[li]) }</td>`;
            });
            b.groups.forEach((grp,gi) => grp.sub.forEach((sub,si) => { for (let l=0;l<(b.leaf||1);l++) {
              h += CAL._cell(r.c[gi][si][l], mode, `CAL.setCell(${ti},${bi},${ri},${gi},${si},${l},this.value)`);
            }}));
            if (mode==='edit') h += `<td><button class="row-del-btn" onclick="CAL.delGridRow(${ti},${bi},${ri})">✕</button></td>`;
            h += `</tr>`;
          });
        }
        h += `</tbody></table></div>`;
        if (mode==='edit' && b.addRow !== false) h += `<button class="add-row-btn" onclick="CAL.addGridRow(${ti},${bi})">+ Add Row</button>`;
      }
    });
    return h;
  },

  // ── BUILDER ────────────────────────────────────────────────
  _legacy(tbl){ return !tbl || !Array.isArray(tbl.blocks); },
  renderEditor(tables) {
    if (!tables.length) return `<div class="empty-state">No calibration tables yet. Use the palette above to add tables.</div>`;
    return tables.map((tbl, ti) => CAL._legacy(tbl) ? `
      <div class="cal-table-block" style="border-color:var(--amber)">
        <div class="cal-table-header">
          <input class="cal-table-title" value="${CAL._esc(tbl.name||tbl.title||'Legacy table')}" readonly/>
          <div class="cal-table-actions"><button class="tbl-action-btn danger" onclick="CAL.remove(${ti})">🗑 Remove</button></div>
        </div>
        <div class="empty-state" style="margin:8px 0">⚠ This is an old-format calibration table. Please remove it and re-add the table from the palette above.</div>
      </div>` : `
      <div class="cal-table-block">
        <div class="cal-table-header">
          <input class="cal-table-title" value="${CAL._esc(tbl.title)}" oninput="CAL.setTitle(${ti},this.value)"/>
          <div class="cal-table-actions">
            <button class="tbl-action-btn" onclick="Undo.last()" title="Undo">↩ Undo</button>
            ${ti>0?`<button class="tbl-action-btn" onclick="CAL.move(${ti},-1)">↑</button>`:''}
            ${ti<tables.length-1?`<button class="tbl-action-btn" onclick="CAL.move(${ti},1)">↓</button>`:''}
            <button class="tbl-action-btn danger" onclick="CAL.remove(${ti})">🗑</button>
          </div>
        </div>
        ${CAL._renderScreen(tbl, ti, 'edit')}
      </div>`).join('') +
      `<div style="margin-top:14px;text-align:right"><button class="btn-save-history" onclick="App.saveCalibrationTables()">💾 Save Calibration Tables</button></div>`;
  },

  // ── READ-ONLY (review screen) ──────────────────────────────
  renderStatic(tbl) {
    if (CAL._legacy(tbl)) return '';
    return `<div class="cal-static"><h3 class="cal-static-title">${CAL._esc(tbl.title)}</h3>${CAL._renderScreen(tbl, 0, 'ro')}</div>`;
  },
  // ── SEMI-FINAL (contenteditable preview) ───────────────────
  renderEditable(tbl) {
    if (CAL._legacy(tbl)) return '';
    return `<div class="sf-cal-block"><h3 class="sf-cal-title" contenteditable="true">${CAL._esc(tbl.title)}</h3>${CAL._renderScreen(tbl, 0, 'ce')}</div>`;
  },

  // ════════════════════════════════════════════════════════════
  //  PDF — push flow + table items into the paginator stream
  //  pushFlow(section,title,html,head) ; pushTable(obj)
  // ════════════════════════════════════════════════════════════
  buildPdfItems(tbl, ti, pushFlow, pushTable, headTitle) {
    if (CAL._legacy(tbl)) return;
    const E = CAL._esc;
    const section = 'cal'+ti;
    const title = headTitle ? E(headTitle) : E(tbl.title);
    // pre-grid blocks (band/text/limits/letters) become the table's preHtml,
    // or standalone flow if there's no following grid.
    let pre = `<h2>${title}</h2>`;
    let gridBlock = null, lettersBlock = null;

    tbl.blocks.forEach(b => {
      if (b.k === 'band') {
        pre += `<table class="cal-pdf-band"><tr>`;
        b.cells.forEach(cell => {
          pre += `<td>`;
          cell.parts.forEach(part => {
            if (part.p === 'img') {
              if (part.src) pre += `<img src="${part.src}" class="cal-pdf-img"/>`;
              if (part.cap) pre += `<div class="cal-pdf-cap">${E(part.cap)}</div>`;
            } else {
              pre += `<div class="cal-pdf-txt">${E(part.v).replace(/\n/g,'<br/>')}</div>`;
            }
          });
          pre += `</td>`;
        });
        pre += `</tr></table>`;
      }
      else if (b.k === 'text') {
        pre += `<div class="cal-pdf-txt">${E(b.v).replace(/\n/g,'<br/>')}</div>`;
      }
      else if (b.k === 'limits') {
        pre += `<table class="cal-pdf-limits"><tbody>`;
        b.rows.forEach(row => {
          pre += `<tr>`;
          row.forEach(p => pre += `<td class="lc">${E(p.l)}</td><td>${E(p.v)}</td>`);
          pre += `</tr>`;
        });
        pre += `</tbody></table>`;
      }
      else if (b.k === 'letters') {
        lettersBlock = b;
        pre += `<table class="cal-pdf-letters"><tbody><tr>`;
        b.items.forEach(it => pre += `<th>${E(it.letter)}</th>`);
        pre += `</tr><tr>`;
        b.items.forEach(it => pre += `<td>${E(it.value)}</td>`);
        pre += `</tr></tbody></table>`;
      }
      else if (b.k === 'grid') {
        gridBlock = b;
      }
    });

    if (!gridBlock) { pushFlow(section, title, pre, true); return; }

    // build thead + caption + rows + groupSizes for the grid
    const g = gridBlock;
    const headHtml = CAL._gridHeaderRows(g, ti, 0, 'pdf');
    let thead = `<thead>${headHtml}`;
    if (g.cap) thead += `<tr><td colspan="${CAL._totalCols(g)}" class="cal-cap-row">${E(g.cap.v)}</td></tr>`;
    thead += `</thead>`;

    const leaf = g.leaf || 1;
    const rowsHtml = [];
    const groupSizes = [];
    if (g.rowMode === 'group') {
      g.rows.forEach(r => {
        groupSizes.push(r.sub.length);
        r.sub.forEach((s, si2) => {
          let tr = `<tr>`;
          if (si2 === 0) tr += `<td rowspan="${r.sub.length}" class="lc">${E(r.g)}</td>`;
          if (g.left.length >= 2) tr += `<td class="lc">${E(s.s)}</td>`;
          g.groups.forEach((grp,gi) => grp.sub.forEach((sub,si) => { for (let l=0;l<leaf;l++) tr += `<td>${E(s.c[gi][si][l])}</td>`; }));
          tr += `</tr>`;
          rowsHtml.push(tr);
        });
      });
    } else {
      g.rows.forEach(r => {
        groupSizes.push(1);
        let tr = `<tr>`;
        g.left.forEach((col,li) => tr += `<td class="lc">${E(r.L[li])}</td>`);
        g.groups.forEach((grp,gi) => grp.sub.forEach((sub,si) => { for (let l=0;l<leaf;l++) tr += `<td>${E(r.c[gi][si][l])}</td>`; }));
        tr += `</tr>`;
        rowsHtml.push(tr);
      });
    }

    const wide = CAL._leafCount(g) > 7;
    pushTable({ section, title, preHtml: pre, thead, rows: rowsHtml, groupSizes,
                className: 'fit' + (wide ? ' wide' : '') });
  },
};

/* ══════════════════════════════════════════════════════════════
   TEMPLATES — the 14 Niigata calibration tables (each .build()
   returns a fresh instance).  Helpers below keep them compact.
   ══════════════════════════════════════════════════════════════ */
(function(){
  const txt = v => ({ p:'txt', v });
  const img = (cap) => ({ p:'img', src:null, cap: cap===undefined?undefined:cap });
  const cell = (...parts) => ({ parts });
  // flat grid row from leaf values laid out group-major
  const flatRow = (Lvals, groups, leaf) => {
    const c = groups.map(g => g.sub.map(()=> Array.from({length:leaf},()=> '')));
    return { L: Lvals.slice(), c };
  };
  const blankGroups = (groups, leaf) => groups.map(g => g.sub.map(()=> Array.from({length:leaf},()=> '')));

  CAL.TEMPLATES = {

    // 1 ── Crankshaft Deflections ─────────────────────────────
    crankshaftDeflection: { build: () => ({
      title: 'Crankshaft Deflections',
      blocks: [
        { k:'band', cells:[
          cell(txt("Noted as per customer's requirement")),
          cell(img('Looking from Aft to Forward')),
          cell(img('Dial Gauge Orientation')),
        ]},
        { k:'text', v:"Instructions\n1. The Deflection measurements should be made when the engine is cold.\n2. Indicate whether positive or negative.\n3. All readings in 1/100 mm.\n4. Webs opening gives a +ve reading.\n5. Maximum permissible deflection readings are as per engine manufacturer's instruction.\n6. Last check of holding down bolt tension.\n7. Other factors which may influence readings: Main bearing assembly, hot/cold condition, shaft line/gear case alignment etc." },
        { k:'grid', levels:1, leaf:1, addCol:'single', tail:1, addRow:true,
          left:[{label:'Crankpin Position', kind:'text'}],
          groups:[
            {label:'1',fixed:false,sub:[{label:''}]},{label:'2',fixed:false,sub:[{label:''}]},
            {label:'3',fixed:false,sub:[{label:''}]},{label:'4',fixed:false,sub:[{label:''}]},
            {label:'5',fixed:false,sub:[{label:''}]},{label:'6',fixed:false,sub:[{label:''}]},
            {label:'7',fixed:false,sub:[{label:''}]},{label:'8',fixed:false,sub:[{label:''}]},
            {label:'9',fixed:false,sub:[{label:''}]},{label:'Remarks',fixed:true,sub:[{label:''}]},
          ],
          rowMode:'flat',
          rows:['B1','P','T','S','B2'].map(lbl => ({ L:[lbl], c: blankGroups(Array.from({length:10},()=>({sub:[{}]})),1) })),
        },
      ],
    })},

    // 2 ── Main Journal pin dia (B) ───────────────────────────
    mainJournalB: { build: () => ({
      title: 'Main Journal pin dia (B)',
      blocks: [
        { k:'band', cells:[
          cell(img()),
          cell(txt("Crank pin Dia :\nlimit:\nNoted : 1. PS-port side to starboard\n2. TB-Top to Bottom"), img()),
        ]},
        { k:'limits', per:3, canAdd:true, rows:[[
          {l:'Makers nominal dia.',v:''},{l:'Max. dia. allowed',v:''},{l:'Max ovality allowed',v:''}
        ]]},
        { k:'grid', levels:1, leaf:1, addCol:'single', tail:0, addRow:true,
          left:[{label:'', kind:'text'}],
          groups: Array.from({length:11},(_,i)=>({label:'MJ '+(i+1),fixed:false,sub:[{label:''}]})),
          rowMode:'flat',
          rows:['Bmax','Bmin'].map(lbl => ({ L:[lbl], c: blankGroups(Array.from({length:11},()=>({sub:[{}]})),1) })),
        },
        { k:'text', v:"Observations on non-conformities of main Journals\nNote pitting, scoring or other abnormalities. Record results of Crack test (MPI/DP)." },
      ],
    })},

    // 3 ── Main Journal pin dia (A) ───────────────────────────
    mainJournalA: { build: () => ({
      title: 'Main Journal pin dia (A)',
      blocks: [
        { k:'band', cells:[
          cell(img()),
          cell(txt("Crank pin Dia :\nlimit:\nNoted : 1. PS-port side to starboard\n2. TB-Top to Bottom"), img()),
        ]},
        { k:'limits', per:3, canAdd:true, rows:[[
          {l:'Makers nominal dia.',v:''},{l:'Max. dia. allowed',v:''},{l:'Max. ovality allowed',v:''}
        ]]},
        { k:'grid', levels:2, leaf:1, addCol:'group', tail:0, addRow:true,
          subTpl:{ labelPrefix:'CR ', sub:[{label:'F'},{label:'A'}] },
          left:[{label:'', kind:'text'}],
          groups: Array.from({length:9},(_,i)=>({label:'CR '+(i+1),fixed:false,sub:[{label:'F'},{label:'A'}]})),
          rowMode:'flat',
          rows:['Amax','Amin'].map(lbl => ({ L:[lbl], c: blankGroups(Array.from({length:9},()=>({sub:[{},{}]})),1) })),
        },
        { k:'text', v:"(F-Flywheel, A-Alternator, PS-port side to starboard, TB-Top to Bottom)" },
        { k:'text', v:"Observations on non-conformities on crankpins\nNote pitting, scoring or other abnormalities. Record results of Crack test (MPI/DP)." },
      ],
    })},

    // 4 ── Liner Calibration (linked letters) ─────────────────
    linerCalibration: { build: () => ({
      title: 'Liner Calibration',
      blocks: [
        { k:'band', cells:[ cell(img()) ]},
        { k:'letters', items:[{letter:'A',value:'70'},{letter:'B',value:'280'},{letter:'C',value:'490'},{letter:'D',value:'615'}] },
        { k:'text', v:"Normal Size:\nPermissible Limit:" },
        { k:'grid', levels:2, leaf:1, addCol:'none', tail:1, addRow:true, linkLetters:true,
          subTpl:{ sub:[{label:'C-E'},{label:'F-A'}] },
          left:[{label:'Unit No.', kind:'auto'}],
          groups: ['A','B','C','D'].map(L=>({label:L,fixed:false,sub:[{label:'C-E'},{label:'F-A'}]}))
                  .concat([{label:'Remark',fixed:true,sub:[{label:''}]}]),
          rowMode:'flat',
          rows: Array.from({length:9},(_,i)=>({ L:[String(i+1)], c: blankGroups(
            ['A','B','C','D'].map(()=>({sub:[{},{}]})).concat([{sub:[{}]}]) ,1) })),
        },
        { k:'text', v:"C: Cam Side    E: Exhaust Side    F: Free End    A: Alternator End (Flywheel End)" },
      ],
    })},

    // 5 ── PORT Connecting rod small end bore ─────────────────
    portConRodSmallEnd: { build: () => CAL._conRodSmallEnd('PORT') },
    // 6 ── STBD Connecting rod small end bore ─────────────────
    stbdConRodSmallEnd: { build: () => CAL._conRodSmallEnd('STBD') },

    // 7 ── Gudgeon Pin Dia ────────────────────────────────────
    gudgeonPin: { build: () => ({
      title: 'Gudgeon Pin Dia',
      blocks: [
        { k:'band', cells:[ cell(img()), cell(img('DX / DY')) ]},
        { k:'text', v:"All dimensions are in mm\nNominal diameter of the Piston Pin is -" },
        { k:'grid', levels:1, leaf:1, addCol:'none', tail:1, addRow:true,
          left:[{label:'CYLINDER NO', kind:'auto'}],
          groups:[
            {label:'D1x',fixed:false,sub:[{label:''}]},{label:'D1y',fixed:false,sub:[{label:''}]},
            {label:'D2x',fixed:false,sub:[{label:''}]},{label:'D2y',fixed:false,sub:[{label:''}]},
            {label:'Remarks',fixed:true,sub:[{label:''}]},
          ],
          rowMode:'flat',
          rows: Array.from({length:9},(_,i)=>({ L:[String(i+1)], c: blankGroups(Array.from({length:5},()=>({sub:[{}]})),1) })),
        },
      ],
    })},

    // 8 ── Connecting rod big end ─────────────────────────────
    conRodBigEnd: { build: () => ({
      title: 'Connecting rod big end (With/Without) bearing shells',
      blocks: [
        { k:'band', cells:[
          cell(img()),
          cell(txt("Instructions: No shrinkage allowed!\nOvality is given as-"), img(), txt("OV - Permissible Limit:  0.1MM")),
        ]},
        { k:'grid', levels:2, leaf:1, addCol:'group', tail:0, addRow:true,
          subTpl:{ labelPrefix:'Unit ', sub:[{label:'F'},{label:'A'}] },
          left:[{label:'', kind:'text'}],
          groups: Array.from({length:9},(_,i)=>({label:'Unit '+(i+1),fixed:false,sub:[{label:'F'},{label:'A'}]})),
          rowMode:'flat',
          rows:['A','B','(B+C)/2','C','Ovality'].map(lbl => ({ L:[lbl], c: blankGroups(Array.from({length:9},()=>({sub:[{},{}]})),1) })),
        },
        { k:'text', v:"(F-Flywheel, A-Alternator)" },
      ],
    })},

    // 9 ── Valve Stem & Valve Guide Dia (3-level) ─────────────
    valveStemGuide: { build: () => {
      const grp = (label) => ({label, fixed:false, sub:[{label:'D1'},{label:'D2'}]});
      const def = [
        {label:'Valve guide bore', sub:[{label:'D1'},{label:'D2'}]},
        {label:'Valve stem diameter', sub:[{label:'d1'},{label:'d2'}]},
        {label:'Valve seat', sub:[{label:'In'},{label:'Ex'}]},
        {label:'Valve guide', sub:[{label:'In'},{label:'Ex'}]},
        {label:'Valve lip Thickness', sub:[{label:'T1'},{label:'T2'}]},
      ].map(g=>({label:g.label,fixed:false,sub:g.sub}));
      return {
        title: 'Valve Stem & Valve Guide Dia',
        blocks: [
          { k:'band', cells:[ cell(img()) ]},
          { k:'grid', levels:3, leaf:2, leafLabel:'mm', addCol:'group', tail:0, addRow:true,
            subTpl:{ labelPrefix:'Group ', sub:[{label:'S1'},{label:'S2'}] },
            left:[{label:'UOM', kind:'auto'}],
            groups: def,
            rowMode:'flat',
            rows: Array.from({length:9},(_,i)=>({ L:[String(i+1)], c: def.map(()=>[['',''],['','']]) })),
          },
        ],
      };
    }},

    // 10 ── Rocker Arm Bushing / Shaft (grouped rows IV/EV) ───
    rockerArm: { build: () => ({
      title: 'ROCKER ARM BUSHING / ROCKER ARM SHAFT DIAMETER',
      blocks: [
        { k:'band', cells:[
          cell(img()),
          cell(txt("1. ROCKER ARM BUSHING INNER DIAMETER =\n2. ROCKER ARM SHAFT DIAMETER =\n3. CLEARANCE  (SHAFT – BUSH) =")),
        ]},
        { k:'grid', levels:1, leaf:1, addCol:'single', tail:1, addRow:true,
          rowMode:'group', autoNum:true, rowSub:2, rowSubLabels:['IV','EV'],
          left:[{label:'Cylinder No.', kind:'auto'},{label:'Valve Type', kind:'text'}],
          groups:[
            {label:'BUSHING - D1mm',fixed:false,sub:[{label:''}]},
            {label:'BUSHING - D2mm',fixed:false,sub:[{label:''}]},
            {label:'SHAFT - D1mm',fixed:false,sub:[{label:''}]},
            {label:'SHAFT - D2mm',fixed:false,sub:[{label:''}]},
            {label:'Remarks',fixed:true,sub:[{label:''}]},
          ],
          rows: Array.from({length:9},(_,i)=>({ g:String(i+1), sub:[
            { s:'IV', c: blankGroups(Array.from({length:5},()=>({sub:[{}]})),1) },
            { s:'EV', c: blankGroups(Array.from({length:5},()=>({sub:[{}]})),1) },
          ]})),
        },
      ],
    })},

    // 11 ── Butt Clearance ────────────────────────────────────
    buttClearance: { build: () => ({
      title: 'Butt Clearance',
      blocks: [
        { k:'band', cells:[
          cell(txt("Standard :\n1st  Compression ring -  1.1 ~ 1.4 mm\n2nd Compression ring -  1.1 ~ 1.4 mm\n3rd  Compression ring -  1.1 ~ 1.4 mm\nOil ring                    -  0.65 ~ 0.95  mm")),
          cell(img()),
          cell(txt("Permissible Limit:\n2nd    -    3.5mm\n3rd    -    3.5mm")),
        ]},
        { k:'grid', levels:1, leaf:1, addCol:'single', tail:1, addRow:true,
          left:[{label:'CYLINDER NO', kind:'auto'}],
          groups:[
            {label:'1st Ring',fixed:false,sub:[{label:''}]},{label:'2nd Ring',fixed:false,sub:[{label:''}]},
            {label:'3rd Ring',fixed:false,sub:[{label:''}]},{label:'Oil ring',fixed:false,sub:[{label:''}]},
            {label:'Remarks',fixed:true,sub:[{label:''}]},
          ],
          rowMode:'flat',
          rows: Array.from({length:9},(_,i)=>({ L:[String(i+1)], c: blankGroups(Array.from({length:5},()=>({sub:[{}]})),1) })),
        },
      ],
    })},

    // 12 ── Piston Groove Clearance (grouped rows x4) ─────────
    pistonGroove: { build: () => ({
      title: 'Piston Groove Clearance',
      blocks: [
        { k:'limits', per:2, canAdd:false, rows:[[ {l:"Maker's nominal height",v:''},{l:'Max. height allowed',v:''} ]]},
        { k:'band', cells:[
          cell(img()),
          cell(txt("Standard :\n1st  Compression ring -  6 mm, +0.22 to +0.20 mm\n2nd Compression ring -  6 mm, +0.12 to +0.10 mm\n3rd  Compression ring -  6 mm, +0.05 to +0.03 mm\nOil ring                    -  8 mm, +0.05 to +0.03 mm")),
        ]},
        { k:'grid', levels:1, leaf:1, addCol:'single', tail:0, addRow:true,
          rowMode:'group', autoNum:true, rowSub:4, rowSubLabels:['','','',''],
          left:[{label:'Piston No.', kind:'auto'}],
          groups: Array.from({length:5},(_,i)=>({label:'Position '+(i+1),fixed:false,sub:[{label:''}]})),
          rows: Array.from({length:2},(_,i)=>({ g:String(i+1), sub: Array.from({length:4},()=>({ s:'', c: blankGroups(Array.from({length:5},()=>({sub:[{}]})),1) })) })),
        },
      ],
    })},

    // 13 ── Cam shaft bush clearance PORT ─────────────────────
    camshaftBushPort: { build: () => CAL._camshaftBush('PORT') },
    // 14 ── Cam shaft bush clearance STBD ─────────────────────
    camshaftBushStbd: { build: () => CAL._camshaftBush('STBD') },
  };

  // shared builders for twins
  CAL._conRodSmallEnd = (side) => ({
    title: side + ' Connecting rod small end bore calibration',
    blocks: [
      { k:'grid', levels:2, leaf:1, addCol:'none', tail:0, addRow:true,
        left:[{label:'Cylinder no', kind:'auto'}],
        cap:{ v:'PS-port side to Starboard side ,  TB-Top Bottom' },
        groups:[
          {label:"Maker's nominal dia", fixed:false, sub:[{label:'T-B'},{label:'P-S'}]},
          {label:'Piston pin bushing inner dia - 110.0 +0.13/+0.17', fixed:false, sub:[{label:'T-B'},{label:'P-S'}]},
          {label:'Piston pin to bushing clearance - 0.3 mm', fixed:true, sub:[{label:'Remarks'}]},
        ],
        rowMode:'flat',
        rows: Array.from({length:9},(_,i)=>({ L:[String(i+1)], c:[ [[''],['']], [[''],['']], [['']] ] })),
      },
    ],
  });

  CAL._camshaftBush = (side) => ({
    title: 'Cam shaft bush clearance of ' + side,
    blocks: [
      { k:'band', cells:[ cell(img()), cell(txt("Standard :\nBearing clearance-")) ]},
      { k:'grid', levels:1, leaf:1, addCol:'single', tail:0, addRow:true,
        left:[{label:'Bushing No.', kind:'auto'}],
        groups:[ {label:'Position', fixed:false, sub:[{label:''}]} ],
        rowMode:'flat',
        rows: Array.from({length:7},(_,i)=>({ L:[String(i+1)], c: [[['']]] })),
      },
    ],
  });
})();
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
      let calHtml = w.calibrationTables.map(t => CAL.renderStatic(t)).join("");
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

  insertTable(key) { CAL.add(key); },

  renderCalibrationTables() {
    const el = document.getElementById('cal-tables');
    if (el) el.innerHTML = CAL.renderEditor(State.currentDraft.wcr.calibrationTables);
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
    const DGRAMS = (typeof DIAGRAMS !== "undefined") ? DIAGRAMS  : {};
    const L = App.ENGINE_TYPE_LABELS[p.EngineType||'niigata'] || App.ENGINE_TYPE_LABELS.niigata;
    const isCatEmdPdf = (p.EngineType === 'cat' || p.EngineType === 'emd');

    const FOOTER_TEXT = "Neptunus Power Plant Services Pvt. Ltd. &nbsp;|&nbsp; A-554/555, TTC Industrial Area, MIDC, Mahape, Navi Mumbai – 400 710, India &nbsp;|&nbsp; Tel: +91 22 41410707 &nbsp;|&nbsp; www.neptunus-power.com &nbsp;|&nbsp; info@neptunus-power.com";

    // ── CSS — visual styling preserved; pagination model changed ──
    const CSS = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; }
      @page { size: A4; margin: 0; }
      .page { width: 210mm; height: 297mm; padding: 14mm 14mm 0 14mm; page-break-after: always;
              box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
      .page:last-child { page-break-after: auto; }
      .page-header { display: flex; align-items: center; justify-content: space-between;
        border-bottom: 2px solid #003366; padding-bottom: 5px; margin-bottom: 14px; flex-shrink: 0; }
      .page-header-title { font-size: 11pt; font-weight: bold; color: #003366; }
      .page-header img { height: 36px; width: auto; }
      .page-content { flex: 1 1 auto; overflow: hidden; }
      .page-footer { flex-shrink: 0; border-top: 1px solid #003366; padding: 4px 0 6mm 0;
        font-size: 7pt; color: #555; text-align: center; margin-top: auto; }
      h1 { text-align: center; font-size: 16pt; color: #003366; margin: 10px 0 6px; }
      h2 { font-size: 11pt; color: #003366; border-bottom: 2px solid #003366;
           padding-bottom: 3px; margin: 16px 0 6px; }
      h2:first-child, .page-content > h2:first-child { margin-top: 0; }
      h2 .cont { font-weight: normal; font-size: 9pt; color: #555; }
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
      .tpre { margin: 0; }
      .cal-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
      .cal-row img { width: 120px; flex-shrink: 0; }
      .cal-note { font-size: 8pt; line-height: 1.6; flex: 1; }
      .cal-img-auto { max-width: 180px; height: auto; object-fit: contain; }
      /* Annexure / parts tables: never exceed the content width */
      table.fit { table-layout: fixed; width: 100%; }
      table.fit td, table.fit th { word-break: break-word; overflow-wrap: anywhere; }
      /* Wide annexures (many columns) auto-shrink to stay portrait */
      table.wide { font-size: 7pt; }
      table.wide td, table.wide th { padding: 2px 3px; }
      .cal-pdf-band { width:100%; border-collapse:collapse; margin-bottom:8px; table-layout:fixed; }
      .cal-pdf-band td { border:1px solid #aaa; padding:6px; vertical-align:top; text-align:center; }
      .cal-pdf-img { max-width:100%; max-height:200px; height:auto; object-fit:contain; display:block; margin:0 auto 4px; }
      .cal-pdf-cap { font-size:8pt; font-weight:bold; text-align:center; margin-top:2px; }
      .cal-pdf-txt { font-size:8.5pt; line-height:1.5; text-align:left; margin-bottom:6px; }
      .cal-pdf-limits { width:100%; border-collapse:collapse; margin-bottom:8px; font-size:8.5pt; }
      .cal-pdf-limits td { border:1px solid #aaa; padding:3px 6px; }
      .cal-pdf-limits td:nth-child(odd) { background:#f5f5f5; font-weight:bold; width:18%; }
      .cal-pdf-letters { border-collapse:collapse; margin-bottom:8px; font-size:9pt; }
      .cal-pdf-letters th, .cal-pdf-letters td { border:1px solid #aaa; padding:3px 12px; text-align:center; }
      .cal-pdf-letters th { background:#dde4ef; color:#003366; }
      .cal-cap-row { background:#eef1f6; font-weight:bold; text-align:center; font-size:8.5pt; }
      .photo-grid td { border: 1px solid #aaa; padding: 8px; text-align: center; width: 50%; vertical-align: top; }
      .photo-grid img { width: 100%; height: auto; max-width: 100%; object-fit: contain; display: block; }
      .pcap { font-size: 8.5pt; font-weight: bold; text-transform: uppercase; margin-top: 4px; }
      .pdesc { font-size: 7.5pt; color: #444; margin-top: 2px; }
      .cover-img { max-width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; margin: 0 auto 10px; }
      #measure { position: absolute; left: -99999px; top: 0; width: 182mm; }
      @media print { #measure { display: none !important; } }
    `;

    // ── Build the ordered item stream ────────────────────────
    // Each item is one of:
    //   { kind:'flow',  section, title, head, html }
    //   { kind:'table', section, title, className, thead, rows:[html...], preHtml }
    //   { kind:'pagebreak' }
    const items = [];
    const pushFlow  = (section, title, html, head) => items.push({ kind:'flow', section, title: title||'', head: !!head, html });
    const pushTable = (o) => items.push(Object.assign({ kind:'table', title:'', className:'', thead:'', rows:[], preHtml:'' }, o));
    const pushBreak = () => items.push({ kind:'pagebreak' });

    // ── Cover (own page) ──
    let cover = `<div class="cover"><h1>Work Completion Report</h1>`;
    if (p.CustomerName) cover += `<p style="text-align:center;font-size:12pt;font-weight:bold;color:#003366;margin:4px 0 10px">${p.CustomerName}</p>`;
    if (p.VesselImageBase64) cover += `<div style="text-align:center;margin:10px 0"><img src="${p.VesselImageBase64}" class="cover-img"/></div>`;
    cover += `<table>
      <tr><td class="lc">Customer Name</td><td><strong>${p.CustomerName||"—"}</strong></td><td class="lc">${L.contractNo}</td><td>${p.ContractNo||"—"}</td></tr>
      <tr><td class="lc">Start Date of Job</td><td>${p.StartDate||"—"}</td><td class="lc">${L.endDate}</td><td>${p.EndDate||"—"}</td></tr>
      <tr><td class="lc">${L.overhaulType}</td><td>${p.OverhaulType||"—"}</td><td class="lc">Engine Make and Model</td><td>${p.EngineModel||"—"}</td></tr>
      <tr><td class="lc">Engine Serial Number</td><td>${p.EngineSerial||"—"}</td><td class="lc">${L.arrangement}</td><td>${p.EngineArrangement||"—"}</td></tr>
      <tr><td class="lc">RPM and Capacity</td><td>${p.RPMCapacity||"—"}</td><td class="lc">Current Running Hours</td><td>${p.RunningHours||"—"}</td></tr>
      <tr><td class="lc">Customer In-Charge</td><td>${p.CustomerIncharge||"—"}</td><td class="lc">Neptunus Team Leader</td><td>${p.TeamLeader||"—"}</td></tr>
      <tr><td class="lc">Neptunus Members</td><td colspan="3">${p.Members||"—"}</td></tr>
    </table></div>`;
    pushFlow('__cover__', '', cover, true);
    pushBreak();

    // ── History ──
    if (w.historyActive && w.historyRows?.length) {
      const rows = w.historyRows.map(r => {
        if (r.type === 'subtable') {
          return `<tr><td class="lc" style="vertical-align:top">${r.label}</td><td>
            <table style="width:100%;border-collapse:collapse;font-size:8pt;margin:0">
              <tr>${(r.headers||[]).map(h=>`<th style="border:1px solid #aaa;padding:3px 5px;background:#dde4ef;font-size:7.5pt">${h}</th>`).join('')}</tr>
              <tr>${(r.subheaders||[]).map(h=>`<th style="border:1px solid #aaa;padding:3px 5px;background:#f0f0f0;font-size:7pt">${h}</th>`).join('')}</tr>
              ${(r.rows||[]).map(row=>`<tr>${row.map(c=>`<td style="border:1px solid #aaa;padding:3px 5px">${c||'—'}</td>`).join('')}</tr>`).join('')}
            </table>
          </td></tr>`;
        }
        const val = r.value && r.value.trim() ? r.value : 'NA';
        return `<tr><td class="lc">${r.label||"—"}</td><td>${val}</td></tr>`;
      });
      pushTable({ section:'history', title:'History', preHtml:`<h2>History</h2>`, thead:'', rows });
    }

    // ── Mandays (CAT/EMD) ──
    if (isCatEmdPdf && w.mandaysActive && w.mandaysRows?.length) {
      const rows = (w.mandaysRows||[]).filter(Boolean).map(r =>
        `<tr><td class="lc">${r.label||''}</td><td>${r.value && r.value.trim() ? r.value : 'NA'}</td></tr>`);
      rows.push(`<tr><td colspan="2" style="font-size:7.5pt;font-style:italic">Note: All days to be on calendar day basis</td></tr>`);
      pushTable({ section:'mandays', title:'Mandays', preHtml:`<h2>Mandays</h2>`,
        thead:`<thead><tr><th colspan="2" style="text-align:center">Mandays</th></tr></thead>`, rows });
    }

    // ── Scope of Work ──
    if (w.scopeActive) {
      const isCE = (p.EngineType === 'cat' || p.EngineType === 'emd');
      if (isCE && w.catEmdScope?.length) {
        const rows = (w.catEmdScope||[]).map(r => r.type === 'heading'
          ? `<tr><td colspan="3" style="background:#dde4ef;font-weight:bold;text-align:center">${r.text||''}</td></tr>`
          : `<tr><td style="text-align:center">${r.sr||''}</td><td>${r.contents||'—'}</td><td style="text-align:center">${r.included && r.included.trim() ? r.included : 'NA'}</td></tr>`);
        pushTable({ section:'scope', title:'Scope of Work', preHtml:`<h2>Scope of Work</h2>`,
          thead:`<thead><tr><th style="width:6%">Sr.</th><th>Contents</th><th style="width:15%">Included (Yes/No)</th></tr></thead>`, rows });
      } else if (!isCE && w.scopeOfWork?.length) {
        const rows = w.scopeOfWork.map(r => `<tr><td>${r.original||"—"}</td><td>${r.done||"—"}</td></tr>`);
        pushTable({ section:'scope', title:'Scope of Work', preHtml:`<h2>Scope of Work</h2>`,
          thead:`<thead><tr><th>Describe what the original scope of work was</th><th>Describe what was done (include additions and omissions, with reasons)</th></tr></thead>`, rows });
      }
    }

    // ── Deviations ──
    if (w.deviationsActive) {
      const devRows = w.deviationRows || [
        { label:"Next Maintenance Type & Date", value:`${w.deviations?.nextMaintType||"—"} ${w.deviations?.nextMaintDate||""}` },
        { label:"Parts Renewal Required", value:w.deviations?.partsRenewal||"—" }
      ];
      const rows = devRows.map(r => `<tr><td class="lc">${r.label||"—"}</td><td>${r.value||"—"}</td></tr>`);
      pushTable({ section:'deviations', title:'Deviations and Reference Notes for Next Overhaul',
        preHtml:`<h2>Deviations and Reference Notes for Next Overhaul</h2>`, thead:'', rows });
    }

    // ── Maintenance Summary ──
    if (isCatEmdPdf && w.catEmdMaintSummary && w.catEmdMaintSummary.length > 0) {
      const rows = (w.catEmdMaintSummary||[]).filter(Boolean).map(row => {
        const verbs = Array.isArray(row.verbs) ? row.verbs : [];
        const part = row.part || '—';
        const sentence = verbs.length > 0
          ? `${part} was ${verbs.slice(0,-1).join(', ')}${verbs.length > 1 ? ' and ' : ''}${verbs[verbs.length-1]}.`
          : 'NA';
        return `<tr><td>${part}</td><td>${sentence}</td><td style="text-align:center">${row.replaced ? '✓' : ''}</td><td style="text-align:center">${row.reused ? '✓' : ''}</td></tr>`;
      });
      pushTable({ section:'maint', title:'Maintenance Summary', preHtml:`<h2>Maintenance Summary</h2>`,
        thead:`<thead><tr><th style="width:22%">Parts Description</th><th>Brief Description</th><th style="width:8%;text-align:center">Replaced</th><th style="width:8%;text-align:center">Reused</th></tr></thead>`, rows });
      const pdfBullets = Array.isArray(w.catEmdRemarksBullets) ? w.catEmdRemarksBullets.filter(b=>b&&b.trim()) : [];
      const pdfLegacy = (w.catEmdRemarks||'').trim();
      if (pdfBullets.length || pdfLegacy) {
        const remHtml = `<h3 style="margin-top:10px">Additional Remarks / Non-Conformities</h3>` +
          (pdfBullets.length ? `<ul>${pdfBullets.map(b=>`<li>${b}</li>`).join('')}</ul>`
                             : `<p style="white-space:pre-line;font-size:9pt">${pdfLegacy}</p>`);
        pushFlow('maint', 'Maintenance Summary', remHtml, false);
      }
    } else {
      let currentGroup = null;
      const maintGroups = [];
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
      pushFlow('maint', 'Maintenance Summary', `<h2>Maintenance Summary</h2>`, true);
      maintGroups.forEach(g => {
        let html = `<div class="maint-group">`;
        if (g.heading) html += `<h3>${g.heading}</h3>`;
        if (g.bullets.length) html += `<ul>${g.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
        html += `</div>`;
        pushFlow('maint', 'Maintenance Summary', html, false);
      });
    }

    // ── Scope for Improvement ──
    {
      const rows = (w.scopeForImprovement||[]).map((r,i) =>
        `<tr><td style="text-align:center">${i+1}</td><td>${r.area||"—"}</td><td>${r.observations||"—"}</td><td>${r.recommendations||"—"}</td></tr>`);
      pushTable({ section:'sfi', title:'Scope for Improvement', preHtml:`<h2>Scope for Improvement</h2>`,
        thead:`<thead><tr><th style="width:5%">No.</th><th>Area</th><th style="width:22%">Observations</th><th style="width:22%">Recommendations</th></tr></thead>`,
        rows, className:'fit' });
    }

    // ── Recommendations ──
    {
      const intro = `<h2>Recommendations</h2><p style="font-size:8.5pt;margin-bottom:6px">The engine post overhaul must be closely monitored for any abnormalities which could cause serious breakdowns. It is a known fact that most breakdowns on overhauled engines occur within the first 100 hours post overhaul. We therefore, recommend the following:</p>`;
      pushFlow('recs', 'Recommendations', intro, true);
      (w.recommendations||[]).forEach((r,i) => {
        pushFlow('recs', 'Recommendations', `<ol start="${i+1}"><li>${r}</li></ol>`, false);
      });
    }

    // ── Calibration Tables (Annexures) ──
    if (w.calibrationTables?.length) {
      w.calibrationTables.forEach((t, ti) => {
        CAL.buildPdfItems(t, ti, pushFlow, pushTable, `Annexure ${ti+1} \u2014 ${t.title||""}`);
      });
    }

    // ── Parts Consumed ──
    if (w.partsColumns?.rows?.length) {
      const headers = w.partsColumns.headers || [];
      const wide = headers.length > 6;
      const rows = w.partsColumns.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`);
      pushTable({ section:'parts', title:'Parts Consumed List', preHtml:`<h2>Parts Consumed List</h2>`,
        thead:`<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`,
        rows, className:'fit' + (wide ? ' wide' : '') });
    }

    // ── Photo Gallery ──
    const realPhotos = (w.photos||[]).filter(ph => ph.src);
    if (realPhotos.length) {
      const rows = [];
      for (let i = 0; i < realPhotos.length; i += 2) {
        const ph1 = realPhotos[i], ph2 = realPhotos[i+1]||null;
        rows.push(`<tr>
          <td><img src="${ph1.src}" style="width:100%;height:auto;object-fit:contain;max-height:260px;display:block"/><div class="pcap">${(ph1.title||"").toUpperCase()}</div>${ph1.description?`<div class="pdesc">${ph1.description}</div>`:""}</td>
          <td>${ph2?`<img src="${ph2.src}" style="width:100%;height:auto;object-fit:contain;max-height:260px;display:block"/><div class="pcap">${(ph2.title||"").toUpperCase()}</div>${ph2.description?`<div class="pdesc">${ph2.description}</div>`:""}`:""}</td>
        </tr>`);
      }
      pushTable({ section:'photos', title:'Photo Gallery', preHtml:`<h2>Photo Gallery</h2>`,
        thead:'', rows, className:'photo-grid' });
    }

    // ── Sign-off ──
    {
      const so = w.signoff||{};
      const rows = [
        `<tr><td class="lc">Maker Name</td><td>${so.makerName||"—"}</td><td class="lc">Name</td><td>${so.customerName||"—"}</td></tr>`,
        `<tr><td class="lc">Checker Name</td><td>${so.checkerName||"—"}</td><td class="lc">Date</td><td>${so.customerDate||"—"}</td></tr>`,
        `<tr><td class="lc">Approver Name</td><td>${so.approverName||"—"}</td><td></td><td></td></tr>`,
        `<tr><td class="lc">Date</td><td>${so.makerDate||"—"}</td><td></td><td></td></tr>`
      ];
      pushTable({ section:'signoff', title:'Sign-off', preHtml:`<h2>Sign-off</h2>`,
        thead:`<thead><tr><th colspan="2" style="text-align:center">On behalf of Neptunus</th><th colspan="2" style="text-align:center">On behalf of Customer</th></tr></thead>`, rows });
    }

    // ── Filename ──
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const yy = String(today.getFullYear()).slice(-2);
    const authorName = (draft.authorName || State.currentUser?.name || 'User').replace(/\s+/g,'_');
    const pdfFileName = `${draft.projectCode}_${authorName}_${dd}-${mm}-${yy}`;

    // ── Header HTML (repeats on every page) ──
    const headerHtml = `<span class="page-header-title">Work Completion Report &mdash; ${p.CustomerName||draft.projectCode}</span>` +
      (LOGO ? `<img src="${LOGO}" alt="NPPS" />` : `<span style="font-weight:bold;color:#003366">NEPTUNUS</span>`);

    // ── Data + paginator scripts for the print window ──
    const itemsJson = JSON.stringify(items).replace(/<\/script/gi, '<\\/script');
    const dataScript = `var ITEMS=${itemsJson};var HDR=${JSON.stringify(headerHtml)};var FTR=${JSON.stringify(FOOTER_TEXT)};var DOCTITLE=${JSON.stringify(pdfFileName)};`;

    // Measure-and-pack engine. No template literals here (keeps ${ } literal-free).
    const paginatorScript = `
(function(){
  var measure=document.getElementById('measure');
  var root=document.getElementById('pages');
  var page,content,curSection=null;

  function el(html){var d=document.createElement('div');d.innerHTML=html;return d.firstElementChild;}
  function newPage(){
    page=document.createElement('div');page.className='page';
    page.innerHTML='<div class="page-header">'+HDR+'</div><div class="page-content"></div><div class="page-footer">'+FTR+'</div>';
    root.appendChild(page);
    content=page.querySelector('.page-content');
  }
  function over(){return content.scrollHeight>content.clientHeight+1;}
  function contHeader(t){if(!t)return;content.appendChild(el('<h2 class="sec-h">'+t+' <span class="cont">(continued)</span></h2>'));}
  function noRows(){return content.querySelectorAll('tbody tr').length===0;}

  // Instantiate every item once in the offscreen measure area (also kicks off image loads).
  var units=[];
  for(var k=0;k<ITEMS.length;k++){
    var it=ITEMS[k];
    if(it.kind==='pagebreak'){units.push({type:'break'});continue;}
    if(it.kind==='flow'){
      var node=el(it.html);measure.appendChild(node);
      units.push({type:'flow',node:node,section:it.section,title:it.title,head:!!it.head});
    } else {
      var preNode=null;
      if(it.preHtml){preNode=el('<div class="tpre">'+it.preHtml+'</div>');measure.appendChild(preNode);}
      var mt=el('<table class="'+(it.className||'')+'">'+(it.thead||'')+'<tbody></tbody></table>');
      mt.querySelector('tbody').innerHTML=(it.rows||[]).join('');
      measure.appendChild(mt);
      var rn=Array.prototype.slice.call(mt.querySelector('tbody').children);
      var sizes=(it.groupSizes&&it.groupSizes.length)?it.groupSizes:null;
      var rg=[];
      if(sizes){var pp=0;for(var z=0;z<sizes.length;z++){rg.push(rn.slice(pp,pp+sizes[z]));pp+=sizes[z];}if(pp<rn.length)rg.push(rn.slice(pp));}
      else{for(var z2=0;z2<rn.length;z2++)rg.push([rn[z2]]);}
      units.push({type:'table',preNode:preNode,thead:(it.thead||''),className:(it.className||''),
                  rowGroups:rg,section:it.section,title:it.title});
    }
  }

  function placeFlow(u){
    var had=content.children.length;
    content.appendChild(u.node);
    if(over()&&had>0){
      content.removeChild(u.node);
      newPage();
      if(!u.head&&u.section===curSection)contHeader(u.title);
      content.appendChild(u.node);
    }
    curSection=u.section;
  }

  function placeTable(u){
    var gi=0,first=true;
    while(true){
      if(first){
        if(u.preNode){
          var had=content.children.length;
          content.appendChild(u.preNode);
          if(over()&&had>0){content.removeChild(u.preNode);newPage();content.appendChild(u.preNode);}
        }
        first=false;
      } else {
        newPage();
        contHeader(u.title);
      }
      if(gi>=u.rowGroups.length)break;
      var table=el('<table class="'+u.className+'">'+u.thead+'<tbody></tbody></table>');
      content.appendChild(table);
      var tb=table.querySelector('tbody');
      var placed=0;
      while(gi<u.rowGroups.length){
        var grp=u.rowGroups[gi];
        for(var r=0;r<grp.length;r++)tb.appendChild(grp[r]);
        if(over()){for(var r2=0;r2<grp.length;r2++)tb.removeChild(grp[r2]);break;}
        gi++;placed++;
      }
      if(placed===0){
        content.removeChild(table);
        if(noRows()){
          content.appendChild(table);
          var grp3=u.rowGroups[gi];for(var r3=0;r3<grp3.length;r3++)tb.appendChild(grp3[r3]);gi++;
          if(gi>=u.rowGroups.length)break;
        }
      } else if(gi>=u.rowGroups.length){
        break;
      }
    }
    curSection=u.section;
  }

  function run(){
    newPage();
    for(var u=0;u<units.length;u++){
      var x=units[u];
      if(x.type==='break'){newPage();curSection=null;continue;}
      if(x.type==='flow')placeFlow(x);else placeTable(x);
    }
    if(measure&&measure.parentNode)measure.parentNode.removeChild(measure);
    document.title=DOCTITLE;
    setTimeout(function(){window.print();},300);
  }

  // Wait for images (correct heights) before packing.
  var imgs=measure.querySelectorAll('img');
  var n=imgs.length,done=0;
  if(!n){run();}
  else{
    for(var i=0;i<n;i++){
      var im=imgs[i];
      if(im.complete){if(++done===n)run();}
      else{im.onload=im.onerror=function(){if(++done===n)run();};}
    }
    // Safety: never hang if an image stalls.
    setTimeout(function(){if(done<n){done=n;run();}},4000);
  }
})();
`;

    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <title>${pdfFileName}</title>
      <style>${CSS}
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style></head><body>
      <div id="measure"></div>
      <div id="pages"></div>
      <script>${dataScript}<\/script>
      <script>${paginatorScript}<\/script>
      </body></html>`;

    // ── Open in new tab — auto-prints on load ──
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
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
        ${w.calibrationTables.map(t => CAL.renderEditable(t)).join("")}
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
