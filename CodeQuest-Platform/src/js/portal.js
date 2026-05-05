const books = [
  {
    title: "Eloquent JavaScript",
    meta: "Marijn Haverbeke",
    description: "Modern JavaScript foundations with practical exercises and deep concepts."
  },
  {
    title: "Python Crash Course",
    meta: "Eric Matthes",
    description: "Project-first introduction to Python for real-world automation and apps."
  },
  {
    title: "Clean Code",
    meta: "Robert C. Martin",
    description: "Timeless principles for writing maintainable and professional code."
  },
  {
    title: "Designing Data-Intensive Applications",
    meta: "Martin Kleppmann",
    description: "Advanced systems thinking for scalable and reliable software architecture."
  }
];

const articles = [
  {
    title: "How to Learn Programming Without Burnout",
    meta: "Learning Strategy",
    description: "A realistic routine for growth without losing motivation."
  },
  {
    title: "Debugging Playbook For Juniors",
    meta: "Engineering Workflow",
    description: "How to isolate bugs, test assumptions, and validate fixes step by step."
  },
  {
    title: "From Tutorial Hell to Project Thinking",
    meta: "Career Growth",
    description: "Shift from passive watching to shipping code consistently."
  },
  {
    title: "Interview Communication for Developers",
    meta: "Interview Prep",
    description: "Explain your code clearly and improve technical interview performance."
  }
];

function renderCards(targetId, list) {
  const node = document.getElementById(targetId);
  if (!node) return;
  node.innerHTML = list
    .map(
      (item) => `<article class="card"><h3>${item.title}</h3><p class="sub">${item.meta}</p><p>${item.description}</p></article>`
    )
    .join("");
}

renderCards("books-grid", books);
renderCards("articles-grid", articles);
