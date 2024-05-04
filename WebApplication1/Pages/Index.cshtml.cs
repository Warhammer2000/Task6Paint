
using DrawingHubs.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace DrawingHubs.Pages
{
	public class IndexModel : PageModel
	{

		private readonly BoardManager _boardManager;

		public IndexModel(BoardManager boardManager)
		{
			_boardManager = boardManager;
		}
		public List<Board> Boards => _boardManager.Boards.ToList();

		public void OnGet()
		{
			
		}

		public IActionResult OnPost(string boardId)
		{
			_boardManager.AddBoard(boardId);
			return RedirectToPage();
		}
	}
}
