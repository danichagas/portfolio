import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { NAV_ITEMS, SectionId, Sidebar } from './components/Sidebar';
import { CosmosBackground } from './components/CosmosBackground';
import { Spotlight } from './components/Spotlight';

interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  href?: string;
  description: string;
  tags: string[];
}

interface ProjectItem {
  title: string;
  href?: string;
  description: string;
  highlight?: string;
  thumbnail: string;
  thumbnailAlt: string;
  tags: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    period: '2026 — Atual',
    role: 'Assistente de TI',
    company: 'Inovare',
    href: 'https://www.inovareempreendimentos.com.br/index.php',
    description:
      'Atuação no suporte técnico (help desk) prestando atendimento aos usuários para resolução de demandas de hardware, software, redes e periféricos. Experiência na configuração de estações de trabalho, instalação de sistemas operacionais, manutenção preventiva de máquinas, gestão de inventário de ativos, controle de acessos e organização de rotinas administrativas do setor de TI.',
    tags: ['GLPI', 'Redes', 'WordPress'],
  },
  {
    period: 'JUN — NOV 2025',
    role: 'Node.js Developer',
    company: 'Compass UOL',
    href: 'https://compass.uol/pt/carreiras/',
    description:
      'Estagiário de Desenvolvimento Backend no programa de bolsas da Compass UOL, atuando na construção de APIs e sistemas escaláveis com TypeScript, Node.js, NestJS e Express. Experiência com comunicação assíncrona (RabbitMQ e Kafka), bancos de dados NoSQL (MongoDB/Mongoose) e infraestrutura em nuvem com Docker, Kubernetes e AWS EC2, operando em equipes ágeis (Scrum e Kanban).',
    tags: [
      'Typescript',
      'Node.js',
      'Nest.js',
      'Express.js',
      'MongoDB',
      'AWS',
      'Docker',
      'Kubernetes',
      'RabbitMQ',
      'Kafka',
      'Microservices',
    ],
  },
];

const PROJECTS: ProjectItem[] = [
  {
    title: 'Route Optimizer API',
    href: 'https://github.com/danichagas/Route-Optimizer-API',
    description:
      'Esta API tem como objetivo principal criar um algoritmo de backend capaz de otimizar a rota de entrega de um caminhão. O sistema receberá uma lista de pontos de entrega (com coordenadas) e determinará a ordem de visitação que minimize a distância total percorrida, garantindo a maior eficiência logística.',
    thumbnail: '/projects/route-optimizer.jpg',
    thumbnailAlt: 'Prévia visual do projeto Route Optimizer API',
    tags: [
      'TypeScript',
      'Node.js',
      'Nest.js',
      'JWT',
      'Docker',
      'Kubernetes',
      'MongoDB',
      'Mongoose',
    ],
  },
  {
    title: 'Url Shortener',
    href: 'https://github.com/danichagas/url-shortener',
    description:
      'API REST de alta performance para encurtamento de URLs construída sob arquitetura modular, persistência de dados orientada a documentos em MongoDB e ambiente padronizado via Docker.',
    thumbnail: '/projects/url-shortener.jpg',
    thumbnailAlt: 'Prévia visual do projeto Url Shortener',
    tags: ['Typescript', 'Node.js', 'Docker', 'MongoDB', 'Mongoose'],
  },
];

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        Pular para o conteúdo
      </a>

      <CosmosBackground />
      <Spotlight />

      <div className="relative z-10 mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:flex lg:justify-between lg:gap-16 lg:px-24 lg:py-0">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        <main id="conteudo" className="pt-16 lg:w-[50%] lg:py-24">
          {/* Seção: Sobre */}
          <section
            id="sobre"
            aria-labelledby="heading-sobre"
            style={{ animationDelay: '180ms' }}
            className="animate-fade-in mb-24 scroll-mt-16 lg:mb-36 lg:scroll-mt-24"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
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
            style={{ animationDelay: '280ms' }}
            className="animate-fade-in mb-24 scroll-mt-16 lg:mb-36 lg:scroll-mt-24"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
              <h2
                id="heading-experiencia"
                className="text-sm font-bold uppercase tracking-widest text-slate-200"
              >
                Experiência
              </h2>
            </div>

            <ol className="group/list space-y-12">
              {EXPERIENCES.map((item) => (
                <li
                  key={`${item.period}-${item.company}`}
                  className="transition-opacity duration-300 lg:group-hover/list:opacity-50 lg:hover:!opacity-100"
                >
                  <article className="group relative -mx-4 grid grid-cols-1 gap-2 rounded-md p-4 transition-all duration-300 sm:grid-cols-8 sm:gap-6 hover:bg-slate-800/50 hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] hover:drop-shadow-lg">
                    <header
                      className="z-10 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2"
                      aria-label={item.period}
                    >
                      {item.period}
                    </header>

                    <div className="z-10 sm:col-span-6">
                      <h3 className="font-medium leading-snug text-slate-200">
                        <a
                          href={item.href ?? '#experiencia'}
                          target={
                            item.href?.startsWith('http') ? '_blank' : undefined
                          }
                          rel={
                            item.href?.startsWith('http')
                              ? 'noreferrer noopener'
                              : undefined
                          }
                          className="inline-flex items-baseline rounded-sm font-medium leading-tight text-slate-200 transition-colors group-hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
                        >
                          <span className="absolute inset-0 hidden rounded-md lg:block" />
                          <span>
                            {item.role} ·{' '}
                            <span className="inline-block">
                              {item.company}
                              <ArrowUpRight
                                aria-hidden="true"
                                className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                              />
                            </span>
                          </span>
                        </a>
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
                    </div>
                  </article>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <a
                href={`${import.meta.env.BASE_URL}projects/Daniel%20Chagas%20Curriculo.pdf`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Ver currículo completo em PDF (abre em nova aba)"
                className="group/link inline-flex items-baseline rounded-sm font-medium leading-tight text-slate-200 transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
              >
                <span>Ver currículo completo</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform duration-200 group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none"
                />
              </a>
            </div>
          </section>

          {/* Seção: Projetos */}
          <section
            id="projetos"
            aria-labelledby="heading-projetos"
            style={{ animationDelay: '380ms' }}
            className="animate-fade-in mb-24 scroll-mt-16 lg:mb-36 lg:scroll-mt-24"
          >
            <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
              <h2
                id="heading-projetos"
                className="text-sm font-bold uppercase tracking-widest text-slate-200"
              >
                Projetos
              </h2>
            </div>

            <ul className="group/list space-y-12">
              {PROJECTS.map((project) => (
                <li
                  key={project.title}
                  className="transition-opacity duration-300 lg:group-hover/list:opacity-50 lg:hover:!opacity-100"
                >
                  <article className="group relative -mx-4 grid grid-cols-1 gap-4 rounded-md p-4 transition-all duration-300 sm:grid-cols-8 sm:gap-6 hover:bg-slate-800/50 hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] hover:drop-shadow-lg">
                    <div className="z-10 sm:col-span-2">
                      <img
                        src={project.thumbnail}
                        alt={project.thumbnailAlt}
                        loading="lazy"
                        width={200}
                        height={112}
                        className="aspect-video w-full max-w-[200px] rounded border-2 border-slate-200/10 object-cover transition duration-300 sm:max-w-none sm:translate-y-1 group-hover:border-slate-200/30"
                      />
                    </div>

                    <div className="z-10 sm:col-span-6">
                      <h3 className="font-medium leading-snug text-slate-200">
                        <a
                          href={project.href ?? '#projetos'}
                          target={
                            project.href?.startsWith('http')
                              ? '_blank'
                              : undefined
                          }
                          rel={
                            project.href?.startsWith('http')
                              ? 'noreferrer noopener'
                              : undefined
                          }
                          className="inline-flex items-baseline rounded-sm font-medium leading-tight text-slate-200 transition-colors group-hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
                        >
                          <span className="absolute inset-0 hidden rounded-md lg:block" />
                          <span>
                            {project.title}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                          </span>
                        </a>
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {project.description}
                      </p>

                      {project.highlight && (
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                          <Sparkles
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-teal-300"
                          />
                          <span>{project.highlight}</span>
                        </p>
                      )}

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
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <footer
            style={{ animationDelay: '460ms' }}
            className="animate-fade-in max-w-md pb-16 text-sm leading-relaxed text-slate-500 sm:pb-0"
          >
            <p>
              Desenvolvido com{' '}
              <span className="font-medium text-slate-400">React</span>,{' '}
              <span className="font-medium text-slate-400">Vite</span>,{' '}
              <span className="font-medium text-slate-400">TypeScript</span>,{' '}
              <span className="font-medium text-slate-400">Tailwind CSS</span>. <br />{' '}
               Código-fonte disponível no{' '}
              <a
                href="https://github.com/danichagas"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Ver código-fonte do portfólio no GitHub"
                className="rounded-sm font-medium text-slate-400 transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
              >
                GitHub
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
