import "es6-shim";
import "reflect-metadata";
import "zone.js";

import {NgFor, Component, View, bootstrap} from "angular2/angular2";
import {ShadowDomStrategy, NativeShadowDomStrategy} from "angular2/render";
import {Http, httpInjectables} from "angular2/http";
import {RouteConfig, RouterOutlet, RouterLink, Router, routerInjectables} from 'angular2/router';
import {bind} from "angular2/di";
import {BrowserLocation} from 'angular2/src/router/browser_location';

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
    appInjector:[httpInjectables, routerInjectables],
    selector:"game-list"
})
@View({
    directives: [NgFor, GameItem, RouterLink],
    templateUrl: "templates/game-list.html"
})
class GameList{
    games = [];
    constructor(http:Http){
        console.log("using game list component")
        http.get("/games")
            .map(res => res.json())
            .subscribe(games => this.games = games);
    }
}


@Component({selector:"game-detail"})
@View({template:"Game Detail"})
class GameDetail{}



@RouteConfig([
  { path: '/',          as: 'home',      component: GameList },
  { path: '/#gamedetail', as: 'gd', component: GameDetail }
])
@Component({
    appInjector: [routerInjectables],
    selector:"game-store"
})
@View({
    directives: [RouterOutlet]
    templateUrl: "templates/game-store.html"
})
class GameStore{
    constructor(router: Router){

    }
}

bootstrap(GameStore, [bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy)]).then(
    success => console.log(success),
    error => console.log(error)
);