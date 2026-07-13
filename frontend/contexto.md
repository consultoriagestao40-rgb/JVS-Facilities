# Contexto — Redesign das Landing Pages (Grupo JVS Facilities)

> Documento vivo. Registra o contexto, o backlog e o histórico das alterações de
> design, SEO e conteúdo das landing pages. **Atualize este arquivo a cada tarefa concluída.**

## Regra fixa (ler antes de qualquer alteração visual)
SEMPRE consultar e seguir `frontend/design_system_jvs.md` como **fonte de verdade**
de cores, tipografia, gradientes, ícones e padrões de componente antes de qualquer
alteração visual. Os tokens desse arquivo têm prioridade sobre valores hardcoded no código.

## Objetivo e escopo
Refazer o estilo (design), o SEO e o conteúdo das landing pages, mantendo o backend
intocado. Trabalho exclusivamente no frontend (`frontend/`).

Páginas no escopo:
- Home — `frontend/src/app/page.tsx` (seções em `frontend/src/components/home/`)
- Altura — `frontend/src/app/altura/page.tsx`

## Diretrizes de marca/design (resumo do design_system_jvs.md)
Fonte de verdade: `frontend/design_system_jvs.md`. Tokens oficiais:
- Primary (azul-marinho corporativo): `#0E2240` — confiança, autoridade, segurança
- Primary light: `#1E3A63`
- Accent (dourado premium): `#C5A059` — excelência/qualidade
- Accent light: `#DFCE9F`
- Fundo claro: `#FFFFFF` | Fundo alternado: `#F4F7FA`
- Texto principal: `#1E293B` (slate-800) | Texto secundário: `#64748B` (slate-500)
- Bordas/divisores: `#E2E8F0` (slate-200)
- Gradientes: `gradient-hero` (`#0E2240` → `#1A365D`), `gradient-gold-cta` (`#C5A059` → `#E5C483`)
- Tipografia: Inter/Montserrat (títulos), Inter/Open Sans (corpo); `leading-relaxed`
- Raio de borda padrão: `8px` (`rounded-lg`)

Atenção: o `tailwind.config.ts` atual usa **verde `#10B981`** como primary — isso
**diverge** do design system e precisa ser alinhado (ver tarefa D1).

## Backlog de tarefas
Status: `[ ]` pendente · `[~]` em andamento · `[x]` concluída

### Design
- [x] D1 — Alinhar tokens/paleta do `tailwind.config.ts` ao `design_system_jvs.md` (tokens `jvs` + gradientes adicionados de forma aditiva; Home, /altura e /simulador migrados para `jvs-navy/gold`)
- [x] D2 — Tipografia e hierarquia (Inter/Montserrat títulos; corpo com `leading-relaxed`) — Home mantém `font-heading` (Poppins) nos títulos e `font-sans` (Inter) no corpo
- [x] D3 — Hero da Home com `gradient-hero` e hierarquia visual clara
- [x] D4 — CTAs com `gradient-gold` (texto `#0E2240`, hover `scale-[1.02]`) — aplicado na /altura e na Home
- [x] D5 — Consistência entre seções da Home (Hero, Playbook, Governance, Benefits, Services, SocialProof, CTA final) seguindo o esquema de seções alternadas do design system
- [x] D6 — Coesão visual da página Altura e da Home com a nova identidade
- [x] D7 — Responsividade mobile-first e touch targets (mín. 44x44px) — na /altura, no carrossel e na Home
- [x] D8 — Estados de feedback (hover/focus/loading) e microanimações — na /altura, no carrossel e na Home
- [x] D9 — Footer global reestilizado (aplica-se a todas as páginas)

### SEO
- [ ] S1 — Metadata por página via Next Metadata API (title/description)
- [ ] S2 — Open Graph, Twitter cards e favicon
- [ ] S3 — HTML semântico (h1/h2 corretos, landmarks) e alt text nas imagens
- [ ] S4 — Dados estruturados JSON-LD (LocalBusiness/Service)
- [ ] S5 — `sitemap.ts` e `robots.ts` (App Router)
- [ ] S6 — Core Web Vitals: otimização de imagens (next/image) e lazy loading

### Conteúdo
- [ ] C1 — Revisar copy do Hero (proposta de valor clara e direta)
- [ ] C2 — CTAs consistentes e persuasivos em todas as páginas
- [ ] C3 — Prova social / números / depoimentos
- [ ] C4 — Conteúdo da página Altura (serviços, diferenciais)

## Assets faltantes
- Nenhum pendente no momento. `frontend/public/bg-altura.jpg` foi gerado por IA (ver changelog 2026-07-09). As demais imagens (`/images/portfolio/trabalho-1..8.jpg`, `/logos/cliente-1..7.png`) já existiam e continuam carregando normalmente.
- Novas pastas de assets gerados por IA: `frontend/public/images/home/` e `frontend/public/images/altura/`.
- **Ressalva**: o depoimento de "Carlos Mendes" (`SocialProof.tsx`) mantém o avatar de iniciais ("CM") — decidimos não gerar um rosto fake atribuído a um nome real. Trocar por foto real quando disponível.

## Changelog
Registrar aqui cada tarefa concluída: data, tarefa, o que mudou e arquivos afetados.

- **2026-07-08 — Redesign da LP /altura + Footer global (D4, D6, D7, D8, D9; D1 parcial)**
  - Tokens: adicionados namespace `jvs` (navy/gold/bg-alt/text/muted/border) e gradientes `gradient-hero`/`gradient-gold` (aditivo, sem alterar `primary/secondary`). Arquivo: `frontend/tailwind.config.ts`.
  - /altura: paleta migrada de emerald/indigo/multicores para navy+gold; Hero com `gradient-hero` e destaque dourado; cards `rounded-lg` com chips navy/gold; seção "Por que escolher a JVS" convertida em bloco escuro contido em container (`rounded-3xl`); Clientes e CTA final alinhados. Copy e imagens preservadas. Arquivo: `frontend/src/app/altura/page.tsx`.
  - Carrossel: novo componente de galeria com `scroll-snap` e setas prev/next (sem novas dependências) para "Nossos Trabalhos". Arquivo: `frontend/src/components/altura/PortfolioCarousel.tsx`.
  - Footer global: reestilizado no estilo da referência (fundo navy, cantos arredondados, ícones sociais em badges, acentos dourados), mantendo todo o conteúdo. Arquivo: `frontend/src/components/common/Footer.tsx`.

- **2026-07-08 — Refinamento conceitual da /altura a partir de 2ª imagem de referência (D6, D8)**
  - Extraídos da referência (somente estrutura, sem copiar cor/copy): tags numeradas em cards, painel escuro com **lista dividida por linhas** (em vez de blocos lado a lado) encerrado por **faixa de contraste na base** com CTA, título com efeito bicolor (sólido + contorno), acento decorativo (seta) junto a eyebrows.
  - Cards de Stats e Soluções: adicionadas tags numeradas (01–04), cards de Soluções alinhados à esquerda.
  - Painel "Por que escolher a JVS": reestruturado de blocos ícone+texto lado a lado com card de contato separado para uma **lista vertical dividida** (`divide-y`) + **faixa dourada de fechamento** no rodapé do painel contendo "Fale com um Especialista" + contato + CTA "Conversar no WhatsApp". CTA "Solicitar Orçamento" preservado como link inline dentro do item da lista.
  - Título do CTA final com efeito sólido+contorno ("Pronto para Transformar" / "suas Fachadas?"); acentos de seta nos eyebrows "Por que escolher a JVS?" e "Portfólio".
  - Todo o copy, links, tracking (`gtag.reportConversion`) e imagens preservados sem alteração. Arquivo: `frontend/src/app/altura/page.tsx`.

- **2026-07-08 — Reformulação livre da /altura para conversão (layout autoral, D6, D7, D8)**
  - Reescrita completa do layout da página mantendo **apenas** tipografia (Inter), paleta (`jvs-navy`/`jvs-gold`), imagens e copy originais. Estrutura e composição visual redesenhadas do zero com foco em hierarquia e conversão.
  - Hero: mais dramático (maior altura, blobs decorativos com blur, badge com ícone, animação de entrada com Framer Motion, scroll-cue animado no rodapé da seção).
  - Stats: unificados em uma **única barra flutuante** (antes eram 4 cards separados) sobrepondo a transição do Hero, com ícone, número e divisores internos; responsivo (`divide-y` no mobile, `divide-x` no desktop).
  - Soluções: cards com **numeral fantasma** grande (01–04) no fundo, elevação e borda dourada no hover, entrada com stagger (Framer Motion).
  - Painel "Por que escolher a JVS": mantido o conceito de lista dividida + faixa dourada; adicionado hover de destaque por linha e blob decorativo.
  - Portfólio: `PortfolioCarousel` evoluído com `IntersectionObserver` para detectar item ativo, **indicadores (dots)** clicáveis e sincronizados, overlay com numeração ao passar o mouse na imagem.
  - Clientes: logos em cartões individuais com sombra e borda (antes apenas grayscale solto).
  - CTA final: convertido de seção full-bleed para **painel escuro contido** (`rounded-3xl`), ecoando o mesmo padrão do painel de Diferenciais, criando ritmo visual consistente antes do rodapé.
  - Corrigido pequeno problema de área de clique sobreposta entre os dots do carrossel (ajuste de padding/gap).
  - Validado visualmente em desktop e mobile (390px) via navegador; nenhum erro de lint introduzido.
  - Arquivos: `frontend/src/app/altura/page.tsx`, `frontend/src/components/altura/PortfolioCarousel.tsx`.

- **2026-07-08 — Reformulação livre da Home para conversão + migração de paleta (D1 parcial, D2, D3, D4, D5, D6, D7, D8)**
  - Decisão confirmada com o usuário: migrar a Home da paleta antiga (`primary` verde `#10B981`, gradientes emerald/cyan, `slate`) para a paleta oficial `jvs-navy`/`jvs-gold`, ficando visualmente consistente com a `/altura`. Tipografia (Poppins nos títulos via `font-heading`, Inter no corpo), imagens (logos de clientes) e todo o copy preservados exatamente como estavam.
  - **Hero**: fundo `gradient-hero` com blobs decorativos dourados (antes slate + primary/secondary); badges de prova com acento `jvs-gold`; CTA primário em `gradient-gold` (pill), CTA secundário outline translúcido; mockup do simulador recolorido em tons navy/dourado; corrigido bug de z-index que escondia parcialmente o card flutuante "Economia estimada". Arquivo: `frontend/src/components/home/Hero.tsx`.
  - **PlaybookSection**: cards com **numeral fantasma** (01–06), ícone em caixa navy com hover dourado, bullets com marcador dourado, CTAs em `gradient-gold`/outline. Arquivo: `frontend/src/components/home/PlaybookSection.tsx`.
  - **GovernanceSection**: badges dos 4 tiers recolorados de forma temática — Bronze (neutro `jvs-bg-alt`), Prata (neutro `slate`), Ouro (`jvs-gold`, ring dourado, CTA `gradient-gold`) e Diamante (`jvs-navy`, ring navy, CTA navy sólido) — os dois tiers premium usam diretamente as cores da marca. Painel "Padrões mínimos garantidos" convertido de cinza-claro para **painel escuro contido** (`gradient-hero`, `rounded-3xl`), ecoando o mesmo padrão visual da /altura. Toda a lógica de planos e abertura de modal preservada. Arquivo: `frontend/src/components/home/GovernanceSection.tsx`.
  - **WhatsAppModal**: header e CTA recoloridos (`gradient-hero` no cabeçalho, `gradient-gold` no botão de envio, focus rings dourados), lógica de formulário e mensagens por tier 100% preservada. Arquivo: `frontend/src/components/home/WhatsAppModal.tsx`.
  - **Benefits** e **Services**: mesmo padrão de card com **numeral fantasma**, ícone navy com hover dourado, usado na /altura e no Playbook — unifica a linguagem visual entre todas as seções de cards da Home. Arquivos: `frontend/src/components/home/Benefits.tsx`, `frontend/src/components/home/Services.tsx`.
  - **SocialProof**: fundo `gradient-hero` (antes `slate-900`), stats com borda dourada lateral, logos de clientes em cartões individuais (antes grupo com grayscale coletivo), depoimento com ícone de aspas e avatar com iniciais "CM". Arquivo: `frontend/src/components/home/SocialProof.tsx`.
  - **CTA final**: convertido de faixa verde full-bleed para **painel escuro contido** (`rounded-3xl`, `gradient-gold` no botão), mesmo padrão usado na /altura. Arquivo: `frontend/src/app/page.tsx`.
  - Validado visualmente em desktop e mobile (390px) via navegador, incluindo teste funcional do modal do WhatsApp (tier OURO com campos condicionais); nenhum erro de lint introduzido.

- **2026-07-09 — Enriquecimento de /altura e Home com imagens geradas por IA (D6)**
  - Todas as imagens foram geradas por IA em estilo fotorrealista corporativo, consistente com as fotos reais já existentes em `frontend/public/images/portfolio/`. Novas pastas: `frontend/public/images/altura/` e `frontend/public/images/home/`.
  - **Hero /altura**: gerada a imagem que resolvia o 404 conhecido — técnico em corda limpando fachada de vidro. Salva diretamente em `frontend/public/bg-altura.jpg` (mesmo caminho já referenciado, sem alteração de código). Arquivo: `frontend/src/app/altura/page.tsx` (sem mudança de código).
  - **Hero Home**: o mockup abstrato de UI foi substituído por uma foto real (supervisor com tablet em ambiente corporativo, `images/home/hero.jpg`), mantendo o card flutuante "Economia estimada" sobreposto e adicionando um selo "Governança em campo". Arquivo: `frontend/src/components/home/Hero.tsx`.
  - **Services (Home)**: os 6 cards de serviço ganharam foto no topo (aspect 4:3) com o ícone sobreposto como selo circular no canto inferior esquerdo; numeral fantasma removido em favor da foto. Imagens: `servico-limpeza/recepcao/seguranca/jardinagem/manutencao/facilities.jpg`. Arquivo: `frontend/src/components/home/Services.tsx`.
  - **Soluções em Altura**: os 4 cards (Limpeza de Fachadas, Lavação de Vidros, Acesso por Corda, Parada de Fábrica) receberam o mesmo tratamento de foto no topo + ícone em selo + numeral discreto sobre a imagem. Arquivo: `frontend/src/app/altura/page.tsx`.
  - **Painel "Por que escolher a JVS"**: adicionada foto de apoio (equipe com EPI/certificação) como coluna lateral dentro do próprio painel escuro (`images/altura/diferenciais.jpg`), com overlay em gradiente para manter a leitura do texto. Arquivo: `frontend/src/app/altura/page.tsx`.
  - **CTAs finais**: adicionada imagem de fundo sutil com overlay `gradient-hero` (opacidade 90%) em ambas as páginas — textura de fachada de vidro ao entardecer na Home (`images/home/cta-bg.jpg`) e corda/mosquetão de acesso na /altura (`images/altura/cta-bg.jpg`), reforçando a sensação premium sem competir com o texto. Arquivos: `frontend/src/app/page.tsx`, `frontend/src/app/altura/page.tsx`.
  - **PlaybookSection (Home)**: cabeçalho da seção reestruturado em duas colunas — texto à esquerda, foto de apoio emoldurada à direita (auditoria de checklist em campo, `images/home/playbook-audit.jpg`) com selo flutuante "Conformidade média ≥ 85%". Arquivo: `frontend/src/components/home/PlaybookSection.tsx`.
  - Depoimento de "Carlos Mendes" mantido com avatar de iniciais (decisão ética documentada em "Assets faltantes").
  - Validado visualmente em desktop via navegador (Hero, Soluções, Diferenciais e CTA da /altura; Hero, Playbook, Services e CTA da Home); nenhum erro de lint introduzido.

- **2026-07-09 — Migração de identidade do /simulador para jvs-navy/gold (D1)**
  - Escopo estritamente de **cores/identidade** — nenhuma alteração de layout, estrutura, textos ou lógica. Objetivo: remover os últimos resquícios do antigo `primary` verde (`#10B981`, token legado do `tailwind.config.ts`) do fluxo do simulador, que ainda não tinha sido tocado nas rodadas anteriores.
  - Mapeamento aplicado: `bg-primary`/`hover:bg-green-600` (CTAs de avanço de etapa) → `bg-gradient-gold text-jvs-navy` (padrão "Primary Button" do design system); `focus:ring-primary` → `focus:ring-jvs-gold`; estados selecionados/ativos (cards de serviço, dias da semana, checkboxes) → `jvs-navy`/`jvs-gold` seguindo o mesmo padrão já usado no `WhatsAppModal`; painel escuro do card de investimento (`bg-slate-900`) → `bg-gradient-hero`; badge de sucesso e extrato de custos (`green-100/800/900`, `bg-black`) → `jvs-gold`/`jvs-navy`/`jvs-navy-light`, com a linha de "Preço Total Unitário" em destaque `bg-jvs-gold`.
  - Cores semânticas/informativas (azul para "Materiais", laranja para "Adicionais Legais/avisos", vermelho para erros/descontos) foram **mantidas intactas** — não fazem parte da identidade de marca removida.
  - Arquivos alterados: `frontend/src/app/simulador/page.tsx`, `frontend/src/components/simulador/SimuladorContainer.tsx`, `frontend/src/components/simulador/ResumoProposta.tsx`, `frontend/src/components/forms/CadastroInicial.tsx`, `frontend/src/components/forms/SelecaoServicos.tsx`, `frontend/src/components/forms/ConfiguracaoServicos.tsx`, `frontend/src/components/forms/ComposicaoCustos.tsx`, `frontend/src/components/common/PlanilhaCustos.tsx` (este último também é usado no painel admin — o recolorimento é compartilhado).
  - Validado visualmente percorrendo as 5 etapas do simulador (Dados → Serviços → Configuração → Custos → Proposta) e o modal de Extrato Detalhado; nenhum erro de lint introduzido.

- **2026-07-09 — WhatsApp nos botões (/altura), botão flutuante (Home) e variante da Home com simulador no topo (D6)**
  - Novo componente reutilizável `WhatsAppIcon` (SVG do glifo oficial da marca, `fill="currentColor"`), já que o `lucide-react` não possui o ícone do WhatsApp. Arquivo: `frontend/src/components/common/WhatsAppIcon.tsx`.
  - **/altura**: adicionado o ícone do WhatsApp (pequeno, herdando a cor do texto do botão para respeitar a paleta) nos 4 CTAs que apontam para o WhatsApp — "Solicitar Orçamento Agora" (hero), "Solicitar Orçamento" (link inline do painel de diferenciais), "Conversar no WhatsApp" (faixa dourada) e "FALAR COM CONSULTOR" (CTA final). Copy, links e tracking preservados. Arquivo: `frontend/src/app/altura/page.tsx`.
  - **Home**: novo `WhatsAppFloat` — botão flutuante fixo no canto inferior direito (`fixed bottom-6 right-6 z-50`), em verde de marca `#25D366`, com anel `animate-ping`, rótulo "Fale conosco" revelado no hover (desktop) e disparo de `gtag.reportConversion`. Montado apenas na Home. Arquivos: `frontend/src/components/common/WhatsAppFloat.tsx`, `frontend/src/app/page.tsx`.
  - **Nova rota `/home-simulador`**: cópia da Home em que o topo (lugar do Hero) passa a ser o próprio simulador, dentro de um hero `gradient-hero` com headline "Monte sua proposta de facilities em 5 minutos" e o `SimuladorContainer` em card branco (reaproveitando `SimuladorProvider` + `ErrorBoundary`, mesma lógica do `/simulador`). Demais seções (Playbook, Governance, Benefits, Services, SocialProof, CTA final) e o botão flutuante do WhatsApp mantidos iguais aos da Home. Arquivo: `frontend/src/app/home-simulador/page.tsx`.
  - Validado visualmente via navegador (ícones nos 4 botões da /altura, botão flutuante na Home e a nova variante `/home-simulador` com o simulador renderizando no topo); nenhum erro de lint introduzido.

- **2026-07-09 — 4 novas seções institucionais na Home e na /home-simulador (D2, D3, D4, D5, D6)**
  - Todas as seções foram criadas como componentes reutilizáveis em `frontend/src/components/home/` e inseridas nas **duas** páginas (`frontend/src/app/page.tsx` e `frontend/src/app/home-simulador/page.tsx`), seguindo a paleta `jvs-navy`/`jvs-gold`, tipografia (`font-heading`), cards `rounded-2xl` e animações Framer Motion já usadas no restante da Home.
  - **StatsSection** (`StatsSection.tsx`): faixa de estatísticas em fundo `gradient-hero` (funciona como "trust bar" logo abaixo do hero), com **contadores animados** (count-up via `requestAnimationFrame` disparado por `useInView`, `once`): +30 Anos (Atuação em Facilities), +100 Postos (Ativos), +200 Clientes (Atendidos), +100k m² (Limpeza em altura executada), +500k m² (Pisos tratados). Grid responsivo 2/3/5 colunas, ícones Lucide em selo.
  - **TechFeatureSection** (`TechFeatureSection.tsx`): seção escura (`gradient-hero`) em **layout Z (2 colunas alternadas)** com título "Gestão Operacional Data-Driven e em Tempo Real". Bloco 1 (NEXUS) — mesa de operações monitorada por IA, integração Secullum e alertas via WhatsApp — acompanhado de um **mockup ilustrativo** (dashboard com KPIs, notificação WhatsApp e status ao vivo). Bloco 2 (Check-list Fácil) — auditorias in loco com foto/SLA/ações corretivas — com mockup de checklist (itens, thumbs de foto, barra de SLA). Os mockups são placeholders estilizados com os tokens da marca, prontos para troca por screenshots reais do produto (comentado no código).
  - **RiskMitigationSection** (`RiskMitigationSection.tsx`): grid de 4 cards de compliance (`bg-jvs-bg-alt`) com ícones Lucide — Transparência Documental (`FileCheck`), Continuidade Operacional (`ShieldPlus`), Controle Online (`MonitorCheck`), Padronização Técnica (`Leaf`).
  - **ComparisonTable** (`ComparisonTable.tsx`): tabela comparativa estilo SaaS pricing (Mercado Tradicional vs. Padrão JVS) com 4 critérios (Gestão de Faltas, Cobertura Operacional, Auditoria, Passivo Trabalhista). Coluna "Padrão JVS" destacada em navy com badge "Recomendado" e checks dourados; coluna "Mercado" com X vermelho. **Responsiva**: grid de 3 colunas no desktop e cards empilhados no mobile (`md:hidden` / `hidden md:grid`). CTA "Quero o padrão JVS" ao final.
  - Ordem final das seções (idêntica nas duas páginas, com ritmo de fundos alternados): Hero/Simulador → **Stats (dark)** → Playbook (alt) → **TechFeature (dark)** → Governance (white) → **RiskMitigation (alt)** → Benefits (white) → Services (alt) → **ComparisonTable (white)** → SocialProof (dark) → CTA (alt).
  - Validado no navegador em ambas as rotas: contadores animando, mockups da seção de tecnologia, grid de compliance (opacidade confirmada via DOM) e tabela comparativa com colunas Mercado/JVS. Nenhum erro de lint introduzido.
