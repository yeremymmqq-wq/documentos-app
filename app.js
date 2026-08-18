'use strict';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

/* ---------- Utilidades ---------- */
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function fechaLarga(isoDate) {
  if (!isoDate) return '____________';
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function nl2p(text) {
  return (text || '')
    .split(/\n+/)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `<p>${escapeHtml(t)}</p>`)
    .join('');
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ==========================================================
   DEFINICIÓN DE TIPOS DE DOCUMENTO
   ========================================================== */
const DOC_TYPES = {

  solicitud: {
    title: 'Solicitud',
    subtitle: 'Pedido formal a una autoridad o institución',
    help: 'Úsala cuando necesites pedirle algo por escrito a una autoridad o institución (una constancia, un permiso, una revisión de nota, etc.). Es el documento más común en trámites universitarios y municipales.',
    fields: [
      { id: 'destinatario', label: 'Dirigido a (cargo e institución)', type: 'text', placeholder: 'Ej: Decano de la Facultad de Ingeniería - UNSAAC' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'nombre', label: 'Nombre completo del solicitante', type: 'text' },
      { id: 'dni', label: 'DNI', type: 'text' },
      { id: 'domicilio', label: 'Domicilio', type: 'text' },
      { id: 'asunto', label: 'Asunto (resumen corto)', type: 'text', placeholder: 'Ej: Solicita constancia de matrícula', hint: 'Resume en pocas palabras qué estás pidiendo. Aparecerá como título del documento.' },
      { id: 'motivo', label: 'Motivo / petición (explica con detalle)', type: 'textarea', rows: 5, hint: 'Explica qué necesitas y por qué. Empieza directo, por ejemplo: "necesito se me expida..." o "solicito la revisión de...".' }
    ],
    example: {
      destinatario: 'Decano de la Facultad de Ingeniería - UNSAAC',
      ciudad: 'Cusco',
      nombre: 'Juan Pérez Quispe',
      dni: '70123456',
      domicilio: 'Av. de la Cultura 733, Cusco',
      asunto: 'Solicita constancia de matrícula',
      motivo: 'necesito se me expida una constancia de matrícula del semestre académico actual, la cual utilizaré para trámites personales.'
    },
    render: v => `
      <h3>Solicito: ${escapeHtml(v.asunto || '')}</h3>
      <div class="doc-meta">
        <div>Señor(a):</div>
        <div><strong>${escapeHtml(v.destinatario)}</strong></div>
      </div>
      <p>${escapeHtml(v.nombre)}, identificado(a) con DNI N° ${escapeHtml(v.dni)}, con domicilio en ${escapeHtml(v.domicilio)}, ante usted respetuosamente me presento y expongo:</p>
      <p>Que, ${escapeHtml(v.motivo)}</p>
      <p>Por lo expuesto, solicito a usted acceder a mi petición por ser de justicia.</p>
      <p class="doc-right">${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.nombre)}</div>
        <div>DNI: ${escapeHtml(v.dni)}</div>
      </div>
    `
  },

  carta: {
    title: 'Carta',
    subtitle: 'Comunicación formal entre personas o instituciones',
    help: 'Úsala para comunicarte formalmente con una persona o empresa fuera de un trámite oficial: agradecimientos, invitaciones, reclamos, presentaciones. Es más flexible que el oficio.',
    fields: [
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatarioNombre', label: 'Nombre del destinatario', type: 'text' },
      { id: 'destinatarioCargo', label: 'Cargo / institución del destinatario', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'cuerpo', label: 'Contenido de la carta', type: 'textarea', rows: 6, hint: 'Escribe con tus palabras lo que quieres comunicar. Puedes usar varios párrafos separados por líneas nuevas.' },
      { id: 'despedida', label: 'Despedida', type: 'select', options: ['Atentamente', 'Cordialmente', 'Sin otro particular, quedo de usted'], value: 'Atentamente' },
      { id: 'remitenteNombre', label: 'Tu nombre completo', type: 'text' },
      { id: 'remitenteDatos', label: 'Tus datos adicionales (DNI, cargo, etc.)', type: 'text' }
    ],
    example: {
      ciudad: 'Cusco',
      destinatarioNombre: 'Sra. María López',
      destinatarioCargo: 'Gerente de Recursos Humanos - Empresa ABC',
      asunto: 'Agradecimiento por pasantía',
      cuerpo: 'Por medio de la presente deseo expresarle mi agradecimiento por la oportunidad de realizar mis prácticas pre-profesionales en su institución.\nDurante este periodo pude fortalecer mis conocimientos y adquirir experiencia valiosa para mi desarrollo profesional.',
      despedida: 'Atentamente',
      remitenteNombre: 'Juan Pérez Quispe',
      remitenteDatos: 'DNI 70123456 - Estudiante de Ingeniería, UNSAAC'
    },
    render: v => `
      <p class="doc-right">${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</p>
      <div class="doc-meta">
        <div>Señor(a):</div>
        <div><strong>${escapeHtml(v.destinatarioNombre)}</strong></div>
        <div>${escapeHtml(v.destinatarioCargo)}</div>
        <div>Presente.-</div>
      </div>
      <p><strong>Asunto:</strong> ${escapeHtml(v.asunto)}</p>
      <p>De mi consideración:</p>
      ${nl2p(v.cuerpo)}
      <p>${escapeHtml(v.despedida)},</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.remitenteNombre)}</div>
        <div>${escapeHtml(v.remitenteDatos)}</div>
      </div>
    `
  },

  oficio: {
    title: 'Oficio',
    subtitle: 'Comunicación oficial entre instituciones o autoridades',
    help: 'Se usa entre instituciones, autoridades o cargos oficiales (no entre personas particulares). Siempre lleva un número correlativo, a diferencia de la carta.',
    fields: [
      { id: 'numero', label: 'N° de oficio', type: 'text', placeholder: 'Ej: 045-2026', hint: 'Es un número correlativo que cada institución asigna a sus oficios. Si no lo sabes, pregunta en mesa de partes o pon un número provisional.' },
      { id: 'siglas', label: 'Siglas de la institución (opcional)', type: 'text', placeholder: 'Ej: FIA-UNSAAC' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatarioNombre', label: 'Nombre del destinatario', type: 'text' },
      { id: 'destinatarioCargo', label: 'Cargo del destinatario', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'referencia', label: 'Referencia (opcional)', type: 'text', hint: 'Menciona aquí el documento anterior al que respondes, si aplica (ej: "Oficio N° 020-2026").' },
      { id: 'cuerpo', label: 'Cuerpo del oficio', type: 'textarea', rows: 6, hint: 'Explica el motivo de la comunicación de forma directa y formal.' },
      { id: 'remitenteNombre', label: 'Nombre del remitente', type: 'text' },
      { id: 'remitenteCargo', label: 'Cargo del remitente', type: 'text' },
      { id: 'institucion', label: 'Institución del remitente', type: 'text' },
      { id: 'copias', label: 'Con copia a (opcional, uno por línea)', type: 'textarea', rows: 2 }
    ],
    example: {
      numero: '045-2026',
      siglas: 'CEI-UNSAAC',
      ciudad: 'Cusco',
      destinatarioNombre: 'Ing. Carlos Ramírez',
      destinatarioCargo: 'Director de la Escuela Profesional de Ingeniería Informática',
      asunto: 'Solicitud de ambiente para evento académico',
      referencia: '',
      cuerpo: 'Por medio del presente me dirijo a usted con la finalidad de solicitar la asignación del auditorio principal para la realización de la "Semana de la Informática", a llevarse a cabo el próximo mes.',
      remitenteNombre: 'Juan Pérez Quispe',
      remitenteCargo: 'Presidente del Centro de Estudiantes',
      institucion: 'Centro de Estudiantes de Ingeniería Informática - UNSAAC',
      copias: ''
    },
    render: v => `
      <h3>Oficio N° ${escapeHtml(v.numero)}${v.siglas ? '-' + escapeHtml(v.siglas) : ''}</h3>
      <p class="doc-right">${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</p>
      <div class="doc-meta">
        <div>Señor(a):</div>
        <div><strong>${escapeHtml(v.destinatarioNombre)}</strong></div>
        <div>${escapeHtml(v.destinatarioCargo)}</div>
        <div>Presente.-</div>
      </div>
      <p><strong>Asunto:</strong> ${escapeHtml(v.asunto)}</p>
      ${v.referencia ? `<p><strong>Referencia:</strong> ${escapeHtml(v.referencia)}</p>` : ''}
      <p>De mi consideración:</p>
      ${nl2p(v.cuerpo)}
      <p>Sin otro particular, quedo de usted.</p>
      <p>Atentamente,</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.remitenteNombre)}</div>
        <div>${escapeHtml(v.remitenteCargo)}</div>
        <div>${escapeHtml(v.institucion)}</div>
      </div>
      ${v.copias ? `<p style="margin-top:24px;"><strong>c.c.</strong><br>${escapeHtml(v.copias).replace(/\n/g, '<br>')}</p>` : ''}
    `
  },

  informe: {
    title: 'Informe',
    subtitle: 'Reporte técnico o administrativo con conclusiones',
    help: 'Úsalo para reportar por escrito el resultado de una revisión, actividad o investigación a un superior, con antecedentes, desarrollo, conclusiones y recomendaciones.',
    fields: [
      { id: 'numero', label: 'N° de informe', type: 'text', placeholder: 'Ej: 012-2026' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatario', label: 'Dirigido a (nombre y cargo)', type: 'text' },
      { id: 'remitente', label: 'De (tu nombre y cargo)', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'referencia', label: 'Referencia (opcional)', type: 'text' },
      { id: 'antecedentes', label: 'Antecedentes', type: 'textarea', rows: 4, hint: 'El contexto: qué encargo, pedido o situación dio origen a este informe.' },
      { id: 'desarrollo', label: 'Análisis / desarrollo', type: 'textarea', rows: 5, hint: 'Lo que hiciste o encontraste: hechos, datos, evaluación de la situación.' },
      { id: 'conclusiones', label: 'Conclusiones', type: 'textarea', rows: 3, hint: 'Resume en pocas ideas el resultado principal del análisis.' },
      { id: 'recomendaciones', label: 'Recomendaciones', type: 'textarea', rows: 3, hint: 'Qué acción sugieres tomar a partir de las conclusiones.' }
    ],
    example: {
      numero: '012-2026',
      ciudad: 'Cusco',
      destinatario: 'Ing. Carlos Ramírez, Director de Escuela',
      remitente: 'Juan Pérez Quispe, Asistente Académico',
      asunto: 'Resultado de la revisión del laboratorio de cómputo',
      referencia: '',
      antecedentes: 'Mediante memorando se me encargó verificar el estado operativo de los equipos del laboratorio de cómputo N° 2.',
      desarrollo: 'Se revisaron 20 equipos, de los cuales 15 funcionan correctamente y 5 presentan fallas de encendido o lentitud excesiva.',
      conclusiones: 'El laboratorio opera al 75% de su capacidad total, lo cual limita el dictado de clases con grupos completos.',
      recomendaciones: 'Se recomienda gestionar el mantenimiento correctivo de los 5 equipos observados antes del inicio del próximo semestre.'
    },
    render: v => `
      <h3>Informe N° ${escapeHtml(v.numero)}</h3>
      <div class="doc-meta">
        <div><strong>A:</strong> ${escapeHtml(v.destinatario)}</div>
        <div><strong>De:</strong> ${escapeHtml(v.remitente)}</div>
        <div><strong>Asunto:</strong> ${escapeHtml(v.asunto)}</div>
        <div><strong>Fecha:</strong> ${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</div>
        ${v.referencia ? `<div><strong>Ref.:</strong> ${escapeHtml(v.referencia)}</div>` : ''}
      </div>
      <p>Tengo el agrado de dirigirme a usted con la finalidad de informar lo siguiente:</p>
      <div class="doc-section-title">I. ANTECEDENTES</div>
      ${nl2p(v.antecedentes)}
      <div class="doc-section-title">II. ANÁLISIS / DESARROLLO</div>
      ${nl2p(v.desarrollo)}
      <div class="doc-section-title">III. CONCLUSIONES</div>
      ${nl2p(v.conclusiones)}
      <div class="doc-section-title">IV. RECOMENDACIONES</div>
      ${nl2p(v.recomendaciones)}
      <p>Es cuanto informo a usted, para los fines pertinentes.</p>
      <p>Atentamente,</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.remitente)}</div>
      </div>
    `
  },

  acta: {
    title: 'Acta',
    subtitle: 'Registro formal de una reunión o hecho',
    help: 'Deja constancia por escrito de lo tratado y acordado en una reunión, entrega de cargo u otro hecho, con la lista de quienes participaron.',
    fields: [
      { id: 'tipo', label: 'Tipo de acta', type: 'text', placeholder: 'Ej: Acta de Reunión de Coordinación', value: 'Acta de Reunión' },
      { id: 'lugar', label: 'Lugar', type: 'text' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'horaInicio', label: 'Hora de inicio', type: 'time' },
      { id: 'horaFin', label: 'Hora de finalización', type: 'time' },
      { id: 'participantes', label: 'Participantes (uno por línea)', type: 'textarea', rows: 4, hint: 'Escribe un nombre por línea. Cada uno tendrá su propia línea de firma en el documento.' },
      { id: 'agenda', label: 'Temas tratados', type: 'textarea', rows: 4, hint: 'Lista los puntos discutidos, uno por línea si son varios.' },
      { id: 'acuerdos', label: 'Acuerdos', type: 'textarea', rows: 4, hint: 'Lo que se decidió o se acordó hacer, uno por línea si son varios.' },
      { id: 'observaciones', label: 'Observaciones (opcional)', type: 'textarea', rows: 2 }
    ],
    example: {
      tipo: 'Acta de Reunión de Coordinación',
      lugar: 'Sala de reuniones de la Facultad de Ingeniería',
      ciudad: 'Cusco',
      horaInicio: '10:00',
      horaFin: '11:15',
      participantes: 'Juan Pérez Quispe\nMaría Condori Huamán\nLuis Sánchez Flores',
      agenda: 'Revisión del cronograma de actividades del semestre.\nCoordinación del evento de bienvenida a nuevos estudiantes.',
      acuerdos: 'Se acuerda fijar el evento de bienvenida para la tercera semana del semestre.\nSe designa a María Condori como responsable de logística.',
      observaciones: ''
    },
    render: v => {
      const participantes = (v.participantes || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
      const firmasRows = participantes.map(p => `<tr><td>${escapeHtml(p)}</td></tr>`).join('');
      return `
      <h3>${escapeHtml(v.tipo)}</h3>
      <p>En ${escapeHtml(v.lugar)}, ${escapeHtml(v.ciudad)}, siendo las ${escapeHtml(v.horaInicio)} horas del día ${fechaLarga(v.fecha)}, se reunieron las siguientes personas:</p>
      <p>${participantes.map(escapeHtml).join(', ')}</p>
      <p>con la finalidad de tratar los siguientes puntos:</p>
      ${nl2p(v.agenda)}
      <p>Luego de la discusión correspondiente, se llegaron a los siguientes acuerdos:</p>
      ${nl2p(v.acuerdos)}
      ${v.observaciones ? `<p><strong>Observaciones:</strong> ${escapeHtml(v.observaciones)}</p>` : ''}
      <p>Siendo las ${escapeHtml(v.horaFin)} horas, y no habiendo más temas que tratar, se dio por concluida la reunión, firmando los presentes en señal de conformidad.</p>
      <table class="firmas">${firmasRows}</table>
    `;
    }
  },

  declaracion: {
    title: 'Declaración Jurada',
    subtitle: 'Manifestación formal bajo juramento',
    help: 'Se usa cuando una institución te pide afirmar algo bajo tu responsabilidad (domicilio, ingresos, situación laboral, veracidad de datos) sin necesidad de otro documento que lo pruebe.',
    fields: [
      { id: 'nombre', label: 'Nombre completo', type: 'text' },
      { id: 'dni', label: 'DNI', type: 'text' },
      { id: 'nacionalidad', label: 'Nacionalidad', type: 'text', value: 'peruana' },
      { id: 'domicilio', label: 'Domicilio', type: 'text' },
      { id: 'declaracion', label: 'Declaro bajo juramento que...', type: 'textarea', rows: 5, hint: 'Escribe exactamente el hecho que estás afirmando. Sé específico y directo, ej: "resido en la dirección arriba indicada desde el año 2022".' },
      { id: 'finalidad', label: 'Finalidad / institución ante la que se presenta', type: 'text', placeholder: 'Ej: la UNSAAC, para trámite de matrícula' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() }
    ],
    example: {
      nombre: 'Juan Pérez Quispe',
      dni: '70123456',
      nacionalidad: 'peruana',
      domicilio: 'Av. de la Cultura 733, Cusco',
      declaracion: 'resido en la dirección arriba indicada desde el mes de enero de 2023, y que la información proporcionada es verídica.',
      finalidad: 'la UNSAAC, para trámite de actualización de datos',
      ciudad: 'Cusco'
    },
    render: v => `
      <h3>Declaración Jurada</h3>
      <p>Yo, ${escapeHtml(v.nombre)}, identificado(a) con DNI N° ${escapeHtml(v.dni)}, de nacionalidad ${escapeHtml(v.nacionalidad)}, con domicilio en ${escapeHtml(v.domicilio)}, DECLARO BAJO JURAMENTO que:</p>
      <p>${escapeHtml(v.declaracion)}</p>
      <p>Formulo la presente declaración en virtud del Principio de Presunción de Veracidad ante ${escapeHtml(v.finalidad)}, en concordancia con lo establecido en el Texto Único Ordenado de la Ley N° 27444 - Ley del Procedimiento Administrativo General, sujetándome a las acciones legales correspondientes en caso de comprobarse falsedad en lo declarado.</p>
      <p class="doc-right">${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.nombre)}</div>
        <div>DNI: ${escapeHtml(v.dni)}</div>
      </div>
    `
  },

  memorando: {
    title: 'Memorando',
    subtitle: 'Comunicación breve dentro de una misma institución',
    help: 'Se usa para comunicaciones internas y directas entre áreas o personas de la misma institución (no entre instituciones distintas, para eso es el oficio). Es más corto y directo que un oficio.',
    fields: [
      { id: 'numero', label: 'N° de memorando', type: 'text', placeholder: 'Ej: 010-2026' },
      { id: 'siglas', label: 'Siglas de la institución/área (opcional)', type: 'text', placeholder: 'Ej: FIA-UNSAAC' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatarioNombre', label: 'Nombre del destinatario', type: 'text' },
      { id: 'destinatarioCargo', label: 'Cargo del destinatario', type: 'text' },
      { id: 'remitenteNombre', label: 'Nombre del remitente', type: 'text' },
      { id: 'remitenteCargo', label: 'Cargo del remitente', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'cuerpo', label: 'Cuerpo del memorando', type: 'textarea', rows: 5, hint: 'Ve directo al punto: qué se comunica, pide o dispone. Los memorandos son breves.' }
    ],
    example: {
      numero: '010-2026',
      siglas: 'FIA-UNSAAC',
      ciudad: 'Cusco',
      destinatarioNombre: 'Ing. Luis Sánchez Flores',
      destinatarioCargo: 'Jefe de Laboratorio de Cómputo',
      remitenteNombre: 'Ing. Carlos Ramírez',
      remitenteCargo: 'Director de la Escuela Profesional',
      asunto: 'Verificación de equipos del laboratorio',
      cuerpo: 'Se le encarga verificar el estado operativo de los equipos del laboratorio de cómputo N° 2 y remitir un informe con los resultados antes del viernes de la presente semana.'
    },
    render: v => `
      <h3>Memorando N° ${escapeHtml(v.numero)}${v.siglas ? '-' + escapeHtml(v.siglas) : ''}</h3>
      <div class="doc-meta">
        <div><strong>A:</strong> ${escapeHtml(v.destinatarioNombre)}, ${escapeHtml(v.destinatarioCargo)}</div>
        <div><strong>De:</strong> ${escapeHtml(v.remitenteNombre)}, ${escapeHtml(v.remitenteCargo)}</div>
        <div><strong>Asunto:</strong> ${escapeHtml(v.asunto)}</div>
        <div><strong>Fecha:</strong> ${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</div>
      </div>
      ${nl2p(v.cuerpo)}
      <p>Sin otro particular, quedo de usted.</p>
      <p>Atentamente,</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.remitenteNombre)}</div>
        <div>${escapeHtml(v.remitenteCargo)}</div>
      </div>
    `
  },

  cartaPoder: {
    title: 'Carta Poder Simple',
    subtitle: 'Autoriza a otra persona a realizar un trámite por ti',
    help: 'Se usa cuando no puedes hacer un trámite en persona (banco, RENIEC, SUNAT, municipalidad, universidad) y necesitas autorizar a alguien de confianza a hacerlo por ti. No requiere notario para trámites administrativos simples (Art. 126.1 del TUO de la Ley N° 27444).',
    fields: [
      { id: 'otorganteNombre', label: 'Tu nombre completo (quien otorga el poder)', type: 'text' },
      { id: 'otorganteDni', label: 'Tu DNI', type: 'text' },
      { id: 'otorganteDomicilio', label: 'Tu domicilio', type: 'text' },
      { id: 'apoderadoNombre', label: 'Nombre completo de la persona autorizada', type: 'text' },
      { id: 'apoderadoDni', label: 'DNI de la persona autorizada', type: 'text' },
      { id: 'tramite', label: '¿Para qué trámite específico?', type: 'textarea', rows: 3, hint: 'Sé específico: qué debe hacer, dónde, y para qué. Ej: "recoger mi certificado de estudios en la Oficina de Registros Académicos".' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() }
    ],
    example: {
      otorganteNombre: 'Juan Pérez Quispe',
      otorganteDni: '70123456',
      otorganteDomicilio: 'Av. de la Cultura 733, Cusco',
      apoderadoNombre: 'María Condori Huamán',
      apoderadoDni: '71234567',
      tramite: 'recoger mi certificado de estudios y constancia de matrícula en la Oficina de Registros Académicos de la UNSAAC.',
      ciudad: 'Cusco'
    },
    render: v => `
      <h3>Carta Poder Simple</h3>
      <p>El suscrito, ${escapeHtml(v.otorganteNombre)}, identificado(a) con DNI N° ${escapeHtml(v.otorganteDni)}, con domicilio en ${escapeHtml(v.otorganteDomicilio)}, otorgo poder simple a ${escapeHtml(v.apoderadoNombre)}, identificado(a) con DNI N° ${escapeHtml(v.apoderadoDni)}, para que en mi nombre y representación realice el siguiente trámite:</p>
      <p>${escapeHtml(v.tramite)}</p>
      <p>La presente carta poder se otorga de conformidad con el artículo 126.1 del Texto Único Ordenado de la Ley N° 27444 - Ley del Procedimiento Administrativo General, que no exige formalidad notarial para el otorgamiento de poder en trámites administrativos simples.</p>
      <p class="doc-right">${escapeHtml(v.ciudad)}, ${fechaLarga(v.fecha)}</p>
      <div class="doc-sign">
        <div class="line"></div>
        <div>${escapeHtml(v.otorganteNombre)}</div>
        <div>DNI: ${escapeHtml(v.otorganteDni)}</div>
      </div>
    `
  }
};

/* ==========================================================
   NAVEGACIÓN Y RENDERIZADO
   ========================================================== */
let currentType = null;

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function buildHomeGrid() {
  const grid = document.getElementById('docGrid');
  grid.innerHTML = '';
  Object.keys(DOC_TYPES).forEach(key => {
    const t = DOC_TYPES[key];
    const btn = document.createElement('button');
    btn.className = 'doc-card';
    btn.innerHTML = `${t.title}<small>${t.subtitle}</small>`;
    btn.addEventListener('click', () => openForm(key));
    grid.appendChild(btn);
  });
}

function fillForm(key, values) {
  const type = DOC_TYPES[key];
  type.fields.forEach(f => {
    const el = document.getElementById('field_' + f.id);
    if (el && values[f.id] !== undefined) el.value = values[f.id];
  });
}

function openForm(key) {
  currentType = key;
  const type = DOC_TYPES[key];
  document.getElementById('formTitle').textContent = type.title;
  const container = document.getElementById('formFields');
  container.innerHTML = '';

  if (type.help) {
    const helpBox = document.createElement('div');
    helpBox.className = 'help-box';
    helpBox.innerHTML = `<strong>¿Cuándo se usa?</strong> ${escapeHtml(type.help)}`;
    container.appendChild(helpBox);
  }

  if (type.example) {
    const exampleBtn = document.createElement('button');
    exampleBtn.type = 'button';
    exampleBtn.className = 'btn-secondary';
    exampleBtn.textContent = '💡 Ver / usar un ejemplo ya redactado';
    exampleBtn.addEventListener('click', () => {
      if (confirm('Esto va a rellenar el formulario con un ejemplo. ¿Continuar? (luego puedes editar cada campo con tus propios datos)')) {
        fillForm(key, type.example);
      }
    });
    container.appendChild(exampleBtn);
  }

  type.fields.forEach(f => {
    const label = document.createElement('label');
    label.textContent = f.label;
    label.htmlFor = 'field_' + f.id;
    container.appendChild(label);

    let input;
    if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = f.rows || 4;
    } else if (f.type === 'select') {
      input = document.createElement('select');
      f.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      });
    } else {
      input = document.createElement('input');
      input.type = f.type;
      if (f.placeholder) input.placeholder = f.placeholder;
    }
    input.id = 'field_' + f.id;
    if (f.value !== undefined) input.value = f.value;
    container.appendChild(input);

    if (f.hint) {
      const hintEl = document.createElement('div');
      hintEl.className = 'field-hint';
      hintEl.textContent = f.hint;
      container.appendChild(hintEl);
    }
  });
  showView('view-form');
}

document.getElementById('btnBackHome').addEventListener('click', () => showView('view-home'));
document.getElementById('btnBackForm').addEventListener('click', () => showView('view-form'));

document.getElementById('btnGenerate').addEventListener('click', () => {
  const type = DOC_TYPES[currentType];
  const values = {};
  type.fields.forEach(f => {
    values[f.id] = document.getElementById('field_' + f.id).value;
  });
  document.getElementById('docContent').innerHTML = type.render(values);
  showView('view-preview');
});

document.getElementById('btnPrint').addEventListener('click', () => {
  window.print();
});

buildHomeGrid();

/* ==========================================================
   ASISTENTE DE AYUDA (preguntas frecuentes, sin IA, offline)
   ========================================================== */
const docList = Object.keys(DOC_TYPES).map(k => `<strong>${escapeHtml(DOC_TYPES[k].title)}</strong>: ${escapeHtml(DOC_TYPES[k].help || '')}`).join('<br><br>');

const FAQ = [
  {
    q: '¿Qué documento debo usar según lo que necesito?',
    a: docList
  },
  {
    q: '¿Cómo exporto el documento a PDF?',
    a: 'Después de tocar "Generar documento", toca "Descargar / Imprimir PDF". Se abrirá el diálogo de impresión de tu dispositivo: en iPhone elige "Guardar en Archivos" o comparte como PDF; en Android/PC elige "Guardar como PDF".'
  },
  {
    q: '¿Necesito internet para usar la app?',
    a: 'No. Una vez que la abriste la primera vez (instalada desde la pantalla de inicio), funciona completamente sin conexión.'
  },
  {
    q: '¿Qué hace el botón "Ver / usar un ejemplo ya redactado"?',
    a: 'Rellena todos los campos del formulario con un caso ya escrito, para que veas cómo se redacta. Luego puedes editar cada campo con tus propios datos antes de generar tu documento real.'
  },
  {
    q: '¿Puedo editar el documento después de generarlo?',
    a: 'Sí. En la vista previa toca "Editar" para volver al formulario, corrige lo que necesites y vuelve a tocar "Generar documento".'
  },
  {
    q: '¿Estos documentos son válidos legalmente?',
    a: 'Te dan una redacción y estructura formal correcta, basada en el formato oficial peruano usado en instituciones públicas y privadas. Aun así, revisa si la institución donde lo presentarás exige un formato propio, firma legalizada, o algún requisito adicional.'
  }
];

function buildFaqPanel() {
  const panel = document.getElementById('faqPanel');
  panel.innerHTML = FAQ.map((item, i) => `
    <div class="faq-item">
      <button type="button" class="faq-question" data-i="${i}">${escapeHtml(item.q)} <span class="faq-arrow">›</span></button>
      <div class="faq-answer" id="faqAnswer${i}">${item.a}</div>
    </div>
  `).join('');

  panel.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = document.getElementById('faqAnswer' + btn.dataset.i);
      const isOpen = answer.classList.contains('open');
      panel.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
      panel.querySelectorAll('.faq-question.open').forEach(q => q.classList.remove('open'));
      if (!isOpen) {
        answer.classList.add('open');
        btn.classList.add('open');
      }
    });
  });
}

buildFaqPanel();

document.getElementById('btnHelp').addEventListener('click', () => {
  document.getElementById('faqOverlay').classList.add('open');
});
document.getElementById('btnCloseFaq').addEventListener('click', () => {
  document.getElementById('faqOverlay').classList.remove('open');
});
document.getElementById('faqOverlay').addEventListener('click', e => {
  if (e.target.id === 'faqOverlay') e.currentTarget.classList.remove('open');
});
