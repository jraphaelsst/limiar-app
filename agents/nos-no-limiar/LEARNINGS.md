# nos-no-limiar — registro de aprendizados

Somente acréscimo. Mais novo primeiro. Cada entrada: data · tipo · aprendizado · evidência · status.
Tipos: `armadilha` · `prática` · `decisão`. Status: `novo` → `absorvido` (entrou em knowledge/) →
`promovido` (publicado numa nova versão do agente no produto de agentes).

| Data | Tipo | Aprendizado | Evidência | Status |
|---|---|---|---|---|
| 2026-10-04 | prática | Feedback §6 só reordena: "não combina comigo" tira aquela atividade (não a categoria inteira) e "menos disso" empurra a categoria para o fim sem escondê-la — autonomia e variedade; a privacidade diz "só mudam a ordem das sugestões" e isso tem de continuar verdade | limiar-app src/lib/recommend.ts, src/app/privacidade.tsx | novo |
| 2026-10-03 | armadilha | Toda chave nova guardada aparece em TRÊS textos: "O que fica guardado", a descrição da exportação e a confirmação de "Apagar dados" — atualizar só um deixa os outros falsos | limiar-app privacidade.tsx, perfil.tsx × storage.ts (revisão real) | novo |
| 2026-10-03 | armadilha | Pergunta de reflexão que busca origem ("De onde vem…?") em cartão de papel familiar abre interpretação de conflito (§4.5); preferir perguntas sobre o presente e a escolha dela | limiar-app src/data/games.ts (revisão real) | novo |
| 2026-10-03 | prática | Preferências (tela 16): mesmas opções e regra 3–5-ou-nenhum do onboarding; tempo livre ganha "Sem preferência" (não "Prefiro não dizer", que soa como dado pessoal); o resumo salvo aparece na linha do Perfil como confirmação | limiar-app src/app/preferencias.tsx, src/app/(tabs)/perfil.tsx | novo |
| 2026-10-03 | prática | Exportar dados (§10.3) precisa dizer a verdade sobre a cópia: o que foi enviado fica com quem recebe e "Apagar dados deste aparelho" não alcança essa cópia; o app só diz "compartilhado" quando o sistema confirma (no Android não confirma) | limiar-app src/app/privacidade.tsx | novo |
| 2026-10-03 | prática | Padrão do Jogo A como lista, não conjugado: "dois temas se repetiram: natureza e aprendizado" — a frase-exemplo da spec ("apareceram bastante X") quebra com temas que não são substantivos simples; resultado guardado não diz "hoje" | limiar-app src/data/games.ts patternSentence | novo |
| 2026-10-03 | armadilha | Toda nova chave guardada no aparelho torna falsa a lista "O que fica guardado" de privacidade.tsx até ela ser atualizada (veracidade) | limiar-app src/state/storage.ts gameAResults × src/app/privacidade.tsx | novo |
| 2026-10-03 | decisão | Acentos altos do Cormorant aceitos como caráter da marca | decisions.md; conhecimento: produto/identidade-visual | absorvido |
| 2026-10-03 | decisão | Boas-vindas sem fotografia (pluralidade, procedência da imagem, coerência com colagem) | decisions.md; conhecimento: produto/identidade-visual | absorvido |
| 2026-10-03 | decisão | Nos conflitos C1–C12, a spec vence por padrão; mockup manda em aparência | decisions.md; conhecimento: produto/produto-e-escopo | absorvido |
| 2026-10-03 | armadilha | A base editorial da marca parte de "sofrimento silencioso" e enquadramento clínico; no app isso viola §1.1/§1.5 — usar só como fundo | absorção da pasta nos-no-limiar; conhecimento: voz/voz-e-linguagem, marca/monica-e-tese | absorvido |
| 2026-10-03 | armadilha | A base da marca contradiz a si mesma (proíbe "cansaço"/"esgotamento" e usa nos hooks) — não herdar os hooks | absorção da pasta nos-no-limiar; conhecimento: voz/voz-e-linguagem | absorvido |
| 2026-10-03 | prática | Afirmações negativas ("não pedimos CPF") com marcador neutro, não ✓ | limiar-app 319c167; conhecimento: skill revisar-tela | absorvido |
| 2026-10-03 | prática | Etapa de notificações fora do onboarding enquanto não existem notificações (preferência inútil engana) | limiar-app 319c167; conhecimento: produto/seguranca-e-privacidade | absorvido |
| 2026-10-03 | prática | Copy de boas-vindas sem presumir perda: "Pequenas experiências, jogos e ideias…" | limiar-app 319c167; conhecimento: voz/voz-e-linguagem | absorvido |
| 2026-10-03 | armadilha | Frase aprovada pela spec pode estar falsa no estado atual ("fontes revisadas" com catálogo em rascunho): revisar veracidade, não só a origem | limiar-app src/app/sobre.tsx:23; spec §9 (revisão real) | absorvido |
| 2026-10-03 | decisão | Mônica creditada no app só como autora; tese só como fundo; lista "evitar" vira regra (corrigir) | decisions.md 2026-10-03; conhecimento: marca/monica-e-tese, voz/voz-e-linguagem | absorvido |
| 2026-10-04 | armadilha | Dar ao agente o código do projeto muda o comportamento: passou a especular causas técnicas ao encaminhar ao mobile-dev (caso que passava antes). Toda fonte nova de contexto pede reavaliação dos casos de limite | Avaliação de produção 0.2.3, caso fora-de-escopo-tecnico 0.5 | absorvido |
| 2026-10-04 | pratica | Caso de avaliação sobre fatos do código precisa de gabarito no `contexto`: o avaliador não vê o código e marca detalhes verdadeiros como invenção | Avaliação de produção 0.2.3, caso contexto-projeto-codigo | absorvido |
