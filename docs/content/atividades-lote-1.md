# Atividades — lote 1 (act-0016 a act-0030) · folha de revisão

Mônica, estas 15 atividades são **rascunhos escritos pelo Claude** (4 out. 2026), a pedido do João,
para a sua revisão. Nenhuma delas vai para usuárias antes da sua aprovação (spec §22): todas estão
no catálogo como `rascunho`, sem revisora, versão 1. Pode editar à vontade, inclusive título,
tempo e as etiquetas (energia, companhia, mobilidade…), que são o que o "Me tira do sofá" usa para sugerir.

Observação: o protótipo de hoje (Fase 0) mostra o catálogo inteiro, sementes incluídas, todas ainda
em rascunho. Estas 15 aparecem nele do mesmo jeito, para teste interno.

## Por que estas 15

As 15 sementes da spec (§5.1) concentravam-se em **Criar** (5 de 15) e em atividades a sós.
O lote tenta equilibrar o catálogo:

| | Antes (15) | Depois (30) |
|---|---|---|
| Categorias | criar 5 · sair 3 · aprender 2 · refletir 2 · conectar 1 · organizar 1 · explorar 1 | criar 6 · os outros seis 4 cada |
| Companhia | só comigo 10 · tanto faz 4 · **com alguém 1** | só comigo 20 · tanto faz 5 · com alguém 5 |
| Energia | baixa 8 · normal 7 · **alta 0** | baixa 18 · normal 11 · alta 1 |
| Mobilidade | sentada 8 · leve 7 · **moderada 0** | sentada 19 · leve 10 · moderada 1 |
| Até 10 min (inteira) | 5 | 10 |
| Onde | casa 8 · casa ou fora 4 · fora 3 | casa 15 · casa ou fora 10 · fora 5 |
| Orçamento | zero 12 · baixo 3 · médio 0 | zero 26 · baixo 4 · médio 0 |
| Mundos (§3.1) | nenhuma semente para "filhos adultos"; "nós dois" só indiretamente | os seis mundos cobertos |

O mundo de cada atividade é só uma proposta. Desde o lote 2 (5 out. 2026), o catálogo tem o campo
"mundo" (`worlds`) e cada atividade abaixo está nele com o mundo desta tabela; as sementes também
ganharam mundo (ver `atividades-lote-2.md`). Mudar o mundo aqui significa mudar também no catálogo.

| id | título | mundo | categoria | tempo | por que entrou |
|---|---|---|---|---|---|
| act-0016 | Uma gaveta por vez | O que faço com esse tempo? | Organizar | 10–15 min | organizar tinha 1; tarefa curta e com fim claro |
| act-0017 | A semana numa folha | O que faço com esse tempo? | Organizar | 10 min | organizar; até 10 min; sentada, em casa, custo zero |
| act-0018 | Um canto para o que é seu | Quem sou eu agora? | Organizar | 20–30 min | organizar; liga a casa a interesses dela, sem falar do passado |
| act-0019 | Rabisco de um minuto | Experimenta isso | Criar | 5 min | o item mais curto do catálogo; prompt da spec §4.6 |
| act-0020 | Paleta de cinco cores | Quem sou eu agora? | Refletir | 10–15 min | refletir; prompt da spec §4.6; sentada, custo zero |
| act-0021 | Mudei de ideia | Quem sou eu agora? | Refletir | 10 min | refletir voltado para o presente; até 10 min |
| act-0022 | Museu pela tela | Meu mundo pode aumentar | Explorar | 15–30 min | explorar tinha 1; cultura sem sair de casa |
| act-0023 | Feira sem lista | Experimenta isso | Explorar | 45–90 min | primeira de energia alta e mobilidade moderada; com variação |
| act-0024 | Rádio de outra cidade | Experimenta isso | Explorar | 5–10 min | explorar; até 10 min; sentada, custo zero |
| act-0025 | O que você anda ouvindo? | Minha relação com filhos adultos | Conectar | 15–30 min | "com alguém"; mundo sem nenhuma atividade; serve também para quem não tem filhos |
| act-0026 | Me ensina uma coisa? | Minha relação com filhos adultos | Aprender | 20–40 min | "com alguém"; inverte quem ensina; serve com amiga, vizinha, colega |
| act-0027 | Sorteio de programas | Nós dois agora | Conectar | 10–15 min | "com alguém"; mundo "nós dois" com alternativa sem parceiro(a) |
| act-0028 | Convite para um café | Meu mundo pode aumentar | Conectar | 5–10 min | "com alguém"; amizades; até 10 min |
| act-0029 | Carteirinha da biblioteca | Meu mundo pode aumentar | Sair | 30 min–1 h | estudo/cultura; saída com custo zero; com variação digital |
| act-0030 | Como isso funciona? | O que faço com esse tempo? | Aprender | 10–15 min | aprender tinha 2; curiosidade concreta, sentada |

## Pontos em que eu gostaria da sua opinião

- **Variações escritas por mim.** Nas sementes, a variação ficou para você. Aqui, como tudo é
  rascunho, escrevi as variações de mobilidade/energia (0016, 0018, 0023, 0029), uma alternativa
  sem lápis de cor (0020) e a alternativa "sozinha" (0027). Esta última não é de energia nem de
  mobilidade; usei o campo porque a spec pede alternativa sem parceiro(a) em "Nós dois agora".
- **Filhos adultos (0025, 0026).** Escrevi para funcionar também com sobrinha, afilhado, amiga,
  colega, para não presumir filhos. Fica natural para quem tem filhos? O passo final da 0025 pede
  para contar "uma coisa de que gostou ou que chamou sua atenção", de propósito sem comentar o gosto do outro.
- **Feira sem lista (0023)** é a única de energia alta e mobilidade moderada. "Pergunte a quem
  vende" pode ser desconfortável para algumas pessoas; vale manter?
- **Orçamento "médio" continua vazio.** Não criei atividade com gasto médio para não presumir
  dinheiro; se quiser algumas (cinema, teatro, curso pago), seria melhor partir de você.
- **"Museu pela tela" (0022) e "Carteirinha da biblioteca" (0029)** dependem de serviços que variam
  de cidade para cidade (acervo on-line, empréstimo digital, documentos pedidos). Os passos dizem
  "procure" e "confira" em vez de prometer que existe.

## As 15 atividades, texto completo

### act-0016 · Uma gaveta por vez

**Resumo:** Esvaziar uma única gaveta, decidir o que volta para ela e parar por ali.

**Categoria:** Organizar · **Tempo:** 10–15 min · **Energia:** normal · **Onde:** em casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** leve

**O que precisa:** Uma gaveta · Uma mesa

**Passos:**

1. Escolha uma gaveta pequena, dessas que juntam coisas soltas.
2. Tire tudo e espalhe sobre uma mesa.
3. Separe em três montes: volta para a gaveta, vai para outro lugar, sai de casa.
4. Guarde o que fica. A gaveta de hoje é só essa.

**Variação:** Com pouca energia ou mobilidade reduzida: troque a gaveta por uma caixa, bolsa ou nécessaire que já esteja ao alcance e faça sentada.

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0017 · A semana numa folha

**Resumo:** Desenhar a semana numa folha e reservar nela um espaço para algo escolhido por você.

**Categoria:** Organizar · **Tempo:** 10 min · **Energia:** baixa · **Onde:** em casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Papel · Caneta

**Passos:**

1. Divida uma folha em sete colunas, uma para cada dia.
2. Anote o que já está marcado: compromissos, horários, tarefas fixas.
3. Procure um espaço livre e escreva nele uma coisa que gostaria de fazer.
4. Deixe a folha num lugar onde você a veja durante a semana.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0018 · Um canto para o que é seu

**Resumo:** Liberar um pequeno espaço da casa para algo seu: um livro em andamento, um bordado, uma planta.

**Categoria:** Organizar · **Tempo:** 20–30 min · **Energia:** normal · **Onde:** em casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** leve

**O que precisa:** Um canto da casa

**Passos:**

1. Escolha um canto pequeno: uma ponta de mesa, uma prateleira, o lado de uma poltrona.
2. Tire o que não precisa ficar ali.
3. Coloque uma coisa sua que queira ter à mão: um livro, um caderno, um bordado, uma planta.
4. Se mora com outras pessoas, combine que aquele canto fica assim.

**Variação:** Com pouca energia ou mobilidade reduzida: use o espaço que já está ao alcance de onde você costuma sentar, como a mesinha ao lado da poltrona.

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0019 · Rabisco de um minuto

**Resumo:** Rabiscar por um minuto sem tentar fazer algo bonito e depois dar um título ao resultado.

**Categoria:** Criar · **Tempo:** 5 min · **Energia:** baixa · **Onde:** em casa ou fora · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Papel · Caneta · Relógio ou celular

**Passos:**

1. Pegue papel e caneta e marque um minuto no relógio ou no celular.
2. Rabisque sem parar e sem tentar fazer algo bonito.
3. Quando o tempo acabar, gire a folha e olhe o rabisco de vários lados.
4. Dê um título a ele.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0020 · Paleta de cinco cores

**Resumo:** Escolher cinco cores para a fase atual e dar a cada uma o nome de uma coisa do dia a dia.

**Categoria:** Refletir · **Tempo:** 10–15 min · **Energia:** baixa · **Onde:** em casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Papel · Lápis de cor, canetinhas ou o que tiver em casa

**Passos:**

1. Pense na sua vida de agora, do jeito que ela está.
2. Escolha cinco cores que combinam com ela.
3. Pinte um quadradinho de cada cor numa folha.
4. Ao lado de cada cor, escreva uma palavra do dia a dia: café, varanda, domingo, estrada.

**Variação:** Sem lápis de cor: junte cinco objetos coloridos da casa sobre a mesa e anote uma palavra para cada um.

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0021 · Mudei de ideia

**Resumo:** Anotar três coisas sobre as quais você mudou de ideia nos últimos anos e o que pensa delas hoje.

**Categoria:** Refletir · **Tempo:** 10 min · **Energia:** baixa · **Onde:** em casa ou fora · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Papel e caneta ou celular

**Passos:**

1. Pegue papel e caneta ou abra uma nota no celular.
2. Anote três coisas sobre as quais mudou de ideia nos últimos anos: uma comida, um lugar, um costume, um jeito de passar o domingo.
3. Ao lado de cada uma, escreva em uma frase o que pensa hoje.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0022 · Museu pela tela

**Resumo:** Visitar o acervo on-line de um museu que gostaria de conhecer e escolher uma obra.

**Categoria:** Explorar · **Tempo:** 15–30 min · **Energia:** baixa · **Onde:** em casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Internet · Celular, tablet ou computador

**Passos:**

1. Escolha um museu que gostaria de conhecer, no Brasil ou fora.
2. Procure na internet o acervo on-line ou a visita virtual dele.
3. Passeie sem roteiro, no seu ritmo.
4. Escolha uma obra e anote o nome dela e de quem fez.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0023 · Feira sem lista

**Resumo:** Percorrer uma feira ou um mercado sem lista de compras, reparando no que não conhece.

**Categoria:** Explorar · **Tempo:** 45–90 min · **Energia:** alta · **Onde:** fora de casa · **Companhia:** sozinha ou com alguém · **Orçamento:** baixo · **Mobilidade:** moderada

**O que precisa:** Sair de casa · Uma sacola

**Passos:**

1. Escolha uma feira livre ou um mercado municipal que ainda não conhece ou que não visita há tempo.
2. Percorra as bancas sem lista de compras.
3. Pergunte a quem vende o nome de uma fruta, um tempero ou um peixe que não conhece.
4. Se quiser, leve uma coisa pequena para provar em casa.

**Variação:** Com pouca energia ou mobilidade reduzida: vá num horário com menos movimento, escolha um trecho curto ou uma banca só e pare onde houver lugar para sentar.

**Cuidados (safety tags):** caminhada, deslocamento

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0024 · Rádio de outra cidade

**Resumo:** Ouvir por alguns minutos uma rádio ao vivo de uma cidade de outro país.

**Categoria:** Explorar · **Tempo:** 5–10 min · **Energia:** baixa · **Onde:** em casa ou fora · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Celular · Internet

**Passos:**

1. Escolha uma cidade de outro país que nunca visitou.
2. Procure na internet uma rádio ao vivo de lá.
3. Ouça alguns minutos do que estiver passando: música, notícia, conversa.
4. Anote o nome da cidade e uma coisa que chamou sua atenção.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0025 · O que você anda ouvindo?

**Resumo:** Pedir a alguém mais jovem uma música, série ou livro de que anda gostando e conhecer a indicação.

**Categoria:** Conectar · **Tempo:** 15–30 min · **Energia:** baixa · **Onde:** em casa ou fora · **Companhia:** com alguém · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Uma pessoa · Celular

**Passos:**

1. Escolha alguém mais jovem com quem tem contato: filho, filha, sobrinha, afilhado, uma colega.
2. Pergunte, por mensagem ou pessoalmente, o que essa pessoa anda ouvindo, vendo ou lendo.
3. Experimente um pedaço da indicação.
4. Se quiser, conte depois uma coisa de que gostou ou que chamou sua atenção.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0026 · Me ensina uma coisa?

**Resumo:** Pedir a alguém que sabe fazer algo que você não sabe uma aula curta, de até meia hora.

**Categoria:** Aprender · **Tempo:** 20–40 min · **Energia:** normal · **Onde:** em casa ou fora · **Companhia:** com alguém · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Uma pessoa

**Passos:**

1. Pense em alguém que sabe uma coisa que você não sabe: filho ou filha, amiga, vizinha, alguém do trabalho.
2. Peça uma aula curta, de até meia hora: um recurso do celular, um ponto de crochê, um atalho no computador.
3. Faça junto com a pessoa, lado a lado ou por chamada de vídeo.
4. Anote o passo que quiser lembrar.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0027 · Sorteio de programas

**Resumo:** Escrever ideias de programas em papeizinhos, sortear um e marcar o dia.

**Categoria:** Conectar · **Tempo:** 10–15 min · **Energia:** baixa · **Onde:** em casa · **Companhia:** com alguém · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Papel · Caneta · Uma pessoa

**Passos:**

1. Chame uma pessoa para fazer junto: parceiro ou parceira, amiga, irmã.
2. Cada pessoa escreve três programas em papeizinhos, simples ou fora do habitual.
3. Dobre os papéis, misture e sorteie um.
4. Marquem um dia para fazer.

**Variação:** Sozinha: escreva seis programas, sorteie um e marque o dia na agenda.

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0028 · Convite para um café

**Resumo:** Mandar um convite simples para alguém que você gostaria de conhecer melhor.

**Categoria:** Conectar · **Tempo:** 5–10 min · **Energia:** baixa · **Onde:** em casa ou fora · **Companhia:** com alguém · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Celular

**Passos:**

1. Pense em alguém que gostaria de conhecer melhor: uma vizinha, uma colega, alguém de um grupo que frequenta.
2. Escreva uma mensagem curta com um convite simples: um café, uma volta na praça, uma visita.
3. Sugira um ou dois dias possíveis.
4. Envie e deixe a resposta chegar no tempo da outra pessoa.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0029 · Carteirinha da biblioteca

**Resumo:** Ir à biblioteca pública mais perto, fazer o cadastro e sair com um livro.

**Categoria:** Sair · **Tempo:** 30 min–1 h · **Energia:** normal · **Onde:** fora de casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** leve

**O que precisa:** Sair de casa · Documento com foto

**Passos:**

1. Procure a biblioteca pública mais perto de você: municipal, estadual ou de um centro cultural.
2. Confira o horário e os documentos pedidos para o cadastro.
3. Vá até lá e faça a carteirinha.
4. Antes de sair, passeie pelas estantes e escolha um livro.

**Variação:** Com pouca energia ou mobilidade reduzida: veja se a biblioteca da sua cidade empresta livros digitais e faça o cadastro pela internet.

**Cuidados (safety tags):** deslocamento

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---

### act-0030 · Como isso funciona?

**Resumo:** Escolher um objeto do dia a dia e descobrir como ele funciona.

**Categoria:** Aprender · **Tempo:** 10–15 min · **Energia:** baixa · **Onde:** em casa · **Companhia:** só comigo · **Orçamento:** zero · **Mobilidade:** sentada

**O que precisa:** Internet

**Passos:**

1. Escolha um objeto que você usa sem saber explicar como funciona: zíper, geladeira, controle remoto, código de barras.
2. Procure uma explicação curta, em texto ou vídeo.
3. Explique com suas palavras, em voz alta ou numa anotação.

**Variação:** —

**Cuidados (safety tags):** —

Mônica: [ ] aprovada  [ ] aprovada com edição  [ ] refazer  [ ] descartar

Comentário:

---
