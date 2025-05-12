
# 🧠 USYD Meta Lab – jsPsych Experiment Template

This is a customizable experiment template for running browser-based behavioral studies using [jsPsych](https://www.jspsych.org/) (v8.2.1), developed by the [USYD Meta Lab](https://usyd-meta-lab.github.io). It supports integration with Prolific and SONA, automatic condition assignment via DataPipe, and data saving via the jsPsychPipe plugin.

## 🚀 Features

- Full jsPsych v8.2.1 setup with essential plugins
- Browser and fullscreen compliance checks
- Participant info collection and consent
- Prolific and SONA redirect handling
- Condition assignment and data saving via DataPipe
- Modular structure for tasks, surveys, and global settings
- Clean separation of logic across `global.js`, `experiment.js`, and `survey.js`

---

## 📁 File Structure

```
index.html               # Main HTML entry point (loads all scripts)
assets/
  └── js/
      ├── global.js      # Initializes jsPsych, handles fullscreen, redirects, etc.
      ├── experiment.js  # Defines main task trials
      └── survey.js      # Placeholder for survey blocks
  └── css/
      └── custom-css.css # Optional styling (edit to match your study)
```

---

## 🔧 Setup Instructions

1. **Clone the repository** or use it as a GitHub template:
   ```bash
   git clone https://github.com/usyd-meta-lab/jspsych-template.git
   ```

2. **Edit global settings** in `index.html`:
   - Set your `DataPipe_ID`, Prolific codes, and SONA tokens.
   - Define `accuracy_criterion` and `task_time` as appropriate.

3. **Customize experiment logic**:
   - Edit `experiment.js` to define your trial structure.
   - Edit `survey.js` to define post-task surveys or additional questions.
   - Modify `condition_1_timeline` in `index.html` to structure the experiment.

4. **Host your study** using GitHub Pages or another static file server:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

---

## 📊 Data Management

- **Saving**: Data is saved via `jsPsychPipe` using the experiment ID defined in `DataPipe_ID`.
- **Redirects**: Redirects are handled conditionally based on Prolific or SONA participation.
- **Accuracy Checks**: If the average accuracy on "Summary Trial" is below threshold, participants are redirected to a failure page.

---

## 🔌 Dependencies

- jsPsych 8.2.1 core and official plugins
- jsPsychPipe (for saving to OSF/DataPipe)
- jQuery, Foundation (for styling and UI)
- Custom plugin support included

---

## 🧪 Example Trial

```js
const hello_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 'Hello world!'
};
```

To add more trials, blocks, and survey components, edit `experiment.js` and `survey.js`.

---

## 🙋 Support & Contributions

- Maintained by the [USYD Meta Lab](https://github.com/usyd-meta-lab)
- Issues, pull requests, and forks are welcome.
- For questions, contact the PI or lead developer.

---

## 📝 License

This template is open-source under the [MIT License](LICENSE).
