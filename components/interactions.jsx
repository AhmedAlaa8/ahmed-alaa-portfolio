"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionConfig,
  LazyMotion,
} from "motion/react";
import * as motion from "motion/react-m";
import { usePortfolio } from "./preferences";
import InvestmentArt from "./investment-art";
import PaymentArt from "./payment-art";
import { useVisibleMotion } from "../hooks/use-visible-motion";
const loadFeatures = () =>
  import("./motion-features").then((module) => module.default);
const Settings = createContext({ enabled: false, fine: false });
export function PortfolioMotion({ children }) {
  const reduce = useReducedMotion();
  const [off, setOff] = useState(false);
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const q = matchMedia("(pointer:fine) and (hover:hover)");
    const update = () => setFine(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  const enabled = !off && !reduce;
  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", !enabled);
    return () => document.documentElement.classList.remove("motion-off");
  }, [enabled]);
  return (
    <Settings.Provider value={{ enabled, fine, setOff, reduce }}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </Settings.Provider>
  );
}
export function MotionSwitch() {
  const { content: t } = usePortfolio();
  const { enabled, setOff, reduce } = useContext(Settings);
  return (
    <button
      className="motion-switch"
      aria-pressed={!enabled}
      disabled={!!reduce}
      title={reduce ? t.settings.reduced : undefined}
      onClick={() => setOff((v) => !v)}
    >
      <span className={enabled ? "switch-dot active" : "switch-dot"} />
      {t.settings.motion} {enabled ? t.settings.on : t.settings.off}
    </button>
  );
}
export function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const { enabled } = useContext(Settings);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !("IntersectionObserver" in window)) return;
    const box = el.getBoundingClientRect();
    if (box.top < innerHeight * 0.95) return;
    el.classList.add("reveal-wait");
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.remove("reveal-wait");
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.classList.remove("reveal-wait");
    };
  }, [enabled]);
  return (
    <div ref={ref} className={"reveal " + className}>
      {children}
    </div>
  );
}
export function MagneticLink({ href, children }) {
  const { enabled, fine } = useContext(Settings);
  const x = useSpring(0, { stiffness: 240, damping: 20 }),
    y = useSpring(0, { stiffness: 240, damping: 20 });
  useEffect(() => {
    if (!enabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, x, y]);
  return (
    <span
      className="magnet-zone"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.13);
        y.set((e.clientY - r.top - r.height / 2) * 0.2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.a className="primary-link" href={href} style={{ x, y }}>
        <span>{children}</span>
        <i aria-hidden="true" />
      </motion.a>
    </span>
  );
}
const A_PATH =
  "M16 260 L99 20 L165 20 L248 260 L187 260 L173 210 L91 210 L77 260 Z M106 157 L158 157 L132 66 Z";
function Letter({ variant }) {
  return (
    <svg viewBox="0 0 270 290" className="letter-art" aria-hidden="true">
      <defs>
        <linearGradient id={"metal-" + variant} x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0"
            stopColor={
              variant === "front"
                ? "var(--metal-front-1)"
                : "var(--metal-back-1)"
            }
          />
          <stop
            offset=".35"
            stopColor={
              variant === "front"
                ? "var(--metal-front-2)"
                : "var(--metal-back-2)"
            }
          />
          <stop
            offset=".7"
            stopColor={
              variant === "front"
                ? "var(--metal-front-3)"
                : "var(--metal-back-3)"
            }
          />
          <stop
            offset="1"
            stopColor={
              variant === "front"
                ? "var(--metal-front-4)"
                : "var(--metal-back-4)"
            }
          />
        </linearGradient>
      </defs>
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={A_PATH}
          fillRule="evenodd"
          transform={`translate(${(12 - i) * 0.9} ${(12 - i) * 1.25})`}
          fill={
            variant === "front" ? "var(--metal-edge)" : "var(--metal-back-edge)"
          }
          stroke={
            variant === "front" ? "var(--metal-edge)" : "var(--metal-back-edge)"
          }
          strokeWidth=".4"
        />
      ))}
      <path
        d={A_PATH}
        fillRule="evenodd"
        fill={`url(#metal-${variant})`}
        stroke={
          variant === "front"
            ? "var(--metal-highlight)"
            : "var(--metal-highlight)"
        }
        strokeWidth="1"
      />
    </svg>
  );
}
export function Monogram() {
  const { content: t } = usePortfolio();
  const { enabled } = useContext(Settings);
  const driftRef = useVisibleMotion(enabled);
  const [split, setSplit] = useState(false);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 115, damping: 22 }),
    y = useSpring(my, { stiffness: 115, damping: 22 });
  const rx = useTransform(y, [-1, 1], [24, -24]),
    ry = useTransform(x, [-1, 1], [-32, 32]);
  const frontX = useTransform(x, [-1, 1], [-26, 26]),
    frontY = useTransform(y, [-1, 1], [-16, 16]);
  const backX = useTransform(x, [-1, 1], [18, -18]),
    backY = useTransform(y, [-1, 1], [12, -12]);
  const lightX = useTransform(x, [-1, 1], [-95, 95]),
    lightY = useTransform(y, [-1, 1], [-65, 65]);
  useEffect(() => {
    if (!enabled) {
      mx.jump(0);
      my.jump(0);
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, mx, my, x, y]);
  return (
    <div
      className="monogram-scene interactive-scene"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(
          Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)),
        );
        my.set(
          Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)),
        );
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        setHovered(false);
      }}
    >
      <motion.div
        className="scene-light"
        style={{ x: lightX, y: lightY }}
        animate={{ opacity: hovered && enabled ? 0.7 : 0.25 }}
        transition={{ duration: enabled ? 0.3 : 0 }}
        aria-hidden="true"
      />
      <div className="scene-orbit" aria-hidden="true" />
      <span className="object-label">{t.hero.object}</span>
      <button
        className="monogram-control"
        aria-label={split ? t.hero.together : t.hero.separate}
        aria-pressed={split}
        onClick={() => setSplit((v) => !v)}
      >
        <div className="monogram-drift" ref={driftRef} data-running="false">
          <motion.div
            className="monogram-assembly"
            style={{ rotateX: rx, rotateY: ry }}
          >
            <motion.div
              className="pointer-layer"
              style={{ x: backX, y: backY }}
            >
              <motion.div
                className="mono-letter mono-back"
                animate={{
                  x: split ? 75 : 35,
                  y: split ? -55 : -25,
                  rotateZ: split ? 12 : 0,
                }}
                transition={{
                  duration: enabled ? 0.6 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Letter variant="back" />
              </motion.div>
            </motion.div>
            <motion.div
              className="pointer-layer"
              style={{ x: frontX, y: frontY }}
            >
              <motion.div
                className="mono-letter mono-front"
                animate={{
                  x: split ? -50 : -25,
                  y: split ? 30 : 10,
                  rotateZ: split ? -15 : -8,
                }}
                transition={{
                  duration: enabled ? 0.6 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Letter variant="front" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </button>
      <div className="scene-instruction">
        <span className="interaction-dot" />
        {split ? t.hero.hintSplit : t.hero.hint}
      </div>
    </div>
  );
}
function ProjectArt({ kind }) {
  const {
    content: { art: a },
  } = usePortfolio();
  if (kind === "receipt")
    return (
      <div className="receipt-composition">
        <div className="receipt-shadow" />
        <div className="receipt-paper">
          <span className="receipt-brand">{a.order}</span>
          <div className="receipt-divider" />
          <div className="receipt-row">
            <span>{a.checkout}</span>
            <b>{a.received}</b>
          </div>
          <div className="receipt-row">
            <span>{a.payment}</span>
            <b>{a.confirmed}</b>
          </div>
          <div className="receipt-row">
            <span>{a.orderLabel}</span>
            <b>{a.processed}</b>
          </div>
          <div className="receipt-divider" />
          <strong className="receipt-total">{a.accounted}</strong>
          <div className="barcode">
            {Array.from({ length: 30 }, (_, i) => (
              <i key={i} style={{ width: i % 3 === 0 ? 4 : 2 }} />
            ))}
          </div>
          <span className="receipt-caption">{a.illustrative}</span>
        </div>
        <div className="receipt-tab">{a.commerce}</div>
      </div>
    );
  if (kind === "payment") return <PaymentArt labels={a} />;
  if (kind === "bank")
    return (
      <div className="bank-composition">
        <div className="bank-plate">
          <span className="plate-corner c1" />
          <span className="plate-corner c2" />
          <span className="plate-corner c3" />
          <span className="plate-corner c4" />
          <span className="bank-caption">{a.direct}</span>
          <strong>
            {a.bank}
            <br />
            <em>API</em>
          </strong>
          <div className="bank-lines">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="bank-footer">{a.bankFooter}</span>
        </div>
      </div>
    );
  return <InvestmentArt labels={a} />;
}

function handleTabs(event, index, count, onSelect, refs, locale) {
  let next = index;
  if (
    locale === "ar" &&
    (event.key === "ArrowRight" || event.key === "ArrowLeft")
  ) {
    event.preventDefault();
    next = (index + (event.key === "ArrowRight" ? -1 : 1) + count) % count;
    onSelect(next);
    refs.current[next]?.focus();
    return;
  }
  if (event.key === "ArrowRight" || event.key === "ArrowDown")
    next = (index + 1) % count;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
    next = (index - 1 + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return;
  event.preventDefault();
  onSelect(next);
  refs.current[next]?.focus();
}
export function WorkGallery() {
  const { content: t, projects, locale } = usePortfolio();
  const { enabled } = useContext(Settings);
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState(false);
  const refs = useRef([]);
  const p = projects[selected];
  const x = useSpring(0, { stiffness: 130, damping: 22 }),
    y = useSpring(0, { stiffness: 130, damping: 22 });
  const rx = useTransform(y, [-1, 1], [12, -12]),
    ry = useTransform(x, [-1, 1], [-15, 15]);
  const select = (i) => {
    setSelected(i);
    setDetail(false);
    x.set(0);
    y.set(0);
  };
  useEffect(() => {
    if (!enabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, x, y]);
  return (
    <div className="work-explorer">
      <div className="project-tabs" role="tablist" aria-label={t.work.tabLabel}>
        {projects.map((item, i) => (
          <button
            key={item.id}
            id={"work-tab-" + i}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            aria-selected={selected === i}
            aria-controls="work-panel"
            tabIndex={selected === i ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) =>
              handleTabs(e, i, projects.length, select, refs, locale)
            }
          >
            <span className="tab-number">{item.id}</span>
            <span>
              {item.name}
              <small>{item.category}</small>
            </span>
            <i className="selection-dot" />
          </button>
        ))}
      </div>
      <div
        id="work-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={"work-tab-" + selected}
        className="explorer-panel"
      >
        <motion.div
          key={p.id}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: enabled ? 0.35 : 0 }}
        >
          <div
            className={"art-surface surface-" + p.art}
            onPointerMove={(e) => {
              if (!enabled || e.pointerType === "touch") return;
              const r = e.currentTarget.getBoundingClientRect();
              x.set(((e.clientX - r.left) / r.width) * 2 - 1);
              y.set(((e.clientY - r.top) / r.height) * 2 - 1);
            }}
            onPointerLeave={() => {
              x.set(0);
              y.set(0);
            }}
          >
            <span className="art-top-label">{p.category}</span>
            <motion.div
              className="art-object"
              style={{ rotateX: rx, rotateY: ry }}
              aria-hidden="true"
            >
              <ProjectArt kind={p.art} />
            </motion.div>
            <span className="art-bottom-label">
              {t.work.study} / {p.id}
            </span>
          </div>
          <div className="explorer-copy">
            <div className="explorer-title">
              <h3>{p.name}</h3>
              <span>{p.id} / 04</span>
            </div>
            <p>{p.copy}</p>
            <ul className="work-skills">
              {p.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <button
              className="read-project"
              onClick={() => setDetail((v) => !v)}
              aria-expanded={detail}
              aria-controls="project-story"
            >
              {detail ? t.work.close : t.work.details}
              <span
                className={detail ? "plus-mark expanded" : "plus-mark"}
                aria-hidden="true"
              />
            </button>
            <div className="project-story" id="project-story" hidden={!detail}>
              <p>{p.detail}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export function ProfileTabs({ about, experience, toolkit }) {
  const { content: t, locale } = usePortfolio();
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  const names = t.profile.tabs;
  return (
    <div className="profile-tabs-wrapper">
      <div
        className="profile-tabs"
        role="tablist"
        aria-label={t.profile.tabLabel}
      >
        {names.map((name, i) => (
          <button
            key={name}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            id={"profile-tab-" + i}
            aria-selected={selected === i}
            aria-controls={"profile-panel-" + i}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => handleTabs(e, i, 3, setSelected, refs, locale)}
          >
            {name}
          </button>
        ))}
      </div>
      {[about, experience, toolkit].map((content, i) => (
        <div
          role="tabpanel"
          id={"profile-panel-" + i}
          aria-labelledby={"profile-tab-" + i}
          tabIndex={0}
          hidden={selected !== i}
          key={i}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
export function ConnectCard() {
  const { content: t, links } = usePortfolio();
  const { enabled } = useContext(Settings);
  const x = useSpring(0, { stiffness: 170, damping: 22 }),
    y = useSpring(0, { stiffness: 170, damping: 22 });
  useEffect(() => {
    if (!enabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, x, y]);
  return (
    <div
      className="connect-card"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.045);
        y.set((e.clientY - r.top - r.height / 2) * 0.05);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="connect-copy">
        <span className="eyebrow">{t.contact.eyebrow}</span>
        <h2>{t.contact.title}</h2>
        <p>{t.contact.copy}</p>
        <div className="contact-links">
          <a className="phone-link" href={links.phone}>
            <span className="phone-symbol" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2Z" />
              </svg>
            </span>
            <span className="phone-caption">
              {t.contact.phone}
              <bdi>{links.phoneDisplay}</bdi>
            </span>
          </a>
          <a className="connect-text" href={links.linkedin}>
            {t.contact.link}
          </a>
        </div>
      </div>
      <motion.a
        className="linkedin-orb"
        href={links.linkedin}
        aria-label={t.contact.label}
        style={{ x, y }}
      >
        <span className="orb-ring" aria-hidden="true" />
        <span className="linkedin-icon" aria-hidden="true">
          in
        </span>
        <span className="orb-label">{t.contact.orb}</span>
      </motion.a>
    </div>
  );
}
