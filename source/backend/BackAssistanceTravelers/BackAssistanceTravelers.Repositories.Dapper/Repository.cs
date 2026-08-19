using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper
{
	public class Repository
	{
		protected string _connectionString;
		public Repository(string connectionString)
		{
			SqlMapperExtensions.TableNameMapper = (type) => { return $"{type.Name}"; };
			_connectionString = connectionString;
		}
	}
}
