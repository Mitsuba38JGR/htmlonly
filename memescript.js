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
  { name: "かんくん（関くん）", time: "解任されたKIXの元マスコットキャラクター。漢字で書いてもひらがなにしても関とまったく同じ呼び名のため用いられている。《関連項目》解任ひまわり" },
  { name: "12", time: "OBが鹿児島校外学習で12回破産したことから仲間内の符丁となっている。《関連項目》破産王イカン・OB12世（ハサン12世）" },
  { name: "は？", time: "わちゃべの返事。Ms.Uにも放ったことがある。こわーい。" },
  { name: "足ない", time: "KIXの元マスコットキャラクター「かんくん」に足がないことから、関に対して言われる。《関連項目》かんくん（関くん）" },
  { name: "移植家の関くん", time: "現在のところ最も新しいミーム。移植家というのはメッサーではなくドナー（提供元）やレシピエント（移植先）のことである。とりあえずまずは関を用意しましょう。《関連項目》まずは関を用意します" },
  { name: "異食家の関くん", time: "「蒸し茶碗」の項目からの派生ミーム。何か人間に食べられないが大きさ的に口に入るものがあった場合、「異食家の関くんなら、これぐらい食べられるよね」と言って使用する。" },
  { name: "まずは関を用意します", time: "関が臓器をもがれたり体にメスを入れられたりして遊ばれるときに使用される。《関連項目》移植家の関くん" },
  { name: "蒸し茶碗", time: "鹿児島校外学習で関が茶碗蒸しのことを「蒸し茶碗だ！」と言ったことで生まれたミーム。関が言ったことで生まれたミーム多すぎだろ。《関連項目》異食家の関くん" },
  { name: "ひまわり", time: "関がマリーゴールドの写真を見て「ひまわり綺麗だなぁ〜」と言ったことで生まれたミーム。マリーゴールドとひまわりを見間違えるとは相当なアホである。《関連項目》解任ひまわり" },
  { name: "解任ひまわり", time: "「ひまわり」の項目で取り扱った内容とKIXの「かんくん」が解任されたことを合わせた複合ミームである。関の一般的な呼び名として使用される。《関連項目》ひまわり、かんくん（関くん）" },
  { name: "シンゴ黙れ", time: "深夜に持ち込んだラジオで基礎英語レベル1を聴いていて本田敏幸の安心感がすごいと感じていたときに、基礎英語レベル2になり、主がこのセリフを言ったことで流行しミーム化した。《関連項目》声が小さーい！！" },
  { name: "過冷却チャレンジ", time: "主が財宝のペットボトルを冷凍庫に入れておいたところ過冷却になったため約30分に1回主が様子を見に行ったことを指す。" },
  { name: "声が小さーい！！", time: "基礎英語でシンゴの英文を読み上げる声が小さいためそれに対してキレるセリフである。「シンゴ黙れ」と並んで数分で有名になった。全員で基礎英語を聞くときに廊下に向かって叫んだ。《関連項目》シンゴ黙れ" },
  { name: "さすが関くん格が違う", time: "関が何かにつけて我々の想像を超えた行動を見せるので生まれたテンプレ。兄弟テンプレとしては「さすが芸人エンタメには事欠かない」がある。《関連項目》さすが芸人エンタメには事欠かない" },
  { name: "さすが芸人エンタメには事欠かない", time: "何をやっても面白いということでこのテンプレが誕生。兄弟テンプレとしては「さすが関くん格が違う」がある。《関連項目》さすが関くん格が違う" },
  { name: "パンくんに失礼", time: "某テレビ番組のチンパンジーの「パン君」は賢いため、この呼び名を関に使うのはパン君に失礼だということで生まれた。" },
  { name: "かんくんだもんね、しょうがないね", time: "関がこwれwはwひどいwってことばっかやったので関が何かやらかすかやらかさないかするとこう言われるようになった。" },
  { name: "破産王イカン・OB12世（ハサン12世）", time: "破産しすぎな男。座学は完璧だが実技で金を一瞬で溶かすバカである。" },
  { name: "ベットゲーム", time: "鹿児島校外学習で開催された2日間のギャンブルゲームのこと。関が国立銀行を名乗りコインを最初に6枚貸し付け、みんながOBからコインを搾り取るなどして苦しめた。そしてOBは1日目6回、2日目にも6回破産。" },
  { name: "かんけり", time: "関が鹿児島校外学習で「蹴っていいよ」と言ったことで始まったミーム。遊びの「缶蹴り」と掛けている。なお本人的にはすごく嫌がっている。《関連項目》KKP" },
  { name: "KKP", time: "「かんけりポイント」の略。表向きには「Keep your Kotoba Positive-Point」の略とされている。これが1000貯まるごとに「かんけり」が開始される場合がある（確率または気分）。" },
  { name: "わちゃべ観察日記", time: "呼んで字の如く、わちゃべを観察している（適当に）記録をつけた日記である。脳内にしかないしそもそももうほぼ覚えていない。本人に「なんか話とったろ？」とキレられた。何も話してません。" },
  { name: "わちゃべステップ", time: "プリントを両手で前に抱えたまま走る独特の走り方。音が出るため隠密行動には向かない。" },
  { name: "コケ（苔）", time: "関の着ている防寒着が完全にそれにしか見えなかったため本人がこの名前で呼んでいる。" },
  { name: "数ⅣD", time: "「賭け算」の学術的名称。座学と実技に分かれており、それぞれにパチンコ・スロット・カードゲーム・公営ギャンブル・賭け麻雀などがある。" },
  { name: "水田二平", time: "「賭け算」を創設しその地位を大きく向上させた人物。2年間ほどでおよそ1024億円を稼いだ。もちろん納税をきちんと行っている。" },
  { name: "賭け算", time: "ギャンブルのプロである水田二平（みずたにーぺい）氏が実用化・学問化した、ギャンブルの必勝法や勝ちやすくなる秘訣を学ぶ。場合の数や確率計算はもちろん、台の特性やオッズによる賭けの分岐などについても学ぶ。" },
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
