/* eslint-disable */
// Phrase corpus. Each entry: a main sentence plus an alt example, both with a
// French translation. `ctx` is the French label shown above the card; `lvl` is
// the CEFR level. Spain Spanish (es-ES voice), written for a woman speaking.
// File order = the order Réviser and Mains libres introduce phrases, so the
// sections she needs most come first. Ids are stable and need not be in file
// order: append new ids after the current max; never renumber.
//
// Levelled on her placement exam; see CLAUDE.md (learner profile).
var PHRASES = [
  // ── Comprendre et se faire comprendre ──────────────────
  { id: 1, lvl: 'A1', ctx: 'Demander de ralentir', es: "¿Puede hablar más despacio, por favor?", fr: "Vous pouvez parler plus lentement, s'il vous plaît ?", alt_es: "¿Puedes hablar más despacio? Es que no te sigo.", alt_fr: "Tu peux parler plus lentement ? Je n'arrive pas à te suivre." },
  { id: 2, lvl: 'A2', ctx: 'Quand on n\'a pas compris', es: "Perdone, no le he entendido.", fr: "Pardon, je ne vous ai pas compris.", alt_es: "Perdona, no te he entendido bien.", alt_fr: "Pardon, je ne t'ai pas bien compris." },
  { id: 3, lvl: 'A1', ctx: 'Faire répéter', es: "¿Me lo puede repetir, por favor?", fr: "Vous pouvez me le répéter, s'il vous plaît ?", alt_es: "¿Me lo repites, por favor?", alt_fr: "Tu me le répètes, s'il te plaît ?" },
  { id: 4, lvl: 'A1', ctx: 'Demander un mot', es: "¿Qué significa esta palabra?", fr: "Que veut dire ce mot ?", alt_es: "¿Cómo se dice esto en español?", alt_fr: "Comment dit-on ça en espagnol ?" },
  { id: 84, lvl: 'A2', ctx: 'Quand le mot ne vient pas', es: "Espere, no me sale la palabra.", fr: "Attendez, le mot ne me vient pas.", alt_es: "Espera, que lo estoy pensando.", alt_fr: "Attends, je réfléchis." },
  { id: 85, lvl: 'A2', ctx: 'Contourner le mot qui manque', es: "Es una cosa que sirve para abrir las botellas.", fr: "C'est une chose qui sert à ouvrir les bouteilles.", alt_es: "Es como un… ¿cómo se llama?", alt_fr: "C'est comme un… comment ça s'appelle ?" },
  { id: 5, lvl: 'A1', ctx: 'Parler de son espagnol', es: "Hablo un poco de español, pero no mucho.", fr: "Je parle un peu espagnol, mais pas beaucoup.", alt_es: "Entiendo más de lo que hablo.", alt_fr: "Je comprends mieux que je ne parle." },
  { id: 7, lvl: 'A2', ctx: 'Faire écrire', es: "¿Me lo puede escribir, por favor?", fr: "Vous pouvez me l'écrire, s'il vous plaît ?", alt_es: "No sé cómo se dice en español.", alt_fr: "Je ne sais pas comment on dit ça en espagnol." },

  // ── Parler de moi ──────────────────────────────────────
  { id: 10, lvl: 'A1', ctx: 'Se présenter — me llamo', es: "Me llamo Fanny. Encantada.", fr: "Je m'appelle Fanny. Enchantée.", alt_es: "Mucho gusto. ¿Cómo se llama usted?", alt_fr: "Enchantée. Comment vous appelez-vous ?" },
  { id: 6, lvl: 'A1', ctx: 'Se présenter — soy francesa', es: "Soy francesa, pero vivo en Israel.", fr: "Je suis française, mais j'habite en Israël.", alt_es: "Estudio español porque me gusta mucho la lengua.", alt_fr: "J'apprends l'espagnol parce que j'aime beaucoup la langue." },
  { id: 17, lvl: 'A1', ctx: 'Ma famille', es: "Tengo una hija y tres nietos.", fr: "J'ai une fille et trois petits-enfants.", alt_es: "Voy a menudo a visitar a mis nietos.", alt_fr: "Je vais souvent rendre visite à mes petits-enfants." },
  { id: 81, lvl: 'A2', ctx: 'La retraite', es: "Estoy jubilada.", fr: "Je suis retraitée.", alt_es: "Empecé a estudiar español cuando me jubilé.", alt_fr: "J'ai commencé à apprendre l'espagnol quand j'ai pris ma retraite." },
  { id: 93, lvl: 'B1', ctx: 'Mon ancien travail', es: "Trabajé en un banco durante muchos años.", fr: "J'ai travaillé dans une banque pendant de nombreuses années.", alt_es: "Me gustaba mi trabajo, pero ahora disfruto de mi tiempo libre.", alt_fr: "J'aimais mon travail, mais maintenant je profite de mon temps libre." },
  { id: 72, lvl: 'A1', ctx: 'Mes goûts — me gusta', es: "Me gusta mucho leer.", fr: "J'aime beaucoup lire.", alt_es: "También me gusta ver películas con mis amigas.", alt_fr: "J'aime aussi regarder des films avec mes amies." },

  // ── Poser des questions, relancer ──────────────────────
  { id: 82, lvl: 'A1', ctx: 'Poser des questions — usted', es: "¿Y usted, de dónde es?", fr: "Et vous, d'où êtes-vous ?", alt_es: "¿Vive usted aquí?", alt_fr: "Vous habitez ici ?" },
  { id: 15, lvl: 'A1', ctx: 'La famille — usted', es: "¿Tiene usted hijos?", fr: "Vous avez des enfants ?", alt_es: "¿Cuántos nietos tiene?", alt_fr: "Combien de petits-enfants avez-vous ?" },
  { id: 83, lvl: 'A2', ctx: 'Relancer — tú', es: "¿Y tú, qué haces en tu tiempo libre?", fr: "Et toi, qu'est-ce que tu fais pendant ton temps libre ?", alt_es: "¿Y a ti, qué te gusta hacer?", alt_fr: "Et toi, qu'est-ce que tu aimes faire ?" },

  // ── Saluer, remercier ──────────────────────────────────
  { id: 8, lvl: 'A1', ctx: 'Saluer — usted', es: "Buenos días, ¿cómo está usted?", fr: "Bonjour, comment allez-vous ?", alt_es: "Buenas tardes, ¿qué tal?", alt_fr: "Bonjour (l'après-midi), ça va ?" },
  { id: 9, lvl: 'A1', ctx: 'Répondre', es: "Muy bien, gracias. ¿Y usted?", fr: "Très bien, merci. Et vous ?", alt_es: "Bien, gracias, ¿y tú?", alt_fr: "Bien, merci, et toi ?" },
  { id: 11, lvl: 'A1', ctx: 'Retrouver quelqu\'un — tú', es: "¿Qué tal estás? ¡Cuánto tiempo!", fr: "Comment tu vas ? Ça fait longtemps !", alt_es: "¡Qué alegría verte!", alt_fr: "Quel plaisir de te voir !" },
  { id: 12, lvl: 'A2', ctx: 'Prendre congé', es: "Hasta luego, que tengas un buen día.", fr: "À tout à l'heure, bonne journée.", alt_es: "Hasta mañana, que descanses.", alt_fr: "À demain, repose-toi bien." },
  { id: 13, lvl: 'A1', ctx: 'Remercier', es: "Gracias, es usted muy amable.", fr: "Merci, vous êtes très aimable.", alt_es: "Muchas gracias por todo.", alt_fr: "Merci beaucoup pour tout." },
  { id: 14, lvl: 'A1', ctx: 'Poliment', es: "Perdone, ¿puedo pasar?", fr: "Pardon, je peux passer ?", alt_es: "Perdone, ¿está libre este asiento?", alt_fr: "Pardon, cette place est libre ?" },

  // ── Raconter : hier, ce matin, en voyage ───────────────
  // Her first priority in the exam. Past tenses are also her stated weak spot.
  { id: 60, lvl: 'A2', ctx: 'Raconter — ayer fui', es: "Ayer fui al mercado con mi hija.", fr: "Hier, je suis allée au marché avec ma fille.", alt_es: "El domingo comimos en casa de unos amigos.", alt_fr: "Dimanche, on a déjeuné chez des amis." },
  { id: 88, lvl: 'A2', ctx: 'Raconter — ayer vi', es: "Ayer vi una película con mis amigas.", fr: "Hier, j'ai vu un film avec mes amies.", alt_es: "Después tomamos un café juntas.", alt_fr: "Ensuite, nous avons pris un café ensemble." },
  { id: 89, lvl: 'A2', ctx: 'Raconter — visité', es: "El fin de semana pasado visité a mis nietos.", fr: "Le week-end dernier, j'ai rendu visite à mes petits-enfants.", alt_es: "Jugamos y comimos todos juntos.", alt_fr: "On a joué et on a mangé tous ensemble." },
  { id: 61, lvl: 'A2', ctx: 'Aujourd\'hui — he dado, he llamado', es: "Esta mañana he dado un paseo.", fr: "Ce matin, j'ai fait une promenade.", alt_es: "Hoy he llamado a mi hija.", alt_fr: "Aujourd'hui, j'ai appelé ma fille." },
  { id: 90, lvl: 'A2', ctx: 'Cette semaine — he leído', es: "Esta mañana he leído el periódico.", fr: "Ce matin, j'ai lu le journal.", alt_es: "Esta semana he estudiado mucho español.", alt_fr: "Cette semaine, j'ai beaucoup étudié l'espagnol." },
  { id: 87, lvl: 'A2', ctx: 'Raconter — les vacances', es: "Estuve de vacaciones en Pafos.", fr: "J'ai passé des vacances à Paphos.", alt_es: "Todos los días iba a la piscina del hotel.", alt_fr: "Tous les jours, j'allais à la piscine de l'hôtel." },
  { id: 63, lvl: 'A2', ctx: 'Raconter — un voyage', es: "Este año fui a Nueva Zelanda.", fr: "Cette année, je suis allée en Nouvelle-Zélande.", alt_es: "Fue un viaje precioso.", alt_fr: "C'était un voyage magnifique." },
  { id: 86, lvl: 'A2', ctx: 'Raconter — une rencontre', es: "Allí conocí a una persona muy simpática de Colombia.", fr: "Là-bas, j'ai rencontré une personne très sympathique de Colombie.", alt_es: "Hablamos en español todo el tiempo.", alt_fr: "Nous avons parlé espagnol tout le temps." },
  { id: 91, lvl: 'B1', ctx: 'Raconter — le décor et l\'action', es: "Estaba en la piscina cuando me llamó mi hija.", fr: "J'étais à la piscine quand ma fille m'a appelée.", alt_es: "Hacía muy buen tiempo y había mucha gente.", alt_fr: "Il faisait très beau et il y avait beaucoup de monde." },

  // ── Souvenirs : autrefois ──────────────────────────────
  { id: 62, lvl: 'B1', ctx: 'Autrefois — vivía, iba', es: "Cuando era joven, vivía en el campo.", fr: "Quand j'étais jeune, j'habitais à la campagne.", alt_es: "Iba a la escuela a pie.", alt_fr: "J'allais à l'école à pied." },
  { id: 92, lvl: 'B1', ctx: 'Autrefois — me gustaba', es: "Cuando era pequeña, me gustaba mucho leer.", fr: "Quand j'étais petite, j'aimais beaucoup lire.", alt_es: "Mi madre cocinaba muy bien.", alt_fr: "Ma mère cuisinait très bien." },
  { id: 65, lvl: 'B1', ctx: 'Avant et maintenant', es: "Antes trabajaba mucho; ahora tengo más tiempo.", fr: "Avant, je travaillais beaucoup ; maintenant, j'ai plus de temps.", alt_es: "Antes no hablaba nada de español.", alt_fr: "Avant, je ne parlais pas du tout espagnol." },
  { id: 64, lvl: 'B1', ctx: 'Se souvenir', es: "Me acuerdo muy bien de aquel día.", fr: "Je me souviens très bien de ce jour-là.", alt_es: "No me acuerdo de su nombre.", alt_fr: "Je ne me souviens pas de son nom." },

  // ── La famille ─────────────────────────────────────────
  { id: 16, lvl: 'A2', ctx: 'Les petits-enfants', es: "Mis nietos crecen muy deprisa.", fr: "Mes petits-enfants grandissent très vite.", alt_es: "Este fin de semana voy a ver a mis nietos.", alt_fr: "Ce week-end, je vais voir mes petits-enfants." },
  { id: 107, lvl: 'A2', ctx: 'Piège — mi, mis', es: "Mi hija y mis nietos están bien.", fr: "Ma fille et mes petits-enfants vont bien.", alt_es: "Mis amigas vienen a casa esta tarde.", alt_fr: "Mes amies viennent à la maison cet après-midi." },
  { id: 18, lvl: 'A1', ctx: 'Prendre des nouvelles — tú', es: "¿Cómo está tu familia?", fr: "Comment va ta famille ?", alt_es: "¿Y los niños, qué tal?", alt_fr: "Et les enfants, ça va ?" },
  { id: 19, lvl: 'A2', ctx: 'Transmettre ses amitiés', es: "Dale recuerdos a tu madre de mi parte.", fr: "Passe le bonjour à ta mère de ma part.", alt_es: "Saludos a todos de mi parte.", alt_fr: "Salue tout le monde de ma part." },

  // ── Bavarder : le temps, les nouvelles ─────────────────
  { id: 20, lvl: 'A2', ctx: 'Piège — hace calor', es: "Hoy hace mucho calor, ¿verdad?", fr: "Il fait très chaud aujourd'hui, n'est-ce pas ?", alt_es: "¡Qué frío hace esta mañana!", alt_fr: "Qu'il fait froid ce matin !" },
  { id: 21, lvl: 'A2', ctx: 'Le temps qu\'il fait', es: "Parece que va a llover.", fr: "On dirait qu'il va pleuvoir.", alt_es: "Mañana va a hacer buen tiempo.", alt_fr: "Demain, il va faire beau." },
  { id: 22, lvl: 'A2', ctx: 'Le matin', es: "¿Qué tal has dormido?", fr: "Tu as bien dormi ?", alt_es: "He dormido muy bien, gracias.", alt_fr: "J'ai très bien dormi, merci." },
  { id: 23, lvl: 'A2', ctx: 'Demander des nouvelles', es: "¿Qué me cuentas? ¿Alguna novedad?", fr: "Quoi de neuf ? Des nouvelles ?", alt_es: "Cuéntame, ¿qué tal el viaje?", alt_fr: "Raconte-moi, ce voyage, ça s'est bien passé ?" },
  { id: 24, lvl: 'A2', ctx: 'Une bonne nouvelle', es: "Me alegro mucho por ti.", fr: "Je suis très contente pour toi.", alt_es: "¡Qué buena noticia!", alt_fr: "Quelle bonne nouvelle !" },
  { id: 25, lvl: 'A2', ctx: 'Une mauvaise nouvelle', es: "¡Qué pena! Lo siento mucho.", fr: "Quel dommage ! Je suis vraiment désolée.", alt_es: "Lo siento, no lo sabía.", alt_fr: "Je suis désolée, je ne le savais pas." },
  { id: 26, lvl: 'A2', ctx: 'Rassurer', es: "No pasa nada, no te preocupes.", fr: "Ce n'est rien, ne t'inquiète pas.", alt_es: "No se preocupe, no es nada.", alt_fr: "Ne vous inquiétez pas, ce n'est rien." },
  { id: 27, lvl: 'A1', ctx: 'Être d\'accord', es: "Tienes razón.", fr: "Tu as raison.", alt_es: "Estoy de acuerdo contigo.", alt_fr: "Je suis d'accord avec toi." },
  { id: 28, lvl: 'A2', ctx: 'Donner son avis', es: "Creo que sí.", fr: "Je crois que oui.", alt_es: "Creo que no, pero no estoy segura.", alt_fr: "Je crois que non, mais je n'en suis pas sûre." },
  { id: 97, lvl: 'B1', ctx: 'Donner son avis — la ville, la campagne', es: "Me gusta vivir en la ciudad, pero a veces echo de menos la calma del campo.", fr: "J'aime vivre en ville, mais parfois le calme de la campagne me manque.", alt_es: "En mi opinión, la ciudad es más práctica.", alt_fr: "À mon avis, la ville est plus pratique." },

  // ── Ce qu'on vous dit (à reconnaître à l'oreille) ──────
  { id: 100, lvl: 'A1', ctx: 'Ce qu\'on vous dit — au magasin', es: "Buenos días, ¿qué desea?", fr: "Bonjour, que désirez-vous ?", alt_es: "¿Le pongo algo más?", alt_fr: "Je vous mets autre chose ?" },
  { id: 101, lvl: 'A2', ctx: 'Ce qu\'on vous dit — au restaurant', es: "¿Qué van a tomar?", fr: "Qu'est-ce que vous allez prendre ?", alt_es: "¿Y para beber, qué les pongo?", alt_fr: "Et comme boisson, je vous sers quoi ?" },
  { id: 102, lvl: 'A2', ctx: 'Ce qu\'on vous dit — à la caisse', es: "¿Va a pagar con tarjeta o en efectivo?", fr: "Vous allez payer par carte ou en espèces ?", alt_es: "Son doce euros con cincuenta.", alt_fr: "Ça fait douze euros cinquante." },
  { id: 103, lvl: 'A2', ctx: 'Ce qu\'on vous dit — dans la rue', es: "Tiene que coger el autobús número cinco.", fr: "Vous devez prendre le bus numéro cinq.", alt_es: "Está a unos diez minutos andando.", alt_fr: "C'est à environ dix minutes à pied." },
  { id: 104, lvl: 'B1', ctx: 'Ce qu\'on vous dit — le médecin', es: "Tome una pastilla dos veces al día, después de comer.", fr: "Prenez un comprimé deux fois par jour, après le repas.", alt_es: "Si no mejora, vuelva la semana que viene.", alt_fr: "Si ça ne va pas mieux, revenez la semaine prochaine." },

  // ── Au café, au restaurant ─────────────────────────────
  { id: 29, lvl: 'A1', ctx: 'Au café — taza, leche', es: "Un café con leche, por favor.", fr: "Un café au lait, s'il vous plaît.", alt_es: "Para mí, una taza de té.", alt_fr: "Pour moi, une tasse de thé." },
  { id: 30, lvl: 'A1', ctx: 'Payer', es: "¿Cuánto es?", fr: "C'est combien ?", alt_es: "La cuenta, por favor.", alt_fr: "L'addition, s'il vous plaît." },
  { id: 31, lvl: 'A2', ctx: 'Au restaurant', es: "¿Qué me recomienda?", fr: "Qu'est-ce que vous me recommandez ?", alt_es: "¿Qué lleva este plato?", alt_fr: "Qu'est-ce qu'il y a dans ce plat ?" },
  { id: 32, lvl: 'A1', ctx: 'Au restaurant', es: "Una mesa para dos, por favor.", fr: "Une table pour deux, s'il vous plaît.", alt_es: "¿Tienen una mesa en la terraza?", alt_fr: "Vous avez une table en terrasse ?" },
  { id: 33, lvl: 'A2', ctx: 'Au restaurant', es: "Sin sal, por favor. No puedo comer sal.", fr: "Sans sel, s'il vous plaît. Je ne peux pas manger de sel.", alt_es: "¿Esto lleva gluten?", alt_fr: "Est-ce qu'il y a du gluten dedans ?" },
  { id: 34, lvl: 'A2', ctx: 'Complimenter', es: "Estaba todo buenísimo, gracias.", fr: "Tout était délicieux, merci.", alt_es: "¡Qué rico está!", alt_fr: "Comme c'est bon !" },
  { id: 35, lvl: 'A1', ctx: 'Les toilettes', es: "¿Dónde están los servicios, por favor?", fr: "Où sont les toilettes, s'il vous plaît ?", alt_es: "¿Hay un baño por aquí?", alt_fr: "Il y a des toilettes par ici ?" },

  // ── Les courses, le marché ─────────────────────────────
  { id: 36, lvl: 'A2', ctx: 'Au marché', es: "¿A cuánto está el kilo de tomates?", fr: "Combien coûte le kilo de tomates ?", alt_es: "¿A cuánto están las naranjas?", alt_fr: "Les oranges, c'est combien ?" },
  { id: 37, lvl: 'A2', ctx: 'Au marché', es: "Póngame medio kilo de fresas, por favor.", fr: "Mettez-moi un demi-kilo de fraises, s'il vous plaît.", alt_es: "Póngame también una docena de huevos.", alt_fr: "Mettez-moi aussi une douzaine d'œufs." },
  { id: 38, lvl: 'A1', ctx: '« ¿Algo más? »', es: "No, nada más, gracias.", fr: "Non, ce sera tout, merci.", alt_es: "Sí, también quiero una barra de pan.", alt_fr: "Oui, je voudrais aussi une baguette." },
  { id: 39, lvl: 'A1', ctx: 'Payer', es: "¿Puedo pagar con tarjeta?", fr: "Je peux payer par carte ?", alt_es: "Solo tengo un billete de cincuenta.", alt_fr: "Je n'ai qu'un billet de cinquante." },
  { id: 40, lvl: 'A1', ctx: 'À la caisse', es: "¿Me da una bolsa, por favor?", fr: "Vous me donnez un sac, s'il vous plaît ?", alt_es: "No necesito bolsa, gracias.", alt_fr: "Je n'ai pas besoin de sac, merci." },
  { id: 41, lvl: 'A2', ctx: 'Dans un magasin', es: "Estoy buscando un regalo para mis nietos.", fr: "Je cherche un cadeau pour mes petits-enfants.", alt_es: "¿Lo tiene en otro color?", alt_fr: "Vous l'avez dans une autre couleur ?" },

  // ── La santé, le médecin, la pharmacie ─────────────────
  { id: 42, lvl: 'A2', ctx: 'Avoir mal — me duele(n)', es: "Me duele la cabeza.", fr: "J'ai mal à la tête.", alt_es: "Me duelen las rodillas.", alt_fr: "J'ai mal aux genoux." },
  { id: 48, lvl: 'A2', ctx: 'Depuis — desde hace', es: "Me duele la espalda desde hace tres días.", fr: "J'ai mal au dos depuis trois jours.", alt_es: "Tengo fiebre desde ayer.", alt_fr: "J'ai de la fièvre depuis hier." },
  { id: 43, lvl: 'A2', ctx: 'Ne pas se sentir bien', es: "No me encuentro bien.", fr: "Je ne me sens pas bien.", alt_es: "Estoy un poco cansada hoy.", alt_fr: "Je suis un peu fatiguée aujourd'hui." },
  { id: 44, lvl: 'A2', ctx: 'À la pharmacie', es: "Necesito algo para la tos.", fr: "J'ai besoin de quelque chose contre la toux.", alt_es: "¿Tiene algo para el dolor de garganta?", alt_fr: "Vous avez quelque chose pour le mal de gorge ?" },
  { id: 45, lvl: 'A2', ctx: 'Chez le médecin', es: "Tomo pastillas para la tensión.", fr: "Je prends des comprimés pour la tension.", alt_es: "Soy alérgica a la penicilina.", alt_fr: "Je suis allergique à la pénicilline." },
  { id: 46, lvl: 'A2', ctx: 'À la pharmacie', es: "¿Cuántas veces al día tengo que tomarlo?", fr: "Combien de fois par jour je dois le prendre ?", alt_es: "¿Antes o después de comer?", alt_fr: "Avant ou après le repas ?" },
  { id: 47, lvl: 'A2', ctx: 'Prendre rendez-vous', es: "Quisiera pedir cita con el médico.", fr: "Je voudrais prendre rendez-vous chez le médecin.", alt_es: "¿Hay cita para el jueves por la mañana?", alt_fr: "Il y a un rendez-vous jeudi matin ?" },
  { id: 49, lvl: 'A2', ctx: 'Piège — constipada = enrhumée', es: "Estoy constipada.", fr: "Je suis enrhumée.", alt_es: "Mi amiga está resfriada.", alt_fr: "Mon amie est enrhumée." },

  // ── Le chemin, les transports ──────────────────────────
  { id: 50, lvl: 'A1', ctx: 'Demander son chemin', es: "Perdone, ¿dónde está la farmacia?", fr: "Pardon, où est la pharmacie ?", alt_es: "¿Está lejos de aquí?", alt_fr: "C'est loin d'ici ?" },
  { id: 51, lvl: 'A2', ctx: 'Comprendre le chemin', es: "Siga todo recto y gire a la derecha.", fr: "Continuez tout droit et tournez à droite.", alt_es: "Está a la izquierda, al lado del banco.", alt_fr: "C'est à gauche, à côté de la banque." },
  { id: 52, lvl: 'A1', ctx: 'Le bus', es: "¿Qué autobús va al centro?", fr: "Quel bus va au centre-ville ?", alt_es: "¿Dónde está la parada del autobús?", alt_fr: "Où est l'arrêt du bus ?" },
  { id: 53, lvl: 'A1', ctx: 'Le train', es: "¿A qué hora sale el tren?", fr: "À quelle heure part le train ?", alt_es: "¿Este tren para en Sevilla?", alt_fr: "Ce train s'arrête à Séville ?" },
  { id: 54, lvl: 'A2', ctx: 'En taxi', es: "Lléveme a esta dirección, por favor.", fr: "Emmenez-moi à cette adresse, s'il vous plaît.", alt_es: "¿Cuánto cuesta ir al aeropuerto?", alt_fr: "Combien ça coûte pour aller à l'aéroport ?" },
  { id: 55, lvl: 'A2', ctx: 'Perdue', es: "Me he perdido. ¿Me puede ayudar?", fr: "Je me suis perdue. Vous pouvez m'aider ?", alt_es: "Estoy buscando esta calle.", alt_fr: "Je cherche cette rue." },

  // ── À l'hôtel ──────────────────────────────────────────
  { id: 98, lvl: 'A2', ctx: 'À l\'hôtel', es: "Tengo una reserva a mi nombre.", fr: "J'ai une réservation à mon nom.", alt_es: "¿A qué hora es el desayuno?", alt_fr: "À quelle heure est le petit-déjeuner ?" },
  { id: 99, lvl: 'A2', ctx: 'À l\'hôtel — un problème', es: "El aire acondicionado no funciona.", fr: "La climatisation ne marche pas.", alt_es: "¿Me puede dar otra toalla, por favor?", alt_fr: "Vous pouvez me donner une autre serviette, s'il vous plaît ?" },
  { id: 105, lvl: 'A2', ctx: 'Piège — de vacaciones, a la piscina', es: "Estoy de vacaciones.", fr: "Je suis en vacances.", alt_es: "Voy a la piscina.", alt_fr: "Je vais à la piscine." },

  // ── Au téléphone ───────────────────────────────────────
  { id: 56, lvl: 'A2', ctx: 'Au téléphone', es: "¿Diga? ¿Quién es?", fr: "Allô ? C'est qui ?", alt_es: "Hola, soy Fanny. ¿Está tu madre?", alt_fr: "Bonjour, c'est Fanny. Ta mère est là ?" },
  { id: 57, lvl: 'A2', ctx: 'Au téléphone', es: "Te oigo muy mal. ¿Me oyes?", fr: "Je t'entends très mal. Tu m'entends ?", alt_es: "Se ha cortado. Te llamo otra vez.", alt_fr: "Ça a coupé. Je te rappelle." },
  { id: 58, lvl: 'A2', ctx: 'Au téléphone', es: "Te llamo más tarde.", fr: "Je te rappelle plus tard.", alt_es: "Llámame cuando puedas.", alt_fr: "Appelle-moi quand tu peux." },
  { id: 59, lvl: 'B1', ctx: 'Laisser un message', es: "¿Le puedo dejar un mensaje?", fr: "Je peux lui laisser un message ?", alt_es: "Dígale que me llame, por favor.", alt_fr: "Dites-lui de me rappeler, s'il vous plaît." },

  // ── Inviter, faire des projets ─────────────────────────
  { id: 66, lvl: 'A2', ctx: 'Inviter', es: "¿Quieres venir a cenar el domingo?", fr: "Tu veux venir dîner dimanche ?", alt_es: "¿Te apetece un café?", alt_fr: "Ça te dit, un café ?" },
  { id: 67, lvl: 'A2', ctx: 'Accepter, refuser', es: "¡Qué bien! Me encantaría.", fr: "Super ! Avec grand plaisir.", alt_es: "Lo siento, ese día no puedo.", alt_fr: "Désolée, ce jour-là je ne peux pas." },
  { id: 68, lvl: 'A2', ctx: 'Se donner rendez-vous', es: "¿A qué hora quedamos?", fr: "On se retrouve à quelle heure ?", alt_es: "Quedamos a las cinco en la plaza.", alt_fr: "On se retrouve à cinq heures sur la place." },
  { id: 94, lvl: 'A2', ctx: 'Projets — me gustaría', es: "Me gustaría viajar a España.", fr: "J'aimerais voyager en Espagne.", alt_es: "Quiero practicar mi español allí.", alt_fr: "Je veux pratiquer mon espagnol là-bas." },
  { id: 69, lvl: 'A2', ctx: 'Projets — voy a', es: "Voy a ir a verte el mes que viene.", fr: "Je vais venir te voir le mois prochain.", alt_es: "Este verano vamos a ir a la playa.", alt_fr: "Cet été, nous allons aller à la plage." },
  { id: 70, lvl: 'B1', ctx: 'Souhaiter — espero que', es: "Espero que estés bien.", fr: "J'espère que tu vas bien.", alt_es: "Espero que te guste.", alt_fr: "J'espère que ça te plaira." },
  { id: 108, lvl: 'B1', ctx: 'Vouloir que — subjonctif', es: "Quiero que vengas a cenar a casa el domingo.", fr: "Je veux que tu viennes dîner à la maison dimanche.", alt_es: "Quiero que me cuentes tu viaje.", alt_fr: "Je veux que tu me racontes ton voyage." },
  { id: 71, lvl: 'B1', ctx: 'Quand… — cuando llegues', es: "Cuando llegues, llámame.", fr: "Quand tu arriveras, appelle-moi.", alt_es: "Cuando tenga tiempo, te escribo.", alt_fr: "Quand j'aurai le temps, je t'écrirai." },
  { id: 95, lvl: 'B1', ctx: 'Quand… — cuando vaya', es: "Cuando vaya a España, hablaré español con todo el mundo.", fr: "Quand j'irai en Espagne, je parlerai espagnol avec tout le monde.", alt_es: "Cuando vuelva, te lo cuento todo.", alt_fr: "Quand je reviendrai, je te raconterai tout." },
  { id: 96, lvl: 'B1', ctx: 'Si… — si tuviera', es: "Si tuviera más tiempo, aprendería a bailar tango.", fr: "Si j'avais plus de temps, j'apprendrais à danser le tango.", alt_es: "Si pudiera, viajaría más.", alt_fr: "Si je pouvais, je voyagerais plus." },

  // ── Les goûts ──────────────────────────────────────────
  { id: 106, lvl: 'A2', ctx: 'Piège — me gusta, me gustan', es: "Me gustan mucho las películas antiguas.", fr: "J'aime beaucoup les vieux films.", alt_es: "A mis nietos les gusta el chocolate.", alt_fr: "Mes petits-enfants aiment le chocolat." },
  { id: 73, lvl: 'A2', ctx: 'Ne pas aimer, préférer', es: "No me gusta nada el ruido.", fr: "Je n'aime pas du tout le bruit.", alt_es: "Prefiero el té al café.", alt_fr: "Je préfère le thé au café." },
  { id: 74, lvl: 'A2', ctx: 'Le temps libre', es: "¿Qué te gusta hacer los fines de semana?", fr: "Qu'est-ce que tu aimes faire le week-end ?", alt_es: "Los fines de semana me gusta pasear.", alt_fr: "Le week-end, j'aime me promener." },

  // ── Urgences ───────────────────────────────────────────
  { id: 75, lvl: 'A2', ctx: 'Urgence', es: "¡Ayuda! Llame a una ambulancia.", fr: "À l'aide ! Appelez une ambulance.", alt_es: "Me he caído y no puedo levantarme.", alt_fr: "Je suis tombée et je n'arrive pas à me relever." },
  { id: 76, lvl: 'A2', ctx: 'Perte, vol', es: "He perdido el bolso.", fr: "J'ai perdu mon sac à main.", alt_es: "Me han robado la cartera.", alt_fr: "On m'a volé mon portefeuille." },

  // ── Les petits mots de la conversation ─────────────────
  // What fast native speech is full of — worth recognising by ear.
  { id: 77, lvl: 'A2', ctx: 'Petits mots — conclure', es: "Bueno, pues nada, hasta luego.", fr: "Bon, eh bien, à tout à l'heure.", alt_es: "Vale, de acuerdo.", alt_fr: "D'accord, entendu." },
  { id: 78, lvl: 'A2', ctx: 'Petits mots — la surprise', es: "¿En serio? ¡No me digas!", fr: "Sérieusement ? Pas possible !", alt_es: "¡Anda! ¡Qué sorpresa!", alt_fr: "Ça alors ! Quelle surprise !" },
  { id: 79, lvl: 'A2', ctx: 'Petits mots — attirer l\'attention', es: "Oye, ¿sabes qué?", fr: "Dis, tu sais quoi ?", alt_es: "Mira, te explico.", alt_fr: "Écoute, je t'explique." },
  { id: 80, lvl: 'B1', ctx: 'Petits mots — changer ses plans', es: "Al final no puedo ir, que me ha surgido algo.", fr: "Finalement je ne peux pas venir, j'ai eu un imprévu.", alt_es: "Oye, ¿lo dejamos para otro día?", alt_fr: "Dis, on remet ça à un autre jour ?" }
];
