-- Objeto: euroamer_admin_2008.Producto_Procesar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-12-24 06:49:06
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pPRODUCTO_ReferenciaId varchar (IN)
--   @pPRODUCTO_Nombre varchar (IN)
--   @pPRODUCTO_Servicio text (IN)
--   @pPRODUCTO_URL text (IN)
--   @pPRODUCTO_ImporteTarifaFija decimal (IN)
--   @pPRODUCTO_ImporteDiaAdicional decimal (IN)
--   @pPRODUCTO_EdadMinima int (IN)
--   @pPRODUCTO_EdadMaxima int (IN)
--   @pPRODUCTO_NumeroDias int (IN)
--   @pPRODUCTO_Usuario int (IN)
--   @pPRODUCTO_Activo int (IN)
--   @pPRODUCTO_Orden int (IN)
--   @pPRODUCTO_PaisId int (IN)
--   @pPRODUCTO_ActivoWeb int (IN)
--   @pPRODUCTO_GrupalActivo int (IN)
--   @pPRODUCTO_GrupalPorcentaje decimal (IN)
--   @pPRODUCTO_PromocionActivo int (IN)
--   @pPRODUCTO_ImporteCero int (IN)
--   @pPRODUCTO_ATVCodigo varchar (IN)
--   @pPRODUCTO_Marca int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Producto_Procesar]
    @pPRODUCTO_Id INT = 0,
    @pPRODUCTO_ReferenciaId VARCHAR(10) = '',
    @pPRODUCTO_Nombre VARCHAR(255),
    @pPRODUCTO_Servicio TEXT = '',
    @pPRODUCTO_URL TEXT = '',
    @pPRODUCTO_ImporteTarifaFija DECIMAL(18,4),
    @pPRODUCTO_ImporteDiaAdicional DECIMAL(18,4),
    @pPRODUCTO_EdadMinima INT,
    @pPRODUCTO_EdadMaxima INT,
    @pPRODUCTO_NumeroDias INT,
    @pPRODUCTO_Usuario INT,
    @pPRODUCTO_Activo INT,
    @pPRODUCTO_Orden INT,
    @pPRODUCTO_PaisId INT,
    @pPRODUCTO_ActivoWeb INT,
    @pPRODUCTO_GrupalActivo INT,
    @pPRODUCTO_GrupalPorcentaje DECIMAL(18,4),
    @pPRODUCTO_PromocionActivo INT,
	@pPRODUCTO_ImporteCero INT,
	@pPRODUCTO_ATVCodigo VARCHAR(20),
	@pPRODUCTO_Marca INT
AS
BEGIN
     
    SET NOCOUNT ON;
    declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
    declare @pPRODUCTO_EdadMaximaOLD INT

    IF @pPRODUCTO_Id = 0
        BEGIN
            set @tipoproceso=1;

            INSERT INTO PRODUCTO (
                productoReferenciaId,
                productoNombre,
                productoServicio,
                productoURL,
                productoImporteTarifaFija,
                productoImporteDiaAdicional,
                productoEdadMinima,
                productoEdadMaxima,
                productoNumeroDias,
                productoCreadoFecha,
                productoCreadoUsuarioId,
                productoModificadoFecha,
                productoModificadoUsuarioId,
                productoActivo,
                productoOrdenListado,
                productoPaisId,
                productoActivoWeb, 
                productoGrupalActivo,
                productoGrupalPorcentaje,
                productoPromocionActivo,
				productoImporteCero,
                productoATVCodigo,
				productoMarca)
            VALUES (
                @pPRODUCTO_ReferenciaId,
                @pPRODUCTO_Nombre, 
                @pPRODUCTO_Servicio,
                @pPRODUCTO_URL,
                @pPRODUCTO_ImporteTarifaFija, 
                @pPRODUCTO_ImporteDiaAdicional,
                @pPRODUCTO_EdadMinima,
                @pPRODUCTO_EdadMaxima,
                @pPRODUCTO_NumeroDias,
                GETDATE(),
                @pPRODUCTO_Usuario,
                GETDATE(),
                @pPRODUCTO_Usuario,
                1,
                @pPRODUCTO_Orden,
                @pPRODUCTO_PaisId,
                @pPRODUCTO_ActivoWeb,
                @pPRODUCTO_GrupalActivo,
                @pPRODUCTO_GrupalPorcentaje,
                @pPRODUCTO_PromocionActivo,
				@pPRODUCTO_ImporteCero,
				@pPRODUCTO_ATVCodigo,
				@pPRODUCTO_Marca)
				
				select @pPRODUCTO_Id = SCOPE_IDENTITY()
            set @resultado = 'ok';
        END
    ELSE
        BEGIN

            set @pPRODUCTO_EdadMaximaOLD = (select productoEdadMaxima from PRODUCTO where productoId = @pPRODUCTO_Id)
set @tipoproceso=2;
            UPDATE PRODUCTO SET
                productoReferenciaId = @pPRODUCTO_ReferenciaId, 
                productoNombre = @pPRODUCTO_Nombre,
                productoServicio =  @pPRODUCTO_Servicio,            
                productoURL = @pPRODUCTO_URL,
                productoImporteTarifaFija = @pPRODUCTO_ImporteTarifaFija,
                productoImporteDiaAdicional = @pPRODUCTO_ImporteDiaAdicional,
                productoEdadMinima = @pPRODUCTO_EdadMinima,
                productoEdadMaxima = @pPRODUCTO_EdadMaxima,
                productoNumeroDias = @pPRODUCTO_NumeroDias,
                productoModificadoFecha = GETDATE(),
                productoModificadoUsuarioId = @pPRODUCTO_Usuario,
                productoActivo = @pPRODUCTO_Activo,
                productoOrdenListado = @pPRODUCTO_Orden,
                productoPaisId = @pPRODUCTO_PaisId,
                productoActivoWeb = @pPRODUCTO_ActivoWeb,
                productoGrupalActivo = @pPRODUCTO_GrupalActivo,
                productoGrupalPorcentaje = @pPRODUCTO_GrupalPorcentaje,
                productoPromocionActivo = @pPRODUCTO_PromocionActivo,
				productoImporteCero = @pPRODUCTO_ImporteCero,
				productoATVCodigo = @pPRODUCTO_ATVCodigo,
				productoMarca = @pPRODUCTO_Marca 
            WHERE productoId = @pPRODUCTO_Id

            If @pPRODUCTO_EdadMaxima <> @pPRODUCTO_EdadMaximaOLD
                begin
                    insert into LogEventos(Tipo,FechaHora,UsuarioId,Descripcion) values ('U',getdate(),@pPRODUCTO_Usuario,'Actualizaron la edad maxima del producto '+ @pPRODUCTO_Nombre +'. De ' + convert(varchar,@pPRODUCTO_EdadMaximaOLD)  + ' a ' + convert(varchar,@pPRODUCTO_EdadMaxima) )
                end
                set @resultado = 'ok';
        END
        
        --select @pPRODUCTO_Id
     select @tipoproceso as errorCodigo, @resultado as errorDescripcion   
END;
