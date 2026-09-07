-- Objeto: euroamer_admin_2008.AgenciaApps_Obtener
-- Creado en BD: 2016-02-21 18:26:50
-- Modificado en BD: 2016-03-15 18:49:43
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pAGENCIA_PerfilId int (IN)
--   @pAGENCIA_PromotorId int (IN)
--   @pAGENCIA_Activo int (IN)
--   @pAGENCIA_PaisId int (IN)


CREATE PROCEDURE [AgenciaApps_Obtener] 
	@pAGENCIA_Id INT = 0,
	@pAGENCIA_PerfilId INT = 0,
	@pAGENCIA_PromotorId INT = 0,
	@pAGENCIA_Activo INT = -1, 
	@pAGENCIA_PaisId INT = 0
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
                        a.agenciaTelefono,
                        a.agenciaPaisId,
                        a.agenciaXcoord,
                        a.agenciaYcoord,
                        euroamer_admin_2008.VisitsApps_ObtenerFechaCercana(a.agenciaPromotorId,a.agenciaId) fechas,
                        isnull((select y.visitasId from visitas y where y.visitasFechaventa = cast (getdate() as date) and y.visitasagenciaid=a.agenciaId and y.visitasUsuarioOrigenId=a.agenciaPromotorId),0) visitasID,
euroamer_admin_2008.VisitsApps_ObtenerIdDetalleVisita(isnull((select y.visitasId from visitas y where y.visitasFechaventa = cast (getdate() as date) and y.visitasagenciaid=a.agenciaId and y.visitasUsuarioOrigenId=a.agenciaPromotorId),0))
	FROM	AGENCIA a, PERFIL p
	WHERE	a.agenciaPerfilId = p.perfilId AND
			(@pAGENCIA_Id = 0 OR a.agenciaId = @pAGENCIA_Id) AND 
			(@pAGENCIA_PerfilId = 0 OR a.agenciaPerfilId = @pAGENCIA_PerfilId) AND
			(@pAGENCIA_PromotorId = 0 OR a.agenciaPromotorId = @pAGENCIA_PromotorId) AND
			(@pAGENCIA_Activo = -1 OR a.agenciaActivo = @pAGENCIA_Activo) AND
			(@pAGENCIA_PaisId = 0 OR a.agenciaPaisId = @pAGENCIA_PaisId)
	ORDER BY a.agenciaNombre
    
END
