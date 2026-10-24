import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  ArrowLeft,
  Trophy,
  Award,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Fuel,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft as ArrowL,
  ArrowRight as ArrowR,
  Flame,
  Clock,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import contentData from '../data/contentData.json';

interface GameSectionProps {
  onBackToHome: () => void;
}

export const GameSection: React.FC<GameSectionProps> = ({ onBackToHome }) => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake'>('flappy');
  const [savedVoucher, setSavedVoucher] = useState<string | null>(null);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const v = localStorage.getItem('vietinbank_latest_voucher');
    const hs = localStorage.getItem('vietinbank_flappy_highscore');
    if (v) setSavedVoucher(v);
    if (hs) setHighScore(parseInt(hs, 10));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#003B70]" />
          <span>Quay lại màn hình chính</span>
        </button>

        <span className="text-xs font-medium text-slate-500">
          Chuyên mục: Thử thách Game nhận voucher xăng
        </span>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white border border-white/20">
            <Fuel className="w-4 h-4 text-yellow-300" />
            <span>Chờ vui – Chơi hay – Nhận quà liền tay</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Thử Thách Nhận Voucher Xăng 2 Lít
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Khách hàng chơi trong lúc chờ giao dịch hoặc sau khi hoàn tất giao dịch tại quầy. Đạt mốc điểm để nhận ngay mã quà tặng xăng dầu!
          </p>
        </div>

        {savedVoucher && (
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3.5 text-center shrink-0">
            <span className="text-[10px] text-amber-200 block uppercase font-bold tracking-wider">
              Mã voucher gần nhất
            </span>
            <span className="text-lg font-black text-yellow-300 tracking-wider font-mono">
              {savedVoucher}
            </span>
          </div>
        )}
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setSelectedGame('flappy')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
            selectedGame === 'flappy'
              ? 'bg-[#003B70] text-white shadow-md scale-105'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Game 1: Flappy VietinBank (Mốc 20 Điểm)</span>
        </button>

        <button
          onClick={() => setSelectedGame('snake')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
            selectedGame === 'snake'
              ? 'bg-[#003B70] text-white shadow-md scale-105'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Game 2: VietinBank Snake Challenge (20 - 40 Điểm)</span>
        </button>
      </div>

      {/* Render Selected Game */}
      {selectedGame === 'flappy' ? (
        <FlappyVoucherGame
          onVoucherGenerated={(code) => setSavedVoucher(code)}
          onBackToMenu={onBackToHome}
        />
      ) : (
        <SnakeVoucherGame
          onVoucherGenerated={(code) => setSavedVoucher(code)}
          onBackToMenu={onBackToHome}
        />
      )}
    </div>
  );
};

/* =========================================================================
   GAME 1: FLAPPY VOUCHER GAME (Specifications strictly from PDF 6 Section I)
   Container ID: flappy-voucher-game
   ========================================================================= */

interface FlappyGameProps {
  onVoucherGenerated: (code: string) => void;
  onBackToMenu: () => void;
}

const FlappyVoucherGame: React.FC<FlappyGameProps> = ({ onVoucherGenerated, onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game configuration variables (as requested in PDF 6 page 3)
  const WIN_SCORE = 20;
  const GRAVITY = 0.38;
  const JUMP_FORCE = -6.8;
  const PIPE_SPEED = 2.4;
  const PIPE_GAP = 145; // Generous gap for comfortable customer play
  const VOUCHER_TEXT = 'Voucher 2 lít xăng';
  const BRAND_NAME = 'VietinBank';
  const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

  // Game state
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Engine references
  const animFrameRef = useRef<number | null>(null);
  const stateRef = useRef({
    gameState: 'start',
    score: 0,
    birdY: 180,
    birdVelocity: 0,
    pipes: [] as Array<{ x: number; topHeight: number; bottomY: number; passed: boolean }>,
    canvasWidth: 480,
    canvasHeight: 480,
  });

  // Encouragement messages based on score brackets (PDF 6 page 2)
  const getEncouragement = (s: number) => {
    if (s < 5) return 'Khởi động nhẹ nhàng!';
    if (s <= 9) return 'Tốt lắm, tiếp tục nào!';
    if (s <= 14) return 'Một nửa chặng đường rồi!';
    if (s <= 19) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // Generate Voucher code format VB-XXXXXX (6 random digits)
  const generateVoucherCode = () => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  };

  const copyVoucherCode = () => {
    if (voucherCode) {
      navigator.clipboard.writeText(voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Jump trigger
  const triggerJump = () => {
    if (stateRef.current.gameState === 'start') {
      startGame();
    } else if (stateRef.current.gameState === 'playing') {
      stateRef.current.birdVelocity = JUMP_FORCE;
    }
  };

  const startGame = () => {
    stateRef.current.gameState = 'playing';
    stateRef.current.score = 0;
    stateRef.current.birdY = 180;
    stateRef.current.birdVelocity = 0;
    stateRef.current.pipes = [];
    setScore(0);
    setGameState('playing');
  };

  const resetGame = () => {
    startGame();
  };

  const winGame = () => {
    stateRef.current.gameState = 'won';
    setGameState('won');
    const code = generateVoucherCode();
    setVoucherCode(code);
    onVoucherGenerated(code);
    localStorage.setItem('vietinbank_latest_voucher', code);
    localStorage.setItem('vietinbank_flappy_highscore', '20');

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    // Call window callback if defined (PDF 6 page 4)
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: 20,
        voucherCode: code,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const endGame = (finalScore: number) => {
    stateRef.current.gameState = 'lost';
    setGameState('lost');

    const currentHS = parseInt(localStorage.getItem('vietinbank_flappy_highscore') || '0', 10);
    if (finalScore > currentHS) {
      localStorage.setItem('vietinbank_flappy_highscore', finalScore.toString());
    }

    // Call window callback if defined (PDF 6 page 4)
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pipeSpawnTimer = 0;

    const render = () => {
      const { width, height } = canvas;
      stateRef.current.canvasWidth = width;
      stateRef.current.canvasHeight = height;

      // Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Cloud illustrations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(80, 80, 30, 0, Math.PI * 2);
      ctx.arc(115, 75, 40, 0, Math.PI * 2);
      ctx.arc(150, 80, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width - 120, 110, 25, 0, Math.PI * 2);
      ctx.arc(width - 90, 105, 35, 0, Math.PI * 2);
      ctx.arc(width - 60, 110, 25, 0, Math.PI * 2);
      ctx.fill();

      // Distant Cityline (VietinBank towers)
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(40, height - 100, 35, 60);
      ctx.fillRect(100, height - 130, 45, 90);
      ctx.fillRect(180, height - 110, 30, 70);
      ctx.fillRect(240, height - 150, 50, 110);
      ctx.fillRect(320, height - 90, 40, 50);

      // Ground
      ctx.fillStyle = '#059669';
      ctx.fillRect(0, height - 40, width, 10);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(0, height - 30, width, 30);

      if (stateRef.current.gameState === 'playing') {
        // Physics
        stateRef.current.birdVelocity += GRAVITY;
        stateRef.current.birdY += stateRef.current.birdVelocity;

        // Ground collision
        if (stateRef.current.birdY + 16 >= height - 40) {
          endGame(stateRef.current.score);
        }
        if (stateRef.current.birdY < 10) {
          stateRef.current.birdY = 10;
          stateRef.current.birdVelocity = 0;
        }

        // Pipe spawning
        pipeSpawnTimer++;
        if (pipeSpawnTimer > 95) {
          pipeSpawnTimer = 0;
          const minPipeH = 60;
          const maxPipeH = height - 40 - PIPE_GAP - minPipeH;
          const topHeight = Math.floor(minPipeH + Math.random() * (maxPipeH - minPipeH));
          stateRef.current.pipes.push({
            x: width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            passed: false,
          });
        }

        // Pipe movement & collision
        const birdX = 90;
        const birdRadius = 16;

        for (let i = stateRef.current.pipes.length - 1; i >= 0; i--) {
          const p = stateRef.current.pipes[i];
          p.x -= PIPE_SPEED;

          // Score check
          if (!p.passed && p.x + 55 < birdX) {
            p.passed = true;
            stateRef.current.score += 1;
            setScore(stateRef.current.score);

            if (stateRef.current.score >= WIN_SCORE) {
              winGame();
              break;
            }
          }

          // Collision check
          const pipeWidth = 55;
          if (
            birdX + birdRadius > p.x &&
            birdX - birdRadius < p.x + pipeWidth
          ) {
            if (
              stateRef.current.birdY - birdRadius < p.topHeight ||
              stateRef.current.birdY + birdRadius > p.bottomY
            ) {
              endGame(stateRef.current.score);
              break;
            }
          }

          // Remove off-screen pipes
          if (p.x < -60) {
            stateRef.current.pipes.splice(i, 1);
          }
        }
      }

      // Draw Pipes (VietinBank styled pillars)
      stateRef.current.pipes.forEach((p) => {
        const pipeWidth = 55;
        // Top pipe
        const gradTop = ctx.createLinearGradient(p.x, 0, p.x + pipeWidth, 0);
        gradTop.addColorStop(0, '#003B70');
        gradTop.addColorStop(0.5, '#005BBB');
        gradTop.addColorStop(1, '#00274D');
        ctx.fillStyle = gradTop;
        ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
        // Top pipe cap
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(p.x - 3, p.topHeight - 16, pipeWidth + 6, 16);

        // Bottom pipe
        const gradBottom = ctx.createLinearGradient(p.x, 0, p.x + pipeWidth, 0);
        gradBottom.addColorStop(0, '#003B70');
        gradBottom.addColorStop(0.5, '#005BBB');
        gradBottom.addColorStop(1, '#00274D');
        ctx.fillStyle = gradBottom;
        ctx.fillRect(p.x, p.bottomY, pipeWidth, height - 40 - p.bottomY);
        // Bottom pipe cap
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(p.x - 3, p.bottomY, pipeWidth + 6, 16);
      });

      // Draw Character: VietinBank Flying Card Mascot
      const birdX = 90;
      const birdY = stateRef.current.birdY;

      ctx.save();
      ctx.translate(birdX, birdY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (stateRef.current.birdVelocity * 3 * Math.PI) / 180));
      ctx.rotate(angle);

      // Card body (Bank Card Shape)
      ctx.fillStyle = '#003B70';
      ctx.beginPath();
      ctx.roundRect(-22, -15, 44, 30, 6);
      ctx.fill();

      // Red Stripe accent
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(-22, -2, 44, 4);

      // Gold EMV Chip
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-16, -10, 9, 8);

      // Eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(10, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(12, -5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Little Wing
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.ellipse(-8, 5, 10, 5, (Math.sin(Date.now() / 100) * Math.PI) / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Loop
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div id="flappy-voucher-game" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="text-left space-y-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {GAME_TITLE}
          </h3>
          <p className="text-xs text-slate-500">
            Chạm màn hình hoặc nhấn phím Space để bay vượt qua các chướng ngại vật
          </p>
        </div>

        {/* Live Score & Progress */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-blue-700 block font-bold uppercase">Điểm số</span>
            <span className="text-xl font-black text-[#003B70]">
              {score} / {WIN_SCORE}
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Progress Bar & Dynamic Encouragement */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Tiến độ săn quà:</span>
          <span className="font-extrabold text-[#ED1C24] animate-pulse">
            {getEncouragement(score)}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-500 to-[#ED1C24] transition-all duration-300"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative mx-auto max-w-[500px] w-full aspect-square rounded-3xl overflow-hidden border-4 border-[#003B70] shadow-2xl bg-sky-100 select-none touch-none">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          onClick={triggerJump}
          className="w-full h-full block cursor-pointer"
        />

        {/* Start Overlay (PDF 6 page 2 Section 1) */}
        {gameState === 'start' && (
          <div
            onClick={triggerJump}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#003B70] border-2 border-cyan-400 text-cyan-300 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
              {GAME_TITLE}
            </h4>
            <p className="text-xs sm:text-sm text-yellow-300 font-bold mt-1 max-w-xs">
              Vượt qua 20 thử thách để nhận voucher 2 lít xăng
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="mt-6 px-8 py-3.5 bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              Bắt đầu chơi
            </button>

            <p className="text-[11px] text-slate-200 mt-3 font-medium">
              Chạm màn hình hoặc nhấn Space để bay
            </p>
          </div>
        )}

        {/* Lose Overlay (PDF 6 page 2 Section 3) */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400 text-red-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h4 className="text-xl font-black text-white">
              Rất tiếc, bạn đã vượt qua {score}/20 thử thách
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs">
              Chỉ còn một chút nữa thôi, hãy thử lại nhé!
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-[#003B70] hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Chơi lại
              </button>
              <button
                onClick={onBackToMenu}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Win Overlay (PDF 6 page 2 Section 4) */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#003B70]/95 to-[#00274D]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-yellow-400 text-slate-900 flex items-center justify-center shadow-lg animate-bounce">
              <Award className="w-9 h-9" />
            </div>

            <h4 className="text-2xl font-black text-yellow-300">
              Chúc mừng Quý khách!
            </h4>
            <p className="text-xs sm:text-sm text-slate-100 max-w-xs">
              Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>voucher 2 lít xăng</strong>.
            </p>

            {/* Voucher Box */}
            <div className="bg-white/10 border-2 border-yellow-400/80 rounded-2xl p-4 w-full max-w-xs space-y-1 my-1">
              <span className="text-[10px] text-yellow-200 uppercase tracking-widest font-bold">
                MÃ VOUCHER NHẬN QUÀ
              </span>
              <div className="text-2xl font-black tracking-widest text-white font-mono">
                {voucherCode}
              </div>
              <span className="text-[10px] text-slate-300 block">
                Phần quà: {VOUCHER_TEXT}
              </span>
            </div>

            <p className="text-[11px] text-amber-200 font-medium">
              Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={copyVoucherCode}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>

              <button
                onClick={resetGame}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition-all"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Action CTA for Mobile Screen */}
      <div className="sm:hidden">
        <button
          onClick={triggerJump}
          className="w-full py-4 bg-[#003B70] active:bg-blue-900 text-white font-black text-base rounded-2xl shadow-lg"
        >
          Chạm vào đây để Bay 🚀
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: VIETINBANK SNAKE CHALLENGE (PDF 6 Section II)
   Title: "VietinBank Snake Challenge"
   Milestones: 20 points (01 voucher 2L), 40 points (02 voucher 2L)
   Certificate: Phiếu xác nhận quà tặng
   ========================================================================= */

interface SnakeGameProps {
  onVoucherGenerated: (code: string) => void;
  onBackToMenu: () => void;
}

const SnakeVoucherGame: React.FC<SnakeGameProps> = ({ onVoucherGenerated, onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentVoucherCount, setCurrentVoucherCount] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [finishTime, setFinishTime] = useState<string>('');
  const [milestoneNotice, setMilestoneNotice] = useState<string | null>(null);

  const GRID_SIZE = 20;
  const CELL_COUNT = 20; // 400x400

  const stateRef = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    score: 0,
    voucherLevel: 0,
    speed: 130, // moderate comfortable speed for customers
  });

  const intervalRef = useRef<any>(null);

  const spawnFood = () => {
    const s = stateRef.current.snake;
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT),
      };
      if (!s.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) break;
    }
    stateRef.current.food = newFood;
  };

  const handleStart = () => {
    stateRef.current.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    stateRef.current.direction = { x: 1, y: 0 };
    stateRef.current.nextDirection = { x: 1, y: 0 };
    stateRef.current.score = 0;
    stateRef.current.voucherLevel = 0;
    spawnFood();
    setScore(0);
    setCurrentVoucherCount(0);
    setGameOver(false);
    setIsPlaying(true);
    setMilestoneNotice(null);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(gameTick, stateRef.current.speed);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const now = new Date();
    setFinishTime(`${now.toLocaleTimeString('vi-VN')} - ${now.toLocaleDateString('vi-VN')}`);

    const finalScore = stateRef.current.score;
    let code = '';
    if (finalScore >= 20) {
      code = `VB-SNAKE-${Math.floor(100000 + Math.random() * 900000)}`;
      setVoucherCode(code);
      onVoucherGenerated(code);
      localStorage.setItem('vietinbank_latest_voucher', code);
      try {
        confetti({ particleCount: 80, spread: 60 });
      } catch (e) {}
    }
  };

  const gameTick = () => {
    const s = stateRef.current;
    s.direction = s.nextDirection;

    const head = {
      x: s.snake[0].x + s.direction.x,
      y: s.snake[0].y + s.direction.y,
    };

    // Wall collision
    if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
      handleEnd();
      return;
    }

    // Self collision
    if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      handleEnd();
      return;
    }

    s.snake.unshift(head);

    // Food check
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 1;
      setScore(s.score);

      // Milestone 20 points check (PDF 6 page 6)
      if (s.score >= 20 && s.voucherLevel < 1) {
        s.voucherLevel = 1;
        setCurrentVoucherCount(1);
        setMilestoneNotice('Chúc mừng Quý khách đã đạt 20 điểm! Nhận 01 voucher xăng trị giá 2 lít.');
        setTimeout(() => setMilestoneNotice(null), 4000);
      }
      // Milestone 40 points check (PDF 6 page 6)
      else if (s.score >= 40 && s.voucherLevel < 2) {
        s.voucherLevel = 2;
        setCurrentVoucherCount(2);
        setMilestoneNotice('Xuất sắc! Quý khách đã đạt 40 điểm! Nhận được 02 voucher xăng (4 lít).');
        setTimeout(() => setMilestoneNotice(null), 4000);
      }

      spawnFood();
    } else {
      s.snake.pop();
    }

    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Board background (Subtle checkered bank grid)
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < CELL_COUNT; r++) {
      for (let c = 0; c < CELL_COUNT; c++) {
        if ((r + c) % 2 === 1) {
          ctx.fillStyle = '#F1F5F9';
          ctx.fillRect(c * GRID_SIZE, r * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      }
    }

    // Food (Golden Coin / Gift)
    const { food } = stateRef.current;
    ctx.fillStyle = '#ED1C24';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    stateRef.current.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#003B70' : '#005BBB';
      ctx.beginPath();
      ctx.roundRect(
        seg.x * GRID_SIZE + 1,
        seg.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2,
        i === 0 ? 6 : 4
      );
      ctx.fill();

      // Eyes on head
      if (i === 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(seg.x * GRID_SIZE + 6, seg.y * GRID_SIZE + 6, 2, 0, Math.PI * 2);
        ctx.arc(seg.x * GRID_SIZE + 14, seg.y * GRID_SIZE + 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    draw();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const cur = stateRef.current.direction;
      if (e.key === 'ArrowUp' && cur.y === 0) stateRef.current.nextDirection = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && cur.y === 0) stateRef.current.nextDirection = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && cur.x === 0) stateRef.current.nextDirection = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && cur.x === 0) stateRef.current.nextDirection = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const changeDir = (x: number, y: number) => {
    const cur = stateRef.current.direction;
    if (x !== 0 && cur.x === 0) stateRef.current.nextDirection = { x, y: 0 };
    if (y !== 0 && cur.y === 0) stateRef.current.nextDirection = { x: 0, y };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Title & Guidelines from PDF 6 page 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="text-left space-y-1">
          <h3 className="text-lg font-black text-slate-900">
            VietinBank Snake Challenge
          </h3>
          <p className="text-xs text-slate-500">
            Chơi vui tại quầy – Săn voucher xăng hấp dẫn (Dùng phím mũi tên hoặc nút bấm bên dưới)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-blue-700 block font-bold uppercase">Điểm hiện tại</span>
            <span className="text-xl font-black text-[#003B70]">{score}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-amber-700 block font-bold uppercase">Quà đạt được</span>
            <span className="text-xs font-black text-amber-800">
              {currentVoucherCount === 0
                ? 'Chưa có'
                : `${currentVoucherCount} Voucher (${currentVoucherCount * 2}L)`}
            </span>
          </div>
        </div>
      </div>

      {/* Milestone Toast (non-disruptive banner as requested) */}
      {milestoneNotice && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl text-xs font-bold shadow-md animate-in fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{milestoneNotice}</span>
        </div>
      )}

      {/* Main Game Screen */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="relative border-4 border-[#003B70] rounded-3xl overflow-hidden shadow-2xl bg-slate-50">
          <canvas ref={canvasRef} width={400} height={400} className="block" />

          {/* Not playing overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center space-y-3">
              <Award className="w-12 h-12 text-yellow-300 animate-bounce" />
              <h4 className="text-xl font-black">VietinBank Snake Challenge</h4>
              <p className="text-xs text-slate-200 max-w-xs">
                Đạt 20 điểm nhận 01 voucher 2 lít xăng. Đạt 40 điểm nhận 02 voucher 2 lít xăng!
              </p>
              <button
                onClick={handleStart}
                className="mt-3 px-8 py-3 bg-[#ED1C24] hover:bg-red-700 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                Bắt đầu chơi
              </button>
            </div>
          )}
        </div>

        {/* Controls & Instructions */}
        <div className="space-y-4 max-w-xs w-full text-left">
          {/* Rules Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Hướng dẫn & Mốc thưởng:
            </h5>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Dùng phím mũi tên hoặc cụm phím điều hướng bên dưới</li>
              <li>Ăn vật phẩm đỏ để cộng 1 điểm và dài ra</li>
              <li>Đạt <strong>20 điểm</strong>: nhận 01 voucher 2 lít xăng</li>
              <li>Đạt <strong>40 điểm</strong>: nhận 02 voucher (mỗi vc 2 lít)</li>
            </ul>
          </div>

          {/* Touch D-Pad for Kiosk/Touchscreen devices */}
          <div className="flex flex-col items-center gap-1.5 pt-2">
            <button
              onClick={() => changeDir(0, -1)}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-[#003B70] hover:text-white flex items-center justify-center font-bold shadow-xs active:scale-95 transition-all text-slate-700"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDir(-1, 0)}
                className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-[#003B70] hover:text-white flex items-center justify-center font-bold shadow-xs active:scale-95 transition-all text-slate-700"
              >
                <ArrowL className="w-5 h-5" />
              </button>
              <button
                onClick={handleStart}
                className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs active:scale-95 text-[10px]"
              >
                RE
              </button>
              <button
                onClick={() => changeDir(1, 0)}
                className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-[#003B70] hover:text-white flex items-center justify-center font-bold shadow-xs active:scale-95 transition-all text-slate-700"
              >
                <ArrowR className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => changeDir(0, 1)}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-[#003B70] hover:text-white flex items-center justify-center font-bold shadow-xs active:scale-95 transition-all text-slate-700"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory "Phiếu xác nhận quà tặng" Modal after game over (PDF 6 page 8) */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center border-2 border-[#003B70]">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#003B70] flex items-center justify-center mx-auto shadow-sm">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#003B70]">
                NGÂN HÀNG VIETINBANK - QUẦY GIAO DỊCH
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                PHIẾU XÁC NHẬN QUÀ TẶNG
              </h3>
            </div>

            {/* Score & Certificate Body */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Điểm cuối cùng:</span>
                <span className="text-lg font-black text-[#003B70]">{score} điểm</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Mức quà đạt được:</span>
                <span className="font-bold text-red-600">
                  {score >= 40
                    ? '02 voucher xăng (4 lít)'
                    : score >= 20
                    ? '01 voucher xăng 2 lít'
                    : 'Chưa đạt mốc nhận quà'}
                </span>
              </div>

              {voucherCode && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mã voucher:</span>
                  <span className="font-mono font-black text-base text-[#003B70]">
                    {voucherCode}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Thời gian hoàn thành:</span>
                <span className="font-medium text-slate-700">{finishTime}</span>
              </div>
            </div>

            {/* Required notice from PDF 6 page 8 */}
            <p className="text-xs font-semibold text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 text-left">
              📌 {score >= 20
                ? 'Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.'
                : 'Rất tiếc, Quý khách chưa đạt mốc nhận voucher. Hãy thử lại để chinh phục mốc 20 điểm!'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleStart}
                className="flex-1 py-3 px-4 bg-[#003B70] hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                Chơi lại
              </button>
              <button
                onClick={onBackToMenu}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
