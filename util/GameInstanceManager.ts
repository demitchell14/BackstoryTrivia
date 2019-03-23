import {Game} from "../notrivia";
import {Database, GameObject} from "./db/DatabaseHandler";
import {ObjectID} from "bson";
import {getGame} from "../api/v2";
import {undefinedVarMessage} from "graphql/validation/rules/NoUndefinedVariables";

let manager:InstanceManager;
class GameInstance {
    //game:Promise<Game|undefined>;
    game: ObjectID;
    constructor(game) {
        this.game = game
    }


    instance(raw?:boolean) {
        if (manager)
            return manager.findGame(this.game, raw);
        return new Promise((resolve) => resolve());
    }

    save() {
        if (manager) {
            // manager.saveGame(this.game);
        }
    }
}

class InstanceManager {
    private games:Array<{
        game: Game;
        raw: GameObject;
    }>;
    readonly db:Database;
    // games:Game[];
    // raw:GameObject[];
    constructor(props?) {
        this.games = [];
        this.db = new Database({timeout: false});
    }

    async findGame(search:ObjectID|string|any, raw?:boolean) {
        if (typeof search === "string") {
            if (ObjectID.isValid(search))
                search = ObjectID.createFromHexString(search);
        }
        let cached;
        if (typeof search === "string")
            cached = this.games.find(game => search === game.raw.token);
        else
            cached = this.games.find(game => search.equals(game.raw._id));

        if (cached) {
            console.debug(`Game ${cached.raw._id} is cached`)
            if (cached.game)
                return raw ? cached.raw : cached.game;
            else {
                cached.game = new Game(cached.raw);
                return raw ? cached.raw : cached.game;
            }
        }
        console.log((await this.db.client).isConnected())
        // If we get here, game is not cached, so we need to look it up in the database to add to cache
        const game = await getGame(this.db, typeof search === "string" ? search : search.toHexString())
            .catch(err => console.error(err));
        // this.db.close();
        if (game) {
            const idx = this.games.push({
                game: new Game(game),
                raw: game
            })
            console.debug(`Game ${game._id} was loaded into cache`);
            return raw ? this.games[idx-1].raw : this.games[idx-1].game;
        }

        console.error(`Game ${typeof search === "string" ? search : search.toHexString()} could not be found`)
        return undefined;
    }

}



export default {
    init: function() {
        // INIT
        if (typeof manager === "undefined") {
            manager = new InstanceManager();
        }
    },
    getInstance: game => new GameInstance(game)
}