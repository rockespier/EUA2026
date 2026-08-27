/*
================================================================================
 Alta de menu: "Reporte Personalizado de Ventas"
 Issue: #12 (rockespier/EUA2026) - Nuevo Reporte
================================================================================

 CONTEXTO
 --------
 Se agrego una nueva pantalla de reportes en el frontend:
   Controller: Reporte
   Action:     PersonalizadoVentas
   Ruta:       /Reporte/PersonalizadoVentas

 La pantalla NO requiere cambios en la API ni en procedimientos almacenados:
 reutiliza el endpoint ya existente "GET api/venta/VentasObtener" (SP
 Venta_Obtener_2026), que ya devuelve todas las columnas de la entidad Venta.
 El usuario elige que columnas mostrar/exportar desde el navegador.

 EL UNICO cambio de base de datos que podria ser necesario es dar de alta la
 nueva opcion en el menu lateral, para que aparezca junto a los demas
 reportes (Ventas por Agencia, por Promotor, por Rango de Edad, etc.).

 IMPORTANTE - REVISAR ANTES DE EJECUTAR
 ---------------------------------------
 El menu se arma 100% en el backend via procedimientos almacenados
 (Menu_Obtener, Menu_ObtenerPermisos, Menu_ObtenerPermisosBotones) que NO
 estan versionados en este repositorio (viven solo en la base de datos).
 Este repo solo expone el DTO de lectura BEMenu (menuId, menuIdPadre,
 menuNombre, menuPagina, menuIcono, menuVisible), por lo que el nombre real
 de la tabla, sus columnas exactas y la forma de asignar permisos por perfil
 NO pueden confirmarse desde el codigo fuente.

 Por lo tanto, este script es una PLANTILLA de referencia. El DBA debe:
   1) Confirmar el nombre real de la tabla de menu (se asume "Menu" por
      convencion con el SP "Menu_Obtener" y el DTO "BEMenu").
   2) Confirmar el/los mecanismo(s) de permisos por perfil (tabla de
      permisos de menu) y replicar ahi los mismos perfiles que ya tienen
      acceso al resto de los reportes de Ventas (Lista01..Lista09).
   3) Ajustar el @MenuIdPadre al Id real del grupo "Reportes" en su entorno.
   4) Ajustar @MenuIcono al sprite SVG que use el resto de los reportes.

================================================================================
*/

SET NOCOUNT ON;

DECLARE @MenuNombre   NVARCHAR(200) = N'Reporte Personalizado de Ventas';
DECLARE @MenuPagina   NVARCHAR(300) = N'/Reporte/PersonalizadoVentas';
DECLARE @MenuIcono    NVARCHAR(300) = N'/assets/svg/icon-sprite.svg#stroke-file-text'; -- TODO: confirmar con el resto de reportes
DECLARE @MenuVisible  INT = 1;

-- TODO: reemplazar por el Id real del menu padre "Reportes" en el ambiente destino.
DECLARE @MenuIdPadre  INT = (SELECT TOP 1 menuId FROM dbo.Menu WHERE menuNombre = N'Reportes');

IF @MenuIdPadre IS NULL
BEGIN
    RAISERROR(N'No se encontro el menu padre "Reportes". Ajustar @MenuIdPadre manualmente antes de continuar.', 16, 1);
    RETURN;
END

IF NOT EXISTS (
    SELECT 1 FROM dbo.Menu WHERE menuPagina = @MenuPagina
)
BEGIN
    INSERT INTO dbo.Menu (menuIdPadre, menuNombre, menuPagina, menuIcono, menuVisible)
    VALUES (@MenuIdPadre, @MenuNombre, @MenuPagina, @MenuIcono, @MenuVisible);

    PRINT N'Menu "Reporte Personalizado de Ventas" creado correctamente.';
END
ELSE
BEGIN
    PRINT N'Ya existe un menu con la ruta ' + @MenuPagina + N'. No se realizaron cambios.';
END

-- TODO: replicar aqui el alta de permisos por perfil (tabla de permisos de
-- menu) para los mismos perfiles que hoy pueden ver el resto de los
-- reportes de Ventas (Lista01AgenciaVentas, Lista05RangoEdadVentas, etc.).
-- No se incluye un INSERT concreto porque esa tabla no esta documentada en
-- el repositorio; el DBA debe copiar el patron que usan esos reportes.
