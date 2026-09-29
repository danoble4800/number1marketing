// N°1 Academy glossary: the words used day to day in digital marketing, in plain language,
// each with a small-business example. Lessons link to a term with [[shown text|id]].
// Each entry is [term, definition, example] for en, es and pt.

export type Locale = 'en' | 'es' | 'pt';
export type CategoryId =
  | 'marketing'
  | 'search'
  | 'reviews'
  | 'ads'
  | 'social'
  | 'email'
  | 'ai'
  | 'automation'
  | 'analytics';

type Entry = [term: string, definition: string, example: string];

export type GlossaryTerm = {
  id: string;
  category: CategoryId;
  en: Entry;
  es: Entry;
  pt: Entry;
};

export const CATEGORIES: Record<CategoryId, Record<Locale, string>> = {
  marketing: { en: 'Marketing basics', es: 'Fundamentos de marketing', pt: 'Fundamentos de marketing' },
  search: { en: 'Search & local SEO', es: 'Búsqueda y SEO local', pt: 'Busca e SEO local' },
  reviews: { en: 'Reviews & reputation', es: 'Reseñas y reputación', pt: 'Avaliações e reputação' },
  ads: { en: 'Paid ads', es: 'Anuncios pagados', pt: 'Anúncios pagos' },
  social: { en: 'Social media & content', es: 'Redes sociales y contenido', pt: 'Redes sociais e conteúdo' },
  email: { en: 'Email & text', es: 'Email y mensajes de texto', pt: 'E-mail e mensagens de texto' },
  ai: { en: 'AI', es: 'IA', pt: 'IA' },
  automation: { en: 'Automation', es: 'Automatización', pt: 'Automação' },
  analytics: { en: 'Analytics', es: 'Analítica', pt: 'Análise de dados' },
};

export const GLOSSARY: GlossaryTerm[] = [
  // ---- Marketing basics
  {
    id: 'funnel',
    category: 'marketing',
    en: ['Marketing funnel', 'The steps a person goes through from first hearing about a business to buying and coming back: awareness, interest, decision, purchase and loyalty.', 'Someone sees a bakery’s Instagram post (awareness), checks its menu (interest), reads reviews (decision), orders a cake (purchase) and orders again next month (loyalty).'],
    es: ['Embudo de marketing', 'Los pasos que sigue una persona desde que conoce un negocio hasta que compra y vuelve: conocimiento, interés, decisión, compra y lealtad.', 'Alguien ve una publicación de una panadería en Instagram (conocimiento), revisa el menú (interés), lee reseñas (decisión), pide un pastel (compra) y vuelve a pedir el mes siguiente (lealtad).'],
    pt: ['Funil de marketing', 'As etapas que uma pessoa percorre desde conhecer um negócio até comprar e voltar: conhecimento, interesse, decisão, compra e fidelidade.', 'Alguém vê um post de uma padaria no Instagram (conhecimento), olha o cardápio (interesse), lê avaliações (decisão), encomenda um bolo (compra) e encomenda de novo no mês seguinte (fidelidade).'],
  },
  {
    id: 'lead',
    category: 'marketing',
    en: ['Lead', 'A person who has shown interest and left a way to contact them, but hasn’t bought yet.', 'Someone fills in the “Get a quote” form on a roofer’s website. They are now a lead.'],
    es: ['Lead (prospecto)', 'Una persona que mostró interés y dejó una forma de contactarla, pero todavía no ha comprado.', 'Alguien llena el formulario “Pide una cotización” en el sitio de un techador. Ahora es un lead.'],
    pt: ['Lead (potencial cliente)', 'Uma pessoa que demonstrou interesse e deixou um jeito de ser contatada, mas ainda não comprou.', 'Alguém preenche o formulário “Peça um orçamento” no site de uma empresa de telhados. Agora é um lead.'],
  },
  {
    id: 'lead-magnet',
    category: 'marketing',
    en: ['Lead magnet', 'Something useful given away free in exchange for contact details.', 'A gym offers a free 7-day meal plan to anyone who enters their email.'],
    es: ['Lead magnet (imán de prospectos)', 'Algo útil que se regala a cambio de los datos de contacto.', 'Un gimnasio regala un plan de comidas de 7 días a quien deje su correo.'],
    pt: ['Lead magnet (isca digital)', 'Algo útil oferecido de graça em troca dos dados de contato.', 'Uma academia oferece um plano alimentar de 7 dias para quem deixar o e-mail.'],
  },
  {
    id: 'cta',
    category: 'marketing',
    en: ['Call to action (CTA)', 'The one thing you ask the reader to do next, usually as a button or a short line.', '“Book your haircut” on a barbershop’s website button.'],
    es: ['Llamado a la acción (CTA)', 'Lo único que le pides al lector que haga después, normalmente con un botón o una frase corta.', '“Reserva tu corte” en el botón del sitio de una barbería.'],
    pt: ['Chamada para ação (CTA)', 'A única coisa que você pede para o leitor fazer em seguida, normalmente com um botão ou uma frase curta.', '“Agende seu corte” no botão do site de uma barbearia.'],
  },
  {
    id: 'conversion',
    category: 'marketing',
    en: ['Conversion', 'When someone does the thing you wanted them to do: buy, book, call or sign up.', 'A visitor to a nail salon’s site books an appointment. That’s one conversion.'],
    es: ['Conversión', 'Cuando alguien hace lo que querías que hiciera: comprar, reservar, llamar o registrarse.', 'Un visitante del sitio de un salón de uñas reserva una cita. Eso es una conversión.'],
    pt: ['Conversão', 'Quando alguém faz o que você queria: comprar, agendar, ligar ou se cadastrar.', 'Um visitante do site de um salão de unhas agenda um horário. Isso é uma conversão.'],
  },
  {
    id: 'conversion-rate',
    category: 'marketing',
    en: ['Conversion rate', 'The percentage of people who convert out of everyone who had the chance.', '200 people visit the booking page and 10 book: a 5% conversion rate.'],
    es: ['Tasa de conversión', 'El porcentaje de personas que convierten entre todas las que tuvieron la oportunidad.', '200 personas visitan la página de reservas y 10 reservan: una tasa de conversión del 5%.'],
    pt: ['Taxa de conversão', 'A porcentagem de pessoas que convertem entre todas que tiveram a chance.', '200 pessoas visitam a página de agendamento e 10 agendam: taxa de conversão de 5%.'],
  },
  {
    id: 'landing-page',
    category: 'marketing',
    en: ['Landing page', 'A web page built for one offer and one action, often where an ad or QR code sends people.', 'A QR code on a flyer opens a page about the café’s catering, with one “Request a quote” button.'],
    es: ['Landing page (página de aterrizaje)', 'Una página web hecha para una sola oferta y una sola acción, a menudo a donde lleva un anuncio o un código QR.', 'Un código QR en un volante abre una página sobre el catering de la cafetería, con un solo botón de “Pide una cotización”.'],
    pt: ['Landing page (página de destino)', 'Uma página feita para uma única oferta e uma única ação, muitas vezes para onde um anúncio ou QR code leva.', 'Um QR code em um panfleto abre uma página sobre o buffet do café, com um único botão “Peça um orçamento”.'],
  },
  {
    id: 'icp',
    category: 'marketing',
    en: ['Ideal customer profile (ICP)', 'A clear description of the customer a business most wants: who they are, what they need and where to find them.', 'A dog groomer’s ICP: busy owners of large breeds within 5 miles who want pickup and drop-off.'],
    es: ['Perfil de cliente ideal (ICP)', 'Una descripción clara del cliente que un negocio más quiere: quién es, qué necesita y dónde encontrarlo.', 'El ICP de una peluquería canina: dueños ocupados de perros grandes a menos de 8 km que quieren servicio a domicilio.'],
    pt: ['Perfil de cliente ideal (ICP)', 'Uma descrição clara do cliente que o negócio mais quer: quem é, do que precisa e onde encontrá-lo.', 'O ICP de um pet shop de banho e tosa: donos ocupados de cães grandes a até 8 km que querem busca e entrega.'],
  },
  {
    id: 'value-proposition',
    category: 'marketing',
    en: ['Value proposition', 'One or two sentences on why a customer should choose this business over the others.', '“Same-day phone screen repair in Worcester, or it’s free.”'],
    es: ['Propuesta de valor', 'Una o dos frases sobre por qué un cliente debería elegir este negocio y no otro.', '“Reparamos la pantalla de tu celular el mismo día en Worcester, o es gratis.”'],
    pt: ['Proposta de valor', 'Uma ou duas frases sobre por que o cliente deve escolher este negócio e não outro.', '“Consertamos a tela do seu celular no mesmo dia em Worcester, ou é de graça.”'],
  },
  {
    id: 'speed-to-lead',
    category: 'marketing',
    en: ['Speed to lead', 'How quickly a business answers a new lead. Faster replies win far more customers.', 'A contractor texts back within 5 minutes of a web inquiry and books the job before competitors even call.'],
    es: ['Velocidad de respuesta al lead', 'Qué tan rápido responde un negocio a un nuevo lead. Responder más rápido gana muchos más clientes.', 'Un contratista contesta por texto 5 minutos después de una consulta web y cierra el trabajo antes de que la competencia llame.'],
    pt: ['Velocidade de resposta ao lead', 'A rapidez com que o negócio responde a um novo lead. Respostas rápidas conquistam muito mais clientes.', 'Um prestador de serviço responde por mensagem 5 minutos depois de um contato pelo site e fecha o serviço antes da concorrência ligar.'],
  },
  {
    id: 'crm',
    category: 'marketing',
    en: ['CRM', 'Customer relationship management: one place to keep every lead and customer, their details, and every conversation with them.', 'A salon’s CRM shows each client’s last visit, their stylist and a note that they prefer texts.'],
    es: ['CRM', 'Gestión de relaciones con clientes: un solo lugar para guardar cada lead y cliente, sus datos y cada conversación.', 'El CRM de un salón muestra la última visita de cada clienta, su estilista y una nota de que prefiere mensajes de texto.'],
    pt: ['CRM', 'Gestão de relacionamento com o cliente: um só lugar para guardar cada lead e cliente, seus dados e cada conversa.', 'O CRM de um salão mostra a última visita de cada cliente, a cabeleireira e uma nota de que prefere mensagem de texto.'],
  },
  {
    id: 'brand-voice',
    category: 'marketing',
    en: ['Brand voice', 'The consistent personality in how a business writes and speaks: its words, tone and what it would never say.', 'A skate shop’s voice is casual and funny; a law firm’s is calm and clear.'],
    es: ['Voz de marca', 'La personalidad constante en cómo escribe y habla un negocio: sus palabras, su tono y lo que nunca diría.', 'La voz de una tienda de skate es relajada y graciosa; la de un despacho de abogados, tranquila y clara.'],
    pt: ['Voz da marca', 'A personalidade constante no jeito como o negócio escreve e fala: as palavras, o tom e o que ele nunca diria.', 'A voz de uma loja de skate é descontraída e engraçada; a de um escritório de advocacia, calma e clara.'],
  },
  {
    id: 'upsell',
    category: 'marketing',
    en: ['Upsell', 'Offering a customer a bigger or better version of what they are already buying.', 'A car wash offers the $25 wash-and-wax to someone who picked the $12 basic wash.'],
    es: ['Upsell (venta de mayor valor)', 'Ofrecerle a un cliente una versión más grande o mejor de lo que ya está comprando.', 'Un autolavado le ofrece el lavado con cera de $25 a quien eligió el básico de $12.'],
    pt: ['Upsell (venda de maior valor)', 'Oferecer ao cliente uma versão maior ou melhor do que ele já está comprando.', 'Um lava-rápido oferece a lavagem com cera de US$ 25 para quem escolheu a básica de US$ 12.'],
  },
  {
    id: 'ltv',
    category: 'marketing',
    en: ['Customer lifetime value (LTV)', 'The total a typical customer spends with the business over the whole time they stay a customer.', 'A barbershop client who spends $35 every 3 weeks for 3 years is worth about $1,800.'],
    es: ['Valor de vida del cliente (LTV)', 'El total que gasta un cliente típico en el negocio durante todo el tiempo que sigue siendo cliente.', 'Un cliente de barbería que gasta $35 cada 3 semanas durante 3 años vale unos $1,800.'],
    pt: ['Valor do tempo de vida do cliente (LTV)', 'O total que um cliente típico gasta com o negócio durante todo o tempo em que continua cliente.', 'Um cliente de barbearia que gasta US$ 35 a cada 3 semanas por 3 anos vale cerca de US$ 1.800.'],
  },

  // ---- Search & local SEO
  {
    id: 'seo',
    category: 'search',
    en: ['SEO', 'Search engine optimization: improving a website and online presence so it shows up higher in free search results.', 'A florist adds a page about wedding flowers in their town and starts appearing for “wedding florist Worcester”.'],
    es: ['SEO', 'Optimización para buscadores: mejorar un sitio web y la presencia en línea para aparecer más arriba en los resultados gratuitos.', 'Una florería agrega una página sobre flores para bodas en su ciudad y empieza a aparecer al buscar “florería para bodas Worcester”.'],
    pt: ['SEO', 'Otimização para mecanismos de busca: melhorar o site e a presença on-line para aparecer mais alto nos resultados gratuitos.', 'Uma floricultura cria uma página sobre flores para casamento na cidade e começa a aparecer em “floricultura casamento Worcester”.'],
  },
  {
    id: 'local-seo',
    category: 'search',
    en: ['Local SEO', 'SEO for businesses that serve a specific area, focused on Google Maps, the local pack and “near me” searches.', 'A pizzeria works on its Google profile, reviews and listings so it shows up when people nearby search “pizza”.'],
    es: ['SEO local', 'SEO para negocios que atienden una zona específica, enfocado en Google Maps, el paquete local y las búsquedas “cerca de mí”.', 'Una pizzería trabaja su perfil de Google, sus reseñas y sus fichas para aparecer cuando la gente cercana busca “pizza”.'],
    pt: ['SEO local', 'SEO para negócios que atendem uma região específica, focado no Google Maps, no pacote local e nas buscas “perto de mim”.', 'Uma pizzaria cuida do perfil no Google, das avaliações e das fichas para aparecer quando quem está perto pesquisa “pizza”.'],
  },
  {
    id: 'gbp',
    category: 'search',
    en: ['Google Business Profile', 'The free Google listing that shows a business on Maps and in search, with its hours, photos, reviews and contact buttons. It used to be called Google My Business.', 'Search a café’s name and the box on the right with its hours, photos and “Directions” button is its Google Business Profile.'],
    es: ['Perfil de Empresa de Google', 'La ficha gratuita de Google que muestra un negocio en Maps y en la búsqueda, con su horario, fotos, reseñas y botones de contacto. Antes se llamaba Google My Business.', 'Busca el nombre de una cafetería: el recuadro con su horario, fotos y botón “Cómo llegar” es su Perfil de Empresa de Google.'],
    pt: ['Perfil da Empresa no Google', 'A ficha gratuita do Google que mostra o negócio no Maps e na busca, com horário, fotos, avaliações e botões de contato. Antes se chamava Google Meu Negócio.', 'Pesquise o nome de um café: o quadro com horário, fotos e o botão “Rotas” é o Perfil da Empresa no Google.'],
  },
  {
    id: 'local-pack',
    category: 'search',
    en: ['Local pack', 'The map and three business listings Google shows at the top of many local searches.', 'Searching “barber near me” shows a map with three barbershops under it. Being one of the three brings in walk-ins.'],
    es: ['Local pack (paquete local)', 'El mapa con tres negocios que Google muestra arriba en muchas búsquedas locales.', 'Buscar “barbería cerca de mí” muestra un mapa con tres barberías. Estar entre esas tres trae clientes.'],
    pt: ['Local pack (pacote local)', 'O mapa com três negócios que o Google mostra no topo de muitas buscas locais.', 'Pesquisar “barbearia perto de mim” mostra um mapa com três barbearias. Estar entre as três traz clientes.'],
  },
  {
    id: 'nap',
    category: 'search',
    en: ['NAP', 'Name, address, phone number. These should be exactly the same everywhere the business is listed online.', 'If the website says “Suite 2” and Yelp says “Unit B”, the NAP doesn’t match. Pick one and use it everywhere.'],
    es: ['NAP', 'Nombre, dirección y teléfono (Name, Address, Phone). Deben ser exactamente iguales en todos los lugares donde aparece el negocio.', 'Si el sitio dice “Local 2” y Yelp dice “Unidad B”, el NAP no coincide. Elige una forma y úsala en todas partes.'],
    pt: ['NAP', 'Nome, endereço e telefone (Name, Address, Phone). Devem ser exatamente iguais em todos os lugares onde o negócio aparece.', 'Se o site diz “Sala 2” e o Yelp diz “Loja B”, o NAP não bate. Escolha uma forma e use em todo lugar.'],
  },
  {
    id: 'citation',
    category: 'search',
    en: ['Citation', 'Any place online that lists a business’s name, address and phone number, like Yelp, Apple Maps or a local directory.', 'A plumber’s listings on Yelp, Bing Places, Angi and the chamber of commerce site are all citations.'],
    es: ['Citación', 'Cualquier lugar en línea que muestra el nombre, la dirección y el teléfono de un negocio, como Yelp, Apple Maps o un directorio local.', 'Las fichas de un plomero en Yelp, Bing Places, Angi y la cámara de comercio son citaciones.'],
    pt: ['Citação', 'Qualquer lugar on-line que mostra o nome, o endereço e o telefone do negócio, como Yelp, Apple Maps ou um diretório local.', 'As fichas de um encanador no Yelp, Bing Places, Angi e no site da câmara de comércio são citações.'],
  },
  {
    id: 'keyword',
    category: 'search',
    en: ['Keyword', 'The words people type or say when they search.', '“Emergency plumber open now” and “cheap oil change near me” are keywords.'],
    es: ['Palabra clave (keyword)', 'Las palabras que la gente escribe o dice cuando busca.', '“Plomero de urgencia abierto ahora” y “cambio de aceite barato cerca de mí” son palabras clave.'],
    pt: ['Palavra-chave (keyword)', 'As palavras que as pessoas digitam ou falam quando pesquisam.', '“Encanador de emergência aberto agora” e “troca de óleo barata perto de mim” são palavras-chave.'],
  },
  {
    id: 'backlink',
    category: 'search',
    en: ['Backlink', 'A link from another website to yours. Links from trusted, relevant sites help search rankings.', 'A local news article about a new bakery links to its website. That’s a valuable backlink.'],
    es: ['Backlink (enlace entrante)', 'Un enlace desde otro sitio web hacia el tuyo. Los enlaces de sitios confiables y relacionados ayudan al posicionamiento.', 'Una nota del periódico local sobre una panadería nueva enlaza a su sitio. Es un backlink valioso.'],
    pt: ['Backlink (link de entrada)', 'Um link de outro site para o seu. Links de sites confiáveis e relacionados ajudam no ranking.', 'Uma matéria do jornal local sobre uma padaria nova tem link para o site dela. É um backlink valioso.'],
  },
  {
    id: 'schema',
    category: 'search',
    en: ['Schema markup', 'A small piece of code on a website that labels details like the business name, address, hours and prices so search engines read them correctly.', 'A restaurant’s site uses schema so Google can show its hours and price range right in the results.'],
    es: ['Marcado de schema', 'Un pequeño código en el sitio web que etiqueta datos como el nombre, la dirección, el horario y los precios para que los buscadores los lean bien.', 'El sitio de un restaurante usa schema para que Google muestre su horario y rango de precios en los resultados.'],
    pt: ['Marcação de schema', 'Um pequeno código no site que identifica dados como nome, endereço, horário e preços para os buscadores lerem corretamente.', 'O site de um restaurante usa schema para o Google mostrar o horário e a faixa de preço nos resultados.'],
  },
  {
    id: 'serp',
    category: 'search',
    en: ['SERP', 'Search engine results page: everything Google shows after a search, including ads, the map, AI answers and regular results.', 'On the SERP for “tax preparer Boston”, the ads come first, then the map, then the websites.'],
    es: ['SERP', 'Página de resultados del buscador: todo lo que muestra Google después de una búsqueda, incluidos anuncios, el mapa, respuestas de IA y resultados normales.', 'En la SERP de “contador de impuestos Boston” primero salen los anuncios, luego el mapa y después los sitios web.'],
    pt: ['SERP', 'Página de resultados do buscador: tudo o que o Google mostra depois de uma busca, incluindo anúncios, o mapa, respostas de IA e resultados normais.', 'Na SERP de “contador de imposto Boston”, primeiro vêm os anúncios, depois o mapa e então os sites.'],
  },
  {
    id: 'organic',
    category: 'search',
    en: ['Organic traffic', 'Visitors who arrive from free search results or unpaid posts, not from ads.', 'A blog post about “how often to service your AC” brings 300 visitors a month from Google without paying for ads.'],
    es: ['Tráfico orgánico', 'Visitantes que llegan desde resultados gratuitos o publicaciones no pagadas, no desde anuncios.', 'Un artículo sobre “cada cuánto dar mantenimiento al aire acondicionado” trae 300 visitas al mes desde Google sin pagar anuncios.'],
    pt: ['Tráfego orgânico', 'Visitantes que chegam pelos resultados gratuitos ou por posts não pagos, e não por anúncios.', 'Um artigo sobre “de quanto em quanto tempo revisar o ar-condicionado” traz 300 visitas por mês do Google sem pagar anúncio.'],
  },
  {
    id: 'ai-overviews',
    category: 'search',
    en: ['AI answers (AI Overviews)', 'Summaries written by AI at the top of search results or in chat tools like ChatGPT, built from websites, profiles and reviews.', 'Someone asks “best bakery in Worcester for birthday cakes” and gets an AI answer naming three bakeries with strong reviews.'],
    es: ['Respuestas de IA (AI Overviews)', 'Resúmenes escritos por IA arriba de los resultados de búsqueda o en herramientas como ChatGPT, armados con sitios web, perfiles y reseñas.', 'Alguien pregunta “mejor panadería en Worcester para pasteles de cumpleaños” y recibe una respuesta de IA con tres panaderías con buenas reseñas.'],
    pt: ['Respostas de IA (AI Overviews)', 'Resumos escritos por IA no topo da busca ou em ferramentas como o ChatGPT, montados a partir de sites, perfis e avaliações.', 'Alguém pergunta “melhor padaria em Worcester para bolo de aniversário” e recebe uma resposta de IA citando três padarias bem avaliadas.'],
  },

  // ---- Reviews & reputation
  {
    id: 'review-gating',
    category: 'reviews',
    en: ['Review gating', 'Asking only happy customers for reviews, or sending unhappy ones somewhere else first. Google’s rules don’t allow it.', 'A text that says “Happy? Review us on Google. Not happy? Tell us privately” is review gating.'],
    es: ['Filtrar reseñas (review gating)', 'Pedir reseñas solo a los clientes contentos, o mandar primero a los descontentos a otro lugar. Las reglas de Google no lo permiten.', 'Un mensaje que dice “¿Contento? Déjanos una reseña en Google. ¿No? Cuéntanos en privado” es filtrar reseñas.'],
    pt: ['Filtrar avaliações (review gating)', 'Pedir avaliação só aos clientes satisfeitos, ou mandar os insatisfeitos primeiro para outro lugar. As regras do Google não permitem.', 'Uma mensagem que diz “Gostou? Avalie no Google. Não gostou? Conte para a gente no privado” é filtrar avaliações.'],
  },
  {
    id: 'review-link',
    category: 'reviews',
    en: ['Review link', 'A short link from the Google Business Profile that opens the review box directly, so leaving a review takes one tap.', 'A salon texts its review link after every appointment and puts it on an NFC card at the front desk.'],
    es: ['Enlace de reseñas', 'Un enlace corto del Perfil de Empresa de Google que abre directamente el cuadro de reseña, para dejarla con un solo toque.', 'Un salón envía su enlace de reseñas después de cada cita y lo tiene en una tarjeta NFC en la recepción.'],
    pt: ['Link de avaliação', 'Um link curto do Perfil da Empresa no Google que abre direto a caixa de avaliação, para avaliar com um toque.', 'Um salão manda o link de avaliação depois de cada horário e deixa ele em um cartão NFC na recepção.'],
  },
  {
    id: 'reputation-management',
    category: 'reviews',
    en: ['Reputation management', 'Watching and improving what people say about a business online: getting reviews, replying to them and fixing the problems they reveal.', 'A dentist replies to every review each week and changes the booking process after several reviews mention long waits.'],
    es: ['Gestión de reputación', 'Vigilar y mejorar lo que se dice de un negocio en línea: conseguir reseñas, responderlas y arreglar los problemas que muestran.', 'Un dentista responde todas las reseñas cada semana y cambia sus citas después de que varias reseñas mencionan esperas largas.'],
    pt: ['Gestão de reputação', 'Acompanhar e melhorar o que se fala do negócio on-line: conseguir avaliações, responder e corrigir os problemas que elas mostram.', 'Um dentista responde a todas as avaliações toda semana e muda o agendamento depois que várias avaliações citam demora.'],
  },
  {
    id: 'social-proof',
    category: 'reviews',
    en: ['Social proof', 'Evidence that other people already trust a business: reviews, ratings, testimonials, customer photos and client logos.', 'A landscaper’s website shows “4.9 stars from 212 reviews” next to the quote button.'],
    es: ['Prueba social', 'Evidencia de que otras personas ya confían en un negocio: reseñas, calificaciones, testimonios, fotos de clientes y logos de clientes.', 'El sitio de un jardinero muestra “4.9 estrellas en 212 reseñas” junto al botón de cotización.'],
    pt: ['Prova social', 'Evidência de que outras pessoas já confiam no negócio: avaliações, notas, depoimentos, fotos de clientes e logos de clientes.', 'O site de um paisagista mostra “4,9 estrelas em 212 avaliações” ao lado do botão de orçamento.'],
  },

  // ---- Paid ads
  {
    id: 'ppc',
    category: 'ads',
    en: ['Pay-per-click (PPC)', 'Advertising where the business pays only when someone clicks the ad. Google Ads works mostly this way.', 'An HVAC company pays about $8 each time someone clicks its “AC repair” ad.'],
    es: ['Pago por clic (PPC)', 'Publicidad en la que el negocio paga solo cuando alguien hace clic en el anuncio. Google Ads funciona así casi siempre.', 'Una empresa de aire acondicionado paga unos $8 cada vez que alguien hace clic en su anuncio de “reparación de aire”.'],
    pt: ['Pagamento por clique (PPC)', 'Publicidade em que o negócio só paga quando alguém clica no anúncio. O Google Ads funciona assim na maioria das vezes.', 'Uma empresa de ar-condicionado paga cerca de US$ 8 cada vez que alguém clica no anúncio de “conserto de ar”.'],
  },
  {
    id: 'cpc',
    category: 'ads',
    en: ['Cost per click (CPC)', 'The average price paid for one click on an ad.', '$120 spent, 60 clicks: a $2 CPC.'],
    es: ['Costo por clic (CPC)', 'El precio promedio que se paga por un clic en un anuncio.', '$120 gastados, 60 clics: un CPC de $2.'],
    pt: ['Custo por clique (CPC)', 'O preço médio pago por um clique em um anúncio.', 'US$ 120 gastos, 60 cliques: CPC de US$ 2.'],
  },
  {
    id: 'cpm',
    category: 'ads',
    en: ['CPM', 'Cost per thousand impressions: what it costs for an ad to be shown 1,000 times.', 'A Facebook ad with a $9 CPM costs $9 for every 1,000 times it appears on someone’s screen.'],
    es: ['CPM', 'Costo por mil impresiones: lo que cuesta que un anuncio se muestre 1,000 veces.', 'Un anuncio en Facebook con un CPM de $9 cuesta $9 por cada 1,000 veces que aparece en una pantalla.'],
    pt: ['CPM', 'Custo por mil impressões: quanto custa para um anúncio ser exibido 1.000 vezes.', 'Um anúncio no Facebook com CPM de US$ 9 custa US$ 9 a cada 1.000 vezes que aparece em uma tela.'],
  },
  {
    id: 'cpl',
    category: 'ads',
    en: ['Cost per lead (CPL)', 'How much the business spends, on average, to get one new lead.', '$300 on ads brought 15 quote requests: a $20 CPL.'],
    es: ['Costo por lead (CPL)', 'Cuánto gasta el negocio, en promedio, para conseguir un nuevo lead.', '$300 en anuncios trajeron 15 solicitudes de cotización: un CPL de $20.'],
    pt: ['Custo por lead (CPL)', 'Quanto o negócio gasta, em média, para conseguir um novo lead.', 'US$ 300 em anúncios trouxeram 15 pedidos de orçamento: CPL de US$ 20.'],
  },
  {
    id: 'roas',
    category: 'ads',
    en: ['ROAS', 'Return on ad spend: revenue from ads divided by what the ads cost.', '$500 in ads brought $2,000 in sales: a ROAS of 4, or 4x.'],
    es: ['ROAS', 'Retorno de la inversión publicitaria: los ingresos que traen los anuncios divididos entre lo que costaron.', '$500 en anuncios trajeron $2,000 en ventas: un ROAS de 4, o 4x.'],
    pt: ['ROAS', 'Retorno sobre o investimento em anúncios: a receita dos anúncios dividida pelo que eles custaram.', 'US$ 500 em anúncios trouxeram US$ 2.000 em vendas: ROAS de 4, ou 4x.'],
  },
  {
    id: 'impressions',
    category: 'ads',
    en: ['Impressions', 'The number of times an ad or post was shown on a screen, counting repeat views by the same person.', 'A post with 5,000 impressions may have been seen by 2,000 people, some more than once.'],
    es: ['Impresiones', 'Las veces que un anuncio o publicación apareció en una pantalla, contando las repeticiones de la misma persona.', 'Una publicación con 5,000 impresiones pudo verla 2,000 personas, algunas más de una vez.'],
    pt: ['Impressões', 'Quantas vezes um anúncio ou post apareceu em uma tela, contando repetições da mesma pessoa.', 'Um post com 5.000 impressões pode ter sido visto por 2.000 pessoas, algumas mais de uma vez.'],
  },
  {
    id: 'reach',
    category: 'ads',
    en: ['Reach', 'The number of different people who saw an ad or post.', 'A post reached 2,000 people, and some of them saw it twice.'],
    es: ['Alcance', 'El número de personas distintas que vieron un anuncio o publicación.', 'Una publicación alcanzó a 2,000 personas, y algunas la vieron dos veces.'],
    pt: ['Alcance', 'O número de pessoas diferentes que viram um anúncio ou post.', 'Um post alcançou 2.000 pessoas, e algumas viram duas vezes.'],
  },
  {
    id: 'targeting',
    category: 'ads',
    en: ['Targeting', 'Choosing who sees an ad: by location, age, interests, what they searched or whether they visited the website.', 'A daycare shows its ads only to parents within 10 miles.'],
    es: ['Segmentación (targeting)', 'Elegir quién ve un anuncio: por ubicación, edad, intereses, lo que buscó o si visitó el sitio web.', 'Una guardería muestra sus anuncios solo a padres a menos de 15 km.'],
    pt: ['Segmentação (targeting)', 'Escolher quem vê o anúncio: por localização, idade, interesses, o que pesquisou ou se visitou o site.', 'Uma creche mostra os anúncios só para pais a até 15 km.'],
  },
  {
    id: 'retargeting',
    category: 'ads',
    en: ['Retargeting', 'Showing ads to people who already visited the website or interacted with the business but didn’t buy.', 'Someone looks at a boat rental page, leaves, and sees an ad for that rental on Instagram the next day.'],
    es: ['Retargeting (remarketing)', 'Mostrar anuncios a personas que ya visitaron el sitio o interactuaron con el negocio pero no compraron.', 'Alguien ve la página de alquiler de un bote, se va, y al día siguiente ve un anuncio de ese alquiler en Instagram.'],
    pt: ['Retargeting (remarketing)', 'Mostrar anúncios para quem já visitou o site ou interagiu com o negócio mas não comprou.', 'Alguém vê a página de aluguel de um barco, sai, e no dia seguinte vê um anúncio desse aluguel no Instagram.'],
  },
  {
    id: 'ab-test',
    category: 'ads',
    en: ['A/B test', 'Comparing two versions that differ in one thing to see which works better.', 'A café runs two ads that are identical except the photo, and keeps the one that gets more orders.'],
    es: ['Prueba A/B', 'Comparar dos versiones que cambian en una sola cosa para ver cuál funciona mejor.', 'Una cafetería pone dos anuncios iguales salvo la foto, y se queda con el que trae más pedidos.'],
    pt: ['Teste A/B', 'Comparar duas versões que mudam uma única coisa para ver qual funciona melhor.', 'Um café roda dois anúncios iguais, exceto pela foto, e fica com o que traz mais pedidos.'],
  },

  // ---- Social media & content
  {
    id: 'engagement-rate',
    category: 'social',
    en: ['Engagement rate', 'The share of people who interacted with a post (liked, commented, shared or saved) out of everyone who saw it.', '40 interactions from 1,000 people reached: a 4% engagement rate.'],
    es: ['Tasa de interacción (engagement)', 'La proporción de personas que interactuaron con una publicación (me gusta, comentario, compartir o guardar) entre todas las que la vieron.', '40 interacciones de 1,000 personas alcanzadas: una tasa del 4%.'],
    pt: ['Taxa de engajamento', 'A proporção de pessoas que interagiram com um post (curtiram, comentaram, compartilharam ou salvaram) entre todas que viram.', '40 interações de 1.000 pessoas alcançadas: taxa de engajamento de 4%.'],
  },
  {
    id: 'short-form-video',
    category: 'social',
    en: ['Short-form video', 'Vertical videos under about 90 seconds: Instagram Reels, TikTok and YouTube Shorts.', 'A 20-second Reel of a barber doing a skin fade, start to finish.'],
    es: ['Video corto', 'Videos verticales de menos de unos 90 segundos: Reels de Instagram, TikTok y YouTube Shorts.', 'Un Reel de 20 segundos de un barbero haciendo un degradado de principio a fin.'],
    pt: ['Vídeo curto', 'Vídeos verticais de até cerca de 90 segundos: Reels do Instagram, TikTok e YouTube Shorts.', 'Um Reel de 20 segundos de um barbeiro fazendo um degradê do começo ao fim.'],
  },
  {
    id: 'ugc',
    category: 'social',
    en: ['User-generated content (UGC)', 'Photos, videos and posts made by customers rather than the business. Always ask permission before reposting.', 'A customer posts a photo of their birthday cake and tags the bakery, which reposts it with permission.'],
    es: ['Contenido generado por usuarios (UGC)', 'Fotos, videos y publicaciones que hacen los clientes, no el negocio. Siempre pide permiso antes de volver a publicarlos.', 'Una clienta publica la foto de su pastel de cumpleaños y etiqueta a la panadería, que la comparte con permiso.'],
    pt: ['Conteúdo gerado pelo usuário (UGC)', 'Fotos, vídeos e posts feitos pelos clientes, e não pelo negócio. Sempre peça permissão antes de republicar.', 'Uma cliente posta a foto do bolo de aniversário e marca a padaria, que republica com permissão.'],
  },
  {
    id: 'content-pillar',
    category: 'social',
    en: ['Content pillar', 'One of three to five main themes a business posts about again and again.', 'A gym’s pillars: workouts, nutrition tips, member stories and behind the scenes.'],
    es: ['Pilar de contenido', 'Uno de los tres a cinco temas principales sobre los que un negocio publica una y otra vez.', 'Los pilares de un gimnasio: rutinas, consejos de nutrición, historias de socios y detrás de cámaras.'],
    pt: ['Pilar de conteúdo', 'Um dos três a cinco temas principais sobre os quais o negócio posta de novo e de novo.', 'Os pilares de uma academia: treinos, dicas de nutrição, histórias de alunos e bastidores.'],
  },
  {
    id: 'content-calendar',
    category: 'social',
    en: ['Content calendar', 'A schedule of what will be posted, where and when.', 'A spreadsheet with a row per day: platform, pillar, topic, caption, who makes it and when it’s approved.'],
    es: ['Calendario de contenido', 'Un plan de qué se publicará, dónde y cuándo.', 'Una hoja de cálculo con una fila por día: plataforma, pilar, tema, texto, quién lo hace y cuándo se aprueba.'],
    pt: ['Calendário de conteúdo', 'Um planejamento do que será postado, onde e quando.', 'Uma planilha com uma linha por dia: plataforma, pilar, tema, legenda, quem faz e quando é aprovado.'],
  },
  {
    id: 'repurposing',
    category: 'social',
    en: ['Repurposing', 'Turning one piece of content into several for different platforms.', 'One video about choosing a wedding cake becomes a Reel, a Google post, an email and three quote graphics.'],
    es: ['Reutilizar contenido', 'Convertir una pieza de contenido en varias para distintas plataformas.', 'Un video sobre cómo elegir un pastel de bodas se vuelve un Reel, una publicación de Google, un correo y tres imágenes con frases.'],
    pt: ['Reaproveitar conteúdo', 'Transformar uma peça de conteúdo em várias para plataformas diferentes.', 'Um vídeo sobre como escolher um bolo de casamento vira um Reel, um post no Google, um e-mail e três imagens com frases.'],
  },
  {
    id: 'algorithm',
    category: 'social',
    en: ['Algorithm', 'The system a platform uses to decide which posts to show to whom, mostly based on what people watch, like and share.', 'A Reel that people watch to the end gets shown to more people by Instagram’s algorithm.'],
    es: ['Algoritmo', 'El sistema que usa una plataforma para decidir qué publicaciones mostrar y a quién, sobre todo según lo que la gente ve, le gusta y comparte.', 'Un Reel que la gente ve hasta el final se muestra a más personas por el algoritmo de Instagram.'],
    pt: ['Algoritmo', 'O sistema que a plataforma usa para decidir quais posts mostrar e para quem, principalmente com base no que as pessoas assistem, curtem e compartilham.', 'Um Reel que as pessoas assistem até o fim é mostrado para mais gente pelo algoritmo do Instagram.'],
  },
  {
    id: 'hook',
    category: 'social',
    en: ['Hook', 'The first line or first seconds of a post or video, which decide whether people keep watching.', '“Stop paying $80 for oil changes” as the first words of a mechanic’s video.'],
    es: ['Gancho (hook)', 'La primera frase o los primeros segundos de una publicación o video, que deciden si la gente sigue mirando.', '“Deja de pagar $80 por un cambio de aceite” como primeras palabras del video de un mecánico.'],
    pt: ['Gancho (hook)', 'A primeira frase ou os primeiros segundos de um post ou vídeo, que decidem se a pessoa continua assistindo.', '“Pare de pagar US$ 80 na troca de óleo” como primeiras palavras do vídeo de um mecânico.'],
  },

  // ---- Email & text
  {
    id: 'opt-in',
    category: 'email',
    en: ['Opt-in', 'Clear permission from a person to receive marketing emails or texts. Texts in particular need written consent under US law.', 'A checkbox at checkout: “Text me offers and reminders. Reply STOP to unsubscribe.”'],
    es: ['Opt-in (consentimiento)', 'Permiso claro de una persona para recibir correos o mensajes de marketing. Los mensajes de texto en EE. UU. necesitan consentimiento por escrito.', 'Una casilla al pagar: “Envíenme ofertas y recordatorios por texto. Responde STOP para darte de baja.”'],
    pt: ['Opt-in (consentimento)', 'Permissão clara da pessoa para receber e-mails ou mensagens de marketing. Mensagens de texto nos EUA exigem consentimento por escrito.', 'Uma caixinha no pagamento: “Quero receber ofertas e lembretes por mensagem. Responda STOP para sair.”'],
  },
  {
    id: 'open-rate',
    category: 'email',
    en: ['Open rate', 'The share of recipients who opened an email. Some email apps make this number less exact than it looks, so clicks and replies matter more.', '1,000 emails sent, 350 opened: a 35% open rate.'],
    es: ['Tasa de apertura', 'La proporción de destinatarios que abrió un correo. Algunas apps de correo hacen que este número sea menos exacto de lo que parece, así que importan más los clics y las respuestas.', '1,000 correos enviados, 350 abiertos: una tasa de apertura del 35%.'],
    pt: ['Taxa de abertura', 'A proporção de destinatários que abriu um e-mail. Alguns apps de e-mail deixam esse número menos exato do que parece, então cliques e respostas importam mais.', '1.000 e-mails enviados, 350 abertos: taxa de abertura de 35%.'],
  },
  {
    id: 'drip',
    category: 'email',
    en: ['Drip sequence', 'A series of emails or texts sent automatically over days or weeks after someone signs up or buys.', 'New gym members get a welcome email on day 1, a class guide on day 3 and a check-in on day 14.'],
    es: ['Secuencia automática (drip)', 'Una serie de correos o mensajes que se envían solos durante días o semanas después de que alguien se registra o compra.', 'Los nuevos socios de un gimnasio reciben un correo de bienvenida el día 1, una guía de clases el día 3 y un seguimiento el día 14.'],
    pt: ['Sequência automática (drip)', 'Uma série de e-mails ou mensagens enviados automaticamente ao longo de dias ou semanas depois que alguém se cadastra ou compra.', 'Novos alunos da academia recebem um e-mail de boas-vindas no dia 1, um guia de aulas no dia 3 e um acompanhamento no dia 14.'],
  },
  {
    id: 'segmentation',
    category: 'email',
    en: ['Segmentation', 'Splitting a contact list into groups so each group gets messages that fit it.', 'A pet store sends dog food offers only to dog owners, and cat offers only to cat owners.'],
    es: ['Segmentación de lista', 'Dividir una lista de contactos en grupos para que cada grupo reciba mensajes que le correspondan.', 'Una tienda de mascotas envía ofertas de comida para perro solo a dueños de perros, y de gato solo a dueños de gatos.'],
    pt: ['Segmentação de lista', 'Dividir uma lista de contatos em grupos para que cada grupo receba mensagens que façam sentido para ele.', 'Um pet shop manda ofertas de ração de cachorro só para donos de cães, e de gato só para donos de gatos.'],
  },

  // ---- AI
  {
    id: 'llm',
    category: 'ai',
    en: ['Large language model (LLM)', 'The kind of AI behind ChatGPT, Claude and Gemini: trained on huge amounts of text to predict the next word, which lets it write and answer questions.', 'Asking Claude to turn your notes into a Google post uses an LLM.'],
    es: ['Modelo de lenguaje grande (LLM)', 'El tipo de IA detrás de ChatGPT, Claude y Gemini: entrenado con enormes cantidades de texto para predecir la siguiente palabra, lo que le permite escribir y responder preguntas.', 'Pedirle a Claude que convierta tus notas en una publicación de Google usa un LLM.'],
    pt: ['Modelo de linguagem grande (LLM)', 'O tipo de IA por trás do ChatGPT, do Claude e do Gemini: treinado com enormes quantidades de texto para prever a próxima palavra, o que permite escrever e responder perguntas.', 'Pedir ao Claude para transformar suas anotações em um post do Google usa um LLM.'],
  },
  {
    id: 'generative-ai',
    category: 'ai',
    en: ['Generative AI', 'AI that creates something new: text, images, audio or video.', 'Writing ten caption ideas for a new menu item.'],
    es: ['IA generativa', 'IA que crea algo nuevo: texto, imágenes, audio o video.', 'Escribir diez ideas de texto para un platillo nuevo del menú.'],
    pt: ['IA generativa', 'IA que cria algo novo: texto, imagem, áudio ou vídeo.', 'Escrever dez ideias de legenda para um prato novo do cardápio.'],
  },
  {
    id: 'predictive-ai',
    category: 'ai',
    en: ['Predictive AI', 'AI that scores or forecasts, like which lead is likely to buy or who should see an ad.', 'Google Ads deciding which searchers are most likely to call a plumber.'],
    es: ['IA predictiva', 'IA que califica o pronostica, como qué lead tiene más probabilidad de comprar o quién debería ver un anuncio.', 'Google Ads decidiendo qué personas tienen más probabilidad de llamar a un plomero.'],
    pt: ['IA preditiva', 'IA que dá notas ou faz previsões, como qual lead tem mais chance de comprar ou quem deve ver um anúncio.', 'O Google Ads decidindo quem tem mais chance de ligar para um encanador.'],
  },
  {
    id: 'prompt',
    category: 'ai',
    en: ['Prompt', 'The instructions you give an AI tool. Clearer prompts with context and examples get better results.', '“Write a 100-word Google post for Brancato Barbershop about our new Sunday hours, friendly tone, no emojis.”'],
    es: ['Prompt (instrucción)', 'Las instrucciones que le das a una herramienta de IA. Un prompt más claro, con contexto y ejemplos, da mejores resultados.', '“Escribe una publicación de Google de 100 palabras para Brancato Barbershop sobre el nuevo horario del domingo, tono cercano, sin emojis.”'],
    pt: ['Prompt (instrução)', 'As instruções que você dá a uma ferramenta de IA. Prompts mais claros, com contexto e exemplos, dão resultados melhores.', '“Escreva um post do Google de 100 palavras para a Brancato Barbershop sobre o novo horário de domingo, tom simpático, sem emojis.”'],
  },
  {
    id: 'few-shot',
    category: 'ai',
    en: ['Few-shot prompting', 'Including a few examples of what you want in the prompt, so the AI copies the style.', 'Pasting three of the owner’s best review replies before asking AI to write a new one.'],
    es: ['Prompt con ejemplos (few-shot)', 'Incluir algunos ejemplos de lo que quieres en el prompt, para que la IA copie el estilo.', 'Pegar tres de las mejores respuestas a reseñas del dueño antes de pedirle a la IA que escriba una nueva.'],
    pt: ['Prompt com exemplos (few-shot)', 'Incluir alguns exemplos do que você quer no prompt, para a IA copiar o estilo.', 'Colar três das melhores respostas a avaliações do dono antes de pedir para a IA escrever uma nova.'],
  },
  {
    id: 'prompt-library',
    category: 'ai',
    en: ['Prompt library', 'A shared, organized collection of prompts that work, so the team doesn’t start from scratch each time.', 'A Google Doc with tested prompts for posts, review replies, emails and ad ideas.'],
    es: ['Biblioteca de prompts', 'Una colección ordenada y compartida de prompts que funcionan, para que el equipo no empiece de cero cada vez.', 'Un documento de Google con prompts probados para publicaciones, respuestas a reseñas, correos e ideas de anuncios.'],
    pt: ['Biblioteca de prompts', 'Uma coleção organizada e compartilhada de prompts que funcionam, para a equipe não começar do zero toda vez.', 'Um Google Docs com prompts testados para posts, respostas a avaliações, e-mails e ideias de anúncios.'],
  },
  {
    id: 'hallucination',
    category: 'ai',
    en: ['Hallucination', 'When AI states something false with confidence, like a made-up statistic, quote or source.', 'AI writes that a bakery “has won Best of Boston three years running”. It never has.'],
    es: ['Alucinación', 'Cuando la IA afirma algo falso con seguridad, como una estadística, una cita o una fuente inventada.', 'La IA escribe que una panadería “ganó Best of Boston tres años seguidos”. Nunca lo ganó.'],
    pt: ['Alucinação', 'Quando a IA afirma algo falso com confiança, como uma estatística, uma citação ou uma fonte inventada.', 'A IA escreve que uma padaria “ganhou o Best of Boston três anos seguidos”. Nunca ganhou.'],
  },
  {
    id: 'context-window',
    category: 'ai',
    en: ['Context window', 'How much text an AI can consider at once, including your instructions, anything you paste in and its reply.', 'You can paste a whole month of reviews into most tools today, but a 300-page manual may be too long.'],
    es: ['Ventana de contexto', 'Cuánto texto puede tener en cuenta una IA a la vez, incluidas tus instrucciones, lo que pegas y su respuesta.', 'Hoy puedes pegar un mes entero de reseñas en la mayoría de las herramientas, pero un manual de 300 páginas puede ser demasiado.'],
    pt: ['Janela de contexto', 'Quanto texto a IA consegue considerar de uma vez, incluindo suas instruções, o que você cola e a resposta dela.', 'Hoje dá para colar um mês inteiro de avaliações na maioria das ferramentas, mas um manual de 300 páginas pode ser demais.'],
  },
  {
    id: 'token',
    category: 'ai',
    en: ['Token', 'The small pieces of text AI tools read and write, roughly three-quarters of a word each. Usage limits and prices are counted in tokens.', 'A 750-word blog post is roughly 1,000 tokens.'],
    es: ['Token', 'Los pedacitos de texto que leen y escriben las herramientas de IA, más o menos tres cuartos de palabra cada uno. Los límites y precios se cuentan en tokens.', 'Un artículo de 750 palabras son aproximadamente 1,000 tokens.'],
    pt: ['Token', 'Os pedacinhos de texto que as ferramentas de IA leem e escrevem, mais ou menos três quartos de palavra cada. Limites e preços são contados em tokens.', 'Um artigo de 750 palavras tem cerca de 1.000 tokens.'],
  },
  {
    id: 'chatbot',
    category: 'ai',
    en: ['AI chatbot', 'A chat window on a website or app that answers questions automatically, and should hand off to a person when needed.', 'A rental company’s chatbot answers “Do you deliver to Logan Airport?” at 11 p.m. and collects the lead’s phone number.'],
    es: ['Chatbot con IA', 'Una ventana de chat en un sitio o app que responde preguntas sola, y que debe pasar a una persona cuando hace falta.', 'El chatbot de una empresa de alquiler responde “¿Entregan en el aeropuerto Logan?” a las 11 p. m. y guarda el teléfono del lead.'],
    pt: ['Chatbot com IA', 'Uma janela de chat no site ou app que responde perguntas sozinha, e deve passar para uma pessoa quando necessário.', 'O chatbot de uma locadora responde “Vocês entregam no aeroporto Logan?” às 23h e guarda o telefone do lead.'],
  },
  {
    id: 'human-in-the-loop',
    category: 'ai',
    en: ['Human in the loop', 'A person checks and approves AI work before it reaches customers.', 'AI drafts review replies each morning; the owner reads and approves them before they’re posted.'],
    es: ['Humano en el proceso', 'Una persona revisa y aprueba el trabajo de la IA antes de que llegue a los clientes.', 'La IA redacta respuestas a reseñas cada mañana; el dueño las lee y las aprueba antes de publicarlas.'],
    pt: ['Humano no processo', 'Uma pessoa confere e aprova o trabalho da IA antes de chegar aos clientes.', 'A IA escreve respostas às avaliações toda manhã; o dono lê e aprova antes de publicar.'],
  },

  // ---- Automation
  {
    id: 'workflow',
    category: 'automation',
    en: ['Workflow', 'A set of steps that run in order, often automatically, to finish a task.', 'New web lead → add to CRM → text the owner → send the lead a welcome text.'],
    es: ['Flujo de trabajo (workflow)', 'Una serie de pasos que se ejecutan en orden, muchas veces solos, para terminar una tarea.', 'Nuevo lead web → agregarlo al CRM → avisar al dueño por texto → enviarle al lead un mensaje de bienvenida.'],
    pt: ['Fluxo de trabalho (workflow)', 'Uma série de passos que rodam em ordem, muitas vezes sozinhos, para concluir uma tarefa.', 'Novo lead do site → adicionar ao CRM → avisar o dono por mensagem → mandar uma mensagem de boas-vindas ao lead.'],
  },
  {
    id: 'trigger',
    category: 'automation',
    en: ['Trigger', 'The event that starts an automation.', 'A new form submission, a new booking or a new 1-star review.'],
    es: ['Disparador (trigger)', 'El evento que pone en marcha una automatización.', 'Un formulario nuevo, una reserva nueva o una reseña nueva de una estrella.'],
    pt: ['Gatilho (trigger)', 'O evento que inicia uma automação.', 'Um novo formulário, um novo agendamento ou uma nova avaliação de uma estrela.'],
  },
  {
    id: 'action',
    category: 'automation',
    en: ['Action', 'A step an automation does after the trigger.', 'Add a row to a Google Sheet, send an email, or ask AI to summarize the message.'],
    es: ['Acción', 'Un paso que hace la automatización después del disparador.', 'Agregar una fila a una hoja de Google, enviar un correo o pedirle a la IA que resuma el mensaje.'],
    pt: ['Ação', 'Um passo que a automação faz depois do gatilho.', 'Adicionar uma linha em uma planilha do Google, mandar um e-mail ou pedir para a IA resumir a mensagem.'],
  },
  {
    id: 'zapier',
    category: 'automation',
    en: ['Zapier, Make and n8n', 'Popular tools for connecting apps and building automations without writing code. In Zapier an automation is called a Zap.', 'A Zap that saves every new Facebook lead to a Google Sheet and texts the owner.'],
    es: ['Zapier, Make y n8n', 'Herramientas populares para conectar apps y crear automatizaciones sin programar. En Zapier una automatización se llama Zap.', 'Un Zap que guarda cada nuevo lead de Facebook en una hoja de Google y le avisa al dueño por texto.'],
    pt: ['Zapier, Make e n8n', 'Ferramentas populares para conectar apps e criar automações sem programar. No Zapier uma automação se chama Zap.', 'Um Zap que salva cada novo lead do Facebook em uma planilha do Google e avisa o dono por mensagem.'],
  },
  {
    id: 'webhook',
    category: 'automation',
    en: ['Webhook', 'A way for one app to instantly send data to another the moment something happens.', 'When a customer pays, the payment app sends a webhook to the website, which marks the order as paid.'],
    es: ['Webhook', 'Una forma en que una app le envía datos al instante a otra en cuanto pasa algo.', 'Cuando un cliente paga, la app de pagos envía un webhook al sitio, que marca el pedido como pagado.'],
    pt: ['Webhook', 'Um jeito de um app mandar dados na hora para outro assim que algo acontece.', 'Quando o cliente paga, o app de pagamento manda um webhook para o site, que marca o pedido como pago.'],
  },
  {
    id: 'api',
    category: 'automation',
    en: ['API', 'A standard way for software to talk to other software. Automations use APIs to read and write data in apps.', 'The website uses Google’s API to add each new lead to a Google Sheet.'],
    es: ['API', 'Una forma estándar para que un programa hable con otro. Las automatizaciones usan APIs para leer y escribir datos en las apps.', 'El sitio usa la API de Google para agregar cada nuevo lead a una hoja de Google.'],
    pt: ['API', 'Um jeito padrão de um software conversar com outro. As automações usam APIs para ler e gravar dados nos apps.', 'O site usa a API do Google para adicionar cada novo lead a uma planilha do Google.'],
  },
  {
    id: 'nfc',
    category: 'automation',
    en: ['NFC', 'Near-field communication: the tap technology in phones. An NFC card or sticker opens a link when a phone touches it, with no app needed.', 'A customer taps their phone on a card at the counter and the Google review box opens.'],
    es: ['NFC', 'Comunicación de campo cercano: la tecnología de “tocar” de los celulares. Una tarjeta o sticker NFC abre un enlace cuando un celular la toca, sin necesidad de app.', 'Un cliente acerca su celular a una tarjeta en el mostrador y se abre el cuadro de reseña de Google.'],
    pt: ['NFC', 'Comunicação por campo de proximidade: a tecnologia de “encostar” dos celulares. Um cartão ou adesivo NFC abre um link quando o celular encosta, sem precisar de app.', 'O cliente encosta o celular em um cartão no balcão e abre a caixa de avaliação do Google.'],
  },

  // ---- Analytics
  {
    id: 'ctr',
    category: 'analytics',
    en: ['Click-through rate (CTR)', 'The share of people who clicked out of everyone who saw the ad, link or search result.', '3 clicks for every 100 people who saw the ad: a 3% CTR.'],
    es: ['Tasa de clics (CTR)', 'La proporción de personas que hicieron clic entre todas las que vieron el anuncio, enlace o resultado.', '3 clics por cada 100 personas que vieron el anuncio: un CTR del 3%.'],
    pt: ['Taxa de cliques (CTR)', 'A proporção de pessoas que clicaram entre todas que viram o anúncio, link ou resultado.', '3 cliques a cada 100 pessoas que viram o anúncio: CTR de 3%.'],
  },
  {
    id: 'bounce-rate',
    category: 'analytics',
    en: ['Bounce rate', 'The share of visitors who leave a website without doing anything else. In Google Analytics 4 the opposite, “engagement rate”, is used more.', 'Most visitors leave the landing page within seconds: the headline or the load time needs work.'],
    es: ['Tasa de rebote', 'La proporción de visitantes que se van del sitio sin hacer nada más. En Google Analytics 4 se usa más lo contrario, la “tasa de interacción”.', 'La mayoría se va de la página en segundos: hay que mejorar el título o la velocidad de carga.'],
    pt: ['Taxa de rejeição', 'A proporção de visitantes que saem do site sem fazer mais nada. No Google Analytics 4 se usa mais o oposto, a “taxa de engajamento”.', 'A maioria sai da página em segundos: é preciso melhorar o título ou a velocidade.'],
  },
  {
    id: 'utm',
    category: 'analytics',
    en: ['UTM parameters', 'Tags added to the end of a link to show where a visitor came from.', 'A flyer’s QR code links to …/audit?utm_source=flyer, so the website knows those visits came from the flyer.'],
    es: ['Parámetros UTM', 'Etiquetas que se agregan al final de un enlace para saber de dónde vino un visitante.', 'El código QR de un volante lleva a …/audit?utm_source=volante, así el sitio sabe que esas visitas vinieron del volante.'],
    pt: ['Parâmetros UTM', 'Etiquetas no fim de um link para saber de onde o visitante veio.', 'O QR code de um panfleto leva para …/audit?utm_source=panfleto, assim o site sabe que essas visitas vieram do panfleto.'],
  },
  {
    id: 'attribution',
    category: 'analytics',
    en: ['Attribution', 'Deciding which marketing gets credit for a sale when the customer saw several things first.', 'A customer saw an Instagram ad, then searched on Google, then booked. Which one gets the credit?'],
    es: ['Atribución', 'Decidir qué acción de marketing se lleva el crédito de una venta cuando el cliente vio varias cosas antes.', 'Un cliente vio un anuncio en Instagram, luego buscó en Google y después reservó. ¿A cuál le toca el crédito?'],
    pt: ['Atribuição', 'Decidir qual ação de marketing leva o crédito por uma venda quando o cliente viu várias coisas antes.', 'Um cliente viu um anúncio no Instagram, depois pesquisou no Google e então agendou. Quem leva o crédito?'],
  },
  {
    id: 'kpi',
    category: 'analytics',
    en: ['KPI', 'Key performance indicator: a number chosen to show whether a goal is being met.', 'A salon’s KPIs: bookings per week, rebooking rate and new reviews per month.'],
    es: ['KPI', 'Indicador clave de desempeño: un número elegido para saber si se está cumpliendo una meta.', 'Los KPI de un salón: reservas por semana, tasa de clientes que repiten y reseñas nuevas por mes.'],
    pt: ['KPI', 'Indicador-chave de desempenho: um número escolhido para mostrar se uma meta está sendo cumprida.', 'Os KPIs de um salão: agendamentos por semana, taxa de retorno e novas avaliações por mês.'],
  },
  {
    id: 'north-star',
    category: 'analytics',
    en: ['North Star metric', 'The one number that best shows whether the business is succeeding right now. Everything else supports it.', 'For a new auto shop: booked appointments per week.'],
    es: ['Métrica Estrella del Norte', 'El número que mejor muestra si el negocio va bien ahora mismo. Todo lo demás lo apoya.', 'Para un taller nuevo: citas reservadas por semana.'],
    pt: ['Métrica Estrela do Norte', 'O número que melhor mostra se o negócio está indo bem agora. Todo o resto apoia esse número.', 'Para uma oficina nova: agendamentos por semana.'],
  },
  {
    id: 'vanity-metric',
    category: 'analytics',
    en: ['Vanity metric', 'A number that looks good but doesn’t help make decisions or show sales.', '10,000 followers is nice, but calls and bookings tell you more.'],
    es: ['Métrica de vanidad', 'Un número que se ve bien pero no ayuda a decidir ni muestra ventas.', '10,000 seguidores suena bien, pero las llamadas y reservas dicen mucho más.'],
    pt: ['Métrica de vaidade', 'Um número que parece bom mas não ajuda a decidir nem mostra vendas.', '10.000 seguidores é legal, mas ligações e agendamentos dizem muito mais.'],
  },
  {
    id: 'ga4',
    category: 'analytics',
    en: ['Google Analytics (GA4)', 'Google’s free tool that shows who visits a website, where they came from and what they did.', 'GA4 shows that most bookings come from people who first found the site on Google Maps.'],
    es: ['Google Analytics (GA4)', 'La herramienta gratuita de Google que muestra quién visita un sitio, de dónde vino y qué hizo.', 'GA4 muestra que la mayoría de las reservas vienen de personas que encontraron el sitio en Google Maps.'],
    pt: ['Google Analytics (GA4)', 'A ferramenta gratuita do Google que mostra quem visita o site, de onde veio e o que fez.', 'O GA4 mostra que a maioria dos agendamentos vem de quem achou o site pelo Google Maps.'],
  },
];

export function getTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((g) => g.id === id);
}

export function toLocale(locale: string): Locale {
  return locale === 'es' || locale === 'pt' ? locale : 'en';
}
