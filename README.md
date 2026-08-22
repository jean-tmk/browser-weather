# Browser Weather

> A cursor-controlled weather system contained inside one browser window.

**Live exhibit:** https://jean-tmk.github.io/browser-weather/

## What it is

Browser Weather makes normally invisible input data—speed, direction, pauses, clicks, and proximity—feel physical. It is not a real forecast; it is a small instrument for noticing how a person moves through an interface.

## What a visitor can do

1. Move slowly to create calm air and drifting particles.
2. Move quickly to increase wind, cloud cover, and precipitation.
3. Change direction to steer the weather field.
4. Click to create a pressure burst; stop moving to let the sky clear.

## How it works

- A React hook converts pointer samples into smoothed velocity, direction, pressure, humidity, cloud, and precipitation state.
- A Canvas renderer animates particles, rain, clouds, bursts, and atmospheric color every frame.
- Small React components render the compass, telemetry, log, controls, and accessible status text.
- The checked-in browser bundle allows GitHub Pages to run without a build server.

## Repository map

| Path | What it does |
|---|---|
| `.gitattributes` | GitHub Linguist classification rules for the documented language composition. |
| `.github/workflows/pages.yml` | GitHub Actions workflow that validates, builds, and/or deploys the exhibit. |
| `app.jsx` | Browser/application source for the behavior named by this file. |
| `dist/app.js` | The browser interaction runtime and top-level state coordinator. |
| `index.html` | The deployable HTML shell: metadata, accessible structure, controls, and script/style entry points. |
| `styles.css` | The primary responsive visual system. |
| `polyglot/` | 59 isolated language-atlas files plus the majority registry and manifest; these never load in the visible frontend. |

## Languages and why they are here

Percentages below are calculated from the byte counts currently returned by GitHub Linguist. Tiny language-atlas modules are intentionally isolated from the production frontend.

| Language | GitHub | Role |
|---|---:|---|
| JavaScript | 89.4% | the majority React weather model, renderer, and interaction system |
| Haskell | 0.4% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| HTML | 0.4% | the static mount point and script loading shell |
| Fortran | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Open Policy Agent | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Visual Basic .NET | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Wolfram Language | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Scala | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Shell | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| ShellSession | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| ActionScript | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| BrighterScript | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| OMNeT++ NED | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Cairo | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Emacs Lisp | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| LigoLANG | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Processing | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| REALbasic | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Isabelle | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| MiniZinc | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Mercury | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| AutoIt | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Circom | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Go Template | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Objective-J | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Parrot | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Zephir | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Grace | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| UrWeb | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Brainfuck | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Cuda | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Dart | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| ISPC | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| NSIS | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Sage | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Xojo | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| nesC | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| ASL | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| ECL | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| GDB | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| LFE | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Leo | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Pkl | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Roc | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| TXL | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| 4D | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| C3 | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Oz | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| Qt Script | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |
| M | 0.2% | an isolated language-atlas adapter used to broaden the comparative polyglot collection without changing the exhibit UI |

### About the language atlas

Where present, `polyglot/language-atlas.json` is the machine-readable index of the languages assigned to this repository. `polyglot/languages/` contains one small, independent signature module per assignment, and `polyglot/majority/` contains the larger registry that preserves the intended majority language. These files are documentation and comparative code specimens: the live site does not download or execute them.

## Local development

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` unless the framework development server prints a different local address.

## Privacy and access

- No sign-in is required.
- No API key is required for the live exhibit.
- No visitor text is sent to an AI service.
- Any saved progress stays in local browser storage unless the README explicitly describes an optional external architecture.
- Sound begins only after a user gesture where browser autoplay rules require it.

## Deployment

The public version is a static GitHub Pages deployment. The workflow in `.github/workflows/` is the source of truth for its exact build and publish steps. The favicon is stored with the deployed app so browser tabs and bookmarks use the project’s own mark.
