-- Objeto: euroamer_admin_2008.Agencia_Procesar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-11-03 02:35:27
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pAGENCIA_IdExterno int (IN)
--   @pAGENCIA_Nombre varchar (IN)
--   @pAGENCIA_Direccion varchar (IN)
--   @pAGENCIA_RUC varchar (IN)
--   @pAGENCIA_Login varchar (IN)
--   @pAGENCIA_Password varchar (IN)
--   @pAGENCIA_Email varchar (IN)
--   @pAGENCIA_PerfilId int (IN)
--   @pAGENCIA_PromotorId int (IN)
--   @pAGENCIA_Comision decimal (IN)
--   @pAGENCIA_ValidoDesde date (IN)
--   @pAGENCIA_ValidoHasta date (IN)
--   @pAGENCIA_Comentarios text (IN)
--   @pAGENCIA_UsuarioId int (IN)
--   @pAGENCIA_Activo int (IN)
--   @pAGENCIA_Credito int (IN)
--   @pAGENCIA_PaisId int (IN)
--   @pAGENCIA_Telefono varchar (IN)
--   @pAGENCIA_Xcoord decimal (IN)
--   @pAGENCIA_Ycoord decimal (IN)
--   @pAGENCIA_UbigeoId int (IN)
--   @pAGENCIA_ObservacionCobranza text (IN)
--   @pAGENCIA_ActualizarContrasena int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Agencia_Procesar] 
	@pAGENCIA_Id INT,
	@pAGENCIA_IdExterno INT,
	@pAGENCIA_Nombre VARCHAR(100), 
	@pAGENCIA_Direccion VARCHAR(500), 
	@pAGENCIA_RUC VARCHAR(11), 
    @pAGENCIA_Login VARCHAR(50), 
    @pAGENCIA_Password VARCHAR(50), 
	@pAGENCIA_Email VARCHAR(50), 
	@pAGENCIA_PerfilId INT,
	@pAGENCIA_PromotorId INT,
	@pAGENCIA_Comision DECIMAL(12,3),
	@pAGENCIA_ValidoDesde DATE,
	@pAGENCIA_ValidoHasta DATE,
	@pAGENCIA_Comentarios TEXT,
	@pAGENCIA_UsuarioId INT,
	@pAGENCIA_Activo INT,
	@pAGENCIA_Credito INT,
	@pAGENCIA_PaisId INT,
    @pAGENCIA_Telefono VARCHAR(20),
    @pAGENCIA_Xcoord decimal(20,8),
    @pAGENCIA_Ycoord decimal(20,8),
	@pAGENCIA_UbigeoId INT,
    @pAGENCIA_ObservacionCobranza TEXT = '',
    @pAGENCIA_ActualizarContrasena INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	declare @existeLogin int = 0;
    declare @AGENCIA_Nombre_antes VARCHAR(100);

        IF @pAGENCIA_Id = 0
            BEGIN
                
                set @tipoproceso=1;
                
                	--Buscar si existe el login
                    SET @existeLogin = (select count(*) from AGENCIA where agenciaLogin = @pAGENCIA_Login)
                
                    IF @existeLogin > 0
                    BEGIN
                        set @tipoproceso = -1
                        set @resultado = 'El login que ha ingresado, ya existe.'
                    END
                    ELSE
                        BEGIN
                
                            INSERT INTO AGENCIA(
                                agenciaIdExterno,
                                agenciaNombre, 
                                agenciaDireccion, 
                                agenciaRUC, 
                                agenciaLogin, 
                                agenciaPassword, 
                                agenciaEmail, 
                                agenciaPerfilId, 
                                agenciaPromotorId,
                                agenciaComision,
                                agenciaValidoDesde, 
                                agenciaValidoHasta, 
                                agenciaComentarios, 
                                agenciaUltimoAcceso,
                                agenciaCreadoFecha,
                                agenciaCreadoUsuarioId,
                                agenciaModificadoFecha,
                                agenciaModificadoUsuarioId,
                                agenciaActivo,
                                agenciaCredito,
                                agenciaPaisId,
                                agenciaTelefono,
                                agenciaXcoord,
                                agenciaYcoord,
                                agenciaUbigeoId,
                                agenciaObservacionCobranzas)
                            VALUES (
                                @pAGENCIA_IdExterno, 
                                @pAGENCIA_Nombre, 
                                @pAGENCIA_Direccion, 
                                @pAGENCIA_RUC, 
                                @pAGENCIA_Login, 
                                @pAGENCIA_Password, 
                                @pAGENCIA_Email,
                                @pAGENCIA_PerfilId,
                                @pAGENCIA_PromotorId,
                                @pAGENCIA_Comision,
                                @pAGENCIA_ValidoDesde,
                                @pAGENCIA_ValidoHasta,
                                @pAGENCIA_Comentarios,
                                @FechaHoraActual,
                                @FechaHoraActual,
                                @pAGENCIA_UsuarioId,
                                @FechaHoraActual,
                                @pAGENCIA_UsuarioId,
                                1,
                                @pAGENCIA_Credito,
                                @pAGENCIA_PaisId,
                                @pAGENCIA_Telefono,
                                @pAGENCIA_Xcoord,
                                @pAGENCIA_Ycoord,
                                @pAGENCIA_UbigeoId,
                                @pAGENCIA_ObservacionCobranza)
                                IF @@ROWCOUNT > 0
                                    BEGIN
                                        set @resultado = 'ok'
                                    END		
                
                                SELECT @pAGENCIA_Id = SCOPE_IDENTITY()
                        END
                        
            END
        ELSE
            BEGIN
                set @tipoproceso=2;		
                if @pAGENCIA_ActualizarContrasena = 1 
                        begin
                            UPDATE AGENCIA SET 
                                agenciaPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pAGENCIA_Password)), 3, 32)
                            WHERE agenciaId = @pAGENCIA_Id 
                        end
                        
                --**BLOQUEADA_VIGENCIA**
                if getdate() > @pAGENCIA_ValidoHasta
                    BEGIN
                        if (select count(*) from AGENCIA where agenciaid=@pAGENCIA_Id and agenciaNombre like '**BLOQUEADA_VIGENCIA**%') = 0 
                            BEGIN                    
                                SET @pAGENCIA_Nombre = '**BLOQUEADA_VIGENCIA** ' + @pAGENCIA_Nombre;
                            END
                    END
                ELSE
                    BEGIN
                        if (select count(*) from AGENCIA where agenciaid=@pAGENCIA_Id and agenciaNombre like '**BLOQUEADA_VIGENCIA**%') > 0 
                            BEGIN
                                SET @AGENCIA_Nombre_antes = SUBSTRING(@pAGENCIA_Nombre, 23, len(@pAGENCIA_Nombre)); 
                                SET @pAGENCIA_Nombre = @AGENCIA_Nombre_antes
                            END
                    END
                

                UPDATE AGENCIA SET 
                agenciaIdExterno = @pAGENCIA_IdExterno, 
                agenciaNombre = @pAGENCIA_Nombre, 
                agenciaDireccion = @pAGENCIA_Direccion, 
                agenciaRUC = @pAGENCIA_RUC, 
                agenciaLogin = @pAGENCIA_Login,			
                agenciaEmail = @pAGENCIA_Email, 
                agenciaPerfilId = @pAGENCIA_PerfilId, 
                agenciaPromotorId = @pAGENCIA_PromotorId,
                agenciaComision = @pAGENCIA_Comision,
                agenciaValidoDesde = @pAGENCIA_ValidoDesde, 
                agenciaValidoHasta = @pAGENCIA_ValidoHasta, 
                agenciaComentarios = @pAGENCIA_Comentarios, 
                agenciaModificadoFecha = @FechaHoraActual,
                agenciaModificadoUsuarioId = @pAGENCIA_UsuarioId,
                agenciaActivo = @pAGENCIA_Activo,
                agenciaCredito = @pAGENCIA_Credito, 
                agenciaPaisId = @pAGENCIA_PaisId,
                agenciaTelefono = @pAGENCIA_Telefono,
                agenciaXcoord=@pAGENCIA_Xcoord,
                agenciaYcoord=@pAGENCIA_Ycoord,
                agenciaUbigeoId = @pAGENCIA_UbigeoId,
                agenciaObservacionCobranzas = @pAGENCIA_ObservacionCobranza
                WHERE agenciaId = @pAGENCIA_Id 
                IF @@ROWCOUNT > 0
                    BEGIN
                        set @resultado = 'ok'
                    END	
            END
        
	    
        select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
