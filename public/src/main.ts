import "es6-shim";
import "reflect-metadata";
import "zone.js";

import {NgFor, Component, View, bootstrap} from "angular2/angular2";
import {ShadowDomStrategy, NativeShadowDomStrategy} from "angular2/render";
import {Http, httpInjectables} from "angular2/http";
import {RouteConfig, RouterOutlet, RouterLink, Router, routerInjectables} from 'angular2/router';
import {bind, Injectable} from "angular2/di";

const SERVER = "http://localhost:3000/games";

class CartService {
    games = [];
    //add all the game prices together for the total
    total = ()=> this.games
                     .map(game => game.price)
                     .reduce((a, b) => a + b);
}

@Component({ selector: "game-cart" })
@View({
    directives: [NgFor],
    templateUrl: "templates/game-cart.html"
})
class GameCart {
    constructor(public cartService: CartService) {
        console.log(cartService);
    }
}



@Component({
    properties:["name", "thumbnail", "price", "id"],
    selector: "game-item",
})
@View({
    templateUrl: "templates/game-item.html"
})
class GameItem{
    name;
    thumbnail;
    price;
    id;

    getColor = () => this.price > 40 ? "red" : "white";
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
    constructor(http:Http, public cartService:CartService){
        console.log("using game list component")
        http.get(SERVER)
            .map(res => res.json())
            .subscribe(games => this.games = games);
    }

    onGameClick(game){
        this.cartService.games.push(game);
    }
}



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
class GameStore{}

bootstrap(GameStore, [
    bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy),
    CartService
    ])
    .then(
        success => console.log(success),
        error => console.log(error)
    );