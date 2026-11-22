import { type Player } from '$lib/game.svelte';

type playerColor = {
color: string;
usedBy: number;
}
const playerColors:playerColor[] = [
    { color: '#FF0000', usedBy: 0 },
    { color: '#00FF00', usedBy: 0 },
    { color: '#0000FF', usedBy: 0 },
    { color: '#FFFF00', usedBy: 0 },
    { color: '#FF00FF', usedBy: 0 },
    { color: '#00FFFF', usedBy: 0 },
];

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