
-- Crear documentos de prueba con datos de candidatos ficticios
-- Usaremos el primer usuario existente en la tabla usuarios
INSERT INTO documentos_cargados (uploader_id, nombre_archivo, mime_type, tamano_bytes, fecha_carga, contenido_raw_texto) 
VALUES 
(
    (SELECT usuario_id FROM usuarios LIMIT 1),
    'cv_ana_martinez.pdf',
    'application/pdf',
    245760,
    NOW() - INTERVAL '2 days',
    'Ana Martínez - Desarrolladora Full Stack Senior con 5 años de experiencia en React, Node.js, Python. Trabajó en empresas como TechStart y InnovateCorp.'
);

-- Insertar datos procesados para este candidato
INSERT INTO datos_documentos_procesados (documento_id, tipo_entidad_procesada, data_extraida, habilidades_indexadas) 
VALUES 
(
    (SELECT documento_id FROM documentos_cargados WHERE nombre_archivo = 'cv_ana_martinez.pdf'),
    'cv_candidato',
    '{
      "nombre": "Ana Martínez",
      "puesto_actual": "Desarrolladora Full Stack Senior",
      "empresa_actual": "TechStart Solutions",
      "experiencia_anos": 5,
      "ubicacion": "Madrid, España",
      "telefono": "+34 666 123 456",
      "email": "ana.martinez@email.com",
      "educacion": "Ing. Informática - Universidad Politécnica",
      "certificaciones": ["AWS Certified", "React Professional"]
    }',
    ARRAY['React', 'Node.js', 'Python', 'JavaScript', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git']
);

-- Insertar predicción para este candidato
INSERT INTO predicciones (procesado_data_id, probabilidad_exito, factores_clave, version_modelo_ml_id) 
VALUES 
(
    (SELECT procesado_id FROM datos_documentos_procesados WHERE documento_id = (SELECT documento_id FROM documentos_cargados WHERE nombre_archivo = 'cv_ana_martinez.pdf')),
    92.5,
    ARRAY['Sólida experiencia en tecnologías modernas', 'Historial en empresas reconocidas', 'Certificaciones relevantes', 'Stack tecnológico demandado'],
    1
);
