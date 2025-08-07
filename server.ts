import { join } from "jsr:@std/path";

const PORT = 8000;
const BASE_URL = `http://${Deno.hostname()}:${PORT}`;
const PROJECT_ROOT = Deno.cwd();

interface FileType {
  extensions: string[];
  icon: string;
  language: string;
  description: string;
}

const FILE_TYPES: Record<string, FileType> = {
  typescript: {
    extensions: [".ts"],
    icon: "📄",
    language: "TypeScript",
    description: "TypeScript module",
  },
  markdown: {
    extensions: [".md"],
    icon: "📖",
    language: "Markdown",
    description: "Documentation file",
  },
  json: {
    extensions: [".json"],
    icon: "📋",
    language: "JSON",
    description: "Configuration file",
  },
  text: {
    extensions: [".txt", ".log"],
    icon: "📄",
    language: "Text",
    description: "Text file",
  },
};

interface FileInfo {
  name: string;
  relativePath: string;
  type: FileType;
  description?: string;
  exports?: string[];
  imports?: string[];
}

interface DirectoryInfo {
  name: string;
  files: FileInfo[];
  icon: string;
  description?: string;
}

interface ProjectStructure {
  name: string;
  description: string;
  version: string;
  rootFiles: FileInfo[];
  directories: DirectoryInfo[];
}

const CSS_STYLES = `
@media (prefers-color-scheme: dark) {
  :root {
    --color-rosewater: #f5e0dc;
    --color-flamingo: #f2cdcd;
    --color-pink: #f5c2e7;
    --color-mauve: #cba6f7;
    --color-red: #f38ba8;
    --color-maroon: #eba0ac;
    --color-peach: #fab387;
    --color-yellow: #f9e2af;
    --color-green: #a6e3a1;
    --color-teal: #94e2d5;
    --color-sky: #89dceb;
    --color-sapphire: #74c7ec;
    --color-blue: #89b4fa;
    --color-lavender: #b4befe;
    --color-text: #cdd6f4;
    --color-subtext1: #bac2de;
    --color-subtext0: #a6adc8;
    --color-overlay2: #9399b2;
    --color-overlay1: #7f849c;
    --color-overlay0: #6c7086;
    --color-surface2: #585b70;
    --color-surface1: #45475a;
    --color-surface0: #313244;
    --color-base: #1e1e2e;
    --color-mantle: #181825;
    --color-crust: #11111b;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --color-rosewater: #dc8a78;
    --color-flamingo: #dd7878;
    --color-pink: #ea76cb;
    --color-mauve: #8839ef;
    --color-red: #d20f39;
    --color-maroon: #e64553;
    --color-peach: #fe640b;
    --color-yellow: #df8e1d;
    --color-green: #40a02b;
    --color-teal: #179299;
    --color-sky: #04a5e5;
    --color-sapphire: #209fb5;
    --color-blue: #1e66f5;
    --color-lavender: #7287fd;
    --color-text: #4c4f69;
    --color-subtext1: #5c5f77;
    --color-subtext0: #6c6f85;
    --color-overlay2: #7c7f93;
    --color-overlay1: #8c8fa1;
    --color-overlay0: #9ca0b0;
    --color-surface2: #acb0be;
    --color-surface1: #bcc0cc;
    --color-surface0: #ccd0da;
    --color-base: #eff1f5;
    --color-mantle: #e6e9ef;
    --color-crust: #dce0e8;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-base);
  color: var(--color-text);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Navigation */
.navbar {
  background: var(--color-mantle);
  border-bottom: 1px solid var(--color-surface0);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-blue);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--color-subtext1);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-links a:hover {
  color: var(--color-text);
  background: var(--color-surface0);
}

/* Mobile menu */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 4px;
}

.mobile-menu-toggle span {
  width: 20px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.mobile-overlay.active {
  display: block;
}

/* Hero section */
.hero {
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-blue), var(--color-mauve));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
  color: var(--color-subtext1);
  max-width: 600px;
  margin: 0 auto;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-blue), var(--color-mauve));
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(137, 180, 250, 0.3);
}

/* Module grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.module-card {
  background: var(--color-mantle);
  border: 1px solid var(--color-surface0);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-blue), var(--color-mauve), var(--color-pink));
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--color-surface1);
}

.module-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.module-card p {
  color: var(--color-subtext1);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.module-links {
  display: flex;
  gap: 1rem;
}

.module-link {
  padding: 0.5rem 1rem;
  background: var(--color-surface0);
  color: var(--color-text);
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.module-link:hover {
  background: var(--color-surface1);
  color: var(--color-blue);
}

/* File browser */
.file-browser {
  background: var(--color-mantle);
  border: 1px solid var(--color-surface0);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 3rem;
}

.file-browser-header {
  background: var(--color-surface0);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.file-browser-title {
  color: var(--color-text);
}

.file-list {
  list-style: none;
}

.file-item {
  border-bottom: 1px solid var(--color-surface0);
}

.file-item:last-child {
  border-bottom: none;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.2s ease;
}

.file-link:hover {
  background: var(--color-surface0);
}

.file-icon {
  font-size: 1.25rem;
  width: 1.5rem;
  text-align: center;
}

.file-meta {
  margin-left: auto;
  color: var(--color-subtext0);
  font-size: 0.875rem;
}

/* Code containers */
.code-container {
  background: var(--color-mantle);
  border: 1px solid var(--color-surface0);
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5rem 0;
}

.code-header {
  background: var(--color-surface0);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.code-lang {
  color: var(--color-blue);
  font-weight: 600;
}

.code-filename {
  color: var(--color-subtext1);
}

.copy-button {
  background: var(--color-blue);
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.copy-button:hover {
  background: var(--color-sapphire);
}

pre {
  padding: 1.5rem;
  overflow-x: auto;
  background: var(--color-crust);
  color: var(--color-text);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
}

code {
  font-family: inherit;
}

/* Syntax highlighting */
.keyword { color: var(--color-mauve); font-weight: 600; }
.string { color: var(--color-green); }
.comment { color: var(--color-overlay0); font-style: italic; }
.number { color: var(--color-peach); }
.function { color: var(--color-blue); }

/* Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem;
  color: var(--color-subtext1);
  margin-top: 4rem;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 1rem;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--color-mantle);
    border-left: 1px solid var(--color-surface0);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 6rem 0 2rem 0;
    gap: 0;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
  }
  
  .nav-links.active {
    right: 0;
  }
  
  .nav-links li {
    margin: 0;
  }
  
  .nav-links a {
    display: block;
    padding: 1rem 2rem;
    border-radius: 0;
    border-bottom: 1px solid var(--color-surface0);
    font-size: 1rem;
    font-weight: 500;
  }
  
  .nav-links a:hover {
    background: var(--color-surface0);
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .module-links {
    flex-direction: column;
  }
}
`;

function extractTSDocumentation(
  content: string,
): { description?: string; exports: string[]; imports: string[]; } {
  const exports: string[] = [];
  const imports: string[] = [];
  let description: string | undefined;

  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
  if (jsdocMatch) {
    const jsdoc = jsdocMatch[0];
    const descMatch = jsdoc.match(/@description\s+(.+?)(?:\n|\*\/)/);
    if (descMatch) {
      description = descMatch[1].trim();
    }
  }

  const exportMatches = content.matchAll(
    /export\s+(?:(?:default|const|let|var|function|class|interface|type|enum)\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
  );
  for (const match of exportMatches) {
    if (match[1] && !exports.includes(match[1])) {
      exports.push(match[1]);
    }
  }

  const importMatches = content.matchAll(
    /import\s+(?:\{([^}]+)\}|([a-zA-Z_$][a-zA-Z0-9_$]*))?\s*from\s+["']([^"']+)["']/g,
  );
  for (const match of importMatches) {
    if (match[1]) {
      const namedImports = match[1].split(",").map((imp) => imp.trim());
      imports.push(...namedImports);
    } else if (match[2]) {
      imports.push(match[2]);
    }
  }

  return {
    description,
    exports: [...new Set(exports)],
    imports: [...new Set(imports)],
  };
}

// Determine file type from extension
function getFileType(filename: string): FileType {
  const ext = filename.toLowerCase().split(".").pop() || "";
  for (const [, fileType] of Object.entries(FILE_TYPES)) {
    if (fileType.extensions.includes("." + ext)) {
      return fileType;
    }
  }
  return FILE_TYPES.text;
}

async function analyzeProject(): Promise<ProjectStructure> {
  const structure: ProjectStructure = {
    name: "Andromeda Standard Library",
    description:
      "A modern, type-safe standard library for Deno. Featuring collections, math utilities, data validation, and more.",
    version: "1.0.0",
    rootFiles: [],
    directories: [],
  };

  try {
    for await (const entry of Deno.readDir(PROJECT_ROOT)) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") {
        continue;
      }

      const fullPath = join(PROJECT_ROOT, entry.name);

      if (entry.isFile) {
        const fileType = getFileType(entry.name);
        const fileInfo: FileInfo = {
          name: entry.name,
          relativePath: entry.name,
          type: fileType,
        };

        if (fileType.language === "TypeScript") {
          try {
            const content = await Deno.readTextFile(fullPath);
            const tsDoc = extractTSDocumentation(content);
            fileInfo.description = tsDoc.description;
            fileInfo.exports = tsDoc.exports;
            fileInfo.imports = tsDoc.imports;
          } catch {
            // Ignore read errors
          }
        }

        structure.rootFiles.push(fileInfo);
      } else if (entry.isDirectory) {
        const dirInfo: DirectoryInfo = {
          name: entry.name,
          files: [],
          icon: "📁",
        };

        try {
          for await (const file of Deno.readDir(fullPath)) {
            if (file.isFile && !file.name.startsWith(".")) {
              const fileType = getFileType(file.name);
              const fileInfo: FileInfo = {
                name: file.name,
                relativePath: `${entry.name}/${file.name}`,
                type: fileType,
              };

              if (fileType.language === "TypeScript") {
                try {
                  const content = await Deno.readTextFile(
                    join(fullPath, file.name),
                  );
                  const tsDoc = extractTSDocumentation(
                    content,
                  );
                  fileInfo.description = tsDoc.description;
                  fileInfo.exports = tsDoc.exports;
                  fileInfo.imports = tsDoc.imports;
                } catch {
                  // Ignore read errors
                }
              }

              dirInfo.files.push(fileInfo);
            }
          }

          structure.directories.push(dirInfo);
        } catch {
          // Ignore read errors for directories
        }
      }
    }
  } catch (error) {
    console.error("Error analyzing project:", error);
  }

  return structure;
}

let projectStructure: ProjectStructure | null = null;
let lastAnalyzed = 0;
const CACHE_DURATION = 30000;

async function getProjectStructure(): Promise<ProjectStructure> {
  const now = Date.now();
  if (!projectStructure || (now - lastAnalyzed) > CACHE_DURATION) {
    projectStructure = await analyzeProject();
    lastAnalyzed = now;
  }
  return projectStructure;
}

function generateNavLinks(structure: ProjectStructure): string {
  const mainDirs = structure.directories.filter((dir) =>
    !dir.name.startsWith(".") &&
    dir.files.some((f) => f.name.endsWith(".ts"))
  );

  let navItems = '<li><a href="/">Home</a></li>';

  for (const dir of mainDirs) {
    const modFile = dir.files.find((f) => f.name === "mod.ts");
    if (modFile) {
      navItems += `<li><a href="/${modFile.relativePath}">${
        dir.name.charAt(0).toUpperCase() + dir.name.slice(1)
      }</a></li>`;
    }
  }

  const mainMod = structure.rootFiles.find((f) => f.name === "mod.ts");
  if (mainMod) {
    navItems += `<li><a href="/${mainMod.relativePath}">Main Module</a></li>`;
  }

  return navItems;
}

function generateModuleCards(structure: ProjectStructure): string {
  const mainDirs = structure.directories.filter((dir) =>
    !dir.name.startsWith(".") &&
    dir.files.some((f) => f.name.endsWith(".ts"))
  );

  let cards = "";

  for (const dir of mainDirs) {
    const modFile = dir.files.find((f) => f.name === "mod.ts");
    if (!modFile) continue;

    const description = dir.description ||
      modFile.description ||
      `${
        dir.name.charAt(0).toUpperCase() + dir.name.slice(1)
      } module utilities and functions.`;

    const exportCount = modFile.exports?.length || 0;
    const fileCount = dir.files.filter((f) => f.name.endsWith(".ts")).length;

    cards += `
            <div class="module-card fade-in-up">
                <h3>${dir.icon} ${
      dir.name.charAt(0).toUpperCase() + dir.name.slice(1)
    }</h3>
                <p>${description}</p>
                <div style="margin: 1rem 0; display: flex; gap: 1rem; font-size: 0.875rem; color: var(--color-subtext0);">
                    <span>📦 ${exportCount} exports</span>
                    <span>📄 ${fileCount} files</span>
                </div>
                <div class="module-links">
                    <a href="/${modFile.relativePath}" class="module-link">View Module</a>
                    <a href="${BASE_URL}/${modFile.relativePath}" class="module-link">Import URL</a>
                </div>
            </div>`;
  }

  return cards;
}

function generateFileList(structure: ProjectStructure): string {
  let fileList = "";

  for (const file of structure.rootFiles) {
    if (file.name.startsWith(".")) continue;

    fileList += `
                <li class="file-item">
                    <a href="/${file.relativePath}" class="file-link">
                        <span class="file-icon">${file.type.icon}</span>
                        <span>${file.name}</span>
                        <span class="file-meta">${
      file.description || file.type.description
    }</span>
                    </a>
                </li>`;
  }

  for (const dir of structure.directories) {
    if (dir.name.startsWith(".")) continue;

    for (const file of dir.files) {
      if (file.name.startsWith(".")) continue;

      fileList += `
                <li class="file-item">
                    <a href="/${file.relativePath}" class="file-link">
                        <span class="file-icon">${file.type.icon}</span>
                        <span>${file.relativePath}</span>
                        <span class="file-meta">${
        file.description || file.type.description
      }</span>
                    </a>
                </li>`;
    }
  }

  return fileList;
}

async function generateMainPage(): Promise<string> {
  const structure = await getProjectStructure();

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${structure.name}</title>
    <style>${CSS_STYLES}</style>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-content">
            <a href="/" class="logo">
                <span>📚</span>
                ${structure.name}
            </a>
            <ul class="nav-links" id="navLinks">
                ${generateNavLinks(structure)}
            </ul>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        <div class="mobile-overlay" id="mobileOverlay" onclick="closeMobileMenu()"></div>
    </nav>

    <div class="container">
        <section class="hero fade-in-up">
            <h1>${structure.name}</h1>
            <p>${structure.description}</p>
            <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; font-size: 0.875rem; color: var(--color-subtext0);">
                <span>📁 ${structure.directories.length} directories</span>
                <span>📄 ${
    structure.rootFiles.length + structure.directories.reduce((acc, dir) =>
      acc + dir.files.length, 0)
  } files</span>
                <span>🏷️ v${structure.version}</span>
            </div>
            <a href="/mod.ts" class="cta-button" style="margin-top: 2rem;">Explore Main Module</a>
        </section>

        <section class="modules-grid">
            ${generateModuleCards(structure)}
        </section>

        <section class="file-browser fade-in-up">
            <div class="file-browser-header">
                <span>📁</span>
                <span class="file-browser-title">Browse Files</span>
            </div>
            <ul class="file-list">
                ${generateFileList(structure)}
            </ul>
        </section>

        <section class="fade-in-up">
            <h2 style="margin-bottom: 1rem; font-size: 1.75rem; font-weight: 600;">Quick Start</h2>
            <div class="code-container">
                <div class="code-header">
                    <span class="code-lang">TypeScript</span>
                    <span class="code-filename">example.ts</span>
                    <button class="copy-button" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>
import { ${
    structure.rootFiles.find((f) => f.name === "mod.ts")?.exports?.slice(
      0,
      4,
    ).join(", ") || "functions"
  } } from "${BASE_URL}/mod.ts";

console.log('Ready to use ${structure.name}!');</code></pre>
            </div>
        </section>
    </div>

    <footer class="footer">
        <p>&copy; 2025 ${structure.name}. Open source library.</p>
    </footer>

    <script>
        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const mobileOverlay = document.getElementById('mobileOverlay');
            
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        function closeMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const mobileOverlay = document.getElementById('mobileOverlay');
            
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            });
        });

        function copyCode(button) {
            const code = button.closest('.code-container').querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        });

        document.querySelectorAll('.module-card, .file-browser').forEach((el) => {
            observer.observe(el);
        });
    </script>
</body>
</html>`;
}

function generateFilePage(filePath: string, content: string): string {
  const fileName = filePath.split("/").pop() || filePath;
  const fileExtension = fileName.split(".").pop() || "";
  const language = fileExtension === "ts" ?
    "TypeScript" :
    fileExtension === "md" ?
    "Markdown" :
    "Text";

  let highlightedContent = content;
  if (fileExtension === "ts") {
    // Highlight comments first
    highlightedContent = highlightedContent
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
    // Highlight strings (avoid inside comments)
    highlightedContent = highlightedContent
      .replace(/"([^"\n]*)"/g, '<span class="string">"$1"</span>');
    // Highlight keywords (avoid inside tags)
    highlightedContent = highlightedContent
      .replace(/(?<![>])\b(export|import|class|function|const|let|var|if|else|for|while|return|interface|type|enum)\b/g, '<span class="keyword">$1</span>');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName} - Andromeda Standard Library</title>
    <style>${CSS_STYLES}</style>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-content">
            <a href="/" class="logo">
                Andromeda Std
            </a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        <div class="mobile-overlay" id="mobileOverlay" onclick="closeMobileMenu()"></div>
    </nav>

    <div class="container">
        <section class="hero fade-in-up">
            <h1>${fileName}</h1>
            <p>Viewing source code for ${filePath}</p>
            <a href="/" class="cta-button" style="margin-top: 1rem;">← Back to Library</a>
        </section>

        <section class="code-viewer fade-in-up">
            <div class="code-container">
                <div class="code-header">
                    <span class="code-lang">${language}</span>
                    <span class="code-filename">${fileName}</span>
                    <button class="copy-button" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${highlightedContent}</code></pre>
            </div>
        </section>
    </div>

    <footer class="footer">
        <p>&copy; 2025 Andromeda Standard Library. Open source library.</p>
    </footer>

    <script>
        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const mobileOverlay = document.getElementById('mobileOverlay');
            
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        function closeMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const mobileOverlay = document.getElementById('mobileOverlay');
            
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            });
        });

        function copyCode(button) {
            const code = button.closest('.code-container').querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    if (pathname === "/" || pathname === "/index.html") {
      return new Response(await generateMainPage(), {
        headers: { "content-type": "text/html" },
      });
    }

    const currentDir = Deno.cwd();
    const filePath = join(currentDir, pathname.slice(1));

    try {
      const fileInfo = await Deno.stat(filePath);

      if (fileInfo.isFile) {
        const content = await Deno.readTextFile(filePath);
        const ext = pathname.split(".").pop()?.toLowerCase();
        
        // Check if this is a request for raw content (for imports) vs viewing
        const acceptHeader = req.headers.get("accept") || "";
        const isImportRequest = acceptHeader.includes("text/typescript") || 
                               acceptHeader.includes("application/typescript") ||
                               acceptHeader.includes("*/*") ||
                               !acceptHeader.includes("text/html");

        // For TypeScript files: serve raw content for imports, HTML viewer for browser
        if (ext === "ts") {
          if (isImportRequest) {
            return new Response(content, {
              headers: { 
                "content-type": "application/typescript",
                "access-control-allow-origin": "*"
              },
            });
          } else {
            return new Response(generateFilePage(pathname, content), {
              headers: { "content-type": "text/html" },
            });
          }
        }

        // For other file types
        const contentType = ext === "js" ?
          "application/javascript" :
          ext === "json" ?
          "application/json" :
          ext === "md" ?
          "text/html" :
          "text/plain";

        if (ext === "md" || ext === "json") {
          return new Response(generateFilePage(pathname, content), {
            headers: { "content-type": "text/html" },
          });
        } else {
          return new Response(content, {
            headers: { 
              "content-type": contentType,
              "access-control-allow-origin": "*"
            },
          });
        }
      }
    } catch {
      // File doesn't exist, continue to 404
    }

    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Not Found</title>
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        <div class="container" style="text-align: center; padding: 4rem 1rem;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
          <p style="font-size: 1.25rem; margin-bottom: 2rem;">File not found: ${pathname}</p>
          <a href="/" class="cta-button">← Back to Home</a>
        </div>
      </body>
      </html>
    `,
      {
        status: 404,
        headers: { "content-type": "text/html" },
      },
    );
  } catch (error) {
    return new Response(
      `Internal Server Error: ${(error as Error).message}`,
      {
        status: 500,
        headers: { "content-type": "text/plain" },
      },
    );
  }
}

export default {
  fetch: handler,
};
