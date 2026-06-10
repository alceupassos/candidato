# Painel do Candidato — "Vou me eleger?", Momentum e Head-to-head (Dashboard + NOC)

## Context

O cockpit (https://candidato.angra.io) tem Dashboard e NOC ricos em intenção/votos esperados, mas — verificado lendo `dashboard-section.tsx` e `noc-section.tsx` — **não respondem as 3 perguntas que mais importam ao candidato**:

1. **Vou me eleger?** Quociente/limiar eleitoral × projeção (estou dentro/fora da vaga, quantos votos faltam).
2. **Estou subindo ou caindo?** Momentum da intenção com destaque animado.
3. **Como estou vs. meus concorrentes diretos?** Head-to-head da mesma vaga.

O usuário aprovou a abordagem A: uma **faixa-herói "Painel do Candidato"** no topo do Dashboard e em versão compacta no topo do NOC. Objetivo: a primeira coisa que o candidato vê responde "estou ganhando?", de forma viva, gráfica e animada.

## Requisitos

- **Bloco Vaga:** gauge animado mostrando projeção vs. `votosParaEleger` (quociente eleitoral, Dep. Federal RJ = 46 vagas). Estado **dentro/fora** + **votos que faltam** (ou folga). Cor verde (dentro) / vermelho (fora).
- **Bloco Momentum:** delta da última onda da série de intenção + direção (▲/▼) com seta pulsando + **sparkline** (12 pts) atualizando ao vivo (tick).
- **Bloco Head-to-head:** o candidato (Renato Araújo) vs. top 3 concorrentes diretos da vaga — barras com gap, posição e marcação de ultrapassagem.
- Selo "ao vivo"; respeitar `body.cfg-no-anim` e `prefers-reduced-motion`.
- Determinístico; sem dado real não confirmado apresentado como oficial (quociente é estimativa rotulada).

## Arquitetura / Componentes

### Dados — `lib/mock/campaign-metrics.ts` (novo `getCandidatoPainel`)

Reusa funções existentes:

- `votosProjetados` ← `getExpectedVotesByRegion().total` (já existe).
- `votosParaEleger` ← quociente eleitoral estimado p/ Dep. Federal RJ: `Math.round(totalEleitorado() × comparecimento × validade / 46)` com fator de coligação; rotulado "estimativa". Valor plausível ~100–130k.
- `dentro` = projetados ≥ paraEleger; `faltam` = max(0, paraEleger − projetados); `folga` quando dentro.
- `momentum` ← `getIntencaoEvolution(region)`: `delta` = último − penúltimo; `dir`; `sparkline` = série (números).
- `headToHead` ← `getRaceRanking("dep-federal", region)`: candidato-alvo + concorrentes, com `gap` ao líder e `posicao`.

Retorno tipado `CandidatoPainel { votosProjetados, votosParaEleger, dentro, faltam, pctVaga, momentum{delta,dir,spark[]}, headToHead[{nome,partido,intencao,cor,alvo}] }`.

### Componente — `components/painel-candidato.tsx`

- Props `{ region: RegionId; compact?: boolean }`.
- 3 blocos: **Vaga** (`gaugeOption` ECharts + número "faltam X"), **Momentum** (`lineOption` sparkline + delta + seta CSS pulsante; tick `setInterval` 3s para micro-oscilação viva), **Head-to-head** (barras horizontais com o alvo destacado).
- `compact` reduz alturas/oculta rótulos longos (para o NOC).

### Integração

- `dashboard-section.tsx`: `<PainelCandidato region={region} />` logo após o `<Oraculo>`.
- `noc-section.tsx`: `<PainelCandidato region={region} compact />` após o `<Oraculo>`.
- `app/globals.css`: estilos `.painel-cand*` (war-room: dark, esmeralda/ouro, glow, seta pulsante), responsivo (empilha no mobile).

## Riscos / Decisões

- **Quociente eleitoral** é estimativa — exibir selo "estimativa" e basear em parâmetros plausíveis (comparecimento ~78%, validade ~92%, 46 vagas RJ). Nunca apresentar como número oficial do TSE.
- Não tocar nos cards existentes (mudança aditiva, sem regressão).

## Verificação

- `npm run lint` + `npm run build` exit 0.
- Dashboard e NOC mostram a faixa no topo; o **gauge** indica dentro/fora e "faltam X votos"; **momentum** mostra ▲/▼ coerente com a série; **head-to-head** bate com `getRaceRanking`.
- Mobile empilha; `cfg-no-anim` desliga animações; deploy público 200.
