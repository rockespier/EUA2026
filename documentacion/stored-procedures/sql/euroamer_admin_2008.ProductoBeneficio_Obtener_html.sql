-- Objeto: euroamer_admin_2008.ProductoBeneficio_Obtener_html
-- Creado en BD: 2018-07-26 09:18:35
-- Modificado en BD: 2018-07-26 09:18:35
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pbeneficio_Id int (IN)
--   @pIdioma int (IN)
--   @r varchar (OUTPUT)


CREATE PROCEDURE ProductoBeneficio_Obtener_html
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


	set @Solo =  '<table style=''width:100%'' class=''small''>  <tr>  <th colspan=2>Beneficios</th> </tr> '
	--set @Solo =  '<table style=''width:100%''>   '

	DECLARE cursor_beneficio CURSOR FOR
	SELECT top 4 beneficioNombre, 
			beneficioImporte		
	FROM	PRODUCTO_beneficio
	WHERE	beneficioProductoId = @pPRODUCTO_Id AND
			(@pbeneficio_Id = 0 OR beneficioId = @pbeneficio_Id) AND
                        (@pIdioma = 0 OR beneficioIdiomaId = @pIdioma)
    order by beneficioOrden

	OPEN cursor_beneficio;
	FETCH cursor_beneficio INTO	@wDesc, @wImpo
	WHILE @@FETCH_STATUS = 0
		BEGIN
				set @Solo = @Solo +  '<tr><td>' + @wDesc +'</td><td>' + @wImpo +'</td></tr>'
		FETCH cursor_beneficio INTO	@wDesc, @wImpo;
		END;
	CLOSE cursor_beneficio;
	DEALLOCATE cursor_beneficio;


	--set @wHyper = '<a href=''#''  target=''popup''  onclick=''window.open("#","popup","width=600,height=600"); return false;''> Ver más beneficios</a>'
	
	--set @Solo = @Solo +  '<tr><td colspan=2 style=''padding-top:5px;''>' + @wHyper +'</td></tr>'

	set @Solo = @Solo +  '</table> '

	select @r= @Solo
END
