-- Objeto: euroamer_admin_2008.Cotizador_OrigenDestino_Obtener
-- Creado en BD: 2018-07-26 08:48:02
-- Modificado en BD: 2025-10-06 08:15:02
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pORIGEN int (IN)

CREATE PROCEDURE Cotizador_OrigenDestino_Obtener 
	@pORIGEN int
AS
BEGIN
	
	SET NOCOUNT ON;

    if @pORIGEN=1
		begin
			select paisId,paisNombre
			from pais where paisActivo=1 order by PaisNombre asc
		end
	else
		begin
			select valorTipoId paisId, valorTipoNombre paisNombre
			from valores_tipo where valortipocolumnatabla='destino' and valorTipoActivo=1 order by valorTipoNombre asc
		end
END
