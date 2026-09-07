-- Objeto: euroamer_admin_2008.AgenciaFactura_Procesar
-- Creado en BD: 2025-05-12 03:56:51
-- Modificado en BD: 2025-05-20 07:36:38
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAgenciaFacturaId int (IN)
--   @pAgenciafacturaAgenciaId int (IN)
--   @pAgenciafacturaTipoDocumento int (IN)
--   @pAgenciafacturaSerie varchar (IN)
--   @pAgenciafacturaNumero int (IN)
--   @pAgenciafacturaFechaEmision date (IN)
--   @pAgenciafacturaMonedaId int (IN)
--   @pAgenciafacturaTotal decimal (IN)
--   @pAgenciafacturaObservacion varchar (IN)
--   @pAgenciafacturaCobranzaId int (IN)
--   @pAgenciafacturaEstado int (IN)

CREATE PROCEDURE AgenciaFactura_Procesar
@pAgenciaFacturaId int,
@pAgenciafacturaAgenciaId int,
@pAgenciafacturaTipoDocumento int,
@pAgenciafacturaSerie varchar(3),
@pAgenciafacturaNumero int,
@pAgenciafacturaFechaEmision date,
@pAgenciafacturaMonedaId int,
@pAgenciafacturaTotal decimal(8,2),
@pAgenciafacturaObservacion varchar(200),
@pAgenciafacturaCobranzaId int,
@pAgenciafacturaEstado int
AS
BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0, @contador int = 0 ;
	declare @resultado varchar(300) = '';


    if @pAgenciaFacturaId = 0
    begin
        SET @tipoproceso = 1

        INSERT INTO AGENCIA_FACTURA(
            agenciafacturaAgenciaId,
            agenciafacturaTipoDocumento,
               agenciafacturaSerie,
               agenciafacturaNumero,
               agenciafacturaFechaEmision,
               agenciafacturaMonedaId,
               agenciafacturaTotal,
               agenciafacturaObservacion,
               agenciafacturaCobranzaId,
               agenciafacturaEstado
        ) values(@pAgenciafacturaAgenciaId,
                @pAgenciafacturaTipoDocumento,
                @pAgenciafacturaSerie,
                @pAgenciafacturaNumero,
                @pAgenciafacturaFechaEmision,
                @pAgenciafacturaMonedaId,
                @pAgenciafacturaTotal,
                @pAgenciafacturaObservacion,
                @pAgenciafacturaCobranzaId,1)

                    IF @@ROWCOUNT > 0
					BEGIN
						set @resultado = 'ok'
					END


    end
    ELSE
        begin
            SET @tipoproceso = 2

            UPDATE AGENCIA_FACTURA SET
            agenciafacturaFechaEmision = @pAgenciafacturaFechaEmision,
            agenciafacturaMonedaId = @pAgenciafacturaMonedaId,
            agenciafacturaTotal = @pAgenciafacturaTotal,
            agenciafacturaObservacion = @pAgenciafacturaObservacion,
            agenciafacturaCobranzaId = @pAgenciafacturaCobranzaId,
            agenciafacturaEstado = @pAgenciafacturaEstado,
            agenciafacturaSerie = @pAgenciafacturaSerie,
            agenciafacturaNumero = @pAgenciafacturaNumero
            where agenciaFacturaId  = @pAgenciaFacturaId


            IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok'
				END

        end

        select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
