# Fase 1 — MVP: plano de implementação

Status: **em execução** · criado 2026-10-04 · fonte de verdade do produto: `docs/spec/especificacao-mestre-v1.0.md`
(a spec vence qualquer conflito até revisão humana). Este plano cumpre a ordem de trabalho da spec §25:
mapa de telas, fluxo, modelo de dados, arquitetura de segurança e plano — antes do código das partes novas.

## 1. Escopo da Fase 1 (spec §23)

Home · Me tira do sofá · 60–100 atividades · 2 jogos · salvos · pergunta aberta limitada · segurança · privacidade ·
admin básico. A Fase 0 (protótipo clicável, dados locais, sem IA/back-end) está concluída.

## 2. Mapa de telas (spec §19) — estado

| # | Tela | Estado | Onde |
|---|---|---|---|
| 01 | Splash / marca | feito | `boas-vindas/index` + splash nativo |
| 02 | Onboarding propósito | feito | `boas-vindas/proposito` |
| 03 | Maioridade + privacidade | feito | `boas-vindas/proposito` (18+) · `privacidade` |
| 04 | Interesses | feito | `boas-vindas/interesses`, `boas-vindas/tempo` |
| 05 | Home | feito | `(tabs)/index` |
| 06 | Me tira do sofá — filtros | feito | `sofa` |
| 07 | Resultado atividade | feito | `sofa` (uma por vez) |
| 08 | Atividade passo a passo | **onda 1** | `atividade/[id]` |
| 09 | Pós-atividade | **onda 1** (sem texto) · **onda 2** (frase opcional) | |
| 10 | Explorar mundos | feito (5 mundos "em breve" aguardam conteúdo) | `(tabs)/explorar` |
| 11 | Jogo Ainda gosto disso? | feito | `jogos/ainda-gosto` |
| 12 | Jogo Isso ainda é meu? | feito | `jogos/isso-ainda-e-meu` |
| 13 | Pergunta aberta — tema | **onda 2** | |
| 14 | Pergunta aberta — conversa | **onda 2** (resposta editorial local) · **onda 3** (IA) | |
| 15 | Salvos | feito (atividades, jogo A) · onda 2 (reflexões) | `(tabs)/salvos` |
| 16 | Perfil/preferências | feito | `(tabs)/perfil`, `preferencias` |
| 17 | Privacidade/dados | feito (exportar/apagar) · cresce a cada dado novo | `privacidade` |
| 18 | Ajuda e segurança | feito | `ajuda` |
| 19 | Rota de risco alto | **onda 1** | `seguranca` |
| 20 | Sobre/fontes | feito | `sobre` |

## 3. Ondas

- **Onda 1 (paralela, sem texto livre):** (A) camada de segurança no aparelho + tela 19 + rota de violência + suíte de
  regressão (§21) — é o portão da spec §25.5; (B) passo a passo, ações do cartão (§4.4), feedback
  "mais disso / menos disso / não combina" usado na recomendação (§6).
- **Onda 2 (depois de A):** tudo que recebe texto digitado passa pelo portão `useSafetyGate`: frase pós-atividade
  (tela 09), pergunta aberta (13–14) com resposta **editorial local** (sem IA — a spec §7.3 manda dizer que o app não
  tem base confiável quando não tiver), reflexões salvas só por ação explícita, editáveis/apagáveis, no exportar/apagar.
- **Onda 3 (back-end de IA — ver §6):** serviço sem estado, montado e testado com provedor *Fake*; **não vai ao ar**
  antes das decisões humanas H1–H4.
- **Conteúdo (contínuo, humano):** catálogo de 15 → 60–100 atividades; variações; 5 mundos. A IA pode rascunhar, mas
  nada é publicado sem aprovação humana (§22). Cada item mantém `reviewStatus`.

## 4. Modelo de dados — no aparelho (Fase 1)

Tudo fica no aparelho (AsyncStorage, chaves versionadas, validadas na leitura, fila única de escrita). Nada vai para
servidor nesta fase, exceto o texto da pergunta aberta na onda 3 — processado e descartado.

| Chave | Conteúdo | Spec |
|---|---|---|
| `limiar:v1:prefs` | 18+, interesses, tempo, preferências funcionais | §6, §13 preferences |
| `limiar:v1:saved` | ids de atividades guardadas | §13 saved_items |
| `limiar:v1:game-a-results` | ids de escolhas do jogo A guardadas | §4.5 |
| feedback (onda 1) | enum por atividade | §13 activity_feedback |
| reflexões (onda 2) | texto só após "Salvar esta reflexão" | §13 saved_reflections |

`safety_events`: **não registrados** na Fase 1 (não há analytics nem servidor; a spec prefere não guardar). Quando
houver analytics, só contagem agregada por nível + versão do classificador, nunca texto (§8.2, §14).

## 5. Arquitetura de segurança (spec §7.1, §8, §21)

1. **No aparelho, sempre:** `src/safety/triage` — regras determinísticas, versionadas, sem rede (funciona com a IA
   fora do ar, §25.8). Níveis verde/amarelo/vermelho/violência; na dúvida, a rota mais segura; negação nunca rebaixa
   abaixo de amarelo. Vermelho/violência interrompem o fluxo e abrem `seguranca` com a cópia aprovada §8.1.
2. **No servidor (onda 3), de novo e independente do modelo que responde:** as mesmas regras (compartilhadas como
   dados) + um classificador semântico separado + pós-filtro (diagnóstico, prescrição, promessa, dependência,
   fora de escopo). Qualquer falha ⇒ resposta editorial segura, nunca improviso.
3. **Suíte de regressão** roda no CI a cada mudança de regra, prompt ou modelo (§21); a taxa de falso positivo é
   medida e publicada no relatório do teste.

## 6. Back-end de IA (onda 3) e admin — revisado após parecer do agente `architect` (2026-10-04)

**Sem produto novo.** O que um produto `limiar` teria já existe no produto `agents` da NoctusAI: biblioteca de
conhecimento curada com revisões e busca (`stores/studio_knowledge.py`), versões de agente rascunho → publicada com
`published_by` e portão de avaliação. Criar outro produto copiaria isso (bifurcação estrutural).

- **(a) Pergunta aberta:** rota pública **sem estado** dentro do `agents` — chama o adaptador Anthropic da seed
  diretamente (não o runtime de sessões do Claude Code, descartado: plano pessoal, sem DPA, recuperação escolhida
  pelo modelo). Fluxo: triagem determinística + classificador semântico → recuperação **antes** da geração, só na
  coleção publicada → prompt-base §7.2 → pós-filtro → 80–130 palavras. Limite por IP (`client_ip_key` da seed).
  Fica fora da auditoria e do log de requisição, **provado por teste**; rotas de admin com teste estrito `== 401`.
  Construída com provedor *Fake*. Ir ao ar exige H1–H4 **e** a decisão do dono (nova superfície pública).
- **(b) Admin editorial:** a máquina de estados da spec §22 (rascunho → revisão editorial → revisão de
  segurança/fonte → publicado → arquivado) **não existe** em lugar nenhum e já é a 3ª ocorrência de "rascunho →
  publicar" na plataforma ⇒ deve nascer compartilhada na seed, não copiada. **MFA para admin não existe** no core;
  a spec §11 a exige ⇒ é capacidade do core/SSO para a frota inteira. Ambos dependem de decisão do João (H6).
- **Enquanto (b) não existe:** atividades e base de conhecimento ficam no git (este repositório), revisadas por PR
  com `reviewStatus` por item; o app continua com o catálogo embutido.
## 7. Decisões

**Tomadas por Claude, delegadas por João** (registradas em `docs/design/decisions.md`; Mônica/João podem reabrir):
- D1. Fase 1 **sem conta** (modo visitante) — spec §10.1 "considerar modo sem conta"; minimização.
- D2. Texto salvo **só no aparelho** na Fase 1 — elimina o maior risco LGPD (texto sensível em servidor).
- D3. Back-end de IA = rota pública sem estado no produto `agents` (§6); construída com *Fake* até H1–H4. Sem produto novo.

**Precisam de decisão humana antes de a pergunta aberta com IA ir ao ar** (spec §24 — não inventamos):
- H1. Provedor de IA, contrato/DPA, retenção zero e região de processamento (§12; transferência internacional —
  Resolução ANPD 19/2024).
- H2. Controlador de dados e canal de privacidade (§24.6).
- H3. Parecer jurídico: LGPD, termos, publicidade, fronteira bem-estar × serviço psicológico (§9, §24.8).
- H4. Quem faz revisão editorial/científica e aprova a base de conhecimento e as atividades (§22, §24.7).
- H6. Admin editorial + MFA de admin como capacidades da plataforma (seed/core, frota inteira) — §6 (b).
- H5. Monetização no lançamento (§16, §24.3) e restrição ao Brasil (§24.10) — não bloqueiam o build.

## 8. Critérios de aceite (spec §20) — como serão verificados

`npx tsc --noEmit` · `npx jest` (inclui a suíte de segurança com recall de vermelho = 100% no corpus e falso
positivo de verde ≤ 5%) · `npx expo lint` · export web · aparelho (Expo Go) com leitor de tela e fonte grande.
