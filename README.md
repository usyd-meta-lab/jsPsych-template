# 🧠 USYD Meta Lab – jsPsych Experiment Template

A starter kit for building browser-based behavioural tasks with [jsPsych 8.2.1](https://www.jspsych.org/). This edition focuses on a modular workflow so you can add or remove trials without touching the core runtime. It also includes opinionated defaults for DataPipe saving, consent flows, and redirect handling for Prolific and SONA.

## Quick Start
1. **Install the files** – clone or download this repository.
2. **Serve the project locally** – the dynamic trial loader uses `fetch`, so open the project through a local server (for example, use the VS Code `live server` extension).
3. **Edit the template** – follow the file guide below to plug in your own instructions, trials, and parameters.

## How the Template Runs
- **Script flow** – `index.html` loads jsPsych, official plugins, and three helper utilities (`loadTrials`, `getCondition`, `augmentTimeline`). It then loads `src/parameters.js`, `src/main.js`, and finally `src/timeline.js`, which starts the study once everything is ready.
- **Modular trials/blocks** – `loadTrials('src/content')` automatically discovers every `.js` file inside `src/trials/`, fetches it, and exposes the variables within the file (they don't need to matches the filename) and you can have mutiple trials within a single file and they should all be exported to the timeline. Add or remove a file and it will appear in the `content` object returned to `timeline.js`.
- **Timeline augmentation** – before running, `timeline.js` passes your base timeline to `augmentTimeline()`. That helper adds the lab’s standard scaffolding: browser compatibility checks, fullscreen enforcement, consent/Participant Information Sheet blocks (Prolific, SONA, or in-lab variants), an optional demographics survey, a short “debug” feedback prompt, and the SONA debrief screens. You can keep the default, or copy the function into your own script (loaded after the CDN version) to customise or trim the extras.
- **Condition assignment & saving** – `getCondition()` pulls the next available condition from DataPipe (once per participant) and `main.js` handles jsPsych initialisation, timestamping, summary accuracy checks, and saving via the jsPsychPipe plugin (or a local CSV if `local_save` is `true`).

## What to Edit and Why
- `index.html` – update script tags if you add custom plugins, adjust the `<title>`, or swap the favicon.
- `src/parameters.js` – set study-wide toggles, redirect codes, and DataPipe credentials (see the parameter reference below).
- `src/main.js` – tweak jsPsych initialisation, on-finish behaviour, data properties, or redirect logic.
- `src/timeline.js` – compose the experiment timeline. Import trials/blocks from the loader’s `content` object (
- `src/content/*.js` – define each trial or block in its own file. Can also inclkude multiple trials/block within a single file based on the structure most applicable
- `assets/` – place images or other static files referenced by your trials.

### Working with the Augmentation Helper
- **Keep it** for rapid iteration—the template already covers the common compliance steps expected by ethics and recruitment platforms.
- **Customise it** by copying `augmentTimeline` (the implementation loads from `https://cdn.jsdelivr.net/gh/usyd-meta-lab/code/jsUtilities/getDocuments.js`) into a local file that is included *after* the CDN script. Your version will overwrite the global function, letting you add, remove, or reorder the extras.
- **Skip portions** inside your override by removing the blocks (e.g., drop the debug survey or change the fullscreen rules) before returning the final timeline.

## Parameter Reference (`src/parameters.js`)
| Parameter | Default | Purpose | When to change |
| --- | --- | --- | --- |
| `DataPipe_ID` | `"vmuVgxxOMTlT"` | Specifies the DataPipe pipeline for condition assignment and remote saving. | Replace with your own DataPipe project ID before releasing the study. |
| `window.DataPipe_ID` | Mirrors `DataPipe_ID` | Exposes the same ID globally so helper scripts can read it. | Leave as-is unless you rename the global. |
| `is_DEBUG` | `true` | Enables verbose logging, skips fullscreen, and shows the jsPsych data table instead of redirecting. | Set to `false` for pilot/production so participants see the real flow. |
| `task_time` | `30` | Estimated task length (minutes), interpolated into consent text and compensation notes. | Update when your study takes more or less time. |
| `in_lab` | `false` | Flags in-lab testing to suppress redirects and generate a random participant ID. | Set to `true` when running in a supervised setting without Prolific/SONA IDs. |
| `local_save` | `true` | Saves a CSV locally and skips remote uploads/redirects. | Switch to `false` when you are ready to push data to DataPipe/OSF. |
| `initalise_fullscreen` | `true` | Adds a fullscreen prompt at the start of the augmented timeline. | Set to `false` if fullscreen is unnecessary or clashes with your task. |
| `sona_experiment_id` | `"NA"` | SONA experiment identifier used for credit granting redirects. | Provide the real SONA experiment ID when recruiting via SONA. |
| `sona_credit_token` | `"NA"` | Token required by SONA to register participant credit. | Replace with your SONA credit token. |
| `Prolific_redirect` | `"CHGWKNI0"` | Completion code for successful Prolific participants. | Swap in the completion code from your Prolific study. |
| `Prolific_failed_check` | `"C13PIUOF"` | Prolific code for failed attention or exclusion cases. | Replace with the appropriate failure code or a custom return URL. |
| `accuracy_criterion` | `.55` | Threshold applied to summary-trial accuracy to decide success vs. failure redirect. | Adjust to match your exclusion rules or remove the check in `main.js`. |
| `conditionPromise` | `getCondition()` | Starts the asynchronous condition assignment request. | Typically leave alone; use `await conditionPromise` where you need the value. |
| `trialnum` | `1` | Initial trial counter that you can increment within custom trials. | Optional—reset or remove if you do not track trial numbers manually. |
| `blocknum` | `1` | Initial block counter for multi-block tasks. | Adjust only if your logic requires a different starting index. |

## Tips for Novice jsPsych Developers
- **Start with the examples** – open `src/content/welcome.js` and `src/content/hello_trial.js` to see the expected structure. Duplicate one of these files when adding new content.
- **Test in debug mode** – keep `is_DEBUG = true` while iterating so you can inspect data locally and skip redirects. Remember to turn it off before collecting real data.
- **Saving data** – with `local_save = true`, jsPsych downloads a CSV when the study ends. Set it to `false` alongside a valid `DataPipe_ID` once you want submissions stored remotely.
- **Recruitment redirects** – ensure the proper Prolific or SONA codes are in place before launch, or set `in_lab = true` to bypass them entirely.

## Further Resources
- [jsPsych Documentation](https://www.jspsych.org/)
- [USYD Meta Lab utilities](https://github.com/usyd-meta-lab/code/tree/main/jsUtilities) – reference implementations for `loadTrials`, `getCondition`, and `augmentTimeline`.
- [jsPsychPipe plugin](https://github.com/jspsych/jsPsych/tree/main/packages/plugin-pipe) – details on remote data storage via OSF/DataPipe.

Happy experimenting!
