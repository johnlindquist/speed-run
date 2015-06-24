import "es6-shim";
import "reflect-metadata";
import "zone.js";

import {NgFor, Component, View, bootstrap} from "angular2/angular2";
import {ShadowDomStrategy, NativeShadowDomStrategy} from "angular2/render";
import {Http, httpInjectables} from "angular2/http";
import {RouteConfig, RouterOutlet, RouterLink, Router, routerInjectables} from 'angular2/router';
import {bind, Injectable} from "angular2/di";

const SERVER = "http://localhost:3000/games";

class CartService{
    games = [];
    total =()=> this.games
                    .map(game => game.price)
                    .reduce((a, b)=> a + b, 0);
}

@Component({selector:"game-cart"})
@View({
    templateUrl:"templates/game-cart.html",
    directives: [NgFor]
})
class GameCart{
    constructor(public cartService:CartService){}
}



@Component({
    selector:"game-item",
    properties: ["name", "thumbnail", "price"]

})
@View({templateUrl:"templates/game-item.html"})
class GameItem{
    name: string;
    thumbnail: string;
    price: number;
    id: number;
    color = () => this.price > 40 ? "red" : "white";
}


@Component({
    appInjector: [httpInjectables],
    selector:"game-list"
})
@View({
    directives: [NgFor, GameItem],
    templateUrl:"templates/game-list.html"
})
class GameList{
    games = [];
    constructor(http:Http, public cartService:CartService){
        http.get(SERVER)
            .map(response => response.json())
            .subscribe(games => this.games = games);
        console.log(this.cartService);
    }

    onGameClick(game){
        this.cartService.games.push(game);
    }
}


@RouteConfig([
    {path:"/", as:"home", component:GameList},
    {path:"/cart", as:"cart", component:GameCart},
])
@Component({
    appInjector:[routerInjectables],
    selector:"game-store"
})
@View({
    directives: [RouterOutlet, RouterLink],
    templateUrl:`templates/game-store.html`
})
class GameStore{}

bootstrap(GameStore, [
    bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy),
    CartService
    ]).then(
    success => console.log(success),
    error => console.log(error)
);
