//--------------------------
//  ★手の情報（名前、画像パス、クラス名）をセットで格納
//-------------------------
const HANDS = {
    0:{ name:"グー", imagePath:"images/gu.png", classname: "gu"},
    1:{ name:"チョキ",imagePath:"images/choki.png", classname: "choki"},
    2:{ name:"パー", imagePath:"images/pa.png", classname: "pa"}
};
// 確認
// console.log(HANDS[0].imagePath);

// ★状態を保存するのでlet使う
let $currentCell = null; //今どのマスでじゃんけんをしているか
let currentHandIndex = -1; //今、マス目に表示されているコンピューターの手
let remainingCells  = [];  //まだじゃんけんが行われていないマス目（セル）のIDリスト（配列）でメモ
let gameEnded = false;  //ゲーム終了フラグゲーム開始前なのでfalse



function judgeAndAnimate(playerHandIndex){
    if(gameEnded || !$currentCell || currentHandIndex === -1) return; // returnwですぐに処理を中断

    disableButtons(true); // ボタンを非活性にしておく

    // 1. ボールアニメーションの準備
    const $playerButton = $(`#${playerHandIndex === 0 ? 'button_g' : playerHandIndex === 1 ? 'button_c' : 'button_p'}`);
    const buttonOffset = $playerButton.offset(); // クリックしたボタンの位置
    const cellOffset = $currentCell.offset();     // 現在のマス目の位置

    // ボールの開始位置（クリックしたボタンの中心に合わせる）
    const startX = buttonOffset.left + $playerButton.outerWidth() / 2 - $jankenBall.outerWidth() / 2;
    const startY = buttonOffset.top + $playerButton.outerHeight() / 2 - $jankenBall.outerHeight() / 2;
    
    // ボールの終了位置（マス目の中心に合わせる）
    const endX = cellOffset.left + $currentCell.outerWidth() / 2 - $jankenBall.outerWidth() / 2;
    const endY = cellOffset.top + $currentCell.outerHeight() / 2 - $jankenBall.outerHeight() / 2;

    // 移動距離の計算
    const targetX = endX - startX;
    const targetY = endY - startY;
    
    // ボールを初期位置に配置して表示
    $jankenBall.css({
        left: startX + 'px',
        top: startY + 'px',
        display: 'block',
        // CSS変数にターゲットの移動距離を設定
        '--target-x': targetX + 'px',
        '--target-y': targetY + 'px',
        // アニメーションをリセット（重要）
        animation: 'none' 
    });
    
    // 2. アニメーション開始
    // 強制的なリフローを挟んでからアニメーションクラスを追加することで、アニメーションが最初から発動するようにする
    void $jankenBall[0].offsetWidth; 
    $jankenBall.css('animation', 'flyToCell 0.5s ease-in forwards'); // 0.5秒のアニメーション

    // 3. アニメーション終了後に勝敗判定と次のラウンドへ
    // アニメーション時間に合わせてsetTimeoutを設定
    setTimeout(() => {
        // アニメーション終了後、ボールを非表示にし、アニメーションもリセット
        $jankenBall.css({
            display: 'none',
            animation: 'none'
        });

        // 勝敗判定のロジック（既存コード）
        const result = (playerHandIndex - currentHandIndex + 3) % 3; // 0（引き分け）、1（負け）、2（勝ち)

        // 勝敗マークの削除
        $currentCell.find("img.janken-hand-image").remove();
        $currentCell.find(".result-mark").remove();

        // 勝敗マークの追加とクラス設定
        if(result === 2){
            $currentCell.addClass("win").removeClass("lose draw");
            $currentCell.append('<div class="result-mark win-mark">〇</div>');
        }else if (result === 1){
            $currentCell.addClass("lose").removeClass("win draw");
            $currentCell.append('<div class="result-mark lose-mark">×</div>');
        }else {
            $currentCell.addClass("draw").removeClass("win lose");
            $currentCell.append('<div class="result-mark draw-mark">△</div>');
        }

        // 2秒たったら次に進む
        setTimeout(nextRound, 2000);
    }, 500); // アニメーション時間と同じ500ms後に処理を実行
}

//--------------------------
//★マス目のランダム関数
//--------------------------
//getRandomInt関数
function getRandomInt(max){
    return Math.floor(Math.random()*max);
}

//--------------------------
//★ゲームを開始の処理
//すべてのセルに数字をセット、remainingCellsにIDを追加
//タテヨコのfor文
//--------------------------
function initializeGame(){
    let cellNumber = 1;
    for (let row = 0; row < 3; row++){
        for (let col = 0; col<3; col++){
            const cellId = `cell_${row}_${col}`;
            remainingCells.push(cellId);
            cellNumber++;
        }
    }
    gameEnded = false;
    nextRound();
}

//--------------------------
//★次のじゃんけんラウンド
//--------------------------
function nextRound(){
    if(remainingCells.length === 0){
        gameEnded = true;
        // alert("ゲーム終了！お疲れ様でした！"); // アラートなどで終了を知らせる
        $(messege).text("ゲーム終了！");
        disableButtons(true);
        return;
    }
   
    const randomIndex = getRandomInt(remainingCells.length);// getRandomInt関数でremainingCells.lengthのなかからランダムに選択
    const nextCellId = remainingCells[randomIndex];

    remainingCells.splice(randomIndex,1);//.splice関数でrandomIndexから1個消す

    $currentCell = $(`#${nextCellId}`);//現在のセルとして設定する

    $currentCell.text("");
    $currentCell.find(".result-mark").remove();

    currentHandIndex = getRandomInt(3);
    const handData = HANDS[currentHandIndex];

    const $img = $('<img>').attr('src',handData.imagePath).addClass("janken-hand-image");
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
// イベントリスナーの設定
// ===================================

const $jankenBall = $("#janken-ball");


$(document).ready(function() {
    // 既にグローバル変数として$jankenBallを定義している場合、ここでの再取得は不要です。
    // 必要であれば、HTML構造に合わせてidを調整してください。

    $("#button_g").on("click", () => judgeAndAnimate(0));
    $("#button_c").on("click", () => judgeAndAnimate(1));
    $("#button_p").on("click", () => judgeAndAnimate(2));

    initializeGame(); // ゲームの初期化と最初のラウンド開始
});

// ===================================
// スライド
// ===================================



$(function() {
    // すべてのスライドアイテムを取得
    const $slideItems = $('#main-view .slide-item');
    // 現在表示している画像のインデックス (0から始まる)
    let currentIndex = 0;
    // スライドの総数
    const totalSlides = $slideItems.length;

    /**
     * 指定されたインデックスの画像を表示する関数
     * @param {number} index - 表示したい画像のインデックス
     */
    function showSlide(index) {
        // 現在表示されている画像を隠す (display: none)
        $slideItems.eq(currentIndex).hide();
        
        // インデックスを更新
        currentIndex = index;
        
        // 新しい画像をフェードインで表示する
        $slideItems.eq(currentIndex).fadeIn(300); // 300msで切り替え
    }

    // 次へボタンのクリックイベント
    $('#next-button').on('click', function() {
        // 次のインデックスを計算
        let nextIndex = currentIndex + 1;
        // 最後の画像だったら最初に戻る (ループ再生)
        if (nextIndex >= totalSlides) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    });

    // 戻るボタンのクリックイベント
    $('#prev-button').on('click', function() {
        // 前のインデックスを計算
        let prevIndex = currentIndex - 1;
        // 最初の画像だったら最後に進む (ループ再生)
        if (prevIndex < 0) {
            prevIndex = totalSlides - 1;
        }
        showSlide(prevIndex);
    });
});