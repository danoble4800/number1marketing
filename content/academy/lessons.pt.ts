// N°1 Academy — aulas em português (Brasil). Mesma estrutura de lessons.ts (inglês).
import type { CourseModule } from './lessons';

export const course: CourseModule[] = [
  {
    number: '01',
    summary:
      'O que a IA moderna realmente é, onde ela se encaixa em um funil de marketing e como usá-la sem colocar em risco sua marca ou seus clientes.',
    lessons: [
      {
        slug: 'what-ai-actually-is',
        title: 'O que a IA é (e o que não é)',
        minutes: 35,
        tryIt: "Abra um assistente de IA gratuito (ChatGPT, Claude ou Gemini) e pergunte: \"Me dê três fatos surpreendentes sobre [sua cidade].\" Depois pergunte: \"Qual deles pode estar errado e como eu confiro?\" Repare como ele parece confiante nos dois casos.",
        body: `
A maioria das ferramentas de IA que os profissionais de marketing usam hoje é baseada em **grandes modelos de linguagem** (LLMs): sistemas treinados com enormes quantidades de texto para prever a próxima palavra mais provável. ChatGPT, Claude e Gemini são exemplos. Ferramentas de imagem e vídeo funcionam com uma ideia parecida, treinadas com imagens e vídeos em vez de texto.

Essa única ideia explica quase tudo sobre o comportamento dessas ferramentas. Elas são extremamente boas em produzir textos que *parecem* corretos. Elas não "sabem" fatos como um banco de dados sabe, e não revisam o próprio trabalho a menos que você peça.

## IA generativa vs. IA preditiva

- A **IA generativa** cria algo novo: uma legenda, um e-mail, uma imagem, um roteiro de vídeo.
- A **IA preditiva** pontua ou prevê: qual lead tem mais chance de comprar, qual cliente pode cancelar, qual anúncio terá o menor custo por clique.

Você provavelmente usa IA preditiva há anos sem chamá-la assim: plataformas como Meta e Google a usam para decidir quem vê seus anúncios. O que mudou recentemente é que a IA generativa ficou barata, rápida e acessível para todos.

## No que a IA é boa

- Transformar anotações soltas em um primeiro rascunho limpo
- Reescrever um conteúdo para outro público, tamanho ou plataforma
- Resumir documentos longos, avaliações, transcrições de ligações ou respostas de pesquisas
- Gerar ideias de ângulos, ganchos, assuntos de e-mail e variações de anúncios
- Identificar padrões nos dados que você fornece

## Onde a IA falha

- **Alucinações:** ela pode afirmar informações falsas —estatísticas inventadas, citações falsas, fontes que não existem— com total confiança.
- **Conhecimento desatualizado:** a menos que a ferramenta possa pesquisar na internet, ela só sabe o que estava nos dados de treinamento.
- **Resultados genéricos:** com um pedido vago, você recebe um conteúdo vago e mediano que soa como o de todo mundo.
- **Nenhum critério sobre o seu negócio:** ela não conhece suas margens, seus clientes nem o que sua marca jamais diria, a menos que você conte.

> A regra de todo este curso: a IA rascunha, uma pessoa decide. Trate cada resultado como o primeiro rascunho de um estagiário rápido e talentoso que nunca conheceu seus clientes.
`,
      },
      {
        slug: 'ai-across-the-funnel',
        title: 'Onde a IA se encaixa no funil de marketing',
        minutes: 40,
        tryIt: "Conte a um assistente de IA o que seu negócio vende e quem compra, e pergunte: \"Em que parte da jornada do meu cliente é mais provável que eu esteja perdendo gente? Me dê três hipóteses e uma pergunta para conferir cada uma.\"",
        body: `
O jeito mais rápido de perder tempo com IA é começar pela ferramenta ("o que posso fazer com o ChatGPT?"). O jeito mais rápido de ter resultados é começar pelo funil ("onde estamos perdendo tempo ou clientes?").

## O funil, etapa por etapa

- **Descoberta:** as pessoas conhecem você. A IA ajuda a produzir mais variações de conteúdo, testar mais criativos de anúncios e transformar um vídeo em vários cortes.
- **Consideração:** as pessoas comparam opções. A IA ajuda a escrever páginas de serviço, perguntas frequentes e comparativos mais claros, e a responder dúvidas comuns na hora com um assistente de chat no site.
- **Conversão:** as pessoas decidem comprar ou agendar. A IA ajuda a responder leads em minutos em vez de horas, personalizar e-mails de acompanhamento e qualificar leads antes de uma ligação de vendas.
- **Retenção:** manter clientes. A IA ajuda a resumir avaliações e chamados de suporte, rascunhar e-mails de reconquista e identificar clientes que sumiram.

## Velocidade de resposta: a vitória mais fácil

Para a maioria das empresas de serviços, o maior vazamento é o acompanhamento lento. Um lead preenche um formulário, espera um dia e fecha com a concorrência. Um fluxo de trabalho com IA pode:

1. Receber o formulário enviado
2. Enviar uma confirmação instantânea e personalizada
3. Resumir o pedido do lead para sua equipe
4. Avisar a pessoa certa por e-mail ou mensagem de texto

Nada disso substitui um vendedor. Garante que o vendedor comece a conversa enquanto o lead ainda está interessado.

## Mantenha uma pessoa no processo

Decida com antecedência quais etapas a IA pode fazer sozinha e quais precisam de aprovação. Uma boa regra para começar:

- **Só a IA:** resumos internos, primeiros rascunhos, marcação e classificação
- **Aprovação humana:** tudo que o cliente vai ler, tudo que envolve dinheiro e tudo que possa constranger a marca

> Escolha uma etapa do seu funil que claramente esteja vazando e comece por ela. Um sistema funcionando vale mais que dez experimentos pela metade.
`,
      },
      {
        slug: 'using-ai-responsibly',
        title: 'Usando a IA com responsabilidade',
        minutes: 35,
        tryIt: "Peça a um assistente de IA: \"Escreva uma avaliação de 5 estrelas para a minha padaria.\" Depois pergunte por que publicá-la seria um problema. Compare a resposta com o que você aprendeu nesta aula.",
        body: `
A IA facilita andar rápido, inclusive na direção errada. Algumas regras básicas protegem seus clientes, sua marca e seu negócio.

## Proteja os dados dos clientes

- Não cole dados pessoais de clientes (nomes, telefones, endereços, dados de pagamento ou de saúde) em ferramentas de IA, a menos que a ferramenta esteja aprovada para esses dados e sua política de privacidade permita.
- Confira as configurações de dados de cada ferramenta. Muitos planos empresariais permitem desativar o treinamento com seus dados; planos gratuitos para consumidores muitas vezes não.
- Ao analisar dados com IA, remova ou substitua antes as informações que identificam as pessoas.

## Seja honesto com seu público

- Nunca use IA para criar avaliações ou depoimentos falsos, nem "clientes" falsos em anúncios. Órgãos reguladores como a Comissão Federal de Comércio dos EUA (FTC) tratam avaliações falsas como prática enganosa, e as plataformas as removem.
- Não apresente imagens geradas por IA como resultados reais, principalmente fotos de antes e depois, fotos de produtos ou fotos da sua equipe.
- Se um assistente de chat atende clientes, deixe claro que eles estão falando com um assistente automatizado e ofereça um jeito fácil de falar com uma pessoa.

## Confira fatos e direitos

- Verifique cada estatística, afirmação e citação antes de publicar. Se não encontrar a fonte original, corte.
- Cuidado com imagens e músicas que imitam um artista, uma marca ou uma pessoa real específica.
- Setores como saúde, finanças, jurídico e imobiliário têm regras extras de publicidade. A IA não as conhece; você precisa conhecer.

## Proteja a marca

Escreva o que sua marca nunca diz nem faz (por exemplo: nada de táticas de pressão, nada de gírias, nada de falar mal da concorrência) e inclua isso nas suas instruções para a IA. No Módulo 03 vamos transformar isso em um guia de voz da marca completo.

> Antes de publicar qualquer coisa feita com ajuda de IA, pergunte: É verdade? É justo com o cliente? Eu ficaria confortável se ele soubesse como foi feito?
`,
      },
    ],
    exercise: {
      title: 'Exercício: sua auditoria de oportunidades de IA',
      body: `
Liste 10 tarefas de marketing que você ou sua equipe fazem toda semana. Para cada uma, anote:

1. Quanto tempo ela leva por semana
2. Qual etapa do funil ela apoia
3. Se a IA poderia rascunhá-la, fazê-la com aprovação ou se ela deve continuar totalmente humana

Marque as duas tarefas que mais economizam tempo com o menor risco. Esses são seus primeiros projetos de IA; você vai construir um deles no Módulo 02.
`,
    },
    checklist: [
      "Liste 10 tarefas de marketing semanais e quanto tempo cada uma leva",
      "Marque a etapa do funil que cada tarefa apoia",
      "Escolha as duas tarefas com mais tempo economizado e menos risco",
      "Anote quais dados de clientes você nunca vai colar em uma ferramenta de IA",
      "Decida quem aprova o que a IA escreve antes que os clientes vejam",
    ],
  },
  {
    number: '02',
    summary:
      'Escolha ferramentas de IA pela tarefa que resolvem, entenda como os fluxos de automação são construídos e desenhe seu primeiro fluxo com segurança.',
    lessons: [
      {
        slug: 'choosing-your-toolkit',
        title: 'Como escolher suas ferramentas de IA',
        minutes: 55,
        tryIt: "Liste todas as ferramentas que você já paga (plataforma de e-mail, app de design, CRM, celular). Pergunte a um assistente de IA: \"Quais destas já têm recursos de IA que talvez eu não esteja usando, e o que eles fazem?\"",
        body: `
Toda semana surgem novas ferramentas de IA. Você não precisa da maioria delas. Escolha ferramentas pela **tarefa a ser resolvida**, não pela moda.

## As ferramentas essenciais por tarefa

- **Escrever e pensar:** um assistente de IA geral como ChatGPT, Claude ou Gemini. Essa será sua ferramenta mais usada: rascunhar, reescrever, resumir, gerar ideias e analisar.
- **Design e imagens:** ferramentas como o Canva (com seus recursos de IA) ou o Adobe Firefly para artes de redes sociais, variações de anúncios e protótipos rápidos.
- **Vídeo:** ferramentas de edição com IA que cortam vídeos longos em clipes curtos, adicionam legendas e removem vícios de linguagem.
- **Automação:** Zapier, Make ou n8n para conectar seus aplicativos e fazer o trabalho circular entre eles sem copiar e colar.
- **IA embutida:** seu CRM, sua plataforma de e-mail e suas contas de anúncios provavelmente já incluem recursos de IA. Confira o que você já paga antes de comprar algo novo.

## Como avaliar uma ferramenta

Antes de adotar qualquer ferramenta, responda a cinco perguntas:

1. **Tarefa:** Qual tarefa específica ela melhora e quanto?
2. **Qualidade:** Teste com uma tarefa real do seu negócio, não com os exemplos da demonstração.
3. **Dados:** Para onde vão seus dados? Dá para desativar o treinamento com eles?
4. **Custo:** Quanto custa por mês com o seu uso real, incluindo usuários extras?
5. **Compatibilidade:** Ela se conecta às ferramentas que você já usa?

## Evite o excesso de ferramentas

Cada ferramenta adiciona um login, uma fatura e um lugar onde a informação pode se perder. Uma pequena empresa consegue fazer um ótimo marketing com IA usando **um assistente de IA, uma ferramenta de design e uma plataforma de automação**. Adicione mais apenas quando uma tarefa específica exigir.

> Faça um teste de duas semanas com uma tarefa real antes de assinar qualquer plano pago. Se você não consegue medir a diferença, não precisa da ferramenta.
`,
      },
      {
        slug: 'automation-basics',
        title: 'Fundamentos de automação: gatilhos, ações e fluxos',
        minutes: 60,
        tryIt: "Escolha uma tarefa que você repete toda semana e escreva em uma frase: \"Quando ___, faça ___, mas só se ___.\" Peça a um assistente de IA para apontar o gatilho, as ações e os filtros da sua frase.",
        body: `
A automação é onde a IA deixa de ser uma janela de chat e começa a trabalhar enquanto você dorme. Toda automação, por mais complexa que seja, é construída com as mesmas peças.

## As peças básicas

- **Gatilho:** o evento que inicia o fluxo. *Um formulário é enviado. Uma linha é adicionada a uma planilha. Um pagamento é recebido.*
- **Ação:** o que acontece em seguida. *Criar um contato no CRM. Enviar um e-mail. Postar uma mensagem para a equipe.*
- **Filtro / condição:** regras que decidem se o fluxo continua. *Só se o orçamento passar de US$ 1.000. Só se o lead estiver na Flórida.*
- **Etapa de IA:** uma ação que envia informações para um modelo de IA e usa a resposta. *Resuma este lead. Classifique esta mensagem como vendas, suporte ou spam. Rascunhe uma resposta.*

Um **fluxo** é um gatilho seguido de uma cadeia de ações, filtros e etapas de IA.

## Exemplo: um fluxo de leads com IA

1. **Gatilho:** um novo lead envia o formulário do seu site
2. **Ação:** salvar o lead no seu CRM ou em uma planilha do Google
3. **Etapa de IA:** resumir o que ele pediu e sugerir uma prioridade (quente, morno, frio)
4. **Filtro:** se for quente, seguir para a etapa 5; se não, adicionar a uma sequência de e-mails de nutrição
5. **Ação:** enviar uma mensagem de texto ao responsável de vendas com o resumo e o telefone do lead
6. **Ação:** enviar ao lead um e-mail de confirmação instantâneo

Esse único fluxo pode reduzir o tempo de resposta de horas para minutos, sem ninguém vigiando a caixa de entrada.

## Onde as automações quebram

- Um campo é renomeado e o fluxo deixa de encontrar os dados
- O login de um aplicativo expira
- A etapa de IA devolve algo inesperado (um parágrafo longo em vez de "quente")

Por isso você vai incluir verificações, que é o tema da próxima aula.

> Pense em cada fluxo como uma frase: "Quando [gatilho], faça [ações], mas só se [condições]". Se não dá para dizer em uma frase, simplifique.
`,
      },
      {
        slug: 'building-your-first-workflow',
        title: 'Construindo seu primeiro fluxo com segurança',
        minutes: 65,
        tryIt: "Peça a um assistente de IA: \"Classifique cada mensagem como vendas, suporte ou spam. Responda com uma só palavra por mensagem.\" Cole três mensagens reais desta semana (sem nomes) e veja se ele respeita o formato.",
        body: `
O objetivo da sua primeira automação não é impressionar ninguém. É economizar tempo de verdade, de forma confiável, sem criar novos problemas.

## Passo 1: mapeie o processo à mão

Escreva exatamente o que acontece hoje, passo a passo, incluindo quem faz e quais aplicativos estão envolvidos. Se o processo manual é bagunçado, automatizá-lo só deixa a bagunça mais rápida.

## Passo 2: comece com uma tarefa pequena e frequente

Bons primeiros fluxos rodam com frequência, seguem regras claras e têm baixo risco se algo der errado; por exemplo, salvar leads do formulário em uma planilha e avisar a equipe, ou transformar um novo post do blog em rascunhos de legendas para revisão.

## Passo 3: torne previsível o resultado da IA

As etapas de IA são a parte menos previsível de qualquer fluxo. Torne-as confiáveis:

- Peça um **formato fixo**: "Responda com uma única palavra: quente, morno ou frio."
- Dê o **contexto** necessário: o que você vende, quem é o seu cliente ideal e o que torna um lead quente.
- Adicione um **plano B**: se a resposta não for uma das palavras permitidas, trate como "morno" e sinalize para uma pessoa revisar.

## Passo 4: mantenha uma etapa de aprovação humana

Para tudo que o cliente vai ver, faça a IA criar um **rascunho** —na sua ferramenta de e-mail, em um documento ou em uma mensagem no Slack ou por e-mail— que uma pessoa aprove antes do envio. Retire a etapa de aprovação só depois de semanas de resultados consistentemente bons.

## Passo 5: teste e depois monitore

1. Rode o fluxo com dados de teste antes de colocá-lo no ar
2. Teste entradas bagunçadas: campos vazios, uma mensagem muito longa, uma mensagem em outro idioma
3. Ative as notificações de erro para saber na hora quando algo falhar
4. Revise os resultados toda semana durante o primeiro mês

## Passo 6: conheça o custo

As plataformas de automação cobram pelo número de tarefas, e as etapas de IA cobram pelo uso. Estime o volume mensal antes de lançar para não ter surpresas na fatura.

> Documente cada fluxo em um só lugar: o que o dispara, o que ele faz, quem é o responsável e como desligá-lo. Seu eu do futuro vai agradecer.
`,
      },
    ],
    exercise: {
      title: 'Exercício: desenhe seu primeiro fluxo',
      body: `
Pegue uma das duas tarefas que você marcou na auditoria do Módulo 01 e desenhe uma automação para ela no papel:

1. Escreva a versão em uma frase: "Quando ___, faça ___, mas só se ___."
2. Liste o gatilho, cada ação, os filtros e as etapas de IA
3. Marque quais etapas precisam de aprovação humana
4. Escreva a instrução exata que sua etapa de IA vai receber, incluindo o formato de resposta exigido
5. Liste três coisas que podem dar errado e como você vai ficar sabendo

Se você tem acesso ao Zapier, Make ou n8n, construa o fluxo e rode com dados de teste.
`,
    },
    checklist: [
      "Escolha uma ferramenta de IA para escrever e uma de automação, e cancele as que não usa",
      "Escreva seu primeiro fluxo em uma frase: “Quando ___, faça ___, mas só se ___”",
      "Desenhe cada passo e marque os que precisam de aprovação humana",
      "Monte o fluxo (ou desenhe) e teste com dados de teste",
      "Anote quem é o responsável, como vai saber se quebrou e como desligar",
    ],
  },
  {
    number: '03',
    summary:
      'Escreva prompts que geram resultados consistentes e fiéis à sua marca logo na primeira tentativa e monte uma biblioteca de prompts reutilizável para sua equipe.',
    lessons: [
      {
        slug: 'anatomy-of-a-prompt',
        title: 'A anatomia de um bom prompt',
        minutes: 45,
        tryIt: "Peça a um assistente de IA \"uma legenda de Instagram para o meu negócio\". Depois peça de novo com um papel, seu público, o objetivo, o tom e um limite de palavras. Compare as duas respostas.",
        body: `
A qualidade do que a IA produz depende principalmente da qualidade das instruções. "Escreva um post sobre nosso novo serviço" gera algo genérico. Um prompt estruturado gera algo que você pode usar.

## As seis partes de um bom prompt

1. **Papel:** quem a IA deve ser. *"Você é um redator de redes sociais experiente em empresas de serviços locais."*
2. **Contexto:** o que ela precisa saber. *A empresa, o público, a oferta, o que já funcionou antes.*
3. **Tarefa:** exatamente o que produzir. *"Escreva três legendas para o Instagram anunciando nosso novo horário de fim de semana."*
4. **Formato:** como o resultado deve ficar. *"Cada legenda com menos de 150 palavras, uma chamada para ação e no máximo três hashtags."*
5. **Restrições:** o que evitar. *"Sem emojis na primeira linha. Não mencione preços. Não use as palavras 'revolucionário' nem 'desbloqueie'."*
6. **Exemplos:** uma amostra de como é um bom resultado, quando você tiver.

## Antes e depois

**Fraco:** "Escreva um e-mail sobre nossa promoção."

**Forte:** "Você é o responsável pelo e-mail marketing de uma loja de móveis familiar. Nossos clientes são proprietários de imóveis de 35 a 60 anos que valorizam qualidade mais do que o menor preço. Escreva um e-mail promocional para nosso evento de 20% de desconto em conjuntos de jantar neste sábado e domingo. Inclua um assunto com menos de 45 caracteres, uma abertura acolhedora, três parágrafos curtos focados em benefícios e uma chamada para ação clara para visitar a loja. Tom caloroso e direto. Sem táticas de pressão, sem urgência falsa e sem pontos de exclamação no assunto."

O segundo prompt leva um minuto a mais para escrever e economiza dez minutos de edição.

> Se o resultado for ruim, não se limite a clicar em "gerar novamente". Pergunte-se qual das seis partes faltou, adicione e tente de novo.
`,
      },
      {
        slug: 'prompting-techniques',
        title: 'Técnicas que melhoram qualquer resultado',
        minutes: 50,
        tryIt: "Cole duas legendas ou e-mails de que você se orgulha e diga: \"Escreva um terceiro neste mesmo estilo sobre [novo tema].\" Veja quanto ele se aproxima da sua voz com exemplos.",
        body: `
Quando seus prompts já têm as seis partes, estas técnicas levam o resultado de bom para excelente.

## Mostre, não apenas diga (prompts com exemplos)

Cole dois ou três exemplos de conteúdos que você adora —seus posts de melhor desempenho, e-mails que receberam respostas— e diga "siga o estilo destes exemplos". Exemplos comunicam o tom muito melhor do que adjetivos como "próximo" ou "profissional".

## Peça que ela faça perguntas primeiro

Termine seu prompt com: *"Antes de começar, me faça as perguntas que precisar para fazer isso bem."* Muitas vezes a IA vai perguntar sobre detalhes que você esqueceu: público, objetivo, oferta, prazo.

## Divida tarefas grandes em etapas

Não peça uma campanha inteira em um único prompt. Trabalhe por etapas:

1. Gere 10 ângulos de campanha
2. Escolha os dois melhores e explique por quê
3. Escreva um roteiro para o vencedor
4. Rascunhe cada peça a partir do roteiro

Cada etapa dá a chance de corrigir o rumo antes que a IA vá longe demais na direção errada.

## Faça ela se autocriticar

Depois de um rascunho, peça: *"Revise isto como um cliente cético. O que está confuso, pouco convincente ou vendedor demais? Depois reescreva corrigindo esses pontos."* A autocrítica encontra pontos fracos que, de outra forma, você teria que achar sozinho.

## Itere com feedback específico

"Melhore" é vago. Diga o que mudar: *"Corte o segundo parágrafo pela metade, troque a abertura por uma pergunta e deixe a chamada para ação mais específica."*

## Peça opções

Solicite de três a cinco variações com abordagens diferentes; por exemplo, uma emocional, uma prática e uma baseada em prova social. Escolher é mais rápido do que reescrever, e variações são exatamente o que você precisa para testar anúncios.

> Guarde todo prompt que gerou um ótimo resultado. A melhor biblioteca de prompts é construída com vitórias reais, não com listas de prompts encontradas na internet.
`,
      },
      {
        slug: 'prompt-library-and-brand-voice',
        title: 'Sua biblioteca de prompts e guia de voz da marca',
        minutes: 55,
        tryIt: "Peça a um assistente de IA: \"Me entreviste com cinco perguntas para descobrir a voz da minha marca.\" Responda e peça para ele transformar suas respostas em um guia de voz de um parágrafo. Salve.",
        body: `
A diferença entre uma pessoa que "usa IA" e uma equipe que tem resultados consistentes é a documentação. Dois documentos fazem a maior parte do trabalho.

## O guia de voz da marca

Um documento de uma página que você cola como contexto em qualquer prompt de conteúdo. Ele deve incluir:

- **Quem somos:** uma ou duas frases sobre a empresa e o que a torna diferente
- **Com quem falamos:** o cliente ideal, seus principais problemas e o que importa para ele
- **Como soamos:** de três a cinco traços de voz, cada um com um exemplo curto de "isto, não aquilo": *confiantes, não arrogantes; simpáticos, não bobos*
- **Palavras que usamos e palavras que nunca usamos**
- **Regras:** afirmações que podemos e não podemos fazer, exigências legais, preferências de formato
- **Exemplos:** dois ou três conteúdos que representem perfeitamente a marca

Muitos assistentes de IA permitem salvar isso como instruções de projeto ou como um assistente personalizado, para você não precisar colar toda vez.

## A biblioteca de prompts

Um documento ou uma planilha compartilhada com prompts testados que toda a equipe pode reutilizar. Para cada prompt, registre:

1. **Nome e caso de uso:** "Legendas semanais para o Instagram a partir de um post do blog"
2. **O prompt em si**, com marcadores entre colchetes como [POST DO BLOG] e [OFERTA]
3. **Em qual ferramenta** ele funciona melhor
4. **Um resultado de exemplo** que mostre como é um bom resultado
5. **Responsável e data da última atualização**

## Mantenha a biblioteca viva

- Revise a biblioteca todo mês; apague os prompts que ninguém usa
- Quando um prompt gerar um resultado fraco, melhore o prompt, não só o resultado
- Quando alguém novo entrar na equipe, a biblioteca e o guia de voz serão o treinamento de IA dessa pessoa

> Uma boa biblioteca de prompts transforma os melhores resultados de uma pessoa no padrão de toda a equipe.
`,
      },
    ],
    exercise: {
      title: 'Exercício: crie seu guia de voz da marca e seus três primeiros prompts',
      body: `
1. Escreva um guia de voz da marca de uma página usando o modelo da Aula 3 (para o seu negócio ou um negócio de exemplo)
2. Escreva três prompts reutilizáveis para tarefas que você faz toda semana, usando as seis partes da Aula 1
3. Teste cada prompt com o seu guia de voz incluído e melhore o prompt pelo menos uma vez com base no resultado
4. Guarde as versões finais; você vai usá-las no Módulo 04 e no seu projeto final
`,
    },
    checklist: [
      "Escreva um guia de voz da marca de uma página",
      "Transforme três tarefas semanais em prompts com as seis partes",
      "Teste cada prompt e melhore pelo menos uma vez",
      "Guarde os prompts finais em uma biblioteca compartilhada",
      "Marque na agenda uma revisão da biblioteca a cada trimestre",
    ],
  },
  {
    number: '04',
    summary:
      'Planeje o conteúdo em torno do seu público e dos seus objetivos, produza mais sem perder qualidade e continue visível enquanto a busca muda.',
    lessons: [
      {
        slug: 'strategy-before-content',
        title: 'Primeiro a estratégia, depois o conteúdo',
        minutes: 55,
        tryIt: "Pergunte a um assistente de IA: \"Liste as dez perguntas que os clientes mais fazem a um [seu tipo de negócio] antes de comprar.\" Marque as três que você mais ouve: esses são seus próximos conteúdos.",
        body: `
A IA consegue produzir cem posts em uma tarde. Esse é o problema: sem estratégia, você só publica mais ruído, mais rápido. A estratégia decide **o que** vale a pena produzir; a IA ajuda com **quanto** e **com que rapidez**.

## Comece pelo objetivo e pelo público

Todo plano de conteúdo deve responder:

- **Para qual resultado de negócio ele serve?** Mais ligações agendadas, mais visitas à loja, mais clientes que voltam?
- **Para quem exatamente?** Seja específico: "proprietários em Miami planejando reformar a cozinha", não "pessoas que gostam de design".
- **O que eles precisam ouvir para dar o próximo passo?** As perguntas, dúvidas e objeções deles são suas melhores ideias de conteúdo.

## Pilares de conteúdo

Escolha de três a cinco temas recorrentes que conectem o que importa para o seu público com o que você vende. Uma empresa de telhados poderia usar:

1. **Educação:** como identificar danos causados por tempestades, o que afeta a vida útil de um telhado
2. **Prova:** projetos reais, histórias de clientes, fotos de antes e depois
3. **Bastidores:** a equipe, o processo, as normas de segurança
4. **Ofertas:** inspeções, promoções sazonais, financiamento

Os pilares mantêm seu conteúdo consistente e facilitam dar instruções à IA: *"Escreva cinco ideias de posts para o nosso pilar de Educação."*

## Use a IA para pesquisar seu público

Cole avaliações anônimas, e-mails frequentes de clientes ou anotações de ligações de vendas e peça: *"Quais são as dez perguntas, medos e resultados desejados mais comuns nestas mensagens? Cite as frases exatas que os clientes usam."* As próprias palavras dos clientes rendem os melhores títulos e ganchos.

> Um conteúdo que responde a uma pergunta real de cliente sempre vai superar um conteúdo criado porque "hoje precisamos postar alguma coisa".
`,
      },
      {
        slug: 'content-at-scale',
        title: 'Produzindo em escala sem perder sua voz',
        minutes: 65,
        tryIt: "Cole um artigo, e-mail ou legenda longa que você escreveu e peça: \"Transforme isto em três posts curtos para redes sociais e um assunto de e-mail, com a mesma voz.\" Edite o melhor e salve.",
        body: `
Os melhores fluxos de conteúdo com IA não começam com um prompt em branco. Eles começam com algo original —sua experiência, suas histórias, seus resultados reais— e usam a IA para multiplicar isso.

## A pirâmide de reaproveitamento

Crie uma **peça pilar** robusta toda semana ou todo mês e depois divida em peças menores:

1. **Pilar:** um vídeo, episódio de podcast, webinar ou artigo longo baseado em experiência real
2. **Peças médias:** um post de blog, uma newsletter, um artigo no LinkedIn
3. **Micropeças:** vídeos curtos, artes com citações, carrosséis, legendas, stories

Uma conversa gravada de 20 minutos com um especialista da sua equipe pode virar um mês de conteúdo, e tudo soa como você, porque começou com você.

## O fluxo de produção

1. **Briefing:** objetivo, público, pilar, pontos principais e chamada para ação
2. **Rascunho:** a IA rascunha usando seu guia de voz da marca e um prompt da sua biblioteca
3. **Edição:** uma pessoa adiciona detalhes específicos, histórias e opiniões e remove o enchimento genérico
4. **Checagem:** verifique cada afirmação, número e nome
5. **Aprovação e agendamento**

A qualidade mora na etapa de edição. Procure o que torna um conteúdo esquecível: afirmações vagas, frases vazias e a mesma estrutura de frase repetida o tempo todo. Troque por detalhes que só o seu negócio poderia dizer.

## Trabalhe em lotes

Crie conteúdo em blocos concentrados —por exemplo, uma tarde para os posts da semana inteira— em vez de um pouco por dia. A IA deixa o trabalho em lotes muito mais rápido: rascunhe 10 posts em uma sessão, edite na seguinte e agende todos de uma vez.

> Seus concorrentes têm as mesmas ferramentas de IA que você. Sua vantagem é sua experiência, as histórias dos seus clientes e o seu ponto de vista. Coloque isso em cada peça.
`,
      },
      {
        slug: 'search-in-the-ai-era',
        title: 'SEO e busca na era da IA',
        minutes: 60,
        tryIt: "Pergunte a um assistente de IA com busca na web: \"Quais são os melhores negócios de [seu serviço] em [sua cidade]?\" Veja se você aparece e anote quais sites ele usa como fonte.",
        body: `
A busca está mudando. O Google agora mostra resumos gerados por IA no topo de muitos resultados, e cada vez mais pessoas perguntam diretamente aos assistentes de IA. Os fundamentos para ser encontrado continuam valendo; eles só importam mais.

## O que os buscadores valorizam

A orientação do Google é clara: ele valoriza **conteúdo útil, confiável e feito para as pessoas**, não importa como foi produzido. Ele penaliza conteúdo feito principalmente para manipular o ranqueamento, incluindo grandes quantidades de páginas rasas e produzidas em massa. Suas diretrizes de qualidade destacam o **E-E-A-T**:

- **Experiência:** vivência em primeira mão com o assunto (projetos reais, fotos reais)
- **Especialização:** conhecimento demonstrado com profundidade e precisão
- **Autoridade:** reconhecimento de terceiros (avaliações, links, menções)
- **Confiabilidade:** informações precisas, dados claros da empresa, afirmações honestas

## O que isso significa para o conteúdo com IA

- Não publique centenas de páginas de IA quase idênticas ("encanador em [cada cidade]"). Esse é exatamente o padrão que os buscadores trabalham para rebaixar.
- Use a IA para pesquisa, roteiros, primeiros rascunhos, perguntas frequentes e estrutura das páginas; depois acrescente experiência e conhecimento reais.
- Mantenha os dados da sua empresa consistentes em todos os lugares: nome, endereço, telefone, horário e seu Perfil da Empresa no Google.

## Como aparecer nas respostas da IA

Assistentes de IA e resumos de IA buscam informações em fontes que consideram confiáveis. Para aumentar suas chances:

1. Responda a perguntas específicas de forma clara e direta nas suas páginas
2. Use títulos descritivos e uma estrutura simples
3. Conquiste avaliações e menções em sites respeitados do seu setor e da sua região
4. Mantenha as páginas importantes atualizadas

> O objetivo não é enganar um algoritmo. É ser a resposta mais útil e confiável para as perguntas dos seus clientes; isso funciona tanto para buscadores quanto para assistentes de IA.
`,
      },
    ],
    exercise: {
      title: 'Exercício: um pilar, dez peças',
      body: `
1. Defina de três a cinco pilares de conteúdo para o seu negócio (ou um negócio de exemplo)
2. Escolha um tema de pilar e faça o roteiro de uma peça pilar a partir de uma pergunta real de cliente
3. Usando seu guia de voz da marca e sua biblioteca de prompts, transforme-a em pelo menos dez peças menores para duas ou mais plataformas
4. Edite cada peça à mão: acrescente a cada uma um detalhe, uma história ou uma opinião específica
5. Verifique tudo e anote o que você mudou em relação ao rascunho da IA
`,
    },
    checklist: [
      "Anote o objetivo de conteúdo do negócio e o cliente ideal",
      "Escolha de três a cinco pilares de conteúdo",
      "Escreva uma peça pilar que responda a uma pergunta real de cliente",
      "Transforme em pelo menos dez peças menores para duas plataformas",
      "Acrescente a cada peça um detalhe, história ou opinião real, e confira os fatos",
      "Monte um calendário de 30 dias e produza em lote a primeira semana",
    ],
  },
  {
    number: '05',
    summary:
      'Foque nos números que orientam decisões, use a IA para analisar dados mais rápido sem confiar cegamente e rode um ciclo simples de teste e aprendizado.',
    lessons: [
      {
        slug: 'metrics-that-matter',
        title: 'As métricas que realmente importam',
        minutes: 40,
        tryIt: "Pergunte a um assistente de IA: \"Tenho um [tipo de negócio]. Quais três números devo acompanhar toda semana, e por quê?\" Compare a lista com o que você olha hoje.",
        body: `
Os painéis de marketing estão cheios de números. A maioria não muda nenhuma decisão. Comece pelos poucos que se ligam diretamente à receita.

## Métricas de vaidade vs. métricas de decisão

- **Métricas de vaidade** parecem boas, mas não dizem o que fazer: número de seguidores, impressões, curtidas.
- **Métricas de decisão** se ligam a resultados de negócio e mostram onde agir: leads, custo por lead, taxa de conversão, receita por cliente.

Métricas de vaidade não são inúteis —o alcance importa para a descoberta—, mas nunca deveriam ser a manchete de um relatório.

## As métricas principais

- **Leads:** quantos clientes em potencial levantaram a mão (formulário, ligação, agendamento)
- **Custo por lead (CPL):** investimento em anúncios ÷ número de leads
- **Taxa de conversão:** a porcentagem que dá o próximo passo. *Se 200 pessoas visitam uma página e 10 agendam uma ligação, a taxa de conversão é 10 ÷ 200 = 5%.*
- **Custo de aquisição de clientes (CAC):** custo total de vendas e marketing ÷ novos clientes conquistados
- **Valor do tempo de vida do cliente (LTV):** a receita total média que um cliente gera ao longo de todo o relacionamento
- **Retorno sobre o investimento em anúncios (ROAS):** receita dos anúncios ÷ investimento em anúncios

Um negócio saudável ganha muito mais com um cliente ao longo do tempo (LTV) do que gasta para conquistá-lo (CAC).

## Escolha uma Estrela do Norte

Escolha a métrica que melhor representa o sucesso para o seu objetivo atual; em uma empresa de serviços, muitas vezes são os **agendamentos** ou os **novos clientes por mês**. Todas as outras métricas do relatório devem ajudar a explicar por que a Estrela do Norte subiu ou caiu.

> Se um número não mudaria o que você faz na semana que vem, ele não deveria estar no topo do seu relatório.
`,
      },
      {
        slug: 'analyzing-data-with-ai',
        title: 'Analisando dados com IA',
        minutes: 45,
        tryIt: "Exporte os números do mês passado de qualquer ferramenta (ou digite dez linhas à mão), tire nomes e contatos, cole e pergunte: \"Que padrão eu posso estar deixando passar?\" Depois confira você mesmo nos dados.",
        body: `
Assistentes de IA conseguem ler uma planilha exportada e responder a perguntas sobre ela em linguagem simples. Isso transforma horas de planilha em minutos, se você usar com cuidado.

## O que a IA faz bem com dados

- Resumir uma exportação de campanha: *"Quais três anúncios tiveram o menor custo por lead no mês passado e o que eles têm em comum?"*
- Identificar tendências: *"Como a taxa de conversão mudou semana a semana?"*
- Agrupar respostas abertas: *"Agrupe estas 300 respostas de pesquisa por tema e conte cada tema."*
- Sugerir gráficos e explicar o que eles mostram
- Rascunhar o resumo escrito de um relatório

## Como obter respostas confiáveis

1. **Limpe os dados antes.** Nomes de colunas claros, uma linha por registro, sem células mescladas.
2. **Remova informações pessoais.** Apague nomes, e-mails e telefones antes de enviar o arquivo.
3. **Explique o que as colunas significam**, por exemplo: *"'Investimento' está em dólares; 'Resultados' significa leads."*
4. **Peça para mostrar o raciocínio:** *"Explique como você calculou isso."*
5. **Confira os números.** Recalcule você mesmo um ou dois números importantes antes de compartilhar.

## O grande risco: erros cheios de confiança

A IA pode ler errado uma coluna, confundir totais com médias ou inventar um número que não está nos dados. Quanto mais importante a decisão, com mais cuidado você deve conferir. Trate a análise da IA como a primeira leitura de um analista, não como a resposta final.

## Correlação não é causalidade

Se as vendas subiram na semana em que você postou mais vídeos, os vídeos *podem* ser o motivo, ou pode ter sido um feriado, uma promoção ou o clima. A IA vai sugerir explicações com prazer; cabe a você testá-las. Esse é o tema da próxima aula.

> Use a IA para encontrar a pergunta que vale a pena fazer. Confira por conta própria antes de apostar dinheiro na resposta.
`,
      },
      {
        slug: 'reporting-and-testing',
        title: 'Relatórios e o ciclo de teste e aprendizado',
        minutes: 35,
        tryIt: "Peça a um assistente de IA: \"Me ajude a planejar um teste para este mês: o que vou mudar, o que vou medir e como vou saber se funcionou.\" Coloque o teste na sua agenda.",
        body: `
Um relatório só é útil se levar a uma decisão. As melhores equipes de marketing rodam um ciclo simples toda semana.

## Um relatório semanal de uma página

1. **Estrela do Norte:** esta semana vs. semana passada vs. meta
2. **O que aconteceu:** as duas ou três maiores mudanças e seus motivos prováveis
3. **O que aprendemos:** resultados dos testes que terminaram
4. **O que faremos a seguir:** as ações específicas para a próxima semana

A IA pode rascunhar em segundos a seção "o que aconteceu" a partir dos seus dados exportados; você revisa e acrescenta o contexto que só você conhece.

## O ciclo de teste e aprendizado

1. **Hipótese:** *"Se adicionarmos fotos de clientes aos nossos anúncios, o custo por lead vai cair, porque as pessoas confiam em resultados reais."*
2. **Teste:** mude uma coisa de cada vez. Compare a nova versão com a atual (um teste A/B).
3. **Medição:** espere ter dados suficientes. Alguns cliques não são um resultado; deixe o teste rodar até ver uma diferença consistente.
4. **Aprendizado:** fique com a vencedora, registre o que aprendeu e planeje o próximo teste.

## Use a IA para acelerar cada etapa

- Gere hipóteses a partir dos seus dados e do feedback dos clientes
- Crie as variações do teste (títulos, imagens, ofertas)
- Resuma os resultados e rascunhe as anotações de "o que aprendemos"

Mantenha um registro simples de testes: data, hipótese, o que mudou, resultado e decisão. Com os meses, ele vira um dos seus ativos de marketing mais valiosos: um histórico do que funciona para os *seus* clientes.

> Melhorias pequenas e constantes se somam. Uma equipe que roda um bom teste por semana vai superar uma equipe que espera a grande ideia perfeita.
`,
      },
    ],
    exercise: {
      title: 'Exercício: seu plano de medição',
      body: `
1. Escolha uma métrica Estrela do Norte para o seu negócio (ou um negócio de exemplo) e explique por quê
2. Liste de três a cinco métricas de decisão de apoio e de onde cada uma vem
3. Pegue uma exportação de campanha real ou de exemplo, remova os dados pessoais e use a IA para responder a três perguntas sobre ela; depois confira uma resposta à mão
4. Escreva uma hipótese testável usando o formato da Aula 3
5. Rascunhe um modelo de relatório semanal de uma página
`,
    },
    checklist: [
      "Escolha uma métrica Estrela do Norte e anote o porquê",
      "Escolha de três a cinco métricas de apoio e de onde vem cada uma",
      "Faça três perguntas à IA sobre uma exportação real e confira uma resposta à mão",
      "Escreva uma hipótese de teste que mude uma coisa só",
      "Monte um relatório semanal de uma página e um horário fixo para preencher",
    ],
  },
  {
    number: '06',
    summary:
      'Junte tudo em um sistema completo de marketing com IA para um negócio real ou de exemplo passe na avaliação final e tenha seu projeto final aprovado para conquistar seu certificado.',
    lessons: [
      {
        slug: 'capstone-brief',
        title: 'O briefing do projeto final',
        minutes: 120,
        tryIt: "Cole o briefing do projeto final em um assistente de IA e peça para transformá-lo em uma lista de tarefas com datas nas próximas duas semanas. Deixe a lista onde você a veja todo dia.",
        body: `
Seu projeto final é um **Sistema de Marketing com IA** completo e prático para um negócio: o seu, o de um cliente ou um negócio de exemplo que você escolher. Ele reúne o trabalho que você fez em cada módulo.

## O que seu sistema precisa incluir

1. **Retrato do negócio:** o que ele vende, quem é o cliente ideal e o principal objetivo de marketing para os próximos 90 dias
2. **Auditoria de oportunidades de IA:** as dez tarefas que você analisou no Módulo 01 e as duas que priorizou, com o tempo que espera economizar
3. **Fluxo de automação:** um fluxo do Módulo 02, com gatilho, ações, etapas de IA, pontos de aprovação e plano para falhas (construído ou totalmente desenhado no papel)
4. **Guia de voz da marca e biblioteca de prompts:** do Módulo 03, com pelo menos cinco prompts testados
5. **Plano de conteúdo:** pilares, uma peça pilar e suas peças reaproveitadas do Módulo 04, e um calendário de 30 dias
6. **Plano de medição:** Estrela do Norte, métricas de apoio, modelo de relatório semanal e suas duas primeiras hipóteses de teste do Módulo 05
7. **Checklist de uso responsável:** como este sistema protege os dados dos clientes, mantém uma pessoa no processo e evita conteúdo enganoso

## Orientações

- **Seja específico.** "Postar mais no Instagram" não é um plano. "Publicar toda semana quatro posts de Educação e um vídeo de Prova, rascunhados com o prompt nº 3 e editados pela Maria" é.
- **Seja realista.** Desenhe algo que possa de fato funcionar com o tempo, o orçamento e as ferramentas do negócio.
- **Mostre seu trabalho.** Inclua prompts reais, resultados reais da IA e o que você mudou neles.

## Formato

Coloque tudo em um único documento ou apresentação que possa ser entregue ao dono do negócio e colocado em prática no dia seguinte. Guarde uma cópia: é a peça de portfólio que mostra do que você é capaz.

## Como enviar

Salve como Google Docs, apresentação do Google Slides ou PDF, deixe o compartilhamento como "qualquer pessoa com o link pode ver" e envie o link pelo seu painel. Uma pessoa da nossa equipe revisa cada projeto final. Se faltar algo, devolvemos com feedback, e você pode reenviar quantas vezes precisar.
`,
      },
      {
        slug: 'capstone-review',
        title: 'Revisando seu sistema',
        minutes: 60,
        tryIt: "Cole uma parte do seu projeto final em um assistente de IA e peça: \"Revise isto como um dono de negócio desconfiado. O que não está claro e o que me faria confiar mais?\"",
        body: `
Antes de fazer a avaliação final, revise seu projeto com este checklist. Um sistema que cumpre todos os pontos é um sistema que um negócio real poderia colocar para funcionar.

## Estratégia

- O objetivo de 90 dias é específico e mensurável
- O cliente ideal está descrito com clareza suficiente para orientar o conteúdo e os anúncios
- Cada parte do sistema se conecta ao objetivo

## Fluxo

- O fluxo pode ser explicado em uma frase
- As etapas de IA têm um formato de resposta fixo e um plano B
- As etapas que o cliente vê têm aprovação humana
- Há um responsável claro e um jeito de saber quando algo falha

## Conteúdo

- Os pilares conectam as necessidades do cliente ao que o negócio vende
- A peça pilar contém experiência ou conhecimento real, não só conteúdo de IA
- Cada peça foi editada e checada

## Medição

- Há uma única métrica Estrela do Norte
- O relatório semanal leva a decisões, não só a números
- As hipóteses mudam uma coisa de cada vez

## Responsabilidade

- Nenhum dado pessoal de clientes entra em ferramentas que não estejam aprovadas para isso
- Nada de avaliações, depoimentos ou imagens falsas ou enganosas
- Os clientes sempre conseguem falar com uma pessoa

## Pronto para a avaliação final?

A avaliação final tem 10 perguntas que cobrem os seis módulos. Você precisa de **80% (8 de 10)** para passar. Se não passar, você verá sua nota, mas não quais respostas errou, e poderá tentar de novo depois de uma hora. Use esse tempo para revisar as aulas.

> Seu Certificado de Marketing com IA da N°1 Academy é emitido quando você passa na avaliação final **e** seu projeto final é aprovado. Você pode fazer os dois em qualquer ordem.
`,
      },
      {
        slug: 'next-steps',
        title: 'Mantendo suas habilidades atualizadas',
        minutes: 20,
        tryIt: "Pergunte a um assistente de IA com busca na web: \"O que mudou nas ferramentas de IA para pequenos negócios nos últimos três meses?\" Abra duas das fontes e guarde uma ideia que valha a pena testar.",
        body: `
As ferramentas de IA mudam a cada poucos meses. As habilidades deste curso —pensar em funis e fluxos, escrever instruções claras, proteger sua marca e medir resultados— não.

## Continue afiado

- **Faça um experimento por mês.** Teste uma ferramenta ou técnica nova em uma tarefa real e registre o resultado no seu registro de testes.
- **Mantenha sua biblioteca de prompts viva.** Atualize os prompts quando as ferramentas mudarem e apague os que ninguém usa.
- **Acompanhe as regras.** As políticas de publicidade, privacidade e plataformas sobre IA continuam mudando; confira, principalmente em setores regulados.
- **Ensine outra pessoa.** Explicar seu fluxo para um colega é o jeito mais rápido de encontrar as falhas dele.

## Coloque em prática

O jeito mais rápido de provar o que você aprendeu são os resultados. Coloque seu sistema do projeto final para funcionar, meça por 30 dias e escreva o que aconteceu: os números, o que você mudou e o que aprendeu. Esse relato vale mais para um cliente ou empregador do que qualquer lista de ferramentas.
`,
      },
    ],
    exercise: {
      title: 'Projeto final: seu sistema de marketing com IA',
      body: `
Conclua as sete partes do projeto final descritas na Aula 1, revise com o checklist da Aula 2 envie pelo seu painel e depois faça a avaliação final abaixo.
`,
    },
    checklist: [
      "Escolha o negócio do seu projeto final",
      "Coloque as sete partes do projeto final em um só documento",
      "Revise com cada ponto da checklist da Aula 2",
      "Entregue ao dono (ou a um amigo) e pergunte o que não ficou claro",
      "Rode o sistema por 30 dias e anote o que aconteceu",
    ],
  },
  {
    number: '07',
    summary:
      'Faça um negócio local aparecer no Google Maps e nas buscas locais: como funciona o ranking local, como configurar direito um Perfil da Empresa no Google e como manter os dados do negócio iguais em toda a internet.',
    lessons: [
      {
        slug: 'how-local-search-works',
        title: 'Como funciona a busca local',
        minutes: 30,
        tryIt: "Pesquise no Google \"[seu serviço] perto de mim\" pelo celular. Anote os três negócios que aparecem no mapa e pergunte a um assistente de IA o que eles parecem fazer de diferente de você.",
        body: `
Quando alguém pesquisa "café perto de mim" ou "barbearia em South Boston", o Google mostra um mapa com três negócios embaixo. Essa caixa se chama [[local pack|local-pack]] (o pacote local) e, para a maioria dos pequenos negócios, ela importa mais do que qualquer anúncio. Quem pesquisa assim geralmente quer comprar hoje.

Os negócios do pacote local vêm do [[Perfil da Empresa no Google|gbp]]: a ficha gratuita que mostra o nome, o horário, as fotos, as avaliações e um botão para ligar ou traçar a rota.

## As três coisas que o Google olha

O Google diz que os resultados locais dependem de três coisas:

- **Relevância:** o quanto o perfil corresponde ao que a pessoa pesquisou. Aqui importam as categorias, os serviços e a descrição certos.
- **Distância:** a distância entre o negócio e quem pesquisa, ou o lugar citado na busca. Isso não dá para mudar.
- **Destaque:** o quanto o negócio é conhecido e confiável. Contam as avaliações, a nota, os links, as menções na internet e um perfil completo e ativo.

Não dá para aproximar uma loja dos clientes, então todo o trabalho está na relevância e no destaque.

## Por que é a primeira coisa a arrumar

- É grátis. Um Perfil da Empresa no Google não custa nada.
- É onde estão os compradores. Buscas locais costumam virar uma ligação, uma visita ou uma rota no mesmo dia.
- A maioria dos pequenos negócios deixa o perfil pela metade: horário errado, nenhuma foto desde a inauguração, uma categoria vaga, avaliações sem resposta. Só arrumar isso já faz muitos negócios subirem.

## Como é um perfil "bom"

- A **categoria principal** certa (a configuração de relevância mais importante)
- Nome, endereço, telefone e horário corretos, incluindo feriados
- Uma descrição clara do que o negócio faz, para quem e onde
- Fotos reais do lugar, da equipe e do trabalho, adicionadas com frequência
- Serviços ou produtos com descrições curtas
- Avaliações recentes, cada uma com resposta do dono
- Postagens nos últimos um ou dois meses

> O nome do perfil tem que ser o nome real do negócio. Colocar palavras-chave no nome ("Pizzaria do Tony Melhor Pizza de Boston") vai contra as regras do Google e pode fazer o perfil ser suspenso.
`,
      },
      {
        slug: 'optimizing-the-profile',
        title: 'Como configurar e otimizar um Perfil da Empresa no Google',
        minutes: 50,
        tryIt: "Cole a descrição do seu Perfil da Empresa no Google em um assistente de IA e peça: \"Reescreva em menos de 750 caracteres com meu serviço principal e minha cidade na primeira frase. Sem exageros.\"",
        body: `
Primeiro pesquise o nome do negócio no Google Maps. Muitos negócios já têm um perfil que o Google criou automaticamente. Se ele existir, escolha **Reivindicar esta empresa** em vez de criar um novo. Perfis duplicados confundem o Google e os clientes.

## Passo 1: Verificar

O Google precisa confirmar que o negócio é real antes de publicar a maioria das alterações. Dependendo do negócio, a verificação pode ser um vídeo do local, uma ligação, uma mensagem de texto, um e-mail ou um cartão postal. Siga as opções que o Google oferece no perfil. Enquanto ele não estiver verificado, trabalhe no resto, mas não espere que ele apareça bem.

## Passo 2: O básico, exato

- **Nome:** o que está na fachada, sem acrescentar nada.
- **Categoria principal:** a mais específica que se encaixe ("Barbearia", não "Beleza"). Adicione algumas **categorias secundárias** para os outros serviços principais.
- **Endereço ou área de atendimento:** uma loja que recebe clientes mostra o endereço. Um negócio que vai até o cliente (encanador, lavagem de carro a domicílio) define uma área de atendimento e pode esconder o endereço.
- **Telefone e site:** um número local que o negócio atenda. O link deve levar para a página mais relevante.
- **Horário:** o horário normal e horários especiais para feriados. Horário errado é um dos jeitos mais rápidos de ganhar uma avaliação de uma estrela.

Anote esses dados em um só lugar. Na Aula 3 você vai usar exatamente o mesmo [[NAP|nap]] (nome, endereço, telefone) em todos os lugares.

## Passo 3: Preencher todo o resto

- **Descrição (até 750 caracteres):** o que o negócio faz, para quem, o que o torna diferente e a região que atende. Escreva para pessoas, não para o Google.
- **Serviços ou produtos:** cada um com uma descrição curta e simples, e preço se o negócio quiser mostrar.
- **Atributos:** acessibilidade para cadeira de rodas, área externa, empresa de mulheres etc., quando se aplicarem.
- **Fotos:** fachada (para reconhecerem o lugar ao chegar), interior, equipe, produtos e trabalhos prontos. Fotos reais sempre ganham de fotos de banco de imagens.

## Passo 4: Manter ativo

- **Postagens:** uma novidade, oferta ou evento curto, com foto e botão. Uma por semana é um bom ritmo; uma por mês é o mínimo.
- **Fotos novas** todo mês.
- **Responder todas as avaliações** (o Módulo 08 explica como).
- **Olhar a aba Desempenho todo mês:** ligações, pedidos de rota, cliques no site e as buscas que encontraram o perfil.

## Onde a IA ajuda

- Escrever a descrição a partir das anotações do dono e depois editar para soar como ele
- Transformar a novidade da semana em uma postagem, uma legenda para o Instagram e uma mensagem para os clientes fiéis
- Fazer um brainstorm da lista de serviços a partir do cardápio ou da tabela de preços
- Resumir os números de Desempenho em uma nota mensal de duas linhas

Um prompt que funciona bem para postagens:

> "Você escreve postagens do Perfil da Empresa no Google para [negócio], um(a) [tipo de negócio] em [bairro]. Escreva uma postagem de 80 a 120 palavras sobre [a novidade ou oferta desta semana]. Use um tom simpático e simples, cite o bairro uma vez, termine com uma única ação clara (ligar, agendar ou visitar) e não use hashtags nem emojis."

Confira cada dado, preço e data antes de publicar. O Google pode remover postagens com telefone errado, links para sites sem relação ou ofertas enganosas.
`,
      },
      {
        slug: 'local-seo-beyond-google',
        title: 'SEO local além do perfil',
        minutes: 40,
        tryIt: "Pergunte a um assistente de IA: \"Liste os principais diretórios online para um [seu tipo de negócio] em [seu país].\" Confira em dois deles se seu nome, endereço e telefone estão certos.",
        body: `
O Perfil da Empresa no Google é a peça maior, mas o Google também olha o que o resto da internet diz sobre o negócio. É aqui que o [[SEO local|local-seo]] vai além do perfil.

## Os mesmos dados em todo lugar

Uma [[citação|citation]] é qualquer lugar on-line que mostra o nome, o endereço e o telefone do negócio: Yelp, Apple Maps, Bing, Facebook, a câmara de comércio, diretórios do setor. Quando esses dados batem, o Google confia neles. Quando não batem (um endereço antigo, outro telefone), ele fica em dúvida sobre qual está certo.

Comece pelas fichas que mais importam:

- **Apple Business Connect** (Apple Maps e Siri, que muitos usuários de iPhone usam para pesquisar)
- **Bing Places** (Bing e vários assistentes de IA que usam dados do Bing)
- **Yelp** e **Facebook**
- Os diretórios do setor: por exemplo TripAdvisor para restaurantes, Doctoralia para clínicas ou Houzz para empreiteiros

Use exatamente o mesmo nome, endereço e telefone da Aula 2. Uma planilha com uma linha por ficha, o link e o login deixa tudo sob controle.

## O site apoia o perfil

- O site mostra o mesmo nome, endereço, telefone e horário, normalmente no rodapé.
- Um negócio que atende várias cidades tem uma página de verdade para cada serviço ou região principal, com informação útil, e não o mesmo texto trocando só o nome da cidade.
- O título da página inicial diz o que é o negócio e onde: "Brancato Barbershop | Cortes e barba em South Boston".
- Adicionar [[marcação de schema|schema]] (um pequeno código que identifica os dados do negócio para os buscadores) ajuda o Google a lê-los corretamente. A maioria dos criadores de sites tem uma configuração ou plugin para isso.
- O site carrega rápido e funciona bem no celular, onde acontece a maioria das buscas locais.

## Aparecer também nas respostas de IA

Cada vez mais pessoas pedem recomendações ao ChatGPT, ao Gemini ou aos resultados de IA do Google. Essas respostas usam os mesmos sinais: um perfil completo, fichas consistentes, muitas avaliações recentes e um site claro. O trabalho deste módulo também ajuda aí.

## Medir

Uma vez por mês, anote:

- Ligações, pedidos de rota e cliques no site da aba Desempenho
- O número de avaliações e a nota média
- Onde o negócio aparece nas duas ou três buscas mais importantes (pesquise do bairro pelo celular, ou peça para alguém da região conferir)

> SEO local é um trabalho lento e constante. Espere mudanças em semanas e meses, não em dias. Quem promete o primeiro lugar no Maps para a semana que vem está chutando ou trapaceando.
`,
      },
    ],
    exercise: {
      title: 'Exercício: auditoria de visibilidade local e lista de correções',
      body: `
Escolha um negócio local: o seu, o de um cliente ou um perto de você. Com o que você aprendeu:

1. Pesquise o negócio no Google Maps pelo celular e tire um print do que o cliente vê
2. Dê uma nota ao perfil usando a lista de "perfil bom" da Aula 1, um ponto por item
3. Escreva em um só lugar o nome, endereço, telefone, horário e categoria principal corretos
4. Confira Apple Maps, Bing, Yelp e Facebook e anote cada dado que não bate
5. Use a IA para escrever uma nova descrição e duas postagens, e edite até soarem como o dono
6. Transforme tudo em uma lista de correções, em ordem do que vai fazer mais diferença primeiro

É a mesma auditoria que a Number 1 Digital Marketing faz para os clientes. Bem feita, é algo pelo qual o dono de um negócio pagaria.
`,
    },
    checklist: [
      'Encontre o negócio no Google Maps e reivindique ou verifique o perfil',
      'Escolha a categoria principal mais específica e duas ou três secundárias',
      'Deixe exatos o nome, o endereço, o telefone e o horário, incluindo feriados',
      'Escreva com IA uma descrição de 750 caracteres e edite com a voz do dono',
      'Adicione serviços ou produtos com descrições curtas',
      'Suba pelo menos 10 fotos reais: fachada, interior, equipe e trabalhos',
      'Publique uma primeira postagem e agende uma postagem por semana',
      'Deixe os dados iguais no Apple Business Connect, Bing Places, Yelp e Facebook',
      'Confira se o site mostra o mesmo nome, endereço, telefone e horário',
      'Anote as ligações, rotas e cliques no site deste mês como ponto de partida',
    ],
  },
  {
    number: '08',
    summary:
      'Crie um fluxo constante de avaliações honestas e responda bem a cada uma, usando a IA para escrever respostas e encontrar padrões sem quebrar as regras.',
    lessons: [
      {
        slug: 'why-reviews-matter',
        title: 'Por que as avaliações geram vendas locais',
        minutes: 30,
        tryIt: "Copie cinco avaliações recentes (suas ou de um concorrente) em um assistente de IA e pergunte: \"O que os clientes satisfeitos mais mencionam? E os insatisfeitos?\"",
        body: `
As avaliações fazem dois trabalhos ao mesmo tempo. Ajudam o negócio a se posicionar no [[local pack|local-pack]], porque fazem parte de como o Google mede o destaque. E convencem quem lê a ligar, agendar ou entrar.

## O que os clientes olham

- **Nota:** a maioria descarta negócios com menos de umas quatro estrelas.
- **Quantidade:** 150 avaliações passam mais segurança que 12, mesmo com a mesma nota.
- **Se são recentes:** um perfil cuja última avaliação é do ano passado parece fechado ou abandonado.
- **O que dizem:** as pessoas leem o texto, principalmente das avaliações ruins, para ver o que deu errado.
- **As respostas do dono:** uma resposta calma e útil a uma avaliação ruim muitas vezes gera mais confiança do que uma nota perfeita.

## As regras (não são opcionais)

- **Nada de avaliações falsas.** Não escreva avaliações para o negócio, não pague ninguém para isso e não peça a funcionários ou parentes que publiquem. Nos EUA, a regra da FTC sobre avaliações falsas permite multas altas por comprar, vender ou escrever avaliações falsas, e o Google as remove e pode restringir o perfil.
- **Nada de [[filtrar avaliações|review-gating]].** Não peça avaliação só para os clientes satisfeitos, nem mande os insatisfeitos primeiro para outro lugar. As regras do Google dizem para pedir a todos os clientes do mesmo jeito.
- **Nada de prêmios por avaliações no Google.** Descontos, brindes ou sorteios em troca de uma avaliação vão contra as regras do Google.
- **Nunca avaliações escritas por IA.** A IA pode ajudar o negócio a *responder*, nunca a escrever a avaliação.
- **Proteja a privacidade.** Nunca confirme em uma resposta que alguém foi cliente nem compartilhe dados da pessoa. Isso importa ainda mais em negócios de saúde, jurídicos ou financeiros.

> Um fluxo constante de avaliações honestas ganha de qualquer truque. Todo atalho aqui vai contra as regras, contra a lei, ou os dois.
`,
      },
      {
        slug: 'getting-more-reviews',
        title: 'Como conseguir mais avaliações',
        minutes: 40,
        tryIt: "Peça a um assistente de IA: \"Escreva uma mensagem simpática de duas frases pedindo a um cliente uma avaliação no Google. Sem incentivos, sem pressão.\" Edite e salve no celular.",
        body: `
A maioria dos clientes satisfeitos nunca deixa uma avaliação porque ninguém pediu, ou porque dava trabalho demais. A solução é pedir para todo cliente, na hora certa, com um link de um toque só.

## Pegue o link de avaliação

No Perfil da Empresa no Google, escolha **Pedir avaliações** (ou **Receber mais avaliações**) para copiar um link curto que abre direto a caixa de avaliação. Guarde onde toda a equipe consiga acessar.

## Peça na hora certa

A melhor hora é logo depois que o cliente recebeu o que veio buscar:

- Barbearia ou salão: no pagamento, enquanto o cliente se olha no espelho
- Restaurante ou café: no recibo, ou com um cartão junto com a conta
- Prestador de serviço ou limpeza: no dia em que o trabalho termina, com fotos de antes e depois
- Pedido on-line: alguns dias depois da entrega

## Facilite

- **Fale pessoalmente:** "Se você gostou hoje, uma avaliação no Google ajuda muito um negócio pequeno como o nosso. Aqui está o link."
- **Um QR code ou um cartão [[NFC|nfc]] no balcão:** um toque ou uma leitura abre a caixa de avaliação. (Os Tap Cards da Number 1 fazem exatamente isso.)
- **Uma mensagem de texto ou e-mail de acompanhamento** no mesmo dia, com o link. Mensagens de texto são lidas muito mais do que e-mails.
- **Um lembrete** alguns dias depois se a pessoa não avaliou, e depois mais nada. Um lembrete ajuda; mais que isso incomoda.

## Use IA e automação com cuidado

- Escreva as mensagens de pedido com IA na voz do negócio e peça ao dono para aprovar uma vez.
- Se o negócio tem um sistema de agendamento ou de ponto de venda, uma automação pode enviar o pedido depois de cada visita (aqui vale o que você aprendeu no Módulo 02). Envie para **todos** os clientes, não só para os que você acha que ficaram satisfeitos.
- Faça uma contagem simples toda semana: pedidos enviados e avaliações recebidas. Se os pedidos saem e as avaliações não chegam, mude o texto ou o momento.

Uma mensagem de pedido que funciona:

> "Oi [nome], obrigado por vir hoje ao [negócio]! Se tiver um minutinho, uma avaliação rápida no Google ajudaria muito a gente: [link]. Obrigado! [nome do dono]"

Curta, pessoal e assinada por uma pessoa de verdade.
`,
      },
      {
        slug: 'responding-with-ai',
        title: 'Como responder avaliações com IA',
        minutes: 45,
        tryIt: "Cole uma avaliação real em um assistente de IA e peça: \"Escreva uma resposta curta e calorosa do dono. Não prometa nada que eu não tenha dito.\" Edite antes de publicar.",
        body: `
Toda avaliação merece resposta: mostra aos futuros clientes que alguém se importa, e o próprio Google recomenda responder. Tente responder em um ou dois dias.

## Responder às avaliações boas

Curto e específico. Agradeça pelo nome, cite um detalhe da avaliação e convide a pessoa a voltar. Evite colar o mesmo "Obrigado pela avaliação!" em todas. As pessoas percebem.

## Responder às avaliações ruins

Use uma estrutura simples de quatro passos:

1. **Agradeça** por ter tirado um tempo para escrever.
2. **Reconheça** o problema sem discutir nem dar desculpas.
3. **Leve para o privado:** dê um nome e um jeito direto de falar com o dono ou o gerente.
4. **Diga o que vai mudar,** se algo for mudar.

Nunca discuta, nunca compartilhe detalhes da visita e nunca responda com raiva. Os futuros clientes leem a resposta mais do que a própria pessoa que avaliou.

## A IA escreve, você decide

A IA é ótima para um primeiro rascunho calmo, principalmente quando o dono está chateado. Um prompt que funciona:

> "Você responde avaliações do Google para [negócio], um(a) [tipo de negócio] em [bairro]. Nosso tom é [acolhedor, direto, um pouco divertido]. Escreva uma resposta de 40 a 80 palavras para a avaliação abaixo. Agradeça pelo nome, cite um detalhe específico da avaliação e não use ponto de exclamação mais de uma vez. Se a avaliação for negativa, peça desculpas pela experiência, não discuta, não cite detalhes da visita e convide a pessoa a falar com [nome do dono] pelo [telefone ou e-mail]. Avaliação: [cole a avaliação]"

Depois leia antes de publicar. Confira se soa como o dono, se não diz nada que não seja verdade e se não tem dados pessoais.

## Avaliações que quebram as regras

Se uma avaliação é spam, de alguém que nunca foi cliente, ofensiva ou claramente de um concorrente, denuncie pelo perfil (**Denunciar avaliação**) e explique o motivo. Não espere que toda denúncia funcione, e nunca peça para amigos encherem o perfil de avaliações para escondê-la.

## Encontre padrões nas avaliações

A cada poucos meses, copie as últimas 50 avaliações (sem nomes) em uma ferramenta de IA e peça:

> "Agrupe estas avaliações nos cinco temas mais comuns, positivos e negativos. Para cada tema, diga quantas avaliações o citam e dê uma citação curta. Depois sugira uma mudança que o negócio poderia fazer com base nos temas negativos."

As respostas estão entre os melhores conselhos de marketing e de operação que um negócio pode receber, e são de graça. Use os temas positivos em anúncios e no site, com as palavras dos próprios clientes.
`,
      },
    ],
    exercise: {
      title: 'Exercício: monte um sistema de avaliações',
      body: `
Com o mesmo negócio do Módulo 07:

1. Copie o link curto de avaliação do Google
2. Escreva a frase para pedir pessoalmente, a mensagem de acompanhamento e o lembrete na voz do negócio (rascunho com IA, edição humana)
3. Decida quando cada um sai e quem envia
4. Escreva o prompt de respostas do negócio usando o exemplo da Aula 3, preenchido com o tom e os contatos dele
5. Use o prompt para responder às três avaliações mais recentes, incluindo uma negativa se houver
6. Rode o prompt de padrões com as avaliações recentes do negócio e anote os três temas principais

Confira seu sistema com as regras da Aula 1 antes de colocar qualquer coisa no ar.
`,
    },
    checklist: [
      'Copie o link curto de avaliação do Google e guarde onde toda a equipe acesse',
      'Escreva a frase para pedir pessoalmente, a mensagem de acompanhamento e um lembrete',
      'Coloque um QR code ou um cartão NFC de avaliação no balcão',
      'Crie um jeito de pedir avaliação a todos os clientes, não só aos satisfeitos',
      'Escreva o prompt de respostas do negócio com o tom e os contatos dele',
      'Responda a todas as avaliações dos últimos 90 dias',
      'Denuncie qualquer avaliação que claramente quebre as regras do Google',
      'Rode o prompt de padrões com as avaliações recentes e anote os três temas principais',
      'Comece uma contagem semanal de pedidos enviados e avaliações recebidas',
    ],
  },
];
