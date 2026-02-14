// 検索機能
function showText(str) {
  document.getElementById("showText").innerText = str
}

// 検索ボタンをクリックしたときに動く関数
async function searchButton() {
  // 変数breadNameに入力された文字を入れる
  let breadName = document.getElementById("inputText").value;
  
  // データベースのデータを取得
  let breadList = await getBreadList();
  
  // パンのデータベース（JS内に直接書く）
const breadList = [
  { name: "クロワッサン", time: "15分" },
  { name: "メロンパン", time: "20分" },
  { name: "カレーパン", time: "18分" },
  { name: "", time: "" },
];

// 入力されたパンの名前を検索する関数
function searchBread(breadName) {
  for (let i = 0; i < breadList.length; i++) {
    if (breadName === breadList[i].name) {
      showText(breadList[i].time);
      return;
    }
  }
  showText("入力した文字を確認してね");
}


// コメント機能
// コメントを表示する場所を取得
let commentsContainer = document.getElementById("comments");

// コメント一覧を表示する関数
async function renderAllComments() {
  // データベースのデータを取得
  let allComments = await getComments();

  // 表示されているコメントをクリア
  commentsContainer.innerHTML = "";

  // コメントをくり返し表示
  for (let i = 0; i < allComments.length; i++) {
    // 1セットのコメントを表示するための新しいdivを作成
    let commentBox = document.createElement("div");
    // 1セットのコメント内容をHTMLとして設定
    commentBox.innerHTML = `
      <div class="comment-set">
        <div class="name-datetime-box">
          <div class="name">${allComments[i]["author"]}</div>
          <div class="datetime">${allComments[i]["createdAt"]}</div>
        </div>
        <pre class="comment-text">${allComments[i]["content"]}</pre>
        <div class="like-container">
          <div class="like-button" onclick="likeComment(${i})">
            <img src="images/heart.png" class="like-img">
            <span class="like-count">${allComments[i]["likes"]}</span>
          </div>
        </div>
      </div>
    `
    // コメントを表示する場所に1セットのコメントを追加
    commentsContainer.prepend(commentBox);
  }
}

// コメント送信ボタンをクリックしたときに動く関数
async function submitButton() {
  // 変数commentに入力された内容をまとめて入れる
  let comment = {
    author: document.getElementById("name").value,
    content: document.getElementById("comment").value,
    createdAt: new Date().toLocaleString().slice(0, -3) ,
    likes: 0 // いいね初期値
  };

  // 名前欄とコメント欄が空でなければ
  if (comment.author != "" && comment.content != "") {
    // コメントをデータベースに送信・保存
    await postComment(comment);

    // 入力内容をリセット
    document.getElementById("form").reset();

    // コメント一覧を表示
    await renderAllComments(); 
  }
}

// i番目のコメントのいいねボタンがクリックされたときに動く関数
async function likeComment(i) {
  // 最新のコメント一覧を取得
  let allComments = await getComments();

  //いいね数を更新
  allComments[i]["likes"] += 1;

  // サーバーに更新後のコメント情報を送信（いいねを上書き）
  await patchComment(i, allComments[i]);

  // 再描画
  await renderAllComments();
}

// ページを開いたときにコメント一
