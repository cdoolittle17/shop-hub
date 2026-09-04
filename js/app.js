/* GLOBAL UI CONTROLS & ROUTER */
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

async function switchTab(tabName) {
    // 1. Reset and style buttons
    document.querySelectorAll('[id^="btn-tab-"]').forEach(btn => {
        btn.classList.remove('bg-white', 'text-blue-600', 'dark:bg-slate-900', 'dark:text-blue-400', 'shadow-sm');
        btn.classList.add('text-slate-500', 'dark:text-slate-400');
    });
    
    const activeBtn = document.getElementById('btn-tab-' + tabName);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-500', 'dark:text-slate-400');
        activeBtn.classList.add('bg-white', 'text-blue-600', 'dark:bg-slate-900', 'dark:text-blue-400', 'shadow-sm');
    }

    // 2. Fetch and inject HTML
    const contentDiv = document.getElementById('app-content');
    try {
        const response = await fetch(`pages/${tabName}.html`);
        if (!response.ok) throw new Error("File not found");
        const html = await response.text();
        contentDiv.innerHTML = html;

        // 3. Trigger context-specific renders after HTML loads
        if (tabName === 'repair') {
            renderRepairCategories();
        } else if (tabName === 'fluid') {
            initFluidSearch();
        } else if (tabName === 'tools') {
            performToolSearch();
            renderRacksList();
            populateRackDropdown();
        } else if (tabName === 'time') {
            const empSelect = document.getElementById('filterEmp');
            if (empSelect && configuredCards.length > 0) {
                empSelect.innerHTML = '<option value="All">All Employees</option>' + configuredCards.map(c => `<option value="${c.employee}">${c.employee}</option>`).join('');
                document.getElementById('addShiftEmp').innerHTML = configuredCards.map(c => `<option value="${c.employee}">${c.employee}</option>`).join('');
            }
            if (parsedTimecardsData && parsedTimecardsData.length > 0) {
                document.getElementById('viewFilters').classList.remove('hidden');
                document.getElementById('viewFilters').classList.add('flex');
                document.getElementById('addShiftBox').classList.remove('hidden');
                document.getElementById('addShiftBox').classList.add('flex');
                renderTimecardSummaries();
            }
        }
    } catch (error) {
        contentDiv.innerHTML = `<div class="p-8 text-center text-red-500 font-bold"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Error loading tab: ${error.message}. <br>Make sure you are testing on a live server (like GitHub Pages).</div>`;
    }
}

function updateSyncStatus(msg, isError = false) {
    const statusObj = document.getElementById('syncStatus');
    if (!statusObj) return;
    statusObj.innerText = msg;
    statusObj.className = isError ? "text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700" : "text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-700 shadow-sm";
}

/* -------------------------------------------
   GLOBAL DATA VARIABLES & CONSTANTS
------------------------------------------- */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUnIEHNpyL1onu52p5lwvX27L1jhgvscQlpnMb6NIDcWaikJu111lFz8xkuAlROePqLw/exec";
localStorage.removeItem('shopJobs'); // Clear stale jobs

let jobsData = [];
let selectedJob = null;
const initialJobs = [
    { category: "Air Conditioning", job: "A/C Compressor", required: ["Evac & Recharge W/ Dye", "Drier"], recommended: ["Cabin Filter"] },
    { category: "Brakes", job: "Brake Pads + Rotors", required: ["Brake Flush"], recommended: ["Hardware"] }
];

let racks = [], tools = [];
let configuredCards = [];
let parsedTimecardsData = [];

/* -------------------------------------------
   REPAIR ORDER LOGIC
------------------------------------------- */
async function fetchFromSheets() {
    try {
        const res = await fetch(GOOGLE_SCRIPT_URL + "?action=getJobs");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            jobsData = data;
            localStorage.setItem('shopJobs', JSON.stringify(jobsData));
            updateSyncStatus("Connected to Sheets");
        } else {
            jobsData = initialJobs;
        }
    } catch (err) { 
        jobsData = initialJobs; 
        updateSyncStatus("Offline Mode", true);
    }
}

function renderRepairCategories() {
    const container = document.getElementById('jobListContainer');
    if (!container) return; // Prevent errors if tab not loaded
    const search = (document.getElementById('jobSearchInput').value || "").toLowerCase();
    container.innerHTML = "";

    const filtered = jobsData.filter(j => j.job.toLowerCase().includes(search) || j.category.toLowerCase().includes(search));
    const grouped = filtered.reduce((acc, obj) => { (acc[obj.category] = acc[obj.category] || []).push(obj); return acc; }, {});

    const sortedCategories = Object.keys(grouped).sort();
    if (sortedCategories.length === 0) {
        container.innerHTML = '<div class="text-slate-400 text-xs text-center py-8">No repair jobs found matching search.</div>';
        return;
    }

    for (const cat of sortedCategories) {
        const catDiv = document.createElement('div');
        catDiv.innerHTML = `<h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">${cat}</h3>`;
        const list = document.createElement('div');
        grouped[cat].sort((a,b)=>a.job.localeCompare(b.job)).forEach(item => {
            const btn = document.createElement('button');
            btn.className = `w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedJob && selectedJob.job === item.job ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`;
            btn.innerText = item.job;
            btn.onclick = () => selectRepairJob(item);
            list.appendChild(btn);
        });
        catDiv.appendChild(list);
        container.appendChild(catDiv);
    }
}

function selectRepairJob(job) {
    selectedJob = job;
    renderRepairCategories();
    document.getElementById('actionFooter').classList.remove('hidden');
    document.getElementById('detailsContainer').innerHTML = `
        <div class="mb-4"><span class="text-xs font-bold text-blue-500 uppercase">${job.category}</span><h2 class="text-2xl font-bold">${job.job}</h2></div>
        <div class="mb-4"><h4 class="text-xs font-bold text-red-500 uppercase mb-2">Required Services</h4>${(job.required||[]).map(r=>`<div class="bg-red-50 text-red-700 font-bold p-2 rounded mb-1 text-sm">• ${r}</div>`).join('')}</div>
        <div><h4 class="text-xs font-bold text-amber-600 uppercase mb-2">Recommended Add-Ons</h4>${(job.recommended||[]).map(r=>`<div class="bg-slate-100 text-slate-700 p-2 rounded mb-1 text-sm">• ${r}</div>`).join('')}</div>
    `;
}

function copyJobToClipboard() {
    if (!selectedJob) return;
    let text = `JOB: ${selectedJob.job}\nREQUIRED:\n` + (selectedJob.required||[]).map(r=>`- ${r}`).join('\n') + `\nRECOMMENDED:\n` + (selectedJob.recommended||[]).map(r=>`- ${r}`).join('\n');
    navigator.clipboard.writeText(text);
    const toast = document.getElementById('toastMsg');
    toast.classList.remove('opacity-0');
    setTimeout(()=> toast.classList.add('opacity-0'),2000);
}

function openAddJobModal() { 
    const select = document.getElementById('newCatSelect');
    const categories = [...new Set(jobsData.map(j => j.category))].sort();
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
    select.innerHTML += `<option value="custom">+ Add New Category...</option>`;
    document.getElementById('addJobModal').classList.remove('hidden'); 
    document.getElementById('addJobModal').classList.add('flex');
}

function closeAddJobModal() { 
    document.getElementById('addJobModal').classList.add('hidden'); 
    document.getElementById('addJobModal').classList.remove('flex');
}

function handleJobCategoryChange() {
    const select = document.getElementById('newCatSelect');
    const customInput = document.getElementById('newCatCustom');
    if (select.value === 'custom') {
        customInput.classList.remove('hidden');
    } else {
        customInput.classList.add('hidden');
    }
}

async function saveNewRepairJob() {
    const catSelect = document.getElementById('newCatSelect').value;
    const category = catSelect === 'custom' ? document.getElementById('newCatCustom').value.trim() : catSelect;
    const jobName = document.getElementById('newJob').value.trim();
    
    const reqList = document.getElementById('newReq').value.split(',').map(s => s.trim()).filter(s => s);
    const recList = document.getElementById('newRec').value.split(',').map(s => s.trim()).filter(s => s);

    if (!jobName || !category) return alert("Category and Job Title are required.");

    const newEntry = { category, job: jobName, required: reqList, recommended: recList };
    jobsData.push(newEntry);
    localStorage.setItem('shopJobs', JSON.stringify(jobsData));
    renderRepairCategories();
    
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "addJob", jobData: newEntry })
        });
    } catch (e) {}

    closeAddJobModal();
    document.getElementById('newJob').value = '';
    document.getElementById('newReq').value = '';
    document.getElementById('newRec').value = '';
    document.getElementById('newCatCustom').value = '';
    document.getElementById('newCatCustom').classList.add('hidden');
    
    updateSyncStatus("New Job Saved!");
}

function deleteCurrentJob() {
    if (!selectedJob) return;
    if (!confirm(`Are you sure you want to delete ${selectedJob.job}?`)) return;

    jobsData = jobsData.filter(j => j.job !== selectedJob.job);
    localStorage.setItem('shopJobs', JSON.stringify(jobsData));
    
    renderRepairCategories();
    document.getElementById('detailsContainer').innerHTML = '<div class="text-slate-400 text-center mt-20">Select a job from the list on the left to view required and recommended parts/services.</div>';
    document.getElementById('actionFooter').classList.add('hidden');
    selectedJob = null;
    updateSyncStatus("Job Deleted");
}

/* -------------------------------------------
   FLUID SEARCH LOGIC
------------------------------------------- */
function initFluidSearch() {
    const yearSelect = document.getElementById('fluid-year');
    if (!yearSelect) return;
    
    // Get unique years, sort descending
    const years = [...new Set(fluidDatabase.map(item => item.year))].sort((a, b) => b - a);
    yearSelect.innerHTML = '<option value="">Select Year...</option>' + years.map(y => `<option value="${y}">${y}</option>`).join('');
    
    document.getElementById('fluid-make').innerHTML = '<option value="">Select Make...</option>';
    document.getElementById('fluid-model').innerHTML = '<option value="">Select Model...</option>';
    document.getElementById('fluid-engine').innerHTML = '<option value="">Select Engine...</option>';
    
    document.getElementById('fluid-make').disabled = true;
    document.getElementById('fluid-model').disabled = true;
    document.getElementById('fluid-engine').disabled = true;
    document.getElementById('fluid-result-card').classList.add('hidden');
}

function fluidDropdownUpdate(step) {
    const year = document.getElementById('fluid-year').value;
    const make = document.getElementById('fluid-make').value;
    const model = document.getElementById('fluid-model').value;
    const engine = document.getElementById('fluid-engine').value;

    document.getElementById('fluid-result-card').classList.add('hidden');

    if (step === 'year') {
        const makes = [...new Set(fluidDatabase.filter(i => i.year === year).map(i => i.make))].sort();
        document.getElementById('fluid-make').innerHTML = '<option value="">Select Make...</option>' + makes.map(m => `<option value="${m}">${m}</option>`).join('');
        document.getElementById('fluid-make').disabled = false;
        
        document.getElementById('fluid-model').innerHTML = '<option value="">Select Model...</option>';
        document.getElementById('fluid-model').disabled = true;
        document.getElementById('fluid-engine').innerHTML = '<option value="">Select Engine...</option>';
        document.getElementById('fluid-engine').disabled = true;
    } 
    else if (step === 'make') {
        const models = [...new Set(fluidDatabase.filter(i => i.year === year && i.make === make).map(i => i.model))].sort();
        document.getElementById('fluid-model').innerHTML = '<option value="">Select Model...</option>' + models.map(m => `<option value="${m}">${m}</option>`).join('');
        document.getElementById('fluid-model').disabled = false;
        
        document.getElementById('fluid-engine').innerHTML = '<option value="">Select Engine...</option>';
        document.getElementById('fluid-engine').disabled = true;
    }
    else if (step === 'model') {
        const engines = [...new Set(fluidDatabase.filter(i => i.year === year && i.make === make && i.model === model).map(i => i.engine))].sort();
        document.getElementById('fluid-engine').innerHTML = '<option value="">Select Engine...</option>' + engines.map(e => `<option value="${e}">${e}</option>`).join('');
        document.getElementById('fluid-engine').disabled = false;
    }
    else if (step === 'engine') {
        const result = fluidDatabase.find(i => i.year === year && i.make === make && i.model === model && i.engine === engine);
        if (result) showFluidResult(result);
    }
}

function showFluidResult(data) {
    const card = document.getElementById('fluid-result-card');
    card.classList.remove('hidden', 'bg-emerald-100', 'border-emerald-500', 'text-emerald-900', 'bg-blue-100', 'border-blue-500', 'text-blue-900', 'bg-red-100', 'border-red-500', 'text-red-900');
    
    // Apply Colors based on Action (Bulk vs Shelf vs Dealer)
    if (data.action === 'bulk') {
        card.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
        document.getElementById('fluid-result-type').innerText = "✅ Approved For Bulk Dispenser";
    } else if (data.action === 'shelf') {
        card.classList.add('bg-blue-100', 'border-blue-500', 'text-blue-900');
        document.getElementById('fluid-result-type').innerText = "🧴 Grab From Back Shelf";
    } else {
        card.classList.add('bg-red-100', 'border-red-500', 'text-red-900');
        document.getElementById('fluid-result-type').innerText = "⚠️ Dealer / Special Order Required";
    }

    document.getElementById('fluid-result-bottle').innerText = data.bottle;
    document.getElementById('fluid-result-spec').innerText = data.spec;
    document.getElementById('fluid-result-notes').innerText = data.notes || "N/A";
}

/* -------------------------------------------
   TOOL TRACKER LOGIC
------------------------------------------- */
async function fetchDatabase() {
    try {
        const res = await fetch(GOOGLE_SCRIPT_URL + "?action=getTools");
        const data = await res.json();
        if (data.tools) tools = data.tools;
        if (data.racks) racks = data.racks;
    } catch(e) {}
}

function showToolView(viewId) {
    document.querySelectorAll('.tool-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    
    // Update active button styling
    document.querySelectorAll('.tool-nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900/50', 'dark:text-blue-300');
        btn.classList.add('text-slate-600', 'dark:text-slate-400');
    });
    const activeBtn = document.getElementById(viewId === 'view-search' ? 'btn-tool-search' : (viewId === 'view-add-tool' ? 'btn-tool-add' : 'btn-tool-setup'));
    if (activeBtn) {
        activeBtn.classList.add('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900/50', 'dark:text-blue-300');
        activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
    }
}

function performToolSearch() {
    const searchInput = document.getElementById('toolSearchInput');
    if (!searchInput) return;
    const q = (searchInput.value || "").toLowerCase();
    const sort = document.getElementById('sortSelect').value;
    
    let filtered = tools.filter(t => 
        (t.name && t.name.toLowerCase().includes(q)) || 
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.tags && t.tags.toLowerCase().includes(q)) ||
        (t.position && t.position.toLowerCase().includes(q))
    );

    if(sort === 'name-asc') filtered.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    else if(sort === 'name-desc') filtered.sort((a,b) => (b.name||'').localeCompare(a.name||''));
    else if(sort === 'id-asc') filtered.sort((a,b) => (`${a.rack}${a.shelf}`).localeCompare(`${b.rack}${b.shelf}`));
    else if(sort === 'id-desc') filtered.sort((a,b) => (`${b.rack}${b.shelf}`).localeCompare(`${a.rack}${a.shelf}`));

    const container = document.getElementById('searchResults');
    container.innerHTML = filtered.length === 0 
        ? '<div class="col-span-2 text-center text-slate-400 py-8">No tools found matching your search.</div>' 
        : filtered.map(t => `
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-sm">
                <h4 class="font-bold text-blue-600 dark:text-blue-400">${t.name}</h4>
                <p class="text-xs text-slate-500 mt-1">
                  <i class="fa-solid fa-location-dot mr-1"></i> Rack ${t.rack || '-'} / Shelf ${t.shelf || '-'} 
                  ${t.position ? `<span class="ml-2 font-semibold text-slate-700 dark:text-slate-300">• Position: ${t.position}</span>` : ''}
                </p>
                ${t.category ? `<span class="inline-block mt-2 text-[10px] font-semibold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded">${t.category}</span>` : ''}
            </div>
          `).join('');
}

function updateToolSort() { performToolSearch(); }

async function addTool(e) { 
    e.preventDefault(); 
    const newTool = {
        name: document.getElementById('toolName').value,
        category: document.getElementById('toolCategory').value,
        tags: document.getElementById('toolTags').value,
        rack: document.getElementById('toolRack').value,
        shelf: parseInt(document.getElementById('toolShelf').value),
        position: document.getElementById('toolPosition').value
    };

    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerText = "Saving...";
    
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "addTool", toolData: newTool })
        });
        tools.push(newTool);
        e.target.reset();
        showToolView('view-search');
        performToolSearch();
        updateSyncStatus("Tool saved");
    } catch(err) {
        alert("Error saving tool: " + err.message);
    }
    btn.innerText = "Save Tool";
}

async function addRack(e) { 
    e.preventDefault(); 
    const newRack = {
        name: document.getElementById('rackName').value,
        shelves: parseInt(document.getElementById('shelfCount').value)
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "addRack", rackData: newRack })
        });
        racks.push(newRack);
        e.target.reset();
        renderRacksList();
        populateRackDropdown();
        updateSyncStatus("Rack added");
    } catch(err) {
        alert("Error adding rack: " + err.message);
    }
}

function renderRacksList() {
    const list = document.getElementById('racksList');
    if(list) list.innerHTML = racks.map(r => `
        <div class="flex justify-between items-center bg-white dark:bg-slate-800 p-2 mb-1 rounded border border-slate-200 dark:border-slate-700 text-sm">
            <span class="font-bold text-slate-700 dark:text-slate-200">Rack ${r.name}</span>
            <span class="text-xs text-slate-500">${r.shelves} Shelves</span>
        </div>
    `).join('');
}

function populateRackDropdown() {
    const drop = document.getElementById('toolRack');
    if(drop) drop.innerHTML = racks.map(r => `<option value="${r.name}">Rack ${r.name}</option>`).join('');
}

function handleCSVImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(event) {
        const text = event.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const newTools = rows.slice(1).filter(r => r.length > 2).map(r => ({
            shelf: parseInt(r[0]), rack: r[1]?.trim(), name: r[2]?.trim(), category: r[3]?.trim(), tags: r[4]?.trim(), position: r[5]?.trim() || ''
        }));
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: "importToolsCSV", toolsData: newTools })
            });
            tools = [...tools, ...newTools];
            performToolSearch();
            updateSyncStatus("CSV Imported");
        } catch(err) { alert("Import Error"); }
        e.target.value = '';
    };
    reader.readAsText(file);
}

/* -------------------------------------------
   TIME & TRELLO LOGIC
------------------------------------------- */
async function fetchTimecardConfigsFromSheets() {
    try {
        const res = await fetch(GOOGLE_SCRIPT_URL + "?action=getConfigs");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            configuredCards = data;
            localStorage.setItem('configuredCards', JSON.stringify(configuredCards));
        }
    } catch(e) {
        configuredCards = JSON.parse(localStorage.getItem('configuredCards') || '[]');
    }
}

function openSettingsModal() {
    renderSettingsConfigRows();
    document.getElementById('settingsModal').classList.remove('hidden');
    document.getElementById('settingsModal').classList.add('flex');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden');
    document.getElementById('settingsModal').classList.remove('flex');
}

function addTimecardConfigRow(emp = '', cardId = '') {
    const container = document.getElementById('timecardConfigsList');
    const row = document.createElement('div');
    row.className = "flex gap-2 items-center";
    row.innerHTML = `
        <input type="text" placeholder="Employee" value="${emp}" class="w-1/3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 rounded text-xs config-emp">
        <input type="text" placeholder="Trello Card ID" value="${cardId}" class="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 rounded text-xs config-card">
        <button onclick="this.parentElement.remove()" class="text-red-500 text-xs px-1 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
    `;
    container.appendChild(row);
}

function renderSettingsConfigRows() {
    const container = document.getElementById('timecardConfigsList');
    container.innerHTML = '';
    if(configuredCards.length === 0) {
        addTimecardConfigRow('Caleb', '');
    } else {
        configuredCards.forEach(c => addTimecardConfigRow(c.employee, c.cardId));
    }
}

async function saveSettings() {
    const empInputs = document.querySelectorAll('.config-emp');
    const cardInputs = document.querySelectorAll('.config-card');
    configuredCards = [];
    empInputs.forEach((input, index) => {
        const emp = input.value.trim();
        const cardId = cardInputs[index].value.trim();
        if(emp && cardId) configuredCards.push({ employee: emp, cardId: cardId });
    });
    localStorage.setItem('configuredCards', JSON.stringify(configuredCards));
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "saveConfigs", configs: configuredCards })
        });
        updateSyncStatus("Settings synced!");
    } catch(e) {}
    closeSettingsModal();
}

async function handleClockPunch(type) {
    const emp = document.getElementById('timeclockEmployee').value;
    const timestamp = new Date().toLocaleString();
    const noteText = `${type} at ${timestamp}`;
    updateSyncStatus(`Clocking ${type}...`);
    
    const cardConfig = configuredCards.find(c => c.employee.toLowerCase() === emp.toLowerCase());
    const cardId = cardConfig ? cardConfig.cardId : null;

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "clockEvent", employee: emp, type: type, timestamp: timestamp, source: "Timeclock Button", notes: noteText, cardId: cardId })
        });
        updateSyncStatus("Punch Synced!");
    } catch (e) { 
        updateSyncStatus("Error saving punch", true);
    }
}

// Math/Time Utilities
function convertTo24Hour(time12h) {
    if (!time12h) return "";
    const match = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "";
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = match[3].toUpperCase();
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}
function convertTo12Hour(time24h) {
    if (!time24h) return "";
    let [hours, minutes] = time24h.split(':');
    hours = parseInt(hours, 10);
    const modifier = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${modifier}`;
}
function getMinutesFromTime(timeStr) {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    let m = parseInt(match[2], 10);
    let ampm = match[3].toUpperCase();
    if (h === 12) h = 0;
    if (ampm === 'PM') h += 12;
    return (h * 60) + m;
}
function formatHours(totalMinutes) { return (totalMinutes / 60).toFixed(2); }
function calculateDayTotals(punches) {
    if (punches.length !== 4) return { workHrs: 0, lunchHrs: 0 };
    const p1 = getMinutesFromTime(punches[0].timeStr);
    const p2 = getMinutesFromTime(punches[1].timeStr);
    const p3 = getMinutesFromTime(punches[2].timeStr);
    const p4 = getMinutesFromTime(punches[3].timeStr);
    let morningMins = Math.max(0, p2 - p1);
    let afternoonMins = Math.max(0, p4 - p3);
    let lunchMins = Math.max(0, p3 - p2);
    return { workHrs: formatHours(morningMins + afternoonMins), lunchHrs: formatHours(lunchMins) };
}

function classifyPunchIntent(text) {
    const clean = text.toLowerCase().trim();
    const scores = { 'Clock In': 0, 'Lunch Out': 0, 'Lunch In': 0, 'Clock Out': 0 };
    if (/\b(in|arrived|start|started|got here|morning|beginning|shift start|clocked in|punch in)\b/.test(clean)) scores['Clock In'] += 2;
    if (/\b(lunch|food|eat|eating|break|out)\b/.test(clean) && scores['Clock In'] > 0) scores['Clock In'] -= 1;
    if (/\b(lunch out|lunch start|going to lunch|heading to lunch|out to lunch|food break|taking lunch|eating|lunchtime|leaving for lunch)\b/.test(clean)) scores['Lunch Out'] += 3;
    if (/\b(lunch in|lunch end|back from lunch|returned from lunch|done with lunch|finished lunch|back at shop|lunch over)\b/.test(clean)) scores['Lunch In'] += 3;
    if (/\b(out|clock out|clocked out|leaving|head home|heading home|done|finished|end of day|bye|done for the day|calling it)\b/.test(clean)) scores['Clock Out'] += 2;
    let bestType = 'Unknown';
    let maxScore = 0;
    for (const [type, score] of Object.entries(scores)) {
        if (score > maxScore) { maxScore = score; bestType = type; }
    }
    return bestType;
}

function parseTrelloComments(comments) {
    const dailyGroups = {};
    comments.forEach(c => {
        if (!c.date) return;
        const dateObj = new Date(c.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const detectedType = classifyPunchIntent(c.data.text);
        if (!dailyGroups[dateStr]) dailyGroups[dateStr] = { dateStr: dateStr, punches: [] };
        dailyGroups[dateStr].punches.push({ type: detectedType, text: c.data.text, dateStr: dateStr, timeStr: timeStr, rawDate: c.date });
    });
    for (const dateStr in dailyGroups) {
        dailyGroups[dateStr].punches.sort((a,b) => new Date(`${a.dateStr} ${a.timeStr}`) - new Date(`${b.dateStr} ${b.timeStr}`));
        if (dailyGroups[dateStr].punches.length === 4) {
            dailyGroups[dateStr].punches[0].type = 'Clock In';
            dailyGroups[dateStr].punches[1].type = 'Lunch Out';
            dailyGroups[dateStr].punches[2].type = 'Lunch In';
            dailyGroups[dateStr].punches[3].type = 'Clock Out';
        }
    }
    return dailyGroups;
}

function saveTimecardOverride(emp, dateStr, punchesArray) {
    let overrides = JSON.parse(localStorage.getItem('timecardOverrides') || '{}');
    overrides[`${emp}_${dateStr}`] = punchesArray;
    localStorage.setItem('timecardOverrides', JSON.stringify(overrides));
}

function applyLocalOverrides() {
    let overrides = JSON.parse(localStorage.getItem('timecardOverrides') || '{}');
    parsedTimecardsData.forEach((tc) => {
        const emp = tc.employee;
        Object.keys(overrides).forEach(key => {
            const [overrideEmp, overrideDateStr] = key.split('_');
            if (overrideEmp === emp) {
                if (!tc.dailyGroups[overrideDateStr]) tc.dailyGroups[overrideDateStr] = { dateStr: overrideDateStr, punches: [] };
                tc.dailyGroups[overrideDateStr].punches = overrides[key];
            }
        });
    });
}

async function fetchTrelloTimecards() {
    if (configuredCards.length === 0) {
        alert("No Time Cards configured! Please add employee Trello Card IDs in settings.");
        openSettingsModal();
        return;
    }
    const container = document.getElementById('timecardContainer');
    container.innerHTML = '<div class="text-center py-8 text-blue-500 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Fetching securely via Google Sheets...</div>';
    parsedTimecardsData = [];
    
    for (const config of configuredCards) {
        try {
            const res = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST', headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: "fetchTrello", cardId: config.cardId })
            });
            const comments = await res.json();
            if (!comments.error) {
                const dailyGroups = parseTrelloComments(comments);
                parsedTimecardsData.push({ employee: config.employee, cardId: config.cardId, dailyGroups: dailyGroups });
            }
        } catch(e) {}
    }
    applyLocalOverrides();

    document.getElementById('viewFilters').classList.remove('hidden');
    document.getElementById('viewFilters').classList.add('flex');
    document.getElementById('filterEmp').innerHTML = '<option value="All">All Employees</option>' + configuredCards.map(c => `<option value="${c.employee}">${c.employee}</option>`).join('');

    document.getElementById('addShiftBox').classList.remove('hidden');
    document.getElementById('addShiftBox').classList.add('flex');
    document.getElementById('addShiftEmp').innerHTML = configuredCards.map(c => `<option value="${c.employee}">${c.employee}</option>`).join('');

    renderTimecardSummaries();
}

function openAddPunch(empIdx, dateStr) {
    document.getElementById('punchModalTitle').innerText = "Add Punch for " + dateStr;
    document.getElementById('punchModalEmpIdx').value = empIdx;
    document.getElementById('punchModalDateStr').value = dateStr;
    document.getElementById('punchModalPunchIdx').value = -1; 
    document.getElementById('punchModalTime').value = ""; 
    document.getElementById('punchModal').classList.remove('hidden');
    document.getElementById('punchModal').classList.add('flex');
}

function openEditPunch(empIdx, dateStr, punchIdx) {
    const punch = parsedTimecardsData[empIdx].dailyGroups[dateStr].punches[punchIdx];
    document.getElementById('punchModalTitle').innerText = "Edit Punch";
    document.getElementById('punchModalEmpIdx').value = empIdx;
    document.getElementById('punchModalDateStr').value = dateStr;
    document.getElementById('punchModalPunchIdx').value = punchIdx;
    document.getElementById('punchModalType').value = punch.type;
    document.getElementById('punchModalTime').value = convertTo24Hour(punch.timeStr);
    document.getElementById('punchModal').classList.remove('hidden');
    document.getElementById('punchModal').classList.add('flex');
}

function closePunchModal() {
    document.getElementById('punchModal').classList.add('hidden');
    document.getElementById('punchModal').classList.remove('flex');
}

function savePunchModal() {
    const empIdx = document.getElementById('punchModalEmpIdx').value;
    const dateStr = document.getElementById('punchModalDateStr').value;
    const punchIdx = parseInt(document.getElementById('punchModalPunchIdx').value);
    const type = document.getElementById('punchModalType').value;
    const timeVal = document.getElementById('punchModalTime').value;

    if (!timeVal) return alert("Please select a time.");
    const timeStr = convertTo12Hour(timeVal);
    const empName = parsedTimecardsData[empIdx].employee;
    const timestamp = `${dateStr} ${timeStr}`;

    if (punchIdx === -1) {
        parsedTimecardsData[empIdx].dailyGroups[dateStr].punches.push({ type: type, text: `Manual Entry: ${type}`, dateStr: dateStr, timeStr: timeStr });
    } else {
        const punch = parsedTimecardsData[empIdx].dailyGroups[dateStr].punches[punchIdx];
        punch.type = type; punch.timeStr = timeStr; punch.text = `Manual Edit: ${type}`;
    }

    parsedTimecardsData[empIdx].dailyGroups[dateStr].punches.sort((a,b) => new Date(`${a.dateStr} ${a.timeStr}`) - new Date(`${b.dateStr} ${b.timeStr}`));
    saveTimecardOverride(empName, dateStr, parsedTimecardsData[empIdx].dailyGroups[dateStr].punches);
    closePunchModal();
    renderTimecardSummaries();

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: "clockEvent", employee: empName, type: type, timestamp: timestamp, notes: "Manager Override via Dashboard" })
    });
}

function removePunchFromReport(empIdx, dateStr, punchIdx) {
    if(confirm("Delete this punch and update Google Sheets?")) {
        const punch = parsedTimecardsData[empIdx].dailyGroups[dateStr].punches[punchIdx];
        const empName = parsedTimecardsData[empIdx].employee;
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "clockEvent", employee: empName, type: "Deleted: " + punch.type, timestamp: `${dateStr} ${punch.timeStr}`, notes: "Manager Deleted via Dashboard" })
        });
        parsedTimecardsData[empIdx].dailyGroups[dateStr].punches.splice(punchIdx, 1);
        saveTimecardOverride(empName, dateStr, parsedTimecardsData[empIdx].dailyGroups[dateStr].punches);
        renderTimecardSummaries();
    }
}

function saveManualPunchForDate(empIdx, dateStr, type) {
    const inputId = `manual-${empIdx}-${dateStr.replace(/\//g,'-')}-${type.replace(/\s+/g, '')}`;
    const timeVal = document.getElementById(inputId).value;
    if (!timeVal) return alert("Please select a time first.");

    const timeStr = convertTo12Hour(timeVal);
    const timestamp = `${dateStr} ${timeStr}`;
    const empName = parsedTimecardsData[empIdx].employee;

    parsedTimecardsData[empIdx].dailyGroups[dateStr].punches.push({ type: type, text: `Manual Entry: ${type}`, dateStr: dateStr, timeStr: timeStr });
    parsedTimecardsData[empIdx].dailyGroups[dateStr].punches.sort((a,b) => new Date(`${a.dateStr} ${a.timeStr}`) - new Date(`${b.dateStr} ${b.timeStr}`));
    saveTimecardOverride(empName, dateStr, parsedTimecardsData[empIdx].dailyGroups[dateStr].punches);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: "clockEvent", employee: empName, type: type, timestamp: timestamp, notes: "Manual Resolution" })
    });
    renderTimecardSummaries();
}

function addFullShift() {
    const empName = document.getElementById('addShiftEmp').value;
    const dateVal = document.getElementById('addShiftDate').value; 
    if (!empName || !dateVal) return alert("Please select an employee and a date.");

    const localDate = new Date(dateVal + 'T12:00:00');
    const dateStr = localDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const empIdx = parsedTimecardsData.findIndex(tc => tc.employee === empName);
    if (empIdx === -1) return alert("Employee data not loaded.");

    if (!parsedTimecardsData[empIdx].dailyGroups[dateStr]) {
        parsedTimecardsData[empIdx].dailyGroups[dateStr] = { dateStr: dateStr, punches: [] };
    }

    const standardPunches = [
        { type: 'Clock In', timeStr: '8:00 AM' },
        { type: 'Lunch Out', timeStr: '12:00 PM' },
        { type: 'Lunch In', timeStr: '12:30 PM' },
        { type: 'Clock Out', timeStr: '5:00 PM' }
    ];

    standardPunches.forEach(p => {
        parsedTimecardsData[empIdx].dailyGroups[dateStr].punches.push({ type: p.type, text: "Manager Added Full Shift", dateStr: dateStr, timeStr: p.timeStr });
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "clockEvent", employee: empName, type: p.type, timestamp: `${dateStr} ${p.timeStr}`, notes: "Manager Added Full Shift" })
        });
    });

    saveTimecardOverride(empName, dateStr, parsedTimecardsData[empIdx].dailyGroups[dateStr].punches);
    renderTimecardSummaries();
}

function renderTimecardSummaries() {
    const container = document.getElementById('timecardContainer');
    container.innerHTML = '';
    const empFilter = document.getElementById('filterEmp').value || 'All';
    const startFilter = document.getElementById('filterStart').value;
    const endFilter = document.getElementById('filterEnd').value;
    const startFilterDate = startFilter ? new Date(startFilter + "T00:00:00") : null;
    const endFilterDate = endFilter ? new Date(endFilter + "T23:59:59") : null;

    parsedTimecardsData.forEach((tc, empIdx) => {
        if (empFilter !== 'All' && tc.employee !== empFilter) return; 
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm mb-6";

        let activeDates = Object.keys(tc.dailyGroups || {}).sort((a,b) => new Date(b) - new Date(a));
        activeDates = activeDates.filter(dateStr => {
            const currentDay = new Date(dateStr);
            if (startFilterDate && currentDay < startFilterDate) return false;
            if (endFilterDate && currentDay > endFilterDate) return false;
            return true;
        });

        let totalWorkHours = 0;
        let totalLunchHours = 0;
        activeDates.forEach(dateStr => {
            const totals = calculateDayTotals(tc.dailyGroups[dateStr].punches);
            totalWorkHours += parseFloat(totals.workHrs);
            totalLunchHours += parseFloat(totals.lunchHrs);
        });

        let cardHTML = `
            <div class="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-5 gap-3">
                <div><h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">${tc.employee}'s Timecard</h3></div>
                <div class="flex items-center gap-4 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div class="text-center px-3 border-r border-slate-300 dark:border-slate-600">
                        <div class="text-[10px] font-bold text-slate-500 uppercase">Total Work</div>
                        <div class="text-lg font-black text-blue-600 dark:text-blue-400">${totalWorkHours.toFixed(2)} <span class="text-xs font-normal">hrs</span></div>
                    </div>
                    <div class="text-center px-3">
                        <div class="text-[10px] font-bold text-slate-500 uppercase">Total Break</div>
                        <div class="text-lg font-black text-amber-600 dark:text-amber-400">${totalLunchHours.toFixed(2)} <span class="text-xs font-normal">hrs</span></div>
                    </div>
                </div>
            </div>
        `;

        if (activeDates.length === 0) {
            cardHTML += `<div class="text-slate-400 text-sm italic py-4 flex justify-center items-center h-20">No punches found.</div>`;
        } else {
            activeDates.forEach(dateStr => {
                const punches = tc.dailyGroups[dateStr].punches;
                const reqTypes = ['Clock In', 'Lunch Out', 'Lunch In', 'Clock Out'];
                const existingTypes = punches.map(p => p.type);
                const missing = reqTypes.filter(t => !existingTypes.includes(t));
                const dayTotals = calculateDayTotals(punches);

                cardHTML += `
                    <div class="mb-5 border border-slate-200 dark:border-slate-700/60 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/40">
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                            <div class="flex items-center gap-3">
                                <span class="font-bold text-sm text-blue-600 dark:text-blue-400"><i class="fa-regular fa-calendar-days mr-1.5"></i> ${dateStr}</span>
                                ${punches.length === 4 ? `<span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">${dayTotals.workHrs} hrs</span>` : ''}
                            </div>
                            <div class="flex items-center gap-3">
                                ${missing.length > 0 ? `<span class="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded">${missing.length} Missing</span>` : `<span class="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded">Complete</span>`}
                                <button onclick="openAddPunch(${empIdx}, '${dateStr}')" class="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-bold shadow hover:bg-blue-200">+ Add</button>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 class="text-xs font-bold text-slate-500 uppercase mb-2">Detected Punches</h5>
                                <div class="space-y-1.5">
                                    ${punches.map((p, punchIdx) => `
                                        <div class="flex justify-between items-center text-xs bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                                            <div><span class="font-bold">${p.type}</span> <span class="text-slate-400 block truncate w-32" title="${p.text}">"${p.text}"</span></div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="font-mono mr-2">${p.timeStr}</span>
                                                <button onclick="openEditPunch(${empIdx}, '${dateStr}', ${punchIdx})" class="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-bold">Edit</button>
                                                <button onclick="removePunchFromReport(${empIdx}, '${dateStr}', ${punchIdx})" class="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold">Del</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            ${missing.length > 0 ? `
                                <div class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                                    <h5 class="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase mb-2">Quick Correction</h5>
                                    ${missing.map(mType => `
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="text-xs font-semibold w-24">${mType}:</span>
                                            <input type="time" id="manual-${empIdx}-${dateStr.replace(/\//g,'-')}-${mType.replace(/\s+/g, '')}" class="bg-white dark:bg-slate-800 border text-xs p-1.5 rounded flex-1">
                                            <button onclick="saveManualPunchForDate(${empIdx}, '${dateStr}', '${mType}')" class="bg-amber-600 text-white text-xs px-2.5 py-1.5 rounded font-bold shadow">Save</button>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        }
        card.innerHTML = cardHTML;
        container.appendChild(card);
    });
}

function generatePDFReport() {
    if (!parsedTimecardsData.length) return alert("Please Sync Trello first.");
    updateSyncStatus("Generating PDF...");
    const container = document.getElementById('timecardContainer');
    const opt = { margin: 10, filename: `Timecards_${new Date().toISOString().slice(0,10)}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(container).save().then(() => updateSyncStatus("PDF Exported!"));
}

function exportCSV() {
    if (!parsedTimecardsData.length) return alert("Please Sync Trello first.");
    let csvContent = "Employee,Date,Type,Time\n";
    parsedTimecardsData.forEach(tc => {
        Object.keys(tc.dailyGroups || {}).forEach(dateStr => {
            tc.dailyGroups[dateStr].punches.forEach(p => {
                csvContent += `"${tc.employee}","${dateStr}","${p.type}","${p.timeStr}"\n`;
            });
        });
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Timecards_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* -------------------------------------------
   APP INITIALIZATION
------------------------------------------- */
window.onload = async () => {
    // Fire up background fetches
    await fetchFromSheets();
    await fetchDatabase();
    await fetchTimecardConfigsFromSheets();
    
    // Auto-load default tab
    await switchTab('repair'); 
};