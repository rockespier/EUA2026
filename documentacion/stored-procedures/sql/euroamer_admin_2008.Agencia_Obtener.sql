-- Objeto: euroamer_admin_2008.Agencia_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2026-08-11 05:58:36
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pAGENCIA_PerfilId int (IN)
--   @pAGENCIA_PromotorId int (IN)
--   @pAGENCIA_Activo int (IN)
--   @pAGENCIA_PaisId int (IN)
--   @pAgencia_Nombre varchar (IN)
--   @pAgencia_Login varchar (IN)
--   @pAgencia_RUC varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Agencia_Obtener] 
	@pAGENCIA_Id INT = 0,
	@pAGENCIA_PerfilId INT = 0,
	@pAGENCIA_PromotorId INT = 0,
	@pAGENCIA_Activo INT = -1, 
	@pAGENCIA_PaisId INT = 0,
    @pAgencia_Nombre VARCHAR(100) = '',
    @pAgencia_Login VARCHAR(10) = '',
    @pAgencia_RUC VARCHAR(11) = ''
AS
BEGIN

	SET NOCOUNT ON;
	--Promotor
	--exec Agencia_Obtener 0,0,158,-1,0,'','',''
    --Administrador
	--exec Agencia_Obtener 0,0,1,-1,1,'','',''
    --exec Agencia_Obtener 0,0,45,-1,1,'','',''
    --Gestor
	--exec Agencia_Obtener 0,0,184,-1,2,'','',''

	DECLARE @vEsPromotor INT = 0
	DECLARE @vEsFiltroPorPais INT = 0
	DECLARE @vUsuarioPerfilID INT = 0
	DECLARE @vFiltroPaisID INT = 0
		
	select @vUsuarioPerfilID =usuarioperfilid, @vFiltroPaisID = UsuarioPaisId from  USUARIO where usuarioid= @pAGENCIA_PromotorId;

	--Validar si es un perfil que filtra
	Set @vEsPromotor = 6
	
    --Validar si es un perfil que filtra
	select @vEsFiltroPorPais = count(valortipoid) from VALORES_TIPO where valorTipoColumnaTabla='FILTROPERFILPAIS' and valortipoid=@vUsuarioPerfilID;

	--select count(valortipoid) from VALORES_TIPO where valorTipoColumnaTabla='FILTROPERFILPAIS' and valortipoid=7;

	if @vEsPromotor <> @vUsuarioPerfilID
		begin
		  set @pAGENCIA_PromotorId = 0;
		end
	
	if (@vEsFiltroPorPais > 0 and @pAGENCIA_PaisId = 0)
	    begin
            set @pAGENCIA_PaisId = @vFiltroPaisID;
        end
	
		
	SELECT	a.agenciaId, 
			a.agenciaIdExterno, 
			upper(a.agenciaNombre) agenciaNombre,
			a.agenciaDireccion, 
			a.agenciaRUC, 
			upper(a.agenciaLogin) agenciaLogin,
			a.agenciaContrasena agenciaPassword, 
			a.agenciaEmail,
			a.agenciaPerfilId, 
			p.perfilNombre as usuarioPerfilNombre, 
			a.agenciaPromotorId, 
			euroamer_admin_2008.Usuario_RecuperarNombrexID(a.agenciaPromotorId) as agenciaPromotorNombre, 
			a.agenciaComision, 
			a.agenciaValidoDesde, 
			a.agenciaValidoHasta, 
			a.agenciaComentarios, 
			a.agenciaUltimoAcceso, 
			a.agenciaActivo,
			a.agenciaCredito,
			a.agenciaTelefono,
			a.agenciaPaisId,
			a.agenciaXcoord,
			a.agenciaYcoord,
			a.agenciaUbigeoId,
			u.ubigeoDistrito,
			a.agenciaObservacionCobranzas,
			(select paisNombre from PAIS pa where pa.paisId = a.agenciaPaisId) agenciaPaisNombre,
	        isnull(a.agenciaVip, 0) agenciaVip,
	        isnull(a.agenciaEjecutivoCobrador, 0) agenciaEjecutivoCobrador
	FROM	AGENCIA a
			left join PERFIL p
			on a.agenciaPerfilId = p.perfilId
			left join Ubigeo u
			on a.agenciaUbigeoId = UbigeoId
	WHERE	 (@pAGENCIA_Id = 0 OR a.agenciaId = @pAGENCIA_Id) AND 
			(@pAGENCIA_PerfilId = 0 OR a.agenciaPerfilId = @pAGENCIA_PerfilId) AND
			(@pAGENCIA_PromotorId = 0 OR a.agenciaPromotorId = @pAGENCIA_PromotorId) AND
			(@pAGENCIA_Activo = -1 OR a.agenciaActivo = @pAGENCIA_Activo) AND
			(@pAGENCIA_PaisId = 0 OR a.agenciaPaisId = @pAGENCIA_PaisId) and
			(@pAgencia_Nombre = ''  OR a.agenciaNombre like '%' + @pAgencia_Nombre + '%') AND
			(@pAgencia_Login = '' OR a.agenciaLogin = @pAgencia_Login) AND
			(@pAgencia_RUC = '' OR a.agenciaRUC = @pAgencia_RUC)
	ORDER BY a.agenciaNombre
    
END
