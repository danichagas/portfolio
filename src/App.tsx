import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS, SectionId, Sidebar } from './components/Sidebar';
import { Spotlight } from './components/Spotlight';

export function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('sobre');
  const isManualScrollingRef = useRef(false);
  const manualScrollTimeoutRef = useRef<number | null>(null);

  const handleSelectSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    isManualScrollingRef.current = true;

    if (manualScrollTimeoutRef.current !== null) {
      window.clearTimeout(manualScrollTimeoutRef.current);
    }

    manualScrollTimeoutRef.current = window.setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const entriesMap = new Map<SectionId, IntersectionObserverEntry>();

    const updateActiveFromEntries = () => {
      if (isManualScrollingRef.current) return;

      if (window.scrollY <= 24) {
        setActiveSection(NAV_ITEMS[0].id);
        return;
      }

      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;

      if (reachedBottom) {
        setActiveSection(NAV_ITEMS[NAV_ITEMS.length - 1].id);
        return;
      }

      let bestSection: SectionId | null = null;
      let highestRatio = 0;

      for (const item of NAV_ITEMS) {
        const entry = entriesMap.get(item.id);
        if (entry?.isIntersecting && entry.intersectionRatio >= highestRatio) {
          highestRatio = entry.intersectionRatio;
          bestSection = item.id;
        }
      }

      if (bestSection) {
        setActiveSection(bestSection);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entriesMap.set(entry.target.id as SectionId, entry);
        }
        updateActiveFromEntries();
      },
      {
        root: null,
        rootMargin: '-15% 0px -45% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    for (const item of NAV_ITEMS) {
      const section = document.getElementById(item.id);
      if (section) {
        observer.observe(section);
      }
    }

    window.addEventListener('scroll', updateActiveFromEntries, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveFromEntries);
      if (manualScrollTimeoutRef.current !== null) {
        window.clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-400 selection:bg-teal-300 selection:text-slate-900">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-teal-400/10 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-teal-300 focus:ring-1 focus:ring-teal-300/40 focus:outline-none"
      >
        Pular para o conteúdo
      </a>

      <Spotlight />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:flex lg:justify-between lg:gap-4 lg:px-24 lg:py-0">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        <main id="conteudo" className="pt-20 lg:w-[52%] lg:py-24">
          {/* Seção: Sobre */}
          <section
            id="sobre"
            aria-labelledby="heading-sobre"
            className="mb-24 scroll-mt-16 lg:mb-36 lg:scroll-mt-24"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2
                id="heading-sobre"
                className="text-sm font-bold uppercase tracking-widest text-slate-200"
              >
                Sobre
              </h2>
            </div>

            <div className="space-y-4 leading-relaxed text-slate-400">
              <p>
                Olá, eu sou o Daniel, Engenheiro de Software apaixonado por construir aplicações completas, da arquitetura do servidor à interface do usuário. Acredito que o bom software nasce do {' '}
                <span className="font-medium text-slate-200">
                  equilíbrio
                </span>{' '}
                 entre um design minimalista e intuitivo no front-end e um código limpo, escalável e bem estruturado no back-end.
              </p>
              <p>
                Atualmente, concentro meu trabalho no desenvolvimento web full stack, projetando APIs robustas, modelando bancos de dados eficientes e criando interfaces modernas e responsivas. Gosto de atuar em todas as etapas do ciclo de vida do {' '}
                <a
                  className="font-medium text-slate-200"
                >
                  software
                </a>
                , colaborando para transformar regras de negócio complexas em produtos digitais fluidos e confiáveis.
              </p>
              <p>
                Fora do código em produção, estou em constante aprendizado explorando novas arquiteturas, boas práticas de engenharia e compartilhando conhecimento por meio de projetos abertos e estudos contínuos sobre tecnologia, e também sou apaixonado por esportes .
              </p>
            </div>
          </section>

          {/* Seção: Experiência */}
          <section
            id="experiencia"
            aria-labelledby="heading-experiencia"
            className="mb-24 scroll-mt-16 lg:mb-36 lg:scroll-mt-24"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2
                id="heading-experiencia"
                className="text-sm font-bold uppercase tracking-widest text-slate-200"
              >
                Experiência
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  period: '2026 — Presente',
                  role: 'Assistente de TI',
                  company: 'Inovare',
                  description:
                    'Atuação no suporte técnico (help desk) prestando atendimento aos usuários para resolução de demandas de hardware, software, redes e periféricos. Experiência na configuração de estações de trabalho, instalação de sistemas operacionais, manutenção preventiva de máquinas, gestão de inventário de ativos, controle de acessos e organização de rotinas administrativas do setor de TI.',
                  tags: ['GLPI', 'Redes', 'WordPress'],
                },
                {
                  period: 'JUN — NOV 2025',
                  role: 'Node.js Developer',
                  company: 'Compass UOL',
                  description:
                    'Descrição placeholder sobre desenvolvimento de interfaces responsivas, integrações de APIs e evolução contínua da plataforma.',
                  tags: ['Typescript', 'Node.js', 'Nest.js', 'Express.js', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'RabbitMQ', 'Kafka', 'Microservices']
                },
              ].map((item) => (
                <article
                  key={item.period}
                  className="group relative rounded-lg border border-transparent p-5 transition-all hover:border-slate-700/40 hover:bg-slate-800/50"
                >
                  <header className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {item.period}
                  </header>
                  <h3 className="font-medium leading-snug text-slate-200 transition-colors group-hover:text-teal-300">
                    {item.role} · {item.company}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                  <ul
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label="Tecnologias utilizadas"
                  >
                    {item.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Seção: Projetos */}
          <section
            id="projetos"
            aria-labelledby="heading-projetos"
            className="mb-24 scroll-mt-16 lg:mb-36 lg:scroll-mt-24"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2
                id="heading-projetos"
                className="text-sm font-bold uppercase tracking-widest text-slate-200"
              >
                Projetos
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: 'Route Optimizer API',
                  description:
                    'Esta API tem como objetivo principal criar um algoritmo de backend capaz de otimizar a rota de entrega de um caminhão. O sistema receberá uma lista de pontos de entrega (com coordenadas) e determinará a ordem de visitação que minimize a distância total percorrida, garantindo a maior eficiência logística.',
                  tags: ['TypeScript', 'Node.js', 'Nest.js', 'JWT', 'Docker', 'Kubernetes', 'MongoDB', 'Mongoose'],
                },
                {
                  title: 'Url Shortener',
                  description:
                    'API REST de alta performance para encurtamento de URLs construída sob arquitetura modular, persistência de dados orientada a documentos em MongoDB e ambiente padronizado via Docker.',
                  tags: ['Typescript', 'Node.js', 'Docker', 'MongoDB', 'Mongoose'],
                },
              ].map((project) => (
                <article
                  key={project.title}
                  className="group relative rounded-lg border border-transparent p-5 transition-all hover:border-slate-700/40 hover:bg-slate-800/50"
                >
                  <h3 className="inline-flex items-center gap-1.5 font-medium leading-snug text-slate-200 transition-colors group-hover:text-teal-300">
                    <span>{project.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>
                  <ul
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label="Tecnologias utilizadas"
                  >
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <footer className="max-w-md pb-16 text-xs leading-relaxed text-slate-500 sm:pb-0">
            <p>
              Estrutura base construída com{' '}
              <span className="font-medium text-slate-400">React</span>,{' '}
              <span className="font-medium text-slate-400">TypeScript</span> e{' '}
              <span className="font-medium text-slate-400">Tailwind CSS</span>,
              utilizando a tipografia{' '}
              <span className="font-medium text-slate-400">Inter</span>.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
