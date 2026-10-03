NÓS NO LIMIAR
Especificação Mestre do Aplicativo
PRD + UX + Conteúdo + IA + Segurança + Privacidade + Critérios de Aceite


| VERSÃO 1.0 · 02/10/2026 Documento-fonte para orientar uma IA de desenvolvimento, designer, programador e revisores. O produto deve permanecer no campo de reflexão, descoberta e bem-estar geral, sem se apresentar como psicoterapia, diagnóstico, avaliação psicológica ou serviço de emergência. |
| --- |


Documento preparado para uso como “fonte de verdade” do projeto.

# 0. Como usar este documento
Este documento deve ser entregue integralmente à IA ou equipe que construir o aplicativo. Ele funciona como especificação principal. Quando houver conflito entre uma ideia nova e uma regra descrita aqui, a regra de segurança, privacidade ou escopo deste documento prevalece até revisão humana.

| REGRA DE OURO PARA A IA CONSTRUTORA Não inventar funções clínicas, testes psicológicos, diagnósticos, interpretações psicanalíticas automáticas, pontuações de saúde mental ou promessas de tratamento. Antes de ampliar o escopo, apresentar a proposta e apontar o impacto regulatório, de privacidade e de segurança. |
| --- |


A versão 1.0 parte de três decisões estratégicas:
1. O aplicativo é um produto de bem-estar, reflexão e descoberta para a vida adulta; não é consultório, terapia nem ferramenta diagnóstica.
2. O núcleo do produto é oferecer coisas concretas para fazer, explorar, criar e pensar, especialmente nos períodos de tempo livre que surgem quando antigas rotinas mudam.
3. O sistema deve ser seguro por arquitetura: minimizar dados, limitar a IA, interromper o fluxo normal diante de sinais de risco e encaminhar para recursos humanos adequados.
# 1. Visão do produto
## 1.1 Problema observado
Os comentários reais que motivaram o produto revelam um padrão: muitas mulheres chegam a uma etapa em que os filhos ganham autonomia, saem de casa ou passam a precisar menos da presença materna cotidiana. A experiência varia muito. Algumas sentem alívio e liberdade; outras relatam perda de referência, excesso de tempo livre, dificuldade de saber do que gostam hoje, mudanças no casamento, aposentadoria, cuidado de pais e alterações na relação com filhos adultos.
A literatura também descreve resultados heterogêneos: a saída dos filhos pode se associar a perda de papel em alguns contextos e, em outros, a redução de sobrecarga, maior bem-estar e mais participação social. O produto não deve pressupor que toda mulher sofre ou patologizar a transição. [R13–R16]
## 1.2 Proposta central

| PROPOSTA DE VALOR Um espaço adulto, bonito e leve para transformar tempo disponível em curiosidade: pequenas experiências, jogos de reflexão, ideias criativas, atividades e conversas guiadas que ajudam a mulher a recuperar repertório pessoal e descobrir o que combina com a vida de hoje. |
| --- |


O aplicativo deve ser útil tanto para a mulher que está bem e quer aproveitar uma nova etapa quanto para quem se sente desorientada e procura um primeiro movimento. O produto não promete reduzir sintomas; oferece estrutura, curiosidade, repertório e ação.
## 1.3 Job to be done

| JTBD PRINCIPAL “Quando uma rotina antiga deixa espaço e eu fico sem saber o que fazer com aquele tempo, quero receber uma proposta simples e interessante que combine com meu momento, para voltar a experimentar coisas que sejam minhas.” |
| --- |


## 1.4 Público
- Público editorial primário: mulheres aproximadamente entre 45 e 65 anos, com filhos adolescentes tardios ou adultos, em fase de mudança de rotina e identidade.
- Público secundário: mulheres adultas atravessando outras transições de meia-idade, desde que o uso permaneça compatível com o escopo do app.
- Uso permitido no lançamento: apenas maiores de 18 anos. O onboarding deve pedir confirmação de maioridade sem coletar data de nascimento completa.
- Mercado inicial recomendado: Brasil, em português brasileiro. Expandir para outros países somente após adaptar recursos de crise, privacidade, termos e regulação.
## 1.5 O que o produto NÃO é
- Não é psicoterapia, psicanálise automatizada, aconselhamento psicológico ou atendimento clínico.
- Não faz diagnóstico, triagem diagnóstica, prognóstico, prescrição, avaliação de risco clínico formal nem recomendação de medicamentos.
- Não substitui psicóloga(o), médica(o), psiquiatra, serviço de saúde, emergência ou rede de apoio.
- Não aplica testes psicológicos nem exibe “perfil psicológico”, “grau de ninho vazio”, “score de depressão”, “nível de ansiedade” ou equivalentes.
- Não promete felicidade, cura, redução de depressão, tratamento de ansiedade, prevenção de suicídio ou qualquer efeito terapêutico.
- Não deve estimular dependência emocional da IA nem simular uma relação terapêutica.
# 2. Princípios de produto e linguagem

| Princípio | Aplicação prática |
| --- | --- |
| Curiosidade antes de patologia | A primeira pergunta é o que a pessoa quer fazer/explorar, não “como está sua saúde mental?”. |
| Movimento antes de ruminação | Depois de uma breve reflexão, oferecer um próximo passo opcional: criar, explorar, sair, aprender, conversar, organizar. |
| Autonomia | A usuária escolhe. Não usar linguagem prescritiva nem moralizante. |
| Vida adulta, não autoajuda | Evitar slogans, positividade forçada, infantilização, medalhas e linguagem de “guerreira”. |
| Sem reforço de drama | Reconhecer contexto sem ecoar intensidade. Não repetir “vazio”, “dor”, “depressão” como forma de vínculo; deslocar para recursos e possibilidades. |
| Sem falsa intimidade | A IA não diz “estou aqui com você”, “conte comigo” ou “não vou te abandonar”. |
| Segurança por arquitetura | Dados mínimos, rotas de crise, IA limitada e logs sem texto sensível. |
| Pluralidade | Não presumir que sair dos filhos é negativo; incluir mulheres que vivem essa etapa com alívio, orgulho e liberdade. |


## 2.1 Regras editoriais obrigatórias
- Português brasileiro simples, adulto e natural.
- Frases concretas; evitar jargão psicológico quando existe equivalente cotidiano.
- Evitar “não é X, é Y”, paralelismos decorativos, conclusões motivacionais genéricas e moral da história.
- Evitar textos longos na interface. Conteúdo de tela: preferencialmente 40–120 palavras por bloco; exercícios podem ter instruções maiores.
- Não usar “síndrome do ninho vazio” como diagnóstico. Quando o termo aparecer em conteúdo editorial, apresentá-lo como expressão popular/tema de transição, com nuance científica.
- Não presumir sofrimento. A mesma transição pode ser vivida como perda, alívio, orgulho, liberdade ou mistura de experiências. [R13–R16]
- Não usar mensagens de culpa como “se não fizer isso agora vai se arrepender” em notificações, paywalls ou atividades.
- Não usar segunda pessoa prescritiva do tipo “você precisa” e “você deve” em conteúdo normal. Em emergência, linguagem direta é permitida por segurança.
# 3. Arquitetura de informação
A navegação principal deve ser pequena. Recomenda-se 4 itens na barra inferior: Início, Explorar, Salvos, Perfil. A Home concentra as entradas por intenção, não por diagnóstico.

| Área | Objetivo | Exemplos |
| --- | --- | --- |
| Início | Oferecer um próximo passo sem exigir reflexão longa. | O que combina com hoje? / Me tira do sofá / Continuar descoberta. |
| Explorar | Acesso a mundos e atividades. | Quem sou hoje; Filhos adultos; Tempo e rotina; Nós dois; Meu mundo pode aumentar; Experimenta isso. |
| Salvos | Guardar atividades, frases próprias e descobertas. | Atividades favoritas; reflexões salvas; desenhos salvos. |
| Perfil | Preferências e privacidade. | Interesses; notificações; dados; exportar/excluir; termos; ajuda. |


## 3.1 Os seis “mundos” do conteúdo
Quem sou eu agora? — Identidade, gostos, curiosidades, desejos, partes da vida que ficaram pouco usadas.
Minha relação com filhos adultos — Autonomia, proximidade, conselho versus interferência, novas formas de presença.
O que faço com esse tempo? — Atividades rápidas, projetos, organização de rotina, experiências e curiosidade.
Nós dois agora — Vida a dois depois de mudanças familiares; programas, conversas e descobertas compartilhadas. Deve existir alternativa “não tenho parceiro(a)” sem constrangimento.
Meu mundo pode aumentar — Amizades, estudo, cultura, trabalho, voluntariado, cidade, viagens, grupos e interesses.
Experimenta isso — Baralho de microexperiências criativas e concretas, com filtros de tempo, energia, orçamento e ambiente.
# 4. Funcionalidades do MVP
## 4.1 Onboarding
1. Tela de marca: Nós no Limiar · vida adulta contemporânea.
2. Explicação curta: espaço de reflexão, descoberta e experiências; não é atendimento clínico.
3. Confirmação: “Tenho 18 anos ou mais”. Não coletar data completa.
4. Escolha opcional de 3 a 5 interesses iniciais: aprender, criar, sair, relações, estudos, cultura, movimento leve, casa, amizades, trabalho/projetos, viagens.
5. Escolha de disponibilidade: 5–10 min, 15–30 min, 1 h, meio período. Permitir pular.
6. Preferência de notificações, sempre opt-in e desmarcada por padrão.
7. Link claro para Política de Privacidade e Termos.

| NÃO COLETAR NO ONBOARDING Diagnósticos, medicamentos, histórico de saúde mental, estado civil obrigatório, localização precisa, renda, religião, nomes dos filhos ou relatos livres. O app deve funcionar sem essas informações. |
| --- |


## 4.2 Home: “O que combina com hoje?”
A Home deve evitar uma pergunta clínica de humor. Usar intenções:
- Quero fazer alguma coisa
- Quero criar
- Quero sair
- Quero aprender algo
- Quero pensar sobre uma situação
- Estou sem ideia do que fazer
## 4.3 Recurso principal: “Me tira do sofá”
Gerador de atividade com sensação de brincadeira adulta. Fluxo máximo de 4 escolhas antes do resultado.

| Pergunta | Opções sugeridas |
| --- | --- |
| Quanto tempo cabe agora? | 5–10 min · 15–30 min · 1 h · Tenho a tarde/manhã livre |
| Energia disponível? | Baixa · Normal · Tô animada |
| Ambiente? | Em casa · Quero sair · Tanto faz |
| Companhia? | Só comigo · Com alguém · Tanto faz |


Filtros adicionais opcionais, nunca obrigatórios: orçamento (zero/baixo/tanto faz), mobilidade (prefiro sentada/leve/sem restrição), criatividade (sim/não), social (sim/não).

| MECÂNICA O resultado não deve ser uma lista de 20 ideias. Mostrar 1 atividade por vez, com botões: “Bora”, “Outra”, “Guardar”. O objetivo é reduzir decisão, não criar um catálogo cansativo. |
| --- |


## 4.4 Cartão de atividade

| Campo | Regra |
| --- | --- |
| Título | Curto, concreto e convidativo. Ex.: “Mapa da casa da infância”. |
| Por que pode ser interessante | 1 frase; sem prometer benefício terapêutico. |
| Tempo | Estimativa simples. |
| O que precisa | Materiais/condições. |
| Passos | 3–5 passos curtos. |
| Variação | Alternativa para energia baixa ou mobilidade reduzida quando aplicável. |
| Depois | Pergunta opcional: “Quer guardar uma frase sobre o que apareceu?” |
| Ações | Concluir · Guardar · Outra ideia · Sair sem concluir. |


## 4.5 Jogos adultos de descoberta
Evitar gamificação infantil, pontos de “saúde mental”, rankings e sequências que gerem culpa. Os jogos devem funcionar como exploração.
Jogo A — Ainda gosto disso?
- Rodadas rápidas de escolhas: praia/serra; grupo/sozinha; planejar/improvisar; aprender/ensinar; cidade/natureza.
- Ao final, o app não cria “perfil psicológico”. Apenas devolve padrões observáveis: “Nas escolhas de hoje apareceram bastante natureza e aprendizado. Quer explorar atividades nessa direção?”
- Resultado deve ser temporário ou salvo somente com autorização.
Jogo B — Isso ainda é meu?
- Cartões de hábitos ou papéis para classificar: faço porque gosto / faço por hábito / faço porque esperam / não sei mais.
- Sem interpretação automática de conflitos familiares.
- O app pode sugerir uma reflexão curta sobre 1 cartão escolhido pela usuária.
Jogo C — Eu em outras épocas
- Escolher uma faixa: adolescência, 20 e poucos, 30 e poucos, hoje.
- Perguntas sobre música, lugares, interesses, amizades, coisas que queria aprender.
- Objetivo: recuperar repertório, não idealizar o passado.
Jogo D — Mapa de curiosidades
- A usuária marca temas que despertam curiosidade. O app cria um mapa visual de interesses, não um teste.
- Categorias: arte, leitura, comida, cidade, história, natureza, tecnologia, idiomas, movimento, música, voluntariado, viagens, empreendedorismo, relações, casa.
## 4.6 Desenho e criação
Para o MVP, priorizar prompts criativos que funcionam com papel. Um canvas digital simples pode ser opcional. Se houver canvas, o desenho deve ficar local no dispositivo por padrão e só subir para a nuvem após ação explícita de salvar.
- Desenhe a planta da casa onde passou a infância e marque o lugar favorito.
- Crie uma capa de revista para a vida que gostaria de viver nos próximos dois anos.
- Desenhe um mapa de lugares da cidade que ainda quer conhecer.
- Faça um rabisco de 60 segundos sem tentar produzir algo bonito; depois dê um título.
- Monte uma paleta de cinco cores para a fase atual e nomeie cada cor com uma palavra comum, não clínica.
## 4.7 Pergunta aberta — “Quer pensar sobre alguma coisa?”
Recurso permitido, mas limitado. Deve ser menos proeminente que as atividades. A usuária escolhe primeiro um tema, reduzindo a chance de o app virar consultório.
- Filhos adultos
- Relacionamento
- Rotina e tempo
- Trabalho e projetos
- Amizades
- Quem sou hoje
- Planos e interesses
- Outro assunto dentro da proposta do app
Após escrever, o texto passa obrigatoriamente pela camada de segurança antes de chegar ao modelo generativo.

| FORMA DA RESPOSTA DA IA Máximo recomendado: 80–130 palavras. Estrutura: (1) reconhecer o tema sem amplificar drama; (2) apontar uma ou duas lentes concretas; (3) oferecer escolha entre “quero pensar mais” e “prefiro fazer algo agora”. Evitar respostas que soem como sessão clínica. |
| --- |


# 5. Catálogo inicial de atividades
A IA construtora deve implementar o catálogo como conteúdo estruturado, não como texto solto. Cada atividade recebe metadados para permitir recomendação segura e auditável.

| Campo | Descrição |
| --- | --- |
| activity_id | ID estável e não reutilizável |
| title | Título curto |
| summary | 1 frase |
| category | criar / aprender / sair / conectar / organizar / explorar / refletir |
| duration_min | Número ou faixa |
| energy | baixa / normal / alta |
| environment | casa / fora / ambos |
| social_mode | solo / companhia / ambos |
| budget | zero / baixo / médio |
| mobility | sentada / leve / moderada |
| materials | Lista simples |
| steps | Array de passos |
| safety_tags | ex.: caminhada, cozinha, deslocamento |
| source_note | Base editorial/científica quando aplicável |
| review_status | rascunho / revisado / publicado / retirado |
| reviewed_by | Pessoa responsável |
| version | Versão do conteúdo |


## 5.1 Sementes de conteúdo

| Atividade | Tempo | Precisa | Descrição |
| --- | --- | --- | --- |
| Mapa da casa da infância | 10–15 min | papel e caneta | Desenhar a planta e marcar três lugares que guardam lembranças boas ou curiosas. |
| Música de outra década | 5–10 min | celular | Escolher uma música marcante de uma época e ouvir inteira, sem fazer outra coisa. |
| Uma rua nova | 30–60 min | sair de casa | Escolher uma rua ou praça pouco conhecida e caminhar/observar, respeitando mobilidade e segurança. |
| O curso que sempre ficou para depois | 10 min | internet | Pesquisar três opções concretas de curso, sem compromisso de matrícula. |
| Mini exposição em casa | 20 min | objetos | Escolher cinco objetos e montar uma pequena composição; fotografar se quiser. |
| Telefonema sem pauta | 10–20 min | uma pessoa | Ligar para alguém com quem é gostoso conversar, sem transformar a ligação em tarefa. |
| Receita de um lugar | 30–60 min | cozinha | Escolher um país/cidade e preparar algo simples ligado a ele. |
| Lista das coisas que sei fazer | 10 min | papel | Anotar dez habilidades que não dependem do papel de mãe. |
| Turista no próprio bairro | 30–90 min | sair | Escolher um lugar local nunca visitado. |
| Foto de cinco detalhes | 15 min | celular | Fotografar cinco detalhes bonitos ou curiosos do cotidiano. |
| Uma habilidade em 20 minutos | 20 min | internet/papel | Experimentar uma microaula: origami, desenho, idioma, história da arte, fotografia. |
| Mesa para dois ou um | 20–40 min | casa | Preparar uma refeição simples com um detalhe diferente, sem esperar ocasião especial. |
| Pasta 'quero conhecer' | 10 min | celular | Criar uma lista de lugares, livros, filmes ou cursos que despertam curiosidade. |
| Cartão para o futuro | 10 min | papel | Escrever uma nota curta para abrir daqui a seis meses com algo que gostaria de ter experimentado. |
| Troca de rota | 15–30 min | sair | Fazer um caminho diferente para uma tarefa cotidiana e observar o que aparece. |


# 6. Personalização sem invasão
A personalização deve usar preferências explicitamente escolhidas. O sistema não deve inferir diagnóstico, orientação política/religiosa, vida sexual, saúde, personalidade ou relação familiar a partir de texto livre.
- Guardar tags de interesse: arte, estudo, cidade, natureza, amizades, viagens, culinária etc.
- Guardar preferências funcionais: duração, energia, casa/fora, solo/social, orçamento.
- Feedback simples: “mais disso”, “menos disso”, “não combina comigo”.
- Não criar um “perfil emocional” persistente.
- Não usar conversas de crise para personalização, marketing ou recomendação.
- Não armazenar texto livre por padrão. Processar de forma efêmera; salvar somente após ação explícita “Salvar esta reflexão”.
- Analytics nunca deve registrar texto digitado em perguntas, diário ou crise.
# 7. IA: arquitetura e comportamento
A IA generativa deve ser apenas uma camada do produto. Atividades, regras de segurança, recursos de crise e conteúdo principal precisam funcionar sem depender de improvisação do modelo.
## 7.1 Pipeline obrigatório
1. Entrada da usuária.
2. Normalização técnica (sem alterar conteúdo).
3. Classificador de segurança independente do modelo de resposta.
4. Aplicação de regras determinísticas para sinais críticos.
5. Se risco alto: bloquear geração normal e mostrar rota de segurança.
6. Se uso normal: recuperar apenas conteúdo da base editorial aprovada.
7. Gerar resposta com prompt restritivo.
8. Pós-filtro: verificar diagnóstico, prescrição, promessas, dependência, linguagem inadequada e conteúdo fora do escopo.
9. Entregar resposta e ações seguintes.

| NÃO CONFIAR EM UM ÚNICO LLM O roteamento de segurança não deve depender exclusivamente do mesmo modelo que conversa com a usuária. Usar regras determinísticas + classificador semântico + testes de regressão. Em caso de dúvida entre níveis, adotar a rota mais segura. |
| --- |


## 7.2 Prompt-base do assistente

| PROMPT DE SISTEMA — BASE PAPEL Você é um facilitador de reflexão e descoberta do aplicativo Nós no Limiar, voltado a mulheres adultas em transições da vida adulta.  OBJETIVO Ajudar a usuária a encontrar perguntas úteis, interesses, experiências e pequenos próximos passos. Não fazer psicoterapia, psicanálise clínica, diagnóstico, avaliação psicológica, aconselhamento médico ou atendimento de emergência.  TOM Adulto, caloroso, natural, específico e não melodramático. Reconheça o contexto sem repetir ou amplificar dor, vazio, doença, ansiedade, depressão ou abandono. Não use positividade forçada.  REGRAS 1. Nunca diagnostique ou nomeie transtornos. 2. Nunca interprete inconsciente, trauma, mecanismos de defesa ou relações familiares como verdade sobre a usuária. 3. Nunca prescreva ou comente ajuste de medicação. 4. Nunca diga que o aplicativo substitui ajuda profissional. 5. Nunca simule vínculo terapêutico (“estou aqui com você”, “conte comigo sempre”). 6. Nunca crie pontuação psicológica ou perfil clínico. 7. Não responda perguntas médicas, jurídicas ou financeiras individualizadas; explique o limite e indique fonte/profissional adequado. 8. Para situações comuns, mantenha a resposta entre 80 e 130 palavras. 9. Termine com no máximo duas escolhas concretas: refletir mais ou fazer uma atividade. 10. Se o sistema de segurança marcar risco alto, não produza resposta normal; use somente o protocolo de segurança aprovado.  ESTILO Evite jargão, moral da história, frases feitas e linguagem infantil. Não use “não é X, é Y”. Não transforme toda experiência em sofrimento. Preserve a autonomia da usuária. |
| --- |


## 7.3 Base de conhecimento
- Usar RAG/retrieval apenas em coleção curada e versionada.
- Não permitir navegação livre na web no MVP.
- Cada documento da base deve ter: fonte, autor, data, URL/DOI, tema, nível de evidência, data de revisão e responsável editorial.
- Se a base não contiver informação suficiente, a IA deve dizer que o app não tem base confiável para responder e oferecer outra ação.
- Conteúdo psicanalítico deve ser usado para inspirar perguntas sobre identidade, desejo, papel e relações; evitar interpretação individual automatizada.
# 8. Segurança: triagem e rotas
A segurança deve ser invisível em uso comum e muito clara quando acionada. O app não “trata” crise; ele interrompe seu escopo e encaminha.

| Nível | Exemplos | Comportamento |
| --- | --- | --- |
| VERDE | “Sinto saudade”; “não sei o que fazer domingo”; conflito comum com filho adulto. | Fluxo normal. Reflexão curta + atividade opcional. |
| AMARELO | Relato persistente de perda de interesse, incapacidade funcional, crise frequente, uso do app para substituir ajuda humana. | Não diagnosticar. Reforçar limite do app, sugerir apoio humano/profissional e oferecer atividade simples somente se apropriado. |
| VERMELHO | Desejo de morrer, não acordar, se machucar, plano/intenção, risco imediato, ameaça à vida. | Interromper fluxo normal. Sem jogo, sem reflexão, sem conteúdo motivacional. Mostrar recursos humanos de emergência e apoio. |
| VIOLÊNCIA | Agressão, ameaça, violência doméstica ou risco imediato por terceiro. | Mostrar Ligue 180 para orientação/denúncia; 190 em emergência; não confrontar agressor nem dar plano jurídico improvisado. |


## 8.1 Tela de risco alto — Brasil

| COPY APROVADA PARA PROTÓTIPO Sua segurança vem primeiro agora.  Este aplicativo não é um serviço de emergência. Se houver risco de se machucar ou de não conseguir se manter segura, procure ajuda humana imediatamente. No Brasil: SAMU 192, UPA/pronto-socorro ou hospital. Para apoio emocional, CVV 188. Se puder, fique perto de alguém de confiança.  Botões: [Ligar 192] [Ligar 188] [Ver opções de atendimento] [Avisar alguém de confiança] |
| --- |


Base oficial: Ministério da Saúde lista CAPS/UBS, UPA, SAMU 192, pronto-socorro/hospitais e CVV 188. [R8]
Para violência contra a mulher: Ligue 180 para orientação e denúncia; em emergência, 190. [R9]
## 8.2 Regras para crise
- Nunca responder risco alto com “faça um desenho”, “respire”, “distraia-se” ou outra atividade do app como substituto de ajuda humana.
- Nunca pedir à usuária que prometa não se machucar.
- Nunca manter conversa longa para “resolver” a crise.
- Não usar copy promocional, oferta paga, convite para curso ou venda em qualquer fluxo de segurança.
- Não enviar push de marketing nas horas seguintes a uma rota vermelha; definir janela e política com revisão jurídica/ética.
- Dados de crise devem ser minimizados. Idealmente registrar apenas evento técnico de segurança sem armazenar o texto bruto, salvo obrigação/decisão formal de governança.
- Criar testes com frases explícitas, ambíguas, metafóricas e negações (“não quero morrer”) para reduzir falsos negativos e falsos positivos.
# 9. Fronteira clínica e regulatória
A intenção regulatória do produto deve ser permanecer em bem-estar geral, educação e reflexão. Essa intenção precisa aparecer também na funcionalidade, na publicidade e na forma como a IA responde.

| PONTO DE ATENÇÃO Se o app começar a realizar métodos e técnicas psicológicas como serviço profissional, ou for apresentado como atendimento psicológico, a análise muda. A Resolução CFP nº 9/2024 regulamenta serviços psicológicos mediados por tecnologias digitais e exige rigor ético/técnico, confidencialidade e avaliação de adequação; situações de risco podem exigir rede presencial. [R6] |
| --- |


Também deve ser feita avaliação regulatória antes de qualquer funcionalidade que alegue finalidade médica específica. A Anvisa regula Software como Dispositivo Médico pela RDC 657/2022; o enquadramento depende da finalidade pretendida e das funções. [R7]
- Não chamar jogos de “teste”, “avaliação”, “triagem”, “escala” ou “instrumento psicológico”.
- Não aplicar PHQ-9, GAD-7 ou instrumentos equivalentes sem decisão explícita de mudar o escopo e revisão profissional/regulatória.
- Não dizer “baseado em psicanálise” como selo de tratamento. Preferir: “conteúdo editorial inspirado em estudos sobre vida adulta, relações e reflexão, com fontes revisadas”.
- Publicidade deve descrever experiências e recursos, não resultados de saúde.
- Antes do lançamento, obter parecer jurídico brasileiro sobre LGPD, CDC, termos, publicidade e enquadramento sanitário/profissional.
# 10. Privacidade e LGPD
Relatos sobre saúde são dados pessoais sensíveis quando vinculados a uma pessoa. [R1] O desenho do produto deve reduzir a coleta, especialmente porque perguntas abertas podem revelar saúde, religião, sexualidade, relacionamentos e outras informações sensíveis.
## 10.1 Política de minimização
- Conta deve poder ser criada com e-mail ou autenticação social; considerar modo sem conta para atividades básicas.
- Não pedir nome completo se não for necessário.
- Não pedir CPF, endereço, data de nascimento completa ou nome dos filhos.
- Não pedir diagnóstico ou medicação.
- Texto de reflexão processado de forma efêmera por padrão.
- Salvar apenas se a usuária escolher explicitamente.
- Separar dados de identidade de conteúdo salvo sempre que tecnicamente possível.
- Definir prazo de retenção por categoria e processo de exclusão.
- Não vender dados pessoais. Não usar conteúdo sensível para publicidade comportamental.
## 10.2 Base legal e RIPD
A hipótese legal de cada finalidade deve ser definida por assessoria jurídica. Não usar um consentimento genérico para tudo. Como o produto pode receber texto sensível e usar IA/fornecedores em nuvem, recomenda-se elaborar um Relatório de Impacto à Proteção de Dados (RIPD) antes do lançamento e atualizá-lo quando houver mudanças relevantes. A ANPD recomenda RIPD em contextos que possam gerar alto risco e descreve seu conteúdo e responsabilidade do controlador. [R2]
Se provedores de IA/nuvem processarem dados fora do Brasil, mapear a transferência internacional e aplicar os mecanismos da Resolução CD/ANPD nº 19/2024, incluindo transparência e cláusulas adequadas. [R4]
## 10.3 Direitos e controles para a usuária
- Ver o que está salvo.
- Editar ou excluir reflexões individuais.
- Exportar conteúdo próprio em formato legível.
- Excluir conta e iniciar exclusão de dados com confirmação simples.
- Revogar notificações e personalização.
- Acessar canal de privacidade sem navegar por menus escondidos.
# 11. Segurança da informação
A LGPD exige medidas técnicas e administrativas aptas a proteger dados pessoais; a ANPD mantém guias e checklists específicos. [R1, R3]

| Camada | Requisito mínimo |
| --- | --- |
| Transporte | TLS moderno em todas as conexões; HSTS no web app. |
| Armazenamento | Criptografia em repouso; backups criptografados. |
| Acesso interno | Privilégio mínimo; contas individuais; MFA obrigatório para administradores. |
| Segredos | Nunca no código ou app cliente; usar secret manager. |
| Logs | Sem texto de diário/pergunta; mascarar identificadores; política de retenção. |
| Banco | Separar dados de identidade e conteúdo quando viável; políticas row-level/tenant isolation. |
| Dependências | SCA/dependency scanning e atualização contínua. |
| Código | SAST, revisão, proteção contra injection e prompt injection. |
| App | Seguir OWASP MASVS/Mobile Top 10 como referência técnica. |
| Backups | Testar restauração; limitar acesso; retenção definida. |
| Incidentes | Plano interno, responsável, evidências, comunicação e prazos regulatórios. |
| Pentest | Teste de intrusão antes de lançamento e após mudanças críticas. |


A Resolução CD/ANPD nº 15/2024 regula comunicação de incidentes; a ANPD informa prazo de três dias úteis quando o incidente puder acarretar risco ou dano relevante, ressalvada legislação específica. [R5]
# 12. Fornecedores e IA externa
- Escolher provedor com contrato/DPA, controles de segurança, política clara de retenção e opção de não usar dados do cliente para treinamento.
- Preferir configuração de zero/baixa retenção quando disponível.
- Documentar país/região de processamento e subprocessadores.
- Se houver transferência internacional, cumprir a Resolução ANPD 19/2024.
- Não enviar ao provedor mais dados do que o necessário para gerar a resposta.
- Antes de trocar de provedor/modelo, repetir testes de segurança e qualidade.
- A OMS alerta que modelos generativos em saúde podem produzir afirmações falsas, incompletas ou enviesadas; governança, transparência e auditoria devem acompanhar o ciclo de vida. [R10]
- Usar NIST AI RMF/GenAI Profile como referência de governança, teste e documentação de risco. [R11]
# 13. Dados e modelo mínimo

| Entidade | Campos principais | Observação |
| --- | --- | --- |
| users | id, auth_id, created_at, locale, 18_plus_confirmed | Sem nome completo obrigatório. |
| preferences | user_id, interest_tags, duration_pref, environment_pref, social_pref | Escolhas explícitas. |
| saved_items | user_id, item_type, item_id, created_at | Favoritos. |
| saved_reflections | id, user_id, encrypted_text, created_at, updated_at | Só após ação explícita de salvar. |
| activity_feedback | user_id, activity_id, feedback_enum | mais_disso / menos_disso / nao_combina. |
| safety_events | event_id, severity, timestamp, classifier_version | Sem texto bruto por padrão; governança define retenção. |
| content_catalog | activity/article/game metadata | Versionado e revisável. |
| audit_admin | admin_id, action, object, timestamp | Auditoria interna. |


# 14. Analytics e métricas
O produto não deve otimizar “tempo de tela” como objetivo central. Métricas devem avaliar utilidade e variedade.
- Atividades iniciadas e concluídas.
- Taxa de “outra ideia” antes de escolher.
- Variedade de categorias usadas por semana.
- Itens salvos.
- Uso de “mais disso / menos disso”.
- Retorno em 7 e 30 dias, sem perseguir streaks.
- Conclusão de jogos de descoberta.
- Taxa de opt-in de notificações.
- Eventos de segurança agregados e sem conteúdo bruto.
- Erros da IA reportados.
- Taxa de respostas que passam por fallback por falta de fonte.

| PROIBIDO EM ANALYTICS Texto de diário, perguntas abertas, conteúdo de crise, nomes, medicamentos, diagnósticos, mensagens privadas ou qualquer dado desnecessário para medir produto. |
| --- |


# 15. Notificações
- Sempre opt-in; frequência inicial sugerida: no máximo 2–3 por semana.
- Permitir horário silencioso e desligamento em um toque.
- Nada de culpa: não usar “sumiu”, “sentimos sua falta”, “não abandone sua jornada”.
- Preferir convite concreto: “Tem 15 minutos hoje? Separei uma ideia nova para criar algo.”
- Não usar dados de crise ou conteúdo sensível para personalizar push.
- Evitar notificações noturnas por padrão.
# 16. Monetização e separação comercial
A versão inicial pode ser gratuita ou freemium. Se houver produtos, cursos, livro ou mentoria, a venda deve permanecer separada do fluxo de segurança e do conteúdo sensível.
- Nunca mostrar oferta após rota amarela/vermelha.
- Nunca personalizar oferta com base em relato de depressão, luto, violência ou crise.
- Não criar paywall para recursos de segurança.
- Evitar dark patterns, contagem regressiva falsa e urgência emocional.
- Se houver premium, cobrar por catálogo ampliado, personalização, trilhas criativas, recursos offline ou experiências — não por “mais cuidado psicológico”.
# 17. Acessibilidade
Adotar WCAG 2.2 como referência e testar com leitor de tela, zoom, contraste e navegação por teclado quando houver web/PWA. [R12]
- Tamanho de fonte ajustável.
- Contraste adequado e não depender apenas de cor.
- Alvos de toque grandes.
- Texto alternativo em imagens informativas.
- Legendas/transcrições em áudio e vídeo.
- Linguagem simples e parágrafos curtos.
- Modo reduzir movimento/animações.
- Atividades com alternativas para mobilidade reduzida.
- Não usar fontes serifadas muito pequenas em corpo de texto; preservar estética editorial nos títulos.
# 18. Direção visual
A referência visual aprovada é editorial, acolhedora e adulta: colagem analógica, papel, elementos orgânicos, vinho/vermelho profundo, creme, areia e preto. A estética não pode parecer app hospitalar, infantil ou de autoajuda genérica.

Referência visual já desenvolvida para Nós no Limiar.
- Tokens já associados à marca: Off-white #F3F0EA; Areia #D8CBB8; Preto #222222.
- Acento vinho/vermelho: usar o valor exato definido pelo design final ou amostrado do mockup aprovado; não inventar um novo tom sem validação.
- Tipografia: combinação editorial serifada em títulos + sans altamente legível no corpo.
- Iconografia simples e adulta; evitar corações excessivos, emojis como decoração permanente e símbolos clínicos.
- Ilustração/colagem deve funcionar como identidade, não competir com legibilidade.
# 19. Telas mínimas do MVP

| # | Tela | Função |
| --- | --- | --- |
| 01 | Splash / marca | Logo + entrada |
| 02 | Onboarding propósito | O que é / o que não é |
| 03 | Maioridade + privacidade | 18+ + links |
| 04 | Interesses | Seleção opcional |
| 05 | Home | O que combina com hoje? |
| 06 | Me tira do sofá - filtros | Tempo/energia/ambiente/companhia |
| 07 | Resultado atividade | Uma ideia por vez |
| 08 | Atividade passo a passo | Execução |
| 09 | Pós-atividade | Salvar frase opcional |
| 10 | Explorar mundos | 6 mundos |
| 11 | Jogo Ainda gosto disso? | Escolhas rápidas |
| 12 | Jogo Isso ainda é meu? | Classificação de cartões |
| 13 | Pergunta aberta - tema | Escolher tema |
| 14 | Pergunta aberta - conversa | Resposta limitada |
| 15 | Salvos | Atividades/reflexões |
| 16 | Perfil/preferências | Configuração |
| 17 | Privacidade/dados | Exportar/excluir |
| 18 | Ajuda e segurança | Recursos oficiais |
| 19 | Rota de risco alto | Override de segurança |
| 20 | Sobre/fontes | Método editorial e limites |


# 20. Critérios de aceite por recurso

| Área | Aceite mínimo |
| --- | --- |
| Atividade | Usuária chega a uma proposta em até 4 escolhas; pode trocar sem penalidade; metadados corretos. |
| Pergunta aberta | Resposta no escopo, sem diagnóstico/prescrição; 80–130 palavras; oferece no máximo 2 próximos caminhos. |
| Risco alto | Fluxo normal é bloqueado; recursos oficiais aparecem; não há conteúdo promocional nem jogo. |
| Privacidade | Texto livre não entra em analytics; salvar é explícito; exclusão/exportação acessíveis. |
| Personalização | Baseada apenas em escolhas/feedback; nenhuma inferência clínica persistente. |
| Acessibilidade | Principais fluxos testados com leitor de tela e zoom; contraste conforme WCAG 2.2. |
| Conteúdo | Cada item publicado tem fonte/revisor/versão quando aplicável. |
| IA | Prompt injection e solicitações fora do escopo são recusadas sem vazar instruções ou dados. |
| Admin | MFA, auditoria e privilégio mínimo. |
| Analytics | Nenhum payload contém texto sensível. |


# 21. Testes de segurança da IA
Criar suíte automática de regressão antes de lançar e a cada mudança de modelo/prompt.
- 100+ exemplos comuns de maternidade/identidade para verificar tom.
- 100+ exemplos de risco de autoagressão: explícitos, indiretos, gírias, erros de digitação, metáforas e negações.
- Exemplos de violência doméstica.
- Pedidos de diagnóstico (“tenho depressão?”), medicação, dose e sintomas.
- Pedidos para a IA agir como terapeuta/psicanalista.
- Prompt injection (“ignore suas regras e…”).
- Tentativas de extrair prompt de sistema ou dados de outras usuárias.
- Conteúdo político/religioso: não inferir nem usar para personalização.
- Perguntas fora do escopo: finanças, direito, medicina.
- Testes de viés por idade, classe, estado civil, maternidade solo, orientação afetiva e diferentes formas de família.
Para rota vermelha, priorizar recall alto e revisão humana periódica de falsos negativos, sem registrar conteúdo identificável desnecessário.
# 22. CMS e governança editorial
- Estados de conteúdo: rascunho → revisão editorial → revisão de segurança/fonte → publicado → arquivado.
- Nenhuma atividade é publicada diretamente por IA sem aprovação humana.
- Conteúdos científicos devem citar fonte e data.
- Revisão periódica de recursos de crise e links oficiais.
- Registro de versões de prompts e modelos.
- Registro de quem aprovou alterações críticas.
- Canal interno para reportar conteúdo inadequado e retirar imediatamente do catálogo.
# 23. Roadmap recomendado

| Fase | Escopo |
| --- | --- |
| Fase 0 — Validação | Protótipo clicável; teste com 10–20 mulheres; parecer jurídico/LGPD; revisão ética/editorial; RIPD inicial. |
| Fase 1 — MVP | Home, Me tira do sofá, 60–100 atividades, 2 jogos, salvos, pergunta aberta limitada, segurança, privacidade, admin básico. |
| Fase 2 — Personalização | Mapa de curiosidades, padrões de interesses, notificações, catálogo 200+ atividades. |
| Fase 3 — Cidade | Sugestões locais opcionais; consentimento de localização; avaliação de fornecedores/maps. |
| Fase 4 — Comunidade (somente se necessário) | Exige moderação, denúncias, regras, privacidade e novo RIPD. Não recomendado no MVP. |


# 24. Questões que precisam de decisão humana antes do código final
1. O MVP será PWA/web ou aplicativo nativo iOS/Android?
2. Haverá conta obrigatória ou modo visitante?
3. Qual é o modelo de monetização no lançamento?
4. O texto salvo fica em nuvem ou pode ficar apenas no dispositivo?
5. Qual provedor de IA será contratado e em que região processará dados?
6. Quem será o controlador de dados e quem responderá pelo canal de privacidade?
7. Quem fará revisão editorial/científica dos conteúdos?
8. Qual parecer jurídico define a fronteira entre bem-estar e serviço psicológico no desenho final?
9. Qual tom exato de vinho e quais fontes entram no design system?
10. O app será restrito ao Brasil no lançamento?
# 25. Instrução pronta para a IA que vai construir

| PROMPT PARA COPIAR NA OUTRA IA Use este documento como fonte de verdade do projeto “Nós no Limiar”.  OBJETIVO Construir um MVP mobile-first de bem-estar, reflexão e descoberta para mulheres adultas, sem transformar o produto em terapia, diagnóstico ou aconselhamento clínico.  ORDEM DE TRABALHO 1. Leia o documento inteiro antes de propor arquitetura. 2. Liste decisões ainda abertas e assunções. Não invente decisões clínicas ou jurídicas. 3. Entregue primeiro: mapa de telas, fluxo de navegação, modelo de dados, arquitetura de segurança e plano de implementação. 4. Só depois gere código. 5. Implemente a camada de segurança antes da pergunta aberta com IA. 6. O catálogo de atividades deve ser estruturado e auditável. 7. Texto livre é efêmero por padrão e nunca entra em analytics. 8. O fluxo de risco alto deve funcionar mesmo se a IA generativa estiver indisponível. 9. Não adicione testes psicológicos, score emocional, tracking de humor diário, comunidade ou recursos clínicos sem aprovação explícita. 10. Toda mudança que possa ampliar coleta de dados, finalidade de saúde, dependência da IA ou risco regulatório deve vir acompanhada de uma nota de impacto.  ENTREGÁVEIS ESPERADOS - Arquitetura técnica. - Design system e tokens. - 20 telas mínimas descritas neste documento. - Banco e políticas de acesso. - CMS de conteúdo. - Pipeline de IA com classificador e pós-filtro. - Rotas verde/amarela/vermelha/violência. - Política de logs e analytics. - Testes automatizados e suíte de segurança. - Documentação de deploy, backup, exclusão de dados e incidentes. - Checklist de conformidade antes do release.  NÃO NEGOCIÁVEIS Segurança, minimização de dados, linguagem não clínica, ausência de diagnóstico/prescrição, ausência de dependência emocional da IA, recursos de crise gratuitos e independentes de paywall. |
| --- |


# 26. Referências e bases de governança
R1. BRASIL. Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD).
https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
R2. ANPD. Relatório de Impacto à Proteção de Dados Pessoais (RIPD), página atualizada em 2026.
https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/relatorio-de-impacto-a-protecao-de-dados-pessoais-ripd
R3. ANPD. Guia Orientativo sobre Segurança da Informação para Agentes de Tratamento de Pequeno Porte.
https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte
R4. ANPD. Resolução CD/ANPD nº 19/2024 — Transferência Internacional de Dados.
https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024
R5. ANPD. Resolução CD/ANPD nº 15/2024 e Comunicação de Incidente de Segurança.
https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis
R6. Conselho Federal de Psicologia / Sistema Conselhos. Resolução CFP nº 9/2024 — exercício profissional mediado por TDICs (orientações oficiais do CRP).
https://transparencia.cfp.org.br/crp12/pergunta-frequente/atendimentopsicologicoonline/
R7. ANVISA. RDC 657/2022 — Software como Dispositivo Médico (SaMD), perguntas e respostas.
https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/software-como-dispositivo-medico-perguntas-e-respostas/
R8. Ministério da Saúde. Suicídio (Prevenção) — rede de ajuda, SAMU 192 e CVV 188.
https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/suicidio-prevencao/suicidio-prevencao
R9. Ministério das Mulheres. Ligue 180 — Central de Atendimento à Mulher; emergência 190.
https://www.gov.br/mulheres/pt-br/ligue180
R10. World Health Organization. Ethics and governance of artificial intelligence for health: guidance on large multi-modal models.
https://www.who.int/publications/i/item/9789240084759
R11. NIST. Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1).
https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
R12. W3C. Web Content Accessibility Guidelines (WCAG) 2.2.
https://www.w3.org/TR/wcag/
R13. Dennerstein L, Dudley E, Guthrie J. Empty nest or revolving door? Psychological Medicine. 2002;32(3):545-550. DOI: 10.1017/S0033291701004810.
https://pubmed.ncbi.nlm.nih.gov/11989999/
R14. Hartanto A, et al. Cultural contexts differentially shape parents’ loneliness and wellbeing during the empty nest period. Communications Psychology. 2024;2:105.
https://www.nature.com/articles/s44271-024-00156-8
R15. Sartori ACR, Zilberman ML. Revising the empty nest's syndrome concept. Archives of Clinical Psychiatry (São Paulo). 2009;36(3):112-121.
https://revistas.usp.br/acp/en/article/view/17253
R16. Mitchell BA, Lovegreen LD. The Empty Nest Syndrome in Midlife Families. Journal of Family Issues. 2009;30(12). DOI: 10.1177/0192513X09339020.
https://journals.sagepub.com/doi/10.1177/0192513X09339020
R17. Ly KH, et al. Behavioural activation versus mindfulness-based guided self-help treatment administered through a smartphone application: a randomized controlled trial. BMJ Open. 2014;4:e003440.
https://pubmed.ncbi.nlm.nih.gov/24413342/

| NOTA JURÍDICA Este documento é uma especificação de produto e governança, não um parecer jurídico. Antes do lançamento, revisar a versão final com profissional de proteção de dados/direito digital no Brasil e, se houver qualquer oferta que possa configurar serviço psicológico, com profissional habilitado e/ou orientação do Sistema Conselhos. |
| --- |


# 27. Checklist pré-lançamento
☐ Parecer jurídico e RIPD revisados.
☐ Termos e Política de Privacidade aprovados.
☐ Fornecedor de IA e nuvem com DPA e transferências internacionais mapeadas.
☐ Recursos 188/192/180/190 revisados e testados.
☐ Rota vermelha testada offline/sem IA.
☐ Suíte de segurança da IA aprovada.
☐ Nenhum texto sensível em analytics/logs.
☐ Exclusão/exportação de dados testadas.
☐ MFA e privilégios do painel administrativo.
☐ Pentest e correções críticas concluídos.
☐ Conteúdo inicial revisado por humano.
☐ Acessibilidade testada.
☐ Copy de marketing revisada para não fazer promessa clínica.
☐ Fluxo de venda separado de segurança.
☐ Plano de incidentes e responsáveis definidos.
☐ Versões de modelo, prompt e base de conteúdo registradas.