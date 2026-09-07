-- Objeto: euroamer_admin_2008.AgenciaFactura_Obtener
-- Creado en BD: 2025-05-12 06:40:34
-- Modificado en BD: 2025-05-20 05:22:10
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAgenciafacturaId int (IN)
--   @pAgenciafacturaAgenciaId int (IN)
--   @pAgenciafacturaTipoDocumento int (IN)
--   @pAgenciafacturaSerie varchar (IN)
--   @pAgenciafacturaNumero int (IN)
--   @pAgenciafacturaEstado int (IN)
--   @pAgenciafacturaInicio date (IN)
--   @pAgenciafacturaFin date (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaFactura_Obtener]
    @pAgenciafacturaId int,
	@pAgenciafacturaAgenciaId int,
    @pAgenciafacturaTipoDocumento int,
    @pAgenciafacturaSerie varchar(3)='0',
    @pAgenciafacturaNumero int,
    @pAgenciafacturaEstado int,
    @pAgenciafacturaInicio Date = '',
    @pAgenciafacturaFin Date = ''
AS
BEGIN

	SET NOCOUNT ON;
	--exec AgenciaFactura_Obtener 0,0,'',0,0,'',''
	--exec AgenciaFactura_Obtener 0,0,'',0,1,'20250518','20250520'
	SELECT  agenciaNombre agenciaFacturaNombre,
euroamer_admin_2008.valorTipo_RecuperarNombre('DocumentoComision', agenciafacturaTipoDocumento) agenciaFacturaTipoDocumentoNombre,
agenciafacturaSerie,agenciafacturaNumero,agenciafacturaFechaEmision agenciaFacturaFechaEmision,
euroamer_admin_2008.valorTipo_RecuperarNombre('Moneda', agenciafacturaMonedaId) agenciafacturaMonedaNombre,
agenciafacturaTotal,agenciafacturaObservacion,agenciafacturaEstado,agenciafacturaMonedaId,agenciaFacturaAgenciaId,agenciafacturaTipoDocumento,
agenciaFacturaId
	FROM AGENCIA_FACTURA, AGENCIA
	where agenciafacturaAgenciaId = agenciaId
	and (@pAgenciafacturaId=0 or AgenciaFacturaId = @pAgenciafacturaId)
    and (@pAgenciafacturaAgenciaId = 0 or agenciafacturaAgenciaId = @pAgenciafacturaAgenciaId)
    and (@pAgenciafacturaTipoDocumento = 0 or agenciafacturaTipoDocumento = @pAgenciafacturaTipoDocumento)
    and (@pAgenciafacturaSerie = '0' or agenciafacturaSerie = @pAgenciafacturaSerie)
    and (@pAgenciafacturaNumero = 0 or agenciafacturaNumero = @pAgenciafacturaNumero)
    and (@pAgenciafacturaEstado = 0 or agenciafacturaEstado = @pAgenciafacturaEstado)
    and (@pAgenciafacturaInicio = '1900-01-01' OR CAST(agenciafacturaFechaEmision AS DATE) BETWEEN @pAgenciafacturaInicio AND @pAgenciafacturaFin)


END
