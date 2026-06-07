// Audio Feedback System using Web Audio API
class GuildSoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true; // default enabled
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            this.ctx = new AudioContextClass();
        }
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playBeep() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playLock() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(600, now);
        osc1.frequency.setValueAtTime(800, now + 0.06);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(300, now);
        osc2.frequency.setValueAtTime(400, now + 0.06);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc1.start();
        osc2.start();
        osc1.stop(now + 0.2);
        osc2.stop(now + 0.2);
    }

    playSuccess() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start();
        osc.stop(now + 0.4);
    }

    playWarning() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.3);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.start();
        osc.stop(now + 0.35);
    }

    playRadarSweep() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.2);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.start();
        osc.stop(now + 0.2);
    }
}
const sounds = new GuildSoundSystem();

// Global Application State
let state = {
    divisions: {},
    weeks: []
};

// Current view details
let activeTab = 'tab-bounties';
let selectedDivision = null; // Currently selected division on rosters tab
let currentEditingBounty = null; // { weekIndex, bountyIndex }

// Raw parsed Lower Columbia roster
const LOWER_COLUMBIA_PLAYERS = [
    // Friends
    { id: "97000137", name: "Bill Ewan", team: "Friends" },
    { id: "97024217", name: "John Nichols", team: "Friends" },
    { id: "97000153", name: "Maryann Abbott", team: "Friends" },
    { id: "97000174", name: "Edward Hatley", team: "Friends" },
    { id: "97000149", name: "Shayne Wright", team: "Friends" },
    { id: "97000184", name: "Crystal Crawford", team: "Friends" },
    // Paw Patrol
    { id: "97010394", name: "David Berkman", team: "Paw Patrol" },
    { id: "97000205", name: "Bonnie Russell", team: "Paw Patrol" },
    { id: "97000213", name: "Mistee Messing", team: "Paw Patrol" },
    { id: "97000221", name: "Daniel Messing", team: "Paw Patrol" },
    { id: "97000146", name: "Chase Billings", team: "Paw Patrol" },
    { id: "97000159", name: "Joseph Manchester", team: "Paw Patrol" },
    { id: "97000187", name: "Alex McKenzie", team: "Paw Patrol" },
    // Bull Elk
    { id: "97000113", name: "John Kraemer", team: "Bull Elk" },
    { id: "97000196", name: "Chuy Puerta", team: "Bull Elk" },
    { id: "97000237", name: "David Hall", team: "Bull Elk" },
    { id: "97000328", name: "Andrew Hoggard", team: "Bull Elk" },
    { id: "97000245", name: "Samuel McDaniel", team: "Bull Elk" },
    { id: "97000141", name: "Rigel Ross", team: "Bull Elk" },
    { id: "97000308", name: "Anthony Hoggard", team: "Bull Elk" },
    { id: "97000199", name: "Nathan Pancheo", team: "Bull Elk" },
    { id: "97000198", name: "Adam Yaws", team: "Bull Elk" },
    { id: "97000210", name: "Lorna Padgett", team: "Bull Elk" },
    // Hondo’s
    { id: "97000269", name: "Betsy Crist", team: "Hondo’s" },
    { id: "97000253", name: "Blake Mowrey", team: "Hondo’s" },
    { id: "97000162", name: "Simo Ranta", team: "Hondo’s" },
    { id: "97000179", name: "Ronald Kiepke", team: "Hondo’s" },
    { id: "97000182", name: "Ronald Carter", team: "Hondo’s" },
    { id: "97000194", name: "Ryan Applebee", team: "Hondo’s" },
    // Legion of Doom
    { id: "97000040", name: "Michael Wylie", team: "Legion of Doom" },
    { id: "97000168", name: "Garrett Danel", team: "Legion of Doom" },
    { id: "97000139", name: "Maksym Dervevianko", team: "Legion of Doom" },
    { id: "97000177", name: "Desiree Payne", team: "Legion of Doom" },
    { id: "97000192", name: "Gordon Scott", team: "Legion of Doom" },
    { id: "97000190", name: "Christian Paniagua", team: "Legion of Doom" }
];

// Raw parsed St Helens & roster
const ST_HELENS_PLAYERS = [
    // Wrong Hole
    { id: "97000847", name: "Alicia Lease", team: "Wrong Hole" },
    { id: "97000171", name: "Shawn Etheredge", team: "Wrong Hole" },
    { id: "97020560", name: "William Polk", team: "Wrong Hole" },
    { id: "97000114", name: "Tom Lee", team: "Wrong Hole" },
    { id: "97008640", name: "Douglas Miller", team: "Wrong Hole" },
    { id: "97000242", name: "James Merrit", team: "Wrong Hole" },
    // Unacceptable
    { id: "97000337", name: "Michael Cenci", team: "Unacceptable" },
    { id: "97000301", name: "Jim Mclain", team: "Unacceptable" },
    { id: "97000339", name: "Steve Linn", team: "Unacceptable" },
    { id: "97000348", name: "Greg Greer", team: "Unacceptable" },
    { id: "97000332", name: "David Gastley", team: "Unacceptable" },
    // Pocket Pounders
    { id: "97000101", name: "Chris Johnston", team: "Pocket Pounders" },
    { id: "97000048", name: "Brian Flannery", team: "Pocket Pounders" },
    { id: "97000148", name: "Michael Johnston", team: "Pocket Pounders" },
    { id: "97000064", name: "Robert Johnston", team: "Pocket Pounders" },
    { id: "97000065", name: "Kathleen Duncan", team: "Pocket Pounders" },
    { id: "97000135", name: "Lora Elliott", team: "Pocket Pounders" },
    // Rack Wreckers
    { id: "97000110", name: "Jake Trenton", team: "Rack Wreckers" },
    { id: "97000142", name: "James Mier", team: "Rack Wreckers" },
    { id: "97000134", name: "Shane Hayes", team: "Rack Wreckers" },
    { id: "97000138", name: "Harold Jennings", team: "Rack Wreckers" },
    { id: "97000104", name: "De Scorpian Broaddus", team: "Rack Wreckers" },
    { id: "97000161", name: "Phillip Barton", team: "Rack Wreckers" },
    { id: "97000160", name: "Benjamin Strobel", team: "Rack Wreckers" },
    // One More Shot
    { id: "97000312", name: "Clint Petty", team: "One More Shot" },
    { id: "97000314", name: "Robert Wakeman", team: "One More Shot" },
    { id: "97000057", name: "Margaret Moen", team: "One More Shot" },
    { id: "97000303", name: "lrene Wakeman", team: "One More Shot" },
    { id: "97000092", name: "Robert Montgomery", team: "One More Shot" },
    { id: "97000045", name: "Jeffrey Hamilton", team: "One More Shot" },
    { id: "97000307", name: "Colin Flanagan", team: "One More Shot" },
    // Chalk is Cheap
    { id: "97000155", name: "Andrea Parr", team: "Chalk is Cheap" },
    { id: "97023367", name: "Kevin Long", team: "Chalk is Cheap" },
    { id: "97022763", name: "Stephen Bradley", team: "Chalk is Cheap" },
    { id: "97023502", name: "Diane Bradley", team: "Chalk is Cheap" },
    { id: "97000088", name: "Ken Hile", team: "Chalk is Cheap" },
    { id: "97000250", name: "Dan Baer", team: "Chalk is Cheap" },
    // Felt Junkies
    { id: "97000310", name: "Karen McDaniel", team: "Felt Junkies" },
    { id: "97000331", name: "Louis Foust", team: "Felt Junkies" },
    { id: "97019743", name: "Gerald Ellis", team: "Felt Junkies" },
    { id: "97019589", name: "Kristine Rock", team: "Felt Junkies" },
    { id: "97000345", name: "Brennen Brigham", team: "Felt Junkies" },
    // Misfit Q's
    { id: "97000122", name: "Kenneth Furman", team: "Misfit Q's" },
    { id: "97000126", name: "Tammy Furman", team: "Misfit Q's" },
    { id: "97000132", name: "Samuel Ortiz", team: "Misfit Q's" },
    { id: "97000016", name: "Alma Davidson", team: "Misfit Q's" },
    { id: "97004026", name: "Ryan Hall", team: "Misfit Q's" },
    { id: "97000203", name: "Jeremy Arnold", team: "Misfit Q's" }
];

// Demo Mock Presets
const DEMO_PRESETS = {
    divisions: {
        "Lower Columbia": [...LOWER_COLUMBIA_PLAYERS],
        "St Helens &": [...ST_HELENS_PLAYERS]
    },
    weeks: [
        {
            weekNumber: 1,
            bounties: [
                { 
                    division: "Lower Columbia", 
                    target: { id: "97000137", name: "Bill Ewan", team: "Friends" }, 
                    status: "claimed", 
                    claimedBy: "97010394", // David Berkman
                    reward: 100 
                },
                { 
                    division: "St Helens &", 
                    target: { id: "97000847", name: "Alicia Lease", team: "Wrong Hole" }, 
                    status: "escaped", 
                    claimedBy: null, 
                    reward: 120 
                }
            ]
        },
        {
            weekNumber: 2,
            bounties: [
                { 
                    division: "Lower Columbia", 
                    target: { id: "97000221", name: "Daniel Messing", team: "Paw Patrol" }, 
                    status: "pending", 
                    claimedBy: null, 
                    reward: 100 
                },
                { 
                    division: "St Helens &", 
                    target: { id: "97000101", name: "Chris Johnston", team: "Pocket Pounders" }, 
                    status: "pending", 
                    claimedBy: null, 
                    reward: 100 
                }
            ]
        }
    ]
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    // Check for Public Mode in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const isPublicMode = urlParams.get('mode') === 'public';
    if (isPublicMode) {
        document.body.classList.add("public-mode");
        const showcase = document.getElementById("public-video-showcase");
        if (showcase) {
            showcase.classList.remove("hidden");
        }
    }

    // Check for navigation hide parameter
    const hideNav = urlParams.get('hide_nav') === 'true';
    if (hideNav) {
        document.body.classList.add("hide-nav");
    }

    loadState();
    setupEventListeners();
    renderApp();

    // Check for tab parameter to switch tab on load
    const startTab = urlParams.get('tab');
    if (startTab) {
        const tabBtn = document.querySelector(`.nav-tab[data-tab="tab-${startTab}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
    
    if (isPublicMode) {
        showToast("Bounty Hunters Guild Public Terminal Mode", "success");
    } else {
        showToast("Bounty Hunters Guild Terminal Online", "success");
    }
});

// Load state from localStorage or load empty defaults
function loadState() {
    const saved = localStorage.getItem("bounty_hunter_state");
    if (saved) {
        try {
            state = JSON.parse(saved);
            let migrated = false;

            // Perform schema migration if they had string-based arrays in divisions
            Object.keys(state.divisions).forEach(divName => {
                state.divisions[divName] = state.divisions[divName].map((p, idx) => {
                    if (typeof p === 'string') {
                        migrated = true;
                        return { id: `T${Date.now()}-${idx}`, name: p, team: "Independent" };
                    }
                    return p;
                });
            });
            
            // Migrate week target structure as well
            state.weeks.forEach(w => {
                if (w.bounties) {
                    w.bounties.forEach(b => {
                        if (typeof b.target === 'string') {
                            migrated = true;
                            b.target = { id: `T-MIG`, name: b.target, team: "" };
                        }
                    });
                }
            });

            // Clean up and delete any fake divisions
            const fakeDivs = ["Cascade Division", "Neon Division", "Shadow Division", "Apex Division"];
            fakeDivs.forEach(fd => {
                if (state.divisions[fd]) {
                    delete state.divisions[fd];
                    migrated = true;
                }
            });
            
            // Delete bounties belonging to fake divisions
            state.weeks.forEach(w => {
                if (w.bounties) {
                    const originalLength = w.bounties.length;
                    w.bounties = w.bounties.filter(b => !fakeDivs.includes(b.division));
                    if (w.bounties.length !== originalLength) {
                        migrated = true;
                    }
                }
            });

            // Clean up team names (remove numeric prefixes like "85103 - ")
            Object.keys(state.divisions).forEach(divName => {
                state.divisions[divName].forEach(p => {
                    if (p.team && /^\d+\s*-\s*/.test(p.team)) {
                        p.team = p.team.replace(/^\d+\s*-\s*/, '');
                        migrated = true;
                    }
                });
            });
            state.weeks.forEach(w => {
                if (w.bounties) {
                    w.bounties.forEach(b => {
                        if (b.target && b.target.team && /^\d+\s*-\s*/.test(b.target.team)) {
                            b.target.team = b.target.team.replace(/^\d+\s*-\s*/, '');
                            migrated = true;
                        }
                    });
                }
            });

            // Inject Lower Columbia division if it doesn't exist in saved data
            if (!state.divisions["Lower Columbia"]) {
                state.divisions["Lower Columbia"] = JSON.parse(JSON.stringify(LOWER_COLUMBIA_PLAYERS));
                migrated = true;
            }

            // Inject St Helens & division if it doesn't exist in saved data
            if (!state.divisions["St Helens &"]) {
                state.divisions["St Helens &"] = JSON.parse(JSON.stringify(ST_HELENS_PLAYERS));
                migrated = true;
            } else {
                // Force sync team names of pre-existing St Helens & division to cleaned defaults if they were partially cleaned
                state.divisions["St Helens &"].forEach(p => {
                    const match = ST_HELENS_PLAYERS.find(orig => orig.id === p.id);
                    if (match && p.team !== match.team) {
                        p.team = match.team;
                        migrated = true;
                    }
                });
            }

            if (migrated) {
                saveState();
                console.log("Migrated local state database, cleaned team names and fake divisions.");
            }
        } catch (e) {
            console.error("Error parsing saved state:", e);
            initEmptyState();
        }
    } else {
        // Load default mock presets containing user's division roster
        state = JSON.parse(JSON.stringify(DEMO_PRESETS));
        saveState();
    }
}

function initEmptyState() {
    state = {
        divisions: {
            "Lower Columbia": [...LOWER_COLUMBIA_PLAYERS],
            "St Helens &": [...ST_HELENS_PLAYERS]
        },
        weeks: []
    };
    saveState();
}

function saveState() {
    localStorage.setItem("bounty_hunter_state", JSON.stringify(state));
}

// Global UI Rendering Router
function renderApp() {
    renderRosterTab();
    renderBountiesTab();
    renderLeaderboardTab();
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function setupEventListeners() {
    // Comms Audio Toggle
    const commsBtn = document.getElementById("comms-audio-btn");
    if (commsBtn) {
        // Load default preference
        const savedAudioPref = localStorage.getItem("comms_audio_enabled");
        if (savedAudioPref !== null) {
            sounds.enabled = savedAudioPref === "true";
            if (!sounds.enabled) {
                commsBtn.classList.remove("active");
                commsBtn.querySelector(".status-indicator").innerText = "OFFLINE";
            }
        }
        
        commsBtn.addEventListener("click", () => {
            sounds.init(); // Initialize audio context on first user click
            sounds.enabled = !sounds.enabled;
            localStorage.setItem("comms_audio_enabled", sounds.enabled);
            
            if (sounds.enabled) {
                commsBtn.classList.add("active");
                commsBtn.querySelector(".status-indicator").innerText = "ONLINE";
                sounds.playSuccess(); // chime to confirm online
            } else {
                commsBtn.classList.remove("active");
                commsBtn.querySelector(".status-indicator").innerText = "OFFLINE";
            }
        });
    }

    // Navigation Tabs
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            sounds.playClick();
            const target = tab.dataset.tab;
            document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            tab.classList.add("active");
            const activeSec = document.getElementById(target);
            activeSec.classList.add("active");
            activeTab = target;

            // Specific tab entry code
            if (target === 'tab-leaderboard') {
                renderLeaderboardTab();
            } else if (target === 'tab-bounties') {
                renderBountiesTab();
            } else if (target === 'tab-rosters') {
                renderRosterTab();
            }
        });
    });

    /* --- Bounties Event Listeners --- */
    document.getElementById("week-select").addEventListener("change", (e) => {
        sounds.playBeep();
        renderBountiesTab();
    });

    document.getElementById("add-week-btn").addEventListener("click", () => {
        sounds.playBeep();
        const newWeekNum = state.weeks.length + 1;
        state.weeks.push({
            weekNumber: newWeekNum,
            bounties: []
        });
        saveState();
        showToast(`Week ${newWeekNum} Created!`, "success");
        
        // Refresh and select the new week
        populateWeeksDropdown(newWeekNum);
        renderBountiesTab();
    });

    document.getElementById("roll-bounties-trigger").addEventListener("click", () => {
        triggerBountyRoulette();
    });

    document.getElementById("confirm-roll-btn").addEventListener("click", () => {
        sounds.playSuccess();
        confirmRolledBounties();
    });

    document.getElementById("reroll-week-btn").addEventListener("click", () => {
        sounds.playWarning();
        if (confirm("Are you sure you want to re-roll ALL bounties for this week? Current weekly claims and outcomes will be wiped.")) {
            sounds.playBeep();
            const selectEl = document.getElementById("week-select");
            const weekIndex = parseInt(selectEl.value);
            state.weeks[weekIndex].bounties = [];
            saveState();
            renderBountiesTab();
            showToast("Bounties cleared. Ready for re-roll.", "success");
        }
    });

    /* --- Roster Event Listeners --- */
    document.getElementById("add-div-btn").addEventListener("click", () => {
        sounds.playBeep();
        document.getElementById("add-div-form").classList.remove("hidden");
        document.getElementById("new-div-name").focus();
    });

    document.getElementById("cancel-div-btn").addEventListener("click", () => {
        sounds.playBeep();
        document.getElementById("add-div-form").classList.add("hidden");
        document.getElementById("new-div-name").value = "";
    });

    document.getElementById("save-div-btn").addEventListener("click", () => {
        const divName = document.getElementById("new-div-name").value.trim();
        if (!divName) {
            sounds.playWarning();
            showToast("Division name cannot be empty", "error");
            return;
        }
        if (state.divisions[divName]) {
            sounds.playWarning();
            showToast("A division with this name already exists", "error");
            return;
        }
        sounds.playSuccess();
        state.divisions[divName] = [];
        selectedDivision = divName;
        saveState();
        document.getElementById("add-div-form").classList.add("hidden");
        document.getElementById("new-div-name").value = "";
        renderRosterTab();
        showToast(`Division "${divName}" added!`, "success");
    });

    document.getElementById("delete-div-btn").addEventListener("click", () => {
        sounds.playWarning();
        if (confirm(`Are you sure you want to delete "${selectedDivision}" and all of its players? This will not retroactively delete past week history.`)) {
            sounds.playBeep();
            delete state.divisions[selectedDivision];
            selectedDivision = Object.keys(state.divisions)[0] || null;
            saveState();
            renderRosterTab();
            showToast("Division deleted", "success");
        }
    });

    document.getElementById("add-player-btn").addEventListener("click", () => {
        addPlayerToRoster();
    });

    document.getElementById("new-player-name").addEventListener("keypress", (e) => {
        if (e.key === "Enter") addPlayerToRoster();
    });
    document.getElementById("new-player-id").addEventListener("keypress", (e) => {
        if (e.key === "Enter") addPlayerToRoster();
    });
    document.getElementById("new-player-team").addEventListener("keypress", (e) => {
        if (e.key === "Enter") addPlayerToRoster();
    });

    /* --- Leaderboard Event Listeners --- */
    document.querySelectorAll(".sub-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            sounds.playClick();
            document.querySelectorAll(".sub-tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".sub-tab-content").forEach(c => c.classList.remove("active"));
            
            tab.classList.add("active");
            document.getElementById(tab.dataset.subtab).classList.add("active");
        });
    });

    /* --- Modal Edit Events --- */
    document.getElementById("cancel-bounty-edit").addEventListener("click", () => {
        sounds.playBeep();
        closeModal("bounty-edit-modal");
    });
    
    document.getElementById("edit-modal-overlay").addEventListener("click", () => {
        sounds.playBeep();
        closeModal("bounty-edit-modal");
    });

    document.getElementById("bounty-status-select").addEventListener("change", (e) => {
        sounds.playBeep();
        const status = e.target.value;
        const hunterGroup = document.getElementById("hunter-select-group");
        if (status === "claimed") {
            hunterGroup.classList.remove("hidden");
        } else {
            hunterGroup.classList.add("hidden");
        }
    });

    document.getElementById("save-bounty-btn").addEventListener("click", () => {
        saveBountyOutcome();
    });

    /* --- Share Card Events --- */
    document.getElementById("export-card-btn").addEventListener("click", () => {
        sounds.playBeep();
        openShareCardModal();
    });
    
    document.getElementById("close-share-btn").addEventListener("click", () => {
        sounds.playBeep();
        closeModal("share-card-modal");
    });

    document.getElementById("share-modal-overlay").addEventListener("click", () => {
        sounds.playBeep();
        closeModal("share-card-modal");
    });

    document.getElementById("download-graphic-btn").addEventListener("click", () => {
        sounds.playSuccess();
        downloadShareCardGraphic();
    });

    /* --- Wanted Posters Events --- */
    document.getElementById("close-wanted-btn").addEventListener("click", () => {
        sounds.playBeep();
        closeModal("wanted-posters-modal");
    });
    
    document.getElementById("wanted-modal-overlay").addEventListener("click", () => {
        sounds.playBeep();
        closeModal("wanted-posters-modal");
    });

    document.getElementById("download-cyber-btn").addEventListener("click", () => {
        sounds.playSuccess();
        downloadPoster("poster-cyber-element", "cyber-bounty-alert");
    });

    document.getElementById("download-red-holo-btn").addEventListener("click", () => {
        sounds.playSuccess();
        downloadPoster("poster-red-holo-element", "red-hologram-poster");
    });

    document.getElementById("publish-web-btn").addEventListener("click", () => {
        sounds.playBeep();
        showToast("Publishing database & re-compiling page...", "success");
        
        fetch('/api/publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.error || "Unknown server error");
                });
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                sounds.playSuccess();
                showToast("Bounty Board published to GitHub Pages successfully!", "success");
            } else {
                throw new Error(data.error || "Publish rejected by server");
            }
        })
        .catch(err => {
            sounds.playWarning();
            console.error("Publishing error:", err);
            showToast("Publish failed: Make sure local server.js is running and git pushes successfully.", "error");
        });
    });

    /* --- Settings Event Listeners --- */
    document.getElementById("copy-embed-code-btn").addEventListener("click", () => {
        sounds.playBeep();
        showToast("Generating self-contained Google Sites code...", "success");
        
        // Fetch files locally and compile
        Promise.all([
            fetch('/index.html').then(r => r.text()),
            fetch('/style.css').then(r => r.text()),
            fetch('/app.js').then(r => r.text())
        ])
        .then(([html, css, js]) => {
            // Replace DEMO_PRESETS in JS
            const presetsRegex = /const\s+DEMO_PRESETS\s*=\s*\{[\s\S]*?\};/i;
            const finalJs = js.replace(presetsRegex, `const DEMO_PRESETS = ${JSON.stringify(state)};`);
            
            // Inline CSS
            const cssLinkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']style\.css["']\s*\/?>/i;
            let finalHtml = html.replace(cssLinkRegex, `<style>\n${css}\n</style>`);
            
            // Inline JS
            const jsScriptRegex = /<script\s+src=["']app\.js["']><\/script>/i;
            finalHtml = finalHtml.replace(jsScriptRegex, `<script>\n${finalJs}\n</script>`);
            
            // Copy to clipboard
            return navigator.clipboard.writeText(finalHtml);
        })
        .then(() => {
            sounds.playSuccess();
            showToast("Google Sites Code copied to clipboard!", "success");
            alert("Success! The entire self-contained Bounty Board code has been copied to your clipboard.\n\nGo to Google Sites, click 'Embed' > 'Embed code', paste it, and click Save.");
        })
        .catch(err => {
            sounds.playWarning();
            console.error("Failed to copy code:", err);
            showToast("Failed to copy code. Ensure your local Node server is running.", "error");
        });
    });

    document.getElementById("load-presets-btn").addEventListener("click", () => {
        sounds.playWarning();
        if (confirm("This will overwrite your current settings and history with demo mock data. Proceed?")) {
            sounds.playSuccess();
            state = JSON.parse(JSON.stringify(DEMO_PRESETS));
            saveState();
            selectedDivision = Object.keys(state.divisions)[0] || null;
            populateWeeksDropdown(0);
            renderApp();
            showToast("Demo presets loaded successfully!", "success");
        }
    });

    document.getElementById("clear-db-btn").addEventListener("click", () => {
        sounds.playWarning();
        if (confirm("WARNING: This will permanently delete all your rosters and weekly history. Are you absolutely sure?")) {
            sounds.playSuccess();
            initEmptyState();
            selectedDivision = null;
            populateWeeksDropdown();
            renderApp();
            showToast("All data wiped.", "error");
        }
    });

    document.getElementById("export-db-btn").addEventListener("click", () => {
        sounds.playBeep();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `bounty-hunter-database-${new Date().toISOString().split('T')[0]}.json`);
        dlAnchorElem.click();
        showToast("Database file exported!", "success");
    });

    document.getElementById("import-db-input").addEventListener("change", (e) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed && typeof parsed.divisions === 'object' && Array.isArray(parsed.weeks)) {
                    sounds.playSuccess();
                    state = parsed;
                    saveState();
                    selectedDivision = Object.keys(state.divisions)[0] || null;
                    populateWeeksDropdown();
                    renderApp();
                    showToast("Database imported successfully!", "success");
                } else {
                    sounds.playWarning();
                    showToast("Invalid data structure in JSON file", "error");
                }
            } catch (error) {
                sounds.playWarning();
                showToast("Failed to parse JSON file", "error");
            }
        };
        if (e.target.files[0]) {
            fileReader.readAsText(e.target.files[0]);
        }
    });
}

// Global modal controls
function openModal(id) {
    const el = document.getElementById(id);
    el.classList.remove("hidden");
    el.classList.add("active");
}

function closeModal(id) {
    const el = document.getElementById(id);
    el.classList.remove("active");
    el.classList.add("hidden");
}

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
    
    let icon = "🔔";
    if (type === 'success') icon = "✓";
    if (type === 'error') icon = "⚠";

    toast.innerHTML = `
        <span class="toast-content">${icon} &nbsp;${message}</span>
        <button class="toast-close">&times;</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.remove();
    });

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


/* ==========================================================================
   ROSTERS TAB
   ========================================================================== */
function renderRosterTab() {
    const ul = document.getElementById("divisions-ul");
    ul.innerHTML = "";

    const divNames = Object.keys(state.divisions);
    
    // Select first division by default if none is selected
    if (!selectedDivision && divNames.length > 0) {
        selectedDivision = divNames[0];
    }

    divNames.forEach(name => {
        const li = document.createElement("li");
        li.className = `division-item ${name === selectedDivision ? 'active' : ''}`;
        li.innerHTML = `
            <span>${name}</span>
            <span class="div-count-pill">${state.divisions[name].length}</span>
        `;
        li.addEventListener("click", () => {
            selectedDivision = name;
            renderRosterTab();
        });
        ul.appendChild(li);
    });

    const noDivView = document.getElementById("no-div-selected");
    const playersView = document.getElementById("div-players-view");

    if (selectedDivision) {
        noDivView.classList.add("hidden");
        playersView.classList.remove("hidden");
        
        document.getElementById("current-division-title").innerText = selectedDivision;
        document.getElementById("player-count").innerText = state.divisions[selectedDivision].length;
        
        const tbody = document.getElementById("players-tbody");
        tbody.innerHTML = "";
        
        state.divisions[selectedDivision].forEach((player, index) => {
            const tr = document.createElement("tr");
            
            const pId = player.id || "N/A";
            const pName = player.name || (typeof player === 'string' ? player : "Unknown");
            const pTeam = player.team || "Independent";

            tr.innerHTML = `
                <td style="font-family: var(--font-display); font-size: 0.85rem; color: var(--accent-cyan); font-weight: bold;">${pId}</td>
                <td style="font-weight: 600;">${pName}</td>
                <td><span class="division-tag">${pTeam}</span></td>
                <td style="text-align: right;">
                    <button class="btn-delete-player" title="Remove Player" style="margin-left: auto;">&times;</button>
                </td>
            `;
            tr.querySelector(".btn-delete-player").addEventListener("click", () => {
                removePlayerFromRoster(index);
            });
            tbody.appendChild(tr);
        });
    } else {
        noDivView.classList.remove("hidden");
        playersView.classList.add("hidden");
    }
}

function addPlayerToRoster() {
    if (!selectedDivision) return;
    const nameInput = document.getElementById("new-player-name");
    const idInput = document.getElementById("new-player-id");
    const teamInput = document.getElementById("new-player-team");

    const name = nameInput.value.trim();
    const id = idInput.value.trim() || `T-${Date.now()}`;
    const team = teamInput.value.trim() || "Independent";

    if (!name) {
        showToast("Player name cannot be empty", "error");
        return;
    }
    
    // Check for ID collision
    const idExists = state.divisions[selectedDivision].some(p => p.id === id);
    if (idExists && id !== "N/A") {
        showToast(`Player with ID ${id} already exists in this division`, "error");
        return;
    }

    state.divisions[selectedDivision].push({ id, name, team });
    saveState();
    
    // Reset inputs
    nameInput.value = "";
    idInput.value = "";
    teamInput.value = "";
    nameInput.focus();
    
    renderRosterTab();
    showToast(`Player "${name}" added to "${selectedDivision}"`, "success");
}

function removePlayerFromRoster(index) {
    if (!selectedDivision) return;
    const playerObj = state.divisions[selectedDivision][index];
    const pName = playerObj.name || playerObj;
    state.divisions[selectedDivision].splice(index, 1);
    saveState();
    renderRosterTab();
    showToast(`Removed player "${pName}"`, "success");
}


/* ==========================================================================
   BOUNTIES TAB
   ========================================================================== */
function populateWeeksDropdown(selectedWeekNum = null) {
    const dropdown = document.getElementById("week-select");
    dropdown.innerHTML = "";

    if (state.weeks.length === 0) {
        state.weeks.push({ weekNumber: 1, bounties: [] });
        saveState();
    }

    state.weeks.forEach((week, index) => {
        const opt = document.createElement("option");
        opt.value = index;
        opt.innerText = `Week ${week.weekNumber}`;
        if (selectedWeekNum !== null && week.weekNumber === selectedWeekNum) {
            opt.selected = true;
        } else if (selectedWeekNum === null && index === state.weeks.length - 1) {
            opt.selected = true;
        }
        dropdown.appendChild(opt);
    });
}

function renderBountiesTab() {
    if (document.getElementById("week-select").children.length === 0) {
        populateWeeksDropdown();
    }

    const selectEl = document.getElementById("week-select");
    if (!selectEl.value) return;

    const weekIndex = parseInt(selectEl.value);
    const week = state.weeks[weekIndex];
    
    const noBountiesEl = document.getElementById("no-bounties-state");
    const activeBountiesEl = document.getElementById("active-bounties-state");
    const cardsContainer = document.getElementById("bounty-cards-container");
    
    cardsContainer.innerHTML = "";

    if (!week.bounties || week.bounties.length === 0) {
        noBountiesEl.classList.remove("hidden");
        activeBountiesEl.classList.add("hidden");
    } else {
        noBountiesEl.classList.add("hidden");
        activeBountiesEl.classList.remove("hidden");

        const hasClaims = week.bounties.some(b => b.status === 'claimed');
        if (!hasClaims) {
            const summaryCard = document.createElement("div");
            summaryCard.className = "bounty-card card status-unclaimed";
            summaryCard.innerHTML = `
                <div class="bounty-card-header">
                    <span class="division-tag">SYSTEM DISPATCH</span>
                    <span class="status-badge" style="background-color: rgba(var(--accent-gold-rgb), 0.1); color: var(--accent-gold); border: 1px solid rgba(var(--accent-gold-rgb), 0.2);">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        NO SECURED CLAIMS
                    </span>
                </div>
                <div class="bounty-card-body">
                    <span class="bounty-label">Cycle ${week.weekNumber} Status</span>
                    <h3 class="bounty-target" style="color: var(--accent-gold);">NO BOUNTIES SECURED</h3>
                    <span style="font-family: var(--font-display); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">All target tracking fobs for this cycle remain active or have evaded capture.</span>
                </div>
                <div class="reward-block" style="border-color: rgba(var(--accent-gold-rgb), 0.15);">
                    <div class="reward-info">
                        <span class="bounty-label">Total Credits Disbursed</span>
                        <span class="reward-value" style="color: var(--text-secondary);">₵0 Credits</span>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(summaryCard);
        }

        week.bounties.forEach((bounty, index) => {
            const card = document.createElement("div");
            card.className = `bounty-card card status-${bounty.status}`;
            
            let badgeIcon = `<svg class="status-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;"><circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`;
            let statusText = "Hunting";
            if (bounty.status === 'claimed') {
                badgeIcon = `<svg class="status-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;"><path d="M4 10a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-1.382a1 1 0 0 0-.894.553l-.448.894a1 1 0 0 1-.894.553h-4.764a1 1 0 0 1-.894-.553l-.448-.894a1 1 0 0 0-.894-.553H6a2 2 0 0 1-2-2v-4z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M8 15h8"/></svg>`;
                statusText = "Captured";
            } else if (bounty.status === 'escaped') {
                badgeIcon = `<svg class="status-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;"><path d="M13 3l8 8-8 8M3 11h18M3 7h6M3 15h4"/></svg>`;
                statusText = "Evaded";
            }

            const targetName = bounty.target.name || (typeof bounty.target === 'string' ? bounty.target : "Unknown");
            const targetTeam = bounty.target.team || "";
            const targetId = bounty.target.id || "";

            const targetDisplay = targetTeam ? 
                `${targetName} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: normal;">(${targetTeam})</span>` : 
                targetName;

            let claimInfoHTML = '';
            if (bounty.status === 'claimed' && bounty.claimedBy) {
                const fullHunterName = getPlayerFullName(bounty.claimedBy);
                claimInfoHTML = `
                    <div class="claim-details">
                        <div class="bounty-label">Hunter</div>
                        <div class="claim-hunter">${fullHunterName}</div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="bounty-card-header">
                    <span class="division-tag">${bounty.division}</span>
                    <span class="status-badge status-${bounty.status}">${badgeIcon} ${statusText}</span>
                </div>
                <div class="bounty-card-body">
                    <span class="bounty-label">Target Player</span>
                    <h3 class="bounty-target">${targetDisplay}</h3>
                    ${targetId && !targetId.startsWith('T-') ? `<span style="font-family: var(--font-display); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">ID: ${targetId}</span>` : ''}
                </div>
                <div class="reward-block">
                    <div class="reward-info">
                        <span class="bounty-label">Bounty Reward</span>
                        <span class="reward-value">₵${bounty.reward} Credits</span>
                    </div>
                    ${claimInfoHTML}
                </div>
                <div class="bounty-card-footer">
                    <button class="btn btn-secondary btn-sm edit-bounty-btn">Resolve Outcome</button>
                    <button class="btn btn-accent btn-sm wanted-poster-btn">Wanted Poster</button>
                    <button class="btn btn-danger-outline btn-sm reroll-single-btn" title="Re-roll this Division's bounty">↻ Re-roll</button>
                </div>
            `;

            // Card Action Hooks
            card.querySelector(".edit-bounty-btn").addEventListener("click", () => {
                triggerEditBountyModal(weekIndex, index);
            });

            card.querySelector(".wanted-poster-btn").addEventListener("click", () => {
                triggerWantedPosterModal(bounty);
            });

            card.querySelector(".reroll-single-btn").addEventListener("click", () => {
                if (confirm(`Re-roll bounty for "${bounty.division}"? This will pick a new random target.`)) {
                    rerollSingleBounty(weekIndex, index);
                }
            });

            cardsContainer.appendChild(card);
        });
    }
}

// Helper to look up player by ID or Name and return formatted details
function getPlayerFullName(idOrName) {
    if (!idOrName) return "";
    
    // Lookup by ID
    for (let divName of Object.keys(state.divisions)) {
        const found = state.divisions[divName].find(p => p.id === idOrName);
        if (found) {
            return `${found.name} (${found.team})`;
        }
    }
    // Lookup by Name
    for (let divName of Object.keys(state.divisions)) {
        const found = state.divisions[divName].find(p => p.name === idOrName);
        if (found) {
            return `${found.name} (${found.team})`;
        }
    }
    return idOrName; // Fallback to raw string (custom typed hunters)
}

// Helper player lookup returning full object
function lookupPlayer(idOrName) {
    if (!idOrName) return null;
    for (let divName of Object.keys(state.divisions)) {
        for (let p of state.divisions[divName]) {
            if (p.id === idOrName || p.name === idOrName) {
                return { ...p, division: divName };
            }
        }
    }
    return null;
}

/* ==========================================================================
   RANDOM TARGET SELECTION (ROULETTE WHEEL MARQUEE)
   ========================================================================== */
let rolledBountiesCache = []; // Temporary holding before user clicks Confirm

// Helper to gather player IDs that have already been resolved (claimed/escaped) as bounties
function getExcludedPlayerIds(divName) {
    const excluded = new Set();
    state.weeks.forEach(week => {
        if (!week.bounties) return;
        week.bounties.forEach(b => {
            if (b.division === divName && (b.status === "claimed" || b.status === "escaped")) {
                const targetId = b.target.id || b.target; // support legacy strings
                if (targetId) excluded.add(targetId);
            }
        });
    });
    return excluded;
}

function triggerBountyRoulette() {
    const divNames = Object.keys(state.divisions);
    
    if (divNames.length === 0) {
        showToast("Create a division and add players first!", "error");
        return;
    }

    // Verify all divisions have at least 1 player
    for (let d of divNames) {
        if (state.divisions[d].length === 0) {
            showToast(`Division "${d}" has no players. Add players to roll bounties.`, "error");
            return;
        }
    }

    rolledBountiesCache = [];
    const tracksContainer = document.getElementById("roulette-tracks");
    tracksContainer.innerHTML = "";
    document.getElementById("roulette-modal-footer").classList.add("hidden");
    
    openModal("roulette-modal");

    // We build the scrolling tracks for each division
    divNames.forEach((divName, trackIdx) => {
        const players = state.divisions[divName];
        const excludedIds = getExcludedPlayerIds(divName);
        
        let availablePlayers = players.filter(p => !excludedIds.has(p.id));
        if (availablePlayers.length === 0) {
            // If all players have been targets, reset the pool and make everyone available again
            availablePlayers = players;
            showToast(`All players in "${divName}" have been targets. Pool reset.`, "success");
        }
        
        // Randomly pick a target player object from available players
        const targetIndex = Math.floor(Math.random() * availablePlayers.length);
        const targetPlayer = availablePlayers[targetIndex];

        // Cache the result
        rolledBountiesCache.push({
            division: divName,
            target: targetPlayer, // store player object
            status: "pending",
            claimedBy: null,
            reward: 100 // default points value
        });

        // Set up roulette wheel strip
        const trackItem = document.createElement("div");
        trackItem.className = "roulette-track-item";
        
        const trackLabel = document.createElement("div");
        trackLabel.className = "roulette-div-name";
        trackLabel.innerText = divName;
        
        const viewport = document.createElement("div");
        viewport.className = "roulette-viewport";
        viewport.id = `viewport-${trackIdx}`;

        const strip = document.createElement("div");
        strip.className = "roulette-strip";
        strip.id = `strip-${trackIdx}`;

        const totalItemsCount = 40;
        
        // Render all roster players on the spinning wheel visual
        for (let i = 0; i < totalItemsCount; i++) {
            const playerIdx = i % players.length;
            const playerObj = players[playerIdx];
            const pName = playerObj.name || playerObj;
            
            const item = document.createElement("div");
            item.className = "roulette-item";
            item.innerText = pName;
            item.dataset.player = pName;
            
            if (i === 30) {
                item.innerText = targetPlayer.name;
                item.dataset.player = targetPlayer.name;
                item.classList.add("target-node");
            }
            
            strip.appendChild(item);
        }

        viewport.appendChild(strip);
        trackItem.appendChild(trackLabel);
        trackItem.appendChild(viewport);
        tracksContainer.appendChild(trackItem);

        strip.style.transform = `translateX(0px)`;
    });

    // Spin animation logic
    setTimeout(() => {
        // Play radar sweeps at intervals
        let sweepInterval = setInterval(() => {
            sounds.playRadarSweep();
        }, 320);

        divNames.forEach((divName, trackIdx) => {
            const strip = document.getElementById(`strip-${trackIdx}`);
            const viewport = document.getElementById(`viewport-${trackIdx}`);
            const viewportWidth = viewport.offsetWidth;
            
            const finalX = (viewportWidth / 2) - ((30 * 200) + 100);

            const spinDuration = 3000 + (trackIdx * 300);
            strip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0.8, 0.15, 1)`;
            
            strip.style.transform = `translateX(${finalX}px)`;

            setTimeout(() => {
                const targetNode = strip.querySelector(".target-node");
                if (targetNode) {
                    targetNode.classList.add("selected-roll");
                    sounds.playLock(); // Play lock sound when single track finishes!
                }
            }, spinDuration);
        });

        const longestSpin = 3000 + ((divNames.length - 1) * 300);
        setTimeout(() => {
            clearInterval(sweepInterval);
            sounds.playSuccess(); // Play success sound when all tracks lock!
            document.getElementById("roulette-modal-footer").classList.remove("hidden");
        }, longestSpin + 200);

    }, 200);
}

function confirmRolledBounties() {
    const selectEl = document.getElementById("week-select");
    const weekIndex = parseInt(selectEl.value);
    
    state.weeks[weekIndex].bounties = JSON.parse(JSON.stringify(rolledBountiesCache));
    saveState();
    closeModal("roulette-modal");
    renderBountiesTab();
    showToast(`Bounties locked in for Week ${state.weeks[weekIndex].weekNumber}!`, "success");
}

function rerollSingleBounty(weekIndex, bountyIndex) {
    const week = state.weeks[weekIndex];
    const bounty = week.bounties[bountyIndex];
    const players = state.divisions[bounty.division];

    if (!players || players.length === 0) {
        showToast("Roster empty. Cannot roll.", "error");
        return;
    }

    const excludedIds = getExcludedPlayerIds(bounty.division);
    
    // Available: not resolved in past weeks and not the current target
    let availablePlayers = players.filter(p => !excludedIds.has(p.id) && p.id !== bounty.target.id);
    if (availablePlayers.length === 0) {
        // Fallback to any player except the current target
        availablePlayers = players.filter(p => p.id !== bounty.target.id);
    }
    if (availablePlayers.length === 0) {
        // Fallback to only available roster option
        availablePlayers = players;
    }

    const rndIdx = Math.floor(Math.random() * availablePlayers.length);
    const newTarget = availablePlayers[rndIdx];

    bounty.target = newTarget;
    bounty.status = "pending";
    bounty.claimedBy = null;
    sounds.playBeep();
    saveState();
    renderBountiesTab();
    showToast(`Bounty re-rolled to ${newTarget.name}`, "success");
}


/* ==========================================================================
   EDIT OUTCOME MODAL
   ========================================================================== */
function triggerEditBountyModal(weekIndex, bountyIndex) {
    currentEditingBounty = { weekIndex, bountyIndex };
    
    const bounty = state.weeks[weekIndex].bounties[bountyIndex];
    const targetName = bounty.target.name || (typeof bounty.target === 'string' ? bounty.target : "Unknown");
    const targetTeam = bounty.target.team ? ` (${bounty.target.team})` : "";
    
    document.getElementById("edit-bounty-subtitle").innerText = `Division: ${bounty.division} | Target: ${targetName}${targetTeam}`;
    document.getElementById("bounty-status-select").value = bounty.status;
    document.getElementById("bounty-reward-input").value = bounty.reward || 100;
    
    // Populate Hunter dropdown
    const hunterSelect = document.getElementById("bounty-hunter-select");
    hunterSelect.innerHTML = `<option value="">-- Select Active Player --</option>`;
    
    const allPlayers = [];
    Object.keys(state.divisions).forEach(divName => {
        state.divisions[divName].forEach(player => {
            allPlayers.push({ ...player, division: divName });
        });
    });

    allPlayers.sort((a, b) => a.name.localeCompare(b.name));
    
    allPlayers.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = `${p.name} (${p.team} | ${p.division})`;
        if (bounty.claimedBy === p.id || bounty.claimedBy === p.name) {
            opt.selected = true;
        }
        hunterSelect.appendChild(opt);
    });

    // Populate custom hunter text input if they typed a name not on roster
    const isCustomHunter = bounty.claimedBy && !allPlayers.some(p => p.id === bounty.claimedBy);
    const customHunterInput = document.getElementById("bounty-hunter-custom");
    customHunterInput.value = isCustomHunter ? bounty.claimedBy : "";

    // Toggle hunter select field visibility
    const hunterGroup = document.getElementById("hunter-select-group");
    if (bounty.status === "claimed") {
        hunterGroup.classList.remove("hidden");
    } else {
        hunterGroup.classList.add("hidden");
    }

    openModal("bounty-edit-modal");
}

function saveBountyOutcome() {
    if (!currentEditingBounty) return;
    
    const { weekIndex, bountyIndex } = currentEditingBounty;
    const bounty = state.weeks[weekIndex].bounties[bountyIndex];
    
    const status = document.getElementById("bounty-status-select").value;
    const reward = parseInt(document.getElementById("bounty-reward-input").value) || 0;
    
    bounty.status = status;
    bounty.reward = reward;
    
    if (status === "claimed") {
        const dropdownHunter = document.getElementById("bounty-hunter-select").value;
        const customHunter = document.getElementById("bounty-hunter-custom").value.trim();
        
        const hunter = customHunter || dropdownHunter;
        if (!hunter) {
            showToast("Please select or type the claiming hunter's name.", "error");
            return;
        }
        bounty.claimedBy = hunter;
    } else {
        bounty.claimedBy = null;
    }

    sounds.playSuccess();
    saveState();
    closeModal("bounty-edit-modal");
    renderBountiesTab();
    showToast("Bounty outcome updated!", "success");
    currentEditingBounty = null;
}


/* ==========================================================================
   LEADERBOARD CALCULATIONS
   ========================================================================== */
function renderLeaderboardTab() {
    const hunterBoard = document.getElementById("hunter-board");
    const targetBoard = document.getElementById("target-board");
    
    hunterBoard.innerHTML = "";
    targetBoard.innerHTML = "";

    const hunterStats = {}; // { divisionName: { playerKey: { name, team, claims, points } } }
    const targetStats = {}; // { divisionName: { playerKey: { name, team, escapes, points } } }

    // Initialize stats containers for all active roster divisions
    Object.keys(state.divisions).forEach(divName => {
        hunterStats[divName] = {};
        targetStats[divName] = {};
    });

    // 1. Compile Stats
    state.weeks.forEach(week => {
        if (!week.bounties) return;
        
        week.bounties.forEach(bounty => {
            const divName = bounty.division;
            
            // Ensure division key exists in stats
            if (!hunterStats[divName]) hunterStats[divName] = {};
            if (!targetStats[divName]) targetStats[divName] = {};

            // Hunter Scoring Aggregation
            if (bounty.status === "claimed" && bounty.claimedBy) {
                const hunterId = bounty.claimedBy;
                const hunterObj = lookupPlayer(hunterId);
                const name = hunterObj ? hunterObj.name : hunterId;
                const team = hunterObj ? hunterObj.team : "External";
                const hunterDivision = hunterObj ? hunterObj.division : divName;

                // Ensure the hunter stats division exists
                if (!hunterStats[hunterDivision]) hunterStats[hunterDivision] = {};

                const key = hunterId;
                if (!hunterStats[hunterDivision][key]) {
                    hunterStats[hunterDivision][key] = { name: name, team: team, claims: 0, points: 0 };
                }
                hunterStats[hunterDivision][key].claims += 1;
                hunterStats[hunterDivision][key].points += bounty.reward;
            }

            // Target Survival Scoring Aggregation
            const targetObj = bounty.target;
            const targetId = targetObj.id || targetObj; // fallback
            const targetName = targetObj.name || targetObj;
            const targetTeam = targetObj.team || "Independent";

            const key = targetId;
            if (!targetStats[divName][key]) {
                targetStats[divName][key] = { name: targetName, team: targetTeam, escapes: 0, points: 0 };
            }
            if (bounty.status === "escaped") {
                targetStats[divName][key].escapes += 1;
                targetStats[divName][key].points += bounty.reward;
            }
        });
    });

    // 2. Render Hunter Boards by Division
    const activeDivs = Array.from(new Set([
        ...Object.keys(state.divisions),
        ...Object.keys(hunterStats)
    ]));

    activeDivs.forEach(divName => {
        const divHounters = Object.values(hunterStats[divName] || {});
        
        // Sort
        divHounters.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.claims - a.claims;
        });

        // Heading
        const header = document.createElement("h3");
        header.className = "division-board-header";
        header.innerText = `${divName} Division`;
        hunterBoard.appendChild(header);

        // Table Card
        const tableCard = document.createElement("div");
        tableCard.className = "table-container card";
        tableCard.style.marginBottom = "2rem";

        if (divHounters.length === 0) {
            tableCard.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No claims registered for this division.</div>`;
        } else {
            const table = document.createElement("table");
            table.className = "leaderboard-table";
            table.innerHTML = `
                <thead>
                    <tr>
                        <th width="80px">Rank</th>
                        <th>Hunter</th>
                        <th class="num-col">Bounties Claimed</th>
                        <th class="num-col">Total Points</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector("tbody");
            divHounters.forEach((hunter, idx) => {
                const tr = document.createElement("tr");
                const displayName = hunter.team && hunter.team !== 'External' && hunter.team !== 'Independent' ? 
                    `${hunter.name} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(${hunter.team})</span>` : 
                    hunter.name;

                tr.innerHTML = `
                    <td>${getRankBadgeHTML(idx + 1)}</td>
                    <td style="font-weight: 600;">${displayName}</td>
                    <td class="num-col">${hunter.claims}</td>
                    <td class="num-col" style="font-weight: 700; color: var(--accent-gold);">₵${hunter.points}</td>
                `;
                tbody.appendChild(tr);
            });
            tableCard.appendChild(table);
        }
        hunterBoard.appendChild(tableCard);
    });

    // 3. Render Target Boards by Division
    activeDivs.forEach(divName => {
        const divTargets = Object.values(targetStats[divName] || {});
        
        // Sort
        divTargets.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.escapes - a.escapes;
        });

        // Heading
        const header = document.createElement("h3");
        header.className = "division-board-header";
        header.innerText = `${divName} Division`;
        targetBoard.appendChild(header);

        // Table Card
        const tableCard = document.createElement("div");
        tableCard.className = "table-container card";
        tableCard.style.marginBottom = "2rem";

        if (divTargets.length === 0) {
            tableCard.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No escaped bounties registered for this division.</div>`;
        } else {
            const table = document.createElement("table");
            table.className = "leaderboard-table";
            table.innerHTML = `
                <thead>
                    <tr>
                        <th width="80px">Rank</th>
                        <th>Target Player</th>
                        <th class="num-col">Bounties Escaped</th>
                        <th class="num-col">Total Points</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector("tbody");
            divTargets.forEach((target, idx) => {
                const tr = document.createElement("tr");
                const displayName = target.team && target.team !== 'Independent' ? 
                    `${target.name} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(${target.team})</span>` : 
                    target.name;

                tr.innerHTML = `
                    <td>${getRankBadgeHTML(idx + 1)}</td>
                    <td style="font-weight: 600;">${displayName}</td>
                    <td class="num-col">${target.escapes}</td>
                    <td class="num-col" style="font-weight: 700; color: var(--accent-gold);">₵${target.points}</td>
                `;
                tbody.appendChild(tr);
            });
            tableCard.appendChild(table);
        }
        targetBoard.appendChild(tableCard);
    });
}

// Utility to render Rank Badges
function getRankBadgeHTML(rank) {
    if (rank === 1) return `<span class="rank-badge rank-1">1</span>`;
    if (rank === 2) return `<span class="rank-badge rank-2">2</span>`;
    if (rank === 3) return `<span class="rank-badge rank-3">3</span>`;
    return `<span class="rank-badge rank-other">${rank}</span>`;
}


/* ==========================================================================
   SHARE CARD GENERATION & EXPORT
   ========================================================================== */
function openShareCardModal() {
    const selectEl = document.getElementById("week-select");
    const weekIndex = parseInt(selectEl.value);
    const week = state.weeks[weekIndex];

    if (!week || !week.bounties || week.bounties.length === 0) {
        showToast("No bounties available to generate card.", "error");
        return;
    }

    document.getElementById("share-week-title").innerText = `WEEK ${week.weekNumber} REPORT`;
    
    const listContainer = document.getElementById("share-bounties-list");
    listContainer.innerHTML = "";
    
    let claimCount = 0;
    let escapeCount = 0;

    week.bounties.forEach(bounty => {
        const row = document.createElement("div");
        row.className = `share-bounty-row ${bounty.status}`;
        
        let statusBadgeText = "Hunting";
        if (bounty.status === 'claimed') {
            statusBadgeText = "Captured";
            claimCount++;
        } else if (bounty.status === 'escaped') {
            statusBadgeText = "Evaded";
            escapeCount++;
        }

        const targetName = bounty.target.name || (typeof bounty.target === 'string' ? bounty.target : "Unknown");
        const targetTeam = bounty.target.team ? ` (${bounty.target.team})` : "";

        row.innerHTML = `
            <div class="share-row-left">
                <span class="share-div-tag">${bounty.division}</span>
                <span class="share-target-name">${targetName}${targetTeam}</span>
            </div>
            <div class="share-row-right">
                <span class="share-status-tag ${bounty.status}">${statusBadgeText}</span>
                <span class="share-reward">₵${bounty.reward}</span>
            </div>
        `;
        listContainer.appendChild(row);
    });

    document.getElementById("share-meta-summary").innerText = `${claimCount} CAPTURED / ${escapeCount} EVADED`;
    
    openModal("share-card-modal");
}

function downloadShareCardGraphic() {
    const element = document.getElementById("share-card-graphic");
    const selectEl = document.getElementById("week-select");
    const weekIndex = parseInt(selectEl.value);
    const week = state.weeks[weekIndex];

    showToast("Generating image file...", "success");

    html2canvas(element, {
        scale: 2.5,
        backgroundColor: "#0b0f19",
        logging: false,
        useCORS: true
    }).then(canvas => {
        const imageURL = canvas.toDataURL("image/png");
        
        const downloadLink = document.createElement("a");
        downloadLink.download = `bounty-board-week-${week.weekNumber}.png`;
        downloadLink.href = imageURL;
        downloadLink.click();
        
        showToast("Image downloaded successfully!", "success");
    }).catch(err => {
        console.error(err);
        showToast("Failed to render card image", "error");
    });
}

const POOL_CRIMES = [
    "Lethal trick shots and consecutive rack-wrecking.",
    "Pocketing consecutive balls without a permit.",
    "Illegal spin application (extreme English) on the cue ball.",
    "Excessive chalking and mental intimidation of guild members.",
    "Defacing tournament speed felt with consecutive bank shots.",
    "Concealing an unregistered cue stick of mass destruction.",
    "Unlicensed combination shots resulting in severe pocket abuse.",
    "Dangerous jump shots violating low-altitude table airspace protocols.",
    "Unlawful run-outs and cleaning the table under extreme duress.",
    "Violently scratching on the 8-ball during high-stakes bounty matches.",
    "Unlawful use of force-guided cue balls in gravity-well tournaments.",
    "Smuggling high-grade Corellian chalk into the sector finals.",
    "Engaging in unauthorized masse shots that fractured the cantina slate.",
    "Illicit pocket-manipulation using concealed micro-tractor beams.",
    "Sinking the 8-ball with an illegal cloaking device active.",
    "Operating a modified cue stick with built-in targeting computer guidance.",
    "Sabotaging the mechanical table leveling gyroscope in the Outer Rim.",
    "Using Jedi mind tricks to force opponents to scratch on critical shots.",
    "Rack-fixing using thermal detonators disguised as standard billiard balls.",
    "Extorting credits by staging fraudulent cue ball velocity readings.",
    "Falsifying amateur credentials to hustle bounty hunters in local cantinas.",
    "Using a forbidden dual-handed bridge technique outlawed in three star systems.",
    "Running the table in less than twelve parsecs without an active flight plan.",
    "Illegal distribution of unlicensed carbonite cue ball polish.",
    "Over-modifying cue stick tip hardness beyond legal Imperial density limits.",
    "Unlicensed jump-shots that caused catastrophic damage to ceiling light fixtures.",
    "Unauthorized double-hits causing severe vibrations in the local subspace matrix.",
    "Hustling Imperial officers in a high-stakes 9-ball game on Tatooine.",
    "Using a cybernetic eye implant to calculate bank shot angles to 99% accuracy.",
    "Possession of a forbidden pool cue containing Kyber crystal focusing lenses."
];

function getRandomPoolCrime(playerName) {
    let hash = 0;
    for (let i = 0; i < playerName.length; i++) {
        hash = playerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % POOL_CRIMES.length;
    return POOL_CRIMES[index];
}

function triggerWantedPosterModal(bounty) {
    sounds.playBeep();
    const targetName = bounty.target.name || (typeof bounty.target === 'string' ? bounty.target : "Unknown");
    const targetTeam = bounty.target.team || "Independent";
    const division = bounty.division;
    const reward = bounty.reward || 100;
    const crime = getRandomPoolCrime(targetName);

    // Populate Cyber Hologram
    document.querySelector(".poster-cyber-name").innerText = targetName;
    document.querySelector(".poster-cyber-team").innerText = targetTeam;
    document.querySelector(".poster-cyber-division").innerText = division;
    document.querySelector(".poster-cyber-crime").innerText = crime;
    document.querySelector(".poster-cyber-reward").innerText = `₵${reward} CREDITS`;

    // Populate Red Hologram
    document.querySelector(".poster-red-holo-name").innerText = targetName;
    document.querySelector(".poster-red-holo-team").innerText = targetTeam;
    document.querySelector(".poster-red-holo-division").innerText = division;
    document.querySelector(".poster-red-holo-crime").innerText = crime;
    document.querySelector(".poster-red-holo-reward").innerText = `₵${reward} GALACTIC CREDITS`;

    openModal("wanted-posters-modal");
}

function downloadPoster(elementId, baseName) {
    const element = document.getElementById(elementId);
    // Find the header or name text to include in filename
    const nameEl = element.querySelector(".poster-cyber-name, .poster-red-holo-name");
    const targetName = nameEl ? nameEl.innerText.replace(/\s+/g, '-').toLowerCase() : "target";
    
    showToast("Generating image file...", "success");

    html2canvas(element, {
        scale: 2.5,
        backgroundColor: null,
        logging: false,
        useCORS: true
    }).then(canvas => {
        const imageURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${baseName}-${targetName}.png`;
        downloadLink.href = imageURL;
        downloadLink.click();
        showToast("Wanted poster downloaded successfully!", "success");
    }).catch(err => {
        console.error(err);
        showToast("Failed to render poster image", "error");
    });
}

