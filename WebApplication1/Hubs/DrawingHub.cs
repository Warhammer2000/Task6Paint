using DrawingHubs.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace DrawingHubs.Hubs
{
	public class DrawingHub : Hub
	{
		
		private readonly ILogger<DrawingHub> _logger;
		private readonly BoardManager _boardManager;

		public DrawingHub(ILogger<DrawingHub> logger, BoardManager boardManager)
		{
			_logger = logger;
			_boardManager = boardManager;
		}
		public async Task JoinBoard(string boardId)
		{
			_logger.LogWarning($"User {Context.ConnectionId} is joining board {boardId}");
			_logger.LogInformation($"Attempting to join board: {boardId}");
			await Groups.AddToGroupAsync(Context.ConnectionId, boardId);
			var board = _boardManager.GetBoard(boardId);
			if (board != null)
			{
				await Clients.Caller.SendAsync("LoadBoard", board.Actions);
				_logger.LogInformation($"Board found and actions sent to client: {boardId}");
			}
			else
			{
				_logger.LogWarning($"No board found with ID: {boardId}");
			}
		}
		public async Task CreateBoard(string boardId)
		{
			_logger.LogInformation($"Attempting to create board: {boardId}");

			
			var existingBoard = _boardManager.GetBoard(boardId);
			if (existingBoard != null)
			{
				_logger.LogWarning($"Board creation failed: Board with ID {boardId} already exists.");
				await Clients.Caller.SendAsync("BoardCreationFailed", "Board already exists.");
				return;
			}

		
			_boardManager.AddBoard(boardId);
			_logger.LogInformation($"New board created with ID: {boardId}");

			
			await Clients.Caller.SendAsync("BoardCreated", boardId);

		
			await JoinBoard(boardId);
		}

		
		public async Task SendDrawAction(string boardId, string data)
		{
			await Clients.Group(boardId).SendAsync("ReceiveDrawAction", data);  // Отправка действий текущего пользователя всей группе
		}	
	}
}
