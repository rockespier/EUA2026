-- Objeto: euroamer_admin_2008.Venta_VigenciaValidar
-- Creado en BD: 2023-07-31 00:57:50
-- Modificado en BD: 2023-07-31 01:11:09
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_DiasViaje int (IN)
--   @pVENTA_ProductoID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_VigenciaValidar]	
	@pVENTA_DiasViaje INT,
	@pVENTA_ProductoID INT
AS
BEGIN
	--Venta_VigenciaValidar 13,2849
	SET NOCOUNT ON;
	declare @vResultadoCod INT = 0
	declare @vResultadoDes VARCHAR(80) = '' 

	IF @pVENTA_DiasViaje > 0 
		BEGIN

			if (@pVENTA_DiasViaje < 1)
			begin
				set @vResultadoCod= -1
				set @vResultadoDes = 'La cantidad de dias debe ser 1 como minimo, por favor verificar.'
			end
			else
				begin
					if (select count(*) from PRODUCTO_TARIFA where tarifaproductoid = @pVENTA_ProductoID) = 0
						begin
							set @vResultadoCod= -2
							set @vResultadoDes = 'El producto no cuenta con tarifas, por favor verificar.'
						end	
					else
						begin
							--Verificar si la tarifa existe
							if ((select COUNT(0) from PRODUCTO_TARIFA where tarifaproductoid = @pVENTA_ProductoID 
							and @pVENTA_DiasViaje between tarifanumerodiasMinimo and tarifaNumeroDiasMaximo) = 0 )
							begin
								set @vResultadoCod= -3
							set @vResultadoDes = 'No existe tarifa para la cantidad de dias seleccionado, por favor verificar.'
							end

						end
				end		
		END

    SELECT @vResultadoCod,@vResultadoDes
    
END
