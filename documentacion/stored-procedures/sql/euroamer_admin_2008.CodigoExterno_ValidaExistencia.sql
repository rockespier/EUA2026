-- Objeto: euroamer_admin_2008.CodigoExterno_ValidaExistencia
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2025-04-07 08:46:28
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCodigo_Externo varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[CodigoExterno_ValidaExistencia]
	@pCodigo_Externo VARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;
	
	declare @welValor integer;

	SELECT @welValor = isnull(ventaID,0)
	FROM VENTA
	WHERE ventaCodigoExterno = @pCodigo_Externo
	AND ventaEstadoId='V'
	
	if isnull(@welValor,0)=0
		begin
			set @welValor=1
		end
	else
		begin
			set @welValor=-1
		end
		
   select @welValor as errorCodigo, '' as errorDescripcion

END
