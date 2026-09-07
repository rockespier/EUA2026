-- Objeto: euroamer_admin_2008.ProductoBeneficio_Obtener_html2
-- Creado en BD: 2021-12-23 10:00:39
-- Modificado en BD: 2021-12-23 10:00:39
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pbeneficio_Id int (IN)
--   @pIdioma int (IN)
--   @r varchar (OUTPUT)


CREATE PROCEDURE [euroamer_admin_2008].[ProductoBeneficio_Obtener_html2]
	@pPRODUCTO_Id INT,
	@pbeneficio_Id INT = 0,
    @pIdioma INT = 1,	
	@r varchar(max) out 
AS
BEGIN
	SET NOCOUNT ON;

	declare @wDesc as varchar(max);
	declare @wImpo as varchar(max);
	declare @wHyper as varchar(max);
	declare @Solo as varchar(max);

	set @Solo =  '<li class="list-group-item active">Beneficios</li> '

	DECLARE cursor_beneficio CURSOR FOR
	SELECT top 4 beneficioNombre, 
			beneficioImporte		
	FROM	PRODUCTO_beneficio
	WHERE	beneficioProductoId = @pPRODUCTO_Id AND
			(@pbeneficio_Id = 0 OR beneficioId = @pbeneficio_Id) AND
                        (@pIdioma = 0 OR beneficioIdiomaId = @pIdioma)
    order by beneficioId

	OPEN cursor_beneficio;
	FETCH cursor_beneficio INTO	@wDesc, @wImpo
	WHILE @@FETCH_STATUS = 0
		BEGIN
				set @Solo = @Solo +  '<li class="list-group-item">' + @wDesc + ' ' + @wImpo +'</li>'
		FETCH cursor_beneficio INTO	@wDesc, @wImpo;
		END;
	CLOSE cursor_beneficio;
	DEALLOCATE cursor_beneficio;

	select @r= @Solo
END
