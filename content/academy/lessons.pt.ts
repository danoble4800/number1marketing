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
  },
  {
    number: '06',
    summary:
      'Junte tudo em um sistema completo de marketing com IA para um negócio real ou de exemplo e passe na avaliação final para conquistar seu certificado.',
    lessons: [
      {
        slug: 'capstone-brief',
        title: 'O briefing do projeto final',
        minutes: 120,
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
`,
      },
      {
        slug: 'capstone-review',
        title: 'Revisando seu sistema',
        minutes: 60,
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

A avaliação final tem 10 perguntas que cobrem os seis módulos. Você precisa de **80% (8 de 10)** para passar. Se não passar na primeira tentativa, pode refazer; revise as aulas das perguntas que errou.

> Passar na avaliação final conclui o curso e desbloqueia seu Certificado de Marketing com IA da N°1 Academy.
`,
      },
      {
        slug: 'next-steps',
        title: 'Mantendo suas habilidades atualizadas',
        minutes: 20,
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
Conclua as sete partes do projeto final descritas na Aula 1, revise com o checklist da Aula 2 e depois faça a avaliação final abaixo.
`,
    },
  },
];
