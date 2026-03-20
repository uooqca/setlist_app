// データ
let members = [];
let songs = [];
let assignments = {};

// 入力
const memberInput = document.getElementById("memberInput");
const songInput = document.getElementById("songInput");

// ボタン
document.getElementById("addMemberBtn").addEventListener("click", addMember);
document.getElementById("addSongBtn").addEventListener("click", addSong);

// メンバー追加
function addMember() {
  const name = memberInput.value.trim();
  if (!name) return;

  members.push(name);
  memberInput.value = "";

  renderMembers();
  renderSongs();
}

// 曲追加
function addSong() {
  const name = songInput.value.trim();
  if (!name) return;

  songs.push(name);
  songInput.value = "";

  renderSongs();
}

// メンバー表示
function renderMembers() {
  const list = document.getElementById("memberList");
  list.innerHTML = "";

  members.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    list.appendChild(li);
  });
}

// 🔥 4曲空けルール（誰か1人でも被ったらNG）
function canAssign(songIndex, member) {
  for (let i = songIndex - 1; i >= 0 && i > songIndex - 5; i--) {
    const assigned = assignments[songs[i]] || [];
    if (assigned.includes(member)) {
      return false;
    }
  }
  return true;
}

// 曲ごとのUI
function renderSongs() {
  const container = document.getElementById("songs");
  container.innerHTML = "";

  if (members.length === 0 || songs.length === 0) {
    container.innerHTML = "<p>⚠️ メンバーと曲を追加してね！</p>";
    return;
  }

  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song";

    const title = document.createElement("h3");
    title.textContent = song;
    div.appendChild(title);

    // 一時選択（確定前）
    let tempSelected = new Set(assignments[song] || []);

    members.forEach(member => {
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = member;

      // すでに選択されてる場合
      if (tempSelected.has(member)) {
        checkbox.checked = true;
      }

      // 4曲ルールチェック
      if (!canAssign(index, member)) {
        checkbox.disabled = true;
      }

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          tempSelected.add(member);
        } else {
          tempSelected.delete(member);
        }
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(member));
      div.appendChild(label);
    });

    // 決定ボタン✨
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "決定";

    confirmBtn.addEventListener("click", () => {
      assignments[song] = Array.from(tempSelected);
      renderSongs();   // 制限更新
      renderResult();  // 結果更新
    });

    div.appendChild(document.createElement("br"));
    div.appendChild(confirmBtn);

    container.appendChild(div);
  });
}

// 結果表示
function renderResult() {
  document.getElementById("result").textContent =
    JSON.stringify(assignments, null, 2);
}