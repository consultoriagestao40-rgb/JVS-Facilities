# DESIGN SYSTEM TOKENS — GRUPO JVS FACILITIES
<!-- 
  Este arquivo serve como contexto global para o Cursor. 
  Utilize os tokens abaixo estritamente na geração de classes utilitárias ou CSS estrutural.
-->

## 1. Identidade e Estilo da Marca
* **Posicionamento:** Corporativo, robusto, altamente profissional, focado em segurança, confiança, tecnologia e higienização de alto padrão (B2B).
* **Diretrizes de Layout:** Estrutura limpa, blocos bem definidos, contraste elevado para legibilidade, bordas levemente arredondadas (`rounded-lg` / `8px`) e seções de conversão limpas e diretas.

## 2. Paleta de Cores (Color Tokens)

### Cores Primárias (Identidade Institucional)
* **Azul Marinho Corporativo (`color-primary`):** `#0E2240` (Confiança, Autoridade, Segurança)
* **Azul Linha de Frente (`color-primary-light`):** `#1E3A63`
* **Branco Puro/Fundo Cristal (`color-bg-light`):** `#FFFFFF` (Limpeza, Organização)

### Cores Secundárias e Acentos
* **Dourado Premium (`color-accent`):** `#C5A059` (Excelência, 20 anos de experiência, Qualidade)
* **Dourado Light (`color-accent-light`):** `#DFCE9F` (Hovers e sutilezas)
* **Azul Soft Clean (`color-bg-alt`):** `#F4F7FA` (Fundo alternado de seções, contraste leve)

### Neutros e Tipografia
* **Texto Escuro Principal (`color-text-dark`):** `#1E293B` (Slate-800 - Leitura confortável)
* **Texto Secundário / Labels (`color-text-muted`):** `#64748B` (Slate-500)
* **Bordas e Divisores (`color-border`):** `#E2E8F0` (Slate-200)

---

## 3. Degradês e Gradientes (Gradients)

Para manter o ar corporativo e moderno sem poluir o visual, utilize os gradientes abaixo em botões principais (CTAs) e fundos de heros/banners:

* **`gradient-hero` (Fundo Principal Profundo):** * *CSS:* `linear-gradient(135deg, #0E2240 0%, #1A365D 100%)`
    * *Tailwind:* `bg-gradient-to-br from-[#0E2240] to-[#1A365D]`
* **`gradient-gold-cta` (Botão de Alta Conversão / Premium):**
    * *CSS:* `linear-gradient(90deg, #C5A059 0%, #E5C483 100%)`
    * *Tailwind:* `bg-gradient-to-r from-[#C5A059] to-[#E5C483]`
* **`gradient-overlay` (Sobreposição em imagens de fundo):**
    * *CSS:* `linear-gradient(to bottom, rgba(14, 34, 64, 0.9), rgba(30, 58, 99, 0.85))`

---

## 4. Tipografia (Typography)

* **Títulos Principais (Headings - H1, H2, H3):**
    * *Família:* `Inter` ou `Montserrat`, sans-serif (Peso: `700` Bold ou `600` SemiBold)
    * *Estilo:* Imponente, caixa-alta apenas em tags ou subtítulos curtos de contexto.
* **Texto de Apoio e Corpo (Body):**
    * *Família:* `Inter` ou `Open Sans`, sans-serif (Peso: `400` Regular ou `500` Medium)
    * *Line Height:* Otimizado para leitura rápida (`leading-relaxed` / `1.6`).

---

## 5. Ícones Sugeridos (Lucide / FontAwesome / Heroicons Context)

Para representar as divisões de Facilities e Serviços Especializados do Grupo JVS:

* **Facilities / Limpeza e Conservação:** `Sparkles` ou `ShieldCheck` (Associação com higienização e preservação).
* **Portaria e Controle de Acesso:** `Lock` ou `Shield` (Segurança patrimonial, controle).
* **Recepção e Apoio Administrativo:** `UserCheck` ou `Briefcase` (Mão de obra corporativa).
* **Tratamento de Pisos / Revitalização:** `Layers` ou `Gem` (Brilho, cristalização).
* **Limpeza em Altura:** `TrendingUp` ou `ArrowUpCircle` (Segurança e foco técnico).
* **Suporte / Orçamento:** `Calendar` ou `FileText` (Ação direta para conversão).

---

## 6. Mapeamento de UI Helpers (Component Context)

* **Primary Button (CTA Orçamento):** Fundo `gradient-gold-cta`, texto `#0E2240` (Bold), efeito hover com aumento de brilho ou escala leve (`hover:scale-[1.02] transition-all`).
* **Cards de Serviço:** Fundo `#FFFFFF`, borda fina `#E2E8F0`, raio de borda `8px`, sombra sutil (`shadow-sm` que evolui para `shadow-md` no hover).
* **Seções Alternadas:** Iniciar com Hero em `gradient-hero` (texto claro), seguido de Benefícios em `#FFFFFF` (texto escuro), Serviços em `#F4F7FA`, e Prova Social / CTA final em `#0E2240`.
