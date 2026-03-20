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

// 曲ごとのUI（メンバー複数選択）
function renderSongs() {
  const container = document.getElementById("songs");
  container.innerHTML = "";

  if (members.length === 0 || songs.length === 0) {
    container.innerHTML = "<p>⚠️ メンバーと曲を追加してね！</p>";
    return;
  }

  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";

    const title = document.createElement("h3");
    title.textContent = song;
    div.appendChild(title);

    let tempSelected = new Set(assignments[song] || []);

    members.forEach(member => {
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      if (tempSelected.has(member)) {
        checkbox.checked = true;
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

    const btn = document.createElement("button");
    btn.textContent = "決定";

    btn.addEventListener("click", () => {
      assignments[song] = Array.from(tempSelected);
      renderResult();
    });

    div.appendChild(document.createElement("br"));
    div.appendChild(btn);

    container.appendChild(div);
  });
}

// 🔥 セトリ自動生成（4曲空け考慮）
function generateSetlist() {
  let remaining = [...songs];
  let result = [];

  while (remaining.length > 0) {
    let placed = false;

    for (let i = 0; i < remaining.length; i++) {
      const song = remaining[i];
      const membersOfSong = assignments[song] || [];

      let ok = true;

      // 直前4曲チェック
      for (let j = result.length - 1; j >= 0 && j > result.length - 5; j--) {
        const prevSong = result[j];
        const prevMembers = assignments[prevSong] || [];

        if (membersOfSong.some(m => prevMembers.includes(m))) {
          ok = false;
          break;
        }
      }

      if (ok) {
        result.push(song);
        remaining.splice(i, 1);
        placed = true;
        break;
      }
    }

    // 無理なら強引に入れる
    if (!placed) {
      result.push(remaining[0]);
      remaining.shift();
    }
  }

  return result;
}

// 結果表示（曲順のみ✨）
function renderResult() {
  const resultEl = document.getElementById("result");

  const ordered = generateSetlist();

  let text = "🎤 セトリ\n\n";

  ordered.forEach((song, index) => {
    text += `${index + 1}. ${song}\n`;
  });

  resultEl.textContent = text;
}