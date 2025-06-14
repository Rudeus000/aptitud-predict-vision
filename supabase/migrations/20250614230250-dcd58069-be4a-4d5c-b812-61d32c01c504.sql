
-- 1. Tabla para almacenar información adicional de perfiles de usuarios
-- (Supabase maneja la autenticación en auth.users, esta tabla complementa esa información)
CREATE TABLE public.usuarios (
    usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_usuario VARCHAR(255) UNIQUE NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'candidato', -- 'empleador', 'candidato', 'administrador'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    nombre_completo_perfil VARCHAR(255),
    metadata_usuario JSONB DEFAULT '{}'
);

-- 2. Tabla para almacenar los documentos cargados (CVs, cartas, certificados, etc.)
CREATE TABLE public.documentos_cargados (
    documento_id SERIAL PRIMARY KEY,
    uploader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    tamano_bytes INTEGER,
    fecha_carga TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ruta_almacenamiento_original VARCHAR(512),
    contenido_raw_texto TEXT,
    metadata_documento JSONB DEFAULT '{}',
    UNIQUE (uploader_id, nombre_archivo)
);

-- 3. Tabla para almacenar los datos extraídos y analizados de los documentos
CREATE TABLE public.datos_documentos_procesados (
    procesado_id SERIAL PRIMARY KEY,
    documento_id INTEGER REFERENCES public.documentos_cargados(documento_id) ON DELETE CASCADE NOT NULL,
    tipo_entidad_procesada VARCHAR(100) NOT NULL,
    fecha_procesamiento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_extraida JSONB NOT NULL,
    habilidades_indexadas TEXT[],
    UNIQUE (documento_id)
);

-- 4. Tabla para rastrear las versiones del modelo de Machine Learning
CREATE TABLE public.modelos_predictivos (
    modelo_id SERIAL PRIMARY KEY,
    nombre_modelo VARCHAR(255) NOT NULL,
    version_numero VARCHAR(50) NOT NULL,
    fecha_entrenamiento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metrica_precision DECIMAL(5, 2),
    parametros_utilizados JSONB,
    ruta_modelo_almacenado VARCHAR(512),
    activo BOOLEAN DEFAULT FALSE
);

-- 5. Tabla para almacenar las predicciones de éxito
CREATE TABLE public.predicciones (
    prediccion_id SERIAL PRIMARY KEY,
    procesado_data_id INTEGER REFERENCES public.datos_documentos_procesados(procesado_id) ON DELETE CASCADE NOT NULL,
    probabilidad_exito DECIMAL(5, 2),
    factores_clave TEXT[],
    version_modelo_ml_id INTEGER REFERENCES public.modelos_predictivos(modelo_id) ON DELETE RESTRICT NOT NULL,
    fecha_prediccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (procesado_data_id)
);

-- 6. Tabla para definir la estructura de las encuestas
CREATE TABLE public.encuestas (
    encuesta_id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_encuesta VARCHAR(100) NOT NULL,
    preguntas JSONB NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE
);

-- 7. Tabla para almacenar las respuestas a las encuestas
CREATE TABLE public.respuestas_encuesta (
    respuesta_id SERIAL PRIMARY KEY,
    encuesta_id INTEGER REFERENCES public.encuestas(encuesta_id) ON DELETE CASCADE NOT NULL,
    usuario_respuesta_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    procesado_data_asociado_id INTEGER REFERENCES public.datos_documentos_procesados(procesado_id) ON DELETE SET NULL,
    respuestas JSONB NOT NULL,
    fecha_respuesta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    calificacion_desempeno_real DECIMAL(5, 2)
);

-- 8. Tabla para almacenar las recomendaciones estratégicas
CREATE TABLE public.recomendaciones (
    recomendacion_id SERIAL PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    prioridad VARCHAR(50) DEFAULT 'media'
);

-- 9. Tabla para gestionar las postulaciones
CREATE TABLE public.postulaciones (
    postulacion_id SERIAL PRIMARY KEY,
    procesado_data_id INTEGER REFERENCES public.datos_documentos_procesados(procesado_id) ON DELETE CASCADE NOT NULL,
    reclutador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre_vacante VARCHAR(255) NOT NULL,
    fecha_postulacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(100) NOT NULL DEFAULT 'recibido',
    feedback_reclutador TEXT,
    UNIQUE (procesado_data_id, nombre_vacante)
);

-- 10. Habilitar Row Level Security en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_cargados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datos_documentos_procesados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos_predictivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predicciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas_encuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recomendaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postulaciones ENABLE ROW LEVEL SECURITY;

-- 11. Políticas RLS básicas para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.usuarios
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.usuarios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- 12. Políticas RLS para documentos
CREATE POLICY "Los usuarios pueden ver sus propios documentos" ON public.documentos_cargados
    FOR SELECT USING (auth.uid() = uploader_id);

CREATE POLICY "Los usuarios pueden subir sus propios documentos" ON public.documentos_cargados
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Los empleadores pueden ver todos los documentos" ON public.documentos_cargados
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 13. Políticas RLS para datos procesados
CREATE POLICY "Los empleadores pueden ver datos procesados" ON public.datos_documentos_procesados
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

CREATE POLICY "Los candidatos pueden ver sus propios datos procesados" ON public.datos_documentos_procesados
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documentos_cargados dc
            WHERE dc.documento_id = datos_documentos_procesados.documento_id
            AND dc.uploader_id = auth.uid()
        )
    );

-- 14. Políticas RLS para predicciones
CREATE POLICY "Los empleadores pueden ver todas las predicciones" ON public.predicciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 15. Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (usuario_id, nombre_usuario, rol, nombre_completo_perfil)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'candidato'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Insertar un modelo predictivo inicial
INSERT INTO public.modelos_predictivos (nombre_modelo, version_numero, metrica_precision, activo)
VALUES ('Modelo Base v1.0', '1.0.0', 85.5, true);
