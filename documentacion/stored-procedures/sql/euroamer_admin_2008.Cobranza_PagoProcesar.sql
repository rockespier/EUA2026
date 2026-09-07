-- Objeto: euroamer_admin_2008.Cobranza_PagoProcesar
-- Creado en BD: 2025-03-17 02:30:07
-- Modificado en BD: 2025-03-19 11:28:45
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pcobranzapagoId int (IN)
--   @pcobranzapagoCobranzaId int (IN)
--   @pcobranzapagoMedioId int (IN)
--   @pcobranzapagoFecha date (IN)
--   @pcobranzapagoImporte decimal (IN)
--   @pcobranzapagoCreadoUsuario int (IN)
--   @pcobranzapagoEvidenciaRuta varchar (IN)
--   @pcobranzapagoObservacion varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_PagoProcesar]
	@pcobranzapagoId INT,
	@pcobranzapagoCobranzaId INT,
    @pcobranzapagoMedioId INT,
    @pcobranzapagoFecha date,
    @pcobranzapagoImporte decimal(14,2),
    @pcobranzapagoCreadoUsuario int,
    @pcobranzapagoEvidenciaRuta varchar(800),
	@pcobranzapagoObservacion varchar(800)
AS BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	BEGIN TRY
		BEGIN TRANSACTION

	IF @pcobranzapagoId = 0
		BEGIN
		    set @tipoproceso=1;
			INSERT INTO [euroamer_admin_2008].[COBRANZA_PAGO](
                    cobranzapagoCobranzaId,
                    cobranzapagoMedioId,
                    cobranzapagoFecha,
                    cobranzapagoImporte,
                    cobranzapagoCreadoUsuario,
                    cobranzapagoCreadoFecha,
                    cobranzapagoEvidenciaRuta,
					cobranzapagoActivo,
					cobranzapagoEstadoId,
					cobranzapagoObservacion
				    )
			VALUES (
			        @pcobranzapagoCobranzaId,
                    @pcobranzapagoMedioId,
                    @pcobranzapagoFecha,
                    @pcobranzapagoImporte,
                    @pcobranzapagoCreadoUsuario,
			        @FechaHoraActual,
                    @pcobranzapagoEvidenciaRuta,
					1,1, @pcobranzapagoObservacion
				    )
			IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok';
				END
		END
	ELSE
	    begin
	        set @tipoproceso=2;
            update [euroamer_admin_2008].[COBRANZA_PAGO] set cobranzapagoMedioId = @pcobranzapagoMedioId,
                                     cobranzapagoFecha = @pcobranzapagoFecha,
                                     cobranzapagoImporte = @pcobranzapagoImporte,
                                     cobranzapagoEvidenciaRuta = @pcobranzapagoEvidenciaRuta,
									 cobranzapagoObservacion = @pcobranzapagoObservacion
            where [cobranzapagoId]=@pcobranzapagoId
	        IF @@ROWCOUNT > 0
                BEGIN
                    set @resultado = 'ok'
                END
        end

		COMMIT TRANSACTION
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
	END TRY
	BEGIN CATCH

		SELECT
        ERROR_NUMBER() AS errorCodigo
        ,ERROR_MESSAGE() AS errorDescripcion;

		ROLLBACK TRANSACTION

	END CATCH
END
