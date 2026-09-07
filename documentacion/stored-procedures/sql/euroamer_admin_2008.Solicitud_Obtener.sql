-- Objeto: euroamer_admin_2008.Solicitud_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2026-04-22 06:32:20
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pORIGEN varchar (IN)
--   @pSOLICITUD_UsuarioId int (IN)
--   @pSOLICITUD_FechaIngresoInicio date (IN)
--   @pSOLICITUD_FechaIngresoFin date (IN)
--   @pSOLICITUD_Id int (IN)
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_TipoId int (IN)
--   @pSOLICITUD_EstadoId varchar (IN)
--   @pSOLICITUD_AgenciaId int (IN)
--   @pSOLICITUD_AgenciaUsuarioId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Solicitud_Obtener]
	@pORIGEN VARCHAR(1),
	@pSOLICITUD_UsuarioId INT = 0,
	@pSOLICITUD_FechaIngresoInicio DATE = '',
	@pSOLICITUD_FechaIngresoFin DATE = '',
	@pSOLICITUD_Id INT = 0,
	@pSOLICITUD_VentaId INT = 0,
	@pSOLICITUD_TipoId INT = 0,
	@pSOLICITUD_EstadoId VARCHAR(1) = '',
	@pSOLICITUD_AgenciaId INT = 0,
	@pSOLICITUD_AgenciaUsuarioId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	--Solicitud_Obtener 'U',132,'20250602','20250802',0,0,0,'',0,0
	--Solicitud_Obtener 'U',0,'20260401','20260422',0,0,0,'P',0,0

	DECLARE @vPERFIL_ID INT
	SET @vPERFIL_ID = (SELECT euroamer_admin_2008.Usuario_RecuperarPerfil(@pORIGEN, @pSOLICITUD_UsuarioId))
	
	DECLARE @vOPCION_1 INT = 0
	DECLARE @vOPCION_2 INT = 0
	DECLARE @vOPCION_3 INT = 0
	DECLARE @vOPCION_4 INT = 0
	DECLARE @vOPCION_5 INT = 0

	IF (@pORIGEN = 'N' AND @vPERFIL_ID = 5)
		SET @vOPCION_1 = 1
	ELSE IF (@pORIGEN = 'N' AND @vPERFIL_ID = 4)
		SET @vOPCION_2 = 1
	ELSE IF (@pORIGEN = 'A' AND @vPERFIL_ID = 2) OR (@pORIGEN = 'N' AND @vPERFIL_ID = 3)
		SET @vOPCION_3 = 1
	ELSE IF (@pORIGEN = 'U' AND @vPERFIL_ID = 6)
		SET @vOPCION_4 = 1	
	ELSE IF (@vPERFIL_ID = isnull((select valorTipoId from  valores_tipo where valorTipoColumnaTabla='FiltroPerfilPais' and valorTipoActivo=1 and valorTipoId=@vPERFIL_ID),-1))
		SET @vOPCION_5 = 1
	print '@vOPCION_1 ' + convert(varchar,@vOPCION_1)
	print '@vOPCION_2 ' + convert(varchar,@vOPCION_2)
	print '@vOPCION_3 ' + convert(varchar,@vOPCION_3)
	print '@vOPCION_4 ' + convert(varchar,@vOPCION_4)
	print '@vOPCION_5 ' + convert(varchar,@vOPCION_5)
	
	SELECT	sol.solicitudId,
			sol.solicitudVentaId,
			ISNULL((SELECT euroamer_admin_2008.Usuario_RecuperarNombre('A', v.ventaUsuarioAgenciaId)),'ADMINISTRADOR') as solicitudAgenciaNombre,
			sol.solicitudTipoId,
			tip.solicitudTipoNombre,
			tip.solicitudTipoEnviarCorreo,
			sol.solicitudEstadoId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('solicitudEstadoId',sol.solicitudEstadoId) as solicitudEstadoNombre,
			sol.solicitudMotivo,
			sol.solicitudRespuesta,
			sol.solicitudCreadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombre('N', sol.solicitudCreadoUsuarioId) as solicitudCreadoUsuarioNombre,
			sol.solicitudAtendidoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombre('U', sol.solicitudAtendidoUsuarioId) as solicitudAtendidoUsuarioNombre,
			sol.solicitudVigenciaFechaInicial, sol.solicitudVigenciaFechaFinal,
			(SELECT agenciaNombre FROM AGENCIA WHERE agenciaId = sol.solicitudAgenciaId AND agenciaActivo = 1) as solicitudAgenciaNombre2,
			(SELECT agenciausuarioNombre FROM AGENCIA_USUARIO WHERE agenciausuarioId = sol.solicitudAgenciaUsuarioId AND agenciausuarioActivo = 1) as solicitudAgenciaUsuarioNombre,
			sol.solicitudClienteDocumentoTipoId, 
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaClienteDocumentoTipoId',sol.solicitudClienteDocumentoTipoId) as solicitudClienteDocumentoTipoNombre,
			sol.solicitudClienteDocumentoNumero,
			sol.solicitudClienteNombres,
			sol.solicitudClienteApellidos,
			sol.solicitudClienteFechaNacimiento,
			sol.solicitudClienteEdad,
			sol.solicitudClienteEmail,
			sol.solicitudClienteDireccion,
			sol.solicitudClienteTelefono,
			sol.solicitudClienteDistrito,
			sol.solicitudClienteCiudad,
			sol.solicitudClientePais,
			sol.solicitudAdjunto,
			sol.solicitudContactoNombre,
			sol.solicitudContactoDireccion,
			sol.solicitudContactoDistrito,
			sol.solicitudContactoPais,
			sol.solicitudContactoTelefono,
			sol.solicitudContactoEmail,
			(SELECT productoNombre FROM PRODUCTO WHERE productoId = v.ventaProductoId) as solicitudProductoNombre,
			sol.solicitudVentaImporte,
			sol.solicitudMotivoAnulacion,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('MotivoAnulacion',sol.solicitudMotivoAnulacion) as solicitudMotivoAnulacionDescripcion,
			solicitudCreadoUsuarioId,
			(SELECT productoNombre FROM PRODUCTO WHERE productoId = sol.solicitudProductoId) as solicitudProductoNombreCambio
	FROM	SOLICITUD sol, SOLICITUD_TIPO tip, VENTA v
	WHERE	sol.solicitudTipoId = tip.solicitudtipoId AND sol.solicitudVentaId = v.ventaid AND
			(@pSOLICITUD_FechaIngresoInicio = '1900-01-01' OR CAST(sol.solicitudCreadoFecha AS DATE) BETWEEN @pSOLICITUD_FechaIngresoInicio AND @pSOLICITUD_FechaIngresoFin) AND
			(@pSOLICITUD_Id = 0 OR sol.solicitudId = @pSOLICITUD_Id) AND
			(@pSOLICITUD_VentaId = 0 OR sol.solicitudVentaId = @pSOLICITUD_VentaId) AND
			(@pSOLICITUD_TipoId = 0 OR sol.solicitudTipoId = @pSOLICITUD_TipoId) AND
			(@pSOLICITUD_EstadoId = '' OR sol.solicitudEstadoId = @pSOLICITUD_EstadoId) AND
			(@vOPCION_1 = 0 OR (sol.solicitudCreadoUsuarioId = @pSOLICITUD_UsuarioId)) AND
			(@vOPCION_2 = 0 OR (sol.solicitudCreadoUsuarioId IN (SELECT agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioSupervisorId = @pSOLICITUD_UsuarioId OR agenciausuarioId = @pSOLICITUD_UsuarioId AND agenciausuarioActivo = 1))) AND
			(@vOPCION_3 = 0 OR (sol.solicitudCreadoUsuarioId IN (SELECT agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciaId = (SELECT agenciaId FROM AGENCIA_USUARIO WHERE agenciausuarioId = @pSOLICITUD_UsuarioId)))) AND
			(@vOPCION_4 = 0 OR (select ventaUsuarioAgenciaId from venta where ventaid=solicitudVentaId) IN (SELECT agenciaId FROM AGENCIA WHERE agenciaPromotorId = @pSOLICITUD_UsuarioId AND agenciaActivo = 1)) AND
			(@vOPCION_5 = 0 OR (v.ventaUsuarioAgenciaId in (select agenciaId from AGENCIA where agenciaPaisId in (select UsuarioPaisId from USUARIO where usuarioId=@pSOLICITUD_UsuarioId))))
			AND (@pSOLICITUD_AgenciaId = 0 OR (sol.solicitudCreadoUsuarioId IN (select au.agenciausuarioId from AGENCIA_USUARIO au where au.agenciaId = @pSOLICITUD_AgenciaId union select a.agenciaId from AGENCIA a where a.agenciaid = @pSOLICITUD_AgenciaId))) AND
			(@pSOLICITUD_AgenciaUsuarioId = 0 OR (sol.solicitudCreadoUsuarioId = @pSOLICITUD_AgenciaUsuarioId))
			order by sol.solicitudCreadoFecha desc,solicitudAgenciaNombre

    

END
