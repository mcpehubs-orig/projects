export function navPanels() {
  const links = document.querySelectorAll(".nav-link");
  const panels = document.querySelectorAll(".panel");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      links.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      const id = link.getAttribute("href").replace("#", "");
      panels.forEach((panel) => panel.classList.toggle("active", panel.id === id));
    });
  });
}

export function setMotivation(text) {
  document.getElementById("motivation-message").textContent = text;
}

export function paintFeedback(node, text, isCorrect) {
  node.textContent = text;
  node.classList.remove("correct", "wrong");
  if (!text) return;
  node.classList.add(isCorrect ? "correct" : "wrong");
}
