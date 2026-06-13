const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\r\n/g, '\n');

// 1. Update renderBountiesTab()
const escapedBadgeText = `            } else if (bounty.status === 'escaped') {
                badgeIcon = \`<svg class="status-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;"><path d="M13 3l8 8-8 8M3 11h18M3 7h6M3 15h4"/></svg>\`;
                statusText = "Evaded";
            }`;

const escapedBadgeReplacement = `            } else if (bounty.status === 'escaped') {
                badgeIcon = \`<svg class="status-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;"><path d="M13 3l8 8-8 8M3 11h18M3 7h6M3 15h4"/></svg>\`;
                statusText = "Evaded";
            } else if (bounty.status === 'not_found') {
                badgeIcon = \`<svg class="status-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.2rem; display: inline-block;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>\`;
                statusText = "Not Found";
            }`;

if (!content.includes(escapedBadgeText)) {
    console.error("escapedBadgeText not found!");
    process.exit(1);
}
content = content.replace(escapedBadgeText, escapedBadgeReplacement);

// 2. Update openShareCardModal counts
const shareCountsText = `    let claimCount = 0;
    let escapeCount = 0;`;

const shareCountsReplacement = `    let claimCount = 0;
    let escapeCount = 0;
    let notFoundCount = 0;`;

if (!content.includes(shareCountsText)) {
    console.error("shareCountsText not found!");
    process.exit(1);
}
content = content.replace(shareCountsText, shareCountsReplacement);

// 3. Update openShareCardModal loop checks
const shareLoopText = `        } else if (bounty.status === 'escaped') {
            statusBadgeText = "Evaded";
            escapeCount++;
        }`;

const shareLoopReplacement = `        } else if (bounty.status === 'escaped') {
            statusBadgeText = "Evaded";
            escapeCount++;
        } else if (bounty.status === 'not_found') {
            statusBadgeText = "Not Found";
            notFoundCount++;
        }`;

if (!content.includes(shareLoopText)) {
    console.error("shareLoopText not found!");
    process.exit(1);
}
content = content.replace(shareLoopText, shareLoopReplacement);

// 4. Update openShareCardModal summary rendering
const shareSummaryText = `    document.getElementById("share-meta-summary").innerText = \`\${claimCount} CAPTURED / \${escapeCount} EVADED\`;`;

const shareSummaryReplacement = `    let summaryText = \`\${claimCount} CAPTURED / \${escapeCount} EVADED\`;
    if (notFoundCount > 0) {
        summaryText += \` / \${notFoundCount} NOT FOUND\`;
    }
    document.getElementById("share-meta-summary").innerText = summaryText;`;

if (!content.includes(shareSummaryText)) {
    console.error("shareSummaryText not found!");
    process.exit(1);
}
content = content.replace(shareSummaryText, shareSummaryReplacement);

// 5. Update renderOutcomeTab status buttons innerHTML
const outcomeButtonsText = `                <div class="outcome-status-buttons" style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary status-btn-pending \\\${bounty.status === 'pending' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.8rem; padding: 0.6rem 0.2rem;">Hunting</button>
                    <button class="btn btn-secondary status-btn-captured \\\${bounty.status === 'claimed' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.8rem; padding: 0.6rem 0.2rem;">Captured</button>
                    <button class="btn btn-secondary status-btn-evaded \\\${bounty.status === 'escaped' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.8rem; padding: 0.6rem 0.2rem;">Evaded</button>
                </div>`;

const outcomeButtonsReplacement = `                <div class="outcome-status-buttons" style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-secondary status-btn-pending \\\${bounty.status === 'pending' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.75rem; padding: 0.6rem 0.1rem; white-space: nowrap;">Hunting</button>
                    <button class="btn btn-secondary status-btn-captured \\\${bounty.status === 'claimed' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.75rem; padding: 0.6rem 0.1rem; white-space: nowrap;">Captured</button>
                    <button class="btn btn-secondary status-btn-evaded \\\${bounty.status === 'escaped' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.75rem; padding: 0.6rem 0.1rem; white-space: nowrap;">Evaded</button>
                    <button class="btn btn-secondary status-btn-not-found \\\${bounty.status === 'not_found' ? 'active' : ''}" style="flex: 1; text-transform: uppercase; font-size: 0.75rem; padding: 0.6rem 0.1rem; white-space: nowrap;">Not Found</button>
                </div>`;

if (!content.includes(outcomeButtonsText)) {
    console.error("outcomeButtonsText not found!");
    process.exit(1);
}
content = content.replace(outcomeButtonsText, outcomeButtonsReplacement);

// 6. Update renderOutcomeTab stamp rendering
const outcomeStampText = `        let stampHTML = "";
        if (bounty.status === 'claimed') {
            stampHTML = \\\`<div class="poster-stamp-overlay stamp-captured">CAPTURED</div>\\\`;
        } else if (bounty.status === 'escaped') {
            stampHTML = \\\`<div class="poster-stamp-overlay stamp-evaded">EVADED</div>\\\`;
        }`;

const outcomeStampReplacement = `        let stampHTML = "";
        if (bounty.status === 'claimed') {
            stampHTML = \\\`<div class="poster-stamp-overlay stamp-captured">CAPTURED</div>\\\`;
        } else if (bounty.status === 'escaped') {
            stampHTML = \\\`<div class="poster-stamp-overlay stamp-evaded">EVADED</div>\\\`;
        } else if (bounty.status === 'not_found') {
            stampHTML = \\\`<div class="poster-stamp-overlay stamp-not_found">NOT FOUND</div>\\\`;
        }`;

if (!content.includes(outcomeStampText)) {
    console.error("outcomeStampText not found!");
    process.exit(1);
}
content = content.replace(outcomeStampText, outcomeStampReplacement);

// 7. Update renderOutcomeTab button click wiring
const outcomeWiringText = `        // Wire status buttons click events
        const btnPending = leftCol.querySelector(".status-btn-pending");
        const btnCaptured = leftCol.querySelector(".status-btn-captured");
        const btnEvaded = leftCol.querySelector(".status-btn-evaded");
        const hunterContainer = leftCol.querySelector(".hunter-select-container");
        
        let selectedStatus = bounty.status;
        
        btnPending.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "pending";
            btnPending.classList.add("active");
            btnCaptured.classList.remove("active");
            btnEvaded.classList.remove("active");
            hunterContainer.classList.add("hidden");
        });
        
        btnCaptured.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "claimed";
            btnCaptured.classList.add("active");
            btnPending.classList.remove("active");
            btnEvaded.classList.remove("active");
            hunterContainer.classList.remove("hidden");
        });
        
        btnEvaded.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "escaped";
            btnEvaded.classList.add("active");
            btnPending.classList.remove("active");
            btnCaptured.classList.remove("active");
            hunterContainer.classList.add("hidden");
        });`;

const outcomeWiringReplacement = `        // Wire status buttons click events
        const btnPending = leftCol.querySelector(".status-btn-pending");
        const btnCaptured = leftCol.querySelector(".status-btn-captured");
        const btnEvaded = leftCol.querySelector(".status-btn-evaded");
        const btnNotFound = leftCol.querySelector(".status-btn-not-found");
        const hunterContainer = leftCol.querySelector(".hunter-select-container");
        
        let selectedStatus = bounty.status;
        
        btnPending.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "pending";
            btnPending.classList.add("active");
            btnCaptured.classList.remove("active");
            btnEvaded.classList.remove("active");
            btnNotFound.classList.remove("active");
            hunterContainer.classList.add("hidden");
        });
        
        btnCaptured.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "claimed";
            btnCaptured.classList.add("active");
            btnPending.classList.remove("active");
            btnEvaded.classList.remove("active");
            btnNotFound.classList.remove("active");
            hunterContainer.classList.remove("hidden");
        });
        
        btnEvaded.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "escaped";
            btnEvaded.classList.add("active");
            btnPending.classList.remove("active");
            btnCaptured.classList.remove("active");
            btnNotFound.classList.remove("active");
            hunterContainer.classList.add("hidden");
        });

        btnNotFound.addEventListener("click", () => {
            sounds.playClick();
            selectedStatus = "not_found";
            btnNotFound.classList.add("active");
            btnPending.classList.remove("active");
            btnCaptured.classList.remove("active");
            btnEvaded.classList.remove("active");
            hunterContainer.classList.add("hidden");
        });`;

if (!content.includes(outcomeWiringText)) {
    console.error("outcomeWiringText not found!");
    process.exit(1);
}
content = content.replace(outcomeWiringText, outcomeWiringReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully patched app.js with Not Found support!");
