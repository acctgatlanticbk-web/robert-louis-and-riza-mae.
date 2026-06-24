"use client"

import { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import {
  Heart,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { getRoleSingular } from "@/lib/proposal-roles"
import { parseWeddingDate } from "@/lib/wedding-date"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import type { ProposalRole, ProposalResponse } from "@/lib/proposal-types"
import {
  coastalPalette,
  displayScript,
} from "@/lib/coastal-palette"

const BACKGROUND_IMAGE = "/decoration/oceanpastelbackground.png"

/** High-contrast text tuned for glass over the ocean pastel background */
const TEXT = "#3A5566"
const TEXT_DEEP = "#2D434F"
const ACCENT = "#8B4F4F"
const LABEL = "#5A6870"
const NAME_COLOR = "#4A7A94"
const NAME_SHADOW =
  "0 1px 2px rgba(255, 255, 255, 0.95), 0 2px 12px rgba(255, 255, 255, 0.65), 0 0 20px rgba(106, 155, 184, 0.35)"
const BUTTON_COLOR = "#FBCFC6"
const BORDER_SOFT = "rgba(45, 67, 79, 0.18)"
const INNER_SURFACE = "rgba(255, 252, 248, 0.72)"

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[120px] sm:max-w-[160px] md:max-w-[220px] lg:max-w-[260px]"

const BLUE_SHELL_FILTER =
  `brightness(0) saturate(100%) invert(58%) sepia(18%) saturate(612%) hue-rotate(152deg) brightness(95%) contrast(88%) drop-shadow(0 4px 14px color-mix(in srgb, ${coastalPalette.blueGray} 55%, transparent))`

const bodySerif: CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, 'Times New Roman', serif",
  fontStyle: "normal",
}
const labelSerif: CSSProperties = {
  fontFamily: "'Cinzel', 'Times New Roman', serif",
  fontStyle: "normal",
  fontWeight: 500,
}

const cardStyle: CSSProperties = {
  background:
    "linear-gradient(155deg, rgba(255, 252, 248, 0.78) 0%, rgba(251, 231, 225, 0.72) 42%, rgba(232, 238, 246, 0.76) 100%)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderColor: "rgba(255, 255, 255, 0.88)",
  borderWidth: "2px",
  borderStyle: "solid",
  outline: "1px solid rgba(255, 255, 255, 0.5)",
  outlineOffset: "2px",
  boxShadow:
    "0 4px 28px rgba(45, 67, 79, 0.1), 0 16px 48px rgba(45, 67, 79, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
}

const primaryBtnStyle: CSSProperties = {
  ...labelSerif,
  fontWeight: 600,
  backgroundColor: BUTTON_COLOR,
  borderColor: "rgba(139, 79, 79, 0.35)",
  color: TEXT_DEEP,
  boxShadow: "0 6px 20px rgba(45, 67, 79, 0.12)",
}

const secondaryBtnStyle: CSSProperties = {
  ...labelSerif,
  fontWeight: 600,
  color: TEXT_DEEP,
  backgroundColor: "rgba(255, 252, 248, 0.82)",
  borderColor: "rgba(45, 67, 79, 0.22)",
}

function DottedRule({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "w-[3.25rem] border-t border-dotted md:w-[4rem]"
          : "flex-1 border-t border-dotted"
      }
      style={{ borderColor: TEXT_DEEP }}
    />
  )
}

function ProposalCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl p-6 text-center sm:rounded-3xl sm:p-10 md:p-12 md:py-14 lg:p-14 lg:py-16 ${className}`}
      style={cardStyle}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/top-left-shell-deco.png"
          alt=""
          className={CORNER_DECO_CLASS}
          style={{ filter: BLUE_SHELL_FILTER }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/right-bottom-shell-deco.png"
          alt=""
          className={CORNER_DECO_CLASS}
          style={{ filter: BLUE_SHELL_FILTER }}
        />
      </div>
      {children}
    </div>
  )
}

function ProposalIntroSection() {
  const siteConfig = useSiteConfig()

  const groomNickname = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideNickname = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const ceremonyDate =
    siteConfig.ceremony.date ?? siteConfig.wedding.date ?? defaultSiteConfig.ceremony.date
  const parsedDate = useMemo(
    () => parseWeddingDate(ceremonyDate, parseWeddingDate(defaultSiteConfig.ceremony.date)),
    [ceremonyDate],
  )
  const ceremonyDay = (
    siteConfig.ceremony.day ?? parsedDate.dayOfWeek ?? defaultSiteConfig.ceremony.day
  ).toUpperCase()
  const ceremonyTime =
    siteConfig.ceremony.time ?? siteConfig.wedding.time ?? defaultSiteConfig.ceremony.time
  const { month, day: dateNum, year } = parsedDate

  return (
    <div
      className="mx-auto w-full max-w-[310px] space-y-5 text-center sm:space-y-6 md:max-w-[520px] md:space-y-7"
      style={{ color: TEXT, WebkitFontSmoothing: "antialiased" }}
    >
      {/* SAVE THE DATE — arch */}
      <div className="mb-2 mt-4 w-full sm:mt-6 md:mt-8">
        <div className="-translate-y-2 md:-translate-y-3">
          <svg viewBox="0 0 300 100" className="mx-auto h-[66px] w-full md:hidden" aria-hidden overflow="visible">
            <defs>
              <path id="proposalArcMob" d="M 6 80 A 178 178 0 0 1 294 80" fill="none" />
            </defs>
            <text fill={TEXT_DEEP} style={{ ...labelSerif, fontSize: "22px", letterSpacing: "0.28em" }}>
              <textPath href="#proposalArcMob" startOffset="50%" textAnchor="middle">
                SAVE THE DATE
              </textPath>
            </text>
          </svg>
          <svg viewBox="0 0 480 130" className="mx-auto hidden h-[90px] w-full md:block" aria-hidden overflow="visible">
            <defs>
              <path id="proposalArcDsk" d="M 10 104 A 280 280 0 0 1 470 104" fill="none" />
            </defs>
            <text fill={TEXT_DEEP} style={{ ...labelSerif, fontSize: "34px", letterSpacing: "0.26em" }}>
              <textPath href="#proposalArcDsk" startOffset="50%" textAnchor="middle">
                SAVE THE DATE
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[320px] items-center justify-center gap-2 md:max-w-[420px]">
          <DottedRule compact />
          <p
            className="shrink-0 text-[11px] leading-snug md:text-[13px]"
            style={{ ...bodySerif, color: TEXT_DEEP, fontStyle: "italic" }}
          >
            With joy in our hearts,
          </p>
          <DottedRule compact />
        </div>
        <p
          className="mt-3 max-w-[280px] text-[13px] leading-[1.8] md:max-w-none md:text-[15px] md:leading-[1.9]"
          style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}
        >
          we ask you to stand with us at the wedding of
        </p>
      </div>

      {/* Couple names */}
      <div className="flex w-full flex-col items-center gap-5 sm:gap-6">
        <h1
          className="w-full px-1 leading-[1.2]"
          style={{
            ...displayScript,
            fontSize: "clamp(32px, 8.5vw, 46px)",
            color: NAME_COLOR,
            fontWeight: 400,
            letterSpacing: "0.01em",
            textShadow: NAME_SHADOW,
          }}
        >
          {groomNickname}
        </h1>

        <div className="flex w-full max-w-[200px] items-center justify-center gap-2.5 md:max-w-[240px] md:gap-3">
          <DottedRule compact />
          <span
            className="shrink-0 text-[12px] italic md:text-[14px]"
            style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}
          >
            and
          </span>
          <DottedRule compact />
        </div>

        <h1
          className="w-full px-1 leading-[1.2]"
          style={{
            ...displayScript,
            fontSize: "clamp(32px, 8.5vw, 46px)",
            color: NAME_COLOR,
            fontWeight: 400,
            letterSpacing: "0.01em",
            textShadow: NAME_SHADOW,
          }}
        >
          {brideNickname}
        </h1>
      </div>

      <p
        className="w-full text-[13px] leading-[1.75] md:text-[15px] md:leading-[1.85]"
        style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}
      >
        Together with their families
        <br />
        invite you to their wedding celebration
      </p>

      {/* Date block */}
      <div className="w-full">
        <div
          className="mx-auto grid w-full max-w-[260px] gap-y-0 md:max-w-[340px]"
          style={{
            gridTemplateColumns: "1fr auto 1fr",
            gridTemplateRows: "auto auto auto",
          }}
        >
          <div
            className="col-start-2 row-start-1 border-x border-t border-dotted px-1.5 pb-0 pt-0.5 text-center md:px-2"
            style={{ borderColor: TEXT_DEEP }}
          >
            <span
              className="text-[10px] tracking-[0.18em] uppercase md:text-[12px]"
              style={{ ...labelSerif, color: TEXT_DEEP }}
            >
              {month}
            </span>
          </div>

          <div className="col-start-1 row-start-2 flex flex-col justify-center gap-[2px] px-0.5 md:px-1">
            <div className="border-t border-dotted" style={{ borderColor: TEXT_DEEP }} />
            <span
              className="text-center text-[10px] tracking-[0.14em] uppercase md:text-[12px]"
              style={{ ...labelSerif, color: TEXT_DEEP }}
            >
              {ceremonyDay}
            </span>
            <div className="border-t border-dotted" style={{ borderColor: TEXT_DEEP }} />
          </div>

          <div
            className="col-start-2 row-start-2 flex items-center justify-center border-x border-dotted px-1 pb-0 pt-0 md:px-1.5"
            style={{ borderColor: TEXT_DEEP }}
          >
            <span
              className="leading-[0.85]"
              style={{
                ...labelSerif,
                fontSize: "clamp(48px, 13vw, 64px)",
                color: ACCENT,
                fontWeight: 600,
              }}
            >
              {dateNum}
            </span>
          </div>

          <div className="col-start-3 row-start-2 flex flex-col justify-center gap-[2px] px-0.5 md:px-1">
            <div className="border-t border-dotted" style={{ borderColor: TEXT_DEEP }} />
            <span
              className="whitespace-nowrap text-center text-[10px] tracking-[0.14em] uppercase md:text-[12px]"
              style={{ ...labelSerif, color: TEXT_DEEP }}
            >
              At {ceremonyTime}
            </span>
            <div className="border-t border-dotted" style={{ borderColor: TEXT_DEEP }} />
          </div>

          <div
            className="col-start-2 row-start-3 border-x border-b border-dotted px-1.5 pb-0.5 pt-0 text-center md:px-2"
            style={{ borderColor: TEXT_DEEP }}
          >
            <span
              className="text-[14px] leading-none tracking-[0.1em] md:text-[18px]"
              style={{ ...labelSerif, color: TEXT_DEEP, fontWeight: 600 }}
            >
              {year}
            </span>
          </div>
        </div>
      </div>

      {/* Venue */}
      <div className="flex w-full flex-col items-center">
        <div className="flex items-center justify-center gap-1.5 md:gap-2">
          <DottedRule compact />
          <span
            className="text-[13px] italic md:text-[15px]"
            style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}
          >
            at
          </span>
          <DottedRule compact />
        </div>
        <p
          className="mt-3 text-[13px] leading-relaxed tracking-[0.1em] uppercase md:mt-3.5 md:text-[15px]"
          style={{ ...labelSerif, color: TEXT_DEEP, fontWeight: 600 }}
        >
          {siteConfig.ceremony.location}
        </p>
      </div>
    </div>
  )
}

const primaryBtnClass =
  "cursor-pointer rounded-full border px-5 py-3 text-[0.65rem] uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-50 sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.26em] md:px-8 md:py-4"

const secondaryBtnClass =
  "cursor-pointer rounded-full border-2 px-5 py-3 text-[0.65rem] uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.26em] md:px-8 md:py-4"

function ProposalAskSection({
  roleSingular,
  description,
  coAttendants,
  onYes,
  onNo,
}: {
  roleSingular: string
  description: string
  coAttendants: string[]
  onYes: () => void
  onNo: () => void
}) {
  const questionRef = useRef<HTMLDivElement>(null)
  const [questionHeight, setQuestionHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = questionRef.current
    if (!node) return

    const syncHeight = () => {
      setQuestionHeight(node.getBoundingClientRect().height)
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(node)

    return () => observer.disconnect()
  }, [roleSingular, description])

  return (
    <div className="relative mx-auto mt-0 w-full sm:mt-10">
      {coAttendants.length > 0 && (
        <div
          className="mx-auto mb-8 max-w-lg space-y-3 rounded-xl px-5 py-4 text-center sm:px-6 sm:py-5"
          style={{ border: `1px solid ${BORDER_SOFT}`, backgroundColor: INNER_SURFACE }}
        >
          <div
            className="flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase sm:text-xs"
            style={{ ...labelSerif, color: LABEL, fontWeight: 600 }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Co-members standing in this position</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {coAttendants.map((name, idx) => (
              <span
                key={idx}
                className="rounded-full px-3 py-1 text-xs shadow-sm"
                style={{ ...bodySerif, color: TEXT, border: `1px solid ${BORDER_SOFT}`, backgroundColor: coastalPalette.cream }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="relative pt-2 sm:pt-12"
        style={{ borderTop: `1px solid ${BORDER_SOFT}` }}
      >
        <div className="relative mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:gap-10">
          {/* Question + quote — text wraps around floated image on mobile */}
          <div className="relative z-10 min-w-0 flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
              className="pointer-events-none relative float-right ml-3 mb-2 h-[clamp(240px,62vw,340px)] w-[44%] max-w-[190px] shrink-0 sm:hidden"
              style={{ shapeOutside: "margin-box" }}
            >
              <Image
                src="/Details/guest.png"
                alt=""
                fill
                className="object-contain object-bottom drop-shadow-[0_20px_48px_rgba(42,37,32,0.12)]"
                sizes="44vw"
                priority
              />
            </motion.div>

            <div ref={questionRef} className="w-full space-y-4 sm:space-y-5">
              <p
                className="text-[10px] tracking-[0.16em] uppercase md:text-[12px]"
                style={{ ...labelSerif, color: LABEL, fontWeight: 600 }}
              >
                Will You Be Our
              </p>

              <h2
                className="leading-[1.4] [overflow-wrap:anywhere]"
                style={{
                  ...displayScript,
                  fontSize: "clamp(2.25rem, 9vw, 4rem)",
                  color: NAME_COLOR,
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  textShadow: NAME_SHADOW,
                  textTransform: "capitalize",
                }}
              >
                {roleSingular}?
              </h2>

              <p
                className="max-w-lg text-[13px] leading-[1.8] sm:text-[15px] sm:leading-[1.9]"
                style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}
              >
                &ldquo;{description}&rdquo;
              </p>
            </div>

            <div className="clear-both mt-10 hidden w-full flex-row gap-3 sm:mt-12 sm:flex sm:max-w-md md:mt-14">
              <button
                onClick={onYes}
                className={`${primaryBtnClass} min-w-0 flex-1`}
                style={primaryBtnStyle}
              >
                Yes, I&apos;d Be Honored
              </button>
              <button
                onClick={onNo}
                className={`${secondaryBtnClass} min-w-0 flex-1`}
                style={secondaryBtnStyle}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {/* Couple illustration — desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            style={
              questionHeight
                ? ({ "--ask-image-h": `${questionHeight}px` } as CSSProperties)
                : undefined
            }
            className="pointer-events-none relative hidden shrink-0 sm:block sm:w-[min(36vw,240px)] md:w-[min(32vw,280px)] lg:w-[300px]"
          >
            <div
              className="relative w-full sm:aspect-[3/4] sm:translate-y-4 md:translate-y-6"
              style={questionHeight ? { minHeight: "var(--ask-image-h)" } : undefined}
            >
              <Image
                src="/Details/guest.png"
                alt=""
                fill
                className="object-contain object-bottom drop-shadow-[0_20px_48px_rgba(42,37,32,0.12)]"
                sizes="(max-width: 640px) 44vw, 300px"
                priority
              />
            </div>
          </motion.div>

          <div className="flex w-full flex-row gap-2.5 sm:hidden">
            <button
              onClick={onYes}
              className={`${primaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5`}
              style={primaryBtnStyle}
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className={`${secondaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5`}
              style={secondaryBtnStyle}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type ProposalFlowState =
  | "question"
  | "yes_details"
  | "yes_submitted"
  | "no_clicked"
  | "no_submitted"

interface ProposalPageProps {
  role: ProposalRole
}

export function ProposalPage({ role }: ProposalPageProps) {
  const [isReady, setIsReady] = useState(false)
  const [flowState, setFlowState] = useState<ProposalFlowState>("question")
  const [preferredName, setPreferredName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [responses, setResponses] = useState<ProposalResponse[]>([])

  const handleLoadingComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    fetch("/api/proposal-responses", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setResponses(Array.isArray(data) ? data : []))
      .catch(() => setResponses([]))
  }, [])

  const coAttendants = responses
    .filter((r) => r.role === role.id && r.status === "Confirmed")
    .map((r) => r.name || "A Secret Supporter")

  const submitResponse = async (status: "Confirmed" | "Declined", name: string) => {
    const response = await fetch("/api/proposal-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: role.id,
        name,
        status,
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit response")
    }

    window.dispatchEvent(new Event("entourageUpdated"))
  }

  const handleYesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferredName.trim()) {
      setValidationError(
        "Please type your preferred name so we can add it to our invitation."
      )
      return
    }
    setValidationError("")
    setSubmitting(true)

    try {
      await submitResponse("Confirmed", preferredName.trim())
      setFlowState("yes_submitted")
    } catch (err) {
      console.error("Failed to submit confirmation:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNoSubmit = async () => {
    setSubmitting(true)
    try {
      await submitResponse("Declined", "Declined Entourage Offer")
      setFlowState("no_submitted")
    } catch (err) {
      console.error("Failed to submit decline:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const roleSingular = getRoleSingular(role.title)

  return (
    <div className="relative min-h-screen select-none overflow-x-hidden px-3 py-10 sm:px-6 sm:py-16 md:py-20">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.16)_52%,rgba(255,255,255,0.06)_100%)]"
        aria-hidden
      />

      {!isReady && <LoadingScreen onComplete={handleLoadingComplete} />}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center lg:max-w-4xl min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-8rem)]"
        style={{ ...bodySerif, color: TEXT }}
      >
        <AnimatePresence mode="wait">
          {flowState === "question" && (
            <motion.div
              key="question-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ProposalCard>
              <div className="relative z-10 w-full space-y-6 pt-2 sm:space-y-9 sm:pt-3">
                <ProposalIntroSection />

                <div
                  className="mx-auto max-w-xl space-y-4 px-1 py-6 text-[13px] leading-[1.8] sm:space-y-6 sm:px-0 sm:py-9 sm:text-[15px] sm:leading-[1.9]"
                  style={{ borderTop: `1px solid ${BORDER_SOFT}`, borderBottom: `1px solid ${BORDER_SOFT}` }}
                >
                  <p className="text-pretty" style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}>
                    &ldquo;As we enter the next chapter of our lives as husband and wife, we seek
                    the guidance and support of special people who have inspired us through their
                    love, wisdom, and example.&rdquo;
                  </p>
                  <p
                    className="text-[11px] leading-relaxed tracking-[0.14em] uppercase sm:text-[13px] sm:tracking-[0.16em]"
                    style={{ ...labelSerif, color: LABEL, fontWeight: 600 }}
                  >
                    Because you are a role model of love, laughter, and happily ever after, it
                    would be our honor if you would stand with us and witness our love as our:
                  </p>
                </div>

                <ProposalAskSection
                  roleSingular={roleSingular}
                  description={role.description}
                  coAttendants={coAttendants}
                  onYes={() => setFlowState("yes_details")}
                  onNo={() => setFlowState("no_clicked")}
                />
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "yes_details" && (
            <motion.form
              key="yes-form"
              onSubmit={handleYesSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ProposalCard>
              <div className="relative z-10 w-full space-y-4 py-1 sm:space-y-6 sm:py-3">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/80 bg-emerald-50/90 shadow-sm backdrop-blur-sm sm:h-12 sm:w-12">
                    <Check className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <h2
                  className="mb-2 text-pretty text-xl leading-snug sm:text-3xl sm:leading-snug"
                  style={{
                    ...displayScript,
                    color: NAME_COLOR,
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    textShadow: NAME_SHADOW,
                  }}
                >
                  We are honored to have you as part of our special day.
                </h2>

                <p className="mx-auto max-w-md text-[13px] leading-[1.75] sm:text-[15px] sm:leading-[1.85]" style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}>
                  Thank you for accepting our proposal! Please enter the exact name you would like
                  displayed on our wedding invitation and guestlists:
                </p>

                <div className="mx-auto max-w-md text-left">
                  <label className="mb-2 block text-[10px] tracking-[0.16em] uppercase sm:text-[12px]" style={{ ...labelSerif, color: LABEL, fontWeight: 600 }}>
                    Your Preferred Name <span style={{ color: ACCENT }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aunt Maria Clara / Mr. James Bond"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 sm:py-3 sm:text-sm"
                    style={{
                      ...bodySerif,
                      color: TEXT,
                      backgroundColor: INNER_SURFACE,
                      border: `1px solid ${BORDER_SOFT}`,
                      boxShadow: "inset 0 1px 2px rgba(90, 116, 120, 0.06)",
                    }}
                  />
                  {validationError && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
                      <span>⚠️</span> {validationError}
                    </p>
                  )}
                </div>

                <div
                  className="mx-auto flex max-w-md flex-col gap-3 pt-4 sm:flex-row"
                  style={{ borderTop: `1px solid ${BORDER_SOFT}` }}
                >
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryBtnClass} flex-1`}
                    style={primaryBtnStyle}
                  >
                    {submitting ? "Saving..." : "Submit Response"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={secondaryBtnStyle}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </ProposalCard>
            </motion.form>
          )}

          {flowState === "yes_submitted" && (
            <motion.div
              key="yes-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <div className="relative mb-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full shadow-sm backdrop-blur-sm"
                    style={{
                      color: NAME_COLOR,
                      border: `1px solid ${BORDER_SOFT}`,
                      backgroundColor: INNER_SURFACE,
                      boxShadow: "0 8px 24px rgba(45, 67, 79, 0.08)",
                    }}
                  >
                    <Sparkles className="h-8 w-8" />
                  </motion.div>
                </div>

                <h2
                  className="mb-4 leading-[1.1]"
                  style={{
                    ...displayScript,
                    fontSize: "clamp(2rem, 9vw, 3.5rem)",
                    color: NAME_COLOR,
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    textShadow: NAME_SHADOW,
                  }}
                >
                  It&apos;s Official!
                </h2>

                <div
                  className="mx-auto mb-6 max-w-sm rounded-2xl px-6 py-4 shadow-sm backdrop-blur-sm"
                  style={{ border: `1px solid ${BORDER_SOFT}`, backgroundColor: INNER_SURFACE }}
                >
                  <span className="mb-1 block text-[10px] tracking-[0.16em] uppercase" style={{ ...labelSerif, color: LABEL, fontWeight: 600 }}>
                    Registered partner
                  </span>
                  <p
                    className="text-lg sm:text-xl"
                    style={{
                      ...displayScript,
                      color: NAME_COLOR,
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      textShadow: NAME_SHADOW,
                    }}
                  >
                    {preferredName}
                  </p>
                  <span className="mt-1.5 block text-[13px] italic" style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}>
                    for the position of {role.title}
                  </span>
                </div>

                <p className="mx-auto mb-10 max-w-md text-[13px] leading-[1.75] sm:text-[15px] sm:leading-[1.85]" style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}>
                  Thank you so much. Having you stand with us fills our hearts with endless joy
                  and confidence. We can&apos;t wait to celebrate together on our wedding day!
                </p>

                <Link
                  href="/"
                  className={`${primaryBtnClass} inline-block w-full max-w-sm`}
                  style={primaryBtnStyle}
                >
                  Return to Wedding Page
                </Link>
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "no_clicked" && (
            <motion.div
              key="no-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-200/80 bg-rose-50/90 shadow-sm backdrop-blur-sm">
                    <X className="h-6 w-6 text-rose-500" />
                  </div>
                </div>

                <h2
                  className="mb-4 text-[13px] tracking-[0.16em] uppercase sm:text-[15px]"
                  style={{ ...labelSerif, color: TEXT_DEEP, fontWeight: 600 }}
                >
                  Thank You for Responding
                </h2>

                <p
                  className="mx-auto mb-10 max-w-lg text-[13px] leading-[1.75] sm:text-[15px] sm:leading-[1.85]"
                  style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}
                >
                  &ldquo;Thank you for taking the time to respond. While we&apos;re saddened that
                  you won&apos;t be able to join us in this role, we truly appreciate your support
                  and well wishes as we begin this new chapter together.&rdquo;
                </p>

                <div
                  className="mx-auto flex max-w-xs flex-col gap-3 pt-4 sm:max-w-md sm:flex-row"
                  style={{ borderTop: `1px solid ${BORDER_SOFT}` }}
                >
                  <button
                    onClick={handleNoSubmit}
                    disabled={submitting}
                    className="flex-1 cursor-pointer rounded-full border border-rose-500 bg-rose-500 px-8 py-4 text-[11px] font-semibold tracking-[0.18em] text-white uppercase shadow-md transition-all duration-300 hover:border-rose-600 hover:bg-rose-600 disabled:opacity-50"
                    style={{ ...labelSerif, fontWeight: 600 }}
                  >
                    {submitting ? "Sending..." : "Send Response"}
                  </button>
                  <button
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={secondaryBtnStyle}
                  >
                    Go Back
                  </button>
                </div>
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "no_submitted" && (
            <motion.div
              key="no-submitted-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <div className="mb-6 flex justify-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full shadow-sm backdrop-blur-sm"
                    style={{
                      color: NAME_COLOR,
                      border: `1px solid ${BORDER_SOFT}`,
                      backgroundColor: INNER_SURFACE,
                    }}
                  >
                    <Heart className="h-6 w-6" />
                  </div>
                </div>

                <h2
                  className="mb-4 leading-[1.1]"
                  style={{
                    ...displayScript,
                    fontSize: "clamp(1.75rem, 7vw, 2.75rem)",
                    color: NAME_COLOR,
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    textShadow: NAME_SHADOW,
                  }}
                >
                  Response Sent Successfully
                </h2>

                <p className="mx-auto mb-8 max-w-md text-[13px] leading-[1.75] sm:text-[15px] sm:leading-[1.85]" style={{ ...bodySerif, color: TEXT, fontStyle: "italic" }}>
                  We have received your response. Your love, support, and well wishes mean the
                  world to us regardless. We look forward to celebrating other special milestones
                  with you in the future!
                </p>

                <Link href="/" className={secondaryBtnClass} style={secondaryBtnStyle}>
                  Return to Wedding Page
                </Link>
              </div>
              </ProposalCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
