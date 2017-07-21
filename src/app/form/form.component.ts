import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";

function ratingRange(c: AbstractControl): { [key: string]: boolean } | null {
    if (c.value !== undefined && (isNaN(c.value || c.value < 1 || c.value > 5))) {
        return { 'range': true }
    };
    return null;
}
function hasExclamationMark(input: AbstractControl) {
  const hasExclamation = input.value.indexOf('!') >= 0;
  return hasExclamation ? null : { needsExclamation: true };
}
@Component({
    templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {
    registerFomr: FormGroup;
    somefrm: Registeration = new Registeration();
    save() {
        console.log(this.registerFomr);
        console.log("Saved " + JSON.stringify(this.registerFomr.value));
    }
    constructor(private fb:FormBuilder) {
        
    }
    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.registerFomr = this.fb.group({
            firstName: ['',[Validators.required,Validators.minLength(3)]],
            lastname: [''],
            email: [''],
            phone:[''],
            notificationMode:[''],
            rating:['',hasExclamationMark],
            sendCatalog: true
        })      
    }
    getTestData(){
        this.registerFomr.setValue({
            firstName: 'kaushik',
            lastname: 'lastname',
            email: 'thanki.kaushik@gmail.com',
            phone:'',
            notificationMode:'',
            sendCatalog: true
        });
    }
    setNotification(notifyvia:string):void{
        const phoneControl = this.registerFomr.get('phone');
        if (notifyvia ==='phone') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }

}

export class Registeration {
    constructor
        (
        public email = '',
        public password = '',
        public comment = '',
        public optionbox = ''
        ) { }
}