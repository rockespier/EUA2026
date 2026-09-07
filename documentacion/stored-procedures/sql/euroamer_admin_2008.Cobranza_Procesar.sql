-- Objeto: euroamer_admin_2008.Cobranza_Procesar
-- Creado en BD: 2018-08-31 10:39:29
-- Modificado en BD: 2025-08-07 08:33:52
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCOBRANZA_Id int (IN)
--   @pCOBRANZA_Cliente varchar (IN)
--   @pCOBRANZA_DocumentoTipoId char (IN)
--   @pCOBRANZA_DocumentoSerie varchar (IN)
--   @pCOBRANZA_DocumentoCorrelativo varchar (IN)
--   @pCOBRANZA_Comision decimal (IN)
--   @pCOBRANZA_Incentivo decimal (IN)
--   @pCOBRANZA_PagoMedioId int (IN)
--   @pCOBRANZA_PagoFecha date (IN)
--   @pCOBRANZA_NotaCredito varchar (IN)
--   @pCOBRANZA_CobradorId int (IN)
--   @pCOBRANZA_ImporteBruto decimal (IN)
--   @pCOBRANZA_ImportePago decimal (IN)
--   @pCOBRANZA_Observacion text (IN)
--   @pCOBRANZA_Usuario int (IN)
--   @pCOBRANZA_VentaIds varchar (IN)
--   @pCOBRANZA_Descuento decimal (IN)
--   @pCOBRANZA_CodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_Procesar]
	@pCOBRANZA_Id INT,
	@pCOBRANZA_Cliente VARCHAR(200),
	@pCOBRANZA_DocumentoTipoId CHAR(3),
	@pCOBRANZA_DocumentoSerie VARCHAR(10),
	@pCOBRANZA_DocumentoCorrelativo VARCHAR(20),
	@pCOBRANZA_Comision DECIMAL(14,2),
	@pCOBRANZA_Incentivo DECIMAL(14,2),
	@pCOBRANZA_PagoMedioId INT,
	@pCOBRANZA_PagoFecha DATE,
	@pCOBRANZA_NotaCredito VARCHAR(20),
	@pCOBRANZA_CobradorId INT,
	@pCOBRANZA_ImporteBruto DECIMAL(14,2),
	@pCOBRANZA_ImportePago DECIMAL(14,2),
	@pCOBRANZA_Observacion TEXT,
	@pCOBRANZA_Usuario INT,
	@pCOBRANZA_VentaIds VARCHAR(max),
    @pCOBRANZA_Descuento DECIMAL(14,2),
    @pCOBRANZA_CodLiquidacion INT
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	BEGIN TRY
		BEGIN TRANSACTION	

	IF @pCOBRANZA_Id <> 0
		BEGIN
			INSERT INTO COBRANZA(
				cobranzaId,
				cobranzaCliente,
				cobranzaDocumentoTipoId,
				cobranzaDocumentoSerie,
				cobranzaDocumentoCorrelativo,
				cobranzaComision,
				cobranzaIncentivo,
				cobranzaPagoMedioId,
				cobranzaPagoFecha,
				cobranzaNotaCredito,
				cobranzaCobradorId,
				cobranzaImporteBruto,
				cobranzaImportePago,
				cobranzaObservacion,
				cobranzaCreadoFecha,
				cobranzaCreadoUsuarioId,
				cobranzaModificadoFecha,
				cobranzaModificadoUsuarioId,
				cobranzaActivo,
			    cobranzaDescuento,
			    cobranzaCodigoLiquidacion)
			VALUES (
				@pCOBRANZA_Id, 
				@pCOBRANZA_Cliente,
				@pCOBRANZA_DocumentoTipoId, 
				@pCOBRANZA_DocumentoSerie,
				@pCOBRANZA_DocumentoCorrelativo,
				@pCOBRANZA_Comision,
				@pCOBRANZA_Incentivo,
				@pCOBRANZA_PagoMedioId,
				@pCOBRANZA_PagoFecha,
				@pCOBRANZA_NotaCredito,
				@pCOBRANZA_CobradorId,
				@pCOBRANZA_ImporteBruto,
				@pCOBRANZA_ImportePago,
				@pCOBRANZA_Observacion,
				@FechaHoraActual,
				@pCOBRANZA_Usuario,
				@FechaHoraActual,
				@pCOBRANZA_Usuario,
				1,@pCOBRANZA_Descuento,
			    @pCOBRANZA_CodLiquidacion)
			IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok';
				END 

			IF @pCOBRANZA_VentaIds <> ''
				BEGIN
					--DECLARE @vFORMAT VARCHAR(3000)
					--SET @vFORMAT = SUBSTRING(@pCOBRANZA_VentaIds, 1, LEN(@pCOBRANZA_VentaIds) - 1)

					INSERT INTO COBRANZA_DETALLE
					SELECT @pCOBRANZA_Id, splitdata FROM euroamer_admin_2008.Split(@pCOBRANZA_VentaIds, '|')
                    --07.04.2025 Se cancelaran las ventas despues de verificar el pago
					--21.07.2025 Se anula el proceso de registro de pago y verificar pago, y se hace la cancelación aqui.
                    UPDATE VENTA SET ventaSituacionId = 'C'
					where ventaid in (select cobranzadetalleVentaid from COBRANZA_DETALLE where cobranzaid=@pCOBRANZA_Id)
				END
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion   
		END
	
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
        
		SELECT   
        ERROR_NUMBER() AS errorCodigo  
        ,ERROR_MESSAGE() AS errorDescripcion;  

		ROLLBACK TRANSACTION		
		
	END CATCH
END
