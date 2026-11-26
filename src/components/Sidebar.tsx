import type { MouseEvent } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export type SectionId = 'sobre' | 'experiencia' | 'projetos';

interface NavItem {
  id: SectionId;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'projetos', label: 'Projetos' },
];

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (id: SectionId) => void;
}

export function Sidebar({ activeSection, onSelectSection }: SidebarProps) {
  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: SectionId,
  ) => {
    event.preventDefault();
    onSelectSection(id);

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[45%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          <a
            href="#"
            className="transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none"
          >
            Daniel Chagas
          </a>
        </h1>

        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Software Enginner
        </h2>

        <p className="mt-4 max-w-xs line-clamp-2 leading-normal text-slate-400">
          Desenvolvedor focado em performance e experiência.
        </p>

        <nav className="mt-10 lg:mt-16" aria-label="Navegação entre seções">
          <ul className="w-max space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavClick(event, item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className="group flex items-center py-3 focus-visible:outline-none"
                  >
                    <span
                      className={`mr-4 h-px transition-all duration-300 motion-reduce:transition-none ${
                        isActive
                          ? 'w-16 bg-slate-200'
                          : 'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-xs uppercase tracking-widest transition-all duration-300 ${
                        isActive
                          ? 'font-semibold text-slate-200'
                          : 'font-medium text-slate-500 group-hover:font-semibold group-hover:text-slate-200 group-focus-visible:font-semibold group-focus-visible:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <ul
        className="mt-8 ml-1 flex items-center gap-5 lg:mt-0"
        aria-label="Redes sociais e contato"
      >
        <li>
          <a
            href="https://github.com/danichagas"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub (abre em nova aba)"
            title="GitHub"
            className="block text-slate-400 transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" strokeWidth={1.75} />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/danichagasdev/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn (abre em nova aba)"
            title="LinkedIn"
            className="block text-slate-400 transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" strokeWidth={1.75} />
          </a>
        </li>
        <li>
          <a
            href="mailto:chagasdaniel788@gmail.com"
            aria-label="Enviar e-mail"
            title="E-mail"
            className="block text-slate-400 transition-colors hover:text-teal-300 focus-visible:text-teal-300 focus-visible:outline-none"
          >
            <span className="sr-only">E-mail</span>
            <Mail className="h-6 w-6" strokeWidth={1.75} />
          </a>
        </li>
      </ul>
    </header>
  );
}
