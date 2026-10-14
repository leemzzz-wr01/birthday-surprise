import { useEffect, useMemo, useRef, useState } from "react";
import photo1Asset from "./photos/photo1.jpg";
import photo2Asset from "./photos/photo2.jpg";
import photo3Asset from "./photos/photo3.jpg";

const LOCAL_PHOTOS = {
  "/photos/photo1.jpg": photo1Asset,
  "/photos/photo2.jpg": photo2Asset,
  "/photos/photo3.jpg": photo3Asset,
};

/* ================= ✏️ EDIT ME: password, photos, text ================= */
const PASSWORD = "alaiqaaaa"; // 🔑 change the password here (not case-sensitive)

// 📸 3–5 photos: put files in /public/photos and list them here
const PHOTOS = [
  { src: "/photos/photo1.jpg", caption: "a little cutie Chashmish ♡" },
  { src: "/photos/photo3.jpg", caption: "pretty in White 🎀" },
  { src: "/photos/photo2.jpg", caption: "soft sunshine cutie" },
];

const TEXT = {
  note: "It's actually nice meeting someone new and finding their vibe unexpectedly comforting. I'm glad we got to know each other.",
  wish: "I hope this year brings you the kind of happiness you don't have to explain, the peace you don't have to chase, and little moments that make life feel beautiful.",
  poem: [
    " ♡ \nA face full of innocence,,\nEyes full of magic,\nand a heart full of the loveliest little things 🎀🌷 ♡",
    "A whole lot of cuteness,,\nAnd a heart worth a thousand poems 🎀🤍",
    "Wrapped in golden giggles,\nsprinkled with stardust, \nand carrying her own little universe of magic ✧₊˚ 🎀",
  ],
  letter:
    "Happy Birthday, pretty girl! ♡\n\nI'm really glad our paths crossed. May this new chapter bring you genuine happiness, beautiful surprises, and so many reasons to smile.\n\nHere's to more conversations, more laughter, and memories we haven't made yet.\n\nHave the loveliest birthday! 🎀💗",
  signature: "— your online friend ♡",
};
/* ===================================================================== */

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- typewriter hook: runs once per text, can be skipped ---------- */
function useTypewriter(text, speed = 38) {
  const [n, setN] = useState(reduceMotion() ? text.length : 0);
  useEffect(() => {
    if (reduceMotion()) return setN(text.length);
    setN(0);
    const id = setInterval(
      () => setN((c) => (c >= text.length ? (clearInterval(id), c) : c + 1)),
      speed,
    );
    return () => clearInterval(id);
  }, [text, speed]);
  return {
    shown: text.slice(0, n),
    done: n >= text.length,
    skip: () => setN(text.length),
  };
}

function Typed({ text, className = "", speed = 38 }) {
  const { shown, done, skip } = useTypewriter(text, speed);
  return (
    <div className="typed-message">
      <p
        onClick={skip}
        title="Click to show the whole message"
        className={`message-text whitespace-pre-line cursor-pointer ${className}`}
      >
        {shown}
        {!done && (
          <span className="cursor" aria-hidden="true">
            |
          </span>
        )}
      </p>
      {!done && (
        <button type="button" onClick={skip} className="reveal-button">
          Show message
        </button>
      )}
    </div>
  );
}

/* ---------- reusable pieces ---------- */
function Btn({
  children,
  onClick,
  variant = "main",
  type = "button",
  ...rest
}) {
  const look =
    variant === "main"
      ? "bg-ink text-cream"
      : "bg-white/70 text-ink border border-rose";
  return (
    <button
      type={type}
      onClick={onClick}
      {...rest}
      className={`birthday-button birthday-button--${variant} ${look} rounded-full px-6 py-3 text-sm font-medium shadow-md shadow-rose/40 transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95`}
    >
      {children}
    </button>
  );
}

function Bow({ className = "" }) {
  return (
    <svg
      width="80"
      height="50"
      viewBox="0 0 80 50"
      className={`decorative-bow ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M40 25 C25 2 2 4 6 25 C2 46 25 48 40 25Z" fill="#D99BAF" />
      <path d="M40 25 C55 2 78 4 74 25 C78 46 55 48 40 25Z" fill="#D99BAF" />
      <path
        d="M40 25 C28 12 14 12 14 25 C14 36 28 38 40 25Z"
        fill="#F8DCE5"
        opacity=".6"
      />
      <path
        d="M40 25 C52 12 66 12 66 25 C66 36 52 38 40 25Z"
        fill="#F8DCE5"
        opacity=".6"
      />
      <circle cx="40" cy="25" r="7" fill="#81566A" />
    </svg>
  );
}

function Floaters({ items = ["♡", "✦", "♥"], count = 14 }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        ch: items[i % items.length],
        left: Math.random() * 96,
        size: 12 + Math.random() * 16,
        dur: 9 + Math.random() * 10,
        delay: -Math.random() * 14,
      })),
    [count],
  ); // eslint-disable-line
  return (
    <div
      className="birthday-floaters pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {bits.map((b, i) => (
        <span
          key={i}
          className="float-up absolute text-rose"
          style={{
            left: `${b.left}%`,
            fontSize: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {b.ch}
        </span>
      ))}
    </div>
  );
}

function Scene({ bg, children, floaters, bows = true, className = "" }) {
  return (
    <main
      className={`birthday-scene ${className} relative min-h-screen w-full ${bg}`}
    >
      {floaters}
      {bows && (
        <>
          <Bow className="corner-bow corner-bow--first absolute left-3 top-3 w-14 -rotate-12 opacity-80 sm:w-20" />
          <Bow className="corner-bow corner-bow--last absolute bottom-3 right-3 w-14 rotate-12 opacity-80 sm:w-20" />
        </>
      )}
      <div className="scene-content fade-in relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        {children}
      </div>
    </main>
  );
}

const Heading = ({ children }) => <h1 className="scene-heading">{children}</h1>;
const Note = ({ children }) => <p className="scene-note">{children}</p>;
const NavRow = ({ children }) => (
  <nav aria-label="Birthday scene navigation" className="scene-navigation">
    {children}
  </nav>
);

/* ---------- Scene 1: password ---------- */
function Lock({ onUnlock }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    val.trim().toLowerCase() === PASSWORD.toLowerCase()
      ? onUnlock()
      : setErr(true);
  };
  return (
    <Scene bg="bg-gradient-to-b from-blush to-cream" floaters={<Floaters />}>
      <div className="lock-card paper">
        <Bow className="mx-auto w-20" />
        <p className="lock-eyebrow">a little birthday magic</p>
        <h1 className="lock-heading">pssst... a little surprise for you ♡</h1>
        <p className="lock-subtitle">made with love, just for Alaiqaaa 🎀</p>
        <form onSubmit={submit} className="lock-form">
          <label htmlFor="pw" className="text-sm">
            Ahmm Password Guess Krain 👀
          </label>
          <input
            id="pw"
            type="password"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setErr(false);
            }}
            placeholder="Nhi pta to DM krain 👀..."
            autoComplete="off"
            required
            aria-invalid={err}
            aria-describedby={err ? "password-error" : undefined}
            className="rounded-full border border-rose bg-white/80 px-5 py-3 text-center outline-none focus:ring-2 focus:ring-ink"
          />
          {err && (
            <p id="password-error" role="alert" className="font-script text-xl">
              oops, that's not it... try again, pretty girl ♡
            </p>
          )}
          <Btn type="submit">Enter Krain 👀</Btn>
        </form>
        <p className="lock-footer">
          a few little surprises, made just for you ♡
          <br /> From @girlie_kh 👀♡
        </p>
      </div>
    </Scene>
  );
}

/* ---------- Scene 2: balloons ---------- */
const BALLOONS = [
  {
    id: "note",
    n: "1",
    color: "#F8DCE5",
    label: "Balloon 1: a little appreciation",
  },
  {
    id: "wish",
    n: "2",
    color: "#E8DDF5",
    label: "Balloon 2: wishes for your new year",
  },
  {
    id: "pics",
    n: "3",
    color: "#D99BAF",
    label: "Balloon 3: pictures and poetry",
  },
];

const allBalloonsOpened = (visited) =>
  BALLOONS.every(({ id }) => visited.includes(id));
const recordBalloon = (visited, id) =>
  BALLOONS.some((balloon) => balloon.id === id) && !visited.includes(id)
    ? [...visited, id]
    : visited;

function Balloons({ go, visited, onReveal }) {
  const complete = allBalloonsOpened(visited);
  const [popped, setPopped] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const pop = (id) => {
    if (timer.current !== null) return;
    if (visited.includes(id)) {
      timer.current = -1;
      go(id);
      return;
    }
    setPopped(id);
    timer.current = setTimeout(
      () => {
        onReveal(id);
        go(id);
      },
      reduceMotion() ? 0 : 450,
    );
  };
  return (
    <Scene
      bg="bg-gradient-to-b from-lilac via-blush to-cream"
      floaters={<Floaters items={["✦", "♡"]} count={10} />}
      bows={false}
    >
      <h1 className="balloon-heading">
        Alaiqaaa, choose your little surprise ♡
      </h1>
      <div className="balloon-group">
        {BALLOONS.map((b, i) => (
          <button
            type="button"
            key={b.id}
            onClick={() => pop(b.id)}
            disabled={popped !== null}
            aria-label={`${b.label}${visited.includes(b.id) ? ", already opened" : ""}`}
            className={`balloon-button ${visited.includes(b.id) ? "balloon-button--opened" : ""} ${popped === b.id ? "balloon-button--popping" : ""}`}
            style={{
              "--balloon-color": b.color,
              "--bob-delay": `${i * -0.8}s`,
            }}
          >
            <span className="balloon-body" aria-hidden="true">
              <span className="balloon-symbol">
                {visited.includes(b.id) ? "♡" : ["✦", "♡", "🎀"][i]}
              </span>
            </span>
            <span className="balloon-knot" aria-hidden="true" />
            <span className="balloon-string" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="balloon-instruction" role="status">
        {complete
          ? "You found all 3 little surprises! 🎀 Ready for something sweeter?"
          : "tap each balloon to discover its surprise ✦"}
      </p>
      <p className="balloon-progress">
        {BALLOONS.filter(({ id }) => visited.includes(id)).length} of 3
        surprises discovered ♡
      </p>
      <div className="balloon-navigation">
        <Btn variant="soft" onClick={() => go("lock")}>
          Back
        </Btn>
        {/* Render no cake control until every individual balloon is recorded. */}
        {complete ? (
          <Btn onClick={() => go("cake")}>Next: Birthday Cake 🎂</Btn>
        ) : null}
      </div>
    </Scene>
  );
}

/* ---------- Scenes 3 & 4: messages ---------- */
function Message({ bg, title, text, note, onBack, floaters }) {
  return (
    <Scene bg={bg} floaters={floaters}>
      <Heading>{title}</Heading>
      <div className="message-card paper">
        <Typed
          key={text}
          text={text}
          className="font-script text-2xl leading-relaxed sm:text-3xl"
        />
      </div>
      <Note>{note}</Note>
      <NavRow>
        <Btn variant="soft" onClick={onBack}>
          Back to Balloons 🎈
        </Btn>
      </NavRow>
    </Scene>
  );
}

/* ---------- Scene 5: photos + poetry ---------- */
function Polaroid({ photo, i, onOpen }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure
      className="polaroid fade-in"
      style={{
        "--photo-rotation": `${[-4, 3, -2, 4, -3][i % 5]}deg`,
        animationDelay: `${i * 0.15}s`,
      }}
    >
      {broken ? (
        <div className="photo-placeholder">
          <span aria-hidden="true">{["♡", "🎀", "☀"][i % 3]}</span>
          <span>Photo unavailable</span>
        </div>
      ) : (
        <button
          type="button"
          className="diary-photo-button"
          onClick={onOpen}
          aria-label={`Enlarge photo: ${photo.caption}`}
        >
          <img
            src={LOCAL_PHOTOS[photo.src] || photo.src}
            alt={photo.caption}
            onError={() => setBroken(true)}
          />
        </button>
      )}
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

function Pics({ onBack }) {
  const [memory, setMemory] = useState(0);
  const dialog = useRef(null);
  const total = Math.max(PHOTOS.length, TEXT.poem.length);
  const photo = PHOTOS[memory];
  const poem = TEXT.poem[memory];
  const changeMemory = (index) =>
    setMemory(Math.max(0, Math.min(total - 1, index)));
  return (
    <Scene
      bg="bg-gradient-to-b from-cream to-blush"
      floaters={<Floaters count={8} />}
      className="diary-scene"
    >
      <Heading>pictures & poetry ♡</Heading>
      <div className="open-diary" key={memory}>
        <section
          className="diary-page diary-page--photos"
          aria-labelledby="diary-photo-heading"
        >
          <span className="diary-doodle" aria-hidden="true">
            ✿ ♡ ✧
          </span>
          <h2 id="diary-photo-heading">little moments</h2>
          {photo && (
            <Polaroid
              photo={photo}
              i={memory}
              onOpen={() => dialog.current.showModal()}
            />
          )}
          <span className="diary-page-number" aria-hidden="true">
            {memory * 2 + 1}
          </span>
        </section>
        <section
          className="diary-page diary-page--poetry"
          aria-labelledby="diary-poem-heading"
        >
          <h2 id="diary-poem-heading">words tucked away for you</h2>
          <div className="diary-divider" aria-hidden="true">
            ♡
          </div>
          {poem && <p className="diary-poem">{poem}</p>}
          <span className="diary-flower" aria-hidden="true">
            ❀
          </span>
          <span className="diary-page-number" aria-hidden="true">
            {memory * 2 + 2}
          </span>
        </section>
      </div>
      <nav className="diary-controls" aria-label="Diary memories">
        <button
          type="button"
          onClick={() => changeMemory(memory - 1)}
          disabled={memory === 0}
        >
          ← Previous memory
        </button>
        <span role="status" aria-live="polite">
          Memory {memory + 1} of {total}
        </span>
        <button
          type="button"
          onClick={() => changeMemory(memory + 1)}
          disabled={memory === total - 1}
        >
          Next memory →
        </button>
      </nav>
      <dialog
        ref={dialog}
        className="diary-photo-dialog"
        aria-label="Enlarged memory photo"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
      >
        <button
          type="button"
          className="diary-close"
          onClick={() => dialog.current.close()}
        >
          Close photo ✕
        </button>
        {photo && (
          <figure>
            <img
              src={LOCAL_PHOTOS[photo.src] || photo.src}
              alt={photo.caption}
            />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        )}
      </dialog>
      <NavRow>
        <Btn variant="soft" onClick={onBack}>
          Back to Balloons 🎈
        </Btn>
      </NavRow>
    </Scene>
  );
}

/* ---------- Scene 6: cake ---------- */
function Cake({ onBack, onNext }) {
  const [out, setOut] = useState(false);
  const [listening, setListening] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(true);
  const stop = useRef(() => {});
  const blowOut = () => {
    pending.current = false;
    stop.current();
    setListening(false);
    setOut(true);
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current = false;
      stop.current();
    };
  }, []);

  const start = async () => {
    if (pending.current) return;
    pending.current = true;
    setListening(true);
    let stream;
    let ctx;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current || !pending.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      setListening(true);
      let loud = 0;
      const id = setInterval(() => {
        an.getByteTimeDomainData(buf);
        const rms = Math.sqrt(
          buf.reduce((s, v) => s + (v - 128) ** 2, 0) / buf.length,
        );
        loud = rms > 18 ? loud + 1 : 0;
        if (loud >= 4) blowOut(); // ~0.4s of steady breath
      }, 100);
      const timeout = setTimeout(blowOut, 6000); // fallback if no breath detected
      stop.current = () => {
        clearInterval(id);
        clearTimeout(timeout);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => {});
        stop.current = () => {};
      };
    } catch {
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => {});
      if (mounted.current && pending.current) blowOut();
    } // denied or unsupported → still works
  };

  return (
    <Scene
      bg="bg-gradient-to-b from-lilac to-blush"
      floaters={<Floaters items={["✦", "♡"]} count={8} />}
    >
      <Heading>one tiny birthday wish... ♡</Heading>
      <p className="cake-subtitle">make a wish, Alaiqaaa!</p>
      <div
        className="birthday-cake"
        role="img"
        aria-label={
          out
            ? "birthday cake with candles blown out"
            : "birthday cake with lit candles"
        }
      >
        <div className="candles">
          {[0, 1, 2].map((i) => (
            <div key={i} className="candle">
              {!out ? (
                <div
                  className="flame"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ) : (
                <span
                  className="smoke"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              )}
              <div className="candle-stick" />
            </div>
          ))}
        </div>
        <div className="cake-tier cake-tier--top">
          <div className="cake-icing" />
        </div>
        <div className="cake-tier cake-tier--bottom">
          <div className="cake-icing" />
        </div>
        <div className="cake-plate" />
      </div>
      <NavRow>
        <Btn
          variant="soft"
          onClick={() => {
            stop.current();
            onBack();
          }}
        >
          Back
        </Btn>
        {!out && !listening && <Btn onClick={start}>Blow out the candles</Btn>}
        {!out && listening && (
          <Btn onClick={blowOut}>Or tap to blow them out ♡</Btn>
        )}
        {out && <Btn onClick={onNext}>Open your birthday letter ♡</Btn>}
      </NavRow>
      {listening && (
        <p className="scene-note" role="status">
          go on, blow softly into your mic... or use the tap button ♡
        </p>
      )}
      {out && (
        <p className="scene-note" role="status">
          wish made! may it find its way to you ♡
        </p>
      )}
    </Scene>
  );
}

/* ---------- Scene 7: letter ---------- */
function Letter({ onBack }) {
  return (
    <Scene
      bg="bg-blush"
      floaters={<Floaters items={["♡", "✦", "♥", "🎀"]} count={18} />}
    >
      <Heading>your birthday letter ♡</Heading>
      <div className="letter-card paper">
        <Bow className="letter-bow" />
        <Typed
          text={TEXT.letter}
          speed={45}
          className="font-script text-2xl leading-relaxed sm:text-3xl"
        />
        <p className="letter-signature">{TEXT.signature}</p>
      </div>
      <Note>
        Happy birthday, Alaiqaaa. Here's to all the lovely things ahead 🎀
      </Note>
      <NavRow>
        <Btn variant="soft" onClick={onBack}>
          Back to the cake
        </Btn>
      </NavRow>
    </Scene>
  );
}

/* ---------- App: scene state + browser back button ---------- */
export default function App() {
  const [scene, setScene] = useState("lock");
  const [unlocked, setUnlocked] = useState(false);
  const [visited, setVisited] = useState([]);
  const [selectedBalloon, setSelectedBalloon] = useState(null);
  const audio = useRef(null);
  const musicStarted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicError, setMusicError] = useState("");
  const complete = allBalloonsOpened(visited);

  const playMusic = () => {
    const player = audio.current;
    if (!player) return;
    setMusicError("");
    if (!player.getAttribute("src"))
      player.src = `${import.meta.env.BASE_URL}audio/birthday-song.mp3`;
    if (player.error) player.load();
    try {
      // Called synchronously from the password submit or Play button gesture.
      player.play()?.catch((error) => {
        if (error.name === "AbortError") return;
        setPlaying(false);
        setMusicError(
          error.name === "NotAllowedError"
            ? "Tap Play to allow birthday music ♡"
            : "Music unavailable — add birthday-song.mp3 to public/audio, then tap Play ♡",
        );
      });
    } catch {
      setMusicError("Music unavailable. Please try Play again ♡");
    }
  };
  const unlock = () => {
    if (!musicStarted.current) {
      musicStarted.current = true;
      playMusic();
    }
    go("balloons");
  };

  useEffect(() => {
    const heading = document.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [scene]);

  useEffect(() => {
    history.replaceState({ s: "lock" }, "");
    const onPop = (e) => {
      const nextScene = e.state?.s || "lock";
      setSelectedBalloon(
        BALLOONS.some(({ id }) => id === nextScene) ? nextScene : null,
      );
      setScene(nextScene);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (s) => {
    if (["cake", "letter"].includes(s) && !complete) s = "balloons";
    if (s !== "lock") setUnlocked(true);
    history.pushState({ s }, "");
    setSelectedBalloon(BALLOONS.some(({ id }) => id === s) ? s : null);
    setScene(s);
    window.scrollTo(0, 0);
  };

  const view =
    !unlocked && scene !== "lock"
      ? "lock"
      : ["cake", "letter"].includes(scene) && !complete
        ? "balloons"
        : scene;
  useEffect(() => {
    if (view === "letter") audio.current?.pause();
  }, [view]);
  return (
    <div>
      <audio
        ref={audio}
        loop
        preload="none"
        muted={muted}
        onPlaying={() => {
          setPlaying(true);
          setMusicError("");
        }}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setMusicError(
            "Music unavailable — add birthday-song.mp3 to public/audio, then tap Play ♡",
          );
        }}
      />
      {unlocked && (
        <aside
          className={`music-controls ${playing && !muted ? "music-controls--playing" : ""}`}
          aria-label="Birthday music"
        >
          <span className="music-status visually-hidden" role="status">
            {musicError
              ? "Music unavailable"
              : playing
                ? muted
                  ? "Music muted"
                  : "Music playing ♡"
                : "Music paused"}
          </span>
          <button
            type="button"
            className="music-toggle"
            onClick={() => (playing ? audio.current?.pause() : playMusic())}
            title={musicError || (playing ? "Pause birthday music" : "Play birthday music")}
            aria-pressed={playing}
            aria-label={
              playing ? "Pause birthday music" : "Play birthday music"
            }
          >
            <span className="music-icon" aria-hidden="true">♫</span>
          </button>
          <button
            type="button"
            className="music-mute"
            onClick={() => setMuted((value) => !value)}
            aria-label={muted ? "Unmute birthday music" : "Mute birthday music"}
            aria-pressed={muted}
          >
            <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
          </button>
          {musicError && (
            <p className="music-error visually-hidden" role="status">
              {musicError}
            </p>
          )}
        </aside>
      )}
      <div key={view} className="birthday-scenes">
        {view === "lock" && <Lock onUnlock={unlock} />}
        {view === "balloons" && (
          <Balloons
            go={go}
            visited={visited}
            onReveal={(id) => setVisited((v) => recordBalloon(v, id))}
          />
        )}
        {view === "note" && selectedBalloon === "note" && (
          <Message
            bg="bg-gradient-to-b from-cream to-blush"
            title="A LITTLE NOTE FOR YOU..."
            text={TEXT.note}
            note="some people make the internet feel a little warmer ♡"
            floaters={<Floaters count={10} />}
            onBack={() => go("balloons")}
          />
        )}
        {view === "wish" && selectedBalloon === "wish" && (
          <Message
            bg="bg-gradient-to-b from-lilac to-blush"
            title="little wishes for your new chapter ♡"
            text={TEXT.wish}
            note="you deserve the softest kind of happiness 🎀"
            floaters={<Floaters items={["✦", "★", "✧"]} count={16} />}
            onBack={() => go("balloons")}
          />
        )}
        {view === "pics" && selectedBalloon === "pics" && (
          <Pics onBack={() => go("balloons")} />
        )}
        {view === "cake" && (
          <Cake onBack={() => go("balloons")} onNext={() => go("letter")} />
        )}
        {view === "letter" && <Letter onBack={() => go("cake")} />}
      </div>
    </div>
  );
}
