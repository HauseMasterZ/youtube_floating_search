# YouTube Floating Search

A lightweight Chrome/Chromium extension that hides the YouTube header and replaces it with a minimal hover-reveal floating search bar.
<img width="1021" height="417" alt="image" src="https://github.com/user-attachments/assets/b5df26fa-1adc-4ab6-bd55-8aaa777f2f1c" />


## Features

- **Header-free YouTube** — reclaims the full screen for video content
- **Hover to reveal** — move your mouse to the top center of the screen to show the bar
- **Live search suggestions** — powered by YouTube's suggestion API
- **Keyboard navigation** — Arrow keys, Enter, Escape all work
- **Profile menu** — quick access to Switch account, Sign out, YouTube Studio, Settings, and Help
- **Auto avatar** — picks up your Google profile picture automatically
- **Acrylic blur** — frosted glass background matching Windows-style acrylic

## Installation

> Not published to the Chrome Web Store. Load manually as an unpacked extension.

1. [Download the latest release](../../releases/latest) and extract the zip
2. Open `chrome://extensions` (or `helium://extensions` on Helium browser)
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the extracted folder
5. Open YouTube — hover the top of the screen to use the search bar
test
## Usage

| Action | How |
|---|---|
| Show search bar | Move mouse to top center of screen |
| Search | Type and press **Enter** or click the search icon |
| Navigate suggestions | **↑ / ↓** arrow keys |
| Dismiss | Press **Escape** |
| YouTube home | Click the YT logo on the left |
| Profile menu | Click the person icon on the right |

## Permissions

| Permission | Reason |
|---|---|
| `https://www.youtube.com/*` | Inject the floating bar into YouTube pages |
| `https://suggestqueries.google.com/*` | Fetch live search suggestions |

No data is collected, stored, or transmitted beyond what is needed to display search suggestions.
