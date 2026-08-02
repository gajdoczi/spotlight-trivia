import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Play, Pencil, Trash2, ArrowLeft, X, Check, Trophy, Users, Minus, Save, Eye, ChevronLeft, Image as ImageIcon, Upload, Link2, Video as VideoIcon } from 'lucide-react';

const LOGO_SRC = 'data:image/webp;base64,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';

/* ---------- SHARED: EDITABLE SCORE INPUT ---------- */
function ScoreInput({ value, onChange, color }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const n = parseInt(draft, 10);
    onChange(isNaN(n) ? 0 : n);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={draft}
      onChange={(e) => {
        const v = e.target.value;
        if (/^-?\d*$/.test(v)) setDraft(v);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
      onFocus={(e) => e.target.select()}
      title="Click to edit this score"
      style={{
        width: 56,
        background: 'transparent',
        border: 'none',
        borderBottom: `1px dashed ${C.slateDark}`,
        color: color || C.gold,
        fontFamily: FONT_MONO,
        fontSize: 15,
        fontWeight: 700,
        outline: 'none',
        padding: '2px 1px',
      }}
    />
  );
}

const C = {
  bg: '#1A1423',
  bg2: '#100B18',
  panel: '#372549',
  panelHover: '#4B3363',
  panelUsed: '#251A34',
  gold: '#F2B705',
  goldSoft: '#C99A1F',
  lavender: '#CFBCDF',
  lavenderSoft: '#A98FC2',
  white: '#F8F3FC',
  red: '#E1506B',
  redSoft: '#7C2A3E',
  green: '#4FBE87',
  greenSoft: '#2C7A4D',
  slate: '#9E8CB4',
  slateDark: '#4F3D68',
};

const FONT_DISPLAY = "'Big Shoulders Display', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'Space Mono', monospace";

const VALUES1 = [100, 200, 300, 400, 500];
const VALUES2 = [200, 400, 600, 800, 1000];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function makeCategories(values, count = 5) {
  return Array.from({ length: count }, () => ({
    name: '',
    clues: values.map((v) => ({ value: v, question: '', answer: '', image: '', video: '', answerImage: '' })),
  }));
}

function makeRound(name, values) {
  return { name, categories: makeCategories(values) };
}

function emptyBoard() {
  return {
    id: uid(),
    title: '',
    rounds: [makeRound('Jeopardy', VALUES1), makeRound('Double Jeopardy', VALUES2)],
  };
}

// Older saved boards only had a flat `categories` list (single round), or a
// single-round `rounds` array. Bring anything we load up to the current
// two-round shape so a second, fully editable round is always available.
function normalizeBoard(board) {
  if (!board) return board;
  if (Array.isArray(board.rounds) && board.rounds.length >= 2) return board;
  if (Array.isArray(board.rounds) && board.rounds.length === 1) {
    return { ...board, rounds: [board.rounds[0], makeRound('Double Jeopardy', VALUES2)] };
  }
  if (Array.isArray(board.categories)) {
    return {
      id: board.id,
      title: board.title,
      rounds: [{ name: 'Jeopardy', categories: board.categories }, makeRound('Double Jeopardy', VALUES2)],
    };
  }
  return board;
}

// Storage layer: uses the browser's localStorage, so boards are saved
// per-browser on whatever device/browser the person is using.
const LS_PREFIX = 'jeopardy:';

async function getIndex() {
  try {
    const raw = localStorage.getItem(LS_PREFIX + 'board-index');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
async function setIndex(list) {
  try {
    localStorage.setItem(LS_PREFIX + 'board-index', JSON.stringify(list));
  } catch {}
}
async function getBoard(id) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + 'board:' + id);
    return raw ? normalizeBoard(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}
async function persistBoard(board) {
  try {
    localStorage.setItem(LS_PREFIX + 'board:' + board.id, JSON.stringify(board));
  } catch {}
}
async function deleteBoardStorage(id) {
  try {
    localStorage.removeItem(LS_PREFIX + 'board:' + id);
  } catch {}
}

function boardStats(board) {
  const rounds = board.rounds || [];
  let catCount = 0;
  let filled = 0;
  let total = 0;
  rounds.forEach((r) =>
    r.categories.forEach((c) => {
      catCount++;
      c.clues.forEach((cl) => {
        total++;
        if (cl.question.trim() && (cl.answer.trim() || cl.answerImage)) filled++;
      });
    })
  );
  return { catCount, filled, total, roundCount: rounds.length };
}

export default function App() {
  const [view, setView] = useState('home');
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBoard, setActiveBoard] = useState(null);
  const [teams, setTeams] = useState([]);
  const [usedTiles, setUsedTiles] = useState({});
  const [scores, setScores] = useState({});
  const [roundIndex, setRoundIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const idx = await getIndex();
      setBoards(idx.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
      setLoading(false);
    })();
  }, []);

  const refreshIndex = useCallback(async () => {
    const idx = await getIndex();
    setBoards(idx.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
  }, []);

  const goHome = () => {
    setActiveBoard(null);
    setView('home');
  };

  const openNewBoard = () => {
    setActiveBoard(emptyBoard());
    setView('edit');
  };

  const openEditBoard = async (id) => {
    const b = await getBoard(id);
    if (b) {
      setActiveBoard(b);
      setView('edit');
    }
  };

  const saveActiveBoard = async (board) => {
    const toSave = { ...board, title: board.title.trim() || 'Untitled game' };
    await persistBoard(toSave);
    const idx = await getIndex();
    const stats = boardStats(toSave);
    const meta = {
      id: toSave.id,
      title: toSave.title,
      catCount: stats.catCount,
      roundCount: stats.roundCount,
      filled: stats.filled,
      total: stats.total,
      updatedAt: Date.now(),
    };
    const next = [meta, ...idx.filter((m) => m.id !== toSave.id)];
    await setIndex(next);
    setBoards(next.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
    setActiveBoard(toSave);
    return toSave;
  };

  const deleteBoard = async (id) => {
    await deleteBoardStorage(id);
    const idx = await getIndex();
    const next = idx.filter((m) => m.id !== id);
    await setIndex(next);
    setBoards(next);
  };

  const startTeamSetup = async (board) => {
    const saved = await saveActiveBoard(board);
    setActiveBoard(saved);
    setUsedTiles({});
    setRoundIndex(0);
    setView('teams');
  };

  const beginPlay = (teamList) => {
    const initScores = {};
    teamList.forEach((t) => (initScores[t.id] = 0));
    setTeams(teamList);
    setScores(initScores);
    setUsedTiles({});
    setRoundIndex(0);
    setView('play');
  };

  const continueToNextRound = () => {
    setRoundIndex((r) => r + 1);
    setUsedTiles({});
  };

  const playAgainSameTeams = () => {
    const initScores = {};
    teams.forEach((t) => (initScores[t.id] = 0));
    setScores(initScores);
    setUsedTiles({});
    setRoundIndex(0);
    setView('play');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse 1200px 600px at 50% -10%, ${C.panel} 0%, ${C.bg} 60%)`,
        fontFamily: FONT_BODY,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GlobalStyle />
      <TopBar view={view} board={activeBoard} onHome={goHome} />
      <div
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(14px, 4vw, 20px) clamp(14px, 4vw, 20px) 56px',
        }}
      >
        {view === 'home' && (
          <HomeView
            boards={boards}
            loading={loading}
            onNew={openNewBoard}
            onEdit={openEditBoard}
            onDelete={deleteBoard}
            onPlay={async (id) => {
              const b = await getBoard(id);
              if (b) {
                setActiveBoard(b);
                setUsedTiles({});
                setRoundIndex(0);
                setView('teams');
              }
            }}
          />
        )}
        {view === 'edit' && activeBoard && (
          <EditorView
            board={activeBoard}
            setBoard={setActiveBoard}
            onSave={saveActiveBoard}
            onPlay={startTeamSetup}
            onBack={goHome}
          />
        )}
        {view === 'teams' && activeBoard && (
          <TeamSetupView board={activeBoard} onBack={goHome} onStart={beginPlay} />
        )}
        {view === 'play' && activeBoard && (
          <PlayBoardView
            board={activeBoard}
            roundIndex={roundIndex}
            onContinueRound={continueToNextRound}
            teams={teams}
            scores={scores}
            setScores={setScores}
            usedTiles={usedTiles}
            setUsedTiles={setUsedTiles}
            onEndGame={() => setView('final')}
            onExit={goHome}
          />
        )}
        {view === 'final' && activeBoard && (
          <FinalScoresView
            teams={teams}
            scores={scores}
            onPlayAgain={playAgainSameTeams}
            onNewTeams={() => setView('teams')}
            onHome={goHome}
          />
        )}
      </div>
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
      * { box-sizing: border-box; }
      html, body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      input, textarea { font-family: inherit; }
      ::placeholder { color: #7A6790; }
      button { font-family: inherit; transition: transform 0.12s ease, filter 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease, border-color 0.12s ease; }
      button:not(:disabled):hover { filter: brightness(1.08); }
      button:not(:disabled):active { transform: translateY(1px) scale(0.98); filter: brightness(0.95); }
      button:disabled { cursor: not-allowed; }
      button:focus-visible, input:focus-visible, textarea:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(207, 188, 223, 0.35);
      }
      input, textarea { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
      input:focus, textarea:focus { outline: none; }
      ::-webkit-scrollbar { height: 10px; width: 10px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #4F3D68; border-radius: 8px; }
      .card-lift { transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease; }
      .card-lift:hover { transform: translateY(-3px); border-color: #CFBCDF88; box-shadow: 0 12px 28px rgba(0,0,0,0.35); }
      .status-pill { display: inline-flex; }
      .board-grid { --tile-min: 140px; }
      @media (max-width: 640px) {
        .hide-mobile { display: none !important; }
        .board-grid { --tile-min: 96px; }
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes riseIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes sweep { 0% { transform: translateX(-120%) rotate(8deg); } 100% { transform: translateX(220%) rotate(8deg); } }
      @keyframes twinkle { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
    `}</style>
  );
}

function MarqueeDots({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: C.gold,
            display: 'inline-block',
            animation: `twinkle 1.8s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

function TopBar({ view, board, onHome }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${C.slateDark}40`,
        background: `${C.bg2}D9`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '13px clamp(14px, 4vw, 20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <button
          onClick={onHome}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 0,
            minWidth: 0,
          }}
        >
          <img
            src={LOGO_SRC}
            alt="Akarás Jeopardy logo"
            style={{ width: 34, height: 34, objectFit: 'contain', display: 'block', flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 21,
              letterSpacing: 0.2,
              color: C.white,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Akarás <span style={{ color: C.lavender }}>Jeopardy</span>
          </span>
        </button>
        {view !== 'home' && (
          <div
            className="hide-mobile"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11.5,
              color: C.slate,
              textTransform: 'uppercase',
              letterSpacing: 1.3,
              background: `${C.panel}88`,
              border: `1px solid ${C.slateDark}55`,
              borderRadius: 999,
              padding: '6px 14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 360,
            }}
          >
            {view === 'edit' && 'Editing'}
            {view === 'teams' && 'Set up teams'}
            {view === 'play' && 'Hosting'}
            {view === 'final' && 'Final scores'}
            {board?.title ? ` · ${board.title}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- HOME ---------- */
function HomeView({ boards, loading, onNew, onEdit, onDelete, onPlay }) {
  const [confirmId, setConfirmId] = useState(null);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 'clamp(20px, 5vw, 32px)',
          marginBottom: 'clamp(20px, 5vw, 30px)',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 2, marginBottom: 6 }}>
            HOST YOUR OWN GAME SHOW
          </div>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 'clamp(30px, 6vw, 44px)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Your boards
          </h1>
        </div>
        <button onClick={onNew} style={btnPrimary()}>
          <Plus size={18} /> New board
        </button>
      </div>

      {loading && <div style={{ color: C.slate, fontFamily: FONT_MONO, fontSize: 13 }}>Loading your boards…</div>}

      {!loading && boards.length === 0 && (
        <div
          style={{
            border: `1px dashed ${C.slateDark}`,
            borderRadius: 16,
            padding: 'clamp(36px, 8vw, 56px) 24px',
            textAlign: 'center',
            background: `linear-gradient(180deg, ${C.panel}66, ${C.panel}22)`,
          }}
        >
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(22px, 5vw, 26px)', fontWeight: 900, marginBottom: 8 }}>
            No boards yet
          </div>
          <div style={{ color: C.slate, marginBottom: 20, fontSize: 14 }}>
            Build a 5×5 trivia board and host it right here.
          </div>
          <button onClick={onNew} style={btnPrimary()}>
            <Plus size={18} /> Create your first board
          </button>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
          gap: 16,
        }}
      >
        {boards.map((b) => {
          const complete = b.total > 0 && b.filled === b.total;
          const pct = b.total > 0 ? Math.round((b.filled / b.total) * 100) : 0;
          return (
            <div
              key={b.id}
              className="card-lift"
              style={{
                background: `linear-gradient(160deg, ${C.panel} 0%, ${C.panelUsed} 100%)`,
                border: `1px solid ${C.slateDark}66`,
                borderRadius: 16,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                animation: 'riseIn 0.25s ease',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 900,
                    fontSize: 21,
                    lineHeight: 1.15,
                    marginBottom: 8,
                    color: C.white,
                    wordBreak: 'break-word',
                  }}
                >
                  {b.title || 'Untitled game'}
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: C.slate,
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{b.roundCount || 1} round{(b.roundCount || 1) > 1 ? 's' : ''}</span>
                  <span style={{ color: complete ? C.green : C.gold }}>{b.filled}/{b.total} filled</span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: `${C.bg}88`, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: 999,
                      background: complete ? C.green : C.gold,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => onPlay(b.id)} style={btnSmall(C.gold, C.bg)}>
                  <Play size={14} /> Play
                </button>
                <button onClick={() => onEdit(b.id)} style={btnSmall('transparent', C.white, true)}>
                  <Pencil size={14} /> Edit
                </button>
                {confirmId === b.id ? (
                  <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                    <button
                      onClick={() => {
                        onDelete(b.id);
                        setConfirmId(null);
                      }}
                      style={btnSmall(C.red, C.white)}
                    >
                      Confirm
                    </button>
                    <button onClick={() => setConfirmId(null)} style={btnSmall('transparent', C.slate, true)}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(b.id)}
                    style={{ ...btnSmall('transparent', C.slate, true), marginLeft: 'auto' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function btnPrimary() {
  return {
    background: C.gold,
    color: C.bg,
    border: 'none',
    borderRadius: 10,
    padding: '11px 20px',
    fontWeight: 650,
    fontSize: 14.5,
    letterSpacing: 0.2,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: `0 3px 10px ${C.gold}30`,
  };
}
function btnSmall(bg, fg, outline) {
  return {
    background: bg,
    color: fg,
    border: outline ? `1px solid ${C.lavenderSoft}55` : 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: 0.1,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };
}

/* ---------- EDITOR ---------- */
function EditorView({ board, setBoard, onSave, onPlay, onBack }) {
  const [activeRound, setActiveRound] = useState(0);
  const [editing, setEditing] = useState(null); // {ci, qi}
  const [savedFlash, setSavedFlash] = useState(false);
  const savingRef = useRef(false);

  const round = board.rounds[activeRound];

  const updateTitle = (title) => setBoard({ ...board, title });

  const setRoundCategories = (categories) => {
    const rounds = board.rounds.map((r, i) => (i === activeRound ? { ...r, categories } : r));
    setBoard({ ...board, rounds });
  };

  const updateCategoryName = (ci, name) => {
    setRoundCategories(round.categories.map((c, i) => (i === ci ? { ...c, name } : c)));
  };

  const addCategory = () => {
    if (round.categories.length >= 6) return;
    const values = round.categories[0]?.clues.map((c) => c.value) || VALUES1;
    setRoundCategories([
      ...round.categories,
      { name: '', clues: values.map((v) => ({ value: v, question: '', answer: '', image: '', video: '', answerImage: '' })) },
    ]);
  };

  const removeCategory = (ci) => {
    if (round.categories.length <= 3) return;
    setRoundCategories(round.categories.filter((_, i) => i !== ci));
  };

  const updateClue = (ci, qi, patch) => {
    setRoundCategories(
      round.categories.map((c, i) => {
        if (i !== ci) return c;
        const clues = c.clues.map((cl, j) => (j === qi ? { ...cl, ...patch } : cl));
        return { ...c, clues };
      })
    );
  };

  const doSave = async () => {
    savingRef.current = true;
    await onSave(board);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const stats = boardStats(board);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'clamp(16px, 4vw, 24px)', marginBottom: 6 }}>
        <button onClick={onBack} style={{ ...iconBtn(), flexShrink: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <input
          value={board.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Name your game show"
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${C.slateDark}`,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 'clamp(22px, 5vw, 32px)',
            padding: '6px 2px',
            outline: 'none',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11.5,
          color: C.slate,
          marginBottom: 18,
          marginLeft: 46,
        }}
      >
        {stats.filled}/{stats.total} clues filled across both rounds · click a tile to write it
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, marginLeft: 46, flexWrap: 'wrap' }}>
        {board.rounds.map((r, i) => {
          const rFilled = r.categories.reduce(
            (s, c) => s + c.clues.filter((cl) => cl.question.trim() && (cl.answer.trim() || cl.answerImage)).length,
            0
          );
          const rTotal = r.categories.reduce((s, c) => s + c.clues.length, 0);
          const active = i === activeRound;
          return (
            <button
              key={i}
              onClick={() => setActiveRound(i)}
              style={{
                background: active ? C.gold : `${C.panel}88`,
                color: active ? C.bg : C.white,
                border: `1px solid ${active ? C.gold : C.slateDark}`,
                borderRadius: 10,
                padding: '9px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 3,
                boxShadow: active ? `0 3px 10px ${C.gold}30` : 'none',
              }}
            >
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 13.5, textTransform: 'uppercase' }}>
                Round {i + 1}: {r.name}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, opacity: 0.85 }}>
                {rFilled}/{rTotal} filled
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
        <div
          className="board-grid"
          style={{
            '--tile-min': '140px',
            display: 'grid',
            gridTemplateColumns: `repeat(${round.categories.length}, minmax(var(--tile-min), 1fr))`,
            gap: 10,
            minWidth: `calc(${round.categories.length} * var(--tile-min))`,
          }}
        >
          {round.categories.map((cat, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <input
                  value={cat.name}
                  onChange={(e) => updateCategoryName(ci, e.target.value)}
                  placeholder={`Category ${ci + 1}`}
                  maxLength={28}
                  style={{
                    width: '100%',
                    background: `linear-gradient(160deg, ${C.gold}, ${C.goldSoft})`,
                    color: C.bg,
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 26px 12px 10px',
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 900,
                    fontSize: 14.5,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
                {round.categories.length > 3 && (
                  <button
                    onClick={() => removeCategory(ci)}
                    title="Remove category"
                    style={{
                      position: 'absolute',
                      right: 4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: C.redSoft,
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {cat.clues.map((clue, qi) => {
                const filled = clue.question.trim() && (clue.answer.trim() || clue.answerImage);
                return (
                  <button
                    key={qi}
                    onClick={() => setEditing({ ci, qi })}
                    style={{
                      background: filled ? C.panelHover : `${C.panel}AA`,
                      border: `1px solid ${filled ? C.gold + '55' : C.slateDark + '77'}`,
                      borderRadius: 9,
                      padding: '13px 8px',
                      color: filled ? C.gold : C.slate,
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontFamily: FONT_MONO,
                      fontWeight: 700,
                      fontSize: 14.5,
                    }}
                  >
                    ${clue.value}
                    {filled ? (
                      <Check size={12} style={{ marginLeft: 6, verticalAlign: -1 }} />
                    ) : (
                      <span style={{ marginLeft: 6, opacity: 0.6 }}>· empty</span>
                    )}
                    {clue.image && (
                      <ImageIcon size={12} style={{ marginLeft: 6, verticalAlign: -1, color: C.gold }} />
                    )}
                    {clue.video && (
                      <VideoIcon size={12} style={{ marginLeft: 6, verticalAlign: -1, color: C.gold }} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {round.categories.length < 6 && (
          <button onClick={addCategory} style={btnSmall('transparent', C.white, true)}>
            <Plus size={14} /> Add category to round {activeRound + 1}
          </button>
        )}
        <div style={{ flex: 1 }} />
        {savedFlash && (
          <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.green }}>Saved</span>
        )}
        <button onClick={doSave} style={btnSmall('transparent', C.white, true)}>
          <Save size={14} /> Save
        </button>
        <button onClick={() => onPlay(board)} style={btnPrimary()}>
          <Play size={16} /> Save &amp; play
        </button>
      </div>

      {editing && (
        <ClueEditModal
          category={round.categories[editing.ci]}
          clue={round.categories[editing.ci].clues[editing.qi]}
          onChange={(patch) => updateClue(editing.ci, editing.qi, patch)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function iconBtn() {
  return {
    background: 'none',
    border: `1px solid ${C.lavenderSoft}55`,
    borderRadius: 9,
    color: C.white,
    padding: 7,
    cursor: 'pointer',
    display: 'flex',
  };
}

function getVideoEmbedInfo(url) {
  if (!url) return null;
  if (url.startsWith('data:video')) return { type: 'file', src: url };
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { type: 'file', src: url };
}

function VideoPlayer({ url, maxHeight }) {
  const info = getVideoEmbedInfo(url);
  if (!info) return null;
  if (info.type === 'iframe') {
    return (
      <iframe
        src={info.src}
        title="Clue video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{
          width: '100%',
          maxWidth: 640,
          aspectRatio: '16 / 9',
          maxHeight: maxHeight || '38vh',
          border: `1px solid ${C.slateDark}`,
          borderRadius: 12,
        }}
      />
    );
  }
  return (
    <video
      src={info.src}
      controls
      style={{
        width: '100%',
        maxWidth: 640,
        maxHeight: maxHeight || '38vh',
        borderRadius: 12,
        border: `1px solid ${C.slateDark}`,
        background: '#000',
      }}
    />
  );
}

function VideoPicker({ value, onChange }) {
  const [urlDraft, setUrlDraft] = useState(value || '');
  const [vidError, setVidError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('video/')) return;
    if (file.size > 4.5 * 1024 * 1024) {
      setVidError(true);
      return;
    }
    setVidError(false);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      setUrlDraft(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    setVidError(false);
    onChange(urlDraft.trim());
  };

  const removeVideo = () => {
    onChange('');
    setUrlDraft('');
    setVidError(false);
  };

  return (
    <div>
      {value ? (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <VideoPlayer url={value} maxHeight={200} />
          <button
            onClick={removeVideo}
            title="Remove video"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: C.bg2 + 'E6',
              border: `1px solid ${C.slateDark}`,
              borderRadius: 6,
              color: C.white,
              padding: 5,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: C.panel,
            border: `1px dashed ${C.slateDark}`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="Paste a YouTube, Vimeo, or video link"
              style={{ ...textareaStyle(), padding: '9px 10px', flex: 1 }}
            />
            <button onClick={applyUrl} style={btnSmall('transparent', C.gold, true)}>
              <Link2 size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ flex: 1, height: 1, background: C.slateDark }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate }}>OR</span>
            <div style={{ flex: 1, height: 1, background: C.slateDark }} />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ ...btnSmall('transparent', C.white, true), justifyContent: 'center' }}
          >
            <Upload size={14} /> Upload a short video
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div style={{ fontSize: 11, color: C.slate }}>
            Uploaded clips are limited to 4.5MB — for anything longer, paste a link instead.
          </div>
        </div>
      )}
      {vidError && (
        <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>
          That file is too large to upload directly (over 4.5MB). Paste a video link instead.
        </div>
      )}
    </div>
  );
}

function ImagePicker({ value, onChange }) {
  const [urlDraft, setUrlDraft] = useState(value || '');
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 4.5 * 1024 * 1024) {
      setImgError(true);
      return;
    }
    setImgError(false);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      setUrlDraft(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    setImgError(false);
    onChange(urlDraft.trim());
  };

  const removeImage = () => {
    onChange('');
    setUrlDraft('');
    setImgError(false);
  };

  return (
    <div>
      {value ? (
        <div
          style={{
            position: 'relative',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${C.slateDark}`,
            background: C.panel,
          }}
        >
          <img
            src={value}
            alt="Picture preview"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
            style={{ width: '100%', maxHeight: 200, objectFit: 'contain', display: 'block' }}
          />
          <button
            onClick={removeImage}
            title="Remove picture"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: C.bg2 + 'E6',
              border: `1px solid ${C.slateDark}`,
              borderRadius: 6,
              color: C.white,
              padding: 5,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: C.panel,
            border: `1px dashed ${C.slateDark}`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ ...btnSmall('transparent', C.white, true), justifyContent: 'center' }}
          >
            <Upload size={14} /> Upload a picture
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ flex: 1, height: 1, background: C.slateDark }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate }}>OR</span>
            <div style={{ flex: 1, height: 1, background: C.slateDark }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="Paste an image link"
              style={{ ...textareaStyle(), padding: '9px 10px', flex: 1 }}
            />
            <button onClick={applyUrl} style={btnSmall('transparent', C.gold, true)}>
              <Link2 size={14} />
            </button>
          </div>
        </div>
      )}
      {imgError && (
        <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>
          That picture couldn't be loaded. Check the link or try a smaller file (under 4.5MB).
        </div>
      )}
    </div>
  );
}

function ClueEditModal({ category, clue, onChange, onClose }) {
  const answerReady = Boolean(clue.answer.trim() || clue.answerImage);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0B0712D9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 20,
        overflowY: 'auto',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg2,
          border: `1px solid ${C.slateDark}`,
          borderRadius: 16,
          padding: 24,
          width: '100%',
          maxWidth: 480,
          animation: 'riseIn 0.2s ease',
          margin: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 1.5 }}>
            {(category.name || 'CATEGORY').toUpperCase()} · ${clue.value}
          </div>
          <button onClick={onClose} style={iconBtn()}>
            <X size={16} />
          </button>
        </div>
        <label style={labelStyle()}>Clue (shown to players)</label>
        <textarea
          autoFocus
          value={clue.question}
          onChange={(e) => onChange({ question: e.target.value })}
          rows={3}
          placeholder="Write the clue text here…"
          style={textareaStyle()}
        />

        <label style={labelStyle()}>Clue picture (optional)</label>
        <ImagePicker value={clue.image} onChange={(image) => onChange({ image })} />

        <label style={labelStyle()}>Clue video (optional)</label>
        <VideoPicker value={clue.video} onChange={(video) => onChange({ video })} />

        <label style={labelStyle()}>Correct response</label>
        <textarea
          value={clue.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
          rows={2}
          placeholder="What is…"
          style={textareaStyle()}
        />

        <label style={labelStyle()}>Answer picture</label>
        <div style={{ fontSize: 11.5, color: C.slate, marginBottom: 8, marginTop: -4 }}>
          Add a picture, write a text response, or both — at least one is needed.
        </div>
        <ImagePicker value={clue.answerImage} onChange={(answerImage) => onChange({ answerImage })} />
        {!answerReady && (
          <div style={{ fontSize: 12, color: C.gold, marginTop: 8 }}>
            This clue still needs either a text response or a picture for the answer.
          </div>
        )}

        <button onClick={onClose} style={{ ...btnPrimary(), width: '100%', justifyContent: 'center', marginTop: 16 }}>
          Done
        </button>
      </div>
    </div>
  );
}

function labelStyle() {
  return { display: 'block', fontFamily: FONT_MONO, fontSize: 11, color: C.slate, marginBottom: 6, marginTop: 14, letterSpacing: 0.5 };
}
function textareaStyle() {
  return {
    width: '100%',
    background: C.panel,
    border: `1px solid ${C.slateDark}`,
    borderRadius: 9,
    color: C.white,
    padding: 10,
    fontSize: 14.5,
    resize: 'vertical',
    outline: 'none',
    fontFamily: FONT_BODY,
  };
}

/* ---------- TEAM SETUP ---------- */
function TeamSetupView({ board, onBack, onStart }) {
  const [names, setNames] = useState(['', '']);
  const stats = boardStats(board);

  const setName = (i, v) => setNames(names.map((n, idx) => (idx === i ? v : n)));
  const addRow = () => names.length < 8 && setNames([...names, '']);
  const removeRow = (i) => names.length > 1 && setNames(names.filter((_, idx) => idx !== i));

  const canStart = names.some((n) => n.trim());

  const handleStart = () => {
    const teamList = names
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => ({ id: uid(), name: n }));
    onStart(teamList);
  };

  return (
    <div style={{ maxWidth: 480, margin: 'clamp(24px, 6vw, 48px) auto 0', animation: 'fadeIn 0.3s ease' }}>
      <button onClick={onBack} style={{ ...iconBtn(), marginBottom: 18 }}>
        <ChevronLeft size={18} />
      </button>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 2, marginBottom: 6 }}>
        {board.title || 'UNTITLED GAME'}
      </div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(28px, 6vw, 34px)', margin: '0 0 6px' }}>
        Who's playing?
      </h1>
      {board.rounds && board.rounds.length > 1 && (
        <div style={{ color: C.slate, fontSize: 13, marginBottom: 10 }}>
          This game has {board.rounds.length} rounds — you'll move to {board.rounds[1].name} once round 1 is done.
        </div>
      )}
      {stats.filled < stats.total && (
        <div style={{ color: C.gold, fontSize: 13, marginBottom: 10 }}>
          Heads up — {stats.total - stats.filled} clue(s) are still empty and will show as blank tiles.
        </div>
      )}
      <div
        style={{
          background: `linear-gradient(160deg, ${C.panel} 0%, ${C.panelUsed} 100%)`,
          border: `1px solid ${C.slateDark}66`,
          borderRadius: 16,
          padding: 18,
          marginTop: 18,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {names.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: `${C.bg}88`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_MONO,
                  color: C.slate,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <input
                value={n}
                onChange={(e) => setName(i, e.target.value)}
                placeholder={`Team ${i + 1} name`}
                maxLength={24}
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: `${C.bg}66`,
                  border: `1px solid ${C.slateDark}`,
                  borderRadius: 9,
                  color: C.white,
                  padding: '10px 12px',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => removeRow(i)}
                disabled={names.length <= 1}
                style={{ ...iconBtn(), opacity: names.length <= 1 ? 0.3 : 1, flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        {names.length < 8 && (
          <button onClick={addRow} style={{ ...btnSmall('transparent', C.white, true), marginTop: 12 }}>
            <Plus size={14} /> Add team
          </button>
        )}
      </div>
      <button
        onClick={handleStart}
        disabled={!canStart}
        style={{
          ...btnPrimary(),
          width: '100%',
          justifyContent: 'center',
          marginTop: 18,
          fontSize: 16,
          padding: '13px 20px',
          opacity: canStart ? 1 : 0.4,
          cursor: canStart ? 'pointer' : 'not-allowed',
        }}
      >
        <Play size={18} /> Start game
      </button>
    </div>
  );
}

/* ---------- PLAY BOARD ---------- */
function PlayBoardView({ board, roundIndex, onContinueRound, teams, scores, setScores, usedTiles, setUsedTiles, onEndGame, onExit }) {
  const [openClue, setOpenClue] = useState(null); // {ci, qi}
  const [revealed, setRevealed] = useState(false);

  const round = board.rounds[roundIndex];
  const hasNextRound = roundIndex < board.rounds.length - 1;

  const totalTiles = round.categories.reduce((s, c) => s + c.clues.length, 0);
  const usedCount = Object.keys(usedTiles).length;
  const allDone = usedCount >= totalTiles;

  const openTile = (ci, qi) => {
    const key = ci + '-' + qi;
    if (usedTiles[key]) return;
    setOpenClue({ ci, qi });
    setRevealed(false);
  };

  const closeClue = () => {
    if (openClue && revealed) {
      const key = openClue.ci + '-' + openClue.qi;
      setUsedTiles((u) => ({ ...u, [key]: true }));
    }
    setOpenClue(null);
    setRevealed(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div
        style={{
          display: 'inline-flex',
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: C.gold,
          letterSpacing: 1.3,
          textTransform: 'uppercase',
          marginTop: 'clamp(16px, 4vw, 20px)',
          background: `${C.panel}88`,
          border: `1px solid ${C.slateDark}55`,
          borderRadius: 999,
          padding: '5px 12px',
        }}
      >
        Round {roundIndex + 1} of {board.rounds.length} · {round.name}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          margin: '12px 0 18px',
        }}
      >
        {teams.map((t) => (
          <div
            key={t.id}
            style={{
              background: `linear-gradient(160deg, ${C.panel} 0%, ${C.panelUsed} 100%)`,
              border: `1px solid ${C.slateDark}66`,
              borderRadius: 999,
              padding: '7px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: C.white, marginRight: 2 }}>{t.name}</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 15, color: (scores[t.id] || 0) < 0 ? C.red : C.gold }}>
              $
            </span>
            <ScoreInput
              value={scores[t.id] || 0}
              onChange={(n) => setScores((s) => ({ ...s, [t.id]: n }))}
              color={(scores[t.id] || 0) < 0 ? C.red : C.gold}
            />
            <Pencil size={10} color={C.slateDark} />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.slate }}>
          {usedCount}/{totalTiles} clues used
        </span>
        <button onClick={onEndGame} style={btnSmall('transparent', C.white, true)}>
          <Trophy size={14} /> End game
        </button>
        <button onClick={onExit} style={btnSmall('transparent', C.slate, true)}>
          Exit
        </button>
      </div>

      {allDone && hasNextRound && (
        <div
          style={{
            background: `linear-gradient(90deg, ${C.gold}26, ${C.gold}0D)`,
            border: `1px solid ${C.gold}55`,
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 14 }}>
            {round.name} is complete. Ready for {board.rounds[roundIndex + 1].name}?
          </span>
          <button onClick={onContinueRound} style={btnPrimary()}>
            <Play size={16} /> Start {board.rounds[roundIndex + 1].name}
          </button>
        </div>
      )}

      {allDone && !hasNextRound && (
        <div
          style={{
            background: `linear-gradient(90deg, ${C.gold}26, ${C.gold}0D)`,
            border: `1px solid ${C.gold}55`,
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 14 }}>All clues have been played.</span>
          <button onClick={onEndGame} style={btnPrimary()}>
            <Trophy size={16} /> See final scores
          </button>
        </div>
      )}

      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div
          className="board-grid"
          style={{
            '--tile-min': '140px',
            display: 'grid',
            gridTemplateColumns: `repeat(${round.categories.length}, minmax(var(--tile-min), 1fr))`,
            gap: 8,
            minWidth: `calc(${round.categories.length} * var(--tile-min))`,
          }}
        >
          {round.categories.map((cat, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  background: `linear-gradient(160deg, ${C.gold}, ${C.goldSoft})`,
                  color: C.bg,
                  borderRadius: 10,
                  padding: '14px 6px',
                  textAlign: 'center',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: 14.5,
                  textTransform: 'uppercase',
                  minHeight: 58,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1.15,
                  boxShadow: `0 3px 10px ${C.gold}25`,
                }}
              >
                {cat.name || `Category ${ci + 1}`}
              </div>
              {cat.clues.map((clue, qi) => {
                const key = ci + '-' + qi;
                const used = usedTiles[key];
                return (
                  <button
                    key={qi}
                    onClick={() => openTile(ci, qi)}
                    disabled={used}
                    style={{
                      background: used ? C.panelUsed : `linear-gradient(160deg, ${C.panel}, ${C.panelUsed})`,
                      border: `1px solid ${used ? C.slateDark + '33' : C.gold + '44'}`,
                      borderRadius: 9,
                      height: 64,
                      padding: '0 8px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: used ? C.slateDark : C.gold,
                      cursor: used ? 'default' : 'pointer',
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 900,
                      fontSize: 22,
                      lineHeight: 1,
                    }}
                  >
                    {used ? '' : `$${clue.value}`}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {openClue && (
        <ClueOverlay
          category={round.categories[openClue.ci]}
          clue={round.categories[openClue.ci].clues[openClue.qi]}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          teams={teams}
          scores={scores}
          setScores={setScores}
          onClose={closeClue}
        />
      )}
    </div>
  );
}

function ClueOverlay({ category, clue, revealed, onReveal, teams, scores, setScores, onClose }) {
  const bump = (teamId, sign) => {
    setScores((s) => ({ ...s, [teamId]: (s[teamId] || 0) + sign * clue.value }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: C.bg,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={{ overflow: 'hidden', position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: 0,
            width: '30%',
            height: '140%',
            background: `linear-gradient(90deg, transparent, ${C.gold}0F, transparent)`,
            animation: 'sweep 4s linear infinite',
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(20px, 5vw, 32px) clamp(16px, 5vw, 24px)',
          textAlign: 'center',
          gap: 22,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12.5,
            color: C.gold,
            letterSpacing: 1.5,
            background: `${C.panel}88`,
            border: `1px solid ${C.slateDark}55`,
            borderRadius: 999,
            padding: '6px 16px',
          }}
        >
          {(category.name || 'CATEGORY').toUpperCase()} · ${clue.value}
        </div>
        {clue.image && (
          <img
            src={clue.image}
            alt=""
            style={{
              maxWidth: 'min(600px, 80vw)',
              maxHeight: '38vh',
              borderRadius: 12,
              border: `1px solid ${C.slateDark}`,
              objectFit: 'contain',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
          />
        )}
        {clue.video && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <VideoPlayer url={clue.video} />
          </div>
        )}
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(24px, 4vw, 42px)',
            maxWidth: 880,
            lineHeight: 1.25,
          }}
        >
          {clue.question || '(No clue was written for this tile)'}
        </div>

        {!revealed && (
          <button onClick={onReveal} style={{ ...btnPrimary(), fontSize: 16, padding: '13px 26px' }}>
            <Eye size={18} /> Reveal answer
          </button>
        )}

        {revealed && (
          <div
            style={{
              marginTop: 6,
              animation: 'riseIn 0.25s ease',
              background: `linear-gradient(160deg, ${C.panel}, ${C.panelUsed})`,
              border: `1px solid ${C.gold}55`,
              borderRadius: 14,
              padding: '16px 26px',
              maxWidth: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ width: '100%' }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate, marginBottom: 6, letterSpacing: 1 }}>
                CORRECT RESPONSE
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.gold }}>
                {clue.answer || (!clue.answerImage && '(No response was written)')}
              </div>
            </div>
            {clue.answerImage && (
              <img
                src={clue.answerImage}
                alt=""
                style={{
                  maxWidth: '100%',
                  maxHeight: '32vh',
                  borderRadius: 8,
                  border: `1px solid ${C.slateDark}`,
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        )}

        <div style={{ width: '100%', maxWidth: 700, marginTop: 4 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate, marginBottom: 10, letterSpacing: 1 }}>
            TEAM SCORES · +/− ${clue.value} PER TAP
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {teams.map((t) => (
              <div
                key={t.id}
                style={{
                  background: `linear-gradient(160deg, ${C.panel}, ${C.panelUsed})`,
                  border: `1px solid ${C.slateDark}66`,
                  borderRadius: 10,
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600, minWidth: 60, textAlign: 'left' }}>{t.name}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: (scores[t.id] || 0) < 0 ? C.red : C.gold }}>
                  $
                </span>
                <ScoreInput
                  value={scores[t.id] || 0}
                  onChange={(n) => setScores((s) => ({ ...s, [t.id]: n }))}
                  color={(scores[t.id] || 0) < 0 ? C.red : C.gold}
                />
                <button onClick={() => bump(t.id, 1)} title={`Add $${clue.value}`} style={btnSmall(C.green, C.white)}>
                  <Plus size={13} />
                </button>
                <button onClick={() => bump(t.id, -1)} title={`Subtract $${clue.value}`} style={btnSmall(C.red, C.white)}>
                  <Minus size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'center',
          borderTop: `1px solid ${C.slateDark}33`,
        }}
      >
        <button onClick={onClose} style={btnSmall('transparent', C.white, true)}>
          <X size={14} /> {revealed ? 'Done with this clue' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}

/* ---------- FINAL SCORES ---------- */
function FinalScoresView({ teams, scores, onPlayAgain, onNewTeams, onHome }) {
  const ranked = [...teams].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const topScore = ranked.length ? scores[ranked[0].id] || 0 : 0;

  return (
    <div style={{ maxWidth: 560, margin: 'clamp(24px, 6vw, 40px) auto 0', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 2, marginBottom: 10 }}>
        GAME OVER
      </div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(30px, 7vw, 40px)', margin: '0 0 26px' }}>
        Final scores
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ranked.map((t, i) => {
          const s = scores[t.id] || 0;
          const isWinner = i === 0 && s === topScore && s > (ranked[1] ? scores[ranked[1].id] || 0 : -Infinity);
          return (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: isWinner
                  ? `linear-gradient(90deg, ${C.gold}2E, ${C.gold}0D)`
                  : `linear-gradient(160deg, ${C.panel}, ${C.panelUsed})`,
                border: `1px solid ${isWinner ? C.gold : C.slateDark}66`,
                borderRadius: 12,
                padding: '14px 18px',
                boxShadow: isWinner ? `0 6px 20px ${C.gold}25` : '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: 20,
                  color: isWinner ? C.gold : C.slate,
                  minWidth: 28,
                }}
              >
                {i + 1}
              </span>
              {isWinner && <Trophy size={20} color={C.gold} />}
              <span style={{ fontSize: 17, fontWeight: 600, flex: 1, textAlign: 'left' }}>{t.name}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: s < 0 ? C.red : C.white }}>${s}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
        <button onClick={onPlayAgain} style={btnPrimary()}>
          <Play size={16} /> Replay, same teams
        </button>
        <button onClick={onNewTeams} style={btnSmall('transparent', C.white, true)}>
          <Users size={14} /> New teams
        </button>
        <button onClick={onHome} style={btnSmall('transparent', C.slate, true)}>
          Back to my boards
        </button>
      </div>
    </div>
  );
}
