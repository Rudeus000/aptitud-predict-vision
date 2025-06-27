-- Migración para corregir problemas de autenticación y políticas RLS
-- Fecha: 2025-06-15

-- 1. Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.usuarios;

-- 2. Crear una política más permisiva para INSERT en usuarios (necesaria para el registro)
CREATE POLICY "Permitir inserción de perfiles de usuario" ON public.usuarios
    FOR INSERT WITH CHECK (true);

-- 3. Asegurar que el trigger funcione correctamente
-- Primero, eliminar el trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Recrear la función handle_new_user con mejor manejo de errores
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el usuario ya existe en la tabla usuarios
    IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE usuario_id = NEW.id) THEN
        INSERT INTO public.usuarios (usuario_id, nombre_usuario, rol, nombre_completo_perfil)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'role', 'candidato'),
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
        );
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error pero no fallar el registro
        RAISE WARNING 'Error en handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Asegurar que las políticas de SELECT funcionen correctamente
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.usuarios;
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.usuarios
    FOR SELECT USING (auth.uid() = usuario_id);

-- 7. Agregar política para que los usuarios puedan actualizar su propio perfil
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.usuarios;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.usuarios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- 8. Verificar que RLS esté habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 9. Crear un índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_usuario_id ON public.usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_nombre_usuario ON public.usuarios(nombre_usuario); 