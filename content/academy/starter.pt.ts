// Guia N°1 para Começar com IA: trilhas para iniciantes, em português. Mesma estrutura de starter.ts.
import type { CourseModule } from './lessons';

export const starter: CourseModule[] = [
  {
    number: '09',
    summary:
      'Comece aqui se você nunca usou IA. Tenha sua primeira conversa com um assistente de IA e use-o para escrever e-mails e mensagens do dia a dia, inclusive os difíceis.',
    lessons: [
      {
        slug: 'your-first-ai-chat',
        title: 'Sua primeira conversa com um assistente de IA',
        minutes: 10,
        body: `
Um [[assistente de IA|ai-assistant]] é um site ou app com quem você conversa em linguagem normal. Você escreve (ou fala) o que precisa e ele responde. Os mais conhecidos são o **ChatGPT**, o **Claude** e o **Gemini**. Os três têm versão gratuita, e qualquer um serve para este guia.

## Como começar

1. Acesse chatgpt.com, claude.ai ou gemini.google.com (ou baixe o app)
2. Cadastre-se com seu e-mail ou sua conta Google
3. Escreva uma pergunta na caixa de baixo, como se fosse uma mensagem de texto

É só isso. Não existe uma linguagem especial para aprender.

## Como pedir para receber algo útil

Fale com ele como falaria com um assistente novo e inteligente que ainda não sabe nada sobre você:

- **Diga quem você é:** "Tenho uma pequena empresa de limpeza" ou "Sou enfermeira e estou planejando uma viagem."
- **Diga o que precisa:** "Escreva um e-mail curto para…", "Me explique…", "Me dê cinco ideias para…"
- **Diga como quer:** "simpático, com menos de 100 palavras, sem termos técnicos."

## É uma conversa

A primeira resposta quase nunca é a melhor. Responda para melhorar: "mais curto", "mais informal", "desenvolva a segunda ideia", "me explique como se eu fosse iniciante". Dá para continuar o quanto quiser.

## Três regras desde o primeiro dia

- **Confira os fatos.** A IA pode parecer segura e mesmo assim errar. (Isso se chama [[alucinação|hallucination]].)
- **Não cole segredos.** Nada de senhas, números de cartão ou dados privados de outras pessoas.
- **Você é o editor.** Leia tudo antes de enviar ou usar.

> Quer aprender a pedir melhor? O Módulo 03 (Engenharia de Prompts) do Curso de Marketing com IA aprofunda isso. Por enquanto, basta falar normalmente.
`,
        tryIt: `Abra qualquer assistente de IA e escreva: "Sou novo em IA. Em cinco tópicos curtos, em que você poderia me ajudar nesta semana? Eu [descreva seu trabalho ou seu dia em uma frase]." Depois responda a um dos tópicos com "me mostre como".`,
      },
      {
        slug: 'everyday-emails',
        title: 'E-mails e mensagens na metade do tempo',
        minutes: 12,
        body: `
A maioria das pessoas passa horas por semana escrevendo mensagens. A IA faz isso muito bem, desde que você dê os fatos e ela dê as palavras.

## Cinco usos para hoje

- **De anotações a e-mail:** escreva três tópicos soltos e peça: "Transforme isto em um e-mail educado para o meu locador."
- **Rascunhos de resposta:** cole uma mensagem que recebeu e peça: "Escreva uma resposta dizendo sim para terça e não para quinta."
- **Ajustar o tom:** "Deixe mais simpático", "menos insistente" ou "mais profissional."
- **Encurtar:** "Reduza para três frases sem perder o principal."
- **Traduzir:** "Escreva isto em inglês simples para um cliente" e, se for importante, peça para um falante nativo revisar.

## Dê os fatos, não só o assunto

Um pedido vago ("escreva um e-mail sobre o atraso") gera um e-mail vago. Um bom pedido diz para quem é, o que aconteceu, o que você quer que a pessoa faça e o tom:

"Escreva um e-mail curto para um cliente. O pedido dele está dois dias atrasado porque nosso fornecedor atrasou. Peça desculpas uma vez, informe a nova data (sexta) e ofereça frete grátis. Caloroso, sem exagero."

## Que soe como você

A IA adora frases como "espero que esteja tudo bem com você". Se você não fala assim, diga: "Escreva como uma pessoa de verdade mandando mensagem para um cliente. Sem palavras difíceis." Você também pode colar um e-mail seu e pedir: "Imite este estilo."

> Posts em redes sociais e e-mails de marketing têm um módulo próprio: o Módulo 04 (Estratégia de Conteúdo com IA) trata de escrever para um público em escala. Esta aula é sobre as mensagens que você manda para uma pessoa.
`,
        tryIt: `Encontre um e-mail ou mensagem que você vem adiando. Cole em um assistente de IA (sem nomes nem telefones) e peça: "Escreva uma resposta curta e simpática que diga [o que você quer dizer]." Mude uma linha para soar como você e envie.`,
      },
      {
        slug: 'hard-messages',
        title: 'Conversas difíceis e cartas importantes',
        minutes: 12,
        body: `
As mensagens que mais adiamos costumam ser as difíceis: dizer não, cobrar, pedir desculpas, reclamar. A IA não fica sem graça por você, por isso é ótima para o primeiro rascunho.

## Bons usos

- **Dizer não:** "Me ajude a recusar este pedido com gentileza e sem inventar desculpas."
- **Cobrar:** "Escreva um lembrete firme, mas educado, de uma fatura com 30 dias de atraso."
- **Reclamações:** "Me ajude a escrever uma reclamação clara para minha operadora de celular. Foi isto que aconteceu…"
- **Desculpas:** "Me ajude a pedir desculpas por perder o prazo sem me explicar demais."
- **Cartas importantes:** cartas de apresentação, cartas para a escola, um pedido de recomendação.

## Ensaie a conversa antes

Se a conversa difícil for pessoalmente ou por telefone, peça para a IA fazer o papel da outra pessoa: "Finja que você é meu locador e não quer consertar o aquecedor. Vou treinar como pedir." Depois pergunte: "Como eu poderia ter dito isso melhor?"

## Seu julgamento manda

- **Os fatos vêm de você.** Nunca deixe a IA inventar datas, valores ou o que alguém disse.
- **Leia em voz alta.** Se soar duro ou longo demais, peça uma versão mais simples.
- **Em assuntos jurídicos, médicos ou de dinheiro,** use a IA para organizar as ideias e consulte um profissional antes de enviar algo importante.

> Um bom hábito: antes de enviar, pergunte "O que a outra pessoa pode sentir ao ler isto?"
`,
        tryIt: `Pense em um "não" que você precisa dizer. Peça a um assistente de IA: "Me ajude a dizer não para [o pedido] em duas ou três frases claras e gentis. Sem desculpas inventadas." Escolha a versão de que mais gostar e salve.`,
      },
    ],
    exercise: {
      title: 'Exercício: Resolva três mensagens',
      body: `
Escolha três mensagens que você está evitando: uma fácil, uma longa e uma difícil.

1. Para cada uma, escreva primeiro os fatos em tópicos: para quem é, o que aconteceu, o que você quer
2. Peça um rascunho ao seu assistente de IA e depois uma melhoria ("mais curto", "mais caloroso", "mais firme")
3. Edite cada rascunho para soar como você e confira cada fato
4. Envie as três hoje
5. Anote mais ou menos quanto tempo levou, comparado com fazer sozinho
`,
    },
    checklist: [
      'Cadastre-se em um assistente de IA gratuito (ChatGPT, Claude ou Gemini)',
      'Faça uma pergunta sobre seu trabalho e outra sobre sua vida',
      'Use-o para rascunhar a resposta a um e-mail ou mensagem real, edite e envie',
      'Use-o para reescrever uma mensagem em outro tom',
      'Ensaie uma conversa difícil pedindo para a IA fazer o papel da outra pessoa',
    ],
  },
  {
    number: '10',
    summary:
      'Veja o que a IA consegue criar hoje, de imagens e fotos editadas a vídeos curtos e narrações, e como usá-la com honestidade.',
    lessons: [
      {
        slug: 'what-ai-can-make',
        title: 'O que a IA consegue criar hoje',
        minutes: 12,
        body: `
Alguns anos atrás, uma imagem ou vídeo sob medida exigia contratar alguém ou aprender programas complicados. Agora você pode descrever o que quer em uma frase.

## O que já dá para fazer

- **Imagens a partir de uma descrição:** um [[gerador de imagens|image-generator]] cria uma imagem nova a partir de palavras, como "uma cafeteria aconchegante em uma manhã de chuva, estilo aquarela".
- **Edição de fotos:** tirar o fundo, apagar um desconhecido, corrigir a luz ou ampliar uma foto para caber em outro formato.
- **Vídeos curtos:** transformar uma imagem ou descrição em alguns segundos de vídeo, ou cortar um vídeo longo em clipes curtos automaticamente.
- **Legendas:** colocar em qualquer vídeo com alguns cliques.
- **Narrações:** transformar um roteiro escrito em uma voz natural ([[IA de voz|voice-ai]]).
- **Layouts:** panfletos, convites, cardápios e artes para redes a partir de um modelo e uma descrição.

## Onde testar

Você não precisa de programas especiais para começar. O ChatGPT e o Gemini criam e editam imagens dentro do chat. O Canva e o Adobe Firefly têm ferramentas de IA, e apps de celular como o CapCut fazem legendas e edições rápidas. Muitas dessas ferramentas são [[multimodais|multimodal]]: você pode mostrar uma foto e fazer perguntas sobre ela.

## Onde ainda erra

- Escrever palavras dentro das imagens (sempre confira placas e rótulos)
- Mãos, multidões e detalhes pequenos
- Manter a mesma pessoa ou produto idênticos em muitas imagens
- Mostrar seu produto, loja ou equipe *reais*. A IA só consegue adivinhar como eles são.

> Regra prática: use a IA para ideias, fundos e ilustrações. Use fotos reais para coisas reais.
`,
        tryIt: `Peça ao ChatGPT ou ao Gemini: "Crie uma imagem de [algo que você adora] no estilo de ilustração de livro infantil." Depois peça uma mudança, como outra cor, outro horário do dia ou outro ângulo, e compare as duas.`,
      },
      {
        slug: 'describing-images',
        title: 'Como descrever o que você quer',
        minutes: 12,
        body: `
As ferramentas de imagem seguem suas palavras ao pé da letra. Um pedido vago gera uma imagem genérica; um claro gera algo que você pode usar.

## A descrição em cinco partes

1. **Assunto:** o que aparece ("um golden retriever com chapéu de festa")
2. **Cenário:** onde está ("na varanda de uma casa com balões")
3. **Estilo:** foto, aquarela, desenho animado, ilustração plana, 3D
4. **Luz e clima:** claro e alegre, luz suave de fim de tarde, dramático
5. **Formato e uso:** quadrado para Instagram, vertical para celular, horizontal para banner

"Um golden retriever com chapéu de festa na varanda de uma casa com balões, estilo desenho animado claro, alegre, quadrado" funciona muito melhor que "foto de cachorro de aniversário".

## Edite, não recomece

Quando a imagem estiver perto, peça mudanças pequenas: "balões azuis", "tire o texto", "afaste um pouco". A maioria das ferramentas mantém o resto da imagem igual.

## Editando suas próprias fotos

Para qualquer coisa real, comece com sua própria foto e deixe a IA melhorar:

- "Tire o fundo e coloque este produto em um fundo branco liso."
- "Clareie esta foto e deixe as cores naturais."
- "Amplie esta foto dos dois lados para caber em um banner horizontal."

## Vídeos curtos

Com vídeo funciona igual: descreva a cena, o movimento ("aproximação lenta", "câmera vira para a esquerda") e a duração. Para vídeos com alguém falando, escreva o roteiro primeiro e use a IA para legendas, cortes e música de fundo.

> Salve as descrições que funcionam. Da próxima vez, você só vai precisar trocar algumas palavras.
`,
        tryIt: `Tire uma foto de algo que está na sua mesa. Envie para o ChatGPT, o Gemini ou o Canva e peça: "Tire o fundo e coloque isto sobre uma superfície clara e limpa com luz do dia suave." Veja se algo no objeto mudou.`,
      },
      {
        slug: 'honest-visuals',
        title: 'Usando imagens e vídeos com IA de forma honesta',
        minutes: 10,
        body: `
A IA facilita muito criar coisas que parecem reais. Isso é poderoso e traz responsabilidade.

## Não falsifique aquilo em que o cliente confia

- Nunca mostre um produto, prato, ambiente ou resultado que não seja realmente assim.
- Nunca crie "clientes", fotos de "antes e depois" ou depoimentos que não sejam reais.
- Se uma imagem é ilustração ou simulação, pode usar. Só não a faça passar por foto real.

## Pessoas reais precisam de permissão real

Um [[deepfake|deepfake]] é um vídeo, áudio ou imagem feito com IA que mostra uma pessoa real fazendo ou dizendo algo que ela não fez. Nunca copie o rosto ou a voz de alguém sem permissão clara, seja uma pessoa famosa, sua equipe ou sua família. Em muitos lugares já existem leis sobre isso.

## Confira as regras de onde você publica

Algumas plataformas pedem para identificar imagens ou vídeos feitos com IA, e algumas ferramentas limitam o que você pode criar ou o uso comercial. Leia os termos antes de usar imagens de IA em anúncios ou produtos.

## Como identificar falsificações

A cada ano você vai ver mais conteúdo feito com IA. Antes de acreditar ou compartilhar algo surpreendente:

- Procure detalhes estranhos: mãos, textos, joias, reflexos, fundos sem sentido
- Confira a fonte: quem publicou primeiro?
- Pesquise a imagem (por exemplo, com o Google Lens) para ver onde mais ela aparece
- Tenha cuidado redobrado com áudios urgentes pedindo dinheiro, mesmo que a voz pareça conhecida

> Se você ficaria sem graça se alguém descobrisse que foi feito com IA, não use dessa forma.
`,
        tryIt: `Abra o Google Lens (no app do Google ou no Chrome) e pesquise com alguma imagem viral que você viu nesta semana. Veja onde mais ela aparece e se alguém a questionou. Depois pergunte a um assistente de IA: "Quais são três sinais de que uma imagem pode ter sido feita com IA?"`,
      },
    ],
    exercise: {
      title: 'Exercício: Crie um conjunto de três',
      body: `
Crie três peças com IA, cada uma usando uma habilidade diferente deste módulo:

1. **Uma imagem nova:** um cartão de aniversário, um convite, um fundo de panfleto ou uma ilustração, usando a descrição em cinco partes
2. **Uma foto real editada:** tire um fundo, corrija a luz ou amplie as bordas
3. **Um clipe curto:** um vídeo de 10 a 20 segundos com legendas feitas por IA (vale um vídeo do celular)

Para cada uma, escreva uma frase sobre o que faria diferente da próxima vez. Revise as três com honestidade: algo parece real sem ser?
`,
    },
    checklist: [
      'Crie uma imagem a partir de uma descrição e peça pelo menos uma mudança',
      'Edite uma das suas fotos com uma ferramenta de IA',
      'Coloque legendas automáticas em um vídeo curto',
      'Salve duas descrições de imagem que funcionaram bem',
      'Pesquise uma imagem surpreendente na internet antes de acreditar ou compartilhar',
    ],
  },
  {
    number: '11',
    summary:
      'Use a IA como assistente pessoal para planejar a semana, organizar refeições, viagens e orçamentos, pensar em decisões e aprender coisas novas mais rápido.',
    lessons: [
      {
        slug: 'plan-your-week',
        title: 'Planeje a semana em dez minutos',
        minutes: 12,
        body: `
Planejar é uma das coisas mais úteis que a IA faz, e uma das menos conhecidas. Você traz a bagunça e ela ajuda a transformar em um plano.

## O método de esvaziar a cabeça

1. **Despeje tudo:** escreva cada tarefa, compromisso, recado e preocupação que estiver na cabeça, em qualquer ordem. Não organize.
2. **Diga seus limites:** "Trabalho das 9 às 17 de segunda a sexta, busco as crianças às 15h30 às quartas e fico cansado depois das 20h."
3. **Peça um plano:** "Separe isto em obrigatório nesta semana, seria bom e pode esperar. Depois sugira o dia para cada obrigatório."
4. **Ajuste:** "Segunda ficou pesada demais" ou "junte todos os recados em uma saída só."

## Seja realista

A IA não sabe quanto tempo as coisas levam para você. Conte ("o mercado leva 90 minutos") e peça para deixar tempo livre todo dia. Um plano sem pausas desmorona na terça.

## Conectada ou não

Sozinhos, a maioria dos assistentes de IA não vê sua agenda nem seu e-mail. Alguns veem se você conectar, e recursos de IA estão chegando aos apps do Google, da Microsoft e da Apple. De qualquer forma, quem manda é você: a IA sugere e você coloca na agenda.

> Esvazie a cabeça no domingo à noite ou na segunda de manhã. Dez minutos de planejamento economizam horas de "o que eu tinha que fazer mesmo?"
`,
        tryIt: `Escreva em um assistente de IA tudo o que está na sua cabeça nesta semana, uma linha por item, mais seu horário de trabalho. Peça: "Transforme isto em um plano realista para a semana com uma hora livre por dia." Passe pelo menos um item para a sua agenda de verdade.`,
      },
      {
        slug: 'everyday-life',
        title: 'Refeições, viagens, orçamentos e grandes decisões',
        minutes: 12,
        body: `
Quando você se acostuma a perguntar, descobre que a IA ajuda nas tarefas do dia a dia que tomam suas noites.

## Refeições

"Planeje cinco jantares fáceis para a semana para uma família de quatro pessoas. Um vegetariano, ninguém gosta de cogumelo e cada um em menos de 30 minutos. Depois me dê uma lista de compras única, agrupada por corredor." Você também pode fotografar a geladeira e perguntar o que cozinhar.

## Viagens

Informe as datas, o orçamento, quem vai e do que vocês gostam, e peça um roteiro dia a dia. Depois confira você mesmo horários, preços e tempos de deslocamento: a IA pode estar desatualizada ou simplesmente errada.

## Orçamentos

Descreva sua renda e seus gastos mensais por categorias aproximadas e peça ideias para economizar 200 por mês, ou ajuda para montar uma planilha de orçamento simples. Nunca cole números de conta, senhas ou extratos bancários completos.

## Grandes decisões

A IA é uma parceira paciente para pensar. Experimente:

- "Me ajude a comparar estas duas propostas de emprego. Faça perguntas primeiro."
- "No que eu não estou pensando antes de comprar um carro usado?"
- "Argumente contra esta decisão para eu testá-la."

## Conheça os limites

Em saúde, questões jurídicas e dinheiro, a IA serve para entender suas opções e preparar perguntas. Ela não substitui um médico, advogado ou contador que conheça sua situação.

> Pergunte "O que eu devo perguntar ao especialista?" É um dos usos mais valiosos da IA.
`,
        tryIt: `Pergunte a um assistente de IA: "Planeje três jantares que eu possa fazer nesta semana com [três coisas que você já tem na cozinha], com menos de 30 minutos cada, e me dê uma lista curta de compras para o resto." Faça um deles.`,
      },
      {
        slug: 'learn-anything',
        title: 'Aprenda qualquer coisa mais rápido',
        minutes: 10,
        body: `
Pense na IA como um professor particular que nunca se cansa das suas perguntas.

## Formas de aprender com ela

- **Explique de forma simples:** "Me explique como funciona um financiamento imobiliário como se eu fosse totalmente iniciante. Use um exemplo com números reais."
- **Um passo de cada vez:** "Me ensine o básico de fórmulas do Excel, uma aula por vez. Espere eu dizer 'próximo'."
- **Me teste:** "Me faça cinco perguntas sobre o que você acabou de explicar, uma de cada vez, e diga onde errei."
- **Resuma:** cole um artigo ou documento longo e peça os cinco pontos principais, ou o que aquilo significa para você.
- **Pratique um idioma:** "Vamos ter uma conversa simples em inglês sobre pedir comida. Corrija meus erros com gentileza."

## Confira o que ela diz

A IA explica com clareza mesmo quando está errada, então, para o que for importante:

- Pergunte: "Quanta certeza você tem e onde posso conferir?"
- Use um assistente com busca na web para fatos recentes e abra as fontes
- Compare com uma fonte confiável (um site oficial, um livro, um profissional)

## Use para entender, não para pular etapas

Pedir para a IA fazer sua lição de casa ou uma prova do trabalho não ensina nada e muitas vezes quebra as regras. Pedir que ela explique até você entender é uma das melhores formas de aprender.

> O glossário da Academia funciona do mesmo jeito: quando uma palavra de IA confundir você, procure lá e depois peça a um assistente um exemplo da sua própria vida.
`,
        tryIt: `Escolha algo que você sempre quis entender (score de crédito, como funcionam os painéis solares, as regras de um esporte). Peça: "Me explique isto em linguagem simples em menos de 150 palavras e depois me faça três perguntas." Responda.`,
      },
    ],
    exercise: {
      title: 'Exercício: Sua semana planejada com IA',
      body: `
Passe uma semana inteira com a IA como assistente pessoal:

1. Domingo ou segunda: esvazie a cabeça e monte um plano semanal realista
2. Planeje os jantares da semana e uma lista de compras única
3. Use a IA para pensar em uma decisão que você vem adiando
4. Aprenda algo novo com o método de explicar e testar
5. No fim da semana, anote o que ajudou e o que você vai continuar fazendo
`,
    },
    checklist: [
      'Esvazie a cabeça e transforme em um plano semanal',
      'Planeje uma semana de refeições com uma lista de compras única',
      'Use a IA para comparar opções em uma decisão real',
      'Aprenda um assunto novo com o método de explicar e testar',
      'Confira uma resposta importante da IA em uma fonte confiável',
    ],
  },
  {
    number: '12',
    summary:
      'Veja como a IA pode responder seus clientes por chat, mensagem e telefone de dia e de noite, o que ela nunca deve resolver sozinha e como configurá-la para que os clientes confiem.',
    lessons: [
      {
        slug: 'what-customers-ask',
        title: 'O que os clientes perguntam (e quando)',
        minutes: 12,
        body: `
Antes de colocar qualquer IA, descubra com o que seus clientes realmente precisam de ajuda. A maioria dos negócios recebe as mesmas 15 a 20 perguntas o tempo todo.

## Encontre suas perguntas principais

Revise o último mês de e-mails, mensagens, DMs e ligações e anote cada pergunta. Algumas típicas:

- Vocês estão abertos agora? Qual o horário?
- Quanto custa?
- Vocês atendem na minha região?
- Posso agendar para sábado?
- Cadê meu pedido? Qual a política de reembolso?

## Repare quando perguntam

Muitas perguntas chegam à noite e no fim de semana, justamente quando não tem ninguém para responder. As pessoas costumam contatar mais de um negócio, e quem responde primeiro muitas vezes fica com o serviço. Isso é a [[velocidade de resposta|speed-to-lead]].

## Separe em três grupos

1. **Fatos simples:** horário, preços, localização, políticas. A IA responde bem.
2. **Ações simples:** agendar um horário, anotar um recado, mandar um link. A IA consegue com a configuração certa.
3. **Decisões:** reclamações, reembolsos, emergências, orçamentos sob medida. Uma pessoa deve cuidar disso.

Essa separação vira seu plano para as próximas duas aulas.

> Se você não consegue escrever a resposta, a IA também não consegue dar. Seu primeiro trabalho é escrever respostas claras para as perguntas principais.
`,
        tryIt: `Cole dez perguntas reais de clientes (sem nomes) em um assistente de IA e peça: "Separe em fatos simples, ações simples e decisões. Quais três me economizariam mais tempo se fossem respondidas na hora?"`,
      },
      {
        slug: 'ai-chat-and-phone',
        title: 'Chat com IA e atendimento telefônico com IA',
        minutes: 15,
        body: `
Existem duas formas principais de a IA atender seus clientes: por chat ou mensagem, e por telefone.

## Assistentes de chat e mensagem

Um [[chatbot|chatbot]] no seu site, Facebook, Instagram ou linha de mensagens pode responder na hora. Os modernos não seguem um roteiro rígido: eles leem as informações do seu negócio, chamadas de [[base de conhecimento|knowledge-base]], e respondem em linguagem normal.

Um bom chatbot:

- Responde só com as suas informações e diz "Não tenho certeza, vou chamar alguém" quando não sabe
- Pode mandar links (página de agendamento, cardápio, tabela de preços)
- Pega o nome e o telefone do cliente antes de passar para uma pessoa

## Atendimento telefônico com IA

A [[IA de voz|voice-ai]] já consegue atender o telefone com voz natural, responder perguntas comuns, marcar horários e anotar recados detalhados. Isso é muito útil para prestadores de serviço, clínicas, salões e restaurantes que perdem ligações quando estão ocupados. As ligações que precisam de uma pessoa são transferidas ou viram um recado por escrito com resumo.

## O que procurar

- **Fácil de atualizar:** você mesmo muda preços e horários em minutos
- **Conecta com suas ferramentas:** sua agenda de horários, e-mail e mensagens
- **Registro das conversas:** você pode ler cada conversa
- **Passagem clara para uma pessoa:** um jeito simples de falar com alguém

## Expectativas reais

A IA não vai saber da promoção do dia nem que sua van quebrou se você não contar. Conte com atualizar as informações sempre que algo mudar.

> Configurar isso no seu site, telefone e caixa de entrada é o que fazemos para os clientes da Number 1 Digital Marketing. Você também pode começar pequeno, sozinho, com um canal.
`,
        tryIt: `Cole em um assistente de IA seu horário, seus preços e cinco perguntas frequentes com as respostas. Depois diga: "Finja que você é o assistente do meu negócio e responda aos clientes só com estas informações. Se não souber, diga." Faça três perguntas como cliente, incluindo uma que ele não consiga responder.`,
      },
      {
        slug: 'handoff-to-humans',
        title: 'Saber quando uma pessoa assume',
        minutes: 12,
        body: `
O melhor atendimento com IA conhece seus limites. O cliente perdoa um "vou chamar uma pessoa para você". Ele não perdoa uma resposta errada dita com confiança.

## Sempre passe para uma pessoa

- Reclamações e clientes irritados
- Reembolsos, descontos e qualquer assunto de dinheiro além dos preços divulgados
- Emergências, segurança ou saúde
- Orçamentos sob medida e pedidos incomuns
- Qualquer coisa que não esteja na base de conhecimento

Escreva isso como regras claras que sua ferramenta segue e defina quem recebe o alerta e em quanto tempo responde.

## Seja transparente

Avise os clientes que eles estão falando com um assistente de IA e facilite falar com uma pessoa. Em muitos lugares isso está virando exigência legal. Em qualquer lugar, gera confiança.

## Revise toda semana

No primeiro mês, leia as conversas toda semana:

- Quais perguntas ele errou ou evitou? Acrescente respostas melhores.
- Onde os clientes se frustraram? Ajuste as regras de passagem para uma pessoa.
- Que perguntas novas apareceram? Acrescente.

## Proteja os dados dos clientes

Escolha ferramentas que mantenham as conversas privadas, não peça mais dados pessoais do que precisa e nunca deixe a IA receber número de cartão pelo chat.

> Ter um [[humano no circuito|human-in-the-loop]] não é fraqueza. É o que torna seguro oferecer respostas 24 horas.
`,
        tryIt: `Escreva em cinco linhas sua lista de "sempre passar para uma pessoa" para o seu negócio. Pergunte a um assistente de IA: "Que situações estão faltando para um [seu tipo de negócio]?" Acrescente a que mais surpreender você.`,
      },
    ],
    exercise: {
      title: 'Exercício: Escreva sua folha de respostas',
      body: `
Crie a base de conhecimento de que qualquer assistente de IA (ou funcionário novo) precisaria:

1. Liste as 15 a 20 perguntas principais dos seus clientes no último mês
2. Escreva uma resposta curta e clara para cada uma: horário, preços, região, agendamento e políticas
3. Escreva suas regras de passagem: o que sempre vai para uma pessoa, quem recebe o alerta e em quanto tempo responde
4. Teste: cole tudo em um assistente de IA, diga para responder só com a sua folha e faça dez perguntas de cliente
5. Corrija cada resposta que veio errada, vaga ou longa demais
`,
    },
    checklist: [
      'Reúna as perguntas principais dos clientes do último mês',
      'Escreva uma resposta clara para cada uma',
      'Escreva suas regras de passagem e quem recebe o alerta',
      'Teste sua folha de respostas com um assistente de IA fingindo ser cliente',
      'Escolha um canal (chat no site, mensagens ou telefone) para testar primeiro',
    ],
  },
  {
    number: '13',
    summary:
      'Use a IA para cortar a papelada: anotações de reuniões, propostas, orçamentos, políticas, planilhas e as tarefas repetidas que enchem sua semana.',
    lessons: [
      {
        slug: 'meetings-and-notes',
        title: 'Reuniões, anotações e ligações',
        minutes: 12,
        body: `
Fazer anotações, registrar o que foi combinado e lembrar dos retornos é um dos lugares mais fáceis para economizar tempo.

## Deixe a IA fazer as anotações

Ferramentas de [[transcrição|transcription]] transformam fala em texto. Muitos apps de videochamada (Zoom, Google Meet, Microsoft Teams) já têm anotações com IA, e apps de celular conseguem gravar e transcrever reuniões presenciais.

A partir de uma transcrição, a IA pode entregar:

- Um resumo curto do que foi conversado
- As decisões tomadas e quem concordou
- Uma lista de tarefas com nomes e datas
- Um e-mail de acompanhamento pronto para editar e enviar

## Áudios também valem

Está dirigindo entre um serviço e outro? Grave um áudio com suas ideias e cole a transcrição em um assistente de IA: "Transforme isto em uma lista de tarefas organizada e um recado curto para minha equipe."

## Peça permissão antes

Sempre avise que vai gravar e peça autorização. Em muitos lugares, é lei. Não grave conversas confidenciais com ferramentas cuja privacidade você não verificou.

## Confira os detalhes

Transcrições erram nomes, números e termos técnicos. Antes de enviar um resumo, confira cada valor, data e nome com o que você lembra.

> Um hábito que dá resultado rápido: termine toda reunião pedindo à IA o e-mail de acompanhamento e envie em até uma hora.
`,
        tryIt: `Grave um áudio de dois minutos sobre o que você precisa fazer nesta semana. Use a transcrição do próprio celular (ou digite rápido), cole em um assistente de IA e peça: "Transforme isto em uma lista de tarefas com um prazo para cada uma."`,
      },
      {
        slug: 'documents-and-paperwork',
        title: 'Propostas, orçamentos, políticas e papelada',
        minutes: 14,
        body: `
A maior parte da papelada de um negócio segue um padrão, e a IA é muito boa com padrões.

## Documentos que a IA pode rascunhar

- **Propostas e orçamentos:** "Transforme estas anotações do serviço em uma proposta clara de uma página com escopo, preço e prazo."
- **Guias para a equipe:** explique em voz alta como você faz uma tarefa e peça à IA para transformar em passos numerados
- **Políticas:** cancelamento, reembolso e atraso de pagamento em linguagem simples
- **Vagas de emprego:** "Escreva uma vaga para recepcionista de meio período. Isto é o que o trabalho envolve de verdade…"
- **Formulários e listas:** fichas de cadastro, listas de abertura e fechamento, listas de inspeção

## Parta do seu melhor exemplo

Cole uma proposta ou documento que funcionou e diga: "Use isto como modelo para um novo para [cliente]." Assim você mantém seu formato, seus preços e seu jeito de escrever.

## Planilhas sem dor de cabeça

Descreva o que você quer em linguagem normal: "Escreva uma fórmula do Google Planilhas que some a coluna C só onde a coluna B diz 'pago'." Peça para ela explicar a fórmula para você conseguir ajustar depois. Você também pode colar uma tabela pequena e pedir um resumo.

## Onde ter cuidado

- **Contratos e documentos jurídicos:** a IA pode rascunhar e explicar, mas um advogado deve revisar tudo o que você assinar ou pedir para alguém assinar
- **Números:** confira você mesmo cada total e preço
- **Dados privados:** tire nomes, endereços e números de documento dos clientes antes de colar

> Mantenha uma pasta com seus melhores documentos feitos com ajuda da IA. Eles viram modelos para sempre.
`,
        tryIt: `Escolha um documento que você escreve com frequência (um orçamento, uma observação de fatura, uma mensagem de boas-vindas). Cole um antigo em um assistente de IA sem dados privados e peça: "Transforme isto em um modelo reutilizável com [COLCHETES] nas partes que mudam."`,
      },
      {
        slug: 'inbox-and-routine',
        title: 'Sua caixa de entrada e as tarefas repetidas',
        minutes: 12,
        body: `
O último passo é o trabalho que se repete todo dia: e-mail, agenda, avisos e passar dados de um lugar para outro.

## Sua caixa de entrada

- **Use o que você já tem.** O Gmail e o Outlook já têm IA que resume conversas longas e sugere respostas.
- **Escreva respostas prontas** para as perguntas que você responde toda semana e deixe a IA adaptar para cada pessoa.
- **Agrupe.** Veja o e-mail duas ou três vezes por dia e use a IA para rascunhar todas as respostas de uma vez.

## Identifique as tarefas repetidas

Durante uma semana, mantenha uma lista simples das tarefas que você faz mais de duas vezes. Algumas comuns: mandar confirmações de agendamento, copiar contatos para uma planilha, enviar faturas e lembretes, publicar o mesmo aviso em vários lugares.

Para cada tarefa, pergunte:

1. Um modelo mais a IA conseguiria fazer a maior parte? (Use o que você aprendeu neste módulo.)
2. Ela poderia rodar sozinha, sem ninguém iniciar? Isso é [[automação|workflow]], e o Módulo 02 (Ferramentas de IA e Automação) ensina a montar passo a passo.

## Agentes de IA

Você vai ouvir falar de [[agentes de IA|ai-agent]]: IA que consegue agir por você, como preencher formulários, agendar ou trabalhar entre vários apps. Eles estão melhorando rápido. Por enquanto, use para tarefas de baixo risco, confira o trabalho e nunca dê acesso a dinheiro ou contas privadas sem limites rígidos.

> Meça: anote quanto tempo uma tarefa levava antes da IA e depois. Horas economizadas são o sinal mais claro de que algo está funcionando.
`,
        tryIt: `Abra seu e-mail e encontre a pergunta que você mais responde. Peça a um assistente de IA: "Escreva uma resposta pronta e simpática para esta pergunta com [COLCHETES] nos dados que mudam." Salve como modelo no seu app de e-mail.`,
      },
    ],
    exercise: {
      title: 'Exercício: Encontre cinco horas',
      body: `
Encontre cinco horas por semana para recuperar:

1. Durante três dias, anote cada tarefa administrativa e mais ou menos quanto tempo leva
2. Marque as três que mais se repetem ou mais demoram
3. Para cada uma, escolha uma solução deste módulo: anotações com IA, um modelo, uma resposta pronta ou (mais tarde) uma automação
4. Teste cada solução pelo menos duas vezes
5. Anote o tempo antes e depois. Você encontrou cinco horas? Se não, qual é a próxima tarefa?
`,
    },
    checklist: [
      'Use anotações com IA ou uma transcrição em uma reunião ou ligação',
      'Transforme um documento que você escreve com frequência em um modelo reutilizável',
      'Peça à IA para escrever ou explicar uma fórmula de planilha',
      'Crie duas respostas prontas de e-mail',
      'Liste suas tarefas repetidas e marque quais poderiam ser automatizadas depois',
    ],
  },
  {
    number: '14',
    summary:
      'Use a IA como parceira para pensar o seu negócio: pesquise clientes e concorrentes, teste preços e experimente ofertas novas antes de apostar nelas.',
    lessons: [
      {
        slug: 'ai-as-advisor',
        title: 'A IA como parceira para pensar o seu negócio',
        minutes: 12,
        body: `
A maioria dos donos de pequenos negócios toma as grandes decisões sozinha. A IA não substitui um mentor, mas é uma boa parceira para pensar em voz alta, disponível sempre que você precisar.

## Dê o quadro completo

Quanto mais contexto ela tiver, melhor ela pensa. Comece uma conversa assim:

"Tenho um [negócio] em [cidade]. Somos [número] funcionários, nossos principais clientes são [quem] e nosso serviço mais vendido é [qual]. Nosso maior desafio agora é [problema]. Me faça cinco perguntas antes de dar conselhos."

Pedir que ela pergunte primeiro gera conselhos muito melhores que uma lista genérica.

## Formas úteis de pensar com a IA

- **Procure furos:** "Este é meu plano para abrir uma segunda unidade. O que pode dar errado?"
- **Faça o papel do cliente:** "Aja como uma mãe ocupada decidindo se contrata meu serviço de limpeza. O que faria você hesitar?"
- **Faça o papel do cético:** "Argumente por que eu NÃO devo aumentar meus preços."
- **Pense em etapas:** "Divida esta meta em um plano de 90 dias com um marco por mês."

## Onde ela falha

A IA não conhece seu mercado local, o dinheiro que você tem no banco nem os nomes dos seus clientes se você não contar, e pode errar com confiança sobre leis, impostos e números. Use para afiar seu raciocínio, confira os fatos principais e converse com seu contador ou consultor antes de passos grandes.

> Trate os conselhos da IA como uma primeira opinião forte, não como a resposta final.
`,
        tryIt: `Descreva seu negócio em três frases e seu maior desafio em uma. Peça a um assistente de IA: "Me faça cinco perguntas sobre isso, uma de cada vez, e depois sugira três coisas que eu poderia testar nos próximos 30 dias." Responda com sinceridade.`,
      },
      {
        slug: 'research-and-pricing',
        title: 'Pesquise clientes, concorrentes e preços',
        minutes: 15,
        body: `
Uma pesquisa que antes levava dias agora pode levar uma tarde, desde que você confira o que a IA encontra.

## Aprenda com o que os clientes já dizem

Copie avaliações do seu negócio e de dois ou três concorrentes (do Google, Yelp ou Facebook) e pergunte:

- "Do que os clientes mais gostam? Do que mais reclamam?"
- "O que os clientes gostariam que alguém oferecesse?"

As lacunas nas avaliações dos concorrentes costumam ser suas melhores oportunidades.

## Pesquise a concorrência

Use um assistente de IA com busca na web: "Compare os serviços, preços e promessas destes três negócios de [tipo de negócio] em [cidade]. Use os sites deles e liste suas fontes." Abra as fontes para confirmar: a IA pode confundir negócios ou usar preços antigos.

## Teste seus preços

A IA é útil para pensar em perguntas do tipo "e se…":

- "Se eu aumentar os preços em 10% e perder 5% dos clientes, ganho mais ou menos? Mostre a conta."
- "Como seria uma assinatura mensal para o meu negócio de estética automotiva?"
- "Me ajude a montar três pacotes: básico, padrão e premium."

Confira a conta você mesmo ou em uma planilha. A IA às vezes erra na aritmética.

## Entenda seu mercado

Pergunte sobre tendências, quem são seus prováveis clientes e o que importa para eles. Depois confirme com conversas reais. Cinco conversas curtas com clientes de verdade valem mais que qualquer palpite da IA.

> Sempre pergunte "De onde veio isto?" Pesquisa que você não consegue conferir é só um palpite que parece inteligente.
`,
        tryIt: `Copie dez avaliações do Google de um concorrente (ou do seu negócio) em um assistente de IA e pergunte: "Quais são as três coisas que os clientes mais elogiam e as três principais reclamações? Que oportunidade isso sugere para um concorrente?"`,
      },
      {
        slug: 'new-offers',
        title: 'Testando ofertas e ideias novas',
        minutes: 12,
        body: `
Ideias novas empolgam, mas a maioria deve ser testada em pequena escala antes de você apostar nelas. A IA ajuda a ir rápido da ideia ao teste.

## Da ideia ao plano de uma página

Peça: "Transforme esta ideia em um plano de uma página: para quem é, que problema resolve, quanto me custa, quanto eu cobraria e como vou saber se está funcionando." Uma página obriga você a pensar com clareza.

## Ideias para explorar

- Serviços novos que seus clientes atuais comprariam ("Do que mais meus clientes de jardinagem podem precisar?")
- Pacotes, combos e assinaturas
- Oficinas, aulas ou produtos digitais baseados no que você sabe
- Parcerias com negócios vizinhos que atendem os mesmos clientes

## Teste antes de construir

- **Pergunte primeiro:** peça ajuda à IA para escrever uma pesquisa curta ou cinco perguntas para fazer aos clientes pessoalmente
- **Pré-venda:** ofereça para alguns clientes antes de investir. Se ninguém disser sim, você economizou dinheiro.
- **Dê um nome:** peça 10 ideias de nome e escolha pelo que os clientes entendem, não pelo que soa esperto

## Quando chegar a hora de divulgar

Quando uma oferta se prova, é preciso divulgá-la. Para isso existe o Curso de Marketing com IA (Módulos 01 a 08): conteúdo, busca, avaliações e medição de resultados.

> Teste pequeno, clientes reais, um número claro. É assim que boas ideias viram bons negócios.
`,
        tryIt: `Pergunte a um assistente de IA: "Meus clientes compram [seu serviço principal]. Sugira cinco produtos ou serviços relacionados pelos quais eles também pagariam e, para cada um, o jeito mais barato de testar a demanda neste mês." Escolha um para testar.`,
      },
    ],
    exercise: {
      title: 'Exercício: Plano de crescimento de uma página',
      body: `
Use a IA como parceira para pensar e monte um plano de uma página:

1. Descreva seu negócio e deixe a IA fazer perguntas
2. Analise as avaliações do seu negócio e de dois concorrentes em busca de lacunas
3. Escolha uma oportunidade, como uma oferta nova, uma mudança de preço ou um pacote
4. Transforme em um plano de uma página com um teste pequeno e um número claro de sucesso
5. Faça o teste com clientes reais nos próximos 30 dias
`,
    },
    checklist: [
      'Tenha uma conversa de planejamento com a IA em que ela pergunte primeiro',
      'Analise avaliações da concorrência em busca de lacunas',
      'Confira uma resposta de pesquisa da IA abrindo as fontes',
      'Use a IA para calcular um "e se…" de preços e confira a conta',
      'Escreva um plano de uma página para uma ideia nova e marque uma data de teste',
    ],
  },
];
