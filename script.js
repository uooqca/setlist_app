let members = [];
let songs = [];
let assignments = {};

const memberInput = document.getElementById("memberInput");
const songInput = document.getElementById("songInput");

document.getElementById("addMemberBtn").onclick = () => {
  const name = memberInput.value.trim();
  if (!name) return;
  members.push(name);
  memberInput.value = "";
  renderMembers();
  renderSongs();
};

document.getElementById("addSongBtn").onclick = () => {
  const name = songInput.value.trim();
  if (!name) return;
  songs.push(name);
  songInput.value = "";
  renderSongs();
  renderSongsList();
};

document.getElementById("generateBtn").onclick = generateAndShow;

// メンバーリスト表示（削除ボタンあり）
function renderMembers() {
  const list = document.getElementById("memberList");
  list.innerHTML = "";
  members.forEach((m, idx) => {
    const li = document.createElement("li");
    li.textContent = m + " ";

    const delBtn = document.createElement("button");
    delBtn.onclick = () => {
      members.splice(idx, 1);
      renderMembers();
      renderSongs();
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// 曲リスト表示（削除ボタンあり）
function renderSongsList() {
  const list = document.getElementById("songList");
  list.innerHTML = "";
  songs.forEach((s, idx) => {
    const li = document.createElement("li");
    li.textContent = s + " ";

    const delBtn = document.createElement("button");
    delBtn.onclick = () => {
      songs.splice(idx, 1);
      delete assignments[s];
      renderSongs();
      renderSongsList();
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// 曲ごとのメンバー選択（アコーディオン）
function renderSongs() {
  const container = document.getElementById("songs");
  container.innerHTML = "";

  songs.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";

    const title = document.createElement("h3");
    title.textContent = song;
    div.appendChild(title);

    const memberDiv = document.createElement("div");
    memberDiv.style.display = "none";

    let temp = new Set(assignments[song] || []);

    members.forEach(member => {
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      if (temp.has(member)) checkbox.checked = true;

      checkbox.onchange = () => {
        if (checkbox.checked) temp.add(member);
        else temp.delete(member);
      };

      label.appendChild(checkbox);
      label.append(member);
      memberDiv.appendChild(label);
    });

    const btn = document.createElement("button");
    btn.textContent = "決定";
    btn.onclick = () => {
      assignments[song] = Array.from(temp);
      memberDiv.style.display = "none"; // 決定で閉じる
    };

    memberDiv.appendChild(document.createElement("br"));
    memberDiv.appendChild(btn);

    div.appendChild(memberDiv);

    // 曲名クリックで開閉
    title.onclick = () => {
      memberDiv.style.display = memberDiv.style.display === "none" ? "flex" : "none";
    };

    container.appendChild(div);
  });
}

// セトリ生成＆表示
function generateAndShow() {
  const result = generateSetlist();
  const container = document.getElementById("setlist");
  container.innerHTML = "";

  result.forEach((song, i) => {
    const p = document.createElement("p");
    p.textContent = `${i + 1}. ${song}`;
    container.appendChild(p);
  });
}

// 並び替えロジック（4曲空け）
function generateSetlist() {
  let remaining = [...songs];
  let result = [];

  while (remaining.length > 0) {
    let placed = false;

    for (let i = 0; i < remaining.length; i++) {
      const song = remaining[i];
      const membersOfSong = assignments[song] || [];

      let ok = true;

      for (let j = result.length - 1; j >= 0 && j > result.length - 5; j--) {
        const prev = result[j];
        const prevMembers = assignments[prev] || [];

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

    if (!placed) {
      result.push(remaining.shift());
    }
  }

  return result;
}