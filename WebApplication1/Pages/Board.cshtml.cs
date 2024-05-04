using DrawingHubs.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DrawingHubs.Pages
{
    public class BoardModel : PageModel
    {
		public  IEnumerable<Board> Boards { get; set; }
		public  string BoardID { get; set; }

		public void GetBoardID()
		{
			foreach (var board in Boards)
			{
				BoardID = board.ToString();
			}
		}
		public void OnGet()
	   {
		 
		}
	}
}
