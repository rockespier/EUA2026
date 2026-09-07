-- Objeto: euroamer_admin_2008.usp_ExampleProc
-- Creado en BD: 2023-05-04 10:47:12
-- Modificado en BD: 2023-05-04 10:47:12
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)

  
-- Create a stored procedure that will cause an   
-- object resolution error.  
CREATE PROCEDURE usp_ExampleProc  
AS  
    SELECT * FROM NonexistentTable;
