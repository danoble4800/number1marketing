// N°1 Academy toolkit: copy-and-paste templates and downloadable sheets for students.
// Every template exists in en, es and pt. [Brackets] are the parts students fill in.

import type { Locale } from './glossary';

type L = Record<Locale, string>;

export type Template = { id: string; module: string; title: L; note: L; body: L };
export type ToolkitSection = { id: string; title: L; intro: L; templates: Template[] };
export type Sheet = { id: string; title: L; note: L; columns: Record<Locale, string[]>; rows: number };

export const TOOLKIT: ToolkitSection[] = [
  {
    id: 'prompts',
    title: { en: 'Prompt library', es: 'Biblioteca de prompts', pt: 'Biblioteca de prompts' },
    intro: {
      en: 'Tested prompts for the jobs small businesses do every week. Fill in the brackets, and always read the result before using it.',
      es: 'Prompts probados para las tareas que los negocios pequeños hacen cada semana. Completa los corchetes y lee siempre el resultado antes de usarlo.',
      pt: 'Prompts testados para as tarefas que pequenos negócios fazem toda semana. Preencha os colchetes e sempre leia o resultado antes de usar.',
    },
    templates: [
      {
        id: 'voice-guide',
        module: '03',
        title: { en: 'Build a brand voice guide', es: 'Crear una guía de voz de marca', pt: 'Criar um guia de voz da marca' },
        note: { en: 'Paste in 3 to 5 things the owner has written: posts, emails, texts.', es: 'Pega de 3 a 5 textos que haya escrito el dueño: publicaciones, correos, mensajes.', pt: 'Cole de 3 a 5 textos escritos pelo dono: posts, e-mails, mensagens.' },
        body: {
          en: `You are a brand strategist. Below are examples of how [business], a [type of business] in [area], writes to its customers.

Write a one-page brand voice guide with:
1. Three words that describe the voice, each with one sentence on what it means in practice
2. Words and phrases we use, and words we never use
3. How formal we are, and whether we use emojis or exclamation marks
4. One example of a good sentence and one of a bad sentence for us

Examples:
[paste examples]`,
          es: `Eres un estratega de marca. Abajo hay ejemplos de cómo [negocio], un [tipo de negocio] en [zona], les escribe a sus clientes.

Escribe una guía de voz de marca de una página con:
1. Tres palabras que describan la voz, cada una con una frase sobre qué significa en la práctica
2. Palabras y frases que usamos, y palabras que nunca usamos
3. Qué tan formales somos, y si usamos emojis o signos de exclamación
4. Un ejemplo de una buena frase y uno de una mala frase para nosotros

Ejemplos:
[pega los ejemplos]`,
          pt: `Você é um estrategista de marca. Abaixo estão exemplos de como [negócio], um(a) [tipo de negócio] em [região], escreve para os clientes.

Escreva um guia de voz da marca de uma página com:
1. Três palavras que descrevem a voz, cada uma com uma frase sobre o que significa na prática
2. Palavras e expressões que usamos, e palavras que nunca usamos
3. O quanto somos formais, e se usamos emojis ou pontos de exclamação
4. Um exemplo de frase boa e um de frase ruim para nós

Exemplos:
[cole os exemplos]`,
        },
      },
      {
        id: 'gbp-description',
        module: '07',
        title: { en: 'Google Business Profile description', es: 'Descripción del Perfil de Empresa de Google', pt: 'Descrição do Perfil da Empresa no Google' },
        note: { en: 'Keep it under 750 characters. No links, no prices that change often.', es: 'Menos de 750 caracteres. Sin enlaces ni precios que cambien seguido.', pt: 'Menos de 750 caracteres. Sem links nem preços que mudam com frequência.' },
        body: {
          en: `Write a Google Business Profile description for [business], a [type of business] in [neighborhood, city].

What we do: [main services or products]
Who we serve: [ideal customers]
What makes us different: [2 or 3 real reasons]
Area we serve: [towns or neighborhoods]
Tone: [from our brand voice guide]

Rules: under 700 characters, plain language, mention the area naturally once or twice, no keyword lists, no links, no phone numbers, no claims I haven't given you.`,
          es: `Escribe la descripción del Perfil de Empresa de Google para [negocio], un [tipo de negocio] en [barrio, ciudad].

Qué hacemos: [servicios o productos principales]
A quién atendemos: [clientes ideales]
Qué nos hace diferentes: [2 o 3 razones reales]
Zona que atendemos: [ciudades o barrios]
Tono: [de nuestra guía de voz]

Reglas: menos de 700 caracteres, lenguaje sencillo, menciona la zona de forma natural una o dos veces, sin listas de palabras clave, sin enlaces, sin teléfonos y sin afirmaciones que yo no te haya dado.`,
          pt: `Escreva a descrição do Perfil da Empresa no Google para [negócio], um(a) [tipo de negócio] em [bairro, cidade].

O que fazemos: [principais serviços ou produtos]
Quem atendemos: [clientes ideais]
O que nos torna diferentes: [2 ou 3 motivos reais]
Região que atendemos: [cidades ou bairros]
Tom: [do nosso guia de voz]

Regras: menos de 700 caracteres, linguagem simples, cite a região de forma natural uma ou duas vezes, sem listas de palavras-chave, sem links, sem telefones e sem afirmações que eu não tenha passado.`,
        },
      },
      {
        id: 'gbp-post',
        module: '07',
        title: { en: 'Google Business Profile post', es: 'Publicación del Perfil de Empresa de Google', pt: 'Postagem do Perfil da Empresa no Google' },
        note: { en: 'Add a real photo and a button (Call, Book or Learn more) when you post it.', es: 'Agrega una foto real y un botón (Llamar, Reservar o Más información) al publicar.', pt: 'Adicione uma foto real e um botão (Ligar, Agendar ou Saiba mais) ao publicar.' },
        body: {
          en: `You write Google Business Profile posts for [business], a [type of business] in [neighborhood]. Write a post of 80 to 120 words about [this week's news or offer]. Use a friendly, plain tone, mention the neighborhood once, end with one clear action (call, book or visit), and don't use hashtags or emojis. If it's an offer, include the end date: [date].`,
          es: `Escribes publicaciones del Perfil de Empresa de Google para [negocio], un [tipo de negocio] en [barrio]. Escribe una publicación de 80 a 120 palabras sobre [la novedad u oferta de esta semana]. Usa un tono cercano y sencillo, menciona el barrio una vez, termina con una sola acción clara (llamar, reservar o visitar) y no uses hashtags ni emojis. Si es una oferta, incluye la fecha de fin: [fecha].`,
          pt: `Você escreve postagens do Perfil da Empresa no Google para [negócio], um(a) [tipo de negócio] em [bairro]. Escreva uma postagem de 80 a 120 palavras sobre [a novidade ou oferta desta semana]. Use um tom simpático e simples, cite o bairro uma vez, termine com uma única ação clara (ligar, agendar ou visitar) e não use hashtags nem emojis. Se for uma oferta, inclua a data de término: [data].`,
        },
      },
      {
        id: 'review-reply',
        module: '08',
        title: { en: 'Review reply', es: 'Respuesta a una reseña', pt: 'Resposta a uma avaliação' },
        note: { en: 'Never post it without reading it. Remove anything private or untrue.', es: 'Nunca la publiques sin leerla. Quita cualquier dato privado o falso.', pt: 'Nunca publique sem ler. Tire qualquer dado pessoal ou falso.' },
        body: {
          en: `You reply to Google reviews for [business], a [type of business] in [neighborhood]. Our tone is [warm, direct, a little funny]. Write a reply of 40 to 80 words to the review below. Thank them by first name, mention one specific detail from their review, and don't use exclamation marks more than once. If the review is negative, apologize for their experience, don't argue, don't mention any details about their visit, and invite them to contact [owner name] at [phone or email].

Review: [paste the review]`,
          es: `Respondes reseñas de Google para [negocio], un [tipo de negocio] en [barrio]. Nuestro tono es [cálido, directo, un poco divertido]. Escribe una respuesta de 40 a 80 palabras a la reseña de abajo. Agradece por su nombre, menciona un detalle específico de su reseña y no uses signos de exclamación más de una vez. Si la reseña es negativa, discúlpate por su experiencia, no discutas, no menciones detalles de su visita e invítalo a contactar a [nombre del dueño] al [teléfono o correo].

Reseña: [pega la reseña]`,
          pt: `Você responde avaliações do Google para [negócio], um(a) [tipo de negócio] em [bairro]. Nosso tom é [acolhedor, direto, um pouco divertido]. Escreva uma resposta de 40 a 80 palavras para a avaliação abaixo. Agradeça pelo nome, cite um detalhe específico da avaliação e não use ponto de exclamação mais de uma vez. Se a avaliação for negativa, peça desculpas pela experiência, não discuta, não cite detalhes da visita e convide a pessoa a falar com [nome do dono] pelo [telefone ou e-mail].

Avaliação: [cole a avaliação]`,
        },
      },
      {
        id: 'review-patterns',
        module: '08',
        title: { en: 'Find patterns in reviews', es: 'Encontrar patrones en las reseñas', pt: 'Encontrar padrões nas avaliações' },
        note: { en: 'Remove reviewers’ names before pasting.', es: 'Quita los nombres antes de pegarlas.', pt: 'Tire os nomes antes de colar.' },
        body: {
          en: `Group these reviews into the five most common themes, positive and negative. For each theme, give the number of reviews that mention it and one short quote. Then suggest one change the business could make based on the negative themes, and one line for our website based on the positive themes, in the customers' own words.

Reviews:
[paste the last 30 to 50 reviews, without names]`,
          es: `Agrupa estas reseñas en los cinco temas más comunes, positivos y negativos. Para cada tema, da el número de reseñas que lo mencionan y una cita corta. Luego sugiere un cambio que el negocio podría hacer según los temas negativos, y una frase para nuestro sitio web según los temas positivos, con las palabras de los propios clientes.

Reseñas:
[pega las últimas 30 a 50 reseñas, sin nombres]`,
          pt: `Agrupe estas avaliações nos cinco temas mais comuns, positivos e negativos. Para cada tema, diga quantas avaliações o citam e dê uma citação curta. Depois sugira uma mudança que o negócio poderia fazer com base nos temas negativos, e uma frase para o nosso site com base nos temas positivos, com as palavras dos próprios clientes.

Avaliações:
[cole as últimas 30 a 50 avaliações, sem nomes]`,
        },
      },
      {
        id: 'repurpose',
        module: '04',
        title: { en: 'One idea, five posts', es: 'Una idea, cinco publicaciones', pt: 'Uma ideia, cinco posts' },
        note: { en: 'Add one real detail or photo to every piece before posting.', es: 'Agrega un detalle o foto real a cada pieza antes de publicar.', pt: 'Acrescente um detalhe ou foto real a cada peça antes de postar.' },
        body: {
          en: `Using our brand voice guide below, turn this idea into:
1. A 30-second Reel or TikTok script with a hook in the first line
2. An Instagram caption (under 150 words) with one call to action
3. A Google Business Profile post (80 to 120 words)
4. A short text message to our regular customers (under 300 characters)
5. An email subject line and a 100-word email

Idea: [what happened, what's new, or a question customers ask]
Voice guide: [paste it]`,
          es: `Con nuestra guía de voz de abajo, convierte esta idea en:
1. Un guion para un Reel o TikTok de 30 segundos con un gancho en la primera frase
2. Un texto para Instagram (menos de 150 palabras) con un solo llamado a la acción
3. Una publicación del Perfil de Empresa de Google (80 a 120 palabras)
4. Un mensaje de texto corto para nuestros clientes frecuentes (menos de 300 caracteres)
5. Un asunto de correo y un correo de 100 palabras

Idea: [qué pasó, qué hay de nuevo o una pregunta que hacen los clientes]
Guía de voz: [pégala]`,
          pt: `Usando o nosso guia de voz abaixo, transforme esta ideia em:
1. Um roteiro de Reel ou TikTok de 30 segundos com um gancho na primeira frase
2. Uma legenda para o Instagram (menos de 150 palavras) com uma única chamada para ação
3. Uma postagem do Perfil da Empresa no Google (80 a 120 palavras)
4. Uma mensagem de texto curta para os clientes fiéis (menos de 300 caracteres)
5. Um assunto de e-mail e um e-mail de 100 palavras

Ideia: [o que aconteceu, o que há de novo ou uma pergunta que os clientes fazem]
Guia de voz: [cole aqui]`,
        },
      },
      {
        id: 'weekly-report',
        module: '05',
        title: { en: 'Weekly report summary', es: 'Resumen del informe semanal', pt: 'Resumo do relatório semanal' },
        note: { en: 'Check one number by hand before you trust the summary.', es: 'Revisa un número a mano antes de confiar en el resumen.', pt: 'Confira um número à mão antes de confiar no resumo.' },
        body: {
          en: `Here are this week's numbers and last week's for [business]. Our North Star metric is [metric].

Write a weekly report of no more than 150 words with:
1. The North Star this week vs. last week, as a number and a percentage
2. The two biggest changes in the other numbers, and one likely reason for each (say if you're guessing)
3. One decision or test for next week

Only use the numbers I give you. Don't invent reasons you can't see in the data.

This week: [paste]
Last week: [paste]`,
          es: `Aquí están los números de esta semana y de la anterior de [negocio]. Nuestra métrica Estrella del Norte es [métrica].

Escribe un informe semanal de no más de 150 palabras con:
1. La Estrella del Norte de esta semana contra la anterior, en número y porcentaje
2. Los dos cambios más grandes en los otros números y una razón probable de cada uno (di si estás suponiendo)
3. Una decisión o prueba para la próxima semana

Usa solo los números que te doy. No inventes razones que no se vean en los datos.

Esta semana: [pega]
Semana anterior: [pega]`,
          pt: `Aqui estão os números desta semana e da semana passada de [negócio]. Nossa métrica Estrela do Norte é [métrica].

Escreva um relatório semanal de no máximo 150 palavras com:
1. A Estrela do Norte desta semana contra a anterior, em número e porcentagem
2. As duas maiores mudanças nos outros números e um motivo provável para cada uma (diga se está supondo)
3. Uma decisão ou teste para a próxima semana

Use só os números que eu passar. Não invente motivos que não aparecem nos dados.

Esta semana: [cole]
Semana passada: [cole]`,
        },
      },
    ],
  },
  {
    id: 'review-requests',
    title: { en: 'Review requests', es: 'Pedir reseñas', pt: 'Pedir avaliações' },
    intro: {
      en: 'Ask every customer the same way. Never offer anything in return for a review, and never ask only the happy ones.',
      es: 'Pídesela a todos los clientes de la misma forma. Nunca ofrezcas nada a cambio de una reseña y nunca se la pidas solo a los contentos.',
      pt: 'Peça a todos os clientes do mesmo jeito. Nunca ofereça nada em troca de uma avaliação e nunca peça só aos satisfeitos.',
    },
    templates: [
      {
        id: 'ask-in-person',
        module: '08',
        title: { en: 'In person, at checkout', es: 'En persona, al pagar', pt: 'Pessoalmente, no pagamento' },
        note: { en: 'Point to the QR code or NFC card while you say it.', es: 'Señala el código QR o la tarjeta NFC mientras lo dices.', pt: 'Aponte para o QR code ou o cartão NFC enquanto fala.' },
        body: {
          en: `"If you were happy with everything today, a quick Google review really helps a small business like ours. You can tap your phone right here, it takes a minute. Thank you!"`,
          es: `"Si quedaste contento con todo hoy, una reseña rápida en Google ayuda muchísimo a un negocio pequeño como el nuestro. Puedes acercar tu celular aquí, toma un minuto. ¡Gracias!"`,
          pt: `"Se você gostou de tudo hoje, uma avaliação rápida no Google ajuda muito um negócio pequeno como o nosso. É só encostar o celular aqui, leva um minuto. Obrigado!"`,
        },
      },
      {
        id: 'ask-text',
        module: '08',
        title: { en: 'Follow-up text (same day)', es: 'Mensaje de seguimiento (el mismo día)', pt: 'Mensagem de acompanhamento (no mesmo dia)' },
        note: { en: 'Only text customers who agreed to receive texts.', es: 'Envía mensajes solo a clientes que aceptaron recibirlos.', pt: 'Mande mensagem só para clientes que aceitaram receber.' },
        body: {
          en: `Hi [first name], thanks for coming in to [business] today! If you have a minute, a quick Google review would mean a lot to us: [review link]. Thank you! [owner's first name]`,
          es: `Hola [nombre], ¡gracias por venir hoy a [negocio]! Si tienes un minuto, una reseña rápida en Google nos ayudaría muchísimo: [enlace de reseñas]. ¡Gracias! [nombre del dueño]`,
          pt: `Oi [nome], obrigado por vir hoje ao [negócio]! Se tiver um minutinho, uma avaliação rápida no Google ajudaria muito a gente: [link de avaliação]. Obrigado! [nome do dono]`,
        },
      },
      {
        id: 'ask-reminder',
        module: '08',
        title: { en: 'One reminder (3 to 5 days later)', es: 'Un recordatorio (3 a 5 días después)', pt: 'Um lembrete (3 a 5 dias depois)' },
        note: { en: 'Send it once, only if they haven’t left a review. Then stop.', es: 'Envíalo una vez, solo si no dejó reseña. Después, nada más.', pt: 'Mande uma vez, só se a pessoa não avaliou. Depois, pare.' },
        body: {
          en: `Hi [first name], [owner's first name] from [business] again. No pressure at all, but if you get a second this week, here's that review link: [review link]. Hope to see you soon!`,
          es: `Hola [nombre], soy [nombre del dueño] de [negocio] otra vez. Sin ninguna presión, pero si tienes un momento esta semana, aquí está el enlace de la reseña: [enlace de reseñas]. ¡Esperamos verte pronto!`,
          pt: `Oi [nome], aqui é [nome do dono] do [negócio] de novo. Sem pressão nenhuma, mas se tiver um tempinho esta semana, aqui está o link da avaliação: [link de avaliação]. Esperamos te ver em breve!`,
        },
      },
      {
        id: 'ask-email',
        module: '08',
        title: { en: 'Follow-up email', es: 'Correo de seguimiento', pt: 'E-mail de acompanhamento' },
        note: { en: 'Good for jobs that take days: contractors, cleaners, events.', es: 'Sirve para trabajos de varios días: contratistas, limpieza, eventos.', pt: 'Bom para serviços de vários dias: obras, limpeza, eventos.' },
        body: {
          en: `Subject: How did we do, [first name]?

Hi [first name],

Thanks again for choosing [business] for [the job]. It was great working with you.

If you have two minutes, would you share how it went in a Google review? It helps neighbors find a business they can trust, and it means a lot to our small team.

[review link]

If anything wasn't right, just reply to this email and I'll make it right personally.

Thank you,
[owner's name]
[business] · [phone]`,
          es: `Asunto: ¿Cómo lo hicimos, [nombre]?

Hola [nombre]:

Gracias otra vez por elegir a [negocio] para [el trabajo]. Fue un gusto trabajar contigo.

Si tienes dos minutos, ¿nos cuentas cómo te fue en una reseña de Google? Ayuda a tus vecinos a encontrar un negocio de confianza y significa mucho para nuestro pequeño equipo.

[enlace de reseñas]

Si algo no quedó bien, responde a este correo y lo resuelvo personalmente.

Gracias,
[nombre del dueño]
[negocio] · [teléfono]`,
          pt: `Assunto: Como nos saímos, [nome]?

Oi [nome],

Obrigado mais uma vez por escolher o [negócio] para [o serviço]. Foi ótimo trabalhar com você.

Se tiver dois minutos, pode contar como foi em uma avaliação no Google? Isso ajuda os vizinhos a encontrar um negócio de confiança e significa muito para a nossa pequena equipe.

[link de avaliação]

Se algo não ficou certo, é só responder este e-mail que eu resolvo pessoalmente.

Obrigado,
[nome do dono]
[negócio] · [telefone]`,
        },
      },
    ],
  },
  {
    id: 'review-replies',
    title: { en: 'Review replies', es: 'Respuestas a reseñas', pt: 'Respostas a avaliações' },
    intro: {
      en: 'Starting points to adapt, not to paste word for word. Every reply should mention something specific from the review.',
      es: 'Puntos de partida para adaptar, no para pegar tal cual. Cada respuesta debe mencionar algo específico de la reseña.',
      pt: 'Pontos de partida para adaptar, não para colar igual. Cada resposta deve citar algo específico da avaliação.',
    },
    templates: [
      {
        id: 'reply-positive',
        module: '08',
        title: { en: '5-star review', es: 'Reseña de 5 estrellas', pt: 'Avaliação de 5 estrelas' },
        note: { en: 'Short, warm, specific.', es: 'Corta, cálida y específica.', pt: 'Curta, calorosa e específica.' },
        body: {
          en: `Thank you, [first name]! We're so glad [the specific thing they mentioned] made your day. [Staff member] will be happy to hear it. See you next time!`,
          es: `¡Gracias, [nombre]! Nos alegra mucho que [lo específico que mencionó] te haya gustado. A [miembro del equipo] le va a encantar saberlo. ¡Nos vemos la próxima!`,
          pt: `Obrigado, [nome]! Ficamos muito felizes que [a coisa específica que a pessoa citou] tenha feito o seu dia. [Pessoa da equipe] vai adorar saber. Até a próxima!`,
        },
      },
      {
        id: 'reply-mixed',
        module: '08',
        title: { en: '3-star or mixed review', es: 'Reseña de 3 estrellas o mixta', pt: 'Avaliação de 3 estrelas ou mista' },
        note: { en: 'Thank them for the good, own the rest.', es: 'Agradece lo bueno y hazte cargo de lo demás.', pt: 'Agradeça o que foi bom e assuma o resto.' },
        body: {
          en: `Thanks for the honest feedback, [first name]. We're glad you liked [the positive part], and you're right that [the problem] wasn't up to our standard. We've [what you changed, if true]. We'd love another chance to get it all right.`,
          es: `Gracias por tu opinión sincera, [nombre]. Nos alegra que te gustara [lo positivo], y tienes razón en que [el problema] no estuvo a nuestra altura. Ya [lo que cambiaron, si es cierto]. Nos encantaría tener otra oportunidad de hacerlo todo bien.`,
          pt: `Obrigado pelo retorno sincero, [nome]. Que bom que você gostou de [a parte positiva], e você tem razão que [o problema] não esteve à altura. Já [o que mudou, se for verdade]. Adoraríamos ter outra chance de acertar tudo.`,
        },
      },
      {
        id: 'reply-negative',
        module: '08',
        title: { en: '1- or 2-star review', es: 'Reseña de 1 o 2 estrellas', pt: 'Avaliação de 1 ou 2 estrelas' },
        note: { en: 'Wait until you’re calm. Never share details of their visit.', es: 'Espera a estar tranquilo. Nunca compartas detalles de su visita.', pt: 'Espere ficar calmo. Nunca compartilhe detalhes da visita.' },
        body: {
          en: `[First name], thank you for letting us know, and I'm sorry this wasn't the experience you should have had. That's not the standard we hold ourselves to. I'd like to hear more and make it right. Please reach me directly at [phone or email]. [Owner's name], owner`,
          es: `[Nombre], gracias por contárnoslo, y lamento que no hayas tenido la experiencia que merecías. No es el nivel que nos exigimos. Me gustaría saber más y resolverlo. Por favor contáctame directamente al [teléfono o correo]. [Nombre del dueño], dueño`,
          pt: `[Nome], obrigado por nos contar, e sinto muito que você não teve a experiência que merecia. Esse não é o padrão que buscamos. Gostaria de saber mais e resolver. Por favor, fale comigo direto pelo [telefone ou e-mail]. [Nome do dono], proprietário`,
        },
      },
    ],
  },
];

export const SHEETS: Sheet[] = [
  {
    id: 'content-calendar',
    title: { en: '30-day content calendar', es: 'Calendario de contenido de 30 días', pt: 'Calendário de conteúdo de 30 dias' },
    note: {
      en: 'Opens in Google Sheets or Excel. File → Import in Google Sheets.',
      es: 'Se abre en Google Sheets o Excel. En Google Sheets: Archivo → Importar.',
      pt: 'Abre no Google Planilhas ou Excel. No Google Planilhas: Arquivo → Importar.',
    },
    columns: {
      en: ['Date', 'Platform', 'Content pillar', 'Topic', 'Hook', 'Caption', 'Call to action', 'Photo or video', 'Made by', 'Approved', 'Posted'],
      es: ['Fecha', 'Plataforma', 'Pilar de contenido', 'Tema', 'Gancho', 'Texto', 'Llamado a la acción', 'Foto o video', 'Hecho por', 'Aprobado', 'Publicado'],
      pt: ['Data', 'Plataforma', 'Pilar de conteúdo', 'Tema', 'Gancho', 'Legenda', 'Chamada para ação', 'Foto ou vídeo', 'Feito por', 'Aprovado', 'Publicado'],
    },
    rows: 30,
  },
  {
    id: 'listings-tracker',
    title: { en: 'Local listings tracker', es: 'Control de fichas locales', pt: 'Controle de fichas locais' },
    note: {
      en: 'One row per listing. Use it for the Module 07 audit.',
      es: 'Una fila por ficha. Úsala para la auditoría del Módulo 07.',
      pt: 'Uma linha por ficha. Use na auditoria do Módulo 07.',
    },
    columns: {
      en: ['Site', 'Listing link', 'Name matches', 'Address matches', 'Phone matches', 'Hours correct', 'Login email', 'Last checked', 'Notes'],
      es: ['Sitio', 'Enlace de la ficha', 'Nombre coincide', 'Dirección coincide', 'Teléfono coincide', 'Horario correcto', 'Correo de acceso', 'Última revisión', 'Notas'],
      pt: ['Site', 'Link da ficha', 'Nome bate', 'Endereço bate', 'Telefone bate', 'Horário certo', 'E-mail de acesso', 'Última conferência', 'Notas'],
    },
    rows: 0,
  },
  {
    id: 'review-tracker',
    title: { en: 'Weekly review tracker', es: 'Control semanal de reseñas', pt: 'Controle semanal de avaliações' },
    note: {
      en: 'Fill in one row every Monday.',
      es: 'Llena una fila cada lunes.',
      pt: 'Preencha uma linha toda segunda-feira.',
    },
    columns: {
      en: ['Week of', 'Requests sent', 'New reviews', 'Average rating', 'Replied to all?', 'Notes'],
      es: ['Semana del', 'Solicitudes enviadas', 'Reseñas nuevas', 'Calificación promedio', '¿Todas respondidas?', 'Notas'],
      pt: ['Semana de', 'Pedidos enviados', 'Avaliações novas', 'Nota média', 'Respondeu todas?', 'Notas'],
    },
    rows: 0,
  },
];

// Pre-filled rows for sheets that list known sites.
export const LISTING_SITES = ['Google Business Profile', 'Apple Business Connect', 'Bing Places', 'Yelp', 'Facebook', 'Instagram', 'Nextdoor', '[Industry directory]'];
