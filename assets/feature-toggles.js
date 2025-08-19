// Feature Toggle System - Enhanced with persistence and better organization
// Extracted from app.js for modularity and maintainability

const FeatureToggles = (() => {
  // Default toggle states
  const defaultToggles = {
    dedupe: { value: false, label: 'Viewport-aware de-dup', description: 'Demo of content deduplication across rails' },
    previews: { value: false, label: 'Preview on focus', description: 'Show previews when focusing on cards' },
    analytics: { value: true, label: 'Metrics console', description: 'Enable analytics and debug logging' },
    ownership: { value: true, label: 'Ownership de-dup', description: 'Cross-rail content deduplication' },
    ticker: { value: false, label: 'Auto-ticker', description: 'Auto-advance for Live Now rails' },
    autoAdvance: { value: true, label: 'Rail auto-advance', description: 'Automatic carousel advancement' },
    performance: { value: true, label: 'Performance mode', description: 'Optimize for performance over features' },
    accessibility: { value: true, label: 'Accessibility', description: 'Enhanced keyboard and screen reader support' }
  };

  // Current toggle state
  let state = {};

  // Initialize toggles from localStorage or defaults
  function init() {
    // Load saved state from localStorage
    const savedState = localStorage.getItem('MobileHomeProto_toggles');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        state = { ...defaultToggles };
        Object.keys(parsed).forEach(key => {
          if (state[key] !== undefined) {
            state[key].value = parsed[key];
          }
        });
      } catch (e) {
        console.warn('Failed to parse saved toggle state, using defaults');
        state = { ...defaultToggles };
      }
    } else {
      state = { ...defaultToggles };
    }

    // Save initial state
    saveState();
  }

  // Save current state to localStorage
  function saveState() {
    try {
      const stateToSave = {};
      Object.keys(state).forEach(key => {
        stateToSave[key] = state[key].value;
      });
      localStorage.setItem('MobileHomeProto_toggles', JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save toggle state to localStorage');
    }
  }

  // Get toggle value
  function getValue(key) {
    return state[key]?.value ?? false;
  }

  // Set toggle value
  function setValue(key, value) {
    if (state[key]) {
      state[key].value = value;
      saveState();
      
      // Trigger change event
      const event = new CustomEvent('toggleChanged', { 
        detail: { key, value, toggle: state[key] } 
      });
      document.dispatchEvent(event);
      
      return true;
    }
    return false;
  }

  // Toggle a boolean value
  function toggle(key) {
    if (state[key]) {
      const newValue = !state[key].value;
      setValue(key, newValue);
      return newValue;
    }
    return false;
  }

  // Reset all toggles to defaults
  function resetToDefaults() {
    Object.keys(state).forEach(key => {
      state[key].value = defaultToggles[key].value;
    });
    saveState();
    
    // Trigger reset event
    const event = new CustomEvent('togglesReset', { detail: { state } });
    document.dispatchEvent(event);
  }

  // Get all toggle information
  function getAllToggles() {
    return { ...state };
  }

  // Get toggle metadata
  function getToggleInfo(key) {
    return state[key] ? { ...state[key] } : null;
  }

  // Mount toggle UI to the page
  function mount(target = null) {
    if (document.querySelector('.togglebar')) return;
    
    const bar = document.createElement('div');
    bar.className = 'panel togglebar';
    
    const toggleHTML = Object.entries(state).map(([key, toggle]) => `
      <label class="toggle-item">
        <input type="checkbox" id="tg-${key}" ${toggle.value ? 'checked' : ''}>
        <span class="toggle-label">${toggle.label}</span>
        <span class="toggle-description">${toggle.description}</span>
      </label>
    `).join('');
    
    bar.innerHTML = `
      <div class="togglebar-header">
        <h4>🔧 Feature Toggles</h4>
        <button class="reset-toggles" onclick="FeatureToggles.resetToDefaults()">Reset</button>
      </div>
      <div class="togglebar-content">
        ${toggleHTML}
      </div>
    `;
    
    const mountTarget = target || document.querySelector('header') || document.querySelector('main') || document.body;
    mountTarget.appendChild(bar);
    
    // Add event listeners
    Object.keys(state).forEach(key => {
      const checkbox = bar.querySelector(`#tg-${key}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          setValue(key, e.target.checked);
        });
      }
    });
    
    // Add change event listener for external updates
    document.addEventListener('toggleChanged', (e) => {
      const { key, value } = e.detail;
      const checkbox = bar.querySelector(`#tg-${key}`);
      if (checkbox && checkbox.checked !== value) {
        checkbox.checked = value;
      }
    });
  }

  // Mount toggle UI to a specific container (for individual demos)
  function mountToContainer(container) {
    if (container.querySelector('.togglebar')) return;
    
    const bar = document.createElement('div');
    bar.className = 'panel togglebar demo-toggles';
    
    const toggleHTML = Object.entries(state).map(([key, toggle]) => `
      <label class="toggle-item">
        <input type="checkbox" id="tg-${key}" ${toggle.value ? 'checked' : ''}>
        <span class="toggle-label">${toggle.label}</span>
      </label>
    `).join('');
    
    bar.innerHTML = `
      <div class="togglebar-header">
        <h4>🔧 Toggles</h4>
      </div>
      <div class="togglebar-content">
        ${toggleHTML}
      </div>
    `;
    
    container.insertBefore(bar, container.firstChild);
    
    // Add event listeners
    Object.keys(state).forEach(key => {
      const checkbox = bar.querySelector(`#tg-${key}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          setValue(key, e.target.checked);
        });
      }
    });
  }

  // Check if a feature is enabled
  function isEnabled(key) {
    return getValue(key);
  }

  // Get multiple toggle values at once
  function getMultiple(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = getValue(key);
    });
    return result;
  }

  // Batch set multiple toggle values
  function setMultiple(toggles) {
    Object.entries(toggles).forEach(([key, value]) => {
      setValue(key, value);
    });
  }

  // Export toggle state for debugging
  function exportState() {
    return {
      current: { ...state },
      defaults: { ...defaultToggles },
      timestamp: new Date().toISOString()
    };
  }

  // Import toggle state from external source
  function importState(importedState) {
    if (importedState && typeof importedState === 'object') {
      Object.keys(importedState).forEach(key => {
        if (state[key] && typeof importedState[key] === 'boolean') {
          setValue(key, importedState[key]);
        }
      });
      return true;
    }
    return false;
  }

  // Initialize on load
  init();

  return {
    // Core functionality
    getValue,
    setValue,
    toggle,
    isEnabled,
    getMultiple,
    setMultiple,
    
    // UI management
    mount,
    mountToContainer,
    
    // State management
    getAllToggles,
    getToggleInfo,
    resetToDefaults,
    exportState,
    importState,
    
    // Current state (read-only)
    get state() { return { ...state }; }
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FeatureToggles;
} else {
  // Browser global
  window.FeatureToggles = FeatureToggles;
}
