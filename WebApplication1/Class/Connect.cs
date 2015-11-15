using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace WebApplication1.Class
{
    public class Connect
    {
        static string _server = @"DIMKADEA\SQLEXPRESS";
        static string _db = "Materialnew";
        static string _table = "user";
        static SqlConnection con;
        public static bool connect_status = false;

        public static void _connect(string server, string db = "")  //формирование строки подключение к БД
        {
            try
            {
                con = new SqlConnection(@"Data Source = " + _server + @"; Initial Catalog=" + _db + "; Integrated Security=True");
                con.Open();
                connect_status = true;
            }
            catch (Exception)
            {
                connect_status = false;
            }
        }
        public static void Disconnect()
        {
            con.Close();
        }

        [HttpGet]
        public List<string> GetServers() //получение всех серверов доступных компьютеру
        {
            SqlDataSourceEnumerator instance = SqlDataSourceEnumerator.Instance;
            DataTable dt = instance.GetDataSources();
            List<string> servers = new List<string>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                servers.Add(dt.Rows[i][0].ToString());
            }
            return servers;

        }

        [HttpGet]
        public IEnumerable<string> GetDB(string server) //получение всех БД с сервера server
        {

            _connect(server);
            string result = string.Empty;
            string SQL_Command_Get_Tables = "EXEC sp_Databases";
            SqlCommand comm = new SqlCommand(SQL_Command_Get_Tables, con);
            SqlDataReader reader = comm.ExecuteReader();
            List<string> table = new List<string>();
            while (reader.Read())
            {
                table.Add(reader.GetString(0));
            }

            con.Close();
            reader.Close();
            return table;
        }

        [HttpGet]
        public IEnumerable<string> GetTables(string server, string db) //получение всех таблиц с базы данных db
        {

            _connect(_server, _db);
            string result = string.Empty;
            string SQL_Command_Get_Tables = "SELECT TABLE_NAME FROM information_schema.TABLES";
            SqlCommand comm = new SqlCommand(SQL_Command_Get_Tables, con);
            SqlDataReader reader = comm.ExecuteReader();
            List<string> table = new List<string>();
            while (reader.Read())
            {
                table.Add(reader.GetString(0));
            }

            con.Close();
            reader.Close();
            return table;
        }

        [HttpGet]
        public List<string> Get_info(string server, string table) //получение всех полей, которые есть в таблице table
        {
            _connect(_server);
            string SQL_Command_Get_Fields = "SELECT " +
              "COLUMN_NAME" +
            " FROM   " +
              "INFORMATION_SCHEMA.COLUMNS " +
            "WHERE   " +
              "TABLE_NAME = '" + _table + "' " +
            "ORDER BY " +
              "ORDINAL_POSITION ASC; ";

            SqlCommand comm = new SqlCommand(SQL_Command_Get_Fields, con);
            SqlDataReader reader = comm.ExecuteReader();
            List<string> colums_name = new List<string>();
            while (reader.Read())
            {
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    colums_name.Add(reader.GetValue(i).ToString());
                }
            }
            con.Close();
            con.Dispose();
            return colums_name;
        }

        public static DataTable command_go(string command)
        {
            _connect(_server, _db);
            SqlCommand comm = new SqlCommand(command, con);
            SqlDataReader reader;
            try
            {
                reader  = comm.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                return dt;
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}