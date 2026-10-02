# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Create React App (react-scripts 5) project, JavaScript only, npm.

- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — Jest watch mode; single test: `npm test -- App.test.js` (add `--watchAll=false` for one-off runs)

There is no separate lint script; ESLint runs through CRA (`react-app` config).

## Environment

`.env` (gitignored) must define:
- `REACT_APP_PROD_ULR_TO_BACK` — backend base URL used by `src/helpers/request.js` (note the `ULR` typo is the real variable name)
- `REACT_APP_IMAGE_SOURCE` — base URL for post images (used in `blog-item`)
## Architecture

Admin panel for the Mawex site's blog posts ("Administracja strony Mawex"). UI strings and messages are in Polish.

- **Entry**: `src/index.js` wraps `App` in Redux `Provider` + `BrowserRouter`. `App` renders `Header`, a single route `/` → `LoginPage`, plus global `TaskInfo` (toast) and `Spinner`.
- **Auth gating is not done by routes.** `LoginPage` shows the login form when there is neither `store.session` nor `store.user`, otherwise renders `StartPage` (the post list). `Header` shows logout / "add post" buttons by the same condition and dispatches `sessionItemCheck()` on mount to restore the session id from `window.sessionStorage` (key `adminMawexSite`, see `helpers/sessionStoregeOptions.js`).
  - **This gating is client-side only and not real protection.** There is a single route (`/`); `StartPage` has no route of its own. Any value under the `adminMawexSite` sessionStorage key shows the admin UI and it is never verified. Actual security relies on the backend rejecting unauthenticated requests (cookie auth, `withCredentials: true`) — that was not checked from this repo. There is also no 401 handling: after the cookie expires the UI stays visible and requests fail with an error toast instead of redirecting to login.
- **State**: Redux (legacy `createStore` + `redux-thunk`), reducers combined in `src/data/root-reducers.js`. Each slice lives in `src/data/<slice>/` with `*.actions.js`, `*.reducer.js` and an `index.js` that re-exports the public API — import from the slice folder, not the files. Slices: `session`, `user`, `spinner`, `tasks`, `blogItems`, `photoItem`.
- **API pattern**: thunks in `*.actions.js` use the shared axios instance (`helpers/request.js`, `validateStatus: false` so errors do not throw). Every thunk follows the same shape: `addSpinner()` → request → branch on `status` → `removeSpinner()` → dispatch result, or `timeoutShowTask(data.message || data.error)` to show an error toast (auto-closes after 3s). Authenticated calls pass `withCredentials: true` (cookie-based auth with the backend). Check status codes per endpoint (e.g. 201 on create, 202 on edit).
- **Image upload flow**: `addPhotoFile` posts multipart to `posts/upload` and stores the returned filename in `photoItem`; `addMainInfoItem` then creates the post and `clearPhotoFile` resets it.
- **Components**: `src/components/<name>/` with `<name>.component.jsx`, `<name>.module.scss`, `index.js`; all re-exported from `components/index.js`. Routes/pages follow the same layout under `src/routes/`. Note the barrel imports are circular-ish (e.g. `Header` imports from `../index`), so keep imports consistent with the existing style.
- **Styling**: SCSS modules (`*.module.scss`) with `bem-css-modules` available; shared tokens/mixins in `src/global-styles/` (`variables.scss`, `mixins.scss`).
