let members = [];
let songs = [];
let assignments = {};

const memberInput = document.getElementById("memberInput");
const songInput = document.getElementById("songInput");

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

// 4曲空けチェック
function canAssign(songIndex, member) {
  for (let i = songIndex - 1; i >= 0 && i > songIndex - 5; i--) {
    if (assignments[songs[i]] === member) {
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

    members.forEach(member => {
      const label = document.createElement("label");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = song;
      radio.value = member;

      // 制限チェック🔥
      if (!canAssign(index, member)) {
        radio.disabled = true;
      }

      radio.addEventListener("change", () => {
        assignments[song] = member;
        renderSongs(); // 再描画で制限更新
        renderResult();
      });

      label.appendChild(radio);
      label.appendChild(document.createTextNode(member));

      div.appendChild(label);
    });

    container.appendChild(div);
  });
}

// 結果表示
function renderResult() {
  document.getElementById("result").textContent =
    JSON.stringify(assignments, null, 2);
}