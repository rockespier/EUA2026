-- Objeto: euroamer_admin_2008.Cobranza_Obtener
-- Creado en BD: 2015-10-19 04:28:39
-- Modificado en BD: 2025-08-07 07:24:10
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCOBRANZA_Id int (IN)
--   @pCOBRANZA_FechaIngresoInicio date (IN)
--   @pCOBRANZA_FechaIngresoFin date (IN)
--   @pCOBRANZA_FechaPagoInicio date (IN)
--   @pCOBRANZA_FechaPagoFin date (IN)
--   @pUsuario_Id int (IN)
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_Obtener]
	@pCOBRANZA_Id INT = 0,
	@pCOBRANZA_FechaIngresoInicio DATE = '',
	@pCOBRANZA_FechaIngresoFin DATE = '',
	@pCOBRANZA_FechaPagoInicio DATE = '',
	@pCOBRANZA_FechaPagoFin DATE = '',
    @pUsuario_Id INT = 0,
    @pCodLiquidacion INT = 0
AS
BEGIN
    --Cobranza_Obtener 0,'20250401','20250430','','',0
	--Cobranza_Obtener 0,'20250601','20250703','','',920,0
	--Cobranza_Obtener 0,'','','','',0,92
	--select * from COBRANZA_PAGO where cobranzapagoCobranzaId in (138557,138558,138559,138573)
	--select * from cobranza
    --select CAST((getdate()-7) AS DATE),CAST((getdate()) AS DATE)
	SET NOCOUNT ON;
    
	if @pCOBRANZA_FechaIngresoInicio=''
        begin
            set @pCOBRANZA_FechaIngresoInicio = CAST((getdate()-7) AS DATE)
            set @pCOBRANZA_FechaIngresoFin = CAST((getdate()) AS DATE)
        end

	if (@pCOBRANZA_Id=0)
		BEGIN
		    print @pCOBRANZA_FechaIngresoInicio
		    print @pCOBRANZA_FechaIngresoFin
		    print @pCodLiquidacion
		    
					SELECT 	cobranzaId,
					cobranzaCliente,
					cobranzaDocumentoTipoId, euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaDocumentoTipoId',cobranzaDocumentoTipoId) as cobranzaDocumentoTipoNombre,
					cobranzaDocumentoSerie,
					cobranzaDocumentoCorrelativo,
					cobranzaComision,
					cobranzaIncentivo,
					cobranzaPagoMedioId,
					isnull((select top 1 valorTipoNombre 
					    from cobranza_pago, VALORES_TIPO 
					    where valorTipoColumnaTabla='cobranzaPagoMedioId' 
					      and cobranzapagoCobranzaId = cobranzaId
					      and cobranzaPagoMedioId = valorTipoId),'') as cobranzaPagoMedioNombre,
					cobranzaPagoFecha,
					cobranzaNotaCredito,
					cobranzaCobradorId,
					euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaCobradorId',cobranzaCobradorId) as cobranzaCobradorNombre,
					cobranzaImporteBruto,
					cobranzaImportePago,
					cobranzaObservacion,
					cobranzaCreadoFecha,
					cobranzaCreadoUsuarioId,
					cobranzaModificadoFecha,
					cobranzaModificadoUsuarioId,
					cobranzaActivo,
					cobranzacodigoliquidacion,
					cobranzaDescuento
			FROM	COBRANZA
			WHERE	(@pCOBRANZA_FechaIngresoInicio = '1900-01-01' OR CAST(cobranzaCreadoFecha AS DATE)
			                >= @pCOBRANZA_FechaIngresoInicio AND CAST(cobranzaCreadoFecha AS DATE) <= @pCOBRANZA_FechaIngresoFin) AND
					(@pCOBRANZA_FechaPagoInicio = '1900-01-01' OR CAST(cobranzaPagoFecha AS DATE)
					        >= @pCOBRANZA_FechaPagoInicio AND CAST(cobranzaPagoFecha AS DATE) <= @pCOBRANZA_FechaPagoFin) AND
					cobranzaActivo = 1 AND					
					(@pUsuario_Id = 0 or (cobranzaCliente = (select agenciaNombre from agencia where agenciaId = @pUsuario_Id))) AND
		            (@pCodLiquidacion = 0 or cobranzacodigoliquidacion =@pCodLiquidacion)
		END
	ELSE
		BEGIN
					SELECT 	cobranzaId,
					cobranzaCliente,
					cobranzaDocumentoTipoId, euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaDocumentoTipoId',cobranzaDocumentoTipoId) as cobranzaDocumentoTipoNombre,
					cobranzaDocumentoSerie,
					cobranzaDocumentoCorrelativo,
					cobranzaComision,
					cobranzaIncentivo,
					cobranzaPagoMedioId, euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoMedioId',cobranzaPagoMedioId) as cobranzaPagoMedioNombre,
					cobranzaPagoFecha,
					cobranzaNotaCredito,
					cobranzaCobradorId, euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaCobradorId',cobranzaCobradorId) as cobranzaCobradorNombre,
					cobranzaImporteBruto,
					cobranzaImportePago,
					cobranzaObservacion,
					cobranzaCreadoFecha,
					cobranzaCreadoUsuarioId,
					cobranzaModificadoFecha,
					cobranzaModificadoUsuarioId,
					cobranzaActivo,
					cobranzaDescuento
			FROM	COBRANZA, USUARIO 
			WHERE	cobranzaId=@pCOBRANZA_Id
				AND cobranzaCreadoUsuarioId = USUARIOID 
		END
	
END
