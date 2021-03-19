using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private string ConnectionString = "Data Source=(localdb)\\ProjectsV13;Initial Catalog=MachonNoamDB;Integrated Security=True;";
        private SqlConnection _conn;
        private SqlDataAdapter _adapter;

        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<Models.User> Get()
        {
            _conn = new SqlConnection(ConnectionString);
            _conn.Open();
            var query = "SELECT * FROM USERS";
            DataTable dt = new DataTable();
            _adapter = new SqlDataAdapter
            {
                SelectCommand = new SqlCommand(query, _conn)
            };
            _adapter.Fill(dt);
            List<Models.User> users = new List<Models.User>(dt.Rows.Count);
            if(dt.Rows.Count> 0)
            {
                foreach (DataRow userrow in dt.Rows)
                {
                    Console.WriteLine(userrow);
                }
            }
    
       
            return users;

            
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ValuesController>
        [HttpPost]
        public int Post([FromBody] Models.User newUser)
        {
            try
            {
                Regex emailRgx = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
                Regex passRgx = new Regex(@"/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/");
                string email = newUser.Email;
                string password = newUser.Password;
                string passwordConfirm = newUser.PasswordConfirm;

                bool fieldsNotEmpty = email.Length > 0 && password.Length > 0 && passwordConfirm.Length > 0;
                bool validEmail = emailRgx.IsMatch(email);
                bool validPassword = passRgx.IsMatch(password);
                bool passwordMatch = password == passwordConfirm;
                if(fieldsNotEmpty && validEmail && validPassword&& passwordMatch)
                {
                    _conn = new SqlConnection(ConnectionString);
                    var query = "INSERT INTO USERS (Email, Password) Values(@Email, @Password)";
                    SqlCommand insertCommand = new SqlCommand(query, _conn);
                    //Should protected us from sql inj.
                    insertCommand.Parameters.AddWithValue("@Email", email);
                    insertCommand.Parameters.AddWithValue("@Password", password);
                    _conn.Open();
                    int result = insertCommand.ExecuteNonQuery();
                    return result;
                }
                else
                {
                    return 0;
                }

       
            }
            catch (Exception err){
                Console.WriteLine(err);
                return 409;
            }
      

     
           
      


        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
