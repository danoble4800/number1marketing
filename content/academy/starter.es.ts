// Guía N°1 para Empezar con IA: rutas para principiantes, en español. Misma estructura que starter.ts.
import type { CourseModule } from './lessons';

export const starter: CourseModule[] = [
  {
    number: '09',
    summary:
      'Empieza aquí si nunca has usado IA. Ten tu primera conversación con un asistente de IA y úsalo para escribir correos y mensajes del día a día, incluidos los difíciles.',
    lessons: [
      {
        slug: 'your-first-ai-chat',
        title: 'Tu primera conversación con un asistente de IA',
        minutes: 10,
        body: `
Un [[asistente de IA|ai-assistant]] es una página web o una app con la que hablas en lenguaje normal. Escribes (o dices) lo que necesitas y te responde. Los más conocidos son **ChatGPT**, **Claude** y **Gemini**. Los tres tienen versión gratuita y cualquiera sirve para esta guía.

## Cómo empezar

1. Entra en chatgpt.com, claude.ai o gemini.google.com (o descarga la app)
2. Regístrate con tu correo o tu cuenta de Google
3. Escribe una pregunta en la caja de abajo, como si fuera un mensaje de texto

Eso es todo. No hay un idioma especial que aprender.

## Cómo pedir para que te sirva

Háblale como a un asistente nuevo e inteligente que todavía no sabe nada de ti:

- **Di quién eres:** "Tengo una pequeña empresa de limpieza" o "Soy enfermera y estoy planeando un viaje".
- **Di qué necesitas:** "Escribe un correo corto para…", "Explícame…", "Dame cinco ideas para…"
- **Di cómo lo quieres:** "amable, de menos de 100 palabras, sin tecnicismos".

## Es una conversación

La primera respuesta casi nunca es la mejor. Respóndele para mejorarla: "más corto", "más informal", "desarrolla la segunda idea", "explícamelo como si fuera nuevo en esto". Puedes seguir todo lo que quieras.

## Tres reglas desde el primer día

- **Comprueba los datos.** La IA puede sonar segura y aun así equivocarse. (A esto se le llama [[alucinación|hallucination]]).
- **No pegues secretos.** Nada de contraseñas, números de tarjeta ni datos privados de otras personas.
- **Tú eres el editor.** Lee todo antes de enviarlo o usarlo.

> ¿Quieres aprender a pedir mejor? El Módulo 03 (Ingeniería de prompts) del Curso de Marketing con IA profundiza en eso. Por ahora, basta con hablar normal.
`,
        tryIt: `Abre cualquier asistente de IA y escribe: "Soy nuevo en la IA. En cinco puntos cortos, ¿en qué me podrías ayudar esta semana? Yo [describe tu trabajo o tu día en una frase]". Luego responde a uno de los puntos con "muéstrame cómo".`,
      },
      {
        slug: 'everyday-emails',
        title: 'Correos y mensajes en la mitad del tiempo',
        minutes: 12,
        body: `
La mayoría de la gente pasa horas a la semana escribiendo mensajes. La IA lo hace muy bien, siempre que tú pongas los datos y ella ponga las palabras.

## Cinco usos para hoy mismo

- **De notas a correo:** escribe tres ideas sueltas y pide: "Convierte esto en un correo educado para mi casero".
- **Borradores de respuesta:** pega un mensaje que recibiste y pide: "Redacta una respuesta que diga sí al martes y no al jueves".
- **Ajustar el tono:** "Que suene más amable", "menos insistente" o "más profesional".
- **Acortar:** "Déjalo en tres frases sin perder lo importante".
- **Traducir:** "Escríbelo en inglés sencillo para un cliente" y, si es importante, pide a un hablante nativo que lo revise.

## Dale los datos, no solo el tema

Un pedido vago ("escribe un correo sobre el retraso") da un correo vago. Un buen pedido dice para quién es, qué pasó, qué quieres que hagan y el tono:

"Escribe un correo corto a un cliente. Su pedido va dos días tarde porque nuestro proveedor se retrasó. Pide disculpas una vez, da la nueva fecha (viernes) y ofrece envío gratis. Cálido, sin exagerar".

## Que suene a ti

A la IA le encantan frases como "espero que se encuentre muy bien". Si no hablas así, díselo: "Escribe como una persona real que le manda un mensaje a un cliente. Sin palabras rebuscadas". También puedes pegar un correo tuyo y pedir: "Imita este estilo".

> Las publicaciones en redes y los correos de marketing tienen su propio módulo: el Módulo 04 (Estrategia de contenido con IA) trata de escribir para un público a escala. Esta lección es sobre los mensajes que envías a una sola persona.
`,
        tryIt: `Busca un correo o mensaje que llevas días posponiendo. Pégalo en un asistente de IA (sin nombres ni teléfonos) y pide: "Redacta una respuesta corta y amable que diga [lo que quieres decir]". Cambia una línea para que suene a ti y envíalo.`,
      },
      {
        slug: 'hard-messages',
        title: 'Conversaciones difíciles y cartas importantes',
        minutes: 12,
        body: `
Los mensajes que más posponemos suelen ser los difíciles: decir que no, pedir dinero, disculparse, quejarse. La IA no siente vergüenza por ti, así que es una gran compañera para el primer borrador.

## Buenos usos

- **Decir que no:** "Ayúdame a rechazar esta petición con amabilidad y sin inventar excusas".
- **Cobrar:** "Escribe un recordatorio firme pero educado de una factura con 30 días de retraso".
- **Quejas:** "Ayúdame a escribir una queja clara a mi compañía de teléfono. Esto fue lo que pasó…"
- **Disculpas:** "Ayúdame a disculparme por no cumplir el plazo sin dar demasiadas explicaciones".
- **Cartas importantes:** cartas de presentación, cartas a la escuela, una solicitud de referencia.

## Ensaya la conversación antes

Si la conversación difícil es en persona o por teléfono, pide a la IA que haga del otro: "Haz de mi casero y no quieres arreglar la calefacción. Voy a practicar cómo pedírtelo". Después pregunta: "¿Cómo podría haberlo dicho mejor?".

## Tu criterio manda

- **Los datos los pones tú.** Nunca dejes que la IA invente fechas, cantidades o lo que alguien dijo.
- **Léelo en voz alta.** Si suena rígido o largo, pide una versión más sencilla.
- **En temas legales, médicos o de dinero,** usa la IA para ordenar tus ideas y consulta con un profesional antes de enviar algo importante.

> Un buen hábito: antes de enviar, pregunta "¿Qué podría sentir la otra persona al leer esto?".
`,
        tryIt: `Piensa en un "no" que tienes que decir. Pídele a un asistente de IA: "Ayúdame a decir que no a [la petición] en dos o tres frases claras y amables. Sin excusas inventadas". Elige la versión que más te guste y guárdala.`,
      },
    ],
    exercise: {
      title: 'Ejercicio: Despacha tres mensajes',
      body: `
Elige tres mensajes que estás evitando: uno fácil, uno largo y uno difícil.

1. Para cada uno, escribe primero los datos en viñetas: para quién es, qué pasó, qué quieres
2. Pide un borrador a tu asistente de IA y luego una mejora ("más corto", "más cálido", "más firme")
3. Edita cada borrador para que suene a ti y comprueba cada dato
4. Envía los tres hoy
5. Anota cuánto tardaste más o menos, comparado con hacerlo tú solo
`,
    },
    checklist: [
      'Regístrate en un asistente de IA gratuito (ChatGPT, Claude o Gemini)',
      'Hazle una pregunta sobre tu trabajo y otra sobre tu vida',
      'Úsalo para redactar la respuesta a un correo o mensaje real, edítala y envíala',
      'Úsalo para reescribir un mensaje con otro tono',
      'Ensaya una conversación difícil pidiéndole a la IA que haga de la otra persona',
    ],
  },
  {
    number: '10',
    summary:
      'Descubre lo que la IA puede crear hoy, desde imágenes y fotos editadas hasta videos cortos y locuciones, y cómo usarla con honestidad.',
    lessons: [
      {
        slug: 'what-ai-can-make',
        title: 'Lo que la IA puede crear hoy',
        minutes: 12,
        body: `
Hace unos años, una imagen o un video a medida exigía contratar a alguien o aprender programas complicados. Ahora puedes describir lo que quieres en una frase.

## Lo que ya se puede hacer

- **Imágenes a partir de una descripción:** un [[generador de imágenes|image-generator]] crea una imagen nueva a partir de palabras, como "una cafetería acogedora en una mañana de lluvia, estilo acuarela".
- **Edición de fotos:** quitar el fondo, borrar a un desconocido, corregir la luz o ampliar una foto para que encaje en otro formato.
- **Videos cortos:** convertir una imagen o una descripción en unos segundos de video, o cortar un video largo en clips cortos automáticamente.
- **Subtítulos:** añadirlos a cualquier video con un par de clics.
- **Locuciones:** convertir un guion escrito en una voz natural ([[IA de voz|voice-ai]]).
- **Diseños:** volantes, invitaciones, menús y gráficos para redes a partir de una plantilla y una descripción.

## Dónde probarlo

No necesitas programas especiales para empezar. ChatGPT y Gemini pueden crear y editar imágenes dentro del chat. Canva y Adobe Firefly traen herramientas de IA, y apps del teléfono como CapCut hacen subtítulos y ediciones rápidas. Muchas de estas herramientas son [[multimodales|multimodal]]: puedes mostrarles una foto y hacerles preguntas sobre ella.

## En qué todavía falla

- Escribir palabras dentro de las imágenes (revisa siempre carteles y etiquetas)
- Manos, multitudes y detalles pequeños
- Mantener idéntica a la misma persona o producto en muchas imágenes
- Mostrar tu producto, local o equipo *reales*. La IA solo puede adivinar cómo son.

> Regla práctica: usa la IA para ideas, fondos e ilustraciones. Usa fotos reales para cosas reales.
`,
        tryIt: `Pídele a ChatGPT o Gemini: "Crea una imagen de [algo que te encante] al estilo de una ilustración de cuento infantil". Luego pide un cambio, como otro color, otra hora del día u otro ángulo, y compara las dos.`,
      },
      {
        slug: 'describing-images',
        title: 'Cómo describir lo que quieres',
        minutes: 12,
        body: `
Las herramientas de imagen siguen tus palabras al pie de la letra. Un pedido vago da una imagen genérica; uno claro da algo que puedes usar.

## La descripción en cinco partes

1. **Tema:** qué aparece ("un golden retriever con gorro de fiesta")
2. **Lugar:** dónde está ("en el porche de una casa con globos")
3. **Estilo:** foto, acuarela, dibujo animado, ilustración plana, 3D
4. **Luz y ambiente:** luminoso y alegre, luz suave de tarde, dramático
5. **Formato y uso:** cuadrado para Instagram, vertical para el teléfono, horizontal para un banner

"Un golden retriever con gorro de fiesta en el porche de una casa con globos, estilo dibujo animado luminoso, alegre, cuadrado" funciona mucho mejor que "foto de perro de cumpleaños".

## Edita, no empieces de cero

Cuando la imagen esté cerca, pide cambios pequeños: "globos azules", "quita el texto", "aleja un poco la cámara". La mayoría de las herramientas mantiene igual el resto de la imagen.

## Editar tus propias fotos

Para cualquier cosa real, empieza con tu propia foto y deja que la IA la mejore:

- "Quita el fondo y pon este producto sobre blanco liso".
- "Dale más luz a esta foto y que los colores se vean naturales".
- "Amplía esta foto por los lados para que quepa en un banner horizontal".

## Videos cortos

Con el video funciona igual: describe la escena, el movimiento ("acercamiento lento", "la cámara gira a la izquierda") y la duración. Para videos en los que alguien habla, escribe primero el guion y usa la IA para subtítulos, recortes y música de fondo.

> Guarda las descripciones que funcionan. La próxima vez solo tendrás que cambiar unas palabras.
`,
        tryIt: `Haz una foto de algo que tengas en la mesa. Súbela a ChatGPT, Gemini o Canva y pide: "Quita el fondo y pon esto sobre una superficie clara y limpia con luz de día suave". Revisa si cambió algo del objeto.`,
      },
      {
        slug: 'honest-visuals',
        title: 'Usar imágenes y videos con IA de forma honesta',
        minutes: 10,
        body: `
La IA hace muy fácil crear cosas que parecen reales. Eso es poderoso y conlleva responsabilidad.

## No falsees lo que el cliente da por cierto

- Nunca muestres un producto, plato, espacio o resultado que en realidad no se vea así.
- Nunca crees "clientes", fotos de "antes y después" ni testimonios que no sean reales.
- Si una imagen es una ilustración o una maqueta, puedes usarla. Solo no la hagas pasar por una foto real.

## Las personas reales necesitan permiso real

Un [[deepfake|deepfake]] es un video, audio o imagen hecho con IA que muestra a una persona real haciendo o diciendo algo que no hizo. Nunca copies la cara o la voz de alguien sin permiso claro, ya sea una persona famosa, tu equipo o tu familia. En muchos lugares ya hay leyes sobre esto.

## Revisa las reglas de donde publicas

Algunas plataformas piden etiquetar imágenes o videos hechos con IA, y algunas herramientas limitan lo que puedes crear o su uso comercial. Lee las condiciones antes de usar imágenes con IA en anuncios o productos.

## Cómo detectar falsificaciones

Cada año verás más contenido hecho con IA. Antes de creer o compartir algo sorprendente:

- Busca detalles raros: manos, textos, joyas, reflejos, fondos que no tienen sentido
- Revisa la fuente: ¿quién lo publicó primero?
- Busca la imagen (por ejemplo, con Google Lens) para ver dónde más aparece
- Ten especial cuidado con mensajes de voz urgentes que piden dinero, aunque la voz suene conocida

> Si te daría vergüenza que alguien descubriera que está hecho con IA, no lo uses de esa manera.
`,
        tryIt: `Abre Google Lens (en la app de Google o en Chrome) y busca con alguna imagen viral que hayas visto esta semana. Mira dónde más aparece y si alguien la ha puesto en duda. Luego pregúntale a un asistente de IA: "¿Cuáles son tres señales de que una imagen puede estar hecha con IA?".`,
      },
    ],
    exercise: {
      title: 'Ejercicio: Crea un set de tres',
      body: `
Crea tres piezas con IA, cada una con una habilidad distinta de este módulo:

1. **Una imagen nueva:** una tarjeta de cumpleaños, una invitación, un fondo para un volante o una ilustración, usando la descripción en cinco partes
2. **Una foto real editada:** quita un fondo, corrige la luz o amplía los bordes
3. **Un clip corto:** un video de 10 a 20 segundos con subtítulos hechos con IA (vale un video del teléfono)

Para cada una, escribe una frase sobre qué harías distinto la próxima vez. Revisa las tres con honestidad: ¿algo parece real sin serlo?
`,
    },
    checklist: [
      'Crea una imagen a partir de una descripción y pide al menos un cambio',
      'Edita una de tus propias fotos con una herramienta de IA',
      'Añade subtítulos automáticos a un video corto',
      'Guarda dos descripciones de imagen que te funcionaron',
      'Busca en internet una imagen sorprendente antes de creerla o compartirla',
    ],
  },
  {
    number: '11',
    summary:
      'Usa la IA como asistente personal para planificar tu semana, organizar comidas, viajes y presupuestos, pensar decisiones y aprender cosas nuevas más rápido.',
    lessons: [
      {
        slug: 'plan-your-week',
        title: 'Planifica tu semana en diez minutos',
        minutes: 12,
        body: `
Planificar es una de las cosas más útiles que hace la IA y una de las menos conocidas. Tú traes el desorden y ella te ayuda a convertirlo en un plan.

## El método de vaciar la cabeza

1. **Vacía todo:** escribe cada tarea, recado, cita y preocupación que tengas, en cualquier orden. No lo organices.
2. **Añade tus límites:** "Trabajo de 9 a 5 de lunes a viernes, recojo a los niños a las 3:30 los miércoles y después de las 8 de la noche estoy cansado".
3. **Pide un plan:** "Ordena esto en imprescindible esta semana, estaría bien y puede esperar. Luego sugiere qué día hacer cada imprescindible".
4. **Corrige:** "El lunes es demasiado", o "junta todos los recados en una sola salida".

## Que sea realista

La IA no sabe cuánto tardas de verdad en cada cosa. Díselo ("hacer la compra me lleva 90 minutos") y pídele que deje tiempo libre cada día. Un plan sin pausas se derrumba el martes.

## Conectada o no

Por sí solos, la mayoría de los asistentes de IA no ven tu calendario ni tu correo. Algunos pueden si los conectas, y las funciones de IA se están integrando en las apps de Google, Microsoft y Apple. En cualquier caso, mandas tú: la IA sugiere y tú lo pones en el calendario.

> Vacía la cabeza el domingo por la noche o el lunes por la mañana. Diez minutos de planificación ahorran horas de "¿qué tenía que hacer?".
`,
        tryIt: `Escribe en un asistente de IA todo lo que tienes en la cabeza esta semana, una línea por cosa, más tu horario de trabajo. Pide: "Convierte esto en un plan realista para la semana con una hora libre cada día". Pasa al menos una tarea a tu calendario real.`,
      },
      {
        slug: 'everyday-life',
        title: 'Comidas, viajes, presupuestos y grandes decisiones',
        minutes: 12,
        body: `
Cuando te acostumbras a preguntar, descubres que la IA ayuda con las tareas de todos los días que se comen tus tardes.

## Comidas

"Planea cinco cenas fáciles entre semana para una familia de cuatro. Una vegetariana, a nadie le gustan los champiñones y cada una en menos de 30 minutos. Luego dame una sola lista de la compra agrupada por pasillos". También puedes hacerle una foto a la nevera y preguntar qué cocinar.

## Viajes

Dale las fechas, el presupuesto, quién va y qué os gusta, y pide un plan día a día. Luego comprueba tú horarios, precios y tiempos de viaje: la IA puede estar desactualizada o simplemente equivocarse.

## Presupuestos

Describe tus ingresos y gastos mensuales por categorías aproximadas y pide ideas para ahorrar 200 al mes, o ayuda para armar una hoja de presupuesto sencilla. Nunca pegues números de cuenta, contraseñas ni extractos bancarios completos.

## Grandes decisiones

La IA es una compañera paciente para pensar. Prueba:

- "Ayúdame a comparar estas dos ofertas de trabajo. Hazme preguntas primero".
- "¿En qué no estoy pensando antes de comprar un auto usado?"
- "Argumenta en contra de esta decisión para ponerla a prueba".

## Conoce los límites

En temas de salud, legales o de dinero, la IA sirve para entender tus opciones y preparar preguntas. No sustituye a un médico, abogado o contador que conozca tu situación.

> Pregunta "¿Qué debería preguntarle al experto?". Es uno de los usos más valiosos de la IA.
`,
        tryIt: `Pregúntale a un asistente de IA: "Planea tres cenas que pueda hacer esta semana con [tres cosas que ya tienes en la cocina], de menos de 30 minutos cada una, y dame una lista corta de la compra para lo demás". Cocina una.`,
      },
      {
        slug: 'learn-anything',
        title: 'Aprende cualquier cosa más rápido',
        minutes: 10,
        body: `
Piensa en la IA como un tutor que nunca se cansa de tus preguntas.

## Formas de aprender con ella

- **Explícalo fácil:** "Explícame cómo funcionan las hipotecas como si fuera totalmente nuevo. Usa un ejemplo con números reales".
- **Paso a paso:** "Enséñame lo básico de las fórmulas de Excel, una lección cada vez. Espera a que diga 'siguiente'".
- **Ponme a prueba:** "Hazme cinco preguntas sobre lo que acabas de explicar, de una en una, y dime en qué me equivoqué".
- **Resume:** pega un artículo o documento largo y pide los cinco puntos clave, o qué significa para ti.
- **Practica un idioma:** "Tengamos una conversación sencilla en inglés sobre pedir comida. Corrige mis errores con amabilidad".

## Comprueba lo que te dice

La IA explica con claridad incluso cuando se equivoca, así que para lo importante:

- Pregunta: "¿Qué tan seguro estás y dónde puedo comprobarlo?"
- Usa un asistente con búsqueda web para datos recientes y abre las fuentes
- Compara con una fuente de confianza (una web oficial, un libro, un profesional)

## Úsala para entender, no para saltarte el trabajo

Pedirle a la IA que haga tus deberes o un examen del trabajo no te enseña nada y muchas veces rompe las reglas. Pedirle que te explique hasta que lo entiendas es una de las mejores formas de aprender.

> El glosario de la Academia funciona igual: cuando una palabra de IA te confunda, búscala y luego pide a un asistente un ejemplo de tu propia vida.
`,
        tryIt: `Elige algo que siempre quisiste entender (el historial de crédito, cómo funcionan los paneles solares, las reglas de un deporte). Pide: "Explícamelo en lenguaje sencillo en menos de 150 palabras y luego hazme tres preguntas". Respóndelas.`,
      },
    ],
    exercise: {
      title: 'Ejercicio: Tu semana planificada con IA',
      body: `
Pasa una semana entera con la IA como asistente personal:

1. Domingo o lunes: vacía la cabeza y consigue un plan semanal realista
2. Planea las cenas de la semana y una sola lista de la compra
3. Usa la IA para pensar una decisión que llevas tiempo posponiendo
4. Aprende algo nuevo con el método de explicar y preguntar
5. Al final de la semana, anota qué te ayudó y qué vas a seguir haciendo
`,
    },
    checklist: [
      'Vacía la cabeza y conviértelo en un plan semanal',
      'Planea una semana de comidas con una sola lista de la compra',
      'Usa la IA para comparar opciones en una decisión real',
      'Aprende un tema nuevo con el método de explicar y preguntar',
      'Comprueba una respuesta importante de la IA con una fuente de confianza',
    ],
  },
  {
    number: '12',
    summary:
      'Descubre cómo la IA puede responder a tus clientes por chat, mensaje y teléfono de día y de noche, qué nunca debe manejar sola y cómo configurarla para que confíen en ella.',
    lessons: [
      {
        slug: 'what-customers-ask',
        title: 'Qué preguntan tus clientes (y cuándo)',
        minutes: 12,
        body: `
Antes de añadir cualquier IA, averigua con qué necesitan ayuda tus clientes de verdad. La mayoría de los negocios recibe las mismas 15 o 20 preguntas una y otra vez.

## Encuentra tus preguntas principales

Revisa el último mes de correos, mensajes, DMs y llamadas y anota cada pregunta. Algunas típicas:

- ¿Están abiertos ahora? ¿Cuál es el horario?
- ¿Cuánto cuesta?
- ¿Atienden en mi zona?
- ¿Puedo reservar para el sábado?
- ¿Dónde está mi pedido? ¿Cuál es la política de devoluciones?

## Fíjate en cuándo preguntan

Muchas preguntas llegan por la noche y el fin de semana, justo cuando no hay nadie para responder. La gente suele contactar a varios negocios y el primero en responder suele quedarse con el trabajo. Eso es la [[velocidad de respuesta|speed-to-lead]].

## Clasifícalas en tres grupos

1. **Datos simples:** horario, precios, ubicación, políticas. La IA los responde bien.
2. **Acciones simples:** reservar una hora, tomar un recado, enviar un enlace. La IA puede hacerlo con la configuración correcta.
3. **Decisiones:** quejas, reembolsos, emergencias, presupuestos a medida. De esto se encarga una persona.

Esta clasificación será tu plan para las dos próximas lecciones.

> Si no puedes escribir la respuesta, la IA tampoco puede darla. Tu primer trabajo es escribir respuestas claras a tus preguntas principales.
`,
        tryIt: `Pega diez preguntas reales de clientes (sin nombres) en un asistente de IA y pide: "Clasifícalas en datos simples, acciones simples y decisiones. ¿Cuáles tres me ahorrarían más tiempo si se respondieran al instante?".`,
      },
      {
        slug: 'ai-chat-and-phone',
        title: 'Chat con IA y atención telefónica con IA',
        minutes: 15,
        body: `
Hay dos formas principales de que la IA atienda a tus clientes: por chat o mensaje, y por teléfono.

## Asistentes de chat y mensajes

Un [[chatbot|chatbot]] en tu web, Facebook, Instagram o línea de mensajes puede responder al instante. Los modernos no siguen un guion rígido: leen la información de tu negocio, llamada [[base de conocimiento|knowledge-base]], y responden con lenguaje normal.

Uno bueno:

- Responde solo con tu información y dice "No estoy seguro, déjame pasarte con alguien" cuando no sabe
- Puede compartir enlaces (página de reservas, menú, lista de precios)
- Pide el nombre y el teléfono del cliente antes de pasarlo a una persona

## Atención telefónica con IA

La [[IA de voz|voice-ai]] ya puede contestar el teléfono con una voz natural, responder preguntas frecuentes, agendar citas y tomar recados detallados. Es muy útil para oficios, clínicas, salones y restaurantes que pierden llamadas cuando están ocupados. Las llamadas que necesitan a una persona se transfieren o se convierten en un recado escrito con resumen.

## Qué buscar

- **Fácil de actualizar:** tú mismo puedes cambiar precios y horarios en minutos
- **Se conecta con tus herramientas:** tu calendario de reservas, correo y mensajes
- **Registro de conversaciones:** puedes leer cada conversación
- **Paso claro a una persona:** una forma sencilla de hablar con alguien

## Expectativas reales

La IA no sabrá de la oferta del día ni que se te averió la furgoneta si no se lo dices. Cuenta con actualizar su información cada vez que algo cambie.

> Configurar esto en tu web, teléfono y bandeja de entrada es lo que hacemos para nuestros clientes en Number 1 Digital Marketing. También puedes empezar tú en pequeño con un solo canal.
`,
        tryIt: `Pega en un asistente de IA tu horario, tus precios y cinco preguntas frecuentes con sus respuestas. Luego di: "Haz de asistente de mi negocio y responde a los clientes solo con esta información. Si no sabes algo, dilo". Hazle tres preguntas como cliente, incluida una que no pueda responder.`,
      },
      {
        slug: 'handoff-to-humans',
        title: 'Saber cuándo entra una persona',
        minutes: 12,
        body: `
La mejor atención con IA conoce sus límites. Los clientes perdonan un "déjame pasarte con una persona". No perdonan una respuesta equivocada dicha con seguridad.

## Siempre pasar a una persona

- Quejas y clientes molestos
- Reembolsos, descuentos y todo lo que tenga que ver con dinero fuera de tus precios publicados
- Emergencias, temas de seguridad o salud
- Presupuestos a medida y peticiones poco comunes
- Cualquier cosa que no esté en la base de conocimiento

Escríbelas como reglas claras que tu herramienta siga y decide quién recibe el aviso y en cuánto tiempo responde.

## Sé transparente

Diles a los clientes que están hablando con un asistente de IA y facilita hablar con una persona. En muchos lugares se está volviendo obligatorio por ley. En todas partes genera confianza.

## Revísalo cada semana

Durante el primer mes, lee las conversaciones cada semana:

- ¿Qué preguntas respondió mal o esquivó? Añade mejores respuestas.
- ¿Dónde se frustraron los clientes? Ajusta las reglas para pasar a una persona.
- ¿Qué preguntas nuevas aparecieron? Añádelas.

## Protege los datos de tus clientes

Elige herramientas que mantengan las conversaciones privadas, no pidas más datos personales de los necesarios y nunca dejes que la IA tome números de tarjeta en un chat.

> Tener un [[humano en el circuito|human-in-the-loop]] no es una debilidad. Es lo que hace seguro ofrecer respuestas 24/7.
`,
        tryIt: `Escribe en cinco líneas tu lista de "siempre pasar a una persona" para tu negocio. Pregúntale a un asistente de IA: "¿Qué situaciones me faltan para un [tu tipo de negocio]?". Añade la que más te sorprenda.`,
      },
    ],
    exercise: {
      title: 'Ejercicio: Escribe tu hoja de respuestas',
      body: `
Crea la base de conocimiento que necesitaría cualquier asistente de IA (o un empleado nuevo):

1. Haz una lista de las 15 a 20 preguntas principales de tus clientes del último mes
2. Escribe una respuesta corta y clara para cada una: horario, precios, zona, reservas y políticas
3. Escribe tus reglas para pasar a una persona: qué va siempre a una persona, a quién se avisa y en cuánto tiempo responde
4. Pruébala: pega todo en un asistente de IA, dile que responda solo con tu hoja y hazle diez preguntas de cliente
5. Corrige cada respuesta que fue incorrecta, vaga o demasiado larga
`,
    },
    checklist: [
      'Reúne las preguntas principales de tus clientes del último mes',
      'Escribe una respuesta clara para cada una',
      'Escribe tus reglas para pasar a una persona y a quién se avisa',
      'Prueba tu hoja de respuestas con un asistente de IA haciendo de cliente',
      'Elige un canal (chat web, mensajes o teléfono) para probar primero',
    ],
  },
  {
    number: '13',
    summary:
      'Usa la IA para reducir el papeleo: notas de reuniones, propuestas, presupuestos, políticas, hojas de cálculo y las tareas repetidas que llenan tu semana.',
    lessons: [
      {
        slug: 'meetings-and-notes',
        title: 'Reuniones, notas y llamadas',
        minutes: 12,
        body: `
Tomar notas, escribir lo que se acordó y acordarse de los seguimientos es uno de los lugares más fáciles para ahorrar tiempo.

## Deja que la IA tome las notas

Las herramientas de [[transcripción|transcription]] convierten la voz en texto. Muchas apps de videollamada (Zoom, Google Meet, Microsoft Teams) ya traen notas con IA, y las apps del teléfono pueden grabar y transcribir reuniones en persona.

A partir de una transcripción, la IA te puede dar:

- Un resumen corto de lo que se habló
- Las decisiones tomadas y quién las aceptó
- Una lista de tareas con nombres y fechas
- Un correo de seguimiento listo para editar y enviar

## Las notas de voz también cuentan

¿Vas en el coche entre un trabajo y otro? Graba una nota de voz con tus ideas y pega la transcripción en un asistente de IA: "Conviértelo en una lista de tareas ordenada y una nota corta para mi equipo".

## Pide permiso primero

Avisa siempre que vas a grabar y consigue el visto bueno. En muchos lugares es la ley. No grabes conversaciones confidenciales con herramientas cuya privacidad no hayas revisado.

## Revisa los detalles

Las transcripciones confunden nombres, números y términos técnicos. Antes de enviar un resumen, comprueba cada cantidad, fecha y nombre con lo que recuerdas.

> Un hábito que se nota enseguida: termina cada reunión pidiéndole a la IA el correo de seguimiento y envíalo en menos de una hora.
`,
        tryIt: `Graba una nota de voz de dos minutos sobre lo que tienes que hacer esta semana. Usa la transcripción de tu teléfono (o escríbelo rápido), pégalo en un asistente de IA y pide: "Conviértelo en una lista de tareas con una fecha límite para cada una".`,
      },
      {
        slug: 'documents-and-paperwork',
        title: 'Propuestas, presupuestos, políticas y papeleo',
        minutes: 14,
        body: `
La mayor parte del papeleo de un negocio sigue un patrón, y a la IA se le dan muy bien los patrones.

## Documentos que la IA puede redactar

- **Propuestas y presupuestos:** "Convierte estas notas del trabajo en una propuesta clara de una página con alcance, precio y plazos".
- **Guías para tu equipo:** explica en voz alta cómo haces una tarea y pide a la IA que lo convierta en pasos numerados
- **Políticas:** cancelación, devoluciones y pagos atrasados en lenguaje sencillo
- **Ofertas de empleo:** "Escribe una oferta para recepcionista a media jornada. Esto es lo que implica de verdad el puesto…"
- **Formularios y listas:** formularios de alta, listas de apertura y cierre, listas de inspección

## Parte de tu mejor ejemplo

Pega una propuesta o documento que funcionó y di: "Usa esto como plantilla para uno nuevo para [cliente]". Así mantienes tu formato, tus precios y tu forma de decir las cosas.

## Hojas de cálculo sin dolores de cabeza

Describe lo que quieres en lenguaje normal: "Escribe una fórmula de Google Sheets que sume la columna C solo donde la columna B diga 'pagado'". Pídele que te explique la fórmula para poder arreglarla después. También puedes pegar una tabla pequeña y pedir un resumen.

## Dónde tener cuidado

- **Contratos y documentos legales:** la IA puede redactarlos y explicarlos, pero un abogado debe revisar todo lo que firmes o pidas firmar
- **Números:** comprueba tú cada total y precio
- **Datos privados:** quita nombres, direcciones y números de identificación de clientes antes de pegar

> Guarda una carpeta con tus mejores documentos hechos con ayuda de la IA. Se convierten en plantillas para siempre.
`,
        tryIt: `Elige un documento que escribes a menudo (un presupuesto, una nota de factura, un mensaje de bienvenida). Pega uno antiguo en un asistente de IA sin datos privados y pide: "Conviértelo en una plantilla reutilizable con [CORCHETES] en las partes que cambian".`,
      },
      {
        slug: 'inbox-and-routine',
        title: 'Tu bandeja de entrada y las tareas repetidas',
        minutes: 12,
        body: `
El último paso es el trabajo que se repite cada día: correo, agenda, avisos y pasar datos de un sitio a otro.

## Tu bandeja de entrada

- **Usa lo que ya tienes.** Gmail y Outlook ya incluyen IA que resume conversaciones largas y sugiere respuestas.
- **Escribe respuestas guardadas** para las preguntas que respondes cada semana y deja que la IA las adapte a cada persona.
- **Agrúpalo.** Revisa el correo dos o tres veces al día y usa la IA para redactar todas las respuestas de una vez.

## Detecta las tareas repetidas

Durante una semana, lleva una lista sencilla de las tareas que haces más de dos veces. Algunas comunes: enviar confirmaciones de reserva, copiar contactos a una hoja de cálculo, enviar facturas y recordatorios, publicar el mismo aviso en varios sitios.

Para cada tarea, pregúntate:

1. ¿Podría una plantilla más la IA hacer la mayor parte? (Usa lo que aprendiste en este módulo).
2. ¿Podría funcionar sola, sin que nadie la ponga en marcha? Eso es la [[automatización|workflow]], y el Módulo 02 (Herramientas de IA y automatización) te enseña a crearla paso a paso.

## Agentes de IA

Oirás hablar de los [[agentes de IA|ai-agent]]: IA que puede actuar por ti, como rellenar formularios, reservar o trabajar entre varias apps. Mejoran rápido. Por ahora, úsalos para tareas de poco riesgo, revisa su trabajo y nunca les des acceso a dinero ni a cuentas privadas sin límites estrictos.

> Mídelo: anota cuánto tardabas en una tarea antes de la IA y después. Las horas ahorradas son la señal más clara de que algo funciona.
`,
        tryIt: `Abre tu correo y busca la pregunta que más respondes. Pide a un asistente de IA: "Escribe una respuesta guardada amable para esta pregunta con [CORCHETES] en los datos que cambian". Guárdala como plantilla en tu app de correo.`,
      },
    ],
    exercise: {
      title: 'Ejercicio: Encuentra cinco horas',
      body: `
Encuentra cinco horas a la semana para recuperar:

1. Durante tres días, apunta cada tarea administrativa y cuánto tarda más o menos
2. Marca las tres que más se repiten o más tiempo llevan
3. Para cada una, elige una solución de este módulo: notas con IA, una plantilla, una respuesta guardada o (más adelante) una automatización
4. Prueba cada solución al menos dos veces
5. Anota el tiempo antes y después. ¿Encontraste cinco horas? Si no, ¿cuál es la siguiente tarea?
`,
    },
    checklist: [
      'Usa notas con IA o una transcripción en una reunión o llamada',
      'Convierte un documento que escribes a menudo en una plantilla reutilizable',
      'Pide a la IA que escriba o explique una fórmula de hoja de cálculo',
      'Crea dos respuestas de correo guardadas',
      'Haz una lista de tus tareas repetidas y marca cuáles se podrían automatizar más adelante',
    ],
  },
  {
    number: '14',
    summary:
      'Usa la IA como compañera para pensar tu negocio: investiga clientes y competidores, pon a prueba precios y prueba ofertas nuevas antes de apostar por ellas.',
    lessons: [
      {
        slug: 'ai-as-advisor',
        title: 'La IA como compañera para pensar tu negocio',
        minutes: 12,
        body: `
La mayoría de los dueños de pequeños negocios toman las grandes decisiones solos. La IA no sustituye a un mentor, pero es una caja de resonancia inteligente disponible siempre que la necesites.

## Dale el panorama completo

Cuanto más contexto tenga, mejor piensa. Empieza una conversación así:

"Tengo un [negocio] en [ciudad]. Somos [número] empleados, nuestros clientes principales son [quiénes] y nuestro servicio más vendido es [cuál]. Nuestro mayor reto ahora es [problema]. Hazme cinco preguntas antes de darme consejos".

Pedirle que te pregunte primero da consejos mucho mejores que una lista genérica.

## Formas útiles de pensar con la IA

- **Busca puntos débiles:** "Este es mi plan para abrir un segundo local. ¿Qué podría salir mal?"
- **Que haga de cliente:** "Actúa como una madre ocupada que duda si contratar mi servicio de limpieza. ¿Qué te haría dudar?"
- **Que haga de escéptico:** "Argumenta por qué NO debería subir mis precios".
- **Piensa por pasos:** "Divide este objetivo en un plan de 90 días con un hito por mes".

## Dónde se queda corta

La IA no conoce tu mercado local, el dinero que tienes en el banco ni los nombres de tus clientes si no se lo dices, y puede equivocarse con seguridad en leyes, impuestos y números. Úsala para afinar tu forma de pensar, comprueba los datos clave y habla con tu contador o asesor antes de dar pasos grandes.

> Trata los consejos de la IA como una primera opinión sólida, no como la respuesta final.
`,
        tryIt: `Describe tu negocio en tres frases y tu mayor reto en una. Pide a un asistente de IA: "Hazme cinco preguntas sobre esto, de una en una, y luego sugiere tres cosas que podría probar en los próximos 30 días". Responde con sinceridad.`,
      },
      {
        slug: 'research-and-pricing',
        title: 'Investiga clientes, competidores y precios',
        minutes: 15,
        body: `
Una investigación que antes llevaba días ahora puede llevar una tarde, si compruebas lo que encuentra la IA.

## Aprende de lo que ya dicen los clientes

Copia reseñas de tu negocio y de dos o tres competidores (de Google, Yelp o Facebook) y pregunta:

- "¿Qué es lo que más les gusta a los clientes? ¿De qué se quejan más?"
- "¿Qué desearían los clientes que alguien ofreciera?"

Los huecos en las reseñas de tus competidores suelen ser tus mejores oportunidades.

## Investiga a la competencia

Usa un asistente de IA con búsqueda web: "Compara los servicios, precios y promesas de estos tres negocios de [tipo de negocio] en [ciudad]. Usa sus sitios web e indica tus fuentes". Abre las fuentes para comprobar que es correcto: la IA puede confundir negocios o usar precios antiguos.

## Pon a prueba tus precios

La IA es útil para pensar preguntas de "¿y si…?":

- "Si subo los precios un 10% y pierdo un 5% de clientes, ¿gano más o menos? Muestra las cuentas".
- "¿Cómo sería una membresía mensual para mi negocio de lavado de autos?"
- "Ayúdame a crear tres paquetes: básico, estándar y premium".

Comprueba las cuentas tú mismo o en una hoja de cálculo. La IA a veces se equivoca con la aritmética.

## Entiende tu mercado

Pregunta por tendencias, quiénes son tus clientes probables y qué les importa. Luego confírmalo con conversaciones reales. Cinco charlas cortas con clientes reales valen más que cualquier suposición de la IA.

> Pregunta siempre "¿De dónde sale esto?". Una investigación que no puedes comprobar es solo una suposición que suena inteligente.
`,
        tryIt: `Copia diez reseñas de Google de un competidor (o de tu negocio) en un asistente de IA y pregunta: "¿Cuáles son las tres cosas que más elogian los clientes y las tres quejas principales? ¿Qué oportunidad sugiere esto para un competidor?".`,
      },
      {
        slug: 'new-offers',
        title: 'Prueba ofertas e ideas nuevas',
        minutes: 12,
        body: `
Las ideas nuevas emocionan, pero la mayoría deberían probarse en pequeño antes de apostar por ellas. La IA te ayuda a pasar rápido de la idea a la prueba.

## De la idea a un plan de una página

Pide: "Convierte esta idea en un plan de una página: para quién es, qué problema resuelve, cuánto me cuesta, cuánto cobraría y cómo sabré si funciona". Una página obliga a pensar con claridad.

## Ideas para generar

- Servicios nuevos que tus clientes actuales comprarían ("¿Qué más podrían necesitar mis clientes de jardinería?")
- Paquetes, combos y membresías
- Talleres, clases o productos digitales basados en lo que sabes
- Alianzas con negocios cercanos que atienden a los mismos clientes

## Prueba antes de construir

- **Pregunta primero:** pide a la IA ayuda para escribir una encuesta corta o cinco preguntas para hacer a los clientes en persona
- **Prevende:** ofrécelo a unos pocos clientes antes de invertir. Si nadie dice que sí, te ahorraste dinero.
- **Ponle nombre:** pide 10 ideas de nombre y elige según lo que entienden los clientes, no según lo que suena ingenioso

## Cuando toque darlo a conocer

Cuando una oferta funciona, hay que promocionarla. Para eso está el Curso de Marketing con IA (Módulos 01 a 08): contenido, búsqueda, reseñas y medición de resultados.

> Prueba pequeña, clientes reales, un número claro. Así las buenas ideas se convierten en buenos negocios.
`,
        tryIt: `Pregúntale a un asistente de IA: "Mis clientes compran [tu servicio principal]. Sugiere cinco productos o servicios relacionados por los que también pagarían y, para cada uno, la forma más barata de probar la demanda este mes". Elige uno para probar.`,
      },
    ],
    exercise: {
      title: 'Ejercicio: Plan de crecimiento de una página',
      body: `
Usa la IA como compañera para pensar y crea un plan de una página:

1. Describe tu negocio y deja que la IA te haga preguntas
2. Analiza las reseñas de tu negocio y de dos competidores en busca de huecos
3. Elige una oportunidad, como una oferta nueva, un cambio de precio o un paquete
4. Conviértela en un plan de una página con una prueba pequeña y un número claro de éxito
5. Haz la prueba con clientes reales en los próximos 30 días
`,
    },
    checklist: [
      'Ten una conversación de planificación con la IA en la que primero te haga preguntas',
      'Analiza las reseñas de la competencia en busca de huecos',
      'Comprueba una respuesta de investigación de la IA abriendo sus fuentes',
      'Usa la IA para calcular un "¿y si…?" de precios y comprueba las cuentas',
      'Escribe un plan de una página para una idea nueva y fija una fecha de prueba',
    ],
  },
];
