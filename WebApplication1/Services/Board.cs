namespace DrawingHubs.Services
{
	public class Board
	{
		public string BoardId { get; set; }
		public List<DrawAction> Actions { get; set; } = new List<DrawAction>();
	}
	public class DrawAction
	{
		public int X { get; set; }
		public int Y { get; set; }
		public string Color { get; set; }
		public int LineWidth { get; set; }
	}
}
