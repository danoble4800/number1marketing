// N°1 Academy — lecciones en español. Misma estructura que lessons.ts (inglés).
import type { CourseModule } from './lessons';

export const course: CourseModule[] = [
  {
    number: '01',
    summary:
      'Qué es realmente la IA moderna, dónde encaja en un embudo de marketing y cómo usarla sin poner en riesgo tu marca ni a tus clientes.',
    lessons: [
      {
        slug: 'what-ai-actually-is',
        title: 'Qué es (y qué no es) la IA',
        minutes: 35,
        tryIt: "Abre un asistente de IA gratuito (ChatGPT, Claude o Gemini) y pregúntale: \"Dame tres datos sorprendentes sobre [tu ciudad]\". Luego pregunta: \"¿Cuál de esos podría estar mal y cómo lo compruebo?\". Fíjate en lo seguro que suena en ambos casos.",
        body: `
La mayoría de las herramientas de IA que usan los profesionales del marketing hoy se basan en **modelos de lenguaje de gran tamaño** (LLM): sistemas entrenados con enormes cantidades de texto para predecir la siguiente palabra más probable. ChatGPT, Claude y Gemini son ejemplos. Las herramientas de imagen y video funcionan con una idea similar, entrenadas con imágenes y videos en lugar de texto.

Esa sola idea explica casi todo sobre cómo se comportan estas herramientas. Son extremadamente buenas produciendo texto que *suena* correcto. No "saben" datos como una base de datos, y no revisan su propio trabajo a menos que se lo pidas.

## IA generativa vs. IA predictiva

- La **IA generativa** crea algo nuevo: un texto para redes, un correo, una imagen, un guion de video.
- La **IA predictiva** califica o pronostica: qué prospecto tiene más probabilidades de comprar, qué cliente podría cancelar, qué anuncio tendrá el menor costo por clic.

Probablemente has usado IA predictiva durante años sin llamarla así: plataformas como Meta y Google la usan para decidir quién ve tus anuncios. Lo que cambió recientemente es que la IA generativa se volvió barata, rápida y accesible para todos.

## En qué es buena la IA

- Convertir notas sueltas en un primer borrador limpio
- Reescribir un contenido para otra audiencia, extensión o plataforma
- Resumir documentos largos, reseñas, transcripciones de llamadas o respuestas de encuestas
- Generar ideas de ángulos, ganchos, asuntos de correo y variaciones de anuncios
- Detectar patrones en los datos que le entregas

## Dónde falla la IA

- **Alucinaciones:** puede afirmar información falsa —estadísticas inventadas, citas falsas, fuentes que no existen— con total seguridad.
- **Conocimiento desactualizado:** a menos que la herramienta pueda buscar en internet, solo sabe lo que había en sus datos de entrenamiento.
- **Resultados genéricos:** con una instrucción vaga obtienes contenido vago y promedio que suena como el de todos.
- **Sin criterio sobre tu negocio:** no conoce tus márgenes, tus clientes ni lo que tu marca nunca diría, a menos que se lo digas.

> La regla de todo este curso: la IA redacta, una persona decide. Trata cada resultado como el primer borrador de un practicante rápido y talentoso que nunca ha conocido a tus clientes.
`,
      },
      {
        slug: 'ai-across-the-funnel',
        title: 'Dónde encaja la IA en el embudo de marketing',
        minutes: 40,
        tryIt: "Cuéntale a un asistente de IA qué vende tu negocio y quién lo compra, y pregunta: \"¿En qué parte del recorrido de mi cliente es más probable que esté perdiendo gente? Dame tres hipótesis y una pregunta para comprobar cada una\".",
        body: `
La forma más rápida de perder tiempo con la IA es empezar por la herramienta ("¿qué puedo hacer con ChatGPT?"). La forma más rápida de obtener resultados es empezar por el embudo ("¿dónde estamos perdiendo tiempo o clientes?").

## El embudo, etapa por etapa

- **Reconocimiento:** la gente te descubre. La IA ayuda a producir más variaciones de contenido, probar más creatividades de anuncios y convertir un video en muchos clips.
- **Consideración:** la gente compara opciones. La IA ayuda a escribir páginas de servicio, preguntas frecuentes y comparativas más claras, y a responder dudas comunes al instante con un asistente de chat en tu sitio web.
- **Conversión:** la gente decide comprar o agendar. La IA ayuda a responder a los prospectos en minutos en lugar de horas, personalizar los correos de seguimiento y calificar prospectos antes de una llamada de ventas.
- **Retención:** conservar clientes. La IA ayuda a resumir reseñas y tickets de soporte, redactar correos para recuperar clientes y detectar a quienes han dejado de interactuar.

## Velocidad de respuesta: la victoria más fácil

Para la mayoría de los negocios de servicios, la mayor fuga es el seguimiento lento. Un prospecto llena un formulario, espera un día y contrata a la competencia. Un flujo de trabajo asistido por IA puede:

1. Recibir el formulario enviado
2. Enviar una confirmación instantánea y personalizada
3. Resumir la solicitud del prospecto para tu equipo
4. Avisar a la persona correcta por correo o mensaje de texto

Nada de eso reemplaza a un vendedor. Asegura que el vendedor empiece la conversación mientras el prospecto todavía está interesado.

## Mantén a una persona en el proceso

Decide de antemano qué pasos puede hacer la IA sola y cuáles necesitan aprobación. Una buena regla inicial:

- **Solo IA:** resúmenes internos, primeros borradores, etiquetado y clasificación
- **Aprobación humana:** todo lo que leerá un cliente, todo lo que involucre dinero y todo lo que pueda avergonzar a la marca

> Elige una etapa de tu embudo que claramente tenga fugas y enfócate ahí primero. Un sistema que funciona vale más que diez experimentos a medias.
`,
      },
      {
        slug: 'using-ai-responsibly',
        title: 'Uso responsable de la IA',
        minutes: 35,
        tryIt: "Pídele a un asistente de IA: \"Escribe una reseña de 5 estrellas para mi panadería\". Luego pregúntale por qué publicarla sería un problema. Compara su respuesta con lo que aprendiste en esta lección.",
        body: `
La IA facilita avanzar rápido, incluso en la dirección equivocada. Unas pocas reglas básicas protegen a tus clientes, tu marca y tu negocio.

## Protege los datos de los clientes

- No pegues datos personales de clientes (nombres, teléfonos, direcciones, información de pago o de salud) en herramientas de IA, a menos que la herramienta esté aprobada para esos datos y tu política de privacidad lo permita.
- Revisa la configuración de datos de cada herramienta. Muchos planes empresariales permiten desactivar el entrenamiento con tus datos; los planes gratuitos para consumidores a menudo no.
- Cuando analices datos con IA, elimina o reemplaza primero los datos que identifican a las personas.

## Sé honesto con tu audiencia

- Nunca uses IA para crear reseñas o testimonios falsos, ni "clientes" falsos en anuncios. Reguladores como la Comisión Federal de Comercio de EE. UU. (FTC) consideran engañosas las reseñas falsas, y las plataformas las eliminan.
- No presentes imágenes generadas por IA como resultados reales, sobre todo fotos de antes y después, fotos de productos o fotos de tu equipo.
- Si un asistente de chat atiende a los clientes, deja claro que están hablando con un asistente automatizado y ofrece una forma fácil de contactar a una persona.

## Verifica datos y derechos

- Verifica cada estadística, afirmación y cita antes de publicar. Si no encuentras la fuente original, elimínala.
- Ten cuidado con imágenes y música que imiten a un artista, una marca o una persona real específica.
- Industrias como salud, finanzas, servicios legales y bienes raíces tienen reglas de publicidad adicionales. La IA no las conoce; tú sí debes conocerlas.

## Protege la marca

Escribe lo que tu marca nunca dice ni hace (por ejemplo: nada de tácticas de presión, nada de jerga, nada de atacar a la competencia) e inclúyelo en tus instrucciones a la IA. En el Módulo 03 lo convertiremos en una guía de voz de marca completa.

> Antes de publicar algo hecho con ayuda de IA, pregúntate: ¿Es verdad? ¿Es justo para el cliente? ¿Me sentiría cómodo si supiera cómo se hizo?
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: tu auditoría de oportunidades de IA',
      body: `
Haz una lista de 10 tareas de marketing que tú o tu equipo hacen cada semana. Para cada una, anota:

1. Cuánto tiempo toma por semana
2. Qué etapa del embudo apoya
3. Si la IA podría redactarla, hacerla con aprobación o si debe seguir siendo totalmente humana

Marca las dos tareas que más tiempo ahorran con el menor riesgo. Esos son tus primeros proyectos de IA; construirás uno de ellos en el Módulo 02.
`,
    },
    checklist: [
      "Haz una lista de 10 tareas de marketing semanales y cuánto tiempo toma cada una",
      "Marca la etapa del embudo que apoya cada tarea",
      "Elige las dos tareas con más tiempo ahorrado y menos riesgo",
      "Anota qué datos de clientes nunca vas a pegar en una herramienta de IA",
      "Decide quién aprueba lo que escribe la IA antes de que lo vean los clientes",
    ],
  },
  {
    number: '02',
    summary:
      'Elige herramientas de IA según la tarea que resuelven, entiende cómo se construyen los flujos de automatización y diseña tu primer flujo de forma segura.',
    lessons: [
      {
        slug: 'choosing-your-toolkit',
        title: 'Cómo elegir tus herramientas de IA',
        minutes: 55,
        tryIt: "Haz una lista de las herramientas que ya pagas (plataforma de email, app de diseño, CRM, teléfono). Pregúntale a un asistente de IA: \"¿Cuáles de estas ya tienen funciones de IA que quizá no estoy usando y qué hacen?\".",
        body: `
Cada semana salen nuevas herramientas de IA. No necesitas la mayoría. Elige herramientas según la **tarea que hay que resolver**, no por la moda.

## Las herramientas básicas por tarea

- **Escribir y pensar:** un asistente de IA general como ChatGPT, Claude o Gemini. Será tu herramienta más usada: redactar, reescribir, resumir, generar ideas y analizar.
- **Diseño e imágenes:** herramientas como Canva (con sus funciones de IA) o Adobe Firefly para gráficos de redes sociales, variaciones de anuncios y maquetas rápidas.
- **Video:** herramientas de edición con IA que cortan videos largos en clips cortos, agregan subtítulos y eliminan muletillas.
- **Automatización:** Zapier, Make o n8n para conectar tus aplicaciones y que el trabajo fluya entre ellas sin copiar y pegar.
- **IA integrada:** es probable que tu CRM, tu plataforma de correo y tus cuentas de anuncios ya incluyan funciones de IA. Revisa lo que ya pagas antes de comprar algo nuevo.

## Cómo evaluar una herramienta

Antes de adoptar cualquier herramienta, responde cinco preguntas:

1. **Tarea:** ¿Qué tarea específica mejora y cuánto?
2. **Calidad:** Pruébala con una tarea real de tu negocio, no con los ejemplos de la demostración.
3. **Datos:** ¿A dónde van tus datos? ¿Puedes desactivar el entrenamiento con ellos?
4. **Costo:** ¿Cuánto cuesta al mes con tu uso real, incluyendo usuarios adicionales?
5. **Compatibilidad:** ¿Se conecta con las herramientas que ya usas?

## Evita la acumulación de herramientas

Cada herramienta agrega un inicio de sesión, una factura y un lugar donde la información se puede perder. Un negocio pequeño puede hacer un excelente marketing con IA usando **un asistente de IA, una herramienta de diseño y una plataforma de automatización**. Agrega más solo cuando una tarea específica lo exija.

> Haz una prueba de dos semanas con una tarea real antes de pagar cualquier plan. Si no puedes medir la diferencia, no necesitas la herramienta.
`,
      },
      {
        slug: 'automation-basics',
        title: 'Fundamentos de automatización: disparadores, acciones y flujos',
        minutes: 60,
        tryIt: "Elige una tarea que repites cada semana y escríbela en una frase: \"Cuando ___, haz ___, pero solo si ___\". Pídele a un asistente de IA que señale el disparador, las acciones y los filtros de tu frase.",
        body: `
La automatización es donde la IA deja de ser una ventana de chat y empieza a trabajar mientras duermes. Toda automatización, por compleja que sea, se construye con las mismas piezas.

## Las piezas básicas

- **Disparador:** el evento que inicia el flujo. *Se envía un formulario. Se agrega una fila a una hoja de cálculo. Se recibe un pago.*
- **Acción:** lo que sucede después. *Crear un contacto en el CRM. Enviar un correo. Publicar un mensaje para tu equipo.*
- **Filtro / condición:** reglas que deciden si se continúa. *Solo si el presupuesto supera los $1,000. Solo si el prospecto está en Florida.*
- **Paso de IA:** una acción que envía información a un modelo de IA y usa la respuesta. *Resume este prospecto. Clasifica este mensaje como ventas, soporte o spam. Redacta una respuesta.*

Un **flujo** es un disparador seguido de una cadena de acciones, filtros y pasos de IA.

## Ejemplo: un flujo de prospectos asistido por IA

1. **Disparador:** un nuevo prospecto envía el formulario de tu sitio web
2. **Acción:** guardar el prospecto en tu CRM o en una hoja de Google
3. **Paso de IA:** resumir lo que pidió y sugerir una prioridad (caliente, tibio, frío)
4. **Filtro:** si es caliente, continuar al paso 5; si no, agregarlo a una secuencia de correos de seguimiento
5. **Acción:** enviar un mensaje de texto al responsable de ventas con el resumen y el teléfono del prospecto
6. **Acción:** enviar al prospecto un correo de confirmación instantáneo

Este solo flujo puede reducir el tiempo de respuesta de horas a minutos, sin que nadie tenga que vigilar la bandeja de entrada.

## Dónde se rompen las automatizaciones

- Se cambia el nombre de un campo y el flujo deja de encontrar los datos
- Vence el inicio de sesión de una aplicación
- El paso de IA devuelve algo inesperado (un párrafo largo en lugar de "caliente")

Por eso incorporarás controles, que es el tema de la siguiente lección.

> Piensa en cada flujo como una oración: "Cuando [disparador], haz [acciones], pero solo si [condiciones]". Si no puedes decirlo en una oración, simplifícalo.
`,
      },
      {
        slug: 'building-your-first-workflow',
        title: 'Cómo construir tu primer flujo de forma segura',
        minutes: 65,
        tryIt: "Pídele a un asistente de IA: \"Clasifica cada mensaje como ventas, soporte o spam. Responde con una sola palabra por mensaje\". Pega tres mensajes reales de esta semana (sin nombres) y comprueba si respeta el formato.",
        body: `
El objetivo de tu primera automatización no es impresionar a nadie. Es ahorrar tiempo real, de forma confiable, sin crear nuevos problemas.

## Paso 1: mapea el proceso a mano

Escribe exactamente lo que sucede hoy, paso a paso, incluyendo quién lo hace y qué aplicaciones intervienen. Si el proceso manual es un desorden, automatizarlo solo hace el desorden más rápido.

## Paso 2: empieza con una tarea pequeña y frecuente

Los buenos primeros flujos se ejecutan seguido, siguen reglas claras y tienen poco riesgo si algo sale mal; por ejemplo, guardar los prospectos del formulario en una hoja y avisar a tu equipo, o convertir una nueva entrada de blog en borradores de publicaciones para revisar.

## Paso 3: haz predecible el resultado de la IA

Los pasos de IA son la parte menos predecible de cualquier flujo. Hazlos confiables:

- Pide un **formato fijo**: "Responde con una sola palabra: caliente, tibio o frío."
- Dale el **contexto** que necesita: qué vendes, quién es tu cliente ideal y qué hace que un prospecto sea caliente.
- Agrega un **plan alternativo**: si la respuesta no es una de las palabras permitidas, trátala como "tibio" y márcala para que la revise una persona.

## Paso 4: mantén un paso de aprobación humana

Para todo lo que vea el cliente, haz que la IA cree un **borrador** —en tu herramienta de correo, un documento o un mensaje de Slack o correo— que una persona apruebe antes de enviarlo. Elimina el paso de aprobación solo después de semanas de resultados consistentemente buenos.

## Paso 5: prueba y luego supervisa

1. Ejecuta el flujo con datos de prueba antes de activarlo
2. Prueba datos desordenados: campos vacíos, un mensaje muy largo, un mensaje en otro idioma
3. Activa las notificaciones de errores para enterarte de inmediato cuando algo falle
4. Revisa los resultados cada semana durante el primer mes

## Paso 6: conoce el costo

Las plataformas de automatización cobran por número de tareas, y los pasos de IA cobran por uso. Calcula el volumen mensual antes de lanzar para evitar facturas sorpresa.

> Documenta cada flujo en un solo lugar: qué lo dispara, qué hace, quién es el responsable y cómo desactivarlo. Tu yo del futuro te lo agradecerá.
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: diseña tu primer flujo',
      body: `
Toma una de las dos tareas que marcaste en la auditoría del Módulo 01 y diseña en papel una automatización para ella:

1. Escribe la versión en una oración: "Cuando ___, haz ___, pero solo si ___."
2. Enumera el disparador, cada acción, los filtros y los pasos de IA
3. Marca qué pasos necesitan aprobación humana
4. Escribe la instrucción exacta que recibirá tu paso de IA, incluyendo el formato de respuesta requerido
5. Enumera tres cosas que podrían salir mal y cómo te enterarás

Si tienes acceso a Zapier, Make o n8n, constrúyelo y ejecútalo con datos de prueba.
`,
    },
    checklist: [
      "Elige una herramienta de IA para escribir y una de automatización, y cancela las que no uses",
      "Escribe tu primer flujo en una frase: “Cuando ___, haz ___, pero solo si ___”",
      "Dibuja cada paso y marca los que necesitan aprobación humana",
      "Constrúyelo (o dibújalo) y pruébalo con datos de prueba",
      "Anota quién es el responsable, cómo sabrás si falla y cómo apagarlo",
    ],
  },
  {
    number: '03',
    summary:
      'Escribe instrucciones que produzcan resultados consistentes y fieles a tu marca desde el primer intento, y crea una biblioteca de prompts reutilizable para tu equipo.',
    lessons: [
      {
        slug: 'anatomy-of-a-prompt',
        title: 'La anatomía de un buen prompt',
        minutes: 45,
        tryIt: "Pídele a un asistente de IA \"un texto de Instagram para mi negocio\". Luego vuelve a pedirlo con un rol, tu público, el objetivo, el tono y un límite de palabras. Compara las dos respuestas.",
        body: `
La calidad de lo que produce la IA depende sobre todo de la calidad de las instrucciones. "Escribe una publicación sobre nuestro nuevo servicio" te da algo genérico. Un prompt estructurado te da algo que puedes usar.

## Las seis partes de un buen prompt

1. **Rol:** quién debe ser la IA. *"Eres un redactor de redes sociales con experiencia en negocios de servicios locales."*
2. **Contexto:** lo que necesita saber. *El negocio, la audiencia, la oferta, lo que ha funcionado antes.*
3. **Tarea:** exactamente qué producir. *"Escribe tres textos para Instagram que anuncien nuestro nuevo horario de fin de semana."*
4. **Formato:** cómo debe verse el resultado. *"Cada texto con menos de 150 palabras, una llamada a la acción y no más de tres hashtags."*
5. **Restricciones:** qué evitar. *"Sin emojis en la primera línea. No menciones precios. No uses las palabras 'revolucionario' ni 'desbloquea'."*
6. **Ejemplos:** una muestra de cómo se ve un buen resultado, cuando la tengas.

## Antes y después

**Débil:** "Escribe un correo sobre nuestra oferta."

**Fuerte:** "Eres el responsable de email marketing de una mueblería familiar. Nuestros clientes son propietarios de vivienda de 35 a 60 años que valoran la calidad por encima del precio más bajo. Escribe un correo promocional para nuestro evento de 20 % de descuento en comedores este sábado y domingo. Incluye un asunto de menos de 45 caracteres, un saludo cercano, tres párrafos breves centrados en beneficios y una llamada a la acción clara para visitar la tienda. Tono cálido y directo. Sin tácticas de presión, sin urgencia falsa y sin signos de exclamación en el asunto."

El segundo prompt toma un minuto más de escribir y ahorra diez minutos de edición.

> Si el resultado es malo, no te limites a pulsar "regenerar". Pregúntate cuál de las seis partes faltó, agrégala e inténtalo de nuevo.
`,
      },
      {
        slug: 'prompting-techniques',
        title: 'Técnicas que mejoran cualquier resultado',
        minutes: 50,
        tryIt: "Pega dos textos o correos de los que estés orgulloso y di: \"Escribe un tercero con este mismo estilo sobre [tema nuevo]\". Fíjate cuánto se acerca a tu voz con ejemplos.",
        body: `
Cuando tus prompts ya tienen las seis partes, estas técnicas llevan el resultado de bueno a excelente.

## Muestra, no solo digas (prompts con ejemplos)

Pega dos o tres ejemplos de contenido que te encante —tus publicaciones con mejor rendimiento, correos que recibieron respuestas— y di "imita el estilo de estos ejemplos". Los ejemplos comunican el tono mucho mejor que adjetivos como "cercano" o "profesional".

## Pídele que te haga preguntas primero

Termina tu prompt con: *"Antes de empezar, hazme las preguntas que necesites para hacer esto bien."* A menudo la IA preguntará por detalles que olvidaste incluir: audiencia, objetivo, oferta, fecha límite.

## Divide las tareas grandes en pasos

No pidas una campaña completa en un solo prompt. Trabaja por etapas:

1. Genera 10 ángulos de campaña
2. Elige los dos mejores y explica por qué
3. Escribe un esquema para el ganador
4. Redacta cada pieza a partir del esquema

Cada paso te da la oportunidad de corregir el rumbo antes de que la IA vaya demasiado lejos en la dirección equivocada.

## Haz que se critique a sí misma

Después de un borrador, pide: *"Revisa esto como un cliente escéptico. ¿Qué es confuso, poco convincente o demasiado vendedor? Luego reescríbelo corrigiendo esos problemas."* La autocrítica detecta puntos débiles que de otra forma tendrías que encontrar tú.

## Itera con comentarios específicos

"Mejóralo" es vago. Di qué cambiar: *"Acorta el segundo párrafo a la mitad, reemplaza la apertura con una pregunta y haz más específica la llamada a la acción."*

## Pide opciones

Solicita de tres a cinco variaciones con enfoques distintos; por ejemplo, una emocional, una práctica y una basada en prueba social. Elegir es más rápido que reescribir, y las variaciones son justo lo que necesitas para probar anuncios.

> Guarda todo prompt que haya producido un gran resultado. La mejor biblioteca de prompts se construye con éxitos reales, no con listas de prompts encontradas en internet.
`,
      },
      {
        slug: 'prompt-library-and-brand-voice',
        title: 'Tu biblioteca de prompts y guía de voz de marca',
        minutes: 55,
        tryIt: "Pídele a un asistente de IA: \"Hazme una entrevista de cinco preguntas para descubrir la voz de mi marca\". Respóndelas y pídele que convierta tus respuestas en una guía de voz de un párrafo. Guárdala.",
        body: `
La diferencia entre una persona que "usa IA" y un equipo que obtiene resultados consistentes es la documentación. Dos documentos hacen la mayor parte del trabajo.

## La guía de voz de marca

Un documento de una página que pegas como contexto en cualquier prompt de contenido. Debe incluir:

- **Quiénes somos:** una o dos oraciones sobre el negocio y lo que lo hace diferente
- **A quién le hablamos:** el cliente ideal, sus principales problemas y lo que le importa
- **Cómo sonamos:** de tres a cinco rasgos de voz, cada uno con un breve ejemplo de "esto, no aquello": *seguros, no arrogantes; cercanos, no infantiles*
- **Palabras que usamos y palabras que nunca usamos**
- **Reglas:** afirmaciones que podemos y no podemos hacer, requisitos legales, preferencias de formato
- **Ejemplos:** dos o tres piezas de contenido que representen perfectamente a la marca

Muchos asistentes de IA te permiten guardar esto como instrucciones de proyecto o como un asistente personalizado, para que no tengas que pegarlo cada vez.

## La biblioteca de prompts

Un documento o una hoja de cálculo compartida con prompts probados que todo tu equipo puede reutilizar. Para cada prompt, registra:

1. **Nombre y caso de uso:** "Textos semanales para Instagram a partir de una entrada de blog"
2. **El prompt en sí**, con marcadores entre corchetes como [ENTRADA DE BLOG] y [OFERTA]
3. **En qué herramienta** funciona mejor
4. **Un resultado de ejemplo** que muestre cómo se ve un buen resultado
5. **Responsable y fecha de última actualización**

## Mantenla viva

- Revisa la biblioteca cada mes; elimina los prompts que nadie usa
- Cuando un prompt produzca un resultado débil, mejora el prompt, no solo el resultado
- Cuando alguien nuevo se una al equipo, la biblioteca y la guía de voz serán su capacitación en IA

> Una buena biblioteca de prompts convierte los mejores resultados de una persona en el estándar de todo el equipo.
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: crea tu guía de voz de marca y tus primeros tres prompts',
      body: `
1. Escribe una guía de voz de marca de una página con la plantilla de la Lección 3 (para tu negocio o un negocio de ejemplo)
2. Escribe tres prompts reutilizables para tareas que haces cada semana, usando las seis partes de la Lección 1
3. Prueba cada prompt incluyendo tu guía de voz y mejora el prompt al menos una vez según el resultado
4. Guarda las versiones finales; las usarás en el Módulo 04 y en tu proyecto final
`,
    },
    checklist: [
      "Escribe una guía de voz de marca de una página",
      "Convierte tres tareas semanales en prompts con las seis partes",
      "Prueba cada prompt y mejóralo al menos una vez",
      "Guarda los prompts finales en una biblioteca compartida",
      "Agenda una revisión de la biblioteca cada trimestre",
    ],
  },
  {
    number: '04',
    summary:
      'Planifica el contenido en torno a tu audiencia y tus objetivos, produce más sin perder calidad y mantente visible mientras cambia la búsqueda.',
    lessons: [
      {
        slug: 'strategy-before-content',
        title: 'Primero la estrategia, después el contenido',
        minutes: 55,
        tryIt: "Pregúntale a un asistente de IA: \"Enumera las diez preguntas que los clientes hacen con más frecuencia a un [tu tipo de negocio] antes de comprar\". Marca las tres que más escuchas: esos son tus próximos contenidos.",
        body: `
La IA puede producir cien publicaciones en una tarde. Ese es el problema: sin estrategia, solo publicas más ruido, más rápido. La estrategia decide **qué** vale la pena producir; la IA ayuda con **cuánto** y **qué tan rápido**.

## Empieza con el objetivo y la audiencia

Todo plan de contenido debe responder:

- **¿Para qué resultado de negocio es?** ¿Más llamadas agendadas, más visitas a la tienda, más clientes que regresan?
- **¿Para quién es exactamente?** Sé específico: "propietarios en Miami que planean remodelar su cocina", no "personas a las que les gusta el diseño".
- **¿Qué necesitan escuchar para dar el siguiente paso?** Sus preguntas, dudas y objeciones son tus mejores ideas de contenido.

## Pilares de contenido

Elige de tres a cinco temas recurrentes que conecten lo que le importa a tu audiencia con lo que vendes. Una empresa de techos podría usar:

1. **Educación:** cómo detectar daños por tormentas, qué afecta la vida útil de un techo
2. **Prueba:** proyectos reales, historias de clientes, fotos de antes y después
3. **Detrás de escena:** el equipo, el proceso, las normas de seguridad
4. **Ofertas:** inspecciones, promociones de temporada, financiamiento

Los pilares mantienen tu contenido consistente y facilitan dar instrucciones a la IA: *"Escribe cinco ideas de publicaciones para nuestro pilar de Educación."*

## Usa la IA para investigar a tu audiencia

Pega reseñas anónimas, correos frecuentes de clientes o notas de llamadas de ventas y pide: *"¿Cuáles son las diez preguntas, miedos y resultados deseados más comunes en estos mensajes? Cita las frases exactas que usan los clientes."* Las propias palabras de los clientes hacen los mejores titulares y ganchos.

> El contenido que responde una pregunta real de un cliente siempre superará al contenido creado porque "hoy hay que publicar algo".
`,
      },
      {
        slug: 'content-at-scale',
        title: 'Producir a escala sin perder tu voz',
        minutes: 65,
        tryIt: "Pega un artículo, correo o texto largo que hayas escrito y pide: \"Conviértelo en tres publicaciones cortas para redes y un asunto de correo, con la misma voz\". Edita la mejor y guárdala.",
        body: `
Los mejores flujos de contenido con IA no empiezan con un prompt en blanco. Empiezan con algo original —tu experiencia, tus historias, tus resultados reales— y usan la IA para multiplicarlo.

## La pirámide de reutilización

Crea una **pieza pilar** sustancial cada semana o cada mes y luego divídela en piezas más pequeñas:

1. **Pilar:** un video, episodio de podcast, seminario web o artículo largo basado en experiencia real
2. **Piezas medianas:** una entrada de blog, un boletín por correo, un artículo de LinkedIn
3. **Micropiezas:** clips cortos de video, gráficos con citas, carruseles, textos para redes, historias

Una conversación grabada de 20 minutos con un experto de tu equipo puede convertirse en un mes de contenido, y todo suena como tú, porque empezó contigo.

## El flujo de producción

1. **Brief:** objetivo, audiencia, pilar, puntos clave y llamada a la acción
2. **Borrador:** la IA redacta usando tu guía de voz de marca y un prompt de tu biblioteca
3. **Edición:** una persona agrega detalles específicos, historias y opiniones, y elimina el relleno genérico
4. **Verificación:** comprueba cada afirmación, cifra y nombre
5. **Aprobación y programación**

La calidad vive en el paso de edición. Busca lo que hace olvidable un contenido: afirmaciones vagas, frases vacías y la misma estructura de oración repetida una y otra vez. Reemplázalas con detalles que solo tu negocio podría decir.

## Trabaja por lotes

Crea contenido en bloques concentrados —por ejemplo, una tarde para las publicaciones de toda la semana— en lugar de un poco cada día. La IA hace que trabajar por lotes sea mucho más rápido: redacta 10 publicaciones en una sesión, edítalas en la siguiente y prográmalas todas a la vez.

> Tu competencia tiene las mismas herramientas de IA que tú. Tu ventaja es tu experiencia, las historias de tus clientes y tu punto de vista. Ponlos en cada pieza.
`,
      },
      {
        slug: 'search-in-the-ai-era',
        title: 'SEO y búsqueda en la era de la IA',
        minutes: 60,
        tryIt: "Pregúntale a un asistente de IA con búsqueda web: \"¿Cuáles son los mejores negocios de [tu servicio] en [tu ciudad]?\". Comprueba si apareces y anota qué sitios usa como fuentes.",
        body: `
La búsqueda está cambiando. Google ahora muestra resúmenes generados por IA en la parte superior de muchos resultados, y cada vez más personas les preguntan directamente a los asistentes de IA. Los fundamentos para que te encuentren siguen vigentes; simplemente importan más.

## Lo que premian los buscadores

La guía de Google es clara: premia el **contenido útil, confiable y pensado para las personas**, sin importar cómo se haya producido. Penaliza el contenido creado principalmente para manipular el posicionamiento, incluidas grandes cantidades de páginas pobres y producidas en masa. Sus pautas de calidad destacan el **E-E-A-T**:

- **Experiencia:** experiencia de primera mano con el tema (proyectos reales, fotos reales)
- **Pericia:** conocimiento demostrado con profundidad y precisión
- **Autoridad:** reconocimiento de otros (reseñas, enlaces, menciones)
- **Confiabilidad:** información precisa, datos claros del negocio, afirmaciones honestas

## Qué significa esto para el contenido con IA

- No publiques cientos de páginas de IA casi idénticas ("plomero en [cada ciudad]"). Ese es exactamente el patrón que los buscadores trabajan para relegar.
- Sí usa la IA para investigar, hacer esquemas, primeros borradores, preguntas frecuentes y la estructura de las páginas; luego agrega experiencia y conocimiento reales.
- Mantén consistentes los datos de tu negocio en todas partes: nombre, dirección, teléfono, horario y tu Perfil de Empresa en Google.

## Cómo aparecer en las respuestas de la IA

Los asistentes de IA y los resúmenes de IA toman información de fuentes que consideran confiables. Para mejorar tus probabilidades:

1. Responde preguntas específicas de forma clara y directa en tus páginas
2. Usa encabezados descriptivos y una estructura sencilla
3. Consigue reseñas y menciones en sitios reconocidos de tu industria y tu zona
4. Mantén actualizadas las páginas importantes

> El objetivo no es engañar a un algoritmo. Es ser la respuesta más útil y confiable a las preguntas de tus clientes; eso funciona tanto para los buscadores como para los asistentes de IA.
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: un pilar, diez piezas',
      body: `
1. Define de tres a cinco pilares de contenido para tu negocio (o un negocio de ejemplo)
2. Elige un tema de pilar y haz el esquema de una pieza pilar en torno a una pregunta real de un cliente
3. Con tu guía de voz de marca y tu biblioteca de prompts, conviértela en al menos diez piezas más pequeñas para dos o más plataformas
4. Edita cada pieza a mano: agrega a cada una un detalle, una historia o una opinión específica
5. Verifica todo y anota lo que cambiaste respecto al borrador de la IA
`,
    },
    checklist: [
      "Anota el objetivo de contenido del negocio y su cliente ideal",
      "Elige de tres a cinco pilares de contenido",
      "Escribe una pieza pilar que responda una pregunta real de un cliente",
      "Conviértela en al menos diez piezas más pequeñas para dos plataformas",
      "Agrega a cada pieza un detalle, historia u opinión real, y verifica los datos",
      "Arma un calendario de 30 días y produce en bloque la primera semana",
    ],
  },
  {
    number: '05',
    summary:
      'Concéntrate en los números que impulsan decisiones, usa la IA para analizar datos más rápido sin confiar ciegamente y aplica un ciclo sencillo de prueba y aprendizaje.',
    lessons: [
      {
        slug: 'metrics-that-matter',
        title: 'Las métricas que realmente importan',
        minutes: 40,
        tryIt: "Pregúntale a un asistente de IA: \"Tengo un [tipo de negocio]. ¿Qué tres números debería revisar cada semana y por qué?\". Compara su lista con lo que miras hoy.",
        body: `
Los paneles de marketing están llenos de números. La mayoría no cambia ninguna decisión. Empieza con los pocos que se conectan directamente con los ingresos.

## Métricas de vanidad vs. métricas de decisión

- Las **métricas de vanidad** se ven bien, pero no te dicen qué hacer: número de seguidores, impresiones, "me gusta".
- Las **métricas de decisión** se vinculan con resultados de negocio y te dicen dónde actuar: prospectos, costo por prospecto, tasa de conversión, ingresos por cliente.

Las métricas de vanidad no son inútiles —el alcance importa para el reconocimiento—, pero nunca deberían ser el titular de un informe.

## Las métricas clave

- **Prospectos:** cuántos clientes potenciales levantaron la mano (formulario, llamada, cita)
- **Costo por prospecto (CPL):** inversión en anuncios ÷ número de prospectos
- **Tasa de conversión:** el porcentaje que da el siguiente paso. *Si 200 personas visitan una página y 10 agendan una llamada, la tasa de conversión es 10 ÷ 200 = 5 %.*
- **Costo de adquisición de clientes (CAC):** costo total de ventas y marketing ÷ nuevos clientes obtenidos
- **Valor de vida del cliente (LTV):** el ingreso total promedio que aporta un cliente durante toda la relación
- **Retorno de la inversión publicitaria (ROAS):** ingresos de anuncios ÷ inversión en anuncios

Un negocio sano gana mucho más de un cliente con el tiempo (LTV) de lo que le cuesta conseguirlo (CAC).

## Elige una Estrella Polar

Elige la métrica que mejor represente el éxito para tu objetivo actual; en un negocio de servicios, a menudo son las **citas agendadas** o los **clientes nuevos por mes**. Cada otra métrica de tu informe debe ayudar a explicar por qué la Estrella Polar subió o bajó.

> Si un número no cambiaría lo que haces la próxima semana, no debería estar al principio de tu informe.
`,
      },
      {
        slug: 'analyzing-data-with-ai',
        title: 'Cómo analizar datos con IA',
        minutes: 45,
        tryIt: "Exporta los números del mes pasado de cualquier herramienta (o escribe diez filas a mano), quita nombres y datos de contacto, pégalos y pregunta: \"¿Qué patrón podría estar pasando por alto?\". Luego compruébalo tú con los datos.",
        body: `
Los asistentes de IA pueden leer una hoja de cálculo exportada y responder preguntas sobre ella en lenguaje sencillo. Eso convierte horas de trabajo en minutos, si la usas con cuidado.

## Lo que la IA hace bien con los datos

- Resumir una exportación de campaña: *"¿Qué tres anuncios tuvieron el menor costo por prospecto el mes pasado y qué tienen en común?"*
- Detectar tendencias: *"¿Cómo cambió la tasa de conversión semana a semana?"*
- Agrupar respuestas abiertas: *"Agrupa estas 300 respuestas de encuesta por temas y cuenta cada tema."*
- Sugerir gráficos y explicar lo que muestran
- Redactar el resumen escrito de un informe

## Cómo obtener respuestas confiables

1. **Limpia primero los datos.** Nombres de columnas claros, una fila por registro, sin celdas combinadas.
2. **Elimina la información personal.** Borra nombres, correos y teléfonos antes de subir el archivo.
3. **Explica qué significan las columnas**, por ejemplo: *"'Inversión' está en dólares; 'Resultados' significa prospectos."*
4. **Pídele que muestre su trabajo:** *"Explica cómo calculaste esto."*
5. **Verifica los números.** Recalcula tú mismo una o dos cifras clave antes de compartirlas.

## El gran riesgo: errores con total seguridad

La IA puede leer mal una columna, confundir totales con promedios o inventar un número que no está en los datos. Cuanto más importante sea la decisión, con más cuidado debes verificar. Trata el análisis de la IA como la primera revisión de un analista, no como la respuesta final.

## Correlación no es causalidad

Si las ventas subieron la semana en que publicaste más videos, los videos *podrían* ser la razón, o podría haber sido un día festivo, una promoción o el clima. La IA sugerirá explicaciones con gusto; a ti te toca ponerlas a prueba. Ese es el tema de la siguiente lección.

> Usa la IA para encontrar la pregunta que vale la pena hacer. Verifica por tu cuenta antes de apostar dinero a la respuesta.
`,
      },
      {
        slug: 'reporting-and-testing',
        title: 'Informes y el ciclo de prueba y aprendizaje',
        minutes: 35,
        tryIt: "Pídele a un asistente de IA: \"Ayúdame a planear una prueba para este mes: qué cambiaré, qué mediré y cómo sabré si funcionó\". Pon la prueba en tu calendario.",
        body: `
Un informe solo es útil si lleva a una decisión. Los mejores equipos de marketing aplican un ciclo sencillo cada semana.

## Un informe semanal de una página

1. **Estrella Polar:** esta semana vs. la semana pasada vs. la meta
2. **Qué pasó:** los dos o tres cambios más grandes y sus causas probables
3. **Qué aprendimos:** resultados de las pruebas que terminaron
4. **Qué haremos después:** las acciones específicas para la próxima semana

La IA puede redactar en segundos la sección de "qué pasó" a partir de tus datos exportados; tú la revisas y agregas el contexto que solo tú conoces.

## El ciclo de prueba y aprendizaje

1. **Hipótesis:** *"Si agregamos fotos de clientes a nuestros anuncios, el costo por prospecto bajará, porque la gente confía en los resultados reales."*
2. **Prueba:** cambia una sola cosa a la vez. Compara la nueva versión con la actual (una prueba A/B).
3. **Medición:** espera a tener suficientes datos. Unos pocos clics no son un resultado; deja correr la prueba hasta ver una diferencia consistente.
4. **Aprendizaje:** quédate con la ganadora, registra lo que aprendiste y planifica la siguiente prueba.

## Usa la IA para acelerar cada paso

- Genera hipótesis a partir de tus datos y de los comentarios de clientes
- Crea las variaciones de la prueba (titulares, imágenes, ofertas)
- Resume los resultados y redacta las notas de "qué aprendimos"

Lleva un registro sencillo de pruebas: fecha, hipótesis, qué cambió, resultado y decisión. Con los meses se convierte en uno de tus activos de marketing más valiosos: un registro de lo que funciona con *tus* clientes.

> Las mejoras pequeñas y constantes se acumulan. Un equipo que hace una buena prueba cada semana superará a uno que espera la gran idea perfecta.
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: tu plan de medición',
      body: `
1. Elige una métrica Estrella Polar para tu negocio (o un negocio de ejemplo) y explica por qué
2. Enumera de tres a cinco métricas de decisión de apoyo y de dónde sale cada una
3. Toma una exportación de campaña real o de ejemplo, elimina los datos personales y usa la IA para responder tres preguntas sobre ella; luego verifica una respuesta a mano
4. Escribe una hipótesis que se pueda probar usando el formato de la Lección 3
5. Redacta una plantilla de informe semanal de una página
`,
    },
    checklist: [
      "Elige una métrica Estrella del Norte y anota por qué",
      "Elige de tres a cinco métricas de apoyo y de dónde sale cada una",
      "Hazle tres preguntas a la IA sobre una exportación real y revisa una respuesta a mano",
      "Escribe una hipótesis de prueba que cambie una sola cosa",
      "Arma un informe semanal de una página y un horario fijo para llenarlo",
    ],
  },
  {
    number: '06',
    summary:
      'Reúne todo en un sistema completo de marketing con IA para un negocio real o de ejemplo aprueba la evaluación final y consigue que aprueben tu proyecto final para obtener tu certificado.',
    lessons: [
      {
        slug: 'capstone-brief',
        title: 'El brief del proyecto final',
        minutes: 120,
        tryIt: "Pega el brief del proyecto final en un asistente de IA y pídele que lo convierta en una lista de tareas con fechas repartidas en las próximas dos semanas. Ponla donde la veas cada día.",
        body: `
Tu proyecto final es un **Sistema de Marketing con IA** completo y práctico para un negocio: el tuyo, el de un cliente o un negocio de ejemplo que elijas. Reúne el trabajo que hiciste en cada módulo.

## Lo que debe incluir tu sistema

1. **Resumen del negocio:** qué vende, quién es su cliente ideal y su principal objetivo de marketing para los próximos 90 días
2. **Auditoría de oportunidades de IA:** las diez tareas que revisaste en el Módulo 01 y las dos que priorizaste, con el tiempo que esperas ahorrar
3. **Flujo de automatización:** un flujo del Módulo 02, con su disparador, acciones, pasos de IA, puntos de aprobación y plan ante fallas (construido o diseñado completamente en papel)
4. **Guía de voz de marca y biblioteca de prompts:** del Módulo 03, con al menos cinco prompts probados
5. **Plan de contenido:** pilares, una pieza pilar y sus piezas reutilizadas del Módulo 04, y un calendario de 30 días
6. **Plan de medición:** Estrella Polar, métricas de apoyo, plantilla de informe semanal y tus dos primeras hipótesis de prueba del Módulo 05
7. **Lista de uso responsable:** cómo este sistema protege los datos de los clientes, mantiene a una persona en el proceso y evita el contenido engañoso

## Recomendaciones

- **Sé específico.** "Publicar más en Instagram" no es un plan. "Publicar cada semana cuatro publicaciones de Educación y un video de Prueba, redactados con el prompt n.º 3 y editados por María" sí lo es.
- **Sé realista.** Diseña algo que realmente pueda funcionar con el tiempo, el presupuesto y las herramientas del negocio.
- **Muestra tu trabajo.** Incluye prompts reales, resultados reales de la IA y lo que cambiaste en ellos.

## Formato

Pon todo en un solo documento o presentación que se pueda entregar al dueño del negocio y poner en práctica al día siguiente. Guarda una copia: es la pieza de portafolio que demuestra lo que sabes hacer.

## Cómo entregarlo

Guárdalo como Google Doc, presentación de Google Slides o PDF, configura el acceso para que cualquier persona con el enlace pueda verlo y envía el enlace desde tu panel. Una persona de nuestro equipo revisa cada proyecto final. Si falta algo, te lo devolveremos con comentarios y podrás volver a enviarlo las veces que necesites.
`,
      },
      {
        slug: 'capstone-review',
        title: 'Revisión de tu sistema',
        minutes: 60,
        tryIt: "Pega una parte de tu proyecto final en un asistente de IA y pide: \"Revísalo como un dueño de negocio escéptico. ¿Qué no queda claro y qué haría que confiara más?\".",
        body: `
Antes de presentar la evaluación final, revisa tu proyecto con esta lista. Un sistema que cumple cada punto es uno que un negocio real podría poner a trabajar.

## Estrategia

- El objetivo de 90 días es específico y medible
- El cliente ideal está descrito con suficiente claridad para guiar el contenido y los anuncios
- Cada parte del sistema se conecta con el objetivo

## Flujo

- El flujo se puede explicar en una oración
- Los pasos de IA tienen un formato de respuesta fijo y un plan alternativo
- Los pasos que ve el cliente tienen aprobación humana
- Hay un responsable claro y una forma de saber cuándo falla

## Contenido

- Los pilares conectan las necesidades del cliente con lo que vende el negocio
- La pieza pilar contiene experiencia o conocimiento real, no solo contenido de IA
- Cada pieza ha sido editada y verificada

## Medición

- Hay una sola métrica Estrella Polar
- El informe semanal lleva a decisiones, no solo a números
- Las hipótesis cambian una sola cosa a la vez

## Responsabilidad

- Ningún dato personal de clientes entra en herramientas que no estén aprobadas para ello
- Nada de reseñas, testimonios ni imágenes engañosas o falsas
- Los clientes siempre pueden contactar a una persona

## ¿Listo para la evaluación final?

La evaluación final tiene 10 preguntas que cubren los seis módulos. Necesitas **80 % (8 de 10)** para aprobar. Si no apruebas, verás tu puntaje pero no qué respuestas fallaste, y podrás intentarlo de nuevo después de una hora. Usa ese tiempo para repasar las lecciones.

> Tu Certificado de Marketing con IA de N°1 Academy se emite cuando apruebas la evaluación final **y** aprueban tu proyecto final. Puedes hacerlos en cualquier orden.
`,
      },
      {
        slug: 'next-steps',
        title: 'Cómo mantener tus habilidades al día',
        minutes: 20,
        tryIt: "Pregúntale a un asistente de IA con búsqueda web: \"¿Qué cambió en las herramientas de IA para pequeños negocios en los últimos tres meses?\". Abre dos de sus fuentes y guarda una idea que valga la pena probar.",
        body: `
Las herramientas de IA cambian cada pocos meses. Las habilidades de este curso —pensar en embudos y flujos, escribir instrucciones claras, proteger tu marca y medir resultados— no.

## Mantente al día

- **Haz un experimento al mes.** Prueba una nueva herramienta o técnica en una tarea real y registra el resultado en tu registro de pruebas.
- **Mantén viva tu biblioteca de prompts.** Actualiza los prompts cuando cambien las herramientas y elimina los que nadie usa.
- **Vigila las reglas.** Las políticas de publicidad, privacidad y plataformas sobre la IA siguen cambiando; revísalas, sobre todo en industrias reguladas.
- **Enséñale a alguien más.** Explicarle tu flujo a un colega es la forma más rápida de encontrar sus fallas.

## Ponlo a trabajar

La forma más rápida de demostrar lo que aprendiste son los resultados. Pon a funcionar tu sistema del proyecto final, mídelo durante 30 días y escribe lo que pasó: los números, lo que cambiaste y lo que aprendiste. Ese informe vale más para un cliente o un empleador que cualquier lista de herramientas.
`,
      },
    ],
    exercise: {
      title: 'Proyecto final: tu sistema de marketing con IA',
      body: `
Completa las siete partes del proyecto final descritas en la Lección 1, revísalo con la lista de la Lección 2 envíalo desde tu panel y luego presenta la evaluación final a continuación.
`,
    },
    checklist: [
      "Elige el negocio de tu proyecto final",
      "Pon las siete partes del proyecto final en un solo documento",
      "Revísalo con cada punto de la lista de la Lección 2",
      "Dáselo al dueño (o a un amigo) y pregúntale qué no queda claro",
      "Pon el sistema en marcha 30 días y anota lo que pasó",
    ],
  },
  {
    number: '07',
    summary:
      'Haz que un negocio local aparezca en Google Maps y en las búsquedas locales: cómo funciona el ranking local, cómo configurar bien un Perfil de Empresa de Google y cómo mantener los datos del negocio iguales en toda la web.',
    lessons: [
      {
        slug: 'how-local-search-works',
        title: 'Cómo funciona la búsqueda local',
        minutes: 30,
        tryIt: "Busca en Google \"[tu servicio] cerca de mí\" desde tu teléfono. Anota los tres negocios que salen en el mapa y pregúntale a un asistente de IA qué parecen hacer diferente a ti.",
        body: `
Cuando alguien busca "café cerca de mí" o "barbería en South Boston", Google muestra un mapa con tres negocios debajo. Ese recuadro se llama [[local pack|local-pack]] (el paquete local), y para la mayoría de los negocios pequeños importa más que cualquier anuncio. Quien busca así normalmente quiere comprar hoy.

Los negocios del paquete local salen de su [[Perfil de Empresa de Google|gbp]]: la ficha gratuita que muestra el nombre, el horario, las fotos, las reseñas y un botón para llamar o pedir indicaciones.

## Las tres cosas que mira Google

Google dice que los resultados locales dependen de tres cosas:

- **Relevancia:** qué tan bien coincide el perfil con lo que la persona buscó. Aquí importan las categorías, los servicios y la descripción correctos.
- **Distancia:** qué tan lejos está el negocio de quien busca, o del lugar que aparece en la búsqueda. Esto no se puede cambiar.
- **Prominencia:** qué tan conocido y confiable es el negocio. Cuentan las reseñas, la calificación, los enlaces, las menciones en la web y un perfil completo y activo.

No puedes acercar una tienda a sus clientes, así que todo el trabajo está en la relevancia y la prominencia.

## Por qué es lo primero que hay que arreglar

- Es gratis. Un Perfil de Empresa de Google no cuesta nada.
- Ahí están los compradores. Las búsquedas locales suelen terminar en una llamada, una visita o una ruta el mismo día.
- La mayoría de los negocios pequeños lo dejan a medias: horario equivocado, sin fotos desde la inauguración, una categoría vaga, reseñas sin responder. Solo con arreglar eso, muchos negocios suben.

## Cómo se ve un perfil "bueno"

- La **categoría principal** correcta (el ajuste de relevancia más importante)
- Nombre, dirección, teléfono y horario correctos, incluidos los días festivos
- Una descripción clara de qué hace el negocio, para quién y dónde
- Fotos reales del lugar, del equipo y del trabajo, que se agregan con regularidad
- Servicios o productos con descripciones cortas
- Reseñas recientes, cada una con respuesta del dueño
- Publicaciones en los últimos uno o dos meses

> El nombre del perfil debe ser el nombre real del negocio. Agregarle palabras clave ("Pizzería Tony Mejor Pizza Boston") va contra las reglas de Google y puede hacer que suspendan el perfil.
`,
      },
      {
        slug: 'optimizing-the-profile',
        title: 'Cómo configurar y optimizar un Perfil de Empresa de Google',
        minutes: 50,
        tryIt: "Pega la descripción de tu Perfil de Empresa de Google en un asistente de IA y pide: \"Reescríbela en menos de 750 caracteres con mi servicio principal y mi ciudad en la primera frase. Sin palabras exageradas\".",
        body: `
Primero busca el nombre del negocio en Google Maps. Muchos negocios ya tienen un perfil que Google creó automáticamente. Si existe, elige **Reclamar esta empresa** en lugar de crear uno nuevo. Los perfiles duplicados confunden a Google y a los clientes.

## Paso 1: Verificarlo

Google necesita confirmar que el negocio es real antes de publicar la mayoría de los cambios. Según el negocio, la verificación puede ser un video del local, una llamada, un mensaje de texto, un correo o una postal. Sigue las opciones que Google ofrece en el perfil. Mientras no esté verificado, trabaja en lo demás, pero no esperes que aparezca bien.

## Paso 2: Los datos básicos, exactos

- **Nombre:** el del letrero, sin agregar nada.
- **Categoría principal:** la más específica que corresponda ("Barbería", no "Belleza"). Agrega algunas **categorías secundarias** para los otros servicios principales.
- **Dirección o zona de servicio:** un local que recibe clientes muestra su dirección. Un negocio que va a los clientes (plomero, lavado de autos a domicilio) define una zona de servicio y puede ocultar la dirección.
- **Teléfono y sitio web:** un número local que el negocio conteste. El enlace debe llevar a la página más relevante.
- **Horario:** el horario normal y horarios especiales para días festivos. Un horario equivocado es de las formas más rápidas de ganarse una reseña de una estrella.

Anota estos datos en un solo lugar. En la Lección 3 usarás exactamente el mismo [[NAP|nap]] (nombre, dirección, teléfono) en todos lados.

## Paso 3: Completar todo lo demás

- **Descripción (hasta 750 caracteres):** qué hace el negocio, para quién, qué lo hace diferente y la zona que atiende. Escríbela para personas, no para Google.
- **Servicios o productos:** cada uno con una descripción corta y sencilla, y precio si el negocio quiere mostrarlo.
- **Atributos:** acceso para silla de ruedas, terraza, negocio de mujeres, etc., cuando apliquen.
- **Fotos:** fachada (para que la reconozcan al llegar), interior, equipo, productos y trabajos terminados. Las fotos reales siempre ganan a las de stock.

## Paso 4: Mantenerlo activo

- **Publicaciones:** una novedad, oferta o evento corto, con foto y botón. Una por semana es buen ritmo; una al mes es lo mínimo.
- **Fotos nuevas** cada mes.
- **Responder todas las reseñas** (el Módulo 08 explica cómo).
- **Revisar la pestaña Rendimiento cada mes:** llamadas, solicitudes de ruta, clics al sitio web y las búsquedas que encontraron el perfil.

## Dónde ayuda la IA

- Redactar la descripción a partir de las notas del dueño, y luego editarla para que suene como él
- Convertir la novedad de la semana en una publicación, un texto para Instagram y un mensaje para los clientes frecuentes
- Hacer una lluvia de ideas para la lista de servicios a partir del menú o la lista de precios
- Resumir los números de Rendimiento en una nota mensual de dos líneas

Un prompt que funciona bien para publicaciones:

> "Escribes publicaciones del Perfil de Empresa de Google para [negocio], un [tipo de negocio] en [barrio]. Escribe una publicación de 80 a 120 palabras sobre [la novedad u oferta de esta semana]. Usa un tono cercano y sencillo, menciona el barrio una vez, termina con una sola acción clara (llamar, reservar o visitar) y no uses hashtags ni emojis."

Revisa cada dato, precio y fecha antes de publicar. Google puede quitar publicaciones con teléfonos equivocados, enlaces a sitios que no tienen que ver u ofertas engañosas.
`,
      },
      {
        slug: 'local-seo-beyond-google',
        title: 'SEO local más allá del perfil',
        minutes: 40,
        tryIt: "Pregúntale a un asistente de IA: \"Enumera los principales directorios en línea para un [tu tipo de negocio] en [tu país]\". Revisa en dos de ellos que tu nombre, dirección y teléfono sean correctos.",
        body: `
El Perfil de Empresa de Google es la pieza más grande, pero Google también mira lo que dice el resto de internet sobre el negocio. Aquí el [[SEO local|local-seo]] va más allá del perfil.

## Los mismos datos en todas partes

Una [[citación|citation]] es cualquier lugar en línea que muestra el nombre, la dirección y el teléfono del negocio: Yelp, Apple Maps, Bing, Facebook, la cámara de comercio, directorios del sector. Cuando esos datos coinciden, Google confía en ellos. Cuando no (una dirección vieja, otro teléfono), no sabe cuál es el correcto.

Empieza por las fichas que más importan:

- **Apple Business Connect** (Apple Maps y Siri, que muchos usuarios de iPhone usan para buscar)
- **Bing Places** (Bing y varios asistentes de IA que usan datos de Bing)
- **Yelp** y **Facebook**
- Los directorios del sector: por ejemplo TripAdvisor para restaurantes, Doctoralia para clínicas o Houzz para contratistas

Usa exactamente el mismo nombre, dirección y teléfono de la Lección 2. Una hoja de cálculo con una fila por ficha, su enlace y su acceso lo hace manejable.

## El sitio web respalda el perfil

- El sitio muestra el mismo nombre, dirección, teléfono y horario, normalmente en el pie de página.
- Un negocio que atiende varias ciudades tiene una página real para cada servicio o zona principal, con información útil, no el mismo texto cambiando el nombre de la ciudad.
- El título de la página de inicio dice qué es el negocio y dónde: "Brancato Barbershop | Cortes y afeitado en South Boston".
- Agregar [[marcado de schema|schema]] (un pequeño código que etiqueta los datos del negocio para los buscadores) ayuda a Google a leerlos bien. La mayoría de los creadores de sitios tienen un ajuste o plugin para esto.
- El sitio carga rápido y funciona bien en el celular, donde ocurre la mayoría de las búsquedas locales.

## Aparecer también en las respuestas de IA

Cada vez más personas le piden recomendaciones a ChatGPT, Gemini o a los resultados de IA de Google. Esas respuestas se arman con las mismas señales: un perfil completo, fichas coherentes, muchas reseñas recientes y un sitio web claro. El trabajo de este módulo también ayuda ahí.

## Medirlo

Una vez al mes, anota:

- Llamadas, solicitudes de ruta y clics al sitio web de la pestaña Rendimiento
- El número de reseñas y la calificación promedio
- Dónde aparece el negocio en sus dos o tres búsquedas más importantes (busca desde el barrio en un celular, o pídele a alguien de la zona que revise)

> El SEO local es un trabajo lento y constante. Espera cambios en semanas y meses, no en días. Quien promete el primer lugar en Maps para la próxima semana está adivinando o haciendo trampa.
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: auditoría de visibilidad local y lista de arreglos',
      body: `
Elige un negocio local: el tuyo, el de un cliente o uno cerca de ti. Con lo que aprendiste:

1. Búscalo en Google Maps desde un celular y toma una captura de lo que ve un cliente
2. Califica el perfil con la lista de "perfil bueno" de la Lección 1, un punto por cada elemento
3. Escribe en un solo lugar el nombre, dirección, teléfono, horario y categoría principal correctos
4. Revisa Apple Maps, Bing, Yelp y Facebook y anota cada dato que no coincida
5. Usa la IA para redactar una nueva descripción y dos publicaciones, y edítalas hasta que suenen como el dueño
6. Convierte todo en una lista de arreglos, ordenada por lo que más impacto tendrá primero

Es la misma auditoría que Number 1 Digital Marketing hace para sus clientes. Bien hecha, es algo por lo que el dueño de un negocio pagaría.
`,
    },
    checklist: [
      'Encuentra el negocio en Google Maps y reclama o verifica su perfil',
      'Elige la categoría principal más específica y dos o tres secundarias',
      'Deja exactos el nombre, la dirección, el teléfono y el horario, incluidos los festivos',
      'Escribe con IA una descripción de 750 caracteres y edítala con la voz del dueño',
      'Agrega servicios o productos con descripciones cortas',
      'Sube al menos 10 fotos reales: fachada, interior, equipo y trabajos',
      'Haz una primera publicación y agenda una publicación semanal',
      'Iguala los datos en Apple Business Connect, Bing Places, Yelp y Facebook',
      'Revisa que el sitio web muestre el mismo nombre, dirección, teléfono y horario',
      'Anota las llamadas, rutas y clics al sitio de este mes como punto de partida',
    ],
  },
  {
    number: '08',
    summary:
      'Consigue un flujo constante de reseñas honestas y responde bien cada una, usando la IA para redactar respuestas y encontrar patrones sin romper las reglas.',
    lessons: [
      {
        slug: 'why-reviews-matter',
        title: 'Por qué las reseñas generan ventas locales',
        minutes: 30,
        tryIt: "Copia cinco reseñas recientes (tuyas o de un competidor) en un asistente de IA y pregunta: \"¿Qué mencionan más los clientes contentos? ¿Y los descontentos?\".",
        body: `
Las reseñas hacen dos trabajos a la vez. Ayudan al negocio a posicionarse en el [[local pack|local-pack]], porque forman parte de cómo Google mide la prominencia. Y convencen a quien las lee de llamar, reservar o entrar.

## Lo que miran los clientes

- **Calificación:** la mayoría descarta los negocios con menos de unas cuatro estrellas.
- **Cantidad:** 150 reseñas dan más confianza que 12, aunque la calificación sea igual.
- **Qué tan recientes son:** un perfil cuya última reseña es del año pasado parece cerrado o descuidado.
- **Qué dicen:** la gente lee el texto, sobre todo el de las malas reseñas, para ver qué salió mal.
- **Las respuestas del dueño:** una respuesta tranquila y útil a una mala reseña muchas veces genera más confianza que una calificación perfecta.

## Las reglas (no son opcionales)

- **Nada de reseñas falsas.** No escribas reseñas para el negocio, no le pagues a nadie para hacerlo y no pidas a empleados ni familiares que las publiquen. En EE. UU., la regla de la FTC sobre reseñas falsas permite multas grandes por comprarlas, venderlas o escribirlas, y Google las elimina y puede restringir el perfil.
- **Nada de [[filtrar reseñas|review-gating]].** No pidas reseñas solo a los clientes contentos, ni mandes primero a los descontentos a otro lugar. Las reglas de Google dicen que se le pide a todos los clientes de la misma forma.
- **Nada de premios por reseñas en Google.** Descuentos, productos gratis o rifas a cambio de una reseña van contra las reglas de Google.
- **Nunca reseñas escritas con IA.** La IA puede ayudar al negocio a *responder*, nunca a escribir la reseña.
- **Protege la privacidad.** Nunca confirmes en una respuesta que alguien fue cliente ni compartas sus datos. Esto importa todavía más en negocios de salud, legales o financieros.

> Un flujo constante de reseñas honestas le gana a cualquier truco. Cada atajo aquí va contra las reglas, contra la ley, o las dos cosas.
`,
      },
      {
        slug: 'getting-more-reviews',
        title: 'Cómo conseguir más reseñas',
        minutes: 40,
        tryIt: "Pídele a un asistente de IA: \"Escribe un mensaje amable de dos frases pidiendo a un cliente una reseña en Google. Sin incentivos ni presión\". Edítalo y guárdalo en tu teléfono.",
        body: `
La mayoría de los clientes contentos nunca deja una reseña porque nadie se lo pidió, o porque dejarla costaba demasiado esfuerzo. La solución es pedírsela a cada cliente, en el momento justo, con un enlace de un solo toque.

## Consigue el enlace de reseñas

En el Perfil de Empresa de Google, elige **Pedir reseñas** (u **Obtener más reseñas**) para copiar un enlace corto que abre directamente el cuadro de reseña. Guárdalo donde todo el equipo lo tenga a mano.

## Pídela en el momento justo

El mejor momento es justo después de que el cliente recibió lo que vino a buscar:

- Barbería o salón: al pagar, mientras el cliente se mira en el espejo
- Restaurante o cafetería: en el recibo, o con una tarjeta junto a la cuenta
- Contratista o limpieza: el día que se termina el trabajo, con fotos del antes y el después
- Pedido en línea: unos días después de la entrega

## Hazlo fácil

- **Dilo en persona:** "Si quedaste contento hoy, una reseña en Google ayuda muchísimo a un negocio pequeño como el nuestro. Aquí está el enlace."
- **Un código QR o una tarjeta [[NFC|nfc]] en el mostrador:** un toque o un escaneo abre el cuadro de reseña. (Las Tap Cards de Number 1 hacen exactamente esto.)
- **Un mensaje de texto o correo de seguimiento** el mismo día, con el enlace. Los mensajes de texto se leen mucho más que los correos.
- **Un recordatorio** unos días después si no la dejó, y luego nada más. Un recordatorio ayuda; más de uno molesta.

## Usa la IA y la automatización con cuidado

- Redacta los mensajes de solicitud con IA en la voz del negocio y que el dueño los apruebe una vez.
- Si el negocio tiene un sistema de reservas o de punto de venta, una automatización puede enviar la solicitud después de cada visita (aquí sirve lo que aprendiste en el Módulo 02). Envíala a **todos** los clientes, no solo a los que crees que quedaron contentos.
- Lleva una cuenta simple cada semana: solicitudes enviadas y reseñas recibidas. Si las solicitudes salen y las reseñas no llegan, cambia el texto o el momento.

Un mensaje de solicitud que funciona:

> "Hola [nombre], ¡gracias por venir hoy a [negocio]! Si tienes un minuto, una reseña rápida en Google nos ayudaría muchísimo: [enlace]. ¡Gracias! [nombre del dueño]"

Que sea corto, personal y firmado por una persona real.
`,
      },
      {
        slug: 'responding-with-ai',
        title: 'Cómo responder reseñas con IA',
        minutes: 45,
        tryIt: "Pega una reseña real en un asistente de IA y pide: \"Redacta una respuesta corta y cálida del dueño. No prometas nada que yo no haya dicho\". Edítala antes de publicarla.",
        body: `
Cada reseña merece una respuesta: muestra a los futuros clientes que a alguien le importa, y Google mismo recomienda responder. Intenta responder en uno o dos días.

## Responder a las buenas reseñas

Corto y específico. Agradece por su nombre, menciona un detalle de su reseña e invítalo a volver. Evita pegar el mismo "¡Gracias por la reseña!" en todas. La gente lo nota.

## Responder a las malas reseñas

Usa un marco simple de cuatro pasos:

1. **Agradece** que se tomó el tiempo de escribir.
2. **Reconoce** el problema sin discutir ni poner excusas.
3. **Llévalo a privado:** da un nombre y una forma directa de contactar al dueño o encargado.
4. **Di qué va a cambiar,** si algo va a cambiar.

Nunca discutas, nunca compartas detalles de su visita y nunca respondas enojado. Los futuros clientes leen la respuesta más que la propia persona que escribió la reseña.

## La IA redacta, tú decides

La IA es muy buena para un primer borrador tranquilo, sobre todo cuando el dueño está molesto. Un prompt que funciona:

> "Respondes reseñas de Google para [negocio], un [tipo de negocio] en [barrio]. Nuestro tono es [cálido, directo, un poco divertido]. Escribe una respuesta de 40 a 80 palabras a la reseña de abajo. Agradece por su nombre, menciona un detalle específico de su reseña y no uses signos de exclamación más de una vez. Si la reseña es negativa, discúlpate por su experiencia, no discutas, no menciones detalles de su visita e invítalo a contactar a [nombre del dueño] al [teléfono o correo]. Reseña: [pega la reseña]"

Luego léela antes de publicarla. Asegúrate de que suene como el dueño, que no diga nada falso y que no tenga datos privados.

## Reseñas que rompen las reglas

Si una reseña es spam, de alguien que nunca fue cliente, ofensiva o claramente de un competidor, denúnciala desde el perfil (**Denunciar reseña**) y explica por qué. No esperes que todas las denuncias funcionen, y nunca pidas a amigos que llenen el perfil de reseñas para esconderla.

## Encuentra patrones en las reseñas

Cada pocos meses, copia las últimas 50 reseñas (sin nombres) en una herramienta de IA y pregunta:

> "Agrupa estas reseñas en los cinco temas más comunes, positivos y negativos. Para cada tema, da el número de reseñas que lo mencionan y una cita corta. Luego sugiere un cambio que el negocio podría hacer según los temas negativos."

Las respuestas son de los mejores consejos de marketing y de operación que puede recibir un negocio, y son gratis. Usa los temas positivos en anuncios y en el sitio web, con las palabras de los propios clientes.
`,
      },
    ],
    exercise: {
      title: 'Ejercicio: arma un sistema de reseñas',
      body: `
Con el mismo negocio del Módulo 07:

1. Copia su enlace corto de reseñas de Google
2. Escribe la frase para pedirla en persona, el mensaje de seguimiento y el recordatorio en la voz del negocio (borrador con IA, edición humana)
3. Decide cuándo sale cada uno y quién lo envía
4. Escribe el prompt de respuestas del negocio con el ejemplo de la Lección 3, completado con su tono y sus datos de contacto
5. Úsalo para responder las tres reseñas más recientes, incluida una negativa si la hay
6. Usa el prompt de patrones con las reseñas recientes del negocio y anota los tres temas principales

Revisa tu sistema con las reglas de la Lección 1 antes de poner algo en marcha.
`,
    },
    checklist: [
      'Copia el enlace corto de reseñas de Google y guárdalo donde todo el equipo lo tenga',
      'Escribe la frase en persona, el mensaje de seguimiento y un recordatorio',
      'Pon un código QR o una tarjeta NFC de reseñas en el mostrador',
      'Organiza una forma de pedir reseña a todos los clientes, no solo a los contentos',
      'Escribe el prompt de respuestas del negocio con su tono y sus datos de contacto',
      'Responde todas las reseñas de los últimos 90 días',
      'Denuncia cualquier reseña que claramente rompa las reglas de Google',
      'Usa el prompt de patrones con las reseñas recientes y anota los tres temas principales',
      'Empieza una cuenta semanal de solicitudes enviadas y reseñas recibidas',
    ],
  },
];
