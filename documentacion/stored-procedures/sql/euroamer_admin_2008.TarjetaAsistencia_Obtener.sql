-- Objeto: euroamer_admin_2008.TarjetaAsistencia_Obtener
-- Creado en BD: 2019-10-06 10:31:28
-- Modificado en BD: 2024-09-11 09:23:20
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVENTA_Id varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[TarjetaAsistencia_Obtener]	
	@pVENTA_Id VARCHAR(10) = '0'
AS
BEGIN
--exec TarjetaAsistencia_Obtener 971229
	SET NOCOUNT ON

	declare @vVerificarVariable INT = 0

	set @vVerificarVariable = (SELECT ISNUMERIC(@pVENTA_Id))

	if @vVerificarVariable  = 1
	begin

	if ((select count(*) from venta where ventaCodigoExterno=@pVENTA_Id)>0)
		begin
				SELECT	ventaId,
					productoMarca, 
					(SELECT valorTipoNombre 
					FROM VALORES_TIPO 
					WHERE valorTipoColumnaTabla='MarcaProducto' 
					AND valorTipoId=productomarca) as ventaMarcaDes, 
					ventaProductoId, 
					productoNombre as ventaProductoNombre, 
					ventaUsuarioAgenciaId, 
					agenciaNombre,
					ventaClienteDocumentoTipoId, 			
					ventaClienteDocumentoNumero, 
					ventaClienteNombres +' ' + ventaClienteApellidos, 
					ventaClienteFechaNacimiento, 
					ventaClienteEdad, 
					ventaClienteEmail, 
					ventaClienteDireccion, 
					ventaClienteTelefono, 
					ventaClienteDistrito, 
					ventaClienteCiudad, 
					ventaClientePais,
					ventaFechaVigenciaInicio, 
					ventaFechaVigenciaFin, 
					ventaNumeroDias, 
					ventaDestino, 			
					ventaProductoImporte, 						
					ventaEstadoId,
					euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', ventaEstadoId) as ventaEstadoNombre,
					ventaSituacionId,
					euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', ventaSituacionId) as ventaSituacionNombre,
					ventaCreadoFecha 			
			FROM	VENTA v WITH(HOLDLOCK), PRODUCTO p, AGENCIA ag
			WHERE	v.ventaProductoId = p.productoId AND 
					ag.agenciaId = v.ventaUsuarioAgenciaId AND			
					(@pVENTA_Id = '0' OR ventaCodigoExterno = @pVENTA_Id)
		end
	else
		begin
			SELECT	ventaId,
					productoMarca, 
					(SELECT valorTipoNombre 
					FROM VALORES_TIPO 
					WHERE valorTipoColumnaTabla='MarcaProducto' 
					AND valorTipoId=productomarca) as ventaMarcaDes, 
					ventaProductoId, 
					productoNombre as ventaProductoNombre, 
					ventaUsuarioAgenciaId, 
					agenciaNombre,
					ventaClienteDocumentoTipoId, 			
					ventaClienteDocumentoNumero, 
					ventaClienteNombres +' ' + ventaClienteApellidos, 
					ventaClienteFechaNacimiento, 
					ventaClienteEdad, 
					ventaClienteEmail, 
					ventaClienteDireccion, 
					ventaClienteTelefono, 
					ventaClienteDistrito, 
					ventaClienteCiudad, 
					ventaClientePais,
					ventaFechaVigenciaInicio, 
					ventaFechaVigenciaFin, 
					ventaNumeroDias, 
					ventaDestino, 			
					ventaProductoImporte, 						
					ventaEstadoId,
					euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', ventaEstadoId) as ventaEstadoNombre,
					ventaSituacionId,
					euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', ventaSituacionId) as ventaSituacionNombre,
					ventaCreadoFecha 			
			FROM	VENTA v WITH(HOLDLOCK), PRODUCTO p, AGENCIA ag
			WHERE	v.ventaProductoId = p.productoId AND 
					ag.agenciaId = v.ventaUsuarioAgenciaId AND 
					(@pVENTA_Id = '0' OR ventaId = @pVENTA_Id)
	end
	END 
	ELSE 
	begin 
		
		SELECT	ventaId,
			productoMarca, 
			(SELECT valorTipoNombre 
			FROM VALORES_TIPO 
			WHERE valorTipoColumnaTabla='MarcaProducto' 
			AND valorTipoId=productomarca) as ventaMarcaDes, 
			ventaProductoId, 
			productoNombre as ventaProductoNombre, 
			ventaUsuarioAgenciaId, 
			agenciaNombre,
			ventaClienteDocumentoTipoId, 			
			ventaClienteDocumentoNumero, 
			ventaClienteNombres +' ' + ventaClienteApellidos, 
			ventaClienteFechaNacimiento, 
			ventaClienteEdad, 
			ventaClienteEmail, 
			ventaClienteDireccion, 
			ventaClienteTelefono, 
			ventaClienteDistrito, 
			ventaClienteCiudad, 
			ventaClientePais,
			ventaFechaVigenciaInicio, 
			ventaFechaVigenciaFin, 
			ventaNumeroDias, 
			ventaDestino, 			
			ventaProductoImporte, 						
			ventaEstadoId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', ventaEstadoId) as ventaEstadoNombre,
			ventaSituacionId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', ventaSituacionId) as ventaSituacionNombre,
			ventaCreadoFecha 			
	FROM	VENTA v WITH(HOLDLOCK), PRODUCTO p, AGENCIA ag
	WHERE	v.ventaProductoId = p.productoId AND 
	        ag.agenciaId = v.ventaUsuarioAgenciaId AND			
			(@pVENTA_Id = '0' OR ventaCodigoExterno = @pVENTA_Id)
	end
END
