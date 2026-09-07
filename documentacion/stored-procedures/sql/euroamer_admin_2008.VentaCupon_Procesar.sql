-- Objeto: euroamer_admin_2008.VentaCupon_Procesar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pventacupon_Id int (IN)
--   @pventacupon_DescuentoImporte decimal (IN)
--   @pventacupon_ClienteDocumentoTipoId varchar (IN)
--   @pventacupon_ClienteDocumentoNumero varchar (IN)
--   @pventacupon_AgenciaID int (IN)
--   @pventacupon_FechaVigenciaUso date (IN)
--   @pventacupon_RestriccionDias int (IN)
--   @pventacupon_UsuarioID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentaCupon_Procesar]
	@pventacupon_Id int=0,
	@pventacupon_DescuentoImporte decimal(18, 4)=0,
	@pventacupon_ClienteDocumentoTipoId varchar(3)='',
	@pventacupon_ClienteDocumentoNumero varchar(50)='',
	@pventacupon_AgenciaID int =0,
	@pventacupon_FechaVigenciaUso date,
	@pventacupon_RestriccionDias int =0,
	@pventacupon_UsuarioID int =0
	
AS
BEGIN
	
	SET NOCOUNT ON;
	
	DECLARE @wIDCupon varchar(8);

	IF @pventacupon_Id = 0
		BEGIN
		
		SELECT @wIDCupon = upper(coalesce(@wIDCupon, '') +CHAR(
		CASE WHEN r between 0 and 9 THEN 48
		WHEN r between 10 and 35 THEN 55
		ELSE 61 END + r))
		FROM
		master..spt_values
		CROSS JOIN
		(SELECT CAST(RAND(ABS(CHECKSUM(NEWID()))) *61 as int) r) a
		WHERE type = 'P' AND number < 8
			
			INSERT INTO VENTA_CUPON
           ([ventacuponDescuentoImporte]
           ,[ventacuponClienteDocumentoTipoId]
           ,[ventacuponClienteDocumentoNumero]
           ,[ventacuponAgenciaID]
           ,[ventacuponFechaVigenciaUso]
           ,[ventacuponRestriccionDias]
           ,[ventacuponEstado]
           ,[ventacuponCupon]
           ,[ventacuponCreadoFecha]
           ,[ventacuponCreadoUsuarioId]
           ,[ventacuponModificadoFecha]
           ,[ventacuponModificadoUsuarioId])
			VALUES
           (@pventacupon_DescuentoImporte
           ,@pventacupon_ClienteDocumentoTipoId
           ,@pventacupon_ClienteDocumentoNumero
           ,@pventacupon_AgenciaID
           ,@pventacupon_FechaVigenciaUso
           ,@pventacupon_RestriccionDias
           ,'N'
           ,@wIDCupon
           ,getdate()
           ,@pventacupon_UsuarioID
           ,getdate()
           ,@pventacupon_UsuarioID)
			
		END
	ELSE
		BEGIN
			UPDATE VENTA_CUPON
				   SET [ventacuponDescuentoImporte] = @pventacupon_DescuentoImporte
					  ,[ventacuponClienteDocumentoTipoId] = @pventacupon_ClienteDocumentoTipoId
					  ,[ventacuponClienteDocumentoNumero] = @pventacupon_ClienteDocumentoNumero
					  ,[ventacuponAgenciaID] = @pventacupon_AgenciaID
					  ,[ventacuponFechaVigenciaUso] = @pventacupon_FechaVigenciaUso
					  ,[ventacuponRestriccionDias] = @pventacupon_RestriccionDias
					  ,[ventacuponModificadoFecha]=GETDATE()
					  ,[ventacuponModificadoUsuarioId]=@pventacupon_UsuarioID
				WHERE ventacuponId = @pventacupon_Id
		END
END
