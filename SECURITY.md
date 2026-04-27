# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada |
|--------|-----------|
| 1.x    | ✅        |

## Reportar una Vulnerabilidad

Si descubrí una vulnerabilidad de seguridad, por favor reportala de manera responsable:

1. **NO** crees un issue público en GitHub
2. Email: contacto@buscampa.com.ar
3. Incluí:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Correcciones (si las conocés)

## Medidas de Seguridad

### Autenticación
- Integración OAuth 2.0 con Google y Facebook
- Tokens JWT para gestión de sesiones
- Los tokens incluyen tiempo de expiración

### Protección de Datos
- Aplicación de HTTPS en producción
- Variables de entorno para datos sensibles
- Sin credenciales comiteadas al control de versiones

### Seguridad de API
- CORS configurado para orígenes específicos
- Rate limiting (configurado a nivel de despliegue)
- Validación de input en todos los endpoints

### Dependencias
- Actualizaciones regulares de dependencias
- Parches de seguridad aplicados
- Mínima huella de dependencias

## Alcance

Esta política de seguridad aplica a:
- Aplicación web (buscampa.com.ar)
- API del backend
- Flujos de autenticación
- Almacenamiento de datos de usuarios