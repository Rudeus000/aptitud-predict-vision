-- CHECK_TRIGGER.sql
-- Ejecutar este código en el SQL Editor de Supabase para verificar el trigger

-- 1. Verificar si el trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar si la función existe
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Verificar usuarios recientes
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Verificar perfiles de usuarios
SELECT 
    usuario_id,
    nombre_usuario,
    rol,
    nombre_completo_perfil,
    fecha_creacion
FROM public.usuarios 
ORDER BY fecha_creacion DESC 
LIMIT 5;

-- 5. Si el trigger no funciona, recrearlo
-- Primero eliminar el trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recrear la función
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
        RAISE NOTICE 'Perfil creado para usuario: %', NEW.email;
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error pero no fallar el registro
        RAISE WARNING 'Error en handle_new_user para usuario %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar que se creó correctamente
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'; 