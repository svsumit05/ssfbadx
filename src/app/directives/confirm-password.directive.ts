import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[appConfirmPassword]'
})
export class ConfirmPasswordDirective {

    constructor(private el: ElementRef) {}

    @Input('appConfirmPassword') myPasswordString: string;
    @Input() myNewPassword: string;

    @HostListener('blur') onBlur() {
        this.isMatch(this.myNewPassword, this.myPasswordString);
    }

    private isMatch(newpassword: string, password: string) {
        if (newpassword == password) {

        } else {
            alert('confirm password and password do not match');
        }
    }


}

}
