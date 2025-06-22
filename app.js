const decisionTree = {
  root: {
    id: "root",
    question: "Is your device powering on?",
    options: [
      { label: "Yes", next: "power_yes" },
      { label: "No", next: "power_no" },
    ],
  },
  power_yes: {
    id: "power_yes",
    question: "Are you able to log in successfully?",
    options: [
      { label: "Yes", next: "login_yes" },
      { label: "No", next: "login_no" },
    ],
  },
  power_no: {
    id: "power_no",
    question: "Is the power cable properly connected?",
    options: [
      { label: "Yes", next: "power_cable_yes" },
      { label: "No", next: "power_cable_no" },
    ],
  },
  power_cable_yes: {
    id: "power_cable_yes",
    question: "Try pressing and holding the power button for 10 seconds. Did it turn on?",
    options: [
      { label: "Yes", next: "power_yes" },
      { label: "No", next: "contact_support" },
    ],
  },
  power_cable_no: {
    id: "power_cable_no",
    result: "Please connect the power cable and try powering on the device again.",
    options: [],
  },
  login_yes: {
    id: "login_yes",
    question: "Everything seems fine. Is there any other issue you want to troubleshoot?",
    options: [
      { label: "Yes", next: "root" },
      { label: "No", next: "end" },
    ],
  },
  login_no: {
    id: "login_no",
    question: "Did you forget your password?",
    options: [
      { label: "Yes", next: "reset_password" },
      { label: "No", next: "contact_support" },
    ],
  },
  reset_password: {
    id: "reset_password",
    result: "Please reset your password using the 'Forgot Password' link and try logging in again.",
    options: [],
  },
  contact_support: {
    id: "contact_support",
    result: "Technical support can help you resolve this issue.",
    options: [],
  },
  end: {
    id: "end",
    result: "Have a great day!",
    options: [],
  },
};

const treeContainer = document.getElementById("tree-container");
const prevBtn = document.getElementById("prevBtn");
const restartBtn = document.getElementById("restartBtn");

let historyStack = [];
let currentNode = decisionTree.root;

function displayError(message) {
  treeContainer.innerHTML = "";
  const errorEl = document.createElement("div");
  errorEl.className = "question fade-in";
  errorEl.style.color = "red";
  errorEl.textContent = `⚠️ ${message}`;
  treeContainer.appendChild(errorEl);
}

function isValidNode(node) {
  return node && (node.question || node.result) && Array.isArray(node.options);
}

function renderNode(node) {
  if (!isValidNode(node)) {
    displayError("Invalid node structure. Please restart.");
    return;
  }

  treeContainer.innerHTML = "";
  const questionEl = document.createElement("p");
  questionEl.className = "question fade-in";

  if (node.result) {
    questionEl.textContent = node.result;
    treeContainer.appendChild(questionEl);
  } else {
    questionEl.textContent = node.question;
    treeContainer.appendChild(questionEl);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options fade-in";

    if (!node.options || node.options.length === 0) {
      displayError("No options available for this step.");
      return;
    }

    node.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-button";
      btn.textContent = opt.label;
      btn.type = "button";

      btn.addEventListener("click", () => {
        if (!opt.next || !decisionTree[opt.next]) {
          displayError(`Missing destination node: "${opt.next}".`);
          return;
        }

        historyStack.push(currentNode.id);
        currentNode = decisionTree[opt.next];
        renderNode(currentNode);
        prevBtn.disabled = false;
      });

      optionsDiv.appendChild(btn);
    });

    treeContainer.appendChild(optionsDiv);
  }

  prevBtn.disabled = historyStack.length === 0;
}

prevBtn.addEventListener("click", () => {
  if (historyStack.length === 0) return;
  const prevId = historyStack.pop();
  const prevNode = decisionTree[prevId];
  if (isValidNode(prevNode)) {
    currentNode = prevNode;
    renderNode(currentNode);
  } else {
    displayError("Previous node is corrupted or missing.");
  }
});

restartBtn.addEventListener("click", () => {
  historyStack = [];
  currentNode = decisionTree.root;
  renderNode(currentNode);
  prevBtn.disabled = true;
});

renderNode(currentNode);
