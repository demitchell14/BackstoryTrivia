const registerToGame = async function(data:RegistrationOptions) {
    //console.log(data);
    if (data.name.length > 0 && data.game.length > 0) {

        let call = await fetch("/api/v1/register/team", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(data),
        });

        if (call.status === 201) {
            let {team, game} = await call.json();
            return {game, team};
        } else {
            if (call.status === 409)
                return {error: [await call.text()]};
            else
                throw new Error("Unknown error");
        }
    } else {
        return {error: ["You must supply a team name."]};
    }
};

export interface RegistrationOptions {
    game:string;
    name:string
    members?:Array<string>;
}

export interface RegistrationResponse {
    game: {
        token:string;
    }
    team: {
        answers: Array<any>;
        key: string;
        members: Array<any>;
        name: string;
    }
    error?: Array<string>;
}


export const RegisterTeam = registerToGame;