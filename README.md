# Apex Bounty Hunter Hub

A premium, localized web dashboard designed to manage a Bounty Hunter league, randomly select weekly bounty targets across divisions, track claims and escapes, calculate leaderboards, and generate highly aesthetic graphics for weekly posting.

## 🚀 How to Run

Since the application is built using standard, lightweight web tech (HTML5, Vanilla CSS, and Vanilla JS), it can be run instantly in two ways:

### Method 1: Direct File Launch (No Server Needed)
1. Navigate to the project folder `BH Program`.
2. Double-click the [index.html](file:///c:/Users/darkn/OneDrive/Desktop/BH%20Program/index.html) file to open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local Server (Optional)
If you prefer running it on a local server (e.g. for development or hosting inside a network), you can run one of the following commands in the directory:
- **Python**: `python -m http.server 8000` (then open `http://localhost:8000`)
- **Node.js (Npx)**: `npx serve` or `npm install -g serve`

---

## 🎯 Key Features

1. **Roster & Division Management**:
   - Create, edit, and delete custom divisions.
   - Maintain a list of player usernames/gamertags for each division.
   
2. **Target Acquisition Spinner**:
   - Choose or create a specific week.
   - Run the random selector to draw one bounty target from each division.
   - Enjoy a gorgeous horizontal scrolling roulette spin marquee that highlights and selects the locked-in players.

3. **Outcome Resolution**:
   - Resolve bounties by setting their state to **Pending** (active), **Claimed** (bounty taken), or **Escaped** (bounty survived the week).
   - Enter/adjust custom reward points.
   - Select the hunter who claimed the bounty from the global player database, or type in a custom hunter name.

4. **Dynamic Leaderboard**:
   - **Hunter Standings**: Ranks players based on total bounty points accumulated from successful claims, resolving ties by the number of claims.
   - **Survival Standings**: Ranks bounty targets based on total points survived (escapes), resolving ties by escape counts.
   - Top 3 players in both categories receive custom Gold, Silver, and Bronze badges.

5. **Share Card Generator**:
   - Generate a beautiful, cyberpunk-themed summary graphic for the selected week.
   - Features absolute metrics (Claims vs. Escapes) and lists all division targets and their outcome.
   - Download directly as a high-DPI `.png` image ready to post on Discord, Twitter, forums, or leagues.

6. **Settings & Data Portability**:
   - Save automatically to your browser's local storage (`localStorage`).
   - Backup/export your database as a standard JSON file.
   - Import a saved database JSON file to restore your league's history on any device.
   - Load pre-configured **Demo Presets** to test features immediately.

---

## 🌐 Hosting & Deployment (Google Sites)

To deploy the Bounty Hunters Guild Terminal to your Google Sites page, you can choose one of the following two methods:

### Method A: The Copy-Paste Embed Method (Single-File index_inline.html)
Since Google Sites does not allow hosting multiple separate files (`index.html`, `style.css`, `app.js`) together natively, we provide a compiled self-contained version `index_inline.html` that contains all CSS and JS styles fully integrated.
1. Run `node compile_inline.js` in your project folder to generate the latest `index_inline.html`.
2. Open your Google Sites editor.
3. Click **Embed** in the right-hand panel.
4. Select the **Embed code** tab.
5. Open [index_inline.html](file:///c:/Users/darkn/OneDrive/Desktop/BH%20Program/index_inline.html) in a text editor (e.g. Notepad, VS Code), copy its entire content, and paste it into the Google Sites code block.
6. Click **Next** and then **Insert**.
7. Resize the embedded container on your page to fit the desired console dimensions.

> [!NOTE]
> When using direct code embeds inside Google Sites, browser database state (`localStorage`) is scoped to Google's sandboxed helper frame origin (`googleusercontent.com`). While rosters and histories will persist on your device's browser cache, they won't automatically sync between different users or devices unless you manually export and import your database JSON file using the **Terminal Settings** backup controls.

### Method B: The Free Hosting + Embed URL Method (Recommended)
For full browser compatibility, easy sharing, and robust file downloads, it is highly recommended to host the modular files on a free static provider first, then embed the URL:
1. Push this folder to a new repository on **GitHub**.
2. Go to **Settings > Pages** in your GitHub repository and enable GitHub Pages (choose the root directory).
3. Copy your live page URL (e.g. `https://yourusername.github.io/your-repository/`).
4. In Google Sites, click **Embed**, choose the **By URL** tab, paste the link, and click **Insert**.

