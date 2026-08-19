using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class Helpers
    {
        public string TraerFechaFormatoServidorBD(string pFechaVaWeb)
        {
            var ftd_Fecha = DateTime.ParseExact(pFechaVaWeb, "dd/MM/yyyy", null);
            string str_formato = "{0:yyyyMMdd}";
            return string.Format(str_formato, ftd_Fecha);
        }

        public string TraerFechaFormatoServidorBD(DateTime fdt_pFechaValidaServidorWeb)
        {
            string str_formato = "{0:yyyyMMdd}";
            return string.Format(str_formato, fdt_pFechaValidaServidorWeb);
        }
        public bool ChecarExtensionExcelyXml(string extension)
        {
            switch (extension.ToLower())
            {
                case ".xlsx":
                case ".xls":
                case ".xml":
                    return true;
                default:
                    return false;
            }
        }

       /* public int buscaColumnaCabeceraN(string strNombre, Excel.Workbook xlworkbook1, int strSheetNumber, int strFila)
        {
            int encontro = 0;
            int i = 1, indiceColumna = 0;
            Excel.Worksheet xlWorkSheet = (Excel.Worksheet)xlworkbook1.Worksheets[strSheetNumber];

            while (encontro == 0)
            {
                if (xlWorkSheet.Cells[strFila, i] != null)
                {
                    string strValidador = xlWorkSheet.Cells[strFila, i].Value.ToString().Trim().ToUpper();
                    if (strValidador == strNombre.Trim().ToUpper())
                    {
                        indiceColumna = i;
                        encontro = 1;
                    }

                    if (i > 120)
                    {
                        throw new Exception("Error: no encontro cabecera");
                    }
                }

                i++;
            }

            xlWorkSheet = null;

            return indiceColumna;
        }*/

    }
}
