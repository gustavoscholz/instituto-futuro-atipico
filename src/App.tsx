import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { WhiteLogoMark } from "./components/WhiteLogoMark";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Ear,
  Heart,
  HeartHandshake,
  Instagram,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Network,
  Phone,
  Plus,
  Quote,
  RefreshCcw,
  Route,
  Shield,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import "./styles.css";

type Section = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  tone: "dark" | "light";
};

const sections: Section[] = [
  {
    id: "inicio",
    eyebrow: "Instituto Futuro Atípico",
    title: "Futuro Atípico",
    copy: "Uma experiência digital leve, precisa e fiel ao design original.",
    tone: "dark",
  },
  {
    id: "propósito",
    eyebrow: "Propósito",
    title: "Cada seção entra com calma.",
    copy: "O scroll conduz a navegação entre telas completas, com transições sutis e foco no conteúdo.",
    tone: "light",
  },
  {
    id: "jornada",
    eyebrow: "Jornada",
    title: "Movimento suave, sem pressa.",
    copy: "A estrutura já está pronta para receber as composições exatas dos prints do Figma.",
    tone: "dark",
  },
  {
    id: "contato",
    eyebrow: "Contato",
    title: "Uma landing page completa.",
    copy: "React, TypeScript, Tailwind e Vite configurados para evoluir até a versão final.",
    tone: "light",
  },
  {
    id: "histórias",
    eyebrow: "Histórias atendidas",
    title: "Relatos que mostram cuidado, segurança e planejamento.",
    copy: "Exemplos reais de preocupação transformada em planejamento.",
    tone: "light",
  },
  {
    id: "conversa",
    eyebrow: "Converse com o IFA",
    title: "O futuro não precisa depender do improviso.",
    copy: "Uma conversa consultiva para entender a realidade da família.",
    tone: "dark",
  },
  {
    id: "quem-somos",
    eyebrow: "Quem somos",
    title: "O Instituto Futuro Atípico nasceu de uma pergunta simples.",
    copy: "Quem cuida do futuro de quem dedica a vida a cuidar?",
    tone: "light",
  },
  {
    id: "quem-construiu",
    eyebrow: "Quem construiu esse projeto",
    title: "Três trajetórias diferentes, um mesmo propósito.",
    copy: "O IFA reúne profissionais de áreas complementares.",
    tone: "light",
  },
  {
    id: "parceiro",
    eyebrow: "Seja um parceiro",
    title: "Faça parte da rede que apoia famílias atípicas com responsabilidade.",
    copy: "Amplie o acesso à informação, planejamento e proteção financeira familiar.",
    tone: "light",
  },
  {
    id: "explore",
    eyebrow: "Explore o IFA",
    title: "Continue sua jornada pelo Instituto.",
    copy: "Encontre parceiros e acompanhe os próximos eventos do IFA.",
    tone: "dark",
  },
  {
    id: "perguntas-frequentes",
    eyebrow: "Perguntas frequentes",
    title: "Dúvidas comuns antes de começar.",
    copy: "Respostas para entender melhor como o IFA trabalha.",
    tone: "dark",
  },
];

const mobileSectionTargets: Record<number, string> = {
  0: "mobile-proposito",
  1: "mobile-proposito",
  2: "mobile-jornada",
  3: "mobile-continuidade",
  4: "mobile-historias",
  5: "mobile-conversa-copy",
  6: "mobile-quem-somos-overview",
  7: "mobile-fundadores-photo",
  8: "mobile-parceiro-intro",
  9: "mobile-explore",
  10: "mobile-faq",
};

const asset = (name: string) => `/assets/${name}`;

const instagramUrl = "https://www.instagram.com/institutofuturoatipico/?hl=pt-br";
const phoneUrl = "tel:+5531989620329";
const whatsappUrl = (message: string) =>
  `https://wa.me/5531989620329?text=${encodeURIComponent(message)}`;

const whatsappLinks = {
  general: whatsappUrl(
    "Olá! Conheci o site do Instituto Futuro Atípico e gostaria de conversar com a equipe.",
  ),
  planning: whatsappUrl(
    "Olá! Gostaria de entender como o IFA pode ajudar no planejamento da minha família.",
  ),
  questions: whatsappUrl(
    "Olá! Visitei o site do Instituto Futuro Atípico e tenho algumas dúvidas. Podem me ajudar?",
  ),
  partnership: whatsappUrl(
    "Olá! Gostaria de ser parceiro(a) do Instituto Futuro Atípico e conhecer os próximos passos.",
  ),
};

type HeroTransitionDirection = "forward" | "reverse" | null;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroTransitionDirection, setHeroTransitionDirection] = useState<HeroTransitionDirection>(null);
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [conversationMobilePage, setConversationMobilePage] = useState<0 | 1>(0);
  const [whoMobilePage, setWhoMobilePage] = useState<0 | 1>(0);
  const [foundersMobilePage, setFoundersMobilePage] = useState<0 | 1>(0);
  const [partnerMobilePage, setPartnerMobilePage] = useState<0 | 1>(0);
  const [mobileIntroComplete, setMobileIntroComplete] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia("(max-width: 760px)").matches,
  );
  const isAnimating = useRef(false);
  const heroTransitionTimeoutRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; localScroll: HTMLElement | null } | null>(null);

  const activeSection = sections[activeIndex];
  const isHeroTransitioning = heroTransitionDirection !== null;
  const isMobileFreeFlow =
    isMobileViewport && mobileIntroComplete && activeIndex > 0 && !isHeroTransitioning;

  const scrollToMobileSection = (index: number, behavior: "auto" | "smooth" = "smooth") => {
    const targetId = mobileSectionTargets[Math.max(index, 1)];
    const target = targetId ? document.getElementById(targetId) : null;

    target?.scrollIntoView({ behavior, block: "start" });
  };

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeMenuWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeMenuWithEscape);
    return () => window.removeEventListener("keydown", closeMenuWithEscape);
  }, [menuOpen]);

  const goToSection = (index: number) => {
    const requestedIndex = Math.min(Math.max(index, 0), sections.length - 1);
    const nextIndex =
      isMobileViewport && !mobileIntroComplete && activeIndex === 0 && requestedIndex > 0
        ? 1
        : requestedIndex;

    if (isMobileFreeFlow) {
      setMenuOpen(false);
      scrollToMobileSection(nextIndex);
      return;
    }

    if (nextIndex === activeIndex || isAnimating.current || isHeroTransitioning) {
      return;
    }

    if (activeIndex === 0 && nextIndex === 1) {
      isAnimating.current = true;
      setMenuOpen(false);
      setIsHeroCtaVisible(false);
      heroTransitionTimeoutRef.current = window.setTimeout(() => {
        setHeroTransitionDirection("forward");
        heroTransitionTimeoutRef.current = null;
      }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 90 : 180);
      return;
    }

    if (activeIndex === 1 && nextIndex === 0) {
      isAnimating.current = true;
      setMenuOpen(false);
      setIsHeroCtaVisible(false);
      setHeroTransitionDirection("reverse");
      return;
    }

    isAnimating.current = true;
    setActiveIndex(nextIndex);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 950);
  };

  const showConversationMobilePage = (page: 0 | 1) => {
    if (page === conversationMobilePage || isAnimating.current || isHeroTransitioning) {
      return;
    }

    isAnimating.current = true;
    setMenuOpen(false);
    setConversationMobilePage(page);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 620);
  };

  const showWhoMobilePage = (page: 0 | 1) => {
    if (page === whoMobilePage || isAnimating.current || isHeroTransitioning) {
      return;
    }

    isAnimating.current = true;
    setMenuOpen(false);
    setWhoMobilePage(page);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 620);
  };

  const showFoundersMobilePage = (page: 0 | 1) => {
    if (page === foundersMobilePage || isAnimating.current || isHeroTransitioning) {
      return;
    }

    isAnimating.current = true;
    setMenuOpen(false);
    setFoundersMobilePage(page);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 620);
  };

  const showPartnerMobilePage = (page: 0 | 1) => {
    if (page === partnerMobilePage || isAnimating.current || isHeroTransitioning) {
      return;
    }

    isAnimating.current = true;
    setMenuOpen(false);
    setPartnerMobilePage(page);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 620);
  };

  const navigateByDirection = (direction: -1 | 1) => {
    if (isMobileFreeFlow) {
      return;
    }

    if (isMobileViewport) {
      if (activeIndex === 5 && direction === 1 && conversationMobilePage === 0) {
        showConversationMobilePage(1);
        return;
      }

      if (activeIndex === 5 && direction === -1 && conversationMobilePage === 1) {
        showConversationMobilePage(0);
        return;
      }

      if (activeIndex === 6 && direction === 1 && whoMobilePage === 0) {
        showWhoMobilePage(1);
        return;
      }

      if (activeIndex === 6 && direction === -1 && whoMobilePage === 1) {
        showWhoMobilePage(0);
        return;
      }

      if (activeIndex === 6 && direction === -1 && whoMobilePage === 0) {
        setConversationMobilePage(1);
        goToSection(5);
        return;
      }

      if (activeIndex === 7 && direction === 1 && foundersMobilePage === 0) {
        showFoundersMobilePage(1);
        return;
      }

      if (activeIndex === 7 && direction === -1 && foundersMobilePage === 1) {
        showFoundersMobilePage(0);
        return;
      }

      if (activeIndex === 7 && direction === -1 && foundersMobilePage === 0) {
        setWhoMobilePage(1);
        goToSection(6);
        return;
      }

      if (activeIndex === 8 && direction === 1 && partnerMobilePage === 0) {
        showPartnerMobilePage(1);
        return;
      }

      if (activeIndex === 8 && direction === -1 && partnerMobilePage === 1) {
        showPartnerMobilePage(0);
        return;
      }

      if (activeIndex === 8 && direction === -1 && partnerMobilePage === 0) {
        setFoundersMobilePage(1);
        goToSection(7);
        return;
      }

      if (activeIndex === 9 && direction === -1) {
        setPartnerMobilePage(1);
        goToSection(8);
        return;
      }

      if (activeIndex === 4 && direction === 1) {
        setConversationMobilePage(0);
      }

      if (activeIndex === 5 && direction === 1 && conversationMobilePage === 1) {
        setWhoMobilePage(0);
      }

      if (activeIndex === 6 && direction === 1 && whoMobilePage === 1) {
        setFoundersMobilePage(0);
      }

      if (activeIndex === 7 && direction === 1 && foundersMobilePage === 1) {
        setPartnerMobilePage(0);
      }
    }

    goToSection(activeIndex + direction);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);

      if (!event.matches) {
        setConversationMobilePage(0);
        setWhoMobilePage(0);
        setFoundersMobilePage(0);
        setPartnerMobilePage(0);
      }
    };

    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useLayoutEffect(() => {
    const allowNativeScroll = isMobileFreeFlow && !menuOpen;
    const overflow = allowNativeScroll ? "auto" : "hidden";

    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = overflow;
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = overflow;
    document.body.style.touchAction = allowNativeScroll ? "pan-y" : "none";

    if (isMobileFreeFlow) {
      document.body.classList.add("mobile-free-scroll");
    } else {
      document.body.classList.remove("mobile-free-scroll");
    }

    return () => {
      document.documentElement.style.overflowX = "";
      document.documentElement.style.overflowY = "";
      document.body.style.overflowX = "";
      document.body.style.overflowY = "";
      document.body.style.touchAction = "";
      document.body.classList.remove("mobile-free-scroll");
    };
  }, [isMobileFreeFlow, menuOpen]);

  useEffect(() => {
    if (isMobileViewport && activeIndex > 0 && !isHeroTransitioning) {
      setMobileIntroComplete(true);
    }
  }, [activeIndex, isHeroTransitioning, isMobileViewport]);

  useEffect(() => {
    if (isMobileFreeFlow) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const localScroll = event.target instanceof Element
        ? (event.target.closest("[data-local-scroll]") as HTMLElement | null)
        : null;

      if (localScroll) {
        const canScrollDown = event.deltaY > 0 && localScroll.scrollTop + localScroll.clientHeight < localScroll.scrollHeight - 1;
        const canScrollUp = event.deltaY < 0 && localScroll.scrollTop > 0;

        if (canScrollDown || canScrollUp) {
          return;
        }
      }

      event.preventDefault();

      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      navigateByDirection(event.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        navigateByDirection(1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        navigateByDirection(-1);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!isMobileViewport || menuOpen || event.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      touchStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        localScroll: target?.closest("[data-local-scroll]") as HTMLElement | null,
      };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchStart = touchStartRef.current;
      touchStartRef.current = null;

      if (!touchStart || !isMobileViewport || menuOpen || event.changedTouches.length !== 1) {
        return;
      }

      const deltaX = touchStart.x - event.changedTouches[0].clientX;
      const deltaY = touchStart.y - event.changedTouches[0].clientY;

      if (Math.abs(deltaY) < 48 || Math.abs(deltaY) <= Math.abs(deltaX)) {
        return;
      }

      const direction: -1 | 1 = deltaY > 0 ? 1 : -1;
      const localScroll = touchStart.localScroll;

      if (localScroll) {
        const canScrollDown = direction === 1
          && localScroll.scrollTop + localScroll.clientHeight < localScroll.scrollHeight - 1;
        const canScrollUp = direction === -1 && localScroll.scrollTop > 0;

        if (canScrollDown || canScrollUp) {
          return;
        }
      }

      navigateByDirection(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    activeIndex,
    conversationMobilePage,
    foundersMobilePage,
    heroTransitionDirection,
    isMobileFreeFlow,
    isMobileViewport,
    menuOpen,
    partnerMobilePage,
    whoMobilePage,
  ]);

  useEffect(() => () => {
    if (heroTransitionTimeoutRef.current !== null) {
      window.clearTimeout(heroTransitionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    [
      "LOGO IFA COLORIDA COMPLETA.png",
      "LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png",
    ].forEach((fileName) => {
      const image = new Image();
      image.src = asset(fileName);
    });
  }, []);

  useEffect(() => {
    if (activeIndex === 0 && !isHeroTransitioning) {
      setIsHeroCtaVisible(true);
    }
  }, [activeIndex, isHeroTransitioning]);

  const completeHeroTransition = (direction: Exclude<HeroTransitionDirection, null>) => {
    if (direction === "reverse") {
      setIsHeroCtaVisible(true);
    }

    setHeroTransitionDirection(null);

    if (direction === "forward" && isMobileViewport) {
      setMobileIntroComplete(true);
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    }

    window.setTimeout(() => {
      isAnimating.current = false;
    }, 280);
  };

  const isDarkInternalSection = activeIndex === 5 || activeIndex === 9 || activeIndex === 10;
  const showPersistentLogo = activeIndex > 0 && heroTransitionDirection === null;
  const persistentLogoSrc = asset(
    isMobileViewport
      ? "LOGO IFA COLORIDA COMPLETA.png"
      : isDarkInternalSection
      ? "LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png"
      : "LOGO IFA COLORIDA COMPLETA.png",
  );

  const navItems = useMemo(
    () =>
      sections.map((section, index) => (
        <button
          key={section.id}
          className={`nav-dot ${index === activeIndex ? "nav-dot-active" : ""}`}
          type="button"
          aria-label={`Ir para ${section.eyebrow}`}
          onClick={() => {
            setMenuOpen(false);
            if (index === 5) {
              setConversationMobilePage(0);
            }
            if (index === 6) {
              setWhoMobilePage(0);
            }
            if (index === 7) {
              setFoundersMobilePage(0);
            }
            if (index === 8) {
              setPartnerMobilePage(0);
            }
            goToSection(index);
          }}
        />
      )),
    [activeIndex, heroTransitionDirection, isMobileFreeFlow, isMobileViewport],
  );

  return (
    <main
      className={`site-shell ${activeSection.tone === "dark" ? "is-dark" : "is-light"} ${
        isMobileFreeFlow ? "site-shell-mobile-flow" : ""
      }`}
    >
      <header className="site-header" aria-label="Menu principal">
        <img
          className={`site-header-logo ${showPersistentLogo ? "site-header-logo-visible" : ""}`}
          src={persistentLogoSrc}
          alt="Instituto Futuro Atípico"
          aria-hidden={!showPersistentLogo}
        />
        <button
          className={`menu-button ${menuOpen ? "menu-button-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <AnimatePresence mode="wait">
        {isMobileFreeFlow ? (
          <MobileContinuousFlow
            key="mobile-continuous-flow"
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onGoToSection={goToSection}
          />
        ) : activeIndex === 0 ? (
          <div className="hero-flow" key="inicio-flow">
            <FirstSection
              areCtasVisible={isHeroCtaVisible}
              goToAbout={() => goToSection(1)}
              goToNext={() => goToSection(1)}
            />
          </div>
        ) : activeIndex === 1 ? (
          <SecondSection
            key="propósito"
            enterImmediately={heroTransitionDirection === "forward"}
            exitImmediately={heroTransitionDirection === "reverse"}
            goToPlanning={() => goToSection(3)}
            goToNext={() => goToSection(2)}
          />
        ) : activeIndex === 2 ? (
          <ThirdSection key="jornada" goToNext={() => goToSection(3)} />
        ) : activeIndex === 3 ? (
          <FourthSection key="continuidade" goToNext={() => goToSection(4)} />
        ) : activeIndex === 4 ? (
          <StoriesSection
            key="histórias"
            goToNext={() => {
              setConversationMobilePage(0);
              goToSection(5);
            }}
          />
        ) : activeIndex === 5 ? (
          <FifthSection
            key="conversa"
            isMobileViewport={isMobileViewport}
            mobilePage={conversationMobilePage}
            goToPlanning={() => goToSection(3)}
            goToNext={() => navigateByDirection(1)}
          />
        ) : activeIndex === 6 ? (
          <WhoWeAreSection
            key="quem-somos"
            isMobileViewport={isMobileViewport}
            mobilePage={whoMobilePage}
            goToNext={() => navigateByDirection(1)}
          />
        ) : activeIndex === 7 ? (
          <FoundersSection
            key="quem-construiu"
            isMobileViewport={isMobileViewport}
            mobilePage={foundersMobilePage}
            goToNext={() => navigateByDirection(1)}
          />
        ) : activeIndex === 8 ? (
          <PartnerSection
            key="parceiro"
            isMobileViewport={isMobileViewport}
            mobilePage={partnerMobilePage}
            goToNext={() => navigateByDirection(1)}
          />
        ) : activeIndex === 9 ? (
          <ExploreSection key="explore" goToNext={() => goToSection(10)} />
        ) : activeIndex === 10 ? (
          <FAQSection key="perguntas-frequentes" goToSection={goToSection} />
        ) : (
          <motion.section
            key={activeSection.id}
            className="section-panel"
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-eyebrow">{activeSection.eyebrow}</p>
            <h1>{activeSection.title}</h1>
            <p className="section-copy">{activeSection.copy}</p>
          </motion.section>
        )}
      </AnimatePresence>

      <HeroLogoController
        direction={heroTransitionDirection}
        isHeroActive={activeIndex === 0}
        onCovered={(direction) => setActiveIndex(direction === "forward" ? 1 : 0)}
        onComplete={completeHeroTransition}
      />

      <aside className="section-nav" aria-label="Navegação entre seções">
        {navItems}
      </aside>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              key="menu-backdrop"
              className="mobile-menu-backdrop"
              type="button"
              aria-label="Fechar menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              key="menu-panel"
              id="site-navigation-menu"
              className="mobile-menu"
              aria-label="Navegação principal"
              initial={{ opacity: 0, x: 18, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 14, scale: 0.99 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="mobile-menu-heading">
                <div>
                  <span className="mobile-menu-kicker">Navegação</span>
                  <h2>Explore o Instituto</h2>
                </div>
                <span className="mobile-menu-progress" aria-label={`Seção ${activeIndex + 1} de ${sections.length}`}>
                  {String(activeIndex + 1).padStart(2, "0")}
                  <small>/ {String(sections.length).padStart(2, "0")}</small>
                </span>
              </header>

              <div className="mobile-menu-list">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    className={`mobile-menu-item mobile-menu-accent-${index % 4} ${
                      index === activeIndex ? "mobile-menu-item-active" : ""
                    }`}
                    type="button"
                    aria-current={index === activeIndex ? "page" : undefined}
                    onClick={() => {
                      setMenuOpen(false);
                      if (index === 5) {
                        setConversationMobilePage(0);
                      }
                      if (index === 6) {
                        setWhoMobilePage(0);
                      }
                      if (index === 7) {
                        setFoundersMobilePage(0);
                      }
                      if (index === 8) {
                        setPartnerMobilePage(0);
                      }
                      goToSection(index);
                    }}
                  >
                    <span className="mobile-menu-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mobile-menu-label">{section.eyebrow}</span>
                    <ArrowRight className="mobile-menu-arrow" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <nav className="mobile-menu-shortcuts" aria-label="Acessos rápidos">
                <span className="mobile-menu-shortcuts-label">Acessos rápidos</span>
                <div className="mobile-menu-shortcuts-grid">
                  <Link
                    className="mobile-menu-shortcut mobile-menu-shortcut-events"
                    to="/eventos"
                    onClick={() => setMenuOpen(false)}
                  >
                    <CalendarDays aria-hidden="true" />
                    <span>Eventos</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link
                    className="mobile-menu-shortcut mobile-menu-shortcut-partners"
                    to="/parceiros"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Network aria-hidden="true" />
                    <span>Parceiros</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </nav>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}

function MobileFlowBlock({
  children,
  id,
  sectionIndex,
}: {
  children: React.ReactNode;
  id: string;
  sectionIndex: number;
}) {
  return (
    <div
      id={id}
      className="mobile-flow-block"
      data-mobile-section-index={sectionIndex}
    >
      {children}
    </div>
  );
}

function MobileThemeBand({
  children,
  theme,
  transitionsFrom,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  transitionsFrom?: "light" | "dark";
}) {
  const backgroundFile = theme === "light" ? "fundo pc.jpg.jpeg" : "fundo escuro.png";
  const corners = theme === "light"
    ? {
        topLeft: "vermelho.svg",
        topRight: "azul claro.svg",
        bottomLeft: "azul escuro.svg",
        bottomRight: "laranja.svg",
      }
    : {
        topLeft: "vermelho2.svg",
        topRight: "azul claro2.svg",
        bottomLeft: "azul escuro2.svg",
        bottomRight: "laranja2.svg",
      };

  return (
    <div
      className="mobile-theme-band"
      data-mobile-theme={theme}
      data-mobile-transition-from={transitionsFrom}
      style={{ backgroundImage: `url("${asset(backgroundFile)}")` }}
    >
      <div className="mobile-theme-band-corners mobile-theme-band-corners-top" aria-hidden="true">
        <img
          className="mobile-theme-band-corner mobile-theme-band-corner-left"
          src={asset(corners.topLeft)}
          alt=""
        />
        <img
          className="mobile-theme-band-corner mobile-theme-band-corner-right"
          src={asset(corners.topRight)}
          alt=""
        />
      </div>
      <div className="mobile-theme-band-corners mobile-theme-band-corners-bottom" aria-hidden="true">
        <img
          className="mobile-theme-band-corner mobile-theme-band-corner-left"
          src={asset(corners.bottomLeft)}
          alt=""
        />
        <img
          className="mobile-theme-band-corner mobile-theme-band-corner-right"
          src={asset(corners.bottomRight)}
          alt=""
        />
      </div>
      <div className="mobile-theme-band-content">{children}</div>
    </div>
  );
}

function MobileContinuousFlow({
  activeIndex,
  onActiveIndexChange,
  onGoToSection,
}: {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onGoToSection: (index: number) => void;
}) {
  const flowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const scrollToBlock = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const flow = flowRef.current;

    if (!flow) {
      return;
    }

    const blocks = Array.from(
      flow.querySelectorAll<HTMLElement>("[data-mobile-section-index]"),
    );
    const visibleBlocks = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleBlocks.set(entry.target, entry.intersectionRatio);
          } else {
            visibleBlocks.delete(entry.target);
          }
        });

        const current = [...visibleBlocks.entries()].sort((left, right) => {
          if (right[1] !== left[1]) {
            return right[1] - left[1];
          }

          const leftTop = (left[0] as HTMLElement).getBoundingClientRect().top;
          const rightTop = (right[0] as HTMLElement).getBoundingClientRect().top;
          return Math.abs(leftTop) - Math.abs(rightTop);
        })[0]?.[0] as HTMLElement | undefined;

        if (!current) {
          return;
        }

        const nextIndex = Number(current.dataset.mobileSectionIndex);
        if (Number.isFinite(nextIndex) && nextIndex !== activeIndex) {
          onActiveIndexChange(nextIndex);
        }
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      },
    );

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [activeIndex, onActiveIndexChange]);

  return (
    <motion.div
      ref={flowRef}
      className="mobile-continuous-flow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <MobileThemeBand theme="light">
        <MobileFlowBlock id="mobile-proposito" sectionIndex={1}>
          <SecondSection
            enterImmediately={false}
            exitImmediately={false}
            goToPlanning={() => scrollToBlock("mobile-continuidade")}
            goToNext={() => scrollToBlock("mobile-jornada")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-jornada" sectionIndex={2}>
          <ThirdSection goToNext={() => scrollToBlock("mobile-continuidade")} />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-continuidade" sectionIndex={3}>
          <FourthSection goToNext={() => scrollToBlock("mobile-historias")} />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-historias" sectionIndex={4}>
          <StoriesSection
            isSectionActive={activeIndex === 4}
            goToNext={() => scrollToBlock("mobile-conversa-copy")}
          />
        </MobileFlowBlock>
      </MobileThemeBand>

      <MobileThemeBand theme="dark" transitionsFrom="light">
        <MobileFlowBlock id="mobile-conversa-copy" sectionIndex={5}>
          <FifthSection
            isMobileViewport
            mobilePage={0}
            goToPlanning={() => scrollToBlock("mobile-continuidade")}
            goToNext={() => scrollToBlock("mobile-conversa-card")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-conversa-card" sectionIndex={5}>
          <FifthSection
            isMobileViewport
            mobilePage={1}
            goToPlanning={() => scrollToBlock("mobile-continuidade")}
            goToNext={() => scrollToBlock("mobile-quem-somos-overview")}
          />
        </MobileFlowBlock>
      </MobileThemeBand>

      <MobileThemeBand theme="light" transitionsFrom="dark">
        <MobileFlowBlock id="mobile-quem-somos-overview" sectionIndex={6}>
          <WhoWeAreSection
            isMobileViewport
            mobilePage={0}
            goToNext={() => scrollToBlock("mobile-quem-somos-details")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-quem-somos-details" sectionIndex={6}>
          <WhoWeAreSection
            isMobileViewport
            mobilePage={1}
            goToNext={() => scrollToBlock("mobile-fundadores-photo")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-fundadores-photo" sectionIndex={7}>
          <FoundersSection
            isMobileViewport
            mobilePage={0}
            goToNext={() => scrollToBlock("mobile-fundadores-cards")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-fundadores-cards" sectionIndex={7}>
          <FoundersSection
            isMobileViewport
            mobilePage={1}
            goToNext={() => scrollToBlock("mobile-parceiro-intro")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-parceiro-intro" sectionIndex={8}>
          <PartnerSection
            isMobileViewport
            mobilePage={0}
            goToNext={() => scrollToBlock("mobile-parceiro-cards")}
          />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-parceiro-cards" sectionIndex={8}>
          <PartnerSection
            isMobileViewport
            mobilePage={1}
            goToNext={() => scrollToBlock("mobile-explore")}
          />
        </MobileFlowBlock>
      </MobileThemeBand>

      <MobileThemeBand theme="dark" transitionsFrom="light">
        <MobileFlowBlock id="mobile-explore" sectionIndex={9}>
          <ExploreSection goToNext={() => scrollToBlock("mobile-faq")} />
        </MobileFlowBlock>

        <MobileFlowBlock id="mobile-faq" sectionIndex={10}>
          <FAQSection goToSection={onGoToSection} />
        </MobileFlowBlock>
      </MobileThemeBand>
    </motion.div>
  );
}

function FirstSection({
  areCtasVisible,
  goToAbout,
  goToNext,
}: {
  areCtasVisible: boolean;
  goToAbout: () => void;
  goToNext: () => void;
}) {
  return (
    <motion.section
      className="hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-stage">
        <h1 className="sr-only">Instituto Futuro Atípico: planejamento e proteção para famílias atípicas</h1>
        <picture>
          <source srcSet={asset("optimized/hero-background.avif")} type="image/avif" />
          <source srcSet={asset("optimized/hero-background.webp")} type="image/webp" />
          <img
            className="hero-background"
            src={asset("FUNDO.png")}
            alt=""
            width="1440"
            height="900"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div
          className={`hero-actions ${areCtasVisible ? "hero-actions-visible" : "hero-actions-hidden"}`}
          aria-label="Ações principais"
        >
          <button className="hero-button hero-button-primary" type="button" onClick={goToAbout}>
            Conheça o IFA
          </button>
          <a
            className="hero-button hero-button-outline"
            href={whatsappLinks.general}
            target="_blank"
            rel="noopener noreferrer"
          >
            fale com nossa equipe
          </a>
        </div>

        <button className="hero-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <ScrollIndicator tone="light" />
        </button>
      </div>
    </motion.section>
  );
}

function HeroLogoController({
  direction,
  isHeroActive,
  onCovered,
  onComplete,
}: {
  direction: HeroTransitionDirection;
  isHeroActive: boolean;
  onCovered: (direction: Exclude<HeroTransitionDirection, null>) => void;
  onComplete: (direction: Exclude<HeroTransitionDirection, null>) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const logoGroupRef = useRef<SVGGElement>(null);
  const whiteCoverRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onCovered, onComplete });

  useLayoutEffect(() => {
    callbacks.current = { onCovered, onComplete };
  }, [onCovered, onComplete]);

  useLayoutEffect(() => {
    if (direction !== null) {
      return;
    }

    const positionLogoAtRest = () => {
      if (!logoSvgRef.current || !logoGroupRef.current || !whiteCoverRef.current) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const logoWidth = viewportWidth <= 760
        ? Math.min(Math.max(viewportWidth * 0.44, 150), 210)
        : viewportWidth <= 1180
          ? Math.min(Math.max(viewportWidth * 0.28, 190), 260)
          : Math.min(Math.max(viewportWidth * 0.22, 260), 340);
      const startScale = logoWidth / 300;
      const translateX = (viewportWidth - 300 * startScale) / 2;
      const translateY = (viewportHeight - 240 * startScale) / 2;

      logoSvgRef.current.setAttribute("viewBox", `0 0 ${viewportWidth} ${viewportHeight}`);
      logoGroupRef.current.setAttribute(
        "transform",
        `translate(${translateX} ${translateY}) scale(${startScale})`,
      );
      gsap.set(logoSvgRef.current, {
        autoAlpha: isHeroActive ? 1 : 0,
      });
      gsap.set(logoGroupRef.current, { autoAlpha: 1 });
      gsap.set(whiteCoverRef.current, { autoAlpha: 0 });
    };

    positionLogoAtRest();
    window.addEventListener("resize", positionLogoAtRest);

    return () => {
      window.removeEventListener("resize", positionLogoAtRest);
    };
  }, [direction, isHeroActive]);

  useLayoutEffect(() => {
    if (direction === null) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => callbacks.current.onComplete(direction),
      });

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const fallbackLogoWidth = viewportWidth <= 760
        ? Math.min(Math.max(viewportWidth * 0.44, 150), 210)
        : viewportWidth <= 1180
          ? Math.min(Math.max(viewportWidth * 0.28, 190), 260)
          : Math.min(Math.max(viewportWidth * 0.22, 260), 340);
      const startScale = fallbackLogoWidth / 300;
      const finalScale = Math.max(viewportWidth * 11, viewportHeight * 5.5) / 300;
      const anchorX = 300 * 0.343;
      const anchorY = 240 * 0.625;
      const initialLeft = (viewportWidth - 300 * startScale) / 2;
      const initialTop = (viewportHeight - 240 * startScale) / 2;
      const screenAnchorX = initialLeft + anchorX * startScale;
      const screenAnchorY = initialTop + anchorY * startScale;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scaleState = {
        value: direction === "forward" ? startScale : finalScale,
      };

      const renderLogoScale = () => {
        if (!logoGroupRef.current) {
          return;
        }

        const translateX = screenAnchorX - anchorX * scaleState.value;
        const translateY = screenAnchorY - anchorY * scaleState.value;
        logoGroupRef.current.setAttribute(
          "transform",
          `translate(${translateX} ${translateY}) scale(${scaleState.value})`,
        );
      };

      logoSvgRef.current?.setAttribute("viewBox", `0 0 ${viewportWidth} ${viewportHeight}`);
      renderLogoScale();
      gsap.set(logoSvgRef.current, { autoAlpha: 1 });
      gsap.set(logoGroupRef.current, {
        autoAlpha: direction === "forward" ? 1 : 0,
      });
      gsap.set(whiteCoverRef.current, { autoAlpha: 0 });

      if (prefersReducedMotion) {
        if (direction === "forward") {
          timeline
            .set(whiteCoverRef.current, { autoAlpha: 1 })
            .set(logoGroupRef.current, { autoAlpha: 0 })
            .call(() => callbacks.current.onCovered(direction))
            .to(whiteCoverRef.current, {
              autoAlpha: 0,
              duration: 0.22,
              ease: "power2.out",
            }, 0.04);
        } else {
          timeline
            .to(whiteCoverRef.current, {
              autoAlpha: 1,
              duration: 0.12,
              ease: "power2.out",
            })
            .call(() => callbacks.current.onCovered(direction))
            .call(() => {
              scaleState.value = startScale;
              renderLogoScale();
            })
            .set(logoGroupRef.current, { autoAlpha: 1 })
            .set(whiteCoverRef.current, { autoAlpha: 0 }, 0.16);
        }

        return;
      }

      if (direction === "forward") {
        timeline
          .to(
            scaleState,
            {
              value: finalScale,
              duration: 1.28,
              ease: "power2.inOut",
              onUpdate: renderLogoScale,
            },
            0,
          )
          .set(whiteCoverRef.current, { autoAlpha: 1 }, 1.28)
          .set(logoGroupRef.current, { autoAlpha: 0 }, 1.28)
          .call(() => callbacks.current.onCovered(direction), [], 1.28)
          .to(
            whiteCoverRef.current,
            {
              autoAlpha: 0,
              duration: 0.26,
              ease: "power2.out",
            },
            1.35,
          );
      } else {
        timeline
          .to(
            whiteCoverRef.current,
            {
              autoAlpha: 1,
              duration: 0.22,
              ease: "power2.out",
            },
            0,
          )
          .call(() => callbacks.current.onCovered(direction), [], 0.22)
          .set(logoGroupRef.current, { autoAlpha: 1 }, 0.27)
          .set(whiteCoverRef.current, { autoAlpha: 0 }, 0.27)
          .to(
            scaleState,
            {
              value: startScale,
              duration: 1.28,
              ease: "power2.inOut",
              onUpdate: renderLogoScale,
            },
            0.27,
          );
      }
    }, stageRef);

    return () => ctx.revert();
  }, [direction]);

  const isVisible = isHeroActive || direction !== null;

  return (
    <section
      className={`hero-logo-controller ${isVisible ? "hero-logo-controller-visible" : ""}`}
    >
      <div className="transition-stage" ref={stageRef}>
        <WhiteLogoMark
          className="hero-logo-vector"
          groupRef={logoGroupRef}
          ref={logoSvgRef}
        />
        <div className="transition-white-cover" ref={whiteCoverRef} />
      </div>
    </section>
  );
}

function LightSectionBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`light-section-background ${className}`.trim()} aria-hidden="true">
      <img className="light-section-background-base" src={asset("optimized/light-background.webp")} alt="" width="1440" height="900" decoding="async" />
      <div className="light-section-background-corners">
        <img className="light-section-corner light-section-corner-red" src={asset("vermelho.svg")} alt="" />
        <img className="light-section-corner light-section-corner-teal" src={asset("azul claro.svg")} alt="" />
        <img className="light-section-corner light-section-corner-blue" src={asset("azul escuro.svg")} alt="" />
        <img className="light-section-corner light-section-corner-orange" src={asset("laranja.svg")} alt="" />
      </div>
    </div>
  );
}

function DarkSectionBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`dark-section-background ${className}`.trim()} aria-hidden="true">
      <img className="dark-section-background-base" src={asset("fundo escuro.png")} alt="" />
      <div className="dark-section-background-corners">
        <img className="dark-section-corner dark-section-corner-red" src={asset("vermelho2.svg")} alt="" />
        <img className="dark-section-corner dark-section-corner-teal" src={asset("azul claro2.svg")} alt="" />
        <img className="dark-section-corner dark-section-corner-blue" src={asset("azul escuro2.svg")} alt="" />
        <img className="dark-section-corner dark-section-corner-orange" src={asset("laranja2.svg")} alt="" />
      </div>
    </div>
  );
}

function ScrollIndicator({
  tone,
  className = "",
}: {
  tone: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={`scroll-indicator scroll-indicator-${tone} ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="scroll-indicator-dot" />
    </span>
  );
}

function SecondSection({
  enterImmediately = false,
  exitImmediately = false,
  goToPlanning,
  goToNext,
}: {
  enterImmediately?: boolean;
  exitImmediately?: boolean;
  goToPlanning: () => void;
  goToNext: () => void;
}) {
  return (
    <motion.section
      className="second-section"
      initial={enterImmediately ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: exitImmediately
          ? { duration: 0 }
          : { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="second-stage">
        <LightSectionBackground className="second-light-background" />
        <div className="second-main">
          <img className="family-photo" src={asset("optimized/family-photo.webp")} alt="Família sorrindo" width="1000" height="542" decoding="async" />

          <div className="second-content">
            <div className="second-copy-left">
              <h1>
                O <strong>futuro</strong> do seu <strong className="text-blue">filho</strong> não{" "}
                <span className="second-title-break">
                  pode depender do <strong className="text-red">acaso.</strong>
                </span>
              </h1>
              <div className="left-support">
                <div className="family-avatars" aria-hidden="true">
                  <img src={asset("optimized/family-thumb-1.webp")} alt="" width="256" height="256" loading="lazy" decoding="async" />
                  <img src={asset("optimized/family-thumb-2.webp")} alt="" width="256" height="256" loading="lazy" decoding="async" />
                  <img src={asset("optimized/family-thumb-3.webp")} alt="" width="256" height="256" loading="lazy" decoding="async" />
                  <img src={asset("optimized/family-thumb-4.webp")} alt="" width="256" height="256" loading="lazy" decoding="async" />
                </div>
                <p>Cada vez mais famílias estão escolhendo planejar o futuro com antecedência.</p>
              </div>
            </div>

            <div className="second-copy-right">
              <p>
                Por meio do <strong>Método de Continuidade IFA</strong>, ajudamos pais atípicos a
                planejar a continuidade do cuidado, organizando a{" "}
                <strong className="right-blue">proteção</strong>,{" "}
                <strong className="right-orange">previsibilidade</strong> e{" "}
                <strong className="right-teal">segurança.</strong>
              </p>
              <button type="button" onClick={goToPlanning}>Entender o planejamento</button>
            </div>
          </div>
        </div>

        <button className="second-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <ScrollIndicator tone="dark" className="second-scroll-indicator" />
        </button>
      </div>
    </motion.section>
  );
}

function ThirdSection({ goToNext }: { goToNext: () => void }) {
  const concerns = [
    {
      id: "rotina",
      title: "Rotina intensa",
      color: "#0D4C87",
      icon: Clock3,
      placement: "top",
      x: 8.36,
      y: 20.7,
      copy: "Consultas, terapias, escola e trabalho se acumulam em uma rotina que exige presença constante e quase nunca desacelera.",
    },
    {
      id: "sobrecarga",
      title: "Sobrecarga emocional",
      color: "#0D8F8F",
      icon: Brain,
      placement: "bottom",
      x: 31.04,
      y: 15,
      copy: "Cansaço, culpa e ansiedade frequentemente acompanham quem sente que não pode parar, mesmo diante dos desafios mais difíceis da jornada do cuidado.",
    },
    {
      id: "custos",
      title: "Custos contínuos",
      color: "#F78000",
      icon: BadgeDollarSign,
      placement: "top",
      x: 57.13,
      y: 76.68,
      copy: "Deslocamentos e acompanhamentos fazem parte de um cuidado contínuo que pressiona o orçamento mês após mês.",
    },
    {
      id: "medo",
      title: "Medo do inesperado",
      color: "#B53C3C",
      icon: TriangleAlert,
      placement: "bottom",
      x: 89.32,
      y: 78.54,
      copy: "Doença, invalidez ou até a morte podem causar a perda de renda da família, comprometendo sua estabilidade e a continuidade do cuidado.",
    },
  ] as const;

  return (
    <motion.section
      className="third-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="third-stage">
        <LightSectionBackground className="third-light-background" />

        <div className="third-heading-block">
          <h1>
            Existem <span className="orange">preocupações</span> que só
            {" "}
            <br />
            quem vive essa rotina <span className="teal">entende.</span>
          </h1>
          <p>
            Entre terapias, escola, trabalho e custos, a rotina de uma família{" "}
            <br />
            atípica exige presença o tempo todo. E no meio de tudo isso, uma
            {" "}
            <br />
            preocupação silenciosa costuma aparecer:{" "}
            <strong>
              se algo sair do
              {" "}
              <br />
              planejado, como o cuidado do meu filho continua?
            </strong>
          </p>
        </div>

        <div className="timeline-area" aria-label="Preocupações frequentes">
          <div className="timeline-track">
            <img className="timeline-road" src={asset("estrada.svg")} alt="" aria-hidden="true" />

            {concerns.map((concern, order) => (
              <TimelineCard key={concern.id} {...concern} order={order}>
                {concern.copy}
              </TimelineCard>
            ))}
          </div>
        </div>

        <button className="third-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <ScrollIndicator tone="dark" />
        </button>
      </div>
    </motion.section>
  );
}

function TimelineCard({
  children,
  id,
  icon: Icon,
  color,
  placement,
  order,
  title,
  x,
  y,
}: {
  children: string;
  id: string;
  icon: typeof Clock3;
  color: string;
  placement: "top" | "bottom";
  order: number;
  title: string;
  x: number;
  y: number;
}) {
  return (
    <div
      className={`timeline-item timeline-item-${placement} timeline-item-${id}`}
      style={
        {
          "--timeline-accent": color,
          "--timeline-x": `${x}%`,
          "--timeline-y": `${y}%`,
          "--timeline-order": order,
          "--timeline-delay": `${220 + order * 230}ms`,
        } as React.CSSProperties
      }
    >
      <article
        className={`timeline-card timeline-card-${placement}`}
        style={{ "--timeline-accent": color } as React.CSSProperties}
      >
        <h2>{title}</h2>
        <p>{children}</p>
      </article>
      <div
        className={`timeline-connector timeline-connector-${placement}`}
        style={{ "--timeline-accent": color } as React.CSSProperties}
      />
      <div
        className="timeline-marker"
        style={{ "--timeline-accent": color } as React.CSSProperties}
        aria-hidden="true"
      >
        <Icon />
      </div>
    </div>
  );
}

function FourthSection({ goToNext }: { goToNext: () => void }) {
  const puzzleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const puzzle = puzzleRef.current;

    if (!puzzle) {
      return;
    }

    const center = puzzle.querySelector<HTMLElement>(".method-center-piece");
    const orange = puzzle.querySelector<HTMLElement>(".method-piece-orange");
    const red = puzzle.querySelector<HTMLElement>(".method-piece-red");
    const teal = puzzle.querySelector<HTMLElement>(".method-piece-teal");
    const blue = puzzle.querySelector<HTMLElement>(".method-piece-blue");
    const orangeJoint = puzzle.querySelector<HTMLElement>(".method-joint-orange");
    const blueJoint = puzzle.querySelector<HTMLElement>(".method-joint-blue");

    if (!center || !orange || !red || !teal || !blue || !orangeJoint || !blueJoint) {
      return;
    }

    const ctx = gsap.context(() => {
      const pieces = [orange, red, teal, blue];
      const joints = [orangeJoint, blueJoint];
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([center, ...pieces, ...joints], {
          clearProps: "transform,opacity,visibility",
        });
        return;
      }

      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const isTablet = window.matchMedia("(min-width: 761px) and (max-width: 1180px)").matches;
      const offset = isTablet ? 22 : 34;
      const entrances: Array<{ target: HTMLElement; x?: number; y?: number }> = isMobile
        ? [
            { target: orange, y: -22 },
            { target: red, y: 22 },
            { target: teal, y: -22 },
            { target: blue, y: 22 },
          ]
        : [
            { target: orange, x: -offset },
            { target: red, x: -offset },
            { target: teal, x: offset },
            { target: blue, x: offset },
          ];

      gsap.set(center, { autoAlpha: 0, scale: 0.94, transformOrigin: "center center" });
      gsap.set(joints, { autoAlpha: 0, scale: 0.72, transformOrigin: "center center" });
      entrances.forEach(({ target, x = 0, y = 0 }) => {
        gsap.set(target, {
          autoAlpha: 0,
          x,
          y,
          scale: 0.97,
          transformOrigin: "center center",
        });
      });

      const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

      timeline.to(center, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.38,
        ease: "power3.out",
      });

      entrances.forEach(({ target }, index) => {
        const startAt = 0.26 + index * 0.27;

        timeline.to(target, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.26,
          ease: "power3.out",
        }, startAt);
      });

      timeline.to(orangeJoint, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.18,
        ease: "power3.out",
      }, 0.38);

      timeline.to(blueJoint, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.18,
        ease: "power3.out",
      }, 1.19);
    }, puzzle);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      className="fourth-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fourth-stage">
        <LightSectionBackground className="fourth-light-background" />

        <div className="method-kicker">COMO FUNCIONA</div>

        <h1 className="method-title">
          o Método de <strong className="method-continuity">Continuidade</strong>{" "}
          <strong className="method-ifa">
            <span>I</span>
            <span>F</span>
            <span>A</span>
          </strong>
        </h1>

        <p className="method-intro">
          Uma metodologia estruturada para <strong>compreender</strong> a realidade da
          <br />
          <strong>sua família</strong>, organizar prioridades e construir um planejamento
          <br />
          personalizado para a continuidade do <strong>cuidado.</strong>
        </p>

        <p className="method-statement">
          Cada <strong className="teal">família</strong> possui uma história{" "}
          <strong className="orange">única.</strong> Por isso, nosso método{" "}
          <strong className="blue">respeita</strong>
          <br />
          sua realidade e conduz o planejamento em etapas claras e personalizadas.
        </p>

        <div ref={puzzleRef} className="method-puzzle" aria-label="Etapas do Método de Continuidade IFA">
          <div className="method-side method-side-left">
            <MethodPuzzlePiece
              className="method-piece-orange"
              icon={ClipboardList}
              title="01 Diagnóstico familiar"
              copy="Entendimento da rotina, família, terapias, rede de apoio e necessidades do filho."
            />
            <MethodPuzzlePiece
              className="method-piece-red"
              icon={Route}
              title="02 Plano de continuidade"
              copy="Organização dos cenários para que cuidado e qualidade de vida não dependam do improviso."
            />
          </div>

          <div className="method-center-piece">
            <div className="method-center-icon">
              <UsersRound />
            </div>
            <strong>CONTINUIDADE DO CUIDADO</strong>
            <p>Um plano para manter o cuidado conectado ao futuro.</p>
          </div>

          <span className="method-joint method-joint-orange" aria-hidden="true" />
          <span className="method-joint method-joint-blue" aria-hidden="true" />

          <div className="method-side method-side-right">
            <MethodPuzzlePiece
              className="method-piece-teal"
              icon={ShieldCheck}
              title="03 Proteção sob medida"
              copy="Solução personalizada para proteger a família em situações de invalidez, doença grave, perda de renda ou ausência."
            />
            <MethodPuzzlePiece
              className="method-piece-blue"
              icon={RefreshCcw}
              title="04 Acompanhamento"
              copy="Revisão periódica conforme a vida da família evolui."
            />
          </div>
        </div>

        <button className="fourth-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <ScrollIndicator tone="dark" />
        </button>
      </div>
    </motion.section>
  );
}

function MethodPuzzlePiece({
  className,
  copy,
  icon: Icon,
  title,
}: {
  className: string;
  copy: string;
  icon: typeof ClipboardList;
  title: string;
}) {
  return (
    <article className={`method-piece ${className}`}>
      <div className="method-piece-icon">
        <Icon />
      </div>
      <h2>{title}</h2>
      <p>{copy}</p>
    </article>
  );
}

type Feedback = {
  accent: string;
  role: string;
  subtitle: string;
  quote: string;
  description: string;
  chips: string[];
};

const feedbacks: Feedback[] = [
  {
    accent: "#f78000",
    role: "Mãe divorciada",
    subtitle: "filho com deficiência intelectual",
    quote:
      "Eu precisava ter a tranquilidade de saber que meu filho seguiria assistido, mesmo na minha ausência ou em caso de invalidez.",
    description:
      "Criamos um plano para manter terapias, suporte e segurança financeira para a família.",
    chips: ["Terapias", "Suporte ao filho", "Segurança familiar"],
  },
  {
    accent: "#0d8f8f",
    role: "Pai provedor",
    subtitle: "filha com síndrome de Down",
    quote:
      "Eu queria previsibilidade para que minha família continuasse amparada se algo acontecesse comigo.",
    description:
      "O plano organizou proteção de renda e a continuidade do cuidado da família.",
    chips: ["Continuidade do cuidado", "Previsibilidade financeira", "Proteção em vida"],
  },
  {
    accent: "#b53c3c",
    role: "Mãe solo",
    subtitle: "filho autista",
    quote:
      "Eu precisava organizar as terapias e a rotina sem deixar o futuro do meu filho depender só de mim.",
    description:
      "Estruturamos uma reserva para terapias e um plano de apoio para cada fase da família.",
    chips: ["Terapias", "Rotina organizada", "Reserva familiar"],
  },
  {
    accent: "#0d4c87",
    role: "Casal cuidador",
    subtitle: "filha com paralisia cerebral",
    quote:
      "Nossa preocupação era manter o cuidado da nossa filha mesmo diante de uma mudança na renda.",
    description:
      "O IFA conectou proteção de renda, organização patrimonial e o plano de cuidados.",
    chips: ["Proteção de renda", "Planejamento familiar", "Cuidado contínuo"],
  },
  {
    accent: "#f78000",
    role: "Responsável por adolescente",
    subtitle: "filho com condição crônica",
    quote:
      "Eu queria preparar a autonomia do meu filho sem perder a segurança que ele ainda precisa.",
    description:
      "Construímos uma transição gradual, com previsibilidade para o cuidado e para o futuro.",
    chips: ["Autonomia gradual", "Previsibilidade", "Segurança"],
  },
];

function StoriesSection({
  goToNext,
  isSectionActive = true,
}: {
  goToNext: () => void;
  isSectionActive?: boolean;
}) {
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());
  const nextFeedback = (activeFeedback + 1) % feedbacks.length;

  const goToFeedback = (direction: 1 | -1) => {
    setActiveFeedback((current) => (current + direction + feedbacks.length) % feedbacks.length);
  };

  useEffect(() => {
    if (
      !isSectionActive ||
      isCarouselPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveFeedback((current) => (current + 1) % feedbacks.length);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeFeedback, isCarouselPaused, isSectionActive]);

  return (
    <motion.section
      className="stories-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stories-stage">
        <LightSectionBackground className="stories-light-background" />

        <motion.div
          className="stories-heading"
          custom={{ delay: 0.08, reducedMotion, y: 18 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          <p>HISTÓRIAS ATENDIDAS</p>
          <h1>
            Relatos que mostram <span className="red">cuidado</span>,
            <br />{" "}
            <span className="orange">segurança</span> e <span className="blue">planejamento.</span>
          </h1>
          <p className="stories-copy">
            Cada família chega com uma realidade diferente, mas quase
            <br />{" "}
            sempre com a mesma preocupação: <strong>como proteger o futuro de</strong>
            <br />{" "}
            <strong>quem mais depende dela.</strong> Aqui estão alguns exemplos de como o
            <br />{" "}
            <strong>IFA</strong> transformou essa preocupação em planejamento.
          </p>
        </motion.div>

        <motion.div
          className="feedback-carousel-shell"
          custom={{ delay: 0.48, reducedMotion, y: 22 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="feedback-carousel-track"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onPointerDown={() => setIsCarouselPaused(true)}
            onPointerUp={() => setIsCarouselPaused(false)}
            onPointerCancel={() => setIsCarouselPaused(false)}
            onPointerLeave={() => setIsCarouselPaused(false)}
            onDragEnd={(_, info) => {
              setIsCarouselPaused(false);
              if (info.offset.x < -70) {
                goToFeedback(1);
              }
              if (info.offset.x > 70) {
                goToFeedback(-1);
              }
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <FeedbackCard key={`main-${activeFeedback}`} feedback={feedbacks[activeFeedback]} variant="main" />
              <FeedbackCard key={`preview-${nextFeedback}`} feedback={feedbacks[nextFeedback]} variant="preview" />
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          className="feedback-dots"
          aria-label="Feedback ativo"
          custom={{ delay: 0.76, reducedMotion, y: 10 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          {feedbacks.map((feedback, index) => (
            <button
              key={feedback.role}
              type="button"
              className={index === activeFeedback ? "active" : ""}
              aria-label={`Ir para feedback ${index + 1}`}
              onClick={() => {
                setActiveFeedback(index);
                setIsCarouselPaused(false);
              }}
            />
          ))}
        </motion.div>

        <motion.button
          className="stories-mouse"
          type="button"
          aria-label="Próxima seção"
          onClick={goToNext}
          custom={{ delay: 0.94, reducedMotion, y: 8 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          <ScrollIndicator tone="dark" />
        </motion.button>
      </div>
    </motion.section>
  );
}

function FeedbackCard({ feedback, variant }: { feedback: Feedback; variant: "main" | "preview" }) {
  return (
    <motion.article
      className={`feedback-card feedback-card-${variant}`}
      style={{ "--feedback-accent": feedback.accent } as React.CSSProperties}
      initial={{ opacity: 0, x: variant === "main" ? -16 : 16, scale: variant === "main" ? 0.99 : 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: variant === "main" ? -16 : 16, scale: 0.985 }}
      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
    >
      <header>
        <div className="feedback-icon">
          <UsersRound />
        </div>
        <div className="feedback-person">
          <strong>{feedback.role}</strong>
          <span>{feedback.subtitle}</span>
        </div>
        <span className="feedback-tag">História atendida</span>
      </header>

      <div className="feedback-quote">
        <Quote />
        <p>{feedback.quote}</p>
      </div>

      <p className="feedback-description">{feedback.description}</p>

      <footer>
        {feedback.chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </footer>
    </motion.article>
  );
}

function ConversationCopy({ goToPlanning }: { goToPlanning: () => void }) {
  return (
    <div className="conversation-copy">
      <p className="conversation-kicker">CONVERSE COM O IFA</p>
      <h1>
        O <span className="orange">futuro</span> do seu{" "}
        <span className="conversation-title-keep">
          filho <span className="red">não</span>
        </span>
        <br />{" "}
        precisa depender do
        <br />{" "}
        <span className="blue">improviso.</span>
      </h1>
      <p className="conversation-text">
        Em uma conversa consultiva, o <strong>IFA</strong> entende a
        <br />{" "}
        realidade de sua família e ajuda <strong>você</strong> a enxergar
        <br />{" "}
        caminhos possíveis para proteger o cuidado, a rotina
        <br />{" "}
        e a segurança de quem mais depende de <strong>você.</strong>
      </p>

      <a
        className="conversation-button conversation-button-primary"
        href={whatsappLinks.planning}
        target="_blank"
        rel="noopener noreferrer"
      >
        Fale agora com o IFA
      </a>
      <button
        className="conversation-button conversation-button-outline"
        type="button"
        onClick={goToPlanning}
      >
        Entender melhor como funciona
      </button>
    </div>
  );
}

function ConversationCard() {
  return (
    <article className="conversation-card" aria-labelledby="conversation-card-title">
      <header className="conversation-card-header">
        <span className="conversation-card-heading-icon" aria-hidden="true">
          <MessageCircle />
        </span>
        <h2 id="conversation-card-title">O que acontece na conversa?</h2>
      </header>

      <ol className="conversation-steps">
        <li>
          <span className="conversation-step-number">1</span>
          <UsersRound className="conversation-step-icon" aria-hidden="true" />
          <p>Entendimento da sua rotina familiar</p>
        </li>
        <li>
          <span className="conversation-step-number">2</span>
          <ClipboardCheck className="conversation-step-icon" aria-hidden="true" />
          <p>Mapeamento dos riscos e preocupações</p>
        </li>
        <li>
          <span className="conversation-step-number">3</span>
          <span className="conversation-step-icon conversation-shield-heart" aria-hidden="true">
            <Shield />
            <Heart />
          </span>
          <p>Primeira visão sobre caminhos de proteção</p>
        </li>
      </ol>

      <footer className="conversation-card-footer">
        <span className="conversation-card-dot" aria-hidden="true" />
        <p>
          Você não precisa chegar com tudo pronto.
          <br />{" "}
          O papel do IFA é ajudar sua família a organizar
          <br />{" "}
          o que hoje parece difícil de enxergar.
        </p>
      </footer>
    </article>
  );
}

function ConversationMobileActions({ goToPlanning }: { goToPlanning: () => void }) {
  return (
    <div className="conversation-mobile-card-actions">
      <a
        className="conversation-button conversation-button-primary"
        href={whatsappLinks.planning}
        target="_blank"
        rel="noopener noreferrer"
      >
        Fale agora com o IFA
      </a>
      <button
        className="conversation-button conversation-button-outline"
        type="button"
        onClick={goToPlanning}
      >
        Entender melhor como funciona
      </button>
    </div>
  );
}

function FifthSection({
  goToPlanning,
  goToNext,
  isMobileViewport,
  mobilePage,
}: {
  goToPlanning: () => void;
  goToNext: () => void;
  isMobileViewport: boolean;
  mobilePage: 0 | 1;
}) {
  return (
    <motion.section
      className="fifth-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fifth-stage">
        <img className="fifth-background" src={asset("fundo escuro.png")} alt="" />
        <div className="fifth-corners" aria-hidden="true">
          <img className="fifth-corner fifth-corner-red" src={asset("vermelho2.svg")} alt="" />
          <img className="fifth-corner fifth-corner-teal" src={asset("azul claro2.svg")} alt="" />
          <img className="fifth-corner fifth-corner-blue" src={asset("azul escuro2.svg")} alt="" />
          <img className="fifth-corner fifth-corner-orange" src={asset("laranja2.svg")} alt="" />
        </div>

        {isMobileViewport ? (
          <AnimatePresence mode="wait" initial={false}>
            {mobilePage === 0 ? (
              <motion.div
                key="conversation-mobile-copy"
                className="conversation-mobile-page conversation-mobile-copy-page"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ConversationCopy goToPlanning={goToPlanning} />
                <button
                  className="fifth-mouse"
                  type="button"
                  aria-label="Próxima seção"
                  onClick={goToNext}
                >
                  <ScrollIndicator tone="light" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="conversation-mobile-card"
                className="conversation-mobile-page conversation-mobile-card-page"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ConversationCard />
                <ConversationMobileActions goToPlanning={goToPlanning} />
                <button
                  className="fifth-mouse"
                  type="button"
                  aria-label="Próxima seção"
                  onClick={goToNext}
                >
                  <ScrollIndicator tone="light" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <>
            <div className="conversation-layout">
              <ConversationCopy goToPlanning={goToPlanning} />
              <ConversationCard />
            </div>
            <button className="fifth-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
              <ScrollIndicator tone="light" />
            </button>
          </>
        )}
      </div>
    </motion.section>
  );
}

const whoCards = [
  {
    accent: "#0D8F8F",
    icon: Ear,
    title: "Nasceu da escuta",
    copy:
      "Depois de inúmeras conversas com famílias atípicas, entendemos que cada história é única, mas muitas preocupações se repetem.",
  },
  {
    accent: "#0D4C87",
    icon: HeartHandshake,
    title: "Continuidade do cuidado",
    copy: "O IFA existe para ajudar famílias a protegerem terapias, tratamentos, rotina e qualidade de vida dos filhos.",
  },
  {
    accent: "#F78000",
    icon: Lightbulb,
    title: "Mais que informação",
    copy: "Famílias atípicas não precisam apenas de dados financeiros. Precisam de orientação, clareza e um plano possível.",
  },
  {
    accent: "#B53C3C",
    icon: ShieldCheck,
    title: "Uma rede de proteção",
    copy: "Reunimos planejamento financeiro, conhecimento técnico e profissionais comprometidos com a segurança das famílias.",
  },
];

const whoChips = [
  { accent: "#0D8F8F", icon: UsersRound, label: "Acolhimento" },
  { accent: "#0D4C87", icon: CalendarDays, label: "Planejamento" },
  { accent: "#F78000", icon: RefreshCcw, label: "Continuidade" },
  { accent: "#B53C3C", icon: Network, label: "Rede de confiança" },
];

type GuidedRevealCustom = {
  delay: number;
  reducedMotion: boolean;
  x?: number;
  y?: number;
};

const guidedRevealVariants: Variants = {
  hidden: ({ reducedMotion, x = 0, y = 0 }: GuidedRevealCustom) => ({
    opacity: 0,
    x: reducedMotion ? 0 : x,
    y: reducedMotion ? 0 : y,
  }),
  visible: ({ delay, reducedMotion }: GuidedRevealCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: reducedMotion ? 0 : delay,
      duration: reducedMotion ? 0.14 : 0.46,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function WhoHeading({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="who-heading"
      custom={{ delay, reducedMotion, y: 18 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <p>QUEM SOMOS</p>
      <h1>
        O Instituto <span className="orange">Futuro</span>{" "}
        <span className="teal">Atípico</span> nasceu
        <br />
        de uma pergunta simples.
      </h1>
      <h2>Quem cuida do futuro de quem dedica a vida a cuidar?</h2>
      <p className="who-intro">
        O IFA nasceu da escuta de pais e mães de crianças atípicas e da
        <br />
        necessidade de transformar uma preocupação silenciosa em planejamento concreto.
      </p>
    </motion.div>
  );
}

function WhoLeftCards({
  reducedMotion,
  startDelay,
}: {
  reducedMotion: boolean;
  startDelay: number;
}) {
  return (
    <div className="who-left-cards">
      {whoCards.map((card, index) => (
        <InfoCard
          key={card.title}
          {...card}
          reveal={{
            delay: startDelay + index * 0.12,
            reducedMotion,
            x: -22,
          }}
        />
      ))}
    </div>
  );
}

function WhoRightBlock({
  reducedMotion,
  startDelay,
}: {
  reducedMotion: boolean;
  startDelay: number;
}) {
  return (
    <div className="who-right-block">
      <motion.h2
        custom={{ delay: startDelay, reducedMotion, x: 18 } satisfies GuidedRevealCustom}
        variants={guidedRevealVariants}
        initial="hidden"
        animate="visible"
      >
        Uma iniciativa criada para transformar preocupação em <span>planejamento.</span>
      </motion.h2>
      <motion.p
        custom={{ delay: startDelay + 0.16, reducedMotion, x: 18 } satisfies GuidedRevealCustom}
        variants={guidedRevealVariants}
        initial="hidden"
        animate="visible"
      >
        O Instituto Futuro Atípico não nasceu como uma seguradora, uma clínica ou uma
        consultoria tradicional. Nasceu como uma iniciativa para reunir conhecimento,
        planejamento financeiro e uma rede de profissionais preparados para apoiar famílias que
        vivem a realidade atípica todos os dias. Nosso propósito é ajudar pais e mães a organizarem
        o futuro com mais clareza, segurança e acolhimento.
      </motion.p>

      <motion.div
        className="who-feature-card"
        custom={{ delay: startDelay + 0.32, reducedMotion, x: 18 } satisfies GuidedRevealCustom}
        variants={guidedRevealVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <ShieldCheck />
        </div>
        <p>
          <strong>Não somos uma seguradora.</strong>
          <br />
          <strong>Não somos uma clínica.</strong>
          <br />
          <span>Somos uma rede de planejamento, proteção e confiança.</span>
        </p>
      </motion.div>

      <div className="who-chip-row">
        {whoChips.map((chip, index) => {
          const Icon = chip.icon;
          return (
            <motion.div
              className="who-mini-card"
              key={chip.label}
              style={{ "--who-accent": chip.accent } as React.CSSProperties}
              custom={{
                delay: startDelay + 0.52 + index * 0.1,
                reducedMotion,
                x: 18,
              } satisfies GuidedRevealCustom}
              variants={guidedRevealVariants}
              initial="hidden"
              animate="visible"
            >
              <Icon />
              <span>{chip.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function WhoScrollButton({
  delay,
  goToNext,
  reducedMotion,
}: {
  delay: number;
  goToNext: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      className="who-mouse"
      type="button"
      aria-label="Próxima seção"
      onClick={goToNext}
      custom={{ delay, reducedMotion, y: 12 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <ScrollIndicator tone="dark" />
    </motion.button>
  );
}

function WhoWeAreSection({
  goToNext,
  isMobileViewport,
  mobilePage,
}: {
  goToNext: () => void;
  isMobileViewport: boolean;
  mobilePage: 0 | 1;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.section
      className="who-section"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="who-stage" data-local-scroll>
        <LightSectionBackground className="who-light-background" />

        {isMobileViewport ? (
          <AnimatePresence mode="wait" initial={false}>
            {mobilePage === 0 ? (
              <motion.div
                key="who-mobile-overview"
                className="who-mobile-page who-mobile-overview-page"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <WhoHeading delay={0.08} reducedMotion={reducedMotion} />
                <WhoLeftCards startDelay={0.54} reducedMotion={reducedMotion} />
                <WhoScrollButton delay={1.46} goToNext={goToNext} reducedMotion={reducedMotion} />
              </motion.div>
            ) : (
              <motion.div
                key="who-mobile-details"
                className="who-mobile-page who-mobile-detail-page"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <WhoRightBlock startDelay={0.08} reducedMotion={reducedMotion} />
                <WhoScrollButton delay={1.38} goToNext={goToNext} reducedMotion={reducedMotion} />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <>
            <WhoHeading delay={0.1} reducedMotion={reducedMotion} />
            <div className="who-columns">
              <WhoLeftCards startDelay={0.58} reducedMotion={reducedMotion} />
              <WhoRightBlock startDelay={1.38} reducedMotion={reducedMotion} />
            </div>
            <WhoScrollButton delay={2.55} goToNext={goToNext} reducedMotion={reducedMotion} />
          </>
        )}
      </div>
    </motion.section>
  );
}

function InfoCard({
  accent,
  copy,
  icon: Icon,
  reveal,
  title,
}: {
  accent: string;
  copy: string;
  icon: typeof Ear;
  reveal: GuidedRevealCustom;
  title: string;
}) {
  return (
    <motion.article
      className="who-info-card"
      style={{ "--who-accent": accent } as React.CSSProperties}
      custom={reveal}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="who-info-icon">
        <Icon />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </motion.article>
  );
}

const founderCards = [
  {
    accent: "#F78000",
    icon: BriefcaseBusiness,
    name: "Lucas Boanerges de Castro",
    role: "Fundador | Empresário | Consultor Financeiro",
    copy:
      "Ao atender pais e mães de crianças atípicas, Lucas percebeu que a maior preocupação dessas famílias não era apenas financeira: era garantir que o cuidado pudesse continuar.",
  },
  {
    accent: "#0D8F8F",
    icon: Stethoscope,
    name: "Dr. Rodrigo Cunha Braga",
    role: "Sócio | Médico Psiquiatra",
    copy:
      "Com experiência no atendimento de pacientes e famílias atípicas, Rodrigo traz ao IFA um olhar clínico e humano sobre os desafios dessa jornada.",
  },
  {
    accent: "#0D4C87",
    icon: BookOpen,
    name: "Rafael Bretas",
    role: "Sócio | Empresário da Educação",
    copy:
      "Com vivência na gestão educacional e no acolhimento de crianças atípicas, Rafael contribui com uma visão prática sobre inclusão e rotina escolar.",
  },
];

function FoundersHeading({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="founders-heading"
      custom={{ delay, reducedMotion, y: 18 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <p>QUEM CONSTRUIU ESSE PROJETO</p>
      <h1>
        Três trajetórias diferentes,
        <br />
        um <span className="orange">mesmo</span> <span className="teal">propósito.</span>
      </h1>
      <p className="founders-copy">
        O IFA reúne profissionais de áreas complementares para ajudar
        <br />
        famílias atípicas a protegerem aquilo que têm de mais importante:
        <br />a continuidade do cuidado.
      </p>
    </motion.div>
  );
}

function FoundersPhoto({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.figure
      className="founders-photo"
      custom={{ delay, reducedMotion, x: -22 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <img src={asset("optimized/founders.webp")} alt="Equipe fundadora do IFA" width="1280" height="854" loading="lazy" decoding="async" />
      <figcaption>Equipe fundadora do IFA</figcaption>
    </motion.figure>
  );
}

function FoundersCards({
  reducedMotion,
  startDelay,
}: {
  reducedMotion: boolean;
  startDelay: number;
}) {
  return (
    <div className="founders-card-list">
      {founderCards.map((card, index) => (
        <FounderCard
          key={card.name}
          {...card}
          reveal={{
            delay: startDelay + index * 0.13,
            reducedMotion,
            x: 18,
          }}
        />
      ))}
    </div>
  );
}

function FoundersFooterCard({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="founders-footer-card"
      custom={{ delay, reducedMotion, y: 16 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <UsersRound />
      <p>
        O que nos une é a certeza de que <strong className="teal">famílias atípicas</strong> precisam de{" "}
        <strong className="orange">plano</strong>, <strong className="teal">orientação</strong> e{" "}
        <span className="founders-footer-nowrap">
          uma <strong className="orange">rede de confiança.</strong>
        </span>
      </p>
    </motion.div>
  );
}

function FoundersScrollButton({
  delay,
  goToNext,
  reducedMotion,
}: {
  delay: number;
  goToNext: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      className="founders-mouse"
      type="button"
      aria-label="Próxima seção"
      onClick={goToNext}
      custom={{ delay, reducedMotion, y: 12 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <ScrollIndicator tone="dark" />
    </motion.button>
  );
}

function FoundersSection({
  goToNext,
  isMobileViewport,
  mobilePage,
}: {
  goToNext: () => void;
  isMobileViewport: boolean;
  mobilePage: 0 | 1;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.section
      className="founders-section"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="founders-stage" data-local-scroll>
        <LightSectionBackground className="founders-light-background" />

        {isMobileViewport ? (
          <AnimatePresence mode="wait" initial={false}>
            {mobilePage === 0 ? (
              <motion.div
                key="founders-mobile-overview"
                className="founders-mobile-page founders-mobile-overview-page"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <FoundersHeading delay={0.08} reducedMotion={reducedMotion} />
                <FoundersPhoto delay={0.58} reducedMotion={reducedMotion} />
                <FoundersScrollButton delay={1.12} goToNext={goToNext} reducedMotion={reducedMotion} />
              </motion.div>
            ) : (
              <motion.div
                key="founders-mobile-profiles"
                className="founders-mobile-page founders-mobile-profiles-page"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <FoundersCards startDelay={0.08} reducedMotion={reducedMotion} />
                <FoundersFooterCard delay={0.72} reducedMotion={reducedMotion} />
                <FoundersScrollButton delay={1.15} goToNext={goToNext} reducedMotion={reducedMotion} />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <>
            <FoundersHeading delay={0.1} reducedMotion={reducedMotion} />
            <div className="founders-content">
              <FoundersPhoto delay={0.62} reducedMotion={reducedMotion} />
              <FoundersCards startDelay={1.08} reducedMotion={reducedMotion} />
            </div>
            <FoundersFooterCard delay={1.78} reducedMotion={reducedMotion} />
            <FoundersScrollButton delay={2.15} goToNext={goToNext} reducedMotion={reducedMotion} />
          </>
        )}
      </div>
    </motion.section>
  );
}

function FounderCard({
  accent,
  copy,
  icon: Icon,
  name,
  reveal,
  role,
}: {
  accent: string;
  copy: string;
  icon: typeof BriefcaseBusiness;
  name: string;
  reveal: GuidedRevealCustom;
  role: string;
}) {
  return (
    <motion.article
      className="founder-card"
      style={{ "--founder-accent": accent } as React.CSSProperties}
      custom={reveal}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="founder-icon">
        <Icon />
      </div>
      <div>
        <h3>{name}</h3>
        <p className="founder-role">{role}</p>
        <p className="founder-copy">{copy}</p>
      </div>
    </motion.article>
  );
}

const partnerTargets = [
  "Clínicas e consultórios",
  "Saúde e terapias",
  "Empresas apoiadoras",
  "Comunidades de pais",
  "Associações e ONGs",
  "Educação inclusiva",
];

function PartnerHeading({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="partner-heading"
      custom={{ delay, reducedMotion, y: 18 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <p>SEJA UM PARCEIRO</p>
      <h1>
        Faça parte da <span className="orange">rede</span> que apoia famílias atípicas com{" "}
        <span className="blue">responsabilidade.</span>
      </h1>
      <p className="partner-copy">
        Se <strong>você</strong> atende, orienta ou acompanha famílias atípicas, o <strong>IFA</strong> pode caminhar
        ao seu lado para ampliar o acesso à informação, planejamento e proteção financeira familiar.
      </p>
    </motion.div>
  );
}

function PartnerWoman({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.img
      className="partner-woman"
      src={asset("optimized/woman-ifa.webp")}
      alt="Representante IFA"
      width="360"
      height="450"
      loading="lazy"
      decoding="async"
      custom={{ delay, reducedMotion, y: 18 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    />
  );
}

function PartnerLeftCard({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      className="partner-left-card"
      custom={{ delay, reducedMotion, x: -20 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <h2>
        Essa <span>parceria</span> pode fazer sentido para:
      </h2>
      <ul>
        {partnerTargets.map((target) => (
          <li key={target}>{target}</li>
        ))}
      </ul>
    </motion.article>
  );
}

function PartnerRightCard({
  delay,
  reducedMotion,
}: {
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      className="partner-right-card"
      custom={{ delay, reducedMotion, x: 20 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <h2>
        Quer construir essa{" "}
        <span className="partner-title-nowrap">
          ponte com o{" "}
          <span className="ifa-letters">
            <span>I</span>
            <span>F</span>
            <span>A</span>
          </span>
          ?
        </span>
      </h2>
      <p>
        Preencha o formulário de parceria e conte como você ou sua instituição pode contribuir com essa rede de cuidado.
      </p>
      <button
        type="button"
        onClick={() => window.open(whatsappLinks.partnership, "_blank", "noopener,noreferrer")}
      >
        Quero ser parceiro
        <img src={asset("LOGO IFA BOTAO.png")} alt="" />
      </button>
      <div className="partner-secure-note">
        <img className="partner-lock" src={asset("cadeado.png")} alt="" />
        <p>Você será direcionado ao WhatsApp do IFA para iniciar a parceria.</p>
      </div>
    </motion.article>
  );
}

function PartnerScrollButton({
  delay,
  goToNext,
  reducedMotion,
}: {
  delay: number;
  goToNext: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      className="partner-mouse"
      type="button"
      aria-label="Próxima seção"
      onClick={goToNext}
      custom={{ delay, reducedMotion, y: 12 } satisfies GuidedRevealCustom}
      variants={guidedRevealVariants}
      initial="hidden"
      animate="visible"
    >
      <ScrollIndicator tone="dark" />
    </motion.button>
  );
}

function PartnerSection({
  goToNext,
  isMobileViewport,
  mobilePage,
}: {
  goToNext: () => void;
  isMobileViewport: boolean;
  mobilePage: 0 | 1;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.section
      className="partner-section"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="partner-stage">
        <LightSectionBackground className="partner-light-background" />

        {isMobileViewport ? (
          <AnimatePresence mode="wait" initial={false}>
            {mobilePage === 0 ? (
              <motion.div
                key="partner-mobile-intro"
                className="partner-mobile-page partner-mobile-intro-page"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <PartnerHeading delay={0.08} reducedMotion={reducedMotion} />
                <PartnerWoman delay={0.58} reducedMotion={reducedMotion} />
                <PartnerScrollButton delay={1.08} goToNext={goToNext} reducedMotion={reducedMotion} />
              </motion.div>
            ) : (
              <motion.div
                key="partner-mobile-cards"
                className="partner-mobile-page partner-mobile-cards-page"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <PartnerLeftCard delay={0.08} reducedMotion={reducedMotion} />
                <PartnerRightCard delay={0.42} reducedMotion={reducedMotion} />
                <PartnerScrollButton delay={0.92} goToNext={goToNext} reducedMotion={reducedMotion} />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <>
            <PartnerHeading delay={0.1} reducedMotion={reducedMotion} />
            <div className="partner-content">
              <PartnerLeftCard delay={1.08} reducedMotion={reducedMotion} />
              <PartnerWoman delay={0.62} reducedMotion={reducedMotion} />
              <PartnerRightCard delay={1.34} reducedMotion={reducedMotion} />
            </div>
            <PartnerScrollButton delay={1.9} goToNext={goToNext} reducedMotion={reducedMotion} />
          </>
        )}
      </div>
    </motion.section>
  );
}

const exploreDestinations = [
  {
    id: "events",
    title: "Calendário de eventos",
    description:
      "Consulte as próximas palestras, encontros e ações do IFA. Encontre oportunidades para aprender, trocar experiências e fortalecer conexões.",
    indicators: ["Palestras", "Encontros", "Ações"],
    cta: "Acessar calendário",
    icon: CalendarDays,
  },
  {
    id: "network",
    title: "Rede de parceiros",
    description:
      "Conheça profissionais, clínicas e serviços alinhados ao cuidado de famílias atípicas. Encontre apoio especializado para cada etapa.",
    indicators: ["Profissionais", "Clínicas", "Serviços"],
    cta: "Conhecer parceiros",
    icon: Network,
  },
] as const;

function ExploreSection({ goToNext }: { goToNext: () => void }) {
  const reducedMotion = Boolean(useReducedMotion());
  const navigate = useNavigate();

  return (
    <motion.section
      className="explore-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="explore-stage">
        <DarkSectionBackground className="explore-dark-background" />

        <motion.div
          className="explore-heading"
          custom={{ delay: 0.1, reducedMotion, y: 18 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          <p>EXPLORE O IFA</p>
          <h1>
            Continue sua jornada pelo <span>Instituto.</span>
          </h1>
          <p className="explore-copy">
            Encontre parceiros que caminham com o <strong>IFA</strong> ou acompanhe os próximos
            eventos, encontros e ações voltadas para famílias atípicas.
          </p>
        </motion.div>

        <motion.div
          className="explore-card"
          custom={{ delay: 0.62, reducedMotion, y: 22 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          {exploreDestinations.map((destination) => {
            const Icon = destination.icon;

            return (
              <article
                className={`explore-option explore-option-${destination.id}`}
                key={destination.id}
              >
                <div className="explore-option-title">
                  <span className="explore-option-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h2>{destination.title}</h2>
                </div>
                <p className="explore-option-description">{destination.description}</p>
                <ul className="explore-option-meta" aria-label={`Conteúdos de ${destination.title}`}>
                  {destination.indicators.map((indicator) => (
                    <li key={indicator}>{indicator}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-label={destination.cta}
                  onClick={() =>
                    navigate(destination.id === "events" ? "/eventos" : "/parceiros")
                  }
                >
                  <span>{destination.cta}</span>
                  <ArrowRight />
                </button>
              </article>
            );
          })}
        </motion.div>

        <motion.button
          className="explore-mouse"
          type="button"
          aria-label="Próxima seção"
          onClick={goToNext}
          custom={{ delay: 1.12, reducedMotion, y: 10 } satisfies GuidedRevealCustom}
          variants={guidedRevealVariants}
          initial="hidden"
          animate="visible"
        >
          <ScrollIndicator tone="light" />
        </motion.button>
      </div>
    </motion.section>
  );
}

const faqItems = [
  {
    question: "O que é o Método de Continuidade IFA?",
    answer:
      "É a metodologia utilizada pelo Instituto Futuro Atípico para compreender a realidade de cada família, identificar prioridades e construir um planejamento personalizado voltado à manutenção da rotina do filho na hipótese de improdutividade dos pais e sua ausência definitiva.",
  },
  {
    question: "O IFA vende apenas seguro de vida?",
    answer:
      "Não. O seguro pode fazer parte da solução, mas o trabalho do IFA começa antes disso. Primeiro, entendemos a realidade da família, os custos, a rotina, a rede de apoio e os riscos. A partir dessa análise, é construído um planejamento de proteção financeira sob medida.",
  },
  {
    question: "Por que esse planejamento é importante para famílias atípicas?",
    answer:
      "Famílias atípicas enfrentam jornadas financeiras e emocionais singulares. O planejamento do IFA garante que, em qualquer cenário, a continuidade dos cuidados e terapias esteja assegurada, trazendo previsibilidade e segurança para o futuro.",
  },
  {
    question: "Como funciona o primeiro atendimento do IFA?",
    answer:
      "O primeiro atendimento acontece por meio do Diagnóstico Familiar, a etapa inicial do Método de Continuidade IFA. Nesse encontro, conhecemos a realidade da sua família, compreendemos a rotina, identificamos prioridades, avaliamos riscos, custos e a rede de apoio para construir os primeiros passos de um planejamento personalizado.",
  },
  {
    question: "O IFA atende famílias em qualquer cidade?",
    answer: "Sim. O IFA atende famílias brasileiras em qualquer parte do Brasil e do mundo.",
  },
  {
    question: "Tenho seguro de vida. Ainda faz sentido conversar com o IFA?",
    answer:
      "Sim. Realizamos uma auditoria do que você já possui para verificar se os valores e coberturas estão realmente alinhados com as necessidades específicas do contexto da sua família hoje.",
  },
  {
    question: "Preciso ter tudo organizado antes de falar com o IFA?",
    answer:
      "Não. Parte do nosso trabalho é justamente ajudar você a organizar esse quebra-cabeça. Você traz a sua realidade e nós trazemos o método para estruturar o seu futuro.",
  },
  {
    question: "O plano é igual para todas as famílias?",
    answer:
      "Absolutamente não. Cada família atípica tem sua própria dinâmica. Nossas soluções são 100% personalizadas após um diagnóstico profundo das suas necessidades e objetivos.",
  },
  {
    question: "E se agora não for o melhor momento financeiro?",
    answer:
      "Justamente por isso o planejamento é vital. Ajudamos a priorizar os riscos mais urgentes e a construir uma estratégia que caiba no seu orçamento atual, evoluindo conforme sua realidade muda.",
  },
  {
    question: "O que acontece depois da contratação?",
    answer:
      "O IFA torna-se um parceiro de longo prazo. Fazemos revisões periódicas do plano para garantir que ele continue fazendo sentido conforme a vida e as leis evoluem.",
  },
];

function FAQSection({ goToSection }: { goToSection: (index: number) => void }) {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <motion.section
      className="faq-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="faq-stage" data-local-scroll>
        <DarkSectionBackground className="faq-dark-background" />

        <div className="faq-heading">
          <p>PERGUNTAS FREQUENTES</p>
          <h1>
            Dúvidas comuns antes de <span>começar.</span>
          </h1>
          <p className="faq-copy">
            Algumas respostas para ajudar sua família a entender melhor como o <strong>IFA</strong>{" "}
            trabalha e por que essa conversa pode trazer mais clareza.
          </p>
        </div>

        <div className="faq-card">
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleItem(index)}
                  >
                    <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      <Plus />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </div>

        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={asset("logo rodape.png")} alt="Instituto Futuro Atípico" />
              <p>Proteção financeira, orientação e acolhimento para famílias atípicas.</p>
              <div className="footer-socials" aria-label="Canais sociais">
                <button
                  type="button"
                  onClick={() => window.open(instagramUrl, "_blank", "noopener,noreferrer")}
                  aria-label="Instagram"
                >
                  <Instagram />
                </button>
                <button
                  type="button"
                  onClick={() => window.open(whatsappLinks.general, "_blank", "noopener,noreferrer")}
                  aria-label="WhatsApp"
                >
                  <MessageSquare />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = phoneUrl;
                  }}
                  aria-label="Ligar para o IFA"
                >
                  <Phone />
                </button>
              </div>
            </div>

            <nav className="footer-links" aria-label="Links rápidos">
              <h2>Links rápidos</h2>
              <button type="button" onClick={() => goToSection(0)}>Início</button>
              <button type="button" onClick={() => goToSection(2)}>Dores e rotina</button>
              <button type="button" onClick={() => goToSection(3)}>Hub de soluções</button>
              <button type="button" onClick={() => goToSection(4)}>Histórias atendidas</button>
              <button type="button" onClick={() => goToSection(6)}>Quem somos</button>
              <button type="button" onClick={() => goToSection(8)}>Seja parceiro</button>
            </nav>

            <nav className="footer-links" aria-label="Páginas">
              <h2>Páginas</h2>
              <button type="button" onClick={() => navigate("/parceiros")}>Rede de parceiros</button>
              <button type="button" onClick={() => navigate("/eventos")}>Calendário de eventos</button>
            </nav>

            <div className="footer-cta">
              <h2>Ainda tem dúvidas?</h2>
              <p>Fale com o IFA e entenda como começar essa conversa com clareza e acolhimento.</p>
              <button
                type="button"
                onClick={() => window.open(whatsappLinks.questions, "_blank", "noopener,noreferrer")}
              >
                Fale com o IFA
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Instituto Futuro Atípico. Todos os direitos reservados.</p>
            <p>
              Desenvolvido por{" "}
              <a href="https://aguiadigital.com/" target="_blank" rel="noopener noreferrer">
                Águia Digital
              </a>
            </p>
          </div>
        </footer>
      </div>
    </motion.section>
  );
}

export default App;
