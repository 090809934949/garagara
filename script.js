class SakuraLottery {
    constructor() {
        this.lotteryButton = document.getElementById('lotteryButton');
        this.lotteryWheel = document.getElementById('lotteryWheel');
        this.resultArea = document.getElementById('resultArea');
        this.resultIcon = document.getElementById('resultIcon');
        this.resultText = document.getElementById('resultText');
        this.resultMessage = document.getElementById('resultMessage');
        this.retryButton = document.getElementById('retryButton');
        this.cherryPetals = document.getElementById('cherryPetals');
        
        // くじの種類と確率設定
        this.fortunes = [
            { name: 'A賞', probability: 30, icon: '814.png', color: '#FFB347', message: 'おめでとうございます！A賞当選です♪' },
            { name: 'B賞', probability: 30, icon: '814.png', color: '#87CEEB', message: 'やったね！B賞当選です♪' },
            { name: 'C賞', probability: 20, icon: '814.png', color: '#98FB98', message: 'C賞当選です♪' },
            { name: 'S賞', probability: 20, icon: '814.png', color: '#FF6347', message: '🎉大当たり！S賞当選です！🎉✨' }
        ];
        
        this.isSpinning = false;
        this.init();
    }
    
    init() {
        // イベントリスナーの設定
        this.lotteryButton.addEventListener('click', () => this.spinLottery());
        this.retryButton.addEventListener('click', () => this.resetLottery());
        
        // 初期花びらを生成（即座に華やかな状態に）
        this.createInitialPetals();
        
        // 桜の花びらアニメーション開始
        this.startCherryPetals();
        
        // 初期状態での小さなアニメーション
        this.addIdleAnimations();
    }
    
    // 初期花びらを生成
    createInitialPetals() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createCherryPetal();
            }, i * 100);
        }
    }
    
    // 桜の花びらを降らせるアニメーション
    startCherryPetals() {
        // メインの花びら生成（頻繁に）
        setInterval(() => {
            if (Math.random() < 0.8) { // 80%の確率で花びらを生成
                this.createCherryPetal();
            }
        }, 150); // より短い間隔で確認
        
        // 追加の花びら生成（さらに華やかに）
        setInterval(() => {
            if (Math.random() < 0.6) { // 60%の確率で追加花びら
                this.createCherryPetal();
            }
        }, 200);
        
        // バースト効果（時々大量生成）
        setInterval(() => {
            if (Math.random() < 0.1) { // 10%の確率でバースト
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.createCherryPetal();
                    }, i * 50);
                }
            }
        }, 2000);
    }
    
    createCherryPetal() {
        const petal = document.createElement('img');
        petal.className = 'cherry-petal';
        petal.src = '151.png'; // 常に桜の花びらを使用
        petal.alt = '桜の花びら';
        
        // より幅広い位置からスタート（画面外からも）
        petal.style.left = (Math.random() * 120 - 10) + '%';
        
        // アニメーション時間をより短く、確実に落下完了
        const duration = Math.random() * 3 + 5; // 5-8秒
        petal.style.animationDuration = duration + 's';
        
        // より多様なサイズ（小さいものから大きいものまで）
        const size = Math.random() * 25 + 15; // 15px〜40px
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        // 透明度もランダムに
        const opacity = Math.random() * 0.4 + 0.6; // 0.6〜1.0
        petal.style.opacity = opacity;
        
        petal.style.filter = 'drop-shadow(0 2px 4px rgba(255, 182, 193, 0.3))';
        petal.style.transform = `rotate(${Math.random() * 360}deg)`; // ランダムな回転で自然な落下
        
        // 開始位置をより上に設定
        petal.style.top = '-150px';
        
        // 遅延なしで即座に開始
        petal.style.animationDelay = '0s';
        
        this.cherryPetals.appendChild(petal);
        
        // アニメーション時間に合わせて削除（少しマージンを持たせて）
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, (duration + 1) * 1000);
    }
    
    // アイドル状態でのアニメーション
    addIdleAnimations() {
        setInterval(() => {
            if (!this.isSpinning) {
                this.lotteryWheel.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                setTimeout(() => {
                    if (!this.isSpinning) {
                        this.lotteryWheel.style.transform = 'rotate(0deg)';
                    }
                }, 500);
            }
        }, 3000);
    }
    
    // くじ引きのメイン処理
    async spinLottery() {
        if (this.isSpinning) return;
        
        // 前の結果をリセット
        this.resultArea.style.display = 'none';
        
        // 結果案内テキストを削除
        const indicator = this.resultArea.querySelector('.result-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        this.isSpinning = true;
        this.lotteryButton.disabled = true;
        this.lotteryButton.style.pointerEvents = 'none';
        
        // ボタンのアニメーションは削除（回転させない）
        
        // ガラポンのような激しい回転アニメーション
        const spinDuration = 3000;
        this.lotteryWheel.classList.add('garapon-spinning');
        
        // 元の回転スタイルをリセット
        this.lotteryWheel.style.transition = '';
        this.lotteryWheel.style.transform = '';
        
        // 花びらエフェクト
        this.createSpinEffects();
        
        // ガラガラ音の効果文字
        this.createGaraSounds();
        
        // くじの結果を決定
        const result = this.calculateLotteryResult();
        
        // ガラガラBGMを開始（ルーレット回転中のみ）
        this.startGaraponBGM(result);
        
        // アニメーション完了を待つ
        await this.sleep(spinDuration);
        
        // 玉の演出を表示（15秒の期待感演出）
        this.createPrizeBall(result);
        
        // 賞に応じてポンのタイミングと結果表示を調整
        if (result.name === 'S賞') {
            // S賞は特別演出：18秒後にカキン音、23秒後に結果表示
            setTimeout(() => {
                this.createPonSound(result.name);
            }, 18000);
            
            setTimeout(() => {
                this.showResult(result);
            }, 23000);
        } else if (result.name === 'A賞') {
            // A賞は15秒後にポン音、20秒後に結果表示
            setTimeout(() => {
                this.createPonSound(result.name);
            }, 15000);
            
            setTimeout(() => {
                this.showResult(result);
            }, 20000);
        } else {
            // B賞・C賞は10秒後にポン音、15秒後に結果表示
            setTimeout(() => {
                this.createPonSound(result.name);
            }, 10000);
            
            setTimeout(() => {
                this.showResult(result);
            }, 15000);
        }
        
        // 状態をリセット
        this.lotteryWheel.classList.remove('garapon-spinning');
        this.lotteryWheel.style.transition = 'transform 0.3s ease';
        this.lotteryWheel.style.transform = 'rotate(0deg)';
        this.isSpinning = false;
    }
    
    // 確率に基づいてくじの結果を計算
    calculateLotteryResult() {
        const random = Math.random() * 100;
        let cumulative = 0;
        
        for (const fortune of this.fortunes) {
            cumulative += fortune.probability;
            if (random <= cumulative) {
                return fortune;
            }
        }
        
        // フォールバック（通常は実行されない）
        return this.fortunes[0];
    }
    
    // スピン中のエフェクト
    createSpinEffects() {
        // 追加の花びらエフェクト
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createCherryPetal();
            }, i * 200);
        }
        
        // ボタン周りのエフェクト
        this.createButtonEffects();
    }
    
    // ボタン周りのエフェクト
    createButtonEffects() {
        const effectImages = ['151.png', '814.png'];
        const buttonRect = this.lotteryButton.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const effect = document.createElement('img');
                effect.src = effectImages[Math.floor(Math.random() * effectImages.length)];
                effect.alt = '桜エフェクト';
                effect.style.position = 'fixed';
                effect.style.left = (buttonRect.left + Math.random() * buttonRect.width) + 'px';
                effect.style.top = (buttonRect.top + Math.random() * buttonRect.height) + 'px';
                effect.style.width = '25px';
                effect.style.height = '25px';
                effect.style.pointerEvents = 'none';
                effect.style.zIndex = '1000';
                effect.style.filter = 'drop-shadow(0 2px 4px rgba(255, 182, 193, 0.4))';
                effect.style.animation = 'effectFloat 2s ease-out forwards';
                
                document.body.appendChild(effect);
                
                setTimeout(() => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    // 結果表示
    showResult(result) {
        // アイコンを画像に変更
        this.resultIcon.innerHTML = `<img src="${result.icon}" alt="${result.name}" style="width: 80px; height: 80px; filter: drop-shadow(0 4px 8px rgba(255, 182, 193, 0.4));">`;
        this.resultText.textContent = result.name;
        this.resultMessage.textContent = result.message;
        this.resultArea.style.display = 'block';
        
        // 結果カードの背景色を設定
        const resultCard = this.resultArea.querySelector('.result-card');
        resultCard.style.borderColor = result.color;
        resultCard.style.boxShadow = `0 20px 40px ${result.color}40`;
        
        // 祝賀エフェクト
        this.createCelebrationEffect(result);
        
        // ボタンを再有効化
        this.lotteryButton.disabled = false;
        this.lotteryButton.style.pointerEvents = 'auto';
    }
    
    // 賞の玉を生成（賞に応じた期待感演出）
    createPrizeBall(result) {
        const wheelRect = this.lotteryWheel.getBoundingClientRect();
        
        // 即座に期待感演出開始
        this.createAnticipationShake();
        
        // 賞に応じて演出時間を変更
        if (result.name === 'S賞') {
            // S賞は特別演出
            this.createSPrizeSpecialEffect(result, wheelRect);
        } else if (result.name === 'A賞') {
            // A賞は14秒演出
            this.createLongBuildupEffects(result, wheelRect);
            
            // 15秒後に玉を生成（カウントダウン「1」の1秒後）
            setTimeout(() => {
                this.createSingleBall(result, wheelRect, 0, 1);
                this.createLuxuryAPrizeEffect(wheelRect, result.color);
            }, 15000);
        } else {
            // B賞・C賞は9秒演出
            this.createShortBuildupEffects(result, wheelRect);
            
            // 10秒後に玉を生成（カウントダウン「1」の1秒後）
            setTimeout(() => {
                this.createSingleBall(result, wheelRect, 0, 1);
            }, 10000);
        }
    }
    
    // S賞・A賞用の長い期待感演出（14秒）
    createLongBuildupEffects(result, wheelRect) {
        // 間隔を調整（3秒、6秒、9秒）
        const shakeTexts = ['ワクワク...', 'ゾクゾク...', 'おや？'];
        
        [3000, 6000, 9000].forEach((time, index) => {
            setTimeout(() => {
                this.createAnticipationShake();
                
                // 各段階での文字演出
                this.createShakeText(shakeTexts[index], index + 1);
                
                // 時間が経つにつれて演出を強化
                this.createSparkleEffect(wheelRect, 5 + index * 3, '#FFB6C1');
            }, time);
        });
        
        // 11秒目からカウントダウン演出
        setTimeout(() => {
            this.createCountdownEffect();
        }, 11000);
    }
    
    // B賞・C賞用の短い期待感演出（9秒）
    createShortBuildupEffects(result, wheelRect) {
        // シンプルな演出（3秒目のみ）
        setTimeout(() => {
            this.createAnticipationShake();
            this.createShakeText('ドキドキ...', 0);
        }, 3000);
        
        // 6秒目からカウントダウン演出
        setTimeout(() => {
            this.createCountdownEffectShort();
        }, 6000);
    }
    
    // S賞専用特別演出
    createSPrizeSpecialEffect(result, wheelRect) {
        // 通常の期待感演出（9秒まで）
        const shakeTexts = ['ワクワク...', 'ゾクゾク...', 'おや？'];
        
        [3000, 6000, 9000].forEach((time, index) => {
            setTimeout(() => {
                this.createAnticipationShake();
                this.createShakeText(shakeTexts[index], index + 1);
                this.createSparkleEffect(wheelRect, 5 + index * 3, '#FFB6C1');
            }, time);
        });
        
        // 12秒目からサイト真っ暗 + 動画再生
        setTimeout(() => {
            this.createBlackoutWithVideo();
        }, 12000);
        
        // 15秒目から暗闇カウントダウン
        setTimeout(() => {
            this.createDarkCountdown();
        }, 15000);
        
        // 18秒後に金玉出現
        setTimeout(() => {
            this.createSingleBall(result, wheelRect, 0, 1);
            this.createUltimateSPrizeEffect(wheelRect, result.color);
            this.removeBlackoutEffect();
        }, 18000);
    }
    
    // 震え時の文字演出
    createShakeText(text, intensity) {
        const shakeText = document.createElement('div');
        shakeText.textContent = text;
        shakeText.style.position = 'fixed';
        shakeText.style.left = '50%';
        shakeText.style.top = `${20 + intensity * 5}%`; // 段階的に下に表示
        shakeText.style.transform = 'translateX(-50%)';
        shakeText.style.fontSize = `${2 + intensity * 0.3}rem`; // 段階的に大きく
        shakeText.style.fontWeight = 'bold';
        shakeText.style.color = ['#FF69B4', '#FF6347', '#FF4500', '#FF0000'][intensity]; // 段階的に赤く
        shakeText.style.textShadow = '3px 3px 6px rgba(0,0,0,0.5)';
        shakeText.style.zIndex = '1001';
        shakeText.style.animation = `shakeTextPulse ${1.5 + intensity * 0.2}s ease-out forwards`;
        
        document.body.appendChild(shakeText);
        
        setTimeout(() => {
            if (shakeText.parentNode) {
                shakeText.parentNode.removeChild(shakeText);
            }
        }, 2000);
    }
    
    // S賞の超豪華演出
    createUltimateSPrizeEffect(wheelRect, color) {
        // 大量キラキラ爆発
        setTimeout(() => {
            this.createSparkleEffect(wheelRect, 30, color);
            this.createSparkleEffect(wheelRect, 20, '#FFD700'); // 金色追加
        }, 100);
        
        // 超興奮音効果の連続
        setTimeout(() => {
            this.createExcitementSounds(['🎉大当たり！🎉', '✨JACKPOT✨', '💰ゴールド！💰', '🌟最高賞🌟']);
        }, 200);
        
        // 超強力ルーレット発光
        this.createUltimateLightEffect(color);
        
        // 画面全体のお祝いエフェクト
        this.createScreenCelebration();
    }
    
    // A賞の豪華演出
    createLuxuryAPrizeEffect(wheelRect, color) {
        // 中量キラキラ
        setTimeout(() => {
            this.createSparkleEffect(wheelRect, 20, color);
        }, 100);
        
        // 豪華音効果
        setTimeout(() => {
            this.createExcitementSounds(['🎊おめでとう！🎊', '✨素晴らしい！✨', '🔥やったね！🔥']);
        }, 200);
        
        // 強力ルーレット発光
        this.createLuxuryLightEffect(color);
    }
    
    // カウントダウン演出（長バージョン）
    createCountdownEffect() {
        ['3...', '2...', '1...'].forEach((count, index) => {
            setTimeout(() => {
                const countdown = document.createElement('div');
                countdown.textContent = count;
                countdown.style.position = 'fixed';
                countdown.style.left = '50%';
                countdown.style.top = '40%';
                countdown.style.transform = 'translateX(-50%)';
                countdown.style.fontSize = '4rem';
                countdown.style.fontWeight = 'bold';
                countdown.style.color = '#FF6B47';
                countdown.style.textShadow = '4px 4px 8px rgba(0,0,0,0.7)';
                countdown.style.zIndex = '1002';
                countdown.style.animation = 'countdownPulse 1s ease-out forwards';
                
                document.body.appendChild(countdown);
                
                setTimeout(() => {
                    if (countdown.parentNode) {
                        countdown.parentNode.removeChild(countdown);
                    }
                }, 1000);
            }, index * 1000);
        });
    }
    
    // カウントダウン演出（短バージョン）
    createCountdownEffectShort() {
        ['3...', '2...', '1...'].forEach((count, index) => {
            setTimeout(() => {
                const countdown = document.createElement('div');
                countdown.textContent = count;
                countdown.style.position = 'fixed';
                countdown.style.left = '50%';
                countdown.style.top = '40%';
                countdown.style.transform = 'translateX(-50%)';
                countdown.style.fontSize = '4rem';
                countdown.style.fontWeight = 'bold';
                countdown.style.color = '#FF6B47';
                countdown.style.textShadow = '4px 4px 8px rgba(0,0,0,0.7)';
                countdown.style.zIndex = '1002';
                countdown.style.animation = 'countdownPulse 1s ease-out forwards';
                
                document.body.appendChild(countdown);
                
                setTimeout(() => {
                    if (countdown.parentNode) {
                        countdown.parentNode.removeChild(countdown);
                    }
                }, 1000);
            }, index * 1000);
        });
    }
    
    // 単一の玉を生成（時間を延ばした演出）
    createSingleBall(result, wheelRect, index, totalBalls) {
        const ball = document.createElement('div');
        ball.className = 'prize-ball';
        
        // 賞に応じたクラスを追加
        switch(result.name) {
            case 'C賞': ball.classList.add('c-prize'); break;
            case 'B賞': ball.classList.add('b-prize'); break;
            case 'A賞': ball.classList.add('a-prize'); break;
            case 'S賞': ball.classList.add('s-prize'); break;
        }
        
        // ルーレットの右下から出現（固定位置）
        const startX = wheelRect.left + wheelRect.width * 0.75;
        const startY = wheelRect.top + wheelRect.height * 0.75;
        
        ball.style.position = 'fixed';
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        ball.style.zIndex = '1000';
        
        // S賞・A賞のみ光る演出
        if (result.name === 'S賞' || result.name === 'A賞') {
            ball.style.filter = 'brightness(1.5) drop-shadow(0 0 15px ' + result.color + ')';
            ball.style.animation = 'ballSparkle 0.5s ease-in-out infinite alternate';
        }
        
        document.body.appendChild(ball);
        
        // ゆっくり落ちる演出（時間を大幅に延長）
        const endX = startX + (Math.random() - 0.5) * 400;
        const endY = window.innerHeight + 100;
        const rotation = Math.random() * 720 - 360;
        
        ball.style.transition = 'all 6s ease-out'; // 6秒に延長
        
        setTimeout(() => {
            ball.style.left = `${endX}px`;
            ball.style.top = `${endY}px`;
            ball.style.transform = `rotate(${rotation}deg) scale(0.8)`;
            ball.style.opacity = '0.7';
        }, 200); // 少し遅らせて開始
        
        // 削除時間も延長
        setTimeout(() => {
            if (ball.parentNode) {
                ball.parentNode.removeChild(ball);
            }
        }, 6500);
    }
    
    // ガラガラ音の効果文字を生成
    createGaraSounds() {
        const sounds = ['ガラッ', 'ガラッ', 'ガラガラ'];
        
        // 左側のガラ音
        setTimeout(() => {
            this.createSoundEffect(sounds[0], 'left');
        }, 500);
        
        // 右側のガラ音
        setTimeout(() => {
            this.createSoundEffect(sounds[1], 'right');
        }, 1200);
        
        // 中央のガラガラ音
        setTimeout(() => {
            this.createSoundEffect(sounds[2], 'center');
        }, 2000);
    }
    
    // ガラガラBGMを開始（ルーレット回転中のみ）
    startGaraponBGM(result) {
        // 既存のBGMがあれば停止
        this.stopGaraponBGM();
        
        const audio = document.createElement('audio');
        audio.id = 'garapon-bgm';
        audio.src = '0831(1).MP3';
        audio.loop = true; // 連続再生
        audio.volume = 0.4; // 控えめな音量
        
        document.body.appendChild(audio);
        
        audio.play().catch(error => {
            console.log('BGMの自動再生に失敗しました:', error);
        });
        
        // ルーレット回転終了時（3秒後）にBGM停止
        setTimeout(() => {
            this.stopGaraponBGM();
        }, 3000);
    }
    
    // ガラガラBGMを停止
    stopGaraponBGM() {
        const audio = document.getElementById('garapon-bgm');
        if (audio) {
            audio.volume = 0;
            setTimeout(() => {
                if (audio.parentNode) {
                    audio.parentNode.removeChild(audio);
                }
            }, 500);
        }
    }
    
    // ポン音の効果音を生成（賞別）
    createPonSound(prizeName = null) {
        if (prizeName === 'S賞') {
            // S賞はカキン音 + パンパカパーン
            this.createPrizeAudio('カキン.MP3', 0.8);
            
            // カキン音の後すぐにパンパカパーン音を再生
            setTimeout(() => {
                this.createPrizeAudio('パンパカパーン.MP3', 0.8);
            }, 300); // 300ms後に再生（カキン音と重ならないように）
        } else {
            // C・B・A賞はポン音
            this.createPrizeAudio('ポン.MP3', 0.7);
        }
    }
    
    // 賞の効果音を再生
    createPrizeAudio(filename, volume) {
        const audio = document.createElement('audio');
        audio.src = filename;
        audio.volume = volume;
        
        document.body.appendChild(audio);
        
        audio.play().catch(error => {
            console.log(`${filename}の再生に失敗しました:`, error);
        });
        
        // 再生終了後に削除
        audio.addEventListener('ended', () => {
            if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        });
        
        // エラー時も削除
        audio.addEventListener('error', () => {
            if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        });
        
        // 念のため5秒後に削除
        setTimeout(() => {
            if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        }, 5000);
    }
    
    // 真っ暗演出と同時に動画＋音声再生
    createBlackoutWithVideo() {
        // 真っ暗オーバーレイ
        const blackout = document.createElement('div');
        blackout.id = 'blackout-overlay';
        blackout.style.position = 'fixed';
        blackout.style.top = '0';
        blackout.style.left = '0';
        blackout.style.width = '100vw';
        blackout.style.height = '100vh';
        blackout.style.backgroundColor = '#000';
        blackout.style.zIndex = '1004';
        blackout.style.opacity = '0';
        blackout.style.transition = 'opacity 1s ease-in-out';
        
        document.body.appendChild(blackout);
        
        // 動画を画面いっぱいで表示
        const video = document.createElement('video');
        video.id = 's-prize-video';
        video.src = '33334_1280x720.mp4';
        video.autoplay = true;
        video.muted = true;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.objectFit = 'cover'; // 画面いっぱいに表示
        video.style.zIndex = '1005'; // 真っ暗より前面
        video.style.opacity = '0';
        video.style.transition = 'opacity 0.5s ease-in-out';
        
        document.body.appendChild(video);
        
        // MP3音声を同時再生
        const audio = document.createElement('audio');
        audio.id = 's-prize-audio';
        audio.src = '0831.MP3';
        audio.autoplay = true;
        audio.volume = 0.7; // 音量調整
        
        document.body.appendChild(audio);
        
        // 真っ暗と動画、音声を同時に開始
        setTimeout(() => {
            blackout.style.opacity = '0.95';
            video.style.opacity = '1';
            
            // 音声再生開始
            audio.play().catch(error => {
                console.log('音声の自動再生に失敗しました:', error);
            });
        }, 50);
        
        // 動画終了時やエラー時の処理
        video.addEventListener('ended', () => {
            video.style.opacity = '0';
            setTimeout(() => {
                if (video.parentNode) {
                    video.parentNode.removeChild(video);
                }
            }, 500);
        });
        
        video.addEventListener('error', () => {
            console.log('動画の読み込みに失敗しました');
            if (video.parentNode) {
                video.parentNode.removeChild(video);
            }
        });
        
        // 音声終了時やエラー時の処理
        audio.addEventListener('ended', () => {
            if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        });
        
        audio.addEventListener('error', () => {
            console.log('音声の読み込みに失敗しました');
            if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        });
        
        // 3秒後に動画と音声をフェードアウト
        setTimeout(() => {
            if (video.parentNode) {
                video.style.opacity = '0';
                setTimeout(() => {
                    if (video.parentNode) {
                        video.parentNode.removeChild(video);
                    }
                }, 500);
            }
            
            if (audio.parentNode) {
                audio.volume = 0;
                setTimeout(() => {
                    if (audio.parentNode) {
                        audio.parentNode.removeChild(audio);
                    }
                }, 500);
            }
        }, 3000);
    }
    
    // サイト真っ暗演出
    createBlackoutEffect() {
        const blackout = document.createElement('div');
        blackout.id = 'blackout-overlay';
        blackout.style.position = 'fixed';
        blackout.style.top = '0';
        blackout.style.left = '0';
        blackout.style.width = '100vw';
        blackout.style.height = '100vh';
        blackout.style.backgroundColor = '#000';
        blackout.style.zIndex = '1004';
        blackout.style.opacity = '0';
        blackout.style.transition = 'opacity 1s ease-in-out';
        
        document.body.appendChild(blackout);
        
        // 少し遅らせて透明度を変更
        setTimeout(() => {
            blackout.style.opacity = '0.95';
        }, 50);
    }
    
    // 真っ暗演出を削除
    removeBlackoutEffect() {
        const blackout = document.getElementById('blackout-overlay');
        if (blackout) {
            blackout.style.opacity = '0';
            setTimeout(() => {
                if (blackout.parentNode) {
                    blackout.parentNode.removeChild(blackout);
                }
            }, 1000);
        }
        
        // S賞動画も削除
        const video = document.getElementById('s-prize-video');
        if (video) {
            video.style.opacity = '0';
            setTimeout(() => {
                if (video.parentNode) {
                    video.parentNode.removeChild(video);
                }
            }, 500);
        }
        
        // S賞音声も削除
        const audio = document.getElementById('s-prize-audio');
        if (audio) {
            audio.volume = 0;
            setTimeout(() => {
                if (audio.parentNode) {
                    audio.parentNode.removeChild(audio);
                }
            }, 500);
        }
    }
    
    // 暗闇カウントダウン
    createDarkCountdown() {
        ['3...', '2...', '1...'].forEach((count, index) => {
            setTimeout(() => {
                const countdown = document.createElement('div');
                countdown.textContent = count;
                countdown.style.position = 'fixed';
                countdown.style.left = '50%';
                countdown.style.top = '50%';
                countdown.style.transform = 'translate(-50%, -50%)';
                countdown.style.fontSize = '6rem';
                countdown.style.fontWeight = 'bold';
                countdown.style.color = '#FFD700';
                countdown.style.textShadow = '0 0 20px #FFD700, 0 0 40px #FFD700';
                countdown.style.zIndex = '1005';
                countdown.style.animation = 'darkCountdownGlow 1s ease-out forwards';
                
                document.body.appendChild(countdown);
                
                setTimeout(() => {
                    if (countdown.parentNode) {
                        countdown.parentNode.removeChild(countdown);
                    }
                }, 1000);
            }, index * 1000);
        });
    }
    
    // 結果案内テキストを生成
    createResultIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'result-indicator';
        indicator.textContent = '結果はこちら！';
        
        // 結果エリアに相対的に配置
        this.resultArea.style.position = 'relative';
        this.resultArea.appendChild(indicator);
        
        // 1.5秒後に削除
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 1500);
    }
    
    // 期待感を高める震え演出
    createAnticipationShake() {
        const lottery = document.querySelector('.lottery-box');
        lottery.style.animation = 'anticipationShake 0.8s ease-in-out';
        
        setTimeout(() => {
            lottery.style.animation = '';
        }, 800);
    }
    
    // キラキラエフェクト
    createSparkleEffect(wheelRect, count, color) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-effect';
                sparkle.style.position = 'fixed';
                sparkle.style.left = `${wheelRect.left + Math.random() * wheelRect.width}px`;
                sparkle.style.top = `${wheelRect.top + Math.random() * wheelRect.height}px`;
                sparkle.style.color = color;
                sparkle.style.fontSize = `${1 + Math.random() * 1.5}rem`;
                sparkle.style.zIndex = '999';
                sparkle.textContent = '✨';
                
                document.body.appendChild(sparkle);
                
                // アニメーション
                sparkle.style.transition = 'all 2s ease-out';
                setTimeout(() => {
                    sparkle.style.transform = `translateY(-100px) scale(${2 + Math.random()})`;
                    sparkle.style.opacity = '0';
                }, 50);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    // 興奮音効果
    createExcitementSounds(sounds) {
        sounds.forEach((sound, index) => {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'excitement-sound';
                effect.textContent = sound;
                effect.style.position = 'fixed';
                effect.style.left = '50%';
                effect.style.top = '30%';
                effect.style.transform = 'translateX(-50%)';
                effect.style.fontSize = '2.5rem';
                effect.style.fontWeight = 'bold';
                effect.style.color = '#FF6B47';
                effect.style.textShadow = '3px 3px 6px rgba(0,0,0,0.5)';
                effect.style.zIndex = '1001';
                effect.style.animation = 'excitementPop 1.5s ease-out forwards';
                
                document.body.appendChild(effect);
                
                setTimeout(() => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                }, 1500);
            }, index * 800);
        });
    }
    
    // ルーレット光る演出
    createWheelGlowEffect(color) {
        const wheel = this.lotteryWheel;
        const originalBoxShadow = wheel.style.boxShadow;
        
        wheel.style.boxShadow = `0 0 50px ${color}, 0 15px 30px var(--soft-shadow)`;
        wheel.style.filter = 'brightness(1.3)';
        
        setTimeout(() => {
            wheel.style.boxShadow = originalBoxShadow;
            wheel.style.filter = '';
        }, 2000);
    }
    
    // S賞用超強力光演出
    createUltimateLightEffect(color) {
        const wheel = this.lotteryWheel;
        const originalBoxShadow = wheel.style.boxShadow;
        
        // 超強力発光
        wheel.style.boxShadow = `0 0 100px ${color}, 0 0 150px #FFD700, 0 15px 30px var(--soft-shadow)`;
        wheel.style.filter = 'brightness(1.8) saturate(1.5)';
        wheel.style.animation = 'ultimateGlow 3s ease-in-out infinite';
        
        setTimeout(() => {
            wheel.style.boxShadow = originalBoxShadow;
            wheel.style.filter = '';
            wheel.style.animation = '';
        }, 5000);
    }
    
    // A賞用豪華光演出
    createLuxuryLightEffect(color) {
        const wheel = this.lotteryWheel;
        const originalBoxShadow = wheel.style.boxShadow;
        
        wheel.style.boxShadow = `0 0 80px ${color}, 0 0 120px ${color}, 0 15px 30px var(--soft-shadow)`;
        wheel.style.filter = 'brightness(1.6)';
        wheel.style.animation = 'luxuryGlow 2s ease-in-out infinite';
        
        setTimeout(() => {
            wheel.style.boxShadow = originalBoxShadow;
            wheel.style.filter = '';
            wheel.style.animation = '';
        }, 4000);
    }
    
    // 画面全体のお祝いエフェクト（S賞専用）
    createScreenCelebration() {
        // 画面全体に色とりどりのキラキラ
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'screen-sparkle';
                sparkle.style.position = 'fixed';
                sparkle.style.left = `${Math.random() * window.innerWidth}px`;
                sparkle.style.top = `${Math.random() * window.innerHeight}px`;
                sparkle.style.fontSize = `${2 + Math.random() * 2}rem`;
                sparkle.style.zIndex = '998';
                sparkle.style.color = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98'][Math.floor(Math.random() * 5)];
                sparkle.textContent = ['✨', '🌟', '💫', '⭐', '🎊'][Math.floor(Math.random() * 5)];
                sparkle.style.animation = 'screenSparkle 3s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 3000);
            }, i * 50);
        }
        
        // 画面を一瞬光らせる
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = '#FFD700';
        flash.style.opacity = '0.3';
        flash.style.zIndex = '997';
        flash.style.pointerEvents = 'none';
        flash.style.animation = 'screenFlash 0.5s ease-out forwards';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        }, 500);
    }

    
    // 効果音文字を生成
    createSoundEffect(text, position) {
        const sound = document.createElement('div');
        sound.className = 'sound-effect';
        sound.textContent = text;
        
        // 位置設定
        switch(position) {
            case 'left':
                sound.style.left = '35%'; /* ルーレットの左すぐそば */
                sound.style.top = '25%';
                sound.classList.add('sound-gara');
                break;
            case 'right':
                sound.style.right = '35%'; /* ルーレットの右すぐそば */
                sound.style.top = '25%';
                sound.classList.add('sound-gara');
                break;
            case 'center':
                sound.style.left = '50%';
                sound.style.top = '15%'; /* ルーレットの真上すぐそば */
                sound.style.transform = 'translateX(-50%)';
                sound.classList.add('sound-gara');
                break;
            case 'center-ball':
                sound.style.left = '50%';
                sound.style.top = '40%';
                sound.style.transform = 'translateX(-50%)';
                sound.style.fontSize = '3rem';
                sound.style.color = '#FF6347';
                sound.classList.add('sound-pon');
                break;
        }
        
        document.body.appendChild(sound);
        
        // アニメーション終了後に削除
        setTimeout(() => {
            if (sound.parentNode) {
                sound.parentNode.removeChild(sound);
            }
        }, text === 'ポンッ！' ? 1000 : 800);
    }
    
    // 祝賀エフェクト
    createCelebrationEffect(result) {
        const celebrationCount = result.name === 'S賞' ? 50 : 
                               result.name === 'A賞' ? 25 : 
                               result.name === 'B賞' ? 15 : 10;
        
        for (let i = 0; i < celebrationCount; i++) {
            setTimeout(() => {
                this.createCelebrationPetal(result);
            }, i * 100);
        }
    }
    
    createCelebrationPetal(result) {
        const petal = document.createElement('img');
        petal.src = Math.random() < 0.6 ? '151.png' : '814.png';
        petal.alt = '祝賀桜';
        petal.style.position = 'fixed';
        petal.style.left = '50%';
        petal.style.top = '50%';
        petal.style.width = '35px';
        petal.style.height = '35px';
        petal.style.pointerEvents = 'none';
        petal.style.zIndex = '1000';
        petal.style.transform = 'translate(-50%, -50%)';
        petal.style.filter = 'drop-shadow(0 4px 8px rgba(255, 182, 193, 0.5))';
        
        const angle = Math.random() * 360;
        const distance = 100 + Math.random() * 200;
        const duration = 1000 + Math.random() * 1000;
        
        petal.style.animation = `celebrationExplode ${duration}ms ease-out forwards`;
        petal.style.setProperty('--angle', angle + 'deg');
        petal.style.setProperty('--distance', distance + 'px');
        
        document.body.appendChild(petal);
        
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, duration);
    }
    
    // リセット処理
    resetLottery() {
        this.resultArea.style.display = 'none';
        this.lotteryWheel.classList.remove('garapon-spinning');
        this.lotteryWheel.style.transform = 'rotate(0deg)';
        
        // BGMを停止
        this.stopGaraponBGM();
        
        // 結果案内テキストを削除
        const indicator = this.resultArea.querySelector('.result-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        // 小さな花びらエフェクト
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createCherryPetal();
            }, i * 100);
        }
    }
    
    // ユーティリティ関数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 追加のCSSアニメーション（JavaScriptで動的に追加）
const additionalStyles = `
    @keyframes effectFloat {
        0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
        }
    }
    
    @keyframes celebrationExplode {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) translateX(0px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)) scale(0.5);
        }
    }
`;

// スタイルを動的に追加
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ページ読み込み完了後にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new SakuraLottery();
});

// パフォーマンス最適化: 不要なイベントリスナーのクリーンアップ
window.addEventListener('beforeunload', () => {
    // クリーンアップ処理があればここに記述
});
