const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js', 'utf8').split('// Parse a roster without touching the active session.')[1];
const context = vm.createContext({});
vm.runInContext('//'+source, context);
const parse = context.parseSessionRoster;
test('CSV accepts BOM, CRLF, commas and escaped quotes; preserves leading zero IDs', () => {
    const roster = parse('\uFEFFDivision,Name,ID,Team\r\nNorth,"Doe, Jane",001,"The ""A"" Team"\r\n', 'roster.csv');
    assert.equal(roster.North[0].name, 'Doe, Jane');
    assert.equal(roster.North[0].id, '001');
    assert.equal(roster.North[0].team, 'The "A" Team');
});
test('JSON backup imports only roster, including legacy names', () => {
    const roster = parse(JSON.stringify({ divisions: { North: ['Jane'] }, weeks: [{ weekNumber: 9 }] }), 'list.json');
    assert.equal(roster.North[0].name, 'Jane');
    assert.equal(roster.North[0].team, 'Independent');
});
test('rejects empty, malformed, duplicate, and unsafe input', () => {
    for (const text of ['', 'Name\nJane', 'Division,Name\nNorth,"Jane', 'Division,Name\nNorth,Jane,extra', 'Division,Name\nNorth,<img src=x>', 'Division,Name,ID\nNorth,Jane,1\nNorth,John,1']) {
        assert.throws(() => parse(text, 'list.csv'));
    }
    for (const text of ['null', '{"divisions":[]}', '{"divisions":{"North":[]}}', '{"divisions":{"__proto__":["Jane"]}}']) assert.throws(() => parse(text, 'list.json'));
});
test('new session archives old results and preserves earlier archives without mutation', () => {
    const current = { divisions: { Old: ['Jane'] }, weeks: [{ weekNumber: 3, bounties: [{ status: 'claimed' }] }], archivedSessions: [{ archivedAt: 'earlier' }] };
    const before = JSON.stringify(current);
    const next = context.createNextSession(current, { New: ['John'] });
    assert.equal(JSON.stringify(current), before);
    assert.equal(next.archivedSessions.length, 2);
    assert.equal(next.archivedSessions[1].weeks, current.weeks);
    assert.equal(next.weeks[0].weekNumber, 1);
    assert.equal(next.weeks[0].bounties.length, 0);
    assert.deepEqual(JSON.parse(JSON.stringify(next)).divisions, { New: ['John'] });
});
test('upload preview, cancellation, storage failure, and successful start', async () => {
    const elements = Object.fromEntries(['next-session-file', 'next-session-preview', 'start-next-session', 'cancel-next-session', 'pdf-roster-review', 'pdf-roster-text', 'pdf-roster-csv', 'validate-pdf-roster', 'roster-review-table', 'roster-review-rows'].map(id => [id, { classList: { add() {}, remove() {} }, addEventListener(event, handler) { this[event] = handler; } }]));
    const old = { divisions: { Old: [] }, weeks: [] };
    Object.assign(context, { document: { getElementById: id => elements[id] }, state: old, safeConfirm: () => true, localStorage: { setItem() { throw Error('full'); } }, populateWeeksDropdown() {}, renderApp() {}, showToast() {} });
    context.setupNextSessionUpload();
    const input = elements['next-session-file'], start = elements['start-next-session'];
    input.files = [{ name: 'list.csv', size: 40, text: async () => 'Division,Name\nNorth,Jane' }];
    await input.change();
    assert.equal(start.disabled, false);
    assert.match(elements['next-session-preview'].textContent, /1 players/);
    start.click();
    assert.equal(context.state, old);
    assert.match(elements['next-session-preview'].textContent, /Could not save/);
    context.localStorage.setItem = () => {};
    start.click();
    assert.equal(context.state.weeks[0].weekNumber, 1);
    assert.equal(start.disabled, true);
    await input.change();
    elements['cancel-next-session'].click();
    assert.equal(start.disabled, true);
});



test('PDF table suggestions join split names and skip repeated headers', () => {
    const item = (str, x, y, width = 30) => ({ str, transform: [1, 0, 0, 1, x, y], width, height: 10 });
    const page = context.pdfRosterLines([
        item('Division', 10, 100), item('Name', 110, 100), item('ID', 240, 100), item('Team', 310, 100),
        item('North', 10, 80), item('Jane', 110, 80, 22), item('Doe', 135, 80), item('001', 240, 80), item('Friends', 310, 80)
    ]);
    const result = context.suggestPdfRoster([page, page]);
    assert.equal(result.count, 2);
    assert.match(result.text, /Page 2/);
    assert.match(result.csv, /"North","Jane Doe","001","Friends"/);
});
test('PDF section headings fill division and team; unfamiliar layouts stay available as text', () => {
    const line = (...text) => text.map(text => ({ text }));
    const result = context.suggestPdfRoster([[line('Division: North'), line('Team: Friends'), line('Player Name', 'Player ID'), line('Doe, Jane', '001'), line('unrecognized layout')]]);
    assert.equal(result.count, 1);
    assert.equal(parse(result.csv, 'pdf.csv').North[0].name, 'Doe, Jane');
    assert.match(result.text, /unrecognized layout/);
    assert.equal(context.suggestPdfRoster([[line('Hello world')]]).count, 0);
});
test('PDF reader rejects image-only pages, limits pages and cleans up on cancellation', async () => {
    const original = context.loadRosterPdfLibrary;
    let destroyed = 0;
    const task = { promise: Promise.resolve({ numPages: 1, getPage: async () => ({ getTextContent: async () => ({ items: [] }) }) }), destroy: async () => { destroyed++; } };
    context.loadRosterPdfLibrary = async () => ({ getDocument: () => task });
    const file = { arrayBuffer: async () => new ArrayBuffer(0) };
    try {
        await assert.rejects(context.extractPdfRoster(file), /OCR/);
        assert.equal(destroyed, 1);
        task.promise = Promise.resolve({ numPages: 101 });
        await assert.rejects(context.extractPdfRoster(file), /100 page/);
        assert.equal(destroyed, 2);
        assert.equal(await context.extractPdfRoster(file, () => true), null);
    } finally { context.loadRosterPdfLibrary = original; }
});
test('PDF upload requires review and edits invalidate the previous preview', async () => {
    const ids = ['next-session-file', 'next-session-preview', 'start-next-session', 'cancel-next-session', 'pdf-roster-review', 'pdf-roster-text', 'pdf-roster-csv', 'validate-pdf-roster', 'roster-review-table', 'roster-review-rows'];
    const elements = Object.fromEntries(ids.map(id => [id, { classList: { add() {}, remove() {} }, addEventListener(event, handler) { this[event] = handler; } }]));
    const original = context.extractPdfRoster;
    Object.assign(context, { document: { getElementById: id => elements[id] }, extractPdfRoster: async () => ({ text: 'North Jane', csv: 'Division,Name\nNorth,Jane', count: 1 }) });
    try {
        context.setupNextSessionUpload();
        const input = elements['next-session-file'], start = elements['start-next-session'];
        input.files = [{ name: 'roster.PDF', size: 100 }];
        await input.change();
        assert.equal(start.disabled, true);
        assert.equal(elements['pdf-roster-text'].textContent, 'North Jane');
        elements['validate-pdf-roster'].click();
        assert.equal(start.disabled, false);
        elements['pdf-roster-csv'].input();
        assert.equal(start.disabled, true);
        let resolve;
        context.extractPdfRoster = () => new Promise(r => { resolve = r; });
        const reading = input.change();
        elements['cancel-next-session'].click();
        resolve({ text: 'stale', csv: 'Division,Name\nNorth,Stale', count: 1 });
        await reading;
        assert.equal(elements['pdf-roster-text'].textContent, '');
        assert.equal(start.disabled, true);
    } finally { context.extractPdfRoster = original; }
});



test('division sheets keep team boxes separate, skip Bye, and reset columns each page', () => {
    const line = (...cells) => cells.map(([x, text]) => ({ x, text }));
    const pages = [[
        line([200, 'Division # 838 - Lower Columbia']),
        line([24, '83801 Friends'], [215, '83802 Other Team'], [406, '83803 Bye']),
        line([36, 'Venue One'], [227, 'Venue Two']),
        line([29, '3'], [62, '00137'], [96, 'Ewan, Bill'], [220, '5'], [253, '00040'], [287, 'Wylie, Michael']),
        line([24, '83804 New Team'], [215, '83805 Second Team']),
        line([29, '0'], [62, '00219'], [96, 'Sanchez Rio, Kenner David']),
        line([24, 'Printed 9/5/2026'], [550, 'Page 1 of 2'])
    ], [
        line([200, 'Division # 851 - St Helens 8']),
        line([24, "85107 Misfit Q's"]),
        line([29, '3'], [62, '00122'], [96, 'Furman, Kenneth'])
    ]];
    const result = context.suggestPdfRoster(pages);
    const divisions = parse(result.csv, 'review.csv');
    assert.equal(result.count, 4);
    assert.equal(divisions['Lower Columbia'][0].team, 'Friends');
    assert.equal(divisions['Lower Columbia'][1].team, 'Other Team');
    assert.equal(divisions['Lower Columbia'][2].team, 'New Team');
    assert.equal(divisions['Lower Columbia'][2].name, 'Kenner David Sanchez Rio');
    assert.equal(divisions['St Helens 8'][0].name, 'Kenneth Furman');
    assert.equal(divisions['St Helens 8'][0].team, "Misfit Q's");
    assert.throws(() => context.suggestPdfRoster([...pages, [line([20, 'Unknown page'])]]), /no division heading/);
});
test('roster table displays Division, Team, Player and safely escapes values', () => {
    const html = context.rosterReviewTable({ North: [{ team: "Q's & Friends", name: '<Jane>', id: '001' }] });
    assert.equal(html, '<tr><td>North</td><td>Q&#39;s &amp; Friends</td><td>&lt;Jane&gt;</td><td>001</td></tr>');
});

