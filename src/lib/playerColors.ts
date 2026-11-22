import { type Player } from '$lib/game.svelte';
import { PLAYER_COLORS } from '../../shared/player-colors';

type playerColor = {
color: string;
usedBy: number;
}
const playerColors: playerColor[] = PLAYER_COLORS.map((color) => ({ color, usedBy: 0 }));

function assignRandomColor(player: Player): string {
const minUsedBy = Math.min(...playerColors.map(p => p.usedBy));

const availableColors = playerColors.filter(p => p.usedBy === minUsedBy);

const randomColor = availableColors[
    Math.floor(Math.random() * availableColors.length)
];
player.color = randomColor.color;
    randomColor.usedBy++;
    return randomColor.color;

}
function pickColor(player: Player, color: string): boolean {
    const colorObj = playerColors.find(c => c.color === color);
    const previousColor = player.color;
    if (colorObj) {
        colorObj.usedBy++;
        player.color = color;
        if(previousColor) {
            const previousColorObj = playerColors.find(c => c.color === previousColor);
            if (previousColorObj) {
                previousColorObj.usedBy--;
            }
        }
        return true;
    }
    return false;
}

export { assignRandomColor, pickColor };

// #TODO: Convert player to class and add Color logic there