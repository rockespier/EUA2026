-- Objeto: euroamer_admin_2008.ProductoBeneficioArr_Obtener
-- Creado en BD: 2025-10-23 04:08:27
-- Modificado en BD: 2025-10-24 02:26:17
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Ids varchar (IN)
--   @pIdioma int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[ProductoBeneficioArr_Obtener]
(
	@pPRODUCTO_Ids varchar(5000),
    @pIdioma INT = 1
)
AS
BEGIN
	--exec ProductoBeneficioArr_Obtener '1,1139,3',1

	SET NOCOUNT ON;

	DECLARE @pProducto_Id INT
	DECLARE @pCoberturaNombre varchar(255)
	DECLARE @pCoberturaImporte varchar(255)
    DECLARE @pContador INT

	CREATE TABLE #Resultados(
	    beneficioid int identity(1,1),
        beneficioNombre varchar(255),
        coberturaProd01  varchar(255),
        coberturaProd02  varchar(255),
        coberturaProd03  varchar(255),
		orden integer
    )

	CREATE TABLE #Productos(
	    tmp_productoId INT
    )

	DECLARE @vQUERY VARCHAR(5000)

	SET @vQUERY = 'INSERT INTO #Resultados(beneficioNombre,orden)
				select beneficionombre,min(beneficioorden) 
				from PRODUCTO_BENEFICIO where beneficioproductoid IN (' + @pPRODUCTO_Ids + ') and beneficioIdiomaId='+ convert(char,@pIdioma) + ' group by beneficionombre' 
--print @vQUERY
	EXEC(@vQUERY)
	
	SET @vQUERY = 'INSERT INTO #Productos select productoid from producto where productoid IN (' + @pPRODUCTO_Ids + ')' 
--print @vQUERY
	EXEC(@vQUERY)

	Declare cur_Cobertura Cursor
	    for select beneficioNombre from #Resultados order by orden
	Open cur_Cobertura;
		Fetch next from cur_Cobertura into @pCoberturaNombre
		While @@fetch_status = 0
			Begin

			    set @pContador = 1

			    Declare cur_prods Cursor
	                for select distinct tmp_productoId from #Productos
			    Open cur_prods;
                Fetch next from cur_prods into @pProducto_Id
                While @@fetch_status = 0
                    Begin

                        set @pCoberturaImporte = ISNULL((select top 1 beneficioImporte from PRODUCTO_BENEFICIO where beneficioProductoId = @pProducto_Id and beneficionombre = @pCoberturaNombre and beneficioIdiomaId = 1),'')

			            if @pContador = 1
			                begin
                                update #Resultados set coberturaProd01 = @pCoberturaImporte where beneficioNombre = @pCoberturaNombre
                            end
			            else
			                begin
                                if @pContador = 2
                                begin
                                    update #Resultados set coberturaProd02 = @pCoberturaImporte where beneficioNombre = @pCoberturaNombre
                                end
                                else
			                    begin
                                    update #Resultados set coberturaProd03 = @pCoberturaImporte where beneficioNombre = @pCoberturaNombre
                                end
                            end

                        set @pContador = @pContador + 1

                    fetch next from cur_prods into @pProducto_Id;
                    End

                Close cur_prods;
                Deallocate cur_prods;

	        fetch next from cur_Cobertura into @pCoberturaNombre;
            End

	Close cur_Cobertura;
	Deallocate cur_Cobertura;

	select * from #Resultados order by orden

END
