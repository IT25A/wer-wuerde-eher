// Spielerfarben für Hot Seat und Online-Modus
export const PLAYER_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

// Wählt zufällig eine der am seltensten vergebenen Farben.
export function leastUsedColor(usedColors: string[]): string {
	const counts = PLAYER_COLORS.map((color) => usedColors.filter((used) => used === color).length);
	const min = Math.min(...counts);
	const options = PLAYER_COLORS.filter((_, index) => counts[index] === min);
	return options[Math.floor(Math.random() * options.length)];
}
