import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Play, Pencil, Trash2, ArrowLeft, X, Check, Trophy, Users, Minus, Save, Eye, ChevronLeft, Image as ImageIcon, Upload, Link2 } from 'lucide-react';

const C = {
  bg: '#12173C',
  bg2: '#0D1030',
  panel: '#1B2168',
  panelHover: '#262E86',
  panelUsed: '#171A4A',
  gold: '#F2B705',
  goldSoft: '#C99A1F',
  white: '#F7F5EF',
  red: '#C63B2E',
  redSoft: '#8C2A20',
  green: '#3FA66B',
  greenSoft: '#2C7A4D',
  slate: '#8288B8',
  slateDark: '#4A4F86',
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
    clues: values.map((v) => ({ value: v, question: '', answer: '', image: '' })),
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
        if (cl.question.trim() && cl.answer.trim()) filled++;
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
        background: `radial-gradient(ellipse at 50% -10%, ${C.panel} 0%, ${C.bg} 55%)`,
        fontFamily: FONT_BODY,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GlobalStyle />
      <TopBar view={view} board={activeBoard} onHome={goHome} />
      <div style={{ flex: 1, width: '100%', maxWidth: 1180, margin: '0 auto', padding: '20px 20px 56px' }}>
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
      input, textarea { font-family: inherit; }
      ::placeholder { color: #6B70A0; }
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
        borderBottom: `1px solid ${C.slateDark}55`,
        background: `${C.bg2}CC`,
        backdropFilter: 'blur(6px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: C.gold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 20,
              color: C.bg,
            }}
          >
            ?
          </div>
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: 0.5,
              color: C.white,
            }}
          >
            SPOTLIGHT TRIVIA
          </span>
        </button>
        {view !== 'home' && (
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: C.slate,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
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
          marginTop: 28,
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 2, marginBottom: 6 }}>
            HOST YOUR OWN GAME SHOW
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 44, margin: 0, lineHeight: 1 }}>
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
            borderRadius: 14,
            padding: '56px 24px',
            textAlign: 'center',
            background: `${C.panel}55`,
          }}
        >
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {boards.map((b) => {
          const complete = b.total > 0 && b.filled === b.total;
          return (
            <div
              key={b.id}
              style={{
                background: C.panel,
                border: `1px solid ${C.slateDark}66`,
                borderRadius: 12,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                animation: 'riseIn 0.25s ease',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 900,
                    fontSize: 22,
                    lineHeight: 1.1,
                    marginBottom: 6,
                    color: C.white,
                    wordBreak: 'break-word',
                  }}
                >
                  {b.title || 'Untitled game'}
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: complete ? C.green : C.gold }}>
                  {b.roundCount || 1} round{(b.roundCount || 1) > 1 ? 's' : ''} · {b.filled}/{b.total} clues filled
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
    borderRadius: 9,
    padding: '11px 20px',
    fontWeight: 700,
    fontSize: 14.5,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };
}
function btnSmall(bg, fg, outline) {
  return {
    background: bg,
    color: fg,
    border: outline ? `1px solid ${C.slateDark}` : 'none',
    borderRadius: 7,
    padding: '8px 12px',
    fontWeight: 700,
    fontSize: 13,
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
      { name: '', clues: values.map((v) => ({ value: v, question: '', answer: '', image: '' })) },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 6 }}>
        <button onClick={onBack} style={{ ...iconBtn(), }}>
          <ChevronLeft size={18} />
        </button>
        <input
          value={board.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Name your game show"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${C.slateDark}`,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 32,
            padding: '6px 2px',
            outline: 'none',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 12,
          color: C.slate,
          marginBottom: 18,
          marginLeft: 46,
        }}
      >
        {stats.filled}/{stats.total} clues filled across both rounds · click a tile to write it
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, marginLeft: 46 }}>
        {board.rounds.map((r, i) => {
          const rFilled = r.categories.reduce(
            (s, c) => s + c.clues.filter((cl) => cl.question.trim() && cl.answer.trim()).length,
            0
          );
          const rTotal = r.categories.reduce((s, c) => s + c.clues.length, 0);
          const active = i === activeRound;
          return (
            <button
              key={i}
              onClick={() => setActiveRound(i)}
              style={{
                background: active ? C.gold : 'transparent',
                color: active ? C.bg : C.white,
                border: `1px solid ${active ? C.gold : C.slateDark}`,
                borderRadius: 8,
                padding: '9px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
                Round {i + 1}: {r.name}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, opacity: 0.85 }}>
                {rFilled}/{rTotal} filled
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${round.categories.length}, minmax(150px, 1fr))`,
            gap: 10,
            minWidth: round.categories.length * 150,
          }}
        >
          {round.categories.map((cat, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <input
                  value={cat.name}
                  onChange={(e) => updateCategoryName(ci, e.target.value)}
                  placeholder={`Category ${ci + 1}`}
                  maxLength={28}
                  style={{
                    width: '100%',
                    background: C.gold,
                    color: C.bg,
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 26px 12px 10px',
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 900,
                    fontSize: 15,
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
                const filled = clue.question.trim() && clue.answer.trim();
                return (
                  <button
                    key={qi}
                    onClick={() => setEditing({ ci, qi })}
                    style={{
                      background: filled ? C.panelHover : C.panel,
                      border: `1px solid ${filled ? C.gold + '55' : C.slateDark}`,
                      borderRadius: 8,
                      padding: '14px 8px',
                      color: filled ? C.gold : C.slate,
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontFamily: FONT_MONO,
                      fontWeight: 700,
                      fontSize: 15,
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
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
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
    border: `1px solid ${C.slateDark}`,
    borderRadius: 8,
    color: C.white,
    padding: 7,
    cursor: 'pointer',
    display: 'flex',
  };
}

function ClueEditModal({ category, clue, onChange, onClose }) {
  const [urlDraft, setUrlDraft] = useState(clue.image || '');
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
      onChange({ image: reader.result });
      setUrlDraft(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    setImgError(false);
    onChange({ image: urlDraft.trim() });
  };

  const removeImage = () => {
    onChange({ image: '' });
    setUrlDraft('');
    setImgError(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#05071ACC',
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
          borderRadius: 14,
          padding: 24,
          width: '100%',
          maxWidth: 480,
          animation: 'riseIn 0.2s ease',
          margin: 'auto',
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

        <label style={labelStyle()}>Picture (optional)</label>
        {clue.image ? (
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
              src={clue.image}
              alt="Clue attachment preview"
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

        <label style={labelStyle()}>Correct response</label>
        <textarea
          value={clue.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
          rows={2}
          placeholder="What is…"
          style={textareaStyle()}
        />
        <button onClick={onClose} style={{ ...btnPrimary(), width: '100%', justifyContent: 'center', marginTop: 4 }}>
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
    borderRadius: 8,
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
    <div style={{ maxWidth: 480, margin: '48px auto 0', animation: 'fadeIn 0.3s ease' }}>
      <button onClick={onBack} style={{ ...iconBtn(), marginBottom: 18 }}>
        <ChevronLeft size={18} />
      </button>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 2, marginBottom: 6 }}>
        {board.title || 'UNTITLED GAME'}
      </div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 34, margin: '0 0 6px' }}>
        Who's playing?
      </h1>
      {board.rounds && board.rounds.length > 1 && (
        <div style={{ color: C.slate, fontSize: 13, marginBottom: 10 }}>
          This game has {board.rounds.length} rounds — you'll move to {board.rounds[1].name} once round 1 is done.
        </div>
      )}
      {stats.filled < stats.total && (
        <div style={{ color: C.gold, fontSize: 13, marginBottom: 18 }}>
          Heads up — {stats.total - stats.filled} clue(s) are still empty and will show as blank tiles.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        {names.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT_MONO,
                color: C.slate,
                fontSize: 13,
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
                background: C.panel,
                border: `1px solid ${C.slateDark}`,
                borderRadius: 8,
                color: C.white,
                padding: '10px 12px',
                fontSize: 15,
                outline: 'none',
              }}
            />
            <button
              onClick={() => removeRow(i)}
              disabled={names.length <= 1}
              style={{ ...iconBtn(), opacity: names.length <= 1 ? 0.3 : 1 }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {names.length < 8 && (
          <button onClick={addRow} style={btnSmall('transparent', C.white, true)}>
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
          marginTop: 26,
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

  const award = (teamId, delta) => {
    setScores((s) => ({ ...s, [teamId]: (s[teamId] || 0) + delta }));
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
          fontFamily: FONT_MONO,
          fontSize: 11.5,
          color: C.gold,
          letterSpacing: 1.5,
          marginTop: 20,
          textTransform: 'uppercase',
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
          margin: '10px 0 18px',
        }}
      >
        {teams.map((t) => (
          <div
            key={t.id}
            style={{
              background: C.panel,
              border: `1px solid ${C.slateDark}`,
              borderRadius: 9,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{t.name}</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 15, color: (scores[t.id] || 0) < 0 ? C.red : C.gold }}>
              ${scores[t.id] || 0}
            </span>
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
            background: `${C.gold}22`,
            border: `1px solid ${C.gold}66`,
            borderRadius: 10,
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
            background: `${C.gold}22`,
            border: `1px solid ${C.gold}66`,
            borderRadius: 10,
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
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${round.categories.length}, minmax(140px, 1fr))`,
            gap: 8,
            minWidth: round.categories.length * 140,
          }}
        >
          {round.categories.map((cat, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  background: C.gold,
                  color: C.bg,
                  borderRadius: 8,
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
                      background: used ? C.panelUsed : C.panel,
                      border: `1px solid ${used ? C.slateDark + '33' : C.gold + '44'}`,
                      borderRadius: 8,
                      padding: '18px 8px',
                      color: used ? C.slateDark : C.gold,
                      cursor: used ? 'default' : 'pointer',
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 900,
                      fontSize: 22,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!used) e.currentTarget.style.background = C.panelHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!used) e.currentTarget.style.background = C.panel;
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
          onAward={award}
          onClose={closeClue}
        />
      )}
    </div>
  );
}

function ClueOverlay({ category, clue, revealed, onReveal, teams, scores, onAward, onClose }) {
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
          padding: '40px 24px',
          textAlign: 'center',
          gap: 22,
        }}
      >
        <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.gold, letterSpacing: 2 }}>
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
            }}
          />
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

        {revealed && (
          <div
            style={{
              marginTop: 6,
              animation: 'riseIn 0.25s ease',
              background: C.panel,
              border: `1px solid ${C.gold}55`,
              borderRadius: 12,
              padding: '16px 26px',
              maxWidth: 700,
            }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate, marginBottom: 6, letterSpacing: 1 }}>
              CORRECT RESPONSE
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.gold }}>
              {clue.answer || '(No response was written)'}
            </div>
          </div>
        )}

        {!revealed && (
          <button onClick={onReveal} style={{ ...btnPrimary(), fontSize: 16, padding: '13px 26px' }}>
            <Eye size={18} /> Reveal answer
          </button>
        )}

        {revealed && (
          <div style={{ width: '100%', maxWidth: 700, marginTop: 10 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate, marginBottom: 10, letterSpacing: 1 }}>
              AWARD POINTS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {teams.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: C.panel,
                    border: `1px solid ${C.slateDark}`,
                    borderRadius: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 600, minWidth: 60, textAlign: 'left' }}>{t.name}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.slate, minWidth: 44 }}>
                    ${scores[t.id] || 0}
                  </span>
                  <button onClick={() => onAward(t.id, clue.value)} style={btnSmall(C.green, C.white)}>
                    <Plus size={13} />
                  </button>
                  <button onClick={() => onAward(t.id, -clue.value)} style={btnSmall(C.red, C.white)}>
                    <Minus size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'center' }}>
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
    <div style={{ maxWidth: 560, margin: '40px auto 0', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.gold, letterSpacing: 2, marginBottom: 10 }}>
        GAME OVER
      </div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 40, margin: '0 0 26px' }}>
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
                background: isWinner ? `${C.gold}22` : C.panel,
                border: `1px solid ${isWinner ? C.gold : C.slateDark}`,
                borderRadius: 10,
                padding: '14px 18px',
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
