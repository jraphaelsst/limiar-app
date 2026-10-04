/**
 * Safety triage rules — GOVERNED CONTENT (spec §22). Every change here is a change to a
 * safety-critical classifier: bump `VERSAO_TRIAGEM`, run the regression corpus
 * (src/safety/__tests__) and record who approved it (docs/design/decisions.md).
 *
 * How to read a rule
 *  - `padrao` is a regular expression over the NORMALIZED text (src/safety/normalize.ts):
 *    lowercase, no accents, shorthand expanded ("vc" → "voce", "pra" → "para", "to" → "estou"),
 *    punctuation turned into " . " sentence marks. Write words in normal spelling: doubled
 *    letters are collapsed on both sides when the rule is compiled ("morrer" ≡ "morrerrr" ≡ "morer").
 *    The whole pattern is matched on word boundaries. `FIM` = end of a sentence.
 *  - `nivel`: vermelho > violencia > amarelo. The highest level among matched rules wins.
 *  - `negavel` (default true): if the word right before the match is a negation (não, nunca,
 *    jamais, nem), the match still counts but is CAPPED AT AMARELO — a negation never makes a
 *    risk phrase green ("não quero morrer" ⇒ amarelo). Rules whose risk IS the negation
 *    ("não quero mais viver") set `negavel: false`.
 *  - IDIOMAS are masked BEFORE the rules run, so "morri de vergonha" cannot trip a rule but a
 *    real risk phrase elsewhere in the same text still does.
 *
 * In doubt between levels, the rules take the safer route (spec §7.1).
 */

export const VERSAO_TRIAGEM = 'triagem-2026.10.04';

export type Nivel = 'verde' | 'amarelo' | 'vermelho' | 'violencia';
export type Sinal = 'autolesao' | 'violencia' | 'sofrimento_persistente' | 'dependencia_do_app';

export type Regra = {
  readonly id: string;
  readonly nivel: Exclude<Nivel, 'verde'>;
  readonly sinal: Sinal;
  readonly padrao: string;
  readonly negavel?: boolean;
  /** Safety-net rule: counts only when NO other rule matched (an unknown phrasing still is never verde). */
  readonly rede?: boolean;
};

/**
 * An idiom is neutralised minimally: inside its match only the death/kill words (mor…, mat…,
 * suicid…) are replaced by a mask token, so the rest of the sentence is still read
 * ("morro de medo dele" keeps "medo dele" for the violence rule).
 */
export type Idioma = { readonly id: string; readonly padrao: string };

/** End of a sentence (normalize turns . , ; : ! ? and line breaks into " . "). */
const FIM_ALT = String.raw` \.|$`;
const FIM = `(?=${FIM_ALT})`;

/** Third parties who show up in reports of violence (incl. against older women by adult children). */
const PESSOA = String.raw`(?:ele|ela|minha cuidadora|meu cuidador|o velho|o veio|meu marido|o meu marido|meu ex|meu ex marido|o meu ex|meu companheiro|meu namorado|meu noivo|meu esposo|meu filho|minha filha|meu genro|minha nora|meu neto|minha neta|meu pai|minha mae|meu irmao|minha irma|meu cunhado|meu padrasto|meu sogro|minha sogra|meu vizinho|o vizinho|o pai dos meus filhos|alguem|um homem|esse homem|aquele homem)`;

/** `a` and `b` at most ~60 characters apart (a comma or full stop between is fine), in either order. */
const PERTO = (a: string, b: string, max = 60) => String.raw`(?:${a}).{0,${max}}?(?:${b})|(?:${b}).{0,${max}}?(?:${a})`;

const MORRER = String.raw`(?:morrer|morre)`;
/** "ele está me matando (aos poucos)" — a person doing it is violência; a shoe or a back pain is not. */
const PERSONA_ME_MATANDO = String.raw`(?:ele|ela|meu marido|meu ex|meu companheiro|meu filho|meu namorado) (?:esta |ta )?me matando`; // "morre" also catches the common typo of the infinitive
/** Includes "quer": "ela quer morrer" is a third-party risk worth the same screen. */
const QUERER = String.raw`(?:quero|queria|quer|querer|queira|quisesse|quis|ja quis|gostaria de|gostaria muito de)(?: (?:tanto|muito|mesmo|so|realmente|sinceramente|demais))?`;
/** First person only: "ele quer me matar / me machucar" is a THREAT (violência), not self-harm. */
const QUERO = String.raw`(?:quero|queria|querer|queira|quisesse|gostaria de|gostaria muito de)(?: (?:tanto|muito|mesmo|so|realmente|sinceramente|demais))?`;
const PENSAR = String.raw`(?:penso em|penso muito em|pensando em|pensado em|pensado muito em|pensei em|pensar em|fico pensando em|so penso em|ideia de|cogitando|cogito)`;
const VONTADE = String.raw`(?:vontade de|desejo de|tenho vontade de|sinto vontade de|da vontade de|bate uma vontade de)`;

export const IDIOMAS: readonly Idioma[] = [
  {
    id: 'idioma.morrer-de',
    padrao: String.raw`(?:quase )?(?:morrer|morrendo|morri|morro|morre|morreu|morria|morremos|morta|morto|mortas|mortos) de (?:tanto )?(?:rir|riso|risada|vergonha|medo|susto|fome|sede|sono|frio|calor|saudade|saudades|tedio|inveja|ciume|ciumes|preguica|cansaco|curiosidade|vontade|amor|paixao|alegria|felicidade|orgulho|emocao|velha|velho|raiva|nervoso|ansiedade|trabalhar|trabalho|estudar|amores|chorar de rir|gargalhar|tanto rir)`,
  },
  {
    id: 'idioma.matar-de',
    padrao: String.raw`(?:me |te |nos |vai me |vou me |ia me )?(?:mata|matar|mato|matou|matando|matei|mataria|matava|matam|matavam) de (?:tanto )?(?:rir|riso|vergonha|susto|saudade|saudades|curiosidade|tedio|raiva|preocupacao|cansaco|trabalhar|trabalho|estudar|limpar|correr|andar|ansiedade|ciume|ciumes|inveja|fome|calor|frio|nervoso|orgulho)`,
  },
  {
    id: 'idioma.matar-objeto',
    padrao: String.raw`(?:matar|mato|matei|matando|matamos|mataria|matou|mata|matava) (?:a |o |um |uma |as |os )?(?:saudade|saudades|tempo|aula|aulas|sede|fome|vontade|curiosidade|charada|charadas|questao|barata|baratas|mosquito|mosquitos|pernilongo|pernilongos|formiga|formigas|mosca|moscas|aranha|aranhas|cupim|cupins|lesma|lesmas|pulga|pulgas|piolho|piolhos|rato|ratos|praga|pragas|dois coelhos|um leao|leao|cobra)`,
  },
  {
    id: 'idioma.mataria-por',
    padrao: String.raw`(?:mataria|matava|mato|matar) (?:alguem )?por (?:um|uma|esse|essa|isso|aquele|aquela|uns|umas|mais um|mais uma)`,
  },
  { id: 'idioma.esquadrao-suicida', padrao: String.raw`esquadrao suicida` },
  {
    id: 'idioma.de-morrer',
    padrao: String.raw`de morrer de (?:bom|boa|bonito|bonita|lindo|linda|gostoso|gostosa|chato|chata|feio|feia|rir)|(?:lindo|linda|bom|boa|gostoso|gostosa|chato|chata|calor|frio|fila|preco|lasanha|bolo|torta|comida|feijoada|pudim|doce|sobremesa|pizza) de morrer`,
  },
  { id: 'idioma.achei-que-ia-morrer', padrao: String.raw`(?:achei|pensei|jurei|jurava) que (?:eu )?ia morrer` },
  { id: 'idioma.matar-do-coracao', padrao: String.raw`(?:me )?(?:mata|matar|matou|matando) do coracao` },
  {
    id: 'idioma.overdose-de',
    padrao: String.raw`overdose de (?:serie|series|chocolate|cafe|novela|novelas|filme|filmes|doce|doces|trabalho|informacao|fofura|netflix|livros?)`,
  },
];

export const REGRAS: readonly Regra[] = [
  // ───────────── VERMELHO — desejo de morrer, autolesão, plano, risco imediato ─────────────
  {
    id: 'vermelho.desejo-de-morrer',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:${QUERER}|${VONTADE}|${PENSAR}|prefiro|preferia|preferiria|melhor|melhor eu|seria melhor|sonho em|merecia|mereco|deixa eu|me deixa|queria poder|quero poder|deveria|devia|hora de|chegou a hora de|pronta para|quem me dera|so queria|quero e|queria era) ${MORRER}\b|(?:penso|pensando|pensado|pensei|pensar|fico pensando) (?:muito |o tempo todo |todo dia )?(?:na morte${FIM}|na morte (?:o tempo todo|todo dia|toda hora|todos os dias|ultimamente|sempre)|na minha (?:propria )?morte)|pensamentos? (?:de morte|suicidas?)|${QUERER} ter morrido|(?:penso|pensando|pensado|pensei|pensar|fico pensando) (?:muito |o tempo todo |todo dia )?(?:em|na) morte(?! d[aeo] | de )|a morte (?:e|seria) (?:a |um |uma )?(?:solucao|alivio|descanso|saida|libertacao)`,
  },
  { id: 'vermelho.morrer-hoje', nivel: 'vermelho', sinal: 'autolesao', padrao: String.raw`(?:vou|eu vou|quero|vai ser hoje que eu vou) ${MORRER} (?:hoje|esta noite|essa noite|amanha)` },
  {
    id: 'vermelho.que-eu-morra',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:tomara|queria|quero|quem dera|espero|seria bom|seria melhor|rezo para|peco a deus|peco para deus|pedi a deus) (?:que )?(?:eu )?(?:morra|morresse)`,
  },
  {
    id: 'vermelho.estar-morta',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:${QUERER}|prefiro|preferia|melhor|seria melhor|seria mais facil) (?:eu )?(?:estar|ficar|tivesse|estivesse|ja estar|ja estivesse) (?:morta|morto)|(?:melhor|mais facil) (?:eu )?(?:morta|morto)|(?:melhor|bom|mais facil|queria|seria melhor) se eu (?:estivesse morta|estivesse morto|tivesse morrido|morresse|nao existisse|nao estivesse aqui|nao estivesse mais aqui|sumisse|desaparecesse)`,
  },
  {
    id: 'vermelho.me-matar',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:${QUERO}|${VONTADE}|${PENSAR}|vou|eu vou|tentei|tentar|tentativa de|coragem de|coragem para|jeito de|como|maneira de|forma de|planejando|plano de|plano para|preciso|devia|deveria|melhor|decidi|antes de|beber ate|para eu|mandando eu|manda eu) me (?:matar|mate)\b|\bme (?:mato|matei|mataria|matarei|matasse)\b|(?:estou|ando|vou|eu) me matando`,
  },
  {
    id: 'vermelho.se-matar',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:quer|quero|queria|vai|vou|pensa em|pensando em|pensou em|vontade de|tentou|tentei|ameaca|ameacou|falou em|fala em|disse que vai) se (?:matar|mata)`,
  },
  { id: 'vermelho.suicidio', nivel: 'vermelho', sinal: 'autolesao', padrao: String.raw`suicid\w*|me suicid\w*` },
  {
    id: 'vermelho.tirar-a-vida',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:tirar|tiro|tirei|tirasse|tiraria) (?:a )?(?:minha |propria |minha propria )vida|(?:acabar|acabo|acabaria|acabasse) com (?:a )?(?:minha )?(?:vida|existencia)|(?:dar|dou|por|ponho) (?:um )?fim (?:a|na|em|a minha|na minha|em minha) (?:minha )?vida|dar cabo da (?:minha )?vida`,
  },
  {
    id: 'vermelho.acabar-com-tudo',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:acabar|acabo|acabaria|acabasse|terminar|termino) com (?:tudo|essa vida|esta vida|o meu sofrimento|meu sofrimento|esse sofrimento|este sofrimento)\b|(?:por|dar|dou|ponho) (?:um )?fim (?:a|em|no|nisso|nisto)? ?(?:tudo|sofrimento|meu sofrimento)\b|que tudo (?:acabe|acabasse|termine|terminasse)|desist(?:ir|i|indo|o) de tudo`,
  },
  {
    id: 'vermelho.nao-quero-viver',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`nao (?:quero|queria|quer|aguento|consigo|tenho vontade de|tenho mais vontade de|vejo por que|vejo porque|sei por que|sei porque|sei para que|gostaria de) (?:mais )?(?:viver|continuar vivendo|continuar viva|seguir vivendo|estar viva|ficar viva|existir)|nao quero viver mais|(?:sem|perdi a|perdi toda a|perdendo a|nao tenho|nao tenho mais|nao sinto|nenhuma) vontade de viver|nao (?:quero|queria|aguento) (?:mais )?(?:estar|ficar|viver) (?:nesse|neste) mundo|nao (?:quero|queria) (?:mais )?(?:estar|ficar) aqui(?: mais)?${FIM}`,
  },
  {
    id: 'vermelho.nao-acordar',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`nao (?:quero|queria|gostaria de|queria mais|quero mais) (?:mais )?acordar(?= mais| amanha| hoje| nunca| de novo| no dia seguinte| e |${FIM_ALT})|nao (?:queria|quero) ter acordado|(?:dormir|deitar|apagar|fechar os olhos|dormisse|deitasse|apagasse) e nao (?:acordar|acordasse|abrir|abrisse|levantar|levantasse)(?: mais)?|nunca mais acordar|para nao acordar (?:mais|amanha)|para nao acordar${FIM}|(?:dormir|descansar|apagar|dormisse|sumir|ir) para sempre|(?:quero|queria|so quero|vontade de|preciso) (?:descansar|dormir) (?:em paz|eternamente)`,
  },
  {
    id: 'vermelho.sumir',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:${QUERER}|${VONTADE}|${PENSAR}|so queria|seria melhor|melhor|melhor eu|e melhor eu|seria um alivio|seria bom) (?:sumir|desaparecer|evaporar|partir|nao existir|deixar de existir|parar de existir|nao estar aqui|nao estar mais aqui|nao ter nascido|virar po)(?! (?:de ferias|para (?:a |uma )?(?:praia|ilha|viagem)|uns dias|por uns dias|no fim de semana|para o interior|para a praia|debaixo d[aeo]|embaixo d[aeo]))|sumir de vez|${QUERER} (?:\w+ ){0,4}e sumir${FIM}|nao (?:queria|devia|deveria) ter nascido|(?:queria|preferia) nunca ter nascido`,
  },
  {
    id: 'vermelho.vida-sem-sentido',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`(?:a vida|minha vida|a minha vida|viver|essa vida) (?:nao tem (?:mais )?(?:sentido|graca nenhuma)|perdeu (?:o |todo o )?sentido|nao vale (?:mais )?a pena|nao faz (?:mais )?sentido)|nao vale (?:mais )?a pena (?:viver|continuar|seguir|estar viva)|(?:para|por) que (?:viver|continuar vivendo|continuar viva|eu ainda estou viva|estou viva)|nao (?:tenho|vejo|encontro) (?:mais )?(?:nenhum )?(?:motivo|motivos|razao|razoes|sentido|porque|por que) (?:para|de|em) (?:viver|continuar vivendo|continuar|seguir|estar aqui|estar viva)|nao tenho (?:mais )?(?:pelo que|por que|porque|para que) viver|nao vejo (?:outra |nenhuma )?saida(?: nenhuma)?(?: para mim| para a minha vida| para minha vida)?${FIM}|(?:a )?unica saida (?:e|seria) (?:${MORRER}|sumir|me matar|acabar com tudo|a morte|partir)`,
  },
  {
    id: 'vermelho.fardo',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:todo mundo|todos|minha familia|meus filhos|eles|elas|o mundo|voces|a familia) (?:ficaria|ficariam|estaria|estariam|viveria|viveriam|seria|seriam|vai ficar|vao ficar|ia ficar|iam ficar) (?:mais feliz|mais felizes|melhor|melhores|em paz|livres?) sem mim|melhor sem mim|(?:sou|me sinto|virei|virar|me tornei|ser) (?:so )?(?:um peso|um fardo|um estorvo|uma carga)(?: maior)?\b|ninguem (?:sentiria|sentira|ia sentir|vai sentir|notaria|ia notar|vai notar|se importaria|ia se importar) (?:a )?(?:minha falta|falta de mim|se eu)|nao (?:faria|faco|vou fazer|ia fazer) falta (?:para|a) ninguem`,
  },
  {
    id: 'vermelho.cansei-de-viver',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:cansei|cansada|cansado|exausta|desisti|desistir|desistindo|farta|enjoei|enjoada|de saco cheio|cheia) (?:de viver|da vida|de existir|de estar viva|dessa vida|desta vida|de continuar vivendo)`,
  },
  {
    id: 'vermelho.autolesao',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:${QUERO}|${VONTADE}|${PENSAR}|vou|preciso|voltei a|tentei|comecei a) me (?:machucar|ferir|cortar|queimar|bater|punir|mutilar|furar|arranhar|castigar)|\bme (?:corto|cortando|mutilo|mutilando)\b|me (?:cortei|machuquei|queimei|feri|bati|arranhei) (?:de proposito|por querer|para aliviar|para sentir|para me punir|de novo de proposito)|automutil\w*|auto mutil\w*|autolesao|auto lesao|autoagress\w*|cortar (?:os|o|meus|meu) pulsos?`,
  },
  {
    id: 'vermelho.metodo',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:tomar|tomei|tomo|tomaria|engolir|engoli|vou tomar) (?:todos os|todas as|varios|varias|muitos|muitas|um monte de|uma caixa|a caixa|uma caixa inteira|a caixa inteira|uma cartela|a cartela|a cartela inteira|o vidro|o vidro inteiro|um vidro|o frasco|o frasco inteiro|um punhado de|tudo de)(?: de| dos| das| do| da)? (?:meus |minhas |esses |os )?(?:remedios|comprimidos|calmantes|pilulas|rivotril|clonazepam|remedio|comprimido|calmante)|(?:juntando|juntei|guardando|guardei|acumulando|acumulei|escondendo|escondi) (?:os |uns |meus )?(?:remedios|comprimidos|calmantes|pilulas) (?:para|ha|faz|ate)|overdose|(?:tomar|beber|tomei|bebi|tomaria) (?:veneno|chumbinho|soda caustica|agua sanitaria)|me (?:enforcar|enforco|afogar|afogo|envenenar|envenenando)\b|me (?:jogar|jogo|joguei|atirar) (?:da|de|do|pela|na frente d[aeo]|embaixo d[aeo]|debaixo d[aeo]|no|na) (?:um |uma )?(?:ponte|janela|predio|viaduto|sacada|varanda|terraco|laje|carro|trem|metro|onibus|caminhao|rio|linha do trem|penhasco|abismo|alto)|(?:pular|pulo|pulei|pularia) (?:da|de|do|pela|de cima d[aeo]) (?:ponte|janela|predio|viaduto|sacada|varanda|terraco|laje|penhasco|abismo)|(?:me dar|dar|dou|daria) um tiro (?:na (?:minha )?cabeca|em mim)`,
  },
  {
    id: 'vermelho.plano-despedida',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:ja )?(?:sei|decidi|escolhi|planejei|pensei|calculei) (?:como|quando|onde) (?:vou )?(?:me matar|${MORRER}|acabar com tudo|acabar com a minha vida|sumir|partir desse mundo)|(?:ja )?(?:escolhi|marquei|decidi) (?:o dia|a data|a hora)(?: de| para)? (?:${MORRER}|partir|ir embora|acabar|sumir|me matar)|(?:tenho|fiz|tracei) (?:um )?plano (?:para|de) (?:${MORRER}|me matar|acabar com tudo|sumir|acabar com a minha vida)|decidi (?:${MORRER}|partir desse mundo|ir embora desse mundo)|(?:carta|bilhete|mensagem) de despedida|(?:estou|ja estou) me despedindo|(?:esta|essa) e (?:a )?minha despedida|(?:esta|essa) e (?:a )?minha ultima mensagem|adeus (?:a|para) (?:todos|todo mundo|voces)|(?:deixei|escrevi|vou deixar|ja escrevi) (?:a |as |uma |umas )?cartas? (?:para|para os|para a) (?:meus filhos|minha familia|todos|minha filha|meu filho)|nao vou (?:mais )?estar aqui (?:amanha|semana que vem|por muito tempo|no natal|ano que vem)|(?:logo|em breve) nao vou (?:mais )?estar aqui`,
  },
  {
    id: 'vermelho.partir-deste-mundo',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`deus (?:podia |poderia |bem que podia |bem que poderia )?me (?:leve|levasse|levar|leva|busque|buscasse|buscar|recolha|recolher|recolhesse|chame|chamasse|chamar)\b|(?:pedindo|peco|pedi|rezo|rezando|orando|oro) (?:para|a) deus (?:para )?me (?:levar|buscar|recolher|chamar)|(?:${QUERER}|${VONTADE}|so penso em|preciso) (?:ir|partir) (?:logo para o ceu|agora para o ceu|de uma vez para o ceu|dessa para melhor|desta para melhor|embora deste mundo|embora desse mundo|deste mundo|desse mundo|encontrar (?:o meu|meu|minha|a minha) (?:marido|mae|pai|filho|filha))|queria ter ido junto|(?:${QUERER}) (?:virar estrelinha|bater as botas|abotoar o paleto|ir para a cidade de pes juntos)`,
  },
  {
    id: 'vermelho.nao-aguento-mais',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`nao (?:aguento|suporto|aguentaria|vou aguentar|consigo aguentar) (?:mais )?(?:viver|essa vida|esta vida|a vida|existir|continuar vivendo|continuar viva|seguir vivendo|tanta dor|tanto sofrimento|sofrer|de tanto sofrer)\b|nao (?:aguento|suporto) mais(?: nada| isso| tudo| isso tudo| essa dor| esse sofrimento)?${FIM}|nao tenho (?:mais )?forcas? (?:para|de) (?:viver|continuar|seguir|lutar)|nao sei (?:se|quanto tempo) (?:mais )?(?:aguento|vou aguentar|consigo aguentar)(?: mais)?(?: viver| continuar| isso| assim)?${FIM}`,
  },
  {
    id: 'vermelho.negacao-e-o-risco',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`(?:porque|por que|para que) (?:eu )?nao (?:me mato|me matar|morro|${MORRER}|acabo com tudo|acabar com tudo|sumo|sumir)|ainda nao (?:me matei|fiz isso|tentei de novo|acabei com tudo)|nao (?:vou|irei) me matar (?:hoje|agora|ainda|por enquanto|por agora)|nao (?:vejo|tenho|encontro) (?:nenhum )?(?:motivo|razao|motivos) (?:para|de) nao (?:me matar|${MORRER}|acabar|sumir)|so nao (?:me matei|me mato|morri|fiz nada|acabei com tudo) (?:ainda|por causa|porque|pelos|pelas)|nao me (?:mato|matei) (?:ainda|porque|por causa|pelos|pelas|so por)`,
  },
  {
    id: 'vermelho.risco-imediato',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:estou|ja estou) (?:na beira|em cima|na beirada|no alto|no parapeito) (?:d[aeo] )?(?:ponte|predio|janela|viaduto|telhado|sacada|laje|penhasco)|(?:estou|ja estou) com (?:a lamina|a gilete|os remedios|os comprimidos|a corda|a arma|o veneno) na mao|(?:e|vai ser) hoje que (?:eu )?(?:acabo com tudo|me mato|morro)`,
  },

  // ───────────── VIOLÊNCIA — agressão, ameaça, controle, perseguição, risco por terceiro ─────────────
  {
    id: 'violencia.agressao',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`\bme (?:bateu|bate|batia|bateram|batem|agrediu|agride|agredia|agrediram|espancou|espanca|espancava|empurrou|empurra|empurrava|chutou|chuta|esbofeteou|socou|soca|estapeou|enforcou|enforca|esganou|estrangulou|sufocou|queimou|arrastou|jogou contra|jogou na parede|jogou no chao)\b|${PESSOA} (?:me )?(?:machucou|machuca|machucava)\b|(?:bate|bateu|batia|vai bater) em mim|(?:me deu|me da|me dava|levei) (?:um |uns )?(?:soco|socos|murro|murros|chute|chutes|surra|surras|empurrao|pontape|tapa na cara|tapas na cara|tapa no rosto)|levant\w* a mao (?:para|contra) mim|puxou (?:o )?meu cabelo|me puxou pelo cabelo|(?:sofro|sofri|sofrendo|vitima de) (?:violencia|agressao|agressoes|abuso|abusos|maus tratos)|violencia (?:domestica|contra a mulher|fisica|psicologica|sexual|patrimonial)|maria da penha|medida protetiva|delegacia da mulher`,
  },
  {
    id: 'violencia.ameaca',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`(?:disse|falou|ameacou|ameaca|ameacando|jurou|jura|prometeu|avisou|garantiu|vive dizendo|fica dizendo|diz|fala|escreveu)(?: que)?(?: um dia)? (?:vai |ia |iria |pode |vai acabar |quer )?me matar|${PESSOA} (?:vai|quer|pode|tentou|tenta|ia|vai acabar|ainda vai) me (?:matar|bater|agredir|espancar|machucar|furar|esfaquear)|${PESSOA} me mata(?:ria)? se|\bme ameac\w*|ameac\w* de morte|apont\w* (?:uma |a )?(?:faca|arma|revolver|pistola) (?:para|contra|na|em) (?:mim|minha)|(?:ameacou|ameaca|ameacando|ameacava) (?:me )?com (?:uma |a )?(?:faca|arma|revolver|tesoura|pistola)|(?:ele|ela) (?:esta|anda) armad[oa]`,
  },
  {
    id: 'violencia.controle',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`${PESSOA} nao me deixa (?:sair|trabalhar|ver|falar|usar|ter|ir|estudar|visitar)|me (?:tranca|trancou|trancava|prende|prendeu|prendia) (?:em casa|no quarto|no banheiro|dentro de casa|fora de casa)|(?:tomou|toma|tomava|controla|controlava|fica com|ficou com|confiscou|retem|segura) (?:o |a )?(?:meu|minha) (?:dinheiro|cartao|aposentadoria|salario|pensao|documentos|beneficio|cartao do banco)|controla (?:o )?meu celular|${PESSOA} (?:quebrou|quebra|quebrava) (?:as minhas coisas|minhas coisas|tudo em casa|os moveis|a casa toda|tudo)`,
  },
  {
    id: 'violencia.perseguicao',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`(?:fica|esta|anda|vive|estava|ficou) me (?:seguindo|perseguindo|vigiando|rondando|espionando)|me seguiu (?:ate|na rua|de carro)|me persegu\w*|(?:fica|esta|vive|ficou|anda) rondando (?:a )?(?:minha casa|minha porta|meu trabalho|meu predio)|(?:meu ex|ele) nao me deixa em paz|(?:manda|mandou|mandando|recebo|recebi) (?:mensagens? )?(?:de )?ameac\w*`,
  },
  {
    id: 'violencia.sexual',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`me (?:estuprou|estupra|estuprava|violentou|abusou|abusa|abusava)|estupr\w*|abus\w* (?:de mim|sexual\w*)|(?:me )?(?:forca|forcou|forcava|obriga|obrigou|obrigava) (?:a )?(?:ter relacao|ter relacoes|transar|fazer sexo|sexo)|assedio sexual|me assedi\w*`,
  },
  {
    id: 'violencia.psicologica',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`${PESSOA} me (?:xinga|xingou|xingava|humilha|humilhou|humilhava|ofende|ofendia)|me (?:xinga|xingando|humilha|humilhando) (?:o tempo todo|todo dia|todos os dias|na frente)`,
  },
  {
    id: 'violencia.medo-de-alguem',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`medo (?:dele|dela|do meu marido|do meu ex|do meu companheiro|do meu filho|do meu namorado|do meu genro|do meu neto|de voltar para casa|de ir para casa|de ele voltar|que ele (?:me )?(?:mate|machuque|bata|faca algo|volte)|do que ele (?:pode|possa) fazer)(?=${FIM_ALT}| me | quando| porque| e | mas | de verdade| demais| sim)|medo de (?:voltar|ir) para casa`,
  },
  {
    id: 'violencia.risco-imediato',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`${PESSOA} (?:esta|ta) (?:aqui|la fora|na porta|no portao|batendo na porta|tentando entrar|tentando arrombar|quebrando tudo|gritando la fora)|(?:arrombar|arrombou|arrombando|tentando arrombar) (?:a )?porta|(?:estou|ja estou) (?:trancada|escondida) (?:no banheiro|no quarto|em casa|na casa)|socorro (?:ele|ela|meu marido|meu ex|alguem)`,
  },
  {
    id: 'violencia.contra-terceiro',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`(?:vou|quero|queria|vontade de|penso em|pensando em|vou acabar|sou capaz de|eu ainda) (?:matar|esfaquear|envenenar|dar um tiro (?:nele|nela|em)|machucar|bater em|agredir|espancar) (?:ele|ela|meu marido|meu ex|alguem|minha|meu|essa|esse|aquele|aquela|todo mundo|o|a)\b`,
  },

  // ───────────── AMARELO — sofrimento persistente, incapacidade, crises, dependência do app ─────────────
  {
    id: 'amarelo.perda-de-interesse',
    nivel: 'amarelo',
    sinal: 'sofrimento_persistente',
    padrao: String.raw`nada (?:mais )?me (?:anima|interessa|alegra|da prazer|da vontade|faz feliz|motiva|importa)|(?:perdi|perdendo|sem|nao tenho mais|perdi todo o|perdi toda a) (?:o |a )?(?:interesse|gosto|prazer|animo|vontade|alegria) (?:em|por|pelas|pela|pelo|de|para) (?:tudo|nada|fazer qualquer coisa|qualquer coisa|as coisas|coisa nenhuma|a vida|mais nada)|nao (?:tenho|sinto) (?:mais )?(?:vontade|animo|prazer|alegria|interesse|gosto) (?:de|em|para|por) (?:nada|fazer nada|coisa nenhuma|mais nada)|tanto faz (?:tudo|viver|a vida)|tudo tanto faz|(?:a vida|tudo) (?:ficou|esta|anda|perdeu a) (?:sem graca|cinza|sem cor|graca)|perdi a esperanca|sem (?:nenhuma )?esperanca|desesperancada|nao ligo (?:mais )?para (?:nada|mais nada)`,
  },
  {
    id: 'amarelo.incapacidade',
    nivel: 'amarelo',
    sinal: 'sofrimento_persistente',
    padrao: String.raw`nao (?:consigo|tenho forcas? para|tenho forcas? de|tenho animo para|tenho animo de) (?:mais )?(?:sair|levantar) da cama|(?:passo|fico|passei|fiquei|estou|vivo) (?:dias|semanas|meses|os dias|todos os dias|o dia todo todos os dias|dias inteiros) (?:na cama|deitada|sem sair|trancada|no quarto|no escuro)|nao (?:saio|consigo sair|levanto) (?:de casa|do quarto|da cama) (?:ha|faz) (?:dias|semanas|meses|muito tempo)|nao consigo (?:mais )?(?:sair de casa|tomar banho|comer|me cuidar|cuidar de mim|trabalhar|fazer nada|fazer as coisas|funcionar)(?= ha| faz| direito| mais| nenhum| sem|${FIM_ALT})|parei de (?:comer|tomar banho|me cuidar|sair de casa|me arrumar)|nao (?:durmo|como|consigo dormir|consigo comer|tomo banho) (?:direito )?(?:ha|faz) (?:dias|semanas|meses)|(?:ha|faz) (?:semanas|meses) (?:que )?(?:nao saio|nao levanto|nao consigo|nao tenho vontade|choro|estou triste|estou mal|estou assim|me sinto assim)`,
  },
  {
    id: 'amarelo.crises',
    nivel: 'amarelo',
    sinal: 'sofrimento_persistente',
    padrao: String.raw`crises? de (?:choro|ansiedade|panico|angustia|desespero)|ataques? de (?:panico|ansiedade)|choro (?:todo dia|todos os dias|toda noite|todas as noites|o dia todo|o dia inteiro|sem parar|o tempo todo|sem motivo)|nao (?:consigo parar de|paro de) chorar|(?:estou|ando|vivo|fico) (?:muito )?(?:desesperada|em desespero|no fundo do poco)|nao (?:aguento|consigo) (?:mais )?(?:continuar )?assim|(?:acho que )?(?:estou|ando) (?:com|em) depressao|(?:estou|ando) (?:muito )?deprimida|(?:tenho|com) depressao|nao tenho (?:mais )?forcas?(?: para nada)?${FIM}|nao (?:vejo|tem|ha|encontro) (?:mais )?saida|um vazio que nao passa|morrendo por dentro|(?:me sinto|estou|ando) (?:muito )?(?:mal|triste|sozinha|desanimada|para baixo|vazia|angustiada) (?:ha|faz|por|desde ha) (?:semanas|meses|muito tempo|anos)|(?:todo dia|todos os dias|o tempo todo) (?:me sinto|estou|fico) (?:muito )?(?:triste|mal|vazia|sem vontade|desesperada|angustiada)`,
  },
  {
    id: 'amarelo.isolamento',
    nivel: 'amarelo',
    sinal: 'sofrimento_persistente',
    padrao: String.raw`nao tenho (?:mais )?ninguem(?: no mundo| na vida)?${FIM}|nao tenho (?:mais )?ninguem (?:para|com quem) (?:conversar|desabafar|falar|contar)|sozinha no mundo`,
  },
  {
    id: 'amarelo.dependencia-do-app',
    nivel: 'amarelo',
    sinal: 'dependencia_do_app',
    padrao: String.raw`(?:voce|o app|este app|esse app|o aplicativo|este aplicativo|esse aplicativo) e (?:a|o|minha|meu) (?:unica|unico)|(?:so|somente|apenas) (?:tenho|converso com|falo com|desabafo com|conto com|confio em) (?:voce|o app|este app|esse app|o aplicativo|esse aplicativo|este aplicativo)|(?:voce|o app|esse app|este app) e (?:minha|meu) (?:melhor) (?:amiga|amigo|companhia)|(?:voce|o app|esse app|este app) (?:e|virou|substitui|substituiu) (?:a |o |minha |meu )?(?:terapia|terapeuta|psicologa|psicologo|analista|unica amiga|unica companhia)|nao preciso (?:mais )?(?:de )?(?:terapia|terapeuta|psicologa|psicologo|ninguem|amigas|amigos)\b.*\b(?:voce|app|aplicativo)|(?:prefiro|melhor) (?:conversar|falar|desabafar) (?:com voce|com o app|aqui) (?:do que|que) com|so (?:voce|o app|esse app|este app) me (?:entende|escuta|ouve|compreende)|voce me (?:entende|escuta|conhece) melhor (?:do que|que)|nao tenho ninguem alem de voce|converso (?:mais )?(?:so )?com voce (?:do que|que)|(?:fico|passo) (?:o dia todo|horas|a noite toda|o dia inteiro) (?:conversando|falando) com (?:voce|o app)`,
  },

  // ── generalizações (held-out 2026-10-04): co-ocorrência na frase, métodos, desejo passivo, luto, plano ──
  {
    id: 'vermelho.se-eu-nao-existisse',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`se eu (?:nao estivesse (?:mais )?aqui|nao existisse|morresse|sumisse|desaparecesse|tivesse morrido|nao acordar (?:mais|amanha)|nao acordasse)|tanto faz se eu (?:for|partir|morrer|sumir|nao acordar|me for)|ninguem (?:vai|ia|iria) (?:nem )?(?:ligar|perceber|notar|sentir|chorar|se importar|lembrar)(?:(?! \.).){0,20}se eu (?:partir|for|sumir|morrer|me for|nao estiver)|ninguem (?:\w+ ){0,3}(?:no meu enterro|no meu velorio)|so (?:vai |vou )?(?:parar|acabar|passar|ter paz|descansar)(?:(?! \.).){0,30}quando eu (?:morrer|partir|nao existir|nao estiver aqui)`,
  },
  {
    id: 'vermelho.por-que-ainda-aqui',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`(?:por que|porque|para que) (?:eu )?(?:ainda )?(?:estou|continuo|sigo|ainda estou) (?:aqui|viva|vivendo|respirando)|nao sei (?:por que|porque|para que) (?:eu )?(?:ainda )?(?:continuo|estou|sigo) (?:aqui|respirando|vivendo|viva)|nao faz (?:mais )?sentido (?:eu )?(?:ficar|continuar|estar) (?:aqui|viva)|nao vejo (?:por que|porque|razao para|motivo para) (?:ficar|continuar|seguir|estar aqui)|(?:dificil|impossivel|pesado demais) continuar (?:vivendo|viva|aqui)|(?:a |minha )?vida (?:para mim )?acabou|para mim a vida acabou|(?:so )?(?:estou )?esperando (?:a hora de (?:ir|partir|morrer)|a morte|morrer|o fim|o corpo)|(?:ir embora|partir|sair) (?:dessa|desta) vida|nao vejo (?:mais )?(?:futuro|saida)(?: nenhum| nenhuma)?${FIM}|(?:estou )?pronta para (?:ir|partir)${FIM}|melhor acabar (?:logo|de vez)${FIM}|${QUERER} apagar${FIM}`,
  },
  {
    id: 'vermelho.nao-amanhecer',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false,
    padrao: String.raw`nao (?:quero|queria) (?:mais )?acordar(?! (?:cedo|tao cedo|tarde|as \d|antes|com barulho|com despertador|o |a |os |as |ninguem|meu|minha|seu|sua|ele|ela|voce))|(?:nao|nunca mais) amanhecer|(?:pedindo|peco|rezo) (?:a deus )?para nao (?:amanhecer|acordar)|nao (?:quero|queria) (?:ver|chegar a ver) (?:o )?amanha|(?:coracao|respiracao) (?:parasse|parar de vez|pare de vez)|(?:torco|torcendo|rezo|espero|queria) (?:para |que )?(?:ter|venha|vir|me dar) (?:um )?(?:infarto|avc|cancer|acidente)`,
  },
  {
    id: 'vermelho.desejo-passivo-religioso',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`me leva (?:hoje|logo|dormindo|de uma vez|embora)|me (?:levado|levar|levasse) junto|(?:deus|senhor|jesus|nossa senhora|os anjos|a morte) (?:\w+ ){0,6}me (?:leve|levasse|levar|leva|busque|buscasse|buscar|recolha|recolher|recolhesse)\b|deixa eu ir(?= \. (?:senhor|deus|jesus)|${FIM})`,
  },
  {
    id: 'vermelho.luto-ir-junto',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:ir|estar|ficar) (?:para )?junto (?:dele|dela|do meu marido|da minha mae|do meu pai|do meu filho|da minha filha)|(?:${QUERER}|${VONTADE}) (?:estar|ir|ficar) com (?:meu marido|minha mae|meu pai|meu filho|minha filha|ele|ela)(?:(?! \.).){0,30}(?:que ja (?:se foi|morreu|faleceu|partiu)|no ceu|onde (?:ele|ela) esta)|(?:morrido|morrer|ir) junto (?:com ele|com ela)`,
  },
  {
    id: 'vermelho.coragem-e-plano',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`para quando (?:eu )?tiver coragem|se eu tivesse coragem(?:(?! \.).){0,40}(?:acabado|feito|ido|morrido)|coragem (?:de|para) (?:pular|me jogar|acabar com (?:tudo|isso))|coragem (?:de|para) (?:ir|partir)${FIM}|ja sei como vou fazer(?: e quando| isso)?${FIM}|(?:planejando|planejei|planejar|organizando|programando) (?:a )?minha (?:propria )?morte|(?:vou|quero|vontade de|${PENSAR}|medo de|posso|capaz de) fazer (?:uma )?(?:besteira|bobagem|loucura)(?: comigo)?\b|${PERTO(String.raw`ja tentei (?:uma vez|antes|duas vezes|outra vez)|tentei uma vez`, String.raw`tentar de novo|vou tentar`)}|(?:minha )?ultima noite${FIM}|hoje e (?:minha|meu) (?:ultima noite|ultimo dia)${FIM}|${PERTO(String.raw`doei|dei|distribui|me desfiz`, String.raw`nao vou (?:mais )?precisar`)}|${PERTO(String.raw`ouvir a voz|ver o rosto|abracar|me despedir`, String.raw`ultima vez`)}|${PERTO(String.raw`missao (?:terminou|acabou|esta cumprida|cumprida)`, String.raw`ir embora|partir|descansar|morrer`)}`,
  },
  {
    id: 'vermelho.metodo-ampliado',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`(?:tomar|tomei|engolir|engoli|vou tomar) (?:tudo |toda )?a caixa|(?:tomei|tomar|engoli|vou tomar) (?:uns |umas |mais de )?\d{2,} (?:comprimidos|remedios|pilulas|calmantes)|contando (?:os )?(?:comprimidos|remedios|calmantes)|${PERTO(String.raw`remedios|comprimidos|calmantes|pilulas|rivotril`, String.raw`guardando|juntando|acumulando|escondendo|separando|todos${FIM}`)}|dose (?:que mata|letal|fatal)|(?:quantos|quantas) (?:comprimidos|remedios|pilulas|calmantes) (?:mata|matam|precisa|precisaria|seriam|para morrer)|(?:pesquis\w*|procur\w*|busquei|buscando|li sobre) (?:na internet )?(?:como|jeito de|formas de|maneiras de|qual) (?:${MORRER}|fazer sem dor|me matar|acabar|a dose)|(?:${MORRER}|fazer isso|ir) sem dor|${PERTO(String.raw`veneno|chumbinho`, String.raw`para mim|tomar|beber|guardei|separei`)}|${PERTO(String.raw`ponte|viaduto|trilhos?|linha do trem|parapeito|sacada|terraco|telhado|decimo andar|\w+ andar|janela`, String.raw`pular|me jogar|me atirar|olhando para baixo|seria facil|bastava|um passo`)}|deixar a (?:onda|agua|correnteza|mar) (?:me )?levar|jogar o carro (?:na frente|contra|em cima|debaixo|embaixo)|virar o volante|(?:separei|comprei|peguei|arrumei|preparei) (?:a|uma) corda${FIM}|(?:estou com|separei|escondi|peguei|deixei|ja estou com) (?:a |uma )?(?:lamina|gilete|navalha)|aqui com (?:a |uma )?(?:faca|lamina|gilete|corda|arma)(?: na mao)?${FIM}|com (?:a |uma )?faca na mao${FIM}|(?:tomasse|tomando|tomar|tomei) (?:todos os|todas as) (?:\w+ )?(?:comprimidos|remedios|pilulas|calmantes)|tomar tudo de uma vez|(?:quantidade|quantos|quantas|dose)(?:(?! \.).){0,40}(?:nao acordar|${MORRER}|matar|mata)\b|${PERTO(String.raw`remedios?|comprimidos?|caixinhas?|calmantes?|cartelas?`, String.raw`suficiente|guardad[ao]s|juntei|separei`)}|nao e (?:para|pros) (?:os )?ratos|corda (?:\w+ ){0,3}amarrada|amarrei a corda|no de forca|mangueira no escapamento|deixar o gas (?:ligado|aberto)|gas ligado (?:\w+ ){0,3}(?:dormir|noite)|parar de tomar (?:\w+ ){0,3}de proposito|deixar (?:a doenca|o diabetes|o cancer|a pressao) (?:resolver|me levar)|(?:formas|jeitos|maneiras|como) de (?:${MORRER}|me matar|se matar)|${MORRER} sem sofrer|parecer (?:um )?acidente|jogar (?:o carro )?(?:no barranco|da serra|da ribanceira)|${PERTO(String.raw`arma|revolver`, String.raw`segurando|fiquei olhando|carregada|na mao`, 120)}|${PERTO(String.raw`ponte|viaduto|linha (?:de|do) trem|trilhos?|rio`, String.raw`me deitar|deitar nela|olhando a agua|nao volto|nao voltar`)}|nadando ate nao aguentar|entrar no mar e (?:nao voltar|ir nadando)`,
  },
  {
    id: 'vermelho.autolesao-ampliada',
    nivel: 'vermelho',
    sinal: 'autolesao',
    padrao: String.raw`me (?:arranho|arranhar|arranhando|corto|cortar|queimo|queimar|bato|bater|batendo|belisco|mordo)(?:(?! \.).){0,30}(?:ate|para) (?:sangrar|doer|sair sangue|marcar|ficar marca)|(?:queimo|queimei|queimar|corto|cortei|machuco|machuquei|arranho|arranhei|bato|bati) (?:o |a |meu |minha |meus |minhas )?(?:braco|bracos|perna|pernas|pulso|pulsos|pele|mao|maos|coxa|coxas|barriga)(?:(?! \.).){0,40}(?:de proposito|ate sangrar|ate doer|para sentir|para aliviar)|cabeca na parede ate|cortei (?:o |os |meu |meus |minha |minhas )?(?:braco|bracos|pulso|pulsos|perna|pernas|coxa|coxas|pele)|(?:queimo|corto|machuco|arranho) (?:a |o |minha |meu |meus |minhas )?(?:pele|braco|bracos|pulso|pulsos|perna|pernas|coxa|coxas)|bato a cabeca na parede|(?:penso|pensando|pensei|vou|quero) (?:em )?fazer (?:nada|algo|alguma coisa|mal) contra mim`,
  },
  {
    id: 'violencia.ameaca-condicional',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`\b(?:ele|ela|meu marido|meu ex|meu companheiro|meu filho|meu namorado) me mata(?:ria)?\b|${PERTO(String.raw`se eu (?:sair de casa|me separar|separar|pedir o divorcio|for embora|largar|contar|reclamar|falar em separar|denunciar|fugir)`, String.raw`me mata|vai me|acabar comigo|nunca mais|me coloca|me tira|me bate|vai atras|vai la|me pega|some com|mostra a faca`)}|se eu (?:fugir|denunciar|chamar a policia)\b|${PERTO(String.raw`disse|falou|ameacou|jurou|ameaca|diz`, String.raw`acabar comigo|nunca mais (?:vejo|ver) (?:meus )?(?:netos|filhos)`)}|${PERTO(String.raw`arma|faca|revolver`, String.raw`em mim|contra mim|me matar|usar em mim`)}|(?:mostra|mostrou|mostrava|aponta|puxa|puxou) (?:a |uma )?(?:faca|arma|revolver)|foi pres[oa] por me|por me (?:agredir|bater|espancar|ameacar)|vem me buscar(?:(?! \.).){0,30}(?:saiu|preso|cadeia)|${PERTO(String.raw`saiu (?:da cadeia|da prisao|ontem)|foi preso`, String.raw`vem me buscar|vai me pegar|atras de mim`)}`,
  },
  {
    id: 'violencia.patrimonial-e-controle',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`nao me deixa (?:sair|sacar|trabalhar|ver|falar|usar|ter|ir|estudar|visitar|mexer|comer|pedir ajuda|ligar)|(?:pegou|tomou|toma|pega|controla|fica com|ficou com|confiscou) (?:o |a )?(?:meu |minha )?(?:cartao (?:da|do) (?:aposentadoria|beneficio|banco)|aposentadoria|beneficio|pensao|salario)|(?:emprestimo|emprestimos|cartao|divida|conta) (?:no|em) meu nome sem (?:eu saber|minha autorizacao|me perguntar|eu deixar)|me deixa(?:va)? sem (?:comida|comer|dinheiro|remedio|remedios|agua)|(?:tira|tirou|esconde|escondeu) (?:os )?(?:meus )?(?:remedios|documentos)|me (?:obriga|obrigou|forca|forcou|obrigam) a assinar|me (?:mandou|colocou|joga|jogou) (?:para|num|em um) (?:um )?(?:quartinho|asilo)|para (?:eu )?nao (?:pedir ajuda|ligar para ninguem|chamar a policia|contar para ninguem)|invadiu (?:a |minha )?(?:casa|apartamento|quarto)|(?:fui|sou|era) (?:abusada|violentada|estuprada|agredida|espancada|ameacada)|para me (?:vigiar|perseguir|controlar|espionar)|fotos da minha (?:porta|casa|janela)|me segue (?:no|na|ate|pela|por)(?! (?:instagram|insta|face|facebook|tiktok|twitter|rede|redes))|dizendo onde eu (?:estou|estava|ando)|(?:obriga|obrigou|forca|forcou) (?:a )?fazer coisas(?:(?! \.).){0,30}(?:nao quero|cama|sexo)|${PERSONA_ME_MATANDO}`,
  },
  {
    id: 'amarelo.sofrimento-ampliado',
    nivel: 'amarelo',
    sinal: 'sofrimento_persistente',
    padrao: String.raw`(?:passo|fico|passei|fiquei) (?:dias|semanas|o dia todo|o dia inteiro) sem (?:falar com|ver) ninguem|sem (?:dormir|comer|sair|tomar banho|conseguir dormir)(?: direito)? (?:ha|faz) (?:dias|semanas|meses)|(?:ha|faz) (?:um mes|semanas|meses)(?: que)? (?:estou |to )?sem (?:vontade|dormir|comer|sair)|(?:completamente|totalmente) sozinha|vazio (?:enorme |imenso |grande )?(?:o tempo todo|que nada preenche|que nao passa)|nada preenche|${PERTO(String.raw`falta de ar|tremedeira|aperto no peito|coracao disparado|panico|ansiedade|choro`, String.raw`todo dia|todos os dias|toda noite|quase todo dia|toda hora`)}|nao (?:tenho coragem de|consigo|quero) procurar ajuda|parece que (?:eu )?nao existo|me sinto (?:invisivel|um fantasma|um nada|morta por dentro|vazia por dentro)|(?:dias|tudo) (?:sao |e |esta |ficou )?(?:todos )?(?:iguais e )?cinzas?${FIM}|nao quero (?:ver|falar com) ninguem|deixei de (?:atender|sair|ver|falar|comer|me cuidar)|(?:vou|estou) enlouquecendo|vou enlouquecer|nao (?:estou|to) dando conta|olhando para o teto|nao tenho (?:uma |nenhuma )?(?:amiga|amigo|pessoa)(?: sequer)? (?:para|com quem)|(?:tristeza|angustia|vazio|desanimo|choro) (?:que )?nao passa|(?:ja sao|faz|ha) (?:semanas|meses) assim|sem (?:energia|forca|forcas|animo|vontade) (?:para|de) nada|(?:da|bate|me da|sinto|tenho) (?:um )?panico${FIM}|toda vez que (?:\w+ ){0,3}(?:da|bate|me da) panico|medo de sair de casa|(?:desabando|desmoronando|afundando)(?: por dentro)?|me isolei|isolada de todo mundo|(?:nada|isso|a vida) (?:nao )?vai (?:melhorar|mudar) nunca|nunca vai melhorar|nao vai melhorar nunca|(?:eu )?nao (?:valho|presto) (?:para )?nada|minha vida nao vale nada|so (?:dou|vou dar) trabalho`,
  },
  {
    id: 'amarelo.dependencia-ampliada',
    nivel: 'amarelo',
    sinal: 'dependencia_do_app',
    padrao: String.raw`${PERTO(String.raw`ninguem`, String.raw`so (?:para|com) voce|so voce|so aqui`)}|so voce (?:me )?(?:responde|escuta|ouve|entende|liga)|voce me ajuda mais (?:que|do que)|${PERTO(String.raw`(?:esquece|largar|larguei|parei|nao preciso de) (?:a )?terapia`, String.raw`voce`)}|prefiro (?:ficar aqui|falar aqui|escrever aqui|conversar aqui)`,
  },

  {
    id: 'vermelho.eufemismo-e-preparativos',
    nivel: 'vermelho',
    sinal: 'autolesao',
    negavel: false, // "nem motivo pra ficar viva": the negation is part of the risk
    padrao: String.raw`(?:ir|passar) para o outro lado|desencarn\w*|fazer a passagem|(?:ao )?encontro (?:do senhor|de deus|de jesus|com deus)|partir em paz|depois que eu (?:me for|partir|nao estiver)|ir atras (?:dele|dela|do meu|da minha)|(?:quero|queria) ir antes|embora (?:desse|deste) mundo|(?:minha )?hora de (?:desencarnar|partir|ir embora|morrer)|hora (?:que|q) eu (?:escolhi|decidi|marquei)|nao (?:quero|queria) chegar (?:no|ao|ate o|ate|a) (?:natal|ano novo|meu aniversario|fim do ano|amanha)|${PERTO(String.raw`senha do banco|testamento|seguro de vida|funeraria|velorio|enterro|enterrada|lapide|missa de setimo dia|escritura|joias divididas|lista de quem avisar|contas do mes|troquei o gas`, String.raw`coragem|chegando a hora|falta pouco|so falta|a minha${FIM}|partir|ir embora|amanha|essa semana|decidi|escolhi|nao vou voltar|nao vou mais estar|depois que eu|ninguem precisa saber|em paz|encontro`, 120)}|so falta eu${FIM}|${PERTO(String.raw`(?:dei|deixei|doei) (?:\w+ ){0,4}(?:cachorr\w*|gat\w*|bichinho|passarinho|pet|mel|bolinha)`, String.raw`nao vou (?:mais )?(?:voltar|estar aqui|precisar)|de vez|nao vou voltar`, 120)}|(?:pronta|preparada) para (?:fazer a passagem|partir|ir)\b(?! (?:a|ao|para|na|no|de|embora para|viajar|morar))|${PERTO(String.raw`me despedi`, String.raw`nao (?:estou|vou)`, 120)}|ultima vez (?:que|q) (?:a gente|nos) (?:se )?(?:fala|ve|falamos|vemos)|${PERTO(String.raw`amei|amo`, String.raw`tchau${FIM}|adeus`)}|${PERTO(String.raw`tchau|adeus|obrigada por tudo`, String.raw`ultimo dia|ultima noite`)}|(?:acordar|viver|cada dia) (?:todo dia )?e um castigo|queria (?:que|q) fosse o ultimo|(?:decepcionada|triste|frustrada|com raiva) (?:por|de) ter acordado|(?:escrevi|fiz|gravei|deixei|preparei) (?:a )?minha despedida|fiz a carta${FIM}|nao e para ninguem (?:ficar )?(?:procurar|procurando|me procurar)|${PERTO(String.raw`(?:nao|nem) vai (?:mais )?precisar (?:mais )?(?:cuidar de mim|se preocupar comigo)`, String.raw`resolvi|do meu jeito|essa semana`)}|(?:alma|acontece com) (?:\w+ ){0,3}quem se mata|${PERTO(String.raw`se matou|se suicidou`, String.raw`fazer igual|fazer o mesmo|entendendo|eu tambem`)}|${QUERER} apagar(?: e| para sempre)|nunca mais acender|${PERTO(String.raw`some|morre|se mata`, String.raw`concordar|obedecer`)}|${PERTO(String.raw`se eu|eu pudesse|queria|seria (?:tao )?bom`, String.raw`deixar de existir|parar de existir|nao existir mais`)}|fechar os olhos e (?:acabou|pronto|acabar)|motivo (?:para|de) (?:ficar|continuar|estar) viva|sentido(?: nenhum)? (?:eu )?continuar (?:vivendo|viva|aqui)|nao estar (?:mais )?viva|em paz para sempre|(?:prefiro|preferia) (?:\w+ ){0,3}(?:do )?que continuar (?:aqui|vivendo|viva)|${PERTO(String.raw`seria um alivio|seria bom|ficaria em paz`, String.raw`capotasse|acidente|infarto|morresse|nao acordasse|batesse|caisse`)}|${PERTO(String.raw`infarto|avc|derrame|acidente|cancer`, String.raw`rezo|rezando|torco|torcendo|peco|pedindo|tomara|espero|queria|acabar logo`)}|coracao (?:\w+ ){0,3}(?:parar|parasse) de bater|parasse de bater|(?:viver|ficar|estar)\w* melhor sem a (?:mae|vo|avo)|melhor sem a (?:mae|vo|avo)|${PERTO(String.raw`${MORRER}|logo`, String.raw`vou fazer acontecer`)}`,
  },
  {
    id: 'violencia.sinais-ampliados',
    nivel: 'violencia',
    sinal: 'violencia',
    padrao: String.raw`(?:parado|fica|ficou|esta) (?:\w+ ){0,3}(?:na frente|em frente) (?:do meu portao|da minha casa|do meu predio|da minha porta)|${PERTO(String.raw`meu ex|ex marido|o ex\b`, String.raw`portao|mudei de numero|descobriu meu endereco|endereco novo|minha janela`)}|${PERTO(String.raw`medo`, String.raw`batendo na porta|chutando|bebado|gritando|arrombar`)}|me (?:deu|da|dava) (?:uns |umas |um )?(?:tapa|tapas|bofetada|tabefe|cascudo|safanao)|da proxima vez (?:e|vai ser) pior|\bme xinga\b|${PERTO(String.raw`asilo|internar`, String.raw`se eu nao|se eu|passar a casa`)}|controla (?:tudo|todo o dinheiro|meu dinheiro|minhas compras|com quem eu falo|aonde eu vou|onde eu vou|minhas mensagens)|pedir dinheiro (?:\w+ ){0,4}ate para|me proib\w* de (?:ir|sair|ver|falar|trabalhar|usar|visitar)|controla com quem|fotos? da minha (?:porta|casa|janela)|${PERTO(String.raw`marcas roxas|roxos?|hematomas?`, String.raw`digo|falo|escondo|minto|ninguem sabe`)}|se eu contar ninguem vai acreditar|${PERTO(String.raw`mexeu comigo|passou a mao|me tocou`, String.raw`sozinha|sem eu querer|a forca|ninguem vai acreditar`)}|apert\w* (?:o )?meu pescoco|me (?:apertou|apertava) o pescoco|${PERTO(String.raw`sabe onde eu|numero desconhecido|mensagem`, String.raw`vai me pegar|vai me encontrar`)}|tomou conta (?:do meu|da minha) (?:cartao|senha|dinheiro|aposentadoria|conta)|nao tenho acesso (?:nem )?(?:ao|a) (?:extrato|minha conta|meu dinheiro|meu cartao)|(?:raspou|cortou) meu cabelo|de castigo porque eu|\bme seguindo\b(?! (?:de comodo|pela casa))|ameac\w* (?:\w+ ){0,3}(?:jogar acido|tacar fogo|botar fogo|me bater|me furar|me queimar|matar)|jogar acido|(?:toca|tocar|taca|tacar|bota|botar) fogo (?:em mim|comigo|na casa)|acertar as contas comigo|me chama de (?:burra|inutil|velha|nojenta|vagabunda|vaca|lixo|imprestavel)|${PERTO(String.raw`fotos? intimas?|nudes?`, String.raw`ameac\w*|se eu nao pagar|espalhar|mandar para`)}|empurrou (?:a |minha |a minha )?cabeca|minha cabeca contra a parede|me belisca|me deixa sem banho|${PERTO(String.raw`tranquei a porta|na frente da porta`, String.raw`chutando|batendo|tentando entrar`)}|(?:monitora|rastreia|controla) (?:a )?minha localizacao|aparece onde eu (?:estou|esteja)|${PERTO(String.raw`se eu (?:largar|me separar|separar|pedir o divorcio|sair de casa|for embora)`, String.raw`\bmata\b|sumir com|some com`)}`,
  },
  {
    id: 'amarelo.duracao-e-sinais',
    nivel: 'amarelo',
    sinal: 'sofrimento_persistente',
    padrao: String.raw`${PERTO(String.raw`faz (?:mais de )?(?:um |uma |\d+ |uns |umas |duas |dois |tres )?(?:dias|semanas|meses|mes|semana)|ha (?:mais de )?(?:\w+ )?(?:semanas|meses|mes)|desde (?:janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)|um tempao|ja sao (?:\w+ )?(?:semanas|meses)|faz mais de mes|(?:dois|tres|uns) meses`, String.raw`nao saio|nao tomo banho|sem fome|sem vontade|sem energia|sem animo|nao durmo|durmo \w+ horas|chorando|choro|deitada|olhando (?:para )?o teto|nuvem preta|nao consigo|nao estou conseguindo|nada faz sentido|tristeza|desanim\w*|isolada|sem sair`)}|ninguem me procura|(?:bebendo|bebo) (?:\w+ ){0,2}todo dia|(?:beber|bebendo) para (?:conseguir )?(?:dormir|esquecer|aguentar)|nem (?:comida|comer|tomar banho|levantar)${FIM}|nao tenho (?:mais )?animo${FIM}|larguei (?:as amigas|tudo)|parei de tomar (?:o |os |meu |meus )?(?:antidepressivo|remedio|remedios|medicacao)(?:(?! \.).){0,30}(?:piorando|por conta)|crises?(?:(?! \.).){0,30}(?:cada vez mais|seguidas|frequentes|toda semana|todo dia)|nada (?:mais )?faz sentido|cortina fechada|evito (?:ate )?sair|olhando (?:para )?o teto|(?:nao|num) (?:estou|to) aguentando|nao vejo graca em nada|(?:estou|to) no limite|so atrapalho|nao (?:estou|to) conseguindo (?:cuidar|sair|levantar|comer|dormir)`,
  },
  {
    id: 'amarelo.dependencia-sinais',
    nivel: 'amarelo',
    sinal: 'dependencia_do_app',
    padrao: String.raw`prefiro desabafar aqui|(?:desmarquei|cancelei|larguei|parei) (?:o |a |de ir (?:no|na) )?(?:psiquiatra|psicologa|psicologo|terapia|terapeuta)|so quero (?:conversar|falar) com voce|nao (?:precisa|quero) (?:me mandar )?procurar ajuda|me segurando so (?:nesse|neste|no) app|so (?:nesse|neste) app|so consigo (?:conversar|falar) com voce`,
  },

  // ───────────── REDE DE SEGURANÇA — menção de morte própria sem frase conhecida ─────────────
  // A first-person death word in a construction no rule above knows ("tenho medo de morrer")
  // lands here: amarelo, never verde. Counts only when no other rule matched.
  {
    id: 'rede.mencao-de-morte',
    nivel: 'amarelo',
    sinal: 'autolesao',
    rede: true,
    padrao: String.raw`morrer|morra|morresse|me matar|matar me`,
  },
];
