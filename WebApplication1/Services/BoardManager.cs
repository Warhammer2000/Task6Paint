namespace DrawingHubs.Services
{
	public  class BoardManager
	{
		private readonly List<Board> _boards = new List<Board>();

		public IReadOnlyList<Board> Boards => _boards.AsReadOnly();

		public void AddBoard(string boardId)
		{
			if (_boards.All(b => b.BoardId != boardId))
			{
				_boards.Add(new Board { BoardId = boardId });
			}
		}

		public Board GetBoard(string boardId)
		{
			return _boards.FirstOrDefault(b => b.BoardId == boardId);
		}
	}
}
