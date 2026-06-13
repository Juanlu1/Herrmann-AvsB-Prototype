import type { Question } from './herrmann-types'

export const questions: Question[] = [
  {
    id: 1,
    context: "Cuando tengo tiempo libre...",
    optionA: { text: "Veo cuántos seguidores gané o perdí esta semana y trato de entender por qué", quadrant: 'A' },
    optionB: { text: "Invento un personaje ficticio con su historia, personalidad y vida entera", quadrant: 'D' },
    screenType: 'narrative'
  },
  {
    id: 2,
    context: "Escuchando música...",
    optionA: { text: "Ordeno mi playlist por géneros, artistas o momentos del día", quadrant: 'B' },
    optionB: { text: "Armo una playlist mezclando canciones que en teoría no van juntas y veo si funciona", quadrant: 'D' },
    screenType: 'ultra-fast'
  },
  {
    id: 3,
    context: "Cuando tengo un rato libre...",
    optionA: { text: "Calculo cuánta plata gasté este mes y en qué se fue", quadrant: 'A' },
    optionB: { text: "Le escribo a un amigo que no veo hace tiempo para ponernos al día", quadrant: 'C' },
    screenType: 'comparative'
  },
  {
    id: 4,
    context: "Para pasar la tarde con amigos...",
    optionA: { text: "Que no haya plan ni agenda y que la charla fluya sola", quadrant: 'C' },
    optionB: { text: "Organizo todo de antes: lugar, horario, quién trae qué", quadrant: 'B' },
    screenType: 'narrative'
  },
  {
    id: 5,
    context: "Cuando tengo tiempo libre en casa...",
    optionA: { text: "Me pongo a dibujar o garabatear sin ningún objetivo", quadrant: 'D' },
    optionB: { text: "Armo un horario para la semana y dejo todo ordenado antes de que empiece", quadrant: 'B' },
    screenType: 'ultra-fast'
  },
  {
    id: 6,
    context: "Para entretenerme...",
    optionA: { text: "Resuelvo un acertijo o juego de lógica hasta llegar a la respuesta exacta", quadrant: 'A' },
    optionB: { text: "Ayudo a un amigo a organizarse sobre algo que quiere hacer pero no sabe cómo arrancar", quadrant: 'C' },
    screenType: 'comparative'
  },
  {
    id: 7,
    context: "Cuando tengo ganas de cocinar algo...",
    optionA: { text: "Improviso con lo que hay en la heladera sin mirar ninguna receta", quadrant: 'D' },
    optionB: { text: "Sigo una receta paso a paso hasta que quede exactamente como dice", quadrant: 'B' },
    screenType: 'narrative'
  },
  {
    id: 8,
    context: "Cuando termina un día intenso...",
    optionA: { text: "Hablo con alguien de confianza: cuento algo del día y escucho cómo estuvo el de esa persona", quadrant: 'C' },
    optionB: { text: "Busco en internet quién tiene razón en alguna discusión que me quedó dando vueltas", quadrant: 'A' },
    screenType: 'ultra-fast'
  },
  {
    id: 9,
    context: "Cuando mi cuarto me cansa...",
    optionA: { text: "Muevo muebles y objetos para que se sienta diferente", quadrant: 'D' },
    optionB: { text: "Ordeno todo hasta que cada cosa tenga un lugar lógico y definido", quadrant: 'B' },
    screenType: 'comparative'
  },
  {
    id: 10,
    context: "Cuando quiero comprarme un celular nuevo...",
    optionA: { text: "Comparo características y precios hasta saber cuál tiene la mejor relación calidad-precio", quadrant: 'A' },
    optionB: { text: "Imagino cómo sería el celular perfecto para mí sin límite de presupuesto", quadrant: 'D' },
    screenType: 'narrative'
  },
  {
    id: 11,
    context: "Cuando me explican un juego nuevo...",
    optionA: { text: "Leo las instrucciones completas antes de tocar nada", quadrant: 'B' },
    optionB: { text: "Agarro las piezas y empiezo a jugar directamente sin leer nada", quadrant: 'D' },
    screenType: 'ultra-fast'
  },
  {
    id: 12,
    context: "Cuando no entiendo algo...",
    optionA: { text: "Busco el video más completo y me tomo notas hasta entenderlo del todo", quadrant: 'A' },
    optionB: { text: "Le pido a alguien que ya sabe que me lo explique a su manera mientras charlamos", quadrant: 'C' },
    screenType: 'comparative'
  },
  {
    id: 13,
    context: "Para aprender algo nuevo...",
    optionA: { text: "Veo un video de alguien apasionado que me inspire, aunque no entienda todo", quadrant: 'D' },
    optionB: { text: "Sigo un tutorial paso a paso, pausando y repitiendo cada parte hasta que me salga", quadrant: 'B' },
    screenType: 'narrative'
  },
  {
    id: 14,
    context: "Para aprender algo que me interesa...",
    optionA: { text: "Me sumo a un grupo donde todos comparten lo que van aprendiendo", quadrant: 'C' },
    optionB: { text: "Estudio solo buscando fuentes confiables y verificando cada cosa antes de creerla", quadrant: 'A' },
    screenType: 'ultra-fast'
  },
  {
    id: 15,
    context: "Cuando quiero dominar algo nuevo...",
    optionA: { text: "Lo practico una y otra vez con el mismo método hasta que me salga solo", quadrant: 'B' },
    optionB: { text: "Pruebo distintas variaciones para encontrar mi propio estilo", quadrant: 'D' },
    screenType: 'comparative'
  },
  {
    id: 16,
    context: "Para saber si algo vale la pena (serie, libro, juego)...",
    optionA: { text: "Leo una reseña con argumentos claros sobre por qué es bueno o malo", quadrant: 'A' },
    optionB: { text: "Lo veo o pruebo un rato y saco mis propias conclusiones", quadrant: 'D' },
    screenType: 'narrative'
  },
  {
    id: 17,
    context: "Para convencerme de hacer algo nuevo (comer sano, hacer ejercicio, etc.)...",
    optionA: { text: "Leo experiencias de gente real que ya lo hizo y cómo les fue en el proceso", quadrant: 'C' },
    optionB: { text: "Veo estadísticas y estudios que demuestran que funciona", quadrant: 'A' },
    screenType: 'ultra-fast'
  },
  {
    id: 18,
    context: "Cuando tengo que resolver un problema que nunca encaré antes...",
    optionA: { text: "Pienso todas las partes del problema antes de hacer cualquier cosa", quadrant: 'B' },
    optionB: { text: "Me tiro a probarlo de a poco y ajusto según lo que vaya pasando", quadrant: 'D' },
    screenType: 'comparative'
  },
  {
    id: 19,
    context: "Cuando se me rompe algo...",
    optionA: { text: "Intento arreglarlo de alguna forma creativa con lo que tengo a mano", quadrant: 'D' },
    optionB: { text: "Busco el tutorial correcto y lo sigo al pie de la letra", quadrant: 'B' },
    screenType: 'narrative'
  },
  {
    id: 20,
    context: "Cuando hay drama entre amigos...",
    optionA: { text: "Entiendo bien qué pasó y digo claramente quién tiene razón", quadrant: 'A' },
    optionB: { text: "Escucho a cada uno por separado antes de opinar", quadrant: 'C' },
    screenType: 'ultra-fast'
  },
  {
    id: 21,
    context: "Cuando hay que resolver algo en grupo...",
    optionA: { text: "Elijo la opción más eficiente, aunque no sea la más cómoda para todos", quadrant: 'A' },
    optionB: { text: "Elijo la opción que le genere menos problema a las personas involucradas", quadrant: 'C' },
    screenType: 'comparative'
  },
  {
    id: 22,
    context: "Antes de hacer algo importante...",
    optionA: { text: "Escribo los pasos que voy a seguir para no olvidar nada", quadrant: 'B' },
    optionB: { text: "Me visualizo haciéndolo y arranco con lo que ya sé", quadrant: 'D' },
    screenType: 'narrative'
  },
  {
    id: 23,
    context: "Cuando hay una discusión...",
    optionA: { text: "Construyo el argumento más sólido posible para defender mi postura", quadrant: 'A' },
    optionB: { text: "Veo si hay una tercera opción que nadie consideró todavía", quadrant: 'D' },
    screenType: 'ultra-fast'
  },
  {
    id: 24,
    context: "Cuando arrancamos una tarea en grupo...",
    optionA: { text: "Pregunto cómo está cada uno antes de empezar", quadrant: 'C' },
    optionB: { text: "Arranco directo con los objetivos y lo que hay que hacer", quadrant: 'A' },
    screenType: 'comparative'
  },
  {
    id: 25,
    context: "Cuando me voy de viaje...",
    optionA: { text: "Hago una lista de todo lo que necesito y lo voy tachando mientras empaco", quadrant: 'B' },
    optionB: { text: "Empaco a ojo y consigo lo que me falte cuando llego", quadrant: 'D' },
    screenType: 'narrative'
  },
  {
    id: 26,
    context: "Para llevar un registro de cómo me fue en la semana...",
    optionA: { text: "Reviso cuánto dormí, cuánto caminé o cuánto comí", quadrant: 'A' },
    optionB: { text: "Hablo con alguien de confianza y contamos cómo estuvo la semana de cada uno", quadrant: 'C' },
    screenType: 'ultra-fast'
  },
  {
    id: 27,
    context: "Para el fin de semana...",
    optionA: { text: "Me propongo hacer algo que nunca hice, sin planear demasiado", quadrant: 'D' },
    optionB: { text: "Planeo todo con anticipación para que salga bien", quadrant: 'B' },
    screenType: 'comparative'
  },
  {
    id: 28,
    context: "Cuando termino de escribir un mensaje importante...",
    optionA: { text: "Lo releo varias veces buscando errores antes de mandarlo", quadrant: 'A' },
    optionB: { text: "Lo mando apenas termino, aunque no esté perfectamente pulido", quadrant: 'D' },
    screenType: 'narrative'
  },
  {
    id: 29,
    context: "Cuando noto que un amigo está raro...",
    optionA: { text: "Le busco el momento y le pregunto si está bien o si hay algo que le esté pasando", quadrant: 'C' },
    optionB: { text: "Espero a que me lo cuente y lo ayudo a pensar qué hacer", quadrant: 'A' },
    screenType: 'ultra-fast'
  },
  {
    id: 30,
    context: "Para empezar el día...",
    optionA: { text: "Sigo siempre la misma rutina y que todo esté en orden", quadrant: 'B' },
    optionB: { text: "Arranco según cómo me siento o lo que se me ocurra ese día", quadrant: 'D' },
    screenType: 'comparative'
  },
  {
    id: 31,
    context: "Cuando aprendo o vivo algo que me parece importante...",
    optionA: { text: "Se lo cuento a alguien de una forma que le sea útil o le llame la atención", quadrant: 'C' },
    optionB: { text: "Lo anoto en algún lado para no olvidarlo y poder usarlo después", quadrant: 'A' },
    screenType: 'narrative'
  },
  {
    id: 33,
    context: "Cuando un amigo me cuenta que está mal...",
    optionA: { text: "Lo escucho sin interrumpirlo, sin darle consejos, solo acompañarlo", quadrant: 'C' },
    optionB: { text: "Lo escucho y después lo ayudo a pensar qué puede hacer para resolverlo", quadrant: 'A' },
    screenType: 'ultra-fast'
  },
  {
    id: 34,
    context: "Cuando hay un trabajo en grupo...",
    optionA: { text: "Divido las tareas desde el arranque para que quede claro quién hace qué", quadrant: 'B' },
    optionB: { text: "Que cada uno haga lo que le sale mejor y unir todo al final", quadrant: 'D' },
    screenType: 'comparative'
  },
  {
    id: 35,
    context: "Cuando alguien dice algo con lo que no estoy de acuerdo...",
    optionA: { text: "Analizo si lo que dice tiene sentido o no, y armo mi respuesta con argumentos", quadrant: 'A' },
    optionB: { text: "Entiendo desde dónde lo dice y por qué piensa eso, aunque no lo comparta", quadrant: 'C' },
    screenType: 'narrative'
  },
  {
    id: 36,
    context: "Cuando hay un problema que resolver en grupo...",
    optionA: { text: "Propongo algo que nunca probamos, aunque no esté seguro de que funcione", quadrant: 'D' },
    optionB: { text: "Hago lo que ya sabemos que funciona, aunque sea menos emocionante", quadrant: 'B' },
    screenType: 'ultra-fast'
  },
  {
    id: 37,
    context: "Después de una situación tensa en grupo...",
    optionA: { text: "Pienso si alguien del grupo se sintió incómodo o excluido", quadrant: 'C' },
    optionB: { text: "Pienso si el resultado fue el mejor que podíamos lograr", quadrant: 'A' },
    screenType: 'comparative'
  }
]

export function shuffleQuestions(questionsArray: Question[]): Question[] {
  const shuffled = [...questionsArray]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
