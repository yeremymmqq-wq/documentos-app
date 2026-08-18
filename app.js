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
    fields: [
      { id: 'destinatario', label: 'Dirigido a (cargo e institución)', type: 'text', placeholder: 'Ej: Decano de la Facultad de Ingeniería - UNSAAC' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'nombre', label: 'Nombre completo del solicitante', type: 'text' },
      { id: 'dni', label: 'DNI', type: 'text' },
      { id: 'domicilio', label: 'Domicilio', type: 'text' },
      { id: 'asunto', label: 'Asunto (resumen corto)', type: 'text', placeholder: 'Ej: Solicita constancia de matrícula' },
      { id: 'motivo', label: 'Motivo / petición (explica con detalle)', type: 'textarea', rows: 5 }
    ],
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
    fields: [
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatarioNombre', label: 'Nombre del destinatario', type: 'text' },
      { id: 'destinatarioCargo', label: 'Cargo / institución del destinatario', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'cuerpo', label: 'Contenido de la carta', type: 'textarea', rows: 6 },
      { id: 'despedida', label: 'Despedida', type: 'select', options: ['Atentamente', 'Cordialmente', 'Sin otro particular, quedo de usted'], value: 'Atentamente' },
      { id: 'remitenteNombre', label: 'Tu nombre completo', type: 'text' },
      { id: 'remitenteDatos', label: 'Tus datos adicionales (DNI, cargo, etc.)', type: 'text' }
    ],
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
    fields: [
      { id: 'numero', label: 'N° de oficio', type: 'text', placeholder: 'Ej: 045-2026' },
      { id: 'siglas', label: 'Siglas de la institución (opcional)', type: 'text', placeholder: 'Ej: FIA-UNSAAC' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatarioNombre', label: 'Nombre del destinatario', type: 'text' },
      { id: 'destinatarioCargo', label: 'Cargo del destinatario', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'referencia', label: 'Referencia (opcional)', type: 'text' },
      { id: 'cuerpo', label: 'Cuerpo del oficio', type: 'textarea', rows: 6 },
      { id: 'remitenteNombre', label: 'Nombre del remitente', type: 'text' },
      { id: 'remitenteCargo', label: 'Cargo del remitente', type: 'text' },
      { id: 'institucion', label: 'Institución del remitente', type: 'text' },
      { id: 'copias', label: 'Con copia a (opcional, uno por línea)', type: 'textarea', rows: 2 }
    ],
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
    fields: [
      { id: 'numero', label: 'N° de informe', type: 'text', placeholder: 'Ej: 012-2026' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'destinatario', label: 'Dirigido a (nombre y cargo)', type: 'text' },
      { id: 'remitente', label: 'De (tu nombre y cargo)', type: 'text' },
      { id: 'asunto', label: 'Asunto', type: 'text' },
      { id: 'referencia', label: 'Referencia (opcional)', type: 'text' },
      { id: 'antecedentes', label: 'Antecedentes', type: 'textarea', rows: 4 },
      { id: 'desarrollo', label: 'Análisis / desarrollo', type: 'textarea', rows: 5 },
      { id: 'conclusiones', label: 'Conclusiones', type: 'textarea', rows: 3 },
      { id: 'recomendaciones', label: 'Recomendaciones', type: 'textarea', rows: 3 }
    ],
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
    fields: [
      { id: 'tipo', label: 'Tipo de acta', type: 'text', placeholder: 'Ej: Acta de Reunión de Coordinación', value: 'Acta de Reunión' },
      { id: 'lugar', label: 'Lugar', type: 'text' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() },
      { id: 'horaInicio', label: 'Hora de inicio', type: 'time' },
      { id: 'horaFin', label: 'Hora de finalización', type: 'time' },
      { id: 'participantes', label: 'Participantes (uno por línea)', type: 'textarea', rows: 4 },
      { id: 'agenda', label: 'Temas tratados', type: 'textarea', rows: 4 },
      { id: 'acuerdos', label: 'Acuerdos', type: 'textarea', rows: 4 },
      { id: 'observaciones', label: 'Observaciones (opcional)', type: 'textarea', rows: 2 }
    ],
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
    fields: [
      { id: 'nombre', label: 'Nombre completo', type: 'text' },
      { id: 'dni', label: 'DNI', type: 'text' },
      { id: 'nacionalidad', label: 'Nacionalidad', type: 'text', value: 'peruana' },
      { id: 'domicilio', label: 'Domicilio', type: 'text' },
      { id: 'declaracion', label: 'Declaro bajo juramento que...', type: 'textarea', rows: 5 },
      { id: 'finalidad', label: 'Finalidad / institución ante la que se presenta', type: 'text', placeholder: 'Ej: la UNSAAC, para trámite de matrícula' },
      { id: 'ciudad', label: 'Ciudad', type: 'text', value: 'Cusco' },
      { id: 'fecha', label: 'Fecha', type: 'date', value: todayISO() }
    ],
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

function openForm(key) {
  currentType = key;
  const type = DOC_TYPES[key];
  document.getElementById('formTitle').textContent = type.title;
  const container = document.getElementById('formFields');
  container.innerHTML = '';
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
