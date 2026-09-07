-- Objeto: euroamer_admin_2008.ValoresTipo_Procesar
-- Creado en BD: 2024-12-30 03:19:46
-- Modificado en BD: 2024-12-30 03:19:46
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALORTIPO_ColumnaTabla varchar (IN)
--   @pVALORTIPO_TipoId varchar (IN)
--   @pVALORTIPO_TipoNombre varchar (IN)


CREATE PROCEDURE [ValoresTipo_Procesar]
	@pVALORTIPO_ColumnaTabla varchar(50),
	@pVALORTIPO_TipoId varchar(4),
	@pVALORTIPO_TipoNombre varchar(100)
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

    IF @pVALORTIPO_TipoId = 0
		BEGIN
			set @tipoproceso=1;
			INSERT INTO VALORES_TIPO (valorTipoColumnaTabla, 
			valorTipoId, valorTipoNombre, valorTipoActivo) 
			VALUES (
			@pVALORTIPO_ColumnaTabla, 
			@pVALORTIPO_TipoId, 
			@pVALORTIPO_TipoNombre, 1)

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok'
			END
						
		END
	ELSE
		BEGIN
			set @tipoproceso=2;
			UPDATE VALORES_TIPO SET 
            valorTipoNombre = @pVALORTIPO_TipoNombre
            WHERE valorTipoColumnaTabla = @pVALORTIPO_ColumnaTabla
			AND valorTipoId = @pVALORTIPO_TipoId

			IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok'
				END
											
		END
	
	select @tipoproceso as errorCodigo, @resultado as errorDescripcion
	
END
