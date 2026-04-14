// Logs and Journal functionality for Peptide Calculator
// This file should be included in schedule.html

// ── Data Storage Keys ─────────────────────────────────────────
const LOGS_STORAGE_KEY = 'peptideLogs';
const JOURNAL_STORAGE_KEY = 'peptideJournal';
const WEIGHT_UNIT_KEY = 'weightUnitPreference';

// ── Security Helpers ─────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str || '');
  return div.innerHTML;
}

// ── Data Models ──────────────────────────────────────────────
function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      alert('Storage full — clear some data to continue saving.');
    }
  }
}

function getJournal() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveJournal(journal) {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(journal));
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      alert('Storage full — clear some data to continue saving.');
    }
  }
}

function getWeightUnit() {
  return localStorage.getItem(WEIGHT_UNIT_KEY) || 'lbs';
}

function saveWeightUnit(unit) {
  try {
    localStorage.setItem(WEIGHT_UNIT_KEY, unit);
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      alert('Storage full — clear some data to continue saving.');
    }
  }
}

// ── Log Entry Functions ──────────────────────────────────────
function addLogEntry(date, weight, energy, symptoms = [], notes = '') {
  const logs = getLogs();
  const timestamp = new Date(date).getTime();
  
  // Remove existing entry for same date if exists
  const existingIndex = logs.findIndex(log => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === compareDate.getTime();
  });
  
  const newEntry = {
    date,
    weight: parseFloat(weight),
    energy: parseInt(energy),
    symptoms: Array.isArray(symptoms) ? symptoms : [],
    notes: notes || '',
    timestamp
  };
  
  if (existingIndex >= 0) {
    logs[existingIndex] = newEntry;
  } else {
    logs.push(newEntry);
  }
  
  // Sort by date descending (newest first)
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  saveLogs(logs);
  return newEntry;
}

function deleteLogEntry(date) {
  const logs = getLogs();
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() !== compareDate.getTime();
  });
  
  saveLogs(filteredLogs);
  return filteredLogs;
}

// ── Journal Entry Functions ──────────────────────────────────
function addJournalEntry(date, note, mood = '', timestamp = null, symptoms = {}) {
  const journal = getJournal();
  const entryTimestamp = timestamp || new Date(date).getTime();
  
  // Remove existing entry for same date if exists
  const existingIndex = journal.findIndex(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === compareDate.getTime();
  });
  
  const newEntry = {
    date,
    note: note || '',
    mood: mood || '',
    timestamp: entryTimestamp,
    symptoms: symptoms || {}
  };
  
  if (existingIndex >= 0) {
    journal[existingIndex] = newEntry;
  } else {
    journal.push(newEntry);
  }
  
  // Sort by date descending (newest first)
  journal.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  saveJournal(journal);
  return newEntry;
}

function deleteJournalEntry(date) {
  const journal = getJournal();
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  const filteredJournal = journal.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() !== compareDate.getTime();
  });
  
  saveJournal(filteredJournal);
  return filteredJournal;
}

// ── Formatting Helpers ───────────────────────────────────────
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (compareDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  const daysDiff = Math.floor((today - compareDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeight(weight, unit) {
  if (!weight && weight !== 0) return '—';
  return `${weight} ${unit}`;
}

function getEnergyEmoji(rating) {
  const emojis = ['😫', '😕', '😐', '🙂', '😄'];
  return emojis[Math.max(0, Math.min(rating - 1, 4))] || '😐';
}

function getMoodEmoji(mood) {
  const moodMap = {
    '😫': '😫 Very Bad',
    '😕': '😕 Bad',
    '😐': '😐 Neutral',
    '🙂': '🙂 Good',
    '😄': '😄 Excellent'
  };
  return moodMap[mood] || mood || '😐';
}

function getSymptomEmoji(symptom) {
  const symptomEmojis = {
    'sleep': '😴',
    'appetite': '🍽️',
    'cravings': '🍫',
    'mood': '😊',
    'energy': '⚡'
  };
  return symptomEmojis[symptom] || '•';
}

// ── Render Logs List ─────────────────────────────────────────
function renderLogsList() {
  const $logsList = document.getElementById('logs-list');
  if (!$logsList) return;
  
  const logs = getLogs();
  const weightUnit = getWeightUnit();
  
  if (logs.length === 0) {
    $logsList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📊</div>
        <h3>No logs yet</h3>
        <p>Start tracking your progress by adding your first log entry.</p>
      </div>
    `;
    return;
  }
  
  const html = logs.map(log => {
    const dateStr = formatDate(log.date);
    const weightStr = formatWeight(log.weight, weightUnit);
    const energyEmoji = getEnergyEmoji(log.energy);
    const symptoms = log.symptoms || [];
    
    const symptomsHtml = symptoms.length > 0 
      ? symptoms.map(symptom => `
          <span class="log-tag">
            ${getSymptomEmoji(symptom)} ${symptom.charAt(0).toUpperCase() + symptom.slice(1)}
          </span>
        `).join('')
      : '';
    
    const notesHtml = log.notes ? `
      <div class="log-notes">${escapeHtml(log.notes)}</div>
    ` : '';
    
    return `
      <div class="log-entry" data-date="${log.date}">
        <div class="log-date">${dateStr}</div>
        <div class="log-stats">
          <div class="log-stat">
            <div class="log-stat-label">Weight</div>
            <div class="log-stat-value">${weightStr}</div>
          </div>
          <div class="log-stat">
            <div class="log-stat-label">Energy</div>
            <div class="log-stat-value">${energyEmoji}</div>
          </div>
        </div>
        ${symptomsHtml ? `<div class="log-tags">${symptomsHtml}</div>` : ''}
        ${notesHtml}
        <button class="delete-log" data-date="${log.date}" aria-label="Delete log">✕</button>
      </div>
    `;
  }).join('');
  
  $logsList.innerHTML = html;
  
  // Add delete event listeners
  $logsList.querySelectorAll('.delete-log').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const date = btn.dataset.date;
      if (confirm('Delete this log entry?')) {
        deleteLogEntry(date);
        renderLogsList();
      }
    });
  });
}

// ── Render Journal List ──────────────────────────────────────
function renderJournalList() {
  const $journalList = document.getElementById('journal-entries');
  if (!$journalList) return;
  
  const journal = getJournal();
  
  if (journal.length === 0) {
    $journalList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📝</div>
        <h3>No journal entries yet</h3>
        <p>How are you feeling? Add your first journal entry.</p>
      </div>
    `;
    return;
  }
  
  const html = journal.map(entry => {
    const dateStr = formatDate(entry.date);
    const noteText = entry.note || '';
    const notePreview = noteText.length > 100
      ? noteText.substring(0, 100) + '...'
      : noteText;
    
    const moodHtml = entry.mood ? `
      <div class="journal-mood">${getMoodEmoji(entry.mood)}</div>
    ` : '';
    
    return `
      <div class="journal-entry" data-date="${entry.date}">
        <div class="journal-header">
          <div class="journal-date">${dateStr}</div>
          ${moodHtml}
        </div>
        <div class="journal-content">${escapeHtml(notePreview)}</div>
        <button class="delete-journal" data-date="${entry.date}" aria-label="Delete journal entry">✕</button>
      </div>
    `;
  }).join('');
  
  $journalList.innerHTML = html;
  
  // Add delete event listeners
  $journalList.querySelectorAll('.delete-journal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const date = btn.dataset.date;
      if (confirm('Delete this journal entry?')) {
        deleteJournalEntry(date);
        renderJournalList();
      }
    });
  });
  
  // Add click to expand functionality
  $journalList.querySelectorAll('.journal-entry').forEach(entry => {
    entry.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-journal')) {
        const date = entry.dataset.date;
        const journalEntry = journal.find(j => j.date === date);
        if (journalEntry) {
          showJournalDetail(journalEntry);
        }
      }
    });
  });
}

// ── Show Journal Detail Modal ────────────────────────────────
function showJournalDetail(entry) {
  const modal = document.createElement('div');
  modal.className = 'journal-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
  `;
  
  const date = new Date(entry.date);
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  modal.innerHTML = `
    <div style="
      background: var(--surface);
      border-radius: var(--radius);
      padding: 1.5rem;
      max-width: 500px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-size: 1rem; font-weight: 600; color: var(--text);">${dateStr}</h3>
        <button class="close-modal" style="
          background: none;
          border: none;
          color: var(--text2);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
        ">✕</button>
      </div>
      ${entry.mood ? `<div style="margin-bottom: 1rem; font-size: 1.5rem;">${escapeHtml(entry.mood)}</div>` : ''}
      <div style="
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--text);
        white-space: pre-wrap;
        margin-bottom: 1.5rem;
      ">${escapeHtml(entry.note)}</div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-secondary edit-journal" style="flex: 1;">Edit</button>
        <button class="btn btn-secondary delete-journal-modal" style="flex: 1;">Delete</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Edit button
  modal.querySelector('.edit-journal').addEventListener('click', () => {
    document.body.removeChild(modal);
    showEditJournalForm(entry);
  });
  
  // Delete button
  modal.querySelector('.delete-journal-modal').addEventListener('click', () => {
    if (confirm('Delete this journal entry?')) {
      deleteJournalEntry(entry.date);
      renderJournalList();
      document.body.removeChild(modal);
    }
  });
}

// ── Show Edit Journal Form ───────────────────────────────────
function showEditJournalForm(entry) {
  // Switch to journal view if not already
  const $journalToggle = document.querySelector('.logbook-toggle-btn[data-view="journal"]');
  if ($journalToggle && !$journalToggle.classList.contains('active')) {
    $journalToggle.click();
  }
  
  // Show add form
  const $addForm = document.getElementById('add-journal-form');
  if ($addForm) {
    $addForm.style.display = 'block';
    $addForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Populate form
    const $jc = document.getElementById('journal-content');
    if ($jc) $jc.value = entry.note || '';
    // Clear legacy symptom inputs if present (may not exist in newer form layouts)
    ['symptom-energy','symptom-appetite','symptom-cravings','symptom-sleep'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    
    // Set date
    const dateInput = document.querySelector('#add-journal-form input[type="date"]');
    if (dateInput) {
      dateInput.value = entry.date;
    }
    
    // Update save button to edit mode
    const saveBtn = document.getElementById('save-journal-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Update Entry';
    saveBtn.dataset.editDate = entry.date;
    
    // Restore original text after save
    const restoreButton = () => {
      saveBtn.textContent = originalText;
      delete saveBtn.dataset.editDate;
    };
    
    // Override save handler temporarily
    const originalClick = saveBtn.onclick;
    saveBtn.onclick = null;
    saveBtn.addEventListener('click', function handler(e) {
      e.preventDefault();
      saveJournalEntry(this.dataset.editDate);
      restoreButton();
      saveBtn.onclick = originalClick;
      saveBtn.removeEventListener('click', handler);
    });
  }
}

function saveJournalEntry(editDate) {
  const note = document.getElementById('journal-content')?.value?.trim() || '';
  function getPillVal(rowId) {
    return document.querySelector('#' + rowId + ' .checkin-pill.selected')?.dataset.val || '';
  }
  const moodVal = getPillVal('mood-pills');
  const symptoms = {
    energy:      getPillVal('energy-pills'),
    sleep:       getPillVal('sleep-pills'),
    sideEffects: document.querySelector('#side-effects-yn .yn-btn.selected')?.dataset.val || ''
  };
  addJournalEntry(editDate, note, moodVal, null, symptoms);
  renderJournalList();
}

// ── Logbook Toggle ───────────────────────────────────────────
function setupLogbookToggle() {
  const $logbookToggle = document.querySelector('.logbook-toggle');
  if (!$logbookToggle) return;

  const $logsBtn = $logbookToggle.querySelector('[data-view="logs"]');
  const $journalBtn = $logbookToggle.querySelector('[data-view="journal"]');
  const $logsView = document.getElementById('logs-view');
  const $journalView = document.getElementById('journal-view');

  if (!$logsBtn || !$journalBtn || !$logsView || !$journalView) return;
  
  function switchToView(view) {
    // Update buttons
    $logsBtn.classList.toggle('active', view === 'logs');
    $journalBtn.classList.toggle('active', view === 'journal');
    
    // Update views
    $logsView.classList.toggle('active', view === 'logs');
    $journalView.classList.toggle('active', view === 'journal');
    
    // Save preference
    try { localStorage.setItem('logbookView', view); } catch(e) { /* non-critical */ }
  }
  
  $logsBtn.addEventListener('click', () => switchToView('logs'));
  $journalBtn.addEventListener('click', () => switchToView('journal'));

  // Restore saved view preference
  const savedView = localStorage.getItem('logbookView') || 'logs';
  switchToView(savedView);
}