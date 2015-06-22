import "es6-shim";
import "reflect-metadata";
import "zone.js";

import {NgFor, Component, View, bootstrap} from "angular2/angular2";
import {ShadowDomStrategy, NativeShadowDomStrategy} from "angular2/render";
import {Http, httpInjectables} from "angular2/http";
import {RouteConfig, RouterOutlet, RouterLink, Router, routerInjectables} from 'angular2/router';
import {bind} from "angular2/di";

const SERVER = "http://localhost:3000/";

@Component({
    properties:["name", "thumbnail", "price"],
    selector: "game-item",
    host: {'(click)': 'onClick($event)'},
})
@View({
    templateUrl: "templates/game-item.html"
})
class GameItem{
    name;
    thumbnail;
    price;
    id;

    onClick(event){
        console.log(event);
    }
}

@Component({
    appInjector:[httpInjectables],
    selector:"game-list"
})
@View({
    directives: [NgFor, GameItem, RouterLink],
    templateUrl: "templates/game-list.html"
})
class GameList{
    games = [];
    constructor(http:Http, public router:Router){
        console.log("using game list component")
        http.get(SERVER + "games")
            .map(res => res.json()
                .map(game =>{
                    game.thumbnail = SERVER + game.thumbnail;
                    game.image = SERVER + game.image;
                    return game;
                }))
            .subscribe(games => this.games = games);
    }

    onClick(){
        this.router.parent.navigate("/gamedetail");
        console.log(this.router);
    }
}

@Component({selector:"game-cart"})
@View({ template:`This is a game cart`})
class GameCart{}


@Component({selector:"gamedetail"})
@View({template:`<div>This is a gamedetail page</div>`})
class GameDetail{}

@RouteConfig([
  { path: '/', as: 'home', component: GameList },
  { path: '/cart', as: 'cart', component: GameCart }
])
@Component({
    appInjector: [routerInjectables],
    selector:"game-store"
})
@View({
    directives: [RouterOutlet, RouterLink],
    templateUrl: "templates/game-store.html"
})
class GameStore{
    constructor(router: Router){
        router.navigate("/home");
    }
}

bootstrap(GameStore, [bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy)]).then(
    success => console.log(success),
    error => console.log(error)
);