-- Objeto: euroamer_admin_2008.AgenciaFactura_Eliminar
-- Creado en BD: 2025-05-13 07:59:44
-- Modificado en BD: 2025-05-20 05:12:38
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAgenciafacturaId int (IN)

CREATE PROCEDURE [AgenciaFactura_Eliminar]
	 @pAgenciafacturaId INT	 
AS
BEGIN

	SET NOCOUNT ON;

    UPDATE AGENCIA_FACTURA SET agenciafacturaEstado = 0
                           WHERE agenciafacturaId  = @pAgenciafacturaId	                            

	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
