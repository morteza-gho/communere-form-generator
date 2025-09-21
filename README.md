# Communere Form Generator

A form generator built with **React**, **TypeScript**, and **Vite**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [File Structure](#file-structure)
- [Configuration](#configuration)
- [Linting & Formatting](#linting--formatting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Communere Form Generator** is a web-based application for creating and managing forms dynamically.  
It leverages **React** for UI, **TypeScript** for type safety, and **Vite** for a modern development experience.

---

## Features

- 🚀 Fast development with Vite  
- 📑 Dynamic form generation  
- ✅ Type-safe with TypeScript  
- 🎨 React-based UI components  
- 🛠 ESLint setup for clean code  

---

## Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v16 or newer recommended)  
- [pnpm](https://pnpm.io/) (or npm / yarn)  
- Git  

### Installation

```sh
git clone https://github.com/morteza-gho/communere-form-generator.git
cd communere-form-generator

# install dependencies
pnpm install
# or
npm install
```

### Running the Project

Start the development server:

```sh
pnpm run dev
# or
npm run dev
```

By default, the app runs on `http://localhost:5173/`.

---

## Development

- **React + TypeScript** project  
- **Vite** handles bundling and HMR  
- **ESLint** is configured in `eslint.config.js`  
- TypeScript configs are organized in:
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`

Run linting:

```sh
pnpm run lint
```

---

## Build & Deployment

To create a production build:

```sh
pnpm run build
# or
npm run build
```

The build output will be in the `dist/` folder.  
You can deploy this folder to any static hosting service (e.g., Vercel, Netlify, GitHub Pages, Nginx, etc.).

Preview the production build locally:

```sh
pnpm run preview
```

---

## File Structure

```
.
├── public/                # Static assets
├── src/                   # Source code
├── index.html             # Main HTML file
├── package.json           # Project metadata and scripts
├── pnpm-lock.yaml         # Lockfile (if pnpm used)
├── tsconfig.json          # Base TypeScript config
├── tsconfig.app.json      # App-specific TS config
├── tsconfig.node.json     # Node-specific TS config
├── vite.config.ts         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

---

## Configuration

- **TypeScript** → defined in `tsconfig.*.json`  
- **Vite** → configure in `vite.config.ts`  
- **Linting** → rules in `eslint.config.js`  

You can also add environment variables by creating a `.env` file. Example:

```
VITE_API_URL=https://api.example.com
```

---

## Linting & Formatting

Run lint checks:

```sh
pnpm run lint
```

It’s recommended to use an editor plugin for ESLint + Prettier for consistent formatting.

---

## Contributing

Contributions are welcome!  

1. Fork the repo  
2. Create a feature branch:  
   ```sh
   git checkout -b feature/my-feature
   ```
3. Commit your changes:  
   ```sh
   git commit -m "Add my feature"
   ```
4. Push to your fork and open a Pull Request  

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## Contact

For issues, feature requests, or questions:  
- Open an issue in the repo  
- Or reach out to **@morteza-gho**

---
