import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
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
  LockKeyhole,
  MessageCircle,
  MessageSquare,
  Network,
  Plus,
  Quote,
  RefreshCcw,
  Route,
  Shield,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
  UsersRound,
  X,
} from "lucide-react";

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

const asset = (name: string) => `/assets/${name}`;

type HeroTransitionDirection = "forward" | "reverse" | null;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroTransitionDirection, setHeroTransitionDirection] = useState<HeroTransitionDirection>(null);
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAnimating = useRef(false);
  const heroTransitionTimeoutRef = useRef<number | null>(null);

  const activeSection = sections[activeIndex];
  const isHeroTransitioning = heroTransitionDirection !== null;

  const goToSection = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), sections.length - 1);

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

  useEffect(() => {
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

      goToSection(activeIndex + (event.deltaY > 0 ? 1 : -1));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        goToSection(activeIndex + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        goToSection(activeIndex - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, heroTransitionDirection]);

  useEffect(() => () => {
    if (heroTransitionTimeoutRef.current !== null) {
      window.clearTimeout(heroTransitionTimeoutRef.current);
    }
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
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 280);
  };

  const isDarkInternalSection = activeIndex === 5 || activeIndex === 9 || activeIndex === 10;
  const useLightMenu = heroTransitionDirection === "reverse"
    || (activeIndex > 0 && !isDarkInternalSection);
  const useHeaderOffset = heroTransitionDirection === "reverse" || activeIndex > 0;

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
            goToSection(index);
          }}
        />
      )),
    [activeIndex, heroTransitionDirection],
  );

  return (
    <main className={`site-shell ${activeSection.tone === "dark" ? "is-dark" : "is-light"}`}>
      <header className={`site-header ${useHeaderOffset ? "site-header-light" : ""}`} aria-label="Menu principal">
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={28} /> : <img src={asset(useLightMenu ? "BOTAO MENU 2.png" : "BOTAO MENU.png")} alt="" />}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {activeIndex === 0 ? (
          <div className="hero-flow" key="inicio-flow">
            <FirstSection
              areCtasVisible={isHeroCtaVisible}
              goToNext={() => goToSection(1)}
            />
          </div>
        ) : activeIndex === 1 ? (
          <SecondSection
            key="propósito"
            enterImmediately={heroTransitionDirection === "forward"}
            exitImmediately={heroTransitionDirection === "reverse"}
            goToNext={() => goToSection(2)}
          />
        ) : activeIndex === 2 ? (
          <ThirdSection key="jornada" goToNext={() => goToSection(3)} />
        ) : activeIndex === 3 ? (
          <FourthSection key="continuidade" goToNext={() => goToSection(4)} />
        ) : activeIndex === 4 ? (
          <StoriesSection key="histórias" goToNext={() => goToSection(5)} />
        ) : activeIndex === 5 ? (
          <FifthSection key="conversa" goToNext={() => goToSection(6)} />
        ) : activeIndex === 6 ? (
          <WhoWeAreSection key="quem-somos" goToNext={() => goToSection(7)} />
        ) : activeIndex === 7 ? (
          <FoundersSection key="quem-construiu" goToNext={() => goToSection(8)} />
        ) : activeIndex === 8 ? (
          <PartnerSection key="parceiro" goToNext={() => goToSection(9)} />
        ) : activeIndex === 9 ? (
          <ExploreSection key="explore" goToNext={() => goToSection(10)} />
        ) : activeIndex === 10 ? (
          <FAQSection key="perguntas-frequentes" />
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
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  goToSection(index);
                }}
              >
                {section.eyebrow}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

    </main>
  );
}

function FirstSection({
  areCtasVisible,
  goToNext,
}: {
  areCtasVisible: boolean;
  goToNext: () => void;
}) {
  return (
    <motion.section
      className="hero-section"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-stage">
        <img className="hero-background" src={asset("FUNDO.png")} alt="" />
        <div
          className={`hero-actions ${areCtasVisible ? "hero-actions-visible" : "hero-actions-hidden"}`}
          aria-label="Ações principais"
        >
          <button className="hero-button hero-button-primary" type="button">
            Conheça o IFA
          </button>
          <button className="hero-button hero-button-outline" type="button">
            fale com nossa equipe
          </button>
        </div>

        <button className="hero-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img src={asset("MOUSE.png")} alt="" />
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
      <img className="light-section-background-base" src={asset("fundo pc.jpg.jpeg")} alt="" />
      <div className="light-section-background-corners">
        <img className="light-section-corner light-section-corner-red" src={asset("vermelho.svg")} alt="" />
        <img className="light-section-corner light-section-corner-teal" src={asset("azul claro.svg")} alt="" />
        <img className="light-section-corner light-section-corner-blue" src={asset("azul escuro.svg")} alt="" />
        <img className="light-section-corner light-section-corner-orange" src={asset("laranja.svg")} alt="" />
      </div>
    </div>
  );
}

function SecondSection({
  enterImmediately = false,
  exitImmediately = false,
  goToNext,
}: {
  enterImmediately?: boolean;
  exitImmediately?: boolean;
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
        <img
          className="second-logo"
          src={asset("LOGO IFA COLORIDA COMPLETA.png")}
          alt="Instituto Futuro Atípico"
        />
        <div className="second-main">
          <img className="family-photo" src={asset("FOTO FAMILIA.png")} alt="Família sorrindo" />

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
                  <img src={asset("foto1.png")} alt="" />
                  <img src={asset("foto2.png")} alt="" />
                  <img src={asset("foto3.png")} alt="" />
                  <img src={asset("foto4.png")} alt="" />
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
              <button type="button">Entender o planejamento</button>
            </div>
          </div>
        </div>

        <button className="second-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img className="second-legacy-mouse mouse-dark" src={asset("MOUSE.png")} alt="" />
          <span className="second-scroll-indicator" aria-hidden="true">
            <span className="second-scroll-indicator-dot" />
          </span>
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
        <img className="third-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atípico" />

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
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
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
        <img className="fourth-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atípico" />

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
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
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

function StoriesSection({ goToNext }: { goToNext: () => void }) {
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const nextFeedback = (activeFeedback + 1) % feedbacks.length;

  const goToFeedback = (direction: 1 | -1) => {
    setActiveFeedback((current) => (current + direction + feedbacks.length) % feedbacks.length);
  };

  useEffect(() => {
    if (isCarouselPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveFeedback((current) => (current + 1) % feedbacks.length);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeFeedback, isCarouselPaused]);

  return (
    <motion.section
      className="stories-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stories-stage">
        <img className="stories-background" src={asset("FUNDO HERO.png")} alt="" />
        <img className="stories-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atípico" />

        <div className="stories-heading">
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
        </div>

        <motion.div
          className="feedback-carousel"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onPointerDown={() => setIsCarouselPaused(true)}
          onPointerUp={() => setIsCarouselPaused(false)}
          onPointerCancel={() => setIsCarouselPaused(false)}
          onPointerLeave={() => setIsCarouselPaused(false)}
          onDragEnd={(_, info) => {
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

        <div className="feedback-dots" aria-label="Feedback ativo">
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
        </div>

        <button className="stories-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
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

function FifthSection({ goToNext }: { goToNext: () => void }) {
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
        <img
          className="fifth-logo"
          src={asset("LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png")}
          alt="Instituto Futuro Atípico"
        />

        <div className="conversation-layout">
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

            <button className="conversation-button conversation-button-primary" type="button">
              Fale agora com o IFA
            </button>
            <button className="conversation-button conversation-button-outline" type="button">
              Entender melhor como funciona
            </button>
          </div>

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
                <br />
                O papel do IFA é ajudar sua família a organizar
                <br />
                o que hoje parece difícil de enxergar.
              </p>
            </footer>
          </article>
        </div>

        <button className="fifth-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img src={asset("MOUSE.png")} alt="" />
        </button>
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

function WhoWeAreSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="who-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="who-stage">
        <img className="who-background" src={asset("FUNDO HERO.png")} alt="" />
        <img className="who-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atípico" />

        <div className="who-heading">
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
        </div>

        <div className="who-left-cards">
          {whoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>

        <div className="who-right-block">
          <h2>
            Uma iniciativa criada para transformar
            <br />
            preocupação em <span>planejamento.</span>
          </h2>
          <p>
            O Instituto Futuro Atípico não nasceu como uma seguradora, uma
            <br />
            clínica ou uma consultoria tradicional. Nasceu como uma iniciativa
            <br />
            para reunir conhecimento, planejamento financeiro e uma rede
            <br />
            de profissionais preparados para apoiar famílias que vivem a
            <br />
            realidade atípica todos os dias. Nosso propósito é ajudar pais e
            <br />
            mães a organizarem o futuro com mais clareza, segurança e
            <br />
            acolhimento.
          </p>

          <div className="who-feature-card">
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
          </div>

          <div className="who-chip-row">
            {whoChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <div className="who-mini-card" key={chip.label} style={{ "--who-accent": chip.accent } as React.CSSProperties}>
                  <Icon />
                  <span>{chip.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button className="who-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
  );
}

function InfoCard({
  accent,
  copy,
  icon: Icon,
  title,
}: {
  accent: string;
  copy: string;
  icon: typeof Ear;
  title: string;
}) {
  return (
    <article className="who-info-card" style={{ "--who-accent": accent } as React.CSSProperties}>
      <div className="who-info-icon">
        <Icon />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </article>
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
    name: "Dr. Rodrigo Cunha",
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

function FoundersSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="founders-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="founders-stage">
        <img className="founders-background" src={asset("FUNDO HERO.png")} alt="" />
        <img className="founders-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atípico" />

        <div className="founders-heading">
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
        </div>

        <figure className="founders-photo">
          <img src={asset("SOCIOS.jpeg")} alt="Equipe fundadora do IFA" />
          <figcaption>Equipe fundadora do IFA</figcaption>
        </figure>

        <div className="founders-card-list">
          {founderCards.map((card) => (
            <FounderCard key={card.name} {...card} />
          ))}
        </div>

        <div className="founders-footer-card">
          <UsersRound />
          <p>
            O que nos une é a certeza de que <strong className="teal">famílias atípicas</strong> precisam de{" "}
            <strong className="orange">plano</strong>, <strong className="teal">orientação</strong> e uma{" "}
            <strong className="orange">rede de confiança.</strong>
          </p>
        </div>

        <button className="founders-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
  );
}

function FounderCard({
  accent,
  copy,
  icon: Icon,
  name,
  role,
}: {
  accent: string;
  copy: string;
  icon: typeof BriefcaseBusiness;
  name: string;
  role: string;
}) {
  return (
    <article className="founder-card" style={{ "--founder-accent": accent } as React.CSSProperties}>
      <div className="founder-icon">
        <Icon />
      </div>
      <div>
        <h3>{name}</h3>
        <p className="founder-role">{role}</p>
        <p className="founder-copy">{copy}</p>
      </div>
    </article>
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

function PartnerSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="partner-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="partner-stage">
        <img className="partner-background" src={asset("FUNDO HERO.png")} alt="" />
        <img className="partner-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atípico" />

        <div className="partner-heading">
          <p>SEJA UM PARCEIRO</p>
          <h1>
            Faça parte da <span className="orange">rede</span> que apoia famílias
            <br />{" "}
            atípicas com <span className="blue">responsabilidade.</span>
          </h1>
          <p className="partner-copy">
            Se <strong>você</strong> atende, orienta ou acompanha famílias atípicas, o <strong>IFA</strong> pode caminhar
            <br />{" "}
            ao seu lado para ampliar o acesso à informação, planejamento e proteção
            <br />{" "}
            financeira familiar.
          </p>
        </div>

        <div className="partner-left-card">
          <h2>
            Essa <span>parceria</span> pode fazer
            <br />{" "}
            sentido para:
          </h2>
          <ul>
            {partnerTargets.map((target) => (
              <li key={target}>{target}</li>
            ))}
          </ul>
        </div>

        <img className="partner-woman" src={asset("MULHER IFA.png")} alt="Representante IFA" />

        <div className="partner-right-card">
          <h2>
            Quer construir essa
            <br />{" "}
            ponte com o{" "}
            <span className="ifa-letters">
              <span>I</span>
              <span>F</span>
              <span>A</span>
            </span>
            ?
          </h2>
          <p>
            Preencha o formulário de parceria
            <br />{" "}
            e conte como você ou sua
            <br />{" "}
            instituição pode contribuir com
            <br />{" "}
            essa rede de cuidado.
          </p>
          <button type="button">
            Quero ser parceiro
            <img src={asset("LOGO IFA BOTAO.png")} alt="" />
          </button>
          <div className="partner-secure-note">
            <LockKeyhole />
            <p>
              Você será direcionado para
              <br />{" "}
              um formulário rápido e seguro.
            </p>
          </div>
        </div>

        <button className="partner-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
  );
}

function ExploreSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="explore-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="explore-stage">
        <img className="explore-background" src={asset("FUNDO.png")} alt="" />
        <img
          className="explore-logo"
          src={asset("LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png")}
          alt="Instituto Futuro Atípico"
        />

        <div className="explore-heading">
          <p>EXPLORE O IFA</p>
          <h1>
            Continue sua jornada pelo <span>Instituto.</span>
          </h1>
          <p className="explore-copy">
            Encontre parceiros que caminham com o <strong>IFA</strong> ou acompanhe os próximos
            <br />
            eventos, encontros e ações voltadas para famílias atípicas.
          </p>
        </div>

        <div className="explore-card">
          <article className="explore-option explore-option-events">
            <div className="explore-option-title">
              <CalendarDays />
              <h2>Calendário de eventos</h2>
            </div>
            <p>
              Acompanhe palestras, encontros e ações do
              <br />
              <strong>IFA.</strong> Um espaço para ficar por dentro dos
              <br />
              próximos eventos e oportunidades de conexão.
            </p>
            <button type="button">
              Ver agenda
              <ArrowRight />
            </button>
          </article>

          <article className="explore-option explore-option-network">
            <div className="explore-option-title">
              <Network />
              <h2>Rede de parceiros</h2>
            </div>
            <p>
              Encontre profissionais, clínicas e serviços parceiros
              <br />
              do <strong>IFA.</strong> Uma rede criada para ajudar famílias atípicas
              <br />
              com mais apoio, benefícios e segurança na escolha.
            </p>
            <button type="button">
              Explorar rede
              <ArrowRight />
            </button>
          </article>
        </div>

        <button className="explore-mouse" type="button" aria-label="Próxima seção" onClick={goToNext}>
          <img src={asset("MOUSE.png")} alt="" />
        </button>
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

function FAQSection() {
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
        <img className="faq-background" src={asset("FUNDO.png")} alt="" />
        <img
          className="faq-logo"
          src={asset("LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png")}
          alt="Instituto Futuro Atípico"
        />

        <div className="faq-heading">
          <p>PERGUNTAS FREQUENTES</p>
          <h1>
            Dúvidas comuns antes de <span>começar.</span>
          </h1>
          <p className="faq-copy">
            Algumas respostas para ajudar sua família a entender melhor como o <strong>IFA</strong>
            <br />
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
              <img src={asset("LOGO IFA BRANCA.svg")} alt="Instituto Futuro Atípico" />
              <p>Proteção financeira, orientação e acolhimento para famílias atípicas.</p>
              <div className="footer-socials" aria-label="Canais sociais">
                <button type="button" aria-label="Instagram">
                  <Instagram />
                </button>
                <button type="button" aria-label="Mensagem">
                  <MessageSquare />
                </button>
              </div>
            </div>

            <nav className="footer-links" aria-label="Links rápidos">
              <h2>Links rápidos</h2>
              <button type="button">Início</button>
              <button type="button">Dores e rotina</button>
              <button type="button">Hub de soluções</button>
              <button type="button">Histórias atendidas</button>
              <button type="button">Quem somos</button>
              <button type="button">Seja parceiro</button>
            </nav>

            <nav className="footer-links" aria-label="Páginas">
              <h2>Páginas</h2>
              <button type="button">Rede de parceiros</button>
              <button type="button">Calendário de eventos</button>
            </nav>

            <div className="footer-cta">
              <h2>Ainda tem dúvidas?</h2>
              <p>Fale com o IFA e entenda como começar essa conversa com clareza e acolhimento.</p>
              <button type="button">
                Fale com o IFA
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Instituto Futuro Atípico. Todos os direitos reservados.</p>
            <p>
              Desenvolvido por <strong>Águia Digital</strong>
            </p>
          </div>
        </footer>
      </div>
    </motion.section>
  );
}

export default App;
