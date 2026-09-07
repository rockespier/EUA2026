-- Objeto: euroamer_admin_2008.AgenciaProducto_Procesar
-- Creado en BD: 2025-04-15 03:23:22
-- Modificado en BD: 2025-07-03 07:22:38
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAgenciaProductoAgencia_Id int (IN)
--   @pAgenciaProductoProducto_Id int (IN)
--   @pAgenciaProductoDescuentoTipo int (IN)
--   @pAgenciaProductoDescuentoImporte decimal (IN)
--   @pAgenciaProductoDescuentoVigenciaIni datetime (IN)
--   @pAgenciaProductoDescuentoVigenciaFin datetime (IN)
--   @pAgenciaProductoDescuentoNombre varchar (IN)
--   @pAgenciaProducto_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaProducto_Procesar]
	@pAgenciaProductoAgencia_Id INT,
	@pAgenciaProductoProducto_Id INT,
	@pAgenciaProductoDescuentoTipo INT,
	@pAgenciaProductoDescuentoImporte DECIMAL(10,4),
	@pAgenciaProductoDescuentoVigenciaIni DATETIME,
    @pAgenciaProductoDescuentoVigenciaFin DATETIME,
    @pAgenciaProductoDescuentoNombre varchar(30),
    @pAgenciaProducto_Id INT

AS
BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0, @contador int = 0;
	declare @resultado varchar(300) = '';

		
    IF @pAgenciaProducto_Id = 0
		BEGIN
			set @tipoproceso=1;
			INSERT INTO AGENCIA_PRODUCTO(
                 AGENCIAPRODUCTOAGENCIAID, AGENCIAPRODUCTOPRODUCTOID,
			     AGENCIAPRODUCTODESCUENTOTIPO, AGENCIAPRODUCTODESCUENTOIMPORTE,
			     AGENCIAPRODUCTODESCUENTOVIGENCIAINI, AGENCIAPRODUCTODESCUENTOVIGENCIAFIN,
			     agenciaProductoDescuentoNombre
				)
            VALUES (
                    @pAgenciaProductoAgencia_Id, @pAgenciaProductoProducto_Id,
	                @pAgenciaProductoDescuentoTipo, @pAgenciaProductoDescuentoImporte,
	                @pAgenciaProductoDescuentoVigenciaIni, @pAgenciaProductoDescuentoVigenciaFin,
                    @pAgenciaProductoDescuentoNombre
				)
				IF @@ROWCOUNT > 0
					BEGIN
						set @resultado = 'ok'
					END
		END
	ELSE
		BEGIN
			set @tipoproceso=2;

			UPDATE AGENCIA_PRODUCTO SET
			      AGENCIAPRODUCTODESCUENTOIMPORTE = @pAgenciaProductoDescuentoImporte,
			      AGENCIAPRODUCTODESCUENTOVIGENCIAINI = @pAgenciaProductoDescuentoVigenciaIni,
			      AGENCIAPRODUCTODESCUENTOVIGENCIAFIN = @pAgenciaProductoDescuentoVigenciaFin,
			      agenciaProductoDescuentoNombre = @pAgenciaProductoDescuentoNombre
            WHERE AGENCIAPRODUCTOID = @pAgenciaProducto_Id			      

			IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok'
				END
		END

	select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
