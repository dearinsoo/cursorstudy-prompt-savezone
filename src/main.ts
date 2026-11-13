export interface Prompt {
  id: number;
  name: string;
  prompt: string;
}

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) {
  throw new Error("#app not found");
}
const app: HTMLDivElement = appRoot;

const PAGE_SIZE = 10;
const THEME_STORAGE_KEY = "prompt-site-theme";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  syncThemeToggle();
}

function syncThemeToggle(): void {
  const btn = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (!btn) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "라이트 모드" : "다크 모드";
  btn.setAttribute(
    "aria-label",
    isDark ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
}

function initThemeToggle(): void {
  const btn = document.querySelector<HTMLButtonElement>("#theme-toggle");
  syncThemeToggle();
  btn?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  });
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

async function loadPrompts(): Promise<Prompt[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}prompts.json`);
  if (!res.ok) throw new Error("프롬프트 데이터를 불러오지 못했습니다.");
  return res.json() as Promise<Prompt[]>;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderShell(): void {
  app.innerHTML = `
    <header class="site-header">
      <div class="site-header-row">
        <div class="site-header-text">
          <h1>나만의 프롬프트</h1>
          <p>이름이나 내용으로 검색한 뒤, 버튼 한 번으로 복사해 바로 사용하세요.</p>
        </div>
        <button type="button" class="btn btn-ghost theme-toggle" id="theme-toggle">다크 모드</button>
      </div>
    </header>
    <div class="search-wrap">
      <label for="search" class="sr-only">프롬프트 검색</label>
      <input
        id="search"
        class="search-input"
        type="search"
        placeholder="프롬프트 이름 또는 내용 검색..."
        autocomplete="off"
      />
    </div>
    <p class="result-meta" id="result-meta" aria-live="polite"></p>
    <div id="results"></div>
    <nav id="pagination" class="pagination" aria-label="페이지 탐색" hidden></nav>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <div id="modal-backdrop" class="modal-backdrop" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title"></h2>
        <pre id="modal-body"></pre>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="modal-close">닫기</button>
          <button type="button" class="btn btn-primary" id="modal-copy">복사</button>
        </div>
      </div>
    </div>
  `;
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLDivElement>("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2000);
}
showToast._t = 0;

function openModal(item: Prompt): void {
  const backdrop = document.querySelector<HTMLDivElement>("#modal-backdrop");
  const title = document.querySelector<HTMLHeadingElement>("#modal-title");
  const body = document.querySelector<HTMLPreElement>("#modal-body");
  const copyBtn = document.querySelector<HTMLButtonElement>("#modal-copy");
  if (!backdrop || !title || !body || !copyBtn) return;

  title.textContent = item.name;
  body.textContent = item.prompt;
  backdrop.hidden = false;

  copyBtn.onclick = async () => {
    const ok = await copyText(item.prompt);
    showToast(ok ? "복사되었습니다" : "복사에 실패했습니다");
  };
}

function closeModal(): void {
  const backdrop = document.querySelector<HTMLDivElement>("#modal-backdrop");
  if (backdrop) backdrop.hidden = true;
}

function totalPages(filteredCount: number): number {
  return Math.max(1, Math.ceil(filteredCount / PAGE_SIZE) || 1);
}

function pageRange(filteredCount: number, page: number): { start: number; end: number } {
  if (filteredCount === 0) return { start: 0, end: 0 };
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filteredCount);
  return { start, end };
}

function renderTable(
  pageItems: Prompt[],
  filteredCount: number,
  allCount: number,
  currentPage: number,
): void {
  const meta = document.querySelector<HTMLElement>("#result-meta");
  const results = document.querySelector<HTMLElement>("#results");
  const pagination = document.querySelector<HTMLElement>("#pagination");
  if (!meta || !results || !pagination) return;

  if (filteredCount === 0) {
    meta.textContent = allCount === 0 ? "데이터 없음" : `검색 결과 없음 (전체 ${allCount}개)`;
    results.innerHTML = `<p class="empty-state">검색 결과가 없습니다. 다른 키워드를 입력해 보세요.</p>`;
    pagination.hidden = true;
    pagination.innerHTML = "";
    return;
  }

  const { start, end } = pageRange(filteredCount, currentPage);
  const pages = totalPages(filteredCount);
  const searchNote =
    filteredCount === allCount ? `총 ${allCount}개` : `${filteredCount}개 (전체 ${allCount}개)`;
  meta.textContent = `${searchNote} · ${start}–${end}번째 · ${currentPage} / ${pages}페이지`;

  const rows = pageItems
    .map(
      (item) => `
    <tr data-id="${item.id}">
      <td class="col-name">${escapeHtml(item.name)}</td>
      <td class="col-preview">
        <button type="button" class="preview-trigger" data-action="view" data-id="${item.id}" title="클릭하여 전체 보기" aria-label="${escapeHtml(item.name)} 프롬프트 전체 보기">
          <span class="preview-text">${escapeHtml(item.prompt)}</span>
        </button>
      </td>
      <td class="col-actions">
        <button type="button" class="btn btn-primary" data-action="copy" data-id="${item.id}" aria-label="${escapeHtml(item.name)} 복사">복사</button>
      </td>
    </tr>
  `,
    )
    .join("");

  results.innerHTML = `
    <div class="table-wrap">
      <table class="prompt-table">
        <thead>
          <tr>
            <th scope="col">프롬프트 이름</th>
            <th scope="col">프롬프트</th>
            <th scope="col">동작</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  pagination.hidden = pages <= 1;
  if (pages > 1) {
    pagination.innerHTML = `
      <button type="button" class="btn btn-ghost pagination-btn" data-page-action="prev" ${currentPage <= 1 ? "disabled" : ""} aria-label="이전 페이지">이전</button>
      <span class="pagination-status" aria-live="polite">${currentPage} / ${pages}</span>
      <button type="button" class="btn btn-ghost pagination-btn" data-page-action="next" ${currentPage >= pages ? "disabled" : ""} aria-label="다음 페이지">다음</button>
    `;
  } else {
    pagination.innerHTML = "";
  }
}

async function init(): Promise<void> {
  renderShell();
  initThemeToggle();

  let allPrompts: Prompt[] = [];
  try {
    allPrompts = await loadPrompts();
  } catch (e) {
    app.innerHTML = `<p class="empty-state">${escapeHtml(e instanceof Error ? e.message : "오류")}</p>`;
    return;
  }

  const search = document.querySelector<HTMLInputElement>("#search");
  const results = document.querySelector<HTMLElement>("#results");
  const backdrop = document.querySelector<HTMLDivElement>("#modal-backdrop");
  const closeBtn = document.querySelector<HTMLButtonElement>("#modal-close");

  const byId = () => new Map(allPrompts.map((p) => [p.id, p]));
  let currentPage = 1;
  let filteredPrompts: Prompt[] = [];

  function bindRowActions(): void {
    if (!results) return;
    const map = byId();

    results.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((btn) => {
      btn.onclick = async () => {
        const id = Number(btn.dataset.id);
        const item = map.get(id);
        if (!item) return;
        if (btn.dataset.action === "copy") {
          const ok = await copyText(item.prompt);
          showToast(ok ? "복사되었습니다" : "복사에 실패했습니다");
        } else {
          openModal(item);
        }
      };
    });
  }

  function bindPagination(): void {
    const pagination = document.querySelector<HTMLElement>("#pagination");
    if (!pagination) return;

    pagination.querySelectorAll<HTMLButtonElement>("[data-page-action]").forEach((btn) => {
      btn.onclick = () => {
        const pages = totalPages(filteredPrompts.length);
        if (btn.dataset.pageAction === "prev" && currentPage > 1) {
          currentPage -= 1;
        } else if (btn.dataset.pageAction === "next" && currentPage < pages) {
          currentPage += 1;
        } else {
          return;
        }
        renderView();
        document.querySelector<HTMLElement>("#results")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
    });
  }

  function renderView(): void {
    const pages = totalPages(filteredPrompts.length);
    if (currentPage > pages) currentPage = pages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filteredPrompts.slice(start, start + PAGE_SIZE);
    renderTable(pageItems, filteredPrompts.length, allPrompts.length, currentPage);
    bindRowActions();
    bindPagination();
  }

  function applyFilter(): void {
    const q = normalize(search?.value ?? "");
    filteredPrompts =
      q === ""
        ? allPrompts
        : allPrompts.filter(
            (p) =>
              normalize(p.name).includes(q) || normalize(p.prompt).includes(q),
          );
    currentPage = 1;
    renderView();
  }

  search?.addEventListener("input", applyFilter);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  applyFilter();
}

init();
