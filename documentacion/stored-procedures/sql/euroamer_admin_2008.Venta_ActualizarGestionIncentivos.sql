-- Objeto: euroamer_admin_2008.Venta_ActualizarGestionIncentivos
-- Creado en BD: 2016-02-15 21:06:19
-- Modificado en BD: 2026-08-26 04:47:39
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)
--   @pVENTA_Observacion varchar (IN)
--   @pVENTA_IncentivoPost decimal (IN)
--   @pVENTA_IncentivoFechaPago date (IN)
--   @pVENTA_IncentivoModificadoUsuario int (IN)

CREATE PROCEDURE [Venta_ActualizarGestionIncentivos]
	@pVENTA_Id INT = 0,
	@pVENTA_Observacion VARCHAR(3000) = '',
	@pVENTA_IncentivoPost Decimal(18,4) = 0,
	@pVENTA_IncentivoFechaPago DATE,
	@pVENTA_IncentivoModificadoUsuario INT
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	
	set @tipoproceso=2;		
	

	UPDATE	VENTA SET
			ventaObservacion = @pVENTA_Observacion,
			ventaIncentivoPost = @pVENTA_IncentivoPost,
			ventaIncentivoFechaPago = @pVENTA_IncentivoFechaPago,
			ventaIncentivoPostFechaPago= @pVENTA_IncentivoFechaPago,
			ventaIncentivoModificadoFecha = GETDATE(),
			ventaIncentivoModificadoUsuario = @pVENTA_IncentivoModificadoUsuario
	WHERE	ventaId = @pVENTA_Id
	
	 IF @@ROWCOUNT > 0
        BEGIN
            set @resultado = 'ok'
        END	
    
    select @tipoproceso as errorCodigo, @resultado as errorDescripcion
    
END
