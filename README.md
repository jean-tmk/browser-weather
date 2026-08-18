# Browser Weather

A browser-sized atmospheric instrument built in React. Cursor direction creates wind, cursor velocity controls precipitation and storm intensity, clicking creates pressure events, and inactivity clears the sky.

## Source composition

The interactive system is intentionally React-first. `app.jsx` contains the weather physics, canvas renderer, state machine, telemetry, event log, controls, and interface components. HTML and CSS provide the hosting shell and visual system.

## Run

Open `index.html` through a local web server, or visit the GitHub Pages deployment.
