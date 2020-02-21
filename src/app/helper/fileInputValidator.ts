import { Directive } from "@angular/core";
import { NG_VALIDATORS, Validator, FormControl } from "@angular/forms";

@Directive({
  selector: "[requireFile]",
  providers: [
    { provide: NG_VALIDATORS, useExisting: FileValidator, multi: true },
  ]
})
export class FileValidator implements Validator {
  static validate(c: FormControl): { [key: string]: any } {
    console.log('c: ', c);
    // return c.value == null || c.value.length == 0 ? { "required" : true} : null;
    if (c.value == null || c.value.length == 0) {
      return { "required": true };
    }
    else {
      return null;
    }
  }

  validate(c: FormControl): { [key: string]: any } {
    return FileValidator.validate(c);
  }
}