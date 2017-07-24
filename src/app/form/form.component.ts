import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from "@angular/forms";
import 'rxjs/add/operator/debounceTime';

function emailMatcher(c: AbstractControl) {
    let emailControl = c.get('email');
    let confirmControl = c.get('confirmEmail');
    if (emailControl.pristine || confirmControl.pristine) {
        return null;
    }
    if (emailControl.value !== confirmControl.value) {
        return { 'match': true }
    }
    else { return null; }
}
function hasExclamationMark(input: AbstractControl) {
    if (input.pristine) {
        return null;
    }
    const hasExclamation = input.value.indexOf('!') >= 0;
    return hasExclamation ? null : { needsExclamation: true };
}
function ratingRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true }
        } else {
            return null;
        }
    }
}
@Component({
    templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

    registerFomr: FormGroup;
    somefrm: Registeration = new Registeration();
    emailMessage: string;
    
    get addresses() : FormArray {
        return <FormArray>this.registerFomr.get('addresses'); 
    }
    
    private validationMessages = {
        required: 'Please enter email address',
        pattern: 'Please enter valid email address'
    };
    save() {
        console.log(this.registerFomr);
        console.log("Saved " + JSON.stringify(this.registerFomr.value));
    }
    constructor(private fb: FormBuilder) {

    }
    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.registerFomr = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastname: [''],
            emailGroup: this.fb.group({
                email: ['', Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')],
                confirmEmail: ['', Validators.required],
            }, { validator: emailMatcher }),
            phone: [''],
            notificationMode: [''],
            rating: ['', hasExclamationMark],
            sendCatalog: true,
            addressType: 'home',
            addresses: this.fb.array([this.buildAddress()])
        })

        // this.registerFomr.valueChanges.subscribe(value =>
        //     console.log(JSON.stringify(value))
        // );
        this.registerFomr.get('notificationMode').valueChanges.subscribe(value =>
            this.setNotification(value)
        );
        // const emailControl = this.registerFomr.get("emailGroup.email");
        // emailControl.valueChanges.subscribe(value => this.setMessage(emailControl));

    }
    getTestData() {
        this.registerFomr.setValue({
            firstName: 'kaushik',
            lastname: 'lastname',
            email: 'thanki.kaushik@gmail.com',
            confirmEmail: 'thanki.kaushik@gmail.com',
            phone: '',
            notificationMode: '',
            sendCatalog: true
        });
    }
    setNotification(notifyvia: string): void {
        const phoneControl = this.registerFomr.get('phone');
        if (notifyvia === 'phone') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }
    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(key =>
                this.validationMessages[key]).join(' ');
        }
    }

    buildAddress(): FormGroup {
        return this.fb.group({
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        })
    }
    addAddress(): void {
        this.addresses.push(this.buildAddress());
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