

// 練習★★★
    // const test002 = document.querySelector("#test200");
    // const nani = document.querySelector("nani");

    // console.log(document.querySelector("test100").textContent);
    // console.log(test200.textContent);

// ココマデ練習★★★



        // ===================================
        // 1. カウント用変数の定義
        // ===================================

        let winCount = 0;
        let loseCount = 0;
        let drawCount = 0;
        let gameCount = 0;
        let timeLeft = 30;
        let timweIntervaild = null;
        let isGameActuive = false;

        // じゃんけんの手の配列 (0:グー, 1:チョキ, 2:パー)
        const hands = ["グー","チョキ","パー"];


        // ===================================
        // 2. DOM要素の取得
        // ===================================

        const startButton = document.querySelector('#start-button');
        const handButtons = document.querySelectorAll('.hand-buttons button');
        const gameCountEl = document.querySelector('#game-count');
        const winCountEl = document.querySelector('#win-count');
        const loseCountEl = document.querySelector('#lose-count');
        const drawCountEl = document.querySelector('#draw-count');
        const timeLeftEl = document.querySelector('#time-left');
        const currentResultEl = document.querySelector('#current-result');
        const finalResultEl = document.querySelector('#final-result');

        // ===================================
        // 3. ゲーム開始処理
        // ===================================

        function startGame () {
            //初期化
            winCount = loseCount = drawCount = gameCount = 0;
            timeLeft = 30;
            isGameActive = true;
            finalResultEl.textContent = "";

            // ボタンの状態を切り替え
            startButton.disabled = true;
            handButtons.forEach(btn => btn.disabled = false);

            updateDisplay();
            currentResultEl.textContent = "ゲーム開始";

            // タイマーを開始
            timerTntervalld = 


        }
























