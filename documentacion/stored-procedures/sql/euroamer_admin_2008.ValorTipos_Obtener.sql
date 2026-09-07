-- Objeto: euroamer_admin_2008.ValorTipos_Obtener
-- Creado en BD: 2025-01-17 06:01:51
-- Modificado en BD: 2025-04-29 08:35:12
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI

/****** Object:  StoredProcedure [euroamer_admin_2008].[ValoresTipoId_Obtener]    Script Date: 17/01/2025 14:52:17 ******/
CREATE PROCEDURE [ValorTipos_Obtener]

AS
BEGIN
	
	SET NOCOUNT ON;
	--exec ValorTipos_Obtener

	CREATE TABLE #ValorTemp (
		valorCampoTabla varchar(50),
		valorNombre varchar(200),
		valorActivo int,
		
	)
 
    insert into #ValorTemp (valorCampoTabla,valorNombre,valorActivo)
	SELECT DISTINCT upper(valorTipoColumnaTabla) as valorCampoTabla, valorTipoDescripcion as valorNombre, valorTipoActivo
    FROM VALORES_TIPO WHERE VALORTipoACTIVO=1 
	order by 2
	
	select upper(valorCampoTabla) valorCampoTabla,upper(valorNombre) valorNombre,valorActivo,
	(select top 1 upper(u.usuarioNombre) 
	        from VALORES_TIPO v, usuario u 
			where v.valortipousuarioId = usuarioId 
			and v.valorTipoColumnaTabla=t.valorCampoTabla 
			order by v.valortipofecharegistro desc) valorUsuarioNombre, 
	(select top 1 upper(v.valortipofecharegistro) 
			from VALORES_tipo v 
			where v.valortipoColumnaTabla=t.valorCampoTabla 
			order by v.valortipofecharegistro desc) valorFechaRegsitro
	FROM #ValorTemp t

END
