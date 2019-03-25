import * as  Color from "color";

export function generateColor(letter?:string) {
    let color = Color({
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    })

    if (color.isDark()) {
        color = color.lighten(.8);
    }

    // console.log(color.toString())

    return color;
}

