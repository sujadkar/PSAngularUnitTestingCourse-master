import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component"
import { HeroComponent } from "../hero/hero.component";

@Directive({
    selector:'[routerLink]',
    host: {'(click)' : 'onClick()'}
})

export class RouterLinkDirectiveStub{
    @Input('routerLink') linkParams : any;
    navigatedTo : any = null;

    onClick(){
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent (deep tests)',() => {
    let fixture:ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;


    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj(['getHeroes','addHero','deleteHero']);

        HEROES = [
            {id:1,name:'SpiderDude',strength: 8},
            {id:2,name:'Wonder Women',strength: 24},
            {id:3,name:'SuperDude',strength: 53},
        ];

        TestBed.configureTestingModule({
            declarations:[
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers:[
                { provide : HeroService,useValue:mockHeroService}
            ],
            //schemas:[NO_ERRORS_SCHEMA]
        })

        fixture = TestBed.createComponent(HeroesComponent);
    })

    it('should render each Hero as HeroComponent',() =>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnIt
        fixture.detectChanges();
        
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        
        expect(heroComponentDEs.length).toBe(3);

        for(let i=0;i < heroComponentDEs.length;i++)
        {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    })


    it(`should call heroService.deleteHero when the Hero Component's
    delete button is clicked`,() => {
        
        spyOn(fixture.componentInstance,'delete');

        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnIt
        fixture.detectChanges();
       
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // heroComponents[0].query(By.css('button'))
        //     .triggerEventHandler('click',{stopPropagation: () => {}});

        //(<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

        heroComponents[0].triggerEventHandler('delete',null);

       expect(fixture.componentInstance.delete).toHaveBeenCalledOnceWith(HEROES[0]);     
    })


    it('should add a new hero to the hero list when the add button is clicked',() => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnIt
        fixture.detectChanges();
        const name = "Mr. Ice";

        mockHeroService.addHero.and.returnValue(of({id: 5,name:name,strength: 4}));

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;

        addButton.triggerEventHandler('click',null);
        fixture.detectChanges();
        
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;

        expect(heroText).toContain(name);
    })


    it('should have the correct route for the first here',() => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        //run ngOnIt
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0]
        .query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);

        heroComponents[0].query(By.css('a')).triggerEventHandler('click',null);
        
        expect(routerLink.navigatedTo).toBe('/detail/1');
    })
})