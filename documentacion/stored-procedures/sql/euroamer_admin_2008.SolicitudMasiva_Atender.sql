-- Objeto: euroamer_admin_2008.SolicitudMasiva_Atender
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-11-04 00:30:38
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUDMasvia_Ids varchar (IN)
--   @pSOLICITUD_Usuario int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[SolicitudMasiva_Atender]
	@pSOLICITUDMasvia_Ids varchar(5000),
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	DECLARE @pSOLICITUD_Id INT;
	DECLARE @vVENTA_Id INT;
	DECLARE @pSOLICITUD_TipoId INT;

	DECLARE @vVENTA_FechaVigenciaInicio DATE
	DECLARE @vVENTA_FechaVigenciaFin DATE
	DECLARE @vVENTA_NumeroDias INT
	DECLARE @vVENTA_ProductoId INT
	DECLARE @vVENTA_GrupalId INT

	DECLARE @vVENTA_AgenciaId INT
	DECLARE @vVENTA_AgenciaUsuarioId INT

	DECLARE @vSOLICITUD_ClienteDocumentoTipoId CHAR(3)
	DECLARE @vSOLICITUD_ClienteDocumentoNumero VARCHAR(50)
	DECLARE @vSOLICITUD_ClienteNombres VARCHAR(50)
	DECLARE @vSOLICITUD_ClienteApellidos VARCHAR(80)
	DECLARE @vSOLICITUD_ClienteFechaNacimiento DATE
	DECLARE @vSOLICITUD_ClienteEdad INT
	DECLARE @vSOLICITUD_ClienteEmail VARCHAR(100)
	DECLARE @vSOLICITUD_ClienteDireccion VARCHAR(255)
	DECLARE @vSOLICITUD_ClienteTelefono VARCHAR(50)
	DECLARE @vSOLICITUD_ClienteDistrito VARCHAR(50)
	DECLARE @vSOLICITUD_ClienteCiudad VARCHAR(50)
	DECLARE @vSOLICITUD_ClientePais VARCHAR(50)
	
	DECLARE @vSOLICITUD_ContactoNombre VARCHAR(50)
	DECLARE @vSOLICITUD_ContactoDireccion VARCHAR(255)
	DECLARE @vSOLICITUD_ContactoDistrito VARCHAR(50)
	DECLARE @vSOLICITUD_ContactoPais VARCHAR(50)
	DECLARE @vSOLICITUD_ContactoTelefono VARCHAR(50)
	DECLARE @vSOLICITUD_ContactoEmail VARCHAR(100)

	DECLARE @vSOLICITUD_VentaImporte DECIMAL(18,4)

	DECLARE @vEdadAdicional INT
	DECLARE @vPromocionId INT
	DECLARE @vVENTACLIENTE_Edad INT
	DECLARE @pVENTA_ImporteVenta DECIMAL(18, 4)
	DECLARE @vPromocionDescuento DECIMAL(18, 4)

	Declare cur_Select Cursor for select item from euroamer_admin_2008.fnSplit2(@pSOLICITUDMasvia_Ids,',');
	Open cur_Select;
		Fetch next from cur_Select into @pSOLICITUD_Id
		While @@fetch_status = 0
			Begin

				select @vVENTA_Id =                  s.solicitudVentaId,
				       @pSOLICITUD_TipoId=           s.solicitudTipoId,
				       @pVENTA_ImporteVenta =        v.ventaImporteVenta,
				       @vPromocionId =               v.promocionId,
				       @vVENTACLIENTE_Edad =         v.ventaClienteEdad,
				       @vVENTA_FechaVigenciaInicio = s.solicitudVigenciaFechaInicial,
					   @vVENTA_FechaVigenciaFin=     s.solicitudVigenciaFechaFinal,
					   @vVENTA_GrupalId =            v.ventaGrupalId,
					   @vVENTA_AgenciaId =           s.solicitudAgenciaId,
					   @vVENTA_AgenciaUsuarioId =    s.solicitudAgenciaUsuarioId,
					   @vSOLICITUD_VentaImporte =    s.solicitudVentaImporte,
					   @vVENTA_ProductoId =          s.solicitudProductoId
				 FROM SOLICITUD s, VENTA v
				WHERE s.solicitudId      = @pSOLICITUD_Id
				  AND s.solicitudVentaId = v.ventaId

                    SET @vVENTA_NumeroDias = DATEDIFF(D, @vVENTA_FechaVigenciaInicio, @vVENTA_FechaVigenciaFin) + 1

				IF @pSOLICITUD_TipoId = 2 or @pSOLICITUD_TipoId = 11
				    BEGIN
				        --CALCULAR LA NUEVA TARIFA				      

						SET @pVENTA_ImporteVenta = (SELECT top 1 tarifaImporte
						                              FROM PRODUCTO_TARIFA
						                             WHERE tarifaProductoId = (SELECT ventaProductoId
						                                                         FROM VENTA
						                                                         WHERE ventaId = @vVENTA_Id)
						                              AND @vVENTA_NumeroDias BETWEEN tarifaNumeroDiasMinimo
						                              AND tarifaNumeroDiasMaximo)

				        if isnull(@vSOLICITUD_VentaImporte,0) > 0
                         begin
                            set @pVENTA_ImporteVenta = @vSOLICITUD_VentaImporte
                         end

                        --verificar incremento
                        set @vEdadAdicional = (select count(*) from PRODUCTO
                                                               where productoId = @vVENTA_ProductoId
                                                               and @vVENTACLIENTE_Edad between productoEdadMaxima
                                                               and productoImporteDiaAdicional)
                        if @vEdadAdicional > 0
                            begin
                                set @pVENTA_ImporteVenta = ROUND((@pVENTA_ImporteVenta * 1.5),0);
                            end

                        --verificar descuento
                        if @vPromocionId > 0
                            begin
                                 set @vPromocionDescuento = (select paisPromocionDescuento
                                                             from PAIS_PROMOCION where paisPromocionId = @vPromocionId)
                                 set @pVENTA_ImporteVenta = @pVENTA_ImporteVenta - ((@pVENTA_ImporteVenta * @vPromocionDescuento) / 100);
                                 set @pVENTA_ImporteVenta = ROUND(@pVENTA_ImporteVenta,0);
                            end

				    END

				IF @pSOLICITUD_TipoId = 1 --ANULACION
					BEGIN
						UPDATE	VENTA SET 
								ventaEstadoId = 'A', 
								ventaAnuladoFecha = @FechaHoraActual,
								ventaAnuladoUsuarioId = @pSOLICITUD_Usuario
						WHERE	ventaId = @vVENTA_Id
						
						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 2 --MODIFICACION DE VIGENCIA
					BEGIN

						IF ISNULL(@vVENTA_GrupalId,0) = 0 
                            BEGIN
                                UPDATE	VENTA SET
                                        ventaFechaVigenciaInicio = @vVENTA_FechaVigenciaInicio,
                                        ventaFechaVigenciaFin = @vVENTA_FechaVigenciaFin,
                                        ventaNumeroDias = @vVENTA_NumeroDias,
                                        ventaProductoImporte = @pVENTA_ImporteVenta,
                                        ventaImporteVenta = @pVENTA_ImporteVenta
                                WHERE	ventaId = @vVENTA_Id
                            END
						ELSE
                            BEGIN
                                UPDATE	VENTA SET
                                        ventaFechaVigenciaInicio = @vVENTA_FechaVigenciaInicio,
                                        ventaFechaVigenciaFin = @vVENTA_FechaVigenciaFin,
                                        ventaNumeroDias = @vVENTA_NumeroDias,
                                        ventaProductoImporte = @pVENTA_ImporteVenta,
                                        ventaImporteVenta = @pVENTA_ImporteVenta
                                WHERE	ventaId = @vVENTA_Id
                            END

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 3 --REACTIVACION
					BEGIN
						UPDATE	VENTA SET 
								ventaEstadoId = 'V', 
								ventaAnuladoFecha = NULL,
								ventaAnuladoUsuarioId = NULL
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 4 --TRASLADO
					BEGIN

						UPDATE	VENTA SET 
								ventaUsuarioAgenciaId = @vVENTA_AgenciaId, 
								ventaCreadoUsuarioId = @vVENTA_AgenciaUsuarioId
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 5 --MODIFICACION DE CLIENTE
					BEGIN				
					
					select
					@vSOLICITUD_ClienteDocumentoTipoId =solicitudClienteDocumentoTipoId,
					@vSOLICITUD_ClienteDocumentoNumero=solicitudClienteDocumentoNumero,
					@vSOLICITUD_ClienteNombres=solicitudClienteNombres,
					@vSOLICITUD_ClienteApellidos =solicitudClienteApellidos,
					@vSOLICITUD_ClienteFechaNacimiento=solicitudClienteFechaNacimiento,
					@vSOLICITUD_ClienteEdad=solicitudClienteEdad,
					@vSOLICITUD_ClienteEmail=solicitudClienteEmail,
					@vSOLICITUD_ClienteDireccion=solicitudClienteDireccion,
					@vSOLICITUD_ClienteTelefono=solicitudClienteTelefono,
					@vSOLICITUD_ClienteDistrito =solicitudClienteDistrito,
					@vSOLICITUD_ClienteCiudad=solicitudClienteCiudad,
					@vSOLICITUD_ClientePais=solicitudClientePais
					FROM SOLICITUD where solicitudId = @pSOLICITUD_Id


						UPDATE	VENTA SET 
								ventaClienteDocumentoTipoId = @vSOLICITUD_ClienteDocumentoTipoId, 
								ventaClienteDocumentoNumero = @vSOLICITUD_ClienteDocumentoNumero,
								ventaClienteNombres = @vSOLICITUD_ClienteNombres,
								ventaClienteApellidos = @vSOLICITUD_ClienteApellidos,
								ventaClienteFechaNacimiento = @vSOLICITUD_ClienteFechaNacimiento,
								ventaClienteEdad = @vSOLICITUD_ClienteEdad,
								ventaClienteEmail = @vSOLICITUD_ClienteEmail,
								ventaClienteDireccion = @vSOLICITUD_ClienteDireccion,
								ventaClienteTelefono = @vSOLICITUD_ClienteTelefono,
								ventaClienteDistrito = @vSOLICITUD_ClienteDistrito,
								ventaClienteCiudad = @vSOLICITUD_ClienteCiudad,
								ventaClientePais = @vSOLICITUD_ClientePais
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 6 --MODIFICACION DE CONTACTO
					BEGIN				
				
				 select @vSOLICITUD_ContactoNombre = solicitudContactoNombre,
						@vSOLICITUD_ContactoDireccion = solicitudContactoDireccion,
						 @vSOLICITUD_ContactoDistrito = solicitudContactoDistrito,
						 @vSOLICITUD_ContactoPais = solicitudContactoPais,
						 @vSOLICITUD_ContactoTelefono = solicitudContactoTelefono ,
						 @vSOLICITUD_ContactoEmail = solicitudContactoEmail
				 FROM SOLICITUD where solicitudId = @pSOLICITUD_Id

						UPDATE	VENTA SET 
								ventaContactoNombres = @vSOLICITUD_ContactoNombre,
								ventaContactoDireccion = @vSOLICITUD_ContactoDireccion,
								ventaContactoDistrito = @vSOLICITUD_ContactoDistrito,
								ventaContactoPais = @vSOLICITUD_ContactoPais,
								ventaContactoTelefono = @vSOLICITUD_ContactoTelefono,
								ventaContactoEmail = @vSOLICITUD_ContactoEmail
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 7 --MODIFICACION DE IMPORTE
					BEGIN

						UPDATE	VENTA SET 
								ventaProductoImporte = @vSOLICITUD_VentaImporte,
								ventaImporteVenta = @vSOLICITUD_VentaImporte
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END

				ELSE IF @pSOLICITUD_TipoId = 8 --CANCELACION TARJETA FREE
					BEGIN
						
						UPDATE	VENTA SET 
								ventaProductoImporte = @vSOLICITUD_VentaImporte,
								ventaImporteVenta = @vSOLICITUD_VentaImporte,
								ventaSituacionId = 'C'
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END
					END
				ELSE IF @pSOLICITUD_TipoId = 10 --CAMBIO DE PRODUCTO
					BEGIN

						UPDATE	VENTA SET
								ventaProductoImporte = @vSOLICITUD_VentaImporte,
								ventaImporteVenta = @vSOLICITUD_VentaImporte,
								ventaProductoId = @vVENTA_ProductoId,
								ventaFechaVigenciaInicio = @vVENTA_FechaVigenciaInicio,
								ventaFechaVigenciaFin = @vVENTA_FechaVigenciaFin,
								ventaNumeroDias = @vVENTA_NumeroDias
						WHERE	ventaId = @vVENTA_Id

						UPDATE	SOLICITUD SET
								solicitudEstadoId = 'A',
								solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
								solicitudAtendidoFecha = @FechaHoraActual
						WHERE	solicitudId = @pSOLICITUD_Id
						IF @@ROWCOUNT > 0
							BEGIN
								set @resultado = 'ok'
							END

                    END
				fetch next from cur_Select into @pSOLICITUD_Id;
		End

	Close cur_Select;
	Deallocate cur_Select;	
	
	select @tipoproceso as errorCodigo, @resultado as errorDescripcion
					
END;
