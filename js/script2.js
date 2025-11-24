$(function() {
    const HANDS = ["グー", "チョキ", "パー"]; 
    let playerHP = 5;
    let score = 0;
    let currentGhostHand = -1; // 現在のお化けの手 (-1は未出現/倒された状態)
    let gameInterval; // お化け出現のタイマーを格納する変数
    const GHOST_APPEAR_TIME = 2000; 


    // HP表示を更新する
    function updateHP() {
        $("#hp-value").text(playerHP);
        if (playerHP <= 0) {
            endGame("GAME OVER... お化けにやられてしまいました。");
        }
    }

    // スコア表示を更新する
    function updateScore() {
        $("#score-value").text(score);
    }

    // メッセージを表示する
    function displayMessage(text, isError = false) {
        $("#game-message").text(text);
        $("#message-box").toggleClass('error', isError);
    }

    // ------------------------------------
    // 3. ゲームロジック
    // ------------------------------------

    // じゃけんの勝敗を判定する関数
    // playerHand, ghostHand は 0(グー), 1(チョキ), 2(パー) のいずれか
    function checkWin(playerHand, ghostHand) {
        // (playerHand - ghostHand + 3) % 3 の結果で判定
        // 0: あいこ, 1: プレイヤーの負け, 2: プレイヤーの勝ち
        const result = (playerHand - ghostHand + 3) % 3;
        
        if (result === 2) {
            return "WIN"; // 勝ち手 (お化けを倒す)
        } else if (result === 1) {
            return "LOSE"; // 負け手 (HPが減る)
        } else {
            return "DRAW"; // あいこ
        }
    }

    // お化けを出現させる
    function spawnGhost() {
        // ランダムに 0, 1, 2 を生成
        currentGhostHand = Math.floor(Math.random() * 3);
        const ghostName = HANDS[currentGhostHand];
        
        // お化けの表示を更新 (実際には画像に置き換えてください)
        $("#ghost-display").text(`💥 ${ghostName}のお化け出現! 💥`);
        displayMessage("勝てる手を選んでビーム発射！");
    }

    // プレイヤーがボタンを押した時の処理
    $("#player-controls button").on("click", function() {
        if (playerHP <= 0 || currentGhostHand === -1) {
            displayMessage("ゲームオーバーです。またはお化けを待っています。", true);
            return;
        }

        // プレイヤーが選択した手 (data-hand属性から取得)
        const playerHand = parseInt($(this).attr("data-hand"));
        const result = checkWin(playerHand, currentGhostHand);
        
        const playerHandName = HANDS[playerHand];
        const ghostHandName = HANDS[currentGhostHand];

        if (result === "WIN") {
            // 勝利処理: お化けを倒す
            score += 100;
            updateScore();
            displayMessage(`👍 ${playerHandName}ビーム成功！${ghostHandName}のお化けを倒した！`);
            
            // お化けを倒したので一時的に非表示/リセット
            currentGhostHand = -1;
            $("#ghost-display").text("お化けを撃破！次を待て...");
            
        } else if (result === "LOSE") {
            // 敗北処理: HPが減る
            playerHP -= 1;
            updateHP();
            displayMessage(`💔 ${playerHandName}ビームは失敗！${ghostHandName}にやられた！`, true);
            
            // ダメージアニメーション
            $("body").addClass("damaged");
            setTimeout(() => {
                $("body").removeClass("damaged");
            }, 300);

        } else if (result === "DRAW") {
            // あいこ処理
            displayMessage(`🤝 ${playerHandName}であいこ。何も起こらなかった...`);
        }
    });

    // お化けの出現と時間切れ判定を繰り返す
    function gameLoop() {
        // 前のお化けが倒されずに時間が経過したら、HPペナルティ
        if (currentGhostHand !== -1) {
             playerHP -= 1;
             updateHP();
             displayMessage(`⏰ 時間切れ！${HANDS[currentGhostHand]}のお化けに逃げられた（HP -1）`, true);
             
             // ダメージアニメーション
             $("body").addClass("damaged");
             setTimeout(() => {
                 $("body").removeClass("damaged");
             }, 300);
        }
        
        // 新しいお化けを出現させる
        spawnGhost();
    }

    // ------------------------------------
    // 4. ゲームの開始と終了
    // ------------------------------------

    function startGame() {
        playerHP = 5;
        score = 0;
        updateHP();
        updateScore();
        displayMessage("ゲームスタート！", false);
        
        // 最初の出現
        spawnGhost();
        
        // 以降、一定間隔でゲームループを繰り返す
        gameInterval = setInterval(gameLoop, GHOST_APPEAR_TIME);
    }
    
    function endGame(message) {
        clearInterval(gameInterval); // タイマーを停止
        displayMessage(message + " スコア: " + score, true);
        
        // プレイヤー操作を一時的に無効化
        currentGhostHand = -1; 
        
        // ここにリスタートボタンの表示などを追加できます
    }

    // ゲームをスタート
    startGame();
});