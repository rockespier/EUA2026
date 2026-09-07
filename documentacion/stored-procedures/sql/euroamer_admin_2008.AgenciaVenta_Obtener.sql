-- Objeto: euroamer_admin_2008.AgenciaVenta_Obtener
-- Creado en BD: 2014-04-28 13:24:03
-- Modificado en BD: 2024-07-27 14:42:06
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_ID int (IN)

CREATE PROCEDURE [AgenciaVenta_Obtener] 
	@pVENTA_ID INT = 0	
AS
BEGIN

	SET NOCOUNT ON;

	SELECT	a.agenciaId, 
			a.agenciaIdExterno, 
			a.agenciaNombre, 
			a.agenciaDireccion, 
			a.agenciaRUC, 
			a.agenciaLogin, 
			a.agenciaPassword, 
			a.agenciaEmail,
			a.agenciaPerfilId, 
			p.perfilNombre as usuarioPerfilNombre, 
			a.agenciaPromotorId, 
			euroamer_admin_2008.Usuario_RecuperarNombrexID(a.agenciaPromotorId) as agenciaPromotorNombre, 
			a.agenciaComision, 
			a.agenciaValidoDesde, 
			a.agenciaValidoHasta, 
			a.agenciaComentarios, 
			a.agenciaUltimoAcceso, 
			a.agenciaActivo,
            a.agenciaCredito,
            A.agenciaObservacionCobranzas
	FROM	AGENCIA a, PERFIL p
	WHERE   a.agenciaPerfilId = p.perfilId 
             AND   a.agenciaId = ( select VentaUsuarioAgenciaId from venta where ventaId=@pVENTA_ID)
	ORDER BY a.agenciaNombre
	
END
