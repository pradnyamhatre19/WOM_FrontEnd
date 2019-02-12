import { AbstractControl } from '@angular/forms';

export class PasswordValidators {
    password;

    static validOldPassword(control: AbstractControl) {
        return new Promise((resolve) => {
            var password = sessionStorage.getItem('password')
            if (control.value !== password)
                resolve({ invalidOldPassword: true });
            else
                resolve(null);
        });
    }

    static passwordsShouldMatch(control: AbstractControl) {
        let newPassword = control.get('newPassword');
        let confirmPassword = control.get('confirmPassword');

        if (newPassword.value !== confirmPassword.value)
            return { passwordsShouldMatch: true };
        
        return null;
    }
    
}