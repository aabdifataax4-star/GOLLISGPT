const defaultSettings = {
  name: "Your Account",
  email: "",
  plan: "Plus",
  apiBase: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
  googleSearchKey: "",
  googleSearchCx: ""
};

function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function loadChats() {
  try {
    const raw = localStorage.getItem("chatgpt_clone_chats");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  return [{
    id: generateId(),
    title: "xuduudaha Somaliland",
    messages: [
      { role: "user", content: "was kuwee lixda gobol ee Somaliland ?" },
      { role: "assistant", content: "Waa Maroodijeex, Togdheer, Saaxil, Awdal, Sanaag iyo Sool. Gobolkee baad jeceshahay inaad wax ka ogaato faahfaahin tiisa?" },
      { role: "user", content: "Maroodijeex" },
      { role: "assistant", content: "Gobolka Maroodijeex waa gobolkii ay ku taalay magaalo madaxdii Somaliland ahna Caasimadda Somaliland ee Hargeysa. Faah-faahin gobol kale ma dooneysaa?" },
      { role: "user", content: "haa" },
      { role: "assistant", content: "Sidaas waan fahmay! Ma haysaa su'aal gaar ah (sida Xisaabta, Sayniska ama Taariikhda) oo aad u baahan tahay inaan kaaga caawiyo?" }
    ]
  }];
}

function saveChats() {
  localStorage.setItem("chatgpt_clone_chats", JSON.stringify(state.chats));
}

const state = {
  chats: loadChats(),
  projects: loadProjects(),
  activeChatId: null,
  activeProjectId: null,
  activeTool: "chat",
  settings: loadSettings(),
  isListening: false,
  openChatMenuId: null,
  activeTopic: "General knowledge"
};

function loadProjects() {
  try {
    const raw = localStorage.getItem("chatgpt_clone_projects");
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return [];
}

function saveProjects() {
  localStorage.setItem("chatgpt_clone_projects", JSON.stringify(state.projects));
}

const chatList = document.getElementById("chatList");
const chatFilter = document.getElementById("chatFilter");
const newChatBtn = document.getElementById("newChatBtn");
const recentsToggleBtn = document.getElementById("recentsToggleBtn");
const recentsChevron = document.getElementById("recentsChevron");
const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("promptInput");
const sendBtn = document.getElementById("sendBtn");
const messageTemplate = document.getElementById("messageTemplate");
const toolButtons = [...document.querySelectorAll(".tool-chip")];
const topicChips = [...document.querySelectorAll(".topic-chip")];
const topicStatus = document.getElementById("topicStatus");

const plusBtn = document.getElementById("plusBtn");
const quickPromptBtn = document.getElementById("quickPromptBtn");
const quickPrompts = document.getElementById("quickPrompts");
const chatWrap = document.querySelector(".chat-wrap");
const plusMenu = document.getElementById("plusMenu");
const micBtn = document.getElementById("micBtn");
const accountBtn = document.getElementById("accountBtn");
const accountModal = document.getElementById("accountModal");
const closeAccountBtn = document.getElementById("closeAccountBtn");
const saveAccountBtn = document.getElementById("saveAccountBtn");
const accName = document.getElementById("accName");
const accEmail = document.getElementById("accEmail");
const accPlan = document.getElementById("accPlan");
const apiBase = document.getElementById("apiBase");
const apiKey = document.getElementById("apiKey");
const apiModel = document.getElementById("apiModel");
const googleSearchKey = document.getElementById("googleSearchKey");
const googleSearchCx = document.getElementById("googleSearchCx");
const userNameView = document.getElementById("userNameView");
const userPlanView = document.getElementById("userPlanView");
const modelPickerBtn = document.getElementById("modelPickerBtn");
const modelMenu = document.getElementById("modelMenu");
const modelLabel = document.getElementById("modelLabel");
const modelOptions = [...document.querySelectorAll(".model-option")];
const quickPromptOptions = [...quickPrompts.querySelectorAll("button")];

// New Interactive Elements
const sidebarImageBtn = document.getElementById("sidebarImageBtn");
const sidebarAppsBtn = document.getElementById("sidebarAppsBtn");
const sidebarResearchBtn = document.getElementById("sidebarResearchBtn");
const sidebarCodexBtn = document.getElementById("sidebarCodexBtn");
const sidebarProjectsBtn = document.getElementById("sidebarProjectsBtn");

const addPhotosMenu = document.getElementById("addPhotosMenu");
const createImageMenu = document.getElementById("createImageMenu");
const thinkingMenu = document.getElementById("thinkingMenu");
const deepResearchMenu = document.getElementById("deepResearchMenu");

const fileUploadInput = document.getElementById("fileUploadInput");
const projectsList = document.getElementById("projectsList");

state.activeChatId = state.chats[0].id;

function loadSettings() {
  const raw = localStorage.getItem("chatgpt_clone_settings");
  if (!raw) return { ...defaultSettings };
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings() {
  localStorage.setItem("chatgpt_clone_settings", JSON.stringify(state.settings));
}

function renderAccountCard() {
  userNameView.textContent = (state.settings.name || "Your Account") + (state.settings.plan === "Plus" ? " Plus" : "");
  userPlanView.textContent = state.settings.plan === "Plus" ? "Plus" : "Free";
  plusBtn.textContent = "Free";
  modelLabel.textContent = "GOLLISGPT";
}

function fillAccountForm() {
  accName.value = state.settings.name || "";
  accEmail.value = state.settings.email || "";
  accPlan.value = state.settings.plan || "Free";
  apiBase.value = state.settings.apiBase || "";
  apiKey.value = state.settings.apiKey || "";
  apiModel.value = state.settings.model || "gpt-4o-mini";
  googleSearchKey.value = state.settings.googleSearchKey || "";
  googleSearchCx.value = state.settings.googleSearchCx || "";
}

function openAccountModal() {
  fillAccountForm();
  accountModal.classList.remove("hidden");
}

function closeAccountModal() {
  accountModal.classList.add("hidden");
}

function getActiveChat() {
  return state.chats.find((chat) => chat.id === state.activeChatId);
}

function autoGrow() {
  inputEl.style.height = "auto";
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 220)}px`;
}

function setTool(toolName) {
  state.activeTool = toolName;
  toolButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === toolName);
  });

  const welcomeH1 = welcomeEl.querySelector("h1");
  if (welcomeH1) {
    if (toolName === "code") welcomeH1.textContent = "Codex Mode: Ku qor code-ka aad isku dayayso";
    else if (toolName === "image") welcomeH1.textContent = "Sawir sameeye: Maxaan kuu sawiraa?";
    else if (toolName === "research") welcomeH1.textContent = "Deep Research: Maxaan si qoto dheer kaaga baaraa?";
    else welcomeH1.textContent = "Maxaad rabtaa inaad ogaato?";
  }
  if (topicStatus) {
    topicStatus.textContent = toolName === "research"
      ? "Deep research: warbixin faahfaahsan iyo ilo la hubin karo"
      : `${state.activeTopic} — Somali ama English`;
  }
  inputEl.focus();
}

function setTopic(topic) {
  state.activeTopic = topic;
  topicChips.forEach((chip) => chip.classList.toggle("active", chip.dataset.topic === topic));
  if (state.activeTool !== "research" && topicStatus) {
    topicStatus.textContent = `${topic} — Somali ama English`;
  }
  inputEl.placeholder = `${topic} ka weydii wax kasta...`;
  inputEl.focus();
}

function renderChatList() {
  const keyword = chatFilter.value.trim().toLowerCase();

  // Search in both title and messages for 100% search coverage
  const visibleChats = state.chats.filter((chat) => {
    const inTitle = chat.title.toLowerCase().includes(keyword);
    const inMessages = chat.messages.some(msg =>
      msg.content && msg.content.toLowerCase().includes(keyword)
    );
    return inTitle || inMessages;
  });

  chatList.innerHTML = "";

  if (visibleChats.length === 0 && keyword !== "") {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.textContent = "Natiijo lama helin.";
    chatList.appendChild(noResults);
    return;
  }

  for (const chat of visibleChats) {
    const row = document.createElement("div");
    row.className = "chat-row";

    const item = document.createElement("button");
    item.type = "button";
    item.className = "chat-item";
    item.textContent = chat.title;
    item.classList.toggle("active", chat.id === state.activeChatId);
    item.addEventListener("click", () => {
      state.activeChatId = chat.id;
      render();
    });
    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "chat-menu-btn";
    menuBtn.textContent = "⋯";
    menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      state.openChatMenuId = state.openChatMenuId === chat.id ? null : chat.id;
      renderChatList();
    });

    row.appendChild(item);
    row.appendChild(menuBtn);

    if (state.openChatMenuId === chat.id) {
      const menu = document.createElement("div");
      menu.className = "chat-menu";
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "chat-menu-option";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteChat(chat.id);
      });
      menu.appendChild(deleteBtn);
      row.appendChild(menu);
    }

    chatList.appendChild(row);
  }
}

function renderProjects() {
  if (!projectsList) return;
  projectsList.innerHTML = "";
  state.projects.forEach(project => {
    const item = document.createElement("button");
    item.className = `project-item ${state.activeProjectId === project.id ? 'active' : ''}`;
    item.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> <span>${project.name}</span>`;
    item.addEventListener("click", () => {
      state.activeProjectId = project.id;
      // When a project is clicked, we could switch to a specific chat for that project
      // For now, let's just mark it active
      render();
    });
    projectsList.appendChild(item);
  });
}

function createNewProject() {
  const name = window.prompt("Geli magaca mashruuca cusub (khaanada):");
  if (name && name.trim()) {
    const newProject = {
      id: generateId(),
      name: name.trim(),
      chats: []
    };
    state.projects.push(newProject);
    state.activeProjectId = newProject.id;
    saveProjects();
    render();
  }
}

function renderMessages() {
  const chat = getActiveChat();
  messagesEl.innerHTML = "";
  const hasMessages = chat && chat.messages.length > 0;
  if (!hasMessages) {
    chatWrap.classList.add("is-empty");
  } else {
    chatWrap.classList.remove("is-empty");
  }
  welcomeEl.style.display = hasMessages ? "none" : "flex";
  if (!chat) return;
  for (const msg of chat.messages) {
    const messageNode = messageTemplate.content.firstElementChild.cloneNode(true);
    messageNode.dataset.role = msg.role;
    messageNode.querySelector(".message-role").textContent = msg.role === "user" ? "You" : "G";
    const contentEl = messageNode.querySelector(".message-content");
    renderMessageContent(contentEl, msg);


    messagesEl.appendChild(messageNode);
  }

  const contentInner = document.querySelector('.chat-content-inner');
  if (contentInner) {
    contentInner.scrollTop = contentInner.scrollHeight;
  }
}


function renderMessageContent(container, msg) {
  container.innerHTML = "";
  if (msg.type === "code") {
    const pre = document.createElement("pre");
    pre.className = "code-block";
    const code = document.createElement("code");
    code.textContent = msg.content;
    pre.appendChild(code);
    container.appendChild(pre);
    return;
  }
  if (msg.type === "image") {
    const caption = document.createElement("p");
    caption.className = "image-caption";
    caption.textContent = msg.content;
    const imageContainer = document.createElement("div");
    imageContainer.style.display = "flex";
    imageContainer.style.flexDirection = "column";
    imageContainer.style.alignItems = "center";

    const image = document.createElement("img");
    image.className = "generated-image";
    image.loading = "lazy";
    image.alt = msg.content;
    image.src = msg.imageUrl;

    imageContainer.appendChild(caption);
    imageContainer.appendChild(image);
    container.appendChild(imageContainer);
    return;
  }
  if (msg.type === "web") {
    const title = document.createElement("p");
    title.className = "web-title";
    title.textContent = msg.content;
    container.appendChild(title);
    const list = document.createElement("div");
    list.className = "web-results";
    for (const result of msg.results || []) {
      const item = document.createElement("a");
      item.className = "web-item";
      item.href = result.url;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
      item.textContent = `${result.title} — ${result.snippet}`;
      list.appendChild(item);
    }
    if (!msg.results || msg.results.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Natiijo lama helin.";
      list.appendChild(empty);
    }
    container.appendChild(list);
    return;
  }
  if (msg.type === "research") {
    const report = document.createElement("div");
    report.className = "research-report";

    const header = document.createElement("div");
    header.className = "research-report-header";
    header.textContent = "Deep research report";
    report.appendChild(header);

    const body = document.createElement("div");
    body.className = "research-body";
    body.textContent = msg.content || "Warbixinta cilmi-baarista lama helin.";
    report.appendChild(body);

    const sources = msg.sources || [];
    if (sources.length) {
      const sourcesEl = document.createElement("div");
      sourcesEl.className = "research-sources";
      const label = document.createElement("div");
      label.className = "research-sources-title";
      label.textContent = "Sources";
      sourcesEl.appendChild(label);
      sources.forEach((source, index) => {
        const link = document.createElement("a");
        link.className = "research-source";
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `[${index + 1}] ${source.platform || "Source"} — ${source.title}`;
        sourcesEl.appendChild(link);
      });
      report.appendChild(sourcesEl);
    }
    container.appendChild(report);
    return;
  }
  if (msg.type === "file") {
    container.innerHTML = `<div style="display:flex;align-items:center;gap:12px;background:#252a36;padding:12px;border-radius:10px;border:1px solid #384058;">
      <svg width="24" height="24" stroke="var(--brand)" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
      <div>
        <div style="font-weight:600">${msg.filename || 'File'}</div>
        <div style="font-size:0.8rem;color:var(--muted)">Uploaded Doc</div>
      </div>
    </div>
    <p style="margin-top:10px;">${msg.content}</p>`;
    return;
  }
  // Render markdown-like formatting for plain text messages
  const formatted = (msg.content || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:#1e2130;padding:2px 6px;border-radius:4px;font-size:0.9em'>$1</code>")
    .replace(/^#{3}\s(.+)$/gm, "<h3 style='margin:0.6em 0 0.2em;font-size:1em;color:#a0c4ff'>$1</h3>")
    .replace(/^#{2}\s(.+)$/gm, "<h2 style='margin:0.7em 0 0.3em;font-size:1.1em;color:#b0d4ff'>$1</h2>")
    .replace(/^#{1}\s(.+)$/gm, "<h1 style='margin:0.8em 0 0.3em;font-size:1.2em;color:#c0e0ff'>$1</h1>")
    .replace(/^[-*]\s(.+)$/gm, "<li style='margin-left:1.2em;list-style:disc'>$1</li>")
    .replace(/^(\d+)\.\s(.+)$/gm, "<li style='margin-left:1.2em;list-style:decimal'>$2</li>")
    .replace(/(<li.*<\/li>)/gs, "<ul style='padding:0;margin:4px 0'>$1</ul>")
    .replace(/\n/g, "<br>");
  container.innerHTML = formatted;
}

function createChat() {
  const chat = {
    id: generateId(),
    title: "New chat",
    messages: []
  };
  state.chats.unshift(chat);
  state.activeChatId = chat.id;
  saveChats();
  render();
  inputEl.focus();
}

function deleteChat(chatId) {
  state.chats = state.chats.filter((chat) => chat.id !== chatId);
  if (state.chats.length === 0) {
    const firstChat = { id: generateId(), title: "Welcome", messages: [] };
    state.chats.push(firstChat);
  }
  if (!state.chats.some((chat) => chat.id === state.activeChatId)) {
    state.activeChatId = state.chats[0].id;
  }
  state.openChatMenuId = null;
  saveChats();
  render();
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
}

const qaList = [
  // Somaliland (Hadda Ku Jira)
  { p: /\b(waa tee caasimadd?a somaliland|caasimad[aa]da somaliland|xarunta somaliland)\b/i, r: "Waa Hargeysa. Ma doonaysaa inaan kaaga waramo taariikhda Hargeysa?" },
  { p: /\b(waa kuma madaxweynaha som[a]?liland|madaxweynaha somaliland)\b/i, r: "Waa Cabdiraxmaan Maxamed Cabdilaahi (Cirro). Ma u baahan tahay taariikh nololeedkiisa oo kooban?" },
  { p: /\b(waa kuwee lixda gobol ee somaliland|imisa gobol( ayay)? ka kooban tahay somaliland|gobolada somaliland)\b/i, r: "Waa Maroodijeex, Togdheer, Saaxil, Awdal, Sanaag iyo Sool. Gobolkee baad jeceshahay inaad wax ka ogaato faahfaahin tiisa?" },
  { p: /\b(maroodijeex|maroodi jeex|gobolka maroodijeex)\b/i, r: "Gobolka Maroodijeex waa gobolkii ay ku taalay magaalo madaxdii Somaliland ahna Caasimadda Somaliland ee Hargeysa. Faah-faahin gobol kale ma dooneysaa?" },
  { p: /\b(togdheer|gobolka togdheer)\b/i, r: "Gobolka Togdheer waa gobolka labaad ee Somaliland, caasimaddiisuna waa **Burco** — oo ah magaalada labaad ee ugu weyn Somaliland. Su'aal kale ma ka qabtaa goboladan?" },
  { p: /\b(awdal|gobolka awdal)\b/i, r: "Gobolka Awdal waa gobolka galbeedka ee Somaliland, caasimaddiisuna waa **Borama**. Wuxuu xuduud la leeyahay Jabuuti iyo Itoobiya. Su'aal kale ma qabtaa?" },
  { p: /\b(saaxil|gobolka saaxil)\b/i, r: "Gobolka **Saaxil** waa gobolka xeebta ah ee Somaliland, caasimaddiisuna waa **Berbera**.\n\n🚢 **Dekadda Berbera** waa dekadda ugu hormarsan **Gobolka Geeska Afrika** — waxay leeyahay xukumad strateejiyadeed aad u muhiim ah xagga ganacsiga caalamiga ah.\n\n**Magaalooyinka Saaxil hoostimaada:**\n- 🏙️ Berbera (Caasimadda)\n- 🌿 Sheekh\n- 🏖️ Bulaxaar\n\nSu'aal kale ma qabtaa gobolkan?" },
  { p: /\b(sanaag|gobolka sanaag)\b/i, r: "Gobolka **Sanaag** waa gobolka ugu dhulka weyn Somaliland! 🏔️\n\n**Caasimadda:** Ceerigaabo\n\n**Astaamaha gaar ah:**\n- Wuxuu leeyahay buuro dhaadheer oo qurxoon sida **Daalo** (Daallo Forest) — taas oo la mid ah kaynta roobeedka ah\n- Wuxuu leeyahay xeebo dhaadheer oo Gacanka Cadmeedka iska muujinaya\n- Waxaa ku jira macdano kala duwan sida **dahab, bir, iyo kuwo kale**\n- Waa gobol hodan ku ah dabiicadda, dugsiyada, iyo taariikhda\n\nGobolkee kale ee Somaliland baad doonaysaa?" },
  { p: /\b(sool|gobolka sool)\b/i, r: "Gobolka **Sool** waa gobolka koonfureed ee Somaliland, caasimaddiisuna waa **Laascaanood**. Waxaa ku yaala dhulka dhex-dhexaadka ah ee Geeska Afrika, wuxuuna muhiim u yahay dhaqaalaha xoolaha. Su'aal kale ma qabtaa?" },
  { p: /\b(goormay somaliland madaxbanaanideeda|madaxbanaanida heshay|18 may)\b/i, r: "Somaliland waxay madax-banaanideeda kala soo noqotay Soomaaliya **18-kii May, 1991-kii** — taasina waa maalin taariikhi ah oo sannad walba lagu dabaaldo. Ma doonaysaa inaad ogaato sidii ay ku heshay?" },
  { p: /\b(lacagta somaliland)\b/i, r: "Lacagta Somaliland waa **Somaliland Shilling (SLSH)**. Ma rabtaa qiimaha sarifka manta?" },
  { p: /\b(xuduudaha somaliland|waa maxay xuduudaha somaliland)\b/i, r: "Somaliland waxay xuduud la leedahay:\n- **Galbeed:** Jabuuti\n- **Koonfur:** Itoobiya\n- **Bari:** Soomaaliya\n- **Waqooyi:** Gacanka Cadmeedka (Gulf of Aden)\n\nMa rabtaa bedka ay ku fadhido?" },

  // Logic & Riddles
  { p: /\b(wax hoos( u)? socda korna( u)? socda)\b/i, r: "Waa Jaranjarada (Stairs). Ma haysaa hal-xiraale kale oo aan kaa jawaabo?" },
  { p: /\b(wax inta la gooyo la ooyo|inta la gooyo la ooyo|inta la qalo la ooyo)\b/i, r: "Waa Basasha (Onion). Diyaar ma u tahay hal-xiraale kale?" },
  { p: /\b(ilko( leh)? laakiin aan( waxba)? qaniini karin)\b/i, r: "Waa Shanlada (Comb). Mid kale ma isku daynaa?" },
  { p: /\b(lugo( leh)? laakiin aan( socon|socod)? karin)\b/i, r: "Waa Miiska ama Kursiga. Su'aal kale ma haysaa?" },
  { p: /\b(mar walba( soo)? dh(o|a)waada laakiin aan( waligiis)? imaan(in)?)\b/i, r: "Waa Berrito (Tomorrow). Macquul sow maaha?" },

  // Student Knowledge - General Science & Biology
  { p: /\b(waa maxay biology|what is biology)\b/i, r: "Biology (Bayoolaji) waa cilmiga barashada nolosha iyo noolaha (living organisms), sida dhirta, xayawaanka, iyo dadka. Qaybtee ka mid ah Biology-ga ayaad rabtaa inaad fahamto?" },
  { p: /\b(waa maxay chemistry|what is chemistry)\b/i, r: "Chemistry (Kimistari) waa barashada curiyayaasha (elements) iyo sida ay u falgalaan (chemical reactions). Ma inaan wax kaaga sheego Atom-ka baad doonaysaa?" },
  { p: /\b(waa maxay physics|what is physics)\b/i, r: "Physics (Fisigis) waa cilmiga barashada dabeecadda, tamarta (energy), dhaqdhaqaaqa (motion), iyo awoodda. Tusaale ma kaaga bixiyaa tamarta?" },
  { p: /\b(waa maxay science|what is science)\b/i, r: "Science waa cilmi baaris nidaamsan oo daraaseeya koonka annaga oo adeegsanayna tijaabooyin iyo u-kuurgalid. Waa maxay maadada Sayniska ee ugu xiisaha badan agtaada?" },
  { p: /\b(photosynthesis)\b/i, r: "Photosynthesis waa habka ay dhirtu iftiinka qorraxda ugu beddesho cunto iyo tamar (oxygen + glucose). Ma doonaysaa faahfaahin dheeri ah?" },

  // Student Knowledge - Math
  { p: /\b(waa maxay xisaab|what is math|what is mathematics)\b/i, r: "Xisaabtu (Mathematics) waa cilmiga barashada tirooyinka, tirada, cabbirka, iyo qaababka. Gacan ma kaa siiyaa leyliyo xisaabeed?" },
  { p: /\b(maxaa ugu horeeya xisaabta)\b/i, r: "Xisaabta waxaa aasaas u ah afar calaamadood: Isugayn (+), Kalagoyn (-), Iskudhufasho (×), iyo Iskuqaybin (÷). Tusaale xisaabeed ma inaan wada xalinaa?" },
  { p: /\b(area of circle|formula)\b/i, r: "Qaacidada loo isticmaalo bedka goobada (Area of a circle) waa A = π × r² (Pi markii lagu dhufto gacanta oo laba labeysan). Ma kuu xalliyaa hal tusaale?" },

  // Student Knowledge - Technology & Computer Science
  { p: /\b(waa maxay computer|what is a computer)\b/i, r: "Computer-ku waa mishiin elektaroonig ah oo xogta (data) qaata, habeeya, kaydiya, jawaabna ka soo saara (output). Ma kuu sheegaa qaybaha uu ka kooban yahay?" },
  { p: /\b(computer.*ugu hore(eyey|ysay)|ugu hore(eyey|ysay).*computer|first computer|computer history)\b/i, r: "Ereyga **computer-kii ugu horreeyey** hal jawaab oo keliya ma laha, sababtoo ah taariikhyahannadu waxay ku kala qeexaan *programmable*, *electronic*, iyo *general-purpose*. **ENIAC**—oo laga sameeyey Jaamacadda Pennsylvania—waxaa la dhammaystiray 1945, dadweynahana loo soo bandhigay Febraayo 1946; si ballaaran ayaa loogu tixgeliyaa kombiyuutarkii elektaroonigga ahaa ee guud ahaan barnaamij loo samayn karo. Waxaa ka horreeyey mashiinno kale sida Z3 iyo Colossus. Deep Research ku weydii haddii aad rabto jadwal taariikheed iyo ilo." },
  { p: /\b(qaybaha (computer|kombiyuut)|computer parts|parts of (a )?computer|computer components)\b/i, r: "**Computer-ku wuxuu ka kooban yahay laba qaybood oo waaweyn:**\n\n1. **Hardware** — waa qaybaha la taaban karo, sida keyboard, mouse, monitor, CPU, iyo hard disk.\n\n2. **Software** — waa barnaamijyada iyo amarada computer-ka shaqaysiiya, sida Windows, Linux, Microsoft Word, iyo apps-ka." },
  { p: /\b(waa maxay software|what is software)\b/i, r: "Software waa barnaamijyada ama amarada loo meereeyo computer-ka si uu shaqo u qabto (sida Windows ama Apps-ka). Ma doonaysaa inaad barato barmaamijyada?" },
  { p: /\b(waa maxay hardware|what is hardware)\b/i, r: "Hardware waa qalabka la taaban karo ee computer-ka, sida Shaashadda, Keyboard-ka, iyo Motherboard-ka. Fahan dheeri ah ma u baahantahay?" },
  { p: /\b(waa maxay ict|what is ict)\b/i, r: "ICT waxaa laga soo gaabiyay (Information and Communication Technology), waana adeegsiga tignoolajiyada isgaarsiinta si xogta loo gudbiyo, loo kaydiyo loona xalliyo. Waa maxay xirfadda aad adigu jeceshahay e ICT-ga?" },
  { p: /\b(taariikhda ict|ict history|goorm(a|ee).*ict|xili(maa|mee).*ict|erayga ict|asal(ka|kii).*ict|ict origin)\b/i, r: "**ICT** waa eray Ingiriisi ah: *Information and Communication Technology*. Wuxuu isku daraa **IT** (xogta iyo kombiyuutarrada) iyo **communication technology** (telefoon, raadiye, shabakado, internet). Ma jiro hal sannad oo keliya oo dunidu ku heshiisay in erayga ICT la bilaabay; IT-ga casriga ah ayaa la isticmaalayay qarnigii 20aad, halka ICT si weyn ugu faaftay waxbarashada iyo siyaasadaha tignoolajiyada intii ay shabakadaha iyo internet-ku kobcayeen 1990-meeyadii iyo wixii ka dambeeyey. Haddii aad rabto taariikh sax ah oo tixraacyo leh, dooro Deep Research." },
  { p: /\b(waa maxay types of ict|what are types of ict|qaybaha ict)\b/i, r: "Waxaa ka mid ah: Web Development, Software Engineering, Cybersecurity, Networking, Database Administration, iyo Graphic Design. Midkee baad doonaysaa inaad barato?" },

  // Student Knowledge - Geography
  { p: /\b(imisa qaaradood|qaaradaha aduunka|how many continents)\b/i, r: "Adduunku wuxuu ka kooban yahay 7 qaaradood: Afrika, Aasiya, Yurub, Waqooyiga Ameerika, Koonfurta Ameerika, Australia/Oceania, iyo Antarktika. Qaaradee ugu dad badan malaa garan kartaa?" },
  { p: /\b(imisa meere|how many planets)\b/i, r: "Bahda qoraxda (Solar System) waxay ka kooban tahay 8 meere: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, iyo Neptune. Meerehee nooluhu ku nool yahay ayaad garanaysaa?" },

  // --- KORDHINTA CUSUB END KNOWLEDGE BEYOND (ADDITIONS) ---

  // Historical Knowledge (Somaliland & World)
  { p: /\b(ma taqaanaa somaliland|waa maxay somaliland|somaliland)\b/i, r: "Haa, Somaliland waa dawlad madax-bannaan oo ku taal Geeska Afrika, caasimadeeduna waa Hargeysa. Waxay dib ula soo noqotay gooni-isu-taaggeeda 1991. Dhinacee baad rabtaa inaan kaaga warbixiyo: Taariikhda, Gobolada, mise Dhaqaalaha?" },
  { p: /\b(taariikhda somaliland|somaliland history|goormay somaliland gumeystaha heshay)\b/i, r: "Somaliland waxay maxmiyada Ingiriiska (British Somaliland Protectorate) noqotay 1884-kii, waxayn xornimada ka qaadatay 26-kii June 1960. Ma doonaysaa inaan kaaga sheekeeyo halgamadii kala duwanaa?" },
  { p: /\b(snm|dhaqdhaqaaqii snm|somali national movement)\b/i, r: "SNM (Somali National Movement) waxa la aasaasay April 1981, waxaanay ahayd jabhaddii xoreysay Somaliland kadib halgan dheer iyo dagaalo dhexmaray taliskii Siyaad Barre. Su'aal kale oo halgankaas ku saabsan ma haysaa?" },
  { p: /\b(dagaalkii koowaad ee adduunka|first world war|ww1)\b/i, r: "Dagaalkii Koowaad ee Adduunka (WWI) wuxuu soo bilowday 1914 wuxuuna dhammaaday 1918. Waxa ku dhintay in ka badan 16 milyan oo qof. Ma rabtaa inaan kuu sheego ciddii isku dhacday?" },
  { p: /\b(dagaalkii labaad ee adduunka|second world war|ww2)\b/i, r: "Dagaalkii Labaad ee Adduunka (WWII) wuxuu socday intii u dhaxaysay 1939 ilaa 1945, waana dagaalkii ugu khasaaraha badnaa taariikhda aadanaha. Ma u baahantahay sababihii keenay dagaalkaas?" },
  { p: /\b(taariikhda adduunka|world history|dhismaha ahraamta)\b/i, r: "Taariikhda bini-aadamku aad ayay u qoto dheer tahay. Waxyaabaha ugu waaweyn waxaa ka mid ah: ilbaxnimooyinkii hore ee Masar, Giriigga, iyo Islaamka. Maxaa kuugu xiiso badan taariikhda?" },
  { p: /\b(degmooyinka hargeysa|inta degmo( ee)? hargeysa|degmooyinka caasimada|degmada hargeysa)\b/i, r: "Caasimadda Hargeysa waxay ka kooban tahay sagal (9) degmo, waana kuwan: \n1. Maxamuud Haybe\n2. Axmed Dhagax\n3. 26 June\n4. Gacan Libaax\n5. Maxamed Mooge\n6. Ibraahim Koodbuur\n7. Macalin Haaruun\n8. Gacan Madaare\n9. Kacaan.\n\nMidkee ayaad diiradda saari lahayd?" },
  { p: /\b(caasimadaha caalamka|wadamada caasimadahooda)\b/i, r: "Haa! dal kasta iyo caasimadiisa waan garanayaa, xitaa in English ah. Tusaale ahaan: Washington D.C (USA), London (UK), Paris (France), Canberra (Australia). Wadankee caasimadiisa baad rabtaa inaan kuu sheego?" },

  // World Capitals
  { p: /\b(caasimada ameerika|caasimada usa|capital of usa|capital of america)\b/i, r: "Caasimadda Maraykanka (USA) waa **Washington D.C** (District of Columbia). Ma doonaysaa wax faahfaahin ah oo ku saabsan magaaladaan?" },
  { p: /\b(caasimada ingiriiska|capital of uk|capital of england)\b/i, r: "Caasimadda Ingiriiska (UK) waa **London**. Waxay ku taallaa webiga Thames, waana mid ka mid ah magaalooyinka ugu waaweyn ee adduunka. Su'aal kale ma qabtaa?" },
  { p: /\b(caasimada faransiiska|capital of france)\b/i, r: "Caasimadda Faransiiska (France) waa **Paris**, oo sidoo kale loo yaqaan 'Magaalada Jacaylka'. Waxaa lagu yaqaannaa Burujka Eiffel. Ma doonaysaa wax kale?" },
  { p: /\b(caasimada shiinaha|capital of china)\b/i, r: "Caasimadda Shiinaha (China) waa **Beijing** (Bayjing), oo ah xarunta siyaasadeed. Magaalada ugu dadka badanna waa Shanghai. Su'aal kale ma qabtaa?" },
  { p: /\b(caasimada sacuudiga|capital of saudi arabia)\b/i, r: "Caasimadda Sacuudiga waa **Riyadh (Riyaad)**. Waxay ku taallaa bartamaha Jaziiradda Carabta. Su'aal kale ma qabtaa?" },
  { p: /\b(caasimada kenya|capital of kenya)\b/i, r: "Caasimadda Kenya waa **Nairobi**. Waxay wadaagta xuduudka Soomaaliya dhinaca koonfureed. Su'aal kale ma qabtaa?" },
  { p: /\b(caasimada ethiopia|caasimada itoobiya|capital of ethiopia)\b/i, r: "Caasimadda Itoobiya waa **Addis Ababa (Finfinnee)**. Waxay sidoo kale xarun u tahay Midowga Afrika (AU). Su'aal kale ma qabtaa?" },
  { p: /\b(caasimada turkiga|capital of turkey|capital of turkiye)\b/i, r: "Caasimadda Turkiga waa **Ankara** — Istanbul oo ay badanaa la wareegsadaan ma aha caasimadda laakiin waa magaalada ugu weyn. Su'aal kale ma qabtaa?" },

  // General Knowledge - Who is / What is
  { p: /\b(waa kuma elon musk)\b/i, r: "**Elon Musk** waa ganacsade iyo injineer uu dhalay Afrika Koonfureed (South Africa). Wuxuu leeyahay shirkadaha ugu caansan sida **Tesla** (baabuurta korontada), **SpaceX** (gaadiidka hawada), iyo **X** (hore Twitter). Wuxuu u arkaa inaan bani-aadamku noqdaan siwada laba-meeleed (Earth + Mars). Su'aal kale ma qabtaa?" },
  { p: /\b(waa kuma bill gates)\b/i, r: "**Bill Gates** waa aasaasihii shirkadda **Microsoft**, waana mid ka mid ah ragga ugu hodan badan taariikhda. Hadda wuxuu ku shaqeeyaa deeq-sinnaanshaha (philanthropy) iyada oo loo marayo Bill & Melinda Gates Foundation. Su'aal kale ma qabtaa?" },
  { p: /\b(waa kuma mark zuckerberg)\b/i, r: "**Mark Zuckerberg** waa aasaasihii iyo xogtageerihii shirkadda **Meta** (hore Facebook). Wuxuu aasaasay Facebook 2004-kii isagoo ardaygii jaamacadda ahaa. Meta waxay maanta leedahay Facebook, Instagram, iyo WhatsApp. Su'aal kale ma qabtaa?" },
  { p: /\b(waa maxay ai|artificial intelligence|waa maxay garashada macmalka)\b/i, r: "**AI (Artificial Intelligence)** ama Garashada Macmalka waa faanka samaynta nidaamyo kombiyuutar ah oo awooday inay qabtaan hawlo u baahan fekerka aadanaha — sida hadalka, muuqaalka iyo xalinta dhibaatooyinka. GOLLISGPT (kaas oo aad hadda kula hadlaysid) waa tusaale AI ah. Su'aal kale ma qabtaa?" },
  { p: /\b(internet|waa maxay internet)\b/i, r: "**Internet** waa shabakad caalami ah oo isku xidha kombiyuutarada, taleefanada, iyo kombiyuutarada adduunka oo dhan. Waxay u oggolaanaysaa dadka inay wadaagaan macluumaadka, xiriiraan, kana helaan adeegyada online-ka. Su'aal kale ma qabtaa?" },

  // Religion Knowledge (Islam in Somaliland & General)
  { p: /\b(diinta islaamka|islaamka somaliland|islam in somaliland)\b/i, r: "Diinta Islaamku Somaliland waxay soo gaadhay qarniyadii hore (Qarnigii 7aad) intii uu noolaa Nebi Muxamed (NNKH), gaar ahaan markii asxaabtu u hijroodeen dhulka Xabashida iyo Geeska Afrika. Sidee baad u aragtaa saamaynta diinta ee dhaqankeena?" },
  { p: /\b(imisa tiir ayaa( islaamku)? ka kooban yahay|tiirarka islaamka)\b/i, r: "Islaamku wuxuu ka kooban yahay 5 tiir: Shahaadada, Salaada, Sakada, Soomka, iyo Xajka. Keebaa rabtaa inaan si fidisan kaaga jawabo?" },
  { p: /\b(tiirarka iimaanka|imisa tiir( weeye)? iimaanku)\b/i, r: "Iimaanku waa lix tiir: Rumaynta Ilaahay, Malaa'igtiisa, Kutubtiisa, Rusushiisa, Maalinta Qiyaame, iyo Qadarta khayr iyo shar waxa ay leedahay. Fahan dheeri ah ma uga baahantahay tafsiirka?" },
  { p: /\b(waa kuma nebigii ugu dambeeyay|khatamul anbiyaa)\b/i, r: "Nebiga ugu dambeeyay rususha iyo nebiyada Ilaahay waa Nebi Muxamed (Nabad iyo Naxariisi Korkiisa Ha Ahaato). Su'aal taariikhdiisa ku saabsan ma ii haysaa?" },
  { p: /\b(quraanka kariimka|imisa jis( ayuu)? ka kooban yahay quraanku)\b/i, r: "Quraanka Kariimka ah wuxuu ka kooban yahay 30 Jis, 114 Suuradood, iyo in ka badan 6,000 oo aayadood. Suuradee ugu dheer ayaad garan kartaa?" },
  { p: /\b(magaaladii ugu horeysay ee diinta islaamku|saylac islaamka|masjidka qiblatayn)\b/i, r: "Magaalada Saylac waxa ku yaala masjidka Qiblatayn, waana mid ka mid ah meelihii ugu horreeyay ee diinta Islaamku ka hana qaaday guud ahaan qaarada Afrika. Ma doonaysaa taariikhda Saylac inaan kuu kordhiyo?" },

  // Health Knowledge
  { p: /\b(caafimaadka|waa maxay caafimaad|health|what is health)\b/i, r: "Caafimaadku waa fayoobi dhammaystiran ee dhanka jidhka, maskaxda, iyo xidhiidhka bulshada, ee ma aha oo kaliya inaan cudur ku hayn. Talo caafimaad miyaad u baahantahay?" },
  { p: /\b(sida loo ilaaliyo caafimaadka|talada caafimaadka|how to stay healthy)\b/i, r: "Si aad u ilaaliso caafimaadkaaga: cun cunto dheeli tiran, cab biyo badan, seexo ugu yaraan 7-8 saacadood, samee jimicsi, hana ka welwelin waxyaabaha aanad xalin karin. Kee baad is leedahay wuu kugu adag yahay inaad samayso?" },
  { p: /\b(fayfitamiin|vitamins|waxtarka vitamin)\b/i, r: "Fiitamiinadu (Vitamins) waa nafaqooyin jidhku u baahan yahay si uu u koro uguna shaqeeyo si dabiici ah. Sida Vit C oo difaaca jidhka kor u qaada iyo Vit D oo lafaha adkeeya. Macluumaad noocee ah ayaad fiitamiinada ka rabtaa?" },
  { p: /\b(xanuunka sokorta|macaanka|diabetes)\b/i, r: "Xanuunka macaanka (Diabetes) wuxuu yimaadaa marka jidhku uusan soo saari karin insulin ku filan ama uusan u isticmaali karin si sax ah, taasoo keenta in sonkortu dhiigga ku badato. Ma rabtaa inaad ogaato qaababka looga hortagi karo?" },
  { p: /\b(dhiig karka|hypertension|blood pressure)\b/i, r: "Dhiig-karku waa xaalad uu cadaadiska dhiigga ee maraya halbowlayaasha uu aad u sarreeyo. Waxaa fiican in milixda la dhimo lagana fogaado stress-ka. Su'aal kale ma ka qabtaa xanuunadan?" },

  // Geography & World
  { p: /\b(wadamada ugu waaweyn|wadanka ugu weyn aduunka)\b/i, r: "Waddanka adduunka ugu bedka weyn waa Ruushka (Russia), waxaana ku xiga Kanada iyo Shiinaha. Waddanka ugu dadka badanna hadda waa Hindiya (India) oo dhaaftay Shiinaha. Su'aal kale ma qabtaa?" },
  { p: /\b(badaha aduunka|badweynta|oceans)\b/i, r: "Adduunku wuxuu leeyahay shanta badweynood (Oceans): Pacific, Atlantic, Indian, Southern, iyo Arctic. Badweynta Baasifiga (Pacific) ayaa ugu weyn uguna qoto dheer. Mida Somaliland xeebteeda marta baad ogtahay?" },
  { p: /\b(heerkulka aduunka|cimilada|climate change)\b/i, r: "Cimilada adduunka ayaa is beddesha (Climate Change) sababtoo ah wasakhaynta hawada iyo xaalufinta dhirta oo keena in kulaylka dhulku kordho. Muxuu yahay doorkaaga ku aadan ilaalinta deegaanka?" },

  // Social Knowledge & General 
  { p: /\b(dhaqanka somaalida|somaliland culture|social knowledge)\b/i, r: "Dhaqanka Soomaalida, gaar ahaan Somaliland, wuxuu ku qotomaa martigelinta, tixgelinta odayaasha, xoolo dhaqashada, iyo islaannimada. Waxaana lagu yaqaanaa suugaanta sida gabayga, heesaha, iyo buraanburka. Ma jeceshahay suugaanta?" },
  { p: /\b(gabayga|suugaanta|waa maxay gabay)\b/i, r: "Gabaygu waa shaqo-suugaaneed oo leh miisaan, jiib iyo jaad u gaar ah, waana mid ka mid ah waxyaabaha hidaha iyo dhaqanka kaga jira meel aad u sarreysa. Qof gabayaa ah miyaad taqaanaa gobolkaaga?" },
  { p: /\b(waa maxay dawlad|dawladnimada)\b/i, r: "Dawladdi waa nidaam bulsho ku heshiisay in ay u samaystaan shuruuc, maamul, iyo kala dambayn si ay u helaan amni, cadaalad, iyo horumar midayaysan. Maxaa dawlad wanaagsan sameeya, adiga aragtidaada?" }
];

function fallbackReply(userText) {
  const prompt = userText.toLowerCase();
  const normalizedPrompt = normalize(userText); // Keeps formatting standard

  // Leadership and political offices change; do not present a stored answer as current fact.
  if (/\b(madaxweynaha somaliland|current (president|leader|prime minister)|hogaamiyaha hadda|hoggaamiyaha hadda|madaxweynaha hadda)\b/i.test(normalizedPrompt)) {
    return "Jagada hoggaamiyaha iyo siyaasadda way isbeddeli karaan. Dooro **Deep Research** si GOLLISGPT uga hubiyo ilo cusub oo ay ku jiraan Google marka la dejiyo, kadibna kuugu soo celiyo jawaab taariikh leh iyo tixraacyo.";
  }

  for (let qa of qaList) {
    if (qa.p.test(normalizedPrompt) || qa.p.test(prompt)) return qa.r;
  }

  // Greetings
  if (/\b(asc|salaamu calaykum|asalaamu calaykum|hi|hello|hey)\b/i.test(normalizedPrompt)) return "Wa calaykumu salaam, waan fiicanahay! Arday, maxaan kaa caawin karaa maanta ama casharkee ayaan wada eegnaa?";
  if (/\b(seed tahay|sidee tahay|waran|how are you)\b/i.test(normalizedPrompt)) return "Waan fiicanahay ee adigu sidee tahay? Ma jeceshahay inaan ka jawaabo su'aalahaaga waxbarasho ee maanta?";
  if (/\b(mahadsanid|waad mahadsantahay|thanks|thank you)\b/i.test(normalizedPrompt)) return "Adigaa mudan! Hadaad su'aal kale ood igu tababaranayso hayso, i weydii?";

  if ((prompt.includes("html") || prompt.includes("css")) && state.activeTool !== "code") {
    return "Haa, HTML waa dhismaha website-ka, CSS-kuna waa qurxinta. Ma rabtaa inaan hoos kuugu qoro code tusaale ah oo aad copy garaysato?";
  }
  if (state.activeTool === "code") {
    return localCodeLibrary(userText);
  }
  if (state.activeTool === "image") {
    return "Adigoo sawir u abuuraya mashaariicdaada, ii sharax sawirkee ayaan kuu sameeyaa?";
  }
  if (state.activeTool === "research") {
    return "Deep Research wuxuu diyaarinayaa warbixin ku salaysan ilo raadis ah. Haddii aad rabto faahfaahin ka badan, isku day inaad su'aasha si gaar ah u qeexdo.";
  }
  return "Wacan! Sideen kaaga caawin karaa su'aashaada?";
}

function localCodeLibrary(q) {
  const t = q.toLowerCase();

  // ─── HTML ───────────────────────────────────────────────
  if (t.includes("html")) {
    if (t.includes("array") || t.includes("liis") || t.includes("list")) return `<!-- HTML Arrays/Lists (Unordered & Ordered) -->
<ul>
  <li>Tufaax (Apple)</li>
  <li>Moos (Banana)</li>
  <li>Canbe (Mango)</li>
</ul>

<ol>
  <li>Tallaabada 1aad</li>
  <li>Tallaabada 2aad</li>
</ol>

<!-- HTML Table (Arrays in 2D / Grid) -->
<table>
  <tr>
    <th>Magaca</th>
    <th>Da'da</th>
  </tr>
  <tr>
    <td>Cali</td>
    <td>22</td>
  </tr>
</table>`;

    if (t.includes("class") || t.includes("id")) return `<!-- HTML Classes & IDs (Styling Hooks) -->
<!-- Class: Waa la wadaagi karaa (Multiple elements) -->
<div class="card card-primary">
  <h2 class="title">Cinwaanka</h2>
  <p class="description">Qoraalka...</p>
</div>

<!-- ID: Waa mid gaar ah (Unique string/element) -->
<form id="loginForm">
  <div class="form-group">
    <label for="username">Magaca:</label>
    <input type="text" id="username" class="input-field">
  </div>
  <button id="submitBtn" class="btn">Gudbi</button>
</form>`;

    if (t.includes("method") || t.includes("form")) return `<!-- HTML Methods (Forms GET/POST) -->
<!-- POST Method: Xog sir ah -->
<form action="/login" method="POST">
  <input type="text" name="user" placeholder="Isticmaale">
  <input type="password" name="pass" placeholder="Fure">
  <button type="submit">Geliso (Login)</button>
</form>

<!-- GET Method: Raadin/Search (URL Params) -->
<form action="/search" method="GET">
  <input type="text" name="q" placeholder="Raadi...">
  <button type="submit">Raadi (Search)</button>
</form>`;

    return `<!-- HTML Basic Syntax & Boilerplate -->
<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website-kayga</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Header -->
  <header>
    <h1>Ku soo dhawoow Website-kayga</h1>
  </header>

  <!-- Main Content -->
  <main>
    <section id="about">
      <h2>Nagu Saabsan</h2>
      <p>Kani waa tusaale HTML ah oo fudud.</p>
    </section>
  </main>
</body>
</html>`;
  }

  // ─── PYTHON ───────────────────────────────────────────────
  if (t.includes("python")) {
    if (t.includes("calculator") || t.includes("xisaab")) return `# Python Calculator
def add(a, b): return a + b
def subtract(a, b): return a - b
def multiply(a, b): return a * b
def divide(a, b): return a / b if b != 0 else "Error: Division by zero"

print(add(10, 5))       # 15
print(subtract(10, 5))  # 5
print(multiply(10, 5))  # 50
print(divide(10, 5))    # 2.0`;

    if (t.includes("list") || t.includes("liis") || t.includes("array")) return `# Python Lists & Methods
fruits = ["apple", "banana", "mango"]

fruits.append("orange")      # Add to end
fruits.insert(1, "grape")    # Insert at index
fruits.remove("banana")      # Remove by value
fruits.sort()                # Sort list
fruits.reverse()             # Reverse list

print(len(fruits))           # Length
print(fruits[0])             # First item
print(fruits[-1])            # Last item
print(fruits[1:3])           # Slice`;

    if (t.includes("class") || t.includes("oop")) return `# Python Class & OOP
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}"

    def __str__(self):
        return f"Animal: {self.name}"

class Dog(Animal):
    def fetch(self):
        return f"{self.name} fetches the ball!"

dog = Dog("Rex", "Woof")
print(dog.speak())   # Rex says Woof
print(dog.fetch())   # Rex fetches the ball!`;

    if (t.includes("function") || t.includes("def") || t.includes("hawl")) return `# Python Functions & Methods
def greet(name, greeting="Hello"):
    """Greet a person."""
    return f"{greeting}, {name}!"

def add_numbers(*args):
    """Sum any number of values."""
    return sum(args)

def user_info(**kwargs):
    """Print keyword arguments."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print(greet("Ali"))                     # Hello, Ali!
print(greet("Ali", "Hi"))               # Hi, Ali!
print(add_numbers(1, 2, 3, 4, 5))      # 15
user_info(name="Ali", age=22, city="Hargeysa")`;

    return `# Python Basic Syntax & Methods
# Variables & Types
name = "Ali"
age = 22
height = 1.75
is_student = True

# String Methods
print(name.upper())        # ALI
print(name.lower())        # ali
print(name.replace("A","O"))  # Oli
print(len(name))           # 3

# Control Flow
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")

# Loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 3:
    print(count)
    count += 1`;
  }

  // ─── JAVASCRIPT ───────────────────────────────────────────
  if (t.includes("javascript") || t.includes("js") || (t.includes("script") && !t.includes("c#") && !t.includes("php"))) {
    if (t.includes("array") || t.includes("liis")) return `// JavaScript Array Methods
const fruits = ["apple", "banana", "mango"];

fruits.push("orange");       // Add to end
fruits.unshift("grape");     // Add to start
fruits.pop();                // Remove last
fruits.shift();              // Remove first
fruits.splice(1, 1);         // Remove at index

const doubled = [1,2,3].map(n => n * 2);      // [2,4,6]
const evens = [1,2,3,4].filter(n => n % 2 === 0); // [2,4]
const sum = [1,2,3].reduce((acc, n) => acc + n, 0); // 6

console.log(fruits.includes("apple")); // true
console.log(fruits.join(", "));        // apple, banana`;

    if (t.includes("class") || t.includes("oop")) return `// JavaScript Class & OOP
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  speak() {
    return \`\${this.name} says \${this.sound}\`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
  }
  fetch() {
    return \`\${this.name} fetches the ball!\`;
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());  // Rex says Woof
console.log(dog.fetch());  // Rex fetches the ball!`;

    if (t.includes("async") || t.includes("fetch") || t.includes("promise")) return `// JavaScript Async / Fetch / Promise
// Promise
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 1000);
});

myPromise.then(result => console.log(result)); // Done!

// Async/Await + Fetch
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getData("https://api.example.com/users").then(data => console.log(data));`;

    return `// JavaScript Basic Syntax & Methods
// Variables
const name = "Ali";
let age = 22;

// String Methods
console.log(name.toUpperCase());     // ALI
console.log(name.includes("A"));     // true
console.log(name.replace("A","O"));  // Oli
console.log(\`Hello \${name}!\`);       // Hello Ali!

// Array
const nums = [3, 1, 4, 1, 5];
nums.sort((a,b) => a - b);
console.log(nums); // [1,1,3,4,5]

// Function (Arrow)
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("Ali")); // Hello, Ali!

// Object
const user = { name: "Ali", age: 22 };
console.log(Object.keys(user));   // ["name","age"]
console.log(Object.values(user)); // ["Ali", 22]`;
  }

  // ─── PHP ──────────────────────────────────────────────────
  if (t.includes("php")) {
    if (t.includes("array") || t.includes("liis")) return `<?php
// PHP Array Methods
$fruits = ["apple", "banana", "mango"];

array_push($fruits, "orange");       // Add to end
array_unshift($fruits, "grape");     // Add to start
array_pop($fruits);                  // Remove last
array_shift($fruits);                // Remove first

sort($fruits);                       // Sort ascending
rsort($fruits);                      // Sort descending
$reversed = array_reverse($fruits);  // Reverse

echo count($fruits);                 // Length
echo implode(", ", $fruits);         // Join as string
echo in_array("apple", $fruits);     // Check if exists

// Array Map & Filter
$nums = [1, 2, 3, 4, 5];
$doubled = array_map(fn($n) => $n * 2, $nums);    // [2,4,6,8,10]
$evens = array_filter($nums, fn($n) => $n % 2 === 0);
?>`;

    if (t.includes("class") || t.includes("oop")) return `<?php
// PHP Class & OOP
class Animal {
  public string $name;
  protected string $sound;

  public function __construct(string $name, string $sound) {
    $this->name = $name;
    $this->sound = $sound;
  }

  public function speak(): string {
    return "{$this->name} says {$this->sound}";
  }
}

class Dog extends Animal {
  public function __construct(string $name) {
    parent::__construct($name, "Woof");
  }
  public function fetch(): string {
    return "{$this->name} fetches the ball!";
  }
}

$dog = new Dog("Rex");
echo $dog->speak();   // Rex says Woof
echo $dog->fetch();   // Rex fetches the ball!
?>`;

    return `<?php
// PHP Basic Syntax & Methods
$name = "Ali";
$age  = 22;

// String Methods
echo strtoupper($name);          // ALI
echo strtolower($name);          // ali
echo strlen($name);              // 3
echo str_replace("A","O",$name); // Oli
echo "Hello, $name!";            // Hello, Ali!

// Control Flow
if ($age >= 18) {
  echo "Adult";
} elseif ($age >= 13) {
  echo "Teen";
} else {
  echo "Child";
}

// Loop
for ($i = 0; $i < 5; $i++) {
  echo $i;
}

// Function
function greet(string $name): string {
  return "Hello, $name!";
}
echo greet("Ali");
?>`;
  }

  // ─── C# ───────────────────────────────────────────────────
  if (t.includes("c#") || t.includes("csharp") || t.includes("c sharp")) {
    if (t.includes("list") || t.includes("array")) return `// C# List & Array Methods
using System;
using System.Collections.Generic;
using System.Linq;

List<string> fruits = new() { "apple", "banana", "mango" };

fruits.Add("orange");           // Add to end
fruits.Insert(1, "grape");      // Insert at index
fruits.Remove("banana");        // Remove by value
fruits.Sort();                  // Sort
fruits.Reverse();               // Reverse

Console.WriteLine(fruits.Count);              // Length
Console.WriteLine(fruits.Contains("apple")); // true
Console.WriteLine(string.Join(", ", fruits)); // Join

// LINQ
var nums = new List<int> { 1, 2, 3, 4, 5 };
var evens = nums.Where(n => n % 2 == 0).ToList();  // [2,4]
var doubled = nums.Select(n => n * 2).ToList();     // [2,4,6,8,10]
var sum = nums.Sum();  // 15`;

    if (t.includes("class") || t.includes("oop")) return `// C# Class & OOP
public class Animal {
  public string Name { get; set; }
  protected string Sound { get; set; }

  public Animal(string name, string sound) {
    Name = name;
    Sound = sound;
  }

  public virtual string Speak() => $"{Name} says {Sound}";
}

public class Dog : Animal {
  public Dog(string name) : base(name, "Woof") { }

  public override string Speak() => $"{Name} barks: {Sound}!";
  public string Fetch() => $"{Name} fetches the ball!";
}

var dog = new Dog("Rex");
Console.WriteLine(dog.Speak());   // Rex barks: Woof!
Console.WriteLine(dog.Fetch());   // Rex fetches the ball!`;

    return `// C# Basic Syntax & Methods
using System;

string name = "Ali";
int age = 22;
double height = 1.75;
bool isStudent = true;

// String Methods
Console.WriteLine(name.ToUpper());         // ALI
Console.WriteLine(name.ToLower());         // ali
Console.WriteLine(name.Replace("A","O"));  // Oli
Console.WriteLine(name.Length);            // 3
Console.WriteLine($"Hello, {name}!");      // Hello, Ali!

// Control Flow
if (age >= 18) Console.WriteLine("Adult");
else Console.WriteLine("Minor");

// Loop
for (int i = 0; i < 5; i++) Console.WriteLine(i);

// Method
static string Greet(string n) => $"Hello, {n}!";
Console.WriteLine(Greet("Ali"));`;
  }

  // ─── HTML/CSS ─────────────────────────────────────────────
  if (t.includes("html") || t.includes("css") || t.includes("website") || t.includes("webpage")) {
    if (t.includes("array") || t.includes("function") || t.includes("method")) {
      return `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <title>HTML + JS Arrays & Methods</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #1e1e2f; color: #fff; }
    button { padding: 10px; background: #e94560; color: white; border: none; border-radius: 5px; cursor: pointer; }
    #output { margin-top: 15px; padding: 15px; background: #16213e; border-radius: 8px; }
  </style>
</head>
<body>
  <h2>Arrays & Functions Gudaha HTML</h2>
  <button onclick="showFruits()">Tus Liiska (Array)</button>
  <div id="output"></div>

  <script>
    // 1. Array (Liis)
    const fruits = ["Tufaax", "Moos", "Liin"];

    // 2. Function (Hab)
    function showFruits() {
      // 3. Array Methods (push, map, join)
      fruits.push("Canab"); // Ku dar
      
      const formatted = fruits.map(f => "<li>" + f + "</li>").join("");
      
      // Soo bandhig (DOM Method)
      document.getElementById("output").innerHTML = "<ul>" + formatted + "</ul>";
    }
  </script>
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html lang="so">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Website</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: #eee; display: grid; place-items: center; min-height: 100vh; }
    .card { background: #16213e; padding: 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,.4); max-width: 400px; width: 90%; text-align: center; }
    h1 { color: #e94560; font-size: 2rem; margin-bottom: 1rem; }
    p  { color: #a0aec0; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 1.5rem; padding: .75rem 2rem; background: #e94560; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: background .3s; }
    .btn:hover { background: #c73652; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Ku Soo Dhawoow!</h1>
    <p>Kani waa tusaale website ah oo leh CSS qurxoon.</p>
    <button class="btn" onclick="alert('Waad riixday!')">Riix</button>
  </div>
</body>
</html>`;
  }

  // ─── SQL ──────────────────────────────────────────────────
  if (t.includes("sql") || t.includes("database") || t.includes("query")) {
    return `-- SQL Basic Syntax & Methods

-- Create Table
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  age INT,
  city VARCHAR(50),
  grade DECIMAL(4,2)
);

-- Insert
INSERT INTO students (name, age, city, grade) VALUES
  ('Ali', 22, 'Hargeysa', 90.5),
  ('Fadumo', 20, 'Berbera', 85.0);

-- Select all
SELECT * FROM students;

-- Filter
SELECT name, grade FROM students WHERE age > 18;

-- Order
SELECT * FROM students ORDER BY grade DESC;

-- Update
UPDATE students SET grade = 95 WHERE name = 'Ali';

-- Delete
DELETE FROM students WHERE id = 2;

-- Aggregate Functions
SELECT COUNT(*), AVG(grade), MAX(grade), MIN(grade) FROM students;

-- Join (example)
SELECT s.name, c.course_name
FROM students s
INNER JOIN courses c ON s.id = c.student_id;`;
  }

  // ─── JAVA ─────────────────────────────────────────────────
  if (t.includes("java") && !t.includes("javascript")) {
    return `// Java Basic Syntax & OOP
import java.util.*;
import java.util.stream.*;

public class Main {
  // Method
  public static String greet(String name) {
    return "Hello, " + name + "!";
  }

  // Class example
  static class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println(name + " speaks"); }
  }

  public static void main(String[] args) {
    // Variables
    String name = "Ali";
    int age = 22;

    // String Methods
    System.out.println(name.toUpperCase());  // ALI
    System.out.println(name.length());       // 3

    // ArrayList
    List<String> list = new ArrayList<>(Arrays.asList("a","b","c"));
    list.add("d");
    list.remove("a");
    Collections.sort(list);
    System.out.println(list); // [b, c, d]

    // Stream API
    List<Integer> nums = List.of(1,2,3,4,5);
    int sum = nums.stream().mapToInt(Integer::intValue).sum();
    System.out.println(sum); // 15

    // Control
    if (age >= 18) System.out.println("Adult");
    for (int i = 0; i < 5; i++) System.out.println(i);

    // Use method
    System.out.println(greet("Ali"));

    // Use class
    Animal a = new Animal("Cat");
    a.speak();
  }
}`;
  }

  // ─── DEFAULT ──────────────────────────────────────────────
  return `// 💻 Luuqadaha Barnaamijyada Aan Garanayo:
// Python • JavaScript • PHP • C# • Java • HTML/CSS • SQL • TypeScript • C/C++ • Bash

// Si aad code u helto, qor hoos:
// Tusaaleyaal:
//   "Python calculator samee"
//   "JavaScript array methods"
//   "PHP class OOP"
//   "C# list methods"
//   "SQL database query"
//   "HTML website qurxoon"
//   "Java OOP class"

// Luuqad kee baad rabaa?`;
}

function createImageUrl(prompt) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&width=1024&height=1024`;
}

function stripHtmlTags(text) {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function generateWebResults(queryText) {
  const query = queryText.trim();
  if (!query) return [];
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Web search failed");
  const data = await response.json();
  const items = data?.query?.search || [];
  return items.slice(0, 6).map((item) => ({
    platform: "Wikipedia",
    title: item.title,
    snippet: stripHtmlTags(item.snippet),
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/\s+/g, "_"))}`
  }));
}

async function generateGoogleResults(queryText) {
  const key = state.settings.googleSearchKey;
  const cx = state.settings.googleSearchCx;
  if (!key || !cx) return [];
  const endpoint = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(queryText)}&num=6&safe=active`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Google search failed");
  const data = await response.json();
  return (data.items || []).map((item) => ({
    platform: "Google",
    title: item.title || "Google result",
    snippet: item.snippet || "No summary provided.",
    url: item.link
  }));
}

async function generateOpenAlexResults(queryText) {
  const endpoint = `https://api.openalex.org/works?search=${encodeURIComponent(queryText)}&per-page=4`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("OpenAlex search failed");
  const data = await response.json();
  return (data.results || []).map((item) => {
    const authors = (item.authorships || []).slice(0, 2).map((author) => author.author?.display_name).filter(Boolean).join(", ");
    const year = item.publication_year ? ` (${item.publication_year})` : "";
    return {
      platform: "OpenAlex",
      title: `${item.title || "Academic work"}${year}`,
      snippet: authors ? `Academic source by ${authors}.` : "Academic research source.",
      url: item.doi || item.id
    };
  }).filter((item) => item.url);
}

async function generateCrossrefResults(queryText) {
  const endpoint = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(queryText)}&rows=4&select=DOI,title,author,published-print,published-online,container-title`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Crossref search failed");
  const data = await response.json();
  return (data.message?.items || []).map((item) => {
    const authors = (item.author || []).slice(0, 2).map((author) => [author.given, author.family].filter(Boolean).join(" ")).filter(Boolean).join(", ");
    const publication = item["container-title"]?.[0] || "Academic publication";
    return {
      platform: "Crossref",
      title: item.title?.[0] || "Research publication",
      snippet: `${publication}${authors ? ` — ${authors}` : ""}`,
      url: item.DOI ? `https://doi.org/${item.DOI}` : ""
    };
  }).filter((item) => item.url);
}

async function generateResearchSources(queryText) {
  const searches = await Promise.allSettled([
    generateGoogleResults(queryText),
    generateWebResults(queryText),
    generateOpenAlexResults(queryText),
    generateCrossrefResults(queryText)
  ]);
  const results = searches.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const seen = new Set();
  return results.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).slice(0, 12);
}

function createResearchRequest(query, sources) {
  const sourceDossier = sources.length
    ? sources.map((source, index) => `[${index + 1}] ${source.platform || "Source"}: ${source.title}\n${source.snippet}\n${source.url}`).join("\n\n")
    : "No source summaries were returned. Be transparent about this limitation.";
  return `Research question: ${query}\n\nUse this source dossier as evidence. Do not invent sources, facts, dates, or citations.\n\n${sourceDossier}`;
}

function buildLocalResearchReport(query, sources) {
  if (!sources.length) {
    return `Waxaan isku dayay inaan u helo ilo cilmi-baaris su'aasha: ${query}. Hadda ilo online ah lama helin. Fadlan mar kale isku day adigoo su'aasha si gaar ah u qoraya.`;
  }
  const evidence = sources.map((source, index) => `• [${index + 1}] ${source.platform || "Source"} — ${source.title}: ${source.snippet}`).join("\n");
  return `Warbixin hordhac ah: ${query}\n\nKuwani waa xogaha laga helay ilaha raadinta. Fur ilaha hoose si aad u xaqiijiso faahfaahinta iyo taariikhda, gaar ahaan siyaasadda, hoggaamiyeyaasha, ama wararka isbeddeli kara.\n\n${evidence}`;
}

function buildSystemPrompt() {
  if (state.activeTool === "code") return "You are an expert full-stack software engineer and coding assistant. You know ALL programming languages including Python, JavaScript, TypeScript, HTML, CSS, Java, C, C++, C#, PHP, Swift, Kotlin, Rust, Go, Ruby, SQL, Bash, R, MATLAB, Dart, Lua, and more. Always provide correct, complete, runnable, and well-commented code solutions. If the user writes in Somali, still understand and respond with proper code. Always include explanations in the same language the user used.";
  if (state.activeTool === "image") return "You are an image prompt assistant. Generate clear prompt guidance.";
  if (state.activeTool === "research") return `You are GOLLISGPT Deep Research. The selected focus is ${state.activeTopic}. Write a careful, structured research report in the user's language. Cover the direct answer, important context, a balanced analysis, and key takeaways. Compare the supplied sources; give more weight to primary, official, or peer-reviewed sources, and state material uncertainty or disagreement. Cite the supplied source dossier with [1], [2] notation only where it supports the statement. For current politics, leaders, health, laws, figures, or breaking events, include a date or clearly say that the claim needs a current-source check. Never diagnose illness or present educational health information as personal medical advice.`;
  return `You are GOLLISGPT, a dependable university knowledge assistant. The user's selected focus is ${state.activeTopic}. Answer questions across ICT and technology, general knowledge, health education, geography, history, politics, continents, countries, cities, world leaders, and regions of the world. Respond accurately, clearly, and at the right depth. If the user writes Somali, answer in fluent Somali; if English, answer in English. For health, provide educational information and encourage professional care for emergencies or personal diagnosis. For changing facts such as current leaders, politics, laws, prices, and news, give the date of the information or explain that it should be verified with a current source.`;
}

async function apiReply(userText, chat, systemPrompt = buildSystemPrompt()) {
  const url = `${(state.settings.apiBase || defaultSettings.apiBase).replace(/\/+$/, "")}/chat/completions`;
  const lastUserIndex = chat.messages.map((message) => message.role).lastIndexOf("user");
  const history = (lastUserIndex >= 0 ? chat.messages.slice(0, lastUserIndex) : chat.messages).slice(-12);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${state.settings.apiKey}`
    },
    body: JSON.stringify({
      model: state.settings.model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: userText }
      ],
      temperature: 0.3
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Wax jawaab ah lama helin.";
}

function chatToText(chat) {
  return chat.messages.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`).join("\n\n");
}

async function generateReply(userText, chat) {
  if (state.settings.apiKey) {
    try {
      return await apiReply(userText, chat);
    } catch {
      return "Xiriirka API-ga aad gelisay (Account Settings) wuu fashilmay. Hubi API Key, Base URL, ama Model-kaaga.";
    }
  }

  // Fallback to a public AI endpoint with internet search when no private API is configured.
  try {
    const sys = buildSystemPrompt() + " IMPORTANT: You are answering a user who may speak Somali. You have live internet searching capability. Always respond intelligently, factually, and deeply in areas like Politics, History, Technology, Geography, and General Knowledge. Give comprehensive, well-researched, and detailed answers. If they use Somali, respond in beautiful, fluent Somali.";
    const currentUserIndex = chat.messages.map((message) => message.role).lastIndexOf("user");
    const priorMessages = (currentUserIndex >= 0 ? chat.messages.slice(0, currentUserIndex) : chat.messages).slice(-8);
    const messagesArray = [
      { role: "system", content: sys },
      ...priorMessages.filter(m => m.content && (m.role === 'user' || m.role === 'assistant')).map((msg) => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content })),
      { role: "user", content: userText }
    ];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for web search
      const response = await fetch("https://text.pollinations.ai/?search=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesArray, model: "openai", search: true }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const textData = await response.text();
        if (textData && textData.trim().length > 2) return textData.trim();
      }
    } catch (postErr) { }

    // Fallback to GET method with internet search & timeout
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 20000);
    const getRes = await fetch("https://text.pollinations.ai/" + encodeURIComponent(userText) + "?search=true&system=" + encodeURIComponent(sys), { signal: controller2.signal });
    clearTimeout(timeoutId2);
    if (getRes.ok) {
      const textData2 = await getRes.text();
      if (textData2 && textData2.trim().length > 2) return textData2.trim();
    }

    return fallbackReply(userText);
  } catch (err) {
    return fallbackReply(userText);
  }
}

async function generateResearchReply(query, chat, sources) {
  const researchRequest = createResearchRequest(query, sources);
  try {
    if (state.settings.apiKey) {
      return await apiReply(researchRequest, chat, buildSystemPrompt());
    }
    const answer = await generateReply(researchRequest, chat);
    if (answer && !answer.startsWith("Wacan!")) return answer;
  } catch (error) { }
  return buildLocalResearchReport(query, sources);
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  const chat = getActiveChat();
  if (!chat) return;
  if (chat.title === "New chat" || chat.title === "Welcome") {
    chat.title = text.length > 24 ? `${text.slice(0, 24)}...` : text;
  }
  chat.messages.push({ role: "user", content: text });
  chat.messages.push({ role: "assistant", content: "..." });
  inputEl.value = "";
  autoGrow();
  render();

  // Helper: toggle thinking animation on latest AI avatar
  function setThinking(on) {
    const roles = messagesEl.querySelectorAll(".message[data-role='assistant'] .message-role");
    const lastRole = roles[roles.length - 1];
    const contents = messagesEl.querySelectorAll(".message[data-role='assistant'] .message-content");
    const lastContent = contents[contents.length - 1];
    if (lastRole) lastRole.classList.toggle("is-thinking", on);
    if (lastContent) lastContent.classList.toggle("is-step", on);
  }

  const placeholder = chat.messages[chat.messages.length - 1];
  setThinking(true);
  if (state.activeTool === "code") {
    placeholder.type = "text";

    // Step 1
    placeholder.content = "🤔 Step 1: Reading and understanding your coding request...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 500));

    // Step 2
    placeholder.content = "🔍 Step 2: Detecting programming language...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 3
    placeholder.content = "📚 Step 3: Searching code knowledge base & documentation...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 700));

    // Step 4
    placeholder.content = "💡 Step 4: Designing the optimal solution logic...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 5
    placeholder.content = "✍️ Step 5: Writing clean, well-structured code...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 800));

    // Step 6
    placeholder.content = "🧪 Step 6: Testing logic and checking for errors...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 7
    placeholder.content = "⚙️ Step 7: Optimizing and refining the code...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 8
    placeholder.content = "✅ Step 8: Adding comments and documentation...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 500));

    // Step 9
    placeholder.content = "🚀 Step 9: Code is ready! Delivering result...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 400));

    const reply = await generateReply(text, chat);
    placeholder.type = "code";
    placeholder.content = reply;
  } else if (state.activeTool === "image") {
    placeholder.type = "text";

    // Step 1
    placeholder.content = "🤔 Step 1: Thinking about your request...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 1100));

    // Step 2
    placeholder.content = "🔍 Step 2: Analyzing and understanding the prompt...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 1300));

    // Step 3
    placeholder.content = "✏️ Step 3: Enhancing prompt for best image quality...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 1200));

    // Step 4
    placeholder.content = "🎨 Step 4: Creating image (this may take a moment)...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 2500));

    // Step 5
    placeholder.content = "⚙️ Step 5: Professionally processing & finalising details...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 1500));

    // Step 6
    placeholder.content = "✅ Step 6: Ensuring image matches prompt correctly...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 1200));

    // Step 7
    placeholder.content = "🖼️ Step 7: Image is ready!";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 700));

    const imageUrl = createImageUrl(text);
    placeholder.type = "image";
    placeholder.content = text;
    placeholder.imageUrl = imageUrl;

    // Save generated image to Library
    libraryItems.unshift({
      category: "Generated Images",
      name: text.length > 40 ? text.substring(0, 37) + '...' : text,
      desc: "AI-generated image",
      icon: imageUrl,
      url: imageUrl
    });
    saveLibraryItems();
  } else if (state.activeTool === "research") {
    placeholder.type = "text";
    const researchSteps = [
      "Deep Research: Fahmaya su'aashaada...",
      "Deep Research: Raadinta ilaha la xiriira...",
      "Deep Research: Isbarbardhigga xogta iyo taariikhaha...",
      "Deep Research: Qorista warbixinta iyo ilo-raaca..."
    ];
    for (const step of researchSteps) {
      placeholder.content = step;
      saveChats();
      render();
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    let sources = [];
    try {
      sources = await generateResearchSources(text);
    } catch {
      sources = [];
    }
    const reply = await generateResearchReply(text, chat, sources);
    placeholder.type = "research";
    placeholder.content = reply;
    placeholder.sources = sources;
  } else {
    placeholder.type = "text";

    // Step 1
    placeholder.content = "🤔 Step 1: Receiving and analyzing your question...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 2
    placeholder.content = "🔍 Step 2: Searching internal knowledge base...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 700));

    // Step 3
    placeholder.content = "💡 Step 3: Formulating the best response...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 4
    placeholder.content = "🧠 Step 4: Structuring the answer for clarity...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 700));

    // Step 5
    placeholder.content = "⚙️ Step 5: Processing the final details...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 6
    placeholder.content = "✅ Step 6: Ensuring accuracy and quality...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 600));

    // Step 7
    placeholder.content = "✍️ Step 7: Finalizing response...";
    saveChats(); render();
    await new Promise(r => setTimeout(r, 400));

    const reply = await generateReply(text, chat);
    placeholder.type = "text";
    placeholder.content = reply;
  }
  setThinking(false);
  saveChats();
  render();
}

function render() {
  renderAccountCard();
  renderChatList();
  renderProjects();
  renderMessages();
}

function saveAccount() {
  state.settings.name = accName.value.trim() || "Your Account";
  state.settings.email = accEmail.value.trim();
  state.settings.plan = accPlan.value;
  state.settings.apiBase = apiBase.value.trim() || defaultSettings.apiBase;
  state.settings.apiKey = apiKey.value.trim();
  state.settings.model = apiModel.value.trim() || "gpt-4o-mini";
  state.settings.googleSearchKey = googleSearchKey.value.trim();
  state.settings.googleSearchCx = googleSearchCx.value.trim();
  saveSettings();
  renderAccountCard();
  closeAccountModal();
}

async function shareChat() {
  const chat = getActiveChat();
  if (!chat) return;
  const text = `Chat: ${chat.title}\n\n${chatToText(chat)}`;
  await navigator.clipboard.writeText(text);
  window.alert("Chat-ka waa la copy gareeyay, hadda waad share gareyn kartaa.");
}

async function copyLastAssistant() {
  const chat = getActiveChat();
  if (!chat) return;
  const lastAssistant = [...chat.messages].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return;
  await navigator.clipboard.writeText(lastAssistant.content);
  window.alert("Jawaabtii ugu dambeysay waa la copy gareeyay.");
}

function downloadChat() {
  const chat = getActiveChat();
  if (!chat) return;
  const blob = new Blob([chatToText(chat)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${chat.title.replace(/[^\w\s-]/g, "").trim() || "chat"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function editLastUserMessage() {
  const chat = getActiveChat();
  if (!chat) return;
  const index = [...chat.messages].map((m, i) => ({ m, i })).reverse().find((x) => x.m.role === "user")?.i;
  if (index === undefined) return;
  inputEl.value = chat.messages[index].content;
  chat.messages.splice(index, 1);
  if (chat.messages[index] && chat.messages[index].role === "assistant") {
    chat.messages.splice(index, 1);
  }
  saveChats();
  autoGrow();
  render();
  inputEl.focus();
}

function togglePlusPlan() {
  state.settings.plan = state.settings.plan === "Plus" ? "Free" : "Plus";
  saveSettings();
  renderAccountCard();
}

function toggleModelMenu() {
  modelMenu.classList.toggle("hidden");
}

function setModel(model) {
  state.settings.model = model;
  saveSettings();
  renderAccountCard();
  modelMenu.classList.add("hidden");
}

function toggleQuickPrompts() {
  plusMenu.classList.toggle("hidden");
}

function pickQuickPrompt(text) {
  inputEl.value = text;
  autoGrow();
  quickPrompts.classList.add("hidden");
  inputEl.focus();
}

let currentRecognition = null;
const micSVG = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
const stopSVG = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>`;

function toggleMic() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    window.alert("Browser-kan kuma taageero voice input.");
    return;
  }

  if (state.isListening && currentRecognition) {
    currentRecognition.stop();
    return;
  }

  const recognition = new Recognition();
  currentRecognition = recognition;
  recognition.lang = "so-SO";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  state.isListening = true;
  micBtn.innerHTML = stopSVG;
  micBtn.style.color = "#ff4d4d";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputEl.value = `${inputEl.value} ${transcript}`.trim();
    autoGrow();
  };

  recognition.onend = () => {
    state.isListening = false;
    currentRecognition = null;
    micBtn.innerHTML = micSVG;
    micBtn.style.color = "";
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    state.isListening = false;
    currentRecognition = null;
    micBtn.innerHTML = micSVG;
    micBtn.style.color = "";
  };

  recognition.start();
}

newChatBtn.addEventListener("click", createChat);
chatFilter.addEventListener("input", () => {
  // Auto-expand recents if user is searching
  if (chatFilter.value.trim() !== "") {
    chatList.classList.remove("hidden");
    recentsChevron.classList.remove("collapsed");
  }
  renderChatList();
});
recentsToggleBtn.addEventListener("click", () => {
  chatList.classList.toggle("hidden");
  recentsChevron.classList.toggle("collapsed");
});
sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("input", autoGrow);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
for (const btn of toolButtons) {
  btn.addEventListener("click", () => setTool(btn.dataset.tool));
}
for (const chip of topicChips) {
  chip.addEventListener("click", () => setTopic(chip.dataset.topic));
}

plusBtn.addEventListener("click", togglePlusPlan);
quickPromptBtn.addEventListener("click", toggleQuickPrompts);
micBtn.addEventListener("click", toggleMic);
accountBtn.addEventListener("click", openAccountModal);
closeAccountBtn.addEventListener("click", closeAccountModal);
saveAccountBtn.addEventListener("click", saveAccount);
accountModal.addEventListener("click", (event) => {
  if (event.target === accountModal) closeAccountModal();
});
modelPickerBtn.addEventListener("click", toggleModelMenu);
for (const option of modelOptions) {
  option.addEventListener("click", () => setModel(option.dataset.model));
}
for (const promptOption of quickPromptOptions) {
  promptOption.addEventListener("click", () => pickQuickPrompt(promptOption.dataset.prompt));
}

// Side bar buttons logic
sidebarImageBtn?.addEventListener("click", () => openGallery("Library"));
sidebarAppsBtn?.addEventListener("click", () => {
  window.alert("Apps view: This would open your connected applications.");
});
sidebarProjectsBtn?.addEventListener("click", () => {
  createNewProject();
});

// Gallery Data & Logic
const allPlugins = [
  { category: "Featured", name: "Gmail", desc: "Read and manage Gmail", url: "https://gmail.com", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" },
  { category: "Featured", name: "Google Drive", desc: "Work across Drive, Docs, Sheets, and Slides", url: "https://drive.google.com", icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" },
  { category: "Featured", name: "Outlook Email", desc: "Triage Microsoft Outlook inboxes and draft replies", url: "https://outlook.com", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" },
  { category: "Featured", name: "GitHub", desc: "Triage PRs, issues, CI, and publish flows", url: "https://github.com", icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { category: "Featured", name: "SharePoint", desc: "Summarize Microsoft SharePoint sites and files", url: "https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Microsoft_Office_SharePoint_%282019%E2%80%93present%29.svg" },
  { category: "Featured", name: "Slack", desc: "Read and manage Slack", url: "https://slack.com", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
  { category: "Featured", name: "Outlook Calendar", desc: "See Teams, Outlook Calendar, and more", url: "https://outlook.com/calendar", icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" },
  { category: "Productivity", name: "Google Calendar", desc: "Manage Google Calendar events and schedules", url: "https://calendar.google.com", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" },
  { category: "Productivity", name: "Notion", desc: "Notion workflows for specs, research, meetings, and knowledge capture", url: "https://notion.so", icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { category: "Productivity", name: "Linear", desc: "Plan and build products", url: "https://linear.app", icon: "https://asset.brandfetch.io/idZAyF9rlg/idN3Zu25Az.png" },
  { category: "Productivity", name: "ClickUp", desc: "Turn Codex into your ClickUp command center.", url: "https://clickup.com", icon: "https://upload.wikimedia.org/wikipedia/commons/3/3d/ClickUp_2023_Logo.svg" },
  { category: "Productivity", name: "Asana", desc: "Turn chats into actions", url: "https://asana.com", icon: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg" },
  { category: "Productivity", name: "Dropbox", desc: "Access, save and share files", url: "https://dropbox.com", icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dropbox_logo_%282013%29.svg" },
  { category: "Creativity", name: "Canva", desc: "Create, review, edit designs", url: "https://canva.com", icon: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg" },
  { category: "Creativity", name: "Figma", desc: "Design-to-code workflows powered by the Figma integration", url: "https://figma.com", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { category: "Creativity", name: "Adobe", desc: "Design, combine, and edit", url: "https://adobe.com", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg" },
  { category: "Creativity", name: "Gamma", desc: "Create presentations and docs", url: "https://gamma.app", icon: "https://asset.brandfetch.io/idkuvXnjOH/idaHH58E-T.png" },
  { category: "Creativity", name: "Descript", desc: "Edit video by chatting", url: "https://descript.com", icon: "https://asset.brandfetch.io/idtBEkBxLb/idqesDvPWn.png" },
  { category: "Developer Tools", name: "GitHub", desc: "Triage PRs, issues, CI, and publish flows", url: "https://github.com", icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { category: "Developer Tools", name: "Supabase", desc: "Manage and query databases", url: "https://supabase.com", icon: "https://asset.brandfetch.io/idyHWrLSYT/idbiVSKPOd.svg" },
  { category: "Developer Tools", name: "Vercel", desc: "Build and deploy web apps and agents", url: "https://vercel.com", icon: "https://asset.brandfetch.io/idAnDTFapY/ide-KtBBFY.svg" },
  { category: "Developer Tools", name: "Lovable", desc: "Build apps and websites", url: "https://lovable.dev", icon: "https://asset.brandfetch.io/idnrCPXJnO/idBnlWqBH2.png" },
  { category: "Developer Tools", name: "Replit", desc: "Turn your ideas into real apps", url: "https://replit.com", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Repl.it_logo.svg" },
  { category: "Developer Tools", name: "OpenAI", desc: "Develop AI apps, agents, and ChatGPT apps", url: "https://openai.com", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { category: "Business & Operations", name: "HubSpot", desc: "Insights to action in HubSpot", url: "https://hubspot.com", icon: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg" },
  { category: "Business & Operations", name: "Salesforce", desc: "Query, read, and safely update Salesforce", url: "https://salesforce.com", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
  { category: "Business & Operations", name: "Intercom", desc: "Customer conversations, contacts, tickets", url: "https://intercom.com", icon: "https://asset.brandfetch.io/idGpqpqkBE/iduGl1YFGR.svg" },
  { category: "Business & Operations", name: "Stripe", desc: "Accept payments", url: "https://stripe.com", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { category: "Data & Analytics", name: "PostHog", desc: "Analyze your product data", url: "https://posthog.com", icon: "https://asset.brandfetch.io/idkzu50GQB/idtfExgwsL.png" },
  { category: "Data & Analytics", name: "Amplitude", desc: "Product intelligence", url: "https://amplitude.com", icon: "https://asset.brandfetch.io/idQkjdyXxW/id_Kv__VJj.svg" },
  { category: "Data & Analytics", name: "Mixpanel", desc: "Query and analyze Mixpanel", url: "https://mixpanel.com", icon: "https://asset.brandfetch.io/idHT-LFkAh/id8QrJKALb.svg" },
  { category: "Data & Analytics", name: "BigQuery", desc: "Query and manage BigQuery resources", url: "https://cloud.google.com/bigquery", icon: "https://upload.wikimedia.org/wikipedia/commons/2/29/Google_Cloud_logo.svg" },
  { category: "Communication", name: "Teams", desc: "Summarize Microsoft Teams and draft follow-ups", url: "https://teams.microsoft.com", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg" },
  { category: "Communication", name: "Zoom", desc: "Smart meeting insights from Zoom", url: "https://zoom.us", icon: "https://upload.wikimedia.org/wikipedia/commons/1/11/Zoom_Logo_2022.svg" },
  { category: "Communication", name: "Slack", desc: "Read and manage Slack", url: "https://slack.com", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
  { category: "Education & Research", name: "Consensus", desc: "Explore scientific research", url: "https://consensus.app", icon: "https://asset.brandfetch.io/idJgCMJSYh/id8aTNv8Yw.png" },
  { category: "Education & Research", name: "Wolfram", desc: "Add computation & knowledge", url: "https://wolframalpha.com", icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Wolfram_Language_Logo_2016.svg" },
  { category: "Security", name: "Malwarebytes", desc: "Verify links, domains, phones.", url: "https://malwarebytes.com", icon: "https://asset.brandfetch.io/idv2YvGrNm/idPZVa2KsF.png" },
  { category: "Security", name: "Bitdefender", desc: "Tool designed to check URLs", url: "https://bitdefender.com", icon: "https://asset.brandfetch.io/idkfBSv5WT/idMhGmGVRq.png" },
  { category: "Security", name: "Vanta", desc: "Build trust with Vanta", url: "https://vanta.com", icon: "https://asset.brandfetch.io/idmDUhQKQa/idHXoAFqWu.png" },
  { category: "Finance", name: "Binance", desc: "Explore Binance market data", url: "https://binance.com", icon: "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png" },
  { category: "Finance", name: "Stripe", desc: "Accept payments", url: "https://stripe.com", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { category: "Healthcare", name: "MyFitnessPal", desc: "Generate meal plans, recipes", url: "https://myfitnesspal.com", icon: "https://asset.brandfetch.io/id_0WkLbxk/idwXFQMrIk.png" },
  { category: "Travel", name: "Skyscanner", desc: "Find cheap flights", url: "https://skyscanner.com", icon: "https://asset.brandfetch.io/idgq7cqFLe/idq7b-0AEF.svg" },
  { category: "Travel", name: "Trip.com", desc: "Plan Flights & Trains Easily", url: "https://trip.com", icon: "https://asset.brandfetch.io/idFYZjKrVz/idHSexJxvO.png" },
  { category: "Entertainment", name: "Shazam", desc: "Identify songs instantly", url: "https://shazam.com", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Shazam_icon.svg" },
  { category: "Other", name: "Etsy", desc: "Shop Home, Style & More", url: "https://etsy.com", icon: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Etsy_logo_lg_rgb.svg" },
  { category: "Other", name: "Podcast App", desc: "Find great podcasts", url: "https://podcasts.apple.com", icon: "https://upload.wikimedia.org/wikipedia/commons/5/56/Podcast_App_logo.png" }
];

function loadLibraryItems() {
  try {
    const raw = localStorage.getItem("chatgpt_clone_library_items");
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return [
    { category: "Books", name: "Codex", desc: "Programming references and code examples", url: "https://codex.openai.com" },
    { category: "Books", name: "History Books", desc: "Deep dive into world history", url: "https://en.wikipedia.org/wiki/History" },
    { category: "Articles", name: "Medical Research", desc: "Latest studies in health and wellness", url: "https://pubmed.ncbi.nlm.nih.gov" },
    { category: "Tutorials", name: "Web Dev 101", desc: "Learn HTML/CSS/JS basics", url: "https://developer.mozilla.org" },
    { category: "Tutorials", name: "Learn Python", desc: "Python for beginners", url: "https://python.org" },
  ];
}
function saveLibraryItems() {
  localStorage.setItem("chatgpt_clone_library_items", JSON.stringify(libraryItems));
}
const libraryItems = loadLibraryItems();

const galleryModal = document.getElementById("galleryModal");
const closeGalleryBtn = document.getElementById("closeGalleryBtn");
const galleryTitle = document.getElementById("galleryTitle");
const gallerySidebar = document.getElementById("gallerySidebar");
const galleryGrid = document.getElementById("galleryGrid");
const gallerySearch = document.getElementById("gallerySearch");
let currentGalleryData = [];
let activeGalleryCategory = "Featured";

function getIconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// Apps data
const allApps = [
  { category: "Google", name: "Gmail", desc: "Read and manage Gmail", url: "https://gmail.com", icon: "https://www.google.com/s2/favicons?domain=gmail.com&sz=128" },
  { category: "Google", name: "Google Drive", desc: "Work across Drive, Docs, Sheets", url: "https://drive.google.com", icon: "https://www.google.com/s2/favicons?domain=drive.google.com&sz=128" },
  { category: "Google", name: "Google Calendar", desc: "Manage Google Calendar", url: "https://calendar.google.com", icon: "https://www.google.com/s2/favicons?domain=calendar.google.com&sz=128" },
  { category: "Google", name: "Google Meet", desc: "Video meetings by Google", url: "https://meet.google.com", icon: "https://www.google.com/s2/favicons?domain=meet.google.com&sz=128" },
  { category: "Google", name: "Google Docs", desc: "Create and edit documents", url: "https://docs.google.com", icon: "https://www.google.com/s2/favicons?domain=docs.google.com&sz=128" },
  { category: "Microsoft", name: "Outlook", desc: "Manage your email & calendar", url: "https://outlook.com", icon: "https://www.google.com/s2/favicons?domain=outlook.com&sz=128" },
  { category: "Microsoft", name: "Teams", desc: "Chat, meet, and collaborate", url: "https://teams.microsoft.com", icon: "https://www.google.com/s2/favicons?domain=teams.microsoft.com&sz=128" },
  { category: "Microsoft", name: "OneDrive", desc: "Cloud storage by Microsoft", url: "https://onedrive.live.com", icon: "https://www.google.com/s2/favicons?domain=onedrive.live.com&sz=128" },
  { category: "Microsoft", name: "SharePoint", desc: "Collaborate with SharePoint", url: "https://sharepoint.com", icon: "https://www.google.com/s2/favicons?domain=sharepoint.com&sz=128" },
  { category: "Social", name: "Slack", desc: "Team communication tool", url: "https://slack.com", icon: "https://www.google.com/s2/favicons?domain=slack.com&sz=128" },
  { category: "Social", name: "Zoom", desc: "Video conferencing", url: "https://zoom.us", icon: "https://www.google.com/s2/favicons?domain=zoom.us&sz=128" },
  { category: "Social", name: "WhatsApp Web", desc: "Send and receive messages", url: "https://web.whatsapp.com", icon: "https://www.google.com/s2/favicons?domain=web.whatsapp.com&sz=128" },
  { category: "Social", name: "Telegram", desc: "Messaging and channels", url: "https://web.telegram.org", icon: "https://www.google.com/s2/favicons?domain=telegram.org&sz=128" },
  { category: "Developer", name: "GitHub", desc: "Host and review code", url: "https://github.com", icon: "https://www.google.com/s2/favicons?domain=github.com&sz=128" },
  { category: "Developer", name: "Vercel", desc: "Deploy web apps instantly", url: "https://vercel.com", icon: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128" },
  { category: "Developer", name: "Replit", desc: "Code in the browser", url: "https://replit.com", icon: "https://www.google.com/s2/favicons?domain=replit.com&sz=128" },
  { category: "Developer", name: "Supabase", desc: "Open source database", url: "https://supabase.com", icon: "https://www.google.com/s2/favicons?domain=supabase.com&sz=128" },
  { category: "Productivity", name: "Notion", desc: "Notes and workspace", url: "https://notion.so", icon: "https://www.google.com/s2/favicons?domain=notion.so&sz=128" },
  { category: "Productivity", name: "Trello", desc: "Visual project management", url: "https://trello.com", icon: "https://www.google.com/s2/favicons?domain=trello.com&sz=128" },
  { category: "Productivity", name: "Asana", desc: "Task and project tracker", url: "https://asana.com", icon: "https://www.google.com/s2/favicons?domain=asana.com&sz=128" },
  { category: "Productivity", name: "ClickUp", desc: "All-in-one workspace", url: "https://clickup.com", icon: "https://www.google.com/s2/favicons?domain=clickup.com&sz=128" },
  { category: "Productivity", name: "Dropbox", desc: "Cloud file storage", url: "https://dropbox.com", icon: "https://www.google.com/s2/favicons?domain=dropbox.com&sz=128" },
  { category: "AI Tools", name: "ChatGPT", desc: "AI by OpenAI", url: "https://chatgpt.com", icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128" },
  { category: "AI Tools", name: "Midjourney", desc: "AI image generation", url: "https://midjourney.com", icon: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128" },
  { category: "AI Tools", name: "Claude", desc: "AI assistant by Anthropic", url: "https://claude.ai", icon: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128" },
  { category: "AI Tools", name: "Gemini", desc: "AI by Google DeepMind", url: "https://gemini.google.com", icon: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128" },
  { category: "AI Tools", name: "Canva", desc: "AI-powered design tool", url: "https://canva.com", icon: "https://www.google.com/s2/favicons?domain=canva.com&sz=128" },
];

function openGallery(type) {
  galleryModal.classList.remove("hidden");
  gallerySearch.value = "";
  if (type === "Plugins") {
    galleryTitle.textContent = "Plugins — Work with GOLLISGPT across your favorite tools";
    currentGalleryData = allPlugins;
    activeGalleryCategory = "Featured";
  } else if (type === "Library") {
    galleryTitle.textContent = "Library";
    currentGalleryData = libraryItems;
    // Show Generated Images if any exist, else Books
    activeGalleryCategory = libraryItems.some(i => i.category === "Generated Images") ? "Generated Images" : "Books";
  } else if (type === "Apps") {
    galleryTitle.textContent = "Apps — Open your favorite tools";
    currentGalleryData = allApps;
    activeGalleryCategory = "Google";
  }
  renderGallery();
}

function renderGallery() {
  const query = gallerySearch.value.toLowerCase().trim();

  // Render Categories
  const categories = [...new Set(currentGalleryData.map(p => p.category))];
  gallerySidebar.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `gallery-category ${cat === activeGalleryCategory && query === "" ? "active" : ""}`;
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      gallerySearch.value = "";
      activeGalleryCategory = cat;
      renderGallery();
    });
    gallerySidebar.appendChild(btn);
  });

  // Filter items
  let items = currentGalleryData;
  if (query) {
    items = items.filter(i => i.name.toLowerCase().includes(query) || i.desc.toLowerCase().includes(query));
    // Remove active category highlight when searching
    Array.from(gallerySidebar.children).forEach(child => child.classList.remove("active"));
  } else {
    items = items.filter(i => i.category === activeGalleryCategory);
  }

  // Render Grid
  galleryGrid.innerHTML = "";
  if (items.length === 0) {
    galleryGrid.innerHTML = "<p style='color:var(--muted);'>No items found.</p>";
  }
  items.forEach(item => {
    const card = document.createElement("div");

    // ── GENERATED IMAGES: show as thumbnail + delete ──────────────────────
    if (item.category === "Generated Images") {
      card.className = "plugin-card image-card";
      card.innerHTML = `
        <div class="image-thumb-wrap">
          <img src="${item.icon || item.url}" alt="${item.name}" class="image-thumb" loading="lazy">
          <button class="delete-img-btn" title="Delete">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14H6L5 6"></path>
              <path d="M10 11v6"></path><path d="M14 11v6"></path>
              <path d="M9 6V4h6v2"></path>
            </svg>
          </button>
        </div>
        <div class="image-card-label" title="${item.name}">${item.name.length > 28 ? item.name.substring(0, 25) + '...' : item.name}</div>
      `;
      // Delete
      card.querySelector(".delete-img-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const index = libraryItems.indexOf(item);
        if (index > -1) {
          libraryItems.splice(index, 1);
          currentGalleryData = libraryItems;
          if (!libraryItems.some(i => i.category === "Generated Images") && activeGalleryCategory === "Generated Images") {
            activeGalleryCategory = "Books";
          }
          saveLibraryItems();
          renderGallery();
        }
      });
      // Preview image on click
      card.addEventListener("click", (e) => {
        if (e.target.closest(".delete-img-btn")) return;
        window.open(item.url || item.icon, "_blank", "noopener,noreferrer");
      });
      galleryGrid.appendChild(card);
      return;
    }

    // ── NORMAL CARDS ────────────────────────────────────────────────────────
    card.className = "plugin-card";
    const iconSrc = item.icon || "";
    const initial = item.name.charAt(0).toUpperCase();
    let resolvedIcon = iconSrc;
    if (!resolvedIcon && item.url) {
      try { resolvedIcon = `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=128`; } catch (e) { }
    }
    card.innerHTML = `
      <div class="plugin-header" style="position:relative; width: 100%;">
        <div class="plugin-icon" data-initial="${initial}">
          ${resolvedIcon ? `<img src="${resolvedIcon}" alt="${initial}" onload="this.parentElement.style.background='transparent'" onerror="this.style.display='none'; this.parentElement.textContent='${initial}'; this.parentElement.style.background='#4a3f9f';">` : `<span style='font-weight:700;font-size:1.2rem'>${initial}</span>`}
        </div>
        <div class="plugin-info" style="flex:1;">
          <div class="plugin-title">${item.name}</div>
          <div class="plugin-desc" title="${item.desc}">${item.desc.length > 55 ? item.desc.substring(0, 52) + '...' : item.desc}</div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
    });
    galleryGrid.appendChild(card);
  });
}

closeGalleryBtn?.addEventListener("click", () => galleryModal.classList.add("hidden"));
galleryModal?.addEventListener("click", (e) => {
  if (e.target === galleryModal) galleryModal.classList.add("hidden");
});
gallerySearch?.addEventListener("input", renderGallery);

sidebarResearchBtn?.addEventListener("click", () => openGallery("Plugins"));
sidebarCodexBtn?.addEventListener("click", () => openGallery("Library"));
sidebarAppsBtn?.addEventListener("click", () => openGallery("Apps"));


// Plus menu buttons logic
addPhotosMenu?.addEventListener("click", () => {
  plusMenu.classList.add("hidden");
  fileUploadInput.click();
});

createImageMenu?.addEventListener("click", () => {
  plusMenu.classList.add("hidden");
  setTool("image");
  inputEl.focus();
});

thinkingMenu?.addEventListener("click", () => {
  plusMenu.classList.add("hidden");
  const chat = getActiveChat();
  if (chat) {
    chat.messages.push({ role: "user", content: "Enable Thinking Mode..." });
    chat.messages.push({ role: "assistant", content: "Thinking process initiated. What complex problem are we solving today?" });
    saveChats();
    render();
  }
});

deepResearchMenu?.addEventListener("click", () => {
  plusMenu.classList.add("hidden");
  setTool("research");
  inputEl.focus();
});

// File input handle logic
fileUploadInput?.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const chat = getActiveChat();
  if (!chat) return;

  const reader = new FileReader();

  // If it's an image
  if (file.type.startsWith("image/")) {
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      chat.messages.push({
        role: "user",
        type: "image",
        imageUrl: dataUrl,
        content: `Uploaded Image: ${file.name}`
      });
      chat.messages.push({ role: "assistant", content: "Sawirka waan arkaa. Waa maxay waxa aad iga rabto inaan kaaga caawiyo sawirkan?" });
      saveChats();
      render();
    };
    reader.readAsDataURL(file);
  } else {
    // Other file types
    chat.messages.push({
      role: "user",
      type: "file",
      filename: file.name,
      content: `Faylka waa la soo geliyay.`
    });
    chat.messages.push({ role: "assistant", content: "Faylkaaga waan helay. Diyaar ayaan u ahay inaan falanqeeyo!" });
    saveChats();
    render();
  }

  // Reset input
  fileUploadInput.value = "";
});

document.addEventListener("click", (event) => {
  if (!modelMenu.contains(event.target) && !modelPickerBtn.contains(event.target)) {
    modelMenu.classList.add("hidden");
  }
  if (!plusMenu.contains(event.target) && !quickPromptBtn.contains(event.target)) {
    plusMenu.classList.add("hidden");
  }
  if (!chatList.contains(event.target)) {
    state.openChatMenuId = null;
    renderChatList();
  }
});

render();
autoGrow();
