# Reflexões guiadas — lote 1 (ref-0001 a ref-0024) · folha de revisão

Mônica, estes 24 cartões são **rascunhos escritos pelo Claude** (4 out. 2026), a pedido do João,
para a sua revisão. Nenhum deles vai para usuárias antes da sua aprovação (spec §22): todos estão
no app como `rascunho`, sem revisora, versão 1 (`src/data/reflexoes.ts`). Pode editar à vontade,
inclusive os títulos.

## O que é este recurso

É a "pergunta aberta" da spec (§4.7, telas 13 e 14), **sem campo de texto**: a regra de segurança
por palavras pegou só cerca de um terço das frases de risco em testes cegos, então nada digitado
entra no app até existir um classificador melhor (decisões de 4 out. 2026). No lugar disso:

1. Na Home, "Quero pensar sobre uma situação" abre a lista dos 8 temas da spec.
2. Ela escolhe um tema e vê **um cartão por vez**: um reconhecimento curto do tema + duas
   perguntas para pensar no papel ou de cabeça.
3. No fim de cada cartão, só duas escolhas: "Quero pensar mais" (o próximo cartão do tema) e
   "Prefiro fazer algo agora" (abre o "Me tira do sofá"). No último cartão do tema, a primeira
   vira "Escolher outro tema".
4. Um link discreto, sempre visível: "Se estiver difícil agora, veja onde buscar ajuda".
5. Ela pode guardar um cartão nos Salvos. O app guarda só qual cartão foi, nunca texto.

## Como foram escritos

- Forma da spec §4.7: reconhecer o tema sem amplificar drama + uma ou duas lentes concretas.
  Todos têm duas perguntas; entre 60 e 97 palavras cada (limite 130).
- Regras da §7.2 também valem para texto curado: sem diagnóstico, sem interpretar família ou
  inconsciente, sem "estou aqui com você", sem positividade forçada, sem "não é X, é Y".
- Vidas plurais: nem todas têm filhos, par, emprego ou dinheiro sobrando. "Relacionamento" inclui
  viver sem par; "Trabalho" inclui casa, voluntariado e aposentadoria; os planos começam pela
  versão pequena e "de graça ou quase".
- "Filhos adultos" fala da relação como ela é hoje (contato, decisões, ajuda), **não** de ninho vazio.
- Um teste automático barra exclamação, "você precisa/deve", frases de vínculo, a lista "evitar" da
  marca e palavras de drama ou clínicas (vazio, dor, depressão, luto, trauma…).

## Onde eu tive dúvida (para o seu olhar primeiro)

- **ref-0002 "O que cabe a quem"** e **ref-0023 "O que está nas suas mãos"** usam a mesma lente
  (o que depende de mim / o que não depende). Talvez seja melhor trocar uma delas.
- **ref-0003** cita "as crianças da família" para não presumir netos. Soa natural?
- **ref-0005** fala de quem "vive sem par"; **ref-0004** de "a escolha de viver sem par". Para quem
  não escolheu, "escolha" pode soar estranho. Talvez "ou viver sem par" baste.
- **ref-0006** pergunta "O que torna difícil começar?". É a única lente que nomeia uma dificuldade;
  pode ser leve o suficiente, ou pode puxar para um peso que o cartão não quer.
- **ref-0024** cita psicóloga ao lado de advogada e médico, como alguém que entende do tema. A ideia é
  não tratar o assunto como clínico nem esconder que existe esse caminho. Fica bem aqui?
- **"Outro assunto dentro da proposta do app"**: o rótulo é o da spec, longo para um botão. Se quiser
  um mais curto ("Outro assunto"), a lista muda numa linha.

## Visão geral

| id | tema | título | palavras |
|---|---|---|---|
| ref-0001 | Filhos adultos | Uma relação que muda de forma | 79 |
| ref-0002 | Filhos adultos | O que cabe a quem | 97 |
| ref-0003 | Filhos adultos | Ajudar do jeito que combina | 75 |
| ref-0004 | Relacionamento | Do jeito que está hoje | 74 |
| ref-0005 | Relacionamento | Tempo junto, tempo só seu | 77 |
| ref-0006 | Relacionamento | Um assunto para depois | 71 |
| ref-0007 | Rotina e tempo | Uma semana comum | 77 |
| ref-0008 | Rotina e tempo | A hora que combina com você | 80 |
| ref-0009 | Rotina e tempo | O que pode sair da lista | 77 |
| ref-0010 | Trabalho e projetos | O lugar do trabalho hoje | 77 |
| ref-0011 | Trabalho e projetos | Um projeto pequeno | 65 |
| ref-0012 | Trabalho e projetos | O que você sabe fazer | 71 |
| ref-0013 | Amizades | Quem está por perto | 60 |
| ref-0014 | Amizades | Amizades novas | 65 |
| ref-0015 | Amizades | O ritmo de cada amizade | 81 |
| ref-0016 | Quem sou hoje | Gostos de agora | 74 |
| ref-0017 | Quem sou hoje | Os papéis do dia a dia | 72 |
| ref-0018 | Quem sou hoje | Como você se apresentaria | 66 |
| ref-0019 | Planos e interesses | Uma curiosidade antiga | 65 |
| ref-0020 | Planos e interesses | Planos de tamanhos diferentes | 67 |
| ref-0021 | Planos e interesses | Pistas de interesse | 64 |
| ref-0022 | Outro assunto dentro da proposta do app | Dar nome ao assunto | 77 |
| ref-0023 | Outro assunto dentro da proposta do app | O que está nas suas mãos | 63 |
| ref-0024 | Outro assunto dentro da proposta do app | Com quem conversar | 66 |

## Os 24 cartões, texto completo

### Filhos adultos

#### ref-0001 · Uma relação que muda de forma

Quando os filhos viram adultos, a relação continua, com outro formato: menos rotina em comum, outras conversas, outros combinados. Para algumas mulheres isso traz alívio; para outras, estranhamento; muitas vezes, um pouco de cada. Dá para olhar para como está hoje sem pressa de dar nome.

**Para pensar, no papel ou de cabeça:**

- O que mudou no jeito de vocês conversarem nos últimos anos? E o que continua igual?
- Que tipo de contato combina com você hoje: frequência, assunto, jeito?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0002 · O que cabe a quem

Com filhos adultos, muitas decisões passam a ser deles: onde morar, com quem, como usar o tempo e o dinheiro. Às vezes dá vontade de opinar; às vezes, de dar um passo para trás. Separar o que cabe a você do que cabe a eles costuma deixar as conversas mais leves.

**Para pensar, no papel ou de cabeça:**

- Pense numa situação recente com um filho ou uma filha. Que parte dela estava nas suas mãos, e que parte não estava?
- Existe algum assunto em que você gostaria de opinar menos? E algum em que gostaria de ser mais ouvida?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0003 · Ajudar do jeito que combina

Filhos adultos às vezes pedem ajuda: com uma mudança, com as crianças da família, com uma decisão, com um favor de última hora. Ajudar pode ser um prazer e também pode ocupar mais espaço do que você gostaria. As duas coisas podem ser verdade na mesma semana.

**Para pensar, no papel ou de cabeça:**

- Que tipo de ajuda você oferece com gosto? E qual oferece mais por hábito?
- Se pudesse ajustar uma coisa nesse equilíbrio, qual seria?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Relacionamento

#### ref-0004 · Do jeito que está hoje

Relacionamento pode querer dizer muita coisa: uma união longa, alguém que chegou há pouco, uma separação, a escolha de viver sem par. Cada situação tem seus dias bons e seus pontos de atrito. A ideia aqui é olhar para a sua, do jeito que está.

**Para pensar, no papel ou de cabeça:**

- O que funciona bem hoje no seu jeito de viver os relacionamentos?
- O que você gostaria que fosse diferente, mesmo que seja um detalhe?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0005 · Tempo junto, tempo só seu

Quem divide a casa ou a vida com alguém negocia, quase sem perceber, quanto tempo passa junto e quanto passa sozinha. Quem vive sem par faz essa conta de outro jeito, com amigas, família ou consigo mesma. Esse equilíbrio costuma mudar de uma fase para outra.

**Para pensar, no papel ou de cabeça:**

- Numa semana comum, quanto do seu tempo é compartilhado e quanto é só seu?
- Esse equilíbrio combina com você agora? O que mudaria nele, se pudesse?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0006 · Um assunto para depois

Em qualquer relação, alguns assuntos vão ficando para depois: um plano, um incômodo pequeno, uma vontade nova. Nem tudo pede uma conversa. Mas às vezes ajuda escolher um desses assuntos e pensar com calma em como gostaria de tocar nele.

**Para pensar, no papel ou de cabeça:**

- Há algum assunto que você gostaria de conversar com alguém próximo? O que torna difícil começar?
- Qual poderia ser uma primeira frase, simples, para abrir esse assunto?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Rotina e tempo

#### ref-0007 · Uma semana comum

A rotina se mexe em várias fases: um trabalho que termina ou começa, alguém que sai ou chega em casa, um cuidado novo com outra pessoa. Às vezes sobra tempo, às vezes falta. Olhar para uma semana comum ajuda a ver o que está ali de fato.

**Para pensar, no papel ou de cabeça:**

- Numa semana comum, que momentos são escolhidos por você e quais acontecem por obrigação?
- Que parte do dia você gostaria de mudar primeiro, mesmo que um pouco?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0008 · A hora que combina com você

Há fases em que o dia se organiza em volta de outras pessoas e fases em que há mais espaço para os próprios horários. Em qualquer uma delas, dá para notar que momentos do dia combinam mais com você e o que costuma acontecer neles.

**Para pensar, no papel ou de cabeça:**

- Em que hora do dia você costuma ter mais disposição? E o que faz nela hoje?
- Se tivesse meia hora livre amanhã, o que gostaria de fazer com ela?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0009 · O que pode sair da lista

Algumas tarefas continuam na rotina por costume, mesmo quando já não fazem tanto sentido: um compromisso fixo, uma arrumação semanal, um cuidado que outra pessoa já poderia assumir. Rever a lista de vez em quando abre espaço para outras coisas.

**Para pensar, no papel ou de cabeça:**

- Qual tarefa da sua semana você faz mais por costume do que por escolha?
- O que aconteceria se ela fosse feita de outro jeito, por outra pessoa ou com menos frequência?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Trabalho e projetos

#### ref-0010 · O lugar do trabalho hoje

Trabalho pode ser emprego, negócio próprio, trabalho de casa, voluntariado, uma aposentadoria recente ou a vontade de recomeçar. Nesta fase, o lugar que ele ocupa costuma se mexer: às vezes cresce, às vezes diminui, às vezes muda de forma.

**Para pensar, no papel ou de cabeça:**

- Hoje, que espaço o trabalho, de qualquer tipo, ocupa na sua semana? Esse espaço combina com você?
- O que você gostaria de levar do que já fez para o que vem pela frente?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0011 · Um projeto pequeno

Nem todo projeto tem chefe, prazo ou salário. Pode ser aprender uma coisa, organizar as fotos da família, cuidar de umas plantas, escrever, ensinar o que você sabe. Projetos pequenos costumam ser mais fáceis de começar e de manter.

**Para pensar, no papel ou de cabeça:**

- Que projeto você já pensou em começar algumas vezes?
- Qual seria o menor passo possível para começar, algo que caberia em uma hora?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0012 · O que você sabe fazer

Com os anos, cada pessoa junta um repertório de coisas que sabe fazer, muitas vezes sem dar nome a elas: resolver imprevistos, cozinhar para muita gente, negociar, ouvir, consertar, organizar. Esse repertório pode servir para outros caminhos também.

**Para pensar, no papel ou de cabeça:**

- Pense em três coisas que você faz bem e que raramente aparecem num currículo.
- Em que lugar, trabalho ou projeto uma delas poderia ser útil ou dar prazer?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Amizades

#### ref-0013 · Quem está por perto

Amizades mudam com as fases: algumas ficam mais próximas, outras se afastam sem briga, outras começam tarde e ganham importância. É comum que as amizades de hoje sejam bem diferentes das de dez anos atrás.

**Para pensar, no papel ou de cabeça:**

- Com quem você conversou com gosto no último mês?
- Há alguém de quem você gostaria de se aproximar, ou se reaproximar?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0014 · Amizades novas

Fazer amizades na vida adulta costuma pedir mais iniciativa do que na escola ou no começo da vida profissional: os encontros nem sempre acontecem sozinhos. Grupos, cursos, caminhadas e trabalhos voluntários são lugares comuns onde elas começam.

**Para pensar, no papel ou de cabeça:**

- Em que lugares você costuma encontrar pessoas com interesses parecidos com os seus?
- Que atividade você faria com gosto sozinha e que também poderia juntar pessoas?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0015 · O ritmo de cada amizade

Cada amizade tem seu ritmo: há amigas de conversa longa, de mensagem curta, de encontro uma vez por ano, de atividade em comum. Nenhum desses jeitos vale mais que outro. Perceber o ritmo de cada uma pode tirar um pouco da cobrança dos dois lados.

**Para pensar, no papel ou de cabeça:**

- Pense em duas ou três amizades. Que jeito de estar junto funciona com cada uma?
- Há alguma amizade em que você gostaria de mudar o ritmo, para mais ou para menos?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Quem sou hoje

#### ref-0016 · Gostos de agora

Gostos mudam com o tempo. Algumas coisas de que você gostava muito podem ter perdido a graça, e outras que nunca chamaram atenção podem começar a interessar. Notar essas mudanças é um jeito simples de conhecer a pessoa que você é hoje.

**Para pensar, no papel ou de cabeça:**

- De que coisa você passou a gostar nos últimos anos e que antes não chamava sua atenção?
- E que coisa você ainda faz por hábito, mesmo sem tanto gosto?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0017 · Os papéis do dia a dia

Ao longo da vida, cada pessoa junta papéis: filha, tia, mãe, companheira, profissional, vizinha, amiga, a que organiza, a que resolve. Alguns continuam, outros mudam de tamanho, outros ficam para trás. Às vezes um papel novo aparece sem aviso.

**Para pensar, no papel ou de cabeça:**

- Que papéis ocupam mais do seu tempo hoje? E quais você escolheria ocupar mais?
- Existe algum papel que você gostaria de experimentar, mesmo que por pouco tempo?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0018 · Como você se apresentaria

Quando alguém pergunta “o que você faz?”, a resposta costuma vir pronta: uma profissão, uma família, uma cidade. Essa resposta nem sempre conta o que mais importa para você hoje. Dá para experimentar outros jeitos de se apresentar, só para você.

**Para pensar, no papel ou de cabeça:**

- Como você se apresentaria falando só do que gosta de fazer?
- Que três palavras descrevem bem esta fase da sua vida?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Planos e interesses

#### ref-0019 · Uma curiosidade antiga

Muita gente guarda uma curiosidade antiga: um instrumento, uma língua, um lugar, um assunto que sempre quis entender. Às vezes ela fica guardada por falta de tempo, de dinheiro ou de companhia. Às vezes, só porque ainda não houve um começo.

**Para pensar, no papel ou de cabeça:**

- Que curiosidade você carrega há muito tempo?
- Que versão bem pequena dela daria para experimentar este mês, de graça ou quase?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0020 · Planos de tamanhos diferentes

Planos podem ser grandes, como uma mudança ou uma viagem longa, ou pequenos, como conhecer um bairro, voltar a uma aula, receber gente em casa. Os pequenos costumam caber melhor na semana, e muitas vezes abrem caminho para os grandes.

**Para pensar, no papel ou de cabeça:**

- Pense em um plano grande e um plano pequeno para os próximos meses.
- O que o plano pequeno pede: tempo, companhia, dinheiro, informação?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0021 · Pistas de interesse

Interesses às vezes aparecem em pistas pequenas: uma vitrine onde você para, um assunto que puxa conversa, um tipo de notícia que você sempre lê até o fim. Juntar essas pistas pode mostrar um interesse que ainda não tem nome.

**Para pensar, no papel ou de cabeça:**

- Nos últimos dias, o que fez você parar para olhar, ler ou perguntar mais?
- O que essas coisas têm em comum?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### Outro assunto dentro da proposta do app

#### ref-0022 · Dar nome ao assunto

Às vezes o assunto não cabe em nenhum tema da lista: uma mudança de casa, um cuidado com alguém da família, uma decisão de compra, uma vontade de mexer em alguma coisa sem saber bem qual. Dizer o assunto em poucas palavras costuma ser um bom começo.

**Para pensar, no papel ou de cabeça:**

- Em uma frase, que assunto você quer pensar hoje?
- Ele é mais sobre uma decisão a tomar, uma situação a entender ou uma vontade a explorar?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0023 · O que está nas suas mãos

Em quase toda situação há uma parte que depende de você e outra que não depende. Separar as duas costuma deixar o assunto mais claro e mostrar por onde dá para começar, seja uma coisa pequena, seja uma decisão maior.

**Para pensar, no papel ou de cabeça:**

- Pensando no seu assunto, o que depende de você?
- Qual seria um passo pequeno, possível nesta semana?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

#### ref-0024 · Com quem conversar

Alguns assuntos ficam mais leves quando são conversados com alguém: uma amiga, uma pessoa da família, alguém que já passou por algo parecido. Outros pedem quem entende do tema, como uma advogada, um médico ou uma psicóloga.

**Para pensar, no papel ou de cabeça:**

- Quem, na sua vida, costuma ouvir bem esse tipo de assunto?
- Esse assunto pede alguma informação de saúde, dinheiro ou direitos? Quem poderia dar essa informação?

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---
