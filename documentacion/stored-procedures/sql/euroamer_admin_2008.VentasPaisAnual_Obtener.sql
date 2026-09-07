-- Objeto: euroamer_admin_2008.VentasPaisAnual_Obtener
-- Creado en BD: 2018-02-20 15:20:51
-- Modificado en BD: 2026-02-26 08:36:45
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAnio int (IN)
--   @pTipoReporte int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasPaisAnual_Obtener]
(
	@pAnio INT = 0,
	@pTipoReporte INT = 1
)
AS
BEGIN
	--VentasPaisAnual_Obtener 2025,1
	--VentasPaisAnual_Obtener 2026,1
	SET NOCOUNT ON;

	-- Validar parámetros de entrada
	IF @pAnio <= 0 OR @pTipoReporte NOT IN (1, 2)
	BEGIN
		RAISERROR('Parámetros inválidos: @pAnio debe ser mayor a 0 y @pTipoReporte debe ser 1 o 2', 16, 1);
		RETURN;
	END

	-- Usar SET BASED approach en lugar de cursores
	-- @pTipoReporte = 1: Importe (SUM)
	-- @pTipoReporte = 2: Cantidad (COUNT)
	SELECT
		p.paisnombre AS nombre,
		'' AS mes,
		CASE
			WHEN @pTipoReporte = 1 THEN SUM(v.ventaProductoImporte)
			ELSE COUNT(v.ventaid)
		END AS importe,
		0 AS agenciaId,
		0 AS situacionId,
		@pAnio AS anio,
		a.agenciapaisid AS paisId,
		@pTipoReporte AS tipoReporte
	FROM venta v
	INNER JOIN agencia a ON v.ventausuarioagenciaid = a.agenciaid
	INNER JOIN pais p ON a.agenciapaisid = p.paisid
	WHERE v.ventaEstadoId = 'V'
	  AND YEAR(v.ventaCreadoFecha) = @pAnio
	GROUP BY p.paisnombre, a.agenciapaisid
	ORDER BY
		CASE
			WHEN @pTipoReporte = 1 THEN SUM(v.ventaProductoImporte)
			ELSE COUNT(v.ventaid)
		END DESC;

END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
