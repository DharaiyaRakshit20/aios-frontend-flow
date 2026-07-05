(function () {
  // script tag se config nikaalo
  var script = document.currentScript;
  var agentId = script.getAttribute("data-agent");
  var apiKey = script.getAttribute("data-key");
  var apiUrl = script.getAttribute("data-api") || "https://aios-backend-flow.onrender.com";
  var color = script.getAttribute("data-color") || "#6366f1";
  var title = script.getAttribute("data-title") || "Chat with us";

  var history = [];
  var open = false;

  // ---- styles ----
  var style = document.createElement("style");
  style.textContent =
    ".qv-bubble{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:" + color + ";cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;z-index:99999;transition:transform .2s}" +
    ".qv-bubble:hover{transform:scale(1.05)}" +
    ".qv-bubble svg{width:26px;height:26px;fill:#fff}" +
    ".qv-window{position:fixed;bottom:88px;right:20px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.2);display:none;flex-direction:column;overflow:hidden;z-index:99999;font-family:system-ui,-apple-system,sans-serif}" +
    ".qv-window.open{display:flex}" +
    ".qv-head{background:" + color + ";color:#fff;padding:16px;font-weight:600;font-size:15px}" +
    ".qv-body{flex:1;overflow-y:auto;padding:16px;background:#f7f7f9;display:flex;flex-direction:column;gap:10px}" +
    ".qv-msg{max-width:80%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.4}" +
    ".qv-msg.user{align-self:flex-end;background:" + color + ";color:#fff}" +
    ".qv-msg.bot{align-self:flex-start;background:#fff;border:1px solid #eaeaea;color:#222}" +
    ".qv-foot{display:flex;gap:8px;padding:12px;border-top:1px solid #eee;background:#fff}" +
    ".qv-foot input{flex:1;border:1px solid #ddd;border-radius:10px;padding:10px 12px;font-size:14px;outline:none}" +
    ".qv-foot button{background:" + color + ";color:#fff;border:none;border-radius:10px;padding:0 16px;cursor:pointer;font-size:14px}" +
    ".qv-empty{color:#999;text-align:center;margin:auto;font-size:13px}";
  document.head.appendChild(style);

  // ---- bubble ----
  var bubble = document.createElement("div");
  bubble.className = "qv-bubble";
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  document.body.appendChild(bubble);

  // ---- window ----
  var win = document.createElement("div");
  win.className = "qv-window";
  win.innerHTML =
    '<div class="qv-head">' + title + "</div>" +
    '<div class="qv-body" id="qv-body"><div class="qv-empty">Ask us anything!</div></div>' +
    '<div class="qv-foot"><input id="qv-input" placeholder="Type a message..." /><button id="qv-send">Send</button></div>';
  document.body.appendChild(win);

  var body = win.querySelector("#qv-body");
  var inputEl = win.querySelector("#qv-input");
  var sendBtn = win.querySelector("#qv-send");

  bubble.onclick = function () {
    open = !open;
    win.classList.toggle("open", open);
    if (open) inputEl.focus();
  };

  function addMsg(text, who) {
    var empty = body.querySelector(".qv-empty");
    if (empty) empty.remove();
    var d = document.createElement("div");
    d.className = "qv-msg " + who;
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  function send() {
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    addMsg(text, "user");
    history.push({ role: "user", content: text });

    var typing = document.createElement("div");
    typing.className = "qv-msg bot";
    typing.textContent = "...";
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    fetch(apiUrl + "/api/agents/" + agentId + "/public-chat", {
      method: "POST",
      headers: { "Authorization": "Api-Key " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: history }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        var reply = data.reply || "Sorry, something went wrong.";
        addMsg(reply, "bot");
        history.push({ role: "assistant", content: reply });
      })
      .catch(function () {
        typing.remove();
        addMsg("Connection error. Please try again.", "bot");
      });
  }

  sendBtn.onclick = send;
  inputEl.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();