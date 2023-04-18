import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";

describe('HeroesComponent',()=>{
    let cmp : HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            {id:1,name:'SpiderDude',strength: 8},
            {id:2,name:'Wonder Women',strength: 24},
            {id:3,name:'SuperDude',strength: 53},
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes','addHeror','deleteHero']);

        cmp = new HeroesComponent(mockHeroService);
    });

    describe('delete',() => {
        it('should remove the indicated hero from heroes list',()=>{
            mockHeroService.deleteHero.and.returnValue(of(true));
            cmp.heroes = HEROES;

            cmp.delete(HEROES[2]);

            expect(cmp.heroes.length).toBe(2);
        })
        
        it('should call deleteHero',() => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            cmp.heroes = HEROES;

            cmp.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        })
    });
})