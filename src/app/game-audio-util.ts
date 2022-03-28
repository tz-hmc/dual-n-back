import { Howl } from 'howler';
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const audioSprites = new Howl({
    src: ['assets/A-Z_Vocalized.mp3'],
    sprite: {
        A: [0, 1000],
        B: [1000, 1000],
        C: [2000, 1000],
        D: [3500, 1000],
        E: [4500, 1000],
        F: [5800, 1000],
        G: [7000, 1000],
        H: [8500, 1000],
        I: [9500, 850],
        J: [11000, 1000],
        K: [12000, 1000],
        L: [14000, 850],
        M: [15000, 1000],
        N: [17000, 1000],
        O: [18000, 1000],
        P: [19000, 1000],
        Q: [20200, 1000],
        R: [21800, 1000],
        S: [23000, 850],
        T: [24200, 1000],
        U: [25400, 1000],
        V: [26500, 1000],
        W: [28000, 1000],
        X: [29400, 850],
        Y: [31000, 850],
        Z: [32000, 1000],
    }
})

export const playAllSounds = () => {
    for(let i = 0; i < letters.length; i += 1) {
        audioSprites.play(letters[i]);
        debugger;
    }
}