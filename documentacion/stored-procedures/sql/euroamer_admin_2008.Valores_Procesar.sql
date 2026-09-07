-- Objeto: euroamer_admin_2008.Valores_Procesar
-- Creado en BD: 2025-01-17 07:37:53
-- Modificado en BD: 2025-01-17 07:51:16
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALOR_CampoTabla varchar (IN)
--   @pVALOR_valorId varchar (IN)
--   @pVALOR_ValorNombre varchar (IN)
--   @pValorAux varchar (IN)
--   @pValorAux2 varchar (IN)
--   @pValorAux3 varchar (IN)
--   @pValorUsuarioId int (IN)

CREATE PROCEDURE [Valores_Procesar]
	@pVALOR_CampoTabla VARCHAR(25),
	@pVALOR_valorId VARCHAR(3),
	@pVALOR_ValorNombre VARCHAR(100),
	@pValorAux VARCHAR(50),
    @pValorAux2 VARCHAR(50),
    @pValorAux3 VARCHAR(50),
	@pValorUsuarioId int
AS
BEGIN
	
	SET NOCOUNT ON;

	--exec valores_procesar 'SOLICITUDTIPOACCIONID','E','ELIMINAR','','','',1

	declare @tipoproceso int = 0;
	declare @validarExista int = 0;

	select @validarExista =count(valortipoId) from VALORES_Tipo WHERE valortipoColumnaTabla = @pVALOR_CampoTabla AND valortipoId = @pVALOR_valorId;

	IF @validarExista = 0
		BEGIN
			set @tipoproceso=1;
			INSERT INTO VALORES_tipo (valortipoColumnaTabla, valortipoId, valortipoNombre, valortipoActivo, valortipoDescripcion,valortipoAux,valortipoAux2,valortipoAux3,valortipoUsuarioId,
			valortipoFechaRegistro) 
			VALUES (
			UPPER(@pVALOR_CampoTabla), @pVALOR_valorId, UPPER(@pVALOR_ValorNombre), 1, 
			UPPER((SELECT TOP 1 valortipoDescripcion FROM valores_tipo where valortipoColumnaTabla=@pVALOR_CampoTabla)),
			@pValorAux,@pValorAux2,@pValorAux3,@pValorUsuarioId,GETDATE())
		END
	ELSE
		BEGIN
			set @tipoproceso=2;
			UPDATE VALORES_tipo SET
			valortipoNombre = UPPER(@pVALOR_ValorNombre),
			valortipoAux = @pValorAux,
			valortipoAux2 = @pValorAux2,
			valortipoAux3 = @pValorAux3,
			valortipoUsuarioId = @pValorUsuarioId,
			valortipoFechaRegistro = getdate()
			WHERE valortipoColumnaTabla = @pVALOR_CampoTabla AND valortipoId = @pVALOR_valorId
		END


	IF @@ROWCOUNT = 0
		BEGIN
			select @tipoproceso as codigo, '' as descripcion
		END
	ELSE 
		BEGIN
			select @tipoproceso as codigo, 'ok' as descripcion
		END
    
END
