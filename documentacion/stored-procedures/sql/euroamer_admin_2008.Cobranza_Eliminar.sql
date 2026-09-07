-- Objeto: euroamer_admin_2008.Cobranza_Eliminar
-- Creado en BD: 2015-10-22 15:18:24
-- Modificado en BD: 2025-08-08 03:48:46
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCOBRANZA_Id int (IN)

CREATE PROCEDURE [Cobranza_Eliminar]
	@pCOBRANZA_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;
    declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

    UPDATE COBRANZA SET cobranzaActivo=0, cobranzaModificadoFecha=@FechaHoraActual WHERE cobranzaId = @pCOBRANZA_Id
    
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
