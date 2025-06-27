// Script de diagnóstico completo para el problema de validación de email
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cfjndisaofjxlkytvbrj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmam5kaXNhb2ZqeGxreXR2YnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDE2MzYsImV4cCI6MjA2NTUxNzYzNn0.g1UVTvH7hSvQKhIPRpQkDqUci56SQ-jDd2AA1sODz4I";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testBasicConnection() {
  console.log('=== Probando conexión básica ===');
  
  try {
    const { data, error } = await supabase.from('usuarios').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    } else {
      console.log('✅ Conexión exitosa');
      return true;
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return false;
  }
}

async function testEmailValidation() {
  console.log('\n=== Probando diferentes emails ===');
  
  const testEmails = [
    'test@example.com',
    'user@gmail.com',
    'admin@test.com',
    'candidate@demo.com',
    'franklin@gmail.com',
    'test123@test.com',
    'user@domain.com'
  ];
  
  for (const email of testEmails) {
    console.log(`\nProbando: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'testpassword123',
        options: {
          data: {
            username: 'testuser',
            role: 'candidato',
            full_name: 'Usuario de Prueba'
          }
        }
      });
      
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(`   Status: ${error.status}`);
        console.error(`   Name: ${error.name}`);
      } else {
        console.log(`✅ Éxito: ${data.user?.email}`);
        // Si uno funciona, no necesitamos probar más
        break;
      }
      
    } catch (error) {
      console.error(`❌ Error inesperado: ${error.message}`);
    }
    
    // Esperar entre pruebas
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function testSignIn() {
  console.log('\n=== Probando inicio de sesión ===');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (error) {
      console.error('❌ Error en signIn:', error.message);
    } else {
      console.log('✅ SignIn exitoso:', data.user?.email);
    }
  } catch (error) {
    console.error('❌ Error inesperado en signIn:', error);
  }
}

async function testAuthSettings() {
  console.log('\n=== Verificando configuración de autenticación ===');
  
  try {
    // Probar obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error obteniendo sesión:', error);
    } else {
      console.log('✅ Sesión actual:', session ? 'Activa' : 'No hay sesión');
    }
    
    // Probar obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error obteniendo usuario:', userError);
    } else {
      console.log('✅ Usuario actual:', user ? user.email : 'No hay usuario');
    }
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

async function runCompleteDiagnostics() {
  console.log('🔍 Iniciando diagnóstico completo de Supabase Auth...\n');
  
  const connectionOk = await testBasicConnection();
  
  if (connectionOk) {
    await testAuthSettings();
    await testEmailValidation();
    await testSignIn();
  } else {
    console.log('❌ No se puede continuar sin conexión básica');
  }
  
  console.log('\n📋 Resumen del diagnóstico:');
  console.log('- Si todos los emails fallan, hay un problema de configuración en Supabase');
  console.log('- Verifica la configuración de Authentication en el dashboard de Supabase');
  console.log('- Revisa si hay políticas restrictivas de email');
  console.log('- Verifica la configuración de SMTP si está habilitada');
}

// Ejecutar diagnóstico completo
runCompleteDiagnostics(); 