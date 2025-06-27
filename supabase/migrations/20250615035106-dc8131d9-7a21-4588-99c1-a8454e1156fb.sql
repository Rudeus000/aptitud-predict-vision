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

-- Migración para corregir políticas RLS y funcionalidades faltantes
-- Fecha: 2025-06-15

-- 1. Agregar política RLS para INSERT en usuarios (necesaria para el registro)
CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- 2. Agregar políticas RLS para empleadores/administradores en usuarios
CREATE POLICY "Los empleadores pueden ver todos los perfiles de usuarios" ON public.usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 3. Agregar políticas RLS para predicciones (candidatos pueden ver sus propias predicciones)
CREATE POLICY "Los candidatos pueden ver sus propias predicciones" ON public.predicciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.datos_documentos_procesados ddp
            JOIN public.documentos_cargados dc ON ddp.documento_id = dc.documento_id
            WHERE ddp.procesado_id = predicciones.procesado_data_id
            AND dc.uploader_id = auth.uid()
        )
    );

-- 4. Agregar políticas RLS para encuestas
CREATE POLICY "Los usuarios pueden ver encuestas activas" ON public.encuestas
    FOR SELECT USING (activa = true);

CREATE POLICY "Los administradores pueden gestionar encuestas" ON public.encuestas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol = 'administrador'
        )
    );

-- 5. Agregar políticas RLS para respuestas de encuestas
CREATE POLICY "Los usuarios pueden ver sus propias respuestas" ON public.respuestas_encuesta
    FOR SELECT USING (usuario_respuesta_id = auth.uid());

CREATE POLICY "Los usuarios pueden insertar sus propias respuestas" ON public.respuestas_encuesta
    FOR INSERT WITH CHECK (usuario_respuesta_id = auth.uid());

CREATE POLICY "Los empleadores pueden ver todas las respuestas" ON public.respuestas_encuesta
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 6. Agregar políticas RLS para recomendaciones
CREATE POLICY "Todos pueden ver recomendaciones públicas" ON public.recomendaciones
    FOR SELECT USING (true);

CREATE POLICY "Los administradores pueden gestionar recomendaciones" ON public.recomendaciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol = 'administrador'
        )
    );

-- 7. Agregar políticas RLS para postulaciones
CREATE POLICY "Los candidatos pueden ver sus propias postulaciones" ON public.postulaciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.datos_documentos_procesados ddp
            JOIN public.documentos_cargados dc ON ddp.documento_id = dc.documento_id
            WHERE ddp.procesado_id = postulaciones.procesado_data_id
            AND dc.uploader_id = auth.uid()
        )
    );

CREATE POLICY "Los empleadores pueden gestionar postulaciones" ON public.postulaciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 8. Agregar políticas RLS para modelos predictivos
CREATE POLICY "Los administradores pueden gestionar modelos" ON public.modelos_predictivos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol = 'administrador'
        )
    );

-- 9. Insertar encuesta de ejemplo para habilidades blandas
INSERT INTO public.encuestas (titulo, descripcion, tipo_encuesta, preguntas, activa) VALUES (
    'Encuesta de Habilidades Blandas',
    'Evaluación de competencias interpersonales y profesionales',
    'habilidades_blandas',
    '[
        {
            "id": "liderazgo",
            "question": "¿Cómo te describirías en situaciones de liderazgo?",
            "options": [
                "Prefiero trabajar de forma independiente",
                "Puedo liderar pequeños grupos cuando es necesario",
                "Me siento cómodo liderando equipos de cualquier tamaño",
                "Busco activamente oportunidades de liderazgo"
            ]
        },
        {
            "id": "trabajo_equipo",
            "question": "En un proyecto de equipo, ¿cuál es tu rol preferido?",
            "options": [
                "Seguir las instrucciones del líder",
                "Contribuir con mis ideas y experiencia",
                "Coordinar diferentes aspectos del proyecto",
                "Tomar la iniciativa y dirigir el equipo"
            ]
        },
        {
            "id": "comunicacion",
            "question": "¿Cómo te sientes al presentar ideas a grupos grandes?",
            "options": [
                "Me pone muy nervioso/a",
                "Puedo hacerlo pero prefiero grupos pequeños",
                "Me siento cómodo/a en la mayoría de situaciones",
                "Disfruto presentando y comunicando ideas"
            ]
        },
        {
            "id": "resolucion_problemas",
            "question": "Cuando enfrentas un problema complejo, ¿qué haces primero?",
            "options": [
                "Busco ayuda de alguien más experimentado",
                "Analizo el problema paso a paso",
                "Genero múltiples soluciones posibles",
                "Implemento una solución rápida y la ajusto según sea necesario"
            ]
        },
        {
            "id": "adaptabilidad",
            "question": "¿Cómo manejas los cambios inesperados en el trabajo?",
            "options": [
                "Me estreso y necesito tiempo para adaptarme",
                "Me adapto gradualmente con algo de apoyo",
                "Me adapto rápidamente a la nueva situación",
                "Veo los cambios como oportunidades de crecimiento"
            ]
        }
    ]',
    true
);

-- 10. Crear tabla para almacenar resultados descriptivos (para reportes)
CREATE TABLE IF NOT EXISTS public.resultados_descriptivos (
    analisis_id SERIAL PRIMARY KEY,
    fecha_analisis TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cv_procesados INTEGER DEFAULT 0,
    habilidades_top TEXT[],
    experiencia_promedio JSONB,
    metrica_precision DECIMAL(5, 2),
    observaciones TEXT
);

-- 11. Habilitar RLS en la nueva tabla
ALTER TABLE public.resultados_descriptivos ENABLE ROW LEVEL SECURITY;

-- 12. Políticas RLS para resultados descriptivos
CREATE POLICY "Los empleadores pueden ver resultados descriptivos" ON public.resultados_descriptivos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

CREATE POLICY "Los administradores pueden gestionar resultados descriptivos" ON public.resultados_descriptivos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol = 'administrador'
        )
    );

-- 13. Crear tabla para almacenar datos de postulantes (para compatibilidad con micro-interact-frontend)
CREATE TABLE IF NOT EXISTS public.datos_postulantes (
    postulante_id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255),
    email VARCHAR(255),
    habilidades TEXT[],
    experiencia JSONB,
    cv_id INTEGER REFERENCES public.documentos_cargados(documento_id),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Habilitar RLS en datos_postulantes
ALTER TABLE public.datos_postulantes ENABLE ROW LEVEL SECURITY;

-- 15. Políticas RLS para datos_postulantes
CREATE POLICY "Los empleadores pueden ver datos de postulantes" ON public.datos_postulantes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

CREATE POLICY "Los candidatos pueden ver sus propios datos" ON public.datos_postulantes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documentos_cargados dc
            WHERE dc.documento_id = datos_postulantes.cv_id
            AND dc.uploader_id = auth.uid()
        )
    );

-- 16. Crear tabla para curriculums (para compatibilidad)
CREATE TABLE IF NOT EXISTS public.curriculums (
    cv_id SERIAL PRIMARY KEY,
    postulante_id INTEGER REFERENCES public.datos_postulantes(postulante_id),
    documento_id INTEGER REFERENCES public.documentos_cargados(documento_id),
    fecha_carga TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Habilitar RLS en curriculums
ALTER TABLE public.curriculums ENABLE ROW LEVEL SECURITY;

-- 18. Políticas RLS para curriculums
CREATE POLICY "Los empleadores pueden ver curriculums" ON public.curriculums
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 19. Crear tabla para predicciones (para compatibilidad)
CREATE TABLE IF NOT EXISTS public.predicciones_compatibilidad (
    prediccion_id SERIAL PRIMARY KEY,
    postulante_id INTEGER REFERENCES public.datos_postulantes(postulante_id),
    probabilidad_exito DECIMAL(5, 2),
    factores_clave TEXT[],
    fecha_prediccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Habilitar RLS en predicciones_compatibilidad
ALTER TABLE public.predicciones_compatibilidad ENABLE ROW LEVEL SECURITY;

-- 21. Políticas RLS para predicciones_compatibilidad
CREATE POLICY "Los empleadores pueden ver predicciones" ON public.predicciones_compatibilidad
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 22. Insertar datos de ejemplo para demostración
INSERT INTO public.datos_postulantes (nombre_completo, email, habilidades, experiencia) VALUES
('Ana Martínez', 'ana.martinez@email.com', ARRAY['React', 'JavaScript', 'TypeScript'], '[]'),
('Carlos Sánchez', 'carlos.sanchez@email.com', ARRAY['Python', 'Django', 'PostgreSQL'], '[]'),
('Luis García', 'luis.garcia@email.com', ARRAY['Java', 'Spring Boot', 'MySQL'], '[]'),
('Sofía Rodríguez', 'sofia.rodriguez@email.com', ARRAY['Vue.js', 'Node.js', 'MongoDB'], '[]'),
('Javier López', 'javier.lopez@email.com', ARRAY['Docker', 'Kubernetes', 'AWS'], '[]');

-- 23. Insertar predicciones de ejemplo
INSERT INTO public.predicciones_compatibilidad (postulante_id, probabilidad_exito, factores_clave) VALUES
(1, 92.5, ARRAY['Excelente experiencia en frontend', 'Habilidades técnicas sólidas']),
(2, 87.3, ARRAY['Experiencia en desarrollo backend', 'Conocimientos de bases de datos']),
(3, 76.8, ARRAY['Experiencia en Java', 'Conocimientos de frameworks']),
(4, 65.2, ARRAY['Experiencia en desarrollo full-stack', 'Habilidades variadas']),
(5, 82.1, ARRAY['Experiencia en DevOps', 'Conocimientos de cloud computing']);
