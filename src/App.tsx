import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Ear,
  HeartHandshake,
  Instagram,
  Lightbulb,
  LockKeyhole,
  MessageSquare,
  Network,
  Plus,
  Quote,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
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
    eyebrow: "Instituto Futuro Atipico",
    title: "Futuro Atipico",
    copy: "Uma experiencia digital leve, precisa e fiel ao design original.",
    tone: "dark",
  },
  {
    id: "proposito",
    eyebrow: "Proposito",
    title: "Cada secao entra com calma.",
    copy: "O scroll conduz a navegacao entre telas completas, com transicoes sutis e foco no conteudo.",
    tone: "light",
  },
  {
    id: "jornada",
    eyebrow: "Jornada",
    title: "Movimento suave, sem pressa.",
    copy: "A estrutura ja esta pronta para receber as composicoes exatas dos prints do Figma.",
    tone: "dark",
  },
  {
    id: "contato",
    eyebrow: "Contato",
    title: "Uma landing page completa.",
    copy: "React, TypeScript, Tailwind e Vite configurados para evoluir ate a versao final.",
    tone: "light",
  },
  {
    id: "historias",
    eyebrow: "Historias atendidas",
    title: "Relatos que mostram cuidado, seguranca e planejamento.",
    copy: "Exemplos reais de preocupacao transformada em planejamento.",
    tone: "light",
  },
  {
    id: "conversa",
    eyebrow: "Converse com o IFA",
    title: "O futuro nao precisa depender do improviso.",
    copy: "Uma conversa consultiva para entender a realidade da familia.",
    tone: "dark",
  },
  {
    id: "quem-somos",
    eyebrow: "Quem somos",
    title: "O Instituto Futuro Atipico nasceu de uma pergunta simples.",
    copy: "Quem cuida do futuro de quem dedica a vida a cuidar?",
    tone: "light",
  },
  {
    id: "quem-construiu",
    eyebrow: "Quem construiu esse projeto",
    title: "Tres trajetorias diferentes, um mesmo proposito.",
    copy: "O IFA reune profissionais de areas complementares.",
    tone: "light",
  },
  {
    id: "parceiro",
    eyebrow: "Seja um parceiro",
    title: "Faca parte da rede que apoia familias atipicas com responsabilidade.",
    copy: "Amplie o acesso a informacao, planejamento e protecao financeira familiar.",
    tone: "light",
  },
  {
    id: "explore",
    eyebrow: "Explore o IFA",
    title: "Continue sua jornada pelo Instituto.",
    copy: "Encontre parceiros e acompanhe os proximos eventos do IFA.",
    tone: "dark",
  },
  {
    id: "perguntas-frequentes",
    eyebrow: "Perguntas frequentes",
    title: "Duvidas comuns antes de comecar.",
    copy: "Respostas para entender melhor como o IFA trabalha.",
    tone: "dark",
  },
];

const asset = (name: string) => `/assets/${name}`;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);
  const [isTransitionLightPhase, setIsTransitionLightPhase] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAnimating = useRef(false);

  const activeSection = sections[activeIndex];

  const goToSection = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), sections.length - 1);

    if (nextIndex === activeIndex || isAnimating.current || isHeroTransitioning) {
      return;
    }

    if (activeIndex === 0 && nextIndex === 1) {
      isAnimating.current = true;
      setMenuOpen(false);
      setIsTransitionLightPhase(false);
      setIsHeroTransitioning(true);
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
  }, [activeIndex]);

  const completeHeroTransition = () => {
    setActiveIndex(1);
    setIsHeroTransitioning(false);
    setIsTransitionLightPhase(false);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 900);
  };

  const isDarkInternalSection = activeIndex === 5 || activeIndex === 9 || activeIndex === 10;
  const useLightMenu = isTransitionLightPhase || (activeIndex > 0 && !isDarkInternalSection);
  const useHeaderOffset = isTransitionLightPhase || activeIndex > 0;

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
    [activeIndex],
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
        {isHeroTransitioning ? (
          <HeroLogoTransition key="hero-transition" onLightPhase={() => setIsTransitionLightPhase(true)} onComplete={completeHeroTransition} />
        ) : activeIndex === 0 ? (
          <FirstSection key="inicio" goToNext={() => goToSection(1)} />
        ) : activeIndex === 1 ? (
          <SecondSection key="proposito" goToNext={() => goToSection(2)} />
        ) : activeIndex === 2 ? (
          <ThirdSection key="jornada" goToNext={() => goToSection(3)} />
        ) : activeIndex === 3 ? (
          <FourthSection key="continuidade" goToNext={() => goToSection(4)} />
        ) : activeIndex === 4 ? (
          <StoriesSection key="historias" goToNext={() => goToSection(5)} />
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

      <aside className="section-nav" aria-label="Navegacao entre secoes">
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

function FirstSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="hero-section"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-stage">
        <img className="hero-background" src={asset("FUNDO.png")} alt="" />
        <img className="hero-logo" src={asset("LOGO IFA BRANCA.png")} alt="Instituto Futuro Atípico" />

        <div className="hero-actions" aria-label="Ações principais">
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

function HeroLogoTransition({
  onComplete,
  onLightPhase,
}: {
  onComplete: () => void;
  onLightPhase: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const whiteLogoRef = useRef<HTMLImageElement>(null);
  const whiteWashRef = useRef<HTMLDivElement>(null);
  const colorLogoRef = useRef<HTMLImageElement>(null);
  const mouseRef = useRef<HTMLButtonElement>(null);
  const callbacks = useRef({ onComplete, onLightPhase });

  callbacks.current = { onComplete, onLightPhase };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => callbacks.current.onComplete(),
      });

      gsap.set(stageRef.current, { backgroundColor: "#042747" });
      gsap.set(whiteLogoRef.current, {
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "50% 50%",
      });
      gsap.set(whiteWashRef.current, { autoAlpha: 0 });
      gsap.set(colorLogoRef.current, {
        autoAlpha: 0,
        scale: 0.94,
        top: "28.2105263%",
        left: "42.1875%",
        width: "15.625%",
        height: "25.2631579%",
      });
      gsap.set(mouseRef.current, { autoAlpha: 0 });

      timeline
        .to(whiteLogoRef.current, {
          scale: 22,
          duration: 2.15,
          ease: "power2.inOut",
        })
        .to(
          whiteWashRef.current,
          {
            autoAlpha: 1,
            duration: 0.58,
            ease: "power2.out",
            onStart: () => callbacks.current.onLightPhase(),
          },
          1.72,
        )
        .to(
          stageRef.current,
          {
            backgroundColor: "#ffffff",
            duration: 0.5,
            ease: "power2.out",
          },
          1.72,
        )
        .to(
          whiteLogoRef.current,
          {
            autoAlpha: 0,
            duration: 0.22,
            ease: "power2.out",
          },
          2.2,
        )
        .to(
          colorLogoRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.58,
            ease: "power2.out",
          },
          2.28,
        )
        .to(colorLogoRef.current, {
          top: "5.2631579%",
          left: "6.25%",
          width: "10.1041667%",
          height: "7.3684211%",
          duration: 0.9,
          ease: "power3.inOut",
        })
        .to(
          mouseRef.current,
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.28",
        );
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="transition-section"
    >
      <div className="transition-stage" ref={stageRef}>
        <img
          className="transition-white-logo"
          src={asset("LOGO IFA BRANCA.png")}
          alt=""
          ref={whiteLogoRef}
        />
        <div
          className="transition-white-wash"
          ref={whiteWashRef}
        />
        <img
          className="transition-color-logo"
          src={asset("LOGO IFA COLORIDA.png")}
          alt="Instituto Futuro Atipico"
          ref={colorLogoRef}
        />
        <button
          className="transition-mouse"
          type="button"
          aria-label="Carregando proxima secao"
          ref={mouseRef}
        >
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </section>
  );
}

function SecondSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="second-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="second-stage">
        <img className="second-background" src={asset("FUNDO HERO.png")} alt="" />
        <motion.img
          className="second-logo"
          src={asset("LOGO IFA COLORIDA COMPLETA.png")}
          alt="Instituto Futuro Atipico"
          initial={{ top: "28.2105263%", left: "42.1875%", width: "15.625%", height: "25.2631579%" }}
          animate={{ top: "5.2631579%", left: "6.25%", width: "10.1041667%", height: "7.3684211%" }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        />
        <img className="family-photo" src={asset("FOTO FAMILIA.png")} alt="Familia sorrindo" />

        <div className="second-copy-left">
          <h1>
            O <strong>futuro</strong> do seu <strong className="text-blue">filho</strong> nao
            <br />
            pode depender do <strong className="text-red">acaso.</strong>
          </h1>
          <div className="left-support">
            <div className="carousel-dots" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>
              Cada vez mais familias estao escolhendo
              <br />
              planejar o futuro com antecedencia.
            </p>
          </div>
        </div>

        <div className="second-copy-right">
          <p>
            Por meio do <strong>Metodo de Continuidade IFA</strong>, ajudamos
            <br />
            pais atipicos a planejar a continuidade do cuidado,
            <br />
            organizando a <strong className="right-blue">protecao</strong>,{" "}
            <strong className="right-orange">previsibilidade</strong> e{" "}
            <strong className="right-teal">seguranca.</strong>
          </p>
          <button type="button">Entender o planejamento</button>
        </div>

        <button className="second-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
  );
}

function ThirdSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="third-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="third-stage">
        <img className="third-background" src={asset("FUNDO HERO.png")} alt="" />
        <img className="third-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atipico" />

        <div className="third-heading-block">
          <h1>
            Existem <span className="orange">preocupacoes</span> que so
            <br />
            quem vive essa rotina <span className="teal">entende.</span>
          </h1>
          <p>
            Entre terapias, escola, trabalho e custos, a rotina de uma familia
            <br />
            atipica exige presenca o tempo todo. E no meio de tudo isso, uma
            <br />
            preocupacao silenciosa costuma aparecer:{" "}
            <strong>
              se algo sair do
              <br />
              planejado, como o cuidado do meu filho continua?
            </strong>
          </p>
        </div>

        <img className="timeline-image" src={asset("TIMELINE.png")} alt="" />

        <TimelineCard
          className="timeline-card-rotina"
          image="CARD ROTINA.png"
          title="Rotina intensa"
          color="#0D4C87"
        >
          Consultas, terapias, escola e trabalho se acumulam em uma rotina que exige presenca constante e quase nunca desacelera.
        </TimelineCard>

        <TimelineCard
          className="timeline-card-sobrecarga"
          image="CARD SOBRECARGA EMOCIONAL.png"
          title="Sobrecarga emocional"
          color="#0D8F8F"
        >
          Cansaco, culpa e ansiedade frequentemente acompanham quem sente que nao pode parar, mesmo diante dos desafios mais dificeis da jornada do cuidado.
        </TimelineCard>

        <TimelineCard
          className="timeline-card-custos"
          image="CARD CUSTOS CONTINUOS.png"
          title="Custos continuos"
          color="#F78000"
        >
          Deslocamentos, acompanhamentos fazem parte de um cuidado continuo que pressiona o orcamento mes apos mes.
        </TimelineCard>

        <TimelineCard
          className="timeline-card-medo"
          image="CARD MEDO DO INESPERADO.png"
          title="Medo do inesperado"
          color="#B53C3C"
        >
          E se algo acontecer comigo? Quem assume o cuidado? Como garantir protecao, continuidade e previsibilidade?
        </TimelineCard>

        <button className="third-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
  );
}

function TimelineCard({
  children,
  className,
  color,
  image,
  title,
}: {
  children: string;
  className: string;
  color: string;
  image: string;
  title: string;
}) {
  return (
    <article className={`timeline-card ${className}`} style={{ color }}>
      <img src={asset(image)} alt="" />
      <div className="timeline-card-copy">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </article>
  );
}

function FourthSection({ goToNext }: { goToNext: () => void }) {
  return (
    <motion.section
      className="fourth-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fourth-stage">
        <img className="fourth-background" src={asset("FUNDO HERO.png")} alt="" />
        <img className="fourth-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atipico" />

        <div className="method-kicker">COMO FUNCIONA</div>

        <h1 className="method-title">
          o Metodo de <strong className="method-continuity">Continuidade</strong>{" "}
          <strong className="method-ifa">
            <span>I</span>
            <span>F</span>
            <span>A</span>
          </strong>
        </h1>

        <p className="method-intro">
          Uma metodologia estruturada para <strong>compreender</strong> a realidade da
          <br />
          <strong>sua familia</strong>, organizar prioridades e construir um planejamento
          <br />
          personalizado para a continuidade do <strong>cuidado.</strong>
        </p>

        <p className="method-statement">
          Cada <strong className="teal">familia</strong> possui uma historia{" "}
          <strong className="orange">unica.</strong> Por isso, nosso metodo{" "}
          <strong className="blue">respeita</strong>
          <br />
          sua realidade e conduz o planejamento em etapas claras e personalizadas.
        </p>

        <button className="fourth-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
          <img className="mouse-dark" src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
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
    role: "Mae divorciada",
    subtitle: "filho com deficiencia intelectual",
    quote:
      "O que eu buscava era a tranquilidade de saber que meu filho continuaria assistido, mesmo na minha ausencia ou em caso de invalidez.",
    description:
      "Foi estruturado um plano sob medida para garantir suporte ao filho, continuidade das terapias e mais seguranca para o futuro da familia.",
    chips: ["Terapias", "Suporte ao filho", "Seguranca familiar"],
  },
  {
    accent: "#0d8f8f",
    role: "Pai provedor",
    subtitle: "filha com sindrome de Down",
    quote:
      "Minha maior preocupacao era garantir previsibilidade para que minha familia continuasse amparada se algo acontecesse comigo.",
    description:
      "Para esse cenario, o IFA desenvolveu um plano com foco em previsibilidade financeira, considerando protecao em caso de morte e invalidez, preservando a continuidade do cuidado da familia.",
    chips: ["Continuidade do cuidado", "Previsibilidade financeira", "Protecao em vida"],
  },
];

function StoriesSection({ goToNext }: { goToNext: () => void }) {
  const [activeFeedback, setActiveFeedback] = useState(0);
  const nextFeedback = (activeFeedback + 1) % feedbacks.length;

  const goToFeedback = (direction: 1 | -1) => {
    setActiveFeedback((current) => (current + direction + feedbacks.length) % feedbacks.length);
  };

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
        <img className="stories-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atipico" />

        <div className="stories-heading">
          <p>HISTORIAS ATENDIDAS</p>
          <h1>
            Relatos que mostram <span className="red">cuidado</span>,
            <br />
            <span className="orange">seguranca</span> e <span className="blue">planejamento.</span>
          </h1>
          <p className="stories-copy">
            Cada familia chega com uma realidade diferente, mas quase
            <br />
            sempre com a mesma preocupacao: <strong>como proteger o futuro de</strong>
            <br />
            <strong>quem mais depende dela.</strong> Aqui estao alguns exemplos de como o
            <br />
            <strong>IFA</strong> transformou essa preocupacao em planejamento.
          </p>
        </div>

        <motion.div
          className="feedback-carousel"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
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
              onClick={() => setActiveFeedback(index)}
            />
          ))}
        </div>

        <button className="stories-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
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
      initial={{ opacity: 0, x: variant === "main" ? -24 : 24, scale: variant === "main" ? 0.98 : 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: variant === "main" ? -24 : 24, scale: 0.96 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      <header>
        <div className="feedback-icon">
          <UsersRound />
        </div>
        <div className="feedback-person">
          <strong>{feedback.role}</strong>
          <span>{feedback.subtitle}</span>
        </div>
        <span className="feedback-tag">Historia atendida</span>
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
        <img className="fifth-background" src={asset("FUNDO.png")} alt="" />
        <img
          className="fifth-logo"
          src={asset("LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png")}
          alt="Instituto Futuro Atipico"
        />

        <div className="conversation-copy">
          <p className="conversation-kicker">CONVERSE COM O IFA</p>
          <h1>
            O <span className="orange">futuro</span> do seu filho{" "}
            <span className="red">nao</span>
            <br />
            precisa depender do
            <br />
            <span className="blue">improviso.</span>
          </h1>
          <p className="conversation-text">
            Em uma conversa consultiva, o <strong>IFA</strong> entende a
            <br />
            realidade de sua familia e ajuda <strong>voce</strong> a enxergar
            <br />
            caminhos possiveis para proteger o cuidado, a rotina
            <br />e a seguranca de quem mais depende de <strong>voce.</strong>
          </p>

          <button className="conversation-button conversation-button-primary" type="button">
            Fale agora com o IFA
          </button>
          <button className="conversation-button conversation-button-outline" type="button">
            Entender melhor como funciona
          </button>
        </div>

        <img
          className="conversation-card"
          src={asset("CARD O QUE ACONTECE NA CONVERSA.png")}
          alt="O que acontece na conversa?"
        />

        <button className="fifth-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
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
      "Depois de inumeras conversas com familias atipicas, entendemos que cada historia e unica, mas muitas preocupacoes se repetem.",
  },
  {
    accent: "#0D4C87",
    icon: HeartHandshake,
    title: "Continuidade do cuidado",
    copy: "O IFA existe para ajudar familias a protegerem terapias, tratamentos, rotina e qualidade de vida dos filhos.",
  },
  {
    accent: "#F78000",
    icon: Lightbulb,
    title: "Mais que informacao",
    copy: "Familias atipicas nao precisam apenas de dados financeiros. Precisam de orientacao, clareza e um plano possivel.",
  },
  {
    accent: "#B53C3C",
    icon: ShieldCheck,
    title: "Uma rede de protecao",
    copy: "Reunimos planejamento financeiro, conhecimento tecnico e profissionais comprometidos com a seguranca das familias.",
  },
];

const whoChips = [
  { accent: "#0D8F8F", icon: UsersRound, label: "Acolhimento" },
  { accent: "#0D4C87", icon: CalendarDays, label: "Planejamento" },
  { accent: "#F78000", icon: RefreshCcw, label: "Continuidade" },
  { accent: "#B53C3C", icon: Network, label: "Rede de confianca" },
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
        <img className="who-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atipico" />

        <div className="who-heading">
          <p>QUEM SOMOS</p>
          <h1>
            O Instituto <span className="orange">Futuro</span>{" "}
            <span className="teal">Atipico</span> nasceu
            <br />
            de uma pergunta simples.
          </h1>
          <h2>Quem cuida do futuro de quem dedica a vida a cuidar?</h2>
          <p className="who-intro">
            O IFA nasceu da escuta de pais e maes de criancas atipicas e da
            <br />
            necessidade de transformar uma preocupacao silenciosa em planejamento concreto.
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
            preocupacao em <span>planejamento.</span>
          </h2>
          <p>
            O Instituto Futuro Atipico nao nasceu como uma seguradora, uma
            <br />
            clinica ou uma consultoria tradicional. Nasceu como uma iniciativa
            <br />
            para reunir conhecimento, planejamento financeiro e uma rede
            <br />
            de profissionais preparados para apoiar familias que vivem a
            <br />
            realidade atipica todos os dias. Nosso proposito e ajudar pais e
            <br />
            maes a organizarem o futuro com mais clareza, seguranca e
            <br />
            acolhimento.
          </p>

          <div className="who-feature-card">
            <div>
              <ShieldCheck />
            </div>
            <p>
              <strong>Nao somos uma seguradora.</strong>
              <br />
              <strong>Nao somos uma clinica.</strong>
              <br />
              <span>Somos uma rede de planejamento, protecao e confianca.</span>
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

        <button className="who-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
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
    role: "Fundador | Empresario | Consultor Financeiro",
    copy:
      "Ao atender pais e maes de criancas atipicas, Lucas percebeu que a maior preocupacao dessas familias nao era apenas financeira: era garantir que o cuidado pudesse continuar.",
  },
  {
    accent: "#0D8F8F",
    icon: Stethoscope,
    name: "Dr. Rodrigo Cunha",
    role: "Socio | Medico Psiquiatra",
    copy:
      "Com experiencia no atendimento de pacientes e familias atipicas, Rodrigo traz ao IFA um olhar clinico e humano sobre os desafios dessa jornada.",
  },
  {
    accent: "#0D4C87",
    icon: BookOpen,
    name: "Rafael Bretas",
    role: "Socio | Empresario da Educacao",
    copy:
      "Com vivencia na gestao educacional e no acolhimento de criancas atipicas, Rafael contribui com uma visao pratica sobre inclusao e rotina escolar.",
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
        <img className="founders-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atipico" />

        <div className="founders-heading">
          <p>QUEM CONSTRUIU ESSE PROJETO</p>
          <h1>
            Tres trajetorias diferentes,
            <br />
            um <span className="orange">mesmo</span> <span className="teal">proposito.</span>
          </h1>
          <p className="founders-copy">
            O IFA reune profissionais de areas complementares para ajudar
            <br />
            familias atipicas a protegerem aquilo que tem de mais importante:
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
            O que nos une e a certeza de que <strong className="teal">familias atipicas</strong> precisam de{" "}
            <strong className="orange">plano</strong>, <strong className="teal">orientacao</strong> e uma{" "}
            <strong className="orange">rede de confianca.</strong>
          </p>
        </div>

        <button className="founders-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
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
  "Clinicas e consultorios",
  "Saude e terapias",
  "Empresas apoiadoras",
  "Comunidades de pais",
  "Associacoes e ONGs",
  "Educacao inclusiva",
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
        <img className="partner-logo" src={asset("LOGO IFA COLORIDA COMPLETA.png")} alt="Instituto Futuro Atipico" />

        <div className="partner-heading">
          <p>SEJA UM PARCEIRO</p>
          <h1>
            Faca parte da <span className="orange">rede</span> que apoia familias
            <br />
            atipicas com <span className="blue">responsabilidade.</span>
          </h1>
          <p className="partner-copy">
            Se <strong>voce</strong> atende, orienta ou acompanha familias atipicas, o <strong>IFA</strong> pode caminhar
            <br />
            ao seu lado para ampliar o acesso a informacao, planejamento e protecao
            <br />
            financeira familiar.
          </p>
        </div>

        <div className="partner-left-card">
          <h2>
            Essa <span>parceria</span> pode fazer
            <br />
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
            <br />
            ponte com o{" "}
            <span className="ifa-letters">
              <span>I</span>
              <span>F</span>
              <span>A</span>
            </span>
            ?
          </h2>
          <p>
            Preencha o formulario de parceria
            <br />e conte como voce ou sua
            <br />
            instituicao pode contribuir com
            <br />
            essa rede de cuidado.
          </p>
          <button type="button">
            Quero ser parceiro
            <img src={asset("LOGO IFA BOTAO.png")} alt="" />
          </button>
          <div className="partner-secure-note">
            <LockKeyhole />
            <p>
              Voce sera direcionado para
              <br />
              um formulario rapido e seguro.
            </p>
          </div>
        </div>

        <button className="partner-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
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
          alt="Instituto Futuro Atipico"
        />

        <div className="explore-heading">
          <p>EXPLORE O IFA</p>
          <h1>
            Continue sua jornada pelo <span>Instituto.</span>
          </h1>
          <p className="explore-copy">
            Encontre parceiros que caminham com o <strong>IFA</strong> ou acompanhe os proximos
            <br />
            eventos, encontros e acoes voltadas para familias atipicas.
          </p>
        </div>

        <div className="explore-card">
          <article className="explore-option explore-option-events">
            <div className="explore-option-title">
              <CalendarDays />
              <h2>Calendario de eventos</h2>
            </div>
            <p>
              Acompanhe palestras, encontros e acoes do
              <br />
              <strong>IFA.</strong> Um espaco para ficar por dentro dos
              <br />
              proximos eventos e oportunidades de conexao.
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
              Encontre profissionais, clinicas e servicos parceiros
              <br />
              do <strong>IFA.</strong> Uma rede criada para ajudar familias atipicas
              <br />
              com mais apoio, beneficios e seguranca na escolha.
            </p>
            <button type="button">
              Explorar rede
              <ArrowRight />
            </button>
          </article>
        </div>

        <button className="explore-mouse" type="button" aria-label="Proxima secao" onClick={goToNext}>
          <img src={asset("MOUSE.png")} alt="" />
        </button>
      </div>
    </motion.section>
  );
}

const faqItems = [
  {
    question: "O que e o Metodo de Continuidade IFA?",
    answer:
      "E a metodologia utilizada pelo Instituto Futuro Atipico para compreender a realidade de cada familia, identificar prioridades e construir um planejamento personalizado voltado a manutencao da rotina do filho na hipotese de improdutividade dos pais e sua ausencia definitiva.",
  },
  {
    question: "O IFA vende apenas seguro de vida?",
    answer:
      "Nao. O seguro pode fazer parte da solucao, mas o trabalho do IFA comeca antes disso. Primeiro, entendemos a realidade da familia, os custos, a rotina, a rede de apoio e os riscos. A partir dessa analise, e construido um planejamento de protecao financeira sob medida.",
  },
  {
    question: "Por que esse planejamento e importante para familias atipicas?",
    answer:
      "Familias atipicas enfrentam jornadas financeiras e emocionais singulares. O planejamento do IFA garante que, em qualquer cenario, a continuidade dos cuidados e terapias esteja assegurada, trazendo previsibilidade e seguranca para o futuro.",
  },
  {
    question: "Como funciona o primeiro atendimento do IFA?",
    answer:
      "O primeiro atendimento acontece por meio do Diagnostico Familiar, a etapa inicial do Metodo de Continuidade IFA. Nesse encontro, conhecemos a realidade da sua familia, compreendemos a rotina, identificamos prioridades, avaliamos riscos, custos e a rede de apoio para construir os primeiros passos de um planejamento personalizado.",
  },
  {
    question: "O IFA atende familias em qualquer cidade?",
    answer: "Sim. O IFA atende familias brasileiras em qualquer parte do Brasil e do mundo.",
  },
  {
    question: "Tenho segurode vida. Ainda faz sentido conversar com o IFA?",
    answer:
      "Sim. Realizamos uma auditoria do que voce ja possui para verificar se os valores e coberturas estao realmente alinhados com as necessidades especificas do contexto da sua familia hoje.",
  },
  {
    question: "Preciso ter tudo organizado antes de falar com o IFA?",
    answer:
      "Nao. Parte do nosso trabalho e justamente ajudar voce a organizar esse quebra-cabeca. Voce traz a sua realidade e nos trazemos o metodo para estruturar o seu futuro.",
  },
  {
    question: "O plano e igual para todas as familias?",
    answer:
      "Absolutamente nao. Cada familia atipica tem sua propria dinamica. Nossas solucoes sao 100% personalizadas apos um diagnostico profundo das suas necessidades e objetivos.",
  },
  {
    question: "E se agora nao for o melhor momento financeiro?",
    answer:
      "Justamente por isso o planejamento e vital. Ajudamos a priorizar os riscos mais urgentes e a construir uma estrategia que caiba no seu orcamento atual, evoluindo conforme sua realidade muda.",
  },
  {
    question: "O que acontece depois da contratacao?",
    answer:
      "O IFA torna-se um parceiro de longo prazo. Fazemos revisoes periodicas do plano para garantir que ele continue fazendo sentido conforme a vida e as leis evoluem.",
  },
];

function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0, 1, 2]);

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
          alt="Instituto Futuro Atipico"
        />

        <div className="faq-heading">
          <p>PERGUNTAS FREQUENTES</p>
          <h1>
            Duvidas comuns antes de <span>comecar.</span>
          </h1>
          <p className="faq-copy">
            Algumas respostas para ajudar sua familia a entender melhor como o <strong>IFA</strong>
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
              <img src={asset("LOGO IFA BRANCA.png")} alt="Instituto Futuro Atipico" />
              <p>Protecao financeira, orientacao e acolhimento para familias atipicas.</p>
              <div className="footer-socials" aria-label="Canais sociais">
                <button type="button" aria-label="Instagram">
                  <Instagram />
                </button>
                <button type="button" aria-label="Mensagem">
                  <MessageSquare />
                </button>
              </div>
            </div>

            <nav className="footer-links" aria-label="Links rapidos">
              <h2>Links rapidos</h2>
              <button type="button">Inicio</button>
              <button type="button">Dores e rotina</button>
              <button type="button">Hub de solucoes</button>
              <button type="button">Historias atendidas</button>
              <button type="button">Quem somos</button>
              <button type="button">Seja parceiro</button>
            </nav>

            <nav className="footer-links" aria-label="Paginas">
              <h2>Paginas</h2>
              <button type="button">Rede de parceiros</button>
              <button type="button">Calendario de eventos</button>
            </nav>

            <div className="footer-cta">
              <h2>Ainda tem duvidas?</h2>
              <p>Fale com o IFA e entenda como comecar essa conversa com clareza e acolhimento.</p>
              <button type="button">
                Fale com o IFA
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Instituto Futuro Atipico. Todos os direitos reservados.</p>
            <p>
              Desenvolvido por <strong>Aguia Digital</strong>
            </p>
          </div>
        </footer>
      </div>
    </motion.section>
  );
}

export default App;
