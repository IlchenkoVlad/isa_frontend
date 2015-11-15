using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Class
{
    public class Parser
    {
        string table = String.Empty, index = String.Empty, field = String.Empty, query = String.Empty, query_parametr = String.Empty;
        DataTable data_rezult = new DataTable();
        public Parser()
        {
            
        }
        public void a()
        {
            
                        }
        public DataTable process_request(string path, string query, string field)
        {
            query = HttpUtility.UrlDecode(query).Replace("\"", "'");
            Regex path_reg = new Regex(@"([A-Za-z_]+)(?:(?=\()||$)(?:(?:\(([1-9+])\))|(?:/||$))(?:/||$)([a-zA-Z]+||$)"); //выборка таблицы и параметров к ней 
            Regex query_reg = new Regex(@"(?:[?]|)([\$a-zA-Z]+|)(?:=|)([\*1-9a-zA-Zа-яА-Я, ']+||$)"); //выборка таблицы и параметров к ней 
            try
            {
                table = path_reg.Matches(path + query)[0].Groups[1].ToString(); //table 
                index = path_reg.Matches(path + query)[0].Groups[2].ToString(); //index 
                var s = query_reg.Matches(path + query);
                this.query = query_reg.Matches(path + query)[1].Groups[1].ToString(); //query 
                query_parametr = query_reg.Matches(path + query)[1].Groups[2].ToString(); //query_parametr 
            }

            catch
            {
                return null;
            }

            this.field = field;    //field

            if (table != String.Empty)
            {
                 return process_table();
            }
            else
            {
                return null;
            }
        }

        public DataTable process_table()    //processing the request to output of tables
        {
            if (query != String.Empty)
            {
                return process_query();
            }
            else if (index != String.Empty)
            {
                return process_index();
            }
            else if (field != String.Empty)
            {
                return process_field();
            }
            else
            {
                data_rezult = null;
                string SQL_request = "SELECT * FROM \"" + table + "\"";
                data_rezult =  Connect.command_go(SQL_request);
                if (data_rezult != null)
                {
                    data_rezult.TableName = table;
                }
            }
            return data_rezult;
        }
        public DataTable process_index()    //processing the request to output of tables
        {
            if (field != String.Empty)
            {
                return process_field();
            }
            else if(query != String.Empty)
            {
                return process_query();
            }
            else
            {
                data_rezult = null;
                string SQL_request = "SELECT * FROM \"" + table + "\"  WHERE id = " + index;
                data_rezult = Connect.command_go(SQL_request);
                if (data_rezult != null)
                {
                    data_rezult.TableName = table;
                }
            }
            return data_rezult;
        }
        public DataTable process_field()
        {
            if (query != String.Empty)
            {
                process_query();
            }
            else
            {
                data_rezult = null;
                string SQL_request = "SELECT " + field + " FROM \"" + table + "\"";
                data_rezult = Connect.command_go(SQL_request);
                if (data_rezult != null)
                {
                    data_rezult.TableName = table;
                }

            }
            return data_rezult;
        }
        public DataTable process_query()
        {
            if (query_parametr != String.Empty)
            {
                data_rezult = null;
                string SQL_request;
                switch (query)
                {
                    /*case "$search":
                        SQL_request = "SELECT * FROM \"" + table + "\" WHERE " + query_parametr;
                        break;*/
                    case "$filter":
                        query_parametr = query_parametr.Replace("and", "&").Replace("or", "|").Replace("lt", "<").Replace("gt", ">").Replace("eq","=").Replace("ne","!=").Replace("ge", ">=").Replace("le", "<=").Replace("ne", "<>");
                        SQL_request = "SELECT " + (field == String.Empty ? "*" : field) + " FROM \"" + table + "\" WHERE "+ query_parametr;
                        break;
                    /*case "$count":
                        //SQL_request = "SELECT top " + query_parametr + " * FROM \"" + table + "\"";
                        break;
                    case "$orderby":
                        //SQL_request = "SELECT top " + query_parametr + " * FROM \"" + table + "\"";
                        break;*/
                    case "$skip":
                        SQL_request = "SELECT " + (field == String.Empty ? "*" : field) + " FROM  ( select *, ROW_NUMBER() over (ORDER BY id) AS ROW_NUM from \"" + table+ "\") x where ROW_NUM>" + query_parametr;
                        break;
                    case "$top":
                        SQL_request = "SELECT top " + query_parametr + " * FROM \"" + table + "\"";
                        break;
                    case "$select":
                        SQL_request = "SELECT " + query_parametr + " FROM \"" + table + "\"";
                        break;
                    default:
                        if (index != String.Empty)
                        {
                            SQL_request = query + " " + query_parametr + " FROM \"" + table + "\" WHERE id = " + index;
                        }
                        else
                        {
                            SQL_request = query + " " + query_parametr + " FROM \"" + table + "\"";
                        }
                        break;
                }
                
                
                data_rezult = Connect.command_go(SQL_request);
                if (data_rezult != null)
                {
                    data_rezult.TableName = table;
                }
            }
            return data_rezult;
        }

    }
}