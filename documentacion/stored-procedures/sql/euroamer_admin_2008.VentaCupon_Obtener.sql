-- Objeto: euroamer_admin_2008.VentaCupon_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pventacupon_Id int (IN)
--   @pventacupon_Pais int (IN)
--   @pventacupon_AgenciaID int (IN)
--   @pventacupon_FechaInicio date (IN)
--   @pventacupon_FechaFin date (IN)
--   @pventacupon_Cupon varchar (IN)


CREATE PROCEDURE [euroamer_admin_2008].[VentaCupon_Obtener]
	@pventacupon_Id int=0,
	@pventacupon_Pais int =0,
	@pventacupon_AgenciaID int =0,
	@pventacupon_FechaInicio DATE = '',
	@pventacupon_FechaFin DATE = '',
	@pventacupon_Cupon varchar(8)=''
AS
BEGIN
	
	SET NOCOUNT ON;
	
	SELECT vc.ventacuponId
		  ,vc.ventacuponDescuentoImporte
		  ,vc.ventacuponClienteDocumentoTipoId
		  ,(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='agenciausuarioTipoDocumento' AND valorTipoId=vc.ventacuponClienteDocumentoTipoId) as ventacuponClienteDocumentoTipoNombre 
		  ,vc.ventacuponClienteDocumentoNumero
		  ,a.agenciaPaisId
		  ,p.paisNombre
		  ,vc.ventacuponAgenciaID
		  ,a.agenciaNombre
		  ,vc.ventacuponFechaVigenciaUso
		  ,vc.ventacuponRestriccionDias
		  ,vc.ventacuponEstado
		  ,vc.ventacuponCupon
		  ,vc.ventacuponCreadoFecha
		  ,vc.ventacuponCreadoUsuarioId
		  ,vc.ventacuponModificadoFecha
		  ,vc.ventacuponModificadoUsuarioId
		FROM VENTA_CUPON vc
			inner join AGENCIA a
			on vc.ventacuponAgenciaID = a.agenciaId
			inner join PAIS p
			on a.agenciaPaisId=p.paisId
		WHERE (@pventacupon_Id = 0 OR vc.ventacuponId = @pventacupon_Id) AND
		(@pventacupon_Pais = 0 OR a.agenciaPaisId = @pventacupon_Pais) AND
		(@pventacupon_AgenciaID = 0 OR vc.ventacuponAgenciaID = @pventacupon_AgenciaID) AND
		(@pventacupon_FechaInicio = '1900-01-01' OR CAST(vc.ventacuponModificadoFecha AS DATE) BETWEEN @pventacupon_FechaInicio AND @pventacupon_FechaFin) AND
		(@pventacupon_Cupon = '' OR vc.ventacuponCupon = @pventacupon_Cupon)

END
