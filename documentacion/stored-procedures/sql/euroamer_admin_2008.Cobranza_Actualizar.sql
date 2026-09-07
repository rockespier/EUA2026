-- Objeto: euroamer_admin_2008.Cobranza_Actualizar
-- Creado en BD: 2015-10-22 07:59:41
-- Modificado en BD: 2026-02-11 01:46:06
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
--   @pCOBRANZA_Descuento decimal (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_Actualizar]
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
    @pCOBRANZA_Descuento DECIMAL(14,2)
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	BEGIN TRY
		BEGIN TRANSACTION

        UPDATE COBRANZA SET
            cobranzaDocumentoTipoId = @pCOBRANZA_DocumentoTipoId,
            cobranzaDocumentoSerie = @pCOBRANZA_DocumentoSerie,
            cobranzaDocumentoCorrelativo = @pCOBRANZA_DocumentoCorrelativo,
            cobranzaComision = @pCOBRANZA_Comision,
            cobranzaIncentivo = @pCOBRANZA_Incentivo,
            cobranzaPagoMedioId = @pCOBRANZA_PagoMedioId,
            cobranzaPagoFecha = @pCOBRANZA_PagoFecha,
            cobranzaNotaCredito = @pCOBRANZA_NotaCredito,
            cobranzaCobradorId = @pCOBRANZA_CobradorId,
            cobranzaImporteBruto = @pCOBRANZA_ImporteBruto,
            cobranzaImportePago = @pCOBRANZA_ImportePago,
            cobranzaObservacion = @pCOBRANZA_Observacion,
            cobranzaModificadoFecha = GETDATE(),
            cobranzaModificadoUsuarioId = @pCOBRANZA_Usuario,
            cobranzaDescuento = @pCOBRANZA_Descuento,
            cobranzaActivo = 1
        WHERE cobranzaId = @pCOBRANZA_Id

      IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok';
				END

		COMMIT TRANSACTION
	    
	    select @tipoproceso as errorCodigo, @resultado as errorDescripcion
	    
	END TRY
	BEGIN CATCH

		SELECT
        ERROR_NUMBER() AS errorCodigo
        ,ERROR_MESSAGE() AS errorDescripcion;

		ROLLBACK TRANSACTION

	END CATCH
END
