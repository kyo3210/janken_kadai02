// const coputerHand = Math.floor(Math.random() * 3);

// if (coputerHand === 0) { // <--- '=' を '===' に修正
//     cell.log("グー");
// } else if (coputerHand === 1) { // <--- 'elseif' を 'else if' に修正し、'=' を '===' に修正
//     console.log("パー");
// } else { // 0でも1でもない場合（つまり2の場合）
//     console.log("チョキ");
// }

// ===================================
// 1. じゃんけんの定義と状態管理
// ===================================

const HANDS = {
    0: { name: "グー", imagePath: "images/gu.png", className: "gu" },
    1: { name: "チョキ", imagePath: "images/choki.png", className: "choki" },
    2: { name: "パー", imagePath: "images/pa.png", className: "pa" }
};

// 状態を保持する変数
let $currentCell = null;           // 現在じゃんけん中のjQueryオブジェクト
let currentHandIndex = -1;         // 現在じゃんけん中の手 (0, 1, 2)
let remainingCells = [];           // まだじゃんけんが行われていないセルのIDを保持
let gameEnded = false;             // ゲームが終了したかどうかのフラグ

// ===================================
// 2. 勝敗判定とセル更新のロジック (画像を削除する処理を再確認)
// ===================================

function judgeAndAnimate(playerHandIndex) {
    if (gameEnded || !$currentCell || currentHandIndex === -1) return;

    const result = (playerHandIndex - currentHandIndex + 3) % 3;

    disableButtons(true); 

    // ✅ 画像を削除し、既存の勝敗マークも削除する処理を確実に行います
    //    セレクタ '.janken-hand-image' が正しいか確認してください。
    $currentCell.find('img.janken-hand-image').remove(); 
    $currentCell.find('.result-mark').remove(); 

    // 勝敗結果の表示
    if (result === 2) {
        // 勝ち: 画像は削除済み、マークなし、透明度の高いグレー色
        $currentCell.addClass("win").removeClass("lose draw");        
    } else if (result === 1) {
        // 負け: 画像は削除済み、赤い「×」マークを表示
        $currentCell.addClass("lose").removeClass("win draw");
        $currentCell.append('<div class="result-mark lose-mark">×</div>');
    } else {
        // 引き分け: 画像は削除済み、緑の「△」マークを表示
        $currentCell.addClass("draw").removeClass("win lose");
        $currentCell.append('<div class="result-mark draw-mark">△</div>');
    }

    // 2秒後に次のラウンドに進む
    setTimeout(nextRound, 2000);
}

// ===================================
// 3. ゲームの進行ロジック
// ===================================

/**
 * 0からmaxまでのランダムな整数を生成する関数
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * ゲームの初期化 (DOMがロードされた時に一度だけ実行)
 */
function initializeGame() {
    // 全てのセルに数字をセットし、remainingCellsにIDを追加
    let cellNumber = 1;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellId = `cell_${row}_${col}`;
            $(`#${cellId}`).text(cellNumber).addClass('initial-number'); // ID（識別名）を文字列で
            remainingCells.push(cellId); // まだじゃんけんが行われていないセルとして追加
            cellNumber++;
        }
    }
    gameEnded = false;
    nextRound(); // 最初のラウンドを開始
}

/**
 * 次のラウンドの準備：まだじゃんけんが行われていないセルを選び、手を表示する
 */
function nextRound() {
    // ゲーム終了判定
    if (remainingCells.length === 0) {
        gameEnded = true;
        console.log("ゲーム終了！全てのセルでじゃんけんが行われました。");
        disableButtons(true); // 全てのじゃんけんが終わったらボタンを無効化
        alert("ゲーム終了！お疲れ様でした！"); // アラートなどで終了を知らせる
        return; // ゲーム終了なので処理を中断
    }

    // まだじゃんけんが行われていないセルの中からランダムに一つ選ぶ
    const randomIndex = getRandomInt(remainingCells.length);
    const nextCellId = remainingCells[randomIndex];
    
    // 選ばれたセルをremainingCellsから削除
    remainingCells.splice(randomIndex, 1);

    // 現在のセルとして設定
    $currentCell = $(`#${nextCellId}`);
    
    // セルの初期数字をクリアし、じゃんけん画像を表示
    $currentCell.text(""); // 数字を削除
    $currentCell.removeClass('initial-number'); // 初期数字のクラスも削除
    $currentCell.find('.result-mark').remove(); // 前回のマークが残っていたら削除

    // ランダムなじゃんけんの手を生成し、状態を更新
    currentHandIndex = getRandomInt(3); // 0, 1, 2のいずれか
    const handData = HANDS[currentHandIndex];

    // <img>タグを作成し、src属性に画像パスを設定
    const $img = $('<img>').attr('src', handData.imagePath).addClass('janken-hand-image');
    $currentCell.append($img); // セルの中に画像を追加
    $currentCell.addClass(handData.className); // 手の種類を示すクラスも追加

    disableButtons(false); // ボタンを有効化
}

/**
 * ボタンの有効/無効を切り替える
 * @param {boolean} disabled - trueで無効化、falseで有効化
 */
function disableButtons(disabled) {
    $("#button_g, #button_c, #button_p").prop("disabled", disabled);
}

// ===================================
// 4. イベントリスナーの設定
// ===================================

$(document).ready(function() {
    $("#button_g").on("click", () => judgeAndAnimate(0));
    $("#button_c").on("click", () => judgeAndAnimate(1));
    $("#button_p").on("click", () => judgeAndAnimate(2));

    initializeGame(); // ゲームの初期化と最初のラウンド開始
});
