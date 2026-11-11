const STORAGE_KEY = "shubhaa-projects";
const form = document.querySelector("#project-form");
const list = document.querySelector("#project-list");
const empty = document.querySelector("#project-empty");
const addButton = document.querySelector("#add-project");
const cancelButton = document.querySelector("#cancel-project");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function loadProjects() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects(projects) {
  empty.hidden = projects.length > 0;
  list.innerHTML = projects
    .map(
      (project) => `
        <article class="project">
          <header>
            <p><time datetime="${escapeHtml(project.year)}">${escapeHtml(project.year)}</time></p>
            <h3>${escapeHtml(project.title)}</h3>
          </header>
          <p>${escapeHtml(project.summary)}</p>
          <footer>
            <p>${escapeHtml(project.area)}</p>
            <button type="button" data-remove="${escapeHtml(project.id)}">Remove</button>
          </footer>
        </article>
      `
    )
    .join("");
}

function openForm() {
  form.hidden = false;
  addButton.hidden = true;
  form.querySelector("#project-title").focus();
}

function closeForm() {
  form.reset();
  form.hidden = true;
  addButton.hidden = false;
}

let projects = loadProjects();
renderProjects(projects);

addButton.addEventListener("click", openForm);
cancelButton.addEventListener("click", closeForm);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const project = {
    id: crypto.randomUUID(),
    title: data.get("title").trim(),
    summary: data.get("summary").trim(),
    year: String(data.get("year")).trim(),
    area: data.get("area"),
  };
  if (!project.title || !project.summary) return;
  projects = [project, ...projects];
  saveProjects(projects);
  renderProjects(projects);
  closeForm();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  projects = projects.filter((project) => project.id !== button.dataset.remove);
  saveProjects(projects);
  renderProjects(projects);
});
