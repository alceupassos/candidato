# Imagens a gerar — Cockpit de Campanha (candidato.angra.io)

Gere cada imagem com o prompt abaixo (modelo de sua preferência: Gemini "nano banana",
DALL·E/gpt-image-1, Grok, Midjourney, Flux…) e salve **com o nome exato** indicado, na pasta indicada.
O pipeline do app procura os arquivos em `public/ai/` (e usa fallback procedural/SVG quando ausentes).

## Diretrizes globais (aplique em TODAS)

- **Estética:** "war-room" político premium, escuro/cinematográfico. Paleta: **verde-esmeralda (#22c55e), dourado (#f0c030), azul-petróleo, quase-preto (#0f0f13)**.
- **Atmosfera:** profundidade, brilho sutil, partículas de dados, mapa do Brasil estilizado ao fundo, grão fino, vinheta.
- **Proibido:** texto/letras na imagem; logotipos; **rostos de pessoas reais/políticos reais** (nada de deepfake). Pessoas, quando houver, devem ser **genéricas/estilizadas ou silhuetas**.
- **Formato:** PNG. Sem marca d'água.

---

## 1. Fundos / Heros

| Arquivo            | Pasta        | Tamanho (px) | Uso                                 |
| ------------------ | ------------ | ------------ | ----------------------------------- |
| `hero-warroom.png` | `public/ai/` | 1920×1080    | Fundo do hero da landing / login    |
| `login-bg.png`     | `public/ai/` | 1600×1200    | Backdrop da tela de login           |
| `noc-banner.png`   | `public/ai/` | 1600×360     | Faixa da seção NOC (war-room)       |
| `motion-bg.png`    | `public/ai/` | 1280×720     | Fundo do "Motion Report" (Remotion) |

**Prompt `hero-warroom.png`:**

> Cinematic dark political campaign war-room, ultra-wide, deep emerald green and gold accent lighting, a glowing abstract map of Brazil made of light particles floating in the background, holographic data charts and bar graphs as soft bokeh, subtle grid floor, volumetric light, premium high-tech command center, fine film grain, vignette, no text, no logos, no human faces. 1920×1080, cinematic.

**Prompt `login-bg.png`:**

> Moody dark backdrop for a login screen, emerald-green and gold particle glow, faint Brazilian map silhouette, soft diagonal light streaks, premium minimal tech atmosphere, lots of negative space in the center for a form, no text, no faces. 1600×1200.

**Prompt `noc-banner.png`:**

> Wide cinematic banner of an election "war room / NOC", rows of glowing data screens with abstract maps and live charts, emerald and gold neon, dark teal ambiance, particle data streams, no readable text, no faces. 1600×360.

**Prompt `motion-bg.png`:**

> Abstract animated-looking background plate, emerald-to-gold gradient mesh, glowing Brazil map outline, floating numeric particles, dark premium, cinematic, no text, no faces. 1280×720.

---

## 2. Texturas / Overlays (tileáveis)

| Arquivo             | Pasta        | Tamanho   | Uso                                      |
| ------------------- | ------------ | --------- | ---------------------------------------- |
| `texture-grid.png`  | `public/ai/` | 1024×1024 | Overlay sutil de grade de dados (repeat) |
| `texture-grain.png` | `public/ai/` | 512×512   | Grão/noise sutil sobre o fundo (repeat)  |

**Prompt `texture-grid.png`:**

> Seamless tileable subtle technical grid texture, very dark transparent background, thin emerald lines with faint dots at intersections, blueprint/HUD style, low opacity, seamless edges. 1024×1024.

**Prompt `texture-grain.png`:**

> Seamless tileable fine film grain / monochrome noise texture, very subtle, transparent dark, for overlay. 512×512.

---

## 3. Avatares de papéis (Organizadores) — pessoas GENÉRICAS/estilizadas

| Arquivo                       | Pasta        | Tamanho | Papel             |
| ----------------------------- | ------------ | ------- | ----------------- |
| `avatar-lider-igreja.png`     | `public/ai/` | 512×512 | Líder de Igreja   |
| `avatar-gerente-regional.png` | `public/ai/` | 512×512 | Gerente Regional  |
| `avatar-deputado.png`         | `public/ai/` | 512×512 | Deputado Estadual |
| `avatar-cabo.png`             | `public/ai/` | 512×512 | Cabo Eleitoral    |
| `avatar-eleitor.png`          | `public/ai/` | 512×512 | Eleitor           |

**Estilo comum (todos):** ícone/avatar circular, flat-illustration premium, fundo escuro com leve glow esmeralda, **silhueta/pessoa genérica e estilizada (não realista, sem identidade)**, traço limpo, coeso entre si.

- `avatar-lider-igreja.png`: > Stylized circular avatar of a generic faith community leader (neutral silhouette holding an open book), flat premium illustration, dark background, emerald glow, purple accent ring. No real person. 512×512.
- `avatar-gerente-regional.png`: > Stylized circular avatar of a generic regional manager (neutral business silhouette with a map pin), flat premium illustration, dark background, blue accent ring. No real person. 512×512.
- `avatar-deputado.png`: > Stylized circular avatar of a generic legislator (neutral silhouette with a small institutional building icon), flat premium illustration, dark background, gold accent ring. No real person. 512×512.
- `avatar-cabo.png`: > Stylized circular avatar of a generic field campaign worker (neutral silhouette with a megaphone), flat premium illustration, dark background, emerald accent ring. No real person. 512×512.
- `avatar-eleitor.png`: > Stylized circular avatar of a generic voter (neutral silhouette with a ballot/check icon), flat premium illustration, dark background, light-blue accent ring. No real person. 512×512.

---

## 4. Ilustrações de apoio

| Arquivo                | Pasta        | Tamanho  | Uso                                          |
| ---------------------- | ------------ | -------- | -------------------------------------------- |
| `community-card.png`   | `public/ai/` | 800×600  | Card de comunidade/grupo WhatsApp            |
| `qr-frame.png`         | `public/ai/` | 600×600  | Moldura premium para QR Code de engajamento  |
| `rally-atmosphere.png` | `public/ai/` | 1600×900 | Atmosfera de mobilização (multidão genérica) |

- `community-card.png`: > Flat premium illustration of a WhatsApp-style community network: glowing nodes connected by lines forming a map of Brazil, green messaging bubbles, dark background, emerald/gold, no text, no faces. 800×600.
- `qr-frame.png`: > Decorative dark premium frame for a QR code (empty center, leave a white square area in the middle), emerald and gold corner accents, "scan me" energy without text, tech style. 600×600.
- `rally-atmosphere.png`: > Cinematic crowd of generic anonymous people at a political rally seen from behind at dusk, warm and green stage lights, brazilian flags as abstract color, motion blur, no recognizable faces, no text. 1600×900.

---

## 5. Observações

- **Fotos de candidatos reais** já existem em `public/candidatos/*.png` (Renato Araújo, Laura Carneiro, Crivella, Dr. Luizinho, Jorginho Brum etc.) — **não precisa gerar**.
- **Figuras nacionais** (Lula, Flávio Bolsonaro, Nikolas, etc.) no Ranking de Redes usam **avatar estilizado de iniciais** por padrão — **não gere rostos reais**.
- Depois de salvar as imagens em `public/ai/`, basta dar deploy (ou rodar `/api/ai/image` com créditos) que as telas passam a consumi-las automaticamente.
- Pasta `public/ai/` é criada automaticamente; se não existir, crie-a.
