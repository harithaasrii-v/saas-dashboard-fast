# Operations Dashboard

A real-time operations monitoring dashboard built with the [FAST framework](https://www.fast.design/) and Vanilla JavaScript. No additional frameworks, no UI libraries — just Web Components, FAST, and a Vite build tool.

---

## Preview

| Light Mode                                                                        | Dark Mode                                                     |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| System overview with metric cards, service status, activity table, and alert list | Full dark theme with persistent preference via `localStorage` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/saas-dashboard-fast.git

# Navigate into the project
cd saas-dashboard-fast

# Install dependencies
npm install

# Start the development server
npm start
```

### Build for Production

```bash
npm run build
```

The production-ready output will be in the `dist/` folder.

---

## Project Structure

```
saas-dashboard-fast/
├── Components/
│   ├── Activity/
│   │   └── ActivityTable.js       # Paginated, sortable, filterable activity log
│   ├── Alert/
│   │   ├── AlertItem.js           # Individual alert card
│   │   └── AlertList.js           # Filterable list of alerts
│   ├── AppShell/
│   │   └── AppShell.js            # Root layout — sidebar, header, theme, routing
│   ├── DashboardCards/
│   │   └── MetricCard.js          # KPI metric display card
│   ├── Modal/
│   │   └── AppModal.js            # Service detail modal dialog
│   ├── Notification/
│   │   ├── ToastContainer.js      # Fixed-position toast host
│   │   └── ToastMessage.js        # Individual toast notification
│   └── Services/
│       └── ServiceStatus.js       # Service health cards grid
├── Data/
│   ├── activity.json              # Activity log records
│   ├── alerts.json                # Alert records
│   └── services.json              # Service health records
├── index.html                     # App entry point
├── main.js                        # Data loading and event wiring
├── package.json
└── package-lock.json
```

---

## Components

### `<app-shell>`

The root layout component. Wraps all content and provides:

- Sidebar navigation with hash-based routing (`#home`, `#alerts`, `#activity`)
- Header with section title and theme toggle
- Global CSS custom properties (`--shell-*`) inherited by all child components
- Theme persistence via `localStorage` and `prefers-color-scheme` detection

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `"light"` | Active theme — `"light"` or `"dark"` |

**Events Emitted**
| Event | Detail | Description |
|---|---|---|
| `theme-changed` | `{ theme }` | Fired when theme is toggled |
| `section-selected` | `{ section }` | Fired when nav link is clicked |
| `show-toast` | `{ title, message, type }` | Fired to trigger a toast notification |

---

### `<metric-card>`

Displays a single KPI metric with title, value, trend, and optional status badge.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `card-title` | `string` | `"Metric"` | Card heading label |
| `value` | `string` | `"—"` | Primary metric value |
| `trend` | `string` | `"—"` | Trend description text |
| `status` | `string` | `"unknown"` | Status badge — `"warning"`, `"critical"` |
| `theme` | `string` | `"light"` | Active theme |

**Properties**
| Property | Type | Description |
|---|---|---|
| `data` | `object` | Set metric data as an object `{ title, value, trend, status }` |

---

### `<service-status>`

Displays a responsive grid of service health cards. Each card shows uptime, response time, and last incident.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `"light"` | Active theme |
| `status` | `string` | `null` | Filter by status — `"operational"`, `"degraded"`, `"down"` |

**Properties**
| Property | Type | Description |
|---|---|---|
| `data` | `array` | Set services array directly |

**Events Emitted**
| Event | Detail | Description |
|---|---|---|
| `service-selected` | `service object` | Fired when a service card is clicked |

---

### `<activity-table>`

A fully featured activity log table with sorting, filtering, and pagination.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `"light"` | Active theme |
| `page-size` | `number` | `5` | Number of rows per page |

**Properties**
| Property | Type | Description |
|---|---|---|
| `data` | `array` | Set activity records directly |
| `filterText` | `string` | Current filter/search text |
| `currentPage` | `number` | Current active page |
| `sortKey` | `string` | Current sort column |
| `sortDirection` | `string` | `"ascending"` or `"descending"` |

**Events Emitted**
| Event | Detail | Description |
|---|---|---|
| `activity-selected` | `activity object` | Fired when a row is clicked |

---

### `<alert-list>`

A filterable list of alert cards with severity filter buttons.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `filter` | `string` | `"all"` | Active filter — `"all"`, `"info"`, `"warning"`, `"critical"` |
| `theme` | `string` | `"light"` | Active theme |

**Properties**
| Property | Type | Description |
|---|---|---|
| `data` | `array` | Set alerts array directly |

---

### `<alert-item>`

An individual alert card displaying severity, title, message, service, status, and timestamp.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `alert-id` | `string` | — | Unique alert identifier |
| `alert-title` | `string` | — | Alert title |
| `severity` | `string` | `"info"` | Severity level — `"info"`, `"warning"`, `"critical"` |
| `message` | `string` | — | Alert message body |
| `service` | `string` | — | Associated service name |
| `status` | `string` | `"unknown"` | Alert status |
| `timestamp` | `string` | — | ISO timestamp string |
| `theme` | `string` | `"light"` | Active theme |

**Events Emitted**
| Event | Detail | Description |
|---|---|---|
| `alert-selected` | `alert object` | Fired when alert card is clicked or activated via keyboard |

---

### `<app-modal>`

A dialog modal for displaying detailed service information.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `"light"` | Active theme |

**Properties**
| Property | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Whether the modal is currently open |
| `serviceTitle` | `string` | Modal heading — defaults to `"Service Details"` |
| `serviceData` | `object` | Service data object to display |

**Events Listened**
| Event | Description |
|---|---|
| `service-selected` (window) | Opens modal with selected service data |
| `keydown` Escape (window) | Closes modal when open |

**Events Emitted**
| Event | Description |
|---|---|
| `modal-closed` | Fired when modal is closed |

---

### `<toast-container>`

A fixed-position container that hosts toast notification messages.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `position` | `string` | `"top-right"` | Toast position on screen |
| `theme` | `string` | `"light"` | Active theme |

**Events Listened**
| Event | Description |
|---|---|
| `show-toast` (window) | Creates and displays a new toast message |

---

### `<toast-message>`

An individual toast notification with auto-dismiss and close button.

**Attributes**
| Attribute | Type | Default | Description |
|---|---|---|---|
| `toast-title` | `string` | `"Notification"` | Toast heading |
| `message` | `string` | — | Toast body text |
| `type` | `string` | `"info"` | Toast type — `"info"`, `"warning"`, `"error"` |
| `duration` | `number` | `5000` | Auto-dismiss duration in milliseconds |
| `theme` | `string` | `"light"` | Active theme |

**Events Emitted**
| Event | Detail | Description |
|---|---|---|
| `toast-closed` | `toast data object` | Fired when toast is dismissed |

---

## Theming

The dashboard supports **light and dark modes** with automatic detection and persistence.

### How It Works

1. On load, `AppShell` reads from `localStorage` first, then falls back to `prefers-color-scheme`
2. Toggling the theme button updates `localStorage` and propagates the `theme` attribute to all child components
3. `AppShell` defines global CSS custom properties (`--shell-*`) that all child components inherit

### Global CSS Custom Properties

| Variable             | Light     | Dark      | Description           |
| -------------------- | --------- | --------- | --------------------- |
| `--shell-ink`        | `#18303a` | `#edf5f6` | Primary text color    |
| `--shell-surface`    | `#ffffff` | `#1c2b31` | Card/panel background |
| `--shell-border`     | `#d9e2e8` | `#38505a` | Border color          |
| `--shell-background` | `#f3f6f7` | `#102026` | Page background       |
| `--shell-accent`     | `#153b4a` | `#08171c` | Brand/accent color    |
| `--shell-muted`      | `#63747d` | `#aec1c8` | Secondary/muted text  |

---

## Event Flow

```
User clicks service card
        ↓
ServiceStatus.$emit("service-selected", service)
        ↓
main.js listens → passes data to AppModal
        ↓
AppModal opens with service details

User toggles theme
        ↓
AppShell.toggleTheme()
        ↓
localStorage.setItem("theme", value)
        ↓
AppShell.$emit("theme-changed")
        ↓
AppShell.applyTheme() → propagates to all child components
        ↓
AppShell.$emit("show-toast") → ToastContainer shows notification

User types in activity filter
        ↓
ActivityTable.onFilterInput()
        ↓
ActivityTable.refresh() → re-renders filtered, paginated results
```

---

## Accessibility

- All interactive elements are keyboard accessible (`Enter` / `Space` to activate)
- Navigation uses `aria-current="page"` for active link
- Sort buttons use `aria-sort` on column headers
- Modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Modal focuses close button on open
- Toast container uses `aria-live="polite"` for screen reader announcements
- Filter buttons use `aria-pressed` for toggle state
- Activity rows use `tabindex="0"` with keyboard event handlers
- Supports `prefers-reduced-motion` for animations

---

## Tech Stack

| Technology                               | Purpose                   |
| ---------------------------------------- | ------------------------- |
| [FAST Element](https://www.fast.design/) | Web Components framework  |
| [Vite](https://vitejs.dev/)              | Build tool and dev server |
| Vanilla JavaScript                       | Component logic           |
| CSS Custom Properties                    | Theming system            |
| JSON                                     | Static data source        |

---

## Data Structure

### `activity.json`

```json
[
  {
    "id": "1",
    "user": "Maya Chen",
    "action": "Viewed audit log",
    "resource": "Security Audit",
    "status": "success",
    "ipAddress": "198.51.100.105",
    "timestamp": "2026-08-14T14:34:00Z"
  }
]
```

### `alerts.json`

```json
[
  {
    "id": "a1",
    "title": "High CPU Usage",
    "severity": "critical",
    "message": "CPU usage exceeded 95% threshold",
    "service": "api",
    "status": "open",
    "timestamp": "2026-08-14T13:00:00Z"
  }
]
```

### `services.json`

```json
[
  {
    "id": "api",
    "name": "API Gateway",
    "status": "operational",
    "uptime": 99.9,
    "responseTimeMs": 142,
    "lastIncident": "2026-07-01T00:00:00Z",
    "description": "Primary API gateway handling all client requests."
  }
]
```

---

## Development Notes

- The `dist/` folder is auto-generated by Vite on `npm run build` — do not edit manually
- All components use `Observable.defineProperty` for reactive properties (Vanilla JS — no decorators)
- Theme is propagated from `AppShell` to all child components via `setAttribute("theme", value)`
- Data loading happens in `main.js` via `Promise.all` for parallel fetches
- Each component is self-contained with its own template, styles, and logic

---
