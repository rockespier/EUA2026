-- Objeto: euroamer_admin_2008.proc_ScriptIndexColumn
-- Creado en BD: 2020-04-19 13:16:11
-- Modificado en BD: 2020-04-19 13:16:11
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @Tabela varchar (IN)
--   @Coluna varchar (IN)

Create Proc proc_ScriptIndexColumn (@Tabela VARCHAR(4000), @Coluna VARCHAR(4000)) 
AS 
BEGIN     
     DECLARE @isql_key VARCHAR(4000), 
         @isql_incl VARCHAR(4000), 
         @tableid INT, 
         @indexid INT         
 DECLARE @tablename VARCHAR(4000), 
         @indexname VARCHAR(4000)         
 DECLARE @isunique INT, 
         @isclustered INT, 
         @indexfillfactor INT         
 DECLARE @srsql VARCHAR(MAX)        
 DECLARE @ScriptsRetorno TABLE 
         (Script VARCHAR(MAX))        
 DECLARE index_cursor CURSOR  
   FOR 
     SELECT tablename = OBJECT_NAME(i.[object_id]), 
            tableid       = i.[object_id], 
            indexid       = i.index_id, 
            indexname     = i.name, 
            isunique      = i.is_unique, 
            CASE I.type_desc 
                 WHEN 'CLUSTERED' THEN 1 
                 ELSE 0 
            END                     AS isclustered, 
            indexfillfactor = i.fill_factor                  
     FROM   sys.indexes             AS i 
            INNER JOIN SYSOBJECTS   AS O 
                 ON  I.[object_id] = O.ID 
            INNER JOIN sys.index_columns AS ic 
                 ON  (ic.column_id > 0 
                         AND (ic.key_ordinal > 0 
                                 OR ic.partition_ordinal = 0 
                                 OR ic.is_included_column != 0 
                             )) 
                 AND (   ic.index_id = CAST(i.index_id AS INT) 
                         AND ic.object_id = i.[object_id] 
                     ) 
            INNER JOIN sys.columns  AS sc 
                    ON  sc.object_id = ic.object_id 
                 AND sc.column_id = ic.column_id 
     WHERE  O.XTYPE = 'U' 
            AND i.typE = 2 /*Non clustered*/ 
            AND i.is_unique = 0 
            AND i.is_hypothetical = 0 
            AND UPPER(OBJECT_NAME(i.[object_id])) = UPPER(@Tabela) 
            AND UPPER(sc.name) = UPPER(@Coluna)       

 OPEN index_cursor  
 FETCH NEXT FROM index_cursor INTO @tablename,@tableid, @indexid,@indexname ,  
 @isunique ,@isclustered , @indexfillfactor       
 WHILE @@fetch_status <> -1 
 BEGIN 
     SELECT @isql_key = '', 
            @isql_incl = ''           
     SELECT @isql_key = CASE ic.is_included_column 
                             WHEN 0 THEN CASE ic.is_descending_key 
                                              WHEN 1 THEN @isql_key +COALESCE(sc.name, '') + 
                                                   ' DESC, ' 
                                              ELSE @isql_key + COALESCE(sc.name, '')  
                                                   + ' ASC, ' 
                                         END 
                             ELSE @isql_key 
                         END, 
            --include column  
            @isql_incl = CASE ic.is_included_column 
                              WHEN 1 THEN CASE ic.is_descending_key 
                                               WHEN 1 THEN @isql_incl + 
                                                    COALESCE(sc.name, '') + 
                                                    ', ' 
                                               ELSE @isql_incl + COALESCE(sc.name, '')  
                                                    + ', ' 
                                          END 
                              ELSE @isql_incl 
                         END 
     FROM   sysindexes i 
            INNER JOIN sys.index_columns AS ic 
                 ON  ( 
                         ic.column_id > 0 
                         AND ( 
                                 ic.key_ordinal > 0 
                                 OR ic.partition_ordinal = 0 
                                 OR ic.is_included_column != 0 
                             ) 
                     ) 
                 AND (ic.index_id = CAST(i.indid AS INT) AND ic.object_id = i.id) 
            INNER JOIN sys.columns AS sc 
                   ON  sc.object_id = ic.object_id 
                 AND sc.column_id = ic.column_id 
     WHERE  i.indid > 0 
            AND i.indid < 255 
            AND (i.status & 64) = 0 
            AND i.id = @tableid 
            AND i.indid = @indexid 
     ORDER BY 
            i.name, 
            CASE ic.is_included_column 
                 WHEN 1 THEN ic.index_column_id 
                 ELSE ic.key_ordinal 
            END           
     IF LEN(@isql_key) > 1 
         SET @isql_key = LEFT(@isql_key, LEN(@isql_key) -1)  

     IF LEN(@isql_incl) > 1 
         SET @isql_incl = LEFT(@isql_incl, LEN(@isql_incl) -1)            
     SET @srsql = 'CREATE ' + 'INDEX [' + @indexname + ']' + ' ON [' + @tablename 
         + '] '           
     SET @srsql = @srsql + '(' + @isql_key + ')'              
     IF (@isql_incl <> '') 
         SET @srsql = @srsql + ' INCLUDE(' + @isql_incl + ')'             
     IF (@indexfillfactor <> 0) 
          SET @srsql = @srsql + ' WITH ( FILLFACTOR = ' + CONVERT(VARCHAR(10), @indexfillfactor) 
             + ')'            
     FETCH NEXT FROM index_cursor INTO @tablename,@tableid,@indexid,@indexname,  
     @isunique ,@isclustered , @indexfillfactor           
     INSERT INTO @ScriptsRetorno 
     VALUES 
       (@srsql) 
 END  
 CLOSE index_cursor  
 DEALLOCATE index_cursor   
 SELECT * 
 FROM   @ScriptsRetorno 
RETURN @@ERROR 
END
